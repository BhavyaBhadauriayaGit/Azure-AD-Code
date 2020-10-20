using System;
using System.Data;


// ReSharper disable once CheckNamespace - Maintaining the common namespace for all the classes under UAM.DL directory

namespace UAM.DL
{
    public class UserEngine
    {
        private readonly Databaseconfiguration _dbConfig = new Databaseconfiguration();
        public void AddUser(string paramValues)
        {
            try
            {
                _dbConfig.InsertRecord(
                    "insert into User(Name,Password,Email,IsDefaultUser,IsLocked,LoginCounter,PasswordExpirationDate,RoleId,CreatedBy,CreatedDate,UpdatedBy,UpdatedDate) " +
                    "values(" + paramValues + ")");
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public DataTable GetUser()
        {
            try
            {
                DataTable dTable = _dbConfig.FetchRecord("SELECT * FROM User");
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

        public DataTable GetNoOfLoggedInUser()
        {
            try
            {
                DataTable dTable = _dbConfig.FetchRecord("SELECT Count(*) FROM User WHERE IsLoggedIn = 1");
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

        public DataTable GetUserByEmailId(string emailId)
        {
            try
            {
                DataTable dTable = _dbConfig.FetchRecord("SELECT * FROM User WHERE Email = '" + emailId + "'");
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

        //public DataTable GetUserByEmailIdAndPassword(string emailId,string password)
        //{
        //    try
        //    {
        //        DataTable dTable = dbConfig.FetchRecord("SELECT * FROM User WHERE Email = '" + emailId + "' and Password = '" + password + "'");
        //        if (dTable.Rows.Count <= 0)
        //        {
        //            dTable = null;
        //        }

        //        return dTable;
        //    }
        //    catch (Exception e)
        //    {
        //        Console.WriteLine(e);
        //        throw;
        //    }

        //}

        public void UpdateUser(string paramValues, string emailId)
        {
            try
            {
                _dbConfig.UpdateRecord(paramValues, "User", "Email = '" + emailId + "'");
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
                _dbConfig.DeleteRecord("User","Email = '" + emailId + "'");
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
    }
}