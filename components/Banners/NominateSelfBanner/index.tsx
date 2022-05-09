import { Banner, TimeWrapper } from 'components/Banners';
import NominateModal from 'components/Modals/Nominate';
import RemainingTime from 'components/RemainingTime';
import Modal from 'containers/Modal';
import { DeployedModules } from 'containers/Modules/Modules';
import useCurrentEpochDatesQuery from 'queries/epochs/useCurrentEpochDatesQuery';
import { useTranslation } from 'react-i18next';
import { parseRemainingTime } from 'utils/time';

import { ArrowRightIcon, IconButton } from '@synthetixio/ui';

import { BannerProps } from '../types';

export default function NominateSelfBanner({ hideButton }: BannerProps) {
	const { t } = useTranslation();
	const { data } = useCurrentEpochDatesQuery(DeployedModules.SPARTAN_COUNCIL);
	const remainingTime = data?.epochStartDate && parseRemainingTime(data.epochStartDate);
	const { setContent, setIsOpen } = Modal.useContainer();

	return (
		<Banner gradientColor="orange" justifyContent="center">
			<TimeWrapper alignItems="center" className="darker-60">
				{t('banner.nominate.closes')}
				{remainingTime && <RemainingTime>{remainingTime}</RemainingTime>}
			</TimeWrapper>
			{!hideButton && (
				<IconButton
					onClick={() => {
						setContent(<NominateModal />);
						setIsOpen(true);
					}}
					size="tiny"
					active
					rounded
				>
					{t('banner.nominate.self')}
					<ArrowRightIcon />
				</IconButton>
			)}
		</Banner>
	);
}
