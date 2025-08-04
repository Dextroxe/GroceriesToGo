import { createSlice, current } from "@reduxjs/toolkit";

const cart = createSlice({
  initialState: { items: [], cartTotal: 0, totalItems: 0, taxCostTotal: 0 },
  name: "cart",
  reducers: {
    addItem(state:any, action:any) {
      state.cartTotal += action.payload.cost_price;
      state.taxCostTotal += action.payload.tax_rate;
      state.totalItems += 1;
      const item: any = state.items.find(
        (item:any) => item._id === action.payload._id
      );
      if (item) {
        item.quantity += 1;
        return;
      }
      action.payload.quantity = 1;
      state.items.push(action.payload);
    },
    removeItem(state, action) {
      state.cartTotal -= action.payload.cost_price;
      state.taxCostTotal -= action.payload.tax_rate;
      state.totalItems -= 1;
      const item: any = state.items.find(
        (item: any) => item._id === action.payload._id
      );
      if (item.quantity > 1) {
        item.quantity -= 1;
        return;
      }
      state.items = state.items.filter(
        (item: any) => item._id !== action.payload._id
      );
    },
    deleteItem(state, action) {
      const items = current(state.items);
      const item: any = items.find((item:any) => item._id === action.payload._id);
      if (!item) {
        return;
      }
      state.cartTotal -= item.cost_price * item.quantity;
      state.taxCostTotal -= item.tax_rate * item.quantity;

      state.totalItems -= item.quantity;
      state.items = state.items.filter(
        (item: any) => item._id !== action.payload._id
      );
    },
    emptyCart(state) {
      state.items = [];
      state.cartTotal = 0;
      state.totalItems = 0;
    },
  },
});

export const cartActions:any = cart.actions;

export default cart.reducer;
