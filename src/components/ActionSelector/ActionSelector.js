import React from "react";
import "./ActionSelector.scss";

const ACTIONS = [
  { name: "Turn On", value: "ON" },
  { name: "Turn Off", value: "OFF" },
  { name: "Increase Brightness", value: "BRIGHTNESS_UP" },
  { name: "Decrease Brightness", value: "BRIGHTNESS_DOWN" },
];

const ActionSelector = ({ onSelect }) => {
  return (
    <div className="action-selector">
      <h3>Select Action</h3>
      <ul>
        {ACTIONS.map((action) => (
          <li key={action.value} onClick={() => onSelect(action)}>
            {action.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActionSelector;
