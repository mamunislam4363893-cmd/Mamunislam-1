const fs = require('fs');

let html = fs.readFileSync('web/admin.html', 'utf8');

// The replacement structure for page-history
const replacement = `
                <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <!-- History Column -->
                    <div class="glass-card rounded-2xl p-6 overflow-hidden flex flex-col h-[700px]">
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <h3 class="font-bold flex items-center gap-2 text-lg"><i class="fas fa-list text-blue-400"></i> GLOBAL RECENT HISTORY</h3>
                                <p class="text-xs text-gray-400 mt-1">Real-time log of platform interactions</p>
                            </div>
                            <button onclick="loadGlobalHistory()" class="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors tooltip" data-tip="Refresh Data">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                        </div>
                        <div class="overflow-y-auto flex-1 pr-2 custom-scrollbar">
                            <table class="w-full text-sm">
                                <thead class="sticky top-0 bg-[#0a0a0a] z-10 shadow-sm shadow-black/50">
                                    <tr class="text-gray-400 text-xs border-b border-white/5">
                                        <th class="text-left font-bold py-3 pl-2">USER</th>
                                        <th class="text-left font-bold py-3">ACTION</th>
                                        <th class="text-left font-bold py-3">AMOUNT</th>
                                        <th class="text-left font-bold py-3">DATE</th>
                                    </tr>
                                </thead>
                                <tbody id="globalHistoryBody">
                                    <tr>
                                        <td colspan="4" class="text-center py-10 text-gray-500">
                                            <i class="fas fa-spinner fa-spin text-xl mb-2"></i><br>
                                            Loading history records...
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Leaderboards Column -->
                    <div class="glass-card rounded-2xl p-6 flex flex-col h-[700px]">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <h3 class="font-bold flex items-center gap-2 text-lg"><i class="fas fa-trophy text-yellow-400"></i> SYSTEM LEADERBOARDS</h3>
                                <p class="text-xs text-gray-400 mt-1">Top performers across categories</p>
                            </div>
                        </div>
                        
                        <!-- Horizontal Tabs -->
                        <div class="flex overflow-x-auto gap-2 pb-2 mb-4 custom-scrollbar hide-scrollbar" id="leaderboard-tabs">
                            <button id="btn-lb-active" onclick="switchLeaderboard('active')" class="whitespace-nowrap px-3 py-2 rounded-lg bg-blue-500/20 text-white font-medium text-xs flex items-center gap-2 border border-blue-500/30">
                                <i class="fas fa-chart-line text-blue-400"></i> Active
                            </button>
                            <button id="btn-lb-earners" onclick="switchLeaderboard('earners')" class="whitespace-nowrap px-3 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 text-xs flex items-center gap-2 border border-white/10">
                                <i class="fas fa-coins text-green-400"></i> Earners
                            </button>
                            <button id="btn-lb-spenders" onclick="switchLeaderboard('spenders')" class="whitespace-nowrap px-3 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 text-xs flex items-center gap-2 border border-white/10">
                                <i class="fas fa-shopping-cart text-red-400"></i> Spenders
                            </button>
                            <button id="btn-lb-depositors" onclick="switchLeaderboard('depositors')" class="whitespace-nowrap px-3 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 text-xs flex items-center gap-2 border border-white/10">
                                <i class="fas fa-wallet text-purple-400"></i> Depositors
                            </button>
                            <button id="btn-lb-services" onclick="switchLeaderboard('services')" class="whitespace-nowrap px-3 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 text-xs flex items-center gap-2 border border-white/10">
                                <i class="fas fa-concierge-bell text-orange-400"></i> Services
                            </button>
                            <button id="btn-lb-referrers" onclick="switchLeaderboard('referrers')" class="whitespace-nowrap px-3 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 text-xs flex items-center gap-2 border border-white/10">
                                <i class="fas fa-users text-cyan-400"></i> Referrers
                            </button>
                        </div>

                        <!-- Panels Area -->
                        <div class="overflow-y-auto flex-1 custom-scrollbar bg-black/20 rounded-xl border border-white/5 p-3">
                            <div id="lb-active" class="leaderboard-panel hide-scrollbar">
                                <table class="w-full text-sm">
                                    <thead class="text-gray-500 border-b border-white/5 uppercase text-xs font-bold">
                                        <tr>
                                            <th class="pb-2 text-left w-10 pl-2">Rank</th>
                                            <th class="pb-2 text-left">User</th>
                                            <th class="pb-2 text-right">Txns</th>
                                            <th class="pb-2 text-right pr-2">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody id="lbActiveBody"></tbody>
                                </table>
                            </div>

                            <div id="lb-earners" class="leaderboard-panel hidden">
                                <table class="w-full text-sm">
                                    <thead class="text-gray-500 border-b border-white/5 uppercase text-xs font-bold">
                                        <tr>
                                            <th class="pb-2 text-left w-10 pl-2">Rank</th>
                                            <th class="pb-2 text-left">User</th>
                                            <th class="pb-2 text-right">Earned</th>
                                            <th class="pb-2 text-right pr-2">Rewards</th>
                                        </tr>
                                    </thead>
                                    <tbody id="lbEarnersBody"></tbody>
                                </table>
                            </div>

                            <div id="lb-spenders" class="leaderboard-panel hidden">
                                <table class="w-full text-sm">
                                    <thead class="text-gray-500 border-b border-white/5 uppercase text-xs font-bold">
                                        <tr>
                                            <th class="pb-2 text-left w-10 pl-2">Rank</th>
                                            <th class="pb-2 text-left">User</th>
                                            <th class="pb-2 text-right">Spent</th>
                                            <th class="pb-2 text-right pr-2">Purchases</th>
                                        </tr>
                                    </thead>
                                    <tbody id="lbSpendersBody"></tbody>
                                </table>
                            </div>

                            <div id="lb-depositors" class="leaderboard-panel hidden">
                                <table class="w-full text-sm">
                                    <thead class="text-gray-500 border-b border-white/5 uppercase text-xs font-bold">
                                        <tr>
                                            <th class="pb-2 text-left w-10 pl-2">Rank</th>
                                            <th class="pb-2 text-left">User</th>
                                            <th class="pb-2 text-right">Deposits</th>
                                            <th class="pb-2 text-right pr-2">Transfers</th>
                                        </tr>
                                    </thead>
                                    <tbody id="lbDepositorsBody"></tbody>
                                </table>
                            </div>

                            <div id="lb-services" class="leaderboard-panel hidden">
                                <table class="w-full text-sm">
                                    <thead class="text-gray-500 border-b border-white/5 uppercase text-xs font-bold">
                                        <tr>
                                            <th class="pb-2 text-left w-10 pl-2">Rank</th>
                                            <th class="pb-2 text-left">Service</th>
                                            <th class="pb-2 text-right">Uses</th>
                                            <th class="pb-2 text-right pr-2">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody id="lbServicesBody"></tbody>
                                </table>
                            </div>

                            <div id="lb-referrers" class="leaderboard-panel hidden">
                                <table class="w-full text-sm">
                                    <thead class="text-gray-500 border-b border-white/5 uppercase text-xs font-bold">
                                        <tr>
                                            <th class="pb-2 text-left w-10 pl-2">Rank</th>
                                            <th class="pb-2 text-left">User</th>
                                            <th class="pb-2 text-right">Invites</th>
                                            <th class="pb-2 text-right pr-2">Earned</th>
                                        </tr>
                                    </thead>
                                    <tbody id="lbReferrersBody"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

const searchStartStr = '<div class="glass-card rounded-2xl p-6 overflow-hidden flex flex-col h-[600px]">';
const startIndex = html.indexOf(searchStartStr);
const endStr = '<div id="page-dashboard" class="page active">';
const endIndex = html.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    const finalHtml = html.substring(0, startIndex) + replacement + '\n\n            ' + html.substring(endIndex);
    fs.writeFileSync('web/admin.html', finalHtml, 'utf8');
    console.log('HTML rewritten successfully!');
} else {
    console.log('Failed to find markers.');
}
