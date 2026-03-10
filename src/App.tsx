import { BrowserRouter as Router, Routes, Route } from "react-router";

//pages
import SessionForm from "./features/forms/pages/SessionForm";
import FormsRouter from "./app/route/formsRoutes";

function App() {
  return (
    <Router>
      <Routes>
        <Route>
          {/* Another children routes */}
          <Route index path="/" element={<SessionForm />} />
          {FormsRouter}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
