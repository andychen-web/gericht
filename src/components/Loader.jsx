import React from "react";
import { ColorRing } from "react-loader-spinner";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";

const Loader = ({ isLoading }) => {
  Loader.propTypes = {
    isLoading: PropTypes.bool,
  };
  return (
    <Modal show={isLoading} className="d-flex justify-content-center">
      <ColorRing
        visible={isLoading}
        height="100"
        width="100"
        ariaLabel="blocks-loading"
        wrapperClass="blocks-wrapper position-absolute mt-5"
        colors={["#e15b64", "#f47e60", "#f8b26a", "#f8b26a", "#e15b64"]}
      />
    </Modal>
  );
};
export default Loader;
