import React, { useEffect } from "react";
import Container from "react-bootstrap/Container";
import Navigation from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Order = ({ order }) => {
  Order.propTypes = {
    order: PropTypes.object,
  };
  const navigate = useNavigate();
  const orderDetails = [
    { label: "訂單編號", value: order.id },
    { label: "訂購人", value: order.name },
    { label: "訂單金額", value: "NT$" + order.total },
    {
      label: "付款方式",
      value: order.paymentMethod === "cash" ? "貨到付款" : "銀行轉帳",
    },
    { label: "付款狀態", value: "未付款" },
    { label: "付款日期", value: "未付款" },
    { label: "訂單狀態", value: "確認中" },
    { label: "出貨日期", value: "未出貨" },
  ];
  const buyerDetails = [
    { label: "買家姓名", value: order.name },
    { label: "買家手機", value: order.mobile },
    { label: "買家信箱", value: order.email },
    { label: "買家地址", value: order.address },
    { label: "買家備註", value: order.message ? order.message : "無" },
  ];
  const productArr = order.cartItems.map((item) => [
    { label: "商品名稱", value: item.title },
    { label: "商品數量", value: item.quantity },
    { label: "商品總價", value: "NT$" + item.price * item.quantity },
  ]);
  const productImgArr = order.cartItems.map((item) => item.imageUrl);

  useEffect(() => {
    console.log(order.cartItems);
  }, [order]);

  return (
    <div className="bg-beige">
      <Navigation />
      <Container className="custom-padding-top">
        <div className="row d-center mb-1 ">
          <div className="col-md-5">
            <h4 className="fw-bold mb-3">訂單資訊</h4>
            <div className="border rounded bg-white px-3 py-1 mb-5">
              <ul className="row list-unstyled">
                {orderDetails.map((detail, key) => {
                  return (
                    <li key={key} className="p-2 col-lg-6 col-sm-12">
                      <div className="p-1 flex-between">
                        <div className="fw-bold">{detail.label}</div>
                        <div>{detail.value}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <h4 className="fw-bold mb-3">買家資訊</h4>
            <div className="border rounded bg-white p-3 mb-5">
              <ul className="list-unstyled">
                {buyerDetails.map((detail, key) => {
                  return (
                    <li key={key} className="p-2">
                      <div className="flex-between">
                        <div className="fw-bold">{detail.label}</div>
                        <div>{detail.value}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="col-md-5">
            <h4 className="fw-bold mb-3">訂購商品</h4>

            {productArr &&
              productArr.map((productDetails, key) => {
                return (
                  <div
                    key={key}
                    className="card rounded bg-white mb-6 px-2 pb-2 px-md-3 pb-md-3"
                  >
                    <div className="row align-items-center g-0 mt-2 mt-md-3">
                      <div className="col-4">
                        <img
                          width={"100%"}
                          height={"auto"}
                          className="rounded"
                          src={productImgArr[key]}
                        ></img>
                      </div>
                      <div className="col-7">
                        <div className="card-body">
                          <ul className="list-unstyled">
                            {productDetails.map((detail, key) => {
                              return (
                                <li key={key} className="p-2">
                                  <div className="row flex-between">
                                    <div className="fw-bold">
                                      {detail.label}
                                    </div>
                                    <div className="">{detail.value}</div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="d-center">
          <button
            onClick={() => navigate("/orders")}
            className="cursor-pointer custom-btn mb-5"
          >
            返回列表
          </button>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Order;
