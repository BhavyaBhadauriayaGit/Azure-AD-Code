using System;

namespace UAM.BO
{
    public class UserPasswordHistoryBo
    {
        public int UserId { get; set; }
        public string Password { get; set; }
        public DateTime LastUsed { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
