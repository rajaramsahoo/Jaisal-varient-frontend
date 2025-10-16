import { useLocation, useParams } from "react-router-dom";
import CommonLayout from "../component/shop/common-layout";
import TopCollection from "../component/collections/top-collection";
import ProductDetails from "../component/products/product-details";
import { useEffect } from "react";
import { useProductContext } from "../helpers/products/ProductContext";
import axios from "../helpers/axios";
const ProductPage = () => {
  const { relatedList, getRelatedProductList } = useProductContext();
  const params = useParams();
  const location = useLocation()
  const { itemName, category_name } = location?.state || {};


  useEffect(() => {
    if (params.id) {
      getRelatedProductList(params.id);
    }
  }, [params.id]);
  // const fetchdata = async () => {
  //   try {
  //     const response = await axios.get(`/api/single/${params.id}`);
  //     // console.log(response.data);
  //   } catch (error) {
  //     console.error("Error fetching product data:", error);
  //   }
  // }
  // fetchdata();
  return (
    <CommonLayout parent="Home" title={category_name} subTitle={itemName} >
      <ProductDetails pathId={params?.id} />
      {
        relatedList?.data?.data?.length > 0 && <TopCollection
          titleClass="title4"
          inner="title-inner4"
          line={true}
          productList={relatedList?.data?.data}
          title="You May Also Like"
          designClass="section-b-space addtocart_count ratio_square"
          noSlider="true"
          cartClass="cart-info cart-wrap"
        />
      }

    </CommonLayout>
  );
};

export default ProductPage;
