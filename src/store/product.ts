// ** Redux Imports
import { PRODUCTS } from "@/mocks/products";
import { Product } from "@/types/product";
import { createSlice, current } from "@reduxjs/toolkit";

export const productSlice = createSlice({
  name: "product",
  initialState: {
    data: PRODUCTS,
    addLoading: false,
    addSuccess: false,
    addError: false,
    deleteLoading: false,
    deleteSuccess: false,
    deleteError: false,
    editLoading: false,
    editSuccess: false,
    editError: false,
  },
  reducers: {
    setData: (state, action: { payload: Product[] }) => {
      state.data = action.payload;
    },
    addProduct: (state, action: { payload: Partial<Product> }) => {
      // ! Pura" nya API Call Loading
      state.addLoading = true;
      state.addSuccess = false;
      state.addError = false;

      const currData = [...current(state.data)].sort(
        (a: Product, b: Product) => b.id - a.id
      );
      const newId =
        !!currData && !!currData[0] ? Number(currData[0]?.id ?? 0) + 1 : 1;
      currData.push({
        id: newId,
        name: action.payload.name ?? "",
        price: action.payload.price ?? 0,
        stock: action.payload.stock ?? 0,
        createdAt: new Date().toString(),
      });

      state.data = currData;
      state.addLoading = false;
      state.addSuccess = true;
    },
    deleteProduct: (state, action: { payload: number }) => {
      // ! Pura" nya API Call Loading
      state.deleteLoading = true;
      state.deleteSuccess = false;
      state.deleteError = false;

      const currData = [...current(state.data)];
      state.data = currData.filter((item) => item.id !== action.payload);

      state.deleteLoading = false;
      state.deleteSuccess = true;
    },
    editProduct: (
      state,
      action: { payload: { id: number; data: Partial<Product> } }
    ) => {
      // ! Pura" nya API Call Loading
      state.editLoading = true;
      state.editSuccess = false;
      state.editError = false;

      const currData = [...current(state.data)];
      const existing = currData.find((item) => item.id === action.payload.id);
      if (!!existing) {
        let newData: Product = {
          ...existing,
          ...action.payload.data,
          updatedAt: new Date().toString(),
        };
        const newDatas = currData.filter((item) => item.id !== existing.id);
        newDatas.push(newData);
        state.data = newDatas;
        state.editLoading = false;
        state.editSuccess = true;
      } else {
        state.editLoading = false;
        state.editError = true;
      }
    },
  },
});

export const { setData, addProduct, deleteProduct, editProduct } =
  productSlice.actions;

export default productSlice.reducer;
