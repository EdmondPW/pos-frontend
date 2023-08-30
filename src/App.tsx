import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthLogin from "./components/auth/AuthLogin";
import PosDashboard from "./components/pos/PosDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<AuthLogin />} />
          <Route
            path="/pos"
            element={
              <ProtectedRoute>
                <PosDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
