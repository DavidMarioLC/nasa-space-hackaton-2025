import { type NextRequest, NextResponse } from "next/server";
const GOOGLE_API_KEY = process.env.GOOGLE_AIR_QUALITY_API_KEY;
const GOOGLE_URL = process.env.GOOGLE_URL;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ z: string; x: string; y: string }> }
) {
  const { z, x, y } = await params;

  try {
    const tileUrl = `${GOOGLE_URL}/mapTypes/UAQI_RED_GREEN/heatmapTiles/${z}/${x}/${y}?key=${GOOGLE_API_KEY}`;
    const response = await fetch(tileUrl, {
      cache: "no-store",
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Failed to fetch tile: ${response.status}`, errorBody);
      throw new Error(`Failed to fetch tile: ${response.status}`);
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching map tile:", error);
    // Return a transparent 1x1 PNG on error
    const transparentPng = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    return new NextResponse(transparentPng, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  }
}
