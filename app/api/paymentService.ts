import { API_ENDPOINTS } from "@/config/apiConfig";
 
export const fetchVendorsAPI = async () => {
    const response = await fetch(
        `${API_ENDPOINTS.FINDI_INSURE_OTP.replace("findiInsureOtp", "pg-vendor-list")}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                agent: "Agent",
            }),
        }
    );
 
    const text = await response.text();
   
 
    if (text.startsWith("<")) {
        throw new Error("HTML response");
    }
 
    return JSON.parse(text);
};
 