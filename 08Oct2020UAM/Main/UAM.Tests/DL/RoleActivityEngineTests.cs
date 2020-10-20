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
    public class RoleActivityEngineTests
    {
        private RoleActivityEngine _roleActivity = null;
        [TestInitialize()]
        public void ClassInitialize()
        {
            _roleActivity = new RoleActivityEngine();
        }

        [TestMethod()]
        [DataTestMethod()]
        [DataRow(1)]
        public void GetRoleActivityRightsTest(int roleId)
        {
            DataTable res = _roleActivity.GetRoleActivityRights(1);
            Assert.IsInstanceOfType(res, typeof(DataTable));
            
        }

        [TestMethod()]
        [DataTestMethod()]
        [DataRow(45)]
        public void GetUserActivityRightsTest(int userId)
        {
            DataTable res = _roleActivity.GetUserActivityRights(userId);
            Assert.IsInstanceOfType(res,typeof(DataTable));
        }

        [TestMethod()]
        public void GetRoleTest()
        {
            DataTable res = _roleActivity.GetRole();
            Assert.IsInstanceOfType(res, typeof(DataTable));
        }
    }
}