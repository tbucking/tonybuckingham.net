import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-6">
      <Image
        src="/img/bear-01.png"
        alt="Bear"
        priority
        width={0}
        height={0}
        sizes="100vw"
        className="h-auto w-4/5 max-w-3xl"
      />
    </main>
  );
}
