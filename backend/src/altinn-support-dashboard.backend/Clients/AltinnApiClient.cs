using AltinnDesktopTool.Configuration;
using System.Security.Cryptography.X509Certificates;

public class AltinnApiClient
{
    private readonly HttpClient _client;
    private readonly EnvironmentConfiguration _config;

    public AltinnApiClient(HttpClient client)
    {
        _config = EnvironmentConfigurationManager.ActiveEnvironmentConfiguration;

        var handler = new HttpClientHandler();

        // Load the certificate from the machine or user store using the thumbprint
        if (!string.IsNullOrEmpty(_config.Thumbprint))
        {
            var certificate = GetCertificateFromStore(_config.Thumbprint);
            if (certificate != null)
            {
                Console.WriteLine($"Certificate with thumbprint {_config.Thumbprint} found and added to handler.");
                handler.ClientCertificates.Add(certificate);
                handler.ClientCertificateOptions = ClientCertificateOption.Manual;
            }
            else
            {
                throw new Exception($"Certificate with thumbprint {_config.Thumbprint} not found.");
            }
        }

        if (_config.IgnoreSslErrors)
        {
            // Ignore SSL certificate errors if specified in the configuration
            handler.ServerCertificateCustomValidationCallback = (message, cert, chain, sslPolicyErrors) => true;
        }

        _client = new HttpClient(handler)
        {
            BaseAddress = new Uri(_config.BaseAddress),
            Timeout = TimeSpan.FromSeconds(_config.Timeout)
        };

        // Add API key to headers
        _client.DefaultRequestHeaders.Add("ApiKey", _config.ApiKey);
        Console.WriteLine($"API Key {_config.ApiKey} added to request headers.");
    }

    public async Task<string> GetOrganizationInfo(string orgNumber)
    {
        try
        {
            // Construct the full request URL
            var requestUrl = $"organizations/{orgNumber}?ForceEIAuthentication";
            Console.WriteLine($"Requesting URL: {_client.BaseAddress}{requestUrl}");

            var response = await _client.GetAsync(requestUrl);
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsStringAsync();
            }
            else
            {
                var responseBody = await response.Content.ReadAsStringAsync();
                throw new Exception($"API request failed with status code {response.StatusCode}: {responseBody}");
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred while calling the API: {ex.Message}", ex);
        }
    }

    public async Task<string> GetOrganizationsByPhoneNumber(string phoneNumber)
    {
        try
        {
            var requestUrl = $"organizations?phoneNumber={phoneNumber}&ForceEIAuthentication";
            Console.WriteLine($"Requesting URL: {_client.BaseAddress}{requestUrl}");

            var response = await _client.GetAsync(requestUrl);
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsStringAsync();
            }
            else
            {
                var responseBody = await response.Content.ReadAsStringAsync();
                throw new Exception($"API request failed with status code {response.StatusCode}: {responseBody}");
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred while calling the API: {ex.Message}", ex);
        }
    }

    public async Task<string> GetOrganizationsByEmail(string email)
    {
        try
        {
            var requestUrl = $"organizations?email={email}&ForceEIAuthentication";
            Console.WriteLine($"Requesting URL: {_client.BaseAddress}{requestUrl}");

            var response = await _client.GetAsync(requestUrl);
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsStringAsync();
            }
            else
            {
                var responseBody = await response.Content.ReadAsStringAsync();
                throw new Exception($"API request failed with status code {response.StatusCode}: {responseBody}");
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred while calling the API: {ex.Message}", ex);
        }
    }

    public async Task<string> GetPersonalContacts(string orgNumber)
    {
        try
        {
            // Construct the full request URL
            var requestUrl = $"organizations/{orgNumber}/personalcontacts?ForceEIAuthentication";
            Console.WriteLine($"Requesting URL: {_client.BaseAddress}{requestUrl}");

            var response = await _client.GetAsync(requestUrl);
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsStringAsync();
            }
            else
            {
                var responseBody = await response.Content.ReadAsStringAsync();
                throw new Exception($"API request failed with status code {response.StatusCode}: {responseBody}");
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"An error occurred while calling the API: {ex.Message}", ex);
        }
    }

    private X509Certificate2 GetCertificateFromStore(string thumbprint)
    {
        // Clean the thumbprint by removing any potential spaces or hidden characters
        string cleanedThumbprint = thumbprint.Replace(" ", "").ToUpperInvariant();

        using (X509Store store = new X509Store(StoreName.My, StoreLocation.LocalMachine))
        {
            store.Open(OpenFlags.ReadOnly);
            var certs = store.Certificates.Find(X509FindType.FindByThumbprint, cleanedThumbprint, false);
            if (certs.Count > 0)
            {
                Console.WriteLine($"Certificate found in LocalMachine store with thumbprint {cleanedThumbprint}");
                return certs[0];
            }
        }

        using (X509Store store = new X509Store(StoreName.My, StoreLocation.CurrentUser))
        {
            store.Open(OpenFlags.ReadOnly);
            var certs = store.Certificates.Find(X509FindType.FindByThumbprint, cleanedThumbprint, false);
            if (certs.Count > 0)
            {
                Console.WriteLine($"Certificate found in CurrentUser store with thumbprint {cleanedThumbprint}");
                return certs[0];
            }
        }

        return null;
    }
}
