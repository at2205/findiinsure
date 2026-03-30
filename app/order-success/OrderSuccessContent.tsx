"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [ref, setRef] = useState<string | null>(null);

  useEffect(() => {
    const urlRef = searchParams.get("ref");
    const sessionRef = sessionStorage.getItem("order_ref");

    const finalRef = urlRef || sessionRef;

    if (!finalRef) {
      router.replace("/");
      return;
    }

    sessionStorage.setItem("order_ref", finalRef);
    setRef(finalRef);
  }, [searchParams, router]);

  if (!ref) {
    return <div style={{ textAlign: "center", marginTop: "120px" }}>Loading...</div>;
  }

  return (
    <div>
      {/* KEEP YOUR EXISTING UI HERE */}
    </div>
  );
}