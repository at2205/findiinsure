import { API_ENDPOINTS } from "@/config/apiConfig";
 
// 🔹 Common handler
const handleResponse = async (response: Response) => {
    const text = await response.text();
 
    console.log("🔍 RAW API RESPONSE:", text);
 
    if (text.startsWith("<")) {
        throw new Error("API returned HTML instead of JSON");
    }
 
    try {
        return JSON.parse(text);
    } catch {
        throw new Error("Invalid JSON response");
    }
};
 
// 🔹 Send OTP
export const sendOtpAPI = async (mobile: string) => {
    try {
        console.log("📡 OTP URL:", API_ENDPOINTS.FINDI_INSURE_OTP);
        console.log("SendOTP AGENT ID ", sessionStorage.getItem("agentId"));

 
        const response = await fetch(API_ENDPOINTS.FINDI_INSURE_OTP, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                agentId: sessionStorage.getItem("agentId"),
                mobileNo: mobile,
                action: "Insert",
            }),
        });
 
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
 
        return await handleResponse(response);
 
    } catch (error: any) {
        console.error("❌ Send OTP API Error:", error.message);
        throw error;
    }
};
 
// 🔹 Verify OTP
export const verifyOtpAPI = async (mobile: string, otp: string) => {
    try {
        const response = await fetch(API_ENDPOINTS.FINDI_INSURE_OTP, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                agentId: sessionStorage.getItem("agentId"),
                mobileNo: mobile,
                action: "Verify",
                otp: otp,
            }),
        });
 
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
 
        return await handleResponse(response);
 
    } catch (error: any) {
        console.error("❌ Verify OTP API Error:", error.message);
        throw error;
    }
};
 