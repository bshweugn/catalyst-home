import React from 'react';
import './DividedProgressBar.scss';

const DividedProgressBar = ({ className, divisions = 10, percentage = 0 }) => {

  const filledDivisions = Math.round((percentage / 100) * divisions);


  let fillColor;
  if (percentage <= 30) {
    fillColor = 'rgb(3, 180, 0)';
  } else if (percentage <= 70) {
    fillColor = 'rgb(255, 162, 0)';
  } else {
    fillColor = 'rgb(255, 75, 0)';
  }

  return (
    <div className={`divided-progress-bar ${className}`}>
      {[...Array(divisions)].map((_, index) => (
        <div
          key={index}
          className="divided-progress-bar__division"
          style={{
            backgroundColor: index < filledDivisions ? fillColor : 'rgba(0, 0, 0, 0.08)',
          }}
        />
      ))}
    </div>
  );
};

export default DividedProgressBar;
