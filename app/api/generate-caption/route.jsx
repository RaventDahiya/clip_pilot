import { AssemblyAI } from "assemblyai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { audioFileUrl } = await req.json(); // Added 'await' here

    console.log("Received audio URL:", audioFileUrl);

    if (!audioFileUrl) {
      return NextResponse.json(
        { error: "Audio file URL is required" },
        { status: 400 }
      );
    }

    const client = new AssemblyAI({
      apiKey: process.env.CAPTION_API,
    });

    const params = {
      audio: audioFileUrl,
      speaker_labels: true, // Optional: adds speaker identification
      speech_model: "best", // Use 'best' for better accuracy
    };

    console.log("Starting transcription...");
    const transcript = await client.transcripts.transcribe(params);

    console.log("Transcription status:", transcript.status);

    if (transcript.status === "error") {
      console.error("Transcription error:", transcript.error);
      return NextResponse.json({ error: transcript.error }, { status: 500 });
    }

    console.log("Transcript words:", transcript.words);
    return NextResponse.json({ result: transcript.words });
  } catch (error) {
    console.error("Caption generation error:", error);
    return NextResponse.json(
      {
        error: "Caption generation failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
