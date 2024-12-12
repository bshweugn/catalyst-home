import React, { useState } from "react";
import "./ScriptList.scss";

const ScriptList = ({ scripts, onCreateScript }) => {
  return (
    <div className="script-list">
      <h1 className="script-list__title">Scripts</h1>
      <button onClick={onCreateScript} className="script-list__create-btn">
        Create New Script
      </button>
      <ul className="script-list__items">
        {scripts.map((script, index) => (
          <li key={index} className="script-list__item">
            <strong>{script.name}</strong>
            <p>Triggers: {script.triggers.length}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScriptList;
