import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store, persistor } from './store'
import { PersistGate } from 'redux-persist/integration/react'
import { GoogleOAuthProvider } from '@react-oauth/google'

const root = createRoot(document.getElementById('root'))
root.render(
  <GoogleOAuthProvider clientId="802023129128-jgerad59bfco4hal9jt13955ga5i1v5c.apps.googleusercontent.com">
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </GoogleOAuthProvider>
)
