"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentFailureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const msg = searchParams.get("Message");
    const status = searchParams.get("Status");

    // Optional fallback from session
    const sessionMsg = sessionStorage.getItem("pg_message");

    const finalMessage = msg || sessionMsg || "Transaction Failed";

    if (!status && !finalMessage) {
      router.replace("/");
      return;
    }

    setMessage(finalMessage);

    // clear session after use
    sessionStorage.removeItem("pg_message");
  }, [searchParams, router]);

  return (
    <section className="py-20 max-md:py-14">
      <div className="max-w-[1200px] mx-auto px-6 max-md:px-5">
        <div className="max-w-[600px] mx-auto bg-white rounded-[18px] border border-[#E2E8F0] shadow-lg overflow-hidden">

          {/* Header */}
          <div className="bg-[#ef4444] p-10 text-center text-white">
            <div className="text-[4rem] mb-5">❌</div>
            <h1 className="text-[1.75rem] font-bold mb-2">Payment Failed</h1>
            <p className="text-white/80">Your transaction could not be completed</p>
          </div>

          {/* Body */}
          <div className="p-10 max-md:p-7">
            <div className="bg-[#F1F3F6] rounded-[14px] p-6 mb-8 text-center">

              <p className="text-[#8A94A6] mb-2">Reason</p>
              <p className="font-semibold text-[#1A1F2B] text-[1rem]">
                {message}
              </p>

              <div className="mt-4 text-sm text-[#8A94A6]">
                {new Date().toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>

            <p className="text-[#8A94A6] text-[0.95rem] text-center mb-8 leading-relaxed">
              If any amount was deducted, it will be refunded within 5-7 working days.
            </p>

            <div className="flex gap-3 max-md:flex-col">
              <button
                onClick={() => router.push("/")}
                className="flex-1 py-3.5 font-semibold rounded-[30px] bg-[#1C3C5F] text-white hover:bg-[#264d78] transition-all"
              >
                Go to Home
              </button>

              <button
                onClick={() => router.push("/checkout")}
                className="flex-1 py-3.5 font-semibold rounded-[30px] border-2 border-[#1C3C5F] text-[#1C3C5F] hover:bg-[#1C3C5F] hover:text-white transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}