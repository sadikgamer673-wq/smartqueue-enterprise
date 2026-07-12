import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  barcode: string;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
}

const initialState: CartState = { items: [], subtotal: 0 };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((i) => i.productId === action.payload.productId);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      state.subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i.productId !== action.payload.productId);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
      state.subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
