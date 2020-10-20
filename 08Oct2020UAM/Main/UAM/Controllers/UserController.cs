using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using UAM.BO;
using UAM.Service;
using System.Web.Http.Filters;
using System.Security.Claims;
using Microsoft.Identity.Client;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.Identity;

namespace UAM.Controllers
{
    [RoutePrefix("api/user")]
    //  [Authorize]
    public class UserController : ApiController
    {

        //[Authorize(Roles = "Super User, Customer User")]
        [HttpGet]
        [Route("User")]
        public IHttpActionResult GetUser(string emailId)
        {
            UserBo userBo;

            try
            {
                var cprincipal = User as ClaimsPrincipal;   //var cp = (ClaimsPrincipal)User;
                var roleName = ((Claim)cprincipal.Claims.SingleOrDefault(x => x.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role")).Value.ToString();
                UserService userService = new UserService();
                userBo = userService.GetUserByEmailId(emailId);

                AuditLogService auditLogService = new AuditLogService();
                AuditLogBo auditLogBo = new AuditLogBo
                {
                    UserEmailId = userBo.Email,
                    CreatedBy = userBo.CreatedBy,
                    CreatedDate = DateTime.Now,
                    EventName = "Get User By EmailID" + emailId,
                    LogTypeId = 2
                };
                auditLogService.AddUserLogs(auditLogBo);

            }
            catch (Exception e)
            {
                AuditLogService auditLogService = new AuditLogService();
                auditLogService.AddUserLogs(new AuditLogBo()
                {
                    ExceptionInfo = emailId + ": " + e.StackTrace,
                    EventName = "GetUserByEmailId",
                    UserEmailId = emailId,
                    LogTypeId = 3,
                    CreatedBy = "0",
                    CreatedDate = DateTime.Now
                });
                return InternalServerError();
            }

            return Ok(userBo);
        }

        // GET: api/User
        // [Authorize(Roles = "Super User")]
        [HttpGet]
        [Route("User")]
        public IHttpActionResult Get()
        {
            List<UserBo> lstUserBo;

            try
            {
                //var cprincipal = User as ClaimsPrincipal;   //var cp = (ClaimsPrincipal)User;

                UserService userService = new UserService();
                lstUserBo = userService.GetUsers();

                AuditLogService auditLogService = new AuditLogService();
                AuditLogBo auditLogBo = new AuditLogBo
                {
                    UserEmailId = "",
                    CreatedBy = "",
                    CreatedDate = DateTime.Now,
                    EventName = "Get All Users",
                    LogTypeId = 1
                };
                auditLogService.AddUserLogs(auditLogBo);
            }
            catch (Exception e)
            {
                AuditLogService auditLogService = new AuditLogService();
                auditLogService.AddUserLogs(new AuditLogBo()
                {
                    ExceptionInfo = e.StackTrace,
                    EventName = "GetUsers",
                    UserEmailId = "-",
                    LogTypeId = 3,
                    CreatedBy = "0",
                    CreatedDate = DateTime.Now
                });
                return InternalServerError();
            }

            return Ok(lstUserBo);
        }



        // POST: api/User
        public IHttpActionResult Post([FromBody] UserBo userBo)
        {
            try
            {
                UserService userService = new UserService();
                Enums.ApiResponseMessage apiResponseMessage = userService.AddUser(userBo);

                if (apiResponseMessage == Enums.ApiResponseMessage.UserCreated)
                {
                    AuditLogService auditLogService = new AuditLogService();
                    AuditLogBo auditLogBo = new AuditLogBo
                    {
                        UserEmailId = userBo.Email,
                        CreatedBy = userBo.CreatedBy,
                        CreatedDate = DateTime.Now,
                        EventName = "UserCreated",
                        LogTypeId = 2
                    };
                    auditLogService.AddUserLogs(auditLogBo);
                }

                return Ok(apiResponseMessage.ToString());
            }
            catch (Exception e)
            {
                AuditLogService auditLogService = new AuditLogService();
                auditLogService.AddUserLogs(new AuditLogBo()
                {
                    ExceptionInfo = e.StackTrace,
                    EventName = "CreateUsers",
                    UserEmailId = userBo.Email,
                    LogTypeId = 3,
                    CreatedBy = userBo.CreatedBy,
                    CreatedDate = DateTime.Now
                });
                return InternalServerError();
            }
        }

        // PUT: api/User/5
        public IHttpActionResult Put(string emailId, [FromBody] UserBo userBo)
        {
            try
            {

                UserService userService = new UserService();
                Enums.ApiResponseMessage apiResponseMessage = userService.UpdateUser(userBo, emailId);

                if (apiResponseMessage == Enums.ApiResponseMessage.UserUpdated)
                {
                    AuditLogService auditLogService = new AuditLogService();
                    AuditLogBo auditLogBo = new AuditLogBo
                    {
                        UserEmailId = emailId,
                        CreatedBy = userBo.UpdatedBy,
                        CreatedDate = DateTime.Now,
                        EventName = "UserUpdated",
                        LogTypeId = 2
                    };
                    auditLogService.AddUserLogs(auditLogBo);
                }

                return Ok(apiResponseMessage.ToString());

                //if (apiResponseMessage == UserService.ApiResponseMessage.AvailableInLastThreePasswords)
                //    return BadRequest("Please change the password as it's already used in the past");
                //else if(apiResponseMessage == UserService.ApiResponseMessage.NoUserDataUpdated)
                //    return BadRequest("No User Data Updated");
            }
            catch (Exception e)
            {
                AuditLogService auditLogService = new AuditLogService();
                auditLogService.AddUserLogs(new AuditLogBo()
                {
                    ExceptionInfo = e.StackTrace,
                    EventName = "UpdateUsers",
                    UserEmailId = emailId,
                    LogTypeId = 3,
                    CreatedBy = "0",
                    CreatedDate = DateTime.Now
                });
                return InternalServerError();
            }
        }

        // DELETE: api/User/5
        [HttpDelete]
        //[Route("DeleteUser/{emailId}")]
        public IHttpActionResult Delete([FromUri] string emailId)
        {
            try
            {
                UserService userService = new UserService();
                userService.DeleteUser(emailId); // Added a parameter to delete the selected user #36931


                AuditLogService auditLogService = new AuditLogService();
                AuditLogBo auditLogBo = new AuditLogBo
                {
                    UserEmailId = emailId,
                    CreatedBy = emailId,
                    CreatedDate = DateTime.Now,
                    EventName = "UserDeleted",
                    LogTypeId = 2
                };

                auditLogService.AddUserLogs(auditLogBo);


                return Ok(Enums.ApiResponseMessage.UserDeleted.ToString());
            }
            catch (Exception e)
            {
                AuditLogService auditLogService = new AuditLogService();
                auditLogService.AddUserLogs(new AuditLogBo()
                {
                    ExceptionInfo = e.StackTrace,
                    EventName = "DeleteUsers",
                    UserEmailId = emailId,
                    LogTypeId = 3,
                    CreatedBy = "0",
                    CreatedDate = DateTime.Now
                });
                return InternalServerError();
            }
        }

        [HttpPut]
        [Route("ConfigureLockHour/{hour}")]
        public IHttpActionResult LockHour(int hour)
        {
            try
            {
                UserService userService = new UserService();
                Enums.ApiResponseMessage apiResponseMessage = userService.UpdateUtilityConfig(1, hour);
                if (apiResponseMessage == Enums.ApiResponseMessage.Success)
                {
                    AuditLogService auditLogService = new AuditLogService();
                    auditLogService.AddUserLogs(new AuditLogBo()
                    {
                        EventName = "ConfigureLockHour",
                        UserEmailId = "-",
                        LogTypeId = 1,
                        CreatedBy = "0",
                        CreatedDate = DateTime.Now
                    });
                }
                return Ok(apiResponseMessage.ToString());
            }
            catch (Exception e)
            {
                AuditLogService auditLogService = new AuditLogService();
                auditLogService.AddUserLogs(new AuditLogBo()
                {
                    ExceptionInfo = e.StackTrace,
                    EventName = "ConfigureLockHour",
                    UserEmailId = "-",
                    LogTypeId = 3,
                    CreatedBy = "0",
                    CreatedDate = DateTime.Now
                });
                return InternalServerError();
            }
        }
        //[HttpGet]
        //[Route("User1")]
        //public async Task GetATokenForGraph()
        //{
        //    var clientId = "cc1f9793-3910-4118-9385-9db53f2166cd";
        //    string authority = "https://login.microsoftonline.com/b759a000-2d88-41f3-8342-da932d621ed5";

        //    string[] scopes = new string[] { "user.read" };
        //    IPublicClientApplication app = PublicClientApplicationBuilder
        //      .Create(clientId)
        //      .WithAuthority(authority)
        //      .Build();

        //    var accounts = await app.GetAccountsAsync();

        //    AuthenticationResult result = null;
        //    if (accounts.Any())
        //    {
        //        result = await app.AcquireTokenSilent(scopes, accounts.FirstOrDefault())
        //            .ExecuteAsync();
        //    }
        //    else
        //    {
        //        try
        //        {
        //            result = await app.AcquireTokenByIntegratedWindowsAuth(scopes)
        //               .ExecuteAsync(CancellationToken.None);
        //        }
        //        catch (MsalUiRequiredException ex)
        //        {
        //            // MsalUiRequiredException: AADSTS65001: The user or administrator has not consented to use the application

        //        }
        //        catch (MsalServiceException ex)
        //        {

        //        }
        //        catch (MsalClientException ex)
        //        {

        //            // Mitigation: Use interactive authentication
        //        }
        //    }


        //    Console.WriteLine(result.Account.Username);
        //}


        [HttpGet]
        [Route("GetUserDetails")]
        public IHttpActionResult GetUserDetails()
        {
            //try
            //{
            
            var email = HttpContext.Current.User.Identity.Name;
           // UserManager.FindByName(User.Identity.Name);
            //var user = _authBusiness.GetUser(email);
            //    return Ok(new Response()
            //    {
            //        Status = true,
            //        Data = new
            //        {
            //            user.FirstName,
            //            user.LastName,
            //            user.EmailAddress,
            //            user.UserTypeId
            //        }
            //    });
            //}
            //catch (Exception ex)
            //{
            //    return Ok(new Response()
            //    {
            //        Status = false,
            //        Message = ex.Message
            //    });
            //}
            return Ok();

        }
    }
}