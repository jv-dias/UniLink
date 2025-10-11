using System;
using System.Collections.Generic;

namespace UniLink.Api.Models;

public partial class Link
{
    public ulong Id { get; set; }

    public ulong UserId { get; set; }

    public string Title { get; set; } = null!;

    public string Url { get; set; } = null!;

    public int Position { get; set; }

    public bool? IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
