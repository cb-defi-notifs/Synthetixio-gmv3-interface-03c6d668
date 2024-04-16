import { Tabs } from '@synthetixio/ui';
import { DeployedModules } from 'containers/Modules';
import { t } from 'i18next';
import { VotingResult } from './VotingResult';

export function PreEvaluationSection() {
	return (
		<div className="container flex flex-col items-center pt-10">
			<h1 className="md:tg-title-h1 tg-title-h3 text-white">{t('vote.pre-eval.headline')}</h1>
			<span className="tg-body p-4 text-center text-gray-500">
				{t('vote.pre-eval.voting-results-live')}
			</span>
			<Tabs
				initial="spartan"
				className="no-scrollbar w-full overflow-x-auto xs:w-auto"
				contentClassName="container"
				items={[
					{
						id: 'spartan',
						label: t('vote.pre-eval.tabs.sc'),
						content: <VotingResult moduleInstance={DeployedModules.SPARTAN_COUNCIL} />,
					},
					{
						id: 'ambassador',
						label: t('vote.pre-eval.tabs.ac'),
						content: <VotingResult moduleInstance={DeployedModules.AMBASSADOR_COUNCIL} />,
					},
					{
						id: 'treasury',
						label: t('vote.pre-eval.tabs.tc'),
						content: <VotingResult moduleInstance={DeployedModules.TREASURY_COUNCIL} />,
					},
				]}
			/>
		</div>
	);
}
