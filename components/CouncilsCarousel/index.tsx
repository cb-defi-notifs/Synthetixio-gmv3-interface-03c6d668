import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CouncilCarousel } from './CouncilCarousel';
import { Icon, IconButton, Tabs } from '@synthetixio/ui';
import { TabIcon } from 'components/TabIcon';
import useCouncilMembersQuery from 'queries/members/useCouncilMembersQuery';
import { DeployedModules } from 'containers/Modules';
import { COUNCILS_DICTIONARY } from 'constants/config';
import useIsMobile from 'hooks/useIsMobile';
import clsx from 'clsx';

export default function CouncilsCarousel({ withoutAllMembers }: { withoutAllMembers?: boolean }) {
	const { t } = useTranslation();
	const [listView, setListView] = useState(false);
	const [activeTab, setActiveTab] = useState('spartan');

	const isMobile = useIsMobile();
	const { data: spartan } = useCouncilMembersQuery(DeployedModules.SPARTAN_COUNCIL);
	const { data: ambassador } = useCouncilMembersQuery(DeployedModules.AMBASSADOR_COUNCIL);
	const { data: treasury } = useCouncilMembersQuery(DeployedModules.TREASURY_COUNCIL);

	if (!spartan && !ambassador && !treasury) {
		return null;
	}
	if (spartan && ambassador && treasury) {
		const allMembers = withoutAllMembers
			? [spartan, ambassador, treasury]
			: [spartan.concat(ambassador, treasury), spartan, ambassador, treasury];

		const getTabItems = () => {
			return withoutAllMembers
				? COUNCILS_DICTIONARY.map((council, index) => ({
						id: council.slug,
						label: (
							<div className="flex items-center gap-1">
								{t(`landing-page.tabs.${council.abbreviation}`)}
								<TabIcon isActive={activeTab === council.slug}>{allMembers[index].length}</TabIcon>
							</div>
						),
						content: (
							<CouncilCarousel
								council={council.label}
								listView={listView}
								members={allMembers[index] || []}
							/>
						),
					}))
				: [
						{
							id: 'all-members',
							label: (
								<div className="flex items-center gap-1">
									{t('landing-page.tabs.all')}
									<TabIcon isActive={activeTab === 'all-members'}>{allMembers[0].length}</TabIcon>
								</div>
							),
							content: <CouncilCarousel listView={listView} members={allMembers[0] || []} />,
						},
						...COUNCILS_DICTIONARY.map((council, index) => ({
							id: council.slug,
							label: (
								<div className="flex items-center gap-1">
									{t(`landing-page.tabs.${council.abbreviation}`)}
									<TabIcon isActive={activeTab === council.slug}>
										{allMembers[index + 1].length}
									</TabIcon>
								</div>
							),
							content: (
								<CouncilCarousel
									council={council.label}
									listView={listView}
									members={allMembers[index + 1] || []}
								/>
							),
						})),
					];
		};

		return (
			<div
				className={clsx('relative mt-4 flex flex-col', {
					container: !isMobile,
				})}
			>
				<Tabs
					className="hide-scrollbar mb-4 justify-start lg:mx-auto"
					contentClassName="xs:max-w-[90vw] w-full mx-auto"
					initial={activeTab}
					items={getTabItems()}
					onChange={(id) => setActiveTab(String(id))}
				/>

				<div className="absolute right-0 hidden lg:flex">
					<IconButton isActive={listView} onClick={() => setListView(true)} size="sm">
						<Icon name="List" className="text-primary" />
					</IconButton>
					<IconButton
						className="ml-1.5"
						isActive={!listView}
						onClick={() => setListView(false)}
						size="sm"
					>
						<Icon name="Grid" className="text-primary" />
					</IconButton>
				</div>
			</div>
		);
	}
	return null;
}
