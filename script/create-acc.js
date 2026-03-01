document.addEventListener('DOMContentLoaded', function() {
            
            const roleButtons = document.querySelectorAll('.role-btn');
            const roleInput = document.getElementById('selectedRole');
            const signupForm = document.querySelector('form'); // Grabs your sign-up form

            // 1. Make the buttons switch when clicked
            roleButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remove 'active' highlight from all buttons
                    roleButtons.forEach(btn => btn.classList.remove('active'));
                    
                    // Add 'active' highlight to the clicked button
                    this.classList.add('active');
                    
                    // Update the hidden input with the newly selected role
                    if(roleInput) {
                        roleInput.value = this.getAttribute('data-role');
                    }
                });
            });

            // 2. Handle the Sign Up Button Click & Redirect
            if(signupForm) {
                signupForm.addEventListener('submit', function(event) {
                    // Stop the form from reloading the page
                    event.preventDefault(); 

                    // Get the selected role from our hidden input
                    const selectedRole = roleInput.value;

                    // Redirect to the correct dashboard!
                    if (selectedRole === 'student') {
                        window.location.href = 'student-dashboard.html';
                    } else if (selectedRole === 'vendor') {
                        window.location.href = 'vendor-dashboard.html';
                    } else if (selectedRole === 'admin') {
                        window.location.href = 'admin-dashboard.html';
                    }
                });
            }

        });