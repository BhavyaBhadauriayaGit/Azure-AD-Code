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
    public class HomeControllerTests
    {
        private HomeController _homeController = null;
        [TestInitialize]
        public void ClassInitialize()
        {
            _homeController = new HomeController();
        }

        [TestMethod()]
        [DataTestMethod]
        [DataRow("en", "uk","Schedule")]
        public void GetCultureInfoTest(string language, string country, string keyName)
        {
            var res = _homeController.GetCultureInfo(language, country, keyName);
            Assert.IsInstanceOfType(res, typeof(IHttpActionResult));
        }
    }
}