import { MenuItem, Button, FormGroup } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import React, { useMemo } from 'react';
import { Database, DatabaseAction, useResources } from '../../../resources/hooks/useResources';
import { BasicItemProps, InspectorItemProps } from '../InspectorItem';

export type QueryActionMenuItemProps = BasicItemProps & {
	type: 'queryAction';
	databaseId?: string;
	value: string;
	onChange: (v: string) => void;
};

const QueryActionSelect = Select.ofType<DatabaseAction>();

export function QueryActionMenuItem({
	item,
	Wrapper = MenuItem,
	inline,
}: InspectorItemProps<QueryActionMenuItemProps>) {
	const { data } = useResources();

	const { databaseId, value, onChange, label, icon } = item;

	const selectedDatabase = useMemo(() => data.find((d) => d._id === databaseId) || { actions: [] }, [data, databaseId]);

	const selectedAction = useMemo(
		() => selectedDatabase.actions?.find((action) => action.name === value),
		[selectedDatabase.actions, value],
	);

	return (
		<Wrapper
			shouldDismissPopover={false}
			icon={icon}
			text={
				<FormGroup label={label} inline={inline}>
					<QueryActionSelect
						disabled={!databaseId}
						items={selectedDatabase.actions}
						itemPredicate={(query, action) => action.name.toLowerCase().includes(query.toLowerCase())}
						noResults={<MenuItem disabled text="No results." />}
						itemRenderer={(database, { handleClick }) => <MenuItem onClick={handleClick} text={database.name} />}
						onItemSelect={(a) => onChange(a.name)}
					>
						<Button
							disabled={!databaseId}
							fill
							text={selectedAction?.name || (databaseId ? 'Select action' : 'Select database')}
							rightIcon="double-caret-vertical"
						/>
					</QueryActionSelect>
				</FormGroup>
			}
		/>
	);
}
