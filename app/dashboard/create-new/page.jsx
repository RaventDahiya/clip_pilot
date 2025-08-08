"use client";
import React, { useContext, useEffect, useState } from "react";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import { Button } from "../../../components/ui/button";
import axios from "axios";
import CustomLoading from "./_components/CustomLoading";
import { VideoDataContext } from "../../_context/VideoDataContext";

function CreateNew() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [videoScript, setVideoScript] = useState();
  const [fileUrl, setFileUrl] = useState("");
  const [captions, setCaptions] = useState();
  const [imageList, setImageList] = useState([]);
  const { videoData, setVideoData } = useContext(VideoDataContext);

  const onHandleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const onCreateClickHandler = async () => {
    setLoading(true);
    try {
      const scriptData = await GetVideoScript();
      const audioUrl = await GenerateAudioFile(scriptData);
      await GenerateAudioCaption(audioUrl);
      await GenerateImage(scriptData);

      console.log("Video creation process completed successfully!");
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
      setVideoData((prev) => ({
        ...prev,
        videScript: response.data.result,
      }));
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

    try {
      const response = await axios.post("/api/tts", { text: script });

      if (!response.data.url) {
        throw new Error("No audio URL returned from TTS service");
      }
      setVideoData((prev) => ({
        ...prev,
        audioFileUrl: response.data.url,
      }));
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
      const response = await axios.post("/api/generate-caption", {
        audioFileUrl: audioUrl,
      });

      setCaptions(response.data.result);
      setVideoData((prev) => ({
        ...prev,
        captions: response.data.result,
      }));
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
    const dataToUse = scriptData || videoScript;

    if (!Array.isArray(dataToUse) || dataToUse.length === 0) {
      console.error("No valid script data available for image generation");
      return;
    }

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const urls = [];

    try {
      for (let i = 0; i < dataToUse.length; i++) {
        const { imagePrompt } = dataToUse[i];

        try {
          const resp = await axios.post("/api/generate-image", {
            prompt: imagePrompt,
          });

          if (resp.data.error) {
            throw new Error(resp.data.details || resp.data.error);
          }

          urls.push(resp.data.result);

          if (i < dataToUse.length - 1) {
            await delay(5000);
          }
        } catch (err) {
          console.error(`Image ${i + 1} generation failed:`, err.message);
          urls.push(null);
        }
      }

      const validUrls = urls.filter(Boolean);
      console.log(`Generated ${validUrls.length} images successfully`);
      setVideoData((prev) => ({
        ...prev,
        imageList: validUrls,
      }));
      setImageList(validUrls);
    } catch (error) {
      console.error("GenerateImage error:", error);
    }
  };
  useEffect(() => {
    console.log(videoData);
  }, [videoData]);
  return (
    <div className="md:px-20">
      <h2 className="font-bold text-4xl text-primary text-center">
        Create New
      </h2>
      <div className="mt-10 shadow-md p-10">
        <SelectTopic onUserSelect={onHandleInputChange} />
        <SelectStyle onUserSelect={onHandleInputChange} />
        <SelectDuration onUserSelect={onHandleInputChange} />
        <Button
          className="mt-10 w-full"
          onClick={onCreateClickHandler}
          disabled={loading}
        >
          {loading ? "Creating Video..." : "Create Short Video"}
        </Button>

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
