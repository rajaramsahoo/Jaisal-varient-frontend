import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../helpers/auth/authContext";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useProductContext } from "../../helpers/products/ProductContext";
import { Button } from "react-bootstrap";
import { useCommonContext } from "../../helpers/common/CommonContext";
import { useCartlistContext } from "../../helpers/cart/AddCartContext";
import axios from "../../helpers/axios";
import { MdAddIcCall } from "react-icons/md";


import Dropdown from 'react-bootstrap/Dropdown';


import { Spinner } from "reactstrap";
const HeaderOne = ({ headerClass, topClass, noTopBar, direction }) => {
  const router = useLocation();
  const { handleLogout, isLogin, userData } = useAuthContext();
  const { categoryList, getAllProducts, products, reqData, setReqData, searchProducts } = useProductContext();
  const { cartlistData, cartModalShow, setCartModalShow } =
    useCartlistContext();
  useEffect(() => {
    setTimeout(function () {
      document.querySelectorAll(".loader-wrapper").style = "display:none";
    }, 2000);

    if (router.pathname !== "/layouts/Christmas")
      window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    let number =
      window.pageXOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (number >= 300) {
      if (window.innerWidth < 581)
        document.getElementById("sticky")?.classList?.remove("fixed");
      else document.getElementById("sticky")?.classList?.add("fixed");
    } else document.getElementById("sticky")?.classList?.remove("fixed");
  };

  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  useEffect(() => {
    if (reqData.trim() === "") {
      // setProducts({ data: [], loading: false });
      setReqData("")
      setShowDropdown(false);
      return;
    }

    getAllProducts({ keyword_search: reqData, type: "keyword" }).then(() => {
      setShowDropdown(true);
    });
  }, [reqData]);


  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const highlightText = (text = "", highlight = "") => {
    if (!text || !highlight.trim()) return text;

    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          style={{ backgroundColor: "#ffeb3b", fontWeight: "bold" }}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  const getShortDescription = (text, wordLimit = 10) => {
    const words = text?.split(" ");
    return words?.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  const navigate = useNavigate();

  const handleProductClick = (product) => {
    navigate(`/product-details/${product._id}`);
    setTimeout(() => {
      setReqData("");
      setShowDropdown(false);
    }, 50); // small delay to prevent interference with navigation
  };

  const carthandleShow = () => setCartModalShow(true);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      }
      else {
        setIsScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const deviceId = localStorage.getItem("guest_device_id");
  const { sendOtp, verifyOtp, loading } = useAuthContext();
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
  useEffect(() => {
    setReqData("");
    setShowDropdown(false);
  }, [router.pathname]);
  return (
    <>
      <div className={isScrolled ? "mainHeader sticky-top reduceGap" : "mainHeader sticky-top"} >
        {/********** new header work start **********/}
        <div className="container">
          <div className="row">
            {/* logo box start */}
            <div className="col-md-3 col-sm-3 col-3 logoBx">
              <Link to={"/"}>
                <img src="/assets/images/logo.svg" alt="" />
              </Link>
            </div>
            {/* logo box end */}

            {/* navbar start */}
            <div className="col-md-6 col-sm-6 col-6 menueBx" align="center">
              {/* search box start */}
              <div className="searchBx" style={{ position: "relative" }} ref={searchRef}>
                <img src="/assets/images/icon/search-gray.svg" alt="search log" loading="lazy" />
                <input
                  type="text"
                  value={reqData}
                  onChange={(e) => setReqData(e.target.value)}
                  onFocus={() => reqData && setShowDropdown(true)}
                  placeholder="Search products, categories..."
                />

                <button>
                  <img src="/assets/images/icon/search-white.svg" alt="icon" loading="lazy" /> Search
                </button>
              </div>

              {showDropdown && reqData && (
                <div className="searchResults">
                  <div className="searchResultsInner">


                    {/*  Only show products if message is not "No Product Found" */}
                    {!searchProducts.loading &&
                      searchProducts.message !== "No Product Found" &&
                      searchProducts.data.length > 0 && (
                        <>
                          <h4 className="text-center bg-light p-2 text-success">
                            <b>
                              Found {searchProducts.data.length} product
                              {searchProducts.data.length !== 1 ? "s" : ""}
                            </b>
                          </h4>
                          {searchProducts.data.map((product) => (
                            <div
                              className="row searchResultItem"
                              key={product._id}
                              onMouseDown={() => handleProductClick(product)}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#f8f9fa";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                              }}
                            >
                              <div className="col text-center">
                                <img src={product.image} alt={product.itemName} loading="lazy" />
                              </div>
                              <div className="col-8">
                                <h6>{highlightText(product.itemName, reqData)}</h6>
                                <p>
                                  {highlightText(
                                    getShortDescription(product.short_description),
                                    reqData
                                  )}
                                </p>
                              </div>
                              <div className="col-2">
                                <span className="text-success price">₹ {product.min_offer_price}</span>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                  </div>
                </div>
              )}


              {/* search box end */}
              <Navbar
                expand="lg"
                data-bs-theme="dark"
                className={`menuRow ${headerClass}`}
              >
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto m-auto">
                    <Nav.Link
                      className="homeLink"
                      as={Link}
                      to="/"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      &nbsp;Home&nbsp;
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/new-about-us"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      About&nbsp;us
                    </Nav.Link>
                    <NavDropdown
                      title="&nbsp;Our Products&nbsp;"
                      id="basic-nav-dropdown"
                    >
                      {categoryList?.data?.map((item, i) => (
                        <NavDropdown.Item
                          as={Link}
                          to={`/shop/${item.slug}`}
                          key={i}
                        >
                          {item.title.toUpperCase()}
                        </NavDropdown.Item>
                      ))}
                    </NavDropdown>
                    <Nav.Link
                      as={Link}
                      to="/combo-offers"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      &nbsp;ComboOffers&nbsp;
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/contact-us"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      &nbsp;Contact&nbsp;
                    </Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
            </div>
            {/* navbar end */}

            {/* cart Information start */}
            <div className="col-md-3 col-sm-3 col-3 cartInfo ">
              <ul className="site-menu d-flex justify-content-end align-items-center ">


                {/********* user login part start *********/}
                {isLogin ? (
                  <li className="onhover-dropdown userInfo me-4">
                    <Link to="/account/my-profile" className="p-0">
                      <img
                        className="userImg"
                        src="/assets/images/user.jpg"
                        alt="user icon"
                        loading="lazy"
                      />
                      <img
                        src="/assets/images/drop-arow-white.png"
                        alt="dropdown icon"
                        style={{ width: "11px" }}
                        loading="lazy"
                      />
                    </Link>
                    <ul className="onhover-show-div dropList">
                      <li>
                        <Link to="/account/my-order">Order History</Link>
                      </li>
                      <li>
                        <Link to="/account/wishlist">Wish List</Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCartModalShow(true);
                          }}
                        >
                          Shopping Cart
                        </Link>
                      </li>
                      <li>
                        <Link to="/account/my-profile">Profile Information</Link>
                      </li>
                      <li onClick={handleLogout}>
                        <a href="#">Logout</a>
                      </li>
                    </ul>
                  </li>
                ) : (
                  <li>
                    <Dropdown className="userLoginBx me-4">
                      <Dropdown.Toggle variant="link" id="dropdown-basic">
                        <img src="/assets/images/icon/loginUser.svg" alt="Login User Icon" loading="lazy" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <h3>Login or Signup</h3>
                        <p>Quick login with OTP – no password needed.</p>

                        <div className="pincode-form">
                          <div className="align-items-center">
                            {/* Mobile input */}
                            <input
                              placeholder="Mobile No."
                              type="text"
                              value={mobile}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 10 && /^[0-9]*$/.test(value)) {
                                  setPhoneNumber(value);
                                }
                              }}
                              className="me-2 form-control rounded-1 mb-2"
                              disabled={isOtpSent}
                            />

                            {/* OTP input (only shows after OTP is sent) */}
                            {isOtpSent && (
                              <input
                                type="text"
                                value={otp}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value.length <= 6 && /^[0-9]*$/.test(value)) {
                                    setOtp(value);
                                  }
                                }}
                                className="me-2 form-control rounded-1 mb-2"
                                placeholder="Enter the OTP"
                                required
                              />
                            )}
                          </div>

                          {/* Send OTP / Verify OTP button */}
                          <div className="mb-3">
                            {!isOtpSent ? (
                              <Button
                                type="button"
                                className={`pincode-button btn btn-primary w-100 ${loading ? "disabled" : ""
                                  }`}
                                onClick={sendOtpHandler}
                                disabled={loading || !mobile}
                              >
                                {loading ? <Spinner size="sm" /> : "Send OTP"}
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                className={`pincode-button btn btn-primary w-100 ${loading ? "disabled" : ""
                                  }`}
                                onClick={verifyOtpHandler}
                                disabled={loading || !otp}
                              >
                                {loading ? <Spinner size="sm" /> : "Verify OTP"}
                              </Button>
                            )}
                          </div>

                          {/* Resend OTP Timer */}
                          {isOtpSent && (
                            <div className="mb-3">
                              {timer > 0 ? (
                                <span className="text-muted">Resend OTP in {timer}s</span>
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
                          )}
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>
                )}
                {/********* user login part end *********/}

                <li style={{ position: "relative" }}>
                  <Link
                    className="cartLink"
                    variant="primary"
                    onClick={carthandleShow}
                  >
                    <img src="/assets/images/icon/cart-icon.svg" alt="Cart" loading="lazy" />
                    {cartlistData?.data?.items?.length > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "-10px",
                          right: "8px",
                          backgroundColor: "#74b72c",
                          color: "white",
                          fontSize: "10px",
                          padding: "2px 6px",
                          borderRadius: "50%",
                          fontWeight: "bold",
                          zIndex: 10,
                        }}
                      >
                        {cartlistData?.data?.items?.length}
                      </div>
                    )}
                  </Link>
                </li>

              </ul>
              <h5 align="right">
                <MdAddIcCall />: <a href="tel:+917996879968">+91 79968 79968</a>
              </h5>
            </div>
            {/* cart Information end */}
          </div>
        </div>
        {/********** new header work end **********/}
      </div>
    </>
  );
};

export default HeaderOne;
