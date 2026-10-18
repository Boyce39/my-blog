(() => {
  'use strict';
  if (!location.pathname.startsWith('/business/')) return;
  const demo = document.querySelector('[data-demo]');
  if (!demo) return;
  demo.querySelectorAll('[data-brand-choice]').forEach(button => button.addEventListener('click',() => {
    demo.querySelectorAll('[data-brand-choice]').forEach(choice => choice.setAttribute('aria-pressed',String(choice === button)));
    demo.querySelectorAll('[data-brand-description]').forEach(description => { description.hidden = description.dataset.brandDescription !== button.dataset.brandChoice; });
  }));
  const booking = document.getElementById('demo-booking-form');
  function updateBooking() {
    if (!booking) return;
    document.getElementById('demo-booking-selection').textContent = booking.elements.service.selectedOptions[0].textContent+' · '+booking.elements.slot.selectedOptions[0].textContent;
  }
  booking?.addEventListener('submit',event => {
    event.preventDefault();
    updateBooking();
    document.getElementById('demo-booking-result').hidden = false;
  });
  booking?.addEventListener('change',updateBooking);
  window.addEventListener('boycelab:languagechange',() => queueMicrotask(updateBooking));
  const category = document.getElementById('demo-category');
  category?.addEventListener('change',() => {
    demo.querySelectorAll('[data-product-type]').forEach(product => { product.hidden = category.value !== 'all' && product.dataset.productType !== category.value; });
  });
  demo.querySelectorAll('[data-product]').forEach(button => button.addEventListener('click',() => {
    const selected = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed',String(selected));
    button.querySelector('[data-product-add]').hidden = selected;
    button.querySelector('[data-product-remove]').hidden = !selected;
    button.querySelector('[data-product-symbol]').textContent = selected ? '−' : '+';
    demo.querySelector('[data-selected-product="'+button.dataset.product+'"]').hidden = !selected;
    demo.querySelector('[data-list-empty]').hidden = Boolean(demo.querySelector('[data-product][aria-pressed="true"]'));
  }));
})();
