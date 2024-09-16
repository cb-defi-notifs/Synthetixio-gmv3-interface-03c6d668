import { AppProps } from 'next/app';
import { FC } from 'react';

const InnerApp: FC<AppProps> = ({ Component, pageProps }) => {
	const TheComponent = Component as any;
	return <TheComponent {...pageProps} />;
};

const App: FC<AppProps> = (props) => {
	return <InnerApp {...props} />;
};

export default App;
