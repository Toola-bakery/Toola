import { Button, Icon } from '@blueprintjs/core';
import { Emoji, EmojiData } from 'emoji-mart';
import { CSSProperties } from 'react';
import * as React from 'react';
import styled from 'styled-components';
import { useTopLevelPages } from '../../../drawer/hooks/useTopLevelPages';
import { usePageContext } from '../../../executor/hooks/useReferences';
import { EmojiPopoverPicker } from '../../../pickers/components/EmojiPopoverPicker';
import { useBlockProperty } from '../../hooks/useBlockProperty';
import { useEditor } from '../../hooks/useEditor';

const boxStyles: CSSProperties = {
	width: 25,
	height: 25,
	padding: 0,
	marginRight: 3,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	textAlign: 'center',
};

const StyledEmoji = styled.div<{ small: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;

	.emoji-mart-emoji {
		width: ${({ small }) => (small ? 20 : 25)}px;
		height: ${({ small }) => (small ? 20 : 25)}px;
		line-height: ${({ small }) => (small ? 20 : 25)}px;
	}
`;

type EmojiIconProps = {
	emoji?: string;
	small?: boolean;
	useDefaultDocument?: boolean;
};
export function EmojiIcon({ emoji, small = false, useDefaultDocument = true }: EmojiIconProps) {
	if (!emoji && !useDefaultDocument) return null;
	return (
		<StyledEmoji small={small} style={{ width: small ? 20 : 25, height: small ? 20 : 25 }}>
			{emoji ? <Emoji size={small ? 18 : 20} emoji={emoji} native /> : <Icon size={small ? 16 : 18} icon="document" />}
		</StyledEmoji>
	);
}

export function EmojiPicker({
	onChange,
	propertyName = 'emoji',
	...rest
}: {
	onChange?: (emoji: EmojiData | undefined) => void;
	propertyName?: string;
} & EmojiIconProps = {}) {
	const { editing } = usePageContext();

	const [emoji, setEmoji] = useBlockProperty<string | undefined>(propertyName);
	const icon = <EmojiIcon {...rest} emoji={emoji} />;

	if (!editing) return <div style={boxStyles}>{icon}</div>;
	return (
		<EmojiPopoverPicker
			pickerProps={{
				showPreview: false,
				showSkinTones: false,
				native: true,
				emojiTooltip: true,
				autoFocus: true,
			}}
			onSelect={(selectedEmoji) => {
				setEmoji(selectedEmoji?.id);
				onChange?.(selectedEmoji);
			}}
		>
			<Button style={boxStyles} icon={icon} minimal small />
		</EmojiPopoverPicker>
	);
}
