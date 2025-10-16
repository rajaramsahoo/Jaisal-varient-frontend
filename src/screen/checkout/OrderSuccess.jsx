import CommonLayout from "../../component/shop/common-layout";
import { Col, Container, Media, Row } from "reactstrap";
import { useCartlistContext } from "../../helpers/cart/AddCartContext";
import { FaDownload } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
const OrderSuccess = () => {
  const { placedOrder, navigate } = useCartlistContext();
  // if (!placedOrder?.data?.order_id) navigate("/");


// useEffect(() => {
//   const sendWhatsAppMessages = async () => {
//     const numbers = [
//       placedOrder?.data?.user_mobile,
//       "9564006347"
//     ];

//     for (const number of numbers) {
//       try {
//         const response = await axios.post(
//           'https://crm.waabsys.com/api/meta/v19.0/653111984551009/messages',
//           {
//             messaging_product: 'whatsapp',
//             to: number,
//             type: 'template',
//             template: {
//               name: 'order_placed',
//               language: { code: 'en', policy: 'deterministic' },
//               components: [
//                 {
//                   type: 'body',
//                   parameters: [
//                     {
//                       type: 'text',
//                       text:
//                         placedOrder?.data?.billing_address?.first_name ||
//                         placedOrder?.data?.shipping_address?.first_name ||
//                         'Customer'
//                     },
//                     {
//                       type: 'text',
//                       text: placedOrder?.data?.order_id || 'ORDER123'
//                     }
//                   ]
//                 }
//               ]
//             }
//           },
//           {
//               headers: {
//           Authorization: `Bearer LqQDmDLUgBmFbah96C2T9Ug2Nv8DqX0lVo44jQzmwhAWWij2FAWqnuz9BVwNcCSMZZJDa9SmMKH0cFNLPrse739nIvs2vipzvehZ2hREFTSAVU5ERVJTQ09SRQX0pyJ6JvVU5ERVJTQ09SRQAJCLwosREFTSAC4`,
//           'Content-Type': 'application/json'
//         }
//           }
//         );
//         console.log(`WhatsApp sent to ${number}:`, response.data);
//       } catch (error) {
//         console.error(`WhatsApp send failed to ${number}:`, error?.response?.data || error.message);
//       }
//     }
//   };

//   if (placedOrder?.data?.order_id && placedOrder?.data?.items) {
//     sendWhatsAppMessages();
//   }
// }, [placedOrder]);

useEffect(() => {
  const sendWhatsAppMessages = async () => {
    const numbers = [
      placedOrder?.data?.user_mobile,
      "9564006347"
    ];

    const firstName =
      placedOrder?.data?.billing_address?.first_name ||
      placedOrder?.data?.shipping_address?.first_name || placedOrder?.data?.user_name ||
      "Customer";

    const orderId = placedOrder?.data?.order_id || "ORDER123";

    const imageUrl = placedOrder?.data?.items?.[0]?.images?.[0] || "";

    for (const number of numbers) {
      try {
        const payload = {
          fullPhoneNumber: `+91${number}`,
          type: "Template",
          template: {
            name: "order_placed",
            languageCode: "en",
            headerValues: [imageUrl],
            bodyValues: [
              firstName,
              orderId,
              `${placedOrder?.data?.final_amount}.00` || "0.00"
            ]
          }
        };

        const response = await axios.post(
          "https://api.interakt.ai/v1/public/message/",
          payload,
          {
            headers: {
              Authorization: `Basic Qml0a0w4R0VMTGR4VGVfZGdmTzFMeUxiYmdqQTgxeUZrZnh5S1RmYmN0TTo=`,
              "Content-Type": "application/json"
            }
          }
        );

        console.log(`WhatsApp sent to ${number}:`, response.data);
      } catch (error) {
        console.error(
          `WhatsApp send failed to ${number}:`,
          error?.response?.data || error.message
        );
      }
    }
  };

  if (
    placedOrder?.data?.order_id &&
    placedOrder?.data?.items &&
    placedOrder?.data?.user_mobile
  ) {
    sendWhatsAppMessages();
  }
}, [placedOrder]);

  const downloadReport = (reportUrl) => {
    if (!reportUrl) {
      alert("Report not available!");
      return;
    }
    window.open(reportUrl, "_blank");
  };

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
                  onClick={() => downloadReport(placedOrder?.invoice)}
                  className="btn btn-primary mt-5 d-flex align-items-center gap-2"
                  disabled={!placedOrder?.invoice}
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
                        <Media
                          src={item.images[0]}
                          alt=""
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
                    Pay on Delivery (Cash/Card). Cash on delivery (COD)
                    available. Card/Net banking acceptance subject to device
                    availability.
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

export default OrderSuccess;
