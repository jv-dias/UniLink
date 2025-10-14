using UniLink.Api.Models;

namespace UniLink.Api.Strategies{
	public interface ILinkValidationStrategy
	{
		bool CanUserAddLink(User user);
	}
}