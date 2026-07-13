import {Route, Routes} from "react-router";

import {AppShell} from "./components/AppShell";
import {ProtectedRoute} from "./components/ProtectedRoute";
import {DashboardPage} from "./pages/DashboardPage";
import {LoginPage} from "./pages/LoginPage";
import {PlaceholderPage} from "./pages/PlaceholderPage";
import {RegisterPage} from "./pages/RegisterPage";
import {RecipesPage} from "./pages/RecipesPage";
import {MealPlanPage} from "./pages/MealPlanPage";

export function App() {
  return (
    <Routes>
      <Route element={<LoginPage/>} path="/login"/>
      <Route element={<RegisterPage/>} path="/register"/>

      <Route element={<ProtectedRoute/>}>
        <Route element={<AppShell/>} path="/">
          <Route index element={<DashboardPage/>}/>
          <Route element={<RecipesPage/>} path="recipes"/>
          <Route element={<MealPlanPage/>} path="meal-plan"/>
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
