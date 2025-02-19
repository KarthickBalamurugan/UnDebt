"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/"; // Redirect back after login

  const handleSignIn = async () => {
    await signIn("google", { callbackUrl });
  };

  return (
    <div>
      <p>Not signed in</p>
      <button onClick={handleSignIn}>Sign in with Google</button>
    </div>
  );
}
