import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="p-8 bg-white rounded shadow">
        <h1 className="text-3xl font-bold mb-4">Bem-vindo ao UniLink</h1>
        <Link to="/auth/login" className="text-primary underline">Entrar</Link>
      </div>
    </div>
  );
}
