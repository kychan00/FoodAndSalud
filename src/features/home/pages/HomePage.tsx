import { Activity, LogOut, Plus, Salad, Sparkles } from "lucide-react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { useAuth } from "../../auth/useAuth";

import "./HomePage.css";

export function HomePage() {
  const { user, signOut } = useAuth();

  const displayName =
    user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "Hola";

  return (
    <main className="home-page">
      <div className="home-page__content">
        <header className="home-header">
          <div>
            <p className="home-header__eyebrow">Hoy</p>

            <h1>Hola, {displayName}</h1>
          </div>

          <button
            type="button"
            className="home-header__logout"
            aria-label="Cerrar sesión"
            onClick={() => void signOut()}
          >
            <LogOut size={19} />
          </button>
        </header>

        <Card className="home-summary">
          <span className="home-summary__icon">
            <Sparkles size={22} />
          </span>

          <div>
            <span className="home-summary__label">
              Su seguimiento comienza aquí
            </span>

            <strong>
              Registre algunos días para comenzar a descubrir patrones.
            </strong>
          </div>
        </Card>

        <section className="home-quick">
          <Card className="home-quick__item">
            <span className="home-quick__food">
              <Salad size={23} />
            </span>

            <div>
              <strong>Alimentos</strong>
              <span>0 registros hoy</span>
            </div>
          </Card>

          <Card className="home-quick__item">
            <span className="home-quick__bathroom">
              <Activity size={23} />
            </span>

            <div>
              <strong>Baño</strong>
              <span>0 registros hoy</span>
            </div>
          </Card>
        </section>

        <section className="home-section">
          <div className="home-section__heading">
            <h2>Su día</h2>
            <span>0 registros</span>
          </div>

          <Card className="home-empty">
            <h3>Todavía no hay registros</h3>

            <p>
              Aquí aparecerán sus alimentos y registros de baño en orden
              cronológico.
            </p>
          </Card>
        </section>

        <Button type="button" fullWidth>
          <Plus size={20} />
          Registrar
        </Button>
      </div>
    </main>
  );
}
