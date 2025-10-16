import HeaderOne from "../Header/Header";
import Breadcrubs from "../common/breadcrubs";
import NewFooter from "../footer/NewFooter";

const CommonLayout = ({ children, title, parent, subTitle }) => {
  return (
    <>
      <HeaderOne topClass="top-header" logoName="logo.png" />
      <Breadcrubs title={title} parent={parent} subTitle={subTitle} />
      <>{children}</>
      <NewFooter
        footerClass={`footer-light `}
        footerLayOut={"light-layout upper-footer"}
        footerSection={"small-section border-section border-top-0"}
        belowSection={"section-b-space light-layout"}
        newLatter={true}
      />
    </>
  );
};

export default CommonLayout;
