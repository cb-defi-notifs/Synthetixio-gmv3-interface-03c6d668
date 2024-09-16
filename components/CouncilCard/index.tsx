import { Button } from '@synthetixio/ui';
import { DeployedModules } from 'containers/Modules';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { EpochPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { parseCouncil } from 'utils/parse';
import useCouncilCardQueries from 'hooks/useCouncilCardQueries';

interface CouncilCardProps {
	council: string;
	image: string;
	deployedModule: DeployedModules;
}

export const CouncilCard: React.FC<CouncilCardProps> = ({ council, deployedModule, image }) => {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { councilMembers, currentPeriodData } = useCouncilCardQueries(deployedModule);
	const membersCount = councilMembers?.length;
	const period = currentPeriodData?.currentPeriod;

	const councilInfo = period ? parseCouncil(EpochPeriods[period]) : null;

	if (!councilInfo)
		return (
			<div
				className="min-w-[90vw] xs:min-w-fit p-0.5 bg-purple xs:w-[248px] w-full max-w-full h-[347px] rounded"
				data-testid="loading-state"
			>
				<div className="h-full darker-60 animate-pulse"></div>
			</div>
		);

	const { cta, button, variant, color, headlineLeft, headlineRight, secondButton } = councilInfo;

	return (
		<div className="p-0.5 bg-purple rounded w-full xs:w-auto">
			<div className="h-full p-4 rounded gap-1 flex flex-col justify-around align-center darker-60">
				<Image alt={council} src={image} width={50} height={70} />
				<h4 className="tg-title-h4 text-center mt-2" data-testid={`council-headline-${council}`}>
					{t(`landing-page.cards.${council}`)}
				</h4>
				<span
					className={`${color} p-2 rounded-full tg-caption-bold text-center my-2 w-fit self-center`}
					data-testid="cta-text"
				>
					CLOSED - COUNCIL ELECTED
				</span>
				<span className="ui-gradient-purple h-[1px] w-full mb-1"></span>
				<div className="flex justify-between">
					<span className="tg-caption text-gray-500" data-testid="headline-left">
						{t(headlineLeft)}
					</span>
				</div>
				<div className="flex justify-between">
					<h4 className="text-2xl council-card-numbers gt-america-condensed-bold-font">
						{membersCount}
					</h4>
					<h4 className="text-2xl council-card-numbers gt-america-condensed-bold-font"></h4>
				</div>
				{secondButton && (
					<span
						className="tg-caption cursor-pointer bg-clip-text text-transparent ui-gradient-primary"
						onClick={() => push(`/councils/${council}`)}
					>
						{t(secondButton)}
					</span>
				)}
				<Button
					variant={variant}
					className="w-full mt-4"
					size="lg"
					data-testid="card-button"
					disabled={true}
				>
					{t(button)}
				</Button>
			</div>
		</div>
	);
};
