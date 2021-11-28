import { Button, Dialog, FormGroup, HTMLSelect, HTMLTable, InputGroup } from '@blueprintjs/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { noCase } from 'change-case';
import styled from 'styled-components';
import { useImmer } from 'use-immer';
import { normalizeCase } from '../../../../libs/normalizeCase';
import { useResourceSchema } from '../../../resources/hooks/useResourceSchema';
import { useBlock } from '../../../editor/hooks/useBlock';
import { useEditor } from '../../../editor/hooks/useEditor';

const StyledHTMLTable = styled(HTMLTable)`
	& tbody tr:first-child th,
	& tbody tr:first-child td,
	& tfoot tr:first-child th,
	& tfoot tr:first-child td {
		-webkit-box-shadow: none !important;
		box-shadow: none !important;
	}
	& thead tr:first-child th {
		-webkit-box-shadow: inset 0 -1px 0 0 rgb(17 20 24 / 15%);
		//box-shadow: inset 0 1px 0 0 rgb(17 20 24 / 15%);
	}
`;

export function GenerateFormModal({ isOpen, close }: { isOpen: boolean; close: () => void }) {
	const { id, pageId } = useBlock();
	const schemas = useResourceSchema();
	const [resourceId, setResourceId] = useState<string>();
	const [tableName, setTableName] = useState<string>();
	const currentResource = useMemo(
		() => schemas.find((schema) => schema.resource._id === resourceId),
		[resourceId, schemas],
	);
	useEffect(() => {
		if (!resourceId && schemas?.[0]?.resource?._id) setResourceId(schemas[0].resource._id);
	}, [schemas, resourceId]);

	const currentTables = useMemo(
		() => (tableName && currentResource && (currentResource?.schema as any)[tableName]) || {},
		[currentResource, tableName],
	);
	useEffect(() => {
		if (tableName) return;
		const schema = currentResource && (currentResource?.schema as any);
		if (schema && Object.keys(schema).length) {
			setTableName(Object.keys(schema)[0]);
		}
	}, [currentResource, tableName]);

	const [inputValues, immer] = useImmer<{ [name: string]: string }>({});

	useEffect(() => {
		const newValue = Object.fromEntries(Object.entries(currentTables).map(([name]) => [name, normalizeCase(name)]));
		immer(newValue);
	}, [currentTables, immer]);

	const { addBlocks, addChild } = useEditor();

	const createForm = useCallback(() => {
		const createdBlocks = addBlocks(
			Object.entries(inputValues).map(([name, label]) => ({
				type: 'textInput',
				label,
				placeholder: label,
				parentId: id,
				pageId,
			})),
		);
		createdBlocks.map(({ id: childId }) => addChild(id, childId));
		close();
	}, [addBlocks, addChild, close, id, inputValues, pageId]);

	return (
		<Dialog
			isOpen={isOpen}
			onClose={close}
			title="test"
			style={{ width: 750, backgroundColor: 'white', paddingBottom: 8 }}
		>
			<div
				style={{
					backgroundColor: 'white',
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					height: 50,
					borderBottom: '1px solid rgba(17, 20, 24, 15%)',
				}}
			>
				<FormGroup style={{ marginLeft: 20, marginBottom: 0 }} label="Resource" inline>
					<HTMLSelect
						value={resourceId}
						options={schemas.map((schema) => ({ value: schema.resource._id, label: schema.resource.name }))}
						onChange={(e) => {
							setResourceId(e.target.value);
							setTableName('');
						}}
					/>
				</FormGroup>
				<FormGroup style={{ marginLeft: 8, marginBottom: 0 }} label="Table" inline>
					<HTMLSelect
						value={tableName}
						options={Object.entries((currentResource?.schema || {}) as any).map(([table]) => ({
							value: table,
							label: table,
						}))}
						onChange={(e) => setTableName(e.target.value)}
					/>
				</FormGroup>
			</div>
			<div style={{ maxHeight: 300, overflowY: 'auto' }}>
				<StyledHTMLTable style={{ backgroundColor: 'white', width: '100%' }} striped>
					<thead style={{ position: 'sticky', top: 0, zIndex: 3, backgroundColor: 'white' }}>
						<tr>
							<th>Column name</th>
							<th>Column type</th>
							<th>Label</th>
							<th>Input type</th>
						</tr>
					</thead>
					<tbody>
						{Object.entries(currentTables).map(([name, v]) => (
							<tr key={name}>
								<td>{name}</td>
								<td>{(v as any).data_type}</td>
								<td>
									<InputGroup
										value={inputValues[name]}
										onChange={(e) =>
											immer((draft) => {
												draft[name] = e.target.value;
											})
										}
									/>
								</td>
								<td>Text input</td>
							</tr>
						))}
					</tbody>
				</StyledHTMLTable>
			</div>
			<div
				style={{
					borderTop: '1px solid rgba(17, 20, 24, 15%)',
					backgroundColor: 'white',
					display: 'flex',
					justifyContent: 'flex-end',
					paddingTop: 8,
					paddingRight: 8,
				}}
			>
				<Button onClick={createForm} intent="primary">
					Create form
				</Button>
			</div>
		</Dialog>
	);
}
