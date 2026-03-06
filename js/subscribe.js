document.addEventListener('DOMContentLoaded', () => {
    // Create Modal HTML and append to body (only once)
    const modalHTML = `
        <div id="tech-subscribe-modal" class="tech-modal-overlay">
            <div class="tech-modal-content">
                <div class="tech-modal-header">
                    <span class="tech-modal-title">System Message [BoyceLab]</span>
                    <button class="tech-modal-close">&times;</button>
                </div>
                <div class="tech-modal-body">
                    <i class="fa-solid fa-satellite-dish" style="color: #00d4ff; font-size: 3rem; margin-bottom: 20px; animation: pulse 2s infinite;"></i>
                    <h3 style="color: #ffffff; font-family: 'Orbitron', monospace; margin: 0 0 10px;">訂閱成功 / Subscribed</h3>
                    <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6;">感謝您的訂閱！系統已將您的信箱加入接收清單。<br>您將會不定期收到來自 Boyce Lab 的最新技術筆記、AI 研究與資安見解。敬請持續關注！</p>
                </div>
                <div class="tech-modal-footer">
                    <button class="tech-modal-btn">確認 (ACK)</button>
                </div>
            </div>
        </div>
        <style>
            .tech-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
                z-index: 9999; display: flex; align-items: center; justify-content: center;
                opacity: 0; visibility: hidden; transition: all 0.3s ease;
            }
            .tech-modal-overlay.active { opacity: 1; visibility: visible; }
            .tech-modal-content {
                background: linear-gradient(135deg, rgba(16, 23, 31, 0.9) 0%, rgba(10, 15, 20, 0.95) 100%);
                border: 1px solid var(--border); border-radius: 12px;
                width: 90%; max-width: 450px; overflow: hidden;
                box-shadow: 0 0 30px rgba(0, 212, 255, 0.15);
                transform: scale(0.95); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            html[theme='light'] .tech-modal-content {
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 248, 250, 0.98) 100%);
            }
            html[theme='light'] .tech-modal-body h3 { color: #1e293b !important; }
            html[theme='light'] .tech-modal-body p { color: #475569 !important; }
            .tech-modal-overlay.active .tech-modal-content { transform: scale(1); }
            .tech-modal-header {
                display: flex; justify-content: space-between; align-items: center;
                padding: 12px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                background: rgba(0, 0, 0, 0.2);
            }
            html[theme='light'] .tech-modal-header { border-bottom: 1px solid rgba(0, 0, 0, 0.05); background: rgba(255, 255, 255, 0.5); }
            .tech-modal-title { font-family: 'Orbitron', monospace; font-size: 0.85rem; color: #00d4ff; }
            .tech-modal-close {
                background: none; border: none; color: #cbd5e1; font-size: 1.5rem;
                cursor: pointer; transition: color 0.3s ease; line-height: 1; padding: 0; margin: 0;
            }
            .tech-modal-close:hover { color: #ff6b6b; }
            .tech-modal-body { padding: 35px 25px; text-align: center; }
            .tech-modal-footer {
                padding: 15px 20px; display: flex; justify-content: center;
                border-top: 1px solid rgba(255, 255, 255, 0.05); background: rgba(0, 0, 0, 0.2);
            }
            html[theme='light'] .tech-modal-footer { border-top: 1px solid rgba(0, 0, 0, 0.05); background: rgba(255, 255, 255, 0.5); }
            .tech-modal-btn {
                background: #00d4ff; color: #050810; border: none; border-radius: 6px;
                padding: 10px 30px; font-family: 'Orbitron', monospace; font-weight: 700;
                cursor: pointer; transition: all 0.3s ease; font-size: 0.9rem;
            }
            .tech-modal-btn:hover { box-shadow: 0 0 15px rgba(0, 212, 255, 0.4); transform: translateY(-1px); }
        </style>
    `;
    if (!document.getElementById('tech-subscribe-modal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const modal = document.querySelector('#tech-subscribe-modal');
    const closeBtn = modal.querySelector('.tech-modal-close');
    const ackBtn = modal.querySelector('.tech-modal-btn');

    const closeModal = () => { modal.classList.remove('active'); };
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (ackBtn) ackBtn.addEventListener('click', closeModal);
});

// Use Event Delegation to catch ALL clicks on the subscribe button globally
document.addEventListener('click', (e) => {
    // Find if the clicked element or its parent is the submit button for our form
    const submitBtn = e.target.closest('button.sib-form-block__button');
    if (!submitBtn) return;

    const formId = submitBtn.getAttribute('form');
    const form = document.getElementById(formId);

    // Check if it's our target form
    if (form && form.classList.contains('boyce-subscribe-form')) {
        e.preventDefault(); // Stop default button submit and jump

        const modal = document.querySelector('#tech-subscribe-modal');
        if (!modal) return; // Fallback if modal isn't ready

        // Basic validation
        const emailInput = form.querySelector('input[name="EMAIL"]');
        if (emailInput && !emailInput.value) {
            emailInput.focus();
            return;
        }

        // Change button state
        submitBtn.dataset.originalText = submitBtn.innerText;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        const formData = new FormData(form);
        const actionUrl = form.getAttribute('action');

        fetch(actionUrl, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // Prevent CORS blocked request. Brevo receives the submission silently.
        }).then(() => {
            modal.classList.add('active'); // Show modal success!
            form.reset();
            submitBtn.innerText = submitBtn.dataset.originalText;
            submitBtn.disabled = false;
        }).catch(err => {
            console.error('Subscription error', err);
            modal.classList.add('active');
            form.reset();
            submitBtn.innerText = submitBtn.dataset.originalText;
            submitBtn.disabled = false;
        });
    }
});
