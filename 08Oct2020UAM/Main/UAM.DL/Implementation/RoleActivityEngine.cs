using System;
using System.Data;

// ReSharper disable once CheckNamespace  Maintaining the common namespace for all the classes under UAM.DL directory
namespace UAM.DL
{
    public class RoleActivityEngine
    {
        readonly Databaseconfiguration _dbConfig = new Databaseconfiguration();
        public DataTable GetRoleActivityRights(int roleId)
        {
            try
            {
                DataTable dTable = _dbConfig.FetchRecord("SELECT * FROM RoleActivityXref WHERE roleId = " + roleId);
                if (dTable.Rows.Count <= 0)
                    dTable = null;

                return dTable;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public DataTable GetUserActivityRights(int userId)
        {
            DataTable dTable;
            try
            {
                dTable = _dbConfig.FetchRecord("SELECT ra.* FROM RoleActivityXref ra INNER JOIN User usr ON ra.RoleId=usr.RoleId" +
                                                        " WHERE usr.UserId = " + userId);
                if (dTable.Rows.Count <= 0)
                    dTable = null;

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            
            return dTable;
        }

        public DataTable GetRole()
        {
            try
            {
                DataTable dTable = _dbConfig.FetchRecord("SELECT * FROM Role");
                if (dTable.Rows.Count <= 0)
                    dTable = null;

                return dTable;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
    }
}