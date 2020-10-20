using Microsoft.VisualStudio.TestTools.UnitTesting;
using UAM.DL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UAM.Service;

namespace UAM.Tests.DL
{
    [TestClass()]
    public class UtilityEngineTests
    {
        private UtilityEngine uEngine = null;

        [TestInitialize]
        public void ClassInitialize()
        {
            uEngine = new UtilityEngine();
            
        }

        [TestMethod()]
        [DataTestMethod]
        [DataRow("Value=1", 2)]
        [DataRow("Value=1", 3)]
        public void UpdateUtilityConfigTest(string paramvalue, int val)
        {
            bool result = uEngine.UpdateUtilityConfig(paramvalue, val);
            Assert.IsInstanceOfType(result,typeof(bool));
        }
         
        [TestMethod()]
        public void GetLockHoursTest()
        {
            int res = uEngine.GetLockHours();
            Assert.IsTrue(res>=0);
        }
    }
}