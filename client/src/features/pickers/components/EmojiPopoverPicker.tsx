import { Button } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { EmojiData, Picker, PickerProps } from 'emoji-mart';
import { PropsWithChildren, useState } from 'react';
import styled from 'styled-components';

const StyledPicker = styled.div`
	border: 1px solid #d9d9d9;
	border-radius: 5px;
	background: #fff;
	.emoji-mart {
		border: none;
	}
	.emoji-mart-bar {
		display: none;
	}

	.emoji-mart-search {
		margin-top: 0;
	}
`;

export function EmojiPopoverPicker({
	pickerProps,
	children,
	onSelect,
}: PropsWithChildren<{ pickerProps: PickerProps; onSelect: (emoji: EmojiData | undefined) => void }>) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Popover2
			isOpen={isOpen}
			onInteraction={(nextOpenState) => setIsOpen(nextOpenState)}
			content={
				<StyledPicker>
					<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', padding: 6 }}>
						<Button
							minimal
							text="Remove"
							onClick={() => {
								setIsOpen(false);
								onSelect?.(undefined);
							}}
						/>
					</div>
					<Picker
						{...pickerProps}
						onSelect={(emoji) => {
							setIsOpen(false);
							onSelect?.(emoji);
						}}
					/>
				</StyledPicker>
			}
		>
			{children}
		</Popover2>
	);
}
