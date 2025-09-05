// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"; // add useLocation [1]
import "./index.css";

// Layout
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ShopPage from "./pages/ShopPage";
import GalleryPage from "./pages/GalleryPage";
//import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import CustomOrderPage from "./pages/CustomOrderPage";
import SignupPage from "./pages/SignupPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProductViewPage from "./pages/ProductViewPage";
import PageNotFound from "./pages/PageNotFound";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import ReturnsPage from "./pages/ReturnsPage";
import ShippingPage from "./pages/ShippingPage";
import ArtClassesPage from "./pages/ArtClassesPage";

import { CartProvider } from "./context/CartContext";

// Utils
import ScrollToTop from "./components/ScrollToTop";
import BackToTop from "./components/BackToTop";

// Floating cart
import FallingCart from "./components/FallingCart";

// Helper rendered inside Router so useLocation works
const RouteAwareFallingCart = () => {
  const location = useLocation(); // safe here because we're inside <Router> [1]
  const showFallingCart =
    location.pathname === "/" || location.pathname.startsWith("/shop"); // covers /shop and /shop/category/... [1]

  if (!showFallingCart) return null;
  return (
    <FallingCart
      right={16}
      bottomOffset={84}
      // Keep whichever props your current FallingCart supports:
      // If using the scroll-linked version:
      speedFactor={2.2}
      maxStart={1.1}
      // If using the WAAPI auto-fall version, you can instead pass:
      // durationMs={14000}
      // delayMs={200}
      size={22}
      navigateTo="/cart"
    />
  );
};

const App = () => {
  return (

      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-nav">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/shop/category/:category" element={<ShopPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/custom-order" element={<CustomOrderPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/product-details" element={<ProductViewPage />} />
                <Route path="art-classes" element={<ArtClassesPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/returns" element={<ReturnsPage />} />
                <Route path="/shipping" element={<ShippingPage />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </main>
            <Footer />

            {/* Render only on "/" and "/shop..." */}
            <RouteAwareFallingCart /> {/* inside Router so the hook works */} {/* [1] */}

            <BackToTop />
          </div>
        </Router>
      </CartProvider>
    
  );
};

export default App;
