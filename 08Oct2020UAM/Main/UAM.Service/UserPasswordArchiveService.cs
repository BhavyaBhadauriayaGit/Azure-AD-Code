using System;
using System.Collections.Generic;
using System.Data;
using UAM.BO;
using UAM.DL;

namespace UAM.Service
{
    public class UserPasswordArchiveService
    {
        private readonly UserPasswordArchiveEngine _userPasswordArchiveEngine = new UserPasswordArchiveEngine();
        public void AddUserPassword(string paramValue)
        {
            try
            {
                _userPasswordArchiveEngine.AddUserPassword(paramValue);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            
        }

        public List<UserPasswordHistoryBo> GetUserPasswords(int userId)
        {
            List<UserPasswordHistoryBo> lstUserPasswordHistoryBo;
            try
            {
                
                DataTable dTUserPasswords= _userPasswordArchiveEngine.GetUserPasswords(userId);
                UtilityService utilService = new UtilityService();
                lstUserPasswordHistoryBo = utilService.ConvertDataTableToUserPasswordHistoryBo(dTUserPasswords);
                
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            return lstUserPasswordHistoryBo;
        }

        public bool ValidatePasswordHistory(int userId, string password)
        {
            try
            {
                ShaSaltService shaSaltSvc = new ShaSaltService();
                List<UserPasswordHistoryBo> lstPasswordBo = GetUserPasswords(userId);
                foreach (UserPasswordHistoryBo passwordBo in lstPasswordBo)
                {
                    if (shaSaltSvc.Sha256VerifyPassword(passwordBo.Password, password))
                        return false;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            return true;
        }
    }
}