import {Route, Routes} from "react-router";

import {AppShell} from "./components/AppShell";
import {ProtectedRoute} from "./components/ProtectedRoute";
import {DashboardPage} from "./pages/DashboardPage";
import {LoginPage} from "./pages/LoginPage";
import {PlaceholderPage} from "./pages/PlaceholderPage";
import {RegisterPage} from "./pages/RegisterPage";

export function App() {
  return (
    <Routes>
      <Route element={<LoginPage/>} path="/login"/>
      <Route element={<RegisterPage/>} path="/register"/>

      <Route element={<ProtectedRoute/>}>
        <Route element={<AppShell/>} path="/">
          <Route index element={<DashboardPage/>}/>
          <Route
            element={
              <PlaceholderPage
                title="Recipes"
                description="Recipe CRUD screens will connect to the Django API here."
              />
            }
            path="recipes"
          />
          <Route
            element={
              <PlaceholderPage
                title="Meal Plan"
                description="Weekly scheduling UI will use meal plan API endpoints here."
              />
            }
            path="meal-plan"
          />
          <Route
            element={
              <PlaceholderPage
                title="Pantry"
                description="Pantry tracking will show owned ingredients and quantities here."
              />
            }
            path="pantry"
          />
          <Route
            element={
              <PlaceholderPage
                title="Shopping List"
                description="Generated grocery lists will be reviewed and checked off here."
              />
            }
            path="shopping"
          />
        </Route>
      </Route>
    </Routes>
  );
}
