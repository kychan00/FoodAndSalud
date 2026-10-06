import { useState } from "react";
import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";

import { AuthLayout } from "../../../components/layout/AuthLayout";
import { Button } from "../../../components/ui/Button";
import { resendSignupEmail } from "../auth.service";

export function CheckEmailPage() {
  const email = sessionStorage.getItem("foodandsalud.pending-email");

  const [message, setMessage] = useState<string | null>(null);

  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    if (!email) {
      return;
    }

    setResending(true);
    setMessage(null);

    const { error } = await resendSignupEmail(email);

    if (error) {
      setMessage(
        "No pudimos reenviar el correo. Espere un momento antes de volver a intentarlo.",
      );
    } else {
      setMessage("Le enviamos un nuevo correo de verificación.");
    }

    setResending(false);
  };

  return (
    <AuthLayout
      eyebrow="Confirme su cuenta"
      title="Revise su correo"
      description="Le enviamos un enlace para verificar su dirección."
    >
      <div
        style={{
          display: "grid",
          justifyItems: "center",
          gap: "16px",
          textAlign: "center",
        }}
      >
        <MailCheck size={44} aria-hidden="true" />

        {email ? (
          <p className="auth-message">
            Enviamos el enlace a <span className="auth-email">{email}</span>
          </p>
        ) : (
          <p className="auth-message">
            Revise el correo que utilizó para crear su cuenta.
          </p>
        )}

        <p
          style={{
            margin: 0,
            color: "var(--text-secondary)",
            fontSize: "0.88rem",
            lineHeight: 1.6,
          }}
        >
          Después de pulsar el enlace, regresará automáticamente a FoodAndSalud.
        </p>

        {email ? (
          <Button
            type="button"
            variant="secondary"
            fullWidth
            disabled={resending}
            onClick={() => void handleResend()}
          >
            {resending ? "Reenviando…" : "Reenviar correo"}
          </Button>
        ) : null}

        {message ? <p className="auth-message">{message}</p> : null}
      </div>

      <div className="auth-links">
        <Link to="/login">Volver a iniciar sesión</Link>
      </div>
    </AuthLayout>
  );
}
