using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UniLink.Api.Models;

namespace UniLink.Api.Services
{
    public class JwtTokenService
    {
        // A única instância do serviço (Singleton)
        private static JwtTokenService? _instance;
        private readonly IConfiguration _configuration;

        // O construtor é privado para impedir a criação de instâncias de fora
        private JwtTokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // O método estático que controla o acesso à instância singleton
        public static JwtTokenService GetInstance(IConfiguration configuration)
        {
            // Usa lazy initialization para criar a instância apenas na primeira vez
            _instance ??= new JwtTokenService(configuration);
            return _instance;
        }

        // A lógica de geração de token que movemos do AuthController
        public string GenerateToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("Chave JWT não configurada"));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("id", user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username)
                }),
                Expires = DateTime.UtcNow.AddHours(8),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}