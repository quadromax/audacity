import Image from "next/image";

export function TokenLogo() {
  return (
    <Image
      className="audacity-token-logo"
      src="/assets/branding/audacity-logo.webp"
      alt=""
      width={192}
      height={192}
      unoptimized
    />
  );
}
