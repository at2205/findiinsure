"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SERVER_URL } from "@/config/apiConfig";
import AppButton from "@/components/common/AppButton";
import { API_ENDPOINTS } from "@/config/apiConfig";

export default function PaymentPage() {
    const router = useRouter();

    const [amount, setAmount] = useState(0);

    const [vendors, setVendors] = useState<any[]>([]);
    const [selectedVendor, setSelectedVendor] = useState<any>(null);

    const [modes, setModes] = useState<any[]>([]);
    const [selectedMode, setSelectedMode] = useState("");
    const [isPaying, setIsPaying] = useState(false);
    const [loading, setLoading] = useState(true);
    const savePaymentState = () => {
        const state = {
            amount,
            selectedVendor,
            selectedMode,
            vendors,
            modes,
        };

        sessionStorage.setItem("payment_state", JSON.stringify(state));
    };

    const VENDOR_URL = `${SERVER_URL}/BANKITMRA/resources/AESAPI/pg-vendor-list`;
    const MODE_URL = `${SERVER_URL}/BANKITMRA/resources/AESAPI/pg-mode-list`;

    const fetchVendors = async () => {
        try {
            const response = await fetch(VENDOR_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ agent: "Agent" }),
            });

            const res = JSON.parse(await response.text());

            if (res?.status === "00") {
                setVendors(res.vendorList || []);
            }
        } catch (err) {
            console.error("Vendor API error:", err);
        }
    };

    const fetchModes = async (vendorName: string) => {
        try {
            const response = await fetch(MODE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    vendor: vendorName,
                    agent: "Agent",
                }),
            });

            const res = JSON.parse(await response.text());

            if (res?.status === "00") {
                setModes(res.pgModeList || []);

                if (res.pgModeList?.length > 0) {
                    setSelectedMode(res.pgModeList[0].vendor);
                }
            }
        } catch (err) {
            console.error("Mode API error:", err);
        }
    };
    useEffect(() => {
        const handlePageShow = () => {
            console.log("🔁 Page restored from cache");

            const saved = sessionStorage.getItem("payment_state");

            if (saved) {
                try {
                    const parsed = JSON.parse(saved);

                    setAmount(parsed.amount || 0);
                    setSelectedVendor(parsed.selectedVendor || null);
                    setSelectedMode(parsed.selectedMode || "");
                    setVendors(parsed.vendors || []);
                    setModes(parsed.modes || []);
                } catch (err) {
                    console.error("Restore failed", err);
                }
            }
        };

        // 🔥 Trigger when coming back from PG
        window.addEventListener("pageshow", handlePageShow);

        return () => {
            window.removeEventListener("pageshow", handlePageShow);
        };
    }, []);

    useEffect(() => {
        if (vendors.length === 0) return;

        const saved = sessionStorage.getItem("payment_state");

        if (saved) {
            try {
                const parsed = JSON.parse(saved);

                // 🔥 Find matching vendor from fresh API data
                const matchedVendor = vendors.find(
                    (v) => v.vendor === parsed.selectedVendor?.vendor
                );

                if (matchedVendor) {
                    setSelectedVendor(matchedVendor);

                    // 🔥 ALSO fetch modes again
                    fetchModes(matchedVendor.vendorName);
                }

                setSelectedMode(parsed.selectedMode || "");
                setAmount(parsed.amount || 0);

            } catch (err) {
                console.error("Restore failed", err);
            }
        }
    }, [vendors]);

    useEffect(() => {
        const restoreState = () => {
            const saved = sessionStorage.getItem("payment_state");

            if (saved) {
                try {
                    const parsed = JSON.parse(saved);

                    console.log("Restoring payment state:", parsed);

                    setAmount(parsed.amount || 0);
                    setSelectedVendor(parsed.selectedVendor || null);
                    setSelectedMode(parsed.selectedMode || "");
                    setModes(parsed.modes || []);

                    return true;
                } catch (err) {
                    console.error("Restore failed", err);
                }
            }

            return false;
        };

        const restored = restoreState();

        fetchVendors();

        if (!restored) {
            const checkout = sessionStorage.getItem("checkout_details");

            if (checkout) {
                const parsed = JSON.parse(checkout);
                setAmount(parsed.totalAmount || 500);
            }
        }
    }, []);

    const handleVendorChange = (vendorId: string) => {
        const selected = vendors.find((v) => v.vendor === vendorId);

        setSelectedVendor(selected);
        setModes([]);
        setSelectedMode("");

        if (selected) {
            fetchModes(selected.vendorName);
        }
    };

    const handlePayment = () => {
        if (!selectedVendor || !selectedMode) {
            alert("Please select payment gateway and mode");
            return;
        }

        setIsPaying(true);
        savePaymentState();

        try {
            const refNo = `FIN${Date.now()}`;
            sessionStorage.setItem("order_ref", refNo);

            const agentId = sessionStorage.getItem("agentId");
            const email = sessionStorage.getItem("user_email");
            const mobile = sessionStorage.getItem("verified_mobile");

            // const callbackUrl =
            //     "http://localhost:8001/BANKITMRA/FindiInsurePGResponse.jsp";
            const callbackUrl = API_ENDPOINTS.PG_CALLBACK;

            const generateHash = (amount: number, orderId: string) => {
                const data = `${agentId}|${amount}|CC|${email}|${mobile}|${orderId}|${callbackUrl}`;
                return btoa(data);
            };

            const secureHash = generateHash(amount, refNo);

            const params: any = {
                AgentId: agentId,
                UserInfo: "Findi PG Insure",
                // Amount: "1",
                Amount: amount,
                Mode: selectedMode,
                EmailId: email,
                Mobile: mobile,
                Callback: callbackUrl,
                ResponseType: "GET",
                OrderId: refNo,
                SecureHash: secureHash,
                Channel: "Web",
                remark: "INSURANCE",
                name: "Insurance Purchase",
                routingVendor: selectedVendor?.vendorName,
            };

            const form = document.createElement("form");
            form.method = "POST";
            form.action =
                "https://portal.bankit.in:9090/BankitPGV1/apiSecureBankitPG";

            Object.entries(params).forEach(([key, value]) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = String(value);
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();

        } catch (err) {
            console.error(err);
            setIsPaying(false); 
        }
    };


    return (
        <>
            {/* Header */}
            <section className="bg-gradient-to-br from-[#1C3C5F] to-[#142d47] pt-[120px] pb-12 text-center">
                <h1 className="text-white text-[2.25rem] font-bold mb-2">
                    Payment
                </h1>
                <p className="text-white/70">
                    Securely complete your insurance purchase.
                </p>
            </section>

            {/* Main */}
            <section className="py-16 px-6">
                <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Left Side */}
                    <div className="md:col-span-2 bg-white rounded-[16px] border border-[#E2E8F0] p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">
                            Select Payment Gateway
                        </h2>

                        <select
                            value={selectedVendor?.vendor || ""}
                            onChange={(e) => handleVendorChange(e.target.value)}
                            className="w-full py-3 px-4 border-2 border-[#E2E8F0] rounded-[10px] mb-6"
                        >
                            <option value="">Select Gateway</option>
                            {vendors.map((v) => (
                                <option key={v.vendor} value={v.vendor}>
                                    {v.vendorName}
                                </option>
                            ))}
                        </select>

                        {selectedVendor && (
                            <>
                                <h2 className="text-lg font-semibold mb-4">
                                    Select Payment Mode
                                </h2>

                                <select
                                    value={selectedMode}
                                    onChange={(e) => setSelectedMode(e.target.value)}
                                    className="w-full py-3 px-4 border-2 border-[#E2E8F0] rounded-[10px]"
                                >
                                    {modes.length === 0 ? (
                                        <option>Loading...</option>
                                    ) : (
                                        modes.map((m) => (
                                            <option key={m.vendor} value={m.vendor}>
                                                {m.vendorName}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </>
                        )}
                    </div>

                    {/* Right Side (UPDATED) */}
                    <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-6 shadow-sm h-fit">
                        <h2 className="text-lg font-semibold mb-4">
                            Order Summary
                        </h2>

                        <div className="flex justify-between text-sm mb-3">
                            <span>Insurance Plan</span>
                            <span>₹{amount}</span>
                        </div>

                        <div className="border-t pt-4 flex justify-between font-bold text-lg mb-6">
                            <span>Amount to Pay:</span>
                            <span>₹{amount}</span>
                        </div>

                        {/* ✅ Pay Button INSIDE */}
                        {/* <button
                            onClick={handlePayment}
                            disabled={!selectedVendor || !selectedMode}
                            className="w-full py-3 rounded-[12px] bg-[#D43F33] text-white font-semibold shadow-md hover:bg-[#b8352b] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            Pay Now
                        </button> */}
                        <AppButton
                            text="Pay Now"
                            loading={isPaying}
                            onClick={handlePayment}
                            disabled={!selectedVendor || !selectedMode}
                            variant="danger"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}