import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { decode } from 'html-entities';
import { useCallback } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { useEditor } from '../hooks/useEditor';
import { usePageContext } from '../hooks/useReferences';

export function PageBar() {
	const {
		page: { id, editing, title },
	} = usePageContext();
	const { updateBlockState, updateBlockProps } = useEditor();
	const onChangeHandler = useCallback(
		(e: ContentEditableEvent) => {
			updateBlockProps({ id, title: decode(e.currentTarget.textContent) });
		},
		[id, updateBlockProps],
	);
	return (
		<>
			<AppBar elevation={0} color="default" position="fixed" sx={{ marginLeft: 240, width: 'calc(100% - 240px)' }}>
				<Toolbar>
					{/*<IconButton edge="start" color="inherit" aria-label="menu">*/}
					{/*	<MenuIcon />*/}
					{/*</IconButton>*/}
					<div style={{ flexGrow: 1 }}>
						<Typography variant="h6">
							<ContentEditable
								disabled={!editing}
								html={title}
								tagName="span"
								style={{ margin: 0, marginBottom: 10 }}
								onChange={onChangeHandler}
							/>
						</Typography>
					</div>
					<FormControlLabel
						control={
							<Switch size="small" checked={editing} onChange={() => updateBlockState({ id, editing: !editing })} />
						}
						label="Editing"
					/>
				</Toolbar>
			</AppBar>
			<Toolbar />
		</>
	);
}
