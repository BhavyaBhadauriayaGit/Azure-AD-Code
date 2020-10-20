using System;

namespace UAM.BO
{
    public class AuditLogBo
    {
        public int LogId { get; set; }
        public string EventName { get; set; }
        public string ExceptionInfo { get; set; }
        public int LogTypeId { get; set; }
        public string UserEmailId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
