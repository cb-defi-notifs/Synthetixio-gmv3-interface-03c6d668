import { useConnectorContext } from 'containers/Connector';
import { DeployedModules } from 'containers/Modules';
import { useTranslation } from 'react-i18next';
import BaseModal from '../BaseModal';
import { truncateAddress } from 'utils/truncate-address';
import useWithdrawNominationMutation from 'mutations/nomination/useWithdrawNominationMutation';
import { useEffect, useState } from 'react';
import { useCurrentPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import useNominateMutation from 'mutations/nomination/useNominateMutation';
import { useRouter } from 'next/router';
import { capitalizeString } from 'utils/capitalize';
import { Button, Checkbox, useTransactionModalContext } from '@synthetixio/ui';
import { useModalContext } from 'containers/Modal';
import { useQueryClient } from 'react-query';
import { ConnectButton } from 'components/ConnectButton';
import { COUNCILS_DICTIONARY } from 'constants/config';

interface EditModalProps {
	council: string;
	deployedModule: DeployedModules;
}

export default function EditNominationModal({ deployedModule, council }: EditModalProps) {
	const { t } = useTranslation();
	const { ensName, walletAddress, isWalletConnected } = useConnectorContext();
	const { push } = useRouter();
	const { setContent, setTxHash, setVisible, state, setState } = useTransactionModalContext();
	const withdrawMutation = useWithdrawNominationMutation(deployedModule);
	const [step, setStep] = useState(1);
	const { setIsOpen } = useModalContext();
	const queryClient = useQueryClient();
	const [activeCheckbox, setActiveCheckbox] = useState('');
	const nominateForSpartanCouncil = useNominateMutation(DeployedModules.SPARTAN_COUNCIL);
	const nominateForAmbassadorCouncil = useNominateMutation(DeployedModules.AMBASSADOR_COUNCIL);
	const nominateForTreasuryCouncil = useNominateMutation(DeployedModules.TREASURY_COUNCIL);
	const periodsData = useCurrentPeriods();

	const shouldBeDisabled = (council: string) => {
		const periodForCouncil = periodsData.find((periodData) => periodData.data?.council === council);
		return periodForCouncil?.data ? periodForCouncil.data?.currentPeriod !== 'NOMINATION' : true;
	};

	useEffect(() => {
		if (state === 'confirmed' && step === 1) {
			setStep(2);
			setVisible(false);
			setState('signing');
			queryClient.invalidateQueries({
				queryKey: ['nominees'],
			});
			queryClient.refetchQueries({ stale: true, active: true });
		}
		if (state === 'confirmed' && step === 2) {
			queryClient.invalidateQueries({
				queryKey: ['nominees'],
			});
			queryClient.refetchQueries({ stale: true, active: true }).then(() => {
				push('/councils/'.concat(activeCheckbox));
				setVisible(false);
				setIsOpen(false);
				setState('signing');
			});
		}
	}, [state, step, setVisible, push, setState, setIsOpen, queryClient, activeCheckbox]);

	useEffect(() => {
		setStep(1);
	}, []);

	const handleBtnClick = async () => {
		if (step === 1) {
			setState('signing');
			setContent(
				<>
					<h6 className="tg-title-h6">
						{t('modals.edit.cta-step-1-head', { council: capitalizeString(council) })}
					</h6>
					<h3 className="tg-title-h3">{ensName ? ensName : truncateAddress(walletAddress!)}</h3>
				</>
			);
			setVisible(true);
			try {
				const tx = await withdrawMutation.mutateAsync();
				setTxHash(tx.hash);
			} catch (error) {
				console.error(error);
				setState('error');
			}
		} else if (step === 2) {
			setState('signing');
			setContent(
				<>
					<h6 className="tg-title-h6">
						{t('modals.edit.cta-step-2-head', { council: capitalizeString(council) })}
					</h6>
					<h3 className="tg-title-h3">{ensName ? ensName : truncateAddress(walletAddress!)}</h3>
				</>
			);
			setVisible(true);
			try {
				switch (activeCheckbox) {
					case 'spartan':
						const spartanTx = await nominateForSpartanCouncil.mutateAsync();
						setTxHash(spartanTx.hash);
						break;
					case 'ambassador':
						const ambassadorTx = await nominateForAmbassadorCouncil.mutateAsync();
						setTxHash(ambassadorTx.hash);
						break;
					case 'treasury':
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
		}
	};
	return (
		<BaseModal headline={t('modals.edit.headline')}>
			<span className="tg-content my-1 mb-4 max-w-[600px] px-2 text-center text-gray-500">
				You can only nominate for 1 council at any given time. In order to change your nomination
				from one council to another you must first select your new council and click save. You will
				be need to sign 2 transactions in order to change.
			</span>
			{!isWalletConnected ? (
				<ConnectButton />
			) : (
				<div className="flex w-full max-w-[850px] flex-col items-center px-2">
					<div className="flex w-full flex-col items-center justify-center bg-black px-4 py-6">
						{step === 1 ? (
							<div className="flex flex-col items-center ">
								<div className="mb-4 flex w-[100px] items-center justify-center">
									<div className="tg-caption flex max-h-[30px] min-h-[28px] min-w-[28px] max-w-[30px] flex-col items-center justify-center rounded-full bg-purple text-white">
										1
									</div>
									<div className="h-[1px] min-w-full bg-purple"></div>
									<div className="tg-caption flex max-h-[30px] min-h-[28px] min-w-[28px] max-w-[30px] flex-col items-center justify-center rounded-full bg-gray-500 text-white">
										2
									</div>
								</div>
								<h5 className="tg-title-h5 text-white">{t('modals.edit.step-one')}</h5>
								<div className="m-4 flex flex-col items-center rounded border border-gray-500 p-4">
									<h5 className="tg-title-h5 mb-1 text-gray-300">{t('modals.edit.current')}</h5>
									<h3 className="tg-title-h3 text-white">
										{ensName ? ensName : walletAddress && truncateAddress(walletAddress)}
									</h3>
								</div>
								<div className="rounded bg-primary p-[2px]">
									<div className="darker-60 rounded py-1 px-6 text-primary">
										{t('modals.edit.council', { council: capitalizeString(council) })}
									</div>
								</div>
							</div>
						) : (
							<>
								<div className="mb-4 flex w-[100px] items-center justify-center">
									<div className="tg-caption flex max-h-[30px] min-h-[28px] min-w-[28px] max-w-[30px] flex-col items-center justify-center rounded-full bg-green text-black">
										1
									</div>
									<div className="h-[1px] min-w-full bg-green"></div>
									<div className="tg-caption flex max-h-[30px] min-h-[28px] min-w-[28px] max-w-[30px] flex-col items-center justify-center rounded-full bg-purple text-white">
										2
									</div>
								</div>
								<h5 className="tg-title-h5 m-2 mb-4 text-white">{t('modals.edit.step-two')}</h5>
								<div className="flex w-full flex-col flex-wrap justify-between gap-4 md:flex-row">
									{COUNCILS_DICTIONARY.map((council) => (
										<Checkbox
											key={`${council.slug}-council-checkbox`}
											id={`${council.slug}-council-checkbox`}
											onChange={() => setActiveCheckbox(council.slug)}
											label={t('modals.nomination.checkboxes.'.concat(council.slug))}
											color="lightBlue"
											checked={activeCheckbox === council.slug}
											disabled={shouldBeDisabled(council.slug)}
										/>
									))}
								</div>
							</>
						)}
					</div>
					<div className="mb-4 w-full border-l-4 border-l-primary bg-primary">
						<h5 className="tg-title-h5 darker-60 flex items-center p-2 text-white">
							<svg
								width="29"
								height="29"
								viewBox="0 0 29 29"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="mr-2"
							>
								<circle cx="14.5" cy="14.5" r="13.4643" stroke="#00D1FF" strokeWidth="2.07143" />
								<path
									d="M10.4194 18.3764H13.3388V13.0404H10.7094V10.8751H16.3161V18.3764H19.3708V20.5417H10.4194V18.3764ZM16.3548 9.61839H12.9521V6.56372H16.3548V9.61839Z"
									fill="#00D1FF"
								/>
							</svg>
							{t('modals.edit.banner')}
						</h5>
					</div>
					<Button
						className="mb-8 w-full"
						onClick={() => handleBtnClick()}
						size="lg"
						disabled={step === 2 && !activeCheckbox}
					>
						{t('modals.edit.button')}
					</Button>
				</div>
			)}
		</BaseModal>
	);
}
