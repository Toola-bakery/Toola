import { Button } from '@blueprintjs/core';
import { useWhatChanged } from '@simbathesailor/use-what-changed';
import React, { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import mergeRefs from 'react-merge-refs';
import { usePageContext } from '../../../executor/hooks/useReferences';
import { BlockInspector } from '../../../inspector/components/BlockInspector';
import { MenuItemProps } from '../../../inspector/components/InspectorItem';
import { InspectorPropsType, useInspectorState } from '../../../inspector/hooks/useInspectorState';
import { useBlockInspectorProvider } from '../../hooks/blockInspector/useBlockInspectorProvider';
import { useBlockDrag } from '../../hooks/useBlockDrag';
import { useCurrent } from '../../hooks/useCurrent';
import { useEditor } from '../../hooks/useEditor';
import { BasicBlock } from '../../types/basicBlock';
import { Blocks } from '../../types/blocks';
import { useHover } from '../../../../hooks/useHover';
import { BlockBadge } from './BlockBadge';
import { BlockSelector } from './BlockSelector';

type DragClickEventHandler = (e: React.MouseEvent, _path?: string[]) => void;

export type BlockContextType = {
	block: undefined | BasicBlock;
	showInspector: DragClickEventHandler;
	inspectorProps: InspectorPropsType;
	setShowInspector: (listener: DragClickEventHandler) => void;
	menu: MenuItemProps[];
	appendMenuParticle: (menu: MenuItemProps[], index: number) => () => void;
};

export const BlockContext = React.createContext<BlockContextType>({
	appendMenuParticle: () => () => {},
	menu: [],
	block: undefined,
	showInspector: () => {},
	setShowInspector: () => {},
	inspectorProps: { menu: [], setPath() {}, path: [''], close() {}, isOpen: false, open() {} },
});

export function BlockContextProvider({
	blockId,
	block: customBlock,
	children,
}: PropsWithChildren<{ blockId?: string; block?: BasicBlock & Blocks }>) {
	const { blocks } = useCurrent();
	const { editing } = usePageContext();

	const block = blockId ? blocks[blockId] : customBlock;
	if ((!blockId && !customBlock) || !block) throw new Error('BlockContextProvider: set customBlock or blockId');
	const { appendMenuParticle, menu } = useBlockInspectorProvider(block);

	const { onContextMenu: showInspectorPrivate, inspectorProps: inspectorPropsPrivate } = useInspectorState({
		disabled: !editing,
		menu,
	});

	const [showInspector, setShowInspectorPrivate] = useState<DragClickEventHandler>();

	const setShowInspector = useCallback(
		(nextShowInspector: DragClickEventHandler) => setShowInspectorPrivate(() => nextShowInspector),
		[],
	);

	const inspectorProps = useMemo<InspectorPropsType>(
		() => ({ ...inspectorPropsPrivate, menu }),
		[inspectorPropsPrivate, menu],
	);

	const value = useMemo(
		() => ({
			block,
			showInspector: showInspector || showInspectorPrivate,
			menu,
			appendMenuParticle,
			inspectorProps,
			setShowInspector,
		}),
		[block, showInspector, showInspectorPrivate, menu, appendMenuParticle, inspectorProps, setShowInspector],
	);
	return <BlockContext.Provider value={value}>{children}</BlockContext.Provider>;
}

export function Block({
	block,
	hide = false,
	minimal = false,
}: {
	block: BasicBlock & Blocks;
	hide?: boolean;
	minimal?: boolean;
}): JSX.Element {
	const { editing } = usePageContext();

	const [{ opacity }, dragRef, dragPreview] = useBlockDrag(block);
	// const { ref, isHover } = useHover<HTMLElement>();

	const { addBlockAfter } = useEditor();
	const addBlock = useCallback(() => {
		if (editing) addBlockAfter(block.id, { type: 'text' }, true);
	}, [editing, addBlockAfter, block.id]);

	return (
		<BlockContextProvider block={block}>
			{!block.show || hide || minimal ? (
				<BlockSelector block={block} hide={hide} />
			) : (
				<div
					ref={mergeRefs([
						dragPreview,
						//	ref
					])}
					style={{
						display: 'flex',
						flexDirection: 'row',
						opacity,
						width: '100%',
						position: 'relative',
						transform: 'translate3d(0, 0, 0)',
					}}
				>
					<BlockBadge dragRef={dragRef} show={false} />
					<div style={{ width: 25, flexShrink: 1, opacity: false ? 1 : 0 }}>
						<Button
							onClick={addBlock}
							style={{
								padding: 0,
								minHeight: 15,
								minWidth: 10,
								width: 18,
								height: 25,
								opacity: 0.6,
							}}
							icon="plus"
							minimal
						/>
					</div>
					<div style={{ width: 'calc(100% - 25px)' }}>
						<BlockSelector block={block} />
					</div>
				</div>
			)}
			<BlockInspector />
		</BlockContextProvider>
	);
}
