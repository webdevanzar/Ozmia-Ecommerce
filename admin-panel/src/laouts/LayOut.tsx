import { Header } from "../components/Header";
import { SideBar } from "../components/SideBar";
import { Outlet } from "react-router-dom";

const LayOut = () => {
  return (
    <div className="h-screen flex">
      <SideBar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayOut;
