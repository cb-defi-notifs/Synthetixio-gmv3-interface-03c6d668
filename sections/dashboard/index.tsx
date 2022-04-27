import { Button, Spotlight } from '@synthetixio/ui';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { DeployedModules } from 'containers/Modules/Modules';

import Councils from './Councils';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import Election from './Election';

// @ANDY TESTING SPACE
import Connector from 'containers/Connector';

export default function Dashboard() {
	const { t } = useTranslation();
	const currentPeriodQuery = useCurrentPeriod(DeployedModules.SPARTAN_COUNCIL);

	// @ANDY TESTING SPACE

	const { boardroomSignIn, boardroomSignOut, uuid } = Connector.useContainer();

	///

	return (
		<>
			{currentPeriodQuery.data?.currentPeriod === '1' && (
				<StyledBanner>{t('dashboard.banner.nominate')}</StyledBanner>
			)}
			<Election />
			<Councils />

			<StyledParagraph>--------</StyledParagraph>
			<StyledParagraph>{uuid}</StyledParagraph>
			<StyledParagraph>--------</StyledParagraph>

			<Button onClick={boardroomSignIn} text="sign in" />
			<Button onClick={boardroomSignOut} text="sign out" />
		</>
	);
}

const StyledBanner = styled.div`
	background: ${({ theme }) => theme.colors.gradients.orange};
	width: 100%;
	font-family: 'GT America';
	font-size: 1.14rem;
	font-weight: 700;
	color: ${({ theme }) => theme.colors.black}; ;
`;

// @ANDY TESTING SPACE

const StyledParagraph = styled.div`
	font-size: 32px;
	color: white;
	text-align: center;
	margin: 24px 0px;
`;
//
