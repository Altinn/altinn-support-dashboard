using System.Text.RegularExpressions;

namespace altinn_support_dashboard.Server.Utils
{
    public static class PhoneNumberUtils
    {
        public static (string? CountryCode, string LocalNumber) SplitPhoneNumber(string phoneNumber)
        {
            var trimmedPhoneNumber = NormalizeInternationalPrefix(phoneNumber).Replace(" ", "");

            var plusMatch = Regex.Match(trimmedPhoneNumber, @"^\+\d{1,2}");
            if (plusMatch.Success)
            {
                return (plusMatch.Value, trimmedPhoneNumber[plusMatch.Length..]);
            }

            // "47" + 8 digits  without "+" or "00" -> Norwegian number with country code
            if (Regex.IsMatch(trimmedPhoneNumber, @"^47\d{8}$"))
            {
                return ("+47", trimmedPhoneNumber[2..]);
            }

            return (null, trimmedPhoneNumber);
        }

    public static string NormalizeInternationalPrefix(string phoneNumber)
        {
            var trimmed = phoneNumber.Trim();
            return trimmed.StartsWith("00") ? "+" + trimmed[2..] : trimmed;
        }

        public static bool IsLocalNorwegianNumber(string phoneNumber)
        {
            var (countryCode, localNumber) = SplitPhoneNumber(phoneNumber);
            return countryCode == null && Regex.IsMatch(localNumber, @"^\d{8}$");
        }

        public static bool MatchesLocalNumber(string localNumber, string? storedPhone, string? storedCountryCode = null)
        {
            if (string.IsNullOrWhiteSpace(storedPhone)) return false; 

            var stored = NormalizeInternationalPrefix(storedPhone).Replace(" ", "");
            if (!stored.StartsWith("+") && !string.IsNullOrEmpty(storedCountryCode))
            {
                stored = NormalizeInternationalPrefix(storedCountryCode) + stored;
            }
            if (stored.StartsWith("+47"))
            {
                stored = stored[3..]; 
            }
            return stored == localNumber;
        }
    }
}