using Microsoft.VisualStudio.TestTools.UnitTesting;
using UAM.DL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAM.Tests.DL
{
    [TestClass()]
    public class AuditLogEngineTests
    {
        AuditLogEngine _aLogEngine = null;
        [TestInitialize]
        public void ClassInitialize()
        {
            _aLogEngine = new AuditLogEngine();
        }

        [TestMethod()]
        [DataTestMethod()]
        [DataRow("'LognameTest',1,'','1','10/25/2018 2:53:05 PM'")]
        public void AddUserLogsTest(string paramValue)
        {
            try
            {
                _aLogEngine.AddUserLogs(paramValue);
            }
            catch (Exception ex)
            {
                Assert.Fail("AddUserLogs: "+ex);
            }
        }

        [TestMethod()]
        public void GetUserLogsTest()
        {
            DataTable resDt = _aLogEngine.GetUserLogs();
            Assert.IsInstanceOfType(resDt,typeof(DataTable));
        }
    }
}