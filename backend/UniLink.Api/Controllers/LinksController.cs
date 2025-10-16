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
    [Authorize] // Protege todos os endpoints neste controlador. Ninguém entra sem um token JWT válido.
    public class LinksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LinksController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/links/user/{username}
        // Retorna a lista de links públicos e ativos de um usuário específico.
        [HttpGet("user/{username}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetUserLinksByUsername(string username)
        {
            // 1. Encontra o usuário pelo seu nome de usuário público.
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

            // 2. Se o usuário não for encontrado, retorna um erro 404 Not Found.
            if (user == null)
            {
                return NotFound("Página de usuário não encontrada.");
            }

            // 3. Busca os links do usuário, mas com duas condições importantes:
            //    - Apenas os que pertencem ao usuário encontrado.
            //    - Apenas os que estão marcados como ativos (`IsActive == true`).
            var links = await _context.Links
                .Where(l => l.UserId == user.Id && l.IsActive == true)
                .OrderBy(l => l.Position)
                .Select(l => new LinkDto
                {
                    Id = l.Id,
                    Title = l.Title,
                    Url = l.Url,
                    Position = l.Position,
                    IsActive = l.IsActive ?? true
                })
                .ToListAsync();

            // 4. Retorna a lista de links públicos.
            return Ok(links);
        }

        // GET: api/links
        // Lista todos os links pertencentes ao usuário autenticado.
        [HttpGet]
        public async Task<IActionResult> GetMyLinks()
        {
            // Obtém o ID do usuário a partir do token JWT.
            // O '!' no final é para informar ao compilador que confiamos que o valor não será nulo,
            // pois o atributo [Authorize] garante que o token é válido.
            var userId = ulong.Parse(User.FindFirstValue("id")!);

            var links = await _context.Links
                .Where(l => l.UserId == userId)
                .OrderBy(l => l.Position)
                // Mapeia as entidades do banco para DTOs para evitar ciclos de referência.
                .Select(l => new LinkDto
                {
                    Id = l.Id,
                    Title = l.Title,
                    Url = l.Url,
                    Position = l.Position,
                    IsActive = l.IsActive ?? true // Converte o booleano anulável para um booleano padrão.
                })
                .ToListAsync();

            return Ok(links);
        }

        // POST: api/links
        // Cria um novo link para o usuário autenticado.
        [HttpPost]
        public async Task<IActionResult> CreateLink(CreateLinkDto createLinkDto)
        {
            var userId = ulong.Parse(User.FindFirstValue("id")!);

            // Precisamos buscar o usuário e seus links existentes para a validação.
            var user = await _context.Users
                                     .Include(u => u.Links) // Essencial para que 'user.Links.Count' funcione!
                                     .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                // Este caso é raro, pois o token já foi validado, mas é uma boa verificação de segurança.
                return Unauthorized();
            }

            // --- Padrão STRATEGY em Ação ---
            // Seleciona a estratégia de validação com base no plano do usuário.
            ILinkValidationStrategy validationStrategy = user.Plan == "Pro"
                ? new ProPlanStrategy()
                : new FreePlanStrategy();

            // Executa a estratégia. Se ela retornar 'false', bloqueia a criação.
            if (!validationStrategy.CanUserAddLink(user))
            {
                return BadRequest("Limite de links atingido para o plano Free.");
            }
            // --- Fim da Aplicação do Padrão Strategy ---

            var newLink = new Link
            {
                Title = createLinkDto.Title,
                Url = createLinkDto.Url,
                UserId = userId,
                // Define a posição do novo link como o último da lista.
                Position = (user.Links.Any() ? user.Links.Max(l => l.Position) : 0) + 1,
                IsActive = true // Links são criados como ativos por padrão.
            };

            _context.Links.Add(newLink);
            await _context.SaveChangesAsync();

            // Mapeia a nova entidade para um DTO antes de enviar a resposta.
            var linkDto = new LinkDto
            {
                Id = newLink.Id,
                Title = newLink.Title,
                Url = newLink.Url,
                Position = newLink.Position,
                IsActive = newLink.IsActive ?? true
            };

            // Retorna um status 201 Created com a localização do novo recurso e o próprio recurso.
            return CreatedAtAction(nameof(GetMyLinks), new { id = linkDto.Id }, linkDto);
        }

        // PUT: api/links/{id} - Atualiza um link existente.
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLink(ulong id, UpdateLinkDto updateLinkDto)
        {
            var userId = ulong.Parse(User.FindFirstValue("id")!);

            // 1. Encontra o link que o usuário quer editar.
            var link = await _context.Links.FindAsync(id);

            // 2. Verifica se o link existe e se pertence ao usuário logado.
            if (link == null)
            {
                return NotFound("Link não encontrado.");
            }
            if (link.UserId != userId)
            {
                // Um usuário não pode editar o link de outro!
                return Forbid("Acesso negado.");
            }

            // 3. Atualiza as propriedades do link com os dados do DTO.
            link.Title = updateLinkDto.Title;
            link.Url = updateLinkDto.Url;
            link.IsActive = updateLinkDto.IsActive;

            // 4. Salva as alterações no banco de dados.
            await _context.SaveChangesAsync();

            // Uma resposta 204 No Content é o padrão para um PUT bem-sucedido.
            return NoContent();
        }
        
        // DELETE: api/links/{id} - Exclui um link existente.
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLink(ulong id)
        {
            var userId = ulong.Parse(User.FindFirstValue("id")!);

            // 1. Encontra o link que o usuário quer excluir.
            var link = await _context.Links.FindAsync(id);

            // 2. Verifica se o link existe e se pertence ao usuário logado.
            if (link == null)
            {
                return NotFound("Link não encontrado.");
            }
            if (link.UserId != userId)
            {
                return Forbid("Acesso negado.");
            }

            // 3. Remove o link do contexto.
            _context.Links.Remove(link);

            // 4. Salva as alterações (confirma a exclusão) no banco.
            await _context.SaveChangesAsync();

            // Uma resposta 204 No Content é o padrão para um DELETE bem-sucedido.
            return NoContent();
        }
    }
}