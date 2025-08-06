import { chatSession } from "../../../configs/AiModel.js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    console.log(prompt);
    const result = await chatSession.sendMessage(prompt);
    console.log(result.response.text());
    const responseText = await result.response.text();
    const match = responseText.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("No JSON array found in AI response.");
    const jsonResult = JSON.parse(match[0]);
    return NextResponse.json({ result: jsonResult });
  } catch (error) {
    return NextRequest.json({ Error: error });
  }
}
