using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using UniLink.Api.Data;
using UniLink.Api.Dtos;
using UniLink.Api.Models;

namespace UniLink.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProfileController(AppDbContext context)
        {
            _context = context;
        }

        // --- ENDPOINT PÚBLICO ---
        // GET: api/profile/{username}
        // Retorna o perfil público completo de um usuário (infos + links ativos).
        [HttpGet("{username}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublicProfile(string username)
        {
            // 1. Busca o usuário pelo username, já incluindo os dados da página e os links.
            var user = await _context.Users
                .Include(u => u.Page)   // Inclui os dados da tabela 'pages'
                .Include(u => u.Links)  // Inclui a lista de links
                .FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            // 2. Monta o DTO de perfil público.
            var publicProfile = new PublicProfileDto
            {
                Username = user.Username,
                DisplayName = user.Page?.DisplayName,
                Bio = user.Page?.Bio,
                ProfilePictureUrl = user.Page?.ProfilePictureUrl,
                // Filtra para incluir apenas os links ativos e os mapeia para LinkDto.
                Links = user.Links
                    .Where(l => l.IsActive ?? true)
                    .OrderBy(l => l.Position)
                    .Select(l => new LinkDto
                    {
                        Id = l.Id,
                        Title = l.Title,
                        Url = l.Url,
                        Position = l.Position,
                        IsActive = l.IsActive ?? true
                    }).ToList()
            };

            return Ok(publicProfile);
        }


        // --- ENDPOINTS PROTEGIDOS (para o usuário gerenciar seu próprio perfil) ---

        // GET: api/profile/me
        // Retorna os dados do perfil do usuário autenticado (para preencher um formulário de edição).
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = ulong.Parse(User.FindFirstValue("id")!);
            var page = await _context.Pages.FindAsync(userId);

            // Se o usuário ainda não tem um perfil, retorna um objeto vazio.
            if (page == null)
            {
                return Ok(new UpdateProfileDto());
            }

            var profileDto = new UpdateProfileDto
            {
                DisplayName = page.DisplayName,
                Bio = page.Bio,
                ProfilePictureUrl = page.ProfilePictureUrl
            };

            return Ok(profileDto);
        }

        // PUT: api/profile/me
        // Atualiza (ou cria) as informações do perfil do usuário autenticado.
        [HttpPut("me")]
        [Authorize]
        public async Task<IActionResult> UpdateMyProfile(UpdateProfileDto updateProfileDto)
        {
            var userId = ulong.Parse(User.FindFirstValue("id")!);
            var page = await _context.Pages.FindAsync(userId);

            // Se o usuário ainda não tem um perfil, cria um novo.
            if (page == null)
            {
                page = new Page
                {
                    UserId = userId,
                    DisplayName = updateProfileDto.DisplayName,
                    Bio = updateProfileDto.Bio,
                    ProfilePictureUrl = updateProfileDto.ProfilePictureUrl
                };
                _context.Pages.Add(page);
            }
            else // Se já tem, apenas atualiza.
            {
                page.DisplayName = updateProfileDto.DisplayName;
                page.Bio = updateProfileDto.Bio;
                page.ProfilePictureUrl = updateProfileDto.ProfilePictureUrl;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}