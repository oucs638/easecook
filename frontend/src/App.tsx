import {Route, Routes} from "react-router";

import {AppShell} from "./components/AppShell";
import {ProtectedRoute} from "./components/ProtectedRoute";
import {DashboardPage} from "./pages/DashboardPage";
import {LoginPage} from "./pages/LoginPage";
import {RegisterPage} from "./pages/RegisterPage";
import {RecipesPage} from "./pages/RecipesPage";
import {MealPlanPage} from "./pages/MealPlanPage";
import {ShoppingPage} from "./pages/ShoppingPage";
import {PantryPage} from "./pages/PantryPage";

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
          <Route element={<PantryPage/>} path="pantry"/>
          <Route element={<ShoppingPage/>} path="shopping"/>
        </Route>
      </Route>
    </Routes>
  );
}
