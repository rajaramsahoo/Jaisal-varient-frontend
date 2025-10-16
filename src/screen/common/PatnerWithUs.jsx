import CommonLayout from '../../component/shop/common-layout'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import React, { useEffect, useRef, useState } from "react";
import { useCommonContext } from "../../helpers/common/CommonContext";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

const PatnerWithUs = () => {
  const { getEnquiry, storeSetting, getStoreSettings } = useCommonContext();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);
  const recaptchaRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    getStoreSettings();
  }, []);

  const Data = [
    {
      img: "fa-phone",
      title: "Contact us",
      desc1: storeSetting?.support_phone,
    },
    {
      img: "fa-map-marker",
      title: "ADDRESS",
      desc1: storeSetting?.address,
      desc2: "",
    },
    {
      img: "fa-envelope-o",
      title: "Email",
      desc1: storeSetting?.support_email,
    },
  ];

  const onVerified = () => {
    setVerified(true);
  };

  const resetRecaptcha = () => {
    setVerified(false);
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  };

  const validateInput = (value) => {
    const regex = /^[a-zA-Z0-9 ]*$/; // This allows letters, numbers, and spaces
    return regex.test(value);
  };

  function splitName(name) {
    const parts = name.trim().split(" ");
    const last_name = parts.pop(); // remove last item
    const first_name = parts.join(" "); // join remaining

    return {
      first_name,
      last_name
    };
  }

  // --- Validation helpers ---
  const validateEmail = (value) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);

  const validatePhone = (value) =>
    /^[0-9]{10}$/.test(value);

  // --- Check if form is valid ---
  const isFormValid =
    (name || (firstName && lastName)) &&
    validateEmail(email) &&
    validatePhone(phone) &&
    message.trim() !== "" &&
    query.trim() !== "";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.warning("Please fill in all required fields correctly.");
      return;
    }

    // Determine names
    let first_name = firstName;
    let last_name = lastName;

    if (name) {
      const result = splitName(name);
      first_name = result.first_name;
      last_name = result.last_name;
    }

    // Build payload
    const payload = {
      first_name,
      last_name,
      email,
      phone_number: phone,
      message,
    };

    // Conditionally add query
    if (query) {
      payload.query_type = query;
    }

    // Send the enquiry
    getEnquiry(payload);

    // Reset fields
    setFirstName("");
    setLastName("");
    setName("");
    setEmail("");
    setPhone("");
    setQuery("");
    setMessage("");
    resetRecaptcha();
  };

  return (
    <>
      <div className='patnerWrapper'>
        <CommonLayout>
          <div className='mt-4' style={{ minHeight: '500px' }}>
            <div className='container'>
              {/* main tabs start */}
              <Tabs defaultActiveKey="patnerWithUs" id="patnerWithUs">

                {/********* Patner With Us tab part start *********/}
                <Tab eventKey="patnerWithUs" title="Patner with us">
                  <div className='row justify-content-center'>
                    <div className='col-md-7'>
                      <div className='textBx'>
                        <h3 className='text-green mb-2' style={{ color: 'var(--newGreen)', }}><b>Build a Brand That Feeds the Future</b></h3>
                        <h3 className='display-6'><b>Contact with Jaisal A Trusted Name in Grains</b></h3>
                        <h5 align="justify">Join a growing movement focused on quality, trust, and mindful food choices. With our strong supply chain, brand presence, and customer loyalty, you're not just distributing rice — you're delivering heritage and health.</h5>
                        <ul>
                          <li>Proven systems & support</li>
                          <li>High customer retention</li>
                          <li>Transparent, scalable business model</li>
                        </ul>
                        <h3>Why Partner with Us?</h3>

                        {/* inner tab start */}
                        <Tab.Container id="visionSupportTabs" defaultActiveKey="first">
                          <Row>
                            <Col sm={2}>
                              <Nav variant="pills" className="flex-column laftNavTabs">
                                <Nav.Item>
                                  <Nav.Link eventKey="first"><img src="/assets/images/patner/icon-piechart.svg" alt="" /></Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                  <Nav.Link eventKey="second"><img src="/assets/images/patner/icon-call-user.svg" alt="" /></Nav.Link>
                                </Nav.Item>
                              </Nav>
                            </Col>
                            <Col className='leftTabBx' sm={10}>
                              <Tab.Content>
                                <Tab.Pane eventKey="first">
                                  <h3>Excellent Support</h3>
                                  <p><b>Logistics Managed End-to-End</b><br />
                                    <i className='fa fa-angle-right'></i> From order to doorstep, we take care of delivery.</p>
                                  <p><b>Consistent Margins</b><br />
                                    <i className='fa fa-angle-right'></i>  Your earnings stay protected — even during discounts.</p>
                                  <p><b>Zero Dead Stock</b><br />
                                    <i className='fa fa-angle-right'></i> Our inventory stays fresh and moving.</p>
                                  <p><b>Marketing Support</b><br />
                                    <i className='fa fa-angle-right'></i> We invest in national and local campaigns to boost visibility.</p>
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                  <h3>Business Vision</h3>
                                  <p><b>Clear Business Vision</b><br />
                                    <i className='fa fa-angle-right'></i> We’re redefining how people experience everyday essentials like rice — with a focus on purity, transparency, and consistent quality.</p>
                                  <p><b>High-Quality Products, Honest Pricing</b><br />
                                    <i className='fa fa-angle-right'></i> Jaisal offers premium, aged grains at fair prices — making every pack true value for money.</p>
                                  <p><b>Diverse Range of Offerings</b><br />
                                    <i className='fa fa-angle-right'></i> From everyday staples to specialty grains and combos — we cater to all types of customers and kitchens.</p>
                                  <p><b>Trusted Supply Chain</b><br />
                                    <i className='fa fa-angle-right'></i> Backed by strict quality control, timely delivery, and long-term farmer relationships.</p>
                                  <p><b>Customer-Centric Approach</b><br />
                                    <i className='fa fa-angle-right'></i> With a growing base of loyal buyers and fast repeat rates, you're stepping into a business model built on satisfaction and trust.</p>
                                </Tab.Pane>
                              </Tab.Content>
                            </Col>
                          </Row>
                        </Tab.Container>
                        {/* inner tab end */}
                      </div>
                    </div>
                    <div className='col-md-5'>
                      <div className='formBx'>
                        <h4 align="center">Jaisal Partnership Inquiry</h4>
                        <p align="center">Please fill out the form below and a member of our team will be in touch.</p>
                        <form onSubmit={handleSubmit}>
                          <input
                            className='form-control'
                            type="text"
                            placeholder='Name*'
                            id="name"
                            value={name}
                            onChange={(e) => {
                              if (validateInput(e.target.value)) {
                                setName(e.target.value);
                                resetRecaptcha();
                              }
                            }}
                            required
                          />
                          <input
                            className='form-control'
                            type="text"
                            placeholder='Mobile*'
                            value={phone}
                            id="number"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 10 && /^[0-9]*$/.test(value)) {
                                setPhone(value);
                                resetRecaptcha();
                              }
                            }}
                            required
                          />
                          <input
                            className='form-control'
                            type="text"
                            placeholder='Email*'
                            id="email"
                            value={email}
                            onChange={(e) => {
                              const validEmailRegex = /^[a-zA-Z0-9@._-]*$/;
                              if (validEmailRegex.test(e.target.value)) {
                                setEmail(e.target.value);
                              }
                            }}
                            required
                          />
                          <select
                            className='form-control'
                            name="query"
                            id="query"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            required
                          >
                            <option value="">Reason/Query*</option>
                            <option value="Become A Partner">Become A Partner</option>
                            <option value="Feedback">Feedback</option>
                            <option value="Complaint">Complaint</option>
                            <option value="Queary">Queary</option>
                            <option value="Become A Vendor">Become A Vendor</option>
                            <option value="Other">Other</option>
                          </select>
                          <textarea
                            className='form-control'
                            id="exampleFormControlTextarea1"
                            value={message}
                            onChange={(e) => {
                              if (validateInput(e.target.value)) {
                                setMessage(e.target.value);
                                resetRecaptcha();
                              }
                            }}
                            placeholder='Your Comments*'
                            required
                          ></textarea>
                          <p>
                            By submitting this request, Jaisal will be able to contact you through the collected information.
                          </p>
                          <button
                            type="submit"
                            className='btn btnGreen'
                            disabled={!isFormValid} // 🔥 disables until valid
                          >
                            SUBMIT
                          </button>
                        </form>
                      </div>
                      {/* bottom part start */}
                      <div className='PatnerInfoBx'>
                        <h3>Have Questions?</h3>
                        <h5>Reach us at: </h5>
                        <ul>
                          <li><a href="mailto:care@jaisal.co.in"><i className='fa fa-envelope'></i> care@jaisal.co.in</a></li>
                          <li><a href="tel:+917996879968"><i className='fa fa-phone'></i> (+91) - 79968 79968</a></li>
                        </ul>
                      </div>
                      {/* bottom part end */}
                    </div>
                  </div>
                </Tab>
                {/********* Patner With Us tab part end *********/}

              </Tabs>
              {/* main tabs end */}
            </div>
          </div>
        </CommonLayout>
      </div>
    </>
  )
}

export default PatnerWithUs
