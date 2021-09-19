import { Button } from '@blueprintjs/core';
import ky from 'ky';
import * as React from 'react';
import { useQuery } from 'react-query';
import { Config } from '../../../../config';
import { useEditor } from '../../hooks/useEditor';
import { usePageNavigator } from '../../../../hooks/usePageNavigator';
import { useReferenceEvaluator } from '../../../executor/hooks/useReferences';
import { BasicBlock } from '../../types/basicBlock';
import { BlockInspector } from '../../../inspector/components/BlockInspector';
import { useBlockInspectorState } from '../../../inspector/hooks/useBlockInspectorState';
import { PageBlockProps } from '../Page';

export type SubPageBlockType = SubPageBlockProps;
export type SubPageBlockProps = {
	type: 'subpage';
	subpageId: string;
	state: string;
	isCreated: boolean;
};

export function SubPageBlock({ block }: { block: BasicBlock & SubPageBlockType }) {
	const { id, subpageId, pageId, state = '', isCreated = false } = block;
	const { immerBlockProps, updateBlockProps } = useEditor();

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

	const { isFetched } = useQuery(
		['createPage', subpageId],
		() =>
			ky.get(`${Config.domain}/pages/create`, { searchParams: { id: subpageId, parentPageId: pageId } }).json<{
				value: { page: BasicBlock & PageBlockProps };
			}>(),
		{
			enabled: !isCreated,
			onSuccess() {
				updateBlockProps({ id, isCreated: true });
			},
		},
	);

	const { data: { value: { page = null } = {} } = {} } = useQuery<{
		value: { page: BasicBlock & PageBlockProps };
	}>(['/pages/get', { id: subpageId }], { enabled: Boolean(isFetched || isCreated) });

	const { evaluate } = useReferenceEvaluator();

	if (!block.show) return null;

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<div onContextMenu={onContextMenu}>
				<Button
					onClick={() => {
						if (page && page.pageId) navigate(page.pageId, evaluate(state));
					}}
					icon="document"
					minimal
					text={page?.title}
				/>
			</div>
		</>
	);
}
