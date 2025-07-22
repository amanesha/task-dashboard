import React from "react";
import { saveAs } from "file-saver";

function ExportJson({ data, filename = "tasks.json" }) {
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    saveAs(blob, filename);
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Export JSON
    </button>
  );
}

export default ExportJson;
