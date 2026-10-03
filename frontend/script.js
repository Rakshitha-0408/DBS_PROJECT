// ==================================================
// EVENTEASE - FRONTEND FUNCTIONS
// ==================================================


// ==================================================
// LOAD EVENTS FROM MYSQL DATABASE
// ==================================================

async function loadEvents() {

    try {

        const response = await fetch("http://localhost:5000/api/events");

        if (!response.ok) {
            throw new Error("Failed to fetch events");
        }

        const events = await response.json();

        const container = document.getElementById("eventContainer");

        container.innerHTML = "";

        events.forEach(event => {

            const date = new Date(event.Event_Date);

            const formattedDate = date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });

            const card = document.createElement("div");

            card.className = "event-card";

            card.innerHTML = `
                <div class="event-image">
                    🎉
                </div>

                <div class="event-content">

                    <span class="category">
                        ${event.Category}
                    </span>

                    <h3>
                        ${event.Event_Name}
                    </h3>

                    <p>
                        📅 ${formattedDate}
                    </p>

                    <p>
                        📍 ${event.Venue_Name}, ${event.Location}
                    </p>

                    <button class="view-button">
                        View Event
                    </button>

                </div>
            `;

            // View Event button
            card.querySelector(".view-button").addEventListener("click", function () {

                viewEventFromDatabase(
                    event.Event_ID,
                    event.Event_Name,
                    event.Category,
                    event.Event_Date,
                    event.Venue_Name,
                    event.Location
                );

            });

            container.appendChild(card);

        });


        // ==========================================
        // RESET BUTTON TO KEEP EXPLORING
        // ==========================================

        const button = document.querySelector(".view-all-button");

        if (button) {

            button.textContent = "Keep Exploring ✨";

            button.onclick = loadAllEvents;

        }

    }

    catch (error) {

        console.error("Error loading events:", error);

        document.getElementById("eventContainer").innerHTML = `
            <p>
                Unable to load events.
                Please make sure the EventEase backend is running.
            </p>
        `;
    }

}


// ==================================================
// LOAD ALL EVENTS
// ==================================================

async function loadAllEvents() {

    try {

        const response = await fetch("http://localhost:5000/api/events/all");

        if (!response.ok) {
            throw new Error("Failed to fetch all events");
        }

        const events = await response.json();

        const container = document.getElementById("eventContainer");

        container.innerHTML = "";

        events.forEach(event => {

            const date = new Date(event.Event_Date);

            const formattedDate = date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });

            const card = document.createElement("div");

            card.className = "event-card";

            card.innerHTML = `
                <div class="event-image">
                    🎉
                </div>

                <div class="event-content">

                    <span class="category">
                        ${event.Category}
                    </span>

                    <h3>
                        ${event.Event_Name}
                    </h3>

                    <p>
                        📅 ${formattedDate}
                    </p>

                    <p>
                        📍 ${event.Venue_Name}, ${event.Location}
                    </p>

                    <button class="view-button">
                        View Event
                    </button>

                </div>
            `;

            card.querySelector(".view-button").addEventListener("click", function () {

                viewEventFromDatabase(
                    event.Event_ID,
                    event.Event_Name,
                    event.Category,
                    event.Event_Date,
                    event.Venue_Name,
                    event.Location
                );

            });

            container.appendChild(card);

        });


        // ==========================================
        // CHANGE BUTTON TO SHOW LESS
        // ==========================================

        const button = document.querySelector(".view-all-button");

        if (button) {

            button.textContent = "Show Less ↑";

            button.onclick = loadEvents;

        }

    }

    catch (error) {

        console.error("Error loading all events:", error);

    }

}


// ==================================================
// SELECTED EVENT
// ==================================================

let selectedEvent = null;


// ==================================================
// VIEW EVENT FROM DATABASE
// ==================================================

