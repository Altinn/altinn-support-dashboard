public static class MockDataReader
{
    public static string Read(string fileName) =>
        File.ReadAllText(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Clients", "Mocks", "Data", fileName));
}
