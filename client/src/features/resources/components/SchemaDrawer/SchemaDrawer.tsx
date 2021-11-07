import { Button, Icon, Tree } from '@blueprintjs/core';
import { TreeNodeInfo } from '@blueprintjs/core/src/components/tree/treeNode';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useImmer } from 'use-immer';
import copy from 'copy-to-clipboard';
import { useDrawer, useDrawerResizable } from '../../../drawer/hooks/useDrawer';
import { useResourceSchema } from '../../hooks/useResourceSchema';

const RESIZABLE_WIDTH = 2;
const Resizable = styled.div`
	position: absolute;
	left: 0;
	top: 0;
	height: 100%;
	width: ${RESIZABLE_WIDTH}px;
	cursor: col-resize;
	&:hover,
	&.move {
		background-color: rgba(0, 0, 0, 0.21);
	}
	z-index: 999;
`;

const StyledSchemaDrawer = styled.div`
	border-left-width: 1px;
	border-left-color: rgb(237, 237, 237);
	border-left-style: solid;
	height: 100%;
	position: relative;

	.bp4-tree-node-content {
		padding-left: 5px;
	}

	.bp4-tree-node-content-0 {
		position: sticky;
		background-color: white;
		top: 0;
		font-weight: bold;
		width: 100%;
		font-size: 16px;
		z-index: 99;
	}

	.bp4-tree-node-content-1 {
		font-weight: 600;
		position: sticky;
		background-color: white;
		top: 30px;
		width: 100%;
		z-index: 100;
	}
	.bp4-tree-node-secondary-label {
		color: rgba(0, 0, 0, 0.28);
	}
`;

export function SchemaDrawer() {
	const { size, setSize } = useDrawer({ name: 'schemaDrawer' });

	const { isMovingRef, resizableRef } = useDrawerResizable({
		axis: 'x',
		reverse: true,
		setSize,
	});
	const { responses, resources } = useResourceSchema();

	const [countSuccess, setCountSuccess] = useState(0);
	const [state, immer] = useImmer<TreeNodeInfo[]>([]);

	useEffect(() => {
		if (responses.filter((v) => v.isSuccess).length === countSuccess) return;
		setCountSuccess(responses.filter((v) => v.isSuccess).length);
		const contents = responses
			.map<TreeNodeInfo | null>((resp, i) => {
				if (!resp.isSuccess || !resp.data) return null;
				const resourceName = resources[i].name;

				return {
					id: resources[i]._id,
					label: resourceName,
					isExpanded: true,
					secondaryLabel: (
						<Button
							small
							minimal
							style={{ minHeight: 20, minWidth: 20, color: 'rgba(0,0,0,0.37)' }}
							rightIcon={<Icon icon="duplicate" size={12} style={{ color: 'rgba(0,0,0,0.37)' }} />}
							onClick={() => copy(resources[i]._id)}
						>
							id
						</Button>
					),
					childNodes: Object.entries(resp.data as any).map(([tableName, columns]) => ({
						id: tableName,
						label: tableName,
						isExpanded: false,
						childNodes: Object.entries(columns as any).map(([columnName, v]) => ({
							id: columnName,
							label: columnName,
							secondaryLabel: (v as any)?.data_type,
						})),
					})),
				};
			})
			.filter((v): v is TreeNodeInfo => !!v);
		immer(contents);
	}, [countSuccess, immer, resources, responses]);

	return (
		<StyledSchemaDrawer style={{ width: size, overflowY: 'hidden' }}>
			<Resizable
				ref={resizableRef}
				onMouseDown={() => {
					isMovingRef.current = true;
				}}
			/>
			<div style={{ overflowY: 'auto', height: '100%' }}>
				<Tree
					contents={state}
					onNodeExpand={(node, nodePath) => {
						immer((draft) => {
							const selectedNode = nodePath.reduce((acc, item) => (acc.childNodes || [])[item], {
								childNodes: draft,
							} as TreeNodeInfo);
							selectedNode.isExpanded = true;
						});
					}}
					onNodeClick={(node, nodePath) => {
						if (nodePath.length >= 2 && typeof node.label === 'string') {
							copy(node.label);
						}
					}}
					onNodeCollapse={(node, nodePath) => {
						immer((draft) => {
							const selectedNode = nodePath.reduce((acc, item) => (acc.childNodes || [])[item], {
								childNodes: draft,
							} as TreeNodeInfo);
							selectedNode.isExpanded = false;
						});
					}}
				/>
			</div>
		</StyledSchemaDrawer>
	);
}
