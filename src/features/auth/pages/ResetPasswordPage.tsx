import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthLayout } from "../../../components/layout/AuthLayout";
import { Button } from "../../../components/ui/Button";
import { InputField } from "../../../components/ui/InputField";
import { signOut, updatePassword } from "../auth.service";
import { useAuth } from "../useAuth";

const schema = z
  .object({
    password: z.string().min(8, "Use al menos 8 caracteres."),

    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden.",
  });

type FormValues = z.infer<typeof schema>;

export function ResetPasswordPage() {
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

  if (loading) {
    return (
      <main className="app-loading">
        <div className="brand-mark">F&S</div>

        <p>Validando enlace…</p>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const onSubmit = async (values: FormValues) => {
    setServerError(null);

    const { error } = await updatePassword(values.password);

    if (error) {
      setServerError(
        "No pudimos cambiar la contraseña. Solicite un enlace nuevo.",
      );

      return;
    }

    await signOut();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <AuthLayout
      title="Nueva contraseña"
      description="Elija una contraseña nueva para su cuenta."
    >
      <form
        className="auth-form"
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      >
        <InputField
          id="password"
          label="Nueva contraseña"
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
          {isSubmitting ? "Guardando…" : "Guardar contraseña"}
        </Button>
      </form>
    </AuthLayout>
  );
}
