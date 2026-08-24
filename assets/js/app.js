/* =========================================================
   TICKETHUB - FE-04
   Ticket Creation & Management
   ========================================================= */


/* =========================================================
   DEFAULT TICKETS
   ========================================================= */

const defaultTickets = [

    {
        id: "FE-03",
        title: "Ticket Dashboard View",
        desc: "Build dashboard UI and ticket management",
        status: "Code Review",
        priority: "High",
        assignee: "TA",
        due: "Aug 22, 2026",
        category: "Frontend"
    },

    {
        id: "FE-02",
        title: "Mocking & API Contracts",
        desc: "Define frontend API mock responses",
        status: "In Progress",
        priority: "High",
        assignee: "MA",
        due: "Aug 21, 2026",
        category: "Frontend"
    },

    {
        id: "FE-01",
        title: "Repo Setup & Architecture",
        desc: "Initial repository and architecture setup",
        status: "Completed",
        priority: "Medium",
        assignee: "AN",
        due: "Aug 20, 2026",
        category: "Architecture"
    },

    {
        id: "BE-04",
        title: "Authentication API",
        desc: "Login and access control endpoints",
        status: "In Progress",
        priority: "High",
        assignee: "SA",
        due: "Aug 24, 2026",
        category: "Backend"
    },

    {
        id: "UI-07",
        title: "Settings Screen",
        desc: "Create user settings interface",
        status: "Open",
        priority: "Low",
        assignee: "MK",
        due: "Aug 26, 2026",
        category: "UI/UX"
    }

];


/* =========================================================
   GET TICKETS
   ========================================================= */

function getTickets() {

    const savedTickets =
        localStorage.getItem("ticketHubTickets");

    if (savedTickets) {

        try {

            return JSON.parse(savedTickets);

        } catch (error) {

            console.error(
                "Unable to read saved tickets:",
                error
            );

            return [...defaultTickets];

        }

    }

    return [...defaultTickets];
}


/* =========================================================
   SAVE TICKETS
   ========================================================= */

function saveTickets(tickets) {

    localStorage.setItem(
        "ticketHubTickets",
        JSON.stringify(tickets)
    );

}


/* =========================================================
   GET URL PARAMETER
   Example:
   ticket-detail.html?id=FE-04
   ========================================================= */

function qs(name) {

    const params =
        new URLSearchParams(window.location.search);

    return params.get(name);

}


/* =========================================================
   ESCAPE HTML
   Prevents HTML injection
   ========================================================= */

function esc(value) {

    return String(value ?? "").replace(
        /[&<>'"]/g,
        function (character) {

            return {

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "'": "&#39;",
                '"': "&quot;"

            }[character];

        }
    );

}


/* =========================================================
   FORMAT DUE DATE
   ========================================================= */

function formatDue(value) {

    if (!value) {

        return "Not set";

    }


    /*
       If date is:
       2026-08-30

       Convert it to:
       Aug 30, 2026
    */

    if (
        /^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {

        const date =
            new Date(value + "T00:00:00");


        return date.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "2-digit",
                year: "numeric"
            }
        );

    }


    return value;

}


/* =========================================================
   STATUS BADGE
   ========================================================= */

function badge(status) {

    let className = "b-open";


    if (status === "Completed") {

        className = "b-done";

    }

    else if (status === "Code Review") {

        className = "b-review";

    }

    else if (status === "In Progress") {

        className = "b-progress";

    }


    return `
        <span class="badge-soft ${className}">
            ${esc(status)}
        </span>
    `;

}


/* =========================================================
   PRIORITY BADGE
   ========================================================= */

function priority(value) {

    let className = "b-low";


    if (value === "High") {

        className = "b-high";

    }

    else if (value === "Medium") {

        className = "b-medium";

    }


    return `
        <span class="badge-soft ${className}">
            ${esc(value)}
        </span>
    `;

}


/* =========================================================
   TOAST MESSAGE
   ========================================================= */

function toast(message) {

    const toastBox =
        document.createElement("div");


    toastBox.className =
        "toast-lite";


    toastBox.textContent =
        message;


    document.body.appendChild(
        toastBox
    );


    setTimeout(
        function () {

            toastBox.remove();

        },
        2200
    );

}


/* =========================================================
   ACTIVE SIDEBAR NAVIGATION
   ========================================================= */

function navActive() {

    const currentPage =
        location.pathname
            .split("/")
            .pop() || "index.html";


    document
        .querySelectorAll("[data-nav]")
        .forEach(function (link) {

            const href =
                link.getAttribute("href");


            link.classList.toggle(
                "active",
                href === currentPage
            );

        });

}


/* =========================================================
   SIDEBAR TICKET COUNT
   ========================================================= */

function updateSideCount() {

    const countElement =
        document.getElementById("sideCount");


    if (countElement) {

        countElement.textContent =
            getTickets().length;

    }

}


/* =========================================================
   DASHBOARD
   ========================================================= */

