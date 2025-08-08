"use client";
import React, { useState } from "react";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import { Button } from "../../../components/ui/button";
import axios from "axios";
import CustomLoading from "./_components/CustomLoading";

function CreateNew() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [videoScript, setVideoScript] = useState();
  const [fileUrl, setFileUrl] = useState("");
  const [captions, setCaptions] = useState();
  const [imageList, setImageList] = useState([]);

  const onHandleInputChange = (fieldName, fieldValue) => {
    console.log(fieldName, fieldValue);
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const onCreateClickHandler = async () => {
    setLoading(true);
    try {
      // Step 1: Get Video Script
      console.log("Step 1: Getting video script...");
      const scriptData = await GetVideoScript();

      // Step 2: Generate Audio File
      console.log("Step 2: Generating audio file...");
      const audioUrl = await GenerateAudioFile(scriptData);

      // Step 3: Generate Audio Caption
      console.log("Step 3: Generating captions...");
      await GenerateAudioCaption(audioUrl);

      // Step 4: Generate Images - Pass scriptData directly
      console.log("Step 4: Generating images...");
      await GenerateImage(scriptData); // Pass the script data and await

      // Step 5: Create Video
      console.log("All operations completed successfully!");
    } catch (error) {
      console.error("Error in video creation process:", error);
      alert("Failed to create video: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const GetVideoScript = async () => {
    const prompt = `Write a script to generate a ${formData.duration} video with the topic: "${formData.topic}".
                  Divide the video into 5 to 10 distinct scenes according to duration. For each scene, provide:
                  "imagePrompt": a concise, vivid, and ${formData.imageStyle} AI image prompt that describes what should visually appear in the scene;
                  "content": the narration or dialogue for the scene.
                  Return the result as a valid JSON array, like:
                  [
                  {
                  "imagePrompt": "A bustling Renaissance marketplace in Florence, realistic, sunlight, color",
                  "content": "The year is 1500. Florence is alive with artists, merchants, and dreamers, each shaping the Renaissance."
                  },
                  ...
                  ]
                  Do not include any plain text before or after the JSON. Only return the JSON array as your output.
                  "Respond ONLY with a valid JSON array. Do not include any explanation, markdown, or extra text."`;

    try {
      const response = await axios.post("/api/get-video-script", { prompt });
      console.log("Video script response:", response.data.result);
      setVideoScript(response.data.result);
      return response.data.result;
    } catch (error) {
      throw new Error(
        "Failed to get video script: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const GenerateAudioFile = async (VideoScriptData) => {
    let script = "";
    VideoScriptData.forEach((item) => {
      script = script + item.content + " ";
    });
    console.log("Full script:", script);

    try {
      const response = await axios.post("/api/tts", { text: script });
      console.log("TTS response:", response.data);

      if (!response.data.url) {
        throw new Error("No audio URL returned from TTS service");
      }

      setFileUrl(response.data.url);
      return response.data.url;
    } catch (error) {
      throw new Error(
        "Failed to generate audio: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const GenerateAudioCaption = async (audioUrl) => {
    if (!audioUrl) {
      throw new Error("Audio URL is required for caption generation");
    }

    try {
      console.log("Generating captions for:", audioUrl);
      const response = await axios.post("/api/generate-caption", {
        audioFileUrl: audioUrl,
      });

      console.log("Caption response:", response.data.result);
      setCaptions(response.data.result);
      return response.data.result;
    } catch (error) {
      console.error(
        "Caption generation error:",
        error.response?.data || error.message
      );
      throw new Error(
        "Failed to generate captions: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const GenerateImage = async (scriptData) => {
    // Use scriptData parameter or fallback to videoScript state
    const dataToUse = scriptData || videoScript;

    if (!dataToUse || !Array.isArray(dataToUse)) {
      console.error("No valid script data available for image generation");
      return;
    }

    try {
      const imagePromises = dataToUse.map((item) =>
        axios
          .post("/api/generate-image", {
            prompt: item?.imagePrompt,
          })
          .then((resp) => resp.data.result)
      );

      const images = await Promise.all(imagePromises);
      console.log("Generated images:", images);
      setImageList(images);
    } catch (error) {
      console.error("Error generating images:", error);
      throw error;
    }
  };
  return (
    <div className="md:px-20">
      <h2 className="font-bold text-4xl text-primary text-center">
        Create New
      </h2>
      <div className="mt-10 shadow-md p-10">
        {/* select topic */}
        <SelectTopic onUserSelect={onHandleInputChange} />
        {/* select style */}
        <SelectStyle onUserSelect={onHandleInputChange} />
        {/* duration */}
        <SelectDuration onUserSelect={onHandleInputChange} />
        {/* create button */}
        <Button
          className="mt-10 w-full"
          onClick={onCreateClickHandler}
          disabled={loading}
        >
          {loading ? "Creating Video..." : "Create Short Video"}
        </Button>

        {/* Debug info */}
        {videoScript && (
          <div className="mt-4 p-2 bg-gray-100 rounded">
            <p>
              <strong>Script:</strong> Generated ({videoScript.length} scenes)
            </p>
          </div>
        )}
        {fileUrl && (
          <div className="mt-2 p-2 bg-blue-100 rounded">
            <p>
              <strong>Audio:</strong>{" "}
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                Generated
              </a>
            </p>
          </div>
        )}
        {captions && (
          <div className="mt-2 p-2 bg-green-100 rounded">
            <p>
              <strong>Captions:</strong> Generated ({captions.length} words)
            </p>
          </div>
        )}
      </div>
      <CustomLoading loading={loading} />
    </div>
  );
}

export default CreateNew;
