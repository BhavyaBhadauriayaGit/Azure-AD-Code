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
    public class UserPasswordArchiveServiceTests
    {
        private UserPasswordArchiveService svc = null;

        [TestInitialize]
        public void ClassInitialize()
        {
            svc = new UserPasswordArchiveService();
        }

        //[TestMethod()]
        //This is getting covered as part of AddUser method from UserService Method
        //public void AddUserPasswordTest()
        //{
        //    Assert.IsTrue(true);
        //}

        [TestMethod()]
        [DataTestMethod()]
        [DataRow(40)]
        [DataRow(41)]
        [DataRow(42)]
        [DataRow(43)]
        [DataRow(44)]
        public void GetUserPasswordsTest(int userId)
        {
            List<UserPasswordHistoryBo> lstusrPasswordBo = svc.GetUserPasswords(userId);
            CollectionAssert.AllItemsAreUnique(lstusrPasswordBo);
        }

        [TestMethod()]
        [DataTestMethod()]
        [DataRow(44, "newpassword")]
        public void ValidatePasswordHistoryTest(int userId, string password)
        {
            Assert.IsTrue(svc.ValidatePasswordHistory(userId, password));
        }
    }
}