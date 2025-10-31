import { useEffect, useState } from "react";
import { Col, Row, Media } from "reactstrap";
import ProductItem from "../products/product-box";
import PostLoader from "../common/post-loader";
import { Pagination, Stack } from "@mui/material";

const ProductList = ({
  categoryDetail,
  data,
  loading,
  colClass,
  layoutList,
  openSidebar,
  noSidebar,
  total,
  currentPage,
  setCurrentPage,
}) => {
  const [grid, setGrid] = useState(colClass);
  const [layout, setLayout] = useState(layoutList);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = categoryDetail?.image;
  const itemPerPage = 15;
  const totalPages = total ? Math.ceil(total / itemPerPage) : 1;

  // For rotating banner image (optional)
  useEffect(() => {
    if (images?.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000); // every 3 seconds
      return () => clearInterval(interval);
    }
  }, [images]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  console.log(data, "data")
  return (
    <Col className="collection-content">
      <div className="page-main-content">
        <Row>
          <Col sm="12">


            <div className="collection-product-wrapper">
              {/* Filter Button for Mobile/Sidebar */}
              {!noSidebar && (
                <Row>
                  <Col xl="12">
                    <div className="filter-main-btn" onClick={openSidebar}>
                      <span className="filter-btn btn btn-theme">
                        <i className="fa fa-filter" aria-hidden="true"></i>{" "}
                        Filter
                      </span>
                    </div>
                  </Col>
                </Row>
              )}

              {/* Products */}
              <div className={`product-wrapper-grid ${layout}`}>
                <Row>
                  {loading ? (
                    <PostLoader />
                  ) : data && data.length > 0 ? (
                    data.map((product, i) => (
                      <div className={grid} key={i}>
                        <div className="product addtocart_count">
                          <ProductItem product={product} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <Col xs="12" className="text-center">
                      <div className="empty-cart-cls">
                        <img
                          src={`/assets/images/coming_soon_page.jpg`}
                          className="img-fluid mb-4 mx-auto"
                          alt="No Products Found"
                        />
                        {/* <h3><strong>No Products Found</strong></h3>
                        <h4>Try adjusting your filters.</h4> */}
                      </div>
                    </Col>
                  )}
                </Row>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex align-items-center justify-content-center mt-4">
                  <Stack spacing={2}>
                    <Pagination
                      color="primary"
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      shape="rounded"
                    />
                  </Stack>
                </div>
              )}

              {/* Result Count */}
              <div className="text-center mt-4">
                <h5>
                  {data
                    ? `Showing ${data.length} product(s) of ${total} result(s)`
                    : "Loading..."}
                </h5>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Col>
  );
};

export default ProductList;