function renderDashboard() {

    const body =
        document.getElementById(
            "dashboardRows"
        );


    if (!body) {

        return;

    }


    const tickets =
        getTickets();


    body.innerHTML =
        tickets
            .slice(0, 5)
            .map(function (ticket) {

                return `

                    <tr>

                        <td>

                            <a
                                class="ticket-link"
                                href="ticket-detail.html?id=${encodeURIComponent(ticket.id)}"
                            >

                                ${esc(ticket.id)}

                            </a>

                        </td>


                        <td class="title-cell">

                            <a
                                href="ticket-detail.html?id=${encodeURIComponent(ticket.id)}"
                            >

                                <strong>
                                    ${esc(ticket.title)}
                                </strong>

                            </a>

                            <small>
                                ${esc(ticket.desc)}
                            </small>

                        </td>


                        <td>
                            ${badge(ticket.status)}
                        </td>


                        <td>
                            ${priority(ticket.priority)}
                        </td>


                        <td>

                            <span class="avatar-sm">
                                ${esc(ticket.assignee)}
                            </span>

                        </td>


                        <td>
                            ${esc(formatDue(ticket.due))}
                        </td>

                    </tr>

                `;

            })
            .join("");

}


/* =========================================================
   TICKET LIST
   Search + Status + Priority + Category
   ========================================================= */

function renderTickets() {

    const body =
        document.getElementById(
            "ticketRows"
        );


    if (!body) {

        return;

    }


    const search =
        document.getElementById(
            "ticketSearch"
        );


    const status =
        document.getElementById(
            "statusFilter"
        );


    const priorityFilter =
        document.getElementById(
            "priorityFilter"
        );


    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );


    function drawTickets() {

        const tickets =
            getTickets();


        const searchValue =
            (
                search?.value || ""
            ).toLowerCase().trim();


        const statusValue =
            status?.value || "";


        const priorityValue =
            priorityFilter?.value || "";


        const categoryValue =
            categoryFilter?.value || "";


        const filteredTickets =
            tickets.filter(function (ticket) {

                const searchableText =
                    `
                    ${ticket.id}
                    ${ticket.title}
                    ${ticket.desc}
                    ${ticket.category}
                    ${ticket.assignee}
                    `.toLowerCase();


                const matchesSearch =
                    !searchValue ||
                    searchableText.includes(
                        searchValue
                    );


                const matchesStatus =
                    !statusValue ||
                    ticket.status === statusValue;


                const matchesPriority =
                    !priorityValue ||
                    ticket.priority === priorityValue;


                const matchesCategory =
                    !categoryValue ||
                    ticket.category === categoryValue;


                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesPriority &&
                    matchesCategory
                );

            });


        if (filteredTickets.length === 0) {

            body.innerHTML = `

                <tr>

                    <td colspan="7">

                        <div class="empty">

                            No tickets found.

                        </div>

                    </td>

                </tr>

            `;

        }

        else {

            body.innerHTML =
                filteredTickets
                    .map(function (ticket) {

                        return `

                            <tr>

                                <!-- Ticket ID -->

                                <td>

                                    <a
                                        class="ticket-link"
                                        href="ticket-detail.html?id=${encodeURIComponent(ticket.id)}"
                                    >

                                        ${esc(ticket.id)}

                                    </a>

                                </td>


                                <!-- Title -->

                                <td class="title-cell">

                                    <a
                                        href="ticket-detail.html?id=${encodeURIComponent(ticket.id)}"
                                    >

                                        <strong>
                                            ${esc(ticket.title)}
                                        </strong>

                                    </a>

                                    <small>
                                        ${esc(ticket.desc)}
                                    </small>

                                </td>


                                <!-- Status -->

                                <td>
                                    ${badge(ticket.status)}
                                </td>


                                <!-- Priority -->

                                <td>
                                    ${priority(ticket.priority)}
                                </td>


                                <!-- Assignee -->

                                <td>

                                    <span class="avatar-sm">

                                        ${esc(ticket.assignee)}

                                    </span>

                                </td>


                                <!-- Due Date -->

                                <td>

                                    ${esc(
                                        formatDue(
                                            ticket.due
                                        )
                                    )}

                                </td>


                                <!-- Actions -->

                                <td>

                                    <div class="manage-actions">

                                        <!-- Edit -->

                                        <a
                                            class="btn btn-sm btn-light border"
                                            href="ticket-detail.html?id=${encodeURIComponent(ticket.id)}"
                                            title="View / Edit"
                                        >

                                            <i
                                                class="fa-regular fa-pen-to-square"
                                            ></i>

                                        </a>


                                        <!-- Delete -->

                                        <button
                                            class="btn btn-sm btn-light border text-danger"
                                            onclick="deleteTicket('${ticket.id}')"
                                            title="Delete"
                                        >

                                            <i
                                                class="fa-regular fa-trash-can"
                                            ></i>

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        `;

                    })
                    .join("");

        }


        /*
           Update Dashboard Counts
        */

        const total =
            document.getElementById(
                "totalCount"
            );


        const open =
            document.getElementById(
                "openCount"
            );


        const progress =
            document.getElementById(
                "progressCount"
            );


        const completed =
            document.getElementById(
                "completedCount"
            );


        if (total) {

            total.textContent =
                tickets.length;

        }


        if (open) {

            open.textContent =
                tickets.filter(
                    ticket =>
                        ticket.status === "Open"
                ).length;

        }


        if (progress) {

            progress.textContent =
                tickets.filter(
                    ticket =>
                        ticket.status === "In Progress"
                ).length;

        }


        if (completed) {

            completed.textContent =
                tickets.filter(
                    ticket =>
                        ticket.status === "Completed"
                ).length;

        }


        updateSideCount();

    }


    /*
       Search event
    */

    if (search) {

        search.addEventListener(
            "input",
            drawTickets
        );

    }


    /*
       Filter events
    */

    if (status) {

        status.addEventListener(
            "change",
            drawTickets
        );

    }


    if (priorityFilter) {

        priorityFilter.addEventListener(
            "change",
            drawTickets
        );

    }


    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            drawTickets
        );

    }


    drawTickets();

}


