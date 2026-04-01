export async function renderDashboard() {
    const activityContainer = document.getElementById('recent-activity');
    const statOrgs = document.getElementById('stat-orgs');
    const statMembers = document.getElementById('stat-members');
    const statEvents = document.getElementById('stat-events');

    // Mock stats
    if (statOrgs) statOrgs.textContent = '12';
    if (statMembers) statMembers.textContent = '1,248';
    if (statEvents) statEvents.textContent = '3';

    const mockActivities = [
        { user: 'John Doe', action: 'created a new event', time: '2 hours ago' },
        { user: 'Jane Smith', action: 'joined the organization', time: '5 hours ago' },
        { user: 'Admin', action: 'updated system settings', time: '1 day ago' },
    ];
    
    activityContainer.innerHTML = mockActivities.map(activity => `
        <div class="flex items-center space-x-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors">
            <div class="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                ${activity.user.charAt(0)}
            </div>
            <div class="flex-1">
                <p class="text-sm font-semibold text-slate-900">${activity.user} <span class="font-normal text-slate-500">${activity.action}</span></p>
                <p class="text-xs text-slate-400 mt-0.5">${activity.time}</p>
            </div>
        </div>
    `).join('');
}
