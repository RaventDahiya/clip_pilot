import { writeFile } from "fs/promises";
import Replicate from "replicate";
export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const input = {
      prompt: prompt,
      height: 1280,
      width: 1024,
      num_outputs: 1,
    };

    const output = await replicate.run(
      "bytedance/sdxl-lightning-4step:6f7a773af6fc3e8de9d5a3c00be77c17308914bf67772726aff83496ba1e3bbe",
      { input }
    );

    // To access the file URLs:
    console.log(output[0].url());
    //=> "https://replicate.delivery/.../output_0.png"

    // To write the files to disk:
    // for (const [index, item] of Object.entries(output)) {
    //   await writeFile(`output_${index}.png`, item);
    // }
    return NextResponse.json({ result: output[0] });
    //=> output_0.png written to disk
  } catch (error) {
    return NextRequest.json({ Error: error });
  }
}
