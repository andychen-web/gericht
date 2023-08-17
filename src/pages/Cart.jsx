import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Navigation from "../components/Navbar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Footer from "../components/Footer";
import { BsFillCartFill } from "react-icons/bs";
import { FaPencilAlt } from "react-icons/fa";
import { BsFillTrash3Fill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch(
          "",
          { method: "" }
        );
        const data = await response.json();
        setCartItems(data.data.carts);
        console.log(cartItems);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCart();
  }, []);
  const handleRemove = () => {
    // remove from cart
  };
  // const handleCheckout = () => {};
  return (
    <div className="bg">
      <Navigation />
      <Container style={{ paddingTop: "10rem" }}>
        <Row className="px-5 mx-5">
          <Col xs={12} lg={7}>
            <div className="text-white h3 d-flex">
              <BsFillCartFill />
              <div className="ps-2">購物車清單</div>
            </div>
            <table className="rounded text-black bg-white border-bottom-0 table table-striped text-dark">
              <thead>
                <tr className="align-middle text-center">
                  <th>商品連結</th>
                  <th>數量</th>
                  <th>單價</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="align-middle text-center">
                    <button
                      type="button"
                      onClick={handleRemove}
                      className="btn btn-warning btn-sm"
                    >
                      <BsFillTrash3Fill />
                    </button>
                    <u>
                      <a
                        href="/product/-MNcM_U5MRETPpqBUg8w"
                        className="text-muted"
                      >
                        product
                      </a>
                    </u>
                  </td>
                  <td className="align-middle">
                    <div role="group" className="btn-group">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                      >
                        -
                      </button>
                      <button
                        disabled="disabled"
                        className="btn btn-outline-secondary"
                      >
                        quantity
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="align-middle text-center">$999 / 盒</td>
                </tr>
              </tbody>
            </table>
          </Col>
          <Col xs={12} lg={5}>
            <div className="text-white h3 d-flex">
              <FaPencilAlt />
              <div className="ps-2">訂單摘要</div>
            </div>
            <div className="border bg-white rounded p-3">
              <h6 className="flex-between p-3 text-black">
                <div>小計:</div> <div>$</div>
              </h6>
              <h6 className="flex-between p-3 pt-0 pb-5 text-black">
                <div>運費:</div> <div>$</div>
              </h6>
              <h4 className="flex-between border-top px-3 pt-3 text-black">
                <div>總計</div> <div>$</div>
              </h4>
              <button
                className="btn fw-bold w-100 my-2 btn-danger"
                onClick={() => setShowCheckout(true)}
              >
                確認結帳
              </button>
              {showCheckout && (
                <div className="checkout-animation position-absolute">
                  <div className="text-white bg-dark flex-between p-2">
                    <div>填寫收件資料</div>
                    <div
                      className="fw-bold cursor-pointer"
                      onClick={() => setShowCheckout(false)}
                    >
                      X
                    </div>
                  </div>

                  <div className="bg-white">
                    <div className="text-danger d-flex justify-content-center py-3">
                      * 為必填項目
                    </div>
                    <div className="py-2 px-5">
                      <span>
                        <label htmlFor="useremail">
                          電子信箱 <i className="text-danger">*</i>
                        </label>
                        <input
                          type="text"
                          name="email"
                          placeholder="請輸入收件人電子郵件"
                          className="form-control form-control-sm"
                        />
                      </span>
                    </div>
                    <div className="py-2 row px-5">
                      <div className="form-group col-md-6">
                        <span>
                          <label htmlFor="username">
                            姓名 <i className="text-danger">*</i>
                          </label>
                          <input
                            type="text"
                            name="name"
                            placeholder="請輸入收件人姓名"
                            className="form-control form-control-sm"
                          />
                        </span>
                      </div>
                      <div className="form-group col-md-6">
                        <span>
                          <label htmlFor="usertel">
                            電話號碼 <i className="text-danger">*</i>
                          </label>
                          <input
                            type="text"
                            name="mobile"
                            placeholder="請輸入收件人聯絡電話"
                            className="form-control form-control-sm"
                          />
                        </span>
                      </div>
                    </div>
                    <div className="py-2 px-5">
                      <span>
                        <label htmlFor="useraddress">
                          收件地址 <i className="text-danger">*</i>
                        </label>
                        <input
                          type="text"
                          name="address"
                          placeholder="請輸入收件人地址"
                          className="form-control form-control-sm"
                        />
                      </span>
                    </div>
                    <div className="pt-2 pb-5 px-5">
                      <label htmlFor="message">備註</label>
                      <textarea
                        name="message"
                        cols="30"
                        rows="4"
                        placeholder="商品備註"
                        className="form-control form-control-sm"
                      ></textarea>
                    </div>
                    <div className="text-right"></div>
                  </div>
                  <div>
                    <button
                      className="btn bg-white"
                      onClick={() => navigate("/checkout")}
                    >
                      結帳
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Cart;
