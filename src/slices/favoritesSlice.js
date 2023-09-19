import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  favoriteList: []
}
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites: (state, action) => {
      if (state.favoriteList) {
        const existingFavorite = state.favoriteList.filter(
          (favorite) => favorite.id === action.payload.id
        )[0]
        if (existingFavorite) {
          state.favoriteList = state.favoriteList.filter(
            (favorite) => favorite.id !== existingFavorite.id
          )
        } else {
          state.favoriteList.push(action.payload)
        }
      }
    },
    removeFavorite: (state, action) => {
      state.favoriteList = state.favoriteList.filter(
        (favorite) => favorite.id !== action.payload.id
      )
    }
  }
})

export const { setFavorites, removeFavorite } = favoritesSlice.actions
export default favoritesSlice.reducer
