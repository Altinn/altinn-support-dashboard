namespace altinn_support_dashboard.Server.Models.correspondence;

public class CorrespondenceAttachment
{

    public DateTime Created { get; set; }
    public string? DataLocationType { get; set; }
    public string? Status { get; set; }
    public string? StatusText { get; set; }
    public DateTime? StatusChanged { get; set; }
    public string? DataType { get; set; }

}


