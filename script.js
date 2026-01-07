// Booking Modal Functions
let currentSessionType = '';

// Booking storage (using localStorage for demo - in production, use a database)
function getBookings() {
    const bookings = localStorage.getItem('golfSimulatorBookings');
    return bookings ? JSON.parse(bookings) : [];
}

function saveBooking(booking) {
    const bookings = getBookings();
    bookings.push(booking);
    localStorage.setItem('golfSimulatorBookings', JSON.stringify(bookings));
    updateSchedule(); // Refresh schedule after booking
}

function getBookingsForDate(date, type) {
    const bookings = getBookings();
    return bookings.filter(booking => {
        const matchesDate = booking.date === date;
        const matchesType = type === 'all' || booking.sessionType === type;
        return matchesDate && matchesType;
    });
}

function openBookingModal(type) {
    currentSessionType = type;
    const modal = document.getElementById('bookingModal');
    const sessionTypeInput = document.getElementById('sessionType');
    const modalTitle = document.getElementById('modalTitle');
    
    if (type === 'simulator') {
        sessionTypeInput.value = 'Full Simulator Experience';
        modalTitle.textContent = 'Book Full Simulator';
    } else if (type === 'net') {
        sessionTypeInput.value = 'Net & Mat Practice';
        modalTitle.textContent = 'Book Net & Mat';
    }
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').min = today;
    document.getElementById('bookingDate').value = today;
    
    // Reset form
    document.getElementById('bookingForm').reset();
    sessionTypeInput.value = type === 'simulator' ? 'Full Simulator Experience' : 'Net & Mat Practice';
    document.getElementById('bookingDate').value = today;
    updateTimeSlots();
    updateTotalPrice();
    
    modal.style.display = 'block';
}

function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target === modal) {
        closeBookingModal();
    }
}

// Generate time slots
function updateTimeSlots() {
    const dateInput = document.getElementById('bookingDate');
    const timeSelect = document.getElementById('bookingTime');
    const selectedDate = dateInput.value;
    
    if (!selectedDate) {
        timeSelect.innerHTML = '<option value="">Choose a time slot</option>';
        return;
    }
    
    // Get existing bookings for this date and session type
    const existingBookings = getBookingsForDate(selectedDate, currentSessionType);
    
    // Generate time slots from 9 AM to 9 PM (last slot starts at 9 PM)
    const slots = [];
    for (let hour = 9; hour <= 21; hour++) {
        const timeString = `${hour.toString().padStart(2, '0')}:00`;
        
        // Check if this time slot conflicts with existing bookings
        const hasConflict = existingBookings.some(booking => {
            const bookingHour = parseInt(booking.time.split(':')[0]);
            const bookingEndHour = bookingHour + booking.duration;
            // Check if the hour would overlap with an existing booking
            return hour < bookingEndHour && (hour + 1) > bookingHour;
        });
        
        if (!hasConflict) {
            slots.push(`<option value="${timeString}">${formatTime(hour)}</option>`);
        } else {
            slots.push(`<option value="${timeString}" disabled>${formatTime(hour)} - Booked</option>`);
        }
    }
    
    timeSelect.innerHTML = '<option value="">Choose a time slot</option>' + slots.join('');
}

function formatTime(hour) {
    if (hour === 0) return '12:00 AM';
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return '12:00 PM';
    return `${hour - 12}:00 PM`;
}

// Update total price
function updateTotalPrice() {
    const duration = parseInt(document.getElementById('duration').value) || 0;
    const totalPriceLabel = document.getElementById('totalPrice');
    
    let hourlyRate = 0;
    if (currentSessionType === 'simulator') {
        hourlyRate = 25;
    } else if (currentSessionType === 'net') {
        hourlyRate = 10;
    }
    
    const total = hourlyRate * duration;
    totalPriceLabel.textContent = `Total: $${total.toFixed(2)}`;
}

