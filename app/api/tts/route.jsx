import { NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { createClient } from "@supabase/supabase-js";

// Basic validation for environment variables
if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_KEY
) {
  throw new Error("Supabase environment variables are not set.");
}

if (!process.env.ELEVENLABS_API_KEY) {
  throw new Error("ELEVENLABS_API_KEY environment variable is not set.");
}

if (!process.env.ELEVENLABS_VOICE_ID) {
  console.warn("ELEVENLABS_VOICE_ID is not set, using default voice.");
}

// Initialize Supabase client (server-side, use service role key)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export async function POST(req) {
  try {
    console.log("TTS API called");
    const { text } = await req.json();
    console.log("Text received:", text?.substring(0, 100) + "...");

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Empty text is not allowed" },
        { status: 400 }
      );
    }

    console.log("Calling ElevenLabs API...");
    // Generate audio stream
    const audioStream = await client.textToSpeech.convert(
      process.env.ELEVENLABS_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb",
      {
        outputFormat: "mp3_44100_128",
        text,
        modelId: "eleven_multilingual_v2",
      }
    );

    console.log("Audio stream received, collecting chunks...");
    // Collect chunks into a buffer
    const chunks = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);
    console.log("Audio buffer size:", audioBuffer.length);

    // Create a unique filename
    const fileName = `speech_${Date.now()}.mp3`;

    console.log("Uploading to Supabase...");
    // Upload buffer to Supabase Storage bucket "audio-files"
    const { data, error } = await supabase.storage
      .from("audio-files")
      .upload(fileName, audioBuffer, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json(
        { error: "Failed to upload file to Supabase", details: error.message },
        { status: 500 }
      );
    }

    console.log("Upload successful, getting public URL...");
    // Get a public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from("audio-files")
      .getPublicUrl(fileName);

    console.log("Success! Public URL:", urlData.publicUrl);
    return NextResponse.json({
      message: "File uploaded successfully",
      url: urlData.publicUrl,
    });
  } catch (error) {
    console.error("TTS or upload error:", error);
    return NextResponse.json(
      { error: "TTS generation or upload failed", details: error.message },
      { status: 500 }
    );
  }
}
