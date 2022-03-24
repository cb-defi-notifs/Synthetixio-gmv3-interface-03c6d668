import styled from 'styled-components';
import { theme } from '@synthetixio/ui/dist/esm/styles';

interface SpotlightButtonProps {
	text: string;
	active: boolean;
	onClick: () => void;
}

export default function SpotlightButton({ text, active, onClick, ...rest }: SpotlightButtonProps) {
	return (
		<StyledSpotlightButton onClick={onClick} {...rest}>
			<StyledText active={active}>{text}</StyledText>
			{active && <StyledSpotlight />}
		</StyledSpotlightButton>
	);
}

const StyledSpotlightButton = styled.button`
	position: relative;
	height: 32px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;
`;

const StyledText = styled.span<{ active: SpotlightButtonProps['active'] }>`
	font-family: 'GT America';
	font-style: normal;
	font-weight: 400;
	font-size: 1.16rem;
	margin-bottom: ${theme.spacings.margin.tiny};
	color: ${({ active }) => (active ? 'white' : theme.colors.grey)};
`;

const StyledSpotlight = styled.div`
	position: absolute;
	bottom: 0px;
	width: 100%;
	border-radius: 2px;
	height: 2px;
	background-color: ${theme.colors.lightBlue.primary};
	transition: background-color 200ms ease-in;
`;
