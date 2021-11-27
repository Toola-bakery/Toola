import { MenuItem, Button, FormGroup } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import React, { useMemo, useState } from 'react';
import { useCurrent } from '../../../editor/hooks/useCurrent';
import { BasicBlock } from '../../../editor/types/basicBlock';
import { BasicItemProps, InspectorItemProps } from '../InspectorItem';

export type QuerySelectorMenuItemProps = BasicItemProps & {
	type: 'querySelector';
	value?: string;
	onChange: (_id: string) => void;
};

const QuerySelect = Select.ofType<BasicBlock>();

export function QuerySelectorMenuItem({
	item,
	Wrapper = MenuItem,
	inline,
}: InspectorItemProps<QuerySelectorMenuItemProps>) {
	const [query, setQuery] = useState('');
	const { blocks } = useCurrent();

	const queries = useMemo<BasicBlock[]>(
		() => Object.values(blocks).filter((block) => ['code', 'query'].includes(block.type) && block.id.includes(query)),
		[blocks, query],
	);

	return (
		<Wrapper
			shouldDismissPopover={false}
			icon={item.icon}
			text={
				<FormGroup style={{ marginBottom: 0 }} label={item.label} inline={inline}>
					<QuerySelect
						items={queries || []}
						onQueryChange={(newQuery) => setQuery(newQuery)}
						noResults={<MenuItem key="no results" disabled text="No queries." />}
						itemRenderer={(block, { handleClick }) => (
							<MenuItem shouldDismissPopover={false} key={block.id} onClick={handleClick} text={block.id} />
						)}
						popoverProps={{ minimal: true, fill: true, usePortal: false }}
						onItemSelect={(block) => item.onChange(block.id)}
					>
						<Button fill text={item.value || 'Select query'} rightIcon="double-caret-vertical" />
					</QuerySelect>
				</FormGroup>
			}
		/>
	);
}