// Handle booking form submission
function handleBooking(event) {
    event.preventDefault();
    
    const bookingData = {
        id: Date.now().toString(),
        sessionType: currentSessionType,
        sessionTypeName: document.getElementById('sessionType').value,
        date: document.getElementById('bookingDate').value,
        time: document.getElementById('bookingTime').value,
        duration: parseInt(document.getElementById('duration').value),
        name: document.getElementById('customerName').value,
        email: document.getElementById('customerEmail').value,
        phone: document.getElementById('customerPhone').value
    };
    
    // Calculate total
    const hourlyRate = currentSessionType === 'simulator' ? 25 : 10;
    const total = hourlyRate * bookingData.duration;
    bookingData.total = total;
    
    // Check if time slot is already booked
    const existingBookings = getBookingsForDate(bookingData.date, bookingData.sessionType);
    const bookingTime = bookingData.time;
    const bookingHour = parseInt(bookingTime.split(':')[0]);
    
    // Check for conflicts
    const hasConflict = existingBookings.some(existing => {
        const existingTime = existing.time;
        const existingHour = parseInt(existingTime.split(':')[0]);
        const existingEndHour = existingHour + existing.duration;
        const bookingEndHour = bookingHour + bookingData.duration;
        
        // Check if times overlap
        return (bookingHour < existingEndHour && bookingEndHour > existingHour);
    });
    
    if (hasConflict) {
        alert('Sorry, this time slot is already booked. Please select another time.');
        return;
    }
    
    // Save booking
    saveBooking(bookingData);
    
    // In a real application, this would send data to a server
    console.log('Booking submitted:', bookingData);
    
    // Show confirmation
    alert(`Thank you, ${bookingData.name}! Your booking has been submitted.\n\nSession: ${bookingData.sessionTypeName}\nDate: ${bookingData.date}\nTime: ${bookingData.time}\nDuration: ${bookingData.duration} hour(s)\nTotal: $${total.toFixed(2)}\n\nWe'll send a confirmation email to ${bookingData.email}.`);
    
    // Close modal and reset form
    closeBookingModal();
    document.getElementById('bookingForm').reset();
}

// Schedule Display Functions
function updateSchedule() {
    const scheduleDisplay = document.getElementById('scheduleDisplay');
    const scheduleType = document.getElementById('scheduleType')?.value || 'all';
    const scheduleDate = document.getElementById('scheduleDate')?.value;
    
    if (!scheduleDisplay) return;
    
    // Set default date to today if not set
    if (!scheduleDate) {
        const today = new Date().toISOString().split('T')[0];
        if (document.getElementById('scheduleDate')) {
            document.getElementById('scheduleDate').value = today;
        }
        updateSchedule();
        return;
    }
    
    // Get bookings for selected date and type
    const bookings = getBookingsForDate(scheduleDate, scheduleType);
    
    // Generate time slots (9 AM to 9 PM)
    const slots = [];
    const now = new Date();
    const selectedDate = new Date(scheduleDate);
    const isToday = selectedDate.toDateString() === now.toDateString();
    const currentHour = now.getHours();
    
    for (let hour = 9; hour <= 21; hour++) {
        const timeString = `${hour.toString().padStart(2, '0')}:00`;
        const isPast = isToday && hour < currentHour;
        
        // Check if this time slot is booked
        const slotBookings = bookings.filter(booking => {
            const bookingHour = parseInt(booking.time.split(':')[0]);
            const bookingEndHour = bookingHour + booking.duration;
            return hour >= bookingHour && hour < bookingEndHour;
        });
        
        const isBooked = slotBookings.length > 0;
        const bookingType = slotBookings.length > 0 ? slotBookings[0].sessionTypeName : '';
        
        slots.push({
            time: timeString,
            hour: hour,
            isPast: isPast,
            isBooked: isBooked,
            bookingType: bookingType
        });
    }
    
    // Render schedule
    if (scheduleType === 'all') {
        // Show both simulator and net slots separately
        renderDualSchedule(slots, bookings, scheduleDate);
    } else {
        renderSingleSchedule(slots, scheduleType, scheduleDate);
    }
}

