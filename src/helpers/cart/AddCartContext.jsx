import { toast } from "react-toastify";
import axios from "../axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../auth/authContext";
import { getDeviceId } from "../../helpers/deviceId";
import { set } from "mongoose";
import { a } from "motion/react-client";
export const cartListContext = createContext();

const CartListContextProvider = (props) => {
  const location = useLocation();
  const { token, isLogin, userData } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [stock, setStock] = useState();
  const navigate = useNavigate();
  const [cartlistData, setCartListData] = useState({
    data: {},
    loading: false,
    empty: "",
  });
  const [stateList, setStateList] = useState({ data: [], loading: false });
  const [orderList, setOrderList] = useState({});
  const [orderDetailList, setOrderDetailList] = useState({});
  const [placedOrder, setPlacedOrder] = useState({});
  const [promo, setPromo] = useState({});
  const [amount, setAmount] = useState();
  const [addCartLoading, setAddCartLoading] = useState(false);
  const [removePromoData, setRemovePromoDAta] = useState(false);
  const [promoMessage, setPromoMessage] = useState({
    message: "",
    status: false,
  });
  const [promo_code, setPromoCode] = useState("");
  const [availability, setAvailability] = useState({
    loading: false,
    message: "",
    status: false,
  });
  const [cartModalShow, setCartModalShow] = useState(false);
  const device_id = localStorage.getItem("guest_device_id");
  const handlePromoremove = () => {
    if (promo_code) {
      setPromoCode("");
      setAmount(null);
      setPromoMessage((prevData) => ({
        ...prevData,
        message: "",
      }));
      removePromo({ promo_code });
    }
  };

  const getCartList = async () => {
    try {
      setCartListData({ data: {}, loading: true, empty: false });
      const response = await axios.post(
        "api/user/product/cart",
        { deviceId: device_id }, // Body
        {
          headers: {
            Authorization: token, // Header
          },
        }
      );
      if (response.status == 200 || 201) {
        setCartListData({
          data: response?.data?.data || {},
          loading: false,
          empty: response?.data?.isEmpty,
        });
      }
    } catch (error) {
      console.log(error.message);
      setCartListData({ data: {}, loading: false, empty: false });
    }
  };

  const getDeviceCartList = async () => {
    try {
      setCartListData({ data: {}, loading: true, empty: false });
      const response = await axios.post(`api/device/products/cart`, {
        device_id: device_id,
      });
      if (response.status == 200 || 201) {
        setCartListData({
          data: response?.data?.data || {},
          loading: false,
          empty: response?.data?.isEmpty,
        });
      }
    } catch (error) {
      console.log(error.message);
      setCartListData({ data: {}, loading: false, empty: false });
    }
  };

  const addToCart = async (product_id, quantity, variant_id) => {
    try {
      setAddCartLoading(true);
      const response = await axios.post(
        `api/user/product/cart/add`,
        { product_id: product_id || "", quantity, variant_id: variant_id, device_id: device_id },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status == 200) {
        if (!isLogin) {
          getCartList({ device_id: device_id });
        } else {
          getCartList();
        }

        toast.success(response?.data?.message);
        handlePromoremove();
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setAddCartLoading(false);
    }
  };

  const offerAddToCart = async () => {
    try {
      const response = await axios.post(
        `api/user/product/cart/offer`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status == 200) {
        getCartList();
        toast.success(response?.data?.message);
        navigate("/account/cart");
        handlePromoremove();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // const updateCart = async (product_id, quantity) => {
  //   try {
  //     const response = await axios.post(
  //       `api/user/product/cart/quantity`,
  //       { product_id: product_id || "", quantity, device_id: device_id },
  //       {
  //         headers: {
  //           Authorization: token,
  //         },
  //       }
  //     );
  //     if (response.status == 200) {
  //       getCartList();
  //       handlePromoremove();
  //       toast.success("Updated Cart");
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  const [cartLoading, setCartLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState(null); // store product_id of loading item

  const updateCart = async (product_id, quantity) => {
    try {
      setLoadingItem(product_id); // start loading only for this item
      const response = await axios.post(
        `api/user/product/cart/quantity`,
        { product_id: product_id || "", quantity, device_id },
        { headers: { Authorization: token } }
      );

      if (response.status === 200) {
        await getCartList();
        handlePromoremove();
        toast.success("Updated Cart");
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoadingItem(null); // stop loading for this item
    }
  };


  const removeFromCartlist = async (item) => {
    try {
      const device_id = localStorage.getItem("guest_device_id"); // ensure device_id is defined

      const payload = {
        product_id: item.product?._id || "",
        variant_id: item.variant?._id || "",
        device_id,
      };


      const response = await axios.post(
        `/api/user/product/cart/remove`,
        payload,
        {
          headers: {
            Authorization: token || "",
          },
        }
      );

      if (response.status === 200) {
        getCartList();        // refresh cart after removal
        handlePromoremove();  // reset promo if applied
        // toast.warning("Removed From Cart"); // optional toast
      }
    } catch (error) {
      console.error("Remove cart error:", error.response?.data?.message || error.message);
    }
  };


  const clearCartlist = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `api/user/product/cart/clear`,
        { device_id: device_id },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status == 200) {
        setCartListData({});
        if (!location.pathname == "/page/account/order-success") {
          toast.warning("All Product Removed");
        }
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStateList = async (country) => {
    try {
      setStateList({ data: [], loading: true });
      const response = await axios.post(
        `api/country/states/list`,
        { country },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status == 200 || 201) {
        setStateList({ data: response?.data?.data || [], loading: false });
      }
    } catch (error) {
      console.log(error.message);
      setStateList({ data: [], loading: false });
    }
  };
  const getPlaceOrder = async (data) => {
    try {
      setPlacedOrder({ data: [], loading: true, invoice: "" });

      const response = await axios.post("/api/order/place", data, {
        headers: { Authorization: token },
      });

      if (response.status === 200 && response.data?.data) {
        const orderData = response.data?.data;
        const razorpayInfo = response.data?.razorpay;
        clearCartlist();
        setAmount();
        setPlacedOrder({
          data: orderData,
          loading: false,
          invoice: response?.data?.invoice || "",
        });

        if (razorpayInfo?.order_id) {
          // Load Razorpay checkout script
          const loaded = await new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });

          if (!loaded) {
            toast.error("Failed to load Razorpay");
            return;
          }

          // Razorpay checkout options
          const options = {
            key: razorpayInfo.key_id,
            amount: razorpayInfo.amount,
            currency: razorpayInfo.currency,
            name: "Jaisal Oraganics",
            description: "Order Payment",
            image: "./assets/images/logo.svg",
            order_id: razorpayInfo.order_id,
            handler: async function (response) {
              try {
                const verify = await axios.post(
                  "/api/order/verify-payment",
                  {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    order_id: orderData._id,
                  },
                  { headers: { Authorization: token } }
                );

                if (verify.status === 200) {
                  toast.success("Payment Successful!");
                  navigate("/page/account/order-success", { replace: true });
                } else {
                  toast.error("Payment verification failed.");
                }
              } catch (err) {
                toast.error("Error verifying payment");
                console.error("Verification error:", err);
              }
            },
            prefill: {
              name: userData?.name || "Guest",
              email: userData?.email || "guest@example.com",
              contact: userData?.mobile || "9999999999",
            },
            notes: {
              address: "Online Order",
            },
            theme: {
              color: "#043b37",
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          toast.success("Order Placed Successfully (COD)");
          navigate("/page/account/order-success", { replace: true });
        }
      } else {
        throw new Error(response.data?.message || "Order placement failed");
      }
    } catch (error) {
      console.error("singleOrderPlace error:", error);
      setPlacedOrder({ data: [], loading: false, invoice: "" });
      toast.error("Failed to place order.");
    }
  };

  // const getPlaceOrder = async (data) => {
  //   try {
  //     setPlacedOrder({ data: [], loading: true, invoice: "" });

  //     const response = await axios.post(`api/order/place`, data, {
  //       headers: {
  //         Authorization: token,
  //       },
  //     });

  //     if (response.status === 200) {
  //       const orderData = response?.data?.data;
  //       const invoice = response?.data?.invoice || "";

  //       clearCartlist();
  //       setAmount();

  //       setPlacedOrder({
  //         data: orderData,
  //         loading: false,
  //         invoice,
  //       });

  //       if (response?.data?.payment_url) {
  //         // Redirect to payment gateway
  //         window.open(response.data.payment_url, "_blank");
  //       } else {
  //         // COD or payment already successful
  //         toast.success("Order Placed Successfully!");
  //         navigate("/page/account/order-success", { replace: true });
  //       }
  //     } else {
  //       throw new Error(response?.data?.message || "Failed to place order.");
  //     }
  //   } catch (error) {
  //     console.error("Order placement error:", error.message);
  //     toast.error("Failed to place order. Please try again.");
  //     setPlacedOrder({ data: [], loading: false, invoice: "" });
  //   }
  // };
  const singleOrderPlace = async (data) => {
    try {
      setPlacedOrder({ data: [], loading: true, invoice: "" });

      const response = await axios.post("/api/order/buy-now", data, {
        headers: { Authorization: token },
      });

      if (response.status === 200 && response.data?.data) {
        const orderData = response.data?.data;
        const razorpayInfo = response.data?.razorpay;

        setPlacedOrder({
          data: orderData,
          loading: false,
          invoice: response?.data?.invoice || "",
        });

        if (razorpayInfo?.order_id) {
          // Load Razorpay checkout script
          const loaded = await new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });

          if (!loaded) {
            toast.error("Failed to load Razorpay");
            return;
          }

          // Razorpay checkout options
          const options = {
            key: razorpayInfo.key_id,
            amount: razorpayInfo.amount,
            currency: razorpayInfo.currency,
            name: "Jaisal Oraganics",
            description: "Order Payment",
            image: "./assets/images/logo.svg",
            order_id: razorpayInfo.order_id,
            handler: async function (response) {
              try {
                const verify = await axios.post(
                  "/api/order/verify-payment",
                  {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    order_id: orderData._id,
                  },
                  { headers: { Authorization: token } }
                );

                if (verify.status === 200) {
                  toast.success("Payment Successful!");
                  navigate("/page/account/order-success", { replace: true });
                } else {
                  toast.error("Payment verification failed.");
                }
              } catch (err) {
                toast.error("Error verifying payment");
                console.error("Verification error:", err);
              }
            },
            prefill: {
              name: userData?.name || "Guest",
              email: userData?.email || "guest@example.com",
              contact: userData?.mobile || "9999999999",
            },
            notes: {
              address: "Online Order",
            },
            theme: {
              color: "#043b37",
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          toast.success("Order Placed Successfully (COD)");
          navigate("/page/account/order-success", { replace: true });
        }
      } else {
        throw new Error(response.data?.message || "Order placement failed");
      }
    } catch (error) {
      console.error("singleOrderPlace error:", error);
      setPlacedOrder({ data: [], loading: false, invoice: "" });
      toast.error("Failed to place order.");
    }
  };

  // const singleOrderPlace = async (data) => {
  //   try {
  //     setPlacedOrder({ data: [], loading: true, invoice: "" });
  //     const response = await axios.post(`api/order/buy-now`, data, {
  //       headers: { Authorization: token },
  //     });
  //     if (response.status == 200 || 201) {
  //       setPlacedOrder({
  //         data: response?.data?.data,
  //         loading: false,
  //         invoice: response?.data?.invoice,
  //       });
  //       if (response?.data?.payment_url) {
  //         window.open(response?.data?.payment_url, "_blank");
  //       } else {
  //         toast.success("Order Placed Successfully!");
  //         navigate("/page/account/order-success", { replace: true });
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //     setPlacedOrder({ data: [], loading: false, invoice: "" });
  //   }
  // };

  const checkPaymentResponse = async (order_id) => {
    try {
      //  await axios.post(`/api/payment-response/${order_id}`);


      const { data } = await axios.get(
        `/api/user/initial/order/detail/${order_id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );


      return data;
    } catch (error) {
      return error?.response?.data || null;
    }
  };

  const getOrderList = async (payload) => {
    try {
      setOrderList({ data: [], loading: true, pageData: {} });
      const response = await axios.post(`api/user/orders`, payload, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status == 200 || 201) {
        setOrderList({
          data: response?.data?.data,
          loading: false,
          pageData: response?.data,
        });
      }
    } catch (error) {
      console.log(error.message);
      setOrderList({ data: [], loading: false, pageData: {} });
    }
  };

  const getOrderDetailPage = async (id) => {
    try {
      setOrderDetailList({ data: {}, loading: true });
      const response = await axios.get(`api/user/order/details/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status == 200 || 201) {
        setOrderDetailList({ data: response?.data?.data, loading: false });
      }
    } catch (error) {
      console.log(error.message);
      setOrderDetailList({ data: {}, loading: false });
    }
  };

  const CancelOrder = async (status, id) => {
    try {
      const response = await axios.post(
        `api/user/order/cancel/${id}`,
        { status },
        { headers: { Authorization: token } }
      );
      if (response.status == 200) {
        getOrderDetailPage(id);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("something went wrong");
    }
  };

  const sendPromo1 = async (promo_code, amount,) => {
    try {
      const response = await axios.post(
        `api/promo-code/record/save`,
        { ...promo_code, amount, device_id: device_id },
        { headers: { Authorization: token } }
      );
      if (response.status == 200 || 201) {
        setPromoMessage({ message: response?.data?.message, status: true });
        toast.success("Promo Applied Successfully!");
      } else toast.warning("something went wrong");
    } catch (error) {
      console.log(error.message);
      setPromoMessage({
        message: error?.response?.data?.message,
        status: false,
      });
    }
  };
  const sendPromo = async (promo_code, amount) => {
    try {
      const response = await axios.post(
        `api/promo-code/record/save`,
        { promo_code, amount, device_id },  // ✅ correct
        { headers: { Authorization: token } }
      );

      if (response.status === 200 || response.status === 201) {
        setPromoMessage({ message: response?.data?.message, status: true });
        toast.success("Promo Applied Successfully!");
      } else {
        toast.warning("Something went wrong");
      }
    } catch (error) {
      console.log(error.message);
      setPromoMessage({
        message: error?.response?.data?.message,
        status: false,
      });
    }
  };


  const removePromo = async (promo_code) => {
    try {
      const response = await axios.post(
        `api/promo-code/cancel/apply`,

        { ...promo_code, device_id: device_id },
        { headers: { Authorization: token } }
      );
      if (response.status == 200 || 201) {
        setRemovePromoDAta(true);
        setPromo("");
      }
    } catch (error) {
      console.log(error.message);
      toast.error("something went wrong");
    }
  };

  const verifyPromo1 = async (promo_code, amount) => {
    try {
      setPromo({ data: {}, loading: true });
      const response = await axios.post(`api/promo-code/details`, promo_code,
        { device_id: device_id }, {

        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        if (response?.data?.data?.discountType == "Amount") {
          const discount = response?.data?.data?.discount;
          const updatedAmount = cartlistData?.data?.total_cart_price - discount;
          sendPromo(promo_code, amount, device_id);
          setAmount(Math.round(updatedAmount));
        } else if (response?.data?.data?.discountType === "Percentage") {
          const discountPercentage = response?.data?.data?.discount;
          const discountAmount =
            (cartlistData?.data?.total_cart_price * discountPercentage) / 100;
          const updatedAmount =
            cartlistData?.data?.total_cart_price - discountAmount;
          sendPromo(promo_code, cartlistData?.data?.total_cart_price, device_id);
          setAmount(Math.round(updatedAmount));
        }
        setPromo({ data: response?.data?.data, loading: false });
      }
    } catch (error) {
      console.log(error.message);
      setPromo({
        data: {},
        loading: false,
        message: error?.response?.data?.message,
      });
    }
  };

  const verifyPromo = async ({ promo_code, amount }) => {
    try {
      setPromo({ data: {}, loading: true });

      const response = await axios.post(
        `api/promo-code/details`,
        { promo_code, amount, device_id },
        {
          headers: { Authorization: token },
        }
      );

      if (response.status === 200) {
        if (response?.data?.data?.discountType === "Amount") {
          const discount = response?.data?.data?.discount;
          const updatedAmount = cartlistData?.data?.total_cart_price - discount;

          sendPromo(promo_code, amount);
          setAmount(Math.round(updatedAmount));
        } else if (response?.data?.data?.discountType === "Percentage") {
          const discountPercentage = response?.data?.data?.discount;
          const discountAmount =
            (cartlistData?.data?.total_cart_price * discountPercentage) / 100;
          const updatedAmount =
            cartlistData?.data?.total_cart_price - discountAmount;

          sendPromo(promo_code, cartlistData?.data?.total_cart_price);
          setAmount(Math.round(updatedAmount));
        }

        setPromo({ data: response?.data?.data, loading: false });
      }
    } catch (error) {
      console.log(error.message);
      setPromo({
        data: {},
        loading: false,
        message: error?.response?.data?.message,
      });
    }
  };

  const checkAvailability = async (pincode) => {
    try {
      setAvailability({ loading: true, message: "", status: false });
      const { data, status } = await axios.post(
        `api/pincode/availability/check`,
        { pincode }
      );
      if (status === 200) {
        setAvailability({
          loading: false,
          message: data?.message,
          status: true,
        });
      } else {
        setAvailability({
          loading: false,
          message: data?.message,
          status: false,
        });
      }
    } catch (error) {
      // toast.error(error.response?.data?.message);
      setAvailability({
        loading: false,
        message: error.response?.data?.message,
        status: false,
      });
    }
  };

  const minusQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setStock("InStock");
    }
  };

  // const plusQty = (item) => {
  //   if (item?.stock >= quantity + 1) {
  //     setQuantity(quantity + 1);
  //     setStock("InStock");
  //   } else {
  //     setStock("Out of Stock !");
  //   }
  // };
  const plusQty = (item, selectedVariant) => {
    const availableStock = selectedVariant?.stock || item?.stock || 0;

    if (quantity + 1 <= availableStock) {
      setQuantity(quantity + 1);
      setStock("In Stock");
    } else {
      setStock("Out of Stock!");
    }
  };

  const [orderStatusList, setOrderStatusList] = useState({
    loading: false,
    data: [],
  });

  const getOrderStatus = async () => {
    try {
      const response = await axios.get(`api/order-status/list`, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        setOrderStatusList({
          data: response?.data?.data || [],
          loading: false,
        });
      } else {
        toast.error(response?.data?.message);
        setOrderStatusList({ data: [], loading: false });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
      setOrderStatusList({ data: [], loading: false });
    }
  };

  const offerProductAddedTocart = async (slug) => {
    try {
      const response = await axios.post(
        `/api/user/product/cart/offer/${slug}`,
        { device_id: device_id },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("Response:", response.data);

      if (response.data.success) {
        toast.success(response.data.message || "Offer applied successfully");
        getCartList();
        setCartModalShow(true);
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Offer add error:", error);
      toast.error(
        error.response?.data?.message || "Server error while adding offer"
      );
    }
  };
  useEffect(() => {
    if (!isLogin) {
      setCartListData({ data: { items: [] } });
    }
  }, [isLogin]);

  return (
    <cartListContext.Provider
      value={{
        loading,
        navigate,
        minusQty,
        plusQty,
        quantity,
        setQuantity,

        // all functions passed here
        addToCart,
        getCartList,
        removeFromCartlist,
        updateCart,
        clearCartlist,
        getStateList,
        getPlaceOrder,
        getOrderList,
        getOrderDetailPage,
        verifyPromo,
        sendPromo,
        removePromo,
        setPromoMessage,
        setPromoCode,
        handlePromoremove,
        CancelOrder,
        checkAvailability,
        setAvailability,
        getOrderStatus,
        // functions end here

        // all data states pass here
        orderStatusList,
        cartlistData,
        stock,
        setStock,
        isLogin,
        stateList,
        orderList,
        placedOrder,
        orderDetailList,
        promo,
        setAmount,
        amount,
        addCartLoading,
        setPromo,
        removePromoData,
        promoMessage,
        promo_code,
        checkPaymentResponse,
        availability,
        singleOrderPlace,
        offerAddToCart,
        offerProductAddedTocart, cartModalShow, setCartModalShow, cartLoading, loadingItem
      }}
    >
      {props.children}
    </cartListContext.Provider>
  );
};

export default CartListContextProvider;
export const useCartlistContext = () => useContext(cartListContext);
