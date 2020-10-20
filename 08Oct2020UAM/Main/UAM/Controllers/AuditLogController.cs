using System;
using System.Collections.Generic;
using System.Web.Http;
using UAM.BO;
using UAM.Service;

namespace UAM.Controllers
{
   // [Authorize]
    [RoutePrefix("api/AuditLog")]
    public class AuditLogController : ApiController
    {
        // GET: api/AuditLog
        [Route("Logs")]
        public IHttpActionResult Get()
        {
            try
            {
                AuditLogService auditLogService = new AuditLogService();
                List<AuditLogBo> lstAuditLogBo = auditLogService.GetUserLogs();
                return Ok(lstAuditLogBo);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return InternalServerError();
            }
           
            
        }

        // GET: api/AuditLog
        /// <summary>
        /// To get the list of Audit Logs based on start date and end date
        /// </summary>
        /// <param name="fromDate">The From Date is the Start Date of the Log Information </param>
        /// <param name="toDate"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("LogFilter/{fromdate}/{toDate}")]
        public IHttpActionResult Get(DateTime fromDate,DateTime toDate)
        {
            try
            {
                AuditLogService auditLogService = new AuditLogService();
                List<AuditLogBo> lstAuditLogBo = auditLogService.GetUserLogs(fromDate,toDate);
                
                return Ok(lstAuditLogBo);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return InternalServerError();
            }


        }

        // POST: api/AuditLog
        public IHttpActionResult Post([FromBody]AuditLogBo auditLogBo)
        {
            try
            {
                AuditLogService auditLogService = new AuditLogService();
                auditLogService.AddUserLogs(auditLogBo);
                return Ok(Enums.ApiResponseMessage.LogCreated.ToString());
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return InternalServerError();
            }
            
        }

        // PUT: api/AuditLog/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/AuditLog/5
        public void Delete(int id)
        {
        }
    }
}
