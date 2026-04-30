const ROMS_URL = 'https://ornate-platypus-5064de.netlify.app/';
const BROWSE_URL = 'https://math.luvrookie1.workers.dev/';
const PROXY_URL = 'https://cors-anywhere-k7fg.onrender.com';

const CORE_MAP = {
    'flash': { core: 'flash', label: 'Flash / SWF' },
    'gba': { core: 'gba', label: 'Game Boy Advance' },
    'gb': { core: 'gb', label: 'Game Boy' },
    'gbc': { core: 'gb', label: 'Game Boy Color' },
    'nes': { core: 'nes', label: 'NES' },
    'snes': { core: 'snes', label: 'SNES' },
    'n64': { core: 'n64', label: 'Nintendo 64' },
    'nds': { core: 'nds', label: 'Nintendo DS' },
    'vb': { core: 'vb', label: 'Virtual Boy' },
    'segaMD': { core: 'segaMD', label: 'Sega Genesis' },
    'segaMS': { core: 'segaMS', label: 'Master System' },
    'segaGG': { core: 'segaGG', label: 'Game Gear' },
    'segaSaturn': { core: 'segaSaturn', label: 'Sega Saturn' },
    'segaCD': { core: 'segaCD', label: 'Sega CD' },
    'atari2600': { core: 'atari2600', label: 'Atari 2600' },
    'atari7800': { core: 'atari7800', label: 'Atari 7800' },
    'lynx': { core: 'lynx', label: 'Atari Lynx' },
    'jaguar': { core: 'jaguar', label: 'Atari Jaguar' },
    'psx': { core: 'psx', label: 'PlayStation' },
    'pce': { core: 'pce', label: 'TurboGrafx-16' },
    'pcfx': { core: 'pcfx', label: 'PC-FX' },
    'ngp': { core: 'ngp', label: 'Neo Geo Pocket' },
    'ws': { core: 'ws', label: 'WonderSwan' },
    'coleco': { core: 'coleco', label: 'ColecoVision' },
    'vice_x64': { core: 'vice_x64', label: 'Commodore 64' },
    '3do': { core: '3do', label: '3DO' },
    'arcade': { core: 'arcade', label: 'Arcade' },
    'mame2003': { core: 'mame2003', label: 'MAME Arcade' }
};

const EXT_TO_SYSTEM = {
    'swf':'flash','gba':'gba','gbc':'gbc','gb':'gb','nes':'nes','fds':'nes',
    'sfc':'snes','smc':'snes','snes':'snes','n64':'n64','z64':'n64','v64':'n64',
    'nds':'nds','ds':'nds','vb':'vb','vboy':'vb',
    'md':'segaMD','gen':'segaMD','bin':'segaMD','smd':'segaMD',
    'sms':'segaMS','gg':'segaGG','iso':'psx','cue':'psx','pbp':'psx','chd':'psx',
    'pce':'pce','ngp':'ngp','ngc':'ngp','ws':'ws','wsc':'ws','col':'coleco',
    'a26':'atari2600','a78':'atari7800','lnx':'lynx','j64':'jaguar','jag':'jaguar',
    '3do':'3do','d64':'vice_x64','t64':'vice_x64','prg':'vice_x64'
};

const CONTROLLER_SVG = '<svg viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="15" cy="11" r="1"/><circle cx="18" cy="13" r="1"/></svg>';
const FLASH_SVG = '<svg viewBox="0 0 24 24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>';
const CLOCK_SVG_SMALL = '<svg viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';

let games = [];
let favorites = [];
let recentlyPlayed = [];
let playtimeData = {};
let currentTheme = 'midnight';
let rufflePlayerInstance = null;
let activeGameId = null;
let sessionStartTime = null;
let playtimeTickInterval = null;

function getCardIcon(type) { return type === 'flash' ? FLASH_SVG : CONTROLLER_SVG; }
function getCategoryIcon(type) { return type === 'flash' ? FLASH_SVG : CONTROLLER_SVG; }

