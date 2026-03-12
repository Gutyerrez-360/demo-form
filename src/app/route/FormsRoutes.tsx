import { Route } from "react-router";

//pages
import ActionSelector from "../../features/forms/pages/ActionSelector";
import FormBuilder from "../../features/forms/pages/FormBuilder";

const formsRouter = (
  <Route path="form">
    <Route path="selector" element={<ActionSelector />} />
    <Route path="builder" element={<FormBuilder />} />
    <Route path="builder/:id" element={<FormBuilder />} />
    <Route path="editSection/:id/:sectionId" element={<FormBuilder />} />
  </Route>
);

export default formsRouter;
