import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthLayout } from "../../../components/layout/AuthLayout";
import { Button } from "../../../components/ui/Button";
import { InputField } from "../../../components/ui/InputField";
import { requestPasswordReset } from "../auth.service";

const schema = z.object({
  email: z.string().trim().email("Escriba un correo válido."),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    await requestPasswordReset(values.email);

    setSent(true);
  };

  return (
    <AuthLayout
      title="Recuperar contraseña"
      description="Le enviaremos un enlace para elegir una contraseña nueva."
    >
      {sent ? (
        <>
          <p className="auth-message">
            Si existe una cuenta con ese correo, recibirá un enlace de
            recuperación en unos momentos.
          </p>

          <div className="auth-links">
            <Link to="/login">Volver al inicio</Link>
          </div>
        </>
      ) : (
        <>
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

            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? "Enviando…" : "Enviar enlace"}
            </Button>
          </form>

          <div className="auth-links">
            <Link to="/login">Volver a iniciar sesión</Link>
          </div>
        </>
      )}
    </AuthLayout>
  );
}
