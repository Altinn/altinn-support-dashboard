namespace Models.altinn3Dtos;

public class ResourceDetailsDto
{
    public required ResourceTitle Title { get; set; }
    public required string Identifier { get; set; }
}

public class ResourceTitle
{
    public required string NB { get; set; }
    public required string NN { get; set; }
    public required string EN { get; set; }
}
