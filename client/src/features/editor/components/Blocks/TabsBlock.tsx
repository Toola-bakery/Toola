import { Button, Tab, Tabs } from '@blueprintjs/core';
import React, { useCallback, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { usePageContext, useReferenceEvaluator } from '../../../executor/hooks/useReferences';
import { BlockInspector } from '../../../inspector/components/BlockInspector';
import { MenuItemProps } from '../../../inspector/components/InspectorItem';
import { useAppendBlockMenu } from '../../hooks/blockInspector/useAppendBlockMenu';
import { useBlockInspectorState } from '../../hooks/blockInspector/useBlockInspectorState';
import { useBlock } from '../../hooks/useBlock';
import { useBlockProperty } from '../../hooks/useBlockProperty';
import { useCurrent } from '../../hooks/useCurrent';
import { useEditor } from '../../hooks/useEditor';
import { BasicBlock } from '../../types/basicBlock';
import { Blocks } from '../../types/blocks';
import { EmojiPicker } from '../componentsWithLogic/EmojiPicker';
import { ColumnBlock, ColumnBlockType } from './Layout/ColumnBlock';

const TabsBlockStyles = styled.div`
	height: 100%;
	border: 1px solid rgb(237, 237, 237);
	border-radius: 4px;

	.bp4-tab-panel {
		margin-top: 0;
		height: calc(100% - 31px);
		min-height: 250px;
	}

	.bp4-tabs {
		height: 100%;
	}

	.bp4-tab-list {
		overflow-x: auto;
		&::-webkit-scrollbar {
			display: none;
		}
		-ms-overflow-style: none;
		scrollbar-width: none;
		padding: 0 8px;
		//border: 0 solid rgb(237, 237, 237);
		//border-bottom-width: 1px;
		align-items: center;
	}
`;

export function TabsBlock({ hide }: { hide: boolean }) {
	const block = useBlock();
	const [tabs, setTabs] = useBlockProperty<string[]>('blocks', []);
	const [tabNames, setTabNames] = useBlockProperty<string[]>('tabNames', []);
	const [tabEmojis, setTabEmojis] = useBlockProperty<(string | undefined)[]>('tabEmojis', []);
	const { blocks } = useCurrent();
	const { addBlocks, addChild } = useEditor();
	const { pageId } = usePageContext();
	const { evaluate } = useReferenceEvaluator({});
	const calculatedTabNames = useMemo(() => tabNames.map((name) => evaluate(name)), [tabNames, evaluate]);

	const addColumnAfterAndPutItem = useCallback(
		(item?: Pick<BasicBlock & Blocks, 'id'>, putAfterColumnId?: string | null) => {
			const [{ id: columnId }] = addBlocks([{ type: 'column', pageId, parentId: block.id, blocks: [] }]);
			if (item) addChild(columnId, item.id, 0);

			const index = putAfterColumnId ? tabs.indexOf(putAfterColumnId) : 0;
			setTabs((draft) => {
				draft.splice(index + 1, 0, columnId);
			});
			setTabNames((draft) => {
				draft.splice(index + 1, 0, '');
			});
			setTabEmojis((draft) => {
				draft.splice(index + 1, 0, undefined);
			});

			return columnId;
		},
		[addBlocks, addChild, block.id, pageId, setTabEmojis, setTabNames, setTabs, tabs],
	);

	useEffect(() => {
		if (!tabs.length) {
			addColumnAfterAndPutItem();
		}
	}, [addColumnAfterAndPutItem, tabs]);

	const menu = useMemo<MenuItemProps[]>(() => {
		const tabMenus =
			tabs?.map<MenuItemProps>((tab, i) => ({
				type: 'nested',
				label: `tab${tab}`,
				next: [
					{
						label: 'Header',
						type: 'input',
						onChange: (v) =>
							setTabNames((draft) => {
								draft[i] = v;
							}),
						value: tabNames[i],
					},
					{
						label: 'Delete tab',
						type: 'item',
						closeAfterCall: true,
						call: () => {
							setTabNames((draft) => {
								draft.splice(i, 1);
							});
							setTabEmojis((draft) => {
								draft.splice(i, 1);
							});
							setTabs((draft) => {
								draft.splice(i, 1);
							});
						},
					},
				],
			})) || [];
		return [...tabMenus];
	}, [setTabEmojis, setTabNames, setTabs, tabNames, tabs]);
	useAppendBlockMenu(menu, 1);
	const { onContextMenu, inspectorProps } = useBlockInspectorState();

	if (hide || !block.show) return null;

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<TabsBlockStyles onContextMenu={(e) => onContextMenu(e, ['global'])}>
				<Tabs>
					{tabs.map((blockId, i) => (
						<Tab
							style={{ marginTop: 0 }}
							id={blockId}
							title={
								<div
									onContextMenu={(e) => onContextMenu(e, [`tab${blockId}`])}
									style={{ display: 'flex', alignItems: 'center', lineHeight: '25px' }}
								>
									<EmojiPicker
										setEmoji={(nextEmoji) =>
											setTabEmojis((draft) => {
												draft[i] = nextEmoji;
											})
										}
										small
										emoji={tabEmojis[i]}
										useDefaultDocument={false}
									/>
									{calculatedTabNames[i] || 'Untitled'}
								</div>
							}
							panel={<ColumnBlock block={blocks[blockId] as BasicBlock & ColumnBlockType} />}
						/>
					))}
					<Button
						minimal
						small
						icon="plus"
						onClick={() => addColumnAfterAndPutItem(undefined, tabs[tabs.length - 1])}
					/>
				</Tabs>
			</TabsBlockStyles>
		</>
	);
}
