using Microsoft.VisualStudio.TestTools.UnitTesting;
using UAM.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace UAM.Tests.Controllers
{
    [TestClass()]
    public class RoleActivityControllerTests
    {
        private RoleActivityController _roleActivityController = null;
        [TestInitialize]
        public void ClassInitialize()
        {
            _roleActivityController = new RoleActivityController();
        }

        [TestMethod()]
        [DataTestMethod]
        [DataRow(1)]
        [DataRow(0)]
        public void UserActivityTest(int userId)
        {
            var res = _roleActivityController.UserActivity(userId);
            Assert.IsInstanceOfType(res, typeof(IHttpActionResult));

        }
    }
}