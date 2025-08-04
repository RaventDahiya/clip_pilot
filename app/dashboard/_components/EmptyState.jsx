import React from "react";
import Link from "next/link";
import { FileVideo } from "lucide-react";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-150 p-6 border-2 border-dashed border-gray-300 rounded-md text-center space-y-4">
      <FileVideo className="text-gray-400 w-12 h-12 mx-auto" />
      <p className="text-gray-500 text-lg font-semibold">
        No videos are present.
      </p>
      <Link
        href="/dashboard/create-new"
        className="inline-block bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark"
      >
        Create New Video
      </Link>
    </div>
  );
}

export default EmptyState;
