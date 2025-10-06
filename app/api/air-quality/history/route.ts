import { NextRequest, NextResponse } from "next/server";

const GOOGLE_URL = process.env.GOOGLE_URL;
const GOOGLE_API_KEY = process.env.GOOGLE_AIR_QUALITY_API_KEY;

export async function POST(request: NextRequest) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      hours: 24,
      pageSize: 4,
      location: {
        latitude: -14.049772786847141,
        longitude: -75.75019562271035,
      },
      languageCode: "en",
    }),
  };
  const response = await fetch(
    `${GOOGLE_URL}/history:lookup?key=${GOOGLE_API_KEY}`,
    options
  );

  const data = await response.json();

  return NextResponse.json({
    data,
  });
}