/* =========================================================
   TICKET DETAIL + EDIT
   ========================================================= */

function renderDetail() {

    const box =
        document.getElementById(
            "detailBox"
        );


    if (!box) {

        return;

    }


    const ticketId =
        qs("id");


    const tickets =
        getTickets();


    let ticket =
        tickets.find(
            item =>
                item.id === ticketId
        );


    /*
       If no ID exists,
       use first ticket
    */

    if (!ticket) {

        ticket = tickets[0];

    }


    if (!ticket) {

        box.innerHTML = `

            <div class="empty">

                Ticket not found.

            </div>

        `;

        return;

    }


    box.innerHTML = `

        <!-- Ticket Header -->

        <div
            class="d-flex justify-content-between gap-3 flex-wrap"
        >

            <div>

                <div class="eyebrow">

                    ${esc(ticket.id)}
                    ·
                    ${esc(ticket.category)}

                </div>


                <div class="detail-title">

                    ${esc(ticket.title)}

                </div>


                <div class="detail-meta">

                    ${esc(ticket.desc)}

                    · Due

                    ${esc(
                        formatDue(
                            ticket.due
                        )
                    )}

                </div>

            </div>


            <div>

                ${badge(ticket.status)}

                ${priority(ticket.priority)}

            </div>

        </div>


        <!-- Information Boxes -->

        <div class="row g-3 mt-2">


            <div class="col-md-3">

                <div class="info-box">

                    <div class="info-label">
                        Assignee
                    </div>

                    <div class="info-value">
                        ${esc(ticket.assignee)}
                    </div>

                </div>

            </div>


            <div class="col-md-3">

                <div class="info-box">

                    <div class="info-label">
                        Priority
                    </div>

                    <div class="info-value">
                        ${esc(ticket.priority)}
                    </div>

                </div>

            </div>


            <div class="col-md-3">

                <div class="info-box">

                    <div class="info-label">
                        Status
                    </div>

                    <div class="info-value">
                        ${esc(ticket.status)}
                    </div>

                </div>

            </div>


            <div class="col-md-3">

                <div class="info-box">

                    <div class="info-label">
                        Due Date
                    </div>

                    <div class="info-value">

                        ${esc(
                            formatDue(
                                ticket.due
                            )
                        )}

                    </div>

                </div>

            </div>

        </div>


        <!-- Description -->

        <div class="info-box">

            <div class="info-label">
                Description
            </div>

            <div class="info-value">

                ${esc(ticket.desc)}

            </div>

        </div>


        <!-- Manage Ticket -->

        <div class="ticket-edit-panel">

            <h6>

                <i
                    class="fa-solid fa-sliders me-2"
                ></i>

                Manage Ticket

            </h6>


            <form id="editTicketForm">

                <div class="row g-3">


                    <!-- Title -->

                    <div class="col-md-6">

                        <label class="form-label">
                            Ticket Title
                        </label>

                        <input
                            name="title"
                            class="form-control"
                            value="${esc(ticket.title)}"
                            required
                        >

                    </div>


                    <!-- Category -->

                    <div class="col-md-6">

                        <label class="form-label">
                            Category
                        </label>

                        <select
                            name="category"
                            class="form-select"
                        >

                            ${[
                                "Frontend",
                                "Backend",
                                "UI/UX",
                                "Architecture",
                                "Infrastructure"
                            ]
                            .map(function (value) {

                                return `

                                    <option
                                        ${
                                            value ===
                                            ticket.category
                                            ? "selected"
                                            : ""
                                        }
                                    >

                                        ${value}

                                    </option>

                                `;

                            })
                            .join("")}

                        </select>

                    </div>


                    <!-- Status -->

                    <div class="col-md-4">

                        <label class="form-label">
                            Status
                        </label>

                        <select
                            name="status"
                            class="form-select"
                        >

                            ${[
                                "Open",
                                "In Progress",
                                "Code Review",
                                "Completed"
                            ]
                            .map(function (value) {

                                return `

                                    <option
                                        ${
                                            value ===
                                            ticket.status
                                            ? "selected"
                                            : ""
                                        }
                                    >

                                        ${value}

                                    </option>

                                `;

                            })
                            .join("")}

                        </select>

                    </div>


                    <!-- Priority -->

                    <div class="col-md-4">

                        <label class="form-label">
                            Priority
                        </label>

                        <select
                            name="priority"
                            class="form-select"
                        >

                            ${[
                                "High",
                                "Medium",
                                "Low"
                            ]
                            .map(function (value) {

                                return `

                                    <option
                                        ${
                                            value ===
                                            ticket.priority
                                            ? "selected"
                                            : ""
                                        }
                                    >

                                        ${value}

                                    </option>

                                `;

                            })
                            .join("")}

                        </select>

                    </div>


                    <!-- Assignee -->

                    <div class="col-md-4">

                        <label class="form-label">
                            Assignee
                        </label>

                        <select
                            name="assignee"
                            class="form-select"
                        >

                            ${[
                                "SA",
                                "TA",
                                "AN",
                                "MA",
                                "MK"
                            ]
                            .map(function (value) {

                                return `

                                    <option
                                        ${
                                            value ===
                                            ticket.assignee
                                            ? "selected"
                                            : ""
                                        }
                                    >

                                        ${value}

                                    </option>

                                `;

                            })
                            .join("")}

                        </select>

                    </div>


                    <!-- Due Date -->

                    <div class="col-md-6">

                        <label class="form-label">
                            Due Date
                        </label>

                        <input
                            type="date"
                            name="due"
                            class="form-control"
                            value="${
                                /^\d{4}-\d{2}-\d{2}$/
                                    .test(ticket.due)
                                    ? ticket.due
                                    : ""
                            }"
                        >

                    </div>


                    <!-- Save -->

                    <div class="col-12">

                        <button
                            class="btn btn-teal"
                            type="submit"
                        >

                            <i
                                class="fa-solid fa-floppy-disk me-2"
                            ></i>

                            Save Changes

                        </button>

                    </div>

                </div>

            </form>

        </div>


        <!-- System Comment -->

        <div class="comment">

            <strong>
                System Administrator
            </strong>

            <p>

                Ticket management is stored in
                browser localStorage for this
                frontend demo and is ready to
                connect to a backend API.

            </p>

            <small class="text-muted">

                ${esc(ticket.id)}

            </small>

        </div>

    `;


    /* =====================================================
       EDIT TICKET
       ===================================================== */

    const editForm =
        document.getElementById(
            "editTicketForm"
        );


    if (editForm) {

        editForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const allTickets =
                    getTickets();


                const index =
                    allTickets.findIndex(
                        item =>
                            item.id ===
                            ticket.id
                    );


                if (index === -1) {

                    return;

                }


                allTickets[index] = {

                    ...allTickets[index],

                    title:
                        editForm.title.value.trim(),

                    category:
                        editForm.category.value,

                    status:
                        editForm.status.value,

                    priority:
                        editForm.priority.value,

                    assignee:
                        editForm.assignee.value,

                    due:
                        editForm.due.value
                            ? editForm.due.value
                            : allTickets[index].due

                };


                saveTickets(
                    allTickets
                );


                toast(
                    "Ticket updated successfully"
                );


                setTimeout(
                    function () {

                        renderDetail();

                    },
                    250
                );

            }
        );

    }

}


