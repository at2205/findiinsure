"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

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
    return (
      <div style={{ textAlign: "center", marginTop: "120px" }}>
        <h2>Loading order details...</h2>
      </div>
    );
  }

  return (
    <section className="py-20 max-md:py-14">
      <div className="max-w-[1200px] mx-auto px-6 max-md:px-5">
        <div className="max-w-[600px] mx-auto bg-white rounded-[18px] border border-[#E2E8F0] shadow-lg overflow-hidden">

          {/* Header */}
          <div className="bg-[#22c55e] p-10 text-center text-white">
            <div className="text-[4rem] mb-5">✅</div>
            <h1 className="text-[1.75rem] font-bold mb-2">Payment Successful!</h1>
            <p className="text-white/80">Your insurance policy has been initiated</p>
          </div>

          {/* Body */}
          <div className="p-10 max-md:p-7">
            <div className="bg-[#F1F3F6] rounded-[14px] p-6 mb-8">

              <div className="flex justify-between mb-3 text-[0.95rem]">
                <span className="text-[#8A94A6]">Reference No.</span>
                <span className="font-mono text-[1.1rem] font-bold text-[#1A1F2B]">
                  {ref}
                </span>
              </div>

              <div className="flex justify-between mb-3 text-[0.95rem]">
                <span className="text-[#8A94A6]">Status</span>
                <span className="font-semibold text-[#22c55e]">Confirmed</span>
              </div>

              <div className="flex justify-between pt-3 border-t border-[#E2E8F0] text-[0.95rem] font-bold text-[#1C3C5F]">
                <span>Date</span>
                <span>
                  {new Date().toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <p className="text-[#8A94A6] text-[0.95rem] text-center mb-8 leading-relaxed">
              You will receive a confirmation SMS and email shortly. Your policy documents will be sent within 24 hours.
            </p>

            {/* ✅ Single OK Button */}
            <div className="mt-6">
              <Link
                href="/success-page"
                className="w-full inline-flex items-center justify-center py-3.5 font-semibold rounded-[30px] bg-[#22c55e] text-white hover:bg-[#16a34a] transition-all text-center"
              >
                OK
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}