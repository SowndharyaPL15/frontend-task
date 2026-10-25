/* ========================================
   CAMPUSFIND - CAMPUS LOST & FOUND PORTAL
   Vanilla JavaScript DOM Manipulation & Logic
======================================== */

// Wrap in IIFE or run after DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {

    /* ========================================
       1. SELECT HTML ELEMENTS
    ======================================== */

    const reportForm = document.getElementById("report-form");
    const itemNameInput = document.getElementById("item-name");
    const itemTypeInput = document.getElementById("item-type");
    const itemCategoryInput = document.getElementById("item-category");
    const itemLocationInput = document.getElementById("item-location");
    const itemDescriptionInput = document.getElementById("item-description");

    const itemsGrid = document.getElementById("items-grid");
    const searchInput = document.getElementById("search-input");
    const filterButtons = document.querySelectorAll(".filter-button");

    const emptyState = document.getElementById("empty-state");
    const resultsCount = document.getElementById("results-count");
    const formMessage = document.getElementById("form-message");

    const reportPanel = document.getElementById("report-panel");
    const openFormButton = document.getElementById("open-form-button");
    const closeFormButton = document.getElementById("close-form-button");
    const headerReportLink = document.querySelector(".header-link");

    const totalCountEl = document.getElementById("total-count");
    const lostCountEl = document.getElementById("lost-count");
    const foundCountEl = document.getElementById("found-count");
    const returnedCountEl = document.getElementById("returned-count");


    /* ========================================
       2. INITIAL SAMPLE DATA
    ======================================== */

    const sampleItems = [
        {
            id: 1,
            name: "Black Water Bottle",
            type: "Lost",
            category: "Personal Items",
            location: "Library, Block A",
            description: "A black reusable water bottle with a silver cap and matte finish.",
            date: "2026-10-24",
            returned: false
        },
        {
            id: 2,
            name: "Student ID Card",
            type: "Found",
            category: "ID & Cards",
            location: "Cafeteria",
            description: "A student ID card found near the main cafeteria cashier counter.",
            date: "2026-10-24",
            returned: false
        },
        {
            id: 3,
            name: "Blue Notebook",
            type: "Lost",
            category: "Books & Stationery",
            location: "Computer Science Block",
            description: "A spiral blue notebook containing semester lecture notes.",
            date: "2026-10-23",
            returned: false
        },
        {
            id: 4,
            name: "Wireless Earbuds Case",
            type: "Found",
            category: "Electronics",
            location: "Seminar Hall",
            description: "A small white wireless earbuds charging case found on the third row.",
            date: "2026-10-22",
            returned: false
        }
    ];


    /* ========================================
       3. LOAD AND SAVE REPORTS (LOCALSTORAGE)
    ======================================== */

    const STORAGE_KEY = "campusFindItems_v1";

    function loadItems() {
        try {
            const savedItems = localStorage.getItem(STORAGE_KEY);

            if (savedItems !== null) {
                const parsedItems = JSON.parse(savedItems);

                if (Array.isArray(parsedItems) && parsedItems.length > 0) {
                    return parsedItems;
                }
            }
        } catch (error) {
            console.error("Could not load saved reports from storage:", error);
        }

        return sampleItems.map(item => ({ ...item }));
    }

    let items = loadItems();

    function saveItems() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
            return true;
        } catch (error) {
            console.error("Could not save reports to storage:", error);
            return false;
        }
    }


    /* ========================================
       4. FORMAT DATES
    ======================================== */

    function formatDate(dateString) {
        if (!dateString) return "Date unavailable";
        const date = new Date(dateString + "T00:00:00");

        if (Number.isNaN(date.getTime())) {
            return "Date unavailable";
        }

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }


    /* ========================================
       5. CREATE AN ITEM CARD ELEMENT
    ======================================== */

    function createItemCard(item) {
        const card = document.createElement("article");
        card.className = "item-card";

        const status = item.returned ? "Returned" : item.type;

        // Card Header (Title & Badge)
        const cardTop = document.createElement("div");
        cardTop.className = "item-card-top";

        const titleGroup = document.createElement("div");

        const title = document.createElement("h3");
        title.textContent = item.name;

        const category = document.createElement("p");
        category.className = "item-category";
        category.textContent = item.category;

        titleGroup.append(title, category);

        const badge = document.createElement("span");
        badge.className = `status-badge status-${status.toLowerCase()}`;
        badge.textContent = status;

        cardTop.append(titleGroup, badge);

        // Location
        const location = document.createElement("p");
        location.className = "item-location";
        location.textContent = `📍 Location: ${item.location}`;

        // Description
        const description = document.createElement("p");
        description.className = "item-description";
        description.textContent = item.description || "No additional description provided.";

        // Date
        const date = document.createElement("p");
        date.className = "item-date";
        date.textContent = `Reported on ${formatDate(item.date)}`;

        // Actions Bar
        const actions = document.createElement("div");
        actions.className = "item-card-actions";

        if (!item.returned) {
            const returnButton = document.createElement("button");
            returnButton.type = "button";
            returnButton.className = "item-action-button";
            returnButton.textContent = "Mark Returned";
            returnButton.setAttribute("aria-label", `Mark "${item.name}" as returned`);
            returnButton.addEventListener("click", () => {
                markAsReturned(item.id);
            });

            actions.appendChild(returnButton);
        } else {
            const returnedLabel = document.createElement("span");
            returnedLabel.className = "item-action-status";
            returnedLabel.textContent = "✓ Returned to owner";
            actions.appendChild(returnedLabel);
        }

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "item-action-button delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", `Delete report for "${item.name}"`);
        deleteButton.addEventListener("click", () => {
            deleteItem(item.id);
        });

        actions.appendChild(deleteButton);

        card.append(cardTop, location, description, date, actions);

        return card;
    }


    /* ========================================
       6. DISPLAY REPORTS & SEARCH / FILTER
    ======================================== */

    let activeFilter = "All";

    function displayItems() {
        const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";

        const filteredItems = items.filter(item => {
            const status = item.returned ? "Returned" : item.type;

            const matchesFilter =
                activeFilter === "All" || status === activeFilter;

            const searchableText = [
                item.name,
                item.category,
                item.location,
                item.description,
                item.type,
                status
            ].join(" ").toLowerCase();

            const matchesSearch = !searchTerm || searchableText.includes(searchTerm);

            return matchesFilter && matchesSearch;
        });

        if (itemsGrid) {
            itemsGrid.replaceChildren();

            filteredItems.forEach(item => {
                itemsGrid.appendChild(createItemCard(item));
            });
        }

        if (emptyState) {
            emptyState.hidden = filteredItems.length > 0;
        }

        if (resultsCount) {
            resultsCount.textContent =
                `${filteredItems.length} ${filteredItems.length === 1 ? "item" : "items"}`;
        }

        updateStatistics();
    }


    /* ========================================
       7. UPDATE STATISTICS
    ======================================== */

    function updateStatistics() {
        const totalCount = items.length;

        const lostCount = items.filter(item =>
            item.type === "Lost" && !item.returned
        ).length;

        const foundCount = items.filter(item =>
            item.type === "Found" && !item.returned
        ).length;

        const returnedCount = items.filter(item => item.returned).length;

        if (totalCountEl) totalCountEl.textContent = totalCount;
        if (lostCountEl) lostCountEl.textContent = lostCount;
        if (foundCountEl) foundCountEl.textContent = foundCount;
        if (returnedCountEl) returnedCountEl.textContent = returnedCount;
    }


    /* ========================================
       8. SUBMIT A NEW REPORT
    ======================================== */

    let messageTimeout = null;

    function showFormMessage(message, type) {
        if (!formMessage) return;
        if (messageTimeout) clearTimeout(messageTimeout);

        formMessage.textContent = message;
        formMessage.className = `form-message show ${type}`;

        messageTimeout = setTimeout(() => {
            formMessage.className = "form-message";
            formMessage.textContent = "";
        }, 4000);
    }

    if (reportForm) {
        reportForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = itemNameInput ? itemNameInput.value.trim() : "";
            const type = itemTypeInput ? itemTypeInput.value : "";
            const category = itemCategoryInput ? itemCategoryInput.value : "";
            const location = itemLocationInput ? itemLocationInput.value.trim() : "";
            const description = itemDescriptionInput ? itemDescriptionInput.value.trim() : "";

            if (!name || !type || !category || !location) {
                showFormMessage("Please fill in all required fields.", "error");
                return;
            }

            const today = new Date().toISOString().split("T")[0];

            const newItem = {
                id: Date.now(),
                name,
                type,
                category,
                location,
                description: description || "No additional description provided.",
                date: today,
                returned: false
            };

            items.unshift(newItem);
            saveItems();
            displayItems();

            reportForm.reset();
            showFormMessage(`Successfully reported ${type.toLowerCase()} item: "${name}"!`, "success");

            // Scroll to the newly added item
            const itemsSection = document.getElementById("items-section");
            if (itemsSection) {
                itemsSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    }


    /* ========================================
       9. MARK ITEM AS RETURNED
    ======================================== */

    function markAsReturned(id) {
        const item = items.find(it => it.id === id);
        if (item) {
            item.returned = true;
            saveItems();
            displayItems();
        }
    }


    /* ========================================
       10. DELETE REPORT
    ======================================== */

    function deleteItem(id) {
        const item = items.find(it => it.id === id);
        const name = item ? `"${item.name}"` : "this report";

        if (confirm(`Are you sure you want to remove the report for ${name}?`)) {
            items = items.filter(it => it.id !== id);
            saveItems();
            displayItems();
        }
    }


    /* ========================================
       11. FILTER BUTTON HANDLERS
    ======================================== */

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => {
                btn.classList.remove("active");
                btn.setAttribute("aria-pressed", "false");
            });

            button.classList.add("active");
            button.setAttribute("aria-pressed", "true");

            activeFilter = button.dataset.filter || "All";
            displayItems();
        });
    });


    /* ========================================
       12. SEARCH INPUT HANDLER
    ======================================== */

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            displayItems();
        });
    }


    /* ========================================
       13. RESPONSIVE MOBILE FORM TOGGLING
    ======================================== */

    if (openFormButton && reportPanel) {
        openFormButton.addEventListener("click", () => {
            reportPanel.classList.remove("form-collapsed");
            if (itemNameInput) itemNameInput.focus();
        });
    }

    if (closeFormButton && reportPanel) {
        closeFormButton.addEventListener("click", () => {
            reportPanel.classList.add("form-collapsed");
        });
    }

    if (headerReportLink && reportPanel) {
        headerReportLink.addEventListener("click", () => {
            if (reportPanel.classList.contains("form-collapsed")) {
                reportPanel.classList.remove("form-collapsed");
            }
            setTimeout(() => {
                if (itemNameInput) itemNameInput.focus();
            }, 300);
        });
    }

    function handleResponsiveForm() {
        if (!reportPanel) return;

        if (window.innerWidth <= 720) {
            reportPanel.classList.add("form-collapsed");
        } else {
            reportPanel.classList.remove("form-collapsed");
        }
    }

    window.addEventListener("resize", handleResponsiveForm);
    handleResponsiveForm();


    /* ========================================
       14. INITIAL DISPLAY CALL
    ======================================== */

    displayItems();

});