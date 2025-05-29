import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./layouts/Layout";
import Home from "./components/sections/Home";
import { SignUp } from "./pages/SignUp";
import { Login } from "./pages/Login";
import { ProtectedRouteAfterLogin } from "./components/ProtuctedRoutAfterLogin";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollTotop";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/products" element={<Products />}>
                <Route path=":id" element={<ProductDetail />} />
              </Route>
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/orders" element={<Orders />} />
            </Route>
          </Route>
          <Route element={<ProtectedRouteAfterLogin />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </>
  );
}

export default App;
