import React, { useEffect, useState } from 'react'
import { HiBuildingStorefront } from 'react-icons/hi2'
import { FaLocationDot } from 'react-icons/fa6'
import { GiScooter } from 'react-icons/gi'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'
import Modal from 'react-bootstrap/Modal'
import { useDispatch } from 'react-redux'
import { setDeliveryLocation, setTakeoutInfo } from '../../slices/cartSlice'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const PickupMethods = () => {
  const MySwal = withReactContent(Swal)
  const handleAlert = (message) => {
    MySwal.fire({
      title: <p className="fs-4">{message}</p>,
      timer: 3000
    })
  }
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY
  })
  const [pickupMethod, setPickupMethod] = useState('takeout')
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [districts, setDistricts] = useState([])
  const [isShopShown, setIsShopShown] = useState(false)
  const [shopDetail, setShopDetail] = useState({ lat: 25, lng: 121.5 })
  const { branch, address } = shopDetail
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const cityToDistricts = {
    台北市: ['信義區', '中山區'],
    新北市: ['板橋區', '永和區'],
    基隆市: ['中正區']
  }
  // 範例座標，可換成實際店家座標
  const shopInfo = {
    信義區: {
      address: '台北市信義區美食路1號',
      branch: '台北信義店',
      lat: 25.03367,
      lng: 121.5644
    },
    中山區: {
      address: '台北市中山區美食路1號',
      branch: '台北中山店',
      lat: 25.066,
      lng: 121.5226
    },
    板橋區: {
      address: '新北市板橋區美食路1號',
      branch: '新北板橋店',
      lat: 25.00858,
      lng: 121.46018
    },
    永和區: {
      address: '新北市永和區美食路1號',
      branch: '新北永和店',
      lat: 25.0076,
      lng: 121.516
    },
    中正區: {
      address: '基隆市中正區美食路1號',
      branch: '基隆中正店',
      lat: 25.15,
      lng: 121.7718242
    }
  }
  const handleCityChange = (e) => {
    setDistricts(cityToDistricts[e.target.value])
    setCity(e.target.value)
  }
  useEffect(() => {
    setDistrict('00')
  }, [city])
  const handleDistrictChange = (e) => {
    if (e.target.value) {
      setShopDetail({
        lat: shopInfo[e.target.value].lat,
        lng: shopInfo[e.target.value].lng,
        branch: shopInfo[e.target.value].branch,
        address: shopInfo[e.target.value].address
      })
      setDistrict(e.target.value)
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(setTakeoutInfo(null))
    dispatch(setDeliveryLocation(deliveryAddress))
    const isValidAddress =
      /市|縣/.test(deliveryAddress) &&
      /區/.test(deliveryAddress) &&
      /路/.test(deliveryAddress) &&
      /號/.test(deliveryAddress)
    if (isValidAddress) {
      navigate('/cart')
    } else {
      handleAlert('地址需包括縣市、區、路、號碼')
    }
  }
  return (
    <main className="bg">
      {/* 取餐選項 */}
      <div className="container custom-padding-top">
        <div className="row d-flex justify-content-center py-3 fs-5 px-2">
          <a
            className={`text-decoration-none custom-btn ${
              pickupMethod === 'takeout' ? 'active' : 'inactive'
            }`}
            role="button"
            onClick={() => setPickupMethod('takeout')}
          >
            <HiBuildingStorefront className="mb-1 me-1" />
            <span>到店自取</span>
          </a>
          <a
            className={`ms-2 text-decoration-none custom-btn ${
              pickupMethod === 'delivery' ? 'active' : 'inactive'
            }`}
            onClick={() => setPickupMethod('delivery')}
            role="button"
          >
            <GiScooter className="mb-1 me-1" />
            <span>專人外送</span>
          </a>
        </div>
      </div>
      <div className="row text-center my-3 fs-3 w-100">
        <div className="col text-white">
          {pickupMethod === 'delivery' && '選擇外送地址'}
          {pickupMethod === 'takeout' && '選擇外帶店家'}
        </div>
      </div>
      {/* 到店自取 Google Map */}
      {pickupMethod === 'takeout' && (
        <div className="container w-75">
          <div className="row">
            <div className="col bg-white p-2 px-4">
              <div className="row form-row">
                <div className="col">
                  <div className="form-group">
                    <select
                      className="form-control"
                      onChange={(e) => handleCityChange(e)}
                    >
                      <option value="">-縣市-</option>
                      <option value="台北市">台北市</option>
                      <option value="新北市">新北市</option>
                      <option value="基隆市">基隆市</option>
                    </select>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <select
                      className="form-control"
                      value={district}
                      onChange={(e) => handleDistrictChange(e)}
                    >
                      <option value="00">-鄉鎮市區-</option>
                      {districts &&
                        districts.map((district, key) => (
                          <option key={key}>{district}</option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            {!isLoaded ? (
              <div>載入中...</div>
            ) : (
              <GoogleMap
                zoom={shopDetail.lat !== 25 ? 20 : 10}
                center={{ lat: shopDetail.lat, lng: shopDetail.lng }}
                mapContainerClassName="map-frame"
              >
                {shopDetail.lat !== 25 ? (
                  <Marker
                    onClick={() => setIsShopShown((prevState) => !prevState)}
                    position={{ lat: shopDetail.lat, lng: shopDetail.lng }}
                  />
                ) : null}
                <Modal show={isShopShown} centered>
                  <Modal.Header>
                    <Modal.Title>
                      <div>
                        <span> 分店</span>
                        <button
                          onClick={() => {
                            setIsShopShown(false)
                          }}
                          className="btn fw-bold position-absolute end-0 pe-3"
                        >
                          X
                        </button>
                      </div>
                      <div className="fw-bold fs-5">{shopDetail.branch}</div>
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div>
                      <div>
                        <FaLocationDot />
                        {shopDetail.address}
                      </div>
                      <div>
                        <a
                          className="text-decoration-none ps-3"
                          href="tel:02+12345678"
                        >
                          <span className="text-black">(02)1234-5678</span>
                        </a>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="d-flex justify-content-center">
                    <button
                      className="custom-btn"
                      onClick={() => {
                        dispatch(setDeliveryLocation(null))
                        dispatch(setTakeoutInfo({ branch, address }))
                        navigate('/cart')
                      }}
                    >
                      預約
                    </button>
                  </Modal.Footer>
                </Modal>
              </GoogleMap>
            )}
          </div>
        </div>
      )}
      {/* 專人外送 */}
      {pickupMethod === 'delivery' && (
        <div className="container delivery-frame-bg">
          <form action="" onSubmit={handleSubmit}>
            <div className="row">
              <label htmlFor="userAddress">訂購地址</label>
              <input
                type="text"
                required
                name="address"
                id="userAddress"
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="form-control custom-small-font"
                placeholder="例: 台北市信義區美食路1號"
              />
            </div>
            <div className="row">
              <button className="custom-btn mt-4" type="submit">
                確認
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  )
}

export default PickupMethods
