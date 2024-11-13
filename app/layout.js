// app/layout.js
import './globals.css';
import Providers from './components/Providers';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Car Marketplace',
  description: 'Find and bid on premium cars',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 font-sans text-gray-900">
        <Providers>
          <Navbar />
          <main className="container mx-auto p-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
