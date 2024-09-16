import { ConnectButton } from 'components/ConnectButton';
import { Button, Checkbox, useTransactionModalContext } from '@synthetixio/ui';
import { COUNCILS_DICTIONARY } from 'constants/config';
import { useConnectorContext } from 'containers/Connector';
import { useModalContext } from 'containers/Modal';
import { DeployedModules } from 'containers/Modules';
import useNominateMutation from 'mutations/nomination/useNominateMutation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { truncateAddress } from 'utils/truncate-address';
import BaseModal from '../BaseModal';
import useIsNominated from 'queries/nomination/useIsNominatedQuery';
import { useCurrentPeriods } from 'queries/epochs/useCurrentPeriodQuery';

export default function NominateModal() {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { setIsOpen } = useModalContext();
	const [activeCheckbox, setActiveCheckbox] = useState('');
	const { ensName, walletAddress, isWalletConnected } = useConnectorContext();
	const { setVisible, setTxHash, setContent, state, visible, setState } =
		useTransactionModalContext();
	const queryClient = useQueryClient();

	const nominateForSpartanCouncil = useNominateMutation(DeployedModules.SPARTAN_COUNCIL);
	const nominateForAmbassadorCouncil = useNominateMutation(DeployedModules.AMBASSADOR_COUNCIL);
	const nominateForTreasuryCouncil = useNominateMutation(DeployedModules.TREASURY_COUNCIL);

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

	const periodsData = useCurrentPeriods();

	const shouldBeDisabled = (council: string) => {
		const periodForCouncil = periodsData.find((periodData) => periodData.data?.council === council);
		if (periodForCouncil) {
			return periodForCouncil.data?.currentPeriod === 'ADMINISTRATION';
		}
		return true;
	};

	useEffect(() => {
		if (state === 'confirmed' && visible) {
			queryClient.invalidateQueries({
				queryKey: ['nominees'],
			});
			queryClient
				.refetchQueries({
					stale: true,
					active: true,
				})
				.then(() => {
					setIsOpen(false);
					setVisible(false);
					push('/councils/'.concat(activeCheckbox));
				});
		}
	}, [state, setIsOpen, push, activeCheckbox, visible, setVisible, queryClient, walletAddress]);

	const setCTA = (council: string) => {
		return (
			<>
				<h6 className="tg-title-h6">{t('modals.nomination.cta', { council })}</h6>
				<h3 className="tg-title-h3">{ensName || truncateAddress(walletAddress!)}</h3>
			</>
		);
	};

	const handleNomination = async () => {
		setState('signing');
		setVisible(true);
		try {
			switch (activeCheckbox) {
				case 'spartan':
					setContent(setCTA('Spartan'));
					const spartanTx = await nominateForSpartanCouncil.mutateAsync();
					setTxHash(spartanTx.hash);
					break;
				case 'ambassador':
					setContent(setCTA('Ambassador'));
					const ambassadorTx = await nominateForAmbassadorCouncil.mutateAsync();
					setTxHash(ambassadorTx.hash);
					break;
				case 'treasury':
					setContent(setCTA('Treasury'));
					const treasuryTx = await nominateForTreasuryCouncil.mutateAsync();
					setTxHash(treasuryTx.hash);
					break;
				default:
					console.info('no matching entity found');
			}
		} catch (error) {
			console.error(error);
			setState('error');
		}
	};

	return (
		<BaseModal headline={t('modals.nomination.headline')}>
			{!isWalletConnected ? (
				<ConnectButton />
			) : (
				<div className="flex max-w-[700px] flex-col items-center px-2">
					<span className="tg-content py-2 text-center text-gray-500">
						{t('modals.nomination.subline')}
					</span>
					<div className="mt-4 flex flex-col items-center rounded bg-black px-12 py-8">
						<h5 className="tg-title-h5 mb-1 text-gray-300">
							{t('modals.nomination.nominationAddress')}
						</h5>
						<h3 className="tg-title-h3 text-white">{ensName || truncateAddress(walletAddress!)}</h3>
					</div>
					<div className="m-10 flex w-full max-w-[190px] flex-col justify-center gap-4 md:max-w-none md:flex-row">
						{COUNCILS_DICTIONARY.map((council) => (
							<Checkbox
								key={`${council.slug}-council-checkbox`}
								id={`${council.slug}-council-checkbox`}
								onChange={() => setActiveCheckbox(council.slug)}
								label={t('modals.nomination.checkboxes.'.concat(council.slug))}
								color="lightBlue"
								checked={activeCheckbox === council.slug}
								disabled={shouldBeDisabled(council.slug) || isAlreadyNominated}
							/>
						))}
					</div>
					<Button
						className="w-[313px]"
						onClick={() => handleNomination()}
						disabled={!activeCheckbox}
					>
						{t('modals.nomination.button')}
					</Button>
				</div>
			)}
		</BaseModal>
	);
}
