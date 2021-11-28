import { Tag } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import { useReferences } from '../../executor/hooks/useReferences';
import { MenuItemProps } from '../../inspector/components/InspectorItem';
import { useAppendBlockMenu } from '../../editor/hooks/blockInspector/useAppendBlockMenu';
import { useBlock } from '../../editor/hooks/useBlock';
import { useBlockContext } from '../../editor/hooks/useBlockContext';
import { useBlockProperty } from '../../editor/hooks/useBlockProperty';

export function TagsBlock({ hide }: { hide: boolean }) {
	const block = useBlock();
	const { showInspector } = useBlockContext();

	const [tags, setTags] = useBlockProperty<string>(
		'tags',
		// eslint-disable-next-line no-template-curly-in-string
		"${['apple', 'banana', 'watermelon']}",
	);
	const tagsCalculated = useReferences(tags);

	const [tagColors, setBorderColor] = useBlockProperty<string>(
		'tagColors',
		// eslint-disable-next-line no-template-curly-in-string
		"${['#f8dbd8', '#f9e7d7', '#fbedc8', '#d7eae0', '#d2eaf6', '#e4dcf5', '#fadbec']}",
	);
	const tagColorsCalculated = useReferences(tagColors);

	const menu = useMemo<MenuItemProps[]>(
		() => [
			{
				type: 'input',
				label: 'Tags',
				value: tags,
				onChange: setTags,
			},
			{
				type: 'input',
				label: 'Tag colors',
				value: tagColors,
				onChange: setBorderColor,
			},
		],
		[setBorderColor, setTags, tagColors, tags],
	);
	useAppendBlockMenu(menu, 0);
	if (hide || !block.show) return null;

	return (
		<div style={{ minHeight: 25, display: 'flex', alignItems: 'center' }} onContextMenu={showInspector}>
			{Array.isArray(tagsCalculated)
				? tagsCalculated.map((v, i) => (
						<Tag
							style={{
								backgroundColor: tagColorsCalculated?.[i % (tagColorsCalculated?.length || 1)],
								color: 'rgba(0,0,0,0.6)',
								marginRight: 5,
							}}
							key={String(i)}
						>
							<span style={{ fontWeight: 600 }}>{String(v)}</span>
						</Tag>
				  ))
				: null}
		</div>
	);
}
