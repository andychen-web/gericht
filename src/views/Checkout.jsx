import React, { useState } from "react";
import Navigation from "../components/Navbar";
import Footer from "../components/Footer";
import Container from "react-bootstrap/Container";
import { FaPencilAlt } from "react-icons/fa";
import { BsFillCartFill } from "react-icons/bs";
import { Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setOrderForm } from "../slices/orderFormSlice";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const sum = useSelector((state) => state.price.sum);
  const shippingFee = useSelector((state) => state.price.shippingFee);
  const total = useSelector((state) => state.price.total);
  const orderForm = useSelector((state) => state.orderForm.orderFormValue);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const progressWidth = (step / 3) * 100;

  function handleStep() {
    const cashOnDeliveryInput = document.querySelector("#cashOnDelivery");
    const transferInput = document.querySelector("#transfer");

    if (step === 1) {
      setStep((prevStep) => prevStep + 1);
    } else if (
      (step === 2) &
      (cashOnDeliveryInput.checked || transferInput.checked)
    ) {
      dispatch(setOrderForm({ ...orderForm, paymentMethod: paymentMethod }));
      setStep((prevStep) => prevStep + 1);
    }
  }

  if (step === 3) {
    //  checkout complete, send POST
    const myHeaders = new Headers();
    const apiKEY = process.env.REACT_APP_API_KEY;

    myHeaders.append("apikey", apiKEY);
    const requestOptions = {
      method: "POST",
      redirect: "follow",
      headers: myHeaders,
      body: JSON.stringify(orderForm),
    };
    fetch("https://api.apilayer.com/form_api/form", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
    //  show toProducts btn
    const backToProducts = document.querySelector("#toProducts");
    backToProducts.classList.remove("d-none");
    const next = document.querySelector("#next");
    next.classList.add("d-none");
  }

  function showTransferInfo() {
    const transferInfo = document.querySelector(".transfer-info");
    transferInfo.classList.remove("d-none");
  }
  function hideTransferInfo() {
    const transferInfo = document.querySelector(".transfer-info");
    transferInfo.classList.add("d-none");
  }

  return (
    <div className="bg">
      <Navigation />
      <Container className="pt-5">
        <div className="text-white pt-5 text-center">
          <h4 className="pt-5">結帳</h4>
          <form className="row justify-content-md-center">
            <Col xs={12} md={5}>
              {/* 訂單摘要 */}
              <div className="text-white h3 d-flex">
                <div className="pb-2 fs-5">
                  <FaPencilAlt />
                  訂單摘要
                </div>
              </div>
              <div className="border bg-white rounded p-2">
                <h6 className="flex-between p-xs-1 p-md-2 text-black">
                  <div>小計:</div>
                  <div>{"NT$" + sum}</div>
                </h6>
                <h6 className="flex-between p-sm-1 p-md-2 pt-0 text-black">
                  <div>運費: </div>
                  <div>{"NT$" + shippingFee}</div>
                </h6>
                <h4 className="flex-between border-top p-sm-1 p-md-2 text-black fs-5">
                  <div>總計</div> <div>{"NT$" + total}</div>
                </h4>
              </div>
              {/*  購物車內容 */}
              <div className="text-white d-flex flex-column pt-3">
                <div className="pb-2 text-start">
                  <span className="fs-3">
                    <BsFillCartFill />
                  </span>
                  <span className="fs-5">購物車內容</span>
                </div>
                <div className="border bg-white rounded p-2">
                  <table width={"100%"}>
                    <tbody className="w-100 p-3">
                      {cartItems.map((item, key) => {
                        return (
                          <tr key={key} className="text-black flex-between p-2">
                            <td>{item.title}</td>
                            <td>
                              {item.quantity}
                              {item.unit}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </Col>
            {/* 結帳 */}
            <Col xs={12} md={7}>
              <div className="p-2">
                <div className="px-3 my-3 fs-5  text-light flex-between">
                  <div>1.確認資料</div>
                  <div>2.付款方式</div>
                  <div>3.完成</div>
                </div>

                <div
                  className="progress bg-warning"
                  style={{ width: `${progressWidth}%` }}
                />
                <div className="my-3 bg-light text-dark rounded">
                  {step === 1 && (
                    <div className="p-3">
                      <h5 className="my-3">收件人資料</h5>
                      <table className="table">
                        <tbody>
                          <tr>
                            <th>Email :</th>
                            <td>{orderForm.email}</td>
                          </tr>
                          <tr>
                            <th>姓名 :</th>
                            <td>{orderForm.name}</td>
                          </tr>
                          <tr>
                            <th>收件人電話 :</th>
                            <td>{orderForm.mobile}</td>
                          </tr>
                          <tr>
                            <th>收件人地址 :</th>
                            <td>{orderForm.address}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                  {/* step 2 */}
                  {step === 2 && (
                    <div className="p-3">
                      <h5 className="my-3">付款方式</h5>
                      <div className="my-3">
                        <div>
                          <input
                            id="cashOnDelivery"
                            name="paymentMethod"
                            type="radio"
                            value="cash"
                            onClick={() => {
                              hideTransferInfo();
                              setPaymentMethod("cash");
                            }}
                          />
                          <label htmlFor="cashOnDelivery">取貨付款</label>
                        </div>
                        <div>
                          <input
                            id="transfer"
                            name="paymentMethod"
                            type="radio"
                            value="transfer"
                            onClick={() => {
                              showTransferInfo();
                              setPaymentMethod("transfer");
                            }}
                          />
                          <label htmlFor="transfer">銀行轉帳</label>
                        </div>
                      </div>
                      <div className="transfer-info d-none">
                        <p className="my-3">ATM 轉帳繳款資料如下</p>
                        <table className="table table-striped table-bordered text-dark">
                          <tbody>
                            <tr>
                              <th>◆ 銀行名稱：</th>
                              <td>012 台北富邦銀行</td>
                            </tr>
                            <tr>
                              <th>◆ 戶 名：</th>
                              <td>Gericht股份有限公司</td>
                            </tr>
                            <tr>
                              <th>◆ 帳 號：</th>
                              <td>123-321-123456-7</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* step 3 */}
                  {step === 3 && (
                    <div className="my-3 px-lg-5 py-3">
                      <h3 className="my-4 text-success"> 結帳成功</h3>
                      <table className="table table-striped text-dark m-0">
                        <tbody>
                          <tr>
                            <th>姓名 :</th>
                            <td>{orderForm.name}</td>
                          </tr>
                          <tr>
                            <th>收件人電話 :</th>
                            <td>{orderForm.mobile}</td>
                          </tr>
                          <tr>
                            <th>收件人地址 :</th>
                            <td>{orderForm.address}</td>
                          </tr>
                          <tr>
                            <th>訂購品項 :</th>
                            <td>
                              {cartItems.map((item) => (
                                <span key={item.id}>
                                  {item.title} x {item.quantity}
                                  <br />
                                </span>
                              ))}
                            </td>
                          </tr>
                          <tr>
                            <th>付款方式 :</th>
                            <td>
                              {orderForm.paymentMethod === "cash"
                                ? "貨到付款"
                                : "銀行轉帳"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div
                  id="next"
                  onClick={() => handleStep()}
                  className="btn btn-light fw-bold"
                >
                  下一步
                </div>
                <div
                  onClick={() => navigate("/products")}
                  id="toProducts"
                  className="btn btn-light fw-bold d-none"
                >
                  回到商品列表
                </div>
              </div>
            </Col>
          </form>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Checkout;