/* =========================================================
   DELETE TICKET
   ========================================================= */

function deleteTicket(id) {

    const tickets =
        getTickets();


    const ticket =
        tickets.find(
            item =>
                item.id === id
        );


    if (!ticket) {

        return;

    }


    const confirmed =
        confirm(
            `Delete ${ticket.id} - ${ticket.title}?`
        );


    if (!confirmed) {

        return;

    }


    const updatedTickets =
        tickets.filter(
            item =>
                item.id !== id
        );


    saveTickets(
        updatedTickets
    );


    toast(
        "Ticket deleted successfully"
    );


    setTimeout(
        function () {

            window.location.href =
                "tickets.html";

        },
        350
    );

}


/* =========================================================
   CREATE NEW TICKET
   ========================================================= */

function initCreate() {

    const form =
        document.getElementById(
            "createForm"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /*
               Get existing tickets
            */

            const tickets =
                getTickets();


            /*
               Generate next FE number

               FE-01
               FE-02
               FE-03
               FE-04
               etc.
            */

            let number = 1;


            while (
                tickets.some(
                    ticket =>
                        ticket.id ===
                        "FE-" +
                        String(number)
                            .padStart(2, "0")
                )
            ) {

                number++;

            }


            const newTicketId =
                "FE-" +
                String(number)
                    .padStart(2, "0");


            /*
               Create ticket
            */

            const newTicket = {

                id:
                    newTicketId,

                title:
                    form.title.value.trim(),

                desc:
                    form.description.value.trim(),

                status:
                    form.status.value,

                priority:
                    form.priority.value,

                assignee:
                    form.assignee.value,

                due:
                    form.due.value
                        ? form.due.value
                        : "Not set",

                category:
                    form.category.value

            };


            /*
               Validate title
            */

            if (!newTicket.title) {

                alert(
                    "Please enter a ticket title."
                );

                return;

            }


            /*
               Validate description
            */

            if (!newTicket.desc) {

                alert(
                    "Please enter ticket description."
                );

                return;

            }


            /*
               Add new ticket
               at the beginning
            */

            tickets.unshift(
                newTicket
            );


            /*
               Save to localStorage
            */

            saveTickets(
                tickets
            );


            /*
               Show success
            */

            toast(
                `${newTicket.id} created successfully`
            );


            /*
               Open ticket detail page
            */

            setTimeout(
                function () {

                    window.location.href =
                        "ticket-detail.html?id=" +
                        encodeURIComponent(
                            newTicket.id
                        );

                },
                300
            );

        }
    );

}


/* =========================================================
   SETTINGS
   ========================================================= */

function initSettings() {

    const form =
        document.getElementById(
            "settingsForm"
        );


    if (!form) {

        return;

    }


    const savedSettings =
        JSON.parse(
            localStorage.getItem(
                "ticketHubSettings"
            ) || "{}"
        );


    /*
       Default values
    */

    if (form.name) {

        form.name.value =
            savedSettings.name ||
            "System Administrator";

    }


    if (form.email) {

        form.email.value =
            savedSettings.email ||
            "admin@tickethub.local";

    }


    /*
       Save settings
    */

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const settings = {

                name:
                    form.name.value.trim(),

                email:
                    form.email.value.trim()

            };


            localStorage.setItem(
                "ticketHubSettings",
                JSON.stringify(
                    settings
                )
            );


            const saved =
                document.getElementById(
                    "saved"
                );


            if (saved) {

                saved.classList.remove(
                    "d-none"
                );

            }


            toast(
                "Settings saved successfully"
            );

        }
    );

}


