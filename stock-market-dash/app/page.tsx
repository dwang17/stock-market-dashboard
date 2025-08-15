import Image from "next/image";
import Head from "next/head";
import "./css/page.css";
import Dashboard from "./components/Dashboard"


export default function Home() {
  return (
    <>
      <Head>
        <title>Stock Market Trends Dashboard</title>
      </Head>

      <div className="min-h-screen flex flex-col items-center pt-10">
        <h1 className="text-3xl font-bold text-center mb-0.1">
          Stock Market Trends Dashboard
        </h1>

        <Dashboard />
      </div>
    </>
  );
}
