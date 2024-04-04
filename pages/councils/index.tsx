import type { NextPage } from 'next';
import Head from 'next/head';
import Main from 'components/Main';
import { useTranslation } from 'react-i18next';
import BackButton from 'components/BackButton';
import { Tabs } from '@synthetixio/ui';
import { useRouter } from 'next/router';
import { COUNCILS_DICTIONARY } from 'constants/config';
import { parseQuery } from 'utils/parse';
import MemberCard from 'components/MemberCard/Index';
import { Loader } from 'components/Loader/Loader';
import { TabIcon } from 'components/TabIcon';
import { useState } from 'react';
import { PassedVotingResults } from 'components/Vote/PassedVotingResult';
import useCouncilMembersQuery from 'queries/members/useCouncilMembersQuery';
import { DeployedModules } from 'containers/Modules';

const Councils: NextPage = () => {
	const { query } = useRouter();
	const [activeCouncil, setActiveCouncil] = useState(parseQuery(query?.council?.toString()).name);
	const { t } = useTranslation();
	const { data: spartan } = useCouncilMembersQuery(DeployedModules.SPARTAN_COUNCIL);
	const { data: ambassador } = useCouncilMembersQuery(DeployedModules.AMBASSADOR_COUNCIL);
	const { data: treasury } = useCouncilMembersQuery(DeployedModules.TREASURY_COUNCIL);

	const allMembers = [spartan, ambassador, treasury];

	const moduleInstance = COUNCILS_DICTIONARY.find((item) => item.slug === activeCouncil)?.module;
	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<Main>
				<div className="container flex flex-col p-3">
					<div className="relative w-full">
						<BackButton />
						<h1 className="tg-title-h1 ml-auto p-12 text-center">{t('councils.headline')}</h1>
					</div>
					<Tabs
						initial={activeCouncil}
						className="no-scrollbar mb-2 justify-start lg:mx-auto"
						tabClassName="min-w-fit"
						items={COUNCILS_DICTIONARY.map((council, index) => ({
							id: council.slug,
							label: (
								<div className="flex items-center gap-1">
									{t(`councils.tabs.${council.abbreviation}`)}
									<TabIcon isActive={activeCouncil === council.slug}>
										{allMembers[index]?.length}
									</TabIcon>
								</div>
							),
							content: !allMembers.length ? (
								<Loader className="mx-auto mt-8 w-fit" />
							) : (
								<>
									<div className="mx-auto mt-4 mb-3 max-w-3xl p-6">
										<span className="tg-content block text-center">
											{t(`councils.tabs.explanations.${council.abbreviation}.subline`)}
										</span>
										<div className="mt-4 flex flex-wrap justify-center md:flex-nowrap">
											<div className="mx-8 my-2 flex w-full items-center justify-center rounded border border-gray-500 p-2">
												<span className="tg-caption">
													{t(`councils.tabs.explanations.${council.abbreviation}.election`)}
												</span>
												&nbsp;
												<span className="tg-caption-bold">
													{t(`councils.tabs.explanations.${council.abbreviation}.members`, {
														count: allMembers[index]?.length,
													})}
												</span>
											</div>
											<div className="mx-8 my-2 flex w-full items-center justify-center rounded border border-gray-500 p-2">
												<span className="tg-caption">
													{t(`councils.tabs.explanations.${council.abbreviation}.stipends`)}
												</span>
												&nbsp;
												<span className="tg-caption-bold">
													{t(`councils.tabs.explanations.${council.abbreviation}.amount`, {
														amount: '2000',
													})}
												</span>
											</div>
										</div>
									</div>
									<div className="flex w-full flex-wrap justify-center">
										{allMembers.length &&
											allMembers[index]?.map((walletAddress) => (
												<MemberCard
													className="m-2"
													key={walletAddress}
													walletAddress={walletAddress}
													state="ADMINISTRATION"
													council={activeCouncil}
												/>
											))}
									</div>
								</>
							),
						}))}
						onChange={(id) => setActiveCouncil(id as any)}
					/>
					{moduleInstance && <PassedVotingResults moduleInstance={moduleInstance} />}
				</div>
			</Main>
		</>
	);
};

export default Councils;
