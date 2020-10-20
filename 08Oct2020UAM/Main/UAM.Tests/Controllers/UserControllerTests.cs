using Microsoft.VisualStudio.TestTools.UnitTesting;
using UAM.Controllers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using UAM.BO;

namespace UAM.Tests.Controllers
{


    [TestClass()]
    public class UserControllerTests
    {
        private UserController _userController = null;

        [TestInitialize]
        public void ClassInitialize()
        {
            _userController = new UserController();
        }

        [TestMethod()]
        [DataTestMethod]
        [DataRow("shikha.jaiswal@in.abb.com")]
        [DataRow("gnanaprakash.s1@in.abb.com")]
        public void GetUserTest(string emailId)
        {
            var res = _userController.GetUser(emailId);
            Assert.IsInstanceOfType(res, typeof(IHttpActionResult));
        }

        [TestMethod()]
        public void GetTest()
        {
            var res = _userController.Get();
            Assert.IsInstanceOfType(res, typeof(IHttpActionResult));
           
        }

        [TestMethod()]
        [DataTestMethod]
        [DataRow("Naveen","Naveen1@in.abb.com","naveen","1",true)]
        public void PostTest(string name, string email, string password, string createdBy, bool isDefaultUser)
        {
            UserBo userBo = new UserBo
            {
                Name = name,
                Email = email,
                Password = password,
                IsDefaultUser = isDefaultUser,
                CreatedBy = createdBy
            };
            var res = _userController.Post(userBo);
            Assert.IsInstanceOfType(res, typeof(IHttpActionResult));
        }

        [TestMethod()]
        [DataTestMethod]
        [DataRow("Naveen", "Naveen1@in.abb.com", "naveen", "1", true)]
        public void PutTest(string name, string email, string password, string createdBy, bool isDefaultUser)
        {
            UserBo userBo = new UserBo
            {
                Name = name,
                Email = email,
                Password = password,
                IsDefaultUser = isDefaultUser,
                CreatedBy = createdBy
            };
            var res = _userController.Put(email, userBo);
            Assert.IsInstanceOfType(res, typeof(IHttpActionResult));
        }

        [TestMethod()]
        [DataTestMethod]
        [DataRow("shikha.jaiswal@in.abb.com")]
        [DataRow("gnanaprakash.s1@in.abb.com")]
        public void DeleteTest(string emailId)
        {
            var res = _userController.Delete(emailId);
            Assert.IsInstanceOfType(res, typeof(IHttpActionResult));
        }

        [TestMethod()]
        [DataTestMethod]
        [DataRow(1)]
        [DataRow(2)]
        public void LockHourTest(int hour)
        {
            var res = _userController.LockHour(hour);
            Assert.IsInstanceOfType(res, typeof(IHttpActionResult));
        }
    }
}