using System.Text.RegularExpressions;

namespace altinn_support_dashboard.Server.Utils
{
    public static class PhoneNumberUtils
    {
        public static (string? CountryCode, string LocalNumber) SplitPhoneNumber(string phoneNumber)
        {
            var trimmedPhoneNumber = phoneNumber.Trim();
            var match = Regex.Match(trimmedPhoneNumber, @"^\+\d{1,2}");
            return match.Success
                ? (match.Value, trimmedPhoneNumber[match.Length..])
                : (null, trimmedPhoneNumber);
        }
    }
}