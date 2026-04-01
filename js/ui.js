export const loginScreen = document.getElementById('login-screen');
export const appContainer = document.getElementById('app-container');
export const tabTitle = document.getElementById('tab-title');
export const navRbac = document.getElementById('nav-rbac');
export const navUsers = document.getElementById('nav-users');
export const navReceipts = document.getElementById('nav-receipts');
export const navAttendance = document.getElementById('nav-attendance');
export const navFinance = document.getElementById('nav-finance');
export const userNameDisplay = document.getElementById('user-name');
export const userRoleDisplay = document.getElementById('user-role');

// Modals
export const confirmModal = document.getElementById('confirm-modal');
export const confirmTitle = document.getElementById('confirm-title');
export const confirmMessage = document.getElementById('confirm-message');
export const confirmActionBtn = document.getElementById('confirm-action-btn');

export const orgDetailModal = document.getElementById('org-detail-modal');
export const modalOrgName = document.getElementById('modal-org-name');
export const modalOrgType = document.getElementById('modal-org-type');
export const modalOrgMembers = document.getElementById('modal-org-members');
export const modalOrgEvents = document.getElementById('modal-org-events');
export const modalDeleteOrgBtn = document.getElementById('modal-delete-org-btn');
export const modalEditOrgBtn = document.getElementById('modal-edit-org-btn');

export const orgFormModal = document.getElementById('org-form-modal');
export const orgFormTitle = document.getElementById('org-form-title');
export const orgForm = document.getElementById('org-form');
export const orgFormId = document.getElementById('org-form-id');
export const orgFormName = document.getElementById('org-form-name');
export const orgFormType = document.getElementById('org-form-type');
export const orgFormDescription = document.getElementById('org-form-description');

// Auth elements
export const authForm = document.getElementById('auth-form');
export const toggleAuthBtn = document.getElementById('toggle-auth');
export const signupFields = document.getElementById('signup-fields');
export const authSubmitBtn = document.getElementById('auth-submit-btn');

export function showLogin() {
    loginScreen.classList.remove('hidden');
    appContainer.classList.add('hidden');
}

export function showDashboard(user) {
    loginScreen.classList.add('hidden');
    appContainer.classList.remove('hidden');
    userNameDisplay.textContent = user.name;
    userRoleDisplay.textContent = user.role;
    
    // Reset all restricted navs
    const restrictedNavs = [navRbac, navUsers, navReceipts, navAttendance, navFinance];
    restrictedNavs.forEach(nav => nav?.classList.add('hidden'));

    // Show based on role
    if (user.role === 'SUPER-ADMIN') {
        navUsers?.classList.remove('hidden');
        navRbac?.classList.remove('hidden');
    } else if (user.role === 'ADMIN') {
        navReceipts?.classList.remove('hidden');
        navRbac?.classList.remove('hidden');
    } else if (user.role === 'STAFF (ATTENDANCE)') {
        navAttendance?.classList.remove('hidden');
    } else if (user.role === 'STAFF (FINANCE)') {
        navFinance?.classList.remove('hidden');
    }
}

export function switchTab(tabId, renderCallback) {
    // Update Sidebar UI
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('sidebar-item-active', 'bg-indigo-600', 'text-white');
        item.classList.add('text-slate-500', 'hover:bg-slate-50');
    });
    
    const activeNav = document.getElementById(`nav-${tabId}`);
    if (activeNav) {
        activeNav.classList.add('sidebar-item-active', 'bg-indigo-600', 'text-white');
        activeNav.classList.remove('text-slate-500', 'hover:bg-slate-50');
    }
    
    // Update Content Visibility
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    const activeTabContent = document.getElementById(`tab-${tabId}`);
    if (activeTabContent) {
        activeTabContent.classList.remove('hidden');
        tabTitle.textContent = tabId.charAt(0).toUpperCase() + tabId.slice(1);
    }

    if (renderCallback) renderCallback();
}

// Modal Helpers
export function showConfirmModal(title, message, onConfirm) {
    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    confirmModal.classList.remove('hidden');
    
    const newBtn = confirmActionBtn.cloneNode(true);
    confirmActionBtn.parentNode.replaceChild(newBtn, confirmActionBtn);
    newBtn.addEventListener('click', () => {
        onConfirm();
        hideConfirmModal();
    });
}

export function hideConfirmModal() {
    confirmModal.classList.add('hidden');
}

window.hideConfirmModal = hideConfirmModal;

export function showOrgDetailModal(org, currentUser) {
    modalOrgName.textContent = org.name;
    modalOrgType.textContent = org.type;
    
    // RBAC for Modal Actions
    if (currentUser.role === 'ADMIN' || currentUser.role === 'OFFICER') {
        modalEditOrgBtn.classList.remove('hidden');
        if (currentUser.role === 'ADMIN') {
            modalDeleteOrgBtn.classList.remove('hidden');
        } else {
            modalDeleteOrgBtn.classList.add('hidden');
        }
    } else {
        modalEditOrgBtn.classList.add('hidden');
        modalDeleteOrgBtn.classList.add('hidden');
    }

    // Mock Members and Events for the Org
    modalOrgMembers.innerHTML = `
        <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
            <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-xs">JD</div>
                <span class="text-sm font-semibold">John Doe</span>
            </div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">OFFICER</span>
        </div>
    `;

    modalOrgEvents.innerHTML = `
        <div class="p-4 border border-slate-100 rounded-2xl">
            <h4 class="text-sm font-bold">Annual Sports Fest</h4>
            <p class="text-[10px] text-slate-400 font-medium">May 20, 2026</p>
        </div>
    `;

    orgDetailModal.classList.remove('hidden');
}

export function hideOrgDetailModal() {
    orgDetailModal.classList.add('hidden');
}

window.hideOrgDetailModal = hideOrgDetailModal;

export function showOrgFormModal(org = null) {
    if (org) {
        orgFormTitle.textContent = 'Edit Organization';
        orgFormId.value = org.id;
        orgFormName.value = org.name;
        orgFormType.value = org.type;
        orgFormDescription.value = org.description || '';
    } else {
        orgFormTitle.textContent = 'Register Organization';
        orgFormId.value = '';
        orgFormName.value = '';
        orgFormType.value = 'Academic';
        orgFormDescription.value = '';
    }
    orgFormModal.classList.remove('hidden');
}

export function hideOrgFormModal() {
    orgFormModal.classList.add('hidden');
}

window.hideOrgFormModal = hideOrgFormModal;
