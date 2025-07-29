// import useAuthCheck from "@hooks/useAuthCheck";
"use client";
import { Navigate, Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";
import { decrypt } from "../lib/util";
import SideBar from "../components/sideBar/SideBar";
import Commonheader from "../components/header/Header";

const PrivateRoute = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  // const  isAuthenticated  = useAuthCheck();
  // const auth = useSelector((state: any) => state.auth.auth);
  /* Logic to check if user is authenticated by checking state from redux store
        If authenticated, redirect to child component as defined on routes, else navigate to login
    */
  const token = cookies.token;

  if (!token) {
    // if user not authenticated
    return <Navigate to={"/signUp"} />;
  }
  return (
    <div className="flex w-[100vw] h-[100vh]">
      <SideBar />
      <div className="w-full h-full">
        <Commonheader />
        <div className="h-[90vh]  overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PrivateRoute;
