import { Button } from '@synthetixio/ui';
import SNXIcon from 'components/Icons/SNXIcon';
import EditNominationModal from 'components/Modals/EditNomination';
import NominateModal from 'components/Modals/Nominate';
import { DeployedModules } from 'constants/config';
import { useConnectorContext } from 'containers/Connector';
import { useModalContext } from 'containers/Modal';
import { useCurrentPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import useIsNominated from 'queries/nomination/useIsNominatedQuery';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export const NominateInVotingBanner: React.FC = () => {
	const { setIsOpen, setContent } = useModalContext();
	const { t } = useTranslation();
	const periodsData = useCurrentPeriods();
	const { walletAddress } = useConnectorContext();

	const isAlreadyNominatedForSpartan = useIsNominated(
		DeployedModules.SPARTAN_COUNCIL,
		walletAddress || ''
	);
	const isAlreadyNominatedForAmbassador = useIsNominated(
		DeployedModules.AMBASSADOR_COUNCIL,
		walletAddress || ''
	);
	const isAlreadyNominatedForTreasury = useIsNominated(
		DeployedModules.TREASURY_COUNCIL,
		walletAddress || ''
	);
	const isAlreadyNominated =
		isAlreadyNominatedForSpartan.data ||
		isAlreadyNominatedForAmbassador.data ||
		isAlreadyNominatedForTreasury.data;

	if (periodsData.find((periodData) => periodData.data?.currentPeriod !== 'VOTING')) return null;

	return (
		<div className="mx-auto mt-4 w-full rounded bg-orange p-0.5">
			<div className="darker-60 flex h-full w-full flex-col items-center justify-between gap-2 p-5 md:flex-row">
				<div className="flex flex-col items-center gap-2 md:flex-row">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-dark-blue md:mr-4">
						<SNXIcon />
					</div>
					<div className="text-center md:text-left">
						<h3 className="tg-title-h3">{t('landing-page.nominate-banner.title')}</h3>
						<p className="tg-content mt-1">{t('landing-page.nominate-banner.subtitle')}</p>
					</div>
				</div>
				<Button
					onClick={() => {
						if (!walletAddress) {
							toast.warning('Please connect your wallet');
						}
						if (isAlreadyNominated) {
							toast.error('You already nominated yourself');
						}
						if (walletAddress && !isAlreadyNominated) {
							setContent(<NominateModal />);
							setIsOpen(true);
						}
					}}
					variant="outline"
				>
					{t('landing-page.nominate-banner.cta')}
				</Button>
			</div>
		</div>
	);
};
