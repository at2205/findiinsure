"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerInsure } from "@/services/insureService";

export default function PGCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const processPayment = async () => {
      try {
        const params = new URLSearchParams(window.location.search);

        const allParams = Object.fromEntries(params);
        console.log("🔥 PG CALLBACK PARAMS:", allParams);

        const statusRaw =
          params.get("Status") ||
          params.get("status") ||
          params.get("txnStatus");

        const status = statusRaw?.toLowerCase();

        const orderId = params.get("OrderId");
        const message = params.get("Message");
        const bankitTxnId = params.get("BankitTxnId");
        const amount = params.get("Amount");

        console.log("Parsed:", {
          status,
          orderId,
          bankitTxnId,
          amount,
        });

        
        if (!status) {
          console.warn("No PG params found");
          return;
        }

        
        if (["canceled", "cancelled", "failure"].includes(status)) {
          alert(message || "Payment Cancelled");
          router.push("/checkout");
          return;
        }

        
        if (status !== "success") {
          alert(message || "Payment Failed");
          router.push("/checkout");
          return;
        }

        
        console.log("✅ Payment Success");

        /* -------------------------------
           STEP 1: GET SESSION DATA
        -------------------------------- */
        const checkoutDetails = sessionStorage.getItem("checkout_details");

        if (!checkoutDetails) {
          throw new Error("Session expired. Please try again.");
        }

        const parsed = JSON.parse(checkoutDetails);
        const forms = parsed.forms;

        if (!forms) {
          throw new Error("Form data missing");
        }

        const firstForm = Object.values(forms)[0] as any;

        console.log("First Form:", firstForm);

        /* -------------------------------
           STEP 2: BUILD PAYLOAD
        -------------------------------- */
        const payload = {
          agentId: sessionStorage.getItem("agentId"),
          // agentId: "2190", 
          mobileNo: firstForm.mobile,
          fullName: firstForm.fullName,
          email: firstForm.email,
          dob: firstForm.dob || "",
          address: firstForm.address || "NA",
          gender: firstForm.gender || "Male",
          state: firstForm.state || "UP",
          pinCode: firstForm.pincode || "",
          ipAddress: "1.1.1.1",

          // 🔥 Payment details
          transactionId: orderId,
          pgTxnId: bankitTxnId,
          amount: amount,
          paymentStatus: status,
        };

        console.log("📦 PAYLOAD:", payload);

        /* -------------------------------
           STEP 3: CALL SERVICE API
        -------------------------------- */
        console.log("🚀 Calling registerInsure API...");

        const { data } = await registerInsure(payload);

        console.log("✅ API RESPONSE:", data);

        // 🔥 FIX HERE (IMPORTANT)
        if (!data || data.status !== "00") {
          throw new Error(data?.message || "Registration failed");
        }

        /* -------------------------------
           STEP 4: SUCCESS
        -------------------------------- */
        alert("Payment Successful & Registered 🎉");

        // 🧹 clear session
        sessionStorage.removeItem("checkout_details");
        sessionStorage.removeItem("order_ref");
        sessionStorage.setItem(
          "policy_details",
          JSON.stringify(data.Data)
        );

        // ✅ redirect
        router.push(`/order-success?ref=${orderId}`);

      } catch (error: any) {
        console.error("❌ PG Callback Error:", error);

        alert(error.message || "Something went wrong");

        router.push("/checkout");
      }
    };

    processPayment();
  }, [router]);

  return (
    <div style={{ textAlign: "center", marginTop: "120px" }}>
      <h2>Processing Payment & Registration...</h2>
      <p>Please wait, do not refresh.</p>
    </div>
  );
}