import React, { useEffect, useState } from "react";
import {
  Collapse,
  Card,
  CardHeader,
  Container,
  Row,
  Col,
  Button,
} from "reactstrap";
import CommonLayout from "../../component/shop/common-layout";
import { useCommonContext } from "../../helpers/common/CommonContext";

const FaqPage = () => {
  const { getFaqs, faqData } = useCommonContext();
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    getFaqs();
  }, []);

  return (
    <CommonLayout parent="home" title="FAQ">
      <section className="faq-section section-b-space">
        <Container>
          <Row>
            <Col md={{ size: 8, offset: 2 }}>
              <div className="text-center mb-3">
                <h2 className="font-weight-bold">Frequently Asked Questions</h2>
                <p className="text-muted">
                  Find the answers to the most common questions below.
                </p>
              </div>
              {faqData?.loading && (
                <div className="d-flex justify-content-center align-items-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              )}
              {Array.isArray(faqData?.data) &&
                faqData?.data?.map((faq, index) => (
                  <Card
                    key={index}
                    className="mb-3 shadow-lg border-0 faq-card"
                    style={{
                      borderRadius: "12px",
                      transition: "box-shadow 0.3s ease",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <CardHeader
                      onClick={() => toggle(index)}
                      style={{
                        background:
                          activeIndex === index ? "#f1f3f5" : "#f8f9fa",
                        cursor: "pointer",
                        padding: "1.25rem",
                        fontWeight: "bold",
                        borderBottom:
                          activeIndex === index ? "2px solid #007bff" : "none",
                        transition: "background-color 0.3s ease",
                      }}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>{faq.question}</span>
                      <Button
                        color="link"
                        className="p-0 text-dark faq-toggle-btn"
                        aria-expanded={activeIndex === index}
                      >
                        {activeIndex === index ? "-" : "+"}
                      </Button>
                    </CardHeader>
                    <Collapse isOpen={activeIndex === index}>
                      <div className="card-body" style={{ padding: "1.25rem" }}>
                        <p className="text-muted">{faq.answer}</p>
                      </div>
                    </Collapse>
                  </Card>
                ))}
            </Col>
          </Row>
        </Container>
      </section>

      <style jsx>{`
        .faq-card:hover {
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .faq-toggle-btn {
          font-size: 1.5rem;
        }
      `}</style>
    </CommonLayout>
  );
};

export default FaqPage;
