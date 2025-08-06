import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      text,
      voice_id = "JBFqnCBsd6RMkjVDRZzb",
      model_id = "eleven_multilingual_v2",
    } = await req.json();

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.NEXT_PUBLIC_ELEVENLABS,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": "inline; filename=speech.mp3",
      },
    });
  } catch (error) {
    console.error("TTS Error:", error);
    return NextResponse.json(
      { error: "TTS generation failed" },
      { status: 500 }
    );
  }
}
