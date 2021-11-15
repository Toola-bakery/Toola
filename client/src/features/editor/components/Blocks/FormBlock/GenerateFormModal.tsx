import { Button, Dialog, FormGroup, HTMLSelect, HTMLTable, InputGroup } from '@blueprintjs/core';
import React, { useCallback, useState } from 'react';
import { noCase } from 'change-case';
import styled from 'styled-components';
import { useResourceSchema } from '../../../../resources/hooks/useResourceSchema';

function upperCaseFirst(input: string) {
	return input.charAt(0).toUpperCase() + input.substr(1);
}

function styleLabel(input: string) {
	return upperCaseFirst(noCase(input));
}

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
	const schemas = useResourceSchema();
	const [resourceId, setResourceId] = useState<string>();
	const [tableName, setTableName] = useState<string>();
	const currentResource = schemas.find((schema) => schema.resource._id === resourceId);
	const currentTables = (tableName && currentResource && (currentResource?.schema as any)[tableName]) || {};

	const createForm = useCallback(() => {}, []);

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
						onChange={(e) => setResourceId(e.target.value)}
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
							<tr>
								<td>{name}</td>
								<td>{(v as any).data_type}</td>
								<td>
									<InputGroup value={styleLabel(name)} />
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
				<Button onClick={() => {}} intent="primary">
					Create form
				</Button>
			</div>
		</Dialog>
	);
}
