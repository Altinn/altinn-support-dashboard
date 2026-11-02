using Models.legalrequest;

namespace altinn_support_dashboard.Server.Services.Interfaces;

public interface ILegalRequestExportService
{
    byte[] BuildWorkbook(LegalRequestLookupRequest request, string caseHandler, DateTime exportedAt, List<EventsResponse> responses);
}
