namespace Models.altinn3Dtos;

public class ResourceDetailsDto
{
    public required ResourceTitle Title { get; set; }
    public required string Identifier { get; set; }
}

public class ResourceTitle
{
    public string? NB { get; set; }
    public string? NN { get; set; }
    public string? EN { get; set; }

    //Returns first found title or null if none are given
    public string? FindFirstTitle()
    {
        return NB ?? NN ?? EN ?? null;
    }
}
