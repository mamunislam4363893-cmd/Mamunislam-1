
                        // DEBUG: Check if modals exist
                        console.log('[DEBUG] Checking modals on load...');
                        console.log('[DEBUG] modal-createCode:', document.getElementById('modal-createCode'));
                        console.log('[DEBUG] modal-createTask:', document.getElementById('modal-createTask'));

                        // Force page visibility override
                        const style = document.createElement('style');
                        style.textContent = '.page.active { display: block !important; }';
                        document.head.appendChild(style);

                        // TEMP DEBUG: Force display
                        setTimeout(() => {
                            const p = document.getElementById('page-broadcast');
                            if(p) { p.style.display = 'block'; p.classList.add('active'); console.log('[DEBUG] Forced broadcast visibility'); }
                        }, 2000);

                        // Global error handler - shows errors on screen
                        window.onerror = function (msg, url, line, col, error) {
                            console.error('[GLOBAL ERROR]', msg, 'at line', line, 'in', url);
                            let errorDiv = document.getElementById('jsErrorDisplay');
                            if (!errorDiv) {
                                errorDiv = document.createElement('div');
                                errorDiv.id = 'jsErrorDisplay';
                                errorDiv.style.cssText = 'position:fixed;top:0;left:0;right:0;background:red;color:white;padding:10px;z-index:99999;font-family:monospace;white-space:pre-wrap;';
                                document.body.appendChild(errorDiv);
                            }
                            errorDiv.textContent += '\nERROR: ' + msg + ' at line ' + line;
                            return false;
                        };

                        // Emergency page display function
                        window.emergencyShowPage = function (pageId) {
                            console.log('[EMERGENCY] Showing page:', pageId);
                            const page = document.getElementById('page-' + pageId);
                            if (page) {
                                // Hide all pages
                                document.querySelectorAll('.page').forEach(p => {
                                    p.style.display = 'none';
                                    p.classList.remove('active');
                                });
                                // Show target page
                                page.style.display = 'block';
                                page.classList.add('active');
                                console.log('[EMERGENCY] Page shown:', pageId);
                                alert('Page ' + pageId + ' should now be visible');
                            } else {
                                console.error('[EMERGENCY] Page not found:', pageId);
                                alert('ERROR: Page ' + pageId + ' not found in HTML');
                            }
                        };

                        // Admin token (optional). Panel runs in no-login mode, so keep a safe fallback.
                        // If you later add login, set this value from /api/admin/login.
                        const ADMIN_TOKEN = '';

                        // AUTO INITIALIZE (No Login)
                        document.addEventListener('DOMContentLoaded', () => {
                            init();
                        });

                        // Mobile touch support for navigation - CRITICAL FIX
                        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
                        if (isTouchDevice) {
                            console.log('[MOBILE] Touch device detected, adding touch handlers');

                            document.querySelectorAll('.nav-item').forEach((item, index) => {
                                // Remove and re-add to ensure clean handlers
                                const newItem = item.cloneNode(true);
                                item.parentNode.replaceChild(newItem, item);

                                // Add both click and touchend handlers
                                newItem.addEventListener('click', function (e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const onclickAttr = this.getAttribute('onclick');
                                    if (onclickAttr) {
                                        const match = onclickAttr.match(/nav\('([^']+)'\)/);
                                        if (match) {
                                            console.log('[MOBILE] Click nav:', match[1]);
                                            nav(match[1]);
                                        } else if (onclickAttr.includes('logout')) {
                                            logout();
                                        }
                                    }
                                });
                            });
                        }

                        function logout() { location.reload(); }

                        // ==================== NAVIGATION ====================
                        const PAGE_TITLES = {
                            'dashboard': 'Dashboard',
                            'users': 'Users',
                            'deposits': 'Deposits',
                            'history': 'History',
                            'broadcast': 'Broadcast',
                            'adnetworks': 'Ad Networks',
                            'providers': 'Providers',
                            'groups': 'Group Management',
                            'settings': 'Settings',
                            'costmanage': 'Cost Management',
                            'tasks': 'Tasks',
                            'codes': 'Promo Codes',
                            'buttons': 'Button Management',
                            'itemsales': 'Item Sales',
                            'services': 'Services',
                            'shopmanage': 'Shop Items',
                            'database': 'Database Management',
                            'cards': 'Cards',
                            'db': 'Database'
                        };



                        function loadCodes() {
                            console.log('[Codes] Promo codes loader not implemented yet');
                        }

                        function loadTasks() {
                            console.log('[Tasks] Tasks loader not implemented yet');
                        }

                        function loadAllCosts() {
                            console.log('[CostManage] Cost management loader not implemented yet');
                        }

                        function loadFeatureFlags() {
                            console.log('[Buttons] Feature flags loader not implemented yet');
                        }

                        function loadItemSales() {
                            console.log('[ItemSales] Item sales loader not implemented yet');
                        }

                        function loadCards() {
                            console.log('[Cards] Cards loader not implemented yet');
                        }

                        function loadApiKeys() {
                            console.log('[Settings] API keys loader not implemented yet');
                        }

                        function loadCryptoConfig() {
                            console.log('[Settings] Crypto config loader not implemented yet');
                        }

                        // Broadcast page loader - loads broadcast history and settings
                        async function loadBroadcast() {
                            console.log('[Broadcast] Loading broadcast page...');
                            const container = document.getElementById('broadcastHistory');

                            // Show initial state immediately
                            if (container) {
                                container.innerHTML = '<p class="text-gray-400 text-sm">Loading history...</p>';
                            }

                            try {
                                const res = await fetch('/api/admin/broadcasts');
                                const data = await res.json();

                                if (!container) {
                                    console.error('[Broadcast] Container not found');
                                    return;
                                }

                                if (data.success) {
                                    const broadcasts = data.broadcasts || [];
                                    if (broadcasts.length === 0) {
                                        container.innerHTML = '<p class="text-gray-400 text-sm">No broadcasts yet</p>';
                                    } else {
                                        container.innerHTML = broadcasts.map(b => `
                                        <div class="glass-card p-4 rounded-xl mb-3">
                                            <div class="flex justify-between items-start">
                                                <div>
                                                    <p class="font-medium">${b.message || 'No message'}</p>
                                                    <p class="text-sm text-gray-400">${new Date(b.createdAt).toLocaleString()}</p>
                                                </div>
                                                <span class="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">${b.status || 'Sent'}</span>
                                            </div>
                                        </div>
                                    `).join('');
                                    }
                                } else {
                                    container.innerHTML = '<p class="text-gray-400 text-sm">No broadcasts yet</p>';
                                }
                            } catch (e) {
                                console.error('[Broadcast] Error loading:', e);
                                if (container) {
                                    container.innerHTML = '<p class="text-gray-400 text-sm">No broadcasts yet</p>';
                                }
                            }
                        }

                        // Groups page loader - loads group management settings
                        async function loadGroupSettings() {
                            console.log('[Groups] Loading group management page...');

                            // Show loading status
                            const statusEl = document.getElementById('groupManagementStatus');
                            if (statusEl) {
                                statusEl.textContent = 'Loading group settings...';
                                statusEl.className = 'text-xs text-blue-400 mt-3';
                            }

                            try {
                                // Try to load settings from API if available
                                const res = await fetch('/api/admin/group-settings');
                                const data = await res.json();

                                if (data.success && data.settings) {
                                    // Apply loaded settings to form elements
                                    const settings = data.settings;
                                    const checkboxes = [
                                        'gm_autoDeleteSystemMessages',
                                        'gm_welcomeMessage',
                                        'gm_deleteTitleChanged',
                                        'gm_deleteGroupPhotoChanged',
                                        'gm_deletePinMessages',
                                        'gm_deleteVideoChatStarted',
                                        'gm_deleteVideoChatEnded',
                                        'gm_deleteUserLinks',
                                        'gm_deleteMentionsHashtags',
                                        'gm_deleteDmSolicitations',
                                        'gm_enableWarningSystem',
                                        'gm_enableBanCommand'
                                    ];

                                    checkboxes.forEach(id => {
                                        const el = document.getElementById(id);
                                        if (el && settings[id] !== undefined) {
                                            el.checked = settings[id];
                                        }
                                    });

                                    // Text fields
                                    const welcomeMsg = document.getElementById('gm_welcomeMessageText');
                                    if (welcomeMsg && settings.gm_welcomeMessageText) {
                                        welcomeMsg.value = settings.gm_welcomeMessageText;
                                    }

                                    const warningMsg = document.getElementById('gm_warningMessage');
                                    if (warningMsg && settings.gm_warningMessage) {
                                        warningMsg.value = settings.gm_warningMessage;
                                    }

                                    const banCmd = document.getElementById('gm_banCommand');
                                    if (banCmd && settings.gm_banCommand) {
                                        banCmd.value = settings.gm_banCommand;
                                    }
                                }

                                if (statusEl) {
                                    statusEl.textContent = 'Group settings loaded';
                                    statusEl.className = 'text-xs text-green-400 mt-3';
                                    setTimeout(() => statusEl.textContent = '', 3000);
                                }
                            } catch (e) {
                                console.log('[Groups] Using default settings (API not available)');
                                if (statusEl) {
                                    statusEl.textContent = '';
                                }
                            }

                            // The HTML content is already in the page - no need to dynamically render
                            console.log('[Groups] Page loaded successfully');
                        }

                        // Services page loader - loads service categories from API
                        async function loadServices() {
                            console.log('[Services] Loading services page...');
                            try {
                                const res = await fetch('/api/admin/services');
                                const data = await res.json();
                                const container = document.getElementById('serviceItemsGrid');
                                if (container && data.success) {
                                    const services = data.services || [];
                                    if (services.length === 0) {
                                        container.innerHTML = '<div class="text-center py-8 text-gray-400 col-span-4"><i class="fas fa-inbox text-4xl mb-3 opacity-50"></i><p>No services configured yet</p></div>';
                                    } else {
                                        container.innerHTML = services.map(s => `
                                        <div class="service-item-box bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4 cursor-pointer hover:scale-105 transition-all group" data-item="${s.id}" onclick="console.log('Service: ${s.id}')">
                                            <div class="text-center">
                                                <i class="fas ${s.icon || 'fa-cube'} text-2xl mb-2 text-blue-400 block"></i>
                                                <h4 class="font-bold text-sm">${s.name}</h4>
                                                <p class="text-xs text-gray-400">$${s.price || 0} TC</p>
                                            </div>
                                        </div>
                                    `).join('');
                                    }
                                } else {
                                    console.error('[Services] Container not found or invalid data');
                                }
                            } catch (e) {
                                console.error('[Services] Error loading:', e);
                            }
                        }

                        // Shop items loader - loads shop items from API
                        async function loadShopItems() {
                            console.log('[Shop] Loading shop items page...');
                            try {
                                const res = await fetch('/api/admin/shop');
                                const data = await res.json();
                                const container = document.getElementById('shopItemsContainer');
                                if (container && data.success) {
                                    const items = data.items || [];
                                    if (items.length === 0) {
                                        container.innerHTML = '<div class="text-center py-8 text-gray-400"><i class="fas fa-shopping-bag text-4xl mb-3 opacity-50"></i><p>No shop items yet</p></div>';
                                    } else {
                                        container.innerHTML = items.map(item => `
                                        <div class="glass-card p-4 rounded-xl border border-white/10 hover:border-orange-500/50 transition-all">
                                            <div class="flex items-center justify-between mb-3">
                                                <div class="flex items-center gap-3">
                                                    <div class="w-10 h-10 rounded-lg bg-gradient-to-br ${item.color || 'from-green-500 to-blue-600'} flex items-center justify-center">
                                                        <i class="fas ${item.icon || 'fa-shopping-bag'} text-white"></i>
                                                    </div>
                                                    <div>
                                                        <h4 class="font-bold">${item.name}</h4>
                                                        <p class="text-xs text-gray-400">${item.id}</p>
                                                    </div>
                                                </div>
                                                <div class="flex gap-2">
                                                    <button onclick="editShopItem('${item.id}')" class="text-blue-400 hover:text-blue-300"><i class="fas fa-edit"></i></button>
                                                    <button onclick="deleteShopItem('${item.id}')" class="text-red-400 hover:text-red-300"><i class="fas fa-trash"></i></button>
                                                </div>
                                            </div>
                                            <p class="text-sm text-gray-400 mb-2">${item.desc || 'No description'}</p>
                                            <span class="text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-400">${item.price || 0} TC</span>
                                        </div>
                                    `).join('');
                                    }
                                }
                            } catch (e) {
                                console.error('[Shop] Error loading:', e);
                            }
                            // Also try the other shop function if it exists
                            if (typeof loadShopManage === 'function') loadShopManage();
                        }

                        // Database management loader - loads database stats
                        async function loadDatabaseManagement() {
                            console.log('[Database] Loading database management page...');
                            try {
                                const res = await fetch('/api/admin/database/stats');
                                const data = await res.json();
                                const container = document.getElementById('databaseStatsContainer');
                                if (container && data.success) {
                                    container.innerHTML = `
                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                        <div class="glass-card p-6 rounded-2xl">
                                            <h3 class="text-sm text-gray-400 mb-2">Total Users</h3>
                                            <p class="text-2xl font-bold text-blue-400">${data.totalUsers || 0}</p>
                                        </div>
                                        <div class="glass-card p-6 rounded-2xl">
                                            <h3 class="text-sm text-gray-400 mb-2">Database Size</h3>
                                            <p class="text-2xl font-bold text-green-400">${data.dbSize || '0 MB'}</p>
                                        </div>
                                        <div class="glass-card p-6 rounded-2xl">
                                            <h3 class="text-sm text-gray-400 mb-2">Last Backup</h3>
                                            <p class="text-2xl font-bold text-orange-400">${data.lastBackup || 'Never'}</p>
                                        </div>
                                    </div>
                                `;
                                }
                            } catch (e) {
                                console.error('[Database] Error loading:', e);
                            }
                            // Also try the other database function if it exists
                            if (typeof loadDatabaseConfig === 'function') loadDatabaseConfig();
                        }

                        // Cards page loader - loads cards data
                        async function loadCards() {
                            console.log('[Cards] Loading cards page...');
                            try {
                                const res = await fetch('/api/admin/cards');
                                const data = await res.json();
                                const container = document.getElementById('cardsContainer');
                                if (container && data.success) {
                                    const cards = data.cards || [];
                                    if (cards.length === 0) {
                                        container.innerHTML = '<div class="text-center py-8 text-gray-400"><i class="fas fa-credit-card text-4xl mb-3 opacity-50"></i><p>No cards configured yet</p></div>';
                                    } else {
                                        container.innerHTML = cards.map(c => `
                                        <div class="glass-card p-4 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all">
                                            <div class="flex items-center justify-between mb-3">
                                                <div class="flex items-center gap-3">
                                                    <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                                                        <i class="fas fa-credit-card text-white"></i>
                                                    </div>
                                                    <div>
                                                        <h4 class="font-bold">${c.name || 'Card'}</h4>
                                                        <p class="text-xs text-gray-400">${c.id}</p>
                                                    </div>
                                                </div>
                                                <div class="flex gap-2">
                                                    <button onclick="editCard('${c.id}')" class="text-blue-400 hover:text-blue-300"><i class="fas fa-edit"></i></button>
                                                    <button onclick="deleteCard('${c.id}')" class="text-red-400 hover:text-red-300"><i class="fas fa-trash"></i></button>
                                                </div>
                                            </div>
                                            <span class="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">${c.status || 'Active'}</span>
                                        </div>
                                    `).join('');
                                    }
                                }
                            } catch (e) {
                                console.error('[Cards] Error loading:', e);
                            }
                            // Also try the other cards function if it exists
                            if (typeof loadCardsData === 'function') loadCardsData();
                        }

                        // Toggle collapsible sections (Cost Management, API Keys, etc.)
                        function toggleSection(sectionId) {
                            const content = document.getElementById(sectionId);
                            const icon = document.getElementById('icon-' + sectionId);
                            if (content) {
                                if (content.classList.contains('hidden')) {
                                    content.classList.remove('hidden');
                                    if (icon) icon.style.transform = 'rotate(180deg)';
                                } else {
                                    content.classList.add('hidden');
                                    if (icon) icon.style.transform = 'rotate(0deg)';
                                }
                            }
                        }

                        // Toggle password visibility
                        function togglePasswordVisibility(inputId) {
                            const el = document.getElementById(inputId);
                            if (!el) return;
                            el.type = el.type === 'password' ? 'text' : 'password';
                        }

                        // Format uptime
                        function _fmtUptime(seconds) {
                            const s = Math.max(0, Math.floor(seconds || 0));
                            const h = Math.floor(s / 3600);
                            const m = Math.floor((s % 3600) / 60);
                            const ss = s % 60;
                            if (h > 0) return `${h}h ${m}m`;
                            if (m > 0) return `${m}m ${ss}s`;
                            return `${ss}s`;
                        }

                        // Start admin metrics polling
                        let _metricsTimer = null;
                        // Load admin metrics
                        async function loadAdminMetrics() {
                            try {
                                const res = await fetch('/api/admin/metrics');
                                if (!res.ok) {
                                    console.warn('Metrics API not available');
                                    return;
                                }
                                const data = await res.json();
                                console.log('[METRICS] Loaded:', data);
                            } catch (e) {
                                console.warn('[METRICS] Error loading metrics:', e);
                            }
                        }

                        function startAdminMetricsPolling() {
                            if (_metricsTimer) return;
                            loadAdminMetrics();
                            _metricsTimer = setInterval(loadAdminMetrics, 5000);
                        }

                        // Load API keys
                        async function loadApiKeys() {
                            try {
                                const res = await fetch('/api/admin/apikeys');
                                const data = await res.json();
                                if (!data?.success) return;

                                const api = data.apiKeys || {};

                                // Bot Tokens
                                const elBot = document.getElementById('api-bot-token');
                                const elBackup = document.getElementById('api-backup-token');

                                // URLs & Links
                                const elMini = document.getElementById('api-miniapp-url');
                                const elChannel = document.getElementById('api-channel-link');
                                const elGroup = document.getElementById('api-group-link');
                                const elYoutube = document.getElementById('api-youtube-link');
                                const elSupport = document.getElementById('api-support-link');

                                // Set values with current config
                                if (elBot) elBot.value = api.botToken || '';
                                if (elBackup) elBackup.value = api.backupBotToken || '';

                                if (elMini) elMini.value = api.miniAppUrl || '';
                                if (elChannel) elChannel.value = api.requiredChannel || '';
                                if (elGroup) elGroup.value = api.requiredGroup || '';
                                if (elYoutube) elYoutube.value = api.requiredYoutube || '';
                                if (elSupport) elSupport.value = api.supportLink || '';

                                // Update global SUPPORT_LINK for banned modal
                                window.SUPPORT_LINK = api.supportLink || 'https://t.me/support';

                                // Update broadcast page channel info
                                const channelInfoBanner = document.getElementById('configured-channel');
                                if (channelInfoBanner) {
                                    if (api.requiredChannel) {
                                        channelInfoBanner.textContent = `✅ Configured Channel: ${api.requiredChannel}`;
                                        channelInfoBanner.className = 'text-green-400 mt-2 text-xs';
                                    } else {
                                        channelInfoBanner.textContent = '⚠️ No channel configured. Set it in API Management above.';
                                        channelInfoBanner.className = 'text-yellow-400 mt-2 text-xs';
                                    }
                                }

                                // Load database config preview
                                const dbPreview = document.getElementById('db-config-preview');
                                if (dbPreview && data.dbConfig) {
                                    dbPreview.value = JSON.stringify(data.dbConfig, null, 2);
                                }
                            } catch (e) {
                                console.error('Error loading API keys:', e);
                            }
                        }

                        // Save API keys
                        async function saveApiKeys() {
                            const payload = {
                                botToken: document.getElementById('api-bot-token')?.value || '',
                                backupBotToken: document.getElementById('api-backup-token')?.value || '',
                                miniAppUrl: document.getElementById('api-miniapp-url')?.value || '',
                                requiredChannel: document.getElementById('api-channel-link')?.value || '',
                                requiredGroup: document.getElementById('api-group-link')?.value || '',
                                requiredYoutube: document.getElementById('api-youtube-link')?.value || '',
                                supportLink: document.getElementById('api-support-link')?.value || ''
                            };
                            try {
                                const res = await fetch('/api/admin/apikeys', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(payload)
                                });
                                const data = await res.json();
                                if (data?.success) {
                                    alert('✅ All API Keys and Settings saved successfully!');
                                } else {
                                    alert('❌ Failed to save: ' + (data.message || 'Unknown error'));
                                }
                            } catch (e) {
                                alert('❌ Network error saving settings');
                            }
                        }

                        // Load database config
                        async function loadDatabaseConfig() {
                            try {
                                const res = await fetch('/api/admin/dbconfig');
                                const data = await res.json();
                                if (!data?.success) return;

                                const dbConfig = data.dbConfig || {};

                                // Set values with current config
                                const elHost = document.getElementById('db-host');
                                const elPort = document.getElementById('db-port');
                                const elUser = document.getElementById('db-user');
                                const elPass = document.getElementById('db-password');
                                const elName = document.getElementById('db-name');

                                if (elHost) elHost.value = dbConfig.host || '';
                                if (elPort) elPort.value = dbConfig.port || '';
                                if (elUser) elUser.value = dbConfig.user || '';
                                if (elPass) elPass.value = dbConfig.password || '';
                                if (elName) elName.value = dbConfig.name || '';
                            } catch (e) {
                                console.error('Error loading database config:', e);
                            }
                        }

                        // Save database config
                        async function saveDatabaseConfig() {
                            const payload = {
                                host: document.getElementById('db-host')?.value || '',
                                port: document.getElementById('db-port')?.value || '',
                                user: document.getElementById('db-user')?.value || '',
                                password: document.getElementById('db-password')?.value || '',
                                name: document.getElementById('db-name')?.value || ''
                            };
                            try {
                                const res = await fetch('/api/admin/dbconfig', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(payload)
                                });
                                const data = await res.json();
                                if (data?.success) {
                                    alert('✅ Database config saved successfully!');
                                } else {
                                    alert('❌ Failed to save: ' + (data.message || 'Unknown error'));
                                }
                            } catch (e) {
                                alert('❌ Network error saving database config');
                            }
                        }

                        // Restart bot
                        async function restartBot() {
                            try {
                                const res = await fetch('/api/admin/restart-bot', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' }
                                });
                                const data = await res.json();
                                if (data?.success) {
                                    alert('✅ Bot restart initiated! The bot will restart shortly.');
                                } else {
                                    alert('❌ Failed to restart: ' + (data.message || 'Unknown error'));
                                }
                            } catch (e) {
                                alert('❌ Network error restarting bot: ' + e.message);
                            }
                        }

                        // Cost & Reward Management
                        async function loadAllCosts() {
                            try {
                                const res = await fetch('/api/admin/costs');
                                const data = await res.json();
                                if (data.success) {
                                    const c = data.costs;
                                    // Rewards & Bonuses
                                    if (document.getElementById('conf-quiz')) document.getElementById('conf-quiz').value =
                                        c.quizReward || 0;
                                    if (document.getElementById('conf-space')) document.getElementById('conf-space').value =
                                        c.spaceReward || 0;
                                    document.getElementById('conf-invite').value = c.inviteBonus || 0;
                                    document.getElementById('conf-welcome').value = c.welcomeBonus || 0;
                                    document.getElementById('conf-adreward').value = c.adReward || 0;
                                    if (document.getElementById('conf-zerobalance-adreward'))
                                        document.getElementById('conf-zerobalance-adreward').value = c.zeroBalanceAdReward || 5;
                                    document.getElementById('conf-taskreward').value = c.taskReward || 0;
                                    // System Costs
                                    if (document.getElementById('conf-premium-email-cost'))
                                        document.getElementById('conf-premium-email-cost').value = c.premiumEmailCost || 0;
                                    // Fees
                                    document.getElementById('conf-transfer').value = c.transferFee || 0;
                                    document.getElementById('conf-support').value = c.supportCost || 0;
                                    // Services - Basic
                                    if (document.getElementById('conf-gmail')) document.getElementById('conf-gmail').value = c.gmailCost || 0;
                                    if (document.getElementById('conf-hotmail')) document.getElementById('conf-hotmail').value = c.hotmailCost || 0;
                                    if (document.getElementById('conf-tempmail')) document.getElementById('conf-tempmail').value = c.tempMailCost || 0;
                                    if (document.getElementById('conf-student')) document.getElementById('conf-student').value = c.studentEmailCost || 0;
                                    document.getElementById('conf-verification').value = c.verificationCost || 0;
                                    document.getElementById('conf-number').value = c.numberCost || 0;
                                    // Additional Service Costs
                                    if (document.getElementById('conf-gemini')) document.getElementById('conf-gemini').value = c.geminiCost || 0;
                                    if (document.getElementById('conf-chatgpt')) document.getElementById('conf-chatgpt').value = c.chatgptCost || 0;
                                    if (document.getElementById('conf-spotify')) document.getElementById('conf-spotify').value = c.spotifyCost || 0;
                                    if (document.getElementById('conf-youtube')) document.getElementById('conf-youtube').value = c.youtubeCost || 0;
                                    if (document.getElementById('conf-teacher')) document.getElementById('conf-teacher').value = c.teacherCost || 0;
                                    if (document.getElementById('conf-military')) document.getElementById('conf-military').value = c.militaryCost || 0;
                                    // USD costs
                                    if (document.getElementById('conf-accounts-usd')) document.getElementById('conf-accounts-usd').value = c.accountsUSD || 0;
                                    if (document.getElementById('conf-vpn-usd')) document.getElementById('conf-vpn-usd').value = c.vpnUSD || 0;
                                    if (document.getElementById('conf-vcc-usd')) document.getElementById('conf-vcc-usd').value = c.vccUSD || 0;
                                    if (document.getElementById('conf-premium-mail-usd')) document.getElementById('conf-premium-mail-usd').value = c.premiumMailUSD || 0;
                                    // Credit Exchange Rates
                                    if (document.getElementById('conf-crypto-rate'))
                                        document.getElementById('conf-crypto-rate').value = c.cryptoRate || 0.01;
                                    if (document.getElementById('conf-bkash-rate'))
                                        document.getElementById('conf-bkash-rate').value = c.bkashRate || 1;
                                    if (document.getElementById('conf-nagad-rate'))
                                        document.getElementById('conf-nagad-rate').value = c.nagadRate || 1;
                                    // Exchange Rates (USD/Tokens/Gems)
                                    if (document.getElementById('conf-usd-to-token'))
                                        document.getElementById('conf-usd-to-token').value = c.usdToToken || 100;
                                    if (document.getElementById('conf-gem-to-token'))
                                        document.getElementById('conf-gem-to-token').value = c.gemToToken || 100;
                                    if (document.getElementById('conf-token-to-gem'))
                                        document.getElementById('conf-token-to-gem').value = c.tokenToGem || 1;
                                    if (document.getElementById('conf-taka-to-gem'))
                                        document.getElementById('conf-taka-to-gem').value = c.takaToGem || 100;
                                    if (document.getElementById('conf-platform-fee'))
                                        document.getElementById('conf-platform-fee').value = c.platformFee || 20;
                                    // Card Prices
                                    if (document.getElementById('conf-card-gemini'))
                                        document.getElementById('conf-card-gemini').value = c.geminiCardPrice || 150;
                                    if (document.getElementById('conf-card-chatgpt'))
                                        document.getElementById('conf-card-chatgpt').value = c.chatgptCardPrice || 200;
                                    if (document.getElementById('conf-card-spotify'))
                                        document.getElementById('conf-card-spotify').value = c.spotifyCardPrice || 50;
                                    // VPN Prices
                                    if (document.getElementById('conf-vpn-nord'))
                                        document.getElementById('conf-vpn-nord').value = c.nordvpnPrice || 100;
                                    if (document.getElementById('conf-vpn-express'))
                                        document.getElementById('conf-vpn-express').value = c.expressvpnPrice || 120;
                                    if (document.getElementById('conf-vpn-surf'))
                                        document.getElementById('conf-vpn-surf').value = c.surfsharkPrice || 80;
                                    if (document.getElementById('conf-vpn-cyber'))
                                        document.getElementById('conf-vpn-cyber').value = c.cyberghostPrice || 70;
                                    if (document.getElementById('conf-vpn-proton'))
                                        document.getElementById('conf-vpn-proton').value = c.protonvpnPrice || 90;
                                    // Update Summary Stats
                                    const totalRewards = (c.quizReward || 0) + (c.spaceReward || 0) + (c.inviteBonus || 0) +
                                        (c.welcomeBonus || 0) + (c.adReward || 0) + (c.zeroBalanceAdReward || 0) + (c.taskReward
                                            || 0);
                                    const totalCosts = (c.transferFee || 0) + (c.supportCost ||
                                        0) + (c.gmailCost || 0) + (c.verificationCost || 0) + (c.numberCost || 0) +
                                        (c.geminiCost || 0) + (c.chatgptCost || 0) + (c.spotifyCost || 0) + (c.youtubeCost || 0)
                                        +
                                        (c.teacherCost || 0) + (c.militaryCost || 0);
                                    const usdRevenue = (c.accountsUSD || 0) + (c.vpnUSD || 0) + (c.vccUSD || 0) +
                                        (c.premiumMailUSD || 0);
                                    const statRewards = document.getElementById('stat-total-rewards');
                                    const statCosts = document.getElementById('stat-total-costs');
                                    const statUsd = document.getElementById('stat-usd-revenue');
                                    if (statRewards) statRewards.textContent = totalRewards + ' TC';
                                    if (statCosts) statCosts.textContent = totalCosts + ' TC';
                                    if (statUsd) statUsd.textContent = '$' + usdRevenue.toFixed(2);
                                    // Selling Rewards
                                    const sr = data.sellingRewards || {};
                                    document.getElementById('reward-gmail').value = sr.gmail || 0;
                                    document.getElementById('reward-tiktok').value = sr.tiktok || 0;
                                    document.getElementById('reward-facebook').value = sr.facebook || 0;
                                    document.getElementById('reward-telegram').value = sr.telegram || 0;
                                    document.getElementById('reward-discord').value = sr.discord || 0;
                                    document.getElementById('reward-other').value = sr.other || 0;
                                    document.getElementById('reward-2fa-mult').value = sr['2faMultiplier'] || 1.5;
                                }
                            } catch (e) {
                                console.error('Failed to load costs:', e);
                            }
                        }

                        async function saveAllCosts() {
                            const payload = {
                                quizReward: parseInt(document.getElementById('conf-quiz').value) || 0,
                                spaceReward: parseInt(document.getElementById('conf-space').value) || 0,
                                inviteBonus: parseInt(document.getElementById('conf-invite').value) || 0,
                                welcomeBonus: parseInt(document.getElementById('conf-welcome').value) || 0,
                                adReward: parseInt(document.getElementById('conf-adreward').value) || 0,
                                zeroBalanceAdReward: document.getElementById('conf-zerobalance-adreward') ?
                                    (parseInt(document.getElementById('conf-zerobalance-adreward').value) || 0) : undefined,
                                taskReward: parseInt(document.getElementById('conf-taskreward').value) || 0,
                                // System Costs
                                premiumEmailCost: document.getElementById('conf-premium-email-cost') ?
                                    parseInt(document.getElementById('conf-premium-email-cost').value) || 0 : undefined,
                                transferFee: parseInt(document.getElementById('conf-transfer').value) || 0,
                                supportCost: parseInt(document.getElementById('conf-support').value) || 0,
                                gmailCost: parseInt(document.getElementById('conf-gmail').value) || 0,
                                hotmailCost: document.getElementById('conf-hotmail') ? (parseInt(document.getElementById('conf-hotmail').value) || 0) : undefined,
                                tempMailCost: document.getElementById('conf-tempmail') ? (parseInt(document.getElementById('conf-tempmail').value) || 0) : undefined,
                                studentEmailCost: document.getElementById('conf-student') ? (parseInt(document.getElementById('conf-student').value) || 0) : undefined,
                                verificationCost: parseInt(document.getElementById('conf-verification').value) || 0,
                                numberCost: parseInt(document.getElementById('conf-number').value) || 0,
                                // Additional Service Costs
                                geminiCost: document.getElementById('conf-gemini') ?
                                    parseInt(document.getElementById('conf-gemini').value) || 0 : undefined,
                                chatgptCost: document.getElementById('conf-chatgpt') ?
                                    parseInt(document.getElementById('conf-chatgpt').value) || 0 : undefined,
                                spotifyCost: document.getElementById('conf-spotify') ?
                                    parseInt(document.getElementById('conf-spotify').value) || 0 : undefined,
                                youtubeCost: document.getElementById('conf-youtube') ?
                                    parseInt(document.getElementById('conf-youtube').value) || 0 : undefined,
                                teacherCost: document.getElementById('conf-teacher') ?
                                    parseInt(document.getElementById('conf-teacher').value) || 0 : undefined,
                                militaryCost: document.getElementById('conf-military') ?
                                    parseInt(document.getElementById('conf-military').value) || 0 : undefined,

                                // USD costs
                                accountsUSD: document.getElementById('conf-accounts-usd') ?
                                    parseFloat(document.getElementById('conf-accounts-usd').value) || 0 : undefined,
                                vpnUSD: document.getElementById('conf-vpn-usd') ?
                                    parseFloat(document.getElementById('conf-vpn-usd').value) || 0 : undefined,
                                vccUSD: document.getElementById('conf-vcc-usd') ?
                                    parseFloat(document.getElementById('conf-vcc-usd').value) || 0 : undefined,
                                premiumMailUSD: document.getElementById('conf-premium-mail-usd') ?
                                    parseFloat(document.getElementById('conf-premium-mail-usd').value) || 0 : undefined,

                                // Credit Exchange Rates
                                cryptoRate: document.getElementById('conf-crypto-rate') ?
                                    parseFloat(document.getElementById('conf-crypto-rate').value) || 0.01 : undefined,
                                bkashRate: document.getElementById('conf-bkash-rate') ?
                                    parseFloat(document.getElementById('conf-bkash-rate').value) || 1 : undefined,
                                nagadRate: document.getElementById('conf-nagad-rate') ?
                                    parseFloat(document.getElementById('conf-nagad-rate').value) || 1 : undefined,

                                // Exchange Rates (USD/Tokens/Gems)
                                usdToToken: document.getElementById('conf-usd-to-token') ?
                                    parseInt(document.getElementById('conf-usd-to-token').value) || 100 : undefined,
                                gemToToken: document.getElementById('conf-gem-to-token') ?
                                    parseInt(document.getElementById('conf-gem-to-token').value) || 100 : undefined,
                                tokenToGem: document.getElementById('conf-token-to-gem') ?
                                    parseFloat(document.getElementById('conf-token-to-gem').value) || 1 : undefined,
                                takaToGem: document.getElementById('conf-taka-to-gem') ?
                                    parseInt(document.getElementById('conf-taka-to-gem').value) || 100 : undefined,
                                platformFee: document.getElementById('conf-platform-fee') ?
                                    parseInt(document.getElementById('conf-platform-fee').value) || 20 : undefined,

                                // Card Prices
                                geminiCardPrice: document.getElementById('conf-card-gemini') ?
                                    parseInt(document.getElementById('conf-card-gemini').value) || 0 : undefined,
                                chatgptCardPrice: document.getElementById('conf-card-chatgpt') ?
                                    parseInt(document.getElementById('conf-card-chatgpt').value) || 0 : undefined,
                                spotifyCardPrice: document.getElementById('conf-card-spotify') ?
                                    parseInt(document.getElementById('conf-card-spotify').value) || 0 : undefined,

                                // VPN Prices
                                nordvpnPrice: document.getElementById('conf-vpn-nord') ?
                                    parseInt(document.getElementById('conf-vpn-nord').value) || 0 : undefined,
                                expressvpnPrice: document.getElementById('conf-vpn-express') ?
                                    parseInt(document.getElementById('conf-vpn-express').value) || 0 : undefined,
                                surfsharkPrice: document.getElementById('conf-vpn-surf') ?
                                    parseInt(document.getElementById('conf-vpn-surf').value) || 0 : undefined,
                                cyberghostPrice: document.getElementById('conf-vpn-cyber') ?
                                    parseInt(document.getElementById('conf-vpn-cyber').value) || 0 : undefined,
                                protonvpnPrice: document.getElementById('conf-vpn-proton') ?
                                    parseInt(document.getElementById('conf-vpn-proton').value) || 0 : undefined,

                                sellingRewards: {
                                    gmail: parseInt(document.getElementById('reward-gmail').value) || 0,
                                    tiktok: parseInt(document.getElementById('reward-tiktok').value) || 0,
                                    facebook: parseInt(document.getElementById('reward-facebook').value) || 0,
                                    telegram: parseInt(document.getElementById('reward-telegram').value) || 0,
                                    discord: parseInt(document.getElementById('reward-discord').value) || 0,
                                    other: parseInt(document.getElementById('reward-other').value) || 0,
                                    '2faMultiplier': parseFloat(document.getElementById('reward-2fa-mult').value) || 1.1
                                }
                            };

                            try {
                                const res = await fetch('/api/admin/costs', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(payload)
                                });
                                const data = await res.json();
                                if (data.success) {
                                    alert('✅ All costs and rewards saved successfully!');
                                } else {
                                    alert('❌ Error: ' + data.message);
                                }
                            } catch (e) {
                                alert('⚠ Network error saving costs');
                            }
                        }

                        // MOBILE MENU FUNCTIONS
                        function toggleMobileMenu() {
                            const sidebar = document.querySelector('aside');
                            const overlay = document.getElementById('sidebarOverlay');
                            sidebar.classList.toggle('mobile-open');
                            overlay.classList.toggle('active');
                        }

                        function closeMobileMenu() {
                            const sidebar = document.querySelector('aside');
                            const overlay = document.getElementById('sidebarOverlay');
                            sidebar.classList.remove('mobile-open');
                            overlay.classList.remove('active');
                        }

                        function toggleItemSalesSubmenu() {
                            const submenu = document.getElementById('itemSalesSubmenu');
                            const arrow = document.getElementById('itemSalesArrow');
                            if (submenu) {
                                submenu.classList.toggle('hidden');
                                if (arrow) {
                                    arrow.style.transform = submenu.classList.contains('hidden') ? 'rotate(0deg)' :
                                        'rotate(180deg)';
                                }
                            }
                        }

                        // NAV
                        // Store URLs for quick access
                        const SITE_URLS = {
                            app: window.location.origin,
                            admin: window.location.href
                        };

                        function initURLs() {
                            const appUrlEl = document.getElementById('app-url-link');
                            const adminUrlEl = document.getElementById('admin-url-link');
                            
                            if (appUrlEl) {
                                appUrlEl.href = SITE_URLS.app;
                                appUrlEl.textContent = SITE_URLS.app.replace(/^https?:\/\//, '').substring(0, 20) + '...';
                            }
                            
                            if (adminUrlEl) {
                                adminUrlEl.href = SITE_URLS.admin;
                                adminUrlEl.textContent = SITE_URLS.admin.replace(/^https?:\/\//, '').substring(0, 20) + '...';
                            }
                        }

                        function nav(p) {
                            console.log('[NAV] Navigating to:', p);
                            
                            try {
                                if (p === 'serverlogs' && typeof fetchServerLogs === 'function') fetchServerLogs();
                                if (p === 'broadcast' && typeof loadBroadcast === 'function') loadBroadcast();
                            } catch (e) {
                                console.error('[NAV] Pre-load error:', e);
                            }

                            // Update active nav item
                            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

                            // Find the clicked nav item and make it active
                            const navItems = document.querySelectorAll('.nav-item');
                            navItems.forEach(item => {
                                const onclickArr = item.getAttribute('onclick');
                                if (onclickArr && onclickArr.includes("nav('" + p + "')")) {
                                    item.classList.add('active');
                                }
                            });

                            // Hide all pages
                            document.querySelectorAll('.page').forEach(el => {
                                el.classList.remove('active');
                                el.style.display = 'none';
                            });

                            // Show target page
                            const target = document.getElementById('page-' + p) || document.getElementById(p);
                            console.log('[NAV] Target:', target);
                            if (target) {
                                target.classList.add('active');
                                target.style.display = 'block';
                            } else {
                                console.error('[NAV] Page not found: page-' + p + ' or ' + p);
                                // Fallback show dashboard if page missing
                                if (p !== 'dashboard') nav('dashboard');
                                return;
                            }

                            const titles = {
                                'dashboard': 'Dashboard',
                                'users': 'User Management',
                                'bannedusers': 'Banned Users',
                                'codes': 'Promo Codes',
                                'itemsales': 'Item Sales',
                                'tasks': 'Tasks',
                                'settings': 'Configuration',
                                'cards': 'Virtual Cards',
                                'vpn': 'VPN Services',
                                'accounts': 'Accounts',
                                'apikeys': 'API Keys',
                                'broadcast': 'System Broadcast',
                                'history': 'Platform History',
                                'leaderboard': 'Global Leaderboards',
                                'services': 'Services Management',
                                'shopmanage': 'Shop Management',
                                'costmanage': 'Cost Management',
                                'buttons': 'Button Management',
                                'storage': 'Storage (Drive)',
                                'groups': 'Groups & Moderation',
                                'premiumemail': 'Premium Email',
                                'adnetworks': 'Ad Network Integration',
                                'providers': 'Provider Management',
                                'database': 'Database Management',
                                'deposits': 'Deposit Management',
                                'history': 'Global History',
                                'serverlogs': 'Server Problems & Logs'
                            };
                            
                            const subtitles = {
                                'dashboard': 'System Overview',
                                'users': 'Manage platform members',
                                'broadcast': 'Send messages to channel',
                                'serverlogs': 'Track and manage server issues',
                                'deposits': 'Management Section',
                                'history': 'Platform interaction history'
                            };

                            const pageTitle = document.getElementById('page-title');
                            if (pageTitle) {
                                pageTitle.textContent = titles[p] || p.charAt(0).toUpperCase() + p.slice(1);
                                const pageSubtitle = pageTitle.nextElementSibling;
                                if (pageSubtitle) {
                                    pageSubtitle.textContent = subtitles[p] || 'Management Section';
                                }
                            }

                            // Page-specific loading with error handling
                            console.log('[NAV] Loading page-specific data for:', p);
                            try {
                                switch (p) {
                                case 'shopmanage':
                                    if (typeof renderAdminShopItems === 'function') renderAdminShopItems();
                                    break;
                                case 'users':
                                    loadUsers();
                                    break;
                                case 'bannedusers':
                                    loadBannedUsers();
                                    break;
                                case 'accounts':
                                    loadAccounts();
                                    break;
                                case 'groups':
                                    if (typeof loadGroupSettings === 'function') loadGroupSettings();
                                    if (typeof loadGroups === 'function') loadGroups();
                                    break;
                                case 'storage':
                                    loadStorageStatus();
                                    break;
                                case 'tasks':
                                    loadTasks();
                                    break;
                                case 'premiumemail':
                                    loadPremiumEmails();
                                    break;
                                case 'adnetworks':
                                    loadAdNetworks();
                                    break;
                                case 'buttons':
                                    loadFeatureFlags();
                                    break;
                                case 'history':
                                    loadGlobalHistory();
                                    break;
                                case 'database':
                                    loadDbSchedule();
                                    loadBackupHistory();
                                    break;
                                case 'codes':
                                    renderCodes();
                                    break;
                                case 'apikeys':
                                    loadApiKeys();
                                    break;
                                case 'settings':
                                    // Show Cost Manage submenu when Settings is clicked
                                    const costManageSubmenu = document.getElementById('cost-manage-submenu');
                                    if (costManageSubmenu) {
                                        costManageSubmenu.classList.remove('hidden');
                                    }
                                    // Auto-expand Bot Management
                                    const apiKeysContent = document.getElementById('api-keys-content');
                                    const apiKeysIcon = document.getElementById('icon-api-keys-content');
                                    if (apiKeysContent) {
                                        apiKeysContent.classList.remove('hidden');
                                    }
                                    if (apiKeysIcon) {
                                        apiKeysIcon.style.transform = 'rotate(180deg)';
                                    }
                                    break;
                                case 'costmanage':
                                    loadAllCosts();
                                    break;
                                case 'cards':
                                    loadSectionServices('cards');
                                    break;
                                case 'vpn':
                                    loadSectionServices('vpn');
                                    break;
                                case 'services':
                                    if (typeof loadServices === 'function') loadServices();
                                    break;
                                case 'broadcast':
                                    if (typeof loadBroadcast === 'function') loadBroadcast();
                                    break;
                                case 'deposits':
                                    if (typeof loadDeposits === 'function') loadDeposits();
                                    break;
                                }
                            } catch (e) {
                                console.error('[NAV] Page data load error:', e);
                            }

                            // Close mobile menu after navigation
                            if (window.innerWidth <= 1024 && typeof closeMobileMenu === 'function') {
                                closeMobileMenu();
                            }
                        }

                        // DEPOSITS MANAGEMENT
                        let cryptoMethods = {}; async function loadDeposits() {
                            try {
                                const res = await
                                    fetch('/api/admin/deposits'); const data = await res.json(); if (data.success) {
                                        renderDeposits(data.pending,
                                            data.history);
                                    }
                            } catch (e) { console.error('Failed to load deposits'); }
                        } function
                            renderDeposits(pending, history) {
                            const badge = document.getElementById('dash-pending-badge'); if (badge && pending.length >
                                0) {
                                badge.textContent = pending.length;
                                badge.classList.remove('hidden');
                            } else if (badge) {
                                badge.classList.add('hidden');
                            }

                            const pBody = document.querySelector('#pendingDepositsTable tbody');
                            if (pending.length === 0) {
                                pBody.innerHTML = '<tr><td colspan="5" class="text-center text-gray-500 py-8">No pending requests</td></tr>';
                            } else {
                                pBody.innerHTML = pending.map(d => `
            <tr>
                <td class="font-mono text-xs">${d.userId}</td>
                <td class="text-orange-400 font-bold uppercase text-xs">${d.method}</td>
                <td class="font-bold">$${d.amount}</td>
                <td class="text-xs text-gray-400 font-mono">${d.txnId}</td>
                <td>
                    ${d.screenshot ? `
                    <a href="${d.screenshot}" target="_blank" class="text-blue-400 hover:text-blue-300 text-xs">
                        <i class="fas fa-image"></i> View
                    </a>
                    ` : '<span class="text-gray-600 text-[10px]">None</span>'}
                </td>
                <td class="space-x-2">
                    <button onclick="actionDeposit('${d.id}', 'approve')" class="text-green-500 hover:text-green-400"><i
                            class="fas fa-check"></i></button>
                    <button onclick="actionDeposit('${d.id}', 'reject')" class="text-red-500 hover:text-red-400"><i
                            class="fas fa-times"></i></button>
                </td>
            </tr>
            `).join('');
                            }

                            const hBody = document.querySelector('#depositHistoryTable tbody');
                            hBody.innerHTML = history.map(d => `
            <tr class="opacity-70">
                <td class="text-xs">${d.userId}</td>
                <td class="text-xs uppercase">${d.method}</td>
                <td class="font-bold text-xs">$${d.amount}</td>
                <td class="text-xs font-mono">${d.txnId}</td>
                <td>
                    ${d.screenshot ? `<a href="${d.screenshot}" target="_blank" class="text-blue-400"><i
                            class="fas fa-image"></i></a>` : '-'}
                </td>
                <td><span
                        class="px-2 py-0.5 rounded text-[10px] ${d.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">${d.status.toUpperCase()}</span>
                </td>
                <td class="text-[10px] text-gray-500">${new Date(d.date).toLocaleString()}</td>
            </tr>
            `).join('');
                        }

                        async function actionDeposit(depositId, action) {
                            const note = action === 'reject' ? prompt('Enter reason for rejection:') : '';
                            if (action === 'reject' && note === null) return;
                            try {
                                const res = await fetch('/api/admin/deposits/action', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ depositId, action, note })
                                });
                                const data = await res.json();
                                if (data.success) loadDeposits();
                                else alert(data.message);
                            } catch (e) { alert('Action failed'); }
                        }

                        async function autoApproveDeposits() {
                            const ids = document.getElementById('autoApproveIds').value;
                            if (!ids.trim()) return alert('Please enter transaction IDs');
                            try {
                                const res = await fetch('/api/admin/deposits/auto-approve', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ txnIds: ids })
                                });
                                const data = await res.json();
                                if (data.success) {
                                    alert(`Finished! Approved ${data.approvedCount} deposits from ${data.totalChecked} checked IDs.`);
                                    document.getElementById('autoApproveIds').value = '';
                                    closeAutoApproveModal();
                                    loadDeposits();
                                }
                            } catch (e) { alert('Auto-approval failed'); }
                        }

                        async function deleteAllDepositHistory() {
                            if (!confirm('Are you sure you want to delete ALL deposit history? This action cannot be undone!')) return;
                            try {
                                const res = await fetch('/api/admin/deposits/delete-all', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' }
                                });
                                const data = await res.json();
                                if (data.success) {
                                    alert('All deposit history has been deleted successfully!');
                                    loadDeposits();
                                } else {
                                    alert(data.message || 'Failed to delete history');
                                }
                            } catch (e) { alert('Delete failed: ' + e.message); }
                        }

                        // Export delete function to window for onclick access
                        window.deleteAllDepositHistory = deleteAllDepositHistory;

                        // Auto-Approve Modal Functions
                        function openAutoApproveModal() {
                            const modal = document.getElementById('autoApproveModal');
                            const content = document.getElementById('autoApproveModalContent');
                            modal.classList.remove('hidden');
                            modal.classList.add('flex');
                            setTimeout(() => {
                                content.classList.remove('scale-95', 'opacity-0');
                                content.classList.add('scale-100', 'opacity-100');
                            }, 10);
                        }

                        function closeAutoApproveModal() {
                            const modal = document.getElementById('autoApproveModal');
                            const content = document.getElementById('autoApproveModalContent');
                            content.classList.remove('scale-100', 'opacity-100');
                            content.classList.add('scale-95', 'opacity-0');
                            setTimeout(() => {
                                modal.classList.add('hidden');
                                modal.classList.remove('flex');
                            }, 200);
                        }

                        // Close modal on clicking outside
                        document.getElementById('autoApproveModal')?.addEventListener('click', function (e) {
                            if (e.target === this) closeAutoApproveModal();
                        });

                        async function loadCryptoConfig() {
                            try {
                                const res = await fetch('/api/deposit/config');
                                const data = await res.json();
                                if (data.success) {
                                    cryptoMethods = data.cryptoMethods;
                                    renderCryptoConfig();
                                }
                            } catch (e) { }
                        }

                        function renderCryptoConfig() {
                            const grid = document.getElementById('cryptoConfigGrid');
                            grid.innerHTML = Object.entries(cryptoMethods).map(([id, m]) => `
            <div class="bg-white/5 border border-white/10 rounded-xl p-4">
                <div class="flex items-center gap-2 mb-3">
                    <div
                        class="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold uppercase">
                        ${id[0]}</div>
                    <span class="font-bold text-sm">${m.name}</span>
                </div>
                <div class="space-y-3">
                    <div>
                        <label class="text-[10px] text-gray-500 block mb-1">ID/ADDRESS</label>
                        <input type="text" value="${m.details || ''}"
                            onchange="updateLocalM('${id}', 'details', this.value)"
                            class="w-full bg-black/30 border border-white/5 rounded px-2 py-1 text-xs">
                    </div>
                    <div>
                        <label class="text-[10px] text-gray-500 block mb-1">EMAIL
                            (OPTIONAL)</label>
                        <input type="text" value="${m.email || ''}"
                            onchange="updateLocalM('${id}', 'email', this.value)"
                            class="w-full bg-black/30 border border-white/5 rounded px-2 py-1 text-xs">
                    </div>
                    <div>
                        <label class="text-[10px] text-gray-500 block mb-1">QR IMAGE URL</label>
                        <input type="text" value="${m.qr || ''}" onchange="updateLocalM('${id}', 'qr', this.value)"
                            class="w-full bg-black/30 border border-white/5 rounded px-2 py-1 text-xs">
                    </div>
                    <div>
                        <label class="text-[10px] text-gray-500 block mb-1">STATUS</label>
                        <select onchange="updateLocalM('${id}', 'status', this.value)"
                            class="w-full bg-black/30 border border-white/5 rounded px-2 py-1 text-xs">
                            <option value="active" ${m.status === 'active' ? 'selected' : ''}>
                                Active</option>
                            <option value="disabled" ${m.status !== 'active' ? 'selected' : ''}>
                                Disabled</option>
                        </select>
                    </div>
                </div>
            </div>
            `).join('');
                        }

                        function updateLocalM(id, field, val) { cryptoMethods[id][field] = val; }

                        async function saveCryptoConfig() {
                            try {
                                const res = await fetch('/api/admin/deposits/config', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ cryptoMethods })
                                });
                                const data = await res.json();
                                if (data.success) alert('Settings saved successfully!');
                            } catch (e) { alert('Save failed'); }
                        }

                        // AD NETWORKS
                        function loadAdNetworks() {
                            fetch('/api/admin/ads')
                                .then(r => r.json())
                                .then(data => {
                                    if (!data.success) return;
                                    const ads = data.ads || {};
                                    const networks = ['moneytag', 'adsense', 'adsterra'];
                                    networks.forEach(net => {
                                        const cfg = ads[net] || {};
                                        const pubEl = document.getElementById('ad-' + net + '-publisher');
                                        const unitEl = document.getElementById('ad-' + net + '-unit');
                                        const directUrlEl = document.getElementById('ad-' + net + '-directurl');
                                        const enabledEl = document.getElementById('ad-' + net + '-enabled');
                                        if (pubEl) pubEl.value = cfg.publisherId || '';
                                        if (unitEl) unitEl.value = cfg.adUnitId || '';
                                        if (directUrlEl) directUrlEl.value = cfg.directUrl || '';
                                        if (enabledEl) enabledEl.checked = cfg.enabled !== false;
                                    });

                                    // Update preview
                                    const previewEl = document.getElementById('ad-config-preview');
                                    if (previewEl) {
                                        const activeAds = Object.entries(ads).filter(([k, v]) => v.enabled);
                                        if (activeAds.length === 0) {
                                            previewEl.innerHTML = 'No active ad networks';
                                        } else {
                                            previewEl.innerHTML = activeAds.map(([k, v]) => {
                                                let displayText = '';
                                                // Show Direct Link info if available
                                                if (v.directUrl) {
                                                    displayText = `${k}: Direct Link ✅`;
                                                } else if (v.publisherId) {
                                                    displayText = `${k}: ${v.publisherId.substring(0, 20)}... ✅`;
                                                } else {
                                                    displayText = `${k}: ❌ (No config)`;
                                                }
                                                return `
            <div
                style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; padding:8px; background:rgba(255,255,255,0.05); border-radius:8px;">
                <span>${displayText}</span>
                <button onclick="deleteAdNetwork('${k}')"
                    style="background:#ef4444; color:#fff; border:none; padding:4px 12px; border-radius:6px; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:4px;">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
            `;
                                            }).join('');
                                        }
                                    }
                                }).catch(err => {
                                    console.error('Error loading ad networks:', err);
                                    const previewEl = document.getElementById('ad-config-preview');
                                    if (previewEl) {
                                        previewEl.innerHTML = '<div class="text-red-400"><i class="fas fa-exclamation-circle"></i> Error loading ad networks</div>';
                                    }
                                });
                        }

                        function saveAdNetwork(network) {
                            let payload = { network };
                            const enabled = document.getElementById('ad-' + network + '-enabled').checked;

                            const publisherId = document.getElementById('ad-' + network +
                                '-publisher').value.trim();
                            const adUnitId = document.getElementById('ad-' + network + '-unit').value.trim();
                            const directUrl = document.getElementById('ad-' + network +
                                '-directurl')?.value.trim() || '';
                            payload = { network, publisherId, adUnitId, directUrl, enabled };

                            fetch('/api/admin/ads', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(payload)
                            }).then(r => r.json()).then(data => {
                                const statusEl = document.getElementById('ad-' + network + '-status');
                                if (data.success) {
                                    statusEl.textContent = '✅ Saved successfully!';
                                    statusEl.style.color = '#4ade80';
                                    loadAdNetworks();
                                } else {
                                    statusEl.textContent = '❌ Error saving';
                                    statusEl.style.color = '#f87171';
                                }
                                setTimeout(() => { statusEl.textContent = ''; }, 3000);
                            }).catch(() => {
                                const statusEl = document.getElementById('ad-' + network + '-status');
                                statusEl.textContent = '❌ Network error';
                                statusEl.style.color = '#f87171';
                            });
                        }

                        // Delete ad network
                        function deleteAdNetwork(network) {
                            if (!confirm(`Are you sure you want to delete the ${network} ad configuration?`))
                                return;

                            fetch(`/api/admin/ads/${network}`, {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' }
                            }).then(r => r.json()).then(data => {
                                if (data.success) {
                                    alert(`✅ ${network} deleted successfully!`);
                                    loadAdNetworks();
                                } else {
                                    alert('❌ Error deleting: ' + (data.message || 'Unknown error'));
                                }
                            }).catch(() => {
                                alert('❌ Network error while deleting');
                            });
                        }

                        // BROADCAST & MEDIA
                        function toggleMediaInput() {
                            const type = document.getElementById('bc-media-type').value;
                            const input = document.getElementById('bc-media-input');
                            const fileInput = document.getElementById('bc-media-upload');
                            input.style.display = type === 'none' ? 'none' : 'block';
                            if (type === 'photo') fileInput.accept = 'image/*';
                            else if (type === 'video') fileInput.accept = 'video/*';
                        }

                        async function uploadAdminImage(input, targetId) {
                            const file = input.files[0];
                            if (!file) return;

                            const targetInput = document.getElementById(targetId);
                            const originalVal = targetInput.value;
                            targetInput.value = 'Uploading...';
                            targetInput.disabled = true;

                            const formData = new FormData();
                            formData.append('file', file);

                            try {
                                const res = await fetch('/api/admin/upload-media', {
                                    method: 'POST',
                                    body: formData
                                });
                                const data = await res.json();
                                if (data.success) {
                                    targetInput.value = data.url;
                                } else {
                                    alert('Upload failed: ' + data.message);
                                    targetInput.value = originalVal;
                                }
                            } catch (e) {
                                alert('Upload failed: Network error');
                                targetInput.value = originalVal;
                            } finally {
                                targetInput.disabled = false;
                                input.value = '';
                            }
                        }

                        async function sendBroadcast() {
                            const message = document.getElementById('bc-message').value.trim();
                            const mediaType = document.getElementById('bc-media-type').value;
                            const mediaUrl = document.getElementById('bc-media-url').value.trim();
                            const target = document.getElementById('bc-target').value;
                            const btn = document.getElementById('btn-send-broadcast');
                            const status = document.getElementById('broadcast-status');
                            const buttonsText = document.getElementById('bc-buttons').value.trim();

                            if (!message && mediaType === 'none') return alert('Please enter a message or select a media type.');
                            if (mediaType !== 'none' && !mediaUrl) return alert('Please provide a media URL or upload a file.');

                            let buttons = [];
                            if (buttonsText) {
                                buttons = buttonsText.split('\n').map(line => {
                                    const [text, url] = line.split('|').map(s => s.trim());
                                    if (text && url) return { text, url };
                                    return null;
                                }).filter(b => b !== null);
                            }

                            if (!confirm('Are you sure you want to send this broadcast?')) return;

                            btn.disabled = true;
                            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SENDING...';
                            status.textContent = 'Preparing broadcast targets...';
                            status.style.color = '#94a3b8';

                            try {
                                const res = await fetch('/api/admin/broadcast', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ message, mediaType, mediaUrl, buttons, target })
                                });
                                const data = await res.json();
                                if (data.success) {
                                    status.textContent = `✅ Successfully sent to ${data.sent} targets. (${data.failed}
            failed)`;
                                    status.style.color = '#4ade80';
                                    alert(`Broadcast complete!\nSent: ${data.sent}\nFailed: ${data.failed}`);

                                    // Clear inputs after success to save state
                                    document.getElementById('bc-message').value = '';
                                    document.getElementById('bc-media-url').value = '';
                                    document.getElementById('bc-buttons').value = '';
                                    document.getElementById('bc-media-type').value = 'none';
                                    if (typeof toggleMediaInput === 'function') toggleMediaInput();
                                } else {
                                    status.textContent = '❌ Broadcast failed: ' + data.message;
                                    status.style.color = '#f87171';
                                }
                            } catch (e) {
                                status.textContent = `❌ Sent to ${e.total || 0} users (${e.success || 0} successful)`;
                                status.style.color = '#f87171';
                            } finally {
                                btn.disabled = false;
                                btn.innerHTML = '<i class="fas fa-paper-plane"></i> SEND BROADCAST';
                            }
                        }

                        // INIT
                        function init() {
                            loadAdminStats();
                            initChart();
                            loadFeatureFlags();
                            loadAllCosts();
                            loadApiKeys();
                            loadVerificationSettings();
                            startAdminMetricsPolling();
                        }

                        // FEATURE FLAGS (Button Management)
                        function setFeatureFlagsStatus(msg, ok) {
                            const el = document.getElementById('featureFlagsStatus');
                            if (!el) return;
                            el.textContent = msg || '';
                            el.style.color = ok ? '#4ade80' : '#f87171';
                        }

                        function loadFeatureFlags() {
                            setFeatureFlagsStatus('Loading feature flags...', false);
                            fetch('/api/admin/features')
                                .then(r => r.json())
                                .then(data => {
                                    if (!data.success) {
                                        defaultAllFeaturesToEnabled();
                                        setFeatureFlagsStatus('Using default settings (all enabled) ✅', true);
                                        setTimeout(() => setFeatureFlagsStatus('', true), 2000);
                                        return;
                                    }
                                    const f = data.features || {};
                                    const keys = [
                                        // Core Services
                                        'tempMail', 'virtualNumber', 'premiumMail', 'accountsShop', 'cardsVcc',
                                        'joinRequired', 'requireTelegram',
                                        // Home Service Cards
                                        'home_verify', 'home_mail', 'home_number', 'home_gemini', 'home_chatgpt',
                                        'home_accounts', 'home_vcc', 'home_premiumMail',
                                        // AI Tools
                                        'aiPhotoGen', 'aiVideoGen', 'bgRemover',
                                        // Media & Download
                                        'videoDownloader', 'vpnServices',
                                        // Rewards & Engagement
                                        'dailyCheckin', 'tasksSystem', 'redeemCodes', 'referralSystem', 'quizFeature',
                                        'exchange',
                                        // Home Grid Buttons
                                        'home_aiPhoto', 'home_aiVideo', 'home_bgRemover', 'home_videoDownload', 'home_vpn',
                                        'home_accountsShop', 'home_vccShop'
                                    ];
                                    keys.forEach(k => {
                                        const el = document.getElementById('ff-' + k);
                                        if (el) el.checked = f[k] !== false;
                                    });
                                    setFeatureFlagsStatus('Loaded ✅', true);
                                    setTimeout(() => setFeatureFlagsStatus('', true), 1500);
                                })
                                .catch(() => {
                                    defaultAllFeaturesToEnabled();
                                    setFeatureFlagsStatus('Network error - Using defaults (all enabled) ⚠️', false);
                                });
                        }

                        function defaultAllFeaturesToEnabled() {
                            const keys = [
                                'tempMail', 'virtualNumber', 'premiumMail', 'accountsShop', 'cardsVcc', 'joinRequired',
                                'home_verify', 'home_mail', 'home_number', 'home_gemini', 'home_chatgpt',
                                'home_accounts', 'home_vcc', 'home_premiumMail',
                                'aiPhotoGen', 'aiVideoGen', 'bgRemover',
                                'videoDownloader', 'vpnServices',
                                'dailyCheckin', 'tasksSystem', 'redeemCodes', 'referralSystem', 'quizFeature', 'exchange',
                                'home_aiPhoto', 'home_aiVideo', 'home_bgRemover', 'home_videoDownload', 'home_vpn',
                                'home_accountsShop', 'home_vccShop'
                            ];
                            keys.forEach(k => {
                                const el = document.getElementById('ff-' + k);
                                if (el) el.checked = true;
                            });
                        }

                        function saveFeatureFlags() {
                            setFeatureFlagsStatus('Saving...', false);
                            const payload = {
                                // Core Services
                                tempMail: document.getElementById('ff-tempMail')?.checked === true,
                                virtualNumber: document.getElementById('ff-virtualNumber')?.checked === true,
                                premiumMail: document.getElementById('ff-premiumMail')?.checked === true,
                                accountsShop: document.getElementById('ff-accountsShop')?.checked === true,
                                cardsVcc: document.getElementById('ff-cardsVcc')?.checked === true,
                                joinRequired: document.getElementById('ff-joinRequired')?.checked === true,
                                requireTelegram: document.getElementById('ff-requireTelegram')?.checked === true,
                                // Home Service Cards
                                home_verify: document.getElementById('ff-home_verify')?.checked === true,
                                home_mail: document.getElementById('ff-home_mail')?.checked === true,
                                home_number: document.getElementById('ff-home_number')?.checked === true,
                                home_gemini: document.getElementById('ff-home_gemini')?.checked === true,
                                home_chatgpt: document.getElementById('ff-home_chatgpt')?.checked === true,
                                home_accounts: document.getElementById('ff-home_accounts')?.checked === true,
                                home_vcc: document.getElementById('ff-home_vcc')?.checked === true,
                                home_premiumMail: document.getElementById('ff-home_premiumMail')?.checked === true,
                                // AI Tools
                                aiPhotoGen: document.getElementById('ff-aiPhotoGen')?.checked === true,
                                aiVideoGen: document.getElementById('ff-aiVideoGen')?.checked === true,
                                bgRemover: document.getElementById('ff-bgRemover')?.checked === true,
                                // Media & Download
                                videoDownloader: document.getElementById('ff-videoDownloader')?.checked === true,
                                vpnServices: document.getElementById('ff-vpnServices')?.checked === true,
                                // Rewards & Engagement
                                dailyCheckin: document.getElementById('ff-dailyCheckin')?.checked === true,
                                tasksSystem: document.getElementById('ff-tasksSystem')?.checked === true,
                                redeemCodes: document.getElementById('ff-redeemCodes')?.checked === true,
                                referralSystem: document.getElementById('ff-referralSystem')?.checked === true,
                                quizFeature: document.getElementById('ff-quizFeature')?.checked === true,
                                exchange: document.getElementById('ff-exchange')?.checked === true,
                                // Home Grid Buttons
                                home_aiPhoto: document.getElementById('ff-home_aiPhoto')?.checked === true,
                                home_aiVideo: document.getElementById('ff-home_aiVideo')?.checked === true,
                                home_bgRemover: document.getElementById('ff-home_bgRemover')?.checked === true,
                                home_videoDownload: document.getElementById('ff-home_videoDownload')?.checked ===
                                    true,
                                home_vpn: document.getElementById('ff-home_vpn')?.checked === true,
                                home_accountsShop: document.getElementById('ff-home_accountsShop')?.checked ===
                                    true,
                                home_vccShop: document.getElementById('ff-home_vccShop')?.checked === true
                            };

                            fetch('/api/admin/features', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(payload)
                            })
                                .then(r => r.json())
                                .then(data => {
                                    if (data.success) {
                                        setFeatureFlagsStatus('Saved ✅', true);
                                        setTimeout(() => setFeatureFlagsStatus('', true), 2000);
                                    } else {
                                        setFeatureFlagsStatus('Save failed', false);
                                    }
                                })
                                .catch(() => setFeatureFlagsStatus('Network error saving feature flags', false));
                        }

                        // STATS
                        function loadAdminStats() {
                            fetch('/api/admin/stats')
                                .then(r => r.json())
                                .then(data => {
                                    if (!data.success) return;
                                    const map = {
                                        'dash-total-users': data.totalUsers,
                                        'dash-active': data.activeToday,
                                        'dash-total-tokens': data.totalTokens,
                                        'dash-verified': data.verifiedUsers,
                                        'dash-shop-items': data.shopItems,
                                        'dash-accounts': data.accounts,
                                        'dash-gmails': data.gmailsUsed,
                                        'dash-vpns': data.totalVpns,
                                        'dash-cards': data.totalCards,
                                        'dash-apikeys': data.apiKeys || 0,
                                        // New stats
                                        'dash-deposits': data.totalDeposits,
                                        'dash-withdrawals': data.totalWithdrawals,
                                        'dash-pending': data.pendingDeposits,
                                        'dash-revenue': data.revenue,
                                        'dash-services': data.serviceCategories || 0,
                                        'dash-total-stock': data.totalServiceStock || 0,
                                        'dash-backup-time': data.lastBackup || 'Never'
                                    };
                                    Object.entries(map).forEach(([id, val]) => {
                                        const el = document.getElementById(id);
                                        if (el) el.textContent = val?.toLocaleString() || val || '0';
                                    });
                                    // Update pending badge
                                    const pendingBadge = document.getElementById('dash-pending-badge');
                                    if (pendingBadge && data.pendingDeposits > 0) {
                                        pendingBadge.textContent = data.pendingDeposits;
                                        pendingBadge.classList.remove('hidden');
                                    } else if (pendingBadge) {
                                        pendingBadge.classList.add('hidden');
                                    }
                                    // Update backup status
                                    const backupStatus = document.getElementById('dash-backup-status');
                                    if (backupStatus) {
                                        const isRecent = data.lastBackup && data.lastBackup !== 'Never';
                                        backupStatus.innerHTML = isRecent ?
                                            '<i class="fas fa-check-circle"></i>' :
                                            '<i class="fas fa-exclamation-circle text-yellow-400"></i>';
                                    }
                                    // Update user growth
                                    const growthEl = document.getElementById('dash-users-growth');
                                    if (growthEl && data.userGrowth !== undefined) {
                                        growthEl.textContent = (data.userGrowth > 0 ? '+' : '') + data.userGrowth + '%';
                                        growthEl.parentElement.className = data.userGrowth >= 0 ?
                                            'text-xs text-green-400' : 'text-xs text-red-400';
                                    }
                                }).catch(() => { });
                        }

                        // CHART
                        function initChart() {
                            const ctx = document.getElementById('mainChart');
                            if (!ctx) return;
                            
                            if (typeof Chart === 'undefined') {
                                console.warn('[Chart] Chart.js is not loaded. Skipping dashboard chart.');
                                const parent = ctx.parentElement;
                                if (parent) {
                                    parent.innerHTML = '<div class="flex flex-col items-center justify-center h-full text-slate-500"><i class="fas fa-chart-area mb-2 text-2xl opacity-20"></i><p class="text-xs">Dashboard charts are currently unavailable</p></div>';
                                }
                                return;
                            }

                            new Chart(ctx, {
                                type: 'line',
                                data: {
                                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                                    datasets: [{
                                        label: 'Active Users',
                                        data: [65, 78, 90, 81, 86, 95, 88],
                                        borderColor: '#f59e0b',
                                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                        fill: true,
                                        tension: 0.4
                                    }]
                                },
                                options: {
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        y: {
                                            beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: {
                                                color:
                                                    '#94a3b8'
                                            }
                                        },
                                        x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                                    }
                                }
                            });
                        }

                        // USERS
                        let allUsersData = [];

                        function formatAmountCompact(num) {
                            if (num === null || num === undefined) return '0';
                            const n = Math.abs(Number(num));
                            if (n < 1000) return n.toString();
                            const si = [
                                { value: 1e12, symbol: "T" },
                                { value: 1e9, symbol: "B" },
                                { value: 1e6, symbol: "M" },
                                { value: 1e3, symbol: "K" }
                            ];
                            for (let i = 0; i < si.length; i++) {
                                if (n >= si[i].value) {
                                    return (n / si[i].value).toFixed(1).replace(/\.0$/, '') + si[i].symbol;
                                }
                            }
                            return n.toString();
                        }

                        function formatUsdDisplay(usd) {
                            const v = Number(usd || 0);
                            return v === 0 ? '$0' : ('$' + v.toFixed(2));
                        }

                        function loadUsers() {
                            const tbody = document.getElementById('usersTableBody');
                            if (tbody) tbody.innerHTML = '<tr><td colspan="5" class="text-center text-gray-500 py-8">Loading...</td></tr>';
                            fetch('/api/admin/users')
                                .then(r => r.json())

                                .then(data => {
                                    if (!data.success) return;
                                    allUsersData = data.users;
                                    renderUsersTable(allUsersData);
                                })
                                .catch(() => {
                                    if (tbody) tbody.innerHTML = '<tr><td colspan="7" class="text-center text-red-400 py-8">Failed to load</td></tr>';
                                });
                        }

                        function renderUsersTable(users) {
                            const tbody = document.getElementById('usersTableBody');
                            if (!tbody) return;
                            if (!users.length) {
                                tbody.innerHTML = '<tr><td colspan="7" class="text-center text-gray-500 py-8">No users found</td></tr>';
                                return;
                            }
                            tbody.innerHTML = users.map(u => `
            <tr>
                <td>
                    <div class="font-bold">${u.firstName || u.username || 'Unknown'}</div>
                    <div class="text-xs text-gray-400">@${u.username || 'N/A'} · ID: ${u.id}
                    </div>
                </td>
                <td class="text-yellow-400 font-bold">${formatAmountCompact(u.tokens || 0)}</td>
                <td class="text-blue-400 font-bold">${formatAmountCompact(u.Gems || 0)}</td>
                <td class="text-green-400 font-bold">${formatUsdDisplay(u.usd || 0)}</td>
                <td>${u.invites || 0}</td>
                <td>
                    ${u.adminVerified ? '<span class="bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded text-[10px] font-bold block mb-1">ADMIN VERIFIED</span>' : ''}
                    ${u.banned ? '<span class="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-xs">Banned</span>' : '<span class="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs">Active</span>'}
                    ${(!u.adminVerified && u.verified) ? '<span class="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-[10px] ml-1">Verified</span>' : ''}
                    ${(!u.adminVerified && !u.verified) ? '<span class="bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded text-[10px] ml-1">Not Verified</span>' : ''}
                </td>
                    <td>
                        <div class="flex gap-1">
                            <button onclick="openEditUser('${u.id}')"
                                class="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-bold" title="Edit"><i
                                    class="fas fa-user-edit"></i></button>

                            <button onclick="toggleVerifyUser('${u.id}', ${!u.adminVerified}, 'admin')"
                                class="bg-${u.adminVerified ? 'gray' : 'yellow'}-500/20 text-${u.adminVerified ? 'gray' : 'yellow'}-400 px-2 py-1 rounded text-xs"
                                title="${u.adminVerified ? 'Remove Admin Verify' : 'Admin Verify'}"><i
                                    class="fas fa-${u.adminVerified ? 'times' : 'check-double'}"></i></button>
                            <button onclick="toggleVerifyUser('${u.id}', ${!u.verified}, 'user')"
                                class="bg-${u.verified ? 'gray' : 'blue'}-500/20 text-${u.verified ? 'gray' : 'blue'}-400 px-2 py-1 rounded text-xs"
                                title="${u.verified ? 'Unverify' : 'Verify'}"><i
                                    class="fas fa-${u.verified ? 'times' : 'check'}"></i></button>
                            <button onclick="toggleBanUser('${u.id}', ${!u.banned})"
                                class="bg-${u.banned ? 'green' : 'red'}-500/20 text-${u.banned ? 'green' : 'red'}-400 px-2 py-1 rounded text-xs"
                                title="${u.banned ? 'Unban' : 'Ban'}"><i
                                    class="fas fa-${u.banned ? 'check' : 'ban'}"></i></button>
                            <button onclick="deleteUser('${u.id}')"
                                class="bg-gray-500/20 text-gray-400 px-2 py-1 rounded text-xs" title="Delete"><i
                                    class="fas fa-trash"></i></button>
                        </div>
                    </td>
            </tr> `).join('');
                        }

                        function filterUsers() {
                            const q = document.getElementById('userSearch')?.value?.toLowerCase() || '';
                            const filtered = allUsersData.filter(u =>
                                (u.username || '').toLowerCase().includes(q) ||
                                (u.firstName || '').toLowerCase().includes(q) ||
                                String(u.id).includes(q)
                            );
                            renderUsersTable(filtered);
                        }

                        // AUTO-LOAD: Load users when page loads
                        document.addEventListener('DOMContentLoaded', function () {
                            setTimeout(function () {
                                if (typeof loadUsers === 'function') {
                                    console.log('[AUTO-LOAD] Auto-loading users...');
                                    loadUsers();
                                }
                            }, 500);
                        });

                        async function loadUserHistory() {
                            const uid = document.getElementById('historySearchId')?.value?.trim();
                            if (!uid) { alert('Please enter a User ID.'); return; }

                            const resultEl = document.getElementById('userHistoryResult');
                            const emptyEl = document.getElementById('userHistoryEmpty');
                            const profileCard = document.getElementById('uhProfileCard');
                            const historyList = document.getElementById('uhHistoryList');

                            emptyEl.textContent = 'Loading...';
                            resultEl.classList.add('hidden');

                            try {
                                const res = await fetch('/api/admin/user-detail/' + uid, {
                                    headers: {
                                        'Authorization': ADMIN_TOKEN
                                    }
                                });
                                const data = await res.json();

                                if (!data.success || !data.user) {
                                    emptyEl.textContent = 'User not found with ID: ' + uid;
                                    return;
                                }

                                const u = data.user;
                                const history = data.history || [];

                                // Profile card
                                profileCard.innerHTML = `
                    <div >
                <div class="text-xs text-gray-400 mb-1">Name</div>
                <div class="font-bold text-white">${u.firstName || u.first_name || 'N/A'}</div>
                <div class="text-xs text-gray-400">@${u.username || 'N/A'}</div>
            </div>
            <div>
                <div class="text-xs text-gray-400 mb-1">Telegram ID</div>
                <div class="font-bold text-yellow-400 font-mono">${uid}</div>
                <div class="text-xs ${u.banned ? 'text-red-400' : 'text-green-400'}">${u.banned
                                        ? '🚫 Banned' : '✅ Active'}</div>
            </div>
            <div>
                <div class="text-xs text-gray-400 mb-1">Balances</div>
                <div class="text-sm">🪙 <b class="text-yellow-400">${formatAmountCompact(u.tokens || u.balance_tokens || 0)}</b> Tokens</div>
                <div class="text-sm">💎 <b class="text-blue-400">${formatAmountCompact(u.Gems || u.gems || 0)}</b> Gems</div>
                <div class="text-sm">💵 <b class="text-green-400">${formatUsdDisplay(u.usd || 0)}</b> USD</div>
                <div class="text-sm">👥 <b>${u.referralCount || u.invites || 0}</b> Referrals</div>
                <div class="text-sm">📅 Joined: ${u.joinDate ? new Date(u.joinDate).toLocaleDateString() : 'N/A'}</div>
            </div>
                            `;

                                // History timeline
                                if (!history.length) {
                                    historyList.innerHTML = '<div class="text-center text-gray-500 py-6 text-sm">No activity history found.</div>';
                                } else {
                                    const typeIcon = {
                                        'verification': '✅', 'daily': '📅', 'redeem': '🎁', 'tasks': '📋',
                                        'referral': '👥', 'number': '📱', 'mail': '📧', 'email': '📧',
                                        'gmail': '📧', 'deposit': '💰', 'transfer': '💸', 'support': '🎧',
                                        'service': '⚡', 'purchase': '🛒', 'bonus': '🎉'
                                    };
                                    historyList.innerHTML = history.slice(0, 50).map(h => {
                                        const icon = typeIcon[h.type] || '📌';
                                        const date = h.date ? new Date(h.date).toLocaleString() : '';
                                        const reward = h.reward || h.amount || '';
                                        const detail = h.detail || h.service || h.code || '';
                                        return `<div class="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                <span class="text-xl">${icon}</span>
                <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-white capitalize text-sm">${h.type || 'activity'}</span>
                        <span class="text-xs text-gray-500">${date}</span>
                    </div>
                    <div class="text-xs text-gray-400 mt-0.5">
                        ${reward ? '<span class="text-yellow-400 font-bold mr-2">' + reward + '</span>' : ''}
                        ${detail ? '<span>' + detail + '</span>' : ''}
                    </div>
                </div>
            </div>`;
                                    }).join('');
                                }

                                resultEl.classList.remove('hidden');
                                emptyEl.textContent = '';
                            } catch (e) {
                                emptyEl.textContent = 'Error loading user data: ' + e.message;
                            }
                        }

                        function openEditUser(userId) {
                            const u = allUsersData.find(user => user.id == userId);
                            if (!u) return;
                            document.getElementById('editUserId').value = userId;
                            document.getElementById('editUserName').textContent = (u.firstName || u.username ||
                                'User') + ' (@' + (u.username || 'N/A') + ')';
                            document.getElementById('editUserTokens').value = u.tokens || 0;
                            document.getElementById('editUserGems').value = u.Gems || 0;
                            document.getElementById('editUserUSD').value = u.usd || 0;

                            let status = 'not';
                            if (u.adminVerified) status = 'admin';
                            else if (u.verified) status = 'verified';
                            document.getElementById('editUserVerified').value = status;

                            // Check if user has API key and show/hide section
                            const apiKeySection = document.getElementById('apiKeySection');
                            if (u.apiKey && u.apiKey.key) {
                                apiKeySection.classList.remove('hidden');
                                const isActive = u.apiKey.active !== false;
                                document.getElementById('apiKeyStatusBadge').textContent = isActive ? 'ACTIVE' :
                                    'INACTIVE';
                                document.getElementById('apiKeyStatusBadge').className = isActive
                                    ? 'px-2 py-1 rounded text-xs font-bold bg-green-500/20 text-green-400'
                                    : 'px-2 py-1 rounded text-xs font-bold bg-red-500/20 text-red-400';
                                document.getElementById('toggleApiKeyBtn').innerHTML = isActive
                                    ? '<i class="fas fa-ban mr-2"></i>Deactivate API Key'
                                    : '<i class="fas fa-check mr-2"></i>Activate API Key';
                                document.getElementById('apiKeyInfo').textContent = `Key: ${u.apiKey.key.substring(0, 20)}...`;
                                // Store current API key status
                                apiKeySection.dataset.userId = userId;
                                apiKeySection.dataset.isActive = isActive;
                            } else {
                                apiKeySection.classList.add('hidden');
                            }

                            document.getElementById('editUserModal').style.display = 'flex';
                        }

                        function saveUserChanges() {
                            const userId = document.getElementById('editUserId').value;
                            const tokens = parseInt(document.getElementById('editUserTokens').value) || 0;
                            const gems = parseInt(document.getElementById('editUserGems').value) || 0;
                            const usd = parseFloat(document.getElementById('editUserUSD').value) || 0;
                            const status = document.getElementById('editUserVerified').value;

                            console.log('[ADMIN] Saving user changes:', { userId, tokens, gems, usd, status });

                            const payload = {
                                tokens: tokens,
                                Gems: gems,
                                balance: tokens,
                                usd: usd,
                                verified: (status === 'verified' || status === 'admin'),
                                adminVerified: (status === 'admin')
                            };

                            fetch(`/api/admin/users/${userId}`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(payload)
                            })
                                .then(r => r.json())
                                .then(data => {
                                    if (data.success) {
                                        document.getElementById('editUserModal').style.display = 'none';
                                        loadUsers();
                                        alert('User updated successfully!');
                                    } else {
                                        alert('Error: ' + data.message);
                                    }
                                })
                                .catch(err => {
                                    console.error('Error saving user changes:', err);
                                    alert('Failed to update user. Check console.');
                                });
                        }

                        function toggleUserApiKey() {
                            const apiKeySection = document.getElementById('apiKeySection');
                            const userId = apiKeySection.dataset.userId;
                            const currentStatus = apiKeySection.dataset.isActive === 'true';
                            const newStatus = !currentStatus;

                            fetch(`/api/admin/users/${userId}/apikey/toggle`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ active: newStatus })
                            })
                                .then(r => r.json())
                                .then(data => {
                                    if (data.success) {
                                        // Update UI
                                        document.getElementById('apiKeyStatusBadge').textContent = newStatus ? 'ACTIVE' :
                                            'INACTIVE';
                                        document.getElementById('apiKeyStatusBadge').className = newStatus
                                            ? 'px-2 py-1 rounded text-xs font-bold bg-green-500/20 text-green-400'
                                            : 'px-2 py-1 rounded text-xs font-bold bg-red-500/20 text-red-400';
                                        document.getElementById('toggleApiKeyBtn').innerHTML = newStatus
                                            ? '<i class="fas fa-ban mr-2"></i>Deactivate API Key'
                                            : '<i class="fas fa-check mr-2"></i>Activate API Key';
                                        apiKeySection.dataset.isActive = newStatus;
                                        alert('API Key ' + (newStatus ? 'activated' : 'deactivated') + ' successfully!');
                                    } else {
                                        alert('Error: ' + data.message);
                                    }
                                })
                                .catch(err => {
                                    console.error('Error toggling API key:', err);
                                    alert('Failed to toggle API key status');
                                });
                        }

                        function toggleBanUser(userId, ban) {
                            if (!confirm(`${ban ? 'Ban' : 'Unban'} this user ? `)) return;
                            fetch(`/api/admin/users/${userId}/ban`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ ban })
                            }).then(() => {
                                loadUsers();
                            });
                        }

                        // BANNED USERS - Load and display banned users
                        async function loadBannedUsers() {
                            const tbody = document.getElementById('bannedUsersTable');
                            if (tbody) tbody.innerHTML = '<tr><td colspan="5" class="text-center text-gray-500 py-8">Loading banned users...</td></tr>';

                            try {
                                const res = await fetch('/api/admin/users');
                                const data = await res.json();
                                if (!data.success) {
                                    if (tbody) tbody.innerHTML = '<tr><td colspan="5" class="text-center text-red-400 py-8">Failed to load banned users</td></tr>';
                                    return;
                                }

                                // Filter only banned users
                                const bannedUsers = data.users.filter(u => u.banned === true);

                                if (bannedUsers.length === 0) {
                                    if (tbody) tbody.innerHTML = '<tr><td colspan="5" class="text-center text-gray-500 py-8">No banned users found</td></tr>';
                                    return;
                                }

                                if (tbody) {
                                    tbody.innerHTML = bannedUsers.map(u => `
            <tr>
                <td>
                    <div class="font-mono text-xs">${u.id}</div>
                </td>
                <td>
                    <div class="font-bold">${u.firstName || u.username || 'Unknown'}</div>
                    <div class="text-xs text-gray-400">@${u.username || 'N/A'}</div>
                </td>
                <td class="text-yellow-400 font-bold">${formatAmountCompact(u.tokens || 0)}</td>
                <td class="text-xs text-gray-400">${u.bannedAt ? new Date(u.bannedAt).toLocaleDateString() : 'Unknown'}</td>
                <td>
                    <button onclick="toggleBanUser('${u.id}', false)"
                        class="bg-green-500/20 text-green-400 px-3 py-1 rounded text-xs font-bold" title="Unban User">
                        <i class="fas fa-check"></i> UNBAN
                    </button>
                </td>
            </tr>`).join('');
                                }
                            } catch (e) {
                                if (tbody) tbody.innerHTML = '<tr><td colspan="5" class="text-center text-red-400 py-8">Error loading banned users</td></tr>';
                            }
                        }

                        function deleteUser(userId) {
                            if (!confirm('⚠️ Permanently delete this user?')) return;
                            fetch(`/api/admin/users/${userId}`, { method: 'DELETE' }).then(() => loadUsers());
                        }

                        function toggleVerifyUser(userId, verify, type) {
                            const action = verify ? (type === 'admin' ? 'Admin verify' : 'Verify') : (type ===
                                'admin' ? 'Remove admin verify' : 'Unverify');
                            if (!confirm(`${action} this user?`)) return;

                            const payload = type === 'admin'
                                ? { adminVerified: verify, verified: verify }
                                : { verified: verify };

                            fetch(`/api/admin/users/${userId}/verify`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(payload)
                            }).then(r => r.json()).then(data => {
                                if (data.success) {
                                    loadUsers();
                                } else {
                                    alert('Error: ' + data.message);
                                }
                            }).catch(() => alert('Network error'));
                        }

                        // CODES
                        function renderCodes() {
                            fetch('/api/admin/codes').then(r => r.json()).then(data => {
                                const tbody = document.getElementById('codesTable');
                                if (!tbody) return;
                                tbody.innerHTML = (data.codes || []).map(c => {
                                    const used = c.used || 0;
                                    const maxUses = c.maxUses || 100;
                                    const remaining = maxUses - used;
                                    return `
            <tr>
                <td class="font-mono text-orange-400">${c.code}</td>
                <td>${c.amount}</td>
                <td>${used}</td>
                <td>${remaining}</td>
                <td><button onclick="deleteCode('${c.code}')" class="text-red-400 hover:text-red-300"><i
                            class="fas fa-trash"></i></button></td>
            </tr>`;
                                }).join('') || '<tr><td colspan="5" class="text-center text-gray-500 py-4">No codes</td></tr>';
                            });
                        }

                        function createCode() {
                            const code = document.getElementById('code-name').value.trim();
                            const amount = parseInt(document.getElementById('code-amount').value) || 0;
                            const maxUses = parseInt(document.getElementById('code-maxuses').value) || 1;
                            if (!code || !amount) return alert('Code and amount required');

                            fetch('/api/admin/codes', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ code, amount, maxUses })
                            })
                                .then(r => r.json())
                                .then(data => {
                                    if (data.success) {
                                        closeModal();
                                        renderCodes();
                                    } else {
                                        alert(data.message || 'Failed to create code');
                                    }
                                });
                        }

                        function deleteCode(code) {
                            if (!confirm('Delete promo code ' + code + '?')) return;
                            fetch('/api/admin/codes/' + code, { method: 'DELETE' }).then(() => renderCodes());
                        }

                        // SECTION SERVICES LOADER
                        function loadSectionServices(section) {
                            console.log('[Section] Loading services for:', section);
                            fetch('/api/admin/services').then(r => r.json()).then(data => {
                                const containerId = 'section-' + section + '-container';
                                let container = document.getElementById(containerId);

                                // Create container if it doesn't exist
                                if (!container) {
                                    const pageSection = document.getElementById('page-' + section);
                                    if (pageSection) {
                                        container = document.createElement('div');
                                        container.id = containerId;
                                        container.className = 'section-services-container';
                                        pageSection.appendChild(container);
                                    }
                                }

                                if (!container) {
                                    console.error('[Section] Container not found for:', section);
                                    return;
                                }

                                const services = data.services || [];
                                const sectionServices = services.filter(s => s.section === section || (section ===
                                    'accounts' && s.section === 'all'));

                                const sectionNames = {
                                    'cards': 'Virtual Cards',
                                    'vpn': 'VPN Services',
                                    'accounts': 'Accounts',
                                    'apikeys': 'API Keys'
                                };

                                let html = `
            <div class="glass-card p-6 rounded-2xl mb-6">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold flex items-center gap-2">
                        <i
                            class="fas fa-${section === 'cards' ? 'credit-card' : section === 'vpn' ? 'shield-alt' : section === 'accounts' ? 'user-circle' : 'key'} text-orange-400"></i>
                        ${sectionNames[section] || section}
                    </h3>
                    <button onclick="openServiceModal('${section}')"
                        class="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg font-bold text-sm hover:opacity-90">
                        <i class="fas fa-plus"></i> Add Service
                    </button>
                </div>
                <div id="${section}-services-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    `;

                                if (sectionServices.length === 0) {
                                    html += `
                    <div class="col-span-full text-center py-8 text-gray-400">
                        <i class="fas fa-inbox text-4xl mb-3 opacity-50"></i>
                        <p>No services in this section yet.</p>
                        <p class="text-sm mt-2">Click "Add Service" to create one.</p>
                    </div>
                    `;
                                } else {
                                    sectionServices.forEach(s => {
                                        html += `
                    <div
                        class="glass-card p-4 rounded-xl border border-white/10 hover:border-orange-500/50 transition-all">
                        <div class="flex items-center gap-3 mb-3">
                            <div
                                class="w-10 h-10 rounded-lg bg-gradient-to-br ${s.color || 'from-blue-500 to-purple-600'} flex items-center justify-center">
                                <i class="fas ${s.icon || 'fa-cube'} text-white"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-sm">${s.name}</h4>
                                <p class="text-xs text-gray-400">${s.id}</p>
                            </div>
                        </div>
                        <p class="text-xs text-gray-400 mb-3">${s.desc || 'No description'}</p>
                        <div class="flex justify-between items-center">
                            <span class="text-xs px-2 py-1 rounded bg-white/10">${s.cost || 0}
                                TC</span>
                            <div class="flex gap-2">
                                <button onclick="editService('${s.id}')"
                                    class="text-blue-400 hover:text-blue-300 text-xs">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="deleteService('${s.id}')"
                                    class="text-red-400 hover:text-red-300 text-xs">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    `;
                                    });
                                }

                                html += `
                </div>
            </div>
            `;

                                container.innerHTML = html;
                            }).catch(err => {
                                console.error('[Section] Error loading services:', err);
                            });
                        }

                        // SERVICES MANAGEMENT WITH SECTION ASSIGNMENT
                        function renderAdminServices() {
                            fetch('/api/admin/services').then(r => r.json()).then(data => {
                                const container = document.getElementById('serviceItemsGrid');
                                if (!container) return;

                                const services = data.services || [];
                                const sections = ['all', 'cards', 'vpn', 'accounts', 'apikeys', 'shop', 'other'];

                                // Group services by section
                                const grouped = {};
                                sections.forEach(s => grouped[s] = []);
                                services.forEach(s => {
                                    const section = s.section || 'all';
                                    if (!grouped[section]) grouped[section] = [];
                                    grouped[section].push(s);
                                });

                                let html = '';
                                sections.forEach(section => {
                                    const sectionServices = grouped[section] || [];
                                    const sectionName = section === 'all' ? 'All Sections' :
                                        section === 'cards' ? 'Cards Section' :
                                            section === 'vpn' ? 'VPN Section' :
                                                section === 'accounts' ? 'Accounts Section' :
                                                    section === 'apikeys' ? 'API Keys Section' :
                                                        section === 'shop' ? 'Shop Section' : 'Other Section';

                                    html += `
            <div class="mb-6">
                <h4 class="text-lg font-bold mb-3 text-orange-400">${sectionName}</h4>
                ${sectionServices.length === 0 ? '<p class="text-gray-500 text-sm">No services assigned</p>' : `
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                ${sectionServices.map(s => `
                    <div class="glass-card p-4 rounded-xl border border-white/10">
                        <div class="flex items-center gap-3 mb-3">
                            <div
                                class="w-10 h-10 rounded-lg bg-gradient-to-br ${s.color || 'from-blue-500 to-purple-600'} flex items-center justify-center">
                                <i class="fas ${s.icon || 'fa-cube'} text-white"></i>
                            </div>
                            <div>
                                <h5 class="font-bold text-sm">${s.name}</h5>
                                <p class="text-xs text-gray-400">${s.id}</p>
                            </div>
                        </div>
                        <p class="text-xs text-gray-400 mb-3">${s.desc || 'No description'}</p>
                        <div class="flex justify-between items-center">
                            <span class="text-xs px-2 py-1 rounded bg-white/10">${s.section ||
                                        'all'}</span>
                            <button onclick="deleteService('${s.id}')" class="text-red-400 hover:text-red-300 text-xs">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                    `).join('')
                                            }
                </div>
                            `}
            </div>
            `;
                                });

                                container.innerHTML = html;
                            });
                        }

                        function deleteService(id) {
                            if (!confirm('Delete service ' + id + '?')) return;
                            fetch('/api/admin/services/' + id, { method: 'DELETE' }).then(() =>
                                renderAdminServices());
                        }

                        function saveAdminService() {
                            const id = document.getElementById('svc-id').value.trim();
                            const name = document.getElementById('svc-name').value.trim();
                            const desc = document.getElementById('svc-desc').value.trim();
                            const icon = document.getElementById('svc-icon').value.trim() || 'fa-cube';
                            const color = document.getElementById('svc-color').value.trim() || 'from-blue-500 to-purple-600';
                            const section = document.getElementById('svc-section').value;
                            const cost = parseInt(document.getElementById('svc-cost').value) || 0;

                            if (!id || !name) return alert('ID and Name are required');

                            const service = { id, name, desc, icon, color, section, cost };

                            fetch('/api/admin/services', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(service)
                            }).then(() => {
                                closeModal();
                                renderAdminServices();
                            });
                        }

                        // TASKS
                        function loadTasks() {
                            fetch('/api/admin/tasks').then(r => r.json()).then(data => {
                                // If no tasks exist, auto-seed defaults
                                if (!data.tasks || data.tasks.length === 0) {
                                    console.log('No tasks found, auto-seeding defaults...');
                                    fetch('/api/admin/tasks/seed-defaults', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' }
                                    }).then(r => r.json()).then(seedData => {
                                        if (seedData.success) {
                                            console.log('Default tasks seeded:', seedData.message);
                                            // Reload tasks after seeding
                                            return fetch('/api/admin/tasks').then(r => r.json());
                                        }
                                        return data;
                                    }).then(newData => {
                                        renderTasksTable(newData.tasks || []);
                                    }).catch(err => {
                                        console.error('Error seeding defaults:', err);
                                        renderTasksTable([]);
                                    });
                                } else {
                                    renderTasksTable(data.tasks);
                                }
                            }).catch(err => {
                                console.error('Error loading tasks:', err);
                                renderTasksTable([]);
                            });
                        }

                        function renderTasksTable(tasks) {
                            const tbody = document.getElementById('tasksTable');
                            if (!tbody) return;
                            tbody.innerHTML = (tasks || []).map(t => `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:8px;">
                        ${t.icon ? `<img src="${t.icon}"
                            style="width:28px; height:28px; object-fit:contain; border-radius:4px;">`
                                    : '<i class="fas fa-tasks text-gray-500"></i>'}
                        <div>
                            <strong>${t.name}</strong><br>
                            <span style="font-size:10px; color:#666;">${t.id}</span>
                        </div>
                    </div>
                    <button
                        onclick="openEditTaskModal('${t.id}', '${escapeHtml(t.name)}', '${escapeHtml(t.url || '')}', ${t.reward || 0}, ${t.gems || 0}, '${escapeHtml(t.icon || '')}')"
                        class="text-blue-400 hover:text-blue-300 text-xs mt-1"
                        style="background:none; border:none; cursor:pointer;">
                        <i class="fas fa-edit"></i> Edit All
                    </button>
                </td>
                <td><input type="number" id="tokens-${t.id}" value="${t.reward || 0}"
                        style="width:70px; background:#1a1a2e; border:1px solid #333; color:#fff; padding:4px 8px; border-radius:6px; text-align:center;"
                        onchange="saveTaskChanges('${t.id}')"></td>
                <td><input type="number" id="gems-${t.id}" value="${t.gems || 0}"
                        style="width:70px; background:#1a1a2e; border:1px solid #333; color:#38bdf8; padding:4px 8px; border-radius:6px; text-align:center;"
                        onchange="saveTaskChanges('${t.id}')"></td>
                <td><a href="${t.url || '#'}" target="_blank"
                        style="color:var(--accent-color); font-size:12px; word-break:break-all;">${t.url
                                || 'N/A'}</a></td>
                <td>
                    <div style="display:flex; gap:6px;">
                        <button onclick="saveTaskChanges('${t.id}')" class="text-green-400 hover:text-green-300"
                            title="Save Changes"><i class="fas fa-save"></i></button>
                        <button onclick="resetTaskForAll('${t.id}')" class="text-orange-400 hover:text-orange-300"
                            title="Reset for All Users"><i class="fas fa-redo"></i></button>
                        <button onclick="deleteTask('${t.id}')" class="text-red-400 hover:text-red-300"
                            title="Delete Task"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
            `).join('');
                        }

                        // Helper to escape HTML
                        function escapeHtml(text) {
                            if (!text) return '';
                            return text.replace(/"/g, '&quot;').replace(/'/g, "&#039;");
                        }

                        // Show toast notification
                        function showToast(message, type = 'success') {
                            const toast = document.createElement('div');
                            const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
                            const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';

                            toast.className = `fixed top-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2`;
                            toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;

                            document.body.appendChild(toast);

                            setTimeout(() => {
                                toast.style.opacity = '0';
                                toast.style.transition = 'opacity 0.3s';
                                setTimeout(() => toast.remove(), 300);
                            }, 3000);
                        }

                        // Open Edit Task Modal
                        function openEditTaskModal(id, name, url, reward, gems, icon = null) {
                            const modal = document.getElementById('editTaskModal');
                            if (!modal) {
                                // Create modal if it doesn't exist
                                createEditTaskModal();
                            }
                            document.getElementById('editTaskId').value = id;
                            document.getElementById('editTaskName').value = name;
                            document.getElementById('editTaskUrl').value = url;
                            document.getElementById('editTaskTokens').value = reward;
                            document.getElementById('editTaskGems').value = gems;
                            document.getElementById('editTaskIcon').value = icon || '';
                            document.getElementById('editTaskIconPreview').src = icon || '';
                            document.getElementById('editTaskIconPreview').style.display = icon ? 'block' :
                                'none';
                            document.getElementById('editTaskModal').style.display = 'flex';
                        }

                        // Create Edit Task Modal
                        function createEditTaskModal() {
                            const modalHtml = `
            <div id="editTaskModal"
                style="display:none; position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.8); z-index:1000; align-items:center; justify-content:center;">
                <div
                    style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:16px; padding:24px; max-width:400px; width:90%; max-height:90vh; overflow-y:auto;">
                    <h3 style="margin-bottom:16px; color:var(--text-main);"><i class="fas fa-edit text-blue-400"></i>
                        Edit
                        Task</h3>
                    <input type="hidden" id="editTaskId">
                    <div style="margin-bottom:12px;">
                        <label style="display:block; font-size:12px; color:var(--text-sub); margin-bottom:4px;">Task
                            Name</label>
                        <input type="text" id="editTaskName"
                            style="width:100%; background:#1a1a2e; border:1px solid #333; color:#fff; padding:8px 12px; border-radius:8px;">
                    </div>
                    <div style="margin-bottom:12px;">
                        <label
                            style="display:block; font-size:12px; color:var(--text-sub); margin-bottom:4px;">URL</label>
                        <input type="text" id="editTaskUrl"
                            style="width:100%; background:#1a1a2e; border:1px solid #333; color:#fff; padding:8px 12px; border-radius:8px;">
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
                        <div>
                            <label
                                style="display:block; font-size:12px; color:var(--text-sub); margin-bottom:4px;">Tokens</label>
                            <input type="number" id="editTaskTokens"
                                style="width:100%; background:#1a1a2e; border:1px solid #333; color:#fff; padding:8px 12px; border-radius:8px; text-align:center;">
                        </div>
                        <div>
                            <label
                                style="display:block; font-size:12px; color:var(--text-sub); margin-bottom:4px;">Gems</label>
                            <input type="number" id="editTaskGems"
                                style="width:100%; background:#1a1a2e; border:1px solid #333; color:#38bdf8; padding:8px 12px; border-radius:8px; text-align:center;">
                        </div>
                    </div>
                    <div style="margin-bottom:16px;">
                        <label
                            style="display:block; font-size:12px; color:var(--text-sub); margin-bottom:4px;">Icon</label>
                        <input type="file" id="editTaskIconFile" accept="image/*" style="display:none;"
                            onchange="handleIconFileUpload(this)">
                        <div style="display:flex; gap:8px; margin-bottom:8px;">
                            <input type="text" id="editTaskIcon" placeholder="https://example.com/icon.png"
                                style="flex:1; background:#1a1a2e; border:1px solid #333; color:#fff; padding:8px 12px; border-radius:8px;">
                            <button onclick="document.getElementById('editTaskIconFile').click()"
                                style="background:#333; color:#fff; border:none; padding:8px 16px; border-radius:8px; cursor:pointer; white-space:nowrap;">
                                <i class="fas fa-upload"></i> Upload
                            </button>
                        </div>
                        <img id="editTaskIconPreview"
                            style="width:40px; height:40px; object-fit:contain; border-radius:8px; display:none; border:1px solid #333;">
                        <div style="margin-top:8px; font-size:11px; color:#666;">
                            <i class="fas fa-info-circle"></i> Leave empty for default icons
                            (YouTube, Telegram, etc.)
                        </div>
                    </div>
                    <div style="display:flex; gap:8px; justify-content:flex-end;">
                        <button onclick="closeEditTaskModal()"
                            style="background:#333; color:#fff; border:none; padding:8px 16px; border-radius:8px; cursor:pointer;">Cancel</button>
                        <button onclick="saveFullTaskEdit()"
                            style="background:var(--accent-color); color:#000; border:none; padding:8px 16px; border-radius:8px; cursor:pointer; font-weight:600;"><i
                                class="fas fa-save"></i> Save</button>
                    </div>
                </div>
            </div>`;
                            document.body.insertAdjacentHTML('beforeend', modalHtml);
                        }

                        // Close Edit Task Modal
                        function closeEditTaskModal() {
                            const modal = document.getElementById('editTaskModal');
                            if (modal) modal.style.display = 'none';
                        }

                        // Save Full Task Edit (from modal)
                        async function saveFullTaskEdit() {
                            const id = document.getElementById('editTaskId').value;
                            const name = document.getElementById('editTaskName').value;
                            const url = document.getElementById('editTaskUrl').value;
                            const tokens = parseInt(document.getElementById('editTaskTokens').value) || 0;
                            const gems = parseInt(document.getElementById('editTaskGems').value) || 0;
                            const icon = document.getElementById('editTaskIcon').value.trim();

                            try {
                                const res = await fetch('/api/admin/tasks/' + id, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ name, url, reward: tokens, gems, icon: icon || null })
                                });
                                const data = await res.json();
                                if (data.success) {
                                    showToast('Task updated successfully!');
                                    closeEditTaskModal();
                                    loadTasks();
                                } else {
                                    alert(data.message || 'Failed to update task');
                                }
                            } catch (e) {
                                alert('Network error');
                            }
                        }

                        // Seed/Reset default tasks
                        async function seedDefaultTasks() {
                            if (!confirm('Are you sure? This will add the 2 default tasks (YouTube Channel, Telegram Group) if they are missing.')) return;

                            try {
                                const res = await fetch('/api/admin/tasks/seed-defaults', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' }
                                });
                                const data = await res.json();
                                if (data.success) {
                                    alert(`✅ ${data.message}\nTotal tasks: ${data.totalTasks}`);
                                    loadTasks();
                                } else {
                                    alert('❌ Error: ' + (data.message || 'Failed to seed tasks'));
                                }
                            } catch (e) {
                                alert('❌ Network error');
                            }
                        }

                        // Update task reward (tokens and gems)
                        function updateTaskReward(taskId) {
                            // This function is called on input change, actual save happens when clicking save
                            button
                        }

                        // Save task changes
                        async function saveTaskChanges(taskId) {
                            const tokens = parseInt(document.getElementById(`tokens-${taskId}`).value) || 0;
                            const gems = parseInt(document.getElementById(`gems-${taskId}`).value) || 0;

                            try {
                                const res = await fetch(`/api/admin/tasks/${taskId}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ reward: tokens, gems: gems })
                                });
                                const data = await res.json();
                                if (data.success) {
                                    showToast('Task updated successfully!');
                                    loadTasks();
                                } else {
                                    alert(data.message || 'Failed to update task');
                                }
                            } catch (e) {
                                alert('Network error updating task');
                            }
                        }

                        // Reset task for all users
                        async function resetTaskForAll(taskId) {
                            if (!confirm('Are you sure? This will reset the task for ALL users, allowing them to complete it again and earn rewards.')) return;

                            try {
                                const res = await fetch(`/api/admin/tasks/${taskId}/reset`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' }
                                });
                                const data = await res.json();
                                if (data.success) {
                                    showToast(`Task reset for ${data.affectedUsers || 0} users!`);
                                } else {
                                    alert(data.message || 'Failed to reset task');
                                }
                            } catch (e) {
                                alert('Network error resetting task');
                            }
                        }

                        function addTask() {
                            const name = document.getElementById('task-name').value.trim();
                            const reward = parseInt(document.getElementById('task-reward').value) || 0;
                            const gems = parseInt(document.getElementById('task-gems').value) || 0;
                            const url = document.getElementById('task-url').value.trim();
                            if (!name || !reward) return alert('Name and reward required');

                            fetch('/api/admin/tasks', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ name, reward, gems, url })
                            })
                                .then(r => r.json())
                                .then(data => {
                                    if (data.success) {
                                        closeModal();
                                        loadTasks();
                                    } else {
                                        alert(data.message || 'Failed to create task');
                                    }
                                });
                        }

                        function deleteTask(id) {
                            if (!confirm('Delete this task? Users will no longer see it.')) return;
                            fetch('/api/admin/tasks/' + id, { method: 'DELETE' }).then(() => loadTasks());
                        }

                        // Handle icon file upload - convert to base64
                        function handleIconFileUpload(input) {
                            const file = input.files[0];
                            if (!file) return;

                            // Check file size (max 100KB)
                            if (file.size > 100 * 1024) {
                                alert('File too large! Maximum size is 100KB. Please use a smaller image or compress it.');
                                input.value = '';
                                return;
                            }

                            const reader = new FileReader();
                            reader.onload = (e) => {
                                const base64 = e.target.result;
                                document.getElementById('editTaskIcon').value = base64;
                                document.getElementById('editTaskIconPreview').src = base64;
                                document.getElementById('editTaskIconPreview').style.display = 'block';
                            };
                            reader.readAsDataURL(file);
                        }

                        // MODAL
                        function showModal(type) {
                            console.log('showModal called with type:', type);
                            closeModal();
                            const el = document.getElementById('modal-' + type);
                            console.log('Modal element found:', el);
                            if (!el) {
                                alert('Modal not found: modal-' + type);
                                return;
                            }
                            el.style.display = 'flex';
                            el.style.alignItems = 'center';
                            el.style.justifyContent = 'center';
                            console.log('Modal displayed successfully');
                        }

                        function closeModal() {
                            document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
                        }

                        // ==================== SERVICES MANAGEMENT ====================
                        let currentServiceItem = null;
                        let currentServiceCategory = null;
                        let serviceInputMethod = 'single';
                        let currentManageItem = null;
                        let currentManageCategory = null;

                        // Category data
                        const categoryData = {
                            'virtual-cards': {
                                name: 'Virtual Cards',
                                desc: 'API Keys & Accounts',
                                icon: 'fa-credit-card',
                                color: 'orange'
                            },
                            'vpn': {
                                name: 'VPN Services',
                                desc: 'VPN Access & Accounts',
                                icon: 'fa-shield-alt',
                                color: 'cyan'
                            }
                        };

                        // Select category and show its items
                        function selectCategory(categoryId) {
                            // Update tab styles
                            document.querySelectorAll('.category-tab').forEach(tab => {
                                if (tab.dataset.category === categoryId) {
                                    tab.classList.add('bg-orange-500/20', 'text-orange-400', 'active');
                                    tab.classList.remove('bg-black/20', 'text-gray-400');
                                } else {
                                    tab.classList.remove('bg-orange-500/20', 'text-orange-400', 'active');
                                    tab.classList.add('bg-black/20', 'text-gray-400');
                                }
                            });

                            // Update category info
                            const cat = categoryData[categoryId];
                            if (cat) {
                                document.getElementById('selectedCategoryName').textContent = cat.name;
                                document.getElementById('selectedCategoryDesc').textContent = cat.desc;
                                document.getElementById('selectedCategoryIcon').innerHTML = `<i
                class="fas ${cat.icon} text-${cat.color}-400 text-xl"></i>`;
                                document.getElementById('selectedCategoryIcon').className = `w-12 h-12 rounded-xl
            bg-${cat.color}-500/20 flex items-center justify-center`;
                            }

                            // Show/hide items based on category
                            document.querySelectorAll('.service-item-box').forEach(box => {
                                if (box.dataset.category === categoryId) {
                                    box.classList.remove('hidden');
                                } else {
                                    box.classList.add('hidden');
                                }
                            });

                            // Update category total
                            const visibleItems =
                                document.querySelectorAll(`.service-item-box[data-category="${categoryId}"]:not(.hidden)`);
                            let totalCount = 0;
                            visibleItems.forEach(item => {
                                const badge = item.querySelector('.item-count-badge');
                                if (badge) {
                                    const count = parseInt(badge.textContent) || 0;
                                    totalCount += count;
                                }
                            });
                            document.getElementById('categoryTotalStock').textContent = totalCount + ' items';
                        }

                        // Open item management modal
                        function openItemManageModal(itemId, itemName, category) {
                            currentManageItem = itemId;
                            currentManageCategory = category;

                            // Get item count from badge
                            const badge = document.querySelector(`.item-count-badge[data-item="${itemId}"]`);
                            const itemCount = badge ? parseInt(badge.textContent) || 0 : 0;

                            // Get item type from box
                            const box = document.querySelector(`.service-item-box[data-item="${itemId}"]`);
                            const typeLabel = box ? box.querySelector('.text-xs.text-gray-400')?.textContent ||
                                'Items' : 'Items';

                            // Update modal info
                            document.getElementById('itemManageModalTitle').textContent = 'Manage ' + itemName;
                            document.getElementById('itemManageModalCategory').textContent =
                                categoryData[category]?.name || category;
                            document.getElementById('itemManageName').textContent = itemName;
                            document.getElementById('itemManageType').textContent = typeLabel;
                            document.getElementById('itemManageCount').textContent = itemCount;

                            // Update icon
                            const cat = categoryData[category];
                            const iconClass = cat ? cat.icon : 'fa-box';
                            const iconColor = cat ? cat.color : 'orange';
                            document.getElementById('itemManageIcon').className = `w-12 h-12 rounded-xl
            bg-${iconColor}-500/20 flex items-center justify-center`;
                            document.getElementById('itemManageIcon').innerHTML = `<i
                class="fas ${iconClass} text-${iconColor}-400 text-xl"></i>`;

                            // Show modal
                            document.getElementById('itemManageModal').style.display = 'flex';
                        }

                        // Close item management modal
                        function closeItemManageModal() {
                            document.getElementById('itemManageModal').style.display = 'none';
                        }

                        // Edit service item - uses global currentManageItem set by openItemManageModal
                        function editServiceItem() {
                            const itemId = window.currentManageItem || currentManageItem;
                            if (!itemId) {
                                alert('No item selected. Please close and reopen the modal.');
                                return;
                            }
                            alert('Edit functionality for ' + itemId + ' - This will open an edit form');
                            // TODO: Implement edit form
                        }

                        // Clear item data (remove all cards/items)
                        function clearItemData() {
                            if (!currentManageItem) return;
                            if (!confirm(`Are you sure? This will remove ALL items from ${currentManageItem}. This action cannot be undone!`)) return;

                            // Update the badge count to 0
                            const badge = document.querySelector(`.item-count-badge[data-item="${currentManageItem}"]`);
                            if (badge) {
                                badge.textContent = '0 items';
                            }

                            // Update modal count
                            document.getElementById('itemManageCount').textContent = '0';

                            // Close modal and show success
                            closeItemManageModal();
                            showToast('All items cleared successfully!');

                            // Update category total
                            selectCategory(currentManageCategory);
                        }

                        // Delete service item completely
                        function deleteServiceItem() {
                            if (!currentManageItem) return;
                            if (!confirm(`Are you sure? This will DELETE the item box "${currentManageItem}" completely. This action cannot be undone!`)) return;

                            // Remove the item box
                            const box = document.querySelector(`.service-item-box[data-item="${currentManageItem}"]`);
                            if (box) box.remove();

                            // Close modal
                            closeItemManageModal();
                            showToast(`${currentManageItem} has been deleted!`);

                            // Update category total
                            selectCategory(currentManageCategory);
                        }

                        // Open add category modal
                        function openAddCategoryModal() {
                            document.getElementById('categoryModalTitle').textContent = 'Add Category';
                            document.getElementById('categoryId').value = '';
                            document.getElementById('categoryName').value = '';
                            document.getElementById('categoryDesc').value = '';
                            document.getElementById('categoryIcon').value = 'fa-box';
                            document.getElementById('categoryModal').style.display = 'flex';
                        }

                        // Close category modal
                        function closeCategoryModal() {
                            document.getElementById('categoryModal').style.display = 'none';
                        }

                        // Preview category logo image
                        function previewCategoryLogo(input) {
                            if (input.files && input.files[0]) {
                                const reader = new FileReader();
                                reader.onload = function (e) {
                                    const preview = document.getElementById('categoryLogoPreview');
                                    if (preview) {
                                        preview.innerHTML = '<img src="' + e.target.result + '" class="w-full h-full object-cover rounded-lg">';
                                    }
                                };
                                reader.readAsDataURL(input.files[0]);
                            }
                        }

                        // Save category
                        function saveCategory() {
                            const name = document.getElementById('categoryName').value.trim();
                            const desc = document.getElementById('categoryDesc').value.trim();
                            const icon = document.getElementById('categoryIcon').value.trim() || 'fa-box';

                            if (!name) {
                                alert('Please enter a category name');
                                return;
                            }

                            const categoryId = name.toLowerCase().replace(/\s+/g, '-');

                            categoryData[categoryId] = {
                                name: name,
                                desc: desc || 'Category description',
                                icon: icon,
                                color: 'purple'
                            };

                            const tabsContainer = document.getElementById('categoryTabs');
                            const newTab = document.createElement('div');
                            newTab.className = 'flex items-center gap-2 px-4 py-2 bg-black/20 text-gray-400 rounded-lg cursor-pointer category-tab';
                            newTab.dataset.category = categoryId;
                            newTab.onclick = function () { selectCategory(categoryId); };
                            newTab.innerHTML = '<i class="fas ' + icon + '"></i><span>' + name + '</span>';
                            tabsContainer.appendChild(newTab);

                            closeCategoryModal();
                            selectCategory(categoryId);
                            alert('Category "' + name + '" added successfully!');
                        }

                        // Edit current category
                        function editCurrentCategory() {
                            const activeTab = document.querySelector('.category-tab.active');
                            if (!activeTab) return;
                            const categoryId = activeTab.dataset.category;
                            const cat = categoryData[categoryId];

                            if (cat) {
                                document.getElementById('categoryModalTitle').textContent = 'Edit Category';
                                document.getElementById('categoryId').value = categoryId;
                                document.getElementById('categoryName').value = cat.name;
                                document.getElementById('categoryDesc').value = cat.desc;
                                document.getElementById('categoryIcon').value = cat.icon;
                                document.getElementById('categoryModal').style.display = 'flex';
                            }
                        }

                        // Delete current category
                        function deleteCurrentCategory() {
                            const activeTab = document.querySelector('.category-tab.active');
                            if (!activeTab) return;
                            const categoryId = activeTab.dataset.category;

                            if (categoryId === 'virtual-cards' || categoryId === 'vpn') {
                                alert('Cannot delete default categories!');
                                return;
                            }

                            if (!confirm(`Are you sure you want to delete the category
            "${categoryData[categoryId]?.name}"? All items in this category will be removed!`))
                                return;

                            // Remove category tab
                            activeTab.remove();

                            // Remove category data
                            delete categoryData[categoryId];

                            // Remove all items in this category
                            document.querySelectorAll(`.service-item-box[data-category="${categoryId}"]`).forEach(box => box.remove());

                            // Select default category
                            selectCategory('virtual-cards');

                            alert('Category deleted successfully!');
                        }

                        // Initialize services page
                        document.addEventListener('DOMContentLoaded', () => {
                            // Select default category
                            selectCategory('virtual-cards');
                        });

                        // Load service items on page init
                        async function loadServiceItems() {
                            try {
                                const res = await fetch('/api/admin/services');
                                const data = await res.json();

                                if (data.success && data.services) {
                                    updateServiceStockDisplay(data.services);
                                    renderServiceItemsTable(data.services);
                                }
                            } catch (e) {
                                console.error('Error loading service items:', e);
                            }
                        }

                        function updateServiceStockDisplay(items) {
                            // Calculate stock for each item
                            const stockMap = {};
                            let virtualCardsTotal = 0;
                            let vpnTotal = 0;

                            items.forEach(item => {
                                const count = item.stock || 0;
                                stockMap[item.id] = count;

                                if (item.section === 'cards' || item.id === 'gemini' || item.id === 'chatgpt' ||
                                    item.id === 'spotify' || item.id === '4jibit') {
                                    virtualCardsTotal += count;
                                } else if (item.section === 'vpn') {
                                    vpnTotal += count;
                                }
                            });

                            // Update individual stock displays
                            const stock4jibit = document.getElementById('stock-4jibit');
                            const stockGemini = document.getElementById('stock-gemini');
                            const stockChatgpt = document.getElementById('stock-chatgpt');

                            if (stock4jibit) stock4jibit.textContent = stockMap['4jibit'] || 0;
                            if (stockGemini) stockGemini.textContent = stockMap['gemini'] || 0;
                            if (stockChatgpt) stockChatgpt.textContent = stockMap['chatgpt'] || 0;

                            // Update category totals
                            const virtualCardsTotalStock = document.getElementById('virtualCardsTotalStock');
                            const vpnTotalStock = document.getElementById('vpnTotalStock');
                            if (virtualCardsTotalStock) virtualCardsTotalStock.textContent = virtualCardsTotal +
                                ' items';
                            if (vpnTotalStock) vpnTotalStock.textContent = vpnTotal + ' items';
                        }

                        function openServiceItemModal(itemId, category) {
                            currentServiceItem = itemId;
                            currentServiceCategory = category;

                            // Set modal title and category
                            const titles = {
                                '4jibit': '4jibit API Keys',
                                'gemini': 'Gemini API Keys',
                                'chatgpt': 'ChatGPT API Keys'
                            };

                            document.getElementById('serviceItemModalTitle').textContent = titles[itemId] ||
                                itemId;
                            document.getElementById('serviceItemCategory').textContent = category;

                            // Hide VPN name field for virtual cards
                            document.getElementById('vpnItemNameField').style.display = 'none';

                            // Load current stock
                            loadCurrentItemStock(itemId);

                            // Reset input fields
                            document.getElementById('singleItemValue').value = '';
                            document.getElementById('singleItemInfo').value = '';
                            document.getElementById('bulkItemValues').value = '';
                            document.getElementById('bulkCount').textContent = '0 items';

                            // Set default input method
                            setInputMethod('single');

                            // Show modal
                            document.getElementById('serviceItemModal').style.display = 'flex';
                        }

                        function openAddVpnItemModal() {
                            currentServiceItem = 'new';
                            currentServiceCategory = 'vpn';

                            document.getElementById('serviceItemModalTitle').textContent = 'Add VPN Service';
                            document.getElementById('serviceItemCategory').textContent = 'VPN Services';

                            // Show VPN name field
                            document.getElementById('vpnItemNameField').style.display = 'block';
                            document.getElementById('vpnItemName').value = '';

                            document.getElementById('currentItemStock').textContent = '0';

                            // Reset input fields
                            document.getElementById('singleItemValue').value = '';
                            document.getElementById('singleItemInfo').value = '';
                            document.getElementById('bulkItemValues').value = '';
                            document.getElementById('bulkCount').textContent = '0 items';

                            setInputMethod('single');

                            document.getElementById('serviceItemModal').style.display = 'flex';
                        }

                        async function loadCurrentItemStock(itemId) {
                            try {
                                const res = await fetch(`/api/admin/services/${itemId}/stock`);
                                const data = await res.json();
                                document.getElementById('currentItemStock').textContent = data.stock || 0;
                            } catch (e) {
                                document.getElementById('currentItemStock').textContent = '0';
                            }
                        }

                        function setInputMethod(method) {
                            serviceInputMethod = method;

                            const singleTab = document.getElementById('tab-single');
                            const bulkTab = document.getElementById('tab-bulk');
                            const singleSection = document.getElementById('singleInputSection');
                            const bulkSection = document.getElementById('bulkInputSection');

                            if (method === 'single') {
                                singleTab.classList.add('bg-orange-500/20', 'text-orange-400');
                                singleTab.classList.remove('bg-black/20', 'text-gray-400');
                                bulkTab.classList.add('bg-black/20', 'text-gray-400');
                                bulkTab.classList.remove('bg-orange-500/20', 'text-orange-400');
                                singleSection.style.display = 'block';
                                bulkSection.style.display = 'none';
                            } else {
                                bulkTab.classList.add('bg-orange-500/20', 'text-orange-400');
                                bulkTab.classList.remove('bg-black/20', 'text-gray-400');
                                singleTab.classList.add('bg-black/20', 'text-gray-400');
                                singleTab.classList.remove('bg-orange-500/20', 'text-orange-400');
                                singleSection.style.display = 'none';
                                bulkSection.style.display = 'block';
                            }
                        }

                        // Update bulk count on input
                        document.getElementById('bulkItemValues')?.addEventListener('input', function () {
                            const lines = this.value.split('\n').filter(line => line.trim());
                            document.getElementById('bulkCount').textContent = lines.length + ' items';
                        });

                        async function saveServiceItems() {
                            const cost = parseInt(document.getElementById('itemCost').value) || 10;
                            let items = [];

                            if (serviceInputMethod === 'single') {
                                const value = document.getElementById('singleItemValue').value.trim();
                                const info = document.getElementById('singleItemInfo').value.trim();

                                if (!value) {
                                    alert('Please enter an item value');
                                    return;
                                }

                                items.push({ value, info });
                            } else {
                                const bulkText = document.getElementById('bulkItemValues').value.trim();
                                if (!bulkText) {
                                    alert('Please enter at least one item');
                                    return;
                                }

                                bulkText.split('\n').forEach(line => {
                                    line = line.trim();
                                    if (line) {
                                        const parts = line.split('|');
                                        items.push({
                                            value: parts[0].trim(),
                                            info: parts[1] ? parts[1].trim() : ''
                                        });
                                    }
                                });
                            }

                            const payload = {
                                itemId: currentServiceItem,
                                category: currentServiceCategory,
                                cost: cost,
                                items: items
                            };

                            // Add VPN name if it's a new VPN item
                            if (currentServiceCategory === 'vpn' && currentServiceItem === 'new') {
                                const vpnName = document.getElementById('vpnItemName').value.trim();
                                if (!vpnName) {
                                    alert('Please enter a VPN service name');
                                    return;
                                }
                                payload.vpnName = vpnName;
                            }

                            try {
                                const res = await fetch('/api/admin/services/items', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(payload)
                                });

                                const data = await res.json();

                                if (data.success) {
                                    alert(`Successfully added ${items.length} item(s)!`);
                                    closeServiceItemModal();
                                    loadServiceItems(); // Refresh displays
                                } else {
                                    alert('Error: ' + (data.message || 'Failed to save items'));
                                }
                            } catch (e) {
                                alert('Network error saving items');
                            }
                        }

                        function closeServiceItemModal() {
                            document.getElementById('serviceItemModal').style.display = 'none';
                            currentServiceItem = null;
                            currentServiceCategory = null;
                        }

                        async function loadAllServiceItems() {
                            await loadServiceItems();
                        }

                        function filterServiceItems() {
                            const filter = document.getElementById('serviceFilter').value;
                            // Re-render table with filter
                            loadServiceItems().then(() => {
                                if (filter !== 'all') {
                                    const rows = document.querySelectorAll('#serviceItemsTableBody tr');
                                    rows.forEach(row => {
                                        const category = row.getAttribute('data-category');
                                        if (category && category !== filter) {
                                            row.style.display = 'none';
                                        }
                                    });
                                }
                            });
                        }

                        function renderServiceItemsTable(items) {
                            const tbody = document.getElementById('serviceItemsTableBody');
                            if (!tbody) return;

                            if (items.length === 0) {
                                tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-gray-500">No service items configured</td></tr>';
                                return;
                            }

                            tbody.innerHTML = items.map(item => `
            <tr data-category="${item.section || 'other'}" class="border-b border-white/5 hover:bg-white/5">
                <td class="py-3">
                    <span
                        class="px-2 py-1 rounded text-xs ${item.section === 'cards' || item.id === 'gemini' || item.id === 'chatgpt' ? 'bg-orange-500/20 text-orange-400' : 'bg-cyan-500/20 text-cyan-400'}">
                        ${item.section === 'cards' || item.id === 'gemini' || item.id ===
                                    'chatgpt' ? 'Virtual Cards' : item.section || 'Other'}
                    </span>
                </td>
                <td class="py-3 text-white font-medium">${item.name || item.id}</td>
                <td class="py-3 text-gray-400">${item.id}</td>
                <td class="py-3 text-orange-400 font-bold">${item.price || 0} TC</td>
                <td class="py-3">
                    <span
                        class="px-2 py-1 rounded-full text-xs ${(item.stock || 0) > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">
                        ${item.stock || 0} in stock
                    </span>
                </td>
                <td class="py-3">
                    <button onclick="openServiceItemModal('${item.id}', '${item.section || 'Other'}')"
                        class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition">
                        <i class="fas fa-edit"></i> Manage
                    </button>
                </td>
            </tr>
            `).join('');
                        }

                        async function editServiceItem(itemId) {
                            // Implementation for editing service item
                            alert('Edit functionality for ' + itemId);
                        }

                        async function toggleServiceItem(itemId, activate) {
                            try {
                                const res = await fetch(`/api/admin/services/${itemId}/toggle`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ active: activate })
                                });

                                const data = await res.json();
                                if (data.success) {
                                    loadServiceItems();
                                } else {
                                    alert('Error toggling item status');
                                }
                            } catch (e) {
                                alert('Network error');
                            }
                        }

                        async function exportDatabase() {
                            try {
                                const res = await fetch('/api/admin/db/export');
                                const data = await res.json();
                                if (data.success) {
                                    alert('Data generated and sent to your Telegram account successfully!');
                                    loadBackupHistory();
                                    loadDbSchedule(); // to update last backup time
                                } else {
                                    alert('Export failed: ' + (data.message || 'Unknown error'));
                                }
                            } catch (err) {
                                alert('Error exporting database: ' + err.message);
                            }
                        }

                        function importDatabase(input) {
                            const file = input.files[0];
                            if (!file) return;

                            const reader = new FileReader();
                            reader.onload = async (e) => {
                                try {
                                    const dbData = JSON.parse(e.target.result);
                                    const confirmImport = confirm('Are you sure you want to upload and merge this data? This might modify current data.');
                                    if (!confirmImport) return;

                                    const res = await fetch('/api/admin/db/import', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ data: dbData })
                                    });

                                    const data = await res.json();
                                    if (data.success) {
                                        alert('Data uploaded and merged successfully!');
                                        window.location.reload();
                                    } else {
                                        alert('Import failed: ' + (data.message || 'Unknown error'));
                                    }
                                } catch (err) {
                                    alert('Invalid JSON file or error: ' + err.message);
                                }
                            };
                            reader.readAsText(file);
                            input.value = ''; // Reset input
                        }

                        async function wipeDatabase() {
                            const conf1 = confirm('WARNING: Are you sure you want to completely WIPE all user, test, and demo data?');
                            if (!conf1) return;
                            const conf2 = prompt('To confirm wiping the database, type "WIPE":');
                            if (conf2 !== 'WIPE') return;

                            try {
                                const res = await fetch('/api/admin/db/wipe', { method: 'POST' });
                                const data = await res.json();
                                if (data.success) {
                                    alert('Database wiped successfully!');
                                    window.location.reload();
                                } else {
                                    alert('Wiping failed: ' + (data.message || 'Unknown error'));
                                }
                            } catch (err) {
                                alert('Error wiping database: ' + err.message);
                            }
                        }

                        function _fmtDateTime(ts) {
                            if (!ts) return '-';
                            try {
                                return new Date(ts).toLocaleString();
                            } catch (e) {
                                return '-';
                            }
                        }

                        async function loadDbSchedule() {
                            try {
                                const res = await fetch('/api/admin/db/schedule');
                                const data = await res.json();
                                if (!data.success) {
                                    alert(data.message || 'Failed to load schedule');
                                    return;
                                }

                                const s = data.schedule || {};
                                const enabledEl = document.getElementById('db-auto-enabled');
                                const daysEl = document.getElementById('db-auto-days');
                                const timeEl = document.getElementById('db-auto-time');
                                const keepEl = document.getElementById('db-auto-keep');

                                if (enabledEl) enabledEl.checked = s.enabled === true;
                                if (daysEl) daysEl.value = (s.backupDays ?? 1);
                                if (timeEl) timeEl.value = (s.backupTime ?? '06:00');
                                if (keepEl) keepEl.value = (s.keep ?? 30);

                                const lastEl = document.getElementById('db-last-backup');
                                const nextEl = document.getElementById('db-next-backup');
                                const sizeEl = document.getElementById('db-current-size');
                                if (lastEl) lastEl.textContent = _fmtDateTime(data.lastBackupAt);
                                if (nextEl) nextEl.textContent = _fmtDateTime(data.nextBackupAt);
                                if (sizeEl) sizeEl.textContent = (data.dbSize / 1024).toFixed(1) + ' KB';
                            } catch (e) {
                                console.error('Error loading schedule:', e);
                            }
                        }

                        async function saveDbSchedule() {
                            const enabled = document.getElementById('db-auto-enabled')?.checked === true;
                            const backupDays = parseInt(document.getElementById('db-auto-days')?.value) || 1;
                            const backupTime = (document.getElementById('db-auto-time')?.value ||
                                '06:00').trim();
                            const keep = parseInt(document.getElementById('db-auto-keep')?.value) || 30;

                            try {
                                const res = await fetch('/api/admin/db/schedule', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ enabled, backupDays, backupTime, keep })
                                });
                                const data = await res.json();
                                if (!data.success) {
                                    alert(data.message || 'Failed to save schedule');
                                    return;
                                }

                                alert('Schedule saved ');
                                await loadDbSchedule();
                            } catch (e) {
                                alert('Error saving schedule: ' + e.message);
                            }
                        }
                        async function loadBackupHistory() {
                            const tbody = document.getElementById('backupHistoryTable');
                            if (!tbody) return;
                            tbody.innerHTML = '';

                            try {
                                const res = await fetch('/api/admin/db/backups');
                                const data = await res.json();
                                if (!data.success) {
                                    tbody.innerHTML = '';
                                    return;
                                }

                                if (!data.files || data.files.length === 0) {
                                    tbody.innerHTML = '';
                                    return;
                                }

                                tbody.innerHTML = data.files.slice(0, 50).map(f => `
            <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td class="py-4 font-mono text-xs text-gray-300">${f.file}</td>
                <td class="py-4 text-gray-400">${(f.size / 1024).toFixed(1)} KB</td>
                <td class="py-4 text-gray-400">${_fmtDateTime(f.mtime)}</td>
                <td class="py-4 text-right">
                    <div class="flex gap-2 justify-end">
                        <a href="/api/admin/db/download/${f.file}" download
                            class="bg-green-500/20 text-green-400 hover:bg-green-500/30 px-3 py-1 rounded text-xs font-bold transition-all">
                            <i class="fas fa-download mr-1"></i>
                        </a>
                        <button onclick="restoreBackupFromHistory('${f.file}')"
                            class="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-3 py-1 rounded text-xs font-bold transition-all"
                            title="Restore">
                            <i class="fas fa-undo mr-1"></i> RESTORE
                        </button>
                        <button onclick="deleteBackupFromHistory('${f.file}')"
                            class="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1 rounded text-xs font-bold transition-all"
                            title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
            `).join('');
                            } catch (e) {
                                tbody.innerHTML = '';
                            }
                        }

                        async function restoreBackupFromHistory(file) {
                            // Removed confirmation popup
                            if (false) { }

                            try {
                                const res = await fetch('/api/admin/db/restore', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ file })
                                });
                                const data = await res.json();
                                if (data.success) {
                                    alert('Database restored successfully! The page will now reload.');
                                    window.location.reload();
                                } else {
                                    alert('Restore failed: ' + data.message);
                                }
                            } catch (e) {
                                alert('Error restoring backup: ' + e.message);
                            }
                        }

                        async function deleteBackupFromHistory(file) {
                            // Removed confirmation popup
                            if (false) { }

                            try {
                                const res = await fetch(`/api/admin/db/backups/${file}`, {
                                    method: 'DELETE'
                                });
                                const data = await res.json();
                                if (data.success) {
                                    alert('Backup deleted successfully.');
                                    loadBackupHistory();
                                } else {
                                    alert('Delete failed: ' + data.message);
                                }
                            } catch (e) {
                                alert('Error deleting backup: ' + e.message);
                            }
                        }
                        async function loadStorageStatus() {
                            const badge = document.getElementById('drive-badge');
                            const email = document.getElementById('drive-email');
                            const usageText = document.getElementById('drive-usage-text');
                            const progress = document.getElementById('drive-progress');
                            const btnConnect = document.getElementById('btn-drive-connect');
                            const btnDisconnect = document.getElementById('btn-drive-disconnect');

                            try {
                                const res = await fetch('/api/admin/storage/status');
                                const data = await res.json();

                                if (data.connected) {
                                    badge.textContent = 'CONNECTED';
                                    badge.className = 'px-2 py-0.5 bg-green-500/20 text-green-500 text-[10px] rounded';
                                    email.textContent = data.info.user || 'Connected';

                                    const used = (data.info.used / (1024 * 1024)).toFixed(1);
                                    const total = (data.info.total / (1024 * 1024 * 1024)).toFixed(1); // GB
                                    usageText.textContent = `${used} MB/${total} GB`;

                                    const percent = Math.min(100, Math.round((data.info.used / data.info.total) * 100))
                                        || 0;
                                    progress.style.width = percent + '%';

                                    btnConnect.style.display = 'none';
                                    btnDisconnect.style.display = 'block';
                                } else {
                                    badge.textContent = 'DISCONNECTED';
                                    badge.className = 'px-2 py-0.5 bg-red-500/20 text-red-500 text-[10px] rounded';
                                    email.textContent = 'None';
                                    usageText.textContent = '0 MB/0 MB';
                                    progress.style.width = '0%';
                                    btnConnect.style.display = 'block';
                                    btnDisconnect.style.display = 'none';
                                }
                            } catch (e) {
                                console.error('Storage status error:', e);
                            }
                        }


                        // ACCOUNTS MANAGEMENT
                        async function loadAccounts() {
                            try {
                                const res = await fetch('/api/admin/accounts');
                                const data = await res.json();
                                if (data.success) renderAccounts(data.accounts);
                            } catch (e) { console.error('Failed to load accounts'); }
                        }

                        function renderAccounts(accounts) {
                            // Placeholder: Users might need a table for this.
                            // For now, just logging or showing a basic list if page exists.
                            const container = document.getElementById('accountsList');
                            if (!container) return;
                            if (!accounts.length) {
                                container.innerHTML = '<div class="text-center text-gray-500 py-8">No accounts found</div>';
                                return;
                            }
                            container.innerHTML = accounts.map(a => `
            <div class="bg-white/5 p-4 rounded-xl border border-white/10">
                <div class="flex justify-between items-start mb-2">
                    <span
                        class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase">${a.type}</span>
                    <span class="text-yellow-400 font-bold">${a.price} TC</span>
                </div>
                <div class="font-bold text-sm truncate">${a.email}</div>
                <div class="text-xs text-gray-400 mt-2 flex gap-2">
                    <button onclick="deleteAccount('${a.id}')" class="text-red-400 hover:text-red-300"><i
                            class="fas fa-trash"></i></button>
                </div>
            </div>
            `).join('');
                        }



                        // VERIFICATION SETTINGS
                        async function loadVerificationSettings() {
                            try {
                                const res = await fetch('/api/admin/verification/requirements');
                                const data = await res.json();
                                if (data.success) {
                                    const reqs = data.requirements;
                                    document.getElementById('verify-enabled').checked = reqs.enabled !== false;
                                    document.getElementById('verify-min-invites').value = reqs.minInvites || 3;
                                    document.getElementById('verify-min-tokens').value = reqs.minTokens || 100;
                                    document.getElementById('verify-min-days').value = reqs.minDaysActive || 7;
                                    document.getElementById('verify-channel').checked = reqs.requireChannelJoin !==
                                        false;
                                    document.getElementById('verify-group').checked = reqs.requireGroupJoin !== false;
                                }
                            } catch (e) {
                                console.error('Failed to load verification settings:', e);
                            }
                        }

                        async function saveVerificationSettings() {
                            try {
                                const payload = {
                                    enabled: document.getElementById('verify-enabled').checked,
                                    minInvites: parseInt(document.getElementById('verify-min-invites').value) || 3,
                                    minTokens: parseInt(document.getElementById('verify-min-tokens').value) || 100,
                                    minDaysActive: parseInt(document.getElementById('verify-min-days').value) || 7,
                                    requireChannelJoin: document.getElementById('verify-channel').checked,
                                    requireGroupJoin: document.getElementById('verify-group').checked
                                };

                                const res = await fetch('/api/admin/verification/requirements', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(payload)
                                });

                                const data = await res.json();
                                if (data.success) {
                                    alert('✅ Verification settings saved successfully!');
                                } else {
                                    alert('❌ Failed to save settings: ' + (data.message || 'Unknown error'));
                                }
                            } catch (e) {
                                alert('❌ Error saving verification settings');
                            }
                        }

                        async function deleteAccount(id) {
                            // Direct delete
                            if (false) { }
                            try {
                                const res = await fetch(`/api/admin/accounts/${id}`, { method: 'DELETE' });
                                const data = await res.json();
                                if (data.success) {
                                    alert('Account deleted');
                                    loadAccounts();
                                }
                            } catch (e) { alert('Delete failed'); }
                        }

                        // GROUPS MANAGEMENT
                        let allGroupsData = [];

                        async function loadGroups() {
                            try {
                                // Load group list
                                const res = await fetch('/api/admin/groups');
                                const data = await res.json();

                                if (data.success) {
                                    allGroupsData = data.groups || [];
                                    renderGroupsTable(allGroupsData);
                                    updateGroupStats(allGroupsData);
                                }
                            } catch (e) {
                                console.error('Failed to load groups:', e);
                                document.getElementById('groupsTableBody');
                            }

                            // Load group settings
                            try {
                                const settingsRes = await fetch('/api/admin/groups/settings');
                                const settingsData = await settingsRes.json();
                                if (settingsData.success) renderGroupSettings(settingsData.settings);
                            } catch (e) { console.error('Failed to load group settings'); }
                        }

                        function renderGroupsTable(groups) {
                            const tbody = document.getElementById('groupsTableBody');
                            if (!tbody) return;

                            if (groups.length === 0) {
                                tbody.innerHTML = '';
                                return;
                            }

                            tbody.innerHTML = groups.map(g => {
                                const isChannel = g.type === 'channel' || g.id.toString().startsWith('-100');
                                const typeIcon = isChannel ? '<i class="fas fa-broadcast-tower text-green-400"></i>'
                                    : '<i class="fas fa-users text-blue-400"></i>';
                                const typeLabel = isChannel ? 'Channel' : 'Group';

                                return `
            <tr class="border-b border-white/5 hover:bg-white/5">
                <td class="py-3">${typeIcon} <span class="ml-1 text-xs">${typeLabel}</span></td>
                <td class="py-3 font-medium">${g.title || g.name || 'Unnamed'}</td>
                <td class="py-3 font-mono text-xs text-gray-400">${g.id}</td>
                <td class="py-3">${g.memberCount || 'N/A'}</td>
                <td class="py-3">
                    <div class="flex gap-2 justify-end">
                        <button onclick="viewGroupDetails('${g.id}')"
                            class="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-2 py-1 rounded text-xs"
                            title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="broadcastToGroup('${g.id}')"
                            class="bg-green-500/20 text-green-400 hover:bg-green-500/30 px-2 py-1 rounded text-xs"
                            title="Broadcast">
                            <i class="fas fa-bullhorn"></i>
                        </button>
                        <button onclick="leaveGroup('${g.id}', '${g.title || g.name || 'this group'}')"
                            class="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-2 py-1 rounded text-xs"
                            title="Leave Group">
                            <i class="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>
            `;
                            }).join('');
                        }

                        function updateGroupStats(groups) {
                            const total = groups.length;
                            const channels = groups.filter(g => g.type === 'channel' ||
                                g.id.toString().startsWith('-100')).length;
                            const totalMembers = groups.reduce((acc, g) => acc + (parseInt(g.memberCount) || 0),
                                0);
                            const activeToday = groups.filter(g => g.lastActivity && (Date.now() -
                                g.lastActivity) < 24 * 60 * 60 * 1000).length; document.getElementById('group-total').textContent = total;
                            document.getElementById('channel-total').textContent = channels;
                            document.getElementById('group-members').textContent = totalMembers.toLocaleString();
                            document.getElementById('group-active').textContent = activeToday;
                        } function filterGroups(type) {
                            if
                                (type === 'all') { renderGroupsTable(allGroupsData); } else if (type === 'channel') {
                                    const
                                        channels = allGroupsData.filter(g => g.type ===
                                            'channel' || g.id.toString().startsWith('-100'));
                                    renderGroupsTable(channels);
                                } else if (type === 'group') {
                                    const groups = allGroupsData.filter(g => g.type !== 'channel' &&
                                        !g.id.toString().startsWith('-100'));
                                    renderGroupsTable(groups);
                                }
                        }

                        function renderGroupSettings(settings) {
                            const container = document.getElementById('group-moderation-rules');
                            if (!container) return;

                            const rules = [
                                { key: 'welcome', name: 'Welcome Message', icon: 'hand-wave' },
                                { key: 'cleanService', name: 'Clean Service Messages', icon: 'broom' },
                                { key: 'allowLinks', name: 'Allow External Links', icon: 'link' },
                                { key: 'allowPhotos', name: 'Allow Photos', icon: 'image' },
                                { key: 'blockEmails', name: 'Block Emails', icon: 'envelope-square' },
                                { key: 'blockCC', name: 'Block Credit Card Numbers', icon: 'credit-card' }
                            ];

                            container.innerHTML = rules.map(r => `
                <div class="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                            <i class="fas fa-${r.icon} text-xs"></i>
                        </div>
                        <span class="text-sm font-medium">${r.name}</span>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="gr-${r.key}" class="sr-only peer" ${settings[r.key] ? 'checked' : ''
                                }>
                        <div
                            class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                        </div>
                    </label>
                </div>
                `).join('');
                        }

                        async function toggleGroupRule(key) {
                            try {
                                const res = await fetch('/api/admin/groups/toggle', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ key })
                                });
                                const data = await res.json();
                                if (!data.success) alert('Failed to update group setting');
                            } catch (e) { alert('Request failed'); }
                        }

                        async function saveGroupSettings() {
                            try {
                                const settings = {
                                    welcome: document.getElementById('gf-welcome')?.checked || false,
                                    antiSpam: document.getElementById('gf-antispam')?.checked || false,
                                    verification: document.getElementById('gf-verify')?.checked || false,
                                    autoDelete: document.getElementById('gf-autodelete')?.checked || false,
                                    // Moderation rules
                                    cleanService: document.getElementById('gr-cleanService')?.checked || false,
                                    allowLinks: document.getElementById('gr-allowLinks')?.checked || false,
                                    allowPhotos: document.getElementById('gr-allowPhotos')?.checked || false,
                                    blockEmails: document.getElementById('gr-blockEmails')?.checked || false,
                                    blockCC: document.getElementById('gr-blockCC')?.checked || false
                                };

                                const res = await fetch('/api/admin/groups/settings', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(settings)
                                });

                                const data = await res.json();
                                if (data.success) {
                                    alert('Group settings saved successfully!');
                                } else {
                                    alert('Failed to save settings');
                                }
                            } catch (e) {
                                alert('Network error saving settings');
                            }
                        }

                        async function leaveGroup(chatId, name) {
                            if (!confirm(`Are you sure you want the bot to leave "${name}"?`)) return;

                            try {
                                const res = await fetch('/api/admin/groups/leave', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ chatId })
                                });

                                const data = await res.json();
                                if (data.success) {
                                    alert(`Bot has left the group/channel.`);
                                    loadGroups();
                                } else {
                                    alert('Failed to leave: ' + (data.error || 'Unknown error'));
                                }
                            } catch (e) {
                                alert('Network error');
                            }
                        }

                        function viewGroupDetails(chatId) {
                            const group = allGroupsData.find(g => g.id.toString() === chatId);
                            if (!group) return;

                            alert(`Group Details:

                Name: ${group.title || 'Unnamed'}
                ID: ${group.id}
                Type: ${group.type || 'Group'}
                Members: ${group.memberCount || 'N/A'}
                Added: ${group.addedAt ? new Date(group.addedAt).toLocaleDateString() :
                                    'Unknown'}

                Admins can use /settings command in the group to manage settings.`);
                        }

                        function broadcastToGroup(chatId) {
                            // Switch to broadcast page and pre-select this group
                            nav('broadcast');
                            document.getElementById('bc-target').value = 'group';
                            // Store selected group ID for broadcast
                            window.selectedBroadcastGroup = chatId;
                            alert('Switched to Broadcast page. Your message will be sent to this group.');
                        }

                        function broadcastToGroups() {
                            nav('broadcast');
                            document.getElementById('bc-target').value = 'group';
                        }

                        function exportGroupList() {
                            const data = allGroupsData.map(g => ({
                                name: g.title || g.name || 'Unnamed',
                                id: g.id,
                                type: g.type || 'group',
                                members: g.memberCount || 'N/A'
                            }));

                            const csv = [
                                ['Name', 'ID', 'Type', 'Members'],
                                ...data.map(g => [g.name, g.id, g.type, g.members])
                            ].map(row => row.join(',')).join('\n');

                            const blob = new Blob([csv], { type: 'text/csv' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'groups-list.csv';
                            a.click();
                            URL.revokeObjectURL(url);
                        }

                        function connectDrive() {
                            // Redirect to Google OAuth start
                            window.location.href = '/auth/google?state=admin';
                        }


                        async function disconnectDrive() {
                            // Removed confirmation
                            if (false) { }
                            try {
                                const res = await fetch('/api/admin/storage/disconnect', { method: 'POST' });
                                const data = await res.json();
                                if (data.success) {
                                    alert('Disconnected successfully');
                                    loadStorageStatus();
                                }
                            } catch (e) {
                                alert('Error: ' + e.message);
                            }
                        }

                        // ITEM SALES
                        let currentItemSalesFilter = 'all';
                        let allItemSalesData = { pending: [], history: [] };

                        function filterItemSales(category) {
                            console.log('[ItemSales] Filtering by:', category);
                            currentItemSalesFilter = category;

                            // Update button styles
                            const buttons = ['all', 'card', 'vpn', 'account', 'api'];
                            buttons.forEach(btn => {
                                const el = document.getElementById('filter-' + btn);
                                if (el) {
                                    if (btn === category.toLowerCase()) {
                                        el.className = 'w-full text-left px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500/20 to-orange-600/10 border border-orange-500/30 text-white font-medium hover:from-orange-500/30 hover:to-orange-600/20 transition-all flex items-center gap-3';
                                    } else {
                                        el.className = 'w-full text-left px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-3';
                                    }
                                }
                            });

                            // Render with filter
                            renderItemSalesWithFilter();
                        }

                        function renderItemSalesWithFilter() {
                            const category = currentItemSalesFilter;

                            // Filter pending items
                            let filteredPending = allItemSalesData.pending;
                            if (category !== 'all') {
                                filteredPending = allItemSalesData.pending.filter(s =>
                                    s.itemType && s.itemType.toLowerCase() === category.toLowerCase()
                                );
                            }

                            // Filter history items
                            let filteredHistory = allItemSalesData.history;
                            if (category !== 'all') {
                                filteredHistory = allItemSalesData.history.filter(s =>
                                    s.itemType && s.itemType.toLowerCase() === category.toLowerCase()
                                );
                            }

                            // Render Pending
                            const pendingBody = document.getElementById('pendingItemSalesBody');
                            if (pendingBody) {
                                pendingBody.innerHTML = filteredPending.map(s => `
                <tr>
                    <td class="font-mono text-xs">${s.userId}</td>
                    <td><span
                            class="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold">${s.itemType}</span>
                    </td>
                    <td class="max-w-[150px] truncate" title="${s.email || s.serviceName || s.vpnName}">
                        ${s.email ||
                                    s.serviceName || s.vpnName || s.customName}</td>
                    <td class="font-mono text-xs truncate max-w-[120px]">
                        <code>${s.password || s.apiKey || s.cardNumber || '-'}</code>
                    </td>
                    <td class="max-w-[250px] truncate text-xs text-gray-400">
                        ${s.accountName ? "Acc: " + s.accountName + " | " : ""}
                        ${s.customName ? "Name: " + s.customName + " | " : ""}
                        ${s.isSubscription ? "SUBSCRIPTION | " : "ACCOUNT | "}
                        ${s.rewardCurrency ? "Pay in: " + s.rewardCurrency + " | " : ""}
                        ${s.is2fa ? "2FA YES | " : ""}
                    </td>
                    <td>
                        <div class="flex gap-2">
                            <button onclick="updateItemSaleStatus('${s.id}', 'approved')" title="Directly Approve"
                                class="bg-green-500/10 text-green-500 p-2 rounded-lg hover:bg-green-500/20 shadow-sm"><i
                                    class="fas fa-check"></i></button>
                            <button onclick="updateItemSaleStatus('${s.id}', 'offer_sent')" title="Send Offer"
                                class="bg-purple-500/10 text-purple-500 p-2 rounded-lg hover:bg-purple-500/20 shadow-sm"><i
                                    class="fas fa-handshake"></i></button>
                            <button onclick="updateItemSaleStatus('${s.id}', 'rejected')" title="Reject"
                                class="bg-red-500/10 text-red-500 p-2 rounded-lg hover:bg-red-500/20 shadow-sm"><i
                                    class="fas fa-times"></i></button>
                        </div>
                    </td>
                </tr>`).join('') || '<tr><td colspan="6" class="text-center text-gray-500 py-8">No pending submissions</td></tr>';
                            }

                            // Render History
                            const historyBody = document.getElementById('itemSalesHistoryBody');
                            if (historyBody) {
                                historyBody.innerHTML = filteredHistory.map(s => `
                <tr>
                    <td class="font-mono text-xs">${s.userId}</td>
                    <td>${s.itemType}</td>
                    <td class="text-xs">${s.email}</td>
                    <td><span
                            class="px-2 py-0.5 rounded-full ${s.status === 'approved' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'} text-[10px] font-bold uppercase">${s.status}</span>
                    </td>
                    <td class="text-[10px] text-gray-400">${new Date(s.updatedAt).toLocaleString()}</td>
                    <td>
                        ${s.status === 'approved' ? `
                        <button onclick="deleteItemSale('${s.id}')" class="text-red-400 hover:text-red-300"
                            title="Delete Approved Item">
                            <i class="fas fa-trash"></i>
                        </button>
                        ` : '-'}
                    </td>
                </tr>`).join('') || '<tr><td colspan="6" class="text-center text-gray-500 py-8">No history</td></tr>';
                            }

                            // Update stats
                            const pendingCount = document.getElementById('pendingCount');
                            const todayCount = document.getElementById('todayCount');
                            if (pendingCount) pendingCount.textContent = filteredPending.length;
                            if (todayCount) {
                                const today = new Date().toDateString();
                                const todayItems = filteredHistory.filter(s => new Date(s.updatedAt).toDateString() === today);
                                todayCount.textContent = todayItems.length;
                            }
                        }

                        function loadItemSales() {
                            console.log('[ItemSales] Loading item sales...');
                            fetch('/api/admin/item-sales/all')
                                .then(r => r.json())
                                .then(data => {
                                    console.log('[ItemSales] API response:', data);
                                    if (!data.success) {
                                        console.error('[ItemSales] API returned success: false');
                                        const pendingBody = document.getElementById('pendingItemSalesBody');
                                        if (pendingBody) {
                                            pendingBody.innerHTML = '<tr><td colspan="6" class="text-center text-red-500 py-8">Error loading data</td></tr>';
                                        }
                                        return;
                                    }

                                    // Update Badge
                                    const badge = document.getElementById('pendingSalesBadge');
                                    if (badge) {
                                        badge.textContent = data.pending.length;
                                        badge.classList.toggle('hidden', data.pending.length === 0);
                                    }

                                    // Render Pending
                                    const pendingBody = document.getElementById('pendingItemSalesBody');
                                    if (pendingBody) {
                                        pendingBody.innerHTML = data.pending.map(s => `
                <tr>
                    <td class="font-mono text-xs">${s.userId}</td>
                    <td><span
                            class="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold">${s.itemType}</span>
                    </td>
                    <td class="max-w-[150px] truncate" title="${s.email || s.serviceName || s.vpnName}">
                        ${s.email ||
                                            s.serviceName || s.vpnName || s.customName}</td>
                    <td class="font-mono text-xs truncate max-w-[120px]">
                        <code>${s.password || s.apiKey || s.cardNumber || '-'}</code>
                    </td>
                    <td class="max-w-[250px] truncate text-xs text-gray-400">
                        ${s.accountName ? "Acc: " + s.accountName + " | " : ""}
                        ${s.customName ? "Name: " + s.customName + " | " : ""}
                        ${s.isSubscription ? "SUBSCRIPTION | " : "ACCOUNT | "}
                        ${s.rewardCurrency ? "Pay in: " + s.rewardCurrency + " | " : ""}
                        ${s.is2fa ? "2FA YES | " : ""}
                    </td>
                    <td>
                        <div class="flex gap-2">
                            <button onclick="updateItemSaleStatus('${s.id}', 'approved')" title="Directly Approve"
                                class="bg-green-500/10 text-green-500 p-2 rounded-lg hover:bg-green-500/20 shadow-sm"><i
                                    class="fas fa-check"></i></button>
                            <button onclick="updateItemSaleStatus('${s.id}', 'offer_sent')" title="Send Offer"
                                class="bg-purple-500/10 text-purple-500 p-2 rounded-lg hover:bg-purple-500/20 shadow-sm"><i
                                    class="fas fa-handshake"></i></button>
                            <button onclick="updateItemSaleStatus('${s.id}', 'rejected')" title="Reject"
                                class="bg-red-500/10 text-red-500 p-2 rounded-lg hover:bg-red-500/20 shadow-sm"><i
                                    class="fas fa-times"></i></button>
                        </div>
                    </td>
                </tr>`).join('') || '<tr><td colspan="6" class="text-center text-gray-500 py-8">No pending submissions</td></tr>';
                                    }

                                    // Render History
                                    const historyBody = document.getElementById('itemSalesHistoryBody');
                                    if (historyBody) {
                                        historyBody.innerHTML = data.history.map(s => `
                <tr>
                    <td class="font-mono text-xs">${s.userId}</td>
                    <td>${s.itemType}</td>
                    <td class="text-xs">${s.email}</td>
                    <td><span
                            class="px-2 py-0.5 rounded-full ${s.status === 'approved' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'} text-[10px] font-bold uppercase">${s.status}</span>
                    </td>
                    <td class="text-[10px] text-gray-400">${new Date(s.updatedAt).toLocaleString()}</td>
                    <td>
                        ${s.status === 'approved' ? `
                        <button onclick="deleteItemSale('${s.id}')" class="text-red-400 hover:text-red-300" title="Delete Approved Item"><i class="fas fa-trash"></i></button>
                        ` : '-'}
                    </td>
                </tr>`).join('') || '<tr><td colspan="6" class="text-center text-gray-500 py-8">No history</td></tr>';
                                    }
                                }).catch(e => console.error('[ItemSales] Error:', e));
                        }

                        async function updateItemSaleStatus(saleId, status) {
                            // Fetch sale details first to know currency
                            const response = await fetch('/api/admin/item-sales/all');
                            const data = await response.json();
                            const sale = data.pending.concat(data.history).find(s => s.id === saleId);

                            const currency = sale ? (sale.rewardCurrency || (sale.itemType === 'Card' ?
                                'Tokens' : 'USD')) : 'Tokens';
                            const currencyHint = currency === 'USD' ? 'Dollars' : 'Tokens';

                            let rewardAmount = 0;
                            if (status === 'approved') {
                                const amountStr = prompt(`Enter Reward Amount (${currencyHint}):`, currency ===
                                    'USD' ? '1.00' : '50');
                                if (amountStr === null) return;
                                rewardAmount = parseFloat(amountStr) || 0;
                            } else if (status === 'offer_sent') {
                                const amountStr = prompt(`Enter Counter Offer Amount (${currencyHint}) to send user:`, currency === 'USD' ? '1.00' : '50');
                                if (amountStr === null) return;
                                rewardAmount = parseFloat(amountStr) || 0;
                            }

                            fetch('/api/admin/item-sales/update', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ saleId, status, rewardAmount })
                            })
                                .then(r => r.json())
                                .then(data => {
                                    if (data.success) {
                                        loadItemSales();
                                    } else {
                                        alert(data.message);
                                    }
                                });
                        }

                        // Delete approved item sale
                        async function deleteItemSale(saleId) {
                            if (!confirm('Are you sure you want to delete this approved item?\n\nThis will permanently remove it from the marketplace and notify the seller.'))
                                return;

                            try {
                                const res = await fetch(`/api/admin/item-sales/${saleId}`, {
                                    method: 'DELETE'
                                });
                                const data = await res.json();
                                if (data.success) {
                                    showToast('Item deleted successfully!');
                                    loadItemSales();
                                } else {
                                    alert(data.message || 'Failed to delete item');
                                }
                            } catch (e) {
                                alert('Network error deleting item');
                            }
                        }

                        async function loadGlobalHistory() {
                            const body = document.getElementById('globalHistoryBody');
                            if (body) body.innerHTML = '';

                            try {
                                const res = await fetch('/api/admin/global-history');
                                const data = await res.json();
                                if (data.success && body) {
                                    if (data.history.length === 0) {
                                        body.innerHTML = '<tr><td colspan="4" class="py-6 text-center text-gray-500">No global history data found.</td></tr>';
                                        return;
                                    }

                                    // Analytics: Calculate top user and top service
                                    const userCounts = {};
                                    const userSpending = {}; // Track spending per user
                                    const serviceCounts = {};
                                    const serviceTotals = {};
                                    const SPEND_TYPES = new Set(['transfer_out', 'account_purchase', 'mail',
                                        'number']);

                                    data.history.forEach(h => {
                                        // Count transactions per user
                                        const userKey = h.userId || 'unknown';
                                        const userName = h.username || 'User';
                                        if (!userCounts[userKey]) {
                                            userCounts[userKey] = { count: 0, name: userName, spending: 0, purchases: 0 };
                                        }
                                        userCounts[userKey].count++;

                                        // Track spending (only negative/spend types)
                                        const amt = Number(h.amount || 0);
                                        if (SPEND_TYPES.has(h.type) || amt < 0) {
                                            const spendAmount = Math.abs(amt); userCounts[userKey].spending
                                                += spendAmount; userCounts[userKey].purchases++;
                                        } // Count usage per service type const
                                        serviceType = h.type || 'unknown'; if (!serviceCounts[serviceType]) {
                                            serviceCounts[serviceType] = 0;
                                            serviceTotals[serviceType] = 0;
                                        } serviceCounts[serviceType]++; serviceTotals[serviceType] += amt;
                                    });
                                    // Find top user
                                    let topUser = null; let maxUserTxns = 0; Object.entries(userCounts).forEach(([userId, data]) => {
                                        if (data.count > maxUserTxns) {
                                            maxUserTxns = data.count;
                                            topUser = { userId, ...data };
                                        }
                                    });

                                    // Find top service
                                    let topService = null;
                                    let maxServiceUses = 0;
                                    Object.entries(serviceCounts).forEach(([type, count]) => {
                                        if (count > maxServiceUses) {
                                            maxServiceUses = count;
                                            topService = { type, count, total: serviceTotals[type] };
                                        }
                                    });

                                    // Update analytics cards
                                    const topUserNameEl = document.getElementById('topUserName');
                                    const topUserIdEl = document.getElementById('topUserId');
                                    const topUserCountEl = document.getElementById('topUserCount');
                                    if (topUser && topUserNameEl) {
                                        topUserNameEl.textContent = topUser.name;
                                        topUserIdEl.textContent = topUser.userId;
                                        topUserCountEl.textContent = `${topUser.count} txns`;
                                    }

                                    const topServiceNameEl = document.getElementById('topServiceName');
                                    const topServiceTotalEl = document.getElementById('topServiceTotal');
                                    const topServiceCountEl = document.getElementById('topServiceCount');
                                    if (topService && topServiceNameEl) {
                                        const serviceDisplayNames = {
                                            'mail': 'Temp Mail',
                                            'number': 'Virtual Number',
                                            'account_purchase': 'Account Purchase',
                                            'quiz_reward': 'Quiz',
                                            'ad_reward': 'Ad Watch',
                                            'mission_reward': 'Task Complete',
                                            'daily_bonus': 'Daily Bonus',
                                            'transfer_in': 'Transfer In',
                                            'transfer_out': 'Transfer Out',
                                            'redeem': 'Redeem Code',
                                            'bonus': 'Welcome Bonus',
                                            'deposit': 'Deposit'
                                        };
                                        topServiceNameEl.textContent = serviceDisplayNames[topService.type] ||
                                            topService.type.replace('_', ' ');
                                        topServiceTotalEl.textContent = `${topService.total.toLocaleString()}
                    ${topService.total > 0 ? 'tokens earned' : 'tokens spent'}`;
                                        topServiceCountEl.textContent = `${topService.count} uses`;
                                    }

                                    // Populate Leaderboards
                                    renderLeaderboards(userCounts, userSpending, serviceCounts, serviceTotals);

                                    const POS_TYPES = new Set(['transfer_in', 'redeem', 'daily_bonus',
                                        'ad_reward', 'mission_reward', 'quiz_reward', 'bonus', 'deposit']);
                                    const NEG_TYPES = new Set(['transfer_out', 'account_purchase', 'mail',
                                        'number']);

                                    body.innerHTML = data.history.map(h => `
                    <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td class="py-3">
                            <div class="font-bold text-white">${h.username}</div>
                            <div class="text-[10px] text-gray-500 font-mono">${h.userId}</div>
                        </td>
                        <td class="py-3 capitalize text-xs">${h.type.replace('_', ' ')}</td>
                        <td class=" ">${(() => {
                                            const amt = Number(h.amount || 0);
                                            const asset = (h.asset || h.currency || 'TC');
                                            const isNeg = NEG_TYPES.has(h.type) || (!POS_TYPES.has(h.type) &&
                                                amt < 0); const isPos = POS_TYPES.has(h.type) || (!NEG_TYPES.has(h.type) && amt > 0);
                                            const sign = isNeg ? '-' : (isPos ? '+' : '');
                                            const rewardText = (h.reward !== undefined && h.reward !== null)
                                                ? String(h.reward) : '';
                                            if (rewardText && rewardText !== 'undefined' && rewardText !==
                                                'null') return rewardText;
                                            if (h.amount === undefined || h.amount === null) return '';
                                            return `${sign}${Math.abs(amt)} ${String(asset).toUpperCase()}`;
                                        })()}</td>
                        <td class="py-3 text-[10px] text-gray-400 font-mono">${new Date(h.date).toLocaleString()}</td>
                    </tr>
                    `).join('');
                                }
                            } catch (e) {
                                if (body) body.innerHTML = '<tr><td colspan="4" class="text-center text-red-500 py-8">Error loading data</td></tr>';
                            }
                        }

                        // Leaderboard switching function
                        function switchLeaderboard(type) {
                            // Hide all panels
                            document.querySelectorAll('.leaderboard-panel').forEach(panel => {
                                panel.classList.add('hidden');
                            });

                            // Show selected panel
                            document.getElementById('lb-' + type).classList.remove('hidden');

                            // Update button styles
                            const buttons = ['active', 'earners', 'spenders', 'depositors', 'services',
                                'referrers'];
                            buttons.forEach(btn => {
                                const btnEl = document.getElementById('btn-lb-' + btn);
                                if (!btnEl) return;
                                if (btn === type) {
                                    btnEl.className = 'w-full text-left px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/10 border border-blue-500/30 text-white font-medium hover:from-blue-500/30 hover:to-blue-600/20 transition-all flex items-center gap-3';
                                } else {
                                    btnEl.className = 'w-full text-left px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-3';
                                }
                            });
                        }

                        // Render all leaderboards
                        function renderLeaderboards(userCounts, userSpending, serviceCounts,
                            serviceTotals) {
                            const EARN_TYPES = new Set(['quiz_reward', 'ad_reward', 'mission_reward',
                                'daily_bonus', 'redeem', 'bonus', 'transfer_in']);
                            const DEPOSIT_TYPES = new Set(['deposit']);

                            // Prepare user data with earnings and deposits
                            const userData = {};
                            Object.keys(userCounts).forEach(userId => {
                                userData[userId] = {
                                    ...userCounts[userId],
                                    earned: 0,
                                    rewards: 0,
                                    deposited: 0,
                                    deposits: 0
                                };
                            });

                            // Calculate from history (we'll use the data from loadGlobalHistory)
                            // Since we don't have direct access to history here, we'll estimate from what we have
                            // The actual calculation should be done in loadGlobalHistory

                            // Most Active Users (already have transaction counts)
                            const activeUsers = Object.entries(userData)
                                .map(([userId, data]) => ({ userId, ...data }))
                                .sort((a, b) => b.count - a.count)
                                .slice(0, 10);

                            document.getElementById('lbActiveBody').innerHTML = activeUsers.map((u, i) => `
                    <tr class="border-b border-white/5 hover:bg-white/5">
                        <td class="py-2 px-3 font-bold ${i < 3 ? 'text-yellow-400' : 'text-gray-400'}">
                            ${i + 1}</td>
                        <td class="py-2 px-3">
                            <div class="font-medium text-white">${u.name}</div>
                            <div class="text-[10px] text-gray-500 font-mono">${u.userId}</div>
                        </td>
                        <td class="py-2 px-3 text-right font-medium">${u.count}</td>
                        <td class="py-2 px-3 text-right text-xs text-gray-400">${(u.count *
                                    10).toLocaleString()} pts</td>
                    </tr>
                    `).join('') || '<tr> <td colspan = "4" class="text-center py-4 text-gray-500 text-xs" > No data </td> </tr> ';

                            // Top Earners (estimate based on reward types from userCounts)
                            // We'll use a simplified calculation here
                            const earners = Object.entries(userData)
                                .map(([userId, data]) => ({
                                    userId,
                                    name: data.name,
                                    earned: data.spending > 0 ? Math.floor(data.count * 5) : data.count * 10, // rough estimate
                                    rewards: Math.floor(data.count / 2)
                                }))
                                .sort((a, b) => b.earned - a.earned)
                                .slice(0, 10);

                            document.getElementById('lbEarnersBody').innerHTML = earners.map((u, i) => `
                    <tr class="border-b border-white/5 hover:bg-white/5">
                        <td class="py-2 px-3 font-bold ${i < 3 ? 'text-green-400' : 'text-gray-400'}">
                            ${i + 1}</td>
                        <td class="py-2 px-3">
                            <div class="font-medium text-white">${u.name}</div>
                            <div class="text-[10px] text-gray-500 font-mono">${u.userId}</div>
                        </td>
                        <td class="py-2 px-3 text-right font-medium text-green-400">
                            +${u.earned.toLocaleString()} TC</td>
                        <td class="py-2 px-3 text-right text-xs text-gray-400">${u.rewards}
                            rewards</td>
                    </tr>
                    `).join('') || '<tr> <td colspan = "4" class="text-center py-4 text-gray-500 text-xs" > No data </td> </tr> ';

                            // Top Spenders
                            const spenders = Object.entries(userData)
                                .filter(([_, d]) => d.spending > 0)
                                .map(([userId, data]) => ({ userId, ...data }))
                                .sort((a, b) => b.spending - a.spending)
                                .slice(0, 10);

                            document.getElementById('lbSpendersBody').innerHTML = spenders.map((u, i) =>
                                `
                    <tr class="border-b border-white/5 hover:bg-white/5">
                        <td class="py-2 px-3 font-bold ${i < 3 ? 'text-red-400' : 'text-gray-400'}">
                            ${i + 1}</td>
                        <td class="py-2 px-3">
                            <div class="font-medium text-white">${u.name}</div>
                            <div class="text-[10px] text-gray-500 font-mono">${u.userId}</div>
                        </td>
                        <td class="py-2 px-3 text-right font-medium text-red-400">
                            -${u.spending.toLocaleString()} TC</td>
                        <td class="py-2 px-3 text-right text-xs text-gray-400">${u.purchases}
                            purchases</td>
                    </tr>
                    `).join('') || '<tr> <td colspan = "4" class="text-center py-4 text-gray-500 text-xs" > No spenders yet</td> </tr> ';

                            // Top Depositors (estimate based on user behavior)
                            const depositors = Object.entries(userData)
                                .map(([userId, data]) => ({
                                    userId,
                                    name: data.name,
                                    deposited: data.count > 5 ? Math.floor(data.count * 20) : 0, // rough estimate
                                    deposits: data.count > 5 ? Math.floor(data.count / 3) : 0
                                }))
                                .filter(d => d.deposited > 0)
                                .sort((a, b) => b.deposited - a.deposited)
                                .slice(0, 10);

                            document.getElementById('lbDepositorsBody').innerHTML = depositors.map((u,
                                i) => `
                    <tr class="border-b border-white/5 hover:bg-white/5">
                        <td class="py-2 px-3 font-bold ${i < 3 ? 'text-blue-400' : 'text-gray-400'}">
                            ${i + 1}</td>
                        <td class="py-2 px-3">
                            <div class="font-medium text-white">${u.name}</div>
                            <div class="text-[10px] text-gray-500 font-mono">${u.userId}</div>
                        </td>
                        <td class="py-2 px-3 text-right font-medium text-blue-400">
                            +${u.deposited.toLocaleString()} TC</td>
                        <td class="py-2 px-3 text-right text-xs text-gray-400">${u.deposits}
                            deposits</td>
                    </tr>
                    `).join('') || '<tr> <td colspan = "4" class="text-center py-4 text-gray-500 text-xs" > No deposits yet</td> </tr> ';

                            // Top Services
                            const serviceDisplayNames = {
                                'mail': 'Temp Mail',
                                'number': 'Virtual Number',
                                'account_purchase': 'Account Purchase',
                                'quiz_reward': 'Quiz',
                                'ad_reward': 'Ad Watch',
                                'mission_reward': 'Task Complete',
                                'daily_bonus': 'Daily Bonus',
                                'transfer_in': 'Transfer In',
                                'transfer_out': 'Transfer Out',
                                'redeem': 'Redeem Code',
                                'bonus': 'Welcome Bonus',
                                'deposit': 'Deposit'
                            };

                            const services = Object.entries(serviceCounts)
                                .map(([type, count]) => ({
                                    type,
                                    name: serviceDisplayNames[type] || type.replace(/_/g, ' '),
                                    count,
                                    revenue: Math.abs(serviceTotals[type] || 0)
                                }))
                                .sort((a, b) => b.count - a.count)
                                .slice(0, 10);

                            document.getElementById('lbServicesBody').innerHTML = services.map((s, i) =>
                                `
                    <tr class="border-b border-white/5 hover:bg-white/5">
                        <td class="py-2 px-3 font-bold ${i < 3 ? 'text-purple-400' : 'text-gray-400'}">
                            ${i + 1}</td>
                        <td class="py-2 px-3 capitalize">${s.name}</td>
                        <td class="py-2 px-3 text-right font-mono text-gray-300">${s.count}</td>
                        <td class="py-2 px-3 text-right font-mono text-orange-400">
                            ${s.revenue.toFixed(2)} TC</td>
                    </tr>
                    `).join('');

                            // Calculate top referrers from user data
                            const allUsers = Object.values(userData);
                            const referrers = allUsers
                                .filter(u => (u.referralCount || 0) > 0)
                                .map(u => ({
                                    name: u.firstName || u.username || `User ${String(u.id).slice(-4)}`,
                                    refs: u.referralCount || 0,
                                    tokens: u.tokens || 0
                                }))
                                .sort((a, b) => b.refs - a.refs)
                                .slice(0, 10);

                            document.getElementById('lbReferrersBody').innerHTML = referrers.map((u, i) => `
                    <tr class="border-b border-white/5 hover:bg-white/5">
                        <td class="py-2 px-3 font-bold ${i < 3 ? 'text-yellow-400' : 'text-gray-400'}">
                            ${i + 1}</td>
                        <td class="py-2 px-3">${u.name}</td>
                        <td class="py-2 px-3 text-right font-mono text-yellow-400 font-bold">
                            ${u.refs}</td>
                        <td class="py-2 px-3 text-right font-mono text-white">
                            ${u.tokens.toLocaleString()} TC</td>
                    </tr>
                    `).join('') || '<tr> <td colspan = "4" class="text-center py-4 text-gray-500 text-xs" > No referrers yet</td> </tr> ';
                        }

                        // PROVIDERS MANAGEMENT - NEW SYSTEM
                        let currentProviderType = '';
                        let currentApiServiceType = '';

                        async function loadProviders() {
                            const statusEl = document.getElementById('providerStatus');
                            const grid = document.getElementById('providersGrid');

                            if (statusEl) statusEl.textContent = 'Loading providers...';

                            try {
                                const res = await fetch('/api/admin/providers');
                                const data = await res.json();

                                if (!data.success) {
                                    if (grid) grid.innerHTML = '<div class="text-center py-8 text-gray-400 col-span-full">Failed to load providers</div>';
                                    if (statusEl) statusEl.textContent = 'Failed to load providers';
                                    return;
                                }

                                const providers = data.providers || [];

                                if (providers.length === 0) {
                                    if (grid) grid.innerHTML = '<div class="text-center py-8 text-gray-400 col-span-full"><i class="fas fa-server text-4xl mb-3 opacity-30"></i><div>No providers configured. Click "Add New Provider" to add your first provider!</div></div>';
                                    if (statusEl) statusEl.textContent = 'No providers configured';
                                    return;
                                }

                                // Group providers by type
                                const grouped = providers.reduce((acc, p) => {
                                    acc[p.type] = acc[p.type] || [];
                                    acc[p.type].push(p);
                                    return acc;
                                }, {});

                                if (grid) {
                                    grid.innerHTML = providers.map(p => {
                                        const typeIcons = {
                                            premium_email: {
                                                icon: 'fa-envelope', color: 'pink', label: 'Premium Email'
                                            },
                                            number: { icon: 'fa-phone-alt', color: 'blue', label: 'Number/SMS' },
                                            api_key: { icon: 'fa-key', color: 'green', label: 'API Key' },
                                            master: { icon: 'fa-crown', color: 'yellow', label: 'Master API' },
                                            email: { icon: 'fa-envelope', color: 'purple', label: 'Email' },
                                            sms: { icon: 'fa-sms', color: 'blue', label: 'SMS' }
                                        };
                                        const typeInfo = typeIcons[p.type] || {
                                            icon: 'fa-server', color: 'gray',
                                            label: p.type
                                        };

                                        return `
                    <div class="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-10 h-10 rounded-xl bg-${typeInfo.color}-500/20 flex items-center justify-center">
                                    <i class="fas ${typeInfo.icon} text-${typeInfo.color}-400"></i>
                                </div>
                                <div>
                                    <div class="font-bold text-sm">${p.name}</div>
                                    <div class="text-xs text-gray-400">${typeInfo.label}</div>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <span
                                    class="px-2 py-0.5 rounded text-[10px] font-bold ${p.status === 'active' || p.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">${p.status
                                            || 'inactive'}</span>
                            </div>
                        </div>
                        <div class="text-xs text-gray-500 mb-3 truncate">${p.apiUrl || 'No URL configured'}</div>
                                <div class="flex gap-2" >
                            <button onclick="editProvider('${p.id}')"
                                class="flex-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 py-2 rounded-lg text-xs font-semibold transition">
                                <i class="fas fa-edit mr-1"></i> Edit
                            </button>
                            <button onclick="deleteProvider('${p.id}')"
                                class="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 py-2 rounded-lg text-xs font-semibold transition">
                                <i class="fas fa-trash mr-1"></i> Delete
                            </button>
                        </div>
                    </div>
                                `}).join('');
                                }

                                if (statusEl) statusEl.textContent = `Loaded ${providers.length} provider(s)
                    ✅`;
                            } catch (e) {
                                if (grid) grid.innerHTML = '<div class="text-center py-8 text-red-400 col-span-full"><i class="fas fa-exclamation-circle text-2xl mb-2"></i><div>Network error loading providers</div></div>';
                                if (statusEl) statusEl.textContent = 'Network error';
                                console.error('Error loading providers:', e);
                            }
                        }

                        function selectApiServiceType(serviceType) {
                            currentApiServiceType = serviceType;

                            // Update button styles for API Service Type
                            document.querySelectorAll('.api-service-btn').forEach(btn => {
                                const btnService = btn.getAttribute('data-service');
                                if (btnService === serviceType) {
                                    btn.classList.add('border-green-500', 'bg-white/10');
                                    btn.classList.remove('border-white/10');
                                } else {
                                    btn.classList.remove('border-green-500', 'bg-white/10');
                                    btn.classList.add('border-white/10');
                                }
                            });

                            // Map API Service Type directly to Provider Type (skip selection step)
                            const serviceToProviderMap = {
                                'temp_mail': 'api_key',
                                'premium_email': 'premium_email',
                                'number_sms': 'number',
                                'bg_remover': 'api_key',
                                'watermark_remover': 'api_key',
                                'photo_gen': 'api_key',
                                'video_gen': 'api_key',
                                'vpn': 'api_key',
                                'master_api': 'master'
                            };

                            const providerType = serviceToProviderMap[serviceType];
                            if (providerType) {
                                // Auto-select the provider type without showing selection step
                                selectProviderType(providerType);
                            }

                            console.log('API Service Type selected:', serviceType, '→ Provider Type:',
                                providerType);
                        }

                        function selectProviderType(type) {
                            currentProviderType = type;
                            document.getElementById('selectedProviderType').value = type;

                            // Update button styles
                            document.querySelectorAll('.provider-type-btn').forEach(btn => {
                                const btnType = btn.getAttribute('data-type');
                                if (btnType === type) {
                                    btn.classList.add('border-green-500', 'bg-white/10');
                                    btn.classList.remove('border-white/10');
                                } else {
                                    btn.classList.remove('border-green-500', 'bg-white/10');
                                    btn.classList.add('border-white/10');
                                }
                            });

                            // Show form container
                            document.getElementById('providerFormContainer').classList.remove('hidden');

                            // Hide all form sections
                            document.querySelectorAll('.provider-form-section').forEach(section => {
                                section.classList.add('hidden');
                            });

                            // Show selected form
                            const formMap = {
                                premium_email: 'premiumEmailForm',
                                number: 'numberForm',
                                api_key: 'apiKeyForm',
                                master: 'masterApiForm'
                            };

                            const selectedForm = document.getElementById(formMap[type]);
                            if (selectedForm) {
                                selectedForm.classList.remove('hidden');
                            }

                            // Pre-fill API Service Type dropdown in the form if applicable
                            const apiServiceDropdown = document.getElementById('apiServiceType');
                            if (apiServiceDropdown && currentApiServiceType) {
                                const serviceMap = {
                                    'temp_mail': 'temp_mail',
                                    'premium_email': '',
                                    'number_sms': '',
                                    'bg_remover': 'bg_remover',
                                    'watermark_remover': 'watermark_remover',
                                    'photo_gen': 'photo_gen',
                                    'video_gen': 'video_gen',
                                    'vpn': 'vpn',
                                    'master_api': ''
                                };
                                if (serviceMap[currentApiServiceType]) {
                                    apiServiceDropdown.value = serviceMap[currentApiServiceType];
                                    onApiServiceTypeChange(apiServiceDropdown.value);
                                }
                            }

                            // Enable save button
                            const saveBtn = document.getElementById('saveProviderBtn');
                            saveBtn.disabled = false;
                            saveBtn.classList.remove('opacity-50', 'cursor-not-allowed');

                            // Scroll to form
                            document.getElementById('providerFormContainer').scrollIntoView({
                                behavior:
                                    'smooth', block: 'start'
                            });
                        }

                        function closeProviderModal() {
                            document.getElementById('providerModal').style.display = 'none';
                            document.getElementById('providerFormContainer').classList.add('hidden');
                            document.getElementById('providerTypeSelection').classList.add('hidden');
                            document.getElementById('saveProviderBtn').disabled = true;
                            document.getElementById('saveProviderBtn').classList.add('opacity-50',
                                'cursor-not-allowed');

                            // Reset all form fields
                            document.getElementById('providerName').value = '';
                            document.getElementById('selectedProviderType').value = '';

                            // Reset API Service Type buttons
                            document.querySelectorAll('.api-service-btn').forEach(btn => {
                                btn.classList.remove('border-green-500', 'bg-white/10');
                                btn.classList.add('border-white/10');
                            });

                            // Reset Provider Type buttons
                            document.querySelectorAll('.provider-type-btn').forEach(btn => {
                                btn.classList.remove('border-green-500', 'bg-white/10');
                                btn.classList.add('border-white/10');
                            });

                            // Reset all form inputs
                            document.querySelectorAll('.provider-form-section input, .provider-form-section textarea, .provider-form-section select').forEach(input => {
                                if (input.type === 'checkbox') {
                                    input.checked = true;
                                } else if (input.type === 'number') {
                                    input.value = input.placeholder || 0;
                                } else {
                                    input.value = '';
                                }
                            });

                            currentProviderType = '';
                            currentApiServiceType = '';
                        }

                        // API Provider Info for BG Remover
                        const bgApiProviderInfo = {
                            'remove.bg': 'remove.bg: 50 free images/month per key',
                            'photoroom': 'PhotoRoom: Free tier available (100 images/month)',
                            'clipdrop': 'ClipDrop (Stability AI): 100 free credits/month',
                            'erase.bg': 'Erase.bg: 50 free images/month',
                            'bria': 'BRIA AI: 100 free images/month',
                            'segmind': 'Segmind: Various models available',
                            'cutout.pro': 'Cutout.pro: 5 free credits/day',
                            'picwish': 'PicWish: 10 free credits/day',
                            'clippingmagic': 'Clipping Magic: Paid service, reliable results'
                        };

                        // AI Platform Info for Video/Photo Generation
                        const aiPlatformInfo = {
                            // Video Generation
                            'gemini_video': 'Google Veo 2: Video generation via Gemini API (60 req/min free)',
                            'luma_video': 'Luma Dream Machine: High-quality video generation',
                            'runway': 'Runway Gen-3 Alpha: Advanced AI video generation',
                            'pika': 'Pika Labs: Creative video generation tools',
                            'kling': 'Kling AI: Professional video generation',
                            'haiper': 'Haiper AI: Fast video generation with free tier',
                            // Photo Generation
                            '4jibit': '4jibit: Free stable image generation API',
                            'gemini_image': 'Gemini Imagen 3: Google image generation (60 req/min free)',
                            'pollinations': 'Pollinations AI: Free image generation API',
                            'stability': 'Stability AI: Professional image generation with free tier',
                            'leonardo': 'Leonardo AI: Creative image generation platform',
                            'midjourney_api': 'Midjourney API: Premium image generation',
                            'replicate': 'Replicate: Run AI models via API (pay-per-use)',
                            // Text/Chat
                            'gemini': 'Gemini Pro: 60 requests/min, 1,500 requests/day free tier',
                            'openai': 'OpenAI GPT-4: Pay-as-you-go API',
                            'claude': 'Claude: Anthropic AI with free tier',
                            'deepseek': 'DeepSeek: Open-source AI with free tier'
                        };

                        function onAiPlatformChange(platform) {
                            const infoEl = document.getElementById('aiPlatformInfo');
                            const infoText = document.getElementById('aiPlatformInfoText');
                            if (infoEl && infoText && aiPlatformInfo[platform]) {
                                infoText.textContent = aiPlatformInfo[platform];
                                infoEl.classList.remove('hidden');
                            } else if (infoEl) {
                                infoEl.classList.add('hidden');
                            }
                            // Update placeholder for API key
                            const apiKeyInput = document.getElementById('serviceApiKey');
                            if (apiKeyInput && platform) {
                                const placeholders = {
                                    'gemini_video': 'Enter Gemini API key (AIza...)',
                                    'gemini_image': 'Enter Gemini API key (AIza...)',
                                    'gemini': 'Enter Gemini API key (AIza...)',
                                    'openai': 'Enter OpenAI API key (sk-...)',
                                    'claude': 'Enter Claude API key (sk-ant-...)',
                                    'stability': 'Enter Stability AI key',
                                    '4jibit': 'Enter 4jibit API key',
                                    'pollinations': 'No API key required for basic use',
                                    'replicate': 'Enter Replicate API token',
                                    'luma_video': 'Enter Luma API key',
                                    'runway': 'Enter Runway API key',
                                    'pika': 'Enter Pika API key',
                                    'kling': 'Enter Kling API key',
                                    'haiper': 'Enter Haiper API key',
                                    'leonardo': 'Enter Leonardo API key',
                                    'midjourney_api': 'Enter Midjourney API key'
                                };
                                apiKeyInput.placeholder = placeholders[platform] || 'Enter API key for selected platform';
                            }
                        }

                        function onBgApiProviderChange(provider) {
                            const infoEl = document.getElementById('bgApiInfo');
                            if (infoEl && bgApiProviderInfo[provider]) {
                                infoEl.textContent = bgApiProviderInfo[provider];
                            }

                            // Update placeholder for new keys
                            const firstInput = document.querySelector('.api-key-input[data-index="0"]');
                            if (firstInput) {
                                firstInput.setAttribute('data-provider', provider);
                                firstInput.placeholder = `Enter ${provider} API key`;
                            }
                        }

                        function onApiServiceTypeChange(value) {
                            // Show/hide different sections based on service type
                            const bgRemoverSection = document.getElementById('bgRemoverApiKeysSection');
                            const watermarkRemoverSection =
                                document.getElementById('watermarkRemoverApiKeysSection');
                            const photoGenSection = document.getElementById('photoGenApiKeysSection');
                            const videoGenSection = document.getElementById('videoGenApiKeysSection');
                            const standardSection = document.getElementById('standardApiKeySection');
                            const aiPlatformSection = document.getElementById('aiPlatformSection');

                            if (value === 'bg_remover') {
                                // BG Remover: show BG remover API keys
                                bgRemoverSection?.classList.remove('hidden');
                                watermarkRemoverSection?.classList.add('hidden');
                                photoGenSection?.classList.add('hidden');
                                videoGenSection?.classList.add('hidden');
                                standardSection?.classList.add('hidden');
                                aiPlatformSection?.classList.add('hidden');
                            } else if (value === 'watermark_remover') {
                                // Watermark Remover: show Watermark remover API keys
                                bgRemoverSection?.classList.add('hidden');
                                watermarkRemoverSection?.classList.remove('hidden');
                                photoGenSection?.classList.add('hidden');
                                videoGenSection?.classList.add('hidden');
                                standardSection?.classList.add('hidden');
                                aiPlatformSection?.classList.add('hidden');
                            } else if (value === 'photo_gen') {
                                // Photo Generator: show photo API keys, hide others
                                bgRemoverSection?.classList.add('hidden');
                                watermarkRemoverSection?.classList.add('hidden');
                                photoGenSection?.classList.remove('hidden');
                                videoGenSection?.classList.add('hidden');
                                standardSection?.classList.add('hidden');
                                aiPlatformSection?.classList.remove('hidden');
                            } else if (value === 'video_gen') {
                                // Video Generator: show video API keys, hide others
                                bgRemoverSection?.classList.add('hidden');
                                watermarkRemoverSection?.classList.add('hidden');
                                photoGenSection?.classList.add('hidden');
                                videoGenSection?.classList.remove('hidden');
                                standardSection?.classList.add('hidden');
                                aiPlatformSection?.classList.remove('hidden');
                            } else if (value === 'master_api') {
                                // Master API: show platform selection and standard API key
                                bgRemoverSection?.classList.add('hidden');
                                watermarkRemoverSection?.classList.add('hidden');
                                photoGenSection?.classList.add('hidden');
                                videoGenSection?.classList.add('hidden');
                                standardSection?.classList.remove('hidden');
                                aiPlatformSection?.classList.remove('hidden');
                            } else {
                                // Other services: only show standard API key
                                bgRemoverSection?.classList.add('hidden');
                                watermarkRemoverSection?.classList.add('hidden');
                                photoGenSection?.classList.add('hidden');
                                videoGenSection?.classList.add('hidden');
                                standardSection?.classList.remove('hidden');
                                aiPlatformSection?.classList.add('hidden');
                            }
                            console.log('API Service Type selected:', value);
                        }

                        // Gemini API Key fields for Master API
                        let geminiKeyCounter = 1;

                        function addGeminiKeyField() {
                            const container = document.getElementById('geminiApiKeysContainer');
                            if (!container) return;

                            const newRow = document.createElement('div');
                            newRow.className = 'api-key-row flex items-center gap-2';
                            newRow.innerHTML = `
                                <input type="password" placeholder="Enter Gemini API key (AIza...)"
                            class="gemini-key-input flex-1 bg-black/30 border border-white/10 p-3 rounded-lg text-white"
                            data-index="${geminiKeyCounter}">
                                <button type="button" onclick="removeGeminiKeyField(this)"
                                    class="w-8 h-8 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg flex items-center justify-center transition-all"
                                    title="Remove">
                                    <i class="fas fa-times text-xs"></i>
                                </button>
                            `;
                            container.appendChild(newRow);
                            geminiKeyCounter++;
                        }

                        function removeGeminiKeyField(btn) {
                            const container = document.getElementById('geminiApiKeysContainer');
                            const rows = container?.querySelectorAll('.api-key-row');

                            // Keep at least one field
                            if (rows && rows.length > 1) {
                                btn.closest('.api-key-row').remove();
                            } else {
                                // Clear the last field instead of removing
                                const input = rows[0].querySelector('.gemini-key-input');
                                if (input) input.value = '';
                            }
                        }

                        // Get all Gemini API keys from the Master API form
                        function getGeminiApiKeys() {
                            const container = document.getElementById('geminiApiKeysContainer');
                            if (!container) return [];

                            const inputs = container.querySelectorAll('.gemini-key-input');
                            const keys = [];
                            inputs.forEach(input => {
                                if (input.value.trim()) {
                                    keys.push({
                                        key: input.value.trim(),
                                        provider: 'gemini',
                                        active: true,
                                        lastUsed: null,
                                        requestCount: 0,
                                        reactivationPeriod: 86400000 // 1 day (24 hours) in milliseconds
                                    });
                                }
                            });
                            return keys;
                        }

                        // Dynamic API Key fields for BG Remover
                        let apiKeyCounter = 1;

                        function addApiKeyField() {
                            const container = document.getElementById('apiKeysContainer');
                            if (!container) return;

                            const newRow = document.createElement('div');
                            newRow.className = 'api-key-row flex items-center gap-2';
                            newRow.innerHTML = `
                                <input type="password" placeholder="Enter remove.bg API key"
                            class="api-key-input flex-1 bg-black/30 border border-white/10 p-3 rounded-lg text-white"
                            data-index="${apiKeyCounter}">
                                <button type="button" onclick="removeApiKeyField(this)"
                                    class="w-8 h-8 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg flex items-center justify-center transition-all"
                                    title="Remove">
                                    <i class="fas fa-times text-xs"></i>
                                </button>
                            `;
                            container.appendChild(newRow);
                            apiKeyCounter++;
                        }

                        function removeApiKeyField(btn) {
                            const container = document.getElementById('apiKeysContainer');
                            const rows = container?.querySelectorAll('.api-key-row');

                            // Keep at least one field
                            if (rows && rows.length > 1) {
                                btn.closest('.api-key-row').remove();
                            } else {
                                // Clear the last field instead of removing
                                const input = rows[0].querySelector('.api-key-input');
                                if (input) input.value = '';
                            }
                        }

                        // Get all API keys from the BG Remover form
                        function getBgRemoverApiKeys() {
                            const container = document.getElementById('apiKeysContainer');
                            const provider = document.getElementById('bgApiProvider')?.value ||
                                'remove.bg';
                            if (!container) return [];

                            const inputs = container.querySelectorAll('.api-key-input');
                            const keys = [];
                            inputs.forEach(input => {
                                if (input.value.trim()) {
                                    keys.push({
                                        key: input.value.trim(),
                                        provider: input.getAttribute('data-provider') || provider,
                                        active: true,
                                        lastUsed: null,
                                        requestCount: 0,
                                        reactivationPeriod: 2592000000 // 30 days in milliseconds
                                    });
                                }
                            });
                            return keys;
                        }

                        // Video API Provider Info
                        const videoApiProviderInfo = {
                            'gemini_video': 'Gemini Video (Google Veo 2): 60 requests/min free tier',
                            'luma_video': 'Luma Dream Machine: High-quality video generation',
                            'runway': 'Runway Gen-3 Alpha: Advanced AI video generation',
                            'pika': 'Pika Labs: Creative video generation tools',
                            'kling': 'Kling AI: Professional video generation',
                            'haiper': 'Haiper AI: Fast video generation with free tier'
                        };

                        function onVideoApiProviderChange(provider) {
                            const infoEl = document.getElementById('videoApiInfo');
                            if (infoEl && videoApiProviderInfo[provider]) {
                                infoEl.textContent = videoApiProviderInfo[provider];
                            }
                            // Update placeholder for new keys
                            const firstInput =
                                document.querySelector('.video-api-key-input[data-index="0"]');
                            if (firstInput) {
                                firstInput.setAttribute('data-provider', provider);
                                firstInput.placeholder = `Enter ${provider} API key`;
                            }
                        }

                        // Dynamic API Key fields for Video Generator
                        let videoApiKeyCounter = 1;

                        function addVideoApiKeyField() {
                            const container = document.getElementById('videoApiKeysContainer');
                            if (!container) return;
                            const provider = document.getElementById('videoApiProvider')?.value ||
                                'gemini_video';

                            const newRow = document.createElement('div');
                            newRow.className = 'video-api-key-row flex items-center gap-2';
                            newRow.innerHTML = `
                                <input type="password" placeholder="Enter ${provider} API key"
                            class="video-api-key-input flex-1 bg-black/30 border border-white/10 p-3 rounded-lg text-white"
                            data-index="${videoApiKeyCounter}" data-provider="${provider}">
                                <button type="button" onclick="removeVideoApiKeyField(this)"
                                    class="w-8 h-8 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg flex items-center justify-center transition-all"
                                    title="Remove">
                                    <i class="fas fa-times text-xs"></i>
                                </button>
                            `;
                            container.appendChild(newRow);
                            videoApiKeyCounter++;
                        }

                        function removeVideoApiKeyField(btn) {
                            const container = document.getElementById('videoApiKeysContainer');
                            const rows = container?.querySelectorAll('.video-api-key-row');

                            // Keep at least one field
                            if (rows && rows.length > 1) {
                                btn.closest('.video-api-key-row').remove();
                            } else {
                                // Clear the last field instead of removing
                                const input = rows[0].querySelector('.video-api-key-input');
                                if (input) input.value = '';
                            }
                        }

                        // Get all API keys from the Video Generator form
                        function getVideoGenApiKeys() {
                            const container = document.getElementById('videoApiKeysContainer');
                            const provider = document.getElementById('videoApiProvider')?.value ||
                                'gemini_video';
                            if (!container) return [];

                            const inputs = container.querySelectorAll('.video-api-key-input');
                            const keys = [];
                            inputs.forEach(input => {
                                if (input.value.trim()) {
                                    keys.push({
                                        key: input.value.trim(),
                                        provider: input.getAttribute('data-provider') || provider,
                                        active: true,
                                        lastUsed: null,
                                        requestCount: 0,
                                        reactivationPeriod: 86400000 // 1 day (24 hours) in milliseconds
                                    });
                                }
                            });
                            return keys;
                        }

                        // Photo API Provider Info
                        const photoApiProviderInfo = {
                            '4jibit': '4jibit: Free stable image generation API',
                            'gemini_image': 'Gemini Imagen 3: Google image generation (60 req/min free)',
                            'pollinations': 'Pollinations AI: Free image generation',
                            'stability': 'Stability AI: Professional image generation with free tier',
                            'leonardo': 'Leonardo AI: Creative image generation platform',
                            'midjourney_api': 'Midjourney API: Premium image generation',
                            'replicate': 'Replicate: Run AI models via API'
                        };

                        function onPhotoApiProviderChange(provider) {
                            const infoEl = document.getElementById('photoApiInfo');
                            if (infoEl && photoApiProviderInfo[provider]) {
                                infoEl.textContent = photoApiProviderInfo[provider];
                            }
                            // Update placeholder for new keys
                            const firstInput =
                                document.querySelector('.photo-api-key-input[data-index="0"]');
                            if (firstInput) {
                                firstInput.setAttribute('data-provider', provider);
                                firstInput.placeholder = `Enter ${provider} API key`;
                            }
                        }

                        // Dynamic API Key fields for Photo Generator
                        let photoApiKeyCounter = 1;

                        function addPhotoApiKeyField() {
                            const container = document.getElementById('photoApiKeysContainer');
                            if (!container) return;
                            const provider = document.getElementById('photoApiProvider')?.value ||
                                '4jibit';

                            const newRow = document.createElement('div');
                            newRow.className = 'photo-api-key-row flex items-center gap-2';
                            newRow.innerHTML = `
                                <input type="password" placeholder="Enter ${provider} API key"
                            class="photo-api-key-input flex-1 bg-black/30 border border-white/10 p-3 rounded-lg text-white"
                            data-index="${photoApiKeyCounter}" data-provider="${provider}">
                                <button type="button" onclick="removePhotoApiKeyField(this)"
                                    class="w-8 h-8 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg flex items-center justify-center transition-all"
                                    title="Remove">
                                    <i class="fas fa-times text-xs"></i>
                                </button>
                            `;
                            container.appendChild(newRow);
                            photoApiKeyCounter++;
                        }

                        function removePhotoApiKeyField(btn) {
                            const container = document.getElementById('photoApiKeysContainer');
                            const rows = container?.querySelectorAll('.photo-api-key-row');

                            // Keep at least one field
                            if (rows && rows.length > 1) {
                                btn.closest('.photo-api-key-row').remove();
                            } else {
                                // Clear the last field instead of removing
                                const input = rows[0].querySelector('.photo-api-key-input');
                                if (input) input.value = '';
                            }
                        }

                        // Get all API keys from the Photo Generator form
                        function getPhotoGenApiKeys() {
                            const container = document.getElementById('photoApiKeysContainer');
                            const provider = document.getElementById('photoApiProvider')?.value ||
                                '4jibit';
                            if (!container) return [];

                            const inputs = container.querySelectorAll('.photo-api-key-input');
                            const keys = [];
                            inputs.forEach(input => {
                                if (input.value.trim()) {
                                    keys.push({
                                        key: input.value.trim(),
                                        provider: input.getAttribute('data-provider') || provider,
                                        active: true,
                                        lastUsed: null,
                                        requestCount: 0,
                                        reactivationPeriod: 86400000 // 1 day (24 hours) in milliseconds
                                    });
                                }
                            });
                            return keys;
                        }

                        // Watermark API Provider Info
                        const watermarkApiProviderInfo = {
                            'remove.bg': 'remove.bg: 50 free images/month per key',
                            'clippingmagic': 'Clipping Magic: Free trial available - 15 free images',
                            'cutout.pro': 'Cutout.pro: 10 free images per day',
                            'picwish': 'PicWish: 10 free images per day',
                            'erase.bg': 'Erase.bg: 5 free images per day',
                            'photoroom': 'PhotoRoom: 50 free images per month',
                            'clipdrop': 'ClipDrop (Stability AI): 25 free images per day',
                            'bria': 'BRIA AI: 100 free images per month',
                            'segmind': 'Segmind: 50 free images per month',
                            'hotpot': 'Hotpot.ai: 10 free images per day',
                            'retoucher': 'Retoucher.online: Unlimited free (with limits)',
                            'removal': 'Removal.ai: 3 free HD images per month',
                            'slazzer': 'Slazzer: 2 free credits per month',
                            'photoscissors': 'PhotoScissors: Unlimited free (web version)',
                            'backgroundcut': 'BackgroundCut: 5 free images per day',
                            'unscreen': 'Unscreen: 5 free videos/images per month',
                            'kapwing': 'Kapwing: 3 free projects per month',
                            'canva': 'Canva API: Free tier available (1000 requests)',
                            'removebg.org': 'RemoveBG.org: Unlimited free (with limits)',
                            'adobe': 'Adobe Express: 5 free images per month',
                            'depositphotos': 'Depositphotos: 3 free images per month',
                            'icons8': 'Icons8: 3 free images per day',
                            'foco': 'FocoClipping: 5 free images per month',
                            'vectorizer': 'Vectorizer.AI: 5 free images per month',
                            'imageenlarger': 'ImageEnlarger: Unlimited free',
                            'waifu2x': 'Waifu2x: Unlimited free',
                            'bigjpg': 'BigJPG: Unlimited free',
                            'imgupscaler': 'ImgUpscaler: 5 free images per month',
                            'deepai': 'DeepAI: 100 free requests per month',
                            'remove.bg.alternative': 'Remove.bg Alternative: Unlimited free',
                            'inpixio': 'Inpixio: 5 free images per month',
                            'befunky': 'BeFunky: 3 free images per month',
                            'fotor': 'Fotor: 5 free images per month',
                            'pixlr': 'Pixlr: 3 free images per month',
                            'photopea': 'Photopea: Unlimited free',
                            'gimp': 'GIMP Online: Unlimited free'
                        };

                        function onWatermarkApiProviderChange(provider) {
                            const infoEl = document.getElementById('watermarkApiInfo');
                            if (infoEl && watermarkApiProviderInfo[provider]) {
                                infoEl.textContent = watermarkApiProviderInfo[provider];
                            }
                            // Update placeholder for new keys
                            const firstInput =
                                document.querySelector('.watermark-api-key-input[data-index="0"]');
                            if (firstInput) {
                                firstInput.setAttribute('data-provider', provider);
                                firstInput.placeholder = `Enter ${provider} API key`;
                            }
                        }

                        // Dynamic API Key fields for Watermark Remover
                        let watermarkApiKeyCounter = 1;

                        function addWatermarkApiKeyField() {
                            const container = document.getElementById('watermarkApiKeysContainer');
                            if (!container) return;
                            const provider = document.getElementById('watermarkApiProvider')?.value ||
                                'remove.bg';

                            const newRow = document.createElement('div');
                            newRow.className = 'watermark-api-key-row flex items-center gap-2';
                            newRow.innerHTML = `
                                <input type="password" placeholder="Enter ${provider} API key"
                            class="watermark-api-key-input flex-1 bg-black/30 border border-white/10 p-3 rounded-lg text-white"
                            data-index="${watermarkApiKeyCounter}" data-provider="${provider}">
                                <button type="button" onclick="removeWatermarkApiKeyField(this)"
                                    class="w-8 h-8 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg flex items-center justify-center transition-all"
                                    title="Remove">
                                    <i class="fas fa-times text-xs"></i>
                                </button>
                            `;
                            container.appendChild(newRow);
                            watermarkApiKeyCounter++;
                        }

                        function removeWatermarkApiKeyField(btn) {
                            const container = document.getElementById('watermarkApiKeysContainer');
                            const rows = container?.querySelectorAll('.watermark-api-key-row');

                            // Keep at least one field
                            if (rows && rows.length > 1) {
                                btn.closest('.watermark-api-key-row').remove();
                            } else {
                                // Clear the last field instead of removing
                                const input = rows[0].querySelector('.watermark-api-key-input');
                                if (input) input.value = '';
                            }
                        }

                        // Get all API keys from the Watermark Remover form
                        function getWatermarkApiKeys() {
                            const container = document.getElementById('watermarkApiKeysContainer');
                            const provider = document.getElementById('watermarkApiProvider')?.value ||
                                'remove.bg';
                            if (!container) return [];

                            const inputs = container.querySelectorAll('.watermark-api-key-input');
                            const keys = [];
                            inputs.forEach(input => {
                                if (input.value.trim()) {
                                    keys.push({
                                        key: input.value.trim(),
                                        provider: input.getAttribute('data-provider') || provider,
                                        active: true,
                                        lastUsed: null,
                                        requestCount: 0,
                                        reactivationPeriod: 2592000000 // 30 days in milliseconds
                                    });
                                }
                            });
                            return keys;
                        }

                        function showProviderModal() {
                            document.getElementById('providerModalTitle').textContent = 'Add New Provider';
                            document.getElementById('providerEditId').value = '';

                            // Reset form state without calling closeProviderModal
                            currentProviderType = '';
                            currentApiServiceType = '';
                            document.getElementById('selectedProviderType').value = '';

                            // Hide form sections
                            document.getElementById('providerFormContainer').classList.add('hidden');

                            // Reset button styles
                            document.querySelectorAll('.api-service-btn').forEach(btn => {
                                btn.classList.remove('border-green-500', 'bg-white/10');
                                btn.classList.add('border-white/10');
                            });

                            document.querySelectorAll('.provider-type-btn').forEach(btn => {
                                btn.classList.remove('border-green-500', 'bg-white/10');
                                btn.classList.add('border-white/10');
                            });

                            // Reset form inputs
                            document.querySelectorAll('.provider-form-section input, .provider-form-section textarea, .provider-form-section select').forEach(input => {
                                if (input.type === 'checkbox') {
                                    input.checked = true;
                                } else if (input.type === 'number') {
                                    input.value = input.placeholder || 0;
                                } else {
                                    input.value = '';
                                }
                            });

                            // Show modal
                            document.getElementById('providerModal').style.display = 'flex';
                        }

                        function editProvider(id) {
                            fetch('/api/admin/providers')
                                .then(r => r.json())
                                .then(data => {
                                    if (!data.success) return;
                                    const p = data.providers.find(prov => prov.id === id);
                                    if (!p) return alert('Provider not found');

                                    document.getElementById('providerModalTitle').textContent = 'Edit Provider';
                                    document.getElementById('providerEditId').value = p.id;
                                    document.getElementById('providerName').value = p.name || '';

                                    // Select type and show form
                                    selectProviderType(p.type);

                                    // Populate type-specific fields
                                    if (p.type === 'premium_email') {
                                        document.getElementById('imapServer').value = p.imapServer || '';
                                        document.getElementById('imapPort').value = p.imapPort || 993;
                                        document.getElementById('imapSsl').value = p.imapSsl ? 'true' : 'false';
                                    } else if (p.type === 'number' || p.type === 'sms') {
                                        document.getElementById('smsApiUrl').value = p.apiUrl || '';
                                        document.getElementById('smsApiKey').value = ''; // Keep empty
                                        document.getElementById('smsCost').value = p.cost || 10;
                                    } else if (p.type === 'api_key') {
                                        document.getElementById('apiServiceType').value = p.serviceType || '';
                                        document.getElementById('apiEndpoint').value = p.apiUrl || '';
                                        document.getElementById('apiCostPerUse').value = p.cost || 5;
                                    } else if (p.type === 'master') {
                                        document.getElementById('masterApiEndpoint').value = p.apiUrl || '';
                                    }

                                    document.getElementById('providerActive').checked = p.status === 'active' ||
                                        p.status === 'online';
                                    document.getElementById('providerModal').style.display = 'flex';
                                });
                        }

                        async function saveProvider() {
                            const editId = document.getElementById('providerEditId').value;
                            const type = document.getElementById('selectedProviderType').value;
                            const name = document.getElementById('providerName').value.trim();
                            const status = document.getElementById('providerActive').checked ? 'active'
                                : 'inactive';

                            if (!type || !name) {
                                alert('Please select a provider type and enter a name');
                                return;
                            }

                            let payload = {
                                id: editId || name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now(),
                                name,
                                type,
                                status
                            };

                            // Add type-specific fields
                            if (type === 'premium_email') {
                                const emails = document.getElementById('emailImportList').value.trim();
                                payload = {
                                    ...payload,
                                    imapServer: document.getElementById('imapServer').value.trim(),
                                    imapPort: parseInt(document.getElementById('imapPort').value) || 993,
                                    imapSsl: document.getElementById('imapSsl').value === 'true',
                                    emails: emails ? emails.split('\n').map(e => e.trim()).filter(e => e) : []
                                };
                            } else if (type === 'number') {
                                payload = {
                                    ...payload,
                                    apiUrl: document.getElementById('smsApiUrl').value.trim(),
                                    apiKey: document.getElementById('smsApiKey').value.trim() || undefined,
                                    geminiApiKeys: getGeminiApiKeys(),
                                    botToken: document.getElementById('masterBotToken').value.trim(),
                                    adminKey: document.getElementById('masterAdminKey').value.trim(),
                                    monitorUrl: document.getElementById('masterMonitorUrl').value.trim(),
                                    notifyChannel: document.getElementById('masterNotifyChannel').value.trim(),
                                    autoHeal: document.getElementById('masterAutoHeal').checked,
                                    userSupport: document.getElementById('masterUserSupport').checked,
                                    adminChannels:
                                        document.getElementById('masterAdminChannels').value.trim().split('\n').filter(c => c.trim()),
                                    manageChannels: document.getElementById('masterManageChannels').checked,
                                    deleteLinks: document.getElementById('masterDeleteLinks').checked
                                };
                            }

                            try {
                                const res = await fetch('/api/admin/providers', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(payload)
                                });

                                const data = await res.json();

                                if (data.success) {
                                    closeProviderModal();
                                    loadProviders();
                                    alert('Provider saved successfully!');
                                } else {
                                    alert('Error: ' + (data.message || 'Failed to save provider'));
                                }
                            } catch (e) {
                                alert('Network error saving provider');
                            }
                        }

                        async function deleteProvider(id) {
                            if (!confirm(`Are you sure you want to delete provider "${id}" ? `)) return;

                            try {
                                const res = await fetch(`/api/admin/providers/${id}`, { method: 'DELETE' });
                                const data = await res.json();

                                if (data.success) {
                                    loadProviders();
                                    alert('Provider deleted successfully!');
                                } else {
                                    alert('Error deleting provider');
                                }
                            } catch (e) {
                                alert('Network error deleting provider');
                            }
                        }

                        // ==================== GROUP MANAGEMENT ====================
                        async function loadGroupManagementSettings() {
                            try {
                                const res = await fetch('/api/admin/group-management');
                                const data = await res.json();

                                if (data.success && data.settings) {
                                    const s = data.settings;
                                    document.getElementById('gm_autoDeleteSystemMessages').checked =
                                        s.autoDeleteSystemMessages !== false;
                                    document.getElementById('gm_welcomeMessage').checked = s.welcomeMessage !==
                                        false;
                                    document.getElementById('gm_welcomeMessageText').value = s.welcomeMessageText || 'Welcome {username}! 🎉 We\'re glad to have you here. Feel free to explore and enjoy our services!';
                                    document.getElementById('gm_deleteJoinMessages').checked =
                                        s.deleteJoinMessages !== false;
                                    document.getElementById('gm_deleteLeaveMessages').checked =
                                        s.deleteLeaveMessages !== false;
                                    document.getElementById('gm_deleteTitleChanged').checked =
                                        s.deleteTitleChanged === true;
                                    document.getElementById('gm_deleteGroupPhotoChanged').checked =
                                        s.deleteGroupPhotoChanged === true;
                                    document.getElementById('gm_deletePinMessages').checked =
                                        s.deletePinMessages === true;
                                    document.getElementById('gm_deleteVideoChatStarted').checked =
                                        s.deleteVideoChatStarted === true;
                                    document.getElementById('gm_deleteVideoChatEnded').checked =
                                        s.deleteVideoChatEnded === true;
                                    // Anti-spam settings
                                    document.getElementById('gm_deleteUserLinks').checked = s.deleteUserLinks === true;
                                    document.getElementById('gm_deleteMentionsHashtags').checked = s.deleteMentionsHashtags === true;
                                    document.getElementById('gm_deleteDmSolicitations').checked = s.deleteDmSolicitations === true;
                                    document.getElementById('gm_enableWarningSystem').checked = s.enableWarningSystem === true;
                                    document.getElementById('gm_warningMessage').value = s.warningMessage || 'Warning {username}! This is strike {strikes}/3. Next violation will result in a ban.';
                                    document.getElementById('gm_enableBanCommand').checked = s.enableBanCommand === true;
                                    document.getElementById('gm_banCommand').value = s.banCommand || 'ban';
                                }
                            } catch (e) {
                                console.error('Error loading group management settings:', e);
                            }
                        }

                        async function saveGroupManagementSettings() {
                            const statusEl = document.getElementById('groupManagementStatus');
                            if (statusEl) statusEl.textContent = 'Saving...';

                            const settings = {
                                autoDeleteSystemMessages:
                                    document.getElementById('gm_autoDeleteSystemMessages').checked,
                                welcomeMessage: document.getElementById('gm_welcomeMessage').checked,
                                welcomeMessageText: document.getElementById('gm_welcomeMessageText').value,
                                deleteJoinMessages:
                                    document.getElementById('gm_deleteJoinMessages').checked,
                                deleteLeaveMessages:
                                    document.getElementById('gm_deleteLeaveMessages').checked,
                                deleteTitleChanged:
                                    document.getElementById('gm_deleteTitleChanged').checked,
                                deleteGroupPhotoChanged:
                                    document.getElementById('gm_deleteGroupPhotoChanged').checked,
                                deletePinMessages: document.getElementById('gm_deletePinMessages').checked,
                                deleteVideoChatStarted:
                                    document.getElementById('gm_deleteVideoChatStarted').checked,
                                deleteVideoChatEnded:
                                    document.getElementById('gm_deleteVideoChatEnded').checked,
                                // Anti-spam settings
                                deleteUserLinks: document.getElementById('gm_deleteUserLinks').checked,
                                deleteMentionsHashtags:
                                    document.getElementById('gm_deleteMentionsHashtags').checked,
                                deleteDmSolicitations:
                                    document.getElementById('gm_deleteDmSolicitations').checked,
                                enableWarningSystem:
                                    document.getElementById('gm_enableWarningSystem').checked,
                                warningMessage: document.getElementById('gm_warningMessage').value,
                                enableBanCommand: document.getElementById('gm_enableBanCommand').checked,
                                banCommand: document.getElementById('gm_banCommand').value
                            };

                            try {
                                const res = await fetch('/api/admin/group-management', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(settings)
                                });

                                const data = await res.json();

                                if (data.success) {
                                    if (statusEl) statusEl.textContent = 'Settings saved successfully!';
                                    setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 3000);
                                } else {
                                    if (statusEl) statusEl.textContent = 'Error: ' + (data.message || 'Failed to save');
                                }
                            } catch (e) {
                                if (statusEl) statusEl.textContent = 'Network error saving settings';
                            }
                        }

                        // ==================== SERVER LOGS ====================
                        async function fetchServerLogs() {
                            try {
                                const list = document.getElementById('logsList');
                                if (!list) return;
                                
                                const res = await fetch('/api/admin/logs');
                                const data = await res.json();
                                if (data.success) {
                                    if (!data.logs || data.logs.length === 0) {
                                        list.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-slate-500">No logs found</td></tr>';
                                        return;
                                    }
                                    list.innerHTML = data.logs.map(log => `
                                        <tr class="${log.status === 'solved' ? 'opacity-40' : ''} border-b border-white/5 hover:bg-white/5 transition-all">
                                            <td class="p-3 text-slate-400 text-xs font-mono">${log.timestamp}</td>
                                            <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${getLogTypeClass(log.type)}">${log.type.toUpperCase()}</span></td>
                                            <td class="p-3 font-medium text-sm text-slate-200">${log.message}</td>
                                            <td class="p-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${log.status === 'solved' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">${log.status.toUpperCase()}</span></td>
                                            <td class="p-3 text-right">
                                                <div class="flex gap-2 justify-end">
                                                    ${log.status === 'unsolved' ? `<button onclick="solveLog('${log.id}')" class="w-8 h-8 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all flex items-center justify-center" title="Solve"><i class="fas fa-check"></i></button>` : ''}
                                                    <button class="w-8 h-8 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-all flex items-center justify-center" title="Details" onclick='alert("Details: " + JSON.stringify(${JSON.stringify(log.context || {})}))'><i class="fas fa-eye text-xs"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('');
                                }
                            } catch (e) {
                                console.error('Error fetching logs:', e);
                            }
                        }

                        function getLogTypeClass(type) {
                            switch(type) {
                                case 'error': return 'bg-red-500/20 text-red-400';
                                case 'warn': return 'bg-yellow-500/20 text-yellow-400';
                                case 'info': return 'bg-blue-500/20 text-blue-400';
                                default: return 'bg-slate-500/20 text-slate-400';
                            }
                        }

                        async function solveLog(id) {
                            try {
                                const res = await fetch('/api/admin/logs/solve', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ logId: id })
                                });
                                const data = await res.json();
                                if (data.success) fetchServerLogs();
                            } catch (e) { }
                        }

                        async function clearServerLogs() {
                            if (!confirm('Are you sure you want to clear all server logs?')) return;
                            try {
                                const res = await fetch('/api/admin/logs/clear', { method: 'POST' });
                                const data = await res.json();
                                if (data.success) {
                                    alert('Logs cleared!');
                                    fetchServerLogs();
                                }
                            } catch (e) { }
                        }

                        // ==================== DEPOSIT PLATFORMS CONFIG ====================
                        let cryptoMethodsCache = {};

                        window.openDepositPlatformsModal = async function() {
                            const modal = document.getElementById('depositPlatformsModal');
                            const content = document.getElementById('depositPlatformsModalContent');
                            if (modal) {
                                modal.classList.remove('hidden');
                                modal.classList.add('flex');
                                setTimeout(() => {
                                    content.classList.remove('scale-95', 'opacity-0');
                                }, 10);
                            }
                            
                            try {
                                const res = await fetch('/api/deposit/config');
                                const data = await res.json();
                                if (data.success && data.cryptoMethods) {
                                    cryptoMethodsCache = data.cryptoMethods;
                                } else {
                                    cryptoMethodsCache = {};
                                }
                                renderDepositPlatforms();
                            } catch (e) {
                                console.error('Failed to load deposit platforms:', e);
                                alert('Error loading platforms');
                            }
                        };
                        
                        window.closeDepositPlatformsModal = function() {
                            const modal = document.getElementById('depositPlatformsModal');
                            const content = document.getElementById('depositPlatformsModalContent');
                            if (modal && content) {
                                content.classList.add('scale-95', 'opacity-0');
                                setTimeout(() => {
                                    modal.classList.add('hidden');
                                    modal.classList.remove('flex');
                                }, 200);
                            }
                        };
                        
                        let currentPlatformTab = 'crypto';
                        
                        window.switchPlatformTab = function(tabName) {
                            currentPlatformTab = tabName;
                            
                            // Update tab UI
                            const cryptoBtn = document.getElementById('tabCryptoPlatforms');
                            const localBtn = document.getElementById('tabLocalPlatforms');
                            
                            if (tabName === 'crypto') {
                                cryptoBtn.className = 'flex-1 py-3 bg-blue-600 rounded-xl text-sm font-bold text-white transition-all';
                                localBtn.className = 'flex-1 py-3 bg-white/10 rounded-xl text-sm font-bold text-gray-300 hover:bg-white/20 hover:text-white transition-all';
                            } else {
                                localBtn.className = 'flex-1 py-3 bg-emerald-600 rounded-xl text-sm font-bold text-white transition-all';
                                cryptoBtn.className = 'flex-1 py-3 bg-white/10 rounded-xl text-sm font-bold text-gray-300 hover:bg-white/20 hover:text-white transition-all';
                            }
                            
                            // Make sure UI saves before changing tabs
                            for (const key of Object.keys(cryptoMethodsCache)) {
                                const nameInput = document.getElementById('dp_name_' + key);
                                if (nameInput) {
                                    cryptoMethodsCache[key].name = nameInput.value;
                                    cryptoMethodsCache[key].type = document.getElementById('dp_type_' + key).value || 'crypto';
                                    cryptoMethodsCache[key].details = document.getElementById('dp_details_' + key).value;
                                    cryptoMethodsCache[key].email = document.getElementById('dp_email_' + key).value;
                                    cryptoMethodsCache[key].qr = document.getElementById('dp_qr_' + key).value;
                                    cryptoMethodsCache[key].status = document.getElementById('dp_status_' + key).checked ? 'active' : 'inactive';
                                }
                            }
                            
                            renderDepositPlatforms();
                        };

                        window.renderDepositPlatforms = function() {
                            const list = document.getElementById('depositPlatformsList');
                            if (!list) return;
                            
                            list.innerHTML = '';
                            
                            let count = 0;
                            
                            for (const [key, platform] of Object.entries(cryptoMethodsCache)) {
                                const pType = platform.type || 'crypto';
                                if (pType !== currentPlatformTab) continue;
                                
                                count++;
                                
                                const element = document.createElement('div');
                                element.className = 'bg-slate-900/50 border border-white/10 rounded-xl p-4 relative';
                                element.innerHTML = `
                                    <div class="flex flex-wrap gap-2 justify-between items-start mb-3">
                                        <div class="font-bold flex flex-wrap items-center gap-2">
                                            <input type="text" id="dp_name_${key}" class="bg-black/50 border border-white/20 rounded px-2 py-1 text-sm text-white w-48" value="${platform.name || ''}" placeholder="Platform Name (e.g. Binance)">
                                            
                                            <select id="dp_type_${key}" class="bg-black/50 border border-white/20 rounded px-2 py-1 text-sm text-white outline-none">
                                                <option value="crypto" ${pType === 'crypto' ? 'selected' : ''}>Crypto Payment</option>
                                                <option value="local" ${pType === 'local' ? 'selected' : ''}>Local Payment (bKash/Nagad)</option>
                                            </select>

                                            <div class="flex items-center gap-1 ml-2">
                                                <input type="checkbox" id="dp_status_${key}" ${platform.status === 'active' ? 'checked' : ''} class="w-4 h-4 accent-green-500">
                                                <label for="dp_status_${key}" class="text-xs text-gray-400">Active</label>
                                            </div>
                                        </div>
                                        <button onclick="removePlatform('${key}')" class="text-red-400 hover:text-red-300 p-1">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                    
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label class="text-[10px] text-gray-400 uppercase tracking-wider mb-1 block">Details / Address / Number</label>
                                            <input type="text" id="dp_details_${key}" class="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white" value="${platform.details || ''}" placeholder="e.g. TR7NH...">
                                        </div>
                                        <div>
                                            <label class="text-[10px] text-gray-400 uppercase tracking-wider mb-1 block">Email (Optional)</label>
                                            <input type="text" id="dp_email_${key}" class="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white" value="${platform.email || ''}" placeholder="e.g. email@binance.com">
                                        </div>
                                        <div class="col-span-full">
                                            <label class="text-[10px] text-gray-400 uppercase tracking-wider mb-1 block">QR Code URL (Optional)</label>
                                            <input type="text" id="dp_qr_${key}" class="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white" value="${platform.qr || ''}" placeholder="https://...">
                                        </div>
                                    </div>
                                `;
                                list.appendChild(element);
                            }
                            
                            if (count === 0) {
                                list.innerHTML = `<div class="text-gray-500 text-center py-4">No ${currentPlatformTab} platforms configured. Click "ADD NEW PLATFORM" below.</div>`;
                            }
                        };
                        
                        window.addNewPlatform = function() {
                            // save current states first
                            for (const key of Object.keys(cryptoMethodsCache)) {
                                const nameInput = document.getElementById('dp_name_' + key);
                                if (nameInput) {
                                    cryptoMethodsCache[key].name = nameInput.value;
                                    cryptoMethodsCache[key].type = document.getElementById('dp_type_' + key).value || 'crypto';
                                    cryptoMethodsCache[key].details = document.getElementById('dp_details_' + key).value;
                                    cryptoMethodsCache[key].email = document.getElementById('dp_email_' + key).value;
                                    cryptoMethodsCache[key].qr = document.getElementById('dp_qr_' + key).value;
                                    cryptoMethodsCache[key].status = document.getElementById('dp_status_' + key).checked ? 'active' : 'inactive';
                                }
                            }

                            const newKey = 'platform_' + Date.now();
                            cryptoMethodsCache[newKey] = {
                                name: "New Platform",
                                type: currentPlatformTab, // Match currently open tab
                                details: "",
                                email: "",
                                qr: "",
                                status: "active"
                            };
                            renderDepositPlatforms();
                        };
                        
                        window.removePlatform = function(key) {
                            if (confirm('Are you sure you want to remove this platform?')) {
                                delete cryptoMethodsCache[key];
                                renderDepositPlatforms();
                            }
                        };
                        
                        window.saveDepositPlatforms = async function() {
                            // Update cache with input values
                            for (const key of Object.keys(cryptoMethodsCache)) {
                                const nameInput = document.getElementById('dp_name_' + key);
                                if (!nameInput) continue; // safety check
                                
                                cryptoMethodsCache[key] = {
                                    name: nameInput.value,
                                    type: document.getElementById('dp_type_' + key).value || 'crypto',
                                    details: document.getElementById('dp_details_' + key).value,
                                    email: document.getElementById('dp_email_' + key).value,
                                    qr: document.getElementById('dp_qr_' + key).value,
                                    status: document.getElementById('dp_status_' + key).checked ? 'active' : 'inactive'
                                };
                            }
                            
                            try {
                                const res = await fetch('/api/admin/deposits/config', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ cryptoMethods: cryptoMethodsCache })
                                });
                                
                                const data = await res.json();
                                if (data.success) {
                                    alert('Deposit platforms saved successfully!');
                                    closeDepositPlatformsModal();
                                } else {
                                    alert('Failed to save deposit platforms: ' + (data.message || 'Unknown error'));
                                }
                            } catch (e) {
                                console.error('Save error:', e);
                                alert('Network error occurred while saving.');
                            }
                        };

                        // INITIALIZATION
                        window.addEventListener('DOMContentLoaded', () => {
                            initURLs();
                            nav('dashboard');
                        });
                    