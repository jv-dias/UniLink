using UniLink.Api.Models;
public class FreePlanStrategy : ILinkValidationStrategy
{
    public bool CanUserAddLink(User user) => user.Links.Count < 5;
}