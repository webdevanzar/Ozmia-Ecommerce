import { createSlice } from "@reduxjs/toolkit";
import { login, logout } from "./authSlice";

interface CartState {
  cartCount: number;
}

const initialState: CartState = {
  cartCount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state) => {
      state.cartCount += 1;
    },
    deletefromCart: (state, action) => {
      state.cartCount -= action.payload ?? 0;
    },
    makeCartEmpty: (state) => {
      state.cartCount = 0;
    },
    increment: (state) => {
      state.cartCount += 1;
    },
    decrement: (state) => {
      if (state.cartCount > 0) {
        state.cartCount -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      state.cartCount = 0;
    });
    builder.addCase(login, (state, action) => {
      const { cartCount } = action.payload;
      state.cartCount = cartCount ?? 0;
    });
  },
});

export const { addToCart, decrement, increment, deletefromCart ,makeCartEmpty} =
  cartSlice.actions;
export default cartSlice.reducer;
