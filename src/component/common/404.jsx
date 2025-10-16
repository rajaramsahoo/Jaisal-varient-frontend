import { Container, Row, Col } from "reactstrap";
import CommonLayout from "../shop/common-layout";

const NotFound = () => {
  return (
    <CommonLayout parent="home" title="404">
      <section className="p-0">
        <Container>
          <Row>
            <Col sm="12">
              <div className="error-section">
                <h1>404</h1>
                <h2>page not found</h2>
                <a href="/" className="btn btn-solid">
                  back to home
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};
export default NotFound;
