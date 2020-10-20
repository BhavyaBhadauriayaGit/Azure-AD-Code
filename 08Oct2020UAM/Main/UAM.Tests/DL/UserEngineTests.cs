using Microsoft.VisualStudio.TestTools.UnitTesting;
using UAM.DL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;

namespace UAM.Tests.DL
{
    [TestClass()]
    public class UserEngineTests
    {
        UserEngine _userEngine = null;
        [TestInitialize]
        public void ClassInitialize()
        {
            _userEngine = new UserEngine();
        }

        [TestMethod()]
        [DataTestMethod()]
        [DataRow("'Naveen','YyniSgqcMK02Rv5O48Q0fh6p2oOmlHd3wJyhoKiBhq0c5CH4fZS1cmPzKuxqyI/A','Naveen17@in.abb.com',1,0,0,'4/24/2019 7:22:14 PM',0,'1','10/26/2018 7:22:15 PM','1','10/26/2018 7:22:15 PM'")]
        public void AddUserTest(string param)
        {
            try
            {
                _userEngine.AddUser(param);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            
            
        }

        [TestMethod()]
        public void GetUserTest()
        {
            DataTable resDt = _userEngine.GetUser();
            Assert.IsInstanceOfType(resDt, typeof(DataTable));

        }

        [TestMethod()]
        [DataTestMethod()]
        [DataRow("Mahender1@in.abb.com")]
        public void GetUserByEmailIdTest(string email)
        {
            DataTable resDt = _userEngine.GetUserByEmailId(email);
            Assert.IsInstanceOfType(resDt, typeof(DataTable));
        }

        [TestMethod()]
        [DataTestMethod()]
        [DataRow("Password='Testingnewpassword'", "shikha.jaiswal@in.abb.com")]
        public void UpdateUserTest(string paramValues, string emailId)
        {
            try
            {
                _userEngine.UpdateUser(paramValues, emailId);
            }
            catch (Exception e)
            {
                Assert.Fail();
                Console.WriteLine(e);
                throw;
            }
        }

        [TestMethod()]
        [DataTestMethod()]
        [DataRow("shikha.jaiswal@in.abb.com")]
        public void DeleteUserTest(string email)
        {
            try
            {
                _userEngine.DeleteUser(email);
            }
            catch (Exception e)
            {
                Assert.Fail();
                Console.WriteLine(e);
                throw;
            }
            
        }
    }
}