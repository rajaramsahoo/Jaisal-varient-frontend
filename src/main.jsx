import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { HashRouter, BrowserRouter } from "react-router-dom";
import "./assets/scss/app.scss";
import ProductDetailsProvider from "./helpers/products/ProductContext.jsx";
import AuthProvider from "./helpers/auth/authContext.jsx";
import CommonProvider from "./helpers/common/CommonContext.jsx";
import WishlistContextProvider from "./helpers/wishlist/WishlistContext.jsx";
import CartListContextProvider from "./helpers/cart/AddCartContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <ProductDetailsProvider>
        <CommonProvider>
          <CartListContextProvider>
            <WishlistContextProvider>
              <App />
            </WishlistContextProvider>
          </CartListContextProvider>
        </CommonProvider>
      </ProductDetailsProvider>
    </AuthProvider>
  </BrowserRouter>
);
