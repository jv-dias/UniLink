using UniLink.Api.Models;

namespace UniLink.Api.Strategies{
    public class FreePlanStrategy : ILinkValidationStrategy
    {
        public bool CanUserAddLink(User user) => user.Links.Count < 5;
    }
}