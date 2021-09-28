import Head from 'next/head'
import ImageTransform from '../components/ImageTransform'

const IndexPage: React.FC = () => (
  <main>
    <Head>
      <title>Desafio dos Quadros</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <ImageTransform />
  </main>
)

export default IndexPage
