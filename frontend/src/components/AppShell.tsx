import {NavLink, type NavLinkRenderProps, Outlet} from "react-router";
import {useAuth} from "../auth/useAuth";

const navigationItems = [
  {label: "Dashboard", to: "/", helper: "Overview"},
  {label: "Recipes", to: "/recipes", helper: "Cookbook"},
  {label: "Meal Plan", to: "/meal-plan", helper: "Schedule"},
  {label: "Pantry", to: "/pantry", helper: "Inventory"},
  {label: "Shopping", to: "/shopping", helper: "Grocery run"},
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
                <span>{item.label}</span>
                <small>{item.helper}</small>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div>
            <span className="user-label">Signed in as</span>
            <strong>{user?.username}</strong>
          </div>
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