function loadPlaytime() { try { const s = localStorage.getItem('emulatorHubPlaytime'); if (s) playtimeData = JSON.parse(s); } catch(e) { playtimeData = {}; } }
function savePlaytime() { localStorage.setItem('emulatorHubPlaytime', JSON.stringify(playtimeData)); }

function startPlaytimeTracking(gameId) {
    activeGameId = gameId;
    sessionStartTime = Date.now();
    playtimeTickInterval = setInterval(function() {
        if (activeGameId && sessionStartTime) {
            var elapsed = Date.now() - sessionStartTime;
            var prev = playtimeData[activeGameId] || 0;
            playtimeData[activeGameId] = prev + elapsed;
            sessionStartTime = Date.now();
            savePlaytime();
        }
    }, 10000);
}

function stopPlaytimeTracking() {
    if (activeGameId && sessionStartTime) {
        var elapsed = Date.now() - sessionStartTime;
        var prev = playtimeData[activeGameId] || 0;
        playtimeData[activeGameId] = prev + elapsed;
        savePlaytime();
    }
    if (playtimeTickInterval) { clearInterval(playtimeTickInterval); playtimeTickInterval = null; }
    activeGameId = null;
    sessionStartTime = null;
}

function formatPlaytime(ms) {
    if (!ms || ms < 1000) return '';
    var totalSec = Math.floor(ms / 1000);
    if (totalSec < 60) return totalSec + 's';
    var totalMin = Math.floor(totalSec / 60);
    if (totalMin < 60) return totalMin + 'm';
    var hrs = Math.floor(totalMin / 60);
    var mins = totalMin % 60;
    if (hrs < 24) return hrs + 'h ' + mins + 'm';
    var days = Math.floor(hrs / 24);
    var remHrs = hrs % 24;
    return days + 'd ' + remHrs + 'h';
}

function getPlaytimeForGame(gameId) { return playtimeData[gameId] || 0; }

function loadRecentlyPlayed() { try { var s = localStorage.getItem('emulatorHubRecent'); if (s) recentlyPlayed = JSON.parse(s); } catch(e) { recentlyPlayed = []; } }
function saveRecentlyPlayed() { localStorage.setItem('emulatorHubRecent', JSON.stringify(recentlyPlayed)); }

function recordRecentPlay(gameId) {
    recentlyPlayed = recentlyPlayed.filter(function(r) { return r.id !== gameId; });
    recentlyPlayed.unshift({ id: gameId, timestamp: Date.now() });
    if (recentlyPlayed.length > 1) recentlyPlayed = recentlyPlayed.slice(0, 1);
    saveRecentlyPlayed();
}

function getRecentGames(searchTerm) {
    var validIds = {};
    games.forEach(function(g) { validIds[g.id] = true; });
    return recentlyPlayed
        .filter(function(r) { return validIds[r.id]; })
        .map(function(r) {
            var game = games.find(function(g) { return g.id === r.id; });
            return Object.assign({}, game, { lastPlayed: r.timestamp });
        })
        .filter(function(g) { return !searchTerm || g.name.toLowerCase().indexOf(searchTerm) !== -1; });
}

function formatTimeAgo(timestamp) {
    var diff = Date.now() - timestamp;
    var mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return mins + 'm ago';
    var hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + 'h ago';
    var days = Math.floor(hrs / 24);
    if (days < 7) return days + 'd ago';
    return Math.floor(days / 7) + 'w ago';
}

function openRoms() { document.getElementById('romsViewer').classList.add('active'); document.getElementById('romsIframe').src = ROMS_URL; }
function closeRoms() { document.getElementById('romsViewer').classList.remove('active'); setTimeout(function() { document.getElementById('romsIframe').src = 'about:blank'; }, 300); }

function openBrowse() {
    document.getElementById('browseOverlay').classList.add('active');
    document.getElementById('browseIframe').src = BROWSE_URL;
}
function closeBrowse() {
    document.getElementById('browseOverlay').classList.remove('active');
    setTimeout(function() { document.getElementById('browseIframe').src = 'about:blank'; }, 300);
}

