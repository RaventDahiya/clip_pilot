import { NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { createClient } from "@supabase/supabase-js";

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.SUPABASE_SERVICE_KEY
) {
  throw new Error("Supabase environment variables are not set.");
}
if (!process.env.ELEVENLABS_API_KEY) {
  throw new Error("ELEVENLABS_API_KEY environment variable is not set.");
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export async function POST(req) {
  try {
    const { text } = await req.json();
    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Empty text not allowed" },
        { status: 400 }
      );
    }

    // Generate audio stream
    const voiceId = process.env.ELEVENLABS_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb";
    const audioStream = await client.textToSpeech.convert(voiceId, {
      outputFormat: "mp3_44100_128",
      text,
      modelId: "eleven_multilingual_v2",
    });

    // Collect chunks
    let audioBuffer;
    try {
      const chunks = [];
      for await (const chunk of audioStream) {
        chunks.push(chunk);
      }
      audioBuffer = Buffer.concat(chunks);
      console.log("Audio buffer size:", audioBuffer.length);
    } catch (streamError) {
      console.error("Stream error:", streamError);
      return NextResponse.json(
        { error: "Streaming failed", details: streamError.message },
        { status: 500 }
      );
    }

    // Upload to Supabase
    const fileName = `speech_${Date.now()}.mp3`;
    const { error: uploadError } = await supabase.storage
      .from("audio-files")
      .upload(fileName, audioBuffer, {
        contentType: "audio/mpeg",
        upsert: true,
      });
    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: "Upload failed", details: uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
      error: publicUrlError,
    } = supabase.storage.from("audio-files").getPublicUrl(fileName);
    if (publicUrlError) {
      console.error("Supabase getPublicUrl error:", publicUrlError);
      return NextResponse.json(
        { error: "Failed to get public URL", details: publicUrlError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Success", url: publicUrl });
  } catch (error) {
    console.error("TTS or upload error:", error);
    return NextResponse.json(
      { error: "TTS generation or upload failed", details: error.message },
      { status: 500 }
    );
  }
}
