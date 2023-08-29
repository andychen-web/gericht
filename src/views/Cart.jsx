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
import { useDispatch } from "react-redux";
import { updateItemQuantity, setItems } from "../slices/cartSlice";
import { setSum, setShippingFee, setTotal } from "../slices/priceSlice";
import { setOrderForm } from "../slices/orderFormSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Loader from "../components/Loader";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("需為有效的電子信箱")
    .required("需為有效的電子信箱"),
  name: Yup.string().required("姓名為必填"),
  mobile: Yup.number().typeError("電話號碼需為數字").required("電話號碼為必填"),
  address: Yup.string().required("地址為必填"),
});

const Cart = ({ token }) => {
  Cart.propTypes = {
    token: PropTypes.string,
  };
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const initFormValues = {
    email: "",
    name: "",
    address: "",
    mobile: "",
    message: "",
    paymentMethod: "",
  };

  const sum = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  let shippingFee = (sum / 20).toFixed(0);
  shippingFee = Number(shippingFee);

  const total = (sum + shippingFee).toLocaleString("zh-TW", {
    style: "currency",
    currency: "NTD",
    currencyDisplay: "code",
  });

  const handleSubmit = (values) => {
    // price
    dispatch(setSum(sum));
    dispatch(setShippingFee(shippingFee));
    dispatch(setTotal(total));
    // orderForm
    dispatch(setOrderForm(values));
    navigate("/checkout");
  };

  const addQuantity = (index, change) => {
    setCartItems((prevCartItems) => {
      const newCartItems = [...prevCartItems];
      newCartItems[index] = {
        ...newCartItems[index],
        quantity: newCartItems[index].quantity + change,
      };
      return newCartItems;
    });

    dispatch(updateItemQuantity({ index, change }));
  };
  const subtractQuantity = (index, change, quantity, itemId) => {
    if (quantity >= 2) {
      setCartItems((prevCartItems) => {
        const newCartItems = [...prevCartItems];
        newCartItems[index] = {
          ...newCartItems[index],
          quantity: newCartItems[index].quantity + change,
        };
        return newCartItems;
      });
    } else if (quantity === 1) {
      handleRemove(itemId);
    }
  };
  const fetchCart = async (token) => {
    setIsLoading(true);
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
      console.log(data);
      for (let key in data.products) {
        newCartItems.push(data.products[key]);
      }
      setCartItems(newCartItems);
      data.success ? setIsLoading(false) : setIsLoading(true);
      dispatch(setItems(newCartItems));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCart(token);
  }, [token, dispatch]);

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
      console.log(data.message);
      fetchCart(token);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="bg d-flex flex-column position-relative">
      <Loader isLoading={isLoading} />
      <div className="d-flex justify-content-center align-items-center"></div>
      <Navigation />
      <Container className="pt-5">
        <Row className="position-relative pt-5 mt-5">
          {showCheckout ? null : (
            <Col xs={12} lg={7}>
              <div className="text-white h3 d-flex">
                <BsFillCartFill />
                <div className="ps-2 fs-5">購物車清單</div>
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
                                subtractQuantity(
                                  key,
                                  -1,
                                  item.quantity,
                                  item.id
                                )
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
          )}
          <Col xs={12} lg={5}>
            <div className="text-white h3 d-flex">
              <FaPencilAlt />
              <div className="ps-2 fs-5">訂單摘要</div>
            </div>
            <div className="border bg-white rounded p-2">
              <h6 className="flex-between p-xs-1 p-md-2 text-black">
                <div>小計:</div>
                <div>{"$" + sum}</div>
              </h6>
              <h6 className="flex-between p-sm-1 p-md-2 pt-0 text-black">
                <div>運費:</div> <div>{"$" + shippingFee}</div>
              </h6>
              <h4 className="flex-between border-top p-sm-1 p-md-2 text-black fs-5">
                <div>總計</div> <div>{total}</div>
              </h4>
              <button
                className="btn fw-bold w-100 px-5 my-1 btn-danger"
                onClick={() => setShowCheckout(true)}
              >
                確認結帳
              </button>
            </div>
          </Col>
          <div className="position-absolute p-0">
            {showCheckout && (
              <Formik
                initialValues={initFormValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="text-dark text-left bg pb-5 d-flex justify-content-center">
                    <div className="checkout-body bg-white rounded w-50 ">
                      <div className="row justify-content-center mx-3">
                        <div className="col-md-12 my-2 fw-bold custom-small-font">
                          <div className="form-group py-1 custom-small-font">
                            <label htmlFor="useremail">
                              電子信箱
                              <i className="text-danger">*</i>
                            </label>
                            <Field
                              type="text"
                              name="email"
                              className="form-control form-control-sm custom-small-font"
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
                                className="form-control form-control-sm custom-small-font"
                                placeholder="請輸入收件人姓名"
                              />
                              <ErrorMessage
                                name="name"
                                component="span"
                                className="text-danger"
                              />
                            </div>
                            <div className="form-group col-md-7 py-1 custom-small-font">
                              <label htmlFor="usertel">
                                電話號碼
                                <i className="text-danger">*</i>
                              </label>
                              <Field
                                type="text"
                                name="mobile"
                                id="usertel"
                                className="form-control custom-small-font"
                                placeholder="請輸入收件人聯絡電話"
                              />
                              <ErrorMessage
                                name="mobile"
                                component="span"
                                className="text-danger"
                              />
                            </div>
                          </div>
                          <div className="form-group py-1 custom-small-font">
                            <label htmlFor="useraddress">
                              收件地址
                              <i className="text-danger">*</i>
                            </label>
                            <Field
                              type="text"
                              name="address"
                              id="useraddress"
                              className="form-control custom-small-font"
                              placeholder="請輸入收件人地址"
                            />
                            <ErrorMessage
                              name="address"
                              component="span"
                              className="text-danger"
                            />
                          </div>

                          <div className="form-group custom-small-font">
                            <label htmlFor="message">備註</label>
                            <Field
                              name="message"
                              id="message"
                              placeholder="商品備註"
                              className="form-control form-control-sm"
                            />
                          </div>
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
                            >
                              資料送出
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Cart;
