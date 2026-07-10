public static class MockUtils
{
    public static bool IsMock(string environmentName) =>
        string.Equals(environmentName, "mock", StringComparison.OrdinalIgnoreCase);

    public static string Read(string fileName) =>
        File.ReadAllText(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Clients", "Mocks", "Data", fileName));
}