function viewEventFromDatabase(
    eventID,
    eventName,
    category,
    eventDate,
    venue,
    location
) {

    selectedEvent = {
        eventID: eventID,
        eventName: eventName,
        category: category,
        eventDate: eventDate,
        venue: venue,
        location: location
    };

    const date = new Date(eventDate);

    const formattedDate = date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    document.getElementById("modalTitle").textContent = eventName;

    document.getElementById("modalContent").innerHTML = `

        <div class="detail-row">
            <strong>Event ID</strong>
            <span>${eventID}</span>
        </div>

        <div class="detail-row">
            <strong>Category</strong>
            <span>${category}</span>
        </div>

        <div class="detail-row">
            <strong>Event Date</strong>
            <span>${formattedDate}</span>
        </div>

        <div class="detail-row">
            <strong>Venue</strong>
            <span>${venue}</span>
        </div>

        <div class="detail-row">
            <strong>Location</strong>
            <span>${location}</span>
        </div>

        <button
            class="register-button"
            onclick="registerForEvent()">
            Register for Event
        </button>

    `;

    document.getElementById("eventModal").style.display = "flex";

}


// ==================================================
// EXPLORE EVENTS BUTTON
// ==================================================

function scrollToEvents() {

    document.getElementById("events").scrollIntoView({
        behavior: "smooth"
    });

}


// ==================================================
// SEARCH EVENTS
// ==================================================

