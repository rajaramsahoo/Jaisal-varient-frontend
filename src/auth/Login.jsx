// import { useRef, useState, useEffect } from "react";
// import CommonLayout from "../component/shop/common-layout";
// import {
//   Col,
//   Container,
//   Input,
//   Label,
//   Row,
//   Form,
//   Button,
//   Spinner,
//   Card,
//   CardBody,
// } from "reactstrap";
// import { useAuthContext } from "../helpers/auth/authContext";
// import ReCAPTCHA from "react-google-recaptcha";

// const Login = () => {
//   const { sendOtp, verifyOtp, isLogin, navigate, loading } = useAuthContext();
//   const [mobile, setPhoneNumber] = useState("");
//   const [otp, setOtp] = useState("");
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [verified, setVerified] = useState(false);
//   const [timer, setTimer] = useState(0);
//   const recaptchaRef = useRef(null);
// const deviceId = localStorage.getItem("guest_device_id");
//   useEffect(() => {
//     let interval;
//     if (timer > 0) {
//       interval = setInterval(() => {
//         setTimer((prev) => prev - 1);
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [timer]);

//   if (isLogin) {
//     return navigate("/");
//   }

//   const onVerified = () => {
//     setVerified(true);
//   };

//   const resetRecaptcha = () => {
//     setVerified(false);
//     if (recaptchaRef.current) {
//       recaptchaRef.current.reset();
//     }
//   };

//   const sendOtpHandler = (e) => {
//     e.preventDefault();
//     if (mobile.length !== 10) {
//       alert("Mobile number is not valid.");
//       resetRecaptcha();
//       return;
//     }
//     sendOtp({ mobile });
//     setIsOtpSent(true);
//     setTimer(60); // Set timer to 60 seconds
//   };

//   const verifyOtpHandler = (e) => {
//     e.preventDefault();
//     if (!otp || otp.length !== 6) {
//       alert("Invalid OTP.");
//       resetRecaptcha();
//       return;
//     }
//     verifyOtp({ mobile, otp, device_id: deviceId, });
//   };

//   const resendOtpHandler = () => {
//     sendOtp({ mobile });
//     setOtp("");
//     setTimer(60); // Reset timer to 60 seconds
//   };

//   return (
//     <CommonLayout parent="home" title="login">
//       <section className="login-page section-b-space">
//         <Container>
//           <Row className="justify-content-center">
//             <Col lg="4" md="5" sm="12" align="center">
//               <img
//                 src="./assets/images/login.svg"
//                 alt=""
//                 style={{ maxWidth: "300px" }}
//               />
//             </Col>
//             <Col lg="5" md="7" sm="12">
//               <Card className="login-card">
//                 <CardBody>
//                   <h4 className="fs-5">
//                     <b>Continue With Mobile Number</b>
//                   </h4>
//                   <p className="mb-2">
//                     We will send a one-time password to this mobile number
//                   </p>
//                   <hr className="mt-1" />
//                   <Form
//                     className="theme-form"
//                     onSubmit={isOtpSent ? verifyOtpHandler : sendOtpHandler}
//                   >
//                     <div className="form-group mb-3">
//                       <Label className="form-label" htmlFor="phone">
//                         Enter Your Mobile Number
//                       </Label>
//                       <Input
//                         type="text"
//                         value={mobile}
//                         onChange={(e) => {
//                           const value = e.target.value;
//                           if (value.length <= 10 && /^[0-9]*$/.test(value)) {
//                             setPhoneNumber(value);
//                             setVerified(false);
//                           }
//                         }}
//                         className="form-control premium-input"
//                         placeholder="Enter your phone number"
//                         required
//                         disabled={isOtpSent}
//                       />
//                     </div>
//                     {mobile.length === 10 && !isOtpSent && (
//                       <div className="d-flex mb-2">
//                         <ReCAPTCHA
//                             //sitekey="6Ldu6oUqAAAAAIXC08ZKfG3XQ-4NWXecHJwhjX_w"
//                            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // for testing in local
//                           onChange={onVerified}
//                           ref={recaptchaRef}
//                           size="normal"
//                         />
//                       </div>
//                     )}

//                     {isOtpSent && ( 
//                       <>
//                         <div className="form-group mb-2">
//                           <Label className="form-label" htmlFor="otp">
//                             Enter OTP
//                           </Label>
//                           <Input
//                             type="text"
//                             value={otp}
//                             onChange={(e) => {
//                               const value = e.target.value;
//                               if (value.length <= 6 && /^[0-9]*$/.test(value)) {
//                                 setOtp(value);
//                               }
//                             }}
//                             className="form-control premium-input"
//                             placeholder="Enter the OTP"
//                             required
//                           />
//                         </div>
//                         <div className="mb-3">
//                           {timer > 0 ? (
//                             <span className="text-muted">
//                               Resend OTP in {timer}s
//                             </span>
//                           ) : (
//                             <Button
//                               type="button"
//                               className={`btn ${
//                                 loading
//                                   ? "cursor-not-allowed bg-gray-300 text-gray-500"
//                                   : "bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
//                               } px-4 py-2 rounded-full`}
//                               onClick={resendOtpHandler}
//                               disabled={loading}
//                             >
//                               {loading ? <Spinner size="sm" /> : "Resend OTP"}
//                             </Button>
//                           )}
//                         </div>
//                       </>
//                     )}

//                     <Button
//                       type="submit"
//                       className="btn btn-solid"
//                       disabled={
//                         (isOtpSent && (otp.length !== 6 || loading)) ||
//                         (!isOtpSent &&
//                           (mobile.length !== 10 || !verified || loading))
//                       }
//                     >
//                       {loading ? (
//                         <Spinner size="sm" />
//                       ) : isOtpSent ? (
//                         "Verify OTP"
//                       ) : (
//                         "Send OTP"
//                       )}
//                     </Button>
//                   </Form>
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </section>
//     </CommonLayout>
//   );
// };

// export default Login;
import { useRef, useState, useEffect } from "react";
import CommonLayout from "../component/shop/common-layout";
import {
  Col,
  Container,
  Input,
  Label,
  Row,
  Form,
  Button,
  Spinner,
  Card,
  CardBody,
} from "reactstrap";
import { useAuthContext } from "../helpers/auth/authContext";

const Login = () => {
  const { sendOtp, verifyOtp, isLogin, navigate, loading } = useAuthContext();
  const [mobile, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const deviceId = localStorage.getItem("guest_device_id");

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
    setTimer(60); // Set timer to 60 seconds
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
    setTimer(60); // Reset timer to 60 seconds
  };

  return (
    <CommonLayout parent="home" title="login">
      <section className="login-page section-b-space">
        <Container>
          <Row className="justify-content-center">
            <Col lg="4" md="5" sm="12" align="center">
              <img
                src="./assets/images/login.svg"
                alt=""
                style={{ maxWidth: "300px" }}
              />
            </Col>
            <Col lg="5" md="7" sm="12">
              <Card className="login-card">
                <CardBody>
                  <h4 className="fs-5">
                    <b>Continue With Mobile Number</b>
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
                              className={`btn ${
                                loading
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
                      className="btn btn-solid"
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
      </section>
    </CommonLayout>
  );
};

export default Login;
