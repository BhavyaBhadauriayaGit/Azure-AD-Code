using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace UAM.Tests.Controllers
{
    [TestClass]
    public class HomeControllerTest
    {
        [TestMethod]
        public void Index()
        {
            // Arrange
            //HomeController controller = new HomeController();

            // Act
            ViewResult result = null;// controller.Index() as ViewResult;

            // Assert
            Assert.IsNotNull(result);
        }
    }
}
