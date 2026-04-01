import { supabaseClient } from './js/supabase.js';
import { showLogin, showDashboard, switchTab, loginScreen, appContainer, authForm, toggleAuthBtn, signupFields, authSubmitBtn } from './js/ui.js';
import { renderDashboard } from './js/dashboard.js';
import { renderMembers } from './js/members.js';
import { renderEvents } from './js/events.js';
import { renderOrganizations } from './js/organizations.js';

// State Management
let currentUser = null;
let activeTab = 'dashboard';
let authMode = 'login';

// Initialize App
async function init() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (user) {
        const { data: profile } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        currentUser = {
            id: user.id,
            email: user.email,
            name: user.user_metadata.full_name || profile?.full_name || 'User',
            role: user.email === 'adminsystem@gmail.com' ? 'SUPER-ADMIN' : (profile?.role || 'MEMBER')
        };
        showDashboard(currentUser);
        switchTab('dashboard', renderDashboard);
    } else {
        showLogin();
    }
}

// User Management Mock Data & Render
function renderUsers() {
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) return;

    const mockUsers = [
        { name: 'Admin System', email: 'adminsystem@gmail.com', role: 'SUPER-ADMIN' },
        { name: 'John Doe', email: 'john@example.com', role: 'ADMIN' },
        { name: 'Jane Smith', email: 'jane@example.com', role: 'STAFF (ATTENDANCE)' },
        { name: 'Bob Wilson', email: 'bob@example.com', role: 'STAFF (FINANCE)' },
        { name: 'Alice Brown', email: 'alice@example.com', role: 'MEMBER' }
    ];

    tableBody.innerHTML = mockUsers.map(user => `
        <tr class="hover:bg-slate-50 transition-all">
            <td class="px-8 py-5">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-xs">
                        ${user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span class="text-sm font-semibold text-slate-700">${user.name}</span>
                </div>
            </td>
            <td class="px-8 py-5 text-sm text-slate-500">${user.email}</td>
            <td class="px-8 py-5">
                <span class="text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-widest border ${
                    user.role === 'SUPER-ADMIN' ? 'border-indigo-100 text-indigo-600 bg-indigo-50' :
                    user.role === 'ADMIN' ? 'border-emerald-100 text-emerald-600 bg-emerald-50' :
                    'border-slate-100 text-slate-500 bg-slate-50'
                }">${user.role}</span>
            </td>
            <td class="px-8 py-5 text-right">
                <button class="text-slate-400 hover:text-indigo-600 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                </button>
            </td>
        </tr>
    `).join('');
}

// Auth Functions
toggleAuthBtn.addEventListener('click', () => {
    authMode = authMode === 'login' ? 'signup' : 'login';
    signupFields.classList.toggle('hidden');
    authSubmitBtn.textContent = authMode === 'login' ? 'Sign In' : 'Create Account';
    toggleAuthBtn.textContent = authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in";
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const fullName = document.getElementById('full-name').value;

    try {
        if (authMode === 'signup') {
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: { data: { full_name: fullName } }
            });
            if (error) throw error;
            
            if (data.user) {
                await supabaseClient.from('profiles').insert({
                    id: data.user.id,
                    full_name: fullName,
                    role: email === 'adminsystem@gmail.com' ? 'SUPER-ADMIN' : 'MEMBER'
                });
            }
            alert('Signup successful! Check your email.');
        } else {
            const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
            if (error) throw error;
            init();
        }
    } catch (error) {
        alert(error.message);
    }
});

window.logout = async function() {
    await supabaseClient.auth.signOut();
    currentUser = null;
    showLogin();
};

window.switchTab = function(tabId) {
    activeTab = tabId;
    let renderCallback = null;
    
    if (tabId === 'dashboard') renderCallback = renderDashboard;
    if (tabId === 'organizations') renderCallback = () => renderOrganizations(currentUser);
    if (tabId === 'members') renderCallback = () => renderMembers(currentUser);
    if (tabId === 'events') renderCallback = () => renderEvents(currentUser);
    if (tabId === 'users') renderCallback = renderUsers;
    
    switchTab(tabId, renderCallback);
};

init();
