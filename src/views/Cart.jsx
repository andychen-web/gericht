import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import Footer from "../components/Footer";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { BsFillCartFill } from "react-icons/bs";
import { FaPencilAlt } from "react-icons/fa";
import { BsFillTrash3Fill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required("email 須為有效的電子信箱"),
  name: Yup.string().required("name為必填"),
  mobile: Yup.number().required("mobile為必填"),
  address: Yup.string().required("address為必填"),
});

const Cart = ({ token }) => {
  Cart.propTypes = {
    token: PropTypes.string,
  };
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const sum = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  let shippingFee = (sum / 10).toFixed(0);
  shippingFee = Number(shippingFee);
  const [formValues, setFormValues] = useState({
    email: "",
    name: "",
    mobile: "",
  });
  const handleSubmit = (values) => {
    setFormValues(values);
    //to-do: handle form submission
  };

  let navigate = useNavigate();

  const addQuantity = (index, change) => {
    setCartItems((prevCartItems) => {
      const newCartItems = [...prevCartItems];
      newCartItems[index].quantity += change;
      return newCartItems;
    });
  };
  const subtractQuantity = (index, change, quantity) => {
    if (quantity > 0) {
      setCartItems((prevCartItems) => {
        const newCartItems = [...prevCartItems];
        newCartItems[index].quantity += change;
        return newCartItems;
      });
    }
  };

  useEffect(() => {
    const fetchCart = async (token) => {
      try {
        const response = await fetch(
          "https://vue3-course-api.hexschool.io/v2/api/newcart1/admin/products/all",
          {
            headers: { Authorization: token },
            method: "GET",
          }
        );
        const data = await response.json();
        const newCartItems = [];

        for (let key in data.products) {
          newCartItems.push(data.products[key]);
          setCartItems(newCartItems);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCart(token);
  }, [token]);

  const handleRemove = async (id) => {
    try {
      const res = await fetch(
        `https://vue3-course-api.hexschool.io/v2/api/newcart1/admin/product/${id}`,
        {
          headers: { Authorization: token },
          method: "DELETE",
        }
      );
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="bg d-flex flex-column align-items-center">
      <Navigation />
      {/* 表單提交 */}
      {showCheckout && (
        <Formik
          initialValues={formValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form
              className="text-dark text-left position-absolute"
              style={{
                zIndex: "1",
                top: "5rem",
                width: "100%",
                background: "grey",
              }}
            >
              <div className="checkout-body bg-white mx-3 rounded w-50">
                <div className="row justify-content-center mx-3">
                  <span className="text-danger my-2">* 為必填項目</span>
                  <div className="col-md-12 my-2">
                    <div className="form-group py-1">
                      <label htmlFor="useremail">
                        電子信箱
                        <i className="text-danger">*</i>
                      </label>
                      <Field
                        type="text"
                        name="email"
                        className="form-control form-control-sm"
                        id="useremail"
                        placeholder="請輸入收件人電子郵件"
                      />
                      <ErrorMessage
                        name="email"
                        component="span"
                        className="text-danger custom-small-font"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-5 py-1">
                        <label htmlFor="username">
                          姓名
                          <i className="text-danger">*</i>
                        </label>
                        <Field
                          type="text"
                          name="name"
                          id="username"
                          className="form-control form-control-sm"
                          placeholder="請輸入收件人姓名"
                        />
                        <ErrorMessage
                          name="name"
                          component="span"
                          className="text-danger form-control-sm"
                        />
                      </div>
                      <div className="form-group col-md-7 py-1">
                        <label htmlFor="usertel">
                          電話號碼
                          <i className="text-danger">*</i>
                        </label>
                        <Field
                          type="text"
                          name="mobile"
                          id="usertel"
                          className="form-control"
                          placeholder="請輸入收件人聯絡電話"
                        />
                        <ErrorMessage
                          name="mobile"
                          component="span"
                          className="text-danger form-control-sm"
                        />
                      </div>
                    </div>
                    <div className="form-group py-1">
                      <label htmlFor="useraddress">
                        收件地址
                        <i className="text-danger">*</i>
                      </label>
                      <Field
                        type="text"
                        name="address"
                        id="useraddress"
                        className="form-control"
                        placeholder="請輸入收件人地址"
                      />
                      <ErrorMessage
                        name="address"
                        component="span"
                        className="text-danger form-control-sm"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">備註</label>
                      <Field
                        as="textarea"
                        name="message"
                        id="message"
                        cols="30"
                        rows="4"
                        placeholder="商品備註"
                        className="form-control form-control-sm"
                      />
                    </div>
                    {/* checkout footer */}
                    <div className="checkout-footer py-2">
                      <button
                        type="button"
                        onClick={() => setShowCheckout(false)}
                        className="btn btn-outline-secondary"
                      >
                        取消
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-dark"
                        onClick={() => navigate("/checkout")}
                      >
                        結帳
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
      {/* 金額計算 */}
      <Container style={{ paddingTop: "10rem" }}>
        <Row className="px-5 mx-5">
          <Col xs={12} lg={7}>
            <div className="text-white h3 d-flex">
              <BsFillCartFill />
              <div className="ps-2">購物車清單</div>
            </div>

            <Table striped bordered className="bg-white text-black">
              <thead>
                <tr className="align-middle text-center">
                  <th>商品</th>
                  <th>數量</th>
                  <th>價格</th>
                </tr>
              </thead>

              <tbody>
                {cartItems.map((item, key) => {
                  return (
                    <tr key={key} className="align-middle text-center">
                      <td className="d-flex justify-content-start">
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          className="btn btn-warning btn-sm"
                        >
                          <BsFillTrash3Fill />
                        </button>
                        <div key={item.id} className="ps-2 pt-1">
                          {item.title}
                        </div>
                      </td>
                      <td>
                        <div role="group" className="btn-group">
                          <button
                            type="button"
                            onClick={() =>
                              subtractQuantity(key, -1, item.quantity)
                            }
                            className="btn btn-outline-secondary"
                          >
                            -
                          </button>
                          <button
                            disabled="disabled"
                            className="btn btn-outline-secondary"
                          >
                            {item.quantity}
                          </button>
                          <button
                            type="button"
                            onClick={() => addQuantity(key, +1)}
                            className="btn btn-outline-secondary"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td> {"$" + item.price * item.quantity}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
          <Col xs={12} lg={5}>
            <div className="text-white h3 d-flex">
              <FaPencilAlt />
              <div className="ps-2">訂單摘要</div>
            </div>
            <div className="border bg-white rounded p-3">
              <h6 className="flex-between p-3 text-black">
                <div>小計:</div>
                <div>{"$" + sum}</div>
              </h6>
              <h6 className="flex-between p-3 pt-0 pb-5 text-black">
                <div>運費:</div> <div>{"$" + shippingFee}</div>
              </h6>
              <h4 className="flex-between border-top px-3 pt-3 text-black">
                <div>總計</div> <div>{"$" + (sum + shippingFee)}</div>
              </h4>
              <button
                className="btn fw-bold w-100 my-2 btn-danger"
                onClick={() => setShowCheckout(true)}
              >
                確認結帳
              </button>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Cart;
