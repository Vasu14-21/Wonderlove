// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Cart functionality
let cart = [];
let cartCount = 0;

// EmailJS initialization
emailjs.init("YOUR_PUBLIC_KEY"); // You'll need to replace this with your actual EmailJS public key

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Form submission
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = contactForm.querySelector('input[type="text"]').value;
    const email = contactForm.querySelector('input[type="email"]').value;
    const destination = contactForm.querySelector('select').value;
    const message = contactForm.querySelector('textarea').value;
    
    // Simple validation
    if (!name || !email || !destination || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // Send to email and WhatsApp
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Prepare message content
    const messageContent = `
New Travel Inquiry from ${name}

Email: ${email}
Destination: ${destination}
Message: ${message}

Sent from Wanderlust Travel Guide
    `.trim();
    
    // Send to WhatsApp
    const whatsappMessage = encodeURIComponent(messageContent);
    const whatsappLink = `https://wa.me/919553866278?text=${whatsappMessage}`;
    
    // Open WhatsApp
    window.open(whatsappLink, '_blank');
    
    // Reset form and button
    setTimeout(() => {
        alert('Thank you for your message! Your inquiry has been sent via WhatsApp.');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

// Cart functionality
function updateCartCount() {
    document.getElementById('cart-count').textContent = cartCount;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><h3>Your cart is empty</h3><p>Add some destinations to get started!</p></div>';
        cartTotal.textContent = '0';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = '';
    
    cart.forEach((item, index) => {
        total += item.price;
        cartItems.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.destination}</h4>
                    <p>${item.duration}</p>
                </div>
                <div style="display: flex; align-items: center;">
                    <span class="cart-item-price">$${item.price}</span>
                    <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        `;
    });
    
    cartTotal.textContent = total;
}

function addToCart(destination, price, duration) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.destination === destination);
    if (existingItem) {
        alert('This destination is already in your cart!');
        return;
    }
    
    cart.push({
        destination: destination,
        price: parseInt(price),
        duration: duration
    });
    
    cartCount++;
    updateCartCount();
    
    // Show success message
    alert(`${destination} added to cart!`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    cartCount--;
    updateCartCount();
    updateCartDisplay();
}

function clearCart() {
    cart = [];
    cartCount = 0;
    updateCartCount();
    updateCartDisplay();
}

// Modal functionality
const cartModal = document.getElementById('cart-modal');
const bookingModal = document.getElementById('booking-modal');
const cartToggle = document.querySelector('.cart-toggle');
const cartClose = document.querySelector('.cart-close');
const bookingClose = document.querySelector('.booking-close');
const proceedBooking = document.getElementById('proceed-booking');
const clearCartBtn = document.getElementById('clear-cart');

cartToggle.addEventListener('click', (e) => {
    e.preventDefault();
    updateCartDisplay();
    cartModal.style.display = 'block';
});

cartClose.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

bookingClose.addEventListener('click', () => {
    bookingModal.style.display = 'none';
});

clearCartBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your cart?')) {
        clearCart();
    }
});

proceedBooking.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty! Please add some destinations first.');
        return;
    }
    
    // Update booking summary
    const bookingItems = document.getElementById('booking-items');
    const bookingTotal = document.getElementById('booking-total');
    
    let total = 0;
    bookingItems.innerHTML = '';
    
    cart.forEach(item => {
        total += item.price;
        bookingItems.innerHTML += `
            <div class="booking-item">
                <span>${item.destination} (${item.duration})</span>
                <span>$${item.price}</span>
            </div>
        `;
    });
    
    bookingTotal.textContent = total;
    
    cartModal.style.display = 'none';
    bookingModal.style.display = 'block';
});

// Payment method selection handler
const paymentMethodSelect = document.getElementById('payment-method');
const paymentDetailsDiv = document.getElementById('payment-details');

paymentMethodSelect.addEventListener('change', function() {
    const selectedMethod = this.value;
    
    if (selectedMethod) {
        paymentDetailsDiv.style.display = 'block';
        
        let paymentInfo = '';
        
        switch(selectedMethod) {
            case 'credit-card':
                paymentInfo = `
                    <div class="payment-info">
                        <h4>💳 Credit/Debit Card Payment</h4>
                        <p>• Secure online payment processing</p>
                        <p>• Instant confirmation</p>
                        <p>• All major cards accepted (Visa, MasterCard, Amex)</p>
                    </div>
                    <div class="payment-note">
                        <p>Payment link will be provided after booking confirmation</p>
                    </div>
                `;
                break;
            case 'paypal':
                paymentInfo = `
                    <div class="payment-info">
                        <h4>💰 PayPal Payment</h4>
                        <p>• Secure PayPal processing</p>
                        <p>• Buyer protection included</p>
                        <p>• Pay with PayPal balance or linked cards</p>
                    </div>
                    <div class="payment-note">
                        <p>PayPal invoice will be sent to your email</p>
                    </div>
                `;
                break;
            case 'bank-transfer':
                paymentInfo = `
                    <div class="payment-info">
                        <h4>🏦 Bank Transfer</h4>
                        <p>• Direct bank account transfer</p>
                        <p>• Lower processing fees</p>
                        <p>• 1-3 business days processing time</p>
                    </div>
                    <div class="payment-note">
                        <p>Bank details will be provided after booking confirmation</p>
                    </div>
                `;
                break;
            case 'upi':
                paymentInfo = `
                    <div class="payment-info">
                        <h4>📱 UPI Payment</h4>
                        <p>• PhonePe, GPay, Paytm supported</p>
                        <p>• Instant payment confirmation</p>
                        <p>• No additional charges</p>
                    </div>
                    <div class="payment-note">
                        <p>UPI ID: wanderlust@paytm (will be confirmed)</p>
                    </div>
                `;
                break;
            case 'cash':
                paymentInfo = `
                    <div class="payment-info">
                        <h4>💵 Cash on Arrival</h4>
                        <p>• Pay when you arrive at destination</p>
                        <p>• No advance payment required</p>
                        <p>• 25% advance may be required for some bookings</p>
                    </div>
                    <div class="payment-note">
                        <p>Advance payment terms will be discussed during confirmation call</p>
                    </div>
                `;
                break;
        }
        
        paymentDetailsDiv.innerHTML = paymentInfo;
    } else {
        paymentDetailsDiv.style.display = 'none';
    }
});

// Generate booking reference number
function generateBookingRef() {
    const prefix = 'WL';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
}

// Booking form submission
const bookingForm = document.getElementById('booking-form');
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('booking-name').value,
        email: document.getElementById('booking-email').value,
        phone: document.getElementById('booking-phone').value,
        date: document.getElementById('booking-date').value,
        travelers: document.getElementById('booking-travelers').value,
        notes: document.getElementById('booking-notes').value,
        paymentMethod: document.getElementById('payment-method').value
    };
    
    // Validate payment method
    if (!formData.paymentMethod) {
        alert('Please select a payment method');
        return;
    }
    
    // Generate booking reference
    const bookingRef = generateBookingRef();
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    // Prepare booking details
    const destinations = cart.map(item => `${item.destination} (${item.duration}) - $${item.price}`).join('\n');
    
    // Get payment method display name
    const paymentMethods = {
        'credit-card': 'Credit/Debit Card',
        'paypal': 'PayPal',
        'bank-transfer': 'Bank Transfer',
        'upi': 'UPI (PhonePe/GPay/Paytm)',
        'cash': 'Cash on Arrival'
    };
    
    const bookingDetails = `
NEW BOOKING CONFIRMATION
========================
Booking Reference: ${bookingRef}

Customer Details:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Travel Date: ${formData.date}
Number of Travelers: ${formData.travelers}
Payment Method: ${paymentMethods[formData.paymentMethod]}

Booked Destinations:
${destinations}

Total Amount: $${total}

Payment Status: PENDING CONFIRMATION

Special Requirements:
${formData.notes || 'None'}

Booking Time: ${new Date().toLocaleString()}

Please contact the customer to confirm payment and finalize the booking.
    `.trim();
    
    const submitBtn = bookingForm.querySelector('.confirm-booking-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing Payment...';
    submitBtn.disabled = true;
    
    // Send email with booking details
    const mailtoLink = `mailto:immarajuvasu513@gmail.com?subject=${encodeURIComponent(`New Travel Booking - ${bookingRef} - ${formData.name}`)}&body=${encodeURIComponent(bookingDetails)}`;
    window.open(mailtoLink, '_blank');
    
    // Also send to WhatsApp
    const whatsappMessage = encodeURIComponent(`🎯 NEW BOOKING ALERT!\n\n${bookingDetails}`);
    const whatsappLink = `https://wa.me/919553866278?text=${whatsappMessage}`;
    setTimeout(() => {
        window.open(whatsappLink, '_blank');
    }, 1000);
    
    // Show payment confirmation modal
    setTimeout(() => {
        // Set booking reference in modal
        document.getElementById('booking-ref').textContent = bookingRef;
        
        // Close booking modal and show payment confirmation
        bookingModal.style.display = 'none';
        paymentModal.style.display = 'block';
        
        // Reset form and cart
        bookingForm.reset();
        clearCart();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Reset payment method selection
        paymentDetailsDiv.style.display = 'none';
    }, 2000);
});

// Close payment modal handler
document.querySelector('.close-payment-btn').addEventListener('click', () => {
    paymentModal.style.display = 'none';
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
    if (e.target === bookingModal) {
        bookingModal.style.display = 'none';
    }
    if (e.target === paymentModal) {
        paymentModal.style.display = 'none';
    }
});

// Add to cart button functionality
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const destination = btn.getAttribute('data-destination');
        const price = btn.getAttribute('data-price');
        const duration = btn.getAttribute('data-duration');
        addToCart(destination, price, duration);
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.destination-card, .about-text, .about-image').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// CTA Button click handler
document.querySelector('.cta-button').addEventListener('click', () => {
    document.querySelector('#destinations').scrollIntoView({
        behavior: 'smooth'
    });
});

// Add loading effect to images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', () => {
        img.style.opacity = '1';
    });
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add hover effects to stats
document.querySelectorAll('.stat').forEach(stat => {
    stat.addEventListener('mouseenter', () => {
        stat.style.transform = 'scale(1.05)';
        stat.style.transition = 'transform 0.3s ease';
    });
    
    stat.addEventListener('mouseleave', () => {
        stat.style.transform = 'scale(1)';
    });
});