import React, { useState, useEffect } from "react";
import CommonLayout from "../shop/common-layout";
import FadeIn from "../animations/fade-in";
import { Link } from "react-router-dom";
import FadeInUp from "../animations/fade-in-up";
import FadeInDown from "../animations/fade-in-down";
import { useCommonContext } from "../../helpers/common/CommonContext";
import Modal from "react-bootstrap/Modal";
import ReactPlayer from "react-player";
const Recipes = () => {
  const [show, setShow] = useState(false);
  const { recipes, getRecipes } = useCommonContext();
  const [videoUrl, setVideoUrl] = useState("");
  const [des, setDes] = useState("");

  const handleClose = () => {
    setShow(false);
    setVideoUrl("");
  };
  const handleShow = (url, dess) => {
    setShow(true)
    setVideoUrl(url);
    setDes(dess);
  }

  useEffect(() => {
    getRecipes();
  }, []);
  return (
    <CommonLayout parent="home" title="Recipes">
      <div className="categoryPart pt-2">
        <div className="innerPart">
          <div className="container">
            <FadeIn>
              <div className="blackTitle mt-5 pb-4">
                <h2 align="center"><span>Recipes</span></h2>
              </div>
            </FadeIn>
            <div className="row align-items-center">
              {recipes?.data?.map((event, index) => {
                const AnimationWrapper =
                  index % 2 === 0 ? FadeInUp : FadeInDown;

                return (
                  <AnimationWrapper key={index} className="col-md-3 col-sm-4 col-6 mb-4">
                    <div className="card border-0 shadow-sm recipeItem">
                      <Link className="card-body d-block" onClick={() => handleShow(event.videoLink, event.description)}>
                        <div className="imgBx">
                          <img
                            src={
                              event.images[0] ||
                              "/assets/images/default-event.jpg"
                            }
                            alt={event.title}
                          />
                        </div>
                        <div className="bg">
                          <h4>{event.title}</h4>
                          <p className="mb-0">{event.sortDescription.slice(0, 30)}</p>
                        </div>
                      </Link>
                    </div>
                  </AnimationWrapper>
                );
              })}
            </div>
            <Modal
              className="recipeModal"
              size="lg"
              show={show}
              onHide={handleClose}
            >
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body style={{ overflow: "hidden" }}>

                {videoUrl ? (<ReactPlayer
                  height="400px"
                  width="100%"
                  url={videoUrl}
                />) : (
                  <p>{des}</p>
                )}

              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
};

export default Recipes;
