import { FormGroup, MenuItem } from '@blueprintjs/core';
import Editor from '@monaco-editor/react';
import React from 'react';
import { BasicItemProps, InspectorItemProps } from '../InspectorItem';
import { CodeInput } from '../CodeInput';

export type PgSQLMenuItemProps = BasicItemProps & {
	type: 'pgSQL';
	value: string;
	codeType?: 'string' | 'object';
	onChange: (v: string) => void;
	multiline?: boolean;
};

//	<CodeInput
// 					multiline={item.multiline}
// 					inline={inline}
// 					label={item.label}
// 					value={item.value}
// 					type={item.codeType}
// 					onChange={item.onChange}
// 				/>

export function PgSQLMenuItem({ item, Wrapper = MenuItem, inline }: InspectorItemProps<PgSQLMenuItemProps>) {
	return (
		<Wrapper
			inline={inline}
			shouldDismissPopover={false}
			icon={item.icon}
			text={
				<FormGroup label={item.label} inline={inline}>
					<Editor
						height="50vh"
						defaultValue={item.value}
						onChange={(v) => typeof v !== 'undefined' && item.onChange(v)}
						language="pgsql"
					/>
				</FormGroup>
			}
		/>
	);
}
