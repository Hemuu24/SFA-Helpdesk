// Function to show a custom modal message
function showCustomModal(message, callback) {
    const modal = document.getElementById('custom-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalOkButton = document.getElementById('modal-ok-button');

    modalMessage.textContent = message;
    
    // Show modal using Bootstrap
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();

    modalOkButton.onclick = () => {
        bootstrapModal.hide();
        if (callback) {
            callback();
        }
    };
}

// Function to handle redirection
function redirectToLogin() {
    window.location.href = 'index.html';

}

document.addEventListener('DOMContentLoaded', async () => {
    const ticketsListDiv = document.getElementById('tickets-list');
    const loadingMessage = document.getElementById('loading-message');
    const noTicketsMessage = document.getElementById('no-tickets-message');
    const errorMessage = document.getElementById('error-message');
    const logoutButton = document.getElementById('logout-button');
    const statsContainer = document.getElementById('stats-container');

    const adminToken = localStorage.getItem('adminToken');

    // --- CHECK FOR AUTHENTICATION ---
    if (!adminToken) {
        showCustomModal('You must be logged in as an administrator to access this page.', redirectToLogin);
        return; // Stop further execution
    }

    // Logout functionality
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('adminToken'); // Clear the token
            showCustomModal('You have been logged out.', redirectToLogin);
        });
    }

    // Load statistics first
    await loadStatistics();

    try {
        loadingMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        noTicketsMessage.style.display = 'none';

        // Fetch tickets from your backend API - FIXED ENDPOINT
        const response = await fetch(window.API_BASE_URL + '/api/tickets', {
            headers: {
                'Content-Type': 'application/json',
                'x-admin-token': adminToken // Include the admin token in the header
            }
        });
        
        if (!response.ok) {
            // Handle specific unauthorized error
            if (response.status === 401) {
                showCustomModal('Session expired or unauthorized. Please log in again.', () => {
                    localStorage.removeItem('adminToken'); // Clear invalid token
                    redirectToLogin();
                });
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const tickets = await response.json();

        loadingMessage.style.display = 'none';

        if (tickets.length === 0) {
            noTicketsMessage.style.display = 'block';
        } else {
            // Clear existing content
            ticketsListDiv.innerHTML = '';
            
            tickets.forEach(ticket => {
                const ticketCard = document.createElement('div');
                ticketCard.className = 'col-lg-6 col-md-12 mb-4';
                ticketCard.innerHTML = `
                    <div class="ticket-card">
                        <div class="ticket-header">
                            <span class="ticket-id">#${ticket._id.slice(-6)}</span>
                            <span class="ticket-priority priority-${getPriorityClass(ticket.category)}">${ticket.category}</span>
                        </div>
                        <div class="ticket-content">
                            <h5 class="ticket-subject">${ticket.subject}</h5>
                            <div class="ticket-details">
                                <div class="detail-row">
                                    <i class="fas fa-user"></i>
                                    <span><strong>Name:</strong> ${ticket.name}</span>
                                </div>
                                <div class="detail-row">
                                    <i class="fas fa-envelope"></i>
                                    <span><strong>Email:</strong> ${ticket.email}</span>
                                </div>
                                <div class="detail-row">
                                    <i class="fas fa-id-badge"></i>
                                    <span><strong>Employee ID:</strong> ${ticket.employeeId || 'N/A'}</span>
                                </div>
                                <div class="detail-row">
                                    <i class="fas fa-tag"></i>
                                    <span><strong>Category:</strong> ${ticket.category}</span>
                                </div>
                            </div>
                            <div class="ticket-description">
                                <p><strong>Description:</strong></p>
                                <p>${ticket.description}</p>
                            </div>
                        </div>
                        <div class="ticket-footer">
                            <span class="status-badge status-${getStatusClass(ticket.status)}">${ticket.status}</span>
                            <div class="ticket-actions">
                                <select class="form-select status-select" onchange="updateTicketStatus('${ticket._id}', this.value)">
                                    <option value="Open" ${ticket.status === 'Open' ? 'selected' : ''}>Open</option>
                                    <option value="In Progress" ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                    <option value="Resolved" ${ticket.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                                    <option value="Closed" ${ticket.status === 'Closed' ? 'selected' : ''}>Closed</option>
                                </select>
                            </div>
                        </div>
                        <div class="ticket-timestamps">
                            <small><i class="fas fa-clock"></i> Created: ${new Date(ticket.createdAt).toLocaleString()}</small>
                        </div>
                    </div>
                `;
                ticketsListDiv.appendChild(ticketCard);
            });
        }
    } catch (error) {
        console.error('Error fetching tickets:', error);
        loadingMessage.style.display = 'none';
        errorMessage.style.display = 'block';
        errorMessage.textContent = `Failed to load tickets: ${error.message}. Please ensure the backend is running and you are logged in.`;
    }

    function getPriorityClass(category) {
        switch (category) {
            case 'login': return 'critical';
            case 'sync': return 'high';
            case 'order': return 'medium';
            case 'route': return 'medium';
            case 'rewards': return 'low';
            case 'other': return 'low';
            default: return 'medium';
        }
    }

    // Function to load statistics
    async function loadStatistics() {
        try {
            const response = await fetch(window.API_BASE_URL + '/api/tickets/stats', {
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': adminToken
                }
            });

            if (response.ok) {
                const stats = await response.json();
                displayStatistics(stats);
            }
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    }

    // Function to display statistics
    function displayStatistics(stats) {
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="row mb-4">
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="stat-card">
                            <div class="stat-icon" style="background: linear-gradient(135deg, #e61a27, #ff6b6b);">
                                <i class="fas fa-ticket-alt"></i>
                            </div>
                            <div class="stat-content">
                                <h3>${stats.total}</h3>
                                <p>Total Tickets</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="stat-card">
                            <div class="stat-icon" style="background: linear-gradient(135deg, #dc3545, #ff6b6b);">
                                <i class="fas fa-exclamation-circle"></i>
                            </div>
                            <div class="stat-content">
                                <h3>${stats.open}</h3>
                                <p>Open Tickets</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="stat-card">
                            <div class="stat-icon" style="background: linear-gradient(135deg, #ffc107, #ffdb4d);">
                                <i class="fas fa-clock"></i>
                            </div>
                            <div class="stat-content">
                                <h3>${stats.inProgress}</h3>
                                <p>In Progress</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 mb-3">
                        <div class="stat-card">
                            <div class="stat-icon" style="background: linear-gradient(135deg, #28a745, #51cf66);">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <div class="stat-content">
                                <h3>${stats.resolved}</h3>
                                <p>Resolved</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
});

// Function to get status class for styling
function getStatusClass(status) {
    switch (status) {
        case 'Open': return 'open';
        case 'In Progress': return 'in-progress';
        case 'Resolved': return 'resolved';
        case 'Closed': return 'closed';
        default: return 'open';
    }
}

// Function to update ticket status
async function updateTicketStatus(ticketId, newStatus) {
    try {
        const adminToken = localStorage.getItem('adminToken');
        const response = await fetch(`${window.API_BASE_URL}/api/tickets/${ticketId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-token': adminToken
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            // Show success message
            const statusBadge = document.querySelector(`[data-ticket-id="${ticketId}"] .status-badge`);
            if (statusBadge) {
                statusBadge.textContent = newStatus;
                statusBadge.className = `status-badge status-${getStatusClass(newStatus)}`;
            }
            // Reload the page to refresh statistics
            location.reload();
        } else {
            alert('Failed to update ticket status');
        }
    } catch (error) {
        console.error('Error updating ticket status:', error);
        alert('Error updating ticket status');
    }
}
