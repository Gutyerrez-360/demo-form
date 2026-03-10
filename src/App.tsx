import { BrowserRouter as Router, Routes, Route } from "react-router";

//pages
import SessionForm from "./features/auth/pages/SessionForm";
import FormsRouter from "./app/route/FormsRoutes";

// validador ruta protegida para retornar siempre al home sino encuentra el access_code
import ProtectedRoute from "./app/route/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route>
          {/* Another children routes */}
          <Route index path="/" element={<SessionForm />} />
          <Route element={<ProtectedRoute />}>{FormsRouter}</Route>
        </Route>
        {/* proximamente */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
