import { toast } from "react-toastify";
import axios from "../axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../auth/authContext";


export const commonContext = createContext();

const CommonProvider = (props) => {
  const { token, isLogin } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [storeSetting, setStoreSetting] = useState({});
  const [cms, setCms] = useState([]);
  const [cmsDetail, setCmsDetail] = useState({ data: {}, loading: false });
  const [BannerData, setBannerData] = useState({ loading: true, data: [] });
  const [codModalShow, setCodModalShow] = useState(false);

  const [FeatureSection, setFeatureSection] = useState({
    loading: true,
    data: [],
  });
  const [certificateData, setCertificateData] = useState({
    loading: false,
    data: [],
  });
  const [faqData, setFaqData] = useState({ loading: false, data: [] });
  const [reviewList, setReviewList] = useState({ loading: false, data: [] });
  const [mainLoading, setMainLoading] = useState({ contact: false });
  const [emailSubscribed, setEmailSubscribed] = useState({});
  const [eventList, setEvenList] = useState({ data: [], loading: true });
  const [eventDetail, setEventDetail] = useState({});
  const [show, setShow] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");
  const [comboOfferList, setComboOfferList] = useState([
    { loading: false, data: [] },
  ]);

  // categoryList function
  const getStoreSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`api/store/setting/details`);
      const res = response?.data;
      if (response?.status === 200) {
        setStoreSetting(response?.data?.data);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCms = async () => {
    try {
      const response = await axios.post(`api/cms/getAll`, {});
      if (response?.status === 200) {
        setCms(response?.data?.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getCmsDetail = async (slug) => {
    try {
      setCmsDetail({ data: [], loading: true });
      const response = await axios.post(`api/cms/details`, { slug });
      if (response?.status === 200) {
        setCmsDetail({ data: response?.data?.data, loading: false });
      }
    } catch (error) {
      setCmsDetail({ data: [], loading: false });
      console.log("Error:", error.message);
    }
  };

  const getStoreBanners = async () => {
    try {
      setBannerData({ ...BannerData, loading: true });
      const response = await axios.get(`api/banner-list`);
      const res = response?.data;
      if (response?.status === 200) {
        setBannerData({ loading: false, data: res?.data });
      } else {
        setBannerData({ ...BannerData, loading: false });
      }
    } catch (error) {
      setBannerData({ ...BannerData, loading: false });
    }
  };

  const getFeatureSections = async () => {
    try {
      setFeatureSection({ ...FeatureSection, loading: true });
      const response = await axios.get(`api/section/getAll`);
      const res = response?.data;
      if (response?.status === 200) {
        setFeatureSection({ loading: false, data: res?.data });
      } else {
        setFeatureSection({ ...FeatureSection, loading: false });
      }
    } catch (error) {
      setFeatureSection({ ...FeatureSection, loading: false });
    }
  };

  const getCertificate = async () => {
    try {
      setCertificateData({ loading: true, data: [] });
      const response = await axios.get(`api/certificates`);
      if (response.status === 200) {
        setCertificateData({ data: response.data.data, loading: false });
      }
    } catch (error) {
      console.log(error.message);
      setCertificateData({ data: [], loading: false });
    }
  };

  const getFaqs = async () => {
    try {
      setFaqData({ loading: true, data: [] });
      const response = await axios.post(`api/all-faq`, {});
      if (response?.status === 200) {
        setFaqData({ data: response?.data?.data, loading: false });
      }
    } catch (error) {
      console.log(error.message);
      setFaqData({ data: [], loading: false });
    }
  };

  const getreviewsList = async (productId) => {
    setReviewList({ loading: true, data: [] });
    try {
      const response = await axios.post(`api/product/review/list`, {
        productId,
      });
      if (response?.status === 200) {
        setReviewList({ data: response?.data?.data, loading: false });
      }
    } catch (error) {
      console.log(error.message);
      setReviewList({ data: [], loading: false });
    }
  };

  const emailSubscription = async (email) => {
    try {
      setEmailSubscribed({ loading: true, data: "" });
      const response = await axios.post(`api/subscribed-email/add`, { email });
      if (response.status === 200) {
        setEmailSubscribed({
          loading: false,
          data: "Email Id is Stored for Newsletter.",
        });
      }
    } catch (error) {
      console.log(error.message);
      setEmailSubscribed({
        loading: false,
        data: "",
        error: "Something Went Wrong",
      });
    }
  };

  const getEnquiry = async (formData) => {
    try {
      setMainLoading({ contact: true });
      const response = await axios.post(`api/contact-us/save`, formData, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        toast.success("Jaisal Will Contact You Shortly!");
      }
    } catch (error) {
      console.log(error.message);
      toast.error("An error occurred ");
    } finally {
      setMainLoading({ contact: false });
    }
  };

  const getEventsList = async () => {
    try {
      setEvenList({ data: [], loading: true });
      const response = await axios.post(`api/events/list`, {});
      if (response.status === 200) {
        setEvenList({ data: response?.data?.data || [], loading: false });
      } else {
        setEvenList({ data: [], loading: false });
      }
    } catch (error) {
      console.log(error.message);
      setEvenList({ data: [], loading: false });
    }
  };

  const getEventDetail = async (id) => {
    try {
      setEventDetail({ data: {}, loading: true });
      const response = await axios.get(`api/event/details/${id}`);
      if (response.status === 200) {
        setEventDetail({ data: response?.data?.data, loading: false });
      }
    } catch (error) {
      console.log(error.message);
      setEventDetail({ data: {}, loading: false });
    }
  };
  const [blogs, setBlogs] = useState();

  const getBlogs = async () => {
    try {
      const response = await axios.get("api/admin/blog/all-blog");
      // console.log(response?.data);
      setBlogs(response.data); // Store blogs in state
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };
  const [blogDetail, setBlogDetail] = useState({});
  const getBlogDetail = async (id) => {
    try {
      const response = await axios.get(`api/admin/blog/single-blog/${id}`);
      setBlogDetail(response.data);
    } catch (error) {
      console.error("Error fetching blog detail:", error);
      throw error;
    }
  };
  const [recipes, setRecipes] = useState();
  const getRecipes = async () => {
    try {
      const response = await axios.get("api/admin/recipes/all-recipes");
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const [homeScreenReview, setHomeScreenReview] = useState({
    data: [],
    loading: false,
  });
  const getHomeScreenReview = async () => {
    try {
      const response = await axios.get(`api/user-home-screen/review/list`);
      if (response?.data?.status === 200) {
        setHomeScreenReview({
          data: response.data.data || [],
          loading: false,
        });
      } else {
        toast.error(
          response?.data?.message || "Failed to delete notification."
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllComboOfferProduct = async () => {
    try {
      const { data } = await axios.get(`api/offer-product/get-active-offers`, {
        headers: {
          Authorization: token,
        },
      });
      if (data.status === 200) {
        setComboOfferList({ data: data.data || [], loading: false });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    }
  };


  const [singleOfferProduct, setSingleOfferProduct] = useState({ data: [], loading: false });
  const getSingleOfferProduct = async (slug) => {
    try {
      const { data } = await axios.get(`api/offer-product/details/${slug}`);
      if (data.status === 200) {

        return data.data;
      } else {
        return null;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
      return null;
    }
  };
  const [comboOfferProductDeatils, setComboOfferProductDeatils] = useState({ data: [], loading: false });
  const getAllComboOfferProductDeatils = async () => {
    try {
      setComboOfferProductDeatils({ data: [], loading: true });
      const { data } = await axios.get(`api/offer-product/details`,);
      if (data.status === 200) {
        setComboOfferProductDeatils({ data: data.data, loading: false });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
      setComboOfferProductDeatils({ data: [], loading: false });
    }
  };

  return (
    <commonContext.Provider
      value={{
        loading,
        navigate,

        // all functions passed here
        getStoreSettings,
        getCms,
        getCmsDetail,
        getStoreBanners,
        getFeatureSections,
        getCertificate,
        getFaqs,
        getreviewsList,
        emailSubscription,
        getEventsList,
        getEventDetail,
        // functions end here

        // data prop for all functions starts here
        storeSetting,
        cms,
        cmsDetail,
        BannerData,
        FeatureSection,
        certificateData,
        faqData,
        reviewList,
        getEnquiry,
        mainLoading,
        emailSubscribed,
        eventList,
        eventDetail,
        blogs,
        getBlogs,
        blogDetail,
        getBlogDetail,
        show,
        setShow,
        recipes,
        getRecipes,
        getHomeScreenReview,
        homeScreenReview,
        getAllComboOfferProduct, comboOfferList, getSingleOfferProduct, singleOfferProduct, redirectPath, setRedirectPath,
        codModalShow, setCodModalShow,
        getAllComboOfferProductDeatils, comboOfferProductDeatils
      }}
    >
      {props.children}
    </commonContext.Provider>
  );
};

export default CommonProvider;
export const useCommonContext = () => useContext(commonContext);
