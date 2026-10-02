using System.Text.RegularExpressions;

namespace altinn_support_dashboard.Server.Utils
{
    public static class PhoneNumberUtils
    {
        public static (string? CountryCode, string LocalNumber) SplitPhoneNumber(string phoneNumber)
        {
            var trimmedPhoneNumber = phoneNumber.Trim();
            var plusMatch = Regex.Match(trimmedPhoneNumber, @"^\+\d{1,2}");
            if (plusMatch.Success)
            {
                return (plusMatch.Value, trimmedPhoneNumber[plusMatch.Length..]);
            }

            var zeroZeroMatch = Regex.Match(trimmedPhoneNumber, @"^00\d\d{1,2}");
            if (zeroZeroMatch.Success)
            {
                var countryCode = "+" + zeroZeroMatch.Value[2..];
                return (countryCode, trimmedPhoneNumber[zeroZeroMatch.Length..]);
            }

            return (null, trimmedPhoneNumber);
        }

    public static string NormalizeInternationalPrefix(string phoneNumber)
        {
            var trimmed = phoneNumber.Trim();
            return trimmed.StartsWith("00") ? "+" + trimmed[2..] : trimmed;
        }
    }
}