import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generationConfig = {
  temperature: 1,
  topK: 64,
  topP: 1,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: 'Write a script to generate a 30-second video with the topic: "An Interesting Historical Story".\n\nDivide the video into 5 distinct scenes. For each scene, provide:\n- "imagePrompt": a concise, vivid, and photorealistic AI image prompt that describes what should visually appear in the scene;\n- "content": the narration or dialogue for the scene.\n\nReturn the result as a valid JSON array, like:\n[\n  {\n    "imagePrompt": "A bustling Renaissance marketplace in Florence, realistic, sunlight, color",\n    "content": "The year is 1500. Florence is alive with artists, merchants, and dreamers, each shaping the Renaissance."\n  },\n  ...\n]\n\nDo not include any plain text before or after the JSON. Only return the JSON array as your output.',
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n[\n  {\n    "imagePrompt": "A photorealistic image of a single wooden bucket, weathered and old, sitting in the center of a dusty, sun-drenched Italian piazza in the 14th century. The surrounding medieval buildings are quiet and still.",\n    "content": "In 1325, a simple oaken bucket would ignite a war between two powerful Italian city-states, Bologna and Modena."\n  },\n  {\n    "imagePrompt": "Dynamic, photorealistic shot of Modenese soldiers, clad in chainmail and helmets, sneaking through the dark, narrow streets of Bologna at night, one of them triumphantly holding the stolen wooden bucket.",\n    "content": "The conflict began when a group of Modenese soldiers slipped into Bologna and stole the bucket from a city well, a bold act of provocation."\n  },\n  {\n    "imagePrompt": "A photorealistic, wide-angle view of two massive medieval armies clashing on a battlefield. Thousands of soldiers from Bologna, on one side, and the outnumbered Modenese on the other, engaged in fierce combat.",\n    "content": "Outraged, Bologna declared war. They amassed an army of 32,000 men to face Modena\'s mere 7,000, leading to the Battle of Zappolino."\n  },\n  {\n    "imagePrompt": "A photorealistic image of the victorious Modenese soldiers, parading the captured oaken bucket through the streets of Modena as a trophy of war, a symbol of their unlikely victory.",\n    "content": "Against all odds, Modena won the battle. Though thousands were killed on both sides, the bucket was taken back to Modena as a treasured prize."\n  },\n  {\n    "imagePrompt": "A modern, photorealistic shot of the \'Torre della Ghirlandina\' in Modena, Italy. Inside, the ancient oaken bucket is displayed as a historical artifact, a testament to a bizarre and almost forgotten war.",\n    "content": "And to this day, the bucket remains in Modena, a peculiar reminder of the war fought over a simple pail."\n  }\n]\n```',
        },
      ],
    },
  ],
});
