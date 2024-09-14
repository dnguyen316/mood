import Link from "next/link";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { clientConfig, serverConfig } from "../firebase.config";

export default async function Home() {
  const tokens = await getTokens(cookies(), {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });

  console.log(tokens);

  if (!tokens) {
    notFound();
  }

  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center text-white">
      <div className="w-full max-w-[600px] mx-auto">
        <h1 className="text-6xl">the best Journal app, period.</h1>
        <p className="text-2xl text-white/60">
          This is the best app for tracking your mood through out your life.
        </p>
        <div>
          <Link href="/sign-in">
            <button className="bg-blue-600 p-4 rounded-lg text-xl">
              get started
            </button>
          </Link>
        </div>
        <p>
          Only <strong>{tokens?.decodedToken.email}</strong> holds the magic key
          to this kingdom!
        </p>
      </div>
    </div>
  );
}
