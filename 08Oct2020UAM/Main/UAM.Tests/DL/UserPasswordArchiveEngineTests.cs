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
    public class UserPasswordArchiveEngineTests
    {
        public UserPasswordArchiveEngine _userPasswordArchiveEngine = null;
        [TestInitialize()]
        public void ClassInitialization()
        {
            _userPasswordArchiveEngine = new UserPasswordArchiveEngine();
        }
        [TestMethod()]
        [DataTestMethod()]
        [DataRow("40,'somepassword','7/23/2018 6:07:35 PM','7/23/2018 6:07:35 PM','1'")]
        public void AddUserPasswordTest(string paramValues)
        {
            try
            {
                _userPasswordArchiveEngine.AddUserPassword(paramValues);
            }
            catch (Exception e)
            {
                Assert.Fail();
            }
        }

        [TestMethod()]
        [DataTestMethod()]
        [DataRow(40)]
        public void GetUserPasswordsTest(int userId)
        {
            DataTable dT = _userPasswordArchiveEngine.GetUserPasswords(userId);
            Assert.IsInstanceOfType(dT, typeof(DataTable));
        }
    }
}