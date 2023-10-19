# Gericht 訂餐網站

- [線上觀看連結](https://gericht-rwd.vercel.app/)

## 畫面

<img src="https://github.com/andychen-web/restaurant-react-RWD/assets/79246459/7f314889-f137-463e-9e7b-73650e0a5b9e" width="17%">
<img src="https://github.com/andychen-web/restaurant-react-RWD/assets/79246459/9d971ff3-3e67-44a2-99e3-b42eca82cce3" width="70%">

## 專案技術

- 以 React.js 和 Bootstrap 打造 RWD
- 串接後端 RESTful API
- 使用 Redux Toolkit 和 Redux-persist 做狀態管理
- Google Maps API

## 功能

- 會員登入註冊<br/>
  1. 測試用會員帳號 newandy1@gmail.com <br/>
     測試用密碼 newandy1
  2. 使用Google 第三方登入
- 商品展示與介紹、加入購物車、結帳
- 引入Google Maps API，讓用戶選擇在哪間分店取餐
   <img width="754" alt="image" src="https://github.com/andychen-web/gericht/assets/79246459/fe08ae26-e874-44af-b474-a3366dc45970">



- 管理收藏清單
- 後台管理
  - 訂單狀態編輯、刪除訂單
  - 編輯商品列表、商品下架
  
上述頁面切板加功能開發完成，總時程約 39+1 個工作天

## 重要功能實作說明

- 會員登入註冊 <br/>
  1. 使用了 redux-persist 儲存 user token，相較於單純用 redux store 或 useContext，能確保不會因為頁面重整或切換頁面時遺失 user token 進而將使用者登出，但會在token expire時自動登出 <br/>
  2. Google 第三方登入使用套件 [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google/v/0.7.3) 
- 後臺管理員登入
	- 可以點擊自動填入，測試使用
- 加入購物車

  檢查用戶的購物車裡是否已經有了目前要加入的商品

  首先查看用戶購物車中是否有與當前產品同名的品項。

  若有，就把這個商品存到 duplicateCartItem 變數裡，再根據 duplicateCartItem 的 quantity，把購物車既有產品更新；

  若無，把當前指定的商品直接加入到購物車中

  ```jsx
  // Products 頁面
  const addToCart = async (product) => {
    if (!token) {
      navigate('/userAuth')
    } else {
      setIsLoading(true)

      const res = await fetch(
        `${process.env.REACT_APP_API}api/newcart1/admin/products`,
        {
          method: 'GET',
          headers: {
            Authorization: token
          }
        }
      )
      const allCartItems = await res.json()
      const userCartItems = allCartItems.products.filter(
        (item) => item.uId === currentUser.id
      )
      const duplicateCartItem =
        userCartItems.length > 0 &&
        userCartItems.find((item) => item.title === product.title)

      if (duplicateCartItem) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API}api/newcart1/admin/product/${duplicateCartItem.id}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: token
              },
              body: JSON.stringify({
                data: {
                  uId: currentUser.id,
                  title: product.title,
                  origin_price: product.origin_price,
                  price: product.price,
                  unit: product.unit,
                  quantity: duplicateCartItem.quantity + 1,
                  category: product.category,
                  imageUrl: product.image
                }
              })
            }
          )
          const data = await response.json()
          if (data.success) {
            handleAlert('已更新購物車')
          }
        } catch (error) {
          handleAlert('加入購物車失敗')
        }
      } else {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API}api/newcart1/admin/product`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: token
              },
              body: JSON.stringify({
                data: {
                  uId: currentUser.id,
                  title: product.title,
                  origin_price: product.origin_price,
                  price: product.price,
                  unit: product.unit,
                  quantity: product.quantity,
                  category: product.category,
                  imageUrl: product.image
                }
              })
            }
          )
          const data = await response.json()
          if (data.success) {
            handleAlert('已新增至購物車')
            dispatch(setCartUpdate(1))
          }
        } catch (error) {
          handleAlert('加入購物車失敗')
        }
      }
      setIsLoading(false)
    }
  }
  ```

## 歡迎透過以下連結認識我

- [IT 邦文章](https://ithelp.ithome.com.tw/users/20151785/articles)
- [個人履歷](https://www.cakeresume.com/andy-792004)
