using Microsoft.Identity.Client;
using Newtonsoft.Json;
using System;
using System.Configuration;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using UAM.BO;
using UAM.Models;
using UAM.Service;

namespace UAM.Controllers
{

    [EnableCors(origins: "*", headers: "*", methods: "*")]
 //   [Authorize]
    [RoutePrefix("api/Auth")]
    public class AuthenticationController : ApiController
    {
        
        /// <summary>
        /// This API is for Internal Usage
        /// </summary>
        /// <param name="authInfo"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("UserAuthentication")]
        public IHttpActionResult UserAuthentication([FromBody] LoginViewModel authInfo)
        {
            try
            {
                UserService userService = new UserService();
                UserBo userBo = userService.GetUserByEmailIdAndPassword(authInfo.Email, authInfo.Password);

                if (userBo != null)
                {
                    //To Remove Password and Password Expiration Date
                    UserViewModel userVm = new UserViewModel
                    {
                        UserId = userBo.UserId,
                        Name = userBo.Name,
                        Email = userBo.Email,
                        IsDefaultUser = userBo.IsDefaultUser,
                        IsLocked = userBo.IsLocked,
                        LoginCounter = userBo.LoginCounter,
                        IsPasswordExpired = userBo.IsPasswordExpired,
                        ToNotifyOnPasswordExpiration = userBo.ToNotifyOnPasswordExpiration,
                        RoleId = userBo.RoleId,
                        RoleName = userBo.RoleName,
                        CreatedBy = userBo.CreatedBy,
                        CreatedDate = userBo.CreatedDate,
                        UpdatedBy = userBo.UpdatedBy,
                        UpdatedDate = userBo.UpdatedDate,
                        PasswordExpirationDate = userBo.PasswordExpirationDate
                    };

                        AuditLogService auditLogService = new AuditLogService();
                        AuditLogBo auditLogBo = new AuditLogBo
                        {
                            UserEmailId = authInfo.Email,
                            CreatedBy = userBo.UserId.ToString(),
                            CreatedDate = DateTime.Now,
                            EventName = "LastLogin",
                            LogTypeId = 2
                        };

                        auditLogService.AddUserLogs(auditLogBo);

                        userVm.IsAbbEmail = authInfo.Email.EndsWith("@abb.com") ? true : false;
                    

                    if (userVm.IsAbbEmail)
                    {
                        userVm.IsPasswordExpired = false;
                        userVm.ToNotifyOnPasswordExpiration = false;
                    }

                    return Ok(userVm);
                }
                else
                    return Unauthorized();
            }
            catch (Exception e)
            {
                AuditLogService auditLogService = new AuditLogService();
                auditLogService.AddUserLogs(new AuditLogBo()
                {
                    ExceptionInfo = "Email: " + authInfo.Email + "StackTrace: " + e.StackTrace,
                    EventName = "UserAuthentication",
                    UserEmailId = authInfo.Email,
                    LogTypeId = 3,
                    CreatedBy = "0",
                    CreatedDate = DateTime.Now
                });
                return InternalServerError();
            }
        }

        /// <summary>
        /// This API is getting exposed to VT Backend application
        /// </summary>
        /// <param name="emailId"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("VTAuthentication")]
        public IHttpActionResult VtAuthentication([FromBody] string emailId)
        {
            try
            {
                UserService userService = new UserService();
                UserBo userBo = userService.GetUserByEmailId(emailId);
                var userRole = new { userBo?.RoleName, userBo?.RoleId };

                AuditLogService auditLogService = new AuditLogService();
                AuditLogBo auditLogBo = new AuditLogBo
                {
                    UserEmailId = emailId,
                    CreatedBy = emailId,
                    CreatedDate = DateTime.Now,
                    EventName = "AOA Request to UAM for User Authentication",
                    LogTypeId = 2
                };

                auditLogService.AddUserLogs(auditLogBo);


                if (userBo?.UserId > 0)
                    return Ok(userRole);
                else
                    return NotFound();




            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return InternalServerError();
            }
        }
        
    }
}

