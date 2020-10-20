using Microsoft.VisualStudio.TestTools.UnitTesting;
using UAM.Controllers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using UAM.Models;

namespace UAM.Tests.Controllers
{
    [TestClass()]
    public class AuthenticationControllerTests
    {
        private AuthenticationController _authController = null;
        [TestInitialize]
        public void ClassInitialize()
        {
            _authController = new AuthenticationController();
        }

        [TestMethod()]
        [DataTestMethod]
        [DataRow("shikha.jaiswal@in.abb.com","testpassword")]
        public void UserAuthenticationTest(string userEmailId, string password)
        {
            LoginViewModel lVm = new LoginViewModel
            {
                Email = userEmailId,
                Password = password
            };
            var res = _authController.UserAuthentication(lVm);
            Assert.IsInstanceOfType(res, typeof(IHttpActionResult));
        }

        [TestMethod()]
        [DataTestMethod]
        [DataRow("shikha.jaiswal@in.abb.com")]
        public void VtAuthenticationTest(string emailId)
        {
            var res = _authController.VtAuthentication(emailId);
            Assert.IsInstanceOfType(res, typeof(IHttpActionResult));
        }
    }
}