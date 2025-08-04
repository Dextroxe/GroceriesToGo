import {
  BrowserRouter,
  Routes,
  Route,

} from "react-router-dom";
import Receipt from "../pages/receipt";
import { ManagerDashboard } from "../components/ManagerDashboard";
// import ProdList from "../components/productPage/productList/ProdList";
// import Cart from "../components/productPage/Cart";
// import NewProduct from "../components/productPage/NewPorduct";
import { StaffDashboard } from "../components/StaffDashBoard/Index";
import MainPage from "../components/landingPage/mainPage";
import Salesreport from "../components/salesReport/Salesreport";
import MainForm from "../components/signUpPage/MainForm";
import UserTable from "../components/approvalPage/UserTable";
import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";
import { ROLES } from "../constant/enum";
import NotFound from "../pages/notFound";
import { Suspense, useEffect } from "react";
import Profile from "../components/profilePage/Profile";
import ProdList from "../components/productPage/productList/ProdList";
import Cart from "../components/productPage/Cart";
import NewProduct from "../components/productPage/NewPorduct";
import UpdateProduct from "../components/productPage/UpdateProduct";
import { useDispatch } from "react-redux";
import axios from "axios";
import { cartActions } from "../store/cart";
import ConfirmationPage from "../components/UI/confirmation";
import { AdminDashboard } from "../components/adminDashboard/AdminDashboard";
import toast, { Toaster } from "react-hot-toast";

const Router = () => {
  const dispatch = useDispatch();

  // fetching the cart when the user visits the website
  useEffect(() => {
    toast(";3");
    (async () => {
      const res = await axios("https://groceries-to-go-back-end.vercel.app/api/cart");
      const cart = res.data;
      cart.forEach(async (item:any) => {
        const newRes = await axios(
          `https://groceries-to-go-back-end.vercel.app/api/product/${item.product_id}`
        );
        const product = newRes.data;
        for (let i = 0; i < item.quantity; i++) {
          dispatch(cartActions.addItem(product));
        }
      });
    })();
  }, []);

  return (
    <Suspense fallback={<p> Loading routes!!!</p>}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />{" "}
          <Route
            path="signUp"
            element={
              // <RoleRoute
              //   allowedRoles={[ROLES.ADMIN, ROLES.STAFF, ROLES.MANAGER]}
              // >
              <MainForm />
              // </RoleRoute>
            }
          />
          <Route
            path="registrationSuccess"
            element={
              // <RoleRoute
              //   allowedRoles={[ROLES.ADMIN, ROLES.STAFF, ROLES.MANAGER]}
              // >
              <ConfirmationPage />
              // </RoleRoute>
            }
          />
          {/* <Route path="login" element={<MainForm />} /> */}
          <Route element={<PrivateRoute />}>
            <Route
              path="/*"
              element={
                <Routes>
                  <Route
                    path="adminDashboard"
                    element={
                      <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                        <AdminDashboard />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="staffDashboard"
                    element={
                      <RoleRoute allowedRoles={[ROLES.STAFF]}>
                        <StaffDashboard />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="managerDashboard"
                    element={
                      <RoleRoute allowedRoles={[ROLES.MANAGER]}>
                        <ManagerDashboard />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="receipt"
                    element={
                      <RoleRoute allowedRoles={[ROLES.STAFF]}>
                        <Receipt />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="profile"
                    element={
                      <RoleRoute
                        allowedRoles={[ROLES.ADMIN, ROLES.STAFF, ROLES.MANAGER]}
                      >
                        <Profile />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="products"
                    element={
                      <RoleRoute
                        allowedRoles={[ROLES.ADMIN, ROLES.STAFF, ROLES.MANAGER]}
                      >
                        <ProdList />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="cart"
                    element={
                      <RoleRoute
                        allowedRoles={[ROLES.ADMIN, ROLES.STAFF, ROLES.MANAGER]}
                      >
                        <Cart />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="newProduct"
                    element={
                      <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
                        <NewProduct />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="updateproduct"
                    element={
                      <RoleRoute allowedRoles={[ROLES.MANAGER]}>
                        <UpdateProduct />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="report"
                    element={
                      <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
                        <Salesreport />
                      </RoleRoute>
                    }
                  />

                  <Route
                    path="allUsers"
                    element={
                      <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                        <UserTable />
                      </RoleRoute>
                    }
                  />
                </Routes>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" reverseOrder={false} />
    </Suspense>
  );
};

export default Router;
