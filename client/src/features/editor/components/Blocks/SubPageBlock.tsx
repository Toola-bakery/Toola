import { Button } from '@blueprintjs/core';
import { useEffect } from 'react';
import * as React from 'react';
import { useMutation, useQuery } from 'react-query';
import { Config } from '../../../../Config';
import { useKy } from '../../../../hooks/useKy';
import { useProjects } from '../../../usersAndProjects/hooks/useProjects';
import { useEditor } from '../../hooks/useEditor';
import { usePageNavigator } from '../../../../hooks/usePageNavigator';
import { useReferenceEvaluator } from '../../../executor/hooks/useReferences';
import { BasicBlock } from '../../types/basicBlock';
import { BlockInspector } from '../../../inspector/components/BlockInspector';
import { useBlockInspectorState } from '../../../inspector/hooks/useBlockInspectorState';
import { usePage } from '../Page/hooks/usePage';
import { Page } from '../Page/hooks/usePages';
import { PageBlockProps } from '../Page/Page';

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

	const { onContextMenu, inspectorProps } = useBlockInspectorState([
		{
			label: 'Page Params',
			type: 'input',
			onChange: (v) =>
				immerBlockProps<SubPageBlockProps>(id, (draft) => {
					draft.state = v;
				}),
			value: state,
		},
	]);

	const { navigate } = usePageNavigator();
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

	const { data: { value: { page = null } = {} } = {} } = usePage((isCreated && subpageId) || '');

	const { evaluate } = useReferenceEvaluator();

	if (hide || !block.show) return null;

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<div onContextMenu={onContextMenu}>
				<Button
					onClick={() => {
						if (page) navigate(subpageId, evaluate(state));
					}}
					icon="document"
					minimal
					text={page?.title || 'Untitled'}
				/>
			</div>
		</>
	);
}
