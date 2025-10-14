using System.ComponentModel.DataAnnotations;

namespace UniLink.Api.Dtos
{
    public class CreateLinkDto
    {
        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [Url]
        [StringLength(2048)]
        public string Url { get; set; } = string.Empty;
    }
}