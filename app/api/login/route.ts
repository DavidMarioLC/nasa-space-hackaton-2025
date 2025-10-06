import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(
      "https://aq-mvp-1.onrender.com/api/auth/login",
      options
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData, message: "Failed to login user." },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      data,
    });
  } catch (error) {
    console.error("Error in login route:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}
