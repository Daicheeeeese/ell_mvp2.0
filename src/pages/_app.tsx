import { AuthProvider } from '../contexts/AuthContext';
import { DiscussionProvider } from '../contexts/DiscussionContext';
import Header from '../components/Header';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>BBC English</title>
      </Head>
      <AuthProvider>
        <DiscussionProvider>
          <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <Component {...pageProps} />
            </main>
          </div>
        </DiscussionProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp; 