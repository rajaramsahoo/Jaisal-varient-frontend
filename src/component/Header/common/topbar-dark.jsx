import { Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../../helpers/auth/authContext";
import { useEffect } from "react";
import { useCommonContext } from "../../../helpers/common/CommonContext";
import { FaHeart, FaUser } from "react-icons/fa";

const TopBarDark = ({ topClass, fluid }) => {
  const { handleLogout, isLogin, getUserProfile, userData } = useAuthContext();
  const { getStoreSettings, storeSetting } = useCommonContext();

  useEffect(() => {
    if (isLogin && (!userData || !userData._id)) {
      getUserProfile();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!storeSetting || !storeSetting._id) {
      getStoreSettings();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className={topClass}>
      <Container fluid={fluid}>
        <Row>
          <Col lg="6">
            <div className="header-contact">
              <ul>
                <li>Welcome to {storeSetting?.store_name}</li>
                <li>
                  <i
                    className="fa fa-phone"
                    aria-hidden="true"
                    style={{ transform: "rotateY(0deg)", marginRight: 8 }}
                  ></i>
                  Contact Us: {storeSetting?.support_phone}
                </li>
              </ul>
            </div>
          </Col>
          <Col lg="6" className="text-end">
            <ul className="header-dropdown">
              <li className="mobile-wishlist">
                <Link to="/account/wishlist">
                  <FaHeart
                    className="mobileviewStyle"
                    style={{
                      marginRight: "1px",
                      fontSize: "20px",
                      marginTop: "-4px",
                      color: "#ff4c3b",
                    }}
                  />{" "}
                  wishlist
                </Link>
              </li>

              <li className="onhover-dropdown mobile-account">
                <Link to="/account/my-profile">
                  {userData?.name
                    ? ` Welcome, ${userData?.name}`
                    : " My Account"}
                  <FaUser
                    className="mobileviewStyle"
                    style={{
                      marginLeft: "5px",
                      fontSize: "15px",
                      marginTop: "-4px",
                      color: "#2C2928",
                    }}
                  />
                </Link>
                <ul className="onhover-show-div">
                  {!isLogin && (
                    <li>
                      <Link to="/login">Login</Link>
                    </li>
                  )}
                  {isLogin && (
                    <li onClick={handleLogout}>
                      <a>Logout</a>
                    </li>
                  )}
                </ul>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TopBarDark;
