import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../redux";
import { Blocks } from "../types";

// Define a type for the slice state
interface EditorState {
  blocks: { [id: string]: Blocks };
}

// Define the initial state using that type
const initialState: EditorState = {
  blocks: {
    rand: { id: "rand", type: "page", blocks: ["test"], parentId: null },
    test: { id: "test", type: "text", html: "a", parentId: "rand" },
  },
};

export const editorSlice = createSlice({
  name: "editor",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addBlock: (state, action: PayloadAction<Blocks>) => {
      state.blocks[action.payload.id] = action.payload;
    },
    updateBlock: (
      state,
      action: PayloadAction<Partial<Blocks> & Pick<Blocks, "id">>
    ) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      state.blocks[action.payload.id] = {
        ...state.blocks[action.payload.id],
        ...action.payload,
      };
    },
    deleteBlock: (state, action: PayloadAction<Blocks>) => {
      delete state.blocks[action.payload.id];
    },
    setBlocks: (state, action: PayloadAction<{ [id: string]: Blocks }>) => {
      state.blocks = action.payload;
    },
  },
});

export const { setBlocks, updateBlock, addBlock, deleteBlock } =
  editorSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectBlocks = (state: RootState) => state.editor.blocks;

export const editorReducer = editorSlice.reducer;
