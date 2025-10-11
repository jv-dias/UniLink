import { SignupForm } from "@/components/signup-form";
import { IconLink } from "@tabler/icons-react";

export default function Register() {
	return (
		<div className="grid min-h-screen lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex justify-center gap-2 md:justify-start">
					<a href="#" className="flex items-center gap-2 font-medium">
						<div className="flex size-6 items-center justify-center rounded-md">
							<IconLink className="size-4 text-primary" />
						</div>
						UniLink
					</a>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-xs">
						<SignupForm />
					</div>
				</div>
			</div>
			<div className="bg-muted relative hidden lg:block min-h-screen">
				<img
					src="/login-hero.jpg"
					alt="Image"
					className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
				/>
			</div>
		</div>
	);
}

