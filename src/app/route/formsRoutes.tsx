import { Route } from "react-router";

//pages
import ActionSelector from "../../features/forms/pages/ActionSelector";
import FormBuilder from "../../features/forms/pages/FormBuilder";

const FormsRouter = (
  <Route path="form">
    <Route path="selector" element={<ActionSelector />} />
    <Route path="builder" element={<FormBuilder />} />
  </Route>
);

export default FormsRouter;
