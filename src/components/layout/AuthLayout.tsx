import type { ReactNode } from "react";

import "./AuthLayout.css";

interface AuthLayoutProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function AuthLayout({
  eyebrow = "FoodAndSalud",
  title,
  description,
  children,
}: AuthLayoutProps) {
  return (
    <main className="auth-page">
      <div className="auth-page__content">
        <header className="auth-header">
          <div className="brand-mark">F&S</div>

          <p className="auth-header__eyebrow">{eyebrow}</p>

          <h1>{title}</h1>

          {description ? (
            <p className="auth-header__description">{description}</p>
          ) : null}
        </header>

        <section className="auth-card">{children}</section>
      </div>
    </main>
  );
}
