import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../helpers/auth/authContext";
import { IoLogoGooglePlaystore } from "react-icons/io5";
import { FaAppStoreIos } from "react-icons/fa6";
import { div } from "motion/react-client";
import axios from "../../helpers/axios";
import { toast } from "react-toastify";
import { useProductContext } from "../../helpers/products/ProductContext";
const NewFooter = () => {
  const { categoryList } = useProductContext();

  const [email, setEmail] = useState("");
  const handleSubscribe = async () => {
    try {
      const res = await axios.post("/api/subscribed-email/add", { email });
      console.log(res.data);
      if (res.data?.alreadySubscribed) {
        toast.info("You're already subscribed.");
        setEmail("")
      } else if (res.data?.status === 200) {
        toast.success("Successfully subscribed.");
        setEmail(""); // Clear input
      } else {
        toast.error("Subscription failed.");
      }
    } catch (err) {
      toast.error(err.response.data.message || "Something went wrong.");
    }
  };

  return (
    <footer style={{ marginBottom: '0px' }}>
      {/* new footer work start here */}
      <div className="newFooter">
        <div className="container">
          <div className="row">
            <div className="col-md-9">
              <Link to={"/"}>
                <img
                  src="/assets/images/logo.svg"
                  alt="Jaisal"
                  style={{ maxWidth: "140px" }}
                  loading="lazy"
                />
              </Link>
              <div className="row mt-4">
                <div className="col-md-5">
                  <h4>Information</h4>
                  <ul>
                    <li>
                      <Link to="/blog">Blogs</Link>
                    </li>
                    <li>
                      <Link to="/recipes">Recipes</Link>
                    </li>
                    <li>
                      <Link to="/faq">FAQs</Link>
                    </li>
                    <li>
                      <Link to="/new-about-us">About Us</Link>
                    </li>
                    {/* <li><a href="">Jaisal Cash</a></li> */}
                    <li>
                      <Link to="/contact-us" >
                        Contact us
                      </Link>
                    </li>
                    {/* <li>
                      <Link to="/">Track Order</Link>
                    </li> */}
                    <li>
                      <Link to="/contact-us">Be Our Franchise</Link>
                    </li>
                  </ul>
                </div>

                <div className="col-md-4">
                  <h4>Need Help</h4>
                  <ul>
                    <li>
                      <Link to="/privacy-policy">Privacy Policy</Link>
                    </li>
                    <li>
                      <Link to="/cancellation-and-refund-policy">
                        Cancellation and Refund Policy
                      </Link>
                    </li>
                    <li>
                      <Link to="/shipping-and-delivery-policy">
                        Shipping and Delivery-Policy
                      </Link>
                    </li>
                    <li>
                      <Link to="/terms-and-conditions">Terms & Conditions</Link>
                    </li>
                  </ul>
                </div>
                <div className="col-md-3">
                  <h4>Product</h4>
                  <ul>
                    {/* <li>
                      <a href="#healthy-combos"> Healthy Combos</a>
                    </li> */}
                    {categoryList?.data?.map((item, i) => (
                      <li key={i}>
                        <Link to={`/shop/${item.slug}`} key={i}>
                          {" "}
                          {item.title.replace(/\b\w/g, (char) =>
                            char.toUpperCase()
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <h2 align="right">Stay in touch</h2>
              <h3>JAISAL ORGANIC</h3>
              <h6 className="mt-4">Subscribe to our newsletter</h6>
              <div className="subscribeBx">
                <form
                  className="subscribeBx"
                  onSubmit={(e) => {
                    e.preventDefault(); // stop page refresh
                    handleSubscribe();  // only runs if validation passes
                  }}
                >
                  <input
                    type="email"
                    placeholder="Subscribe With Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    name="email"
                    required
                  />
                  <button type="submit">
                    <img
                      src="/assets/images/paper-plane.svg"
                      alt="paper"
                      loading="lazy"
                    />
                  </button>
                </form>

              </div>

            </div>
          </div>
        </div>
      </div>
      {/* new footer work end here */}

      {/* Copyright line start */}
      <div className="text-center p-3 lowerFooter">
        {""}Copyright 2025{" "}
        <a className="text-white" href="https://jaisal.co.in/" target="_blank">
          jaisal.co.in
        </a>{" "}
        ( A unit of RICE LITTLE INDIA PVT LTD) All rights reserved.{""}
      </div>
      {/* Copyright line end */}

      {/* whatsapp floating icon start */}
      <div className="whatsappBx">
        <a
          href="https://api.whatsapp.com/send/?phone=7996879968"
          target="_blank"
        >
          <img src="/assets/images/whatsapp-logo.webp" alt="WhatsApp Logo" loading="lazy" />
        </a>
      </div>

      {/* whatsapp floating icon end */}
    </footer>
  );
};

export default NewFooter;
