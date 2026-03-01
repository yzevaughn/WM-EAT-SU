

        document.addEventListener('DOMContentLoaded', function() {
            
            const roleButtons = document.querySelectorAll('.role-btn');
            const roleInput = document.getElementById('selectedRole');
            const loginForm = document.querySelector('form'); // Grab the form

            // 1. Make the buttons switch when clicked manually
            roleButtons.forEach(button => {
                button.addEventListener('click', function() {
                    roleButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    roleInput.value = this.getAttribute('data-role');
                });
            });

            // 2. Check the URL for "?role=vendor" or "?role=admin"
            const urlParams = new URLSearchParams(window.location.search);
            const roleFromUrl = urlParams.get('role'); 

            // 3. Automatically click the matching button!
            if (roleFromUrl) {
                const targetButton = document.querySelector(`.role-btn[data-role="${roleFromUrl}"]`);
                if (targetButton) {
                    targetButton.click(); 
                }
            }

            // 4. NEW: Handle the Login Button Click
            loginForm.addEventListener('submit', function(event) {
                // Stop the form from submitting the traditional way (which reloads the page)
                event.preventDefault(); 

                // Get the current value from the hidden input
                const selectedRole = roleInput.value;

                // Redirect to the correct dashboard based on the role
                if (selectedRole === 'student') {
                    window.location.href = 'student/student-dashboard.html';
                } else if (selectedRole === 'vendor') {
                    window.location.href = 'vendor-dashboard.html';
                } else if (selectedRole === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                }
            });

        });
