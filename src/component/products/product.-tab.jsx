import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import ReviewList from "../common/review-list";
import { useCommonContext } from "../../helpers/common/CommonContext";
import { useNavigate } from "react-router-dom";

const ProductTab = ({ item }) => {
  const { getreviewsList, reviewList } = useCommonContext();
  const [activeTab, setActiveTab] = useState("1");
  const navigate = useNavigate();
  useEffect(() => {
    if (activeTab === "3") {
      getreviewsList(item?._id);
    }
  }, [activeTab, item?._id]);

  return (
    <section className="tab-product m-0">
      <Container>
        <Row>
          <Col sm="12" lg="12">
            <Row className="product-page-main m-0">
              <Nav tabs className="nav-material">
                <NavItem className="nav nav-tabs" id="myTab" role="tablist">
                  <NavLink
                    className={activeTab === "1" ? "active" : ""}
                    onClick={() => setActiveTab("1")}
                  >
                    Description
                  </NavLink>
                </NavItem>
                {item?.youtube_video_link && (
                  <NavItem className="nav nav-tabs" id="myTab" role="tablist">
                    <NavLink
                      className={activeTab === "2" ? "active" : ""}
                      onClick={() => setActiveTab("2")}
                    >
                      Video
                    </NavLink>
                  </NavItem>
                )}
                <NavItem className="nav nav-tabs" id="myTab" role="tablist">
                  <NavLink
                    className={activeTab === "3" ? "active" : ""}
                    onClick={() => setActiveTab("3")}
                  >
                    Reviews
                  </NavLink>
                </NavItem>
                {item?.comboOfferProducrt?.length > 0 && (
                  <NavItem className="nav nav-tabs" id="myTab" role="tablist">
                    <NavLink
                      className={activeTab === "4" ? "active" : ""}
                      onClick={() => setActiveTab("4")}
                    >
                      Combo Offer
                    </NavLink>
                  </NavItem>
                )}
              </Nav>
              <TabContent activeTab={activeTab} className="nav-material">
                <TabPane tabId="1">
                  <div className="mt-3">
                    <div className="table-responsive">
                      <table cellPadding="6" cellSpacing="0">

                        <tbody>

                          {item?.product_details &&
                            Array.isArray(item?.product_details) && (
                              <>
                                <tr>
                                  <th
                                    colSpan={2}
                                    style={{
                                      fontWeight: 700,
                                      fontSize: "20px",
                                      textAlign: "left",
                                    }}
                                  >
                                    Product Details
                                  </th>
                                </tr>
                                {item?.product_details.map((detail, index) => (
                                  <tr key={index}>
                                    <td>
                                      <strong>{detail?.key}</strong>
                                    </td>
                                    <td>: {detail?.value}</td>
                                  </tr>
                                ))}
                              </>
                            )}

                          <tr>
                            <th
                              colSpan={2}
                              style={{
                                fontWeight: 700,
                                fontSize: "20px",
                                textAlign: "left",
                              }}
                            >
                              Package Details
                            </th>
                          </tr>
                          <tr>
                            <td>
                              <strong>Packaging Type</strong>
                            </td>
                            <td>: {item?.bagtype_name}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Packaging Size</strong>
                            </td>
                            <td>
                              : {item?.packsize_name} {item?.unit}
                            </td>
                          </tr>

                          {item?.benefits && Array.isArray(item?.benefits) && (
                            <>
                              <tr>
                                <th
                                  colSpan={2}
                                  style={{
                                    fontWeight: 700,
                                    fontSize: "20px",
                                    textAlign: "left",
                                  }}
                                >
                                  Product Benefits
                                </th>
                              </tr>
                              {item?.benefits.map((detail, index) => (
                                <tr key={index}>
                                  <td>
                                    <strong>{detail?.key}</strong>
                                  </td>
                                  <td>: {detail?.value}</td>
                                </tr>
                              ))}
                            </>
                          )}

                        </tbody>

                      </table>
                    </div>
                  </div>
                </TabPane>
                <TabPane tabId="2">
                  {item?.youtube_video_link ? (
                    <div className="video-block">
                      <div className="video-wrapper">
                        <iframe
                          src={`${item?.youtube_video_link
                            ?.replace("youtu.be/", "www.youtube.com/embed/")
                            ?.replace("watch?v=", "embed/")}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          title="YouTube Video"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="mb-0 pb-0">No video Found</p>
                  )}
                </TabPane>
                <TabPane tabId="3">
                  <ReviewList
                    reviewList={reviewList?.data}
                    item={item}
                    loading={reviewList.loading}
                  />
                </TabPane>
                <TabPane tabId="4">
                  <Col lg="12">
                    <h4
                      style={{
                        fontWeight: 700,
                        fontSize: "20px",
                        textAlign: "left",
                        margin: "20px 0",
                      }}
                    >

                      <p className="mb-2 text-dark fw-semibold " style={{ fontSize: "18px" }}>
                        Free {item?.comboOfferProducrt?.length > 1 ? "Products" : "Product"} in {item?.itemName} :-
                      </p>

                    </h4>

                    <div className="d-flex flex-wrap gap-4">
                      {item?.comboOfferProducrt?.map((item, i) => (
                        <div
                          key={i}
                          className="text-center p-3 shadow-sm bg-white rounded"
                          style={{
                            width: "140px",
                            transition: "transform 0.2s",
                            border: "1px solid #eee",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                          onClick={() => navigate(`/product-details/${item?.product_id
                            }`)}
                        >
                          <img
                            src={item?.product_details?.images?.[0]}
                            alt={item?.product_details?.itemName || "Product image"}
                            className="img-fluid mb-2"
                            style={{
                              height: "100px",
                              width: "100%",
                              objectFit: "contain",
                              borderRadius: "8px",
                              backgroundColor: "#f9f9f9",
                            }}
                          />
                          <p className="mb-0 text-truncate text-dark fw-semibold" style={{ fontSize: "14px" }}>
                            {item?.product_details?.itemName}
                          </p>

                        </div>
                      ))}
                    </div>
                  </Col>
                </TabPane>

              </TabContent>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProductTab;
