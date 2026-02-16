// Wait for DOM to be fully loaded before running
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded fired');
  
  // Get accounts data from data attribute
  const container = document.querySelector('.account-management-container');
  
  if (!container) {
    console.error('Container not found');
    return;
  }
  
  console.log('Container found:', container);
  console.log('Data attribute:', container.dataset.accounts);

  const accountsData = JSON.parse(container.dataset.accounts || '[]');
  console.log('Parsed accounts data:', accountsData);
  
  const selectElement = document.getElementById('account_select');
  const detailsDiv = document.getElementById('account-details');

  if (!selectElement || !detailsDiv) {
    console.error('Required elements not found - select:', selectElement, 'details:', detailsDiv);
    return;
  }
  
  console.log('All elements found');

  selectElement.addEventListener('change', function() {
    console.log('Change event fired, value:', this.value);
    
    const accountId = parseInt(this.value);
    console.log('Parsed account ID:', accountId, 'isNaN:', isNaN(accountId));
    
    if (!accountId || isNaN(accountId)) {
      console.log('Hiding details - no valid ID');
      detailsDiv.style.display = 'none';
      return;
    }

    console.log('Looking for account with ID:', accountId);
    const account = accountsData.find(a => {
      console.log('Comparing', parseInt(a.account_id), 'to', accountId);
      return parseInt(a.account_id) === accountId;
    });
    
    console.log('Found account:', account);
    
    if (account) {
      console.log('Selected account:', account);
      
      // Populate display information
      document.getElementById('display_firstname').textContent = account.account_firstname || '';
      document.getElementById('display_lastname').textContent = account.account_lastname || '';
      document.getElementById('display_email').textContent = account.account_email || '';
      document.getElementById('display_type').textContent = account.account_type || '';

      // Populate form fields
      document.getElementById('account_Id').value = account.account_id;
      document.getElementById('password_account_Id').value = account.account_id;
      document.getElementById('account_Email').value = account.account_email || '';
      document.getElementById('account_FirstName').value = account.account_firstname || '';
      document.getElementById('account_LastName').value = account.account_lastname || '';

      // Show details section
      console.log('Setting display to block');
      detailsDiv.style.display = 'block';
      console.log('Display value after setting:', detailsDiv.style.display);
    } else {
      console.warn('Account not found:', accountId);
      detailsDiv.style.display = 'none';
    }
  });
});