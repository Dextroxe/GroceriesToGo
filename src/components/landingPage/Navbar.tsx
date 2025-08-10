import { useCookies } from "react-cookie";

const Navbar = () => {
  const [cookies, , removeCookie] = useCookies(["token"]);

  let role = "";
  if (cookies.token) {
    const decodeCookie = atob(cookies.token);
    role = JSON.parse(decodeCookie).role;
  }

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
      <div className="text-2xl font-bold text-green-600">MyGroceryBox</div>
      {/* <ul className="flex space-x-6 text-gray-700">
        <li>
          <Link to="/" className="hover:text-green-500">
            Home
          </Link>
        </li>
        <li>
          <Link to="/about-us" className="hover:text-green-500">
            About us
          </Link>
        </li>
      </ul> */}
      {cookies.token ? (
        <div className="flex gap-4">
          <button
            onClick={() => (window.location.href = `/${role}Dashboard`)}
            className=" bg-orange-500 text-white px-6 py-3 cursor-pointer rounded-lg hover:bg-orange-600"
          >
            Dashboard
          </button>
          <button
            onClick={() => removeCookie("token")}
            className=" bg-orange-500 text-white px-6 py-3 cursor-pointer rounded-lg hover:bg-orange-600"
          >
            Log out
          </button>
        </div>
      ) : (
        <button
          onClick={() => (window.location.href = "/signUp")}
          className=" bg-orange-500 text-white px-6 py-3 cursor-pointer rounded-lg hover:bg-orange-600"
        >
          Sign In
        </button>
      )}
    </nav>
  );
};

export default Navbar;
