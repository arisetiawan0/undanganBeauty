/**
 * Admin Dashboard Logic
 * Mengelola autentikasi, statistik, dan tabel daftar tamu
 */

const SESSION_KEY = 'beauty-raha-admin-session';
const ADMIN_PASSWORD = 'admin123'; // Password statis seperti yang diminta

// DOM Elements
const loginContainer = document.getElementById('loginContainer');
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('passwordInput');
const loginButton = document.getElementById('loginButton');
const loginError = document.getElementById('loginError');

const dashboard = document.getElementById('dashboard');
const logoutBtn = document.getElementById('logoutBtn');
const refreshBtn = document.getElementById('refreshBtn');
const exportBtn = document.getElementById('exportBtn');
const searchInput = document.getElementById('searchInput');
const loadingOverlay = document.getElementById('loadingOverlay');
const toast = document.getElementById('toast');
const tableBody = document.getElementById('tableBody');
const emptyState = document.getElementById('emptyState');

const statBrands = document.getElementById('statBrands');
const statGuests = document.getElementById('statGuests');
const statResponses = document.getElementById('statResponses');

// State
let allEntries = [];
let currentSort = { field: 'id', direction: 'desc' };
let currentPassword = '';

// Initialize
function init() {
    // Check for existing session
    const session = sessionStorage.getItem(SESSION_KEY);
    if (session) {
        try {
            const sessionData = JSON.parse(session);
            if (sessionData.authenticated && sessionData.password) {
                currentPassword = sessionData.password;
                showDashboard();
                loadData();
            }
        } catch (e) {
            console.error('Invalid session data');
        }
    }

    // Event listeners
    loginForm?.addEventListener('submit', handleLogin);
    logoutBtn?.addEventListener('click', handleLogout);
    refreshBtn?.addEventListener('click', loadData);
    exportBtn?.addEventListener('click', handleExport);
    searchInput?.addEventListener('input', handleSearch);

    // Sorting
    document.querySelectorAll('th.sortable').forEach(th => {
        th.addEventListener('click', () => handleSort(th.dataset.sort));
    });
}

// Login Handler
async function handleLogin(e) {
    e.preventDefault();
    
    const password = passwordInput.value.trim();
    loginError.textContent = '';
    loginButton.disabled = true;
    loginButton.textContent = 'Memeriksa...';

    if (password === ADMIN_PASSWORD) {
        // Save session
        currentPassword = password;
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({
            authenticated: true,
            password: password,
            timestamp: new Date().toISOString()
        }));

        showDashboard();
        loadData();
    } else {
        loginError.textContent = 'Password salah. Silakan coba lagi.';
        passwordInput.value = '';
        passwordInput.focus();
    }

    loginButton.disabled = false;
    loginButton.textContent = 'Masuk';
}

// Logout Handler
function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    currentPassword = '';
    loginContainer.style.display = 'flex';
    dashboard.style.display = 'none';
    passwordInput.value = '';
    showToast('Anda telah logout');
}

// Show Dashboard
function showDashboard() {
    loginContainer.style.display = 'none';
    dashboard.style.display = 'block';
}

// Load Data
async function loadData() {
    showLoading(true);
    
    try {
        // Load stats
        const statsResult = await window.RSVPAPI.getRSVPStats(currentPassword);
        if (statsResult.success) {
            updateStats(statsResult.data);
        } else {
            showToast(statsResult.error || 'Gagal memuat statistik');
        }

        // Load entries
        const listResult = await window.RSVPAPI.getRSVPList(currentPassword);
        if (listResult.success) {
            allEntries = listResult.data || [];
            renderTable(allEntries);
        } else {
            if (listResult.error?.includes('Unauthorized')) {
                handleLogout();
                showToast('Sesi habis. Silakan login kembali.');
            } else {
                showToast(listResult.error || 'Gagal memuat data');
            }
        }
    } catch (error) {
        console.error('Load data error:', error);
        showToast('Terjadi kesalahan saat memuat data');
    } finally {
        showLoading(false);
    }
}

// Update Statistics
function updateStats(stats) {
    statBrands.textContent = stats.totalBrands || 0;
    statGuests.textContent = stats.totalGuests || 0;
    statResponses.textContent = stats.totalResponses || 0;
}

// Render Table
function renderTable(entries) {
    if (entries.length === 0) {
        tableBody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    
    // Sort entries
    const sorted = sortEntries(entries);
    
    tableBody.innerHTML = sorted.map((entry, index) => {
        const guestNames = entry.guestNames || [];
        const namesHtml = guestNames.map(name => 
            `<span class="guest-badge">${escapeHtml(name)}</span>`
        ).join('');
        
        const timestamp = new Date(entry.createdAt).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <tr>
                <td>${entry.id}</td>
                <td><strong>${escapeHtml(entry.brandName)}</strong></td>
                <td class="hide-mobile">${entry.guestCount}</td>
                <td>
                    <div class="guest-names-list">
                        ${namesHtml}
                    </div>
                </td>
                <td class="timestamp">${timestamp}</td>
            </tr>
        `;
    }).join('');
}

// Sort Entries
function sortEntries(entries) {
    return [...entries].sort((a, b) => {
        let aVal = a[currentSort.field];
        let bVal = b[currentSort.field];

        // Handle dates
        if (currentSort.field === 'createdAt') {
            aVal = new Date(aVal).getTime();
            bVal = new Date(bVal).getTime();
        }

        // Handle strings
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }

        if (aVal < bVal) return currentSort.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return currentSort.direction === 'asc' ? 1 : -1;
        return 0;
    });
}

// Handle Sort
function handleSort(field) {
    // Update sort direction
    if (currentSort.field === field) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.field = field;
        currentSort.direction = 'asc';
    }

    // Update UI
    document.querySelectorAll('th.sortable').forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
        if (th.dataset.sort === field) {
            th.classList.add(currentSort.direction === 'asc' ? 'sort-asc' : 'sort-desc');
        }
    });

    // Re-render
    const filtered = filterEntries(allEntries, searchInput.value);
    renderTable(filtered);
}

// Handle Search
function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const filtered = filterEntries(allEntries, query);
    renderTable(filtered);
}

// Filter Entries
function filterEntries(entries, query) {
    if (!query) return entries;
    
    return entries.filter(entry => {
        const brandMatch = entry.brandName?.toLowerCase().includes(query);
        const namesMatch = entry.guestNames?.some(name => 
            name.toLowerCase().includes(query)
        );
        return brandMatch || namesMatch;
    });
}

// Handle Export
async function handleExport() {
    showLoading(true);
    
    const result = await window.RSVPAPI.exportRSVPToCSV(currentPassword);
    
    if (!result.success) {
        showToast(result.error || 'Gagal mengeksport data');
    } else {
        showToast('File CSV berhasil diunduh');
    }
    
    showLoading(false);
}

// Utility: Show Loading
function showLoading(show) {
    loadingOverlay.classList.toggle('active', show);
}

// Utility: Show Toast
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => {
        toast.classList.remove('visible');
    }, 3000);
}

// Utility: Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
