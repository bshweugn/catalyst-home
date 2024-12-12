import React, { useState } from "react";
import "./ScriptEditor.scss";
import DeviceSelector from "../DeviceSelector/DeviceSelector";
import TriggerEditor from "../TriggerEditor/TriggerEditor";

const ScriptEditor = ({ devices, onSaveScript }) => {
  const [isDeviceSelected, setIsDeviceSelected] = useState(false);
  const [trigger, setTrigger] = useState(null);
  const [actions, setActions] = useState([]);

  const handleDeviceSelect = (device) => {
    setTrigger(device);
    setIsDeviceSelected(true);
  };

  const handleAddAction = (action) => {
    setActions((prev) => [...prev, action]);
  };

  const handleSave = () => {
    const newScript = {
      name: `Script ${Date.now()}`,
      triggers: [{ device: trigger, actions }],
    };
    onSaveScript(newScript);
  };

  return (
    <div className="script-editor">
      {!isDeviceSelected ? (
        <DeviceSelector devices={devices} onSelect={handleDeviceSelect} />
      ) : (
        <TriggerEditor
          trigger={trigger}
          onAddAction={handleAddAction}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ScriptEditor;
