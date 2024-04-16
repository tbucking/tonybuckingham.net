import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Image src="/img/bear-01.png" alt="Bear" priority width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto'}} />
    </main>
  );
}