/* =========================================================
   PAGE INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
           Sidebar
        */

        navActive();


        /*
           Dashboard
        */

        renderDashboard();


        /*
           Tickets
        */

        renderTickets();


        /*
           Ticket Detail
        */

        renderDetail();


        /*
           Create Ticket
        */

        initCreate();


        /*
           Settings
        */

        initSettings();


        /*
           Sidebar ticket count
        */

        updateSideCount();

    }
);
/* =========================================================
   FE-05 SERVER HEALTH VISUALIZATION
   ========================================================= */


/* =========================================================
   SERVER DATA
   ========================================================= */

const serverData = [

    {
        id: "api-prod-01",
        name: "Production API Server",
        host: "api-prod-01",
        type: "API",
        location: "US-East",
        status: "Online",
        health: 98,
        cpu: 42,
        memory: 61,
        disk: 54,
        response: 84,
        uptime: "99.99%",
        description: "Main API production server"
    },

    {
        id: "app-prod-01",
        name: "Application Server",
        host: "app-prod-01",
        type: "Application",
        location: "US-East",
        status: "Online",
        health: 96,
        cpu: 48,
        memory: 67,
        disk: 58,
        response: 96,
        uptime: "99.97%",
        description: "Main application server"
    },

    {
        id: "db-prod-01",
        name: "Database Server",
        host: "db-prod-01",
        type: "Database",
        location: "US-East",
        status: "Online",
        health: 94,
        cpu: 56,
        memory: 72,
        disk: 64,
        response: 112,
        uptime: "99.95%",
        description: "Primary PostgreSQL database server"
    },

    {
        id: "cache-prod-01",
        name: "Cache Server",
        host: "cache-prod-01",
        type: "Cache",
        location: "US-East",
        status: "Online",
        health: 99,
        cpu: 27,
        memory: 44,
        disk: 31,
        response: 41,
        uptime: "100%",
        description: "Redis cache server"
    },

    {
        id: "worker-prod-01",
        name: "Background Worker",
        host: "worker-prod-01",
        type: "Worker",
        location: "US-West",
        status: "Warning",
        health: 79,
        cpu: 82,
        memory: 76,
        disk: 62,
        response: 178,
        uptime: "98.82%",
        description: "Background task processing server"
    },

    {
        id: "backup-prod-01",
        name: "Backup Server",
        host: "backup-prod-01",
        type: "Backup",
        location: "EU-West",
        status: "Online",
        health: 92,
        cpu: 38,
        memory: 53,
        disk: 71,
        response: 121,
        uptime: "99.91%",
        description: "Automated backup and recovery server"
    }

];


/* =========================================================
   GET SERVER
   ========================================================= */

function getServer(serverId) {

    return serverData.find(
        function (server) {

            return server.id === serverId;

        }
    );

}


/* =========================================================
   SERVER STATUS CLASS
   ========================================================= */

function serverStatusClass(status) {

    if (status === "Online") {

        return "online";

    }

    if (status === "Warning") {

        return "warning";

    }

    return "offline";

}


/* =========================================================
   SERVER CARD
   ========================================================= */

function createServerCard(server) {

    return `

        <div class="col-xl-4 col-md-6">

            <div
                class="server-card"
                onclick="openServerDetail('${server.id}')"
            >


                <div class="server-card-header">


                    <div class="server-card-icon">

                        <i class="fa-solid fa-server"></i>

                    </div>


                    <span
                        class="server-status ${serverStatusClass(server.status)}"
                    >

                        <span class="status-circle"></span>

                        ${server.status}

                    </span>


                </div>



                <div class="server-card-title">

                    <h6>
                        ${server.name}
                    </h6>

                    <span>
                        ${server.host}
                    </span>

                </div>



                <div class="server-card-health">


                    <div>

                        <span>
                            Health Score
                        </span>

                        <strong>
                            ${server.health}%
                        </strong>

                    </div>


                    <div class="mini-health-bar">

                        <div
                            style="width:${server.health}%"
                        ></div>

                    </div>


                </div>



                <div class="server-card-metrics">


                    <div>

                        <span>
                            CPU
                        </span>

                        <strong>
                            ${server.cpu}%
                        </strong>

                    </div>


                    <div>

                        <span>
                            Memory
                        </span>

                        <strong>
                            ${server.memory}%
                        </strong>

                    </div>


                    <div>

                        <span>
                            Response
                        </span>

                        <strong>
                            ${server.response}ms
                        </strong>

                    </div>


                </div>



                <div class="server-card-footer">


                    <span>

                        <i
                            class="fa-solid fa-location-dot"
                        ></i>

                        ${server.location}

                    </span>


                    <span>

                        View Details

                        <i
                            class="fa-solid fa-arrow-right"
                        ></i>

                    </span>


                </div>


            </div>

        </div>

    `;

}


/* =========================================================
   RENDER SERVER CARDS
   ========================================================= */

