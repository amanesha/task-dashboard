import { Outlet } from "react-router-dom";
import Header from "./Header";

export const Root = () => {
  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};
