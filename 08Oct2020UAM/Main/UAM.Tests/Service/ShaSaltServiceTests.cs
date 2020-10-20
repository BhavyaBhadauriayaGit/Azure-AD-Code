using Microsoft.VisualStudio.TestTools.UnitTesting;
using UAM.Service;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UAM.Tests.Service
{
    [TestClass()]
    public class ShaSaltServiceTests
    {
        private ShaSaltService shaSvc = null;
        [TestInitialize]
        public void ClassInitialize()
        {
            shaSvc = new ShaSaltService();
        }
        [TestMethod()]
        public void ShaSaltGenerationTest()
        {
            shaSvc.ShaSaltGeneration();
        }

        [TestMethod()]
        [DataTestMethod()]
        [DataRow("testpassword")]
        [DataRow("password123")]
        public void Sha256PasswordSaltHashTest(string password)
        {
            string[] result = shaSvc.Sha256PasswordSaltHash(password);
            CollectionAssert.AllItemsAreNotNull(result);
        }

        [TestMethod()]
        [DataTestMethod]
        [DataRow("DVfXScD9jWe1ZOQmpSsegK9DKa/DnVUR7lvCuP8tVN8KyqvMHsxcffGHLYBZ4ts2", "gnanaprakash12")]
        public void Sha256VerifyPasswordTest(string passwordHash, string password)
        {
            bool result = shaSvc.Sha256VerifyPassword(passwordHash, password);
            Assert.IsInstanceOfType(result, typeof(bool));
        }
    }
}