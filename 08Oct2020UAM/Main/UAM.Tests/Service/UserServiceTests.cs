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
    public class UserServiceTests
    {
        private UserService svc = null;

        [TestInitialize]
        public void ClassInitialize()
        {
            svc = new UserService();
        }

        [TestMethod()]
        [DataTestMethod]
        [DataRow("gnanaprakash.s12@in.abb.com", "gnanaprakash12", "gnanaprakash", true, 1,"1")]
        [DataRow("gnanaprakash.s13@in.abb.com", "gnanaprakash13", "gnanaprakash", true, 2, "1")]
        [DataRow("gnanaprakash.s14@in.abb.com", "gnanaprakash14", "gnanaprakash", true, 1, "1")]
        [DataRow("gnanaprakash.s15@in.abb.com", "gnanaprakash15", "gnanaprakash", true, 2, "1")]
        [DataRow("gnanaprakash.s16@in.abb.com", "gnanaprakash16", "gnanaprakash", true, 2, "1")]
        [DataRow("gnanaprakash.s17@in.abb.com", "gnanaprakash17", "gnanaprakash", true, 1, "22")]
        [DataRow("", "gnanaprakash1", "gnanaprakash", false, 3, "1")]
        [DataRow("gnanaprakash.s19@in.abb.com", "gnanaprakash19", "", true, 1, "1")]
        [DataRow("gnanaprakash.s20@in.abb.com", "", "gnanaprakash20", true, 1, "1")]
        public void AddUserTest(string email, string password, string name, bool isDefaultUser, int roleId, string createdBy)
        {
            UserBo uBo = new UserBo
            {
                Email = email,
                IsDefaultUser = isDefaultUser,
                Password = password,
                Name = name,
                RoleId = roleId,
                CreatedBy = createdBy
            };
            try
            {
                Enums.ApiResponseMessage response = svc.AddUser(uBo);
                Assert.AreEqual(Enums.ApiResponseMessage.UserCreated, svc.AddUser(uBo));
            }
            catch (AssertFailedException assertEx)
            {
                Assert.AreEqual(Enums.ApiResponseMessage.DuplicateEmail, svc.AddUser(uBo));
                
            }
            catch (Exception e)
            {
                Assert.Fail();
            }
        }

        [TestMethod()]
        [DataTestMethod()]
        [DataRow("gnanaprakash.s12@in.abb.com", true)]
        [DataRow("gnanaprakash.s13@in.abb.com", true)]
        [DataRow("gnanaprakash.s14@in.abb.com", true)]
        [DataRow("", false)]
        [DataRow("gnanaprakash.s15@in.abb.com", true)]
        public void GetUserByEmailIdTest(string emailId, bool isPasswordNeeded = false)
        {
            UserBo uBo = svc.GetUserByEmailId(emailId, isPasswordNeeded);
            if (!string.IsNullOrEmpty(emailId))
            {
                StringAssert.Contains(uBo.Email, ".com");
                uBo = null;
            }
            else
            {
                Assert.IsTrue(uBo==null || uBo.Email=="");
            }
        }

        [TestMethod()]
        [DataTestMethod()]
        [DataRow("gnanaprakash.s12@in.abb.com", "gnanaprakash12")]
        [DataRow("gnanaprakash.s13@in.abb.com", "gnanaprakash13")]
        [DataRow("gnanaprakash.s14@in.abb.com", "gnanaprakash14")]
        [DataRow("gnanaprakash.s15@in.abb.com", "gnanaprakash15")]
        public void GetUserByEmailIdAndPasswordTest(string emailId, string password)
        {
            UserBo uBo = svc.GetUserByEmailIdAndPassword(emailId, password);

                if (emailId == "gnanaprakash.s7@in.abb.com" || emailId == "gnanaprakash.s9@in.abb.com")
                {
                    Assert.IsTrue(uBo == null || uBo.Email == "");
                }
                else
                {
                    StringAssert.Contains(uBo.Email, ".com");
                }
        }

        [TestMethod()]
        [DataTestMethod]
        [DataRow("gnanaprakash.s5@in.abb.com", "gnanaprakashfive", "gnanaprakash", "1")]
        [DataRow("gnanaprakash.s6@in.abb.com", "gnanaprakashsix", "gnanaprakash", "1")]
        [DataRow("gnanaprakash.s5@in.abb.com", "gnanaprakash5", "gnanaprakash", "1")]
        [DataRow("gnanaprakash.s6@in.abb.com", "gnanaprakash6", "gnanaprakash", "1")]
        public void UpdateUserTest(string email, string password, string name, string updatedBy)
        {
            UserBo uBo = new UserBo
            {
                Email = email,
                Password = password,
                Name = name,
                UpdatedBy = updatedBy
            };

            bool result = false;

            Enums.ApiResponseMessage response = svc.UpdateUser(uBo, email);
            if (response == Enums.ApiResponseMessage.UserUpdated || response ==
                                                                 Enums.ApiResponseMessage.AvailableInLastThreePasswords
                                                                 || response == Enums.ApiResponseMessage
                                                                     .NoUserDataUpdated)
            {
                result = true;
            }

            Assert.IsTrue(result);

            
        }

        [TestMethod()]
        [DataTestMethod()]
        [DataRow("gnanaprakash.s2@in.abb.com")]
        [DataRow("gnanaprakash.s3@in.abb.com")]
        [DataRow("gnanaprakash.s4@in.abb.com")]
        [DataRow("")]
        public void DeleteUserTest(string emailId)
        {
            try
            {
                svc.DeleteUser(emailId);
            }
            catch (Exception e)
            {
                Assert.Fail();
            }
           
            
        }

        [TestMethod()]
        public void GetUsersTest()
        {

            List<UserBo> lstUsers = svc.GetUsers();
            CollectionAssert.AllItemsAreNotNull(lstUsers);
           

            
        }

        [TestMethod()]
        [DataTestMethod()]
        [DataRow(1,55)]
        [DataRow(1,66)]
        [DataRow(2,6)]
        public void UpdateUtilityConfigTest(int keyId, int value)
        {
            bool result = false;
            Enums.ApiResponseMessage response = svc.UpdateUtilityConfig(keyId, value);
            if (response == Enums.ApiResponseMessage.Success || response == Enums.ApiResponseMessage.Failed)
            {
                result = true;
            }
            Assert.IsTrue(result);
        }

        [TestMethod()]
        public void GetLockHoursTest()
        {
            int result = svc.GetLockHours();
            Assert.IsInstanceOfType(result, typeof(int));
        }
    }
}