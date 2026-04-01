import { showConfirmModal } from './ui.js';

export async function renderMembers(currentUser) {
    const tableBody = document.getElementById('members-table-body');
    const addMemberBtn = document.getElementById('add-member-btn');
    const searchInput = document.getElementById('member-search');
    const roleFilter = document.getElementById('member-filter-role');
    const statusFilter = document.getElementById('member-filter-status');
    
    // RBAC: Only ADMIN and OFFICER can add members
    if (currentUser.role === 'ADMIN' || currentUser.role === 'OFFICER') {
        addMemberBtn.classList.remove('hidden');
    } else {
        addMemberBtn.classList.add('hidden');
    }

    // In a real app, fetch from Supabase
    const mockMembers = [
        { id: '1', name: 'John Doe', role: 'OFFICER', status: 'ACTIVE' },
        { id: '2', name: 'Jane Smith', role: 'MEMBER', status: 'ACTIVE' },
        { id: '3', name: 'Bob Wilson', role: 'MEMBER', status: 'INACTIVE' },
        { id: '4', name: 'Alice Brown', role: 'ADMIN', status: 'ACTIVE' },
    ];

    const render = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedRole = roleFilter.value;
        const selectedStatus = statusFilter.value;

        const filtered = mockMembers.filter(member => {
            const matchesSearch = member.name.toLowerCase().includes(searchTerm);
            const matchesRole = selectedRole === 'ALL' || member.role === selectedRole;
            const matchesStatus = selectedStatus === 'ALL' || member.status === selectedStatus;
            return matchesSearch && matchesRole && matchesStatus;
        });

        tableBody.innerHTML = filtered.map(member => `
            <tr class="hover:bg-slate-50/50 transition-colors">
                <td class="px-8 py-5 font-bold text-slate-900">${member.name}</td>
                <td class="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">${member.role}</td>
                <td class="px-8 py-5">
                    <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${member.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}">${member.status}</span>
                </td>
                <td class="px-8 py-5 text-right space-x-3">
                    <button class="text-indigo-600 hover:underline text-sm font-bold">Edit</button>
                    ${(currentUser.role === 'ADMIN' || currentUser.role === 'OFFICER') ? `
                        <button onclick="deleteMember('${member.id}', '${member.name}')" class="text-red-600 hover:underline text-sm font-bold">Delete</button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    };

    // Add event listeners for search and filter
    searchInput.oninput = render;
    roleFilter.onchange = render;
    statusFilter.onchange = render;

    window.deleteMember = (id, name) => {
        showConfirmModal(
            'Delete Member',
            `Are you sure you want to delete ${name}? This action will remove them from the organization permanently.`,
            () => {
                console.log(`Deleting member ${id}`);
                // In a real app, call Supabase delete
                alert(`${name} deleted successfully.`);
                renderMembers(currentUser);
            }
        );
    };

    render();
}
