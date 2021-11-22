import { useCallback, useMemo, useState } from 'react';
import { v4 } from 'uuid';
import { MenuItemProps } from '../../../inspector/components/InspectorItem';
import { installedBlocks } from '../../components/Block/BlockSelector';
import { BasicBlock } from '../../types/basicBlock';
import { useEditor } from '../useEditor';

const TurnIntoBlocks: [
	string,
	keyof typeof installedBlocks | ({ [key: string]: any } & { type: keyof typeof installedBlocks }),
][] = [
	['Text', 'text'],
	['Heading 1', { type: 'text', style: 'heading1' }],
	['Heading 2', { type: 'text', style: 'heading2' }],
	['Heading 3', { type: 'text', style: 'heading3' }],
	['Heading 4', { type: 'text', style: 'heading4' }],
	['Card', 'card'],
	['Form', 'form'],
	['Tabs', 'tabs'],
	['List', 'list'],
	['Code', 'code'],
	['Query', 'query'],
	['Chart', 'chart'],
	['Page', 'subpage'],
	['Progress bar', 'progressBar'],
	['JSON viewer', 'JSONView'],
	['KeyValue viewer', 'keyValue'],
	['Table', 'table'],
	['Image', 'image'],
	['Input', 'textInput'],
	['Numeric input', 'numericInput'],
	['TextArea', 'textArea'],
	['Date input', 'dateInput'],
	['Button', 'button'],
];

export function useBlockInspectorProvider(block: BasicBlock) {
	const { id, display } = block;
	const { deleteBlock, immerBlockProps, updateBlockType, updateBlockId } = useEditor();

	const [menuParticles, setMenuParticles] = useState<{ [id: string]: { menu: MenuItemProps[]; index: number } }>({});
	const isHide = display?.hide;

	const defaultWrap = useCallback(
		(items: MenuItemProps[]): MenuItemProps[] => {
			return [
				{
					type: 'blockName',
					label: id,
					onChange: (v) => {
						updateBlockId(id, v);
					},
				},
				...items,
				{
					type: 'nested',
					label: 'Display',
					icon: 'eye-open',
					next: [
						{
							label: 'Hide',
							type: 'switch',
							value: Boolean(isHide),
							onChange: (v) =>
								immerBlockProps(id, (draft) => {
									if (!draft.display) draft.display = {};
									draft.display.hide = v;
								}),
						},
					],
				},
				{
					type: 'nested',
					label: 'Turn into',
					icon: 'rotate-document',
					next: TurnIntoBlocks.map((blockType) => ({
						label: blockType[0],
						type: 'item',
						call: () => updateBlockType(id, blockType[1]),
					})),
				},
				{
					type: 'item',
					icon: 'trash',
					label: `Delete block "${id}"`,
					closeAfterCall: true,
					call: () => deleteBlock(id),
				},
			];
		},
		[deleteBlock, isHide, id, immerBlockProps, updateBlockId, updateBlockType],
	);

	const appendMenuParticle = useCallback((menu: MenuItemProps[], index: number) => {
		const particleId = v4();
		setMenuParticles((v) => ({ ...v, [particleId]: { menu, index } }));
		return () =>
			setMenuParticles((v) => {
				return Object.fromEntries(Object.entries(v).filter(([key]) => key !== particleId));
			});
	}, []);

	const menu = useMemo(() => {
		const sortedKeys = Object.keys(menuParticles).sort((a, b) => {
			return menuParticles[a].index - menuParticles[b].index;
		});
		const combinedMenu = sortedKeys.flatMap((key) => menuParticles[key].menu);
		return defaultWrap(combinedMenu);
	}, [defaultWrap, menuParticles]);

	return { menu, appendMenuParticle };
}
