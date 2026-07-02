import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider }  from "./context/AuthContext";
import { CartProvider }  from "./context/CartContext";
import Navbar            from "./components/Navbar";
import CartDrawer        from "./components/CartDrawer";
import Hero              from "./components/Hero";
import Category          from "./components/Category";
import ProductGrid       from "./components/ProductGrid";
import AllProducts       from "./pages/AllProducts";
import Login             from "./pages/Login";
import Signup            from "./pages/Signup";
import AdminPanel        from "./pages/AdminPanel";
import Profile           from "./pages/Profile";
import Orders            from "./pages/Orders";
import Checkout          from "./pages/Checkout";
import OrderSuccess      from "./pages/OrderSuccess";
import Footer            from "./components/Footer";
import PromoBanner       from "./components/PromoBanner";
import Testimonials      from "./components/Testimonials";

function Layout({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <>
      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      {children}
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter basename="/E-commerce-">
      <AuthProvider>
        <CartProvider>
          <ToastContainer position="top-center" autoClose={3000} />
          <Routes>
            <Route path="/" element={<Layout><Hero /><Category /><ProductGrid /><PromoBanner /><Testimonials /></Layout>} />
            <Route path="/products" element={<Layout><AllProducts /></Layout>} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />
            <Route path="/orders" element={<Layout><Orders /></Layout>} />
            <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
            <Route path="/order-success" element={<Layout><OrderSuccess /></Layout>} />
            <Route path="/login"  element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;