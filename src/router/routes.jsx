import { createBrowserRouter } from "react-router-dom";
import { dashboardRoute } from "./dashboardRoute";

const routeRegister = [...dashboardRoute];

const routes = createBrowserRouter(routeRegister);

export default routes;