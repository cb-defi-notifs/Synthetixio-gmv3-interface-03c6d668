import { GetUserDetails } from 'queries/boardroom/useUserDetailsQuery';
import { useTranslation } from 'react-i18next';
import { Button } from '@synthetixio/ui';
import { EpochPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import { DeployedModules } from 'containers/Modules';
import clsx from 'clsx';

interface Props {
	state: keyof typeof EpochPeriods;
	deployedModule?: DeployedModules;
	isOwnCard: boolean;
	member: GetUserDetails;
	votedFor?: string;
	walletAddress: string;
	council?: string;
}

export const MemberCardAction: React.FC<Props> = ({ state, isOwnCard }) => {
	const { t } = useTranslation();
	return (
		<>
			<div
				className={clsx('rounded', {
					'bg-dark-blue': isOwnCard,
				})}
			>
				<Button className="w-[130px]" variant="outline" disabled={true}>
					{t('councils.view-member')}
				</Button>
			</div>

			{state === 'NOMINATION' && (
				<div className="flex gap-2 items-center">
					<Button className={clsx({ 'w-[130px]': !isOwnCard })} variant="outline">
						{isOwnCard ? t('councils.edit-nomination') : t('councils.view-nominee')}
					</Button>
				</div>
			)}
		</>
	);
};
