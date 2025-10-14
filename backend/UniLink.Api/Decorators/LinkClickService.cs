using Microsoft.EntityFrameworkCore;
using UniLink.Api.Data;

namespace UniLink.Api.Decorators
{
    public class LinkClickService : ILinkClickService
    {
        private readonly AppDbContext _context;
        public LinkClickService(AppDbContext context) => _context = context;

        public async Task<string?> ProcessClickAndGetUrlAsync(ulong linkId)
        {
            var link = await _context.Links.FindAsync(linkId);
            return link?.Url;
        }
    }
}