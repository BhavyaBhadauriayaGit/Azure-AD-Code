using System;
using System.Data;


// ReSharper disable once CheckNamespace  Maintaining the common namespace for all the classes under UAM.DL directory
namespace UAM.DL
{
    public class UserPasswordArchiveEngine
    {
        private readonly Databaseconfiguration _dbConfig = new Databaseconfiguration();
        public void AddUserPassword(string paramValues)
        {
            try
            {
                _dbConfig.InsertRecord(
                    "INSERT INTO UserPasswordHistory(UserId, Password, LastUsed, CreatedDate, CreatedBy) VALUES (" +
                    paramValues + ")");
                
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public DataTable GetUserPasswords(int userId)
        {
            try
            {
                DataTable dTable = _dbConfig.FetchRecord("SELECT * FROM UserPasswordHistory WHERE UserId = " + userId + " order by CreatedDate Desc Limit 3");
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