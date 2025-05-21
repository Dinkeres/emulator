// Function to create the emulator navigation with search functionality
function createEmulatorNavigation() {
  // Create main page
  const mainPage = document.createElement('main');
  mainPage.id = 'main-page';
  mainPage.setAttribute('aria-label', 'Main Button Selection Page');

  const h1 = document.createElement('h1');
  h1.textContent = 'Big Centered Text';
  mainPage.appendChild(h1);

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'button-container';

  const emulators = [
    { name: 'GBA', url: 'https://your-custom-link-for-gba.com' },
    { name: 'NDS', url: 'https://your-custom-link-for-nds.com' },
    { name: 'Websites', url: 'https://your-custom-link-for-websites.com' },
    { name: 'Extras', url: 'https://your-custom-link-for-extras.com' }
  ];

  emulators.forEach(emulator => {
    const button = document.createElement('button');
    button.setAttribute('data-emulator', emulator.name);
    button.setAttribute('data-url', emulator.url);
    button.textContent = emulator.name;
    buttonContainer.appendChild(button);
  });

  mainPage.appendChild(buttonContainer);
  document.body.appendChild(mainPage);

  // Create emulator page
  const emulatorPage = document.createElement('section');
  emulatorPage.id = 'emulator-page';
  emulatorPage.setAttribute('aria-label', 'Emulator Detail Page');
  emulatorPage.setAttribute('tabindex', '0');
  emulatorPage.setAttribute('role', 'region');

  const emulatorHeader = document.createElement('header');
  const emulatorNameBtn = document.createElement('button');
  emulatorNameBtn.id = 'emulator-name-btn';
  emulatorNameBtn.setAttribute('aria-label', 'Return to main emulator page');
  emulatorHeader.appendChild(emulatorNameBtn);

  const emulatorHeaderCenter = document.createElement('div');
  emulatorHeaderCenter.id = 'emulator-header-center';
  emulatorHeaderCenter.setAttribute('aria-hidden', 'true');
  emulatorHeader.appendChild(emulatorHeaderCenter);

  const emulatorHeaderRight = document.createElement('div');
  emulatorHeaderRight.id = 'emulator-header-right';
  emulatorHeader.appendChild(emulatorHeaderRight);

  emulatorPage.appendChild(emulatorHeader);

  // Search bar
  const searchContainer = document.createElement('div');
  searchContainer.id = 'search-container';
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'search-input';
  searchInput.placeholder = 'Search games...';
  searchInput.setAttribute('aria-label', 'Search games');
  searchContainer.appendChild(searchInput);
  emulatorPage.appendChild(searchContainer);

  // Vertical button container
  const verticalBtnsContainer = document.createElement('nav');
  verticalBtnsContainer.id = 'vertical-button-container';
  verticalBtnsContainer.setAttribute('aria-label', 'Emulator games buttons grid');
  verticalBtnsContainer.setAttribute('tabindex', '0');
  emulatorPage.appendChild(verticalBtnsContainer);

  document.body.appendChild(emulatorPage);

  // Emulators data setup
  const emulatorData = {
    'GBA': [
      { name: "ANIMON", url: "https://dinkeres.github.io/emulator/Roms/Animon.html" },
      { name: "Dbz Supersonic Warriors", url: "https://dinkeres.github.io/emulator/Roms/Dbz_Supersonic_warriors.html" },
      { name: "Castlevania Aria of Sorrow", url: "https://dinkeres.github.io/emulator/Roms/Castlevania_Aria_of_Sorrow.html" },
      { name: "Dragon Ball Z - The Legacy of Goku II", url: "https://dinkeres.github.io/emulator/Roms/Dragon%20Ball%20Z%20-%20The%20Legacy%20of%20Goku%20II%20(USA).html" },
      { name: "Dragon Ball Z Team Training", url: "https://dinkeres.github.io/emulator/Roms/Dragon%20Ball%20Z%20Team%20Training%20v9.2.html" },
      // Add more GBA games here
    ],
    'NDS': [],
    'Websites': [],
    'Extras': []
  };

  // Sort games alphabetically by name within each category
  for (const category in emulatorData) {
    emulatorData[category].sort((a, b) => a.name.localeCompare(b.name));
  }

  // Open emulator page
  function openEmulator(emulatorName) {
    mainPage.style.display = 'none';
    emulatorPage.style.display = 'flex';
    emulatorNameBtn.textContent = emulatorName;
    searchInput.value = '';
    renderGameButtons(emulatorName);
    searchInput.focus();
  }

  // Render game buttons for current emulator
  function renderGameButtons(emulatorName) {
    verticalBtnsContainer.innerHTML = '';
    const games = emulatorData[emulatorName];
    games.forEach(game => {
      const btn = document.createElement('button');
      btn.textContent = game.name;
      btn.type = 'button';
      btn.addEventListener('click', () => {
        window.location.href = game.url; // Open the URL in a new tab
      });
      verticalBtnsContainer.appendChild(btn);
    });
  }

  // Filter buttons based on search input
  function filterGameButtons() {
    const search = searchInput.value.trim().toLowerCase();
    const buttons = verticalBtnsContainer.querySelectorAll('button');
    buttons.forEach(btn => {
      if (btn.textContent.toLowerCase().includes(search)) {
        btn.style.display = '';
      } else {
        btn.style.display = 'none';
      }
    });
  }

  // Return to main page
  function goBackToMain() {
    emulatorPage.style.display = 'none';
    mainPage.style.display = 'flex';
    verticalBtnsContainer.innerHTML = '';
    searchInput.value = '';
  }

  // Event listeners
  document.querySelectorAll('#main-page .button-container button').forEach(btn => {
    btn.addEventListener('click', () => {
      const emulatorName = btn.getAttribute('data-emulator');
      openEmulator(emulatorName);
    });
  });

  emulatorNameBtn.addEventListener('click', goBackToMain);
  searchInput.addEventListener('input', filterGameButtons);
}

// Call the function to create the emulator navigation
createEmulatorNavigation();
