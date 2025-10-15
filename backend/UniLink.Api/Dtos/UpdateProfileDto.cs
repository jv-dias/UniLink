using System.ComponentModel.DataAnnotations;

namespace UniLink.Api.Dtos
{
    public class UpdateProfileDto
    {
        [StringLength(100)]
        public string? DisplayName { get; set; }

        [StringLength(255)]
        public string? Bio { get; set; }

        [Url]
        [StringLength(2048)]
        public string? ProfilePictureUrl { get; set; }
    }
}