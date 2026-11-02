using System.Text.Json;
using altinn_support_dashboard.Server.Services.Interfaces;
using ClosedXML.Excel;
using Models.legalrequest;

namespace altinn_support_dashboard.Server.Services;

public class LegalRequestExportService : ILegalRequestExportService
{
    private const string FrontPageSheet = "Forside";
    private const string ColumnsSheet = "Kolonner";
    private const string DateTimeFormat = "yyyy-mm-dd hh:mm:ss";
    private const string DateFormat = "yyyy-mm-dd";
    private const int MaxSheetNameLength = 31;
    private static readonly char[] InvalidSheetNameChars = [':', '\\', '/', '?', '*', '[', ']'];

    public byte[] BuildWorkbook(LegalRequestLookupRequest request, string caseHandler, DateTime exportedAt, List<EventsResponse> responses)
    {
        using var workbook = new XLWorkbook();
        var usedSheetNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { FrontPageSheet, ColumnsSheet };

        AddFrontPage(workbook.AddWorksheet(FrontPageSheet), request, caseHandler, exportedAt, responses);

        var datasetSheets = new List<(string Provider, string SheetName, DatasetDto Dataset)>();
        foreach (var response in responses)
        {
            foreach (var dataset in response.Datasets)
            {
                var sheetName = UniqueSheetName(dataset.Title, usedSheetNames);
                AddDatasetSheet(workbook.AddWorksheet(sheetName), dataset);
                datasetSheets.Add((response.Provider ?? "", sheetName, dataset));
            }
        }

        AddColumnsSheet(workbook.AddWorksheet(ColumnsSheet), datasetSheets);

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }

    private static void AddFrontPage(IXLWorksheet sheet, LegalRequestLookupRequest request, string caseHandler, DateTime exportedAt, List<EventsResponse> responses)
    {
        var details = new (string Label, XLCellValue Value)[]
        {
            ("Saksreferanse", request.CaseReference),
            ("Saksbehandler", caseHandler),
            ("Eksportert (UTC)", exportedAt),
            ("Periode fra (UTC)", request.From.UtcDateTime),
            ("Periode til (UTC, ikke inkludert)", request.To.UtcDateTime),
            ("Tidssone", "UTC"),
            ("Organisasjon", string.IsNullOrEmpty(request.OrganizationNumber) ? "Kun personlig" : request.OrganizationNumber),
            ("Kategorier", request.Categories is { Count: > 0 } ? string.Join(", ", request.Categories) : "Alle"),
        };

        var row = 1;
        foreach (var (label, value) in details)
        {
            sheet.Cell(row, 1).Value = label;
            sheet.Cell(row, 1).Style.Font.Bold = true;
            sheet.Cell(row, 2).Value = value;
            if (value.IsDateTime)
            {
                sheet.Cell(row, 2).Style.DateFormat.Format = DateTimeFormat;
            }
            row++;
        }

        row++;
        WriteHeader(sheet, row, ["Leverandør", "Fullstendighet", "Begrensninger"]);
        foreach (var response in responses)
        {
            row++;
            sheet.Cell(row, 1).Value = response.Provider ?? "";
            sheet.Cell(row, 2).Value = response.Completeness == "partial" ? "Delvis" : "Fullstendig";
            sheet.Cell(row, 3).Value = string.Join("\n", response.Limitations.Select(l => $"{l.Code}: {l.Description}"));
            sheet.Cell(row, 3).Style.Alignment.WrapText = true;
        }

        sheet.Columns().AdjustToContents();
    }

    private static void AddDatasetSheet(IXLWorksheet sheet, DatasetDto dataset)
    {
        WriteHeader(sheet, 1, dataset.Columns.Select(c => c.Title).ToArray());

        var row = 2;
        foreach (var values in dataset.Rows)
        {
            for (var col = 0; col < dataset.Columns.Count; col++)
            {
                var column = dataset.Columns[col];
                if (values.TryGetValue(column.Key, out var value))
                {
                    WriteValue(sheet.Cell(row, col + 1), column.Type, value);
                }
            }
            row++;
        }

        sheet.SheetView.FreezeRows(1);
        sheet.Columns().AdjustToContents();
    }

    private static void AddColumnsSheet(IXLWorksheet sheet, List<(string Provider, string SheetName, DatasetDto Dataset)> datasetSheets)
    {
        WriteHeader(sheet, 1, ["Leverandør", "Ark", "Kolonne", "Type", "Beskrivelse"]);

        var row = 2;
        foreach (var (provider, sheetName, dataset) in datasetSheets)
        {
            sheet.Cell(row, 1).Value = provider;
            sheet.Cell(row, 2).Value = sheetName;
            sheet.Cell(row, 5).Value = dataset.Description ?? "";
            sheet.Row(row).Style.Font.Bold = true;
            row++;

            foreach (var column in dataset.Columns)
            {
                sheet.Cell(row, 1).Value = provider;
                sheet.Cell(row, 2).Value = sheetName;
                sheet.Cell(row, 3).Value = column.Title;
                sheet.Cell(row, 4).Value = column.Type;
                sheet.Cell(row, 5).Value = column.Description ?? "";
                row++;
            }
        }

        sheet.SheetView.FreezeRows(1);
        sheet.Columns().AdjustToContents();
    }

    private static void WriteHeader(IXLWorksheet sheet, int row, string[] titles)
    {
        for (var col = 0; col < titles.Length; col++)
        {
            sheet.Cell(row, col + 1).Value = titles[col];
            sheet.Cell(row, col + 1).Style.Font.Bold = true;
        }
    }

    private static void WriteValue(IXLCell cell, string type, JsonElement value)
    {
        switch (type)
        {
            case "datetime" when value.ValueKind == JsonValueKind.String && value.TryGetDateTimeOffset(out var dateTime):
                cell.Value = dateTime.UtcDateTime;
                cell.Style.DateFormat.Format = DateTimeFormat;
                break;
            case "date" when value.ValueKind == JsonValueKind.String && value.TryGetDateTime(out var date):
                cell.Value = date;
                cell.Style.DateFormat.Format = DateFormat;
                break;
            case "integer" or "decimal" when value.ValueKind == JsonValueKind.Number:
                cell.Value = value.GetDouble();
                break;
            case "boolean" when value.ValueKind is JsonValueKind.True or JsonValueKind.False:
                cell.Value = value.GetBoolean();
                break;
            default:
                if (value.ValueKind == JsonValueKind.String)
                {
                    cell.Value = value.GetString() ?? "";
                }
                else if (value.ValueKind != JsonValueKind.Null)
                {
                    cell.Value = value.GetRawText();
                }
                break;
        }
    }

    private static string UniqueSheetName(string title, HashSet<string> usedNames)
    {
        var name = new string(title.Where(c => !InvalidSheetNameChars.Contains(c)).ToArray()).Trim('\'', ' ');
        if (name.Length == 0)
        {
            name = "Datasett";
        }
        name = name.Length > MaxSheetNameLength ? name[..MaxSheetNameLength] : name;

        var candidate = name;
        for (var i = 2; !usedNames.Add(candidate); i++)
        {
            var suffix = $" ({i})";
            candidate = (name.Length + suffix.Length > MaxSheetNameLength ? name[..(MaxSheetNameLength - suffix.Length)] : name) + suffix;
        }
        return candidate;
    }
}
