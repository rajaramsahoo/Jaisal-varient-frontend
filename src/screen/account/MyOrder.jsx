import React, { useEffect, useState } from "react";
import CommonLayout from "../../component/shop/common-layout";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import { useCartlistContext } from "../../helpers/cart/AddCartContext";
import { Col, FormGroup, Pagination, Row } from "react-bootstrap";
import { Input, Label } from "reactstrap";

const MyOrder = () => {
  const { orderList, getOrderList } = useCartlistContext();
  const [currentPage, setCurrentPage] = useState(1);
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(today);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    getOrderList({
      page: currentPage,
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage, startDate, endDate]);

  return (
    <CommonLayout parent="home" title="My Order">
      <section className="section-b-space">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 z-0">
              <div className="dashboard-left">
                <div className="collection-mobile-back">
                  <span className="filter-back">
                    <i className="fa fa-angle-left" aria-hidden="true" /> back
                  </span>
                </div>
                <div className="block-content">
                  <Sidebar />
                </div>
              </div>
            </div>
            <div className="col-lg-9">
              <div className="dashboard-right">
                <div className="dashboard">
                  <div className="welcome-msg">
                    <div className="page-title text-center">
                      <h2>MY ORDERS</h2>
                    </div>
                    <hr />
                    <Row className="d-flex justify-content-center">
                      <Col md={4} className="mb-4">
                        <FormGroup>
                          <Label for="startDate">
                            <b>Start Date</b>
                          </Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            max={today}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4} className="mb-4">
                        <FormGroup>
                          <Label for="endDate">
                            <b>End Date</b>
                          </Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate}
                            max={today}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <hr />
                    {orderList?.loading ? (
                      <div className="col-md-12 d-flex justify-content-center">
                        <div
                          className="spinner-grow text-info my-4"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    ) : orderList?.data?.length > 0 ? (
                      <>
                        {/* Order List Table */}
                        <div className="table-responsive">
                          <table className="table table-bordered mb-0">
                            <thead>
                              <tr>
                                <th>Order Id</th>
                                <th>Order Date</th>
                                {/* <th>Item</th> */}
                                <th>Price (₹)</th>
                                <th>Payment Mode</th>
                                <th>Payment Status</th>
                                <th>Order Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orderList?.data.map((item, index) => (
                                <tr key={index}>
                                  <td>{item?.order_id}</td>
                                  <td>
                                    {new Date(
                                      item?.order_date
                                    ).toLocaleDateString("en-GB")}
                                  </td>
                                  {/* <td>{item?.quentity}</td> */}
                                  <td>₹ {item?.final_amount}</td>
                                  <td>{item?.payment_mode}</td>
                                  <td>{item?.payment_status}</td>
                                  <td>{item?.status}</td>
                                  <td>
                                    <Link
                                      className="btn btn-solid btn btn-secondary p-2"
                                      to={`/account/my-order/detail/${item._id}`}
                                    >
                                      <i className="fa fa-eye"></i>
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="d-flex align-items-center justify-content-center mt-4">
                            <Pagination>
                              <Pagination.Prev
                                disabled={currentPage === 1}
                                onClick={() =>
                                  handlePageChange(currentPage - 1)
                                }
                              />
                              {Array.from(
                                { length: orderList?.pageData?.pages },
                                (_, i) => (
                                  <Pagination.Item
                                    key={i + 1}
                                    active={i + 1 === currentPage}
                                    onClick={() => handlePageChange(i + 1)}
                                  >
                                    {i + 1}
                                  </Pagination.Item>
                                )
                              )}
                              <Pagination.Next
                                disabled={
                                  currentPage === orderList?.pageData?.pages
                                }
                                onClick={() =>
                                  handlePageChange(currentPage + 1)
                                }
                              />
                            </Pagination>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <h3>No orders found.</h3>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* page body part end */}
    </CommonLayout>
  );
};

export default MyOrder;
