import { useEffect, useState } from "react";
import { Container, Row } from "reactstrap";
import CommonLayout from "../component/shop/common-layout";
import ProductList from "../component/shop/product-list";
import FilterPage from "../component/shop/filter";
import { useProductContext } from "../helpers/products/ProductContext";
import { useLocation, useParams } from "react-router-dom";

const Shop = () => {
  const { categoryList } = useProductContext();
  const { data, loading, getProductList, getPackagingSize } = useProductContext();
  const [sidebarView, setSidebarView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const params = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const packages = queryParams.get("packages");
  const start_price = queryParams.get("minPrice");
  const end_price = queryParams.get("maxPrice");
  const pack_sizes = packages ? packages.split(",") : [];

  const itemPerPage = 15;

  const payload = {
    category_slug: params.slug,
    page: currentPage,
    limit: itemPerPage,
    ...(parseInt(start_price) >= 0 && parseInt(end_price) >= 0 && {
      start_price: +start_price,
      end_price: +end_price,
    }),
    ...(pack_sizes.length > 0 && { pack_sizes }),
  };

  const categoryDetail = Array.isArray(categoryList?.data)
    ? categoryList.data.find((item) => item.slug === params.slug)
    : null;

  useEffect(() => {
    const timeout = setTimeout(() => {
      getProductList(payload);
    }, 500);
    return () => clearTimeout(timeout);
  }, [params.slug, start_price, end_price, packages, currentPage]);

  const openCloseSidebar = () => setSidebarView(!sidebarView);
  useEffect(() => {
    getPackagingSize(categoryDetail?._id)
  }, [categoryDetail?._id])
  return (
    <CommonLayout title={categoryDetail?.title} parent="home">
      <section className="section-b-space ratio_asos">
        <div className="collection-wrapper position-relative">
          <Container>
            <Row>
              <FilterPage
                sm="3"
                sidebarView={sidebarView}
                closeSidebar={openCloseSidebar}
              // categoryDetail={categoryDetail}

              />
              <ProductList
                categoryDetail={categoryDetail}
                data={data?.productList}
                loading={loading}
                total={data?.total}
                colClass="col-xl-4 col-6 col-grid-box"
                layoutList=""
                openSidebar={openCloseSidebar}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </Row>
          </Container>
        </div>
      </section>
    </CommonLayout>
  );
};

export default Shop;
