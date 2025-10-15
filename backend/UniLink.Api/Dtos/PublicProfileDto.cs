namespace UniLink.Api.Dtos
{
    public class PublicProfileDto
    {
        public string Username { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        public string? Bio { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public List<LinkDto> Links { get; set; } = new List<LinkDto>();
    }
}