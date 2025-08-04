"use client";
import React, { useState } from "react";

import EmptyState from "./_components/EmptyState";
import Link from "next/link";
import { Button } from "../../components/ui/button.jsx";

function Dashboard() {
  const [videoList, setVideoList] = useState([]);
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl text-primary">DashBoard</h2>
        <Button asChild>
          <Link href="/dashboard/create-new">+ Create New</Link>
        </Button>
      </div>
      {/*Empty state */}
      {videoList?.length == 0 && (
        <div className="p-6">
          <EmptyState />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
