/**
 * Muse User Testing Helper
 * Paste this in browser console (F12) to switch between test users
 */

// Switch to a specific test user
function switchUser(userName) {
    const userId = `test_user_${userName.toLowerCase().replace(/\s+/g, '_')}`;
    localStorage.setItem('muse_user_id', userId);
    sessionStorage.clear(); // Clear thread to start fresh conversation
    console.log(`✅ Switched to user: ${userName} (${userId})`);
    console.log('🔄 Refresh the page to apply changes');
    return userId;
}

// Create a new random user
function newUser() {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('muse_user_id', userId);
    sessionStorage.clear();
    console.log(`✅ Created new user: ${userId}`);
    console.log('🔄 Refresh the page to apply changes');
    return userId;
}

// Check current user
function whoAmI() {
    const userId = localStorage.getItem('muse_user_id');
    const threadId = sessionStorage.getItem('muse_thread_id');
    console.log('👤 Current user:', userId || 'Not set');
    console.log('💬 Current thread:', threadId || 'Not set');
    return { userId, threadId };
}

// Reset to demo user
function resetUser() {
    localStorage.removeItem('muse_user_id');
    sessionStorage.clear();
    console.log('🗑️  Cleared user data');
    console.log('🔄 Refresh to create a new user');
}

console.log('🎨 Muse User Testing Helpers Loaded!');
console.log('');
console.log('Available commands:');
console.log('  switchUser("Alice")  - Switch to test user "Alice"');
console.log('  switchUser("Bob")    - Switch to test user "Bob"');
console.log('  newUser()            - Create a new random user');
console.log('  whoAmI()             - Check current user');
console.log('  resetUser()          - Clear user data');
