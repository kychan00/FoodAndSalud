import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthLayout } from "../../../components/layout/AuthLayout";
import { Button } from "../../../components/ui/Button";
import { InputField } from "../../../components/ui/InputField";
import { signInWithEmail } from "../auth.service";
import { useAuth } from "../useAuth";

const schema = z.object({
  email: z.string().trim().email("Escriba un correo válido."),
  password: z.string().min(1, "Escriba su contraseña."),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const { user, loading } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (values: FormValues) => {
    setServerError(null);

    const { error } = await signInWithEmail(values.email, values.password);

    if (error) {
      setServerError(
        error.message.toLowerCase().includes("email not confirmed")
          ? "Primero confirme su correo electrónico."
          : "Correo o contraseña incorrectos.",
      );

      return;
    }

    const from =
      (
        location.state as {
          from?: string;
        } | null
      )?.from ?? "/";

    navigate(from, {
      replace: true,
    });
  };

  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      description="Ingrese para continuar con su seguimiento personal."
    >
      <form
        className="auth-form"
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      >
        <InputField
          id="email"
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          placeholder="usted@correo.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <InputField
          id="password"
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        {serverError ? (
          <p className="auth-message auth-message--error" role="alert">
            {serverError}
          </p>
        ) : null}

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Entrando…" : "Iniciar sesión"}
        </Button>
      </form>

      <div className="auth-links">
        <Link to="/forgot-password">¿Olvidó su contraseña?</Link>

        <span className="auth-links__muted">¿Todavía no tiene cuenta?</span>

        <Link to="/signup">Crear una cuenta</Link>
      </div>
    </AuthLayout>
  );
}
