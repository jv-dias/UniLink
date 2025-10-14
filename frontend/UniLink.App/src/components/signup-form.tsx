import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/context/AuthContext";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      await register({ username, email, password });
      alert("Conta criada com sucesso! Faça login para continuar.");
      navigate("/auth/entrar");
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Criar sua conta</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Preencha o formulário abaixo para criar sua conta
          </p>
        </div>
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <Field>
          <FieldLabel htmlFor="username">Nome de usuário</FieldLabel>
          <Input
            id="username"
            type="text"
            placeholder="joaosilva"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            minLength={3}
            maxLength={50}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="exemplo@provedor.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FieldDescription>
            Usaremos este e-mail para contatá-lo. Não compartilharemos seu
            e-mail.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
          />
          <FieldDescription>Deve ter pelo menos 8 caracteres.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirmar senha</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <FieldDescription>Por favor confirme sua senha.</FieldDescription>
        </Field>
        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Criando..." : "Criar conta"}
          </Button>
        </Field>
        <FieldDescription className="px-6 text-center">
          Já tem uma conta? <a href="/auth/entrar">Entrar</a>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
