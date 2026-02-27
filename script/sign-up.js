
        document.addEventListener('DOMContentLoaded', function() {
            
            const roleButtons = document.querySelectorAll('.role-btn');
            const roleInput = document.getElementById('selectedRole');

            // 1. Make the buttons switch when clicked manually
            roleButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remove 'active' from all buttons
                    roleButtons.forEach(btn => btn.classList.remove('active'));
                    
                    // Add 'active' to the specific button clicked
                    this.classList.add('active');
                    
                    // Update the hidden input
                    roleInput.value = this.getAttribute('data-role');
                });
            });

            // 2. Check the URL for "?role=vendor" or "?role=admin"
            const urlParams = new URLSearchParams(window.location.search);
            const roleFromUrl = urlParams.get('role'); // Gets 'vendor', 'admin', etc.

            // 3. Automatically click the matching button!
            if (roleFromUrl) {
                const targetButton = document.querySelector(`.role-btn[data-role="${roleFromUrl}"]`);
                if (targetButton) {
                    targetButton.click(); 
                }
            }
        });