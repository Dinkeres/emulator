// Create the container element
const container = document.createElement('div');
container.className = 'container';
container.style.margin = '0';
container.style.padding = '0';
container.style.backgroundColor = '#222222';

// Create the grid element
const grid = document.createElement('div');
grid.className = 'grid';
grid.style.display = 'flex';
grid.style.flexDirection = 'column';
grid.style.gap = '20px';
container.appendChild(grid);

// Create the iframe container element
const iframeContainer = document.createElement('div');
iframeContainer.className = 'iframe-container';
iframeContainer.id = 'iframe-container';
iframeContainer.style.position = 'absolute';
iframeContainer.style.top = '0';
iframeContainer.style.left = '0';
iframeContainer.style.width = '100%';
iframeContainer.style.height = '100%';
iframeContainer.style.backgroundColor = '#fff';
iframeContainer.style.display = 'none';
const iframe = document.createElement('iframe');
iframe.id = 'iframe';
iframe.src = '';
iframe.frameBorder = '0';
iframe.style.border = 'none';
iframe.style.width = '100%';
iframe.style.height = '100%';
iframeContainer.appendChild(iframe);
container.appendChild(iframeContainer);

// Define the column names, button names, and button links
const numColumns = 5;
const numButtonsPerColumn = 5;
const columnNames = ["GBA", "3DS", "NDS", "PSX", "ATARIA"];
const buttonNames = [
    ["GBA Button 1", "GBA Button 2", "GBA Button 3", "GBA Button 4", "GBA Button 5"],
    ["3DS Button 1", "3DS Button 2", "3DS Button 3", "3DS Button 4", "3DS Button 5"],
    ["NDS Button 1", "NDS Button 2", "NDS Button 3", "NDS Button 4", "NDS Button 5"],
    ["PSX Button 1", "PSX Button 2", "PSX Button 3", "PSX Button 4", "PSX Button 5"],
    ["ATARIA Button 1", "ATARIA Button 2", "ATARIA Button 3", "ATARIA Button 4", "ATARIA Button 5"]
];
const buttonLinks = [
    ["https://www.example.com/gba1", "https://www.example.com/gba2", "https://www.example.com/gba3", "https://www.example.com/gba4", "https://www.example.com/gba5"],
    ["https://www.example.com/3ds1", "https://www.example.com/3ds2", "https://www.example.com/3ds3", "https://www.example.com/3ds4", "https://www.example.com/3ds5"],
    ["https://www.example.com/nds1", "https://www.example.com/nds2", "https://www.example.com/nds3", "https://www.example.com/nds4", "https://www.example.com/nds5"],
    ["https://www.example.com/psx1", "https://www.example.com/psx2", "https://www.example.com/psx3", "https://www.example.com/psx4", "https://www.example.com/psx5"],
    ["https://www.example.com/ataria1", "https://www.example.com/ataria2", "https://www.example.com/ataria3", "https://www.example.com/ataria4", "https://www.example.com/ataria5"]
];

// Generate the columns and buttons
for (let i = 0; i < numColumns; i++) {
    const column = document.createElement('div');
    column.className = 'column';
    column.style.display = 'flex';
    column.style.flexWrap = 'nowrap';
    column.style.overflowX = 'auto';
    column.style.gap = '10px';
    
    const columnTitle = document.createElement('div');
    columnTitle.className = 'column-title';
    columnTitle.textContent = columnNames[i]; // use the column name from the array
    columnTitle.style.fontWeight = 'bold';
    columnTitle.style.marginBottom = '10px';
    columnTitle.style.color = '#fff';
    column.appendChild(columnTitle);
    
    for (let j = 0; j < numButtonsPerColumn; j++) {
        const button = document.createElement('button');
        button.textContent = buttonNames[i][j]; // use the custom button name from the 2D array
        button.className = 'button';
        button.style.backgroundColor = '#1a1a1a';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.padding = '15px 32px ';
        button.style.textAlign = 'center';
        button.style.textDecoration = 'none';
        button.style.display = 'inline-block';
        button.style.fontSize = '16px';
        button.style.cursor = 'pointer';
        button.style.borderRadius = '5px';
        button.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
        
        button.onclick = function() {
            let url = buttonLinks[i][j];
            const iframeContainer = document.getElementById('iframe-container');
            const iframe = document.getElementById('iframe');
            iframe.src = url;
            iframeContainer.style.display = 'block';
        };
        
        column.appendChild(button);
    }
    
    grid.appendChild(column);
}

// Add the container to the body
document.body.appendChild(container);

// Add CSS styles
const styles = `
  .container {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .column {
    flex-basis: 20%;
    margin: 10px;
  }

  .column-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .button {
    background-color: #1a1a1a;
    color: #fff;
    border: none;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }

  .button:hover {
    background-color: #333;
  }

  .iframe-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: #fff;
    display: none;
  }

  .iframe-container iframe {
    width: 100%;
    height: 100vh;
    border: none;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerHTML = styles;
document.head.appendChild(styleSheet);
