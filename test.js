const VERSION = '0.0.0.1';
const grid = document.querySelector('.grid');
const numColumns = 5;
const numButtonsPerColumn = 50; // generate 50 buttons per column
const columnNames = ["GBA", "3DS", "NDS", "PSX", "ATARIA"];
const buttonNames = [
    [
        "Fire Red", "Button 2", "Button 3", "Button 4", "Button 5",
        "Button 6", "Button 7", "Button 8", "Button 9", "Button 10",
        "Button 11", "Button 12", "Button 13", "Button 14", "Button 15",
        "Button 16", "Button 17", "Button 18", "Button 19", "Button 20",
        "Button 21", "Button 22", "Button 23", "Button 24", "Button 25",
        "Button 26", "Button 27", "Button 28", "Button 29", "Button 30",
        "Button 31", "Button 32", "Button 33", "Button 34", "Button 35",
        "Button 36", "Button 37", "Button 38", "Button 39", "Button 40",
        "Button 41", "Button 42", "Button 43", "Button 44", "Button 45",
        "Button 46", "Button 47", "Button 48", "Button 49", "Button 50","Button 51", "Button 52", "Button 53", "Button 54", "Button 55", "Button 56", "Button 57", "Button 58", "Button 59", "Button 60", "Button 61", "Button 62", "Button 63", "Button 64", "Button 65", "Button 66", "Button 67", "Button 68", "Button 69", "Button 70", "Button 71", "Button 72", "Button 73", "Button 74", "Button 75", "Button 76", "Button 77", "Button 78", "Button 79", "Button 80", "Button 81", "Button 82", "Button 83", "Button 84", "Button 85", "Button 86", "Button 87", "Button 88", "Button 89", "Button 90", "Button 91", "Button 92", "Button 93", "Button 94", "Button 95", "Button 96", "Button 97", "Button 98", "Button 99", "Button 100", "Button 101", "Button 102", "Button 103", "Button 104", "Button 105", "Button 106", "Button 107", "Button 108", "Button 109", "Button 110", "Button 111", "Button 112", "Button 113", "Button 114", "Button 115", "Button 116", "Button 117", "Button 118", "Button 119", "Button 120", "Button 121", "Button 122", "Button 123", "Button 124", "Button 125", "Button 126", "Button 127", "Button 128", "Button 129", "Button 130", "Button 131", "Button 132", "Button 133", "Button 134", "Button 135", "Button 136", "Button 137", "Button 138", "Button 139", "Button 140", "Button 141", "Button 142", "Button 143", "Button 144", "Button 145", "Button 146", "Button 147", "Button 148", "Button 149", "Button 150"
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
        "https://dinkeres.github.io/emulator/Roms/fire%20red.html", "https://www.example.com/gba-button-2", "https://www.example.com/gba-button-3"],
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
