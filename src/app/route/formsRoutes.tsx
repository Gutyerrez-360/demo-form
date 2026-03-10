import { Route } from "react-router";

//pages
import ActionSelector from "../../features/forms/pages/ActionSelector";

const FormsRouter = (
  <Route path="demo">
    <Route path="selector" element={<ActionSelector />} />
  </Route>
);

export default FormsRouter;