function parseUrlForGameInfo(url) {
    if (!url || !url.trim()) return { name: null, ext: null, system: null };
    var decoded = url;
    try { decoded = decodeURIComponent(url); decoded = decodeURIComponent(decoded); } catch(e) { try { decoded = decodeURIComponent(url); } catch(e2) {} }
    var targetUrl = decoded;
    var httpMatches = decoded.match(/https?:\/\//g);
    if (httpMatches && httpMatches.length > 1) { targetUrl = decoded.substring(decoded.lastIndexOf('http')); }
    var pathPart = targetUrl;
    try { var u = new URL(targetUrl); pathPart = u.pathname + u.hash; } catch(e) { var si = targetUrl.indexOf('/', 10); if (si > 0) pathPart = targetUrl.substring(si); }
    try { pathPart = decodeURIComponent(pathPart); } catch(e) {}
    var ext = null, detectedSystem = null;
    var segments = pathPart.split(/[\/\\]/).filter(function(s) { return s.trim(); });
    var romExts = Object.keys(EXT_TO_SYSTEM);
    var bestFileSegment = null;
    for (var i = segments.length - 1; i >= 0; i--) {
        var seg = segments[i]; var dotIdx = seg.lastIndexOf('.');
        if (dotIdx > 0) {
            var segExt = seg.substring(dotIdx + 1).toLowerCase().replace(/[\?\#].*/, '');
            if (romExts.indexOf(segExt) !== -1 || ['zip','7z','rar'].indexOf(segExt) !== -1) {
                bestFileSegment = seg;
                if (romExts.indexOf(segExt) !== -1) { ext = segExt; detectedSystem = EXT_TO_SYSTEM[segExt]; }
                break;
            }
        }
    }
    if (!ext) { for (var j = 0; j < romExts.length; j++) { var re = romExts[j]; if (new RegExp('\\.(' + re + ')(?:[\\?\\#\\/]|$)', 'i').test(decoded)) { ext = re; detectedSystem = EXT_TO_SYSTEM[re]; break; } } }
    var gameName = null;
    if (bestFileSegment) { var n = bestFileSegment; var di = n.lastIndexOf('.'); if (di > 0) n = n.substring(0, di); gameName = cleanGameName(n); }
    if (!gameName || gameName.length < 3) {
        for (var k = segments.length - 1; k >= 0; k--) {
            var seg2 = segments[k];
            if (seg2.length > 3 && !seg2.match(/^(download|uploads?|files?|data|roms?|stable|cors)$/i)) {
                var n2 = seg2; var di2 = n2.lastIndexOf('.'); if (di2 > 0) n2 = n2.substring(0, di2);
                var cleaned = cleanGameName(n2); if (cleaned.length > 3) { gameName = cleaned; break; }
            }
        }
    }
    return { name: gameName, ext: ext, system: detectedSystem };
}

function cleanGameName(raw) {
    if (!raw) return '';
    var name = raw;
    name = name.replace(/[-_\.]+/g, ' ');
    name = name.replace(/\s*-?\s*[a-f0-9]{6,}$/i, '');
    name = name.replace(/\s*[\(\[](v[\d\.]+[^\)\]]*|hotfix\d*|rev\s*\d+|final|beta|alpha|usa|eur|jpn|world|en|unl)[\)\]]/gi, '');
    name = name.replace(/\s+v[\d][\d\.]*[\w-]*/gi, '');
    name = name.replace(/\s*[-\s]hotfix\d*/gi, '');
    name = name.replace(/\s*\([^)]*\)\s*/g, ' ');
    name = name.replace(/\s*\[[^\]]*\]\s*/g, ' ');
    name = name.replace(/\b[a-f0-9]{8,}\b/gi, '');
    name = name.replace(/\b20\d{4}\b/g, '');
    name = name.replace(/\s+/g, ' ').trim();
    name = name.split(' ').filter(function(w) { return w.length > 0; }).map(function(w) {
        if (w.length <= 4 && w === w.toUpperCase()) return w;
        if (w.match(/^\d+$/)) return w;
        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    }).join(' ');
    return name;
}

