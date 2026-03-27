import { API_ENDPOINTS } from "@/config/apiConfig";

export const registerInsure = async (payload: any) => {
  try {
    const res = await fetch(API_ENDPOINTS.FINDI_INSURE_REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log("RAW REGISTER RESPONSE:", text);

    const data = text ? JSON.parse(text) : null;

    return { data };
  } catch (error) {
    console.error("REGISTER API ERROR:", error);
    throw error;
  }
};