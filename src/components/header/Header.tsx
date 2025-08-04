import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const Commonheader = () => {
  // Close dropdowns when clicking outside
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [cookies, , removeCookie] = useCookies(["token"]);
  const navigate = useNavigate();
  const [header, setHeader] = useState("");
  let role = "";
  if (cookies.token) {
    const decodeCookie = atob(cookies.token);
    role = JSON.parse(decodeCookie).role;
  }
  console.log(role);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }
    switch (window.location.pathname) {
      case "/products":
        setHeader("Products");
        break;
      case "/staffDashboard":
        setHeader("Staff Dashboard");
        break;
      case "/managerDashboard":
        setHeader("Manager Dashboard");
        break;
      case "/adminDashboard":
        setHeader("Admin Dashboard");
        break;
      case "/profile":
        setHeader("Your profile");
        break;
      case "/cart":
        setHeader("Cart");
        break;
      case "/newProduct":
        setHeader("Add new product");
        break;
      case "/report":
        setHeader("Report");
        break;
      case "/receipt":
        setHeader("Receipt");
        break;
      case "/allUsers":
        setHeader("Users");
        break;

      default:
        break;
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  console.log(window.location.pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-6">
      <div className="ml-auto flex items-center justify-start w-full gap-4">
        <h1 className="text-xl font-semibold pt-4">{header}</h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <button
          onClick={() => location.reload()}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <path d="M21 2v6h-6" />
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
            <path d="M3 22v-6h6" />
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          </svg>
          Refresh
        </button>
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            P
          </button>
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
              <div
                className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100 cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                My Profile
              </div>
              {/* <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </a> */}
              <div className="border-t border-gray-100"></div>
              <a
                onClick={() => removeCookie("token")}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Commonheader;
