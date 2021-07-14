import { KeyboardEventHandler, useCallback, useEffect, useRef } from "react";
import ContentEditable from "react-contenteditable";
import { useEditor } from "../hooks/useEditor";
import { useEvents } from "../hooks/useEvents";
import { TextBlock } from "../types";

const CMD_KEY = "/";

export type EditableBlockProps = {
  block: TextBlock;
};

function getCaretIndex(element: HTMLElement) {
  let position = 0;
  const isSupported = typeof window.getSelection !== "undefined";
  if (isSupported) {
    const selection = window.getSelection();
    if (selection?.rangeCount !== 0) {
      const range = window.getSelection()?.getRangeAt(0);
      if (range) {
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        position = preCaretRange.toString().length;
      }
    }
  }
  return position;
}

export function EditableBlock({
  block: { id, html: _html = "", parentId },
}: EditableBlockProps): JSX.Element {
  const { addEventListener } = useEvents();
  const { updateBlock } = useEditor();

  const text = useRef(_html);

  useEffect(() => {
    text.current = _html;
  }, [_html]);

  const contentEditable = useRef<HTMLElement>(null);
  const tag = "p";

  const onChangeHandler = useCallback(
    (e) => {
      updateBlock({ id, html: e.target.value });
    },
    [id, updateBlock]
  );

  const { addBlockAfter } = useEditor();

  useEffect(
    () =>
      addEventListener(id, (event) => {
        console.log({ id, event });
        if (event.eventName === "focus") contentEditable?.current?.focus();
      }),
    [addEventListener, id]
  );

  const onKeyDownHandler = useCallback<KeyboardEventHandler>(
    (e) => {
      if (e.key === CMD_KEY) {
        // If the user starts to enter a command, we store a backup copy of
        // the html. We need this to restore a clean version of the content
        // after the content type selection was finished.
        // this.setState({ htmlBackup: this.state.html });
      }
      if (e.key === "Enter" && !e.shiftKey) {
        if (!contentEditable.current) return;
        const index = getCaretIndex(contentEditable.current);
        addBlockAfter(id, {
          id: Math.random().toString(),
          type: "text",
          parentId,
          html: text.current.slice(index),
        });
        updateBlock({ id, html: text.current.slice(0, index) });
        e.preventDefault();
        // this.props.addBlock({
        //   id: this.props.id,
        //   ref: this.contentEditable.current,
        // });
      }
      if (e.key === "Backspace") {
        if (!contentEditable.current) return;
        const index = getCaretIndex(contentEditable.current);
        if (index === 0) e.preventDefault();
      }
    },
    [addBlockAfter, id, parentId, updateBlock]
  );

  return (
    <ContentEditable
      className="Block"
      innerRef={contentEditable}
      html={_html}
      tagName={tag}
      onChange={onChangeHandler}
      onKeyDown={onKeyDownHandler}
    />
  );
}
