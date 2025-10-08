import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Página não encontrada</h1>
        <p className="text-muted-foreground mb-6">A página que você procura não existe.</p>
        <Button onClick={() => navigate('/')}>Voltar para o início</Button>
      </div>
    </div>
  );
}
