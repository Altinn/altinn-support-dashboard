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


        public static string SanitizeRedirectUrl(string? url)
        {
            //only relative redirect url's allowed

            if (!String.IsNullOrEmpty(url) && url.StartsWith('/') && !url.StartsWith("//") && !url.StartsWith(':'))
            {
                return url;
            }
            return "/";
        }
    }
}
