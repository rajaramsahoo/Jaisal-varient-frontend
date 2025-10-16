import { toast } from "react-toastify";
import axios from "../axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../auth/authContext";

export const productContext = createContext();

const ProductDetailsProvider = (props) => {
  const { token, isLogin } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState({
    productList: [],
    categoryList: [],
  });
  const [productDetail, setProductDetail] = useState({
    data: {},
    loading: false,
  });
  const [categoryList, setCategoryList] = useState({});
  const [relatedList, setRelatedList] = useState({});
  const [newArrivalProducts, setNewArrivalProducts] = useState([]);
  const [packageList, setPackageList] = useState({ data: [], loading: false });
  const [products, setProducts] = useState({ data: [], loading: false, message: "" });
  const [reqData, setReqData] = useState("");
  const [currentCategorySlug, setCurrentCategorySlug] = useState("");
  // categoryList function
  const getCategoryList = async () => {
    try {
      setCategoryList({ data: [], loading: true });
      const response = await axios.post(`api/category/list`, {});
      if (response?.status === 200) {
        setCategoryList({ data: response?.data?.data, loading: false });
      }
    } catch (error) {
      console.log(error.message);
      setCategoryList({ data: [], loading: true });
    }
  };

  // productList function
  const getProductList = async (payload) => {
    try {
      setLoading(true);
      const response = await axios.post(`api/product/list`, payload);
      if (response.status == 200) {
        setData({ ...data, productList: response?.data?.data, total: response.data.total, maxPrice: response.data.maxPrice, minPrice: response.data.minPrice });
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getRelatedProductList = async (product_id) => {
    try {
      setRelatedList({ data: [], loading: true });
      const response = await axios.post(`api/related/products/list`, {
        product_id,
      });
      if (response.status == 200) {
        setRelatedList({ data: response?.data, loading: false });
      }
    } catch (error) {
      console.log(error.message);
      setRelatedList({ data: [], loading: false });
    }
  };

  // ProductDetai function
  const getProductDetail = async (id) => {
    try {
      setProductDetail({ data: {}, loading: true });
      const response = await axios.get(`api/product/details/${id}`);
      if (response.status === 200) {
        setProductDetail({ data: response?.data?.data, loading: false });
      }
    } catch (error) {
      setProductDetail({ data: {}, loading: false });
      console.log(error.message);
    }
  };
  const [localStorageProducts, setLocalStorageProducts] = useState({
    data: [],
    loading: false,
  });

  const getlocalStorageProducts = async (ids) => {
    try {
      setLocalStorageProducts({ data: [], loading: true });

      const responses = await Promise.all(
        ids.map((id) => axios.get(`/api/product/details/${id}`))
      );

      const allProducts = responses
        .filter(res => res.status === 200)
        .map(res => res.data.data);

      setLocalStorageProducts({ data: allProducts, loading: false });

    } catch (error) {
      console.error("Error fetching multiple product details", error);
      setLocalStorageProducts({ data: [], loading: false });
    }
  };


  const getPackagingSize = async (categoryId) => {
    setPackageList({ data: data, loading: false });
    try {
      const { data, status } = await axios.post(
        `api/customer/filter/pack-size/list`, { category_id: categoryId }
      );
      status === 200 && setPackageList({ data: data?.data || [], loading: false });
    } catch (error) {
      setPackageList({ data: data, loading: false });
    }
  };

  // const getAllProducts = async (dataToSend) => {
  //   try {
  //     setProducts({ data: [], loading: true, message: "" });

  //     const response = await axios.post("/api/user-product/list", {
  //       keyword_search: dataToSend || category_slug:dataToSend,
  //     });

  //     if (response.status === 200) {
  //       const res = response.data;

  //       if (res.success && Array.isArray(res.productList) && res.productList.length > 0) {
  //         //  products found
  //         setProducts({ data: res.productList, loading: false, message: "" });
  //       } else {
  //         //  no products case
  //         setProducts({ data: [], loading: false, message: res.message || "No Product Found" });
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setProducts({ data: [], loading: false, message: "Server error, please try again." });
  //   }
  // };

  const [searchProducts, setSearchProducts] = useState({ data: [], loading: true, message: "" })
  const getAllProducts111 = async (dataToSend, type = "keyword") => {
    try {
      if (type === "keyword") {
        setSearchProducts({ data: [], loading: true, message: "" });
      } else {
        setCategoryProducts({ data: [], loading: true, message: "" });
      }

      const payload = {};
      if (type === "keyword") payload.keyword_search = dataToSend;
      if (type === "category") payload.category_slug = dataToSend;

      const response = await axios.post("/api/user-product/list", payload);

      if (response.status === 200) {
        const res = response.data;

        const updateState = {
          data: res.success ? res.productList : [],
          loading: false,
          message: res.success ? "" : res.message || "No Product Found"
        };

        if (type === "keyword") {
          setSearchProducts(updateState);
        } else {
          setCategoryProducts(updateState);
        }
      }
    } catch (error) {
      console.error(error);
      if (type === "keyword") {
        setSearchProducts({ data: [], loading: false, message: "Server error" });
      } else {
        setCategoryProducts({ data: [], loading: false, message: "Server error" });
      }
    }
  };
  const getAllProducts = async (dataToSend, type = "keyword") => {
    try {
      if (type === "keyword") {
        setSearchProducts({ data: [], loading: true, message: "" });
      } else if (type === "category") {
        setProducts({ data: [], loading: true, message: "" });
      }

      // Build payload dynamically
      const payload = {};
      if (type === "keyword") {
        payload.keyword_search = dataToSend;
      } else if (type === "category") {
        payload.category_slug = dataToSend;
      }

      const response = await axios.post("/api/user-product/list", payload);

      if (response.status === 200) {
        const res = response.data;

        if (res.success && Array.isArray(res.productList) && res.productList.length > 0) {
          if (type === "keyword") {
            setSearchProducts({ data: res.productList, loading: false, message: "" });
          } else if (type === "category") {
            setProducts({ data: res.productList, loading: false, message: "" });
          }
        } else {
          if (type === "keyword") {
            setSearchProducts({
              data: [],
              loading: false,
              message: res.message || "No Product Found",
            });
          } else if (type === "category") {
            setProducts({
              data: [],
              loading: false,
              message: res.message || "No Product Found",
            });
          }
        }
      }
    } catch (error) {
      console.error(error);
      if (type === "keyword") {
        setSearchProducts({
          data: [],
          loading: false,
          message: "Server error, please try again.",
        });
      } else if (type === "category") {
        setProducts({
          data: [],
          loading: false,
          message: "Server error, please try again.",
        });
      }
    }
  };

  // const getAllProducts = async (dataToSend, type = "keyword") => {
  //   try {
  //     setProducts({ data: [], loading: true, message: "" });

  //     // Build payload dynamically
  //     const payload = {};
  //     if (type === "keyword") {
  //       payload.keyword_search = dataToSend;
  //     } else if (type === "category") {
  //       payload.category_slug = dataToSend;
  //     }

  //     const response = await axios.post("/api/user-product/list", payload);

  //     if (response.status === 200) {
  //       const res = response.data;

  //       if (res.success && Array.isArray(res.productList) && res.productList.length > 0) {
  //         // products found
  //         setProducts({ data: res.productList, loading: false, message: "" });
  //       } else {
  //         // no products case
  //         setProducts({ data: [], loading: false, message: res.message || "No Product Found" });
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setProducts({ data: [], loading: false, message: "Server error, please try again." });
  //   }
  // };

  return (
    <productContext.Provider
      value={{
        loading,
        navigate,

        // all functions passed here
        getCategoryList,
        getProductList,
        getProductDetail,
        getRelatedProductList,
        getPackagingSize,
        // functions end here

        // data prop for all functions starts here
        data,
        productDetail,
        categoryList,
        relatedList,
        newArrivalProducts,
        setNewArrivalProducts,
        packageList,
        getlocalStorageProducts, localStorageProducts,
        products, getAllProducts, reqData, setReqData, currentCategorySlug, setCurrentCategorySlug, searchProducts
      }}
    >
      {props.children}
    </productContext.Provider>
  );
};

export default ProductDetailsProvider;
export const useProductContext = () => useContext(productContext);