function searchEvents() {

    const input = document
        .getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();

    const cards = document.querySelectorAll(".event-card");

    cards.forEach(card => {

        const eventName = card
            .querySelector("h3")
            .textContent
            .toLowerCase();

        const category = card
            .querySelector(".category")
            .textContent
            .toLowerCase();

        const cardDetails = card
            .textContent
            .toLowerCase();

        if (
            eventName.includes(input) ||
            category.includes(input) ||
            cardDetails.includes(input)
        ) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

}


// ==================================================
// REGISTER FOR EVENT
// ==================================================

function registerForEvent() {

    if (!selectedEvent) {
        return;
    }

    document.getElementById("registrationEvent").value =
        selectedEvent.eventName;

    document.getElementById("registrationModal").style.display = "flex";

}


// ==================================================
// SUBMIT REGISTRATION
// ==================================================


async function submitRegistration() {
    const name = document.getElementById("registrationName").value.trim();
    const email = document.getElementById("registrationEmail").value.trim();
    const phone = document.getElementById("registrationPhone").value.trim();
    const payment = document.getElementById("paymentMethod").value;

    if (!selectedEvent) {
        alert("Please select an event first.");
        return;
    }

    if (!name || !email || !phone || !payment) {
        alert("Please fill in all the registration details.");
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    const button = document.querySelector(
        "#registrationModal .register-button"
    );

    button.disabled = true;
    button.textContent = "Submitting...";

    try {
        const response = await fetch("http://localhost:5000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                eventID: selectedEvent.eventID,
                name: name,
                email: email,
                phone: phone,
                paymentMethod: payment
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Registration failed.");
        }

        // Display confirmation
        const content = document.getElementById("confirmationContent");

        content.innerHTML = `
            <div class="confirmation-success">
                ✓ Registration Saved Successfully!
            </div>

            <h3>Registration Details</h3>
            <p><strong>Registration ID:</strong> <span id="confirmRegID"></span></p>
            <p><strong>Name:</strong> <span id="confirmName"></span></p>
            <p><strong>Email:</strong> <span id="confirmEmail"></span></p>
            <p><strong>Phone:</strong> <span id="confirmPhone"></span></p>
            <p><strong>Event:</strong> <span id="confirmEvent"></span></p>
            <p><strong>Payment Method:</strong> <span id="confirmPayment"></span></p>
            <p><strong>Payment Status:</strong> Pending</p>
            <p><strong>Seat Status:</strong> Not Allocated</p>

            <p class="confirmation-note">
                Your registration has been saved.
                Payment and seat allocation are not completed yet.
            </p>
        `;

        document.getElementById("confirmRegID").textContent =
            result.registrationID;
        document.getElementById("confirmName").textContent = name;
        document.getElementById("confirmEmail").textContent = email;
        document.getElementById("confirmPhone").textContent = phone;
        document.getElementById("confirmEvent").textContent =
            selectedEvent.eventName;
        document.getElementById("confirmPayment").textContent = payment;

        document.getElementById("registrationModal").style.display = "none";
        document.getElementById("confirmationModal").style.display = "flex";

        // Clear form fields
        document.getElementById("registrationName").value = "";
        document.getElementById("registrationEmail").value = "";
        document.getElementById("registrationPhone").value = "";
        document.getElementById("paymentMethod").value = "";

    } catch (error) {
        console.error("Registration error:", error);
        alert(error.message);

    } finally {
        button.disabled = false;
        button.textContent = "Confirm Registration";
    }
}


// ==================================================
// CLOSE REGISTRATION MODAL
// ==================================================

function closeRegistration() {

    document.getElementById("registrationModal").style.display = "none";

}


// ==================================================
// CLOSE EVENT MODAL
// ==================================================

function closeModal() {

    document.getElementById("eventModal").style.display = "none";

}


// ==================================================
// CONTACT SUPPORT
// ==================================================

function openSupport() {

    document.getElementById("supportModal").style.display = "flex";

}


// ==================================================
// SUBMIT COMPLAINT
// ==================================================


async function submitComplaint() {
    const name = document.getElementById("supportName").value.trim();
    const email = document.getElementById("supportEmail").value.trim();
    const phone = document.getElementById("supportPhone").value.trim();
    const eventID = document.getElementById("complaintEvent").value;
    const issue = document.getElementById("supportIssue").value.trim();

    if (!name || !email || !phone || !eventID || !issue) {
        alert("Please fill in all the fields.");
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    const button = document.querySelector(
        "#supportModal .complaint-section .register-button"
    );

    button.disabled = true;
    button.textContent = "Submitting...";

    try {
        const response = await fetch("http://localhost:5000/api/complaints", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                phone,
                eventID,
                issue
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Complaint submission failed.");
        }

        alert(
            "Complaint submitted successfully!\n\n" +
            "Complaint ID: " + result.complaintID
        );

        document.getElementById("supportName").value = "";
        document.getElementById("supportEmail").value = "";
        document.getElementById("supportPhone").value = "";
        document.getElementById("complaintEvent").value = "";
        document.getElementById("supportIssue").value = "";

        document.getElementById("supportModal").style.display = "none";

    } catch (error) {
        console.error("Complaint submission error:", error);
        alert(error.message);
    } finally {
        button.disabled = false;
        button.textContent = "Submit Complaint";
    }
}


// ==================================================
// CLOSE SUPPORT MODAL
// ==================================================

function closeSupport() {

    document.getElementById("supportModal").style.display = "none";

}


// ==================================================
// CLOSE CONFIRMATION MODAL
// ==================================================

function closeConfirmation() {

    document.getElementById("confirmationModal").style.display = "none";

}


// ==================================================
// CLOSE MODALS WHEN CLICKING OUTSIDE
// ==================================================

window.onclick = function(event) {

    const eventModal =
        document.getElementById("eventModal");

    const supportModal =
        document.getElementById("supportModal");

    const registrationModal =
        document.getElementById("registrationModal");

    const confirmationModal =
        document.getElementById("confirmationModal");


    if (event.target === eventModal) {

        eventModal.style.display = "none";

    }


    if (event.target === supportModal) {

        supportModal.style.display = "none";

    }


    if (event.target === registrationModal) {

        registrationModal.style.display = "none";

    }


    if (event.target === confirmationModal) {

        confirmationModal.style.display = "none";

    }

};

async function loadComplaintEvents() {
    const dropdown = document.getElementById("complaintEvent");

    try {
        const response = await fetch("http://localhost:5000/api/events/all");

        if (!response.ok) {
            throw new Error("Could not load events.");
        }

        const events = await response.json();

        dropdown.innerHTML = '<option value="">Select the event</option>';

        events.forEach(event => {
            const option = document.createElement("option");
            option.value = event.Event_ID;
            option.textContent = event.Event_Name;
            dropdown.appendChild(option);
        });

    } catch (error) {
        console.error("Error loading complaint events:", error);
        dropdown.innerHTML = '<option value="">Unable to load events</option>';
    }
}


// ==================================================
// LOAD EVENTS WHEN PAGE OPENS
// ==================================================

document.addEventListener("DOMContentLoaded", () => {
    loadEvents();
    loadComplaintEvents();
});

// ==========================================
// MY REGISTRATIONS
// ==========================================

function openMyRegistrations() {
    document.getElementById("myRegistrationsModal").style.display = "flex";

    document.getElementById("lookupEmail").value = "";
    document.getElementById("lookupPhone").value = "";
    document.getElementById("myRegistrationsResults").innerHTML = "";
}

function closeMyRegistrations() {
    document.getElementById("myRegistrationsModal").style.display = "none";
}

async function findMyRegistrations() {
    const email = document.getElementById("lookupEmail").value.trim();
    const phone = document.getElementById("lookupPhone").value.trim();
    const resultsDiv = document.getElementById("myRegistrationsResults");

    if (!email || !phone) {
        resultsDiv.textContent = "Please enter both email and phone number.";
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        resultsDiv.textContent = "Please enter a valid 10-digit phone number.";
        return;
    }

    resultsDiv.textContent = "Searching for your registrations...";

    try {
        const response = await fetch(
            `http://localhost:5000/api/my-registrations?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`
        );

        const registrations = await response.json();

        if (!response.ok) {
            throw new Error(registrations.message || "Unable to retrieve registrations.");
        }

        if (registrations.length === 0) {
            resultsDiv.textContent = "No registrations found for these details.";
            return;
        }

        resultsDiv.innerHTML = "";

        registrations.forEach(reg => {
            const card = document.createElement("div");
            card.className = "my-registration-card";

            const title = document.createElement("h3");
            title.textContent = reg.Event_Name;

            const details = [
                ["Registration ID", reg.Registration_ID],
                ["Event Date", formatRegistrationDate(reg.Event_Date)],
                ["Category", reg.Category],
                ["Venue", reg.Venue_Name || "Not specified"],
                ["Location", reg.Location || "Not specified"],
                ["Registration Date", formatRegistrationDate(reg.Registration_Date)],
                ["Registration Status", reg.Status],
                ["Payment Status", reg.Payment_Status],
                ["Seat", reg.Seat_Allocated === "Yes" ? "Allocated" : "Not allocated"]
            ];

            card.appendChild(title);

            details.forEach(([label, value]) => {
                const p = document.createElement("p");
                p.textContent = `${label}: ${value ?? "Not available"}`;
                card.appendChild(p);
            });

            resultsDiv.appendChild(card);
        });

    } catch (error) {
        console.error("Registration lookup error:", error);
        resultsDiv.textContent =
            "Could not retrieve registrations. Please check whether the backend and database are running.";
    }
}

function formatRegistrationDate(dateValue) {
    if (!dateValue) return "Not available";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return String(dateValue);
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function openMyComplaints() {
    document.getElementById("myComplaintsModal").style.display = "flex";
    document.getElementById("complaintEmail").value = "";
    document.getElementById("complaintPhone").value = "";
    document.getElementById("myComplaintsResults").innerHTML = "";
}

function closeMyComplaints() {
    document.getElementById("myComplaintsModal").style.display = "none";
}

async function findMyComplaints() {
    const email = document.getElementById("complaintEmail").value.trim();
    const phone = document.getElementById("complaintPhone").value.trim();
    const results = document.getElementById("myComplaintsResults");

    if (!email || !phone) {
        results.textContent = "Please enter your email and phone number.";
        return;
    }

    results.textContent = "Loading your complaints...";

    try {
        const response = await fetch(
            `http://localhost:5000/api/my-complaints?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`
        );

        const complaints = await response.json();

        if (!response.ok) {
            throw new Error(complaints.message || "Unable to fetch complaints.");
        }

        if (complaints.length === 0) {
            results.textContent = "No complaints found for these details.";
            return;
        }

        results.innerHTML = "";

        complaints.forEach(c => {
            const card = document.createElement("div");
            card.className = "complaint-card";

            const details = [
                ["Complaint ID", c.Complaint_ID],
                ["Event", c.Event_Name || "N/A"],
                ["Issue", c.Issue],
                ["Priority", c.Priority],
                ["Status", c.Status],
                ["Reported At", c.Reported_At
                    ? new Date(c.Reported_At).toLocaleString()
                    : "N/A"],
                ["Escalated To", c.Escalated_To || "Not escalated"]
            ];

            details.forEach(([label, value]) => {
                const p = document.createElement("p");
                const strong = document.createElement("strong");
                strong.textContent = label + ": ";
                p.appendChild(strong);
                p.appendChild(document.createTextNode(value ?? "N/A"));
                card.appendChild(p);
            });

            results.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        results.textContent = "Could not load complaints. Please try again.";
    }
}