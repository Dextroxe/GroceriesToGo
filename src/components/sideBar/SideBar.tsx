import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const SideBar = () => {
  // ${
  //     isSidebarOpen ? "translate-x-0" : "-translate-x-full"
  //   }
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  let role = "";
  let email = "";
  if (cookies.token) {
    const decodeCookie = atob(cookies.token);
    role = JSON.parse(decodeCookie).role;
    email = JSON.parse(decodeCookie).email;
  }
  const navigate = useNavigate();
  return (
    <div
      className={`sticky top-0 absolute flex flex-col  w-80 h-full bg-white border-r border-gray-200 `}
    >
      <a href={`/ `}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
          <span className="font-semibold text-xl flex cursor-pointer">
            Home
          </span>
        </div>
      </a>

      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <a
              href={`/${role}Dashboard`}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                <path d="M12 3v6" />
              </svg>
              <span>Dashboard</span>
            </a>
          </li>
          {role === "staff" || role === "admin" ? (
            <li>
              <a
                href={"/products"}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                  <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                  <path d="M12 3v6" />
                </svg>
                <span>Products</span>
              </a>
            </li>
          ) : (
            ""
          )}
          {role === "staff" ? (
            <>
              {/* <li>
                <a
                  href={"/receipt"}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                    <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                    <path d="M12 3v6" />
                  </svg>
                  <span>Receipt</span>
                </a>
              </li> */}
              <li>
                <a
                  href="/cart"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-slate-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <circle cx="8" cy="21" r="1" />
                    <circle cx="19" cy="21" r="1" />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                  </svg>
                  <span>Cart</span>
                </a>
              </li>
              <li>
                <a
                  href="/receipt"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-slate-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                  <span>Last transaction receipt</span>
                </a>
              </li>
            </>
          ) : (
            ""
          )}
          {role === "admin" || role === "manager" ? (
            <>
              <li>
                <a
                  href="/newProduct"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                    <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                    <path d="M12 3v6" />
                  </svg>
                  <span>Add Product</span>
                </a>
              </li>
            </>
          ) : (
            ""
          )}

          {role === "admin" || role === "manager" ? (
            <>
              <li>
                <a
                  href="/report"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                  <span>Analytics</span>
                </a>
              </li>
            </>
          ) : (
            ""
          )}
          {role === "admin" ? (
            <li>
              <a
                href="/allUsers"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>users</span>
              </a>
            </li>
          ) : (
            ""
          )}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
            S
          </div>
          <div>
            <p className="text-sm font-medium">{role.toUpperCase()} </p>
            <p className="text-xs text-gray-500">{email} </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
