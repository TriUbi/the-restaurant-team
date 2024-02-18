import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Booking } from "./pages/Booking";
import { Contact } from "./pages/Contact";
import { Admin } from "./pages/Admin";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/booking",
        element: <Booking />,
        children: [],
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
    ],
  },
]);
