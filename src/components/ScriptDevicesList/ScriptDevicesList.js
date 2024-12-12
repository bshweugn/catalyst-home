import React, { useState } from "react";
import "./ScriptDevicesList.scss";
import ScriptEditor from "../ScriptEditor/ScriptEditor";
import ScriptList from "../ScriptList/ScriptList";

const ScriptDevicesList = () => {
    const [scripts, setScripts] = useState([]);
    const [devices] = useState([
      { id: 1, name: "Lamp", type: "LAMP" },
      { id: 2, name: "Fan", type: "FAN" },
      { id: 3, name: "AC", type: "AC" },
    ]);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
  
    const handleCreateScript = () => {
      setIsEditorOpen(true);
    };
  
    const handleSaveScript = (newScript) => {
      setScripts((prevScripts) => [...prevScripts, newScript]);
      setIsEditorOpen(false);
    };
  
    return (
      <div className="app">
        {isEditorOpen ? (
          <ScriptEditor devices={devices} onSaveScript={handleSaveScript} />
        ) : (
          <ScriptList scripts={scripts} onCreateScript={handleCreateScript} />
        )}
      </div>
    );
  };

export default ScriptDevicesList;