function onUrlInput() {
    var url = document.getElementById('gameUrl').value.trim();
    var nameInput = document.getElementById('gameName');
    var typeSelect = document.getElementById('gameType');
    var urlHint = document.getElementById('urlHint');
    var nameAutoBadge = document.getElementById('nameAutoBadge');
    var typeAutoBadge = document.getElementById('typeAutoBadge');
    var urlAutoBadge = document.getElementById('urlAutoBadge');
    nameAutoBadge.innerHTML = ''; typeAutoBadge.innerHTML = ''; urlAutoBadge.innerHTML = '';
    urlHint.textContent = ''; nameInput.classList.remove('auto-filled'); typeSelect.classList.remove('auto-filled');
    if (!url) return;
    var info = parseUrlForGameInfo(url);
    var dp = [];
    if (info.name && info.name.length > 1) { nameInput.value = info.name; nameInput.classList.add('auto-filled'); nameAutoBadge.innerHTML = '<span class="auto-detected-badge">Auto-detected</span>'; dp.push('name'); }
    if (info.system && CORE_MAP[info.system]) { typeSelect.value = info.system; typeSelect.classList.add('auto-filled'); typeAutoBadge.innerHTML = '<span class="auto-detected-badge">Auto-detected</span>'; dp.push('system'); }
    if (dp.length > 0) {
        urlAutoBadge.innerHTML = '<span class="auto-detected-badge">Parsed</span>';
        if (info.ext) {
            var sysLabel = info.system && CORE_MAP[info.system] ? CORE_MAP[info.system].label : '';
            urlHint.textContent = 'Detected: .' + info.ext + ' file' + (sysLabel ? ' (' + sysLabel + ')' : '');
        }
    }
}

