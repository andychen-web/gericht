import React from 'react'
import images from '../data/images'

/* eslint-disable react/prop-types */
const Title = ({ title, subTitle }) => {
  return (
    <>
      <h4 className="text-white">{title}</h4>
      <img height={'auto'} width={'40px'} src={images.spoon} alt="image" />
      <span className="fw-bold custom-text fs-1">{subTitle}</span>
    </>
  )
}

export default Title
