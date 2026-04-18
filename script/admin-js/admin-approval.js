document.addEventListener('DOMContentLoaded', () => {
    // Mock Data
    const approvalItems = [
        { id: "APP-M-01", type: "menu", vendor: "The Sweet Spot", title: "Strawberry Cake", desc: "A fresh strawberry cake slice with cream.", img: "../../images/vendor1.jpg", status: "pending" },
        { id: "APP-M-02", type: "menu", vendor: "Burger Joint", title: "Double Cheese Burger", desc: "Double patty burger with extra cheddar cheese.", img: "../../images/vendor2.jpg", status: "pending" },
        { id: "APP-P-01", type: "poster", vendor: "Campus Grill", title: "Back to School Promo", desc: "10% off all grilled items starting next week.", img: "../../images/poster1.jpg", status: "pending" },
        { id: "APP-M-03", type: "menu", vendor: "Healthy Bites", title: "Caesar Salad", desc: "Fresh romaine lettuce, croutons, parmesan cheese, and Caesar dressing.", img: "https://via.placeholder.com/400x300?text=Caesar+Salad", status: "approved" },
        { id: "APP-P-02", type: "poster", vendor: "Pizza Corner", title: "New Pizza Flavors", desc: "Check out our premium pepperoni and supreme flavors.", img: "https://via.placeholder.com/400x300?text=Pizza+Poster", status: "approved" }
    ];

    let currentTab = "menus-pending"; // menus-pending, posters-pending, approved

    // Selectors
    const approvalTabs = document.getElementById("approvalTabs");
    const approvalList = document.getElementById("approvalList");
    const emptyState = document.getElementById("emptyState");

    // Header count selectors
    const counts = {
        menus: document.getElementById("count-menus"),
        posters: document.getElementById("count-posters"),
        approved: document.getElementById("count-approved")
    };

    function updateStats() {
        let menusCount = 0, postersCount = 0, approvedCount = 0;
        
        approvalItems.forEach(item => {
            if(item.status === 'pending' && item.type === 'menu') menusCount++;
            if(item.status === 'pending' && item.type === 'poster') postersCount++;
            if(item.status === 'approved') approvedCount++;
        });

        if(counts.menus) counts.menus.textContent = menusCount;
        if(counts.posters) counts.posters.textContent = postersCount;
        if(counts.approved) counts.approved.textContent = approvedCount;
    }

    function renderList() {
        let filtered = [];
        
        if (currentTab === 'menus-pending') {
            filtered = approvalItems.filter(i => i.status === 'pending' && i.type === 'menu');
        } else if (currentTab === 'posters-pending') {
            filtered = approvalItems.filter(i => i.status === 'pending' && i.type === 'poster');
        } else if (currentTab === 'approved') {
            filtered = approvalItems.filter(i => i.status === 'approved');
        }
        
        approvalList.innerHTML = "";

        if (filtered.length === 0) {
            emptyState.style.display = "block";
            return;
        }

        emptyState.style.display = "none";

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = "approval-card";
            
            const typeLabel = item.type === 'menu' ? 'Menu Item' : 'Promo Poster';
            
            let footerHtml = '';
            if (item.status === 'pending') {
                footerHtml = `
                    <div class="ac-footer">
                        <button class="btn-appr decline" data-id="${item.id}" data-action="decline"><i class="fa-solid fa-xmark"></i> Decline</button>
                        <button class="btn-appr approve" data-id="${item.id}" data-action="approve"><i class="fa-solid fa-check"></i> Approve</button>
                    </div>
                `;
            } else {
                footerHtml = `
                    <div class="ac-footer">
                        <button class="btn-appr view-only" disabled><i class="fa-solid fa-circle-check"></i> Approved</button>
                    </div>
                `;
            }

            // Using placeholder for missing images based on type to avoid broken img icons
            const imgSrc = item.img ? item.img : `https://via.placeholder.com/400x300?text=${item.title.replace(/ /g, '+')}`;

            card.innerHTML = `
                <div class="ac-header">
                    <div class="ac-vendor"><i class="fa-solid fa-store" style="color: #64748b;"></i> ${item.vendor}</div>
                    <span class="ac-type ${item.type}">${typeLabel}</span>
                </div>
                <img src="${imgSrc}" class="ac-preview" alt="preview" onerror="this.src='https://via.placeholder.com/400x300?text=Preview'"/>
                <div class="ac-body">
                    <h3 class="ac-title">${item.title}</h3>
                    <p class="ac-desc">${item.desc}</p>
                </div>
                ${footerHtml}
            `;
            approvalList.appendChild(card);
        });

        // reattach listeners
        document.querySelectorAll('.btn-appr').forEach(btn => {
            if(btn.disabled) return;
            
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const action = this.getAttribute('data-action');
                const targetItem = approvalItems.find(i => i.id === id);
                
                if (targetItem) {
                    if (action === 'approve') {
                        if(confirm(`Approve this ${targetItem.type}?`)) {
                            targetItem.status = 'approved';
                            updateStats();
                            renderList();
                        }
                    } else if (action === 'decline') {
                        if(confirm(`Decline and reject this ${targetItem.type}?`)) {
                            targetItem.status = 'declined';
                            updateStats();
                            renderList();
                        }
                    }
                }
            });
        });
    }

    if (approvalTabs) {
        approvalTabs.addEventListener('click', function(e) {
            const tab = e.target.closest('.tab');
            if(!tab) return;
            
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            currentTab = tab.getAttribute('data-tab');
            renderList();
        });
    }

    // Init
    updateStats();
    renderList();
});
