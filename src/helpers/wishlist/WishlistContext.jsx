import { toast } from "react-toastify";
import axios from "../axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../auth/authContext";
export const wishListContext = createContext();

const WishlistContextProvider = (props) => {
  const { token, isLogin } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [wishlistData, setWishListData] = useState({
    data: [],
    loading: false,
  });
  // console.log(token)

  // addToWishlist function
  const addToWishlist = async (product_id) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `api/user/product/wishlist/add`,
        { product_id: product_id || "" },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status == 200) {
        toast.success("Wishlist added successfully");
      }
    } catch (error) {
      toast.warning("Product already present in your wishlist");
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (product_id) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `api/user/product/wishlist/remove`,
        { product_id: product_id || "" },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status == 200) {
        getWishlist();
        toast.warning("Wishlist Removed");
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Wishlist function
  const getWishlist = async () => {
    try {
      setWishListData({ data: [], loading: true });
      const response = await axios.get(`api/user/product/wishlist`, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status == 200) {
        setWishListData({
          data: response?.data?.data?.wishlist,
          loading: false,
        });
      }else{
        setWishListData({ data: [], loading: false });
      }
    } catch (error) {
      setWishListData({ data: [], loading: false });
    }
  };

  return (
    <wishListContext.Provider
      value={{
        loading,
        navigate,

        // all functions passed here
        addToWishlist,
        getWishlist,
        removeFromWishlist,
        // functions end here

        // all data states pass here
        wishlistData,
      }}
    >
      {props.children}
    </wishListContext.Provider>
  );
};

export default WishlistContextProvider;
export const useWishlistContext = () => useContext(wishListContext);
