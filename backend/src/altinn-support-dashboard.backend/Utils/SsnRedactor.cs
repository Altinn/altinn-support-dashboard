using Microsoft.Extensions.Compliance.Redaction;

namespace altinn_support_dashboard.Server.Utils;

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

        source[..6].CopyTo(destination[..6]); //Copies the first 6 characters to the destuination (a variable somewhere else)
        destination[6..].Fill('*'); //Fills the rest of the characters with asterisks

        return source.Length;
    }
}