function proxyIfNeeded(url) {
    var blocked = ['archive.org','ia601','ia801','ia901','ia802','ia902','ia600'];
    try {
        if (url.indexOf(PROXY_URL) === 0) return url;
        var targetUrl = url;
        var hm = url.match(/https?:\/\//g);
        if (hm && hm.length > 1) { var lh = url.lastIndexOf('http'); if (lh > 0) targetUrl = url.substring(lh); }
        var hostname = new URL(targetUrl).hostname;
        for (var i = 0; i < blocked.length; i++) { if (hostname.indexOf(blocked[i]) !== -1) return PROXY_URL + '/' + targetUrl; }
    } catch(e) {}
    return url;
}

function loadGames() { try { var s = localStorage.getItem('emulatorHubGames'); if (s) games = JSON.parse(s); } catch(e) { games = []; } }
function saveGames() { localStorage.setItem('emulatorHubGames', JSON.stringify(games)); }
function loadTheme() { var s = localStorage.getItem('emulatorHubTheme'); if (s) currentTheme = s; applyTheme(currentTheme); }
function saveTheme() { localStorage.setItem('emulatorHubTheme', currentTheme); }
function loadFavorites() { try { var s = localStorage.getItem('emulatorHubFavorites'); if (s) favorites = JSON.parse(s); } catch(e) { favorites = []; } }
function saveFavorites() { localStorage.setItem('emulatorHubFavorites', JSON.stringify(favorites)); }

function toggleFavorite(id, event) {
    event.stopPropagation();
    var idx = favorites.indexOf(id);
    if (idx === -1) {
        favorites.push(id);
        var game = games.find(function(g) { return g.id === id; });
        showNotification((game ? '"' + game.name + '"' : 'Game') + ' added to Favorites ⭐');
    } else {
        favorites.splice(idx, 1);
        var game2 = games.find(function(g) { return g.id === id; });
        showNotification((game2 ? '"' + game2.name + '"' : 'Game') + ' removed from Favorites');
    }
    saveFavorites();
    renderLibrary();
}

function toggleThemeDropdown() { var d = document.getElementById('themeDropdown'), b = document.getElementById('themeToggleBtn'); d.classList.toggle('open'); b.classList.toggle('open'); if (d.classList.contains('open')) setTimeout(function() { document.addEventListener('click', closeThemeOutside); }, 10); }
function closeThemeOutside(e) { if (!document.querySelector('.theme-dropdown-wrapper').contains(e.target)) { document.getElementById('themeDropdown').classList.remove('open'); document.getElementById('themeToggleBtn').classList.remove('open'); document.removeEventListener('click', closeThemeOutside); } }
function setTheme(theme) { currentTheme = theme; applyTheme(theme); saveTheme(); document.getElementById('themeDropdown').classList.remove('open'); document.getElementById('themeToggleBtn').classList.remove('open'); document.removeEventListener('click', closeThemeOutside); showNotification('Theme updated.'); initBackground(); }
function applyTheme(theme) { document.body.setAttribute('data-theme', theme); document.querySelectorAll('.theme-option').forEach(function(o) { o.classList.toggle('active', o.dataset.theme === theme); }); }

function openModal() {
    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById('gameName').value = ''; document.getElementById('gameUrl').value = '';
    document.getElementById('gameType').selectedIndex = 0; document.getElementById('urlHint').textContent = '';
    ['nameAutoBadge','typeAutoBadge','urlAutoBadge'].forEach(function(id) { document.getElementById(id).innerHTML = ''; });
    document.getElementById('gameName').classList.remove('auto-filled'); document.getElementById('gameType').classList.remove('auto-filled');
    setTimeout(function() { document.getElementById('gameUrl').focus(); }, 150);
}
function closeModal() { document.getElementById('modalOverlay').classList.remove('active'); }
function closeModalOutside(e) { if (e.target === document.getElementById('modalOverlay')) closeModal(); }
function showNotification(msg) { var n = document.createElement('div'); n.className = 'notification'; n.textContent = msg; document.body.appendChild(n); setTimeout(function() { n.remove(); }, 2700); }

function addGame() {
    var name = document.getElementById('gameName').value.trim();
    var url = document.getElementById('gameUrl').value.trim();
    var type = document.getElementById('gameType').value;
    if (!url) { showNotification('Please paste a game URL.'); document.getElementById('gameUrl').focus(); return; }
    if (!name) { showNotification('Please enter a game name.'); document.getElementById('gameName').focus(); return; }
    if (!type) { showNotification('Please select a platform.'); return; }
    games.push({ id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5), name: name, url: url, type: type, addedAt: Date.now() });
    saveGames(); closeModal(); renderLibrary();
    showNotification('"' + name + '" has been added.');
}

function deleteGame(id, event) {
    event.stopPropagation();
    var game = games.find(function(g) { return g.id === id; });
    if (game && confirm('Remove "' + game.name + '"?')) {
        games = games.filter(function(g) { return g.id !== id; });
        favorites = favorites.filter(function(f) { return f !== id; });
        recentlyPlayed = recentlyPlayed.filter(function(r) { return r.id !== id; });
        delete playtimeData[id];
        saveGames(); saveFavorites(); saveRecentlyPlayed(); savePlaytime(); renderLibrary();
        showNotification('"' + game.name + '" removed.');
    }
}

