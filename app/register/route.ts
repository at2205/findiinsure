export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(
      // "https://red.bankit.in/BANKITMRA/resources/AESAPI/findiInsureRegistration",
      "http://localhost:8001/BANKITMRA/resources/AESAPI/findiInsureRegistration",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "API failed" }, { status: 500 });
  }
}