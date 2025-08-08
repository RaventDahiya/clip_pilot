import axios from "axios";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt must be a non-empty string" },
        { status: 400 }
      );
    }

    const enhancedPrompt = `${prompt}, 1080x1920 resolution, 9:16 aspect ratio, vertical, portrait, high resolution`;
    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;

    const base64Data = await ConvertImage(imageUrl);

    if (!base64Data) {
      throw new Error("Failed to convert image to base64");
    }

    const imageBuffer = Buffer.from(base64Data, "base64");
    const fileName = `Image${Date.now()}.png`;

    const { error: uploadError } = await supabase.storage
      .from("image-files")
      .upload(fileName, imageBuffer, {
        contentType: "image/png",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: "Upload failed", details: uploadError.message },
        { status: 500 }
      );
    }

    const { data: publicData, error: urlError } = supabase.storage
      .from("image-files")
      .getPublicUrl(fileName);

    if (urlError) {
      throw new Error(`Supabase getPublicUrl error: ${urlError.message}`);
    }

    return NextResponse.json({ result: publicData.publicUrl });
  } catch (error) {
    console.error("Pollinations API error:", error);
    return NextResponse.json(
      { error: "Failed to generate image", details: error.message },
      { status: 500 }
    );
  }
}

const ConvertImage = async (imageUrl) => {
  try {
    const resp = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const base64Image = Buffer.from(resp.data).toString("base64");
    return base64Image;
  } catch (error) {
    console.error("Image conversion error:", error);
    return null;
  }
};
