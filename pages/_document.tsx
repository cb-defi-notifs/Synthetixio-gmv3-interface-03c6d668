import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);
		return initialProps;
	}

	render() {
		return (
			<Html className="no-touch dark ui-dark">
				<Head>
					<link rel="manifest" href="/manifest.json" />
					<link rel="prefetch" href="/synthetix.io.txt" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
