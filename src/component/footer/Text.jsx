import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../helpers/auth/authContext";
import { IoLogoGooglePlaystore } from "react-icons/io5";
import { FaAppStoreIos } from "react-icons/fa6";
import { div } from "motion/react-client";
const NewFooter = () => {
  const { isLogin, userData } = useAuthContext();

  return (
    <footer>
      {/* new footer work start here */}
      <div className="newFooter">
        <div className="container">
          <div className="row">
            <div className="col-md-9">
              <Link to={"/"}>
                <img src="./assets/images/logo.svg" alt="Jaisil" style={{ maxWidth: '180px' }} />
              </Link>
              <div className="row mt-4">
                <div className="col-md-5">
                  <h4>For customers</h4>
                  <ul>
                    <li><Link to="/about-us">About Us</Link></li>
                    <li><a href="">Jaisal Cash</a></li>
                    <li><a href="">Contact us</a></li>
                    <li><a href="">Refer & Earn</a></li>
                    <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                    <li><Link to="cancellation-and-refund-policy">Return & Shipping Policies</Link></li>
                    <li><Link to="/shipping-and-delivery-policy">Shipping and Delivery-Policy</Link></li>
                    <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
                    <li><Link to="/faq">FAQs</Link></li>
                  </ul>
                </div>
                <div className="col-md-3">
                  <h4>Product</h4>
                  <ul>
                    <li><Link to="/shop/basmati-rice">Basmati Rice</Link></li>
                    <li><Link to="/shop/brown-rice">Brown Rice</Link></li>
                    <li><a href="">Non Basmati Rice</a></li>
                    <li><a href="">Superfoods</a></li>
                    <li><a href="">Health Combo</a></li>
                    <li><a href="">Pulses</a></li>
                    <li><a href="">Millets</a></li>
                  </ul>
                </div>
                <div className="col-md-4">
                  <h4>Explore</h4>
                  <ul>
                    <li><Link to="/blog">Blogs</Link></li>
                    <li><Link to="/recipes">Recipes</Link></li>
                    <li><a href="">Lab Reports</a></li>
                    <li><a href="">Trace Order </a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <h2 align="right">Stay in touch</h2>
              <h3>JAISAL ORGANIC</h3>
              <h6 className="mt-4">Contact Us</h6>
              <div className="subscribeBx">
                <input type="text" placeholder="Subscribe With Email" />
                <button type="submit"><img src="/assets/images/paper-plane.svg" alt="" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* new footer work end here */}

      {/* Copyright line start */}
      <div className="text-center p-3 lowerFooter">
        {""}Copyright 2025 <a className="text-white" href="https://jaisal.co.in/" target="_blank">jaisal.co.in</a> All rights reserved{""}
      </div>
      {/* Copyright line end */}

      {/* whatsapp floating icon start */}
      <div class="whatsappBx">
        <a href="https://api.whatsapp.com/send/?phone=7996879968" target="_blank"><img src="./assets/images/whatsapp-logo.webp" alt="" /></a>
      </div>
      {/* whatsapp floating icon end */}
    </footer>
  );
};

export default NewFooter;