function buildGameCardHtml(game) {
    var info = CORE_MAP[game.type] || { label: game.type };
    var isFav = favorites.indexOf(game.id) !== -1;
    var pt = getPlaytimeForGame(game.id);
    var ptText = formatPlaytime(pt);
    var hasPt = pt >= 1000;
    var playtimeBadge = hasPt ? '<span class="game-card-playtime">' + CLOCK_SVG_SMALL + ' ' + ptText + '</span>' : '';
    return '<div class="game-card' + (isFav ? ' is-fav-card' : '') + '" onclick="launchGame(\'' + game.id + '\')" title="' + escapeHtml(game.name) + (hasPt ? '\n⏱ ' + ptText : '') + '">' +
        '<button class="game-card-fav' + (isFav ? ' is-fav' : '') + '" onclick="toggleFavorite(\'' + game.id + '\',event)" title="' + (isFav ? 'Remove from favorites' : 'Add to favorites') + '">★</button>' +
        '<button class="game-card-delete" onclick="deleteGame(\'' + game.id + '\',event)" title="Remove"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
        '<div class="game-card-art"><div class="game-card-art-icon">' + getCardIcon(game.type) + '</div><div class="game-card-play-overlay"><div class="play-icon"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" fill="white"/></svg></div></div></div>' +
        '<div class="game-card-info"><div class="game-card-title">' + escapeHtml(game.name) + '</div><div class="game-card-meta"><span class="game-card-type-badge">' + info.label + '</span>' + playtimeBadge + '</div></div></div>';
}

function renderLibrary() {
    var library = document.getElementById('gamesLibrary');
    var emptyState = document.getElementById('emptyState');
    var countBar = document.getElementById('gameCountBar');
    var searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();

    if (games.length === 0) { emptyState.style.display = 'flex'; countBar.style.display = 'none'; library.innerHTML = ''; return; }
    emptyState.style.display = 'none';

    var matchCount = 0;
    var groups = {};
    games.forEach(function(game) {
        if (searchTerm && game.name.toLowerCase().indexOf(searchTerm) === -1) return;
        if (!groups[game.type]) groups[game.type] = [];
        groups[game.type].push(game);
        matchCount++;
    });

    Object.keys(groups).forEach(function(type) { groups[type].sort(function(a, b) { return a.name.localeCompare(b.name); }); });

    var sortedTypes = Object.keys(groups).sort(function(a, b) {
        var la = CORE_MAP[a] ? CORE_MAP[a].label : a;
        var lb = CORE_MAP[b] ? CORE_MAP[b].label : b;
        return la.localeCompare(lb);
    });

    var favGames = games.filter(function(g) { return favorites.indexOf(g.id) !== -1 && (!searchTerm || g.name.toLowerCase().indexOf(searchTerm) !== -1); });
    var recentGames = getRecentGames(searchTerm);

    var totalPlaytime = 0;
    Object.keys(playtimeData).forEach(function(k) { totalPlaytime += playtimeData[k]; });

    if (matchCount > 0) {
        countBar.style.display = 'flex';
        var pills = '<div class="count-pill"><strong>' + matchCount + '</strong> game' + (matchCount !== 1 ? 's' : '') + '</div>';
        pills += '<div class="count-pill"><strong>' + sortedTypes.length + '</strong> categor' + (sortedTypes.length !== 1 ? 'ies' : 'y') + '</div>';
        if (favGames.length) pills += '<div class="count-pill">⭐ <strong>' + favGames.length + '</strong> favorited</div>';
        if (totalPlaytime >= 1000) pills += '<div class="count-pill">⏱ <strong>' + formatPlaytime(totalPlaytime) + '</strong> total</div>';
        if (searchTerm) pills += '<div class="count-pill">Searching: "<strong>' + escapeHtml(searchTerm) + '</strong>"</div>';
        countBar.innerHTML = pills;
    } else {
        countBar.style.display = 'none';
    }

    if (sortedTypes.length === 0 && searchTerm) {
        library.innerHTML = '<div style="text-align:center;padding:80px 0;opacity:0.5;"><p style="font-size:16px;color:var(--text-muted);">No games match "<strong style="color:var(--accent)">' + escapeHtml(searchTerm) + '</strong>"</p></div>';
        return;
    }

    var html = '';
    var sectionIdx = 0;

    if (recentGames.length > 0) {
        var CLOCK_ICON = '<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
        html += '<div class="category-section recent-section" style="animation-delay:' + (sectionIdx * 0.06) + 's"><div class="category-header"><div class="category-icon">' + CLOCK_ICON + '</div><h2>🕐 Recently Played</h2><div class="category-badge">' + formatTimeAgo(recentGames[0].lastPlayed) + '</div></div><div class="games-row">';
        recentGames.forEach(function(game) { html += buildGameCardHtml(game); });
        html += '</div></div>';
        sectionIdx++;
    }

    if (favGames.length > 0) {
        var FAV_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
        html += '<div class="category-section favorites-section" style="animation-delay:' + (sectionIdx * 0.06) + 's"><div class="category-header"><div class="category-icon">' + FAV_ICON + '</div><h2>⭐ Favorites</h2><div class="category-badge">' + favGames.length + ' game' + (favGames.length !== 1 ? 's' : '') + '</div></div><div class="games-row">';
        favGames.forEach(function(game) { html += buildGameCardHtml(game); });
        html += '</div></div>';
        sectionIdx++;
    }

    sortedTypes.forEach(function(type, idx) {
        var info = CORE_MAP[type] || { label: type };
        var gl = groups[type];
        html += '<div class="category-section" style="animation-delay:' + ((sectionIdx + idx) * 0.06) + 's"><div class="category-header"><div class="category-icon">' + getCategoryIcon(type) + '</div><h2>' + info.label + '</h2><div class="category-badge">' + gl.length + ' game' + (gl.length !== 1 ? 's' : '') + '</div></div><div class="games-row">';
        gl.forEach(function(game) { html += buildGameCardHtml(game); });
        html += '</div></div>';
    });

    library.innerHTML = html;
}

