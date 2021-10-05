import { KeyboardEventHandler, RefObject } from 'react';
import { useRefsLatest } from '../../../../../hooks/useRefLatest';
import { useAppSelector } from '../../../../../redux/hooks';
import { usePageContext } from '../../../../executor/hooks/useReferences';
import { InspectorPropsType } from '../../../../inspector/hooks/useBlockInspectorState';
import { getCaretGlobalPosition, getCaretIndex } from '../../../helpers/caretOperators';
import { useBlock } from '../../../hooks/useBlock';
import { useEditor } from '../../../hooks/useEditor';
import { selectBlockNeighborsProps } from '../../../redux/editor';
import { TextBlockProps } from './TextBlock';

const CMD_KEY = '/';

export function useTextBlockOnKeyDownHandler({
	contentEditableRef,
	inspectorProps,
}: {
	contentEditableRef: RefObject<HTMLElement>;
	inspectorProps: InspectorPropsType;
}) {
	const { id, value } = useBlock<TextBlockProps>();
	const { pageId } = usePageContext();
	const { updateBlockProps, updateBlockType, addBlockAfter, deleteBlock } = useEditor();
	const { previous } = useAppSelector((state) => selectBlockNeighborsProps(state, pageId, id));
	const { addBlockAfterRef, deleteBlockRef, previousRef, valueRef, inspectorPropsRef } = useRefsLatest({
		previous,
		addBlockAfter,
		updateBlockType,
		deleteBlock,
		value,
		inspectorProps,
	});

	const onKeyDownHandler: KeyboardEventHandler = (e) => {
		if (e.ctrlKey || e.metaKey) {
			e.preventDefault();
			return false;
		}

		if (e.key === CMD_KEY) {
			if (!contentEditableRef.current) return;
			const position = getCaretGlobalPosition();
			if (position) inspectorPropsRef.current.open(position.left, position.top, ['Turn into']);
		}
		if (e.key === 'Enter' && !e.shiftKey) {
			if (!contentEditableRef.current) return;
			const index = getCaretIndex(contentEditableRef.current);
			addBlockAfterRef.current(id, {
				type: 'text',
				value: valueRef.current.slice(index),
				entities: [],
			});
			updateBlockProps({ id, value: valueRef.current.slice(0, index) });
			e.preventDefault();
		}
		if (e.key === 'Backspace') {
			if (!contentEditableRef.current) return;
			const index = getCaretIndex(contentEditableRef.current);
			if (index === 0) {
				e.preventDefault();
				deleteBlockRef.current(id);
				if (previousRef.current?.type === 'text')
					updateBlockProps(
						{
							id: previousRef.current.id,
							value: previousRef.current.value + valueRef.current,
						},
						true,
					);
			}
		}
	};

	return { onKeyDownHandler };
}
