import Button from '@material-ui/core/Button';
import DescriptionIcon from '@material-ui/icons/Description';
import ky from 'ky';
import * as React from 'react';
import { useQuery } from 'react-query';
import { Config } from '../../../../config';
import { useEditor } from '../../hooks/useEditor';
import { usePageNavigator } from '../../hooks/usePageNavigator';
import { useReferenceEvaluator, useReferences } from '../../hooks/useReferences';
import { BasicBlock } from '../../types/basicBlock';
import { BlockInspector } from '../Inspector/BlockInspector';
import { useBlockInspectorState } from '../../hooks/useBlockInspectorState';
import { PageBlockProps } from '../Page';

export type SubPageBlockType = SubPageBlockProps;
export type SubPageBlockProps = {
	type: 'subpage';
	subpageId: string;
	state: string;
	isCreated: boolean;
};

export function SubPageBlock({ block }: { block: BasicBlock & SubPageBlockType }): JSX.Element {
	const { id, subpageId, pageId, state = '', isCreated = false } = block;
	const { immerBlockProps, updateBlockProps } = useEditor();

	const { onContextMenu, inspectorProps } = useBlockInspectorState(id, [
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

	const { data: { value: { page = null } = {} } = {} } = useQuery(
		['page', subpageId],
		() =>
			ky.get(`${Config.domain}/pages/get`, { searchParams: { id: subpageId } }).json<{
				value: { page: BasicBlock & PageBlockProps };
			}>(),
		{ enabled: Boolean(isFetched || isCreated) },
	);

	const { evaluate } = useReferenceEvaluator();

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<div onContextMenu={onContextMenu}>
				<Button
					onClick={() => {
						if (page && page.pageId) navigate(page.pageId, evaluate(state));
					}}
					startIcon={<DescriptionIcon />}
				>
					{page?.title}
				</Button>
			</div>
		</>
	);
}
