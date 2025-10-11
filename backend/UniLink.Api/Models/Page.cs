using System;
using System.Collections.Generic;

namespace UniLink.Api.Models;

public partial class Page
{
    public ulong UserId { get; set; }

    public string? DisplayName { get; set; }

    public string? Bio { get; set; }

    public string? ProfilePictureUrl { get; set; }

    public virtual User User { get; set; } = null!;
}
