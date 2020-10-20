using System;
using System.Data;



// ReSharper disable once CheckNamespace  Maintaining the common namespace for all the classes under UAM.DL directory

namespace UAM.DL
{
    public class UtilityEngine
    {
        //public DataTable LoginValidation(string userEmail, string password)
        //{
        //    Databaseconfiguration dc = new Databaseconfiguration();
        //    DataTable dTable = dc.FetchRecord("SELECT RoleId FROM User WHERE Email='" + userEmail + "' AND Password='" +
        //                                  password + "'");
        //    return dTable;
        //}

        public bool UpdateUtilityConfig(string paramValues, int keyId)
        {
            bool isUpdated = false;
            try
            {
                Databaseconfiguration dbConfig = new Databaseconfiguration();
                int result = dbConfig.UpdateRecord(paramValues, "UtilityConfig", "KeyID = "+keyId);
                if (result == 1)
                {
                    isUpdated = true;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                
            }

            return isUpdated;
        }


        public int GetLockHours()
        {
            try
            {
                Databaseconfiguration dbConfig = new Databaseconfiguration();
                DataTable dTable = dbConfig.FetchRecord("Select Value from UtilityConfig where KeyID = 1");
                return Convert.ToInt32(dTable.Rows[0][0]);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
    }
}
