const fs = require('fs-extra');
const path = require('path');

function toKebabCase(string) {
  return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

let iconName = process.argv[2];

if (!iconName) {
  console.error('Error: Icon name is required');
  process.exit(1);
}

const dirPath = path.join(__dirname, 'src', 'components', 'icons', capitalizeFirstLetter(iconName));
const kebabIconName = toKebabCase(iconName);

fs.mkdirp(dirPath)
  .then(() => {
    console.log(`Directory ${dirPath} created`);

    const componentTemplate = `import React from 'react';

const ${capitalizeFirstLetter(iconName)} = ({ size = '24px', fill = 'currentColor', className = '', ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      fill={fill}
      className={\`${kebabIconName} \${className}\`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
    >
      {/* Paste your SVG content here */}
    </svg>
  );
};

export default ${capitalizeFirstLetter(iconName)};
`;

    const componentFilePath = path.join(dirPath, `${capitalizeFirstLetter(iconName)}.js`);

    fs.writeFile(componentFilePath, componentTemplate)
      .then(() => console.log(`${iconName}.js created`))
      .catch(err => console.error(`Error creating ${iconName}.js`, err));
  })
  .catch(err => console.error(`Error creating directory ${dirPath}`, err));
