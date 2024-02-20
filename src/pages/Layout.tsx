import "./../styles/_Navigation.scss";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <>
      <header></header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </>
  );
};
