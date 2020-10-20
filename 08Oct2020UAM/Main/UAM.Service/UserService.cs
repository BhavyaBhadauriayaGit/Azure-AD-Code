using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using UAM.BO;
using UAM.DL;

namespace UAM.Service
{
    public class UserService
    {
        private readonly UtilityService _utilService = new UtilityService();



        public Enums.ApiResponseMessage AddUser(UserBo userBo)
        {
            try
            {
                UserEngine userEngine = new UserEngine();

                //To check the user already exists
                UserBo isExistingUser = GetUserByEmailId(userBo.Email);
                if (isExistingUser != null)
                {
                    return Enums.ApiResponseMessage.DuplicateEmail;
                }

                string paramValues = _utilService.ConvertUserBoToString(userBo);
                userEngine.AddUser(paramValues);

                UserPasswordArchiveService userPasswordArchiveService = new UserPasswordArchiveService();
                UserBo userCurrentBo = GetUserByEmailId(userBo.Email, true);

                string paramPasswordHistoryValues = _utilService.ConvertUserBoToPasswordHistoryBoString(userCurrentBo);
                //"1,'test1','6/26/2017 12:00:00 AM','6/26/2017 12:00:00 AM','5'"

                //To hold the password history
                userPasswordArchiveService.AddUserPassword(paramPasswordHistoryValues);
                return Enums.ApiResponseMessage.UserCreated;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public int GetNoOfLoggedInUsers()
        {
            UserEngine userEngine = new UserEngine();
            DataTable dTable = userEngine.GetNoOfLoggedInUser();
            return Convert.ToInt32(dTable.Rows[0][0]);
        }

        public UserBo GetUserByEmailId(string emailId, bool isPasswordNeeded = false)
        {
            try
            {
                UserBo userBo = null;
                UserEngine userEngine = new UserEngine();
                DataTable dTable = userEngine.GetUserByEmailId(emailId);

                if (dTable != null && dTable.Rows.Count > 0)
                    userBo = _utilService.ConvertDataRowsToUserBo(dTable, isPasswordNeeded).SingleOrDefault();

                return userBo;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }

        public UserBo GetUserByEmailIdAndPassword(string emailId, string password)
        {
            try
            {
                UserEngine userEngine = new UserEngine();
                UserBo userInfoBo = GetUserByEmailId(emailId, true);

                ShaSaltService shaSaltService = new ShaSaltService();

                bool isAuthenticated = false;

                if (userInfoBo != null)
                    // ReSharper disable once ConstantConditionalAccessQualifier As the userInfoBo can get the Null in it the conditionaccessqualifier is required
                    isAuthenticated = shaSaltService.Sha256VerifyPassword(userInfoBo?.Password, password);

                if (isAuthenticated)
                {

                    //userBo = (UserBO)utilService.ConvertDataRowsToUserBo(dTable).SingleOrDefault();
                    // ReSharper disable once ConstantConditionalAccessQualifier As the userInfoBo can get the Null in it the conditionaccessqualifier is required
                    if (userInfoBo?.IsLocked == true && userInfoBo.UpdatedDate < DateTime.Now.AddHours(-GetLockHours()))
                    {
                        userEngine.UpdateUser("IsLocked = 0, LoginCounter = 0, UpdatedDate='" + DateTime.Now + "'",
                            emailId);
                        userInfoBo.IsLocked = false;
                        userInfoBo.LoginCounter = 0;
                    }

                    // ReSharper disable once ConstantConditionalAccessQualifier As the userInfoBo can get the Null in it the conditionaccessqualifier is required
                    if (userInfoBo?.IsLocked == false && userInfoBo.LoginCounter > 0 && userInfoBo.LoginCounter < 3)
                    {
                        userEngine.UpdateUser("LoginCounter = 0, UpdatedDate='" + DateTime.Now + "'",
                            emailId);
                        userInfoBo.LoginCounter = 0;
                    }



                    userInfoBo.Password = null;
                }
                else
                {
                    var updateUserBo = userInfoBo;
                    if (updateUserBo != null)
                    {
                        int loginCounter = updateUserBo.LoginCounter + 1;
                        if (loginCounter == 3 && updateUserBo.IsLocked == false)
                        {
                            userEngine.UpdateUser("LoginCounter = " + loginCounter + ", IsLocked = " + 1 + ", UpdatedDate='" + DateTime.Now + "'", emailId);
                        }
                        else
                        {
                            userEngine.UpdateUser(
                                "LoginCounter = " + loginCounter + ", UpdatedDate='" + DateTime.Now + "'", emailId);
                        }
                    }

                    userInfoBo = null;

                }

                return userInfoBo;

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public void UpdateLoggedInFlag(string emailId)
        {
            UserEngine userEngine = new UserEngine();
            userEngine.UpdateUser("IsLoggedIn = 1, UpdatedDate='" + DateTime.Now + "'",
                emailId);
        }

        public Enums.ApiResponseMessage UpdateUser(UserBo userBo, string emailId)
        {
            try
            {
                UserPasswordArchiveService userPwArchiveSvc = new UserPasswordArchiveService();
                UserEngine userEngine = new UserEngine();
                UserBo existingUserBo = GetUserByEmailId(emailId, true);
                bool isPwValidated = false;
                ShaSaltService shaSaltService = new ShaSaltService();
                bool isPasswordInParam = userBo.Password != null;
                bool isSamePassword = true;
                if (!string.IsNullOrEmpty(userBo.Password))
                {
                    isSamePassword = shaSaltService.Sha256VerifyPassword(existingUserBo.Password, userBo.Password);
                    if (!isSamePassword)
                    {
                        isPwValidated = userPwArchiveSvc.ValidatePasswordHistory(existingUserBo.UserId, userBo.Password);
                        if (!isPwValidated)
                            return Enums.ApiResponseMessage.AvailableInLastThreePasswords;
                    }
                    else   // Included to solve the issue #tfs - 36914
                    {
                        return Enums.ApiResponseMessage.AvailableInLastThreePasswords; 
                    }
                }

                if (isSamePassword)
                    userBo.Password = existingUserBo.Password;
                else
                {
                    ShaSaltService shaSaltSvc = new ShaSaltService();
                    string[] shaHashResult = shaSaltSvc.Sha256PasswordSaltHash(userBo.Password);
                    userBo.Password = shaHashResult[1];
                }

                string updateParamValues = _utilService.ConvertUserBoToUpdateString(userBo, existingUserBo);

                if (updateParamValues.Length > 0)
                {
                    userEngine.UpdateUser(updateParamValues, emailId);
                    //To store the password history
                    if (isPwValidated)
                    {
                        UserPasswordArchiveService userPasswordArchiveService = new UserPasswordArchiveService();
                        userBo.UserId = existingUserBo.UserId;
                        userBo.CreatedDate = DateTime.Now;
                        //Password is not updating the hashed value. Have to get the value which I have implemented in ConvertUserBoToUpdateString
                        string paramPasswordHistoryValues = _utilService.ConvertUserBoToPasswordHistoryBoString(userBo);
                        userPasswordArchiveService.AddUserPassword(paramPasswordHistoryValues);
                    }

                    return Enums.ApiResponseMessage.UserUpdated;
                }
                else
                {
                    if (userBo.Password != null && isSamePassword && isPasswordInParam)
                        return Enums.ApiResponseMessage.AvailableInLastThreePasswords;

                    return Enums.ApiResponseMessage.NoUserDataUpdated;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public void DeleteUser(string emailId)
        {
            try
            {
                UserEngine userEngine = new UserEngine();
                userEngine.DeleteUser(emailId);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public List<UserBo> GetUsers()
        {
            try
            {
                List<UserBo> lstUserBo = new List<UserBo>();
                UserEngine userEngine = new UserEngine();
                DataTable dTable = userEngine.GetUser();

                if (dTable != null && dTable.Rows.Count > 0)
                {
                    lstUserBo = _utilService.ConvertDataRowsToUserBo(dTable);
                }

                return lstUserBo;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }


        public Enums.ApiResponseMessage UpdateUtilityConfig(int keyId, int value)
        {

            try
            {
                UtilityEngine utilEngine = new UtilityEngine();
                bool isUpdated = utilEngine.UpdateUtilityConfig("Value = " + value, keyId);
                if (isUpdated)
                {
                    return Enums.ApiResponseMessage.Success;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }

            return Enums.ApiResponseMessage.Failed;
        }

        public int GetLockHours()
        {
            try
            {
                UtilityEngine utilEngine = new UtilityEngine();
                return utilEngine.GetLockHours();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

    }
}