function renderServerCards() {

    const container =
        document.getElementById(
            "serverCards"
        );


    if (!container) {

        return;

    }


    const searchInput =
        document.getElementById(
            "serverSearch"
        );


    const statusFilter =
        document.getElementById(
            "serverStatusFilter"
        );


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const status =
        statusFilter
            ? statusFilter.value
            : "";


    const filtered =
        serverData.filter(
            function (server) {


                const matchesSearch =

                    !search ||

                    server.name
                        .toLowerCase()
                        .includes(search) ||

                    server.host
                        .toLowerCase()
                        .includes(search) ||

                    server.type
                        .toLowerCase()
                        .includes(search);


                const matchesStatus =

                    !status ||

                    server.status === status;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    if (filtered.length === 0) {

        container.innerHTML = `

            <div class="col-12">

                <div class="empty">

                    <i
                        class="fa-solid fa-server mb-2"
                    ></i>

                    <p>
                        No servers found.
                    </p>

                </div>

            </div>

        `;

        return;

    }


    container.innerHTML =
        filtered
            .map(createServerCard)
            .join("");

}


/* =========================================================
   OPEN SERVER DETAIL
   ========================================================= */

function openServerDetail(serverId) {

    window.location.href =
        "server-detail.html?id=" +
        encodeURIComponent(serverId);

}


/* =========================================================
   SERVER HEALTH CHART
   ========================================================= */

let serverHealthChart = null;


/* =========================================================
   CREATE RANDOM HISTORY
   ========================================================= */

function createHistory(baseValue, count = 12) {

    const values = [];


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const variation =
            Math.floor(
                Math.random() * 12
            ) - 6;


        let value =
            baseValue + variation;


        value =
            Math.max(
                5,
                Math.min(
                    95,
                    value
                )
            );


        values.push(value);

    }


    return values;

}


/* =========================================================
   RENDER MAIN HEALTH CHART
   ========================================================= */

function renderHealthChart() {

    const canvas =
        document.getElementById(
            "healthChart"
        );


    if (!canvas) {

        return;

    }


    const labels = [

        "60m",
        "55m",
        "50m",
        "45m",
        "40m",
        "35m",
        "30m",
        "25m",
        "20m",
        "15m",
        "10m",
        "Now"

    ];


    const cpu =
        createHistory(43);


    const memory =
        createHistory(60);


    if (serverHealthChart) {

        serverHealthChart.destroy();

    }


    serverHealthChart =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            label: "CPU Usage",

                            data: cpu,

                            borderColor: "#187666",

                            backgroundColor:
                                "rgba(24,118,102,0.08)",

                            fill: true,

                            tension: 0.4,

                            borderWidth: 2,

                            pointRadius: 3,

                            pointHoverRadius: 5

                        },

                        {

                            label: "Memory Usage",

                            data: memory,

                            borderColor: "#5F6B73",

                            backgroundColor:
                                "rgba(95,107,115,0.06)",

                            fill: true,

                            tension: 0.4,

                            borderWidth: 2,

                            pointRadius: 3,

                            pointHoverRadius: 5

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    interaction: {

                        intersect: false,

                        mode: "index"

                    },


                    plugins: {

                        legend: {

                            position: "bottom",

                            labels: {

                                usePointStyle: true,

                                padding: 20

                            }

                        }

                    },


                    scales: {

                        y: {

                            min: 0,

                            max: 100,

                            ticks: {

                                callback:
                                    function(value) {

                                        return value + "%";

                                    }

                            },

                            grid: {

                                color:
                                    "rgba(44,62,80,0.08)"

                            }

                        },


                        x: {

                            grid: {

                                display: false

                            }

                        }

                    }

                }

            }
        );

}


/* =========================================================
   UPDATE MAIN METRICS
   ========================================================= */

function updateMainHealth() {

    const averageHealth =
        Math.round(
            serverData.reduce(
                function (total, server) {

                    return total + server.health;

                },
                0
            ) / serverData.length
        );


    const averageCPU =
        Math.round(
            serverData.reduce(
                function (total, server) {

                    return total + server.cpu;

                },
                0
            ) / serverData.length
        );


    const averageMemory =
        Math.round(
            serverData.reduce(
                function (total, server) {

                    return total + server.memory;

                },
                0
            ) / serverData.length
        );


    const averageDisk =
        Math.round(
            serverData.reduce(
                function (total, server) {

                    return total + server.disk;

                },
                0
            ) / serverData.length
        );


    const averageResponse =
        Math.round(
            serverData.reduce(
                function (total, server) {

                    return total + server.response;

                },
                0
            ) / serverData.length
        );


    const healthScore =
        document.getElementById(
            "healthScore"
        );


    if (healthScore) {

        healthScore.textContent =
            averageHealth + "%";

    }


    const overallStatus =
        document.getElementById(
            "overallStatus"
        );


    const overallMessage =
        document.getElementById(
            "overallMessage"
        );


    if (averageHealth >= 90) {

        if (overallStatus) {

            overallStatus.textContent =
                "Healthy";

        }


        if (overallMessage) {

            overallMessage.textContent =
                "All monitored services are operating normally.";

        }

    }

    else if (averageHealth >= 75) {

        if (overallStatus) {

            overallStatus.textContent =
                "Needs Attention";

        }


        if (overallMessage) {

            overallMessage.textContent =
                "Some infrastructure resources require attention.";

        }

    }

    else {

        if (overallStatus) {

            overallStatus.textContent =
                "Critical";

        }


        if (overallMessage) {

            overallMessage.textContent =
                "One or more infrastructure services require immediate attention.";

        }

    }


    /*
       CPU
    */

    const cpuValue =
        document.getElementById(
            "cpuValue"
        );


    const cpuProgress =
        document.getElementById(
            "cpuProgress"
        );


    if (cpuValue) {

        cpuValue.textContent =
            averageCPU + "%";

    }


    if (cpuProgress) {

        cpuProgress.style.width =
            averageCPU + "%";

    }


    /*
       Memory
    */

    const memoryValue =
        document.getElementById(
            "memoryValue"
        );


    const memoryProgress =
        document.getElementById(
            "memoryProgress"
        );


    if (memoryValue) {

        memoryValue.textContent =
            averageMemory + "%";

    }


    if (memoryProgress) {

        memoryProgress.style.width =
            averageMemory + "%";

    }


    /*
       Disk
    */

    const diskValue =
        document.getElementById(
            "diskValue"
        );


    const diskProgress =
        document.getElementById(
            "diskProgress"
        );


    if (diskValue) {

        diskValue.textContent =
            averageDisk + "%";

    }


    if (diskProgress) {

        diskProgress.style.width =
            averageDisk + "%";

    }


    /*
       Response
    */

    const responseValue =
        document.getElementById(
            "responseValue"
        );


    if (responseValue) {

        responseValue.textContent =
            averageResponse + " ms";

    }

}


