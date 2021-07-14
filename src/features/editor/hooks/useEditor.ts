import { useCallback, useContext } from "react";
import { useEvents } from "./useEvents";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  addBlock as addBlockAction,
  updateBlock as updateBlockAction,
  selectBlocks,
} from "../redux/editor";
import { Blocks, PageBlock } from "../types";

type UseEditorResponse = {
  addBlockAfter: (putAfterId: string, block: Blocks) => void;
  updateBlock: (block: Parameters<typeof updateBlockAction>[0]) => void;
};

export function useEditor(): UseEditorResponse {
  const { send } = useEvents();
  const dispatch = useAppDispatch();

  const blocks = useAppSelector(selectBlocks);

  const addBlockAfter = useCallback<UseEditorResponse["addBlockAfter"]>(
    (putAfterId, block) => {
      const { parentId } = blocks[putAfterId];
      if (!parentId || !blocks[parentId]) return;
      const parent = blocks[parentId] as PageBlock;

      const newParentBlocks = [...parent.blocks];
      newParentBlocks.splice(
        parent.blocks.indexOf(putAfterId) + 1,
        0,
        block.id
      );
      dispatch(addBlockAction(block));
      dispatch(updateBlockAction({ id: parentId, blocks: newParentBlocks }));
      send(block.id, { eventName: "focus", waitListener: true });
    },
    [blocks, dispatch, send]
  );

  const updateBlock = useCallback<UseEditorResponse["updateBlock"]>(
    (block) => {
      dispatch(updateBlockAction(block));
    },
    [dispatch]
  );

  return { addBlockAfter, updateBlock };
}
