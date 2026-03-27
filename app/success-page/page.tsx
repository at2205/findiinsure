"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function RegistrationSuccessPage() {
    const [mobile, setMobile] = useState("");
    const [ref, setRef] = useState("");
    const [name, setName] = useState("");
    const [policy, setPolicy] = useState<any>(null);

    useEffect(() => {
        const checkout = sessionStorage.getItem("checkout_details");
        const orderRef = sessionStorage.getItem("order_ref");
        const policyData = sessionStorage.getItem("policy_details");

        if (checkout) {
            try {
                const parsed = JSON.parse(checkout);

                const firstForm = Object.values(parsed.forms || {})[0] as any;

                if (firstForm) {
                    setMobile(firstForm.mobile || "");
                    setName(firstForm.fullName || "");
                }
            } catch (err) {
                console.error("Error parsing checkout data", err);
            }
        }

        if (orderRef) {
            setRef(orderRef);
        }

        // 🔥 NEW: POLICY DATA
        if (policyData) {
            try {
                const parsedPolicy = JSON.parse(policyData);
                console.log("Policy Data:", parsedPolicy);
                setPolicy(parsedPolicy);
            } catch (err) {
                console.error("Error parsing policy data", err);
            }
        }

    }, []);

    return (
        <>
            {/* Header */}
            <section className="bg-[#F8F9FB] pt-12 pb-10 text-center">
                <div className="max-w-[900px] mx-auto px-6 mt-3.5">
                    {/* Logo */}
                    <h1 className="text-[2rem] font-bold text-[#1C3C5F] mb-4">
                        m-Swasth
                    </h1>

                    {/* Success Icon */}
                    <div className="text-[3rem] mb-3">✅</div>

                    {/* Title */}
                    <h2 className="text-[1.6rem] font-bold text-[#1A1F2B]">
                        Successfully Registered
                    </h2>

                    <p className="text-[#8A94A6] mt-1 text-sm">
                        {new Date().toLocaleString("en-IN")}
                    </p>
                </div>
            </section>

            {/* Body */}
            <section className="py-10 px-6">
                <div className="max-w-[900px] mx-auto">

                    {/* Steps Box */}
                    <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-6 mb-6">
                        <h3 className="font-semibold text-[#1A1F2B] mb-6">
                            Ask customer to
                        </h3>

                        <div className="flex justify-between items-center text-center max-md:flex-col gap-6">

                            <div>
                                <div className="text-[2rem] mb-2">📄</div>
                                <p className="text-sm text-[#1A1F2B]">
                                    Click on the app link sent via SMS
                                </p>
                            </div>

                            <div className="hidden md:block text-gray-300">--------</div>

                            <div>
                                <div className="text-[2rem] mb-2">⬇️</div>
                                <p className="text-sm text-[#1A1F2B]">
                                    Download app using that link
                                </p>
                            </div>

                            <div className="hidden md:block text-gray-300">--------</div>

                            <div>
                                <div className="text-[2rem] mb-2">📱</div>
                                <p className="text-sm text-[#1A1F2B]">
                                    Start using M-Swasth
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Customer Details */}
                    <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-6 mb-6">
                        <h3 className="font-semibold text-[#1A1F2B] mb-4">
                            Customer Details
                        </h3>

                        <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-[#8A94A6]">Mobile No.</p>
                                <p className="font-semibold">{mobile}</p>
                            </div>

                            <div>
                                <p className="font-semibold">
                                    {policy?.msw_policyNumber || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="font-semibold">
                                    {policy?.msw_expDate || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-[#8A94A6]">Customer Name</p>
                                <p className="font-semibold">{name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="bg-white border border-[#E2E8F0] rounded-[12px] p-6 mb-8">
                        <h3 className="font-semibold text-[#1A1F2B] mb-4">
                            Transaction Details
                        </h3>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-[#8A94A6]">Status</p>
                                <p className="font-semibold text-green-600">Success</p>
                            </div>

                            <div>
                                <p className="text-[#8A94A6]">Transaction ID</p>
                                <p className="font-semibold">{ref}</p>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 justify-center max-md:flex-col">
                        <Link
                            href="/"
                            className="px-8 py-3 rounded-[30px] bg-[#1C3C5F] text-white font-semibold text-center hover:bg-[#264d78] transition-all"
                        >
                            Go to Home
                        </Link>

                        <Link
                            href="/products"
                            className="px-8 py-3 rounded-[30px] bg-[#D43F33] text-white font-semibold text-center hover:bg-[#b8352b] transition-all"
                        >
                            Browse More Plans
                        </Link>
                    </div>

                </div>
            </section>
        </>
    );
}
