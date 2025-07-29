import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cart.ts";

const store = configureStore({
  reducer: { cart: cartReducer },
});

export default store;
