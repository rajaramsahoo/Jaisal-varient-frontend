import React, {
  Fragment,
  useEffect,
  useState,
  lazy,
  Suspense,
} from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Alert } from "reactstrap";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import ScrollToTop from "./ScrollToTop";
import TapTop from "./component/common/tap-top";
import ProtectedRoute from "./ProtectedRoute";
import LoginModal from "./auth/LoginModal";
import CartModal from "./screen/account/component/CartModal";

import { useCommonContext } from "./helpers/common/CommonContext";
import { useCartlistContext } from "./helpers/cart/AddCartContext";
import { useAuthContext } from "./helpers/auth/authContext";
import { useProductContext } from "./helpers/products/ProductContext";

import { requestFcmToken } from "./firebaseNotification/firebase";
import { getDeviceId } from "./helpers/deviceId";
import axios from "./helpers/axios";
import JaisalLoader from "./component/common/JaisalLoader";
import Comboproducts from "./component/products/Comboproducts";
// ----------------------
// Lazy imports
// ----------------------
const HomePage = lazy(() => import("./screen/Home"));
const Shop = lazy(() => import("./screen/shop"));
const ProductPage = lazy(() => import("./screen/Product"));
const WishlistPage = lazy(() => import("./screen/account/wishlist"));
const Login = lazy(() => import("./auth/Login"));
const NotFound = lazy(() => import("./component/common/404"));
const Cms = lazy(() => import("./screen/Cms"));
const Certificate = lazy(() => import("./screen/common/Certificate"));
const FaqPage = lazy(() => import("./screen/common/FaqPage"));
const MyProfile = lazy(() => import("./screen/account/MyProfile"));
const MyOrder = lazy(() => import("./screen/account/MyOrder"));
const MyOrderDetail = lazy(() => import("./screen/account/MyOrderDetail"));
const SavedAddress = lazy(() => import("./screen/account/SavedAddress"));
const EditMyProfile = lazy(() => import("./screen/account/EditMyProfile"));
const OrderSuccess = lazy(() => import("./screen/checkout/OrderSuccess"));
const PaymentResponse = lazy(() => import("./screen/checkout/payment-response"));
const BlogPage = lazy(() => import("./component/blog/BlogPage"));
const SingleBlog = lazy(() => import("./component/blog/SingleBlog"));
const Recipes = lazy(() => import("./component/recipes/Recipes"));
const AboutUs = lazy(() => import("./screen/common/AboutUs"));
const PatnerWithUs = lazy(() => import("./screen/common/PatnerWithUs"));
// ----------------------
// Loader Component
// ----------------------
const Loader = () => (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

function App() {
  const { cms, getStoreBanners, getCms, setShow, BannerData, getAllComboOfferProduct, comboOfferList } =
    useCommonContext();
  const { isLogin, userData, token } = useAuthContext();
  const { getCartList, offerAddToCart, setCartModalShow, cartlistData } =
    useCartlistContext();
  const { getCategoryList, products, getAllProducts, reqData, currentCategorySlug, categoryList } = useProductContext();

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");
  const navigate = useNavigate();


  useEffect(() => {
    getCategoryList();
    getAllComboOfferProduct();
    if (!cms || cms.length === 0) {
      getCms();
    }

    getStoreBanners();

    // online/offline detection
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("You are back online!");
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You are offline. Please check your connection.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);


  // useEffect(() => {
  //   if (isLogin && userData?._id) {
  //     getCartList();
  //   }
  // }, [isLogin, userData, token]);
  useEffect(() => {
    getCartList()
  }, [isLogin, userData, token])
  // ----------------------
  // Offer auto add-to-cart
  // ----------------------
  useEffect(() => {
    if (code === "JS001" && isLogin) {
      offerAddToCart();
    }
    if (code === "JS001" && !isLogin) {
      navigate(`/login?code=${code}`);
    }
  }, [code, isLogin]);

  // ----------------------
  // FCM token management
  // ----------------------
  const [facmToken, setFacmToken] = useState("");
  useEffect(() => {
    const fetchFacmToken = async () => {
      try {
        const token = await requestFcmToken();
        setFacmToken(token);
      } catch (error) {
        console.error("Error fetching FCM token:", error);
      }
    };
    fetchFacmToken();
  }, [facmToken]);

  const generateFcmToken = async () => {
    try {
      const data = {
        token: facmToken,
        userId: userData?._id,
        username: userData?.name || "",
        userPhone: userData?.mobile,
      };
      const response = await axios.post(`api/create-token`, data);
      if (response.status === 200) {
        // success
      }
    } catch (error) {
      // fail silently
    }
  };

  useEffect(() => {
    if (facmToken && userData?._id) {
      generateFcmToken();
    }
  }, [facmToken, userData?._id]);
  // console.log(reqData)
  useEffect(() => {
    getDeviceId();
  }, [])
  useEffect(() => {
    // Decide whether to search by keyword or category
    if (reqData) {
      getAllProducts(reqData, "keyword"); // user typed something
    } else {
      getAllProducts(currentCategorySlug, "category"); // category selected
    }
  }, [reqData, currentCategorySlug]);

  const images = BannerData?.data?.map((item) => item.image) || [];
  const imagesData = comboOfferList?.data?.map((item) => item.image)
  const categoryImageData = categoryList?.data?.map((item) => item.
    image)

  const isLoading =
    // cartlistData?.loading ||
    // products?.loading ||
    categoryList?.loading ||
    cms?.loading ||
    BannerData?.loading ||
    comboOfferList?.loading ||
    images?.length === 0 ||
    //imagesData?.length === 0 ||
    categoryImageData?.length === 0;

  return (
    <Fragment>
      {!isLogin && <LoginModal onClose={() => setShow(false)} />}
      <CartModal
        onClose={() => setCartModalShow(false)}
        placement="end"
        name="end"
      />

      {!isOnline ? (
        <Alert
          color="danger"
          className="d-flex align-items-center justify-content-center mb-0 shadow"
          style={{
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 1050,
            fontSize: "16px",
            fontWeight: "500",
            padding: "10px 20px",
          }}
        >
          <i
            className="bi bi-wifi-off me-2"
            style={{ fontSize: "20px", verticalAlign: "middle" }}
          ></i>
          You are offline. Please check your internet connection.
        </Alert>
      ) : (
        // <>

        //   <ScrollToTop />

        //   <Suspense fallback={<Loader />}>
        //     {
        //       loading && <Loader />
        //     }
        //     <Routes>
        //       <Route path="/" element={<HomePage />} />
        //       <Route path="/blog" element={<BlogPage />} />
        //       <Route path="/blog/:id" element={<SingleBlog />} />
        //       <Route path="*" element={<NotFound />} />
        //       <Route path="404" element={<NotFound />} />
        //       <Route path="/login" element={<Login />} />
        //       <Route path="/shop/:slug" element={<Shop />} />
        //       <Route path="/product-details/:id" element={<ProductPage />} />

        //       {/* Protected routes */}
        //       <Route path="/account/wishlist" element={<ProtectedRoute />}>
        //         <Route path="" element={<WishlistPage />} />
        //       </Route>

        //       <Route
        //         path="/page/account/order-success"
        //         element={<OrderSuccess />}
        //       />

        //       <Route path="/payment-response" element={<PaymentResponse />} />

        //       <Route
        //         path="/account/my-profile"
        //         element={<ProtectedRoute />}
        //       >
        //         <Route path="" element={<MyProfile />} />
        //       </Route>
        //       <Route
        //         path="/account/update/my-profile"
        //         element={<ProtectedRoute />}
        //       >
        //         <Route path="" element={<EditMyProfile />} />
        //       </Route>
        //       <Route path="/account/my-order" element={<ProtectedRoute />}>
        //         <Route path="" element={<MyOrder />} />
        //       </Route>
        //       <Route
        //         path="/account/my-order/detail/:id"
        //         element={<ProtectedRoute />}
        //       >
        //         <Route path="" element={<MyOrderDetail />} />
        //       </Route>
        //       <Route
        //         path="/account/saved-address"
        //         element={<ProtectedRoute />}
        //       >
        //         <Route path="" element={<SavedAddress />} />
        //       </Route>

        //       {/* CMS dynamic */}
        //       {Array.isArray(cms) &&
        //         cms?.map((item) => (
        //           <Route
        //             key={item?._id}
        //             path={`/${item?.slug}`}
        //             element={<Cms slug={item?.slug} />}
        //           />
        //         ))}

        //       {/* Other pages */}
        //       <Route path="/contact-us" element={<PatnerWithUs />} />
        //       <Route path="/certificates" element={<Certificate />} />
        //       <Route path="/faq" element={<FaqPage />} />
        //       <Route path="/recipes" element={<Recipes />} />
        //       <Route path="/new-about-us" element={<AboutUs />} />
        //     </Routes>
        //   </Suspense>
        //   <TapTop />
        //   <ToastContainer
        //     autoClose={2000}
        //     position="top-right"
        //     style={{ zIndex: 99999 }}
        //   />
        // </>
        <Suspense fallback={<JaisalLoader />}>
          {isLoading ? (
            <JaisalLoader />
          ) : (
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<SingleBlog />} />
              <Route path="*" element={<NotFound />} />
              <Route path="404" element={<NotFound />} />
              <Route path="/login" element={<Login />} />
              <Route path="/shop/:slug" element={<Shop />} />
              <Route path="/product-details/:id" element={<ProductPage />} />
              <Route path="/combo-offers" element={<Comboproducts />} />

              {/* Protected routes */}
              <Route path="/account/wishlist" element={<ProtectedRoute />}>
                <Route index element={<WishlistPage />} />
              </Route>

              <Route
                path="/page/account/order-success"
                element={<OrderSuccess />}
              />
              <Route path="/payment-response" element={<PaymentResponse />} />

              <Route path="/account/my-profile" element={<ProtectedRoute />}>
                <Route index element={<MyProfile />} />
              </Route>
              <Route path="/account/update/my-profile" element={<ProtectedRoute />}>
                <Route index element={<EditMyProfile />} />
              </Route>
              <Route path="/account/my-order" element={<ProtectedRoute />}>
                <Route index element={<MyOrder />} />
              </Route>
              <Route
                path="/account/my-order/detail/:id"
                element={<ProtectedRoute />}
              >
                <Route index element={<MyOrderDetail />} />
              </Route>
              <Route path="/account/saved-address" element={<ProtectedRoute />}>
                <Route index element={<SavedAddress />} />
              </Route>

              {/* CMS dynamic */}
              {Array.isArray(cms) &&
                cms?.map((item) => (
                  <Route
                    key={item?._id}
                    path={`/${item?.slug}`}
                    element={<Cms slug={item?.slug} />}
                  />
                ))}

              {/* Other pages */}
              <Route path="/contact-us" element={<PatnerWithUs />} />
              <Route path="/certificates" element={<Certificate />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/new-about-us" element={<AboutUs />} />
            </Routes>
          )}
          <TapTop />
          <ToastContainer
            autoClose={2000}
            position="top-right"
            style={{ zIndex: 99999 }}
          />
        </Suspense>


      )}
    </Fragment>
  );
}

export default App;
