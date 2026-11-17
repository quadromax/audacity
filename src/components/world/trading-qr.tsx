"use client";
import { useMemo } from "react";
import qr from "qrcode-generator";

export default function TradingQR({ url }: { url: string }) {
  const svg = useMemo(() => {
    const code = qr(0, "M");
    code.addData(url);
    code.make();
    return code.createSvgTag({ scalable: true, margin: 8 });
  }, [url]);
  return (
    <div
      role="img"
      aria-label="Pump.fun trading QR code"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
