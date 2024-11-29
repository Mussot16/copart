"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="p-4 bg-blue-600 text-white flex justify-between items-center">
      <div className="flex gap-6">
        <Link href="/" className="py-2 px-4 rounded hover:bg-blue-700">
          Home
        </Link>
        {session && (
          <Link href="/profile" className="py-2 px-4 rounded hover:bg-blue-700">
            Profile
          </Link>
        )}
      </div>

      <div className="flex gap-6">
        <Link href="/cart" className="py-2 px-4 rounded hover:bg-blue-700">
          Cart
        </Link>
        {!session ? (
          <>
            <Link href="/register" className="py-2 px-4 rounded hover:bg-blue-700">
              Register
            </Link>
            <Link href="/login" className="py-2 px-4 rounded hover:bg-blue-700">
              Login
            </Link>
          </>
        ) : (
          <button
            onClick={() => signOut()}
            className="py-2 px-4 rounded bg-red-600 hover:bg-red-700"
          >
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
}
