// import AccessDenied from "../pages/accessDenied";
import { useCookies } from "react-cookie";
import AccessDenied from "../components/UI/AccessDenied";

const RoleRoute = ({ allowedRoles, children }: any) => {
  const [cookies, ,] = useCookies(["token"]);
  let role = "";
  if (cookies.token) {
    const decodeCookie = atob(cookies.token);
    role = JSON.parse(decodeCookie).role;
  }
  const currentRole = role;
  if (!allowedRoles.includes(currentRole)) {
    return <AccessDenied role={currentRole} />;
  }
  return children;
};

export default RoleRoute;
