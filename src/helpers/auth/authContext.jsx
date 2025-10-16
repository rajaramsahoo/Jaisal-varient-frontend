import { toast } from "react-toastify";
import axios from "../axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCartlistContext } from "../cart/AddCartContext";

export const AuthContext = createContext();

const AuthProvider = (props) => {
  const navigate = useNavigate();
  const tk = localStorage.getItem("token");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isLogin, setIsLogin] = useState(!!localStorage.getItem("token"));
  const [isreggistered, setIsReggistered] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setuserData] = useState({});
  const [addressList, setAddressList] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const location = useLocation();
  const sendOtp = async (number) => {
    try {
      setLoading(true);
      const response = await axios.post(`api/user/login`, number);
      if (response.status === 200) {
        toast.success("OTP sent successfully");
        setIsReggistered(response?.data?.isAlreadyRegistered);
      }
    } catch (error) {
      toast.error("Signup failed. Please try again.");
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  // const verifyOtp = async (payload) => {
  //   const paramValue = new URLSearchParams(
  //     window.location.hash.split("?")[1]
  //   ).get("redirect");
  //   const code = new URLSearchParams(location.search).get("code");
  //   try {
  //     setLoading(true);
  //     const response = await axios.post(`api/user/verify-otp`, payload);
  //     const data = response.data;
  //     if (response.status === 200) {
  //       localStorage.setItem("token", data.token);
  //       setToken(data.token);
  //       setIsLogin(true);
  //       toast.success(data.message);
  //       if (!code || code != "JS001") {
  //         if (paramValue) {
  //           navigate(`${paramValue}`);
  //         } else {
  //           if (isreggistered) {
  //             navigate("/");
  //           } else navigate("/account/update/my-profile");
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     setIsLogin(false);
  //     toast.error(
  //       error.response?.data?.message || "Invalid OTP. Please try again."
  //     );
  //     console.log(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const verifyOtp = async (payload) => {
    let redirectPath = new URLSearchParams(location.search).get("redirect");
    const code = new URLSearchParams(location.search).get("code");

    // For modal login, fallback to localStorage
    if (!redirectPath) {
      redirectPath = localStorage.getItem("redirect_after_login");
      localStorage.removeItem("redirect_after_login");
    }

    try {
      setLoading(true);
      const response = await axios.post(`api/user/verify-otp`, payload);
      const data = response.data;

      if (response.status === 200) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setIsLogin(true);
        toast.success(data.message);

        // Redirect logic
        if (!code || code !== "JS001") {
          if (redirectPath) {
            navigate(redirectPath, { replace: true });
          } else if (isreggistered) {
            navigate("/", { replace: true });
          } else {
            navigate("/account/update/my-profile", { replace: true });
          }
        }
      }
    } catch (error) {
      setIsLogin(false);
      toast.error(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  // const verifyOtp = async (payload) => {
  //   const redirectPath = new URLSearchParams(location.search).get("redirect");
  //   const code = new URLSearchParams(location.search).get("code");
  //   try {
  //     setLoading(true);
  //     const response = await axios.post(`api/user/verify-otp`, payload);
  //     const data = response.data;
  //     if (response.status === 200) {
  //       localStorage.setItem("token", data.token);
  //       setToken(data.token);
  //       setIsLogin(true);
  //       toast.success(data.message);

  //       // Handle redirection
  //       if (!code || code !== "JS001") {
  //         if (redirectPath) {
  //           navigate(redirectPath, { replace: true });
  //         } else {
  //           if (isreggistered) {
  //             navigate("/", { replace: true });
  //           } else {
  //             navigate("/account/update/my-profile", { replace: true });
  //           }

  //         }
  //       }
  //     }
  //   } catch (error) {
  //     setIsLogin(false);
  //     toast.error(
  //       error.response?.data?.message || "Invalid OTP. Please try again."
  //     );
  //     console.log(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const verifyCodOtp = async (payload) => {
    try {
      setLoading(true);
      const response = await axios.post(`api/user/verify-cod-otp`, payload);
      const data = response.data;

      if (response.status === 200) {
        return { success: true, data, message: data.message };
      } else {
        return { success: false, data: null, message: "OTP verification failed" };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Invalid OTP. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  // const verifyCodOtp = async (payload) => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.post(`api/user/verify-cod-otp`, payload);
  //     const data = response.data;

  //     if (response.status === 200) {
  //       window.alert(data.message);
  //       return { success: true, data };
  //     } else {
  //       return { success: false, data: null };
  //     }
  //   } catch (error) {
  //     window.alert(error.response?.data?.message || "Invalid OTP. Please try again.");
  //     console.log(error.message);
  //     return { success: false, data: null };
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const getUserProfile = async () => {
    try {
      const response = await axios.get(`api/user/profile/details`, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        setuserData(response?.data?.data);
      }
    } catch (error) {
      localStorage.removeItem("token");
      setIsLogin(false);
      setToken("");
      setuserData({});
      // const tk = localStorage.getItem("token");
      // if(!tk){
      //   navigate("/login");
      // }
      console.log(error.message);
    }
  };

  const updateUserProfile = async (payload) => {
    try {
      setUpdateLoading(true);
      const response = await axios.post(`api/user/profile/update`, payload, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        toast.success("User profile updated successfully");
        navigate("/account/my-profile");
        getUserProfile();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogin(false);
    setToken("");
    setuserData({});
    toast.success("Logged out successfully");
    navigate("/");
  };

  const userAddressList = async () => {
    try {
      setAddressList({ data: {}, loading: true });
      const response = await axios.post(
        `api/user/saved/billing-shipping/address/list`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status === 200) {
        setAddressList({ data: response?.data || {}, loading: false });
      }
    } catch (error) {
      console.log(error.message);
      setAddressList({ data: {}, loading: false });
    }
  };

  const userAddressDelete = async (_id) => {
    try {
      const response = await axios.post(
        `api/user/address/delete`,
        { _id },
        {
          headers: { Authorization: token },
        }
      );
      response.status === 200
        ? await userAddressList()
        : toast.error("Something went wrong");
    } catch (error) {
      console.error(error.message);
      toast.error("Something went wrong");
    }
  };
  const [show, setShow] = useState(false);

  const handleRedirect = (path) => {
    if (isLogin) {
      navigate(path);
    } else {
      toast.warning("Please login first");
      setTimeout(() => {
        const currentHash = window.location.hash;
        const pathname = currentHash.split("?")[0].replace("#", "");
        navigate(`/login?redirect=${pathname}`);
        setShow(true);
      }, 1000);
    }
  };

  useEffect(() => {
    if (token) {
      setToken(token);
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, []);

  // useEffect(() => {
  //   if (isLogin && (!userData || !userData._id)) {
  //     getUserProfile();
  //   }
  //   // eslint-disable-next-line
  // }, [isLogin, userData]);
  useEffect(() => {
    if (isLogin) {
      getUserProfile();
    }
  }, [isLogin]); // ✅ removed userData from dependencies

  return (
    <AuthContext.Provider
      value={{
        token,
        loading,
        isLogin,
        setIsLogin,
        navigate,
        verifyOtp,
        sendOtp,
        userAddressList,
        addressList,
        handleLogout,
        getUserProfile,
        userData,
        handleRedirect,
        updateUserProfile,
        updateLoading,
        userAddressDelete,
        verifyCodOtp
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

// Export AuthProvider component and hook
export default AuthProvider;
export const useAuthContext = () => useContext(AuthContext);