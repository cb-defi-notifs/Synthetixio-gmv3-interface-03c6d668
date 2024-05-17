import useUserDetailsQuery from 'queries/boardroom/useUserDetailsQuery';
import Avatar from 'components/Avatar';
import { truncateAddress } from 'utils/truncate-address';
import { ExternalLink } from '@synthetixio/ui';
import { UserSocials } from 'components/MemberCard/UserSocials';
import clsx from 'clsx';
import { DeployedModules } from 'containers/Modules';
import Link from 'next/link';

interface UserDetailsProps {
	walletAddress: string;
	moduleInstance?: DeployedModules;
	isActive?: boolean;
}

export const UserDetails: React.FC<UserDetailsProps> = ({
	walletAddress,
	isActive,
	moduleInstance,
}) => {
	const userDetailsQuery = useUserDetailsQuery(walletAddress);

	if (!userDetailsQuery.data) return <div className="h-6 w-32 animate-pulse rounded bg-gray-600" />;

	const member = userDetailsQuery.data;

	return (
		<div
			className={clsx('flex h-full items-center p-2', {
				'border-l': isActive,
				'border-l-primary': isActive && moduleInstance === DeployedModules.SPARTAN_COUNCIL,
				'border-l-orange': isActive && moduleInstance === DeployedModules.AMBASSADOR_COUNCIL,
				'border-l-yellow': isActive && moduleInstance === DeployedModules.TREASURY_COUNCIL,
			})}
		>
			<Link
				href={'profile/' + member.address}
				passHref
				className="tg-title-h5 ml-2 flex items-center capitalize hover:underline"
			>
				<Avatar className="h-6 w-6" scale={3} walletAddress={member.address} />
				<span className="ml-2">{member.username || truncateAddress(member.address)}</span>
			</Link>
		</div>
	);
};

export const UserActions: React.FC<Pick<UserDetailsProps, 'walletAddress'>> = ({
	walletAddress,
}) => {
	const userDetailsQuery = useUserDetailsQuery(walletAddress);

	if (!userDetailsQuery.data) return <div className="h-6 w-32 animate-pulse rounded bg-gray-600" />;

	const member = userDetailsQuery.data;

	return (
		<div className="flex items-center gap-1">
			<UserSocials
				discord={member.discord}
				twitter={member.twitter}
				github={member.github}
				small
				fill="var(--color-blue-light-2)"
			/>
			<ExternalLink text="View" link={`https://optimistic.etherscan.io/address/${walletAddress}`} />
		</div>
	);
};
