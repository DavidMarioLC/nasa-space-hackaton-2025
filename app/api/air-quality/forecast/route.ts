import { NextResponse } from "next/server";

const GOOGLE_URL = process.env.GOOGLE_URL;
const GOOGLE_API_KEY = process.env.GOOGLE_AIR_QUALITY_API_KEY;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const payload = {
      location: {
        latitude: -14.030282,
        longitude: -75.7420147,
      },
      languageCode: "en",
      period: {
        startTime: body.period?.startTime,
        endTime: body.period?.endTime,
      },
    };

    const response = await fetch(
      `${GOOGLE_URL}/forecast:lookup?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );

    const text = await response.text();

    if (!response.ok) {
      console.error("GOOGLE ERROR:", text);
      return NextResponse.json(
        { error: "Error en la petición a Google API", details: text },
        { status: response.status }
      );
    }

    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error("Error interno:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
