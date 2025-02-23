import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // You can log the request body if needed
    const body = await request.json();
    console.log("Received data:", body);

    // Respond with a success message
    return NextResponse.json(
      { success: true, message: "Card application received." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
