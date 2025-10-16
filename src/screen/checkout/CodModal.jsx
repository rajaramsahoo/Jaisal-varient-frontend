import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useAuthContext } from "../../helpers/auth/authContext";
import { useCartlistContext } from "../../helpers/cart/AddCartContext";
import axios from "../../helpers/axios";
import { i, p } from "motion/react-client";
import { useNavigate } from "react-router-dom";
const CodModal = ({ show, onHide, items, original_amount, discount, final_amount, ActualOriginalPriceOfAllItems, promocode_id }) => {
    const [currentStep, setCurrentStep] = useState("contact");
    const [userData, setUserData] = useState({ data: {}, loading: false });
    const [orderId, setOrderId] = useState(null);
    const { sendOtp, verifyCodOtp, isLogin, loading, token } = useAuthContext();
    const device_id = localStorage.getItem("guest_device_id");

    const {
        clearCartlist,
    } = useCartlistContext();


    const { cartModalShow, setCartModalShow } = useCartlistContext();
    const [otpMessage, setOtpMessage] = useState("Please enter the OTP sent to your mobile number.");
    const [otpStatus, setOtpStatus] = useState("info");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [timer, setTimer] = useState(0);
    const deviceId = localStorage.getItem("guest_device_id");

    const [formData, setFormData] = useState({
        phone: "",
        email: "",
        otp: ["", "", "", "", "", ""],
        name: "",
        pincode: "",
        city: "",
        state: "",
        houseNumber: "",
        area: "",
        landmark: "",
        saveAddress: false,
    });

    const [showOrderSummary, setShowOrderSummary] = useState(false);
    const navigate = useNavigate();

    const steps = [
        { id: "contact", label: "Contact", icon: "fa fa-user" },
        { id: "address", label: "Address", icon: "fa fa-map-marker" },
        { id: "payment", label: "Payment", icon: "fa fa-credit-card" },
    ];

    const getCurrentStepIndex = () => {
        if (currentStep === "contact" || currentStep === "otp") return 0;
        if (currentStep === "address") return 1;
        return 2;
    };

    const handleOtpChange = (index, value) => {
        if (value.length <= 1) {
            const newOtp = [...formData.otp];
            newOtp[index] = value;
            setFormData({ ...formData, otp: newOtp });

            if (value && index < 5) {
                const nextInput = document.getElementById(`otp-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const sendOtpHandler = async () => {
        if (formData.phone.length !== 10) {
            alert("Mobile number is not valid.");
            return false;
        }

        try {
            await sendOtp({ mobile: formData.phone, deviceId });
            setIsOtpSent(true);
            setTimer(60);

            const interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return true;
        } catch {
            return false;
        }
    };
    const verifyOtpHandler = async () => {
        if (!formData.otp || formData.otp.length !== 6) {
            setOtpMessage("Invalid OTP.");
            setOtpStatus("error");
            return false;
        }

        setUserData((prev) => ({ ...prev, loading: true }));

        const result = await verifyCodOtp({
            mobile: formData.phone,
            otp: formData.otp.join(""),
        });

        if (result.success) {
            setCurrentStep("address");
            setUserData({ data: result.data.data || [], loading: false });

            setOtpMessage(result.message || "OTP verified successfully ");
            setOtpStatus("success")

            if (result.data.addressList && result.data.addressList.length > 0) {
                const addr = result.data.addressList[0];
                setFormData((prev) => ({
                    ...prev,
                    pincode: addr.postal_code || "",
                    city: addr.city || "",
                    state: addr.state || "",
                    name: [addr.first_name, addr.last_name].filter(Boolean).join(" ") || "",
                    houseNumber: addr.address_line_1 || "",
                    area: addr.address_line_2 || "",
                    saveAddress: true,
                }));
            }
        } else {
            setUserData((prev) => ({ ...prev, loading: false }));
            setOtpMessage(result.message || "OTP verification failed ");
            setOtpStatus("error")
        }
    };


    const handlePlaceCodOrder = async () => {
        try {
            if (currentStep !== "payment") {
                setOtpMessage("Please complete all steps before placing the order.");
                setOtpStatus("error");
                return;
            }

            const nameParts = formData.name.trim().split(" ");
            const last_name = nameParts.length > 1 ? nameParts.pop() : "";
            const first_name = nameParts.join(" ");

            const userInfo = {
                mobile: formData.phone,
                email: formData.email,
                otp: formData.otp.join(""),
                name: formData.name,
                pincode: formData.pincode,
                city: formData.city,
                state: formData.state,
                address_line_1: formData.houseNumber,
                address_line_2: formData.area,
                saveAddress: formData.saveAddress,
                first_name,
                last_name,
            };
            let payload = {
                userData: userInfo,
            };
            if (!token && device_id) {
                payload.device_id = device_id;
            }
            if (promocode_id) {
                payload.promocode_id = promocode_id;
            }

            const headers = token ? { Authorization: token } : {};

            const response = await axios.post("/api/order/place-cod-order", payload, {

                headers,
            });
            if (response.status === 200 && response.data.success) {
                setOrderId(response.data?.order?.order_id);
                setCurrentStep("success");
                setOtpMessage(response.data.message || "Order placed successfully!");
                setOtpStatus("success");
                //clearCartlist()
            }
        } catch (error) {
            setOtpMessage("Failed to place order. Please try again.");
            setOtpStatus("error");
        }
    };

    const handleContinue = async () => {
        if (currentStep === "contact") {
            const success = await sendOtpHandler();
            if (success) setCurrentStep("otp");
        } else if (currentStep === "otp") {
            await verifyOtpHandler();
        } else if (currentStep === "address") {
            setCurrentStep("payment");
        } else if (currentStep === "payment") {
            await handlePlaceCodOrder();
        }
    };

    const handleBack = () => {
        if (currentStep === "otp") {
            setCurrentStep("contact");
        } else if (currentStep === "address") {
            setCurrentStep("contact");
        } else if (currentStep === "payment") {
            setCurrentStep("address");
        }
    };

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const resendOtpHandler = () => {
        sendOtp({ mobile: formData.phone });
        setFormData((prev) => ({ ...prev, otp: ["", "", "", "", "", ""] }));
        setTimer(60);
    };

    const handleContinueShopping = () => {
        setCurrentStep("contact");
        setFormData({
            phone: "",
            email: "",
            otp: ["", "", "", "", "", ""],
            name: "",
            pincode: "",
            city: "",
            state: "",
            houseNumber: "",
            area: "",
            landmark: "",
            saveAddress: false,
        });
        setOrderId(null);
        onHide();
        setCartModalShow(false);
        clearCartlist();
        navigate("/");
    };
    return (
        <Modal show={show} onHide={onHide} centered size="lg" className="cod-modal codMainModalWrap">

            <Modal.Body>
                <div className="d-flex">
                    {/* Sidebar */}
                    <div className="sidebar">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                <div className="logo-container">
                                    <div className="logo">
                                        <img
                                            src="../assets/images/logo.svg"
                                            alt="Jaisal Organics" />
                                    </div>
                                    <span>Jaisal Organics</span>
                                </div>
                            </div>
                            <Button variant="link" className="p-0" onClick={onHide} >
                                <i className="fa fa-times" aria-hidden="true" style={{ color: "white", fontSize: "1rem" }}></i>
                            </Button>
                        </div>
                        <div className="order-summary-card" onClick={() => setShowOrderSummary(true)}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="mb-0" style={{ color: "white" }}>Order summary • {items?.length} items</h6>
                                <i className="fa fa-angle-right" style={{ color: "white" }}></i>
                            </div>
                            <div className="product-list" >
                                {items?.slice(0, 3).map((item, index) => (
                                    <div key={item?.item_details?._id} className="product-image">
                                        <img
                                            src={item?.product?.image}
                                            alt={item.alt}
                                            className="img-fluid"
                                        />
                                    </div>
                                ))}
                                {items?.length > 3 && (
                                    <div className="additional-items">
                                        <span>+{items?.length - 3}</span>
                                    </div>
                                )}

                            </div>

                            <div className="productDtl">
                                <h6>Jaisal Premium Basmati Rice 5kg</h6>
                                <div className="row">
                                    <div className="col-6">Qty. {items.reduce((sum, item) => sum + item.quantity, 0)}</div>
                                    <div className="col-6 text-end">
                                        {ActualOriginalPriceOfAllItems > original_amount ? (
                                            <>
                                                <span
                                                    className="mb-0 price-original"
                                                    style={{ textDecoration: "line-through", color: "#888" }}
                                                >
                                                    ₹{ActualOriginalPriceOfAllItems}
                                                </span>
                                                &nbsp;
                                                <span className="mb-0 price-current fw-bold text-success">
                                                    ₹{final_amount || original_amount}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="mb-0 price-current fw-bold">
                                                ₹{final_amount || original_amount}
                                            </span>
                                        )}

                                    </div>

                                </div>
                            </div>
                        </div>
                        {currentStep !== "contact" && (
                            <div className="using-as-card" style={{ cursor: "pointer", backgroundColor: "#054844", borderRadius: "12px", padding: "10px" }}
                            //  onClick={() => setCurrentStep("contact")}
                            >
                                <div className="d-flex align-items-center">
                                    <i className="fa fa-user me-3"></i>
                                    <span className="small">Using as +91 {formData.phone}</span>
                                    <i className="fa fa-chevron-right ms-auto"></i>
                                </div>
                            </div>
                        )}
                        <div className="secured-by">
                            <span className="fw-bold">Jaisal </span>

                            <span>Essence Of Every Home </span>
                        </div>
                    </div>
                    {/* Main Content */}
                    <div className="main-content codMainModalBx">
                        <div className="step-header d-flex align-items-center mb-4">
                            {currentStep !== "contact" && currentStep !== "success" && (
                                <Button variant="link" className="p-0 me-3" onClick={handleBack} style={{ color: "#054844" }}>
                                    <i className="fa fa-chevron-left"></i>
                                </Button>
                            )}
                            <div className="step-indicators d-flex">
                                {steps.map((step, index) => (
                                    <div key={step.id} className="d-flex align-items-center">
                                        <div className={`step-indicator ${index <= getCurrentStepIndex() ? "active" : "inactive"}`}>
                                            <i className={step.icon}></i>
                                            <span>{step.label}</span>
                                        </div>
                                        {index < steps.length - 1 && <i className="fa fa-chevron-right text-muted mx-2"></i>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="content-area">
                            {currentStep === "contact" && (
                                <div className="contact-step pt-5">
                                    <div className="d-flex">
                                        <div className="step-icon"><i className="fa fa-user"></i></div>
                                        <div>
                                            <h2 className="h5 fw-bold text-dark mt-1 mb-0">Contact details</h2>
                                            <p className="text-muted mb-0">Enter mobile & email to continue</p>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="phone-input-group">
                                            <input
                                                type="text"
                                                className="form-control rounded-1 form-select-sm"
                                                style={{ marginTop: "20px" }}
                                                value={formData.phone}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value.length <= 10 && /^[0-9]*$/.test(value)) {
                                                        setFormData({ ...formData, phone: value });
                                                    }
                                                }}
                                                placeholder="Mobile number"
                                            />

                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <input
                                            type="email"
                                            className="form-control rounded-1 form-select-sm"
                                            style={{
                                                marginTop: "20px",
                                            }}
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="Email address (optional)"
                                        />
                                    </div>
                                    <Button
                                        className="btn-primary-custom w-100 rounded-2"
                                        onClick={handleContinue}
                                        style={{
                                            backgroundColor: "#054844",
                                            height: "40px",
                                        }}
                                        disabled={!formData.phone || !formData.phone.match(/^\d{10}$/)}
                                    >
                                        Continue
                                    </Button>
                                </div>
                            )}
                            {currentStep === "otp" && (
                                <div className="otp-step">
                                    <div className="mb-4 pt-5">
                                        <div className="d-flex mb-4">
                                            <div className="step-icon"><i className="fa fa-lock"></i></div>
                                            <div>
                                                <h2 className="h5 fw-bold text-dark mt-1 mb-0">Enter OTP</h2>
                                                <p className="text-muted mb-0">Enter OTP sent to +91{formData.phone}</p>
                                            </div>
                                        </div>
                                        <div className="otp-inputs">
                                            {formData.otp.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    id={`otp-${index}`}
                                                    type="text"
                                                    className="otp-input form-control"
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                                    maxLength="1"
                                                    style={{
                                                        borderRadius: "12px",
                                                        width: "44px",
                                                        height: "44px",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <div className="otp-actions">


                                            {
                                                timer > 0 ? (
                                                    <Button
                                                        className="p-0 text-muted"
                                                        variant="link"
                                                        style={{ color: "#054844" }}
                                                    >
                                                        Resend OTP in {timer}s
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        className="p-0"
                                                        variant="link"
                                                        style={{ color: "#054844" }}
                                                        onClick={resendOtpHandler}
                                                        disabled={timer > 0}
                                                    >
                                                        Resend OTP
                                                    </Button>
                                                )
                                            }


                                        </div>
                                        <div
                                            className={`small mb-3 ${otpStatus === "error"
                                                ? "text-danger"
                                                : otpStatus === "success"
                                                    ? "text-success"
                                                    : "text-muted"
                                                }`}
                                        >
                                            {otpMessage}
                                        </div>

                                    </div>
                                    <Button
                                        className="btn-primary-custom w-100 rounded-2"
                                        style={{
                                            backgroundColor: "#054844",
                                            height: "40px",
                                        }} onClick={handleContinue}
                                        disabled={formData.otp.some((digit) => !digit)}
                                    >
                                        {loading ? "Verifying..." : "Verify OTP"}

                                    </Button>
                                </div>
                            )}
                            {currentStep === "address" && (
                                <div className="address-step">

                                    <div className="d-flex mb-3">
                                        <div className="step-icon"><i className="fa fa-map-marker"></i></div>
                                        <div>
                                            <h2 className="h5 pt-1 fw-bold text-dark mb-0">Add delivery address</h2>
                                            <p className="text-muted mb-0">Drop your location for fast delivery</p>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            className="form-control rounded-1 form-select-sm"
                                            placeholder="Pincode"
                                            value={formData.pincode}
                                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                        />
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-6">
                                            <input
                                                className="form-control rounded-1 form-select-sm"
                                                placeholder="City"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <input
                                                className="form-select"
                                                value={formData.state}
                                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                style={{
                                                    borderRadius: "12px",
                                                }}

                                                placeholder="State"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            className={`form-control rounded-1 form-select-sm ${!formData.name ? "form-error" : ""}`}
                                            placeholder="Full name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            className={`form-control rounded-1 form-select-sm ${!formData.houseNumber ? "form-error" : ""}`}
                                            placeholder="House no / Building / Apartment"
                                            value={formData.houseNumber}
                                            onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            className="form-control rounded-1 form-select-sm"
                                            placeholder="Area, Sector, Street, Village"
                                            value={formData.area}
                                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                        />
                                    </div>

                                    <div className="mb-1">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="save-address"
                                                checked={formData.saveAddress}
                                                onChange={(e) => setFormData({ ...formData, saveAddress: e.target.checked })}

                                            />
                                            <label className="form-check-label small text-muted" htmlFor="save-address">
                                                Save my address as
                                            </label>
                                        </div>
                                    </div>
                                    <Button
                                        className="btn-primary-custom w-100 rounded-2"
                                        onClick={handleContinue}
                                        style={{
                                            backgroundColor: "#054844",
                                            height: "40px",
                                        }}
                                        disabled={!formData.name || !formData.houseNumber}
                                    >
                                        Continue
                                    </Button>
                                </div>
                            )}
                            {currentStep === "payment" && (
                                <div className="payment-step">

                                    <div className="d-flex mb-4">
                                        <div className="step-icon"><i className="fa fa-inr"></i></div>
                                        <div>
                                            <h2 className="h5 fw-bold text-dark mt-1 mb-0">Payment</h2>
                                            <p className="text-muted mb-0">Complete your order</p>
                                        </div>
                                    </div>
                                    <div className="payment-summary">
                                        <div className="summary-row">
                                            <span className="text-muted">Subtotal</span>
                                            <span className="fw-medium">₹{ActualOriginalPriceOfAllItems}</span>
                                        </div>
                                        <div className="summary-row">
                                            <span className="text-muted">Discount on Items</span>
                                            <span className="fw-medium text-green">-₹{ActualOriginalPriceOfAllItems - original_amount}</span>
                                        </div>
                                        {discount > 0 && final_amount !== null && (
                                            <div className="summary-row">
                                                <span className="text-muted">Coupon Discount</span>
                                                <span className="fw-medium text-green">- ₹{discount}</span>
                                            </div>
                                        )}
                                        <div className="summary-row">
                                            <span className="text-muted">Delivery</span>
                                            <span className="fw-medium text-green">FREE</span>
                                        </div>

                                        <hr />
                                        <div className="summary-row">
                                            <span className="fw-bold fs-5">Total</span>
                                            <span className="fw-bold fs-5">₹{final_amount || original_amount}</span>
                                        </div>
                                    </div>
                                    {/* <div
                                        className={`small mb-3 ${otpStatus === "error"
                                            ? "text-danger"
                                            : otpStatus === "success"
                                                ? "text-success"
                                                : "text-muted"
                                            }`}
                                    >
                                        {otpMessage}
                                    </div> */}

                                    <Button className="btn-primary-custom w-100 rounded-2" onClick={handleContinue} style={{
                                        backgroundColor: "#054844",
                                        height: "40px",
                                    }}>
                                        Place Order
                                    </Button>
                                </div>
                            )}
                            {currentStep === "success" && (
                                <div className="success-step">
                                    <div className="d-flex justify-content-center mb-4">
                                        <div className="success-check">
                                            <iframe
                                                src="https://lottie.host/embed/c20c8d7d-a489-4a83-a143-247b516878e0/TJPPGy1CLX.lottie"
                                                style={{ border: "none", width: "120px", height: "120px" }}
                                            ></iframe>
                                        </div>

                                    </div>
                                    <h2 className="h3 fw-bold text-dark mb-2">Order Placed Successfully!</h2>
                                    <p className="text-muted mb-4">Your order has been confirmed and will be delivered soon.</p>
                                    <div className="order-id-card">
                                        <p className="small text-muted mb-1">Order ID</p>
                                        <p className="fw-bold fs-5 mb-0">{orderId}</p>
                                    </div>
                                    <Button className="btn-primary-custom w-100 rounded-2" onClick={handleContinueShopping} style={{
                                        backgroundColor: "#054844",
                                        height: "40px",
                                    }}>  Continue Shopping
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Summary Modal */}
                <Modal className="summaryModal" show={showOrderSummary} centered size="md" onHide={() => setShowOrderSummary(false)} >
                    <Modal.Header>
                        <Modal.Title className="fs-6">Order summary • {items.length} Items</Modal.Title>
                        <a className="closeBtn" onClick={() => setShowOrderSummary(false)}><i className="fa fa-times"></i></a>
                    </Modal.Header>
                    <Modal.Body>
                        {/* cart part start */}

                        <div className="cartBx">
                            <div className="cartBodyBx">
                                {/* item start */}
                                {
                                    items?.length > 0 && (
                                        items.map((item, index) => (
                                            <div className="cartItem" key={item?.item_details?._id}>
                                                <div className="row align-items-top">
                                                    <div className="col-3" align="center">
                                                        <img
                                                            src={item?.product
                                                                ?.image}
                                                            alt={item?.product
                                                                ?.itemName || "Product Image"}
                                                        />
                                                    </div>
                                                    <div className="col-9">
                                                        <h5>{item?.product?.itemName}</h5>
                                                        <div className="cart">
                                                            <div className="cartNumber">

                                                                Qty. {item.quantity}
                                                            </div>

                                                        </div>
                                                        <h6>
                                                            <span>RS. {item.total_sell_price || item.total_offer_price} {" "}INR</span>
                                                            <s>Rs. {item.total_price} INR </s>
                                                        </h6>
                                                    </div>
                                                </div>
                                                <div className="lower">Size :  {item?.variant?.packsize_title
                                                }{" "}
                                                </div>
                                            </div>
                                        )
                                        ))
                                }



                                {/* price detail part start */}
                                <div className="container-fluid">
                                    <div className="row mb-2">
                                        <div className="col-6">Subtotal (incl. of taxes)</div>
                                        <div className="col-6" align="right">₹{ActualOriginalPriceOfAllItems}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-6">Delivery charge</div>
                                        <div className="col-6" align="right"><span className="text-success">FREE</span></div>
                                    </div>
                                    <div className="row">
                                        <div className="col-6">Discount on Items</div>
                                        <div className="col-6" align="right"><span className="text-success">- ₹{ActualOriginalPriceOfAllItems - original_amount}</span></div>
                                    </div>
                                    {discount > 0 && final_amount !== null && (
                                        <div className="row">
                                            <div className="col-6">Coupon Discount</div>
                                            <div className="col-6" align="right">
                                                <span className="text-success">- ₹{discount}</span>
                                            </div>
                                        </div>
                                    )}

                                    <hr />
                                    <div className="row">
                                        <div className="col-6">Grand Total</div>
                                        <div className="col-6" align="right">₹{final_amount || original_amount}</div>
                                    </div>
                                </div>
                                {/* price detail part end */}
                            </div>
                        </div>
                        {/* cart part end */}
                    </Modal.Body>
                    {/* <div className="modal-footer justify-content-start" align="left">
                        <span className="fs-6 m-0"><i className="fa fa-plus-circle"></i> Add order instructions</span>
                    </div> */}
                </Modal>
            </Modal.Body>
        </Modal>
    );
};

export default CodModal;