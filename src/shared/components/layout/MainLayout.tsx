import { Outlet } from "react-router";
import Header from "./Header";

export default function MainLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 pt-3">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
