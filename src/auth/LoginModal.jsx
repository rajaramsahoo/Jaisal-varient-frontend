import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./LoginModal.css";
import {
  Col,
  Container,
  Input,
  Label,
  Row,
  Form,
  Spinner,
  Card,
  CardBody,
} from "reactstrap";
import { useAuthContext } from "../helpers/auth/authContext";
import { Link } from "react-router-dom";
import { useCommonContext } from "../helpers/common/CommonContext";

const LoginModal = () => {
  const deviceId = localStorage.getItem("guest_device_id");
  const { sendOtp, verifyOtp, isLogin, navigate, loading } = useAuthContext();
  const { show, setShow } = useCommonContext();

  const [mobile, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  if (isLogin) {
    return navigate("/");
  }

  const sendOtpHandler = (e) => {
    e.preventDefault();
    if (mobile.length !== 10) {
      alert("Mobile number is not valid.");
      return;
    }
    sendOtp({ mobile });
    setIsOtpSent(true);
    setTimer(60);
  };

  const verifyOtpHandler = (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      alert("Invalid OTP.");
      return;
    }
    verifyOtp({ mobile, otp, device_id: deviceId });
  };

  const resendOtpHandler = () => {
    sendOtp({ mobile });
    setOtp("");
    setTimer(60);
  };

  return (
    <Modal
      show={show}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      contentClassName="custom-modal-content"
      dialogClassName="custom-modal-dialog"
    >
      <Modal.Header
        closeButton
        onClick={() => {
          setShow(false);
        }}
        style={{
          padding: "10px 20px",
          borderBottom: "none",
          alignItems: "center",
        }}
      >
        <Modal.Title
          id="contained-modal-title-vcenter"
          style={{ display: "flex", alignItems: "center" }}
        >
          <Link to={"/"}>
            <img
              src="/assets/images/jaisil-logo.webp"
              alt="logo"
              style={{ height: "50px", objectFit: "contain" }}
            />
          </Link>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: "10px" }}>
        <Container>
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <h4 className="fs-5">
                    <b>Continue With Mobile</b>
                  </h4>
                  <p className="mb-2">
                    We will send a one-time password to this mobile number
                  </p>
                  <hr className="mt-1" />
                  <Form
                    className="theme-form"
                    onSubmit={isOtpSent ? verifyOtpHandler : sendOtpHandler}
                  >
                    <div className="form-group mb-3">
                      <Label className="form-label" htmlFor="phone">
                        Enter Your Mobile Number
                      </Label>
                      <Input
                        type="text"
                        value={mobile}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length <= 10 && /^[0-9]*$/.test(value)) {
                            setPhoneNumber(value);
                          }
                        }}
                        className="form-control premium-input"
                        placeholder="Enter your phone number"
                        required
                        disabled={isOtpSent}
                      />
                    </div>

                    {isOtpSent && (
                      <>
                        <div className="form-group mb-2">
                          <Label className="form-label" htmlFor="otp">
                            Enter OTP
                          </Label>
                          <Input
                            type="text"
                            value={otp}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 6 && /^[0-9]*$/.test(value)) {
                                setOtp(value);
                              }
                            }}
                            className="form-control premium-input"
                            placeholder="Enter the OTP"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          {timer > 0 ? (
                            <span className="text-muted">
                              Resend OTP in {timer}s
                            </span>
                          ) : (
                            <Button
                              type="button"
                              className={`btn ${loading
                                ? "cursor-not-allowed bg-gray-300 text-gray-500"
                                : "bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
                                } px-4 py-2 rounded-full`}
                              onClick={resendOtpHandler}
                              disabled={loading}
                            >
                              {loading ? <Spinner size="sm" /> : "Resend OTP"}
                            </Button>
                          )}
                        </div>
                      </>
                    )}

                    <Button
                      type="submit"
                      className="btn btn-primary w-100 p-3"
                      style={{
                        backgroundColor: "#ff4c3b",
                        borderColor: "#ff4c3b",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                      }}
                      disabled={
                        (isOtpSent && (otp.length !== 6 || loading)) ||
                        (!isOtpSent && (mobile.length !== 10 || loading))
                      }
                    >
                      {loading ? (
                        <Spinner size="sm" />
                      ) : isOtpSent ? (
                        "Verify OTP"
                      ) : (
                        "Send OTP"
                      )}
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
