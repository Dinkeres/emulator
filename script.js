const grid = document.querySelector('.grid');
const numColumns = 5;
const numButtonsPerColumn = 50; // generate 50 buttons per column
const columnNames = ["GBA", "3DS", "NDS", "test", "test"];
const buttonNames = [
    [
        "Button 1", "Button 2", "Button 3", "Button 4", "Button 5",
        "Button 6", "Button 7", "Button 8", "Button 9", "Button 10",
        "Button 11", "Button 12", "Button 13", "Button 14", "Button 15",
        "Button 16", "Button 17", "Button 18", "Button 19", "Button 20",
        "Button 21", "Button 22", "Button 23", "Button 24", "Button 25",
        "Button 26", "Button 27", "Button 28", "Button 29", "Button 30",
        "Button 31", "Button 32", "Button 33", "Button 34", "Button 35",
        "Button 36", "Button 37", "Button 38", "Button 39", "Button 40",
        "Button 41", "Button 42", "Button 43", "Button 44", "Button 45",
        "Button 46", "Button 47", "Button 48", "Button 49", "Button 50"
    ],
    [
        "Button 1", "Button 2", "Button 3", "Button 4", "Button 5",
        "Button 6", "Button 7", "Button 8", "Button 9", "Button 10",
        "Button 11", "Button 12", "Button 13", "Button 14", "Button 15",
        "Button 16", "Button 17", "Button 18", "Button 19", "Button 20",
        "Button 21", "Button 22", "Button 23", "Button 24", "Button 25",
        "Button 26", "Button 27", "Button 28", "Button 29", "Button 30",
        "Button 31", "Button 32", "Button 33", "Button 34", "Button 35",
        "Button 36", "Button 37", "Button 38", "Button 39", "Button 40",
        "Button 41", "Button  42", "Button 43", "Button 44", "Button 45",
        "Button 46 ", "Button 47", "Button 48", "Button 49", "Button 50"
    ],
    [
        "Button 1", "Button 2", "Button 3", "Button 4", "Button 5",
        "Button 6", "Button 7", "Button 8", "Button 9", "Button 10",
        "Button 11", "Button 12", "Button 13", "Button 14", "Button 15",
        "Button 16", "Button 17", "Button 18", "Button 19", "Button 20",
        "Button 21", "Button 22", "Button 23", "Button 24", "Button 25",
        "Button 26", "Button 27", "Button 28", "Button 29", "Button 30",
        "Button 31", "Button 32", "Button 33", "Button 34", "Button 35",
        "Button 36", "Button 37", "Button 38", "Button 39", "Button 40",
        "Button 41", "Button 42", "Button 43", "Button 44", "Button 45",
        "Button 46", "Button 47", "Button 48", "Button 49", "Button 50"
    ],
    [
        "Button 1", "Button 2", "Button 3", "Button 4", "Button 5",
        "Button 6", "Button 7", "Button 8", "Button 9", "Button 10",
        "Button 11", "Button 12", "Button 13", "Button 14", "Button 15",
        "Button 16", "Button 17", "Button 18", "Button 19", "Button 20",
        "Button 21", "Button 22", "Button 23", "Button 24", "Button 25",
        "Button 26", "Button 27", "Button 28", "Button 29", "Button 30",
        "Button 31", "Button 32", "Button 33", "Button 34", "Button 35",
        "Button 36", "Button 37", "Button 38", "Button 39", "Button 40",
        "Button 41", "Button 42", "Button 43", "Button 44", "Button 45",
        "Button 46", "Button 47", "Button 48", "Button 49", "Button 50"
    ],
];
const buttonLinks = [
    [
        "https://dinkeres.github.io/emulator/fire%20red.html", "https://www.example.com/gba-button-2", "https://www.example.com/gba-button-3"],
    [
        "https://www.example.com/3ds-button-1", "https://www.example.com/3ds-button-2",],
    [
        "https://www.example.com/nds-button-1", "https://www.example.com/nds-button-2",],
    [
        "https://www.example.com/psx-button-1", "https://www.example.com/psx-button-2",],
];
for (let i = 0; i < numColumns; i++) {
    const column = document.createElement('div');
    column.className = 'column';
    
    const columnTitle = document.createElement('div');
    columnTitle.className = 'column-title';
    columnTitle.textContent = columnNames[i]; // use the column name from the array
    column.appendChild(columnTitle);
    
    for (let j = 0; j < numButtonsPerColumn; j++) {
        const button = document.createElement('button');
        button.textContent = buttonNames[i][j]; // use the custom button name from the 2D array
        button.className = 'button'; // Add the button class for styling
        
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
