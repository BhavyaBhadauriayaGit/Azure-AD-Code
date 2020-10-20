using System;

namespace UAM.BO
{
    public class RoleActivityBo
    {
        public int RoleId { get; set; }
        public int ActivityRightId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
