import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFound() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-muted p-6">
			<div className="p-8 bg-white rounded shadow text-center space-y-4">
				<h1 className="text-3xl font-bold">404 - Página não encontrada</h1>
				<p className="text-muted-foreground">A página que você tentou acessar não existe.</p>
				<Button asChild>
					<Link to="/">Voltar para início</Link>
				</Button>
			</div>
		</div>
	);
}

