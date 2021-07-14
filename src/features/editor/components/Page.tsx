import { useMemo } from "react";

import { EditableBlock } from "./EditableBlock";
import { useAppSelector } from "../../../redux/hooks";
import { selectBlocks } from "../redux/editor";
import { TextBlock } from "../types";

export function Page({ pageId = "rand" }): JSX.Element {
  const blocks = useAppSelector(selectBlocks);
  console.log(blocks);
  const elements = useMemo(() => {
    const page = blocks[pageId];
    if (page.type !== "page") return [];
    return page.blocks.map((blockKey) => {
      if (blocks[blockKey].type === "text")
        return <EditableBlock block={blocks[blockKey] as TextBlock} />;
      return null;
    });
  }, [blocks, pageId]);
  return <>{elements}</>;
}
