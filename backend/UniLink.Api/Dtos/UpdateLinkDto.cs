using System.ComponentModel.DataAnnotations;

namespace UniLink.Api.Dtos
{
    public class UpdateLinkDto
    {
        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [Url]
        [StringLength(2048)]
        public string Url { get; set; } = string.Empty;

        [Required]
        public bool IsActive { get; set; }
    }
}