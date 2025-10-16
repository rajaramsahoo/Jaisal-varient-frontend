import React from "react";
import {
  Button,
  Col,
  Container,
  Form,
//   FormGroup,
//   Input,
  Row,
} from "react-bootstrap";

const closeSearch = () => {
  document.getElementById("search-overlay").style.display = "none";
};
const SearchOverlay = () => {
  return (
    <div id="search-overlay" className="search-overlay">
      <div>
        <span className="closebtn" onClick={closeSearch} title="Close Overlay">
          ×
        </span>
        <div className="overlay-content">
          <Container>
            <Row>
              <Col xl="12">
                <Form>
                  <Form.Group>
                    <Form.Control
                      type="text"
                      className="form-control"
                      id="exampleInputPassword1"
                      placeholder="Search a Product"
                    />
                  </Form.Group>
                </Form>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
