import BackButton from 'components/BackButton';
import { CouncilCard } from 'components/CouncilCard';
import { useRouter } from 'next/router';
import { useCurrentPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import { useTranslation } from 'react-i18next';
import { useConnectorContext } from 'containers/Connector';
import { useEffect, useState } from 'react';
import { useGetCurrentVoteStateQuery } from 'queries/voting/useGetCurrentVoteStateQuery';
import { VoteCard } from './VoteCard';
import { COUNCILS_DICTIONARY, DeployedModules } from 'constants/config';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';

export default function VoteSection() {
	const { t } = useTranslation();
	const { push } = useRouter();
	const periodsData = useCurrentPeriods();
	const isLoading = !!periodsData.find((period) => period.isLoading);

	const { walletAddress } = useConnectorContext();
	const { safe } = useSafeAppsSDK();
	const [activeCouncilInVoting, setActiveCouncilInVoting] = useState<number | null>(null);

	const voteStatusQuery = useGetCurrentVoteStateQuery(
		safe.safeAddress ? safe.safeAddress : walletAddress || ''
	);

	useEffect(() => {
		if (!isLoading) {
			const numberOfCouncilInVoting = periodsData.filter(
				(period) => period.data?.currentPeriod === 'VOTING'
			).length;
			if (numberOfCouncilInVoting === 0) {
				push('/');
			}
			setActiveCouncilInVoting(numberOfCouncilInVoting);
		}
	}, [periodsData, isLoading, push]);

	const count = [
		voteStatusQuery.data?.spartan.voted,
		voteStatusQuery.data?.ambassador.voted,
		voteStatusQuery.data?.treasury.voted,
	].filter((voted) => voted).length;

	const hasVotedAll =
		voteStatusQuery.data?.spartan.voted &&
		voteStatusQuery.data?.ambassador.voted &&
		voteStatusQuery.data?.treasury.voted;

	return (
		<div className="container flex w-full flex-col items-center">
			<div className="relative m-4 mt-8 w-full">
				<BackButton />
				<h1 className="tg-title-h1 text-center">{t('vote.headline')}</h1>
			</div>
			<span className="tg-body pb-8 text-center text-gray-500">{t('vote.subline')}</span>
			{!!activeCouncilInVoting && (
				<div className="flex w-full max-w-[1000px] flex-wrap items-center rounded bg-dark-blue p-4">
					<div className="flex w-fit">
						<div className="ml-2 pb-2">
							<h3 className="md:tg-title-h3 tg-title-h4 pt-4">
								{t(`vote.vote-status-${hasVotedAll ? 'complete' : 'incomplete'}`, {
									progress: count,
									max: activeCouncilInVoting,
								})}
							</h3>
							<span className="tg-body text-gray-500">
								{t(count === 4 ? 'vote.vote-finished' : 'vote.vote-in-progress')}
							</span>
						</div>
					</div>
					<div className="flex w-full flex-wrap justify-between">
						<VoteCard
							walletAddress={voteStatusQuery.data?.spartan.candidateAddress}
							hasVoted={!!voteStatusQuery.data?.spartan.voted}
							periodIsVoting={
								periodsData.find((period) => period.data?.council === 'spartan')?.data
									?.currentPeriod === 'VOTING'
							}
							council={DeployedModules.SPARTAN_COUNCIL}
						/>
						<VoteCard
							walletAddress={voteStatusQuery.data?.ambassador.candidateAddress}
							hasVoted={!!voteStatusQuery.data?.ambassador.voted}
							periodIsVoting={
								periodsData.find((period) => period.data?.council === 'ambassador')?.data
									?.currentPeriod === 'VOTING'
							}
							council={DeployedModules.AMBASSADOR_COUNCIL}
						/>
						<VoteCard
							walletAddress={voteStatusQuery.data?.treasury.candidateAddress}
							hasVoted={!!voteStatusQuery.data?.treasury.voted}
							periodIsVoting={
								periodsData.find((period) => period.data?.council === 'treasury')?.data
									?.currentPeriod === 'VOTING'
							}
							council={DeployedModules.TREASURY_COUNCIL}
						/>
					</div>
				</div>
			)}
			<div className="mt-10 flex w-full flex-wrap justify-center gap-2">
				{COUNCILS_DICTIONARY.map((council) => (
					<CouncilCard
						key={council.slug}
						deployedModule={council.module}
						council={council.slug}
						image={council.image}
					/>
				))}
			</div>
		</div>
	);
}
