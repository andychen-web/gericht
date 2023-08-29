import React from "react";
import { ColorRing } from "react-loader-spinner";
import PropTypes from "prop-types";

const Loader = ({ isLoading }) => {
  Loader.propTypes = {
    isLoading: PropTypes.bool,
  };
  return (
    <ColorRing
      visible={isLoading}
      height="100%"
      width="100%"
      ariaLabel="blocks-loading"
      wrapperStyle={{
        zIndex: 1,
        paddingRight: "400px",
        paddingLeft: "400px",
        paddingBottom: "30%",
        paddingTop: "10%",
        background: "rgba(128, 128, 128, 0.5)",
      }}
      wrapperClass="blocks-wrapper position-absolute top-0"
      colors={["#e15b64", "#f47e60", "#f8b26a", "#f8b26a", "#e15b64"]}
    />
  );
};
export default Loader;
