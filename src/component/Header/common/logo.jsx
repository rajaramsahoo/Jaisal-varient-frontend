import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useCommonContext } from "../../../helpers/common/CommonContext";

const LogoImage = () => {
  const { storeSetting } = useCommonContext();

  return (
    <Fragment>
      <Link to={"/"} style={{width:'100%', maxWidth:'200px', display:'block'}}>
        <img
          src={storeSetting?.store_logo}
          alt=""
          style={{width: '100%', maxWidth: '', objectFit: 'contain', height: 'auto'}}
          className="img-fluid"
        />
      </Link>
    </Fragment>
  );
};

export default LogoImage;