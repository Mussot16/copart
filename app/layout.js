// app/layout.js
import './globals.css';
import Providers from './components/Providers'; // Import the Providers component
import LogoutButton from './components/LogoutButton'; // Import the LogoutButton component

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Wrap the app with Providers */}
        <Providers>
          <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <h1 className="text-2xl">Car Auctions</h1>
            <nav>
              <a href="/cars/add" className="mr-4 text-blue-400 hover:underline">Add Car</a>
              <LogoutButton />
            </nav>
          </header>

          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
