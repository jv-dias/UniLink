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
    [Authorize] // Protege TODOS os endpoints neste controlador.
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
                return Forbid("Você não tem permissão para editar este usuário.");
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
                return Forbid("Você não tem permissão para excluir este usuário.");
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
    }
}