import { BrowserRouter, Route, Routes } from "react-router-dom";

import LayOut from "./laouts/LayOut";
import AddProduct from "./pages/AddProduct";
import UpdateProduct from "./pages/UpdateProduct";
import Login from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ProtectedRouteAfterLogin } from "./components/ProtectedRouteAfterLogin";
import ProductDetail from "./pages/ProductDetail";
import Users from "./pages/Users";
import { Toaster } from "sonner";
import Orders from "./pages/Orders";
import Dashbord from "./pages/Dashbord";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<LayOut />}>
              <Route index element={<Dashbord />} />
              <Route path="/users" element={<Users />} />
              <Route path="/products" element={<UpdateProduct />}>
                <Route path=":id" element={<ProductDetail />} />
                <Route path="addproduct" element={<AddProduct />} />
              </Route>
              <Route path="/orders" element={<Orders />} />
            </Route>
          </Route>
          <Route element={<ProtectedRouteAfterLogin />}>
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </>
  );
}

export default App;
