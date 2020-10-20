namespace UAM.Service
{
    public static class Enums
    {
        public enum ApiResponseMessage
        {
            UserCreated = 1,
            UserUpdated = 2,
            UserDeleted = 3,
            DuplicateEmail = 4,
            AvailableInLastThreePasswords = 5,
            NoUserDataUpdated = 6,
            Success = 7,
            Failed = 8,
            LogCreated = 9
        }
    }
}
