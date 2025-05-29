import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  value: string;
  isShowList: boolean;
}

const initialState: SearchState = {
  value: "",
  isShowList: true,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
    setIsShow: (state, action: PayloadAction<boolean>) => {
      state.isShowList = action.payload;
    },
  },
});

export const { setSearchValue,setIsShow } = searchSlice.actions;
export default searchSlice.reducer;
