using UniLink.Api.Models;
using UniLink.Api.Strategies;

namespace UniLink.Api.Strategies
{
    public class ProPlanStrategy : ILinkValidationStrategy
    {
        public bool CanUserAddLink(User user) => true;
    }
}