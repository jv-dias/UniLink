using System.ComponentModel.DataAnnotations;

namespace UniLink.Api.Dtos
{
    public class UpdateUserDto
    {
        [Required]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "O nome de usuário deve ter entre 3 e 50 caracteres.")]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}