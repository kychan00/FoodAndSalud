import { CalendarDays, ChartNoAxesCombined, House } from "lucide-react";
import { NavLink } from "react-router-dom";

import "./BottomNav.css";

const items = [
  {
    to: "/",
    label: "Hoy",
    icon: House,
    end: true,
  },
  {
    to: "/calendar",
    label: "Calendario",
    icon: CalendarDays,
    end: false,
  },
  {
    to: "/patterns",
    label: "Patrones",
    icon: ChartNoAxesCombined,
    end: false,
  },
];

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      <div className="bottom-nav__inner">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                ["bottom-nav__item", isActive ? "bottom-nav__item--active" : ""]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              <Icon size={23} strokeWidth={2.1} />

              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
