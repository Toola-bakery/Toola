import { KeyboardEventHandler, MutableRefObject, RefObject } from 'react';
import { useRefsLatest } from '../../../../../hooks/useRefLatest';
import { useAppSelector } from '../../../../../redux/hooks';
import { usePageContext } from '../../../../executor/hooks/useReferences';
import { InspectorPropsType } from '../../../../inspector/hooks/useBlockInspectorState';
import { getCaretGlobalPosition, getCaretIndex, getSelection } from '../../../helpers/caretOperators';
import { useBlock } from '../../../hooks/useBlock';
import { useEditor } from '../../../hooks/useEditor';
import { selectBlockNeighborsProps } from '../../../redux/editor';
import { addPlugin, commonPlugins, concatEntities, removePlugin, sliceEntities } from './plugins/TextEntitiesMutation';
import { TextEntityPlugins } from './plugins/TextPlugins';
import { TextBlockProps } from './TextBlock';

const CMD_KEY = '/';

export function useTextBlockOnKeyDownHandler({
	contentEditableRef,
	inspectorProps,
	setToPosRef: _setToPosRef,
}: {
	contentEditableRef: RefObject<HTMLElement>;
	setToPosRef: MutableRefObject<[number, number] | number | null>;
	inspectorProps: InspectorPropsType;
}) {
	const setToPosRef = _setToPosRef;
	const { id, value, entities } = useBlock<TextBlockProps>();
	const { pageId } = usePageContext();
	const { updateBlockProps, updateBlockType, addBlockAfter, deleteBlock } = useEditor();
	const { previous } = useAppSelector((state) => selectBlockNeighborsProps(state, pageId, id));
	const { addBlockAfterRef, deleteBlockRef, previousRef, valueRef, inspectorPropsRef, entitiesRef } = useRefsLatest({
		previous,
		addBlockAfter,
		updateBlockType,
		deleteBlock,
		value,
		entities,
		inspectorProps,
	});

	function togglePlugin(plugin: TextEntityPlugins) {
		if (!contentEditableRef.current) return;
		const [start, end] = getSelection(contentEditableRef.current);
		if (start === end) return;
		setToPosRef.current = [start, end];
		const plugins = commonPlugins(value, entities, start, end - 1);
		const newBlock = plugins.find((p) => p[0] === plugin[0])
			? removePlugin(valueRef.current, entitiesRef.current, [start, end - 1], plugin[0])
			: addPlugin(valueRef.current, entitiesRef.current, [start, end - 1], plugin);
		updateBlockProps({ id, value: newBlock[0], entities: newBlock[1] });
	}

	const onKeyDownHandler: KeyboardEventHandler = (e) => {
		if (!contentEditableRef.current) return;
		if (e.ctrlKey || e.metaKey) {
			if (e.key === 'b') {
				togglePlugin(['b']);
				e.preventDefault();
			}
			if (e.key === 'i') {
				togglePlugin(['i']);
				e.preventDefault();
			}

			if (e.key === 'u') {
				togglePlugin(['u']);
				e.preventDefault();
			}

			if (e.key === 's' && e.shiftKey) {
				togglePlugin(['s']);
				e.preventDefault();
			}

			if (e.key === 'v') {
				e.preventDefault();
			}

			return false;
		}

		if (e.key === CMD_KEY) {
			const position = getCaretGlobalPosition();
			if (position) inspectorPropsRef.current.open(position.left, position.top, ['Turn into']);
		}
		if (e.key === 'Enter' && !e.shiftKey) {
			const index = getCaretIndex(contentEditableRef.current);
			const newBlock = sliceEntities(valueRef.current, entitiesRef.current, index);
			const thisBlock = sliceEntities(valueRef.current, entitiesRef.current, 0, index - 1);

			addBlockAfterRef.current(
				id,
				{
					type: 'text',
					value: newBlock[0],
					entities: newBlock[1],
				},
				0,
			);
			updateBlockProps({ id, value: thisBlock[0], entities: thisBlock[1] });
			e.preventDefault();
		}
		if (e.key === 'Backspace') {
			const index = getCaretIndex(contentEditableRef.current);
			if (index === 0) {
				e.preventDefault();
				deleteBlockRef.current(id);
				if (previousRef.current?.type === 'text') {
					const newBlock = concatEntities(
						previousRef.current.value,
						previousRef.current.entities,
						valueRef.current,
						entitiesRef.current,
					);

					updateBlockProps(
						{ id: previousRef.current.id, value: newBlock[0], entities: newBlock[1] },
						previousRef.current.value.length,
					);
				}
			}
		}
	};

	return { onKeyDownHandler };
}
