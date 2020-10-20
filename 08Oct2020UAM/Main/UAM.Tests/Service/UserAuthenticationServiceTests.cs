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
    public class UserAuthenticationServiceTests
    {
        private UserAuthenticationService svc = null;
        [TestInitialize]
        public void ClassInitialize()
        {
            svc = new UserAuthenticationService();
        }

        [TestMethod()]
        [DataTestMethod()]
        [DataRow("gnanaprakash.s12@in.abb.com", "gnanaprakash12")]
        [DataRow("gnanaprakash.s13@in.abb.com", "gnanaprakash13")]
        [DataRow("gnanaprakash.s14@in.abb.com", "gnanaprakash14")]
        [DataRow("gnanaprakash.s15@in.abb.com", "gnanaprakash15")]
        [DataRow("gnanaprakash.s16@in.abb.com", "gnanaprakash16")]
        [DataRow("gnanaprakash.s17@in.abb.com", "gnanaprakash17")]
        [DataRow("gnanaprakash.s19@in.abb.com", "gnanaprakash19")]
        [DataRow("gnanaprakash.s20@in.abb.com", "gnanaprakash20")]
        public void LoginValidationTest(string userEmail, string password)
        {
            UserBo uBo = svc.LoginValidation(userEmail, password);
            if (userEmail != "gnanaprakash.s20@in.abb.com")
            {
                Assert.IsTrue(uBo != null);
            }
            else
            {
                Assert.IsTrue(uBo==null);
            }

        }
    }
}