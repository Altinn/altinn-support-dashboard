﻿using System.Text.RegularExpressions;

namespace altinn_support_dashboard.Server.Validation
{
    public static class ValidationService
    {
        public static bool IsValidPhoneNumber(string phoneNumber)
        {
            return !string.IsNullOrWhiteSpace(phoneNumber) && phoneNumber.All(char.IsDigit) && phoneNumber.Length == 8;
        }

        public static bool IsValidOrgNumber(string orgNumber)
        {
            return !string.IsNullOrWhiteSpace(orgNumber) && orgNumber.Length == 9 && long.TryParse(orgNumber, out _);
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

            return false;
        }
    }
}
