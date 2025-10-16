import React, { useEffect } from 'react';
import { useCommonContext } from '../../helpers/common/CommonContext';
import CommonLayout from '../../component/shop/common-layout';
import { Container, Row, Col, Card, CardImg, CardBody, CardTitle, CardText } from 'reactstrap';

const Certificate = () => {
  const { getCertificate, certificateData } = useCommonContext();

  useEffect(() => {
    getCertificate();
  }, []);

  return (
    <CommonLayout parent="home" title="Certificates">
      {certificateData?.loading ? (
        <div className="col-md-12 d-flex justify-content-center">
          <div className="spinner-grow text-info my-4" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <Container className="my-5">
          <Row>
            {certificateData?.data?.length > 0 ? (
             Array.isArray(certificateData?.data) && certificateData?.data?.map((certificate) => (
                <Col md="4" key={certificate._id} className="mb-4">
                  <Card className="shadow-sm border-0">
                    <CardImg
                      top
                      width="100%"
                      src={certificate.image}
                      alt={certificate.title}
                      className="img-fluid"
                      style={{ borderRadius: '10px' }} 
                    />
                    <CardBody className="text-center">
                      <CardTitle tag="h5" className="font-weight-bold">
                        {certificate.title}
                      </CardTitle>
                    </CardBody>
                  </Card>
                </Col>
              ))
            ) : (
              <Col className="text-center">
                <h4>No certificates available</h4>
              </Col>
            )}
          </Row>
        </Container>
      )}
    </CommonLayout>
  );
};

export default Certificate;
