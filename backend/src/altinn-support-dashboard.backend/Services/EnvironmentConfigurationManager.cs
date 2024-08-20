using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;

namespace AltinnDesktopTool.Configuration
{
    /// <summary>
    /// Manages the application environment configuration settings
    /// </summary>
    public class EnvironmentConfigurationManager
    {
        private const string ConfigPath = "EnvironmentConfigurations.xml";
        private static List<EnvironmentConfiguration> configurationList;

        private static EnvironmentConfiguration activeEnvironmentConfiguration;

        /// <summary>
        /// Returns the configuration settings
        /// </summary>
        public static List<EnvironmentConfiguration> EnvironmentConfigurations => configurationList ?? (configurationList = LoadEnvironmentConfigurations());

        /// <summary>
        /// Gets or sets active environment configuration. Default: prod
        /// </summary>
        public static EnvironmentConfiguration ActiveEnvironmentConfiguration
        {
            get
            {
                if (activeEnvironmentConfiguration == null)
                {
                    LoadEnvironmentConfigurations();
                }

                return activeEnvironmentConfiguration;
            }

            set
            {
                activeEnvironmentConfiguration = value;
            }
        }

        private static List<EnvironmentConfiguration> LoadEnvironmentConfigurations()
        {
            XElement xmlDoc = XElement.Load(ConfigPath);
            IEnumerable<EnvironmentConfiguration> configs = from config in xmlDoc.Descendants("EnvironmentConfiguration")
                                                            select
                                                            new EnvironmentConfiguration
                                                            {
                                                                Name = config?.Element("name")?.Value,
                                                                ThemeName = config?.Element("themeName")?.Value,
                                                                ApiKey = config?.Element("apiKey")?.Value,
                                                                BaseAddress = config?.Element("baseAddress")?.Value,
                                                                Thumbprint = config?.Element("thumbprint")?.Value,
                                                                IgnoreSslErrors = ParseBool(config?.Element("ignoreSslErrors")?.Value),
                                                                Timeout = ParseInt(config?.Element("timeout")?.Value)
                                                            };
            IEnumerable<EnvironmentConfiguration> environmentConfigurations = configs as IList<EnvironmentConfiguration> ?? configs.ToList();
            activeEnvironmentConfiguration = environmentConfigurations.Single(c => c.Name == "PROD");
            return environmentConfigurations.ToList();
        }

        private static int ParseInt(string value)
        {
            int ret;
            return value == null ? 0 : int.TryParse(value, out ret) ? ret : 0;
        }

        private static bool ParseBool(string value)
        {
            bool ret;
            return value != null && (bool.TryParse(value, out ret) && ret);
        }
    }
}
