import React, { useEffect, useState } from 'react'
import { HiBuildingStorefront } from 'react-icons/hi2'
import { FaLocationDot } from 'react-icons/fa6'
import { GiScooter } from 'react-icons/gi'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'
import Modal from 'react-bootstrap/Modal'
import { useDispatch } from 'react-redux'
import { setDeliveryLocation, setTakeoutInfo } from '../../../slices/cartSlice'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Loader from '../../../components/Loader'

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
  const [shownShopIndex, setShownShopIndex] = useState(null)
  const [shopDetail, setShopDetail] = useState([])
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [shopsInfo, setShopsInfo] = useState({})
  const [cityToDistricts, setCityToDistricts] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  async function getShops() {
    setIsLoading(true)
    try {
      const response = await fetch(
        `${process.env.REACT_APP_CUSTOM_API}/shops`,
        {
          method: 'GET'
        }
      )
      const data = await response.json()
      // set city to district
      const cityToDistrict = {}
      data.cityToDistricts.forEach((item) => {
        cityToDistrict[item.city] = item.districts
      })
      setCityToDistricts(cityToDistrict)

      // set shops info
      const shopsInfo = {}
      data.shopsInfo.forEach((value) => {
        shopsInfo[value.district] = value.shops
      })
      setShopsInfo(shopsInfo)
    } catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  }
  useEffect(() => {
    getShops()
  }, [])
  const handleCityChange = (e) => {
    setDistricts(cityToDistricts[e.target.value])
    setCity(e.target.value)
  }
  useEffect(() => {
    setDistrict('00')
  }, [city])
  const handleDistrictChange = (e) => {
    const district = e.target.value
    if (shopsInfo[district]) {
      if (shopsInfo[district].length > 1) {
        const detailedShops = shopsInfo[district].map((shop) => {
          return {
            lat: shop.lat,
            lng: shop.lng,
            branch: shop.branch,
            address: shop.address
          }
        })
        setShopDetail(detailedShops)
      } else if (shopsInfo[district].length === 1) {
        setShopDetail([shopsInfo[district][0]])
      }
    }

    setDistrict(district)
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
      <Loader isLoading={isLoading} />
      <div className="container custom-padding-top">
        <div className="row d-flex justify-content-center py-3 fs-5 px-2">
          <a
            className={` custom-btn ${
              pickupMethod === 'takeout' ? 'active' : 'inactive'
            }`}
            role="button"
            onClick={() => setPickupMethod('takeout')}
          >
            <HiBuildingStorefront className="mb-1 me-1" />
            <span>到店自取</span>
          </a>
          <a
            className={`ms-2 custom-btn ${
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
                      {Object.keys(cityToDistricts).map((city, key) => (
                        <option key={key} value={city}>
                          {city}
                        </option>
                      ))}
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
                zoom={shopDetail.length > 0 ? 15 : 10}
                center={
                  shopDetail.length > 0
                    ? {
                        lat: shopDetail[0].lat,
                        lng: shopDetail[0].lng
                      }
                    : {
                        lat: 25,
                        lng: 121.5
                      }
                }
                mapContainerClassName="map-frame"
              >
                {shopDetail.length > 1 &&
                  shopDetail.map((shop, index) => (
                    <Marker
                      key={index}
                      onClick={() => {
                        setShownShopIndex(index)
                      }}
                      position={{
                        lat: shop.lat,
                        lng: shop.lng
                      }}
                    />
                  ))}
                {shopDetail.length === 1 && (
                  <Marker
                    onClick={() => setShownShopIndex(0)}
                    position={{
                      lat: shopDetail[0].lat,
                      lng: shopDetail[0].lng
                    }}
                  />
                )}
                {shopDetail.length > 1 &&
                  shopDetail.map((shop, index) => (
                    <Modal key={index} show={shownShopIndex === index} centered>
                      <Modal.Header>
                        <Modal.Title>
                          <div>
                            <span>分店</span>
                            <button
                              onClick={() => {
                                setShownShopIndex(null)
                              }}
                              className="btn fw-bold position-absolute end-0 pe-3"
                            >
                              X
                            </button>
                          </div>
                          <div className="fw-bold fs-5">{shop.branch}</div>
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div>
                          <div>
                            <FaLocationDot />
                            {shop.address}
                          </div>
                          <div>
                            <a className="ps-3" href="tel:02+12345678">
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
                            dispatch(
                              setTakeoutInfo({
                                branch: shop.branch,
                                address: shop.address
                              })
                            )
                            navigate('/cart')
                          }}
                        >
                          預約
                        </button>
                      </Modal.Footer>
                    </Modal>
                  ))}
                {shopDetail.length === 1 && (
                  <Modal show={shownShopIndex === 0} centered>
                    <Modal.Header>
                      <Modal.Title>
                        <div>
                          <span>分店</span>
                          <button
                            onClick={() => {
                              setShownShopIndex(null)
                            }}
                            className="btn fw-bold position-absolute end-0 pe-3"
                          >
                            X
                          </button>
                        </div>
                        <div className="fw-bold fs-5">
                          {shopDetail[0].branch}
                        </div>
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div>
                        <div>
                          <FaLocationDot />
                          {shopDetail[0].address}
                        </div>
                        <div>
                          <a className="ps-3" href="tel:02+12345678">
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
                          dispatch(
                            setTakeoutInfo({
                              branch: shopDetail[0].branch,
                              address: shopDetail[0].address
                            })
                          )
                          navigate('/cart')
                        }}
                      >
                        預約
                      </button>
                    </Modal.Footer>
                  </Modal>
                )}
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
