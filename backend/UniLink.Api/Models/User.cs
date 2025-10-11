using System;
using System.Collections.Generic;

namespace UniLink.Api.Models;

public partial class User
{
    public ulong Id { get; set; }

    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ICollection<Link> Links { get; set; } = new List<Link>();

    public virtual Page? Page { get; set; }
}
