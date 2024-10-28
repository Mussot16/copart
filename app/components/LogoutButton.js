// app/components/LogoutButton.js
"use client"; // Ensure this is a Client Component

import { useSession, signOut } from 'next-auth/react';

export default function LogoutButton() {
  const { data: session } = useSession();

  if (!session) {
    return <a href="/login" className="text-blue-400">Sign In</a>;
  }

  return (
    <button
      onClick={() => signOut()}
      className="bg-red-600 text-white py-2 px-4 rounded-lg"
    >
      Sign Out
    </button>
  );
}
