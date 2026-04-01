import { showOrgDetailModal, showConfirmModal, showOrgFormModal, hideOrgFormModal, orgForm, hideOrgDetailModal, modalEditOrgBtn } from './ui.js';

export async function renderOrganizations(currentUser) {
    const grid = document.getElementById('orgs-grid');
    const createOrgBtn = document.getElementById('create-org-btn');
    
    // RBAC: ADMIN and OFFICER can register new organizations
    if (currentUser.role === 'SUPER-ADMIN') {
        createOrgBtn.classList.remove('hidden');
        createOrgBtn.onclick = () => showOrgFormModal();
    } else {
        createOrgBtn.classList.add('hidden');
    }

    // In a real app, fetch from Supabase
    const mockOrgs = [
        { id: '1', name: 'Student Council', type: 'Academic', members: 45, status: 'ACTIVE', description: 'The primary student governing body.' },
        { id: '2', name: 'Tech Club', type: 'Technical', members: 120, status: 'ACTIVE', description: 'Exploring the latest in technology and coding.' },
        { id: '3', name: 'Arts & Culture', type: 'Cultural', members: 85, status: 'ACTIVE', description: 'Promoting artistic expression on campus.' },
        { id: '4', name: 'Sports Association', type: 'Athletic', members: 200, status: 'ACTIVE', description: 'Organizing competitive and recreational sports.' },
    ];
    
    grid.innerHTML = mockOrgs.map(org => `
        <div class="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default">
            <div class="flex justify-between items-start mb-6">
                <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="text-[10px] font-bold px-3 py-1 rounded-full bg-green-50 text-green-600 uppercase tracking-widest">${org.status}</span>
                    ${currentUser.role === 'ADMIN' ? `
                        <button onclick="deleteOrg('${org.id}', '${org.name}')" class="p-1.5 text-slate-300 hover:text-red-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    ` : ''}
                </div>
            </div>
            <h4 class="text-xl font-bold mb-1 group-hover:text-indigo-600 transition-colors">${org.name}</h4>
            <p class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-6">${org.type}</p>
            <div class="flex items-center justify-between py-4 border-t border-slate-50">
                <div class="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <span class="text-sm font-bold text-slate-600">${org.members} Members</span>
                </div>
                <button onclick="handleManageOrg('${org.id}')" class="bg-slate-50 text-indigo-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all">Manage</button>
            </div>
        </div>
    `).join('');

    window.handleManageOrg = (orgId) => {
        const org = mockOrgs.find(o => o.id === orgId);
        if (org) {
            showOrgDetailModal(org, currentUser);
            
            // Set up edit button in modal
            modalEditOrgBtn.onclick = () => {
                hideOrgDetailModal();
                showOrgFormModal(org);
            };
        }
    };

    window.deleteOrg = (id, name) => {
        showConfirmModal(
            'Delete Organization',
            `Are you sure you want to delete the ${name}? All associated data, including members and events, will be permanently removed.`,
            () => {
                console.log(`Deleting organization ${id}`);
                alert(`${name} deleted successfully.`);
                renderOrganizations(currentUser);
            }
        );
    };

    // Handle Form Submission
    orgForm.onsubmit = async (e) => {
        e.preventDefault();
        const formData = {
            id: document.getElementById('org-form-id').value,
            name: document.getElementById('org-form-name').value,
            type: document.getElementById('org-form-type').value,
            description: document.getElementById('org-form-description').value
        };

        console.log('Saving organization:', formData);
        // In a real app, call Supabase upsert
        alert(`Organization ${formData.id ? 'updated' : 'registered'} successfully!`);
        hideOrgFormModal();
        renderOrganizations(currentUser);
    };
}