function escapeHtml(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
function filterGames() { renderLibrary(); }

function launchGame(id) {
    var game = games.find(function(g) { return g.id === id; });
    if (!game) return;
    recordRecentPlay(id);
    startPlaytimeTracking(id);
    if (game.type === 'flash') { launchFlash(game); } else { launchEmulator(game); }
}

function launchFlash(game) {
    var finalUrl = proxyIfNeeded(game.url);
    document.getElementById('flashPlayerTitle').textContent = game.name;
    document.getElementById('flashPlayerView').classList.add('active');
    var container = document.getElementById('flashRufflePlayer');
    container.innerHTML = '';
    try {
        var ruffle = window.RufflePlayer.newest();
        var player = ruffle.createPlayer();
        player.style.width = '100%';
        player.style.height = '100%';
        container.appendChild(player);
        rufflePlayerInstance = player;
        player.ruffle().load({
            url: finalUrl, autoplay: 'on', unmuteOverlay: 'visible', letterbox: 'on',
            contextMenu: 'on', quality: 'high', allowScriptAccess: false,
            upgradeToHttps: window.location.protocol === 'https:', allowFullscreen: true,
        }).then(function() {
            showNotification('Flash game loaded successfully.');
        }).catch(function(e) {
            showNotification('Failed to load Flash game.');
            console.error('Ruffle load error:', e);
        });
    } catch(e) {
        showNotification('Ruffle failed to initialize.');
        console.error('Ruffle init error:', e);
    }
}

function exitFlash() {
    stopPlaytimeTracking();
    document.getElementById('flashPlayerView').classList.remove('active');
    if (rufflePlayerInstance) { try { rufflePlayerInstance.remove(); } catch(e) {} rufflePlayerInstance = null; }
    document.getElementById('flashRufflePlayer').innerHTML = '';
    renderLibrary();
}

function launchEmulator(game) {
    var info = CORE_MAP[game.type] || { core: game.type, label: game.type };
    document.getElementById('gamePlayerTitle').textContent = game.name;
    document.getElementById('gamePlayerView').classList.add('active');
    var container = document.getElementById('gameContainer');
    container.innerHTML = '<div id="game" style="width:100%;height:100%;"></div>';
    var finalUrl = proxyIfNeeded(game.url);
    var cfg = document.createElement('script');
    cfg.textContent = 'EJS_player="#game";EJS_core="' + info.core + '";EJS_gameName="' + game.name.replace(/"/g, '\\"') + '";EJS_color="#0064ff";EJS_pathtodata="https://cdn.emulatorjs.org/stable/data/";EJS_gameUrl="' + finalUrl.replace(/"/g, '\\"') + '";' + (game.type === 'psx' ? 'EJS_biosUrl="https://cors-anywhere-k7fg.onrender.com/https://archive.org/download/PlayStationBIOSFilesNAEUJP/scph5501.bin";' : '');
    container.appendChild(cfg);
    var loader = document.createElement('script');
    loader.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    container.appendChild(loader);
}

function exitGame() {
    stopPlaytimeTracking();
    var iframe = document.querySelector('#gameContainer iframe');
    if (iframe) { try { iframe.contentWindow.postMessage({ action: 'stop' }, '*'); iframe.src = 'about:blank'; } catch(e) {} }
    document.getElementById('gamePlayerView').classList.remove('active');
    document.getElementById('gameContainer').innerHTML = '';
    try { if (typeof EJS_stop === 'function') EJS_stop(); } catch(e) {}
    try { delete window.EJS_player; delete window.EJS_core; delete window.EJS_gameName; delete window.EJS_gameUrl; delete window.EJS_emulator; delete window.EJS_biosUrl; } catch(e) {}
    try { document.querySelectorAll('audio').forEach(function(a) { a.pause(); a.src = ''; }); } catch(e) {}
    renderLibrary();
}

function initBackground() {
    var canvas = document.getElementById('bgCanvas'), ctx = canvas.getContext('2d');
    var w, h, particles = [], animId;
    function getAccent() { return getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#0064ff'; }
    function hexToRgb(hex) { hex = hex.replace('#',''); if (hex.length===3) hex=hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]; return{r:parseInt(hex.substring(0,2),16),g:parseInt(hex.substring(2,4),16),b:parseInt(hex.substring(4,6),16)}; }
    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    function createParticles() { particles = []; var c = Math.min(Math.floor((w*h)/20000),70); for(var i=0;i<c;i++) particles.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-0.5)*0.35,vy:(Math.random()-0.5)*0.35,r:Math.random()*1.8+0.4,alpha:Math.random()*0.35+0.08}); }
    function draw() { ctx.clearRect(0,0,w,h); var accent = hexToRgb(getAccent()); var md = 130; particles.forEach(function(p,i) { p.x+=p.vx;p.y+=p.vy; if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0; ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba('+accent.r+','+accent.g+','+accent.b+','+p.alpha+')';ctx.fill(); for(var j=i+1;j<particles.length;j++){var q=particles[j];var dx=p.x-q.x,dy=p.y-q.y,dist=Math.sqrt(dx*dx+dy*dy);if(dist<md){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle='rgba('+accent.r+','+accent.g+','+accent.b+','+(0.05*(1-dist/md))+')';ctx.lineWidth=0.5;ctx.stroke();}}}); animId=requestAnimationFrame(draw); }
    if(animId)cancelAnimationFrame(animId); resize();createParticles();draw();
    window.addEventListener('resize',function(){resize();createParticles();});
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (document.getElementById('flashPlayerView').classList.contains('active')) { exitFlash(); }
        else if (document.getElementById('browseOverlay').classList.contains('active')) { closeBrowse(); }
        else if (document.getElementById('romsViewer').classList.contains('active')) { closeRoms(); }
        else if (document.getElementById('modalOverlay').classList.contains('active')) { closeModal(); }
        else if (document.getElementById('gamePlayerView').classList.contains('active')) { exitGame(); }
        else if (document.getElementById('themeDropdown').classList.contains('open')) { document.getElementById('themeDropdown').classList.remove('open'); document.getElementById('themeToggleBtn').classList.remove('open'); }
    }
});

window.addEventListener('beforeunload', function() {
    stopPlaytimeTracking();
});

loadGames();
loadFavorites();
loadRecentlyPlayed();
loadPlaytime();
loadTheme();
renderLibrary();
initBackground();
