using System.Text.RegularExpressions;


namespace altinn_support_dashboard.Server.Utils
{
    public static class ValidationService
    {
        private static readonly Regex SsnPattern = new(@"^\d{11}$");

        public static bool IsValidPhoneNumber(string phoneNumber)
        {
            return !string.IsNullOrWhiteSpace(phoneNumber) && ((phoneNumber[0] == '+' && phoneNumber.Skip(1).All(char.IsDigit)) || (phoneNumber.All(char.IsDigit)));
        }

        public static bool IsValidOrgNumber(string orgNumber)
        {
            return !string.IsNullOrWhiteSpace(orgNumber) && orgNumber.Length == 9 && orgNumber.All(char.IsDigit);
        }
        public static bool IsValidEmail(string email)
        {
            return Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$");
        }

        public static bool IsValidGuid(string guid)
        {
            if (Guid.TryParse(guid, out _))
            {
                return true;
            }
            return false;

        }

        public static bool IsValidPartyId(string partyId)
        {
            if (partyId.All(char.IsDigit) && partyId.Length == 8)
            {
                return true;
            }
            return false;
        }

        public static bool IsValidSubjectOrReportee(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return false;
            }

            if (value.Length == 9 && long.TryParse(value, out _))
            {
                return true;
            }

            if (value.Length == 11 && long.TryParse(value, out _))
            {
                return true;
            }

            if (IsValidSsnToken(value))
            {
                return true;
            }

            return false;
        }

        public static bool IsValidNotificationOrderId(string orderId)
        {
            return !string.IsNullOrWhiteSpace(orderId) && Guid.TryParseExact(orderId, "D", out _);
        }

        public static bool IsValidSsnToken(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                return false;
            }
            if (Guid.TryParse(token, out _))
            {
                return true;
            }

            return false;
        }
        public static bool isValidSsn(string ssn)
        {

            return !string.IsNullOrEmpty(ssn) && SsnPattern.IsMatch(ssn);
        }

        public static bool IsValidOrgNumberV2(string orgNumber)
        {
            if (string.IsNullOrWhiteSpace(orgNumber) || orgNumber.Length != 9 || !orgNumber.All(char.IsDigit))
            {
                return false;
            }

            var digits = orgNumber.Select(c => c - '0').ToArray();
            int[] weights = { 3, 2, 7, 6, 5, 4, 3, 2 };

            int sum = 0;
            for (int i = 0; i < weights.Length; i++)
            {
                sum += digits[i] * weights[i];
            }

            int remainder = sum % 11;
            int checkDigit = remainder == 0 ? 0 : 11 - remainder;

            return checkDigit != 10 && checkDigit == digits[8];
        }


        public static string SanitizeRedirect(string? url)
        {
            //only relative redirect url's allowed

            if (!String.IsNullOrEmpty(url) && url.StartsWith('/') && !url.StartsWith("//") && !url.StartsWith(':'))
            {
                return url;
            }
            return "/";
        }

        public static bool validBaseUrl(string url)
        {
            var uri = new Uri(url);

            if (uri.Scheme != "https")
            {
                return false;
            }
            return true;

        }


        public static string SanitizeForLog(string value)
        {
            if (value == null)
            {
                return string.Empty;
            }
            // Remove all control characters to prevent log forging and log confusion.
            var chars = value.Where(c => !char.IsControl(c)).ToArray();
            return new string(chars);
        }
    }
}
