using Microsoft.VisualStudio.TestTools.UnitTesting;
using UAM.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.ExceptionServices;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Xml.Schema;
using UAM.BO;

namespace UAM.Tests.Controllers
{
    [TestClass()]
    public class AuditLogControllerTests
    {
        private AuditLogController _auditLogController = null;

        [TestInitialize()]
        public void ClassInitialize()
        {
            _auditLogController = new AuditLogController();
        }

        [TestMethod()]
        public void GetTest()
        {
            DateTime fromDate = new DateTime(2018, 4, 1);
            DateTime toDate = new DateTime(2018, 3, 1);
            var result = _auditLogController.Get(fromDate, toDate) as IHttpActionResult;
            Assert.IsInstanceOfType(result, typeof(IHttpActionResult));
        }

        [TestMethod()]
        
        public void GetTest1()
        {
            var result = _auditLogController.Get();
            Assert.IsInstanceOfType(result, typeof(IHttpActionResult));
        }

        [TestMethod()]
        [DataTestMethod()]
        [DataRow("eventname","exceptioninfo","1","shikha.jaiswal@in.abb.com",1,1)]
        public void PostTest(string eventName, string exceptionInfo, string createdBy, string userEmailId,int logId, int logTypeId)
        {
            DateTime createdDate = new DateTime();
            AuditLogBo auditlogBo = new AuditLogBo
            {
                EventName = eventName,
                ExceptionInfo = exceptionInfo,
                CreatedBy = createdBy,
                CreatedDate = createdDate,
                LogId = logId,
                LogTypeId = logTypeId,
                UserEmailId = userEmailId
            };

            var result = _auditLogController.Post(auditlogBo);
            Assert.IsInstanceOfType(result, typeof(IHttpActionResult));
       
        }

        [TestMethod()]
        [DataTestMethod()]
        [DataRow("eventupdated", "exceptioninfo", "1", "shikha.jaiswal@in.abb.com", 1, 1)]
        public void PutTest(string eventName, string exceptionInfo, string createdBy, string userEmailId, int logId, int logTypeId)
        {
            DateTime createdDate = new DateTime();
            AuditLogBo auditlogBo = new AuditLogBo
            {
                EventName = eventName,
                ExceptionInfo = exceptionInfo,
                CreatedBy = createdBy,
                CreatedDate = createdDate,
                LogId = logId,
                LogTypeId = logTypeId,
                UserEmailId = userEmailId
            };

            var result = _auditLogController.Post(auditlogBo);
            Assert.IsInstanceOfType(result, typeof(IHttpActionResult));
        }

        [TestMethod()]
        [DataTestMethod()]
        [DataRow(1)]
        [DataRow(2)]
        [DataRow(3)]
        public void DeleteTest(int id)
        {
            try
            {
                _auditLogController.Delete(id);
            }
            catch (Exception e)
            {
                Assert.Fail();
                Console.WriteLine(e);
                throw;
            }
            
            
        }
    }
}