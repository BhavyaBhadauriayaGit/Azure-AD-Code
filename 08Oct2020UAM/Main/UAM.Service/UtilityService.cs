using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using UAM.BO;

namespace UAM.Service
{
    public class UtilityService
    {
        /// <summary>
        /// To Convert the datatable Rows into a List of UserBo. Used by GetUser and GetUsers
        /// </summary>
        /// <param name="dTable"></param>
        /// <param name="isPasswordNeeded"></param>
        /// <returns></returns>
        public List<UserBo> ConvertDataRowsToUserBo(DataTable dTable, bool isPasswordNeeded = false)
        {
            List<UserBo> lstUserBo = new List<UserBo>();
            try
            {
                int index = 0;
                foreach (DataRow row in dTable.Rows)
                {
                    UserBo uBo = new UserBo
                    {
                        UserId = Convert.ToInt32(row["UserId"]),
                        Name = row["Name"].ToString(),
                        Password = (isPasswordNeeded) ? dTable.Rows[index]["Password"].ToString() : null,
                        Email = row["Email"].ToString(),
                        IsDefaultUser = Convert.ToBoolean(row["IsDefaultUser"]),
                        IsLocked = Convert.ToBoolean(row["IsLocked"]),
                        LoginCounter = Convert.ToInt32(row["LoginCounter"]),
                        PasswordExpirationDate = Convert.ToDateTime(row["PasswordExpirationDate"]),
                        IsPasswordExpired = (Convert.ToDateTime(row["PasswordExpirationDate"]) <= DateTime.Now),
                        ToNotifyOnPasswordExpiration =
                            (DateTime.Now > Convert.ToDateTime(row["PasswordExpirationDate"]).AddDays(-15)),
                        RoleId = Convert.ToInt32(row["RoleId"]),
                        RoleName = (Convert.ToInt32(row["RoleId"]) == 1) ? "Super User" :
                            (Convert.ToInt32(row["RoleId"]) == 2) ? "Customer User" : "Invalid User",
                        CreatedBy = row["CreatedBy"].ToString(),
                        CreatedDate = Convert.ToDateTime(row["CreatedDate"]),
                        UpdatedBy = row["UpdatedBy"].ToString(),
                        UpdatedDate = Convert.ToDateTime(row["UpdatedDate"]),
                        IsLoggedInUser = Convert.ToBoolean(row["IsLoggedIn"])
                    };
                    lstUserBo.Add(uBo);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

            return lstUserBo;
        }


        public string ConvertUserBoToString(UserBo userBo)
        {
            StringBuilder paramValues = new StringBuilder();
            try
            {
                paramValues.Append("'" + userBo.Name + "',");
                ShaSaltService shaSaltSvc = new ShaSaltService();
                string[] shaHashResult = shaSaltSvc.Sha256PasswordSaltHash(userBo.Password);
                paramValues.Append("'" + shaHashResult[1] + "',");
                paramValues.Append("'" + userBo.Email + "',");
                paramValues.Append(userBo.IsDefaultUser ? 1 : 0);
                
                //IsLocked
                paramValues.Append("," + 0 + ",");

                //Login Counter
                paramValues.Append(0 + ",");

                //PasswordExpirationDate
                paramValues.Append("'" + DateTime.Now.AddDays(180) + "'");
                paramValues.Append("," + userBo.RoleId + ",");
                paramValues.Append("'" + userBo.CreatedBy + "',");
                paramValues.Append("'" + DateTime.Now);
                paramValues.Append("','" + userBo.CreatedBy + "',");
                paramValues.Append("'" + DateTime.Now + "'");
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

            return paramValues.ToString();
        }

        public string ConvertUserBoToUpdateString(UserBo newuserBo, UserBo existingUserBo)
        {
            StringBuilder paramValues = new StringBuilder();
            //ShaSaltService shaSaltSvc = new ShaSaltService();
            
            try
            {
                if (!string.IsNullOrEmpty(newuserBo.Name) && !newuserBo.Name.Equals(existingUserBo.Name))
                    paramValues.Append("Name ='" + newuserBo.Name + "',");

                if (!string.IsNullOrEmpty(newuserBo.Email) && !newuserBo.Email.Equals(existingUserBo.Email))
                    paramValues.Append("Email ='" + newuserBo.Email + "',");

                if (!string.IsNullOrEmpty(newuserBo.Password) && !newuserBo.Password.Equals(existingUserBo.Password))
                {
                    //string[] shaHashResult = shaSaltSvc.Sha256PasswordSaltHash(newuserBo.Password);
                    paramValues.Append("Password ='" + newuserBo.Password + "',");
                    paramValues.Append("IsDefaultUser = 0,");
                    paramValues.Append("PasswordExpirationDate = '" + DateTime.Now.AddDays(180) +
                                       "',");
                }

                if (!string.IsNullOrEmpty(newuserBo.UpdatedBy) &&
                    !newuserBo.UpdatedBy.Equals(existingUserBo.UpdatedBy) && paramValues.Length > 0)
                    paramValues.Append("UpdatedBy = '" + newuserBo.UpdatedBy + "',");

                if (!newuserBo.IsLoggedInUser.Equals(existingUserBo.IsLoggedInUser))
                    paramValues.Append("IsLoggedIn ='" + (newuserBo.IsLoggedInUser? 1:0) + "',");

                if (paramValues.Length > 0)
                    paramValues.Append("UpdatedDate = '" + DateTime.Now + "'");

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

            return paramValues.ToString().Replace(",,", ",").Trim(',');
        }

        public string ConvertAuditLogBoToString(AuditLogBo aLogBo)
        {
            StringBuilder paramValues = new StringBuilder();
            try
            {
                paramValues.Append("'" + aLogBo.EventName + "',");
                paramValues.Append(aLogBo.LogTypeId + ",");
                paramValues.Append("'" + aLogBo.UserEmailId + "',");
                paramValues.Append("'" + aLogBo.CreatedBy + "',");
                paramValues.Append("'" + aLogBo.CreatedDate + "'");

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

            return paramValues.ToString();
        }

        public List<AuditLogBo> ConvertDataRowsToAuditLogBo(DataTable dTable)
        {
            List<AuditLogBo> lstAuditBo = new List<AuditLogBo>();
            try
            {
                foreach (DataRow row in dTable.Rows)
                {
                    AuditLogBo uBo = new AuditLogBo
                    {
                        LogId = Convert.ToInt32(row["LogId"]),
                        EventName = row["EventName"].ToString(),
                        LogTypeId = Convert.ToInt32(row["LogTypeId"]),
                        UserEmailId = row["UserEmailId"].ToString(),
                        CreatedBy = row["CreatedBy"].ToString(),
                        CreatedDate = Convert.ToDateTime(row["CreatedDate"])
                    };
                    lstAuditBo.Add(uBo);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

            return lstAuditBo;
        }


        public List<RoleActivityBo> ConvertDataTableToRoleActivityBo(DataTable dTable)
        {
            List<RoleActivityBo> lstRoleActivityBo = new List<RoleActivityBo>();
            try
            {
                foreach (DataRow row in dTable.Rows)
                {
                    RoleActivityBo uBo = new RoleActivityBo
                    {
                        RoleId = Convert.ToInt32(row["RoleId"]),
                        ActivityRightId = Convert.ToInt32(row["ActivityRightId"]),
                        CreatedBy = row["CreatedBy"].ToString(),
                        CreatedDate = Convert.ToDateTime(row["CreatedDate"])
                    };
                    lstRoleActivityBo.Add(uBo);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

            return lstRoleActivityBo;
        }


        public List<UserPasswordHistoryBo> ConvertDataTableToUserPasswordHistoryBo(DataTable dTable)
        {
            List<UserPasswordHistoryBo> lstPasswordHistoryBo = new List<UserPasswordHistoryBo>();
            try
            {
                if (dTable != null && dTable.Rows.Count > 0)
                {
                    foreach (DataRow row in dTable.Rows)
                    {
                        UserPasswordHistoryBo uBo = new UserPasswordHistoryBo
                        {
                            UserId = Convert.ToInt32(row["UserId"]),
                            Password = row["Password"].ToString(),
                            CreatedBy = row["CreatedBy"].ToString(),
                            CreatedDate = Convert.ToDateTime(row["CreatedDate"]),
                            LastUsed = Convert.ToDateTime(row["LastUsed"])
                        };
                        lstPasswordHistoryBo.Add(uBo);
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

            return lstPasswordHistoryBo;
        }

        public List<RoleBo> ConvertDataTableToRoleBo(DataTable dTable)
        {
            List<RoleBo> lstRoleBo = new List<RoleBo>();
            try
            {
                foreach (DataRow row in dTable.Rows)
                {
                    RoleBo roleBo = new RoleBo()
                    {
                        RoleId = Convert.ToInt32(row["RoleId"]),
                        RoleName = row["RoleName"].ToString(),
                        CreatedBy = row["CreatedBy"].ToString(),
                        CreatedDate = Convert.ToDateTime(row["CreatedDate"])
                    };
                    lstRoleBo.Add(roleBo);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

            return lstRoleBo;
        }

        public string ConvertUserBoToPasswordHistoryBoString(UserBo userBo)
        {

            //UserId, Password, LastUsed, CreatedDate, CreatedBy
            StringBuilder paramValues = new StringBuilder();
            try
            {
                paramValues.Append("'" + userBo.UserId + "',");
                paramValues.Append("'" + userBo.Password + "',");
                paramValues.Append("'" + DateTime.Now + "',");
                paramValues.Append("'" + userBo.CreatedDate + "',");
                paramValues.Append("'" + userBo.CreatedBy + "'");
                
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

            return paramValues.ToString();
        }

    }
}