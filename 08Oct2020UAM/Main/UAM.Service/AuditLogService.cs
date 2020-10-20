using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using UAM.BO;
using UAM.DL;

namespace UAM.Service
{
    public class AuditLogService
    {
        private readonly UtilityService _utilService = new UtilityService();
        public AuditLogBo AddUserLogs(AuditLogBo aLogBo)
        {
            try
            {
                AuditLogEngine aLogEngine = new AuditLogEngine();
                string paramValues = _utilService.ConvertAuditLogBoToString(aLogBo);
                aLogEngine.AddUserLogs(paramValues);
                return aLogBo;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public List<AuditLogBo> GetUserLogs()
        {
            
            try
            {
                List<AuditLogBo> lstAuditLogBo = new List<AuditLogBo>();
                AuditLogEngine aLogEngine = new AuditLogEngine();
                DataTable dTable = aLogEngine.GetUserLogs();

                if (dTable != null && dTable.Rows.Count > 0)
                {
                    lstAuditLogBo = _utilService.ConvertDataRowsToAuditLogBo(dTable);
                }

                return lstAuditLogBo;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            
        }

        public List<AuditLogBo> GetUserLogs(DateTime fromDate, DateTime toDate)
        {
            try
            {
                List<AuditLogBo> lstAuditLogBo = new List<AuditLogBo>();
                AuditLogEngine aLogEngine = new AuditLogEngine();
                DataTable dTable = aLogEngine.GetUserLogs();

                if (dTable != null && dTable.Rows.Count > 0)
                {
                    lstAuditLogBo = _utilService.ConvertDataRowsToAuditLogBo(dTable);
                }

                List<AuditLogBo> lstAuditFilterBo = lstAuditLogBo.Where(x => x.CreatedDate >= fromDate && x.CreatedDate <= toDate).ToList();
                return lstAuditFilterBo;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }

    }
}


