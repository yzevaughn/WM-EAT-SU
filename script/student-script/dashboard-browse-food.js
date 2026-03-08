// Filter buttons functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const foodCards = document.querySelectorAll('.food-card');

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const selectedCategory = button.getAttribute('data-category');
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter food cards
        foodCards.forEach(card => {
          const cardCategories = card.getAttribute('data-category').split(' ');
          
          if (selectedCategory === 'all' || cardCategories.includes(selectedCategory)) {
            card.style.display = 'block';
            // Trigger a reflow to ensure animation works
            card.offsetHeight;
            card.classList.add('visible');
          } else {
            card.classList.remove('visible');
            card.style.display = 'none';
          }
        });
      });
    });

    // Initialize with 'all' category visible
    foodCards.forEach(card => {
      card.classList.add('visible');
    });