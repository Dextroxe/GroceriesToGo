import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "../App";
import Receipt from "../pages/receipt";
import { ManagerDashboard } from "../components/ManagerDashboard";
import ProdList from "../components/productPage/productList/ProdList";
import Cart from "../components/productPage/Cart";
import NewProduct from "../components/productPage/NewPorduct";
import { StaffDashboard } from "../components/StaffDashBoard/Index";
import MainPage from "../components/landingPage/mainPage";
import Salesreport from "../components/salesReport/Salesreport";
import MainForm from "../components/signUpPage/MainForm";
import UserTable from "../components/approvalPage/UserTable";

const PublicRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/receipt" element={<Receipt />} />
        <Route path="/managerDashboard" element={<ManagerDashboard />} />
        <Route path="/staffDashboard" element={<StaffDashboard />} />
        <Route path="/productList" element={<ProdList />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/newProduct" element={<NewProduct />} />
        <Route path="/salesreport" element={<Salesreport />} />
        <Route path="/signUp" element={<MainForm />} />
        <Route path="/approvalPage" element={<UserTable />} />
      </Routes>
    </BrowserRouter>
  );
};

export default PublicRoutes;
