import { Routes, Route } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import ExplorePage from "./pages/ExplorePage";
import BudgetPage from "./pages/BudgetPage";

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/budget" element={<BudgetPage />} />
      </Routes>
    </div>
  );
}

export default App;