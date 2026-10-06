import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthLayout } from "../../../components/layout/AuthLayout";
import { Button } from "../../../components/ui/Button";
import { InputField } from "../../../components/ui/InputField";
import { signUpWithEmail } from "../auth.service";
import { useAuth } from "../useAuth";

const schema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Escriba su nombre.")
      .max(80, "El nombre es demasiado largo."),

    email: z.string().trim().email("Escriba un correo válido."),

    password: z.string().min(8, "Use al menos 8 caracteres."),

    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden.",
  });

type FormValues = z.infer<typeof schema>;

export function SignUpPage() {
  const { user, loading } = useAuth();

  const navigate = useNavigate();

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

    const { data, error } = await signUpWithEmail(
      values.name,
      values.email,
      values.password,
    );

    if (error) {
      setServerError(
        "No pudimos crear la cuenta. Revise los datos e inténtelo nuevamente.",
      );

      return;
    }

    if (data.session) {
      navigate("/", {
        replace: true,
      });

      return;
    }

    sessionStorage.setItem("foodandsalud.pending-email", values.email);

    navigate("/check-email", {
      replace: true,
    });
  };

  return (
    <AuthLayout
      title="Crear cuenta"
      description="Empiece a registrar sus hábitos en menos de un minuto."
    >
      <form
        className="auth-form"
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      >
        <InputField
          id="name"
          label="Nombre"
          type="text"
          autoComplete="name"
          placeholder="Su nombre"
          error={errors.name?.message}
          {...register("name")}
        />

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
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          error={errors.password?.message}
          {...register("password")}
        />

        <InputField
          id="confirm-password"
          label="Repita la contraseña"
          type="password"
          autoComplete="new-password"
          placeholder="Repita su contraseña"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {serverError ? (
          <p className="auth-message auth-message--error" role="alert">
            {serverError}
          </p>
        ) : null}

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
        </Button>
      </form>

      <div className="auth-links">
        <span className="auth-links__muted">¿Ya tiene una cuenta?</span>

        <Link to="/login">Iniciar sesión</Link>
      </div>
    </AuthLayout>
  );
}