/* =========================================================
   REFRESH HEALTH
   ========================================================= */

function refreshHealth() {

    const button =
        document.getElementById(
            "refreshHealth"
        );


    const icon =
        document.getElementById(
            "refreshIcon"
        );


    if (icon) {

        icon.classList.add(
            "fa-spin"
        );

    }


    if (button) {

        button.disabled = true;

    }


    /*
       Simulate server refresh
    */

    setTimeout(
        function () {


            serverData.forEach(
                function (server) {


                    /*
                       CPU random change
                    */

                    server.cpu =
                        Math.max(
                            10,
                            Math.min(
                                95,
                                server.cpu +
                                (
                                    Math.floor(
                                        Math.random() * 11
                                    ) - 5
                                )
                            )
                        );


                    /*
                       Memory random change
                    */

                    server.memory =
                        Math.max(
                            20,
                            Math.min(
                                95,
                                server.memory +
                                (
                                    Math.floor(
                                        Math.random() * 9
                                    ) - 4
                                )
                            )
                        );


                    /*
                       Response random change
                    */

                    server.response =
                        Math.max(
                            30,
                            server.response +
                            (
                                Math.floor(
                                    Math.random() * 31
                                ) - 15
                            )
                        );


                    /*
                       Health score
                    */

                    server.health =
                        Math.max(
                            60,
                            Math.min(
                                100,
                                100 -
                                Math.round(
                                    (
                                        server.cpu +
                                        server.memory +
                                        server.disk
                                    ) / 12
                                )
                            )
                        );

                }
            );


            renderServerCards();

            updateMainHealth();

            renderHealthChart();


            /*
               Last updated
            */

            const updated =
                document.getElementById(
                    "lastUpdated"
                );


            if (updated) {

                updated.textContent =
                    "Updated just now";

            }


            if (icon) {

                icon.classList.remove(
                    "fa-spin"
                );

            }


            if (button) {

                button.disabled = false;

            }


            if (
                typeof toast ===
                "function"
            ) {

                toast(
                    "Server health refreshed successfully"
                );

            }

        },
        900
    );

}


/* =========================================================
   DETAIL PAGE
   ========================================================= */

let serverDetailChart = null;


/* =========================================================
   RENDER SERVER DETAIL
   ========================================================= */

function renderServerDetail() {

    const serverId =
        typeof qs === "function"
            ? qs("id")
            : new URLSearchParams(
                window.location.search
            ).get("id");


    const server =
        getServer(
            serverId || "api-prod-01"
        );


    if (!server) {

        window.location.href =
            "server-health.html";

        return;

    }


    /*
       Name
    */

    const name =
        document.getElementById(
            "serverDetailName"
        );


    if (name) {

        name.textContent =
            server.name;

    }


    /*
       Host
    */

    const host =
        document.getElementById(
            "serverDetailHost"
        );


    if (host) {

        host.textContent =
            server.host;

    }


    /*
       Title
    */

    const title =
        document.getElementById(
            "detailTitle"
        );


    if (title) {

        title.textContent =
            server.name;

    }


    /*
       Description
    */

    const description =
        document.getElementById(
            "detailDescription"
        );


    if (description) {

        description.textContent =
            server.description;

    }


    /*
       Status
    */

    const status =
        document.getElementById(
            "detailStatus"
        );


    if (status) {

        status.textContent =
            server.status;


        status.className =
            "server-status " +
            serverStatusClass(
                server.status
            );

    }


    /*
       Health score
    */

    const health =
        document.getElementById(
            "detailHealthScore"
        );


    if (health) {

        health.textContent =
            server.health + "%";

    }


    /*
       Uptime
    */

    const uptime =
        document.getElementById(
            "detailUptime"
        );


    if (uptime) {

        uptime.textContent =
            server.uptime;

    }


    /*
       CPU
    */

    const cpu =
        document.getElementById(
            "detailCPU"
        );


    const cpuProgress =
        document.getElementById(
            "detailCPUProgress"
        );


    if (cpu) {

        cpu.textContent =
            server.cpu + "%";

    }


    if (cpuProgress) {

        cpuProgress.style.width =
            server.cpu + "%";

    }


    /*
       Memory
    */

    const memory =
        document.getElementById(
            "detailMemory"
        );


    const memoryProgress =
        document.getElementById(
            "detailMemoryProgress"
        );


    if (memory) {

        memory.textContent =
            server.memory + "%";

    }


    if (memoryProgress) {

        memoryProgress.style.width =
            server.memory + "%";

    }


    /*
       Disk
    */

    const disk =
        document.getElementById(
            "detailDisk"
        );


    const diskProgress =
        document.getElementById(
            "detailDiskProgress"
        );


    if (disk) {

        disk.textContent =
            server.disk + "%";

    }


    if (diskProgress) {

        diskProgress.style.width =
            server.disk + "%";

    }


    /*
       Response
    */

    const response =
        document.getElementById(
            "detailResponse"
        );


    if (response) {

        response.textContent =
            server.response + " ms";

    }


    /*
       Host information
    */

    const infoHost =
        document.getElementById(
            "infoHost"
        );


    if (infoHost) {

        infoHost.textContent =
            server.host;

    }


    /*
       Detail chart
    */

    renderDetailChart(server);

}


