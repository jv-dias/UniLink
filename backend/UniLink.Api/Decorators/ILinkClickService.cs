namespace UniLink.Api.Decorators
{
    public interface ILinkClickService
    {
        Task<string?> ProcessClickAndGetUrlAsync(ulong linkId);
    }
}