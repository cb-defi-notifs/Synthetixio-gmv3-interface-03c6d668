import Avatar from 'components/Avatar';
import CouncilsCarousel from 'components/CouncilsCarousel';
import { useRouter } from 'next/router';
import useUserDetailsQuery from 'queries/boardroom/useUserDetailsQuery';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { truncateAddress } from 'utils/truncate-address';
import { ProfileForm } from 'components/Forms/ProfileForm/ProfileForm';
import { Dialog, Button, Dropdown, ExternalLink, Badge, IconButton, Icon } from '@synthetixio/ui';
import useGetMemberCouncilNameQuery from 'queries/members/useGetMemberCouncilName';
import { Loader } from 'components/Loader/Loader';
import { ProfileCard } from './ProfileCard';
import clsx from 'clsx';
import { compareAddress, urlIsCorrect } from 'utils/helpers';
import { useConnectorContext } from 'containers/Connector';
import Image from 'next/image';
import { useModalContext } from 'containers/Modal';
import WithdrawNominationModal from 'components/Modals/WithdrawNomination';
import { useCurrentPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import { COUNCILS_DICTIONARY } from 'constants/config';
import { useIsNominatedCouncils } from 'queries/nomination/useIsNominatedCouncils';

export default function ProfileSection({ walletAddress }: { walletAddress: string }) {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { walletAddress: userAddress } = useConnectorContext();
	const { ensName } = useConnectorContext();
	const { setContent, setIsOpen: setModalOpen } = useModalContext();
	const userDetailsQuery = useUserDetailsQuery(walletAddress);
	const [isOpen, setIsOpen] = useState(false);
	const isOwnCard = compareAddress(walletAddress, userAddress);
	const councilMembersQuery = useGetMemberCouncilNameQuery(walletAddress);
	const periodsData = useCurrentPeriods();

	const { spartan, ambassador, treasury } = useIsNominatedCouncils(walletAddress);
	const councilNomination = [spartan.data, ambassador.data, treasury.data];

	const isNominatedFor = COUNCILS_DICTIONARY.map((council, index) => ({
		nominated: councilNomination && Array.isArray(councilNomination) && councilNomination[index],
		period: periodsData[index].data?.currentPeriod,
		council: council.label,
		module: council.module,
	})).filter((v) => v.nominated && v.period === 'NOMINATION');

	if (userDetailsQuery.isSuccess && userDetailsQuery.data) {
		const { address, username, about, twitter, discord, delegationPitch, github } =
			userDetailsQuery.data;

		const calculatePercentage = () => {
			const submissions = [delegationPitch, twitter, discord];
			if (submissions.every((v) => !v)) return '0%';
			if (submissions.filter((v) => !!v).length === 1) return '33%';
			if (submissions.filter((v) => !!v).length === 2) return '66%';
			return '100%';
		};

		return (
			<div className="align-center flex flex-col pt-12 md:items-center">
				<div
					className={clsx('flex h-full w-full flex-col items-center bg-center bg-no-repeat', {
						'bg-[url(/images/ring-orange.svg)]': isOwnCard,
						'bg-[url(/images/ring.svg)]': !isOwnCard,
					})}
				>
					<Avatar scale={10} walletAddress={walletAddress} />
					{councilMembersQuery.data && (
						<Badge variant="success" className="tg-caption-sm mt-3 max-w-[150px] uppercase">
							{t('profiles.council', { council: councilMembersQuery.data })}
						</Badge>
					)}
					<div className="flex flex-col items-center justify-between p-3">
						<div className="mt-3 flex items-center">
							<h4 className="tg-title-h4 mr-3">
								{username || ensName || truncateAddress(walletAddress)}
							</h4>
							<Dropdown
								triggerElement={
									<IconButton variant="dark-blue">
										<Icon className="text-xl" name="Vertical" />
									</IconButton>
								}
								contentClassName="bg-navy flex flex-col dropdown-border overflow-hidden"
								triggerElementProps={({ isOpen }: any) => ({ isActive: isOpen })}
								contentAlignment="right"
							>
								<>
									{twitter && urlIsCorrect(twitter, 'https://twitter.com') && (
										<ExternalLink
											link={twitter}
											className="rounded-none hover:bg-navy-dark-1"
											text="Twitter"
											withoutIcon
										/>
									)}

									{address && (
										<ExternalLink
											link={`https://optimistic.etherscan.io/address/${address}`}
											className="rounded-none hover:bg-navy-dark-1"
											text="Etherscan"
											withoutIcon
										/>
									)}
								</>
							</Dropdown>
						</div>
						<Dialog
							className="overflow-auto"
							wrapperClass="max-w-[700px]"
							onClose={() => setIsOpen(false)}
							open={isOpen}
						>
							<ProfileForm userProfile={userDetailsQuery.data} />
						</Dialog>
					</div>
					<p className="tg-body max-w-[1000px] py-8 text-center">{about}</p>
				</div>
				<div className="container">
					{isOwnCard && !!isNominatedFor?.length && (
						<div className="w-full p-2">
							<div className="flex w-full flex-col rounded-lg border border-gray-800 bg-dark-blue p-4 md:p-8 md:pb-4">
								<div className="flex flex-col">
									<div className="flex w-full items-center gap-2">
										{calculatePercentage() === '100%' ? (
											<Image src="/images/tick.svg" width={44} height={44} alt="tick" />
										) : (
											<Image
												src="/images/pending.svg"
												width={94}
												height={94}
												alt="pending updates"
											/>
										)}
										<div className="flex flex-col">
											<h4 className="tg-title-h4">
												{t('profiles.completion-card.headline', {
													percentage: calculatePercentage(),
												})}
											</h4>
											<span className="tg-content pt-1 text-gray-500">
												{t('profiles.completion-card.subline')}
											</span>
										</div>
									</div>
									<div className="flex w-full flex-wrap items-center justify-center lg:flex-nowrap">
										<div className="m-2 flex h-[74px] w-full max-w-[210px] items-center gap-2 rounded border border-gray-500 p-2 py-4 md:my-6 md:mr-6">
											<Image src="/images/profile.svg" width={24} height={24} alt="pitch" />
											<h6 className="tg-title-h6 mr-auto">{t('profiles.completion-card.pitch')}</h6>
											{delegationPitch ? (
												<Image src="/images/tick.svg" width={24} height={24} alt="tick" />
											) : (
												<IconButton rounded size="sm" onClick={() => setIsOpen(true)}>
													<Icon name="Plus" className="text-primary" />
												</IconButton>
											)}
										</div>
										<div className="m-2 flex h-[74px] w-full max-w-[210px] items-center gap-2 rounded border border-gray-500 p-2 py-4 md:my-6 md:mr-6">
											<Image src="/images/discord.svg" width={24} height={24} alt="discord" />
											<h6 className="tg-title-h6 mr-auto">
												{t('profiles.completion-card.discord')}
											</h6>
											{discord ? (
												<Image src="/images/tick.svg" width={24} height={24} alt="tick" />
											) : (
												<IconButton rounded size="sm" onClick={() => setIsOpen(true)}>
													<Icon name="Plus" className="text-primary" />
												</IconButton>
											)}
										</div>
										<div className="m-2 flex h-[74px] w-full max-w-[210px] items-center gap-2 rounded border border-gray-500 p-2 py-4 md:my-6 md:mr-6">
											<Image src="/images/twitter.svg" width={24} height={24} alt="twitter" />
											<h6 className="tg-title-h6 mr-auto">
												{t('profiles.completion-card.twitter')}
											</h6>
											{twitter ? (
												<Image src="/images/tick.svg" width={24} height={24} alt="tick" />
											) : (
												<IconButton rounded size="sm" onClick={() => setIsOpen(true)}>
													<Icon name="Plus" className="text-primary" />
												</IconButton>
											)}
										</div>
										<Button
											variant="outline"
											size="md"
											className="m-2 max-w-[180px]"
											onClick={() => {
												if (isNominatedFor?.length) {
													setContent(
														<WithdrawNominationModal
															council={isNominatedFor[0].council}
															deployedModule={isNominatedFor[0].module}
														/>
													);
													setModalOpen(true);
												}
											}}
										>
											{t('profiles.completion-card.withdraw')}
										</Button>
									</div>
								</div>
							</div>
						</div>
					)}
					<div className="mx-auto mb-6 flex w-full max-w-[1000px] flex-col p-2">
						<h4 className="tg-title-h4 text-start my-2">{t('profiles.subheadline')}</h4>
						<div className="relative flex w-full flex-col items-center">
							{isOwnCard && (
								<IconButton
									className="absolute top-5 right-3"
									onClick={() => setIsOpen(true)}
									size="sm"
								>
									<Icon name="Edit" />
								</IconButton>
							)}

							<ProfileCard
								walletAddress={walletAddress}
								discord={discord}
								github={github}
								twitter={twitter}
								pitch={delegationPitch}
								deployedModule={!!isNominatedFor.length ? isNominatedFor[0].module : undefined}
							/>
						</div>
					</div>
					<hr className="my-4 w-full border-gray-700" />
					<CouncilsCarousel />
					<Button className="mx-auto my-8 mt-12" onClick={() => push('/councils')} size="lg">
						{t('profiles.view-all-members')}
					</Button>
				</div>
			</div>
		);
	} else {
		return <Loader fullScreen />;
	}
}
