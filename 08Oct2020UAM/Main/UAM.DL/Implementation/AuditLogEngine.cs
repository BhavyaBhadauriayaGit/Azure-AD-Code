using System;
using System.Data;

// ReSharper disable once CheckNamespace : Maintaining the common namespace for all the classes under UAM.DL directory
namespace UAM.DL
{
    public class AuditLogEngine
    {
        private readonly Databaseconfiguration _dbConfig = new Databaseconfiguration();
        public void AddUserLogs(string paramValues)
        {
            try
            {
                _dbConfig.InsertRecord(
                    "insert into AuditLog(EventName,LogTypeId,UserEmailId,CreatedBy,CreatedDate) " +
                    "values(" + paramValues + ")");
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public DataTable GetUserLogs()
        {
            try
            {
                DataTable dTable = _dbConfig.FetchRecord("SELECT * FROM AuditLog");
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