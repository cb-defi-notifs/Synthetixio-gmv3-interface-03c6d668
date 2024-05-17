import React from 'react';
import Blockies from 'react-blockies';
import clsx from 'clsx';

type AvatarProps = {
	walletAddress: string;
	scale?: number;
	className?: string;
};

const Avatar: React.FC<AvatarProps> = ({ walletAddress, scale, className }) => {
	return (
		<Blockies seed={walletAddress} scale={scale || 7} className={clsx(className, 'rounded-full')} />
	);
};
export default Avatar;
