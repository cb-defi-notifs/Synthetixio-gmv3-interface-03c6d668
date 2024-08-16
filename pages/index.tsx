import { useColorMode } from '@chakra-ui/react';
import Main from 'components/Main';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';

const Home: NextPage = () => {
	const { colorMode, toggleColorMode } = useColorMode();

	useEffect(() => {
		if (colorMode === 'light') {
			toggleColorMode();
		}
	}, [colorMode, toggleColorMode]);

	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>

			<img
				src="/bg.svg"
				style={{
					position: 'absolute',
					background: 'black',
					width: '100vw',
					height: '100vh',
					objectFit: 'cover',
					zIndex: -1,
				}}
			/>
			<div
				style={{
					color: 'white',
					fontWeight: 700,
					textAlign: 'center',
					fontSize: '20px',
					width: '100vw',
					paddingTop: '50vh',
				}}
			>
				🚧!!! Synthetix is in the process of migrating to V3 Governance on Synthetix Chain. This
				webpage will soon be redirected to a new governance UI !!!🚧
			</div>
		</>
	);
};

export default Home;