function renderSingleSchedule(slots, type, date) {
    const scheduleDisplay = document.getElementById('scheduleDisplay');
    const typeName = type === 'simulator' ? 'Full Simulator' : 'Net & Mat';
    
    let html = `<h3 style="margin-bottom: 1.5rem; color: var(--primary-color);">${typeName} - ${formatDate(date)}</h3>`;
    html += '<div class="schedule-grid">';
    
    slots.forEach(slot => {
        let className = 'schedule-slot';
        if (slot.isPast) {
            className += ' past';
        } else if (slot.isBooked) {
            className += ' booked';
        } else {
            className += ' available';
        }
        
        html += `
            <div class="${className}" data-time="${slot.time}">
                <div class="schedule-slot-time">${formatTime(slot.hour)}</div>
                ${slot.isBooked ? `<div class="schedule-slot-type">${slot.bookingType}</div>` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    scheduleDisplay.innerHTML = html;
}

function renderDualSchedule(slots, bookings, date) {
    const scheduleDisplay = document.getElementById('scheduleDisplay');
    
    // Separate bookings by type
    const simulatorBookings = bookings.filter(b => b.sessionType === 'simulator');
    const netBookings = bookings.filter(b => b.sessionType === 'net');
    
    // Create slots for each type
    const simulatorSlots = slots.map(slot => {
        const slotBookings = simulatorBookings.filter(booking => {
            const bookingHour = parseInt(booking.time.split(':')[0]);
            const bookingEndHour = bookingHour + booking.duration;
            return slot.hour >= bookingHour && slot.hour < bookingEndHour;
        });
        return {
            ...slot,
            isBooked: slotBookings.length > 0,
            bookingType: slotBookings.length > 0 ? 'Full Simulator' : ''
        };
    });
    
    const netSlots = slots.map(slot => {
        const slotBookings = netBookings.filter(booking => {
            const bookingHour = parseInt(booking.time.split(':')[0]);
            const bookingEndHour = bookingHour + booking.duration;
            return slot.hour >= bookingHour && slot.hour < bookingEndHour;
        });
        return {
            ...slot,
            isBooked: slotBookings.length > 0,
            bookingType: slotBookings.length > 0 ? 'Net & Mat' : ''
        };
    });
    
    let html = `<h3 style="margin-bottom: 1.5rem; color: var(--primary-color);">Schedule for ${formatDate(date)}</h3>`;
    
    // Full Simulator Schedule
    html += '<h4 style="margin: 2rem 0 1rem; color: var(--secondary-color);">Full Simulator</h4>';
    html += '<div class="schedule-grid">';
    simulatorSlots.forEach(slot => {
        let className = 'schedule-slot';
        if (slot.isPast) {
            className += ' past';
        } else if (slot.isBooked) {
            className += ' booked';
        } else {
            className += ' available';
        }
        
        html += `
            <div class="${className}" data-time="${slot.time}">
                <div class="schedule-slot-time">${formatTime(slot.hour)}</div>
                ${slot.isBooked ? `<div class="schedule-slot-type">${slot.bookingType}</div>` : ''}
            </div>
        `;
    });
    html += '</div>';
    
    // Net & Mat Schedule
    html += '<h4 style="margin: 2rem 0 1rem; color: var(--secondary-color);">Net & Mat</h4>';
    html += '<div class="schedule-grid">';
    netSlots.forEach(slot => {
        let className = 'schedule-slot';
        if (slot.isPast) {
            className += ' past';
        } else if (slot.isBooked) {
            className += ' booked';
        } else {
            className += ' available';
        }
        
        html += `
            <div class="${className}" data-time="${slot.time}">
                <div class="schedule-slot-time">${formatTime(slot.hour)}</div>
                ${slot.isBooked ? `<div class="schedule-slot-type">${slot.bookingType}</div>` : ''}
            </div>
        `;
    });
    html += '</div>';
    
    scheduleDisplay.innerHTML = html;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
    } else {
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
}

// Event listeners for booking form
document.addEventListener('DOMContentLoaded', function() {
    const bookingDate = document.getElementById('bookingDate');
    const duration = document.getElementById('duration');
    
    if (bookingDate) {
        bookingDate.addEventListener('change', updateTimeSlots);
    }
    
    if (duration) {
        duration.addEventListener('change', updateTotalPrice);
    }
    
    // Initialize schedule
    const scheduleDateInput = document.getElementById('scheduleDate');
    if (scheduleDateInput) {
        const today = new Date().toISOString().split('T')[0];
        scheduleDateInput.value = today;
        scheduleDateInput.min = today;
        updateSchedule();
    }
});

// Shop filter functionality
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Update active button
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(category) || 
            (category === 'all' && btn.textContent.toLowerCase().includes('all'))) {
            btn.classList.add('active');
        }
    });
    
    // Filter products
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Ideas form handlers
function handleAttractionSuggestion(event) {
    event.preventDefault();
    
    const data = {
        name: document.getElementById('attractionName').value,
        email: document.getElementById('attractionEmail').value,
        idea: document.getElementById('attractionIdea').value
    };
    
    console.log('Attraction suggestion:', data);
    alert(`Thank you, ${data.name}! Your golf attraction idea has been submitted. We appreciate your input!`);
    
    event.target.reset();
}

function handleImprovementSuggestion(event) {
    event.preventDefault();
    
    const data = {
        name: document.getElementById('improvementName').value,
        email: document.getElementById('improvementEmail').value,
        type: document.getElementById('improvementType').value,
        suggestion: document.getElementById('improvementIdea').value
    };
    
    console.log('Improvement suggestion:', data);
    alert(`Thank you, ${data.name}! Your ${data.type} improvement suggestion has been submitted. We'll review it carefully!`);
    
    event.target.reset();
}

function handleQuestionnaire(event) {
    event.preventDefault();
    
    const wouldPay = document.querySelector('input[name="wouldPay"]:checked').value;
    const pricing = document.querySelector('input[name="pricing"]:checked');
    const comments = document.getElementById('additionalComments').value;
    
    const data = {
        name: document.getElementById('questionnaireName').value,
        email: document.getElementById('questionnaireEmail').value,
        wouldPay: wouldPay,
        pricing: pricing ? pricing.value : null,
        comments: comments
    };
    
    console.log('Questionnaire response:', data);
    alert(`Thank you, ${data.name}! Your questionnaire response has been submitted. Your feedback helps us make better decisions!`);
    
    event.target.reset();
    document.getElementById('pricingGroup').style.display = 'none';
}

// Show/hide pricing options based on "Would you pay" selection
document.addEventListener('DOMContentLoaded', function() {
    const wouldPayRadios = document.querySelectorAll('input[name="wouldPay"]');
    const pricingGroup = document.getElementById('pricingGroup');
    const pricingRadios = document.querySelectorAll('input[name="pricing"]');
    
    if (wouldPayRadios.length > 0 && pricingGroup) {
        wouldPayRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'yes') {
                    pricingGroup.style.display = 'block';
                    // Make pricing required
                    pricingRadios.forEach(r => r.required = true);
                } else {
                    pricingGroup.style.display = 'none';
                    // Remove required and uncheck
                    pricingRadios.forEach(r => {
                        r.required = false;
                        r.checked = false;
                    });
                }
            });
        });
    }
});

// Add to cart functionality (shop page)
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.product-card .btn-primary');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            
            // In a real application, this would add to a shopping cart
            alert(`Added to cart: ${productName} - ${productPrice}`);
        });
    });
});
