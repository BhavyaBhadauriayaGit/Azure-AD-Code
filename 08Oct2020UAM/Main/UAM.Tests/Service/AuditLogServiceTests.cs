using Microsoft.VisualStudio.TestTools.UnitTesting;
using UAM.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAM.BO;

namespace UAM.Tests.Service
{
    [TestClass()]
    public class AuditLogServiceTests
    {

        private AuditLogService svc = null;

        [TestInitialize]
        public void ClassInitialize()
        {
            svc = new AuditLogService();
        }

        [TestMethod()]
        [DataTestMethod()]
        [DataRow("LognameTest","Exception info", 1,"gnanaprakash12@in.abb.com", "1")]
        public void AddUserLogsTest(string eventName, string exceptionInfo, int logTypeId, string userEmailId, string createdBy)
        {
            DateTime createdDate = DateTime.Now;
            AuditLogBo auditBo = new AuditLogBo
            {
                CreatedBy = createdBy,
                EventName = eventName,
                ExceptionInfo = exceptionInfo,
                LogTypeId = logTypeId,
                CreatedDate = createdDate
            };

            AuditLogBo logBo = svc.AddUserLogs(auditBo);
            Assert.IsTrue(logBo.LogTypeId > 0);

        }

        [TestMethod()]
        public void GetUserLogsTest()
        {
            DateTime fromDate = DateTime.Now.AddDays(100);
            DateTime toDate = DateTime.Now.AddDays(50);
            List<AuditLogBo> lstLogBo = svc.GetUserLogs(fromDate, toDate);
            CollectionAssert.AllItemsAreNotNull(lstLogBo);
        }

        [TestMethod()]
        public void GetUserLogsTest1()
        {
            List<AuditLogBo> lstLogBo = svc.GetUserLogs();
            CollectionAssert.AllItemsAreNotNull(lstLogBo);
        }
    }
}