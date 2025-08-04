"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Item } from "@radix-ui/react-select";
import { Textarea } from "../../../../components/ui/textarea";

function SelectTopic({ onUserSelect }) {
  const videoTypeOptions = [
    "Custom Prompt",
    "Random AI Story",
    "Scary Story",
    "Adventure Story",
    "Comedy Sketch",
    "Motivational Message",
    "Fairy Tale",
    "Tech Explainer",
    "News Flash",
    "Fantasy Journey",
  ];
  const [selectedOption, setSelectedOption] = useState("");
  return (
    <div>
      <h2 className="font-bold text-xl text-primary">Content</h2>
      <p className="text-grey-500 "> what is the topicof your video?</p>
      <Select
        onValueChange={(value) => {
          setSelectedOption(value);
          if (value !== "Custom Prompt") {
            onUserSelect("topic", value);
          }
        }}
      >
        <SelectTrigger className="w-full mt-2 p-6 text-lg">
          <SelectValue placeholder="Content Type" />
        </SelectTrigger>
        <SelectContent>
          {videoTypeOptions.map((item, index) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedOption == "Custom Prompt" && (
        <Textarea
          className="mt-3"
          onChange={(e) => onUserSelect("topic", e.target.value)}
          placeholder="Describe your idea, scene, or story to generate a unique AI-powered video..."
        />
      )}
    </div>
  );
}

export default SelectTopic;
