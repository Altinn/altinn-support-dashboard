using Microsoft.Extensions.Compliance.Redaction;

namespace altinn_support_dashboard.Server.Redacting;

public class SsnRedactor : Redactor
{
    public override int GetRedactedLength(ReadOnlySpan<char> input)
    {
        return input.Length;
    }

    public override int Redact(ReadOnlySpan<char> source, Span<char> destination)
    {
        if (source.Length != 11)
        {
            source.CopyTo(destination);
            return source.Length;
        }

        source[..6].CopyTo(destination[..6]);
        destination[6..].Fill('*');

        return source.Length;
    }
}