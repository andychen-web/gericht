import React from 'react'
import images from '../data/images'
import PropTypes from 'prop-types';

const Title = ({ title, subTitle }) => {
  Title.propTypes = {
    title: PropTypes.string,
    subTitle: PropTypes.string
  };
  
  return (
    <>
      <h5 className="text-white">{title}</h5>
      <img height={'auto'} width={'40px'} src={images.spoon} alt="image" />
      <span className="fw-bold custom-text fs-1">{subTitle}</span>
    </>
  )
}

export default Title
