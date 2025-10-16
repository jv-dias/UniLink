using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UniLink.Api.Data;
using UniLink.Api.Dtos;
using UniLink.Api.Models;
using UniLink.Api.Services;

namespace UniLink.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        // Injeta o DbContext e a IConfiguration via construtor
        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            // Verifica se o email ou username já estão em uso
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email || u.Username == registerDto.Username))
            {
                return BadRequest("Email ou nome de usuário já existem.");
            }

            // Gera o hash da senha. NUNCA guarde a senha em texto puro!
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            var user = new User
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = passwordHash
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Retorna um status 201 Created
            return StatusCode(201, new { Message = "Usuário criado com sucesso!" });
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                return Unauthorized("Credenciais inválidas.");
            }

            // Usa o serviço Singleton para gerar o token
            var tokenService = JwtTokenService.GetInstance(_configuration);
            var token = tokenService.GenerateToken(user);

            return Ok(new { Token = token });
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("Chave JWT não configurada"));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("id", user.Id.ToString()), // Adicionamos o ID do usuário ao token
                    new Claim(ClaimTypes.Name, user.Username)
                }),
                Expires = DateTime.UtcNow.AddHours(8), // Duração do token
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}