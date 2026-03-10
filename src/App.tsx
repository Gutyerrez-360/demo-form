import { BrowserRouter as Router, Routes, Route } from "react-router";

//pages
import FormBuilder from "./features/forms/pages/FormBuilder";
import FormsRouter from "./app/route/formsRoutes";

function App() {
  return (
    <Router>
      <Routes>
        <Route>
          {/* Another children routes */}
          <Route index path="/" element={<FormBuilder />} />
          {FormsRouter}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
