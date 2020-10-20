using System;
using UAM.BO;

namespace UAM.Service
{
    public class UserAuthenticationService
    {
       public UserBo LoginValidation(string userEmail, string password)
        {
            UserBo userBo;
            try
            {
                //UtilityEngine util = new UtilityEngine();
                UserService userSvc = new UserService();
                userBo = userSvc.GetUserByEmailIdAndPassword(userEmail, password);
                if (userBo != null)
                {
                    userSvc.UpdateLoggedInFlag(userEmail);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            return userBo;
        }


    }
}