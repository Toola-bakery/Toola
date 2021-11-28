import { InputGroup, TextArea } from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';
import { useBlock } from '../../../editor/hooks/useBlock';
import { useBlockContext } from '../../../editor/hooks/useBlockContext';
import { useDeclareBlockMethods } from '../../../editor/hooks/useDeclareBlockMethods';
import { InputLabel } from '../../components/InputLabel';
import { useValuePlaceholderInitialController } from './hooks/useValuePlaceholderInitialController';

export type InputBlockType = InputBlockProps & InputBlockState & InputBlockMethods;
export type InputBlockProps = {
	type: 'input';
	initialValue: string;
	label: string;
};

export type InputBlockState = {
	value?: string;
};

export type InputBlockMethods = { setValue: (value: string) => void };

export function TextAreaBlock({ hide }: { hide: boolean }) {
	const { show } = useBlock();
	const { value, setValue, placeholder } = useValuePlaceholderInitialController();
	useDeclareBlockMethods<InputBlockMethods>({ setValue: (newValue: string) => setValue(newValue) }, [setValue]);

	const { showInspector } = useBlockContext();

	if (hide || !show) return <></>;

	// TODO "helperText" Helper text with details...
	return (
		<div onContextMenu={showInspector}>
			<InputLabel>
				<TextArea
					fill
					value={value}
					autoComplete="off"
					placeholder={placeholder}
					onChange={(e) => {
						setValue(e.target.value);
					}}
				/>
			</InputLabel>
		</div>
	);
}
