
const API_URL = "http://localhost:5000/api";

async function loadAdminComplaints() {
    const complaintList = document.getElementById("adminComplaintList");

    complaintList.textContent = "Loading complaints...";

    try {
        const response = await fetch(`${API_URL}/admin/complaints`);

        if (!response.ok) {
            throw new Error("Could not fetch complaints");
        }

        const complaints = await response.json();

        // Update dashboard statistics
        document.getElementById("totalComplaints").textContent =
            complaints.length;

        document.getElementById("submittedComplaints").textContent =
            complaints.filter(c => c.Status === "Submitted").length;

        document.getElementById("progressComplaints").textContent =
            complaints.filter(c => c.Status === "In Progress").length;

        document.getElementById("resolvedComplaints").textContent =
            complaints.filter(c => c.Status === "Resolved").length;

        complaintList.innerHTML = "";

        if (complaints.length === 0) {
            complaintList.textContent = "No complaints found.";
            return;
        }

        complaints.forEach(c => {
            const card = document.createElement("div");
            card.className = "admin-complaint-card";

            const heading = document.createElement("h3");
            heading.textContent = c.Complaint_ID;
            card.appendChild(heading);

            const details = [
                ["Event", c.Event_Name || "N/A"],
                ["Issue", c.Issue],
                ["Priority", c.Priority],
                ["Status", c.Status],
                ["Reported At", c.Reported_At
                    ? new Date(c.Reported_At).toLocaleString()
                    : "N/A"]
            ];

            details.forEach(([label, value]) => {
                const p = document.createElement("p");
                const strong = document.createElement("strong");
                strong.textContent = label + ": ";
                p.appendChild(strong);
                p.appendChild(document.createTextNode(value ?? "N/A"));
                card.appendChild(p);
            });

            complaintList.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        complaintList.textContent =
            "Unable to load complaints. Check the backend connection.";
    }
}

document.addEventListener("DOMContentLoaded", loadAdminComplaints);