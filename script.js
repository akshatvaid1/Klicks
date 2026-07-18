// Klicks AI - Interactive Scripting

/* ==========================================================================
   FORM SUBMISSION CONFIGURATION
   Configure where you want to receive form submissions:
   - 'simulation': Displays the success message instantly (for testing)
   - 'web3forms': Sends submissions to your email via Web3Forms (No server required)
   - 'formspree': Sends submissions to your email via Formspree (No server required)
   ========================================================================== */
const FORM_CONFIG = {
    provider: 'web3forms', // Change to 'web3forms' or 'formspree' when ready
    
    // Get your free Web3Forms Access Key from: https://web3forms.com/
    web3forms_access_key: 'f89bea2a-1f85-4fce-b4ef-05417b966d1d',
    
    // Create a form at https://formspree.io/ and paste your form ID or full URL below
    formspree_url: 'https://formspree.io/f/YOUR_FORMSPREE_ID_HERE'
};

// Add js-enabled class to HTML element once script loads
document.documentElement.classList.add('js-enabled');

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. MOBILE NAV MENU TOGGLE
       ========================================================================== */
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const mobileMenu = document.querySelector('.mobile-nav-menu');
    const header = document.querySelector('.navbar');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    // Scroll Navbar Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('navbar-scrolled');
        } else {
            header.classList.remove('navbar-scrolled');
        }
    });


    /* ==========================================================================
       2. SCROLL REVEAL (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop tracking once revealed
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(element => {
        revealOnScroll.observe(element);
    });





    /* ==========================================================================
       4. INTERACTIVE PLAYGROUND (CHATBOT SIMULATOR)
       ========================================================================== */
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // Bot Knowledge Base
    const botResponses = {
        services: "We design and build custom business automation systems:\n• 📞 <b>Voice & Call Automation:</b> AI phone receptionists that qualify leads and book client appointments 24/7.\n• ⚙️ <b>Workflow & CRM Automation:</b> Seamless data pipelines syncing spreadsheets, leads, and calendar events.\n• 📂 <b>Internal Knowledge Bases:</b> Private, secure database assistants trained directly on your company files.",
        timeline: "Implementation is structured into predictable phases:\n• 🔍 <b>Operational Audits:</b> Performed in the first week.\n• 🛠️ <b>System Synthesis & Integration:</b> Completed within 3 to 5 weeks.\n• 🚀 <b>Deployment & Optimization:</b> Active in week 6.",
        pricing: "We quote custom projects based on operational value:\n• 📞 <b>Single Workflow Automations:</b> Start at ₹4,00,000.\n• ⚙️ <b>Comprehensive AI Operating Systems:</b> Start at ₹12,00,000.\n• 🏢 <b>Enterprise Deployments:</b> Custom structures from ₹30,00,000.",
        default: "Our custom operating systems are designed to resolve that exact operational bottleneck. By connecting directly to your active tools and databases, we eliminate manual work. Let us map out a custom blueprint for your business in a 20-minute audit below."
    };

    if (chatForm && chatInput && chatMessages) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const messageText = chatInput.value.trim();
            if (!messageText) return;

            // User Message
            appendMessage(messageText, 'user');
            chatInput.value = '';

            // Bot response simulation
            simulateBotResponse(messageText);
        });
    }

    // Expose sendSuggestion to global scope
    window.sendSuggestion = function(text) {
        if (!chatInput) return;
        appendMessage(text, 'user');
        simulateBotResponse(text);
    };

    function appendMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        contentDiv.innerHTML = text.replace(/\n/g, '<br>');
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function simulateBotResponse(userMessage) {
        // Show Typing Indicator
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot-message', 'typing-indicator-msg');
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-loader">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        const cleanMsg = userMessage.toLowerCase();
        let responseText = botResponses.default;

        // Simple Routing Logic
        if (cleanMsg.includes('service') || cleanMsg.includes('what you build') || cleanMsg.includes('do you do')) {
            responseText = botResponses.services;
        } else if (cleanMsg.includes('time') || cleanMsg.includes('how long') || cleanMsg.includes('duration')) {
            responseText = botResponses.timeline;
        } else if (cleanMsg.includes('price') || cleanMsg.includes('cost') || cleanMsg.includes('estimate') || cleanMsg.includes('budget')) {
            responseText = botResponses.pricing;
        }

        // Simulate network latency (1.2 seconds)
        setTimeout(() => {
            // Remove typing indicator
            const typingIndicator = document.querySelector('.typing-indicator-msg');
            if (typingIndicator) typingIndicator.remove();

            // Append bot message
            appendMessage(responseText, 'bot');
        }, 1200);
    }


    /* ==========================================================================
       5. CONTACT FORM SYSTEM SUBMIT (REAL INTEGRATION)
       ========================================================================== */
    const projectForm = document.getElementById('project-form');
    const successContainer = document.getElementById('form-success');

    if (projectForm && successContainer) {
        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = projectForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span>Transmitting Project Brief...</span>
                <div class="typing-loader" style="display:inline-flex; margin-left:8px;">
                    <span style="background-color:var(--bg-primary); width:4px; height:4px;"></span>
                    <span style="background-color:var(--bg-primary); width:4px; height:4px;"></span>
                    <span style="background-color:var(--bg-primary); width:4px; height:4px;"></span>
                </div>
            `;

            // 1. Simulation Provider
            if (FORM_CONFIG.provider === 'simulation') {
                setTimeout(() => {
                    projectForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    successContainer.classList.add('active');
                }, 1500);
            } 
            
            // 2. Web3Forms Provider
            else if (FORM_CONFIG.provider === 'web3forms') {
                const formData = new FormData(projectForm);
                formData.append('access_key', FORM_CONFIG.web3forms_access_key);
                formData.append('subject', 'New Klicks AI Audit Request');
                formData.append('from_name', 'Klicks AI Website');

                fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                })
                .then(async (response) => {
                    const result = await response.json();
                    if (response.status === 200) {
                        projectForm.reset();
                        successContainer.classList.add('active');
                    } else {
                        console.error('Web3Forms Error:', result);
                        alert(result.message || 'Error sending form submission.');
                    }
                })
                .catch(error => {
                    console.error('Form Submit Error:', error);
                    alert('Failed to submit form. Please check your connection and try again.');
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                });
            } 
            
            // 3. Formspree Provider
            else if (FORM_CONFIG.provider === 'formspree') {
                const formData = new FormData(projectForm);
                const data = {};
                formData.forEach((value, key) => data[key] = value);

                fetch(FORM_CONFIG.formspree_url, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        projectForm.reset();
                        successContainer.classList.add('active');
                    } else {
                        response.json().then(data => {
                            console.error('Formspree Error:', data);
                            alert('Error sending form submission: ' + (data.errors ? data.errors.map(e => e.message).join(', ') : 'Unknown error'));
                        });
                    }
                })
                .catch(error => {
                    console.error('Form Submit Error:', error);
                    alert('Failed to submit form. Please check your connection and try again.');
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                });
            }
        });
    }

    /* ==========================================================================
       6. SCROLL-DRIVEN 3D BACKGROUND INTERACTION
       ========================================================================== */
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight <= 0) return;
        const scrollPercent = window.scrollY / scrollHeight;
        
        if (window.spline) {
            const sphere = window.spline.findObjectByName('Sphere');
            if (sphere) {
                sphere.rotation.y = scrollPercent * Math.PI * 1.5;
                sphere.rotation.x = scrollPercent * Math.PI * 0.4;
            }
        }
    });

    /* ==========================================================================
       ROI / SAVINGS CALCULATOR LOGIC
       ========================================================================== */
    const leadsRange = document.getElementById('leads-range');
    const wageRange = document.getElementById('wage-range');
    const leadsVal = document.getElementById('leads-val');
    const wageVal = document.getElementById('wage-val');
    const hoursSaved = document.getElementById('hours-saved');
    const moneySaved = document.getElementById('money-saved');
    const conversionBoost = document.getElementById('conversion-boost');

    function updateCalculator() {
        if (!leadsRange || !wageRange) return;
        const leads = parseInt(leadsRange.value, 10);
        const wage = parseInt(wageRange.value, 10);

        const hours = Math.round(leads * 0.5);
        const money = hours * wage;
        const boost = Math.min(42, Math.max(22, Math.round(20 + (leads / 200))));

        if (leadsVal) leadsVal.textContent = leads.toLocaleString();
        if (wageVal) wageVal.textContent = `$${wage}`;
        if (hoursSaved) hoursSaved.textContent = `${hours} hrs`;
        if (moneySaved) moneySaved.textContent = `$${money.toLocaleString()}`;
        if (conversionBoost) conversionBoost.textContent = `+${boost}%`;
    }

    if (leadsRange && wageRange) {
        leadsRange.addEventListener('input', updateCalculator);
        wageRange.addEventListener('input', updateCalculator);
        updateCalculator();
    }

    /* ==========================================================================
       FAQ ACCORDION CONTROLLER
       ========================================================================== */
    const faqToggles = document.querySelectorAll('.faq-toggle');

    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const faqItem = toggle.closest('.faq-item');
            const faqCollapse = faqItem.querySelector('.faq-collapse');
            const isActive = faqItem.classList.contains('faq-open');

            // Close all other FAQ items for a clean single-open accordion feel
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('faq-open');
                const collapse = item.querySelector('.faq-collapse');
                if (collapse) {
                    collapse.style.maxHeight = '0px';
                }
                const btn = item.querySelector('.faq-toggle');
                if (btn) {
                    btn.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            if (!isActive) {
                faqItem.classList.add('faq-open');
                toggle.setAttribute('aria-expanded', 'true');
                if (faqCollapse) {
                    faqCollapse.style.maxHeight = faqCollapse.scrollHeight + 'px';
                }
            }
        });
    });

    /* ==========================================================================
       7. FOUNDER PROFILE SELECTOR TRIGGER
       ========================================================================== */
    const akshatProfileBtn = document.querySelector('#profile-akshat .profile-avatar-btn');
    const founderDetailsCard = document.getElementById('founder-details');

    if (akshatProfileBtn && founderDetailsCard) {
        akshatProfileBtn.addEventListener('click', () => {
            founderDetailsCard.classList.toggle('active');
            
            // Smoothly scroll to the details if opening
            if (founderDetailsCard.classList.contains('active')) {
                setTimeout(() => {
                    founderDetailsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        });
    }

});
