"use client";
import Image from "next/image";
import React, { useState } from "react";

function SelectStyle({ onUserSelect }) {
  const styleOptions = [
    {
      name: "Realistic",
      image: "/realistic.png",
    },
    {
      name: "Ghibli",
      image: "/gibili.jpg",
    },
    {
      name: "Comic",
      image: "/cimic.jpg",
    },
    {
      name: "Vintage",
      image: "/vintage.jpg",
    },
    {
      name: "Cyberpunk",
      image: "/cyberpunk.jpg",
    },
  ];
  const [selectedOption, setSelectedOption] = useState();
  return (
    <div className="mt-7 ">
      <h2 className="font-bold text-xl text-primary">Style</h2>
      <p className="text-grey-500 "> Select your video style</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5 mt-3">
        {styleOptions.map((item, index) => (
          <div
            className={`relative hover:scale-105 transition all cursor-pointer rounded-xl
                ${selectedOption == item.name && "border-4 border-primary"}`}
            key={item.name}
          >
            <Image
              src={item.image}
              alt={item.name}
              width={100}
              height={100}
              className="h-70 object-cover rounded-lg w-full"
              onClick={() => {
                setSelectedOption(item.name);
                onUserSelect("imageStyle", item.name);
              }}
            />
            <h2 className="absolute p-1 bg-primary bottom-0 w-full text-white text-center rounded-b-lg">
              {item.name}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SelectStyle;
