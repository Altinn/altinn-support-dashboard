using System.Text.Json;

namespace Models.legalrequest;

public class EventsResponse
{
    public string? Provider { get; set; }
    public string Completeness { get; set; } = "complete";
    public List<LimitationDto> Limitations { get; set; } = [];
    public List<DatasetDto> Datasets { get; set; } = [];
}

public class LimitationDto
{
    public required string Code { get; set; }
    public string? Description { get; set; }
}

public class DatasetDto
{
    public required string Name { get; set; }
    public required string Title { get; set; }
    public string? Category { get; set; }
    public string? Description { get; set; }
    public List<ColumnDto> Columns { get; set; } = [];
    public List<Dictionary<string, JsonElement>> Rows { get; set; } = [];
}

public class ColumnDto
{
    public required string Key { get; set; }
    public required string Title { get; set; }
    public required string Type { get; set; }
    public string? Description { get; set; }
}