/* =========================================================
   DETAIL CHART
   ========================================================= */

function renderDetailChart(server) {

    const canvas =
        document.getElementById(
            "serverDetailChart"
        );


    if (!canvas) {

        return;

    }


    const labels = [

        "60m",
        "55m",
        "50m",
        "45m",
        "40m",
        "35m",
        "30m",
        "25m",
        "20m",
        "15m",
        "10m",
        "Now"

    ];


    const cpu =
        createHistory(
            server.cpu
        );


    const memory =
        createHistory(
            server.memory
        );


    if (serverDetailChart) {

        serverDetailChart.destroy();

    }


    serverDetailChart =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            label: "CPU",

                            data: cpu,

                            borderColor: "#187666",

                            backgroundColor:
                                "rgba(24,118,102,0.08)",

                            fill: true,

                            tension: 0.4,

                            borderWidth: 2

                        },

                        {

                            label: "Memory",

                            data: memory,

                            borderColor: "#5F6B73",

                            backgroundColor:
                                "rgba(95,107,115,0.06)",

                            fill: true,

                            tension: 0.4,

                            borderWidth: 2

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            position: "bottom"

                        }

                    },


                    scales: {

                        y: {

                            min: 0,

                            max: 100,

                            ticks: {

                                callback:
                                    function(value) {

                                        return value + "%";

                                    }

                            }

                        }

                    }

                }

            }
        );

}


/* =========================================================
   REFRESH DETAIL
   ========================================================= */

function refreshServerDetail() {

    const serverId =
        typeof qs === "function"
            ? qs("id")
            : new URLSearchParams(
                window.location.search
            ).get("id");


    const server =
        getServer(
            serverId || "api-prod-01"
        );


    if (!server) {

        return;

    }


    server.cpu =
        Math.max(
            10,
            Math.min(
                95,
                server.cpu +
                Math.floor(
                    Math.random() * 11
                ) - 5
            )
        );


    server.memory =
        Math.max(
            20,
            Math.min(
                95,
                server.memory +
                Math.floor(
                    Math.random() * 9
                ) - 4
            )
        );


    server.disk =
        Math.max(
            20,
            Math.min(
                95,
                server.disk +
                Math.floor(
                    Math.random() * 5
                ) - 2
            )
        );


    server.response =
        Math.max(
            30,
            server.response +
            Math.floor(
                Math.random() * 31
            ) - 15
        );


    server.health =
        Math.max(
            60,
            Math.min(
                100,
                100 -
                Math.round(
                    (
                        server.cpu +
                        server.memory +
                        server.disk
                    ) / 12
                )
            )
        );


    renderServerDetail();


    if (
        typeof toast ===
        "function"
    ) {

        toast(
            "Server details refreshed"
        );

    }

}


/* =========================================================
   FE-05 INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /*
           Server Health Page
        */

        if (
            document.getElementById(
                "serverCards"
            )
        ) {


            renderServerCards();

            updateMainHealth();

            renderHealthChart();


            /*
               Search
            */

            const search =
                document.getElementById(
                    "serverSearch"
                );


            if (search) {

                search.addEventListener(
                    "input",
                    renderServerCards
                );

            }


            /*
               Status Filter
            */

            const filter =
                document.getElementById(
                    "serverStatusFilter"
                );


            if (filter) {

                filter.addEventListener(
                    "change",
                    renderServerCards
                );

            }


            /*
               Refresh
            */

            const refreshButton =
                document.getElementById(
                    "refreshHealth"
                );


            if (refreshButton) {

                refreshButton.addEventListener(
                    "click",
                    refreshHealth
                );

            }


            /*
               Chart range
            */

            const chartRange =
                document.getElementById(
                    "chartRange"
                );


            if (chartRange) {

                chartRange.addEventListener(
                    "change",
                    renderHealthChart
                );

            }

        }


        /*
           Server Detail Page
        */

        if (
            document.getElementById(
                "serverDetailName"
            )
        ) {

            renderServerDetail();

        }

    }
);