import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Loader from "../components/Loader";
import Navigation from "../components/Navbar";
import Footer from "../components/Footer";
import { AiFillFileText } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setOrderArray } from "../slices/orderFormSlice";

const Orders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  const parseOrders = (data) => {
    const newArr = [];
    for (let item of data) {
      const id = item.id.split("-")[0];
      const parsedItem = JSON.parse(item.name);
      newArr.push({ ...parsedItem, id });
    }
    setOrders(newArr);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const myHeaders = new Headers();
        myHeaders.append("apikey", process.env.REACT_APP_API_KEY);
        const res = await fetch("https://api.apilayer.com/form_api/forms", {
          method: "GET",
          redirect: "follow",
          headers: myHeaders,
        });
        const data = await res.json();
        parseOrders(data);
        data ? setIsLoading(false) : setIsLoading(true);
      } catch (err) {
        console.log(err);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (orders.length > 0) {
      console.log(orders);
      // save orders in redux to use in Order component, reduce server load
      dispatch(setOrderArray(orders));
    }
  }, [orders]);

  return (
    <div className="bg-beige">
      <Loader isLoading={isLoading} />
      <Navigation />
      <Container className="custom-padding-top">
        <h2 className="text-center fw-bold">全部訂單</h2>

        {/* desktop screen size */}
        <table className="table mb-5 d-none d-md-table">
          <thead>
            <tr className="text-center">
              <th scope="col">序號</th>
              <th scope="col">訂單編號</th>
              <th scope="col">姓名</th>
              <th scope="col">總金額</th>
              <th scope="col">付款狀態</th>
              <th scope="col">訂單狀態</th>
              <th scope="col">出貨日期</th>
              <th scope="col">訂單詳情</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              return (
                <tr key={index} className="text-center">
                  <td scope="row">{index + 1}</td>
                  <td>{order.id}</td>
                  <td>{order.name}</td>
                  <td>
                    <span>NT$</span>
                    {order.total}
                  </td>
                  <td className="text-secondary">未付款</td>
                  <td className="">確認中</td>
                  <td>-</td>
                  <td>
                    <div>
                      <AiFillFileText
                        onClick={() => navigate(`/order/${order.id}`)}
                        className="cursor-pointer fs-3"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* for smaller screen size */}
        <ul className="d-md-none list-unstyled mb-6">
          {orders.map((order, index) => {
            return (
              <li key={index} className="card mb-3">
                <div className="row align-items-center">
                  <div className="col-8">
                    <div className="card-body">
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <p className="card-text">
                            <span className="ms-1">#{order.id}</span>
                          </p>
                        </li>
                        <li className="mb-2">
                          <p className="card-text">
                            訂購人: <span className="ms-1">{order.name}</span>
                          </p>
                        </li>
                        <li className="mb-2">
                          <p className="card-text">
                            商品金額:
                            <span className="ms-1">
                              <span>NT$</span>
                              {order.total}
                            </span>
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-4">
                    <button
                      onClick={() => navigate(`/order/${order.id}`)}
                      className="cursor-pointer custom-btn"
                    >
                      查看訂單
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="d-center mb-5 pb-5 text-dark">
          <nav aria-label="page">
            <ul className="pagination">
              <li className="page-item disabled">
                <a className="page-link" href="#">
                  上一頁
                </a>
              </li>
              <li className="page-item active" style={{ zIndex: "0" }}>
                <a className="page-link" href="#">
                  1
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  2
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  3
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  下一頁
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Orders;
