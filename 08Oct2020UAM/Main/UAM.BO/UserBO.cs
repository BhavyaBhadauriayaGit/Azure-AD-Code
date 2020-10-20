using System;

namespace UAM.BO
{
    public class UserBo
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public bool IsDefaultUser { get; set; }
        public bool IsLocked { get; set; }
        public int LoginCounter { get; set; }
        public DateTime PasswordExpirationDate { get; set; }
        public bool IsPasswordExpired { get; set; }
        public bool ToNotifyOnPasswordExpiration { get; set; }
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
        public bool IsLoggedInUser { get; set; }

    }
}
