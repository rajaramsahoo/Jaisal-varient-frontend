import { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { useAuthContext } from "../../helpers/auth/authContext";
import { useCartlistContext } from "../../helpers/cart/AddCartContext";
import axios from "../../helpers/axios";
import { toast } from "react-toastify";
import { FaEdit, FaPlus } from "react-icons/fa";

const AddressModal = ({ edit, data, addresstype }) => {
  const { userAddressList, token } = useAuthContext();
  const { getStateList, stateList } = useCartlistContext();
  const [modal, setModal] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressType, setAddressType] = useState(addresstype);
  const [address, setAddress] = useState({
    first_name: data?.first_name || "",
    last_name: data?.last_name || "",
    email: data?.email || "",
    mobile: data?.mobile || "",
    state: data?.state || "",
    city: data?.city || "",
    postal_code: data?.postal_code || "",
    address_line_1: data?.address_line_1 || "",
    address_line_2: data?.address_line_2 || "",
  });

  const toggle = () => {
    setModal(!modal);
    getStateList("India");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({
      ...address,
      [name]: value,
    });
  };

  const handleTypeChange = (e) => {
    setAddressType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !addressType ||
      !address.first_name ||
      !address.last_name ||
      !address.mobile ||
      !address.state ||
      !address.city ||
      !address.postal_code ||
      !address.address_line_1
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const finalAddress = { ...address, type: addressType };
    const api = edit? `api/user/address/update/${data._id}` : `api/user/address/save`;
    try {
      setAddressLoading(true);
      const response = await axios.post(api, finalAddress, {
        headers: {
          Authorization: token,
        },
      });
      if (response && response.status >= 200 && response.status < 300) {
        toast.success("Address saved successfully");
        userAddressList();
        toggle();
        setAddress({});
        setAddressType("");
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setAddressLoading(false);
    }
  };

  return (
    <div className="" style={{ cursor: "pointer" }}>
      {edit ? (
        <button
          className="btn btn-outline-primary btn-sm me-2 d-flex align-items-center"
          onClick={toggle}
        >
          <FaEdit className="me-1" />
          Edit
        </button>
      ) : (
        <a className="text-dark fw-bold" onClick={toggle}>
          <FaPlus className="mb-1" /> Add New Address
        </a>
      )}

      <Modal
        isOpen={modal}
        toggle={toggle}
        centered
        className="modal-dialog-centered"
        style={{ maxWidth: "600px", padding: "10px" }}
      >
        <ModalHeader toggle={toggle} className="bg-light text-dark">
          {edit ? "Edit Address" : "Add New Address"}
        </ModalHeader>
        <div>
          <ModalBody
            className="p-3"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <FormGroup className="mb-3">
              <Label for="addressType" className="font-weight-semibold">
                Choose Address Type
              </Label>
              <Input
                type="select"
                name="addressType"
                id="addressType"
                value={addressType}
                onChange={handleTypeChange}
                className="form-control"
                required
              >
                <option value="">Select Type</option>
                <option value="billing_address">Billing Address</option>
                <option value="shipping_address">Shipping Address</option>
              </Input>
            </FormGroup>

            <FormGroup className="mb-3">
              <Label for="first_name" className="font-weight-semibold">
                First Name
              </Label>
              <Input
                type="text"
                name="first_name"
                id="first_name"
                value={address.first_name}
                onChange={handleChange}
                className="form-control"
                required
                disabled={!addressType}
              />
            </FormGroup>

            <FormGroup className="mb-3">
              <Label for="last_name" className="font-weight-semibold">
                Last Name
              </Label>
              <Input
                type="text"
                name="last_name"
                id="last_name"
                value={address.last_name}
                onChange={handleChange}
                className="form-control"
                required
                disabled={!address.first_name}
              />
            </FormGroup>

            <FormGroup className="mb-3">
              <Label for="mobile" className="font-weight-semibold">
                Mobile Number
              </Label>
              <Input
                type="number"
                name="mobile"
                id="mobile"
                value={address.mobile}
                onChange={(e) => {
                  const { value } = e.target;
                  if (/^\d{0,10}$/.test(value)) {
                    handleChange(e);
                  }
                }}
                className="form-control"
                required
                disabled={!address.last_name}
              />
            </FormGroup>
            {addressType === "billing_address" && (
              <FormGroup className="mb-3">
                <Label for="email" className="font-weight-semibold">
                  Email Address
                </Label>
                <Input
                  type="text"
                  name="email"
                  id="email"
                  value={address.email}
                  onChange={handleChange}
                  className="form-control"
                />
              </FormGroup>
            )}

            <FormGroup className="mb-3">
              <Label for="state" className="font-weight-semibold">
                State
              </Label>
              <Input
                type="select"
                name="state"
                id="state"
                value={address.state}
                onChange={handleChange}
                className="form-control"
                required
                disabled={!address.mobile}
              >
                <option value="">{address.state || "Select State"} </option>
                {stateList?.data?.map((state) => (
                  <option key={state._id} value={state.title}>
                    {state.title}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup className="mb-3">
              <Label for="city" className="font-weight-semibold">
                City
              </Label>
              <Input
                type="text"
                name="city"
                id="city"
                value={address.city}
                onChange={handleChange}
                className="form-control"
                disabled={!address.state}
                required
              />
            </FormGroup>

            <FormGroup className="mb-3">
              <Label for="postal_code" className="font-weight-semibold">
                Postal Code
              </Label>
              <Input
                type="text"
                name="postal_code"
                id="postal_code"
                value={address.postal_code}
                onChange={handleChange}
                className="form-control"
                required
                disabled={!address.city}
              />
            </FormGroup>

            <FormGroup className="mb-3">
              <Label for="address_line_1" className="font-weight-semibold">
                Address Line 1
              </Label>
              <Input
                type="text"
                name="address_line_1"
                id="address_line_1"
                value={address.address_line_1}
                onChange={handleChange}
                className="form-control"
                placeholder="Address Line 1"
                required
                disabled={!address.postal_code}
              />
            </FormGroup>

            <FormGroup className="mb-3">
              <Label for="address_line_2" className="font-weight-semibold">
                Address Line 2 (Optional)
              </Label>
              <Input
                type="text"
                name="address_line_2"
                id="address_line_2"
                value={address.address_line_2}
                onChange={handleChange}
                className="form-control"
                placeholder="Address Line 2 (Optional)"
                disabled={!address.address_line_1}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              onClick={handleSubmit}
              color="primary"
              size="md"
              disabled={addressLoading}
            >
              {addressLoading ? "Saving..." : "Save Address"}
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
};

export default AddressModal;
