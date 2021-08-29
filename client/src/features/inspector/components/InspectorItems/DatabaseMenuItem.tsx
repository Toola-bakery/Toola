import { MenuItem, Button, FormGroup } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import React, { useMemo } from 'react';
import { Database, useDatabases } from '../../api/api';
import { BasicItemProps, InspectorItemProps } from '../InspectorItem';

export type DatabaseMenuItemProps = BasicItemProps & {
	type: 'database';
	value: string;
	onChange: (v: string) => void;
};

const DatabaseSelect = Select.ofType<Database>();

export function DatabaseMenuItem({ item, Wrapper = MenuItem, inline }: InspectorItemProps<DatabaseMenuItemProps>) {
	const { data } = useDatabases();
	const selectedDatabase = useMemo(() => data?.find((database) => database._id === item.value), [item.value, data]);

	return (
		<Wrapper
			shouldDismissPopover={false}
			icon={item.icon}
			text={
				<FormGroup label={item.label} inline={inline}>
					<DatabaseSelect
						items={data || []}
						itemPredicate={(query, database) => database.name.toLowerCase().includes(query.toLowerCase())}
						noResults={<MenuItem disabled text="No results." />}
						itemRenderer={(database, { handleClick }) => <MenuItem onClick={handleClick} text={database.name} />}
						onItemSelect={(a) => item.onChange(a._id)}
					>
						<Button fill text={selectedDatabase?.name || 'Выберите базу данных'} rightIcon="double-caret-vertical" />
					</DatabaseSelect>
				</FormGroup>
			}
		/>
	);
}
