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
  const onHandleInputChange = (fieldName, fieldValue) => {
    console.log(fieldName, fieldValue);
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };
  const onCreateClickHandler = () => {
    GetVideoScript();
  };
  //get video script
  const GetVideoScript = async () => {
    setLoading(true);
    const promt = `Write a script to generate a ${formData.duration} video with the topic: "${formData.topic}".
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
    console.log(promt);
    const result = await axios
      .post("/api/get-video-script", { prompt: promt })
      .then((resp) => {
        console.log(resp.data.result);
        setVideoScript(resp.data.result);
        GenerateAudioFile(resp.data.result);
      });

    setLoading(false);
  };
  const GenerateAudioFile = async (VideoScriptData) => {
    let script = "";
    VideoScriptData.forEach((it) => {
      script = script + it.content + " ";
    });
    console.log(script);
    await axios.post("/api/tts", { text: script }).then((resp) => {
      console.log(resp.data);
    });
  };
  return (
    <div className="md:px-20">
      <h2 className="font-bold text-4xl text-primary text-center">
        Create New
      </h2>
      <div className="mt-10 shadow-md p-10">
        {/*select topic */}
        <SelectTopic onUserSelect={onHandleInputChange} />
        {/*select style*/}
        <SelectStyle onUserSelect={onHandleInputChange} />
        {/*duration*/}
        <SelectDuration onUserSelect={onHandleInputChange} />
        {/*create button*/}
        <Button className="mt-10 w-full" onClick={onCreateClickHandler}>
          Create Short Video
        </Button>
      </div>
      <CustomLoading loading={loading} />
    </div>
  );
}

export default CreateNew;
