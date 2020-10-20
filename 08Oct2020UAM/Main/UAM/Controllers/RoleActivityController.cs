using System;
using System.Collections.Generic;
using System.Web.Http;
using UAM.BO;
using UAM.Service;

namespace UAM.Controllers
{
  //  [Authorize]
    public class RoleActivityController : ApiController
    {
        
        // GET: api/RoleActivity
        [HttpGet]
        [Route("api/Role")]
        public IHttpActionResult Get()
        {
            List<RoleBo> lstRoleBo = new List<RoleBo>();
            try
            {
                RoleActivityService roleActivityService = new RoleActivityService();
                lstRoleBo = roleActivityService.GetRole();

                AuditLogService auditLogService = new AuditLogService();
                auditLogService.AddUserLogs(new AuditLogBo()
                {
                    EventName = "Get Roles",
                    UserEmailId = "",
                    LogTypeId = 1,
                    CreatedBy = "0",
                    CreatedDate = DateTime.Now
                });

            }
            catch (Exception e)
            {
                AuditLogService auditLogService = new AuditLogService();
                auditLogService.AddUserLogs(new AuditLogBo()
                {
                    ExceptionInfo = e.StackTrace,
                    EventName = "GetRoles",
                    UserEmailId = "-",
                    LogTypeId = 3,
                    CreatedBy = "0",
                    CreatedDate = DateTime.Now
                });
            }
            return Ok(lstRoleBo);
        }

        // GET: api/RoleActivity/5
        [HttpGet]
        [Route("api/RoleActivity")]
        public IHttpActionResult RoleActivity(int roleId)
        {
            List<RoleActivityBo> lstRoleActivityBo = new List<RoleActivityBo>();
            try
            {
                RoleActivityService roleActivityService = new RoleActivityService();
                lstRoleActivityBo = roleActivityService.GetRoleActivityRights(roleId);

                AuditLogService auditLogService = new AuditLogService();
                auditLogService.AddUserLogs(new AuditLogBo()
                {
                    EventName = "Get Activities By RoleID = "+ roleId,
                    UserEmailId = "",
                    LogTypeId = 1,
                    CreatedBy = "0",
                    CreatedDate = DateTime.Now
                });

            }
            catch (Exception e)
            {
                AuditLogService auditLogService = new AuditLogService();
                auditLogService.AddUserLogs(new AuditLogBo()
                {
                    ExceptionInfo = "RoleId: " + roleId + "StackTrace: " + e.StackTrace,
                    EventName = "GetRoleActivity",
                    UserEmailId = "-",
                    LogTypeId = 3,
                    CreatedBy = "0",
                    CreatedDate = DateTime.Now
                });
            }
            return Ok(lstRoleActivityBo);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/UserActivity")]
        public IHttpActionResult UserActivity(int userId)
        {
            List<RoleActivityBo> lstRoleActivityBo = new List<RoleActivityBo>();
            try
            {
                RoleActivityService roleActivityService = new RoleActivityService();
                lstRoleActivityBo = roleActivityService.GetUserActivityRights(userId);

                AuditLogService auditLogService = new AuditLogService();
                auditLogService.AddUserLogs(new AuditLogBo()
                {
                    EventName = "UserActivity By UserID"+userId,
                    UserEmailId = "UserID",
                    LogTypeId = 2,
                    CreatedBy = "0",
                    CreatedDate = DateTime.Now
                });

            }
            catch (Exception e)
            {
                AuditLogService auditLogService = new AuditLogService();
                auditLogService.AddUserLogs(new AuditLogBo()
                {
                    ExceptionInfo = "UserId: " + userId + "StackTrace: " + e.StackTrace,
                    EventName = "GetUserActivity",
                    UserEmailId = "-",
                    LogTypeId = 3,
                    CreatedBy = "0",
                    CreatedDate = DateTime.Now
                });
            }

            return Ok(lstRoleActivityBo);
        }

        // POST: api/RoleActivity
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/RoleActivity/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/RoleActivity/5
        public void Delete(int id)
        {
        }
    }
}
