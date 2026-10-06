import { Outlet } from "react-router-dom";

import { BottomNav } from "../navigation/BottomNav";

import "./AppShell.css";

export function AppShell() {
  return (
    <div className="app-shell">
      <div className="app-shell__content">
        <Outlet />
      </div>

      <BottomNav />
    </div>
  );
}
