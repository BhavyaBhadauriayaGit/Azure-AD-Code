using System;
using System.Data.SQLite;
using System.Data;
using System.Configuration;
using System.Text;
using System.Security.Cryptography;

// ReSharper disable once CheckNamespace  Maintaining the common namespace for all the classes under UAM.DL directory

namespace UAM.DL
{
    public class Databaseconfiguration
    {
        #region  Objects

        readonly SQLiteConnection _sqliteConn;
        SQLiteCommand _sqliteCmd;
        SQLiteDataAdapter _sqliteDataadapter;
        #endregion
        #region  Constructor
        /// <summary>
        /// Connect to database
        /// </summary>
        public Databaseconfiguration()
        {
            // create a new database connection:

            //string databasepath = ConfigurationManager.AppSettings["VTDatabasePath"];

            string databasepath = DecryptData(ConfigurationManager.AppSettings["VTDatabasePath"].ToString());

            _sqliteConn = new SQLiteConnection("Data Source=" + databasepath + ";Version=3;New=True;Compress=True;datetimeformat=CurrentCulture");
            //sqlite_conn = new System.Data.SQLite.SQLiteConnection("Data Source=VerificationTool_Database.db;Version=3;New=True;Compress=True;datetimeformat=CurrentCulture");

        }
        #endregion

        public static string DecryptData(string strEncryptedText)
        {
            string strPlainData = null;
            byte[] bInputText = Convert.FromBase64String(strEncryptedText);
            byte[] bDecryptedContent = DecryptData(bInputText, null,
                DataProtectionScope.LocalMachine);
            strPlainData = Encoding.UTF8.GetString(bDecryptedContent);
            return strPlainData;
        }// end of method DecryptData()


        private static byte[] DecryptData(byte[] buffer, byte[] entropy, DataProtectionScope scope)
        {

            if ((buffer == null) && (buffer.Length <= 0))
            {
                throw new ArgumentNullException("Buffer/Data is empty, can't proceed with" +
                                                " encryption");
            }
            byte[] decryptedData = ProtectedData.Unprotect(buffer, entropy, scope);

            return decryptedData;
        }// end of method DecryptData()


        #region  Public_METHODS
        /// <summary>
        /// select the records from table
        /// </summary>
        /// <param name="strQuery"></param>
        /// <returns></returns>
        public DataTable FetchRecord(string strQuery)
        {
            try
            {
                _sqliteConn.Open();
                string commandText = strQuery;
                _sqliteDataadapter = new SQLiteDataAdapter(commandText, _sqliteConn);
                DataTable dt = new DataTable();
                _sqliteDataadapter.Fill(dt);
                _sqliteConn.Close();
                return dt;

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                _sqliteConn.Close();
                throw;
            }
        }

/*
        /// <summary>
        ///  select the records from table
        /// </summary>
        /// <param name="strTableName"></param>
        /// <param name="strCondition"></param>
        /// <param name="strColumnName"></param>
        /// <returns></returns>
        public DataTable FetchRecord(string strTableName, string strCondition = null, string strColumnName = null)
        {
            try
            {
                StringBuilder query = new StringBuilder();
                if (string.IsNullOrEmpty(strColumnName))
                    query.Append("SELECT * FROM ").Append(strTableName);
                else
                    query.Append("SELECT ").Append(strColumnName).Append(" FROM ").Append(strTableName);

                if (!string.IsNullOrEmpty(strCondition))
                    query.Append(" WHERE ").Append(strCondition);

                _sqliteConn.Open();
                string commandText = query.ToString();
                _sqliteDataadapter = new SQLiteDataAdapter(commandText, _sqliteConn);
                DataTable dt = new DataTable();
                _sqliteDataadapter.Fill(dt);
                _sqliteConn.Close();
                return dt;

            }
            catch (Exception ex)
            {
                _sqliteConn.Close();
                throw;
            }
        }
*/

/*
        /// <summary>
        ///  insert the records to table
        /// </summary>
        /// <param name="strColumnName"></param>
        /// <param name="strTablename"></param>
        /// <param name="valueList"></param>
        /// <returns></returns>
        public int InsertRecord(string strColumnName, string strTablename, List<string> valueList)
        {
            try
            {
                _sqliteConn.Open();
                _sqliteCmd = _sqliteConn.CreateCommand();
                foreach (string value in valueList)
                {
                    var query = new StringBuilder();
                    query.Append("INSERT INTO ").Append(strTablename).Append("( ").Append(strColumnName).Append(") ").Append(" values ").Append("( ").Append(value).Append(") ");
                    _sqliteCmd = new SQLiteCommand(query.ToString(), _sqliteConn);
                    _sqliteCmd.ExecuteNonQuery();
                }
                _sqliteConn.Close();
            }
            catch (Exception ex)
            {
                _sqliteConn.Close();
                throw;
            }

            return 1;
        }
*/


        /// <summary>
        ///  insert the records to table
        /// </summary>
        public void InsertRecord(string sql)
        {
            try
            {
                _sqliteConn.Open();

                var cmd = new SQLiteCommand(sql, _sqliteConn);
                cmd.ExecuteNonQuery();
                _sqliteConn.Close();
                
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                _sqliteConn.Close();
                throw;
            }

        }


        /// <summary>
        ///  update the records to table
        /// </summary>
        /// <param name="strValues"></param>
        /// <param name="strTableName"></param>
        /// <param name="strCondition"></param>
        /// <returns></returns>
        public int UpdateRecord(string strValues, string strTableName, string strCondition)
        {
            try
            {
                StringBuilder query = new StringBuilder();
                query.Append("UPDATE ").Append(strTableName).Append(" SET ").Append(strValues).Append(" WHERE ").Append(strCondition);
                _sqliteConn.Open();
                _sqliteCmd = new SQLiteCommand(query.ToString(), _sqliteConn);
                _sqliteCmd.ExecuteNonQuery();
                _sqliteConn.Close();

                return 1;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                _sqliteConn.Close();
                throw;
            }
        }


        /// <summary>
        ///  Delete the records from table
        /// </summary>
        /// <param name="strTableName"></param>
        /// <param name="strCondition"></param>
        /// <returns></returns>
        public int DeleteRecord(string strTableName, string strCondition)
        {
            try
            {
                StringBuilder query = new StringBuilder();
                query.Append("DELETE FROM ").Append(strTableName).Append(" WHERE ").Append(strCondition);
                _sqliteConn.Open();
                _sqliteCmd = new SQLiteCommand(query.ToString(), _sqliteConn);
                _sqliteCmd.ExecuteNonQuery();
                _sqliteConn.Close();

                return 1;
            }
            catch (Exception ex)
            {

                Console.WriteLine(ex);
                _sqliteConn.Close();
                throw;
            }
        }    
    }
}

#endregion