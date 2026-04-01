import { showConfirmModal } from './ui.js';

export async function renderEvents(currentUser) {
    const grid = document.getElementById('events-grid');
    const createEventBtn = document.getElementById('create-event-btn');
    
    // RBAC: Only ADMIN and OFFICER can create events
    if (currentUser.role === 'ADMIN' || currentUser.role === 'OFFICER') {
        createEventBtn.classList.remove('hidden');
    } else {
        createEventBtn.classList.add('hidden');
    }

    // In a real app, fetch from Supabase
    const mockEvents = [
        { id: '1', title: 'Annual Sports Fest', date: '2026-05-20', status: 'UPCOMING' },
        { id: '2', title: 'Tech Symposium', date: '2026-04-15', status: 'UPCOMING' },
        { id: '3', title: 'Cultural Night', date: '2026-03-10', status: 'COMPLETED' },
    ];
    
    grid.innerHTML = mockEvents.map(event => `
        <div class="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 hover:shadow-md transition-all group relative">
            <div class="flex justify-between items-start mb-6">
                <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="text-[10px] font-bold px-3 py-1 rounded-full ${event.status === 'UPCOMING' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'} uppercase tracking-widest">${event.status}</span>
                    ${(currentUser.role === 'ADMIN' || currentUser.role === 'OFFICER') ? `
                        <button onclick="deleteEvent('${event.id}', '${event.title}')" class="p-1.5 text-slate-300 hover:text-red-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    ` : ''}
                </div>
            </div>
            <h4 class="text-xl font-bold mb-2">${event.title}</h4>
            <p class="text-slate-500 text-sm mb-6">${new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            <button class="w-full py-3 rounded-xl border border-slate-100 font-bold text-sm hover:bg-slate-50 transition-colors">View Details</button>
        </div>
    `).join('');

    window.deleteEvent = (id, title) => {
        showConfirmModal(
            'Delete Event',
            `Are you sure you want to delete the event "${title}"? This action cannot be undone.`,
            () => {
                console.log(`Deleting event ${id}`);
                alert(`Event "${title}" deleted successfully.`);
                renderEvents(currentUser);
            }
        );
    };
}
