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
				<body>
					<div
						className="bg-orange"
						style={{
							color: 'black',
							fontWeight: 700,
							textAlign: 'center',
							fontSize: '20px',
						}}
					>
						!!! Synthetix is in the process of migrating to V3 Governance on Synthetix Chain. This
						webpage will soon be redirected to a new governance UI !!!
					</div>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
