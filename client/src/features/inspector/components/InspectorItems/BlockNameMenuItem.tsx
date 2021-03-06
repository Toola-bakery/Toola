import { InputGroup } from '@blueprintjs/core';
import React, { useEffect, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import styled from 'styled-components';
import { usePrevious } from '../../../../hooks/usePrevious';
import { useRefLatest } from '../../../../hooks/useRefLatest';
import { BasicItemProps, InspectorItemProps } from '../InspectorItem';

export type BlockNameMenuItemProps = BasicItemProps & {
	type: 'blockName';
	onChange: (v: string) => void;
};

const StyledBlockNameEditor = styled.div`
	.bp4-input {
		font-size: 14px;
		font-weight: 600;
		padding: 0 8px;
		height: 28px;
	}
	.bp4-heading {
		cursor: pointer;
		height: 18px;
	}
`;

export function BlockNameMenuItem({ item }: InspectorItemProps<BlockNameMenuItemProps>) {
	const [isInput, setIsInput] = useState<string | false>(false);
	const { width, ref } = useResizeDetector();
	const isInputRef = useRefLatest(isInput);
	const onChangeRef = useRefLatest(item.onChange);

	useEffect(() => {
		return () => {
			if (isInputRef.current && item.label !== isInputRef.current)
				// eslint-disable-next-line react-hooks/exhaustive-deps
				onChangeRef.current(isInputRef.current);
		};
	}, [isInputRef, onChangeRef, item.label]);

	return (
		<StyledBlockNameEditor ref={ref}>
			{isInput ? (
				<div style={{ width }}>
					<InputGroup
						autoFocus
						placeholder={item.label}
						onChange={(event) => setIsInput(event.target.value)}
						value={isInput}
					/>
				</div>
			) : (
				<li className="bp4-menu-header">
					<h6 onClick={() => setIsInput(item.label)} className="bp4-heading">
						{item.label}
					</h6>
				</li>
			)}
		</StyledBlockNameEditor>
	);
}
