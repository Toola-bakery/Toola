import { Button } from '@blueprintjs/core';
import { useEffect, useMemo } from 'react';
import * as React from 'react';
import { useMutation } from 'react-query';
import { useKy } from '../../../hooks/useKy';
import { MenuItemProps } from '../../inspector/components/InspectorItem';
import { useProjects } from '../../usersAndProjects/hooks/useProjects';
import { useAppendBlockMenu } from '../../editor/hooks/blockInspector/useAppendBlockMenu';
import { useBlockContext } from '../../editor/hooks/useBlockContext';
import { useEditor } from '../../editor/hooks/useEditor';
import { useReferenceEvaluator } from '../../executor/hooks/useReferences';
import { BasicBlock } from '../../editor/types/basicBlock';
import { PageButton } from '../components/PageButton';

export type SubPageBlockType = SubPageBlockProps;
export type SubPageBlockProps = {
	type: 'subpage';
	subpageId: string;
	state: string;
	isCreated: boolean;
};

export function SubPageBlock({ block, hide }: { block: BasicBlock & SubPageBlockType; hide: boolean }) {
	const { id, subpageId, pageId, state = '', isCreated = false } = block;
	const { immerBlockProps, updateBlockProps } = useEditor();
	const { currentProjectId } = useProjects();

	const menu = useMemo<MenuItemProps[]>(
		() => [
			{
				label: 'Page Params',
				type: 'input',
				onChange: (v) =>
					immerBlockProps<SubPageBlockProps>(id, (draft) => {
						draft.state = v;
					}),
				value: state,
			},
		],
		[id, immerBlockProps, state],
	);
	useAppendBlockMenu(menu, 1);

	const ky = useKy();

	const { mutate, isIdle } = useMutation(
		['createPage', subpageId],
		() =>
			ky
				.post(`pages/create`, {
					json: { id: subpageId, parentPageId: pageId, projectId: currentProjectId },
				})
				.json<{ ok: boolean }>(),
		{
			onSuccess(resp) {
				if (resp.ok) updateBlockProps({ id, isCreated: true });
			},
		},
	);

	useEffect(() => {
		if (!isCreated && isIdle) mutate();
	}, [isCreated, isIdle, mutate]);

	const { evaluate } = useReferenceEvaluator();
	const { showInspector } = useBlockContext();

	if (hide || !block.show) return null;

	return (
		<div onContextMenu={showInspector}>
			<PageButton pageId={subpageId} params={() => evaluate(state)} />
		</div>
	);
}
