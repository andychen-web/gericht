import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

const Alert = ({ alertQueue, setAlertQueue }) => {
  Alert.propTypes = {
    setAlertQueue: PropTypes.func,
    alertQueue: PropTypes.array
  }
  useEffect(() => {
    const timer = setTimeout(
      () => setAlertQueue((prevQueue) => prevQueue.slice(1)),
      2000
    )

    // 確保component unmounts時處理完setTimeout
    return () => {
      clearTimeout(timer)
    }
  }, [alertQueue, setAlertQueue])

  return (
    <div className="position-fixed custom-top end-0 me-2">
      {alertQueue &&
        alertQueue.map((alert, index) => (
          <div key={index} className="alert alert-light mt-5 flex-between">
            {alert.message}
            <button
              type="button"
              aria-label="close"
              className="close border-0"
              style={{ background: '#fefefe' }}
              onClick={() =>
                // 根據選定的index，排除alertQueue中的項目
                setAlertQueue((prevQueue) =>
                  prevQueue.filter((_, i) => i !== index)
                )
              }
            >
              x
            </button>
          </div>
        ))}
    </div>
  )
}

export default Alert
