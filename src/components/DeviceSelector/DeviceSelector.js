import React from "react";
import "./DeviceSelector.scss";

const DeviceSelector = ({ devices, onSelect }) => {
  return (
    <div className="device-selector">
      <h2>Select Device for Trigger</h2>
      <ul>
        {devices.map((device) => (
          <li key={device.id} onClick={() => onSelect(device)}>
            {device.name} - {device.type}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeviceSelector;
