import React, { useEffect, useState } from "react";
import CommonLayout from "../../component/shop/common-layout";
import Sidebar from "./Sidebar";
import { useParams } from "react-router-dom";
import { useCartlistContext } from "../../helpers/cart/AddCartContext";
import ReviewAddModal from "../ReviewAddModal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Button } from "reactstrap";

import axios from "../../helpers/axios";
import { useAuthContext } from "../../helpers/auth/authContext";
const MySwal = withReactContent(Swal);

const MyOrderDetail = () => {
  const {
    getOrderDetailPage,
    orderDetailList,
    navigate,
    CancelOrder,
    getOrderStatus,
    orderStatusList,
  } = useCartlistContext();

  useEffect(() => {
    getOrderStatus();
  }, []);
  // console.log(orderStatusList.data[0].title)

  const params = useParams();
  const orderStatus = "Cancelled";

  const {
    billing_address,
    shipping_address,
    shipping_method,
    status,
    total_amount,
    user_email,
    user_name,
    delivery_boy_name,
    delivery_boy_user_name,
    discount_amount,
    final_amount,
    items,
    order_date,
    order_id,
    payment_mode,
    payment_status,
    invoice,
    order_histories,
  } = orderDetailList?.data || {};

  const downloadReport = (reportUrl) => {
    if (!reportUrl) {
      alert("Report not available!");
      return;
    }
    window.open(reportUrl, "_blank");
  };

  const handleCancelOrder = (status, id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "Do you really want to Cancel this Order ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        CancelOrder(status, id).finally(() => {
          MySwal.fire("Canceled!", "Your Order has been Canceled.", "success");
        });
      }
    });
  };

  useEffect(() => {
    if (params.id) {
      getOrderDetailPage(params.id);
    } else navigate("/");
  }, [params.id]);
  const titles = orderStatusList.data.map((a) => a.title).join(" ");
  const hasDeliveredOrCancelled = orderStatusList.data.some(
    (a) => a.title === "Delivered" || a.title === "Cancelled"
  );
  // console.log(titles)
  // console.log(hasDeliveredOrCancelled)

  //======================Added By Raja==========================
  const { token } = useAuthContext();
  const [comboProducts, setComboProducts] = useState([]);
  const comboProductIds =
    orderDetailList?.data?.items?.flatMap(
      (item) => item.comboOfferProduct?.map((c) => c.product_id) || []
    ) || [];
  const comboProductQnt =
    orderDetailList?.data?.items?.flatMap(
      (item) => item.comboOfferProduct?.map((c) => c.quantity) || []
    ) || [];

  useEffect(() => {
    if (comboProductIds.length > 0) {
      axios
        .get(`api/by-ids?ids=${comboProductIds.join(",")}`, {
          headers: { Authorization: token },
        })
        .then((res) => {
          setComboProducts(res.data || []);
          console.log("Fetched combo products:", res.data);
        })
        .catch((err) => {
          console.error("Error fetching combo products:", err);
          setComboProducts([]);
        });
    } else {
      setComboProducts([]);
    }
  }, [comboProductIds.join(","), token]);

  return (
    <CommonLayout parent="home" title="My Order Detail">
      {/* page body part start */}
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
                    <div className="page-title">
                      <h2>Order Details</h2>
                    </div>
                    <hr />
                    {orderDetailList.loading ? (
                      <div className="col-md-12 d-flex justify-content-center">
                        <div
                          className="spinner-grow text-info my-4"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="row mb-2">
                          <div className="col-md-6 text-right">
                            <div className="bg-warning bg-opacity-10 p-2">
                              <h5 className="mb-0">
                                <b>Shipping Info</b>
                              </h5>
                              <hr className="mt-0 mb-1" />
                              <div>
                                {shipping_address?.first_name && (
                                  <>
                                    <b>Name : </b>{" "}
                                    {shipping_address?.first_name}{" "}
                                    {shipping_address.last_name}
                                    <br />
                                  </>
                                )}
                                {shipping_address?.email && (
                                  <>
                                    <b>Email : </b> {shipping_address?.email}
                                    <br />
                                  </>
                                )}
                                {shipping_address?.phone_number && (
                                  <>
                                    <b>Phone : </b>{" "}
                                    {shipping_address?.phone_number}
                                    <br />
                                  </>
                                )}
                                {(shipping_address?.address_line_1 ||
                                  shipping_address?.city) && (
                                    <>
                                      <b>Address : </b>
                                      {shipping_address?.address_line_1}{" "}
                                      {shipping_address?.city}
                                      <br />
                                    </>
                                  )}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 text-left">
                            <div className="bg-warning bg-opacity-10 p-2">
                              <b>Order Id :</b> {order_id}
                              <br />
                              <b>Order Date :</b>{" "}
                              {new Date(order_date).toLocaleDateString("en-GB")}
                              <br />
                              <b>Payment Mode : </b> {payment_mode}
                              <br />
                              <b>Payment Status : </b> {payment_status}
                            </div>
                          </div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-md-12 mt-4">
                            <h5>
                              <b>Order Status</b>
                            </h5>
                            <div className="table-responsive my-4">
                              <table className="table table-hover align-middle shadow-sm">
                                <thead className="bg-primary text-white">
                                  <tr>
                                    <th className="text-center">#</th>
                                    <th className="text-center">Status</th>
                                    <th className="text-center">
                                      Updated Time
                                    </th>
                                    <th className="text-center">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order_histories?.map((order, index) => (
                                    <tr key={order._id}>
                                      <td className="text-center fw-bold">
                                        {index + 1}
                                      </td>
                                      <td className="text-center">
                                        <span
                                          className={`badge ${order.status === "Pending"
                                            ? "bg-danger"
                                            : order.status === "Delivered"
                                              ? "bg-success"
                                              : "bg-warning text-dark"
                                            }`}
                                        >
                                          {order.status}
                                        </span>
                                      </td>
                                      <td className="text-center">
                                        {new Date(
                                          order.updatedAt
                                        ).toLocaleString("en-GB", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          hour12: true,
                                        })}
                                      </td>
                                      <td className="text-center">
                                        {/* <Button
  color="danger"
  size="sm"
  onClick={
    order.status === "Pending" 
      ? () => handleCancelOrder("Cancelled", params.id)
      : undefined
  }
  className="px-3 rounded-pill"
  disabled={order.status !== "Pending" || hasDeliveredOrCancelled}
>
  {`Order ${order.status }`}
</Button> */}
                                        {/* Pending Confirmed Cancelled Processing Pickup On The Way Delivered */}
                                        <Button
                                          color="danger"
                                          size="sm"
                                          onClick={
                                            order.status === "Pending"
                                              ? () =>
                                                handleCancelOrder(
                                                  "Cancelled",
                                                  params.id
                                                )
                                              : undefined
                                          }
                                          className="px-3 rounded-pill"
                                          disabled={order.status !== "Pending"}
                                        >
                                          {order.status === "Pending"
                                            ? "Cancel Order"
                                            : order.status === "Cancelled"
                                              ? "Order Cancelled"
                                              : "Order Cancelled"}
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="col-md-12 mt-4">
                            <h5>
                              <b>Product List</b>
                            </h5>
                            <div className="table-responsive">
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th>Image</th>
                                    <th>Product Name</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Review</th>
                                  </tr>
                                </thead>
                                {/* <tbody>
                                  {Array.isArray(items) &&
                                    items?.map((item, i) => (
                                      
                                      
                                      <tr key={i}>
                                        <td>
                                          <img
                                            src={item?.images[0]}
                                            style={{ width: 70 }}
                                          />
                                        </td>
                                        <td>{item?.itemName}</td>
                                        <td>{item?.quantity}</td>
                                        <td>₹ {item?.total_price}</td>
                                        <td>
                                          <ReviewAddModal
                                            status={status}
                                            id={item?.product_id}
                                          />
                                        </td>
                                      </tr>
                                    ))}
                                    {

                                    }
                                </tbody> */}
                                <tbody>
                                  {Array.isArray(items) &&
                                    items.map((item, i) => {
                                      const currentComboProductIds =
                                        item.comboOfferProduct?.map((c) => c.product_id) || [];

                                      const relatedComboProducts = comboProducts.filter((comboProduct) =>
                                        currentComboProductIds.includes(comboProduct._id)
                                      );

                                      return (
                                        <React.Fragment key={`item-${item._id || i}`}>
                                          <tr>
                                            <td>
                                              {item?.images?.[0] && (
                                                <img
                                                  src={item.images[0]}
                                                  style={{ width: 70 }}
                                                  alt={item?.itemName}
                                                />
                                              )}
                                            </td>
                                            <td>{item?.itemName}</td>
                                            <td>{item?.quantity}</td>
                                            <td>₹ {item?.total_price}</td>
                                            <td>
                                              <ReviewAddModal
                                                status={status}
                                                id={item?.product_id}
                                                order_id={order_id}
                                              />
                                            </td>
                                          </tr>

                                          {relatedComboProducts.map((comboProduct, comboIndex) => (
                                            <tr key={`combo-${item._id}-${comboProduct._id}-${comboIndex}`}>
                                              <td>
                                                <img
                                                  src={comboProduct?.images?.[0] || "/placeholder-image.jpg"}
                                                  style={{ width: 70 }}
                                                  alt={comboProduct?.itemName}
                                                />
                                              </td>
                                              <td>{comboProduct?.itemName} (Free)</td>
                                              <td>{comboProductQnt[comboIndex] || 1}</td>
                                              <td>
                                                Free <del>₹{comboProduct?.offer_price}</del>
                                              </td>
                                              <td>
                                                <ReviewAddModal
                                                  status={status}
                                                  id={comboProduct?._id}
                                                  order_id={order_id}
                                                />
                                              </td>
                                            </tr>
                                          ))}
                                        </React.Fragment>
                                      );
                                    })}

                                </tbody>
                              </table>
                            </div>
                            <div className="d-flex justify-content-between mt-4">
                              <h4>
                                <span>Total Amount :</span> ₹ {final_amount}
                              </h4>
                              <button
                                onClick={() => downloadReport(invoice)}
                                disabled={!invoice}
                                className="btn bg-success text-white"
                              >
                                Download Invoice
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
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

export default MyOrderDetail;
