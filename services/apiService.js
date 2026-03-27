// services/apiService.js
import { API_ENDPOINTS } from "@/config/apiConfig";

export const fetchInsurePlans = async () => {
  try {
    const res = await fetch(API_ENDPOINTS.FINDI_INSURE_PLANS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add any required headers here if needed
        // "Authorization": "Bearer your-token",
        // "API-Key": "your-api-key",
      },
      cache: "no-store", // important for fresh SSR data
    });

    if (!res.ok) {
      console.error(`API Error: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to fetch plans: ${res.status}`);
    }

    const data = await res.json();
    
    // Check if API returned success status
    if (data.status !== "00") {
      console.error("API returned error status:", data.status);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
};