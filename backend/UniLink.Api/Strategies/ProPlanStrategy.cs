using UniLink.Api.Models;
public class ProPlanStrategy : ILinkValidationStrategy
{
    public bool CanUserAddLink(User user) => true;
}