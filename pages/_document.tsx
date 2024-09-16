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
				</Head>
				<body style={{ margin: 0 }}>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
