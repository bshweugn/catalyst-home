import React, { useState } from "react";
import "./TriggerEditor.scss";
import ActionSelector from "../ActionSelector/ActionSelector";

const TriggerEditor = ({ trigger, onAddAction, onSave }) => {
  const [selectedAction, setSelectedAction] = useState(null);

  const handleAddAction = () => {
    if (selectedAction) {
      onAddAction(selectedAction);
      setSelectedAction(null);  // Reset action selection after adding
    }
  };

  return (
    <div className="trigger-editor">
      <h2>Trigger for {trigger.name}</h2>
      <p>Device State: {trigger.type}</p>

      <h3>Select Trigger State</h3>
      <ActionSelector onSelect={setSelectedAction} />

      <button onClick={handleAddAction} className="trigger-editor__add-btn">
        Add Action
      </button>

      <button onClick={onSave} className="trigger-editor__save-btn">
        Save Script
      </button>
    </div>
  );
};

export default TriggerEditor;
