import { useCommonContext } from "../helpers/common/CommonContext";
import { useEffect } from "react";
import CommonLayout from "../component/shop/common-layout";
import { Container } from "reactstrap";
import "./style.css";

const Cms = ({ slug }) => {
  const { cmsDetail, getCmsDetail } = useCommonContext();

  useEffect(() => {
    if (slug) {
      getCmsDetail(slug);
    }
  }, [slug]);

  return (
      <CommonLayout
        parent="home"
        title={cmsDetail?.data?.title || "Loading..."}
      >
        
        {cmsDetail?.loading ? (
          <div className="d-flex justify-content-center mt-5 min-vh-100">
            <div className="spinner-grow text-info" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <Container>
             <div className="cmsclass">
              {cmsDetail?.data?.description ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: cmsDetail.data.description.replace(
                      /<br\s*\/?>/g,
                      ""
                    ), // Removes <br> tags
                  }}
                />
              ) : (
                <div>No content available</div>
              )}
            </div>
          </Container>
        )}
      </CommonLayout>
  );
};

export default Cms;
