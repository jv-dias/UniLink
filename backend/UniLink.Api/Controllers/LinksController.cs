using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using UniLink.Api.Data;
using UniLink.Api.Dtos;
using UniLink.Api.Models;
using UniLink.Api.Strategies;

namespace UniLink.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Protege todos os endpoints neste controlador
    public class LinksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LinksController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/links - Lista os links do utilizador autenticado
        [HttpGet]
        public async Task<IActionResult> GetMyLinks()
        {
            var userId = ulong.Parse(User.FindFirstValue("id")!);
            var links = await _context.Links
                .Where(l => l.UserId == userId)
                .OrderBy(l => l.Position)
                .ToListAsync();
            return Ok(links);
        }

        // POST: api/links - Cria um novo link para o utilizador autenticado
        [HttpPost]
        public async Task<IActionResult> CreateLink(CreateLinkDto createLinkDto)
        {
            var userId = ulong.Parse(User.FindFirstValue("id")!);
            var user = await _context.Users
                                     .Include(u => u.Links)
                                     .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return Unauthorized();

            // --- Padrão STRATEGY em ação ---
            ILinkValidationStrategy validationStrategy = user.Plan == "Pro"
                ? new ProPlanStrategy()
                : new FreePlanStrategy();

            if (!validationStrategy.CanUserAddLink(user))
            {
                return BadRequest("Limite de links atingido para o plano Free.");
            }
            // --- Fim do Padrão Strategy ---

            var newLink = new Link
            {
                Title = createLinkDto.Title,
                Url = createLinkDto.Url,
                UserId = userId,
                Position = (user.Links.Any() ? user.Links.Max(l => l.Position) : 0) + 1
            };

            _context.Links.Add(newLink);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMyLinks), new { id = newLink.Id }, newLink);
        }
    }
}