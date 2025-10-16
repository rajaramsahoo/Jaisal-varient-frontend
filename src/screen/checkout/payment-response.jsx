import CommonLayout from "../../component/shop/common-layout";
import { Col, Container, Media, Row } from "reactstrap";
import { useCartlistContext } from "../../helpers/cart/AddCartContext";
import { FaDownload } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { InitialLoading } from "../../component/common/InitialLoading";
import { MdError } from "react-icons/md";
import axios from "../../helpers/axios";
const PaymentResponse = () => {
    const { checkPaymentResponse } = useCartlistContext();
   const location = useLocation();
const order_id = location.state?.order_id;

console.log("Order ID:", order_id);
    const [placedOrder, setPlacedOrder] = useState(null);
    console.log("Placed Order:", placedOrder);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            setIsLoading(true);
            const data = await checkPaymentResponse(order_id);
            console.log(data);
            setIsLoading(false);
            if (data?.status === 200) {
                
                console.log(data?.data);
                setPlacedOrder(data);
            } else {
                toast.warning(data.message);
            }
        }

        if (order_id) {
            fetchOrderDetail()
        }
    }, [order_id])

// useEffect(() => {
//   const fetchOrderDetail = async () => {
//     setIsLoading(true);

//     const data = await checkPaymentResponse(order_id);

//     if (data?.status === 200) {
//       const alreadyHandled = data?.data?.payment_response_handled;

//       if (!alreadyHandled) {
//         try {
//           await axios.post(`/api/payment-response/${order_id}`);
//         } catch (err) {
//           console.error("Error in payment-response POST", err);
//         }
//       }

//       setPlacedOrder(data);
//     } else {
//       toast.warning(data?.message || "Order not found");
//     }

//     setIsLoading(false);
//   };

//   if (order_id) {
//     fetchOrderDetail();
//   }
// }, [order_id]);



    const downloadReport = (reportUrl) => {
        if (!reportUrl) {
            alert("Report not available!");
            return;
        }
        window.open(reportUrl, "_blank");
    };

    if (isLoading) return <InitialLoading />;

    if (!order_id) {
        toast.error("Invalid Order ID!");
        return null;
    }
    
    console.log("Placed Order Data:", placedOrder);

    if (placedOrder?.data?.payment_status !== 'Paid') {
        return (
            <CommonLayout parent="home" title="order success">
                <section className="section-b-space light-layout white-1">
                    <Container>
                        <Row>
                            <Col md="12">
                                <div className="success-text">
                                    <MdError style={{ fontSize: 50, color: 'red'}} />
                                    <h2>thank you</h2>
                                    <p>
                                        Payment {placedOrder?.data?.payment_status}
                                    </p>
                                    <p>Order Id: {placedOrder?.data?.order_id}</p>
                                </div>
                                <div className="d-flex align-items-center justify-content-center  gap-2">
                                    <Link to="/">
                                        <button className="btn btn-primary mt-5">
                                            Go to Homepage
                                        </button>
                                    </Link>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </CommonLayout>
        )
    }

    return (
        <CommonLayout parent="home" title="order success">
            <section className="section-b-space light-layout white-1">
                <Container>
                    <Row>
                        <Col md="12">
                            <div className="success-text">
                                <i className="fa fa-check-circle" aria-hidden="true"></i>
                                <h2>thank you</h2>
                                <p>
                                    Payment is successfully processsed and your order is on the
                                    way
                                </p>
                                <p>Order Id: {placedOrder?.data?.order_id}</p>
                            </div>
                            <div className="d-flex align-items-center justify-content-center  gap-2">
                                <button
                                    onClick={() => downloadReport(placedOrder?.data?.invoice)}
                                    className="btn btn-primary mt-5 d-flex align-items-center gap-2"
                                    disabled={!placedOrder?.data?.invoice}
                                >
                                    <FaDownload /> Invoice
                                </button>
                                <Link to="/">
                                    <button className="btn btn-primary mt-5">
                                        Go to Homepage
                                    </button>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="section-b-space">
                <Container>
                    <Row>
                        <Col lg="6">
                            <div className="product-order">
                                <h3>your order details</h3>

                                {Array.isArray(placedOrder?.data?.items) &&
                                    placedOrder?.data?.items?.map((item, i) => (
                                        <Row className="product-order-detail" key={i}>
                                            <Col xs="3" key={i}>
                                             <img
  src={item?.images?.[0]}
  alt={item?.name || "Product image"}
  className="img-fluid blur-up lazyload"
/>

                                            </Col>
                                            <Col xs="3" className="order_detail">
                                                <div>
                                                    <h4>product name</h4>
                                                    <h5>{item.itemName}</h5>
                                                </div>
                                            </Col>
                                            <Col xs="3" className="order_detail">
                                                <div>
                                                    <h4>quantity</h4>
                                                    <h5>{item.quantity}</h5>
                                                </div>
                                            </Col>
                                            <Col xs="3" className="order_detail">
                                                <div>
                                                    <h4>price</h4>
                                                    <h5>₹{item.total_price}</h5>
                                                </div>
                                            </Col>
                                        </Row>
                                    ))}
                            </div>
                        </Col>
                        <Col lg="6">
                            <Row className="order-success-sec">
                                <Col sm="6">
                                    <h4>summery</h4>
                                    <ul className="order-detail">
                                        <li>order ID: {placedOrder?.data?.order_id}</li>
                                        <li>Order Date: October 22, 2023</li>
                                        <li>Order Total: {placedOrder?.data?.final_amount} </li>
                                    </ul>
                                </Col>
                                <Col sm="6">
                                    <h4>shipping address</h4>
                                    <ul className="order-detail">
                                        <li>{`${placedOrder?.data?.shipping_address?.first_name} ${placedOrder?.data?.shipping_address?.last_name}`}</li>
                                        <li>
                                            {placedOrder?.data?.shipping_address?.address_line_1}
                                        </li>
                                        <li>
                                            India, {placedOrder?.data?.shipping_address?.state},{" "}
                                            {placedOrder?.data?.shipping_address?.city},{" "}
                                            {placedOrder?.data?.shipping_address?.postal_code}{" "}
                                        </li>
                                        <li>
                                            Contact No.{" "}
                                            {placedOrder?.data?.shipping_address?.phone_number}
                                        </li>
                                    </ul>
                                </Col>
                                <Col sm="12" className="payment-mode">
                                    <h4>payment method</h4>
                                    <p>
                                        {/* Pay on Delivery (Cash/Card). Cash on delivery (COD)
                                        available. Card/Net banking acceptance subject to device
                                        availability. */}
                                        {placedOrder?.data?.payment_mode}
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </section>
        </CommonLayout>
    );

};

export default PaymentResponse;
