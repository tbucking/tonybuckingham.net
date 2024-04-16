'use client'
import Image from "next/image";
import { Flex } from "theme-ui";

export default function Home() {
  return (
    <Flex as="main" sx={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Image src="/img/bear-01.png" alt="Bear" priority width={0} height={0} sizes="100vw" style={{ width: '80%', height: 'auto'}} />
    </Flex>
  );
}
