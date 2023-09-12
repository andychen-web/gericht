import React from 'react'
import PropTypes from 'prop-types'

const CartAlert = ({ message, onClose }) => {
  CartAlert.propTypes = {
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
  }

  return (
    <div className=" position-fixed custom-top end-0 me-2">
      <div className="add-cart-alert alert alert-light mt-5">
        {message}
        <button
          type="button"
          aria-label="close"
          className="close border-0"
          style={{ background: '#fefefe' }}
          onClick={onClose}
        >
          x
        </button>
      </div>
    </div>
  )
}

export default CartAlert
