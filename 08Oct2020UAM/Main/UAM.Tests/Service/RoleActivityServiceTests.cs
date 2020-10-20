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
    public class RoleActivityServiceTests
    {
        private RoleActivityService svc = null;

        [TestInitialize]
        public void ClassInitialize()
        {
            svc = new RoleActivityService();
        }

        [TestMethod()]
        [DataTestMethod()]
        [DataRow(1)]
        [DataRow(2)]
        public void GetRoleActivityRightsTest(int roleId)
        {
            List<RoleActivityBo> lstRoleActivity = svc.GetRoleActivityRights(roleId);
            CollectionAssert.AllItemsAreUnique(lstRoleActivity);
            CollectionAssert.AllItemsAreNotNull(lstRoleActivity);
        }

        [TestMethod()]
        [DataTestMethod]
        [DataRow(40)]
        [DataRow(41)]
        public void GetUserActivityRightsTest(int userId)
        {
            List<RoleActivityBo> lstRoleActivity = svc.GetUserActivityRights(userId);
            CollectionAssert.AllItemsAreNotNull(lstRoleActivity);
        }

        [TestMethod()]
        public void GetRoleTest()
        {
            List<RoleBo> lstRole = svc.GetRole();
            CollectionAssert.AllItemsAreNotNull(lstRole);
        }
    }
}