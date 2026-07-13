import {NavLink, type NavLinkRenderProps, Outlet} from "react-router";
import {useAuth} from "../auth/useAuth";

const navigationItems = [
  {label: "Dashboard", to: "/"},
  {label: "Recipes", to: "/recipes"},
  {label: "Meal Plan", to: "/meal-plan"},
  {label: "Pantry", to: "/pantry"},
  {label: "Shopping", to: "/shopping"},
];

export function AppShell() {
  const {logout, user} = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand">
            <span className="brand-mark">EC</span>
            <div>
              <strong>EaseCook</strong>
              <span>Meal planning</span>
            </div>
          </div>

          <nav aria-label="Main navigation">
            {navigationItems.map((item) => (
              <NavLink
                className={({isActive}: NavLinkRenderProps) =>
                  isActive ? "nav-link nav-link-active" : "nav-link"
                }
                key={item.to}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <span>{user?.username}</span>
          <button type="button" onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet/>
      </main>
    </div>
  );
}
