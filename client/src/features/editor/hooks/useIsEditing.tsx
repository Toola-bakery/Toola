import { useHotkeys } from '@blueprintjs/core';
import { useCallback, useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { useImmerState } from '../../../redux/hooks';
import { Roles } from '../../usersAndProjects/hooks/useMembers';
import { useProjects } from '../../usersAndProjects/hooks/useProjects';

export function useCanEdit() {
	const { currentRole } = useProjects();
	return currentRole && currentRole >= Roles.editor;
}

export function useIsEditing() {
	const [{ state: editing = true } = {}, immer] = useImmerState<{ state?: boolean }>('editingState');
	const canEdit = useCanEdit();
	const setEditing = useCallback(
		(newEditing) => {
			immer((draft) => {
				draft.state = newEditing;
			});
		},
		[immer],
	);

	useHotkeys(
		useMemo(
			() => [
				{
					combo: 'cmd+e',
					global: true,
					label: 'Toggle editing mode',
					onKeyDown: () => setEditing(!editing),
				},
			],
			[editing, setEditing],
		),
	);

	return { editing: isMobile || !canEdit ? false : editing, setEditing };
}
