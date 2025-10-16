using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using UniLink.Api.Data;
using UniLink.Api.Dtos;

namespace UniLink.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // PUT: api/users/{id} - Atualiza os dados do usuário.
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(ulong id, UpdateUserDto updateUserDto)
        {
            // 1. Obtém o ID do usuário a partir do token JWT. Este é o ID do usuário AUTENTICADO.
            var userIdFromToken = ulong.Parse(User.FindFirstValue("id")!);

            // 2. VERIFICAÇÃO DE SEGURANÇA CRUCIAL:
            // Garante que o usuário autenticado só possa editar a sua própria conta.
            if (id != userIdFromToken)
            {
                // Retorna 403 Forbidden: você está autenticado, mas não tem permissão para esta ação.
                return Forbid();
            }

            // 3. Busca o usuário no banco de dados.
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            // 4. Verifica se o novo email ou username já estão em uso por OUTRO usuário.
            if (await _context.Users.AnyAsync(u => u.Id != id && (u.Username == updateUserDto.Username || u.Email == updateUserDto.Email)))
            {
                return BadRequest("O novo email ou nome de usuário já está em uso.");
            }

            // 5. Atualiza os dados e salva.
            user.Username = updateUserDto.Username;
            user.Email = updateUserDto.Email;

            await _context.SaveChangesAsync();

            return NoContent(); // Resposta padrão de sucesso para um PUT.
        }

        // DELETE: api/users/{id} - Exclui a conta do usuário.
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(ulong id)
        {
            // 1. Obtém o ID do usuário do token.
            var userIdFromToken = ulong.Parse(User.FindFirstValue("id")!);

            // 2. VERIFICAÇÃO DE SEGURANÇA CRUCIAL:
            // Garante que o usuário só possa excluir a sua própria conta.
            if (id != userIdFromToken)
            {
                return Forbid();
            }

            // 3. Busca o usuário no banco de dados.
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            // 4. Remove o usuário e salva.
            // Graças ao "ON DELETE CASCADE" no nosso schema, todos os links e a página
            // deste usuário serão automaticamente excluídos do banco.
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent(); // Resposta padrão de sucesso para um DELETE.
        }

        // PATCH: api/users/{id}/upgrade
        // Endpoint dedicado para fazer o upgrade do plano de um usuário para "Pro".
        [HttpPatch("{id}/upgrade")]
        public async Task<IActionResult> UpgradeToPro(ulong id)
        {
            // 1. Obtém o ID do usuário a partir do token JWT (o usuário autenticado).
            var userIdFromToken = ulong.Parse(User.FindFirstValue("id")!);

            // 2. VERIFICAÇÃO DE SEGURANÇA CRUCIAL:
            // Garante que o usuário autenticado só possa fazer o upgrade da sua própria conta.
            if (id != userIdFromToken)
            {
                return Forbid();
            }

            // 3. Busca o usuário no banco de dados.
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            // 4. Lógica de Negócio: Altera o plano e salva.
            // (Opcional) Podemos verificar se ele já é Pro para evitar uma escrita desnecessária no banco.
            if (user.Plan == "Pro")
            {
                return Ok(new { Message = "O usuário já está no plano Pro." });
            }

            user.Plan = "Pro";
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Upgrade para o plano Pro realizado com sucesso!" });
        }

        // PATCH: api/users/{id}/downgrade
        // Endpoint dedicado para fazer o downgrade do plano de um usuário para "Free".
        [HttpPatch("{id}/downgrade")]
        public async Task<IActionResult> DowngradeToFree(ulong id)
        {
            // 1. Obtém o ID do usuário a partir do token JWT.
            var userIdFromToken = ulong.Parse(User.FindFirstValue("id")!);

            // 2. VERIFICAÇÃO DE SEGURANÇA: Garante que o usuário só possa alterar a própria conta.
            if (id != userIdFromToken)
            {
                return Forbid();
            }

            // 3. Busca o usuário no banco de dados.
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("Usuário não encontrado.");
            }

            // 4. Lógica de Negócio: Altera o plano para "Free" e salva.
            // (Opcional) Verifica se ele já é Free para evitar uma escrita desnecessária.
            if (user.Plan == "Free")
            {
                return Ok(new { Message = "O usuário já está no plano Free." });
            }

            user.Plan = "Free";
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Downgrade para o plano Free realizado com sucesso!" });
        }
    }
}