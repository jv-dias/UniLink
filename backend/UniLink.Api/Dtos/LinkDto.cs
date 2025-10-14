namespace UniLink.Api.Dtos
{
    public class LinkDto
    {
        public ulong Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public int Position { get; set; }
        public bool IsActive { get; set; }
    }
}