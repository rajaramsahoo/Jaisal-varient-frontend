import React, { useState } from "react";
import axios from "../helpers/axios";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";

const ReviewAddModal = ({ status, id, order_id }) => {
  const [modal, setModal] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const Authorization = localStorage.getItem("token");

  const toggle = () => setModal(!modal);
  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select rating.");
      return;
    }

    const formData = new FormData();
    formData.append("productId", id);
    formData.append("review", review);
    formData.append("rating", rating);
    images.forEach((image, index) => {
      formData.append(`attachments[${index}]`, image);
    });

    try {
      setIsSubmitting(true);
      const { status } = await axios.post("api/product/review", formData, {
        headers: { Authorization },
      });

      if (status === 200) {
        toast.success("Review submitted successfully!");
        toggle();
        setReview("");
        setRating(0);
        setImages([]);
      }
    } catch (error) {
      console.error(error.message);
      alert("An error occurred while submitting the review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Button disabled={status !== "Delivered"} onClick={toggle}>
        Write Review
      </Button>

      <Modal show={modal} onHide={toggle} centered>
        <ModalHeader closeButton>Add Review</ModalHeader>
        <ModalBody className="p-2">
          <div className="mb-3">
            <textarea
              value={review}
              onChange={handleReviewChange}
              placeholder="Write your review here..."
              rows="4"
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="font-weight-semibold">Rating</label>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  color={star <= rating ? "#FFD700" : "#D3D3D3"}
                  size={30}
                  onClick={() => handleStarClick(star)}
                  style={{ cursor: "pointer", marginRight: "5px" }}
                />
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="font-weight-semibold">Upload Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="font-weight-semibold">Image Preview</label>
            <div className="d-flex flex-wrap">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  style={{ width: "100px", height: "100px", margin: "5px" }}
                />
              ))}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={handleSubmit}
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ReviewAddModal;
