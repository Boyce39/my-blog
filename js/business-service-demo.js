(() => {
  'use strict';

  function initialize(root) {
    if (root.dataset.demoReady === 'true') return;
    const service = root.dataset.serviceDemo;
    if (!['website', 'pos', 'tools'].includes(service)) return;
    const find = selector => root.querySelector(selector);
    const findAll = selector => Array.from(root.querySelectorAll(selector));
    const payload = find('[data-demo-data]');
    let catalog;
    try { catalog = JSON.parse(payload.textContent); } catch { return; }
    if (!catalog[service] || !Array.isArray(catalog.locales)) return;

    const locales = ['zh-TW', 'en', 'ja', 'ko'];
    const words = catalog[service];
    const controls = find('[data-demo-controls]');
    const feedback = find('[data-demo-feedback]');
    const feedbackText = find('[data-demo-feedback-text]');
    let locale = locales.includes(window.BoyceI18n?.locale) ? window.BoyceI18n.locale : 'zh-TW';
    let feedbackKey = 'common.ready';
    let feedbackKind = 'ready';
    let previewTimer;
    let fieldError = '';
    const website = { brandEdited: false, headlineEdited: false, style: 'clarity', device: 'desktop' };
    const basket = new Map();
    let receipt = null;
    let saleNumber = 0;
    let tasks = [];
    let nextTaskId = 1;
    const actionNames = new Set(['preview', 'booking', 'inquiry', 'cart_add', 'cart_update', 'cart_remove', 'checkout', 'reset', 'task_add', 'task_update', 'task_complete', 'task_delete']);

    function text(value) {
      return Array.isArray(value) ? value[locales.indexOf(locale)] || value[0] : String(value ?? '');
    }

    function copy(key) {
      return text(key.split('.').reduce((value, part) => value?.[part], catalog));
    }

    function write(element, value) {
      if (element && element.textContent !== String(value)) element.textContent = String(value);
    }

    function make(tag, className, value) {
      const element = document.createElement(tag);
      if (className) element.className = className;
      if (value !== undefined) element.textContent = String(value);
      return element;
    }

    function actionButton(action, label, attributes = {}, className = '') {
      const button = make('button', className, label);
      button.type = 'button';
      button.dataset.demoAction = action;
      Object.entries(attributes).forEach(([key, value]) => { button.dataset[key] = String(value); });
      return button;
    }

    function emit(action) {
      if (actionNames.has(action)) window.dispatchEvent(new CustomEvent('boycelab:demoaction', { detail: { service, action } }));
    }

    function announce(key, kind = 'success') {
      feedbackKey = key;
      feedbackKind = kind;
      feedback.dataset.state = kind;
      write(feedbackText, copy(key));
    }

    function renderCopy() {
      root.lang = locale;
      findAll('[data-demo-copy]').forEach(element => {
        const target = element.querySelector('[data-growth-copy]') || element;
        write(target, copy(element.dataset.demoCopy));
      });
      findAll('[data-demo-label]').forEach(element => { element.setAttribute('aria-label', copy(element.dataset.demoLabel)); });
      announce(feedbackKey, feedbackKind);
    }

    function money(amount) {
      const safeAmount = Number.isFinite(amount) && amount >= 0 ? Math.round(amount) : 0;
      return 'NT$' + new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(safeAmount);
    }

    function quantity(value) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? Math.min(99, Math.max(0, Math.trunc(parsed))) : 0;
    }

    function focusButton(action, key, value) {
      const target = findAll('[data-demo-action]').find(button => button.dataset.demoAction === action && (!key || button.dataset[key] === String(value)) && !button.disabled && !button.closest('[hidden]'));
      if (target) target.focus({ preventScroll: true });
      return Boolean(target);
    }

    function rememberFocus() {
      const focused = document.activeElement;
      if (!focused || !root.contains(focused)) return null;
      return { action: focused.dataset.demoAction, product: focused.dataset.demoProduct, task: focused.dataset.demoTask, status: focused.dataset.demoTaskStatus };
    }

    function restoreFocus(previous) {
      if (!previous) return;
      if (previous.product && previous.action) {
        if (!focusButton(previous.action, 'demoProduct', previous.product)) focusButton('cart_add', 'demoProduct', previous.product);
      } else if (previous.task) {
        if (previous.status) {
          const select = findAll('[data-demo-task-status]').find(element => element.dataset.demoTask === previous.task);
          if (select) select.focus({ preventScroll: true });
          else find('[data-demo-task-input]')?.focus({ preventScroll: true });
        } else if (!focusButton(previous.action, 'demoTask', previous.task)) {
          find('[data-demo-task-input]')?.focus({ preventScroll: true });
        }
      }
    }

    function renderWebsite() {
      const brand = find('[data-demo-brand]');
      const headline = find('[data-demo-headline]');
      if (!website.brandEdited) brand.value = text(words.brandDefault);
      if (!website.headlineEdited) headline.value = text(words.headlineDefault);
      write(find('[data-demo-brand-output]'), brand.value.trim() || text(words.brandDefault));
      write(find('[data-demo-headline-output]'), headline.value.trim() || text(words.headlineDefault));
      find('[data-demo-preview]').dataset.style = website.style;
      find('[data-demo-preview]').dataset.device = website.device;
      find('[data-demo-device-stage]').dataset.demoDeviceStage = website.device;
      findAll('[data-demo-style]').forEach(button => { button.setAttribute('aria-pressed', String(button.dataset.demoStyle === website.style)); });
      findAll('[data-demo-device]').forEach(button => { button.setAttribute('aria-pressed', String(button.dataset.demoDevice === website.device)); });
    }

    function productById(productId) {
      return words.products.find(product => product.id === productId);
    }

    function basketItems() {
      return words.products.flatMap(product => {
        const count = quantity(basket.get(product.id));
        return count ? [{ id: product.id, quantity: count }] : [];
      });
    }

    function amountFor(items) {
      return items.reduce((total, item) => total + productById(item.id).price * quantity(item.quantity), 0);
    }

    function renderReceipt() {
      const items = find('[data-demo-receipt-items]');
      items.replaceChildren();
      if (!receipt) return;
      write(find('[data-demo-receipt-reference]'), 'DEMO-' + String(receipt.number).padStart(4, '0'));
      receipt.items.forEach(item => {
        const product = productById(item.id);
        const row = make('li');
        row.append(make('span', '', text(product.name) + ' × ' + item.quantity), make('span', '', money(product.price * item.quantity)));
        items.append(row);
      });
      write(find('[data-demo-receipt-total]'), money(amountFor(receipt.items)));
    }

    function renderBasket(preserveFocus = false) {
      const previous = preserveFocus ? rememberFocus() : null;
      const items = basketItems();
      const count = items.reduce((total, item) => total + item.quantity, 0);
      const list = find('[data-demo-cart]');
      list.replaceChildren();
      items.forEach(item => {
        const product = productById(item.id);
        const productName = text(product.name);
        const row = make('li', 'sd-cart-row');
        row.dataset.demoCartItem = product.id;
        const title = make('div', 'sd-cart-item-title');
        title.append(make('strong', '', productName), make('span', '', money(product.price * item.quantity)));
        const group = make('div', 'sd-quantity-controls');
        group.setAttribute('role', 'group');
        group.setAttribute('aria-label', productName + ' · ' + copy('common.quantity'));
        const decrease = actionButton('cart_decrease', '−', { demoProduct: product.id });
        decrease.setAttribute('aria-label', copy('common.decrease') + ' · ' + productName);
        const countOutput = make('output', '', item.quantity);
        countOutput.dataset.demoQuantity = product.id;
        countOutput.setAttribute('aria-label', copy('common.quantity') + ' · ' + productName);
        const increase = actionButton('cart_increase', '+', { demoProduct: product.id });
        increase.setAttribute('aria-label', copy('common.increase') + ' · ' + productName);
        const remove = actionButton('cart_remove', copy('common.remove'), { demoProduct: product.id }, 'sd-cart-delete');
        remove.setAttribute('aria-label', copy('common.delete') + ' · ' + productName);
        group.append(decrease, countOutput, increase, remove);
        row.append(title, group);
        list.append(row);
      });
      find('[data-demo-cart-empty]').hidden = items.length > 0;
      write(find('[data-demo-cart-count]'), count);
      write(find('[data-demo-item-count]'), count);
      write(find('[data-demo-total]'), money(amountFor(items)));
      find('[data-demo-action="checkout"]').disabled = !items.length;
      find('[data-demo-cart-panel]').hidden = Boolean(receipt);
      find('[data-demo-receipt]').hidden = !receipt;
      findAll('[data-demo-add-label]').forEach(button => {
        const product = productById(button.dataset.demoAddLabel);
        button.setAttribute('aria-label', text(words.add) + ' · ' + text(product.name));
      });
      renderReceipt();
      if (preserveFocus) restoreFocus(previous);
    }

    function changeBasket(action, productId) {
      const product = productById(productId);
      if (!product) return;
      const currentQuantity = quantity(basket.get(productId));
      if (action === 'cart_remove' && !currentQuantity) return;
      if (action === 'cart_decrease' && !currentQuantity) return;
      if ((action === 'cart_add' || action === 'cart_increase') && currentQuantity >= 99) {
        announce('pos.limit', 'notice');
        return;
      }
      receipt = null;
      const next = action === 'cart_remove' ? 0 : quantity(currentQuantity + (action === 'cart_decrease' ? -1 : 1));
      if (next) basket.set(productId, next);
      else basket.delete(productId);
      renderBasket(true);
      announce(!next ? 'pos.removed' : action === 'cart_add' ? 'pos.added' : 'pos.changed');
      emit(!next ? 'cart_remove' : action === 'cart_add' ? 'cart_add' : 'cart_update');
    }

    function resetTasks() {
      tasks = words.seeds.map(task => ({ id: task.id, type: task.type, status: task.status, title: task.title }));
      nextTaskId = Math.max(0, ...tasks.map(task => task.id)) + 1;
    }

    function taskName(task) {
      return Array.isArray(task.title) ? text(task.title) : task.title;
    }

    function renderTaskError() {
      const error = find('[data-demo-task-error]');
      const input = find('[data-demo-task-input]');
      error.hidden = !fieldError;
      write(error, fieldError ? copy(fieldError) : '');
      if (fieldError) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }

    function renderTasks(preserveFocus = false) {
      const previous = preserveFocus ? rememberFocus() : null;
      const counts = { todo: 0, doing: 0, done: 0 };
      findAll('[data-demo-task-list]').forEach(list => { list.replaceChildren(); });
      tasks.forEach(task => {
        counts[task.status] += 1;
        const row = make('li', 'sd-task-card');
        row.dataset.demoTaskCard = String(task.id);
        const type = words.types.find(item => item.id === task.type);
        const taskTitle = taskName(task);
        row.append(make('span', 'sd-task-type', text(type.name)), make('h5', '', taskTitle));
        const meta = make('div', 'sd-task-meta');
        const remove = actionButton('task_delete', copy('common.remove'), { demoTask: task.id });
        remove.setAttribute('aria-label', copy('common.delete') + ' · ' + taskTitle);
        meta.append(make('span', 'sd-mono', 'DEMO-' + String(task.id).padStart(3, '0')), remove);
        const status = make('select', 'sd-task-status-select');
        status.dataset.demoTaskStatus = 'true';
        status.dataset.demoTask = String(task.id);
        status.setAttribute('aria-label', text(words.statusLabel) + ' · ' + taskTitle);
        words.statuses.forEach(item => {
          const option = make('option', '', text(item.name));
          option.value = item.id;
          status.append(option);
        });
        status.value = task.status;
        const nextLabel = task.status === 'todo' ? words.start : task.status === 'doing' ? words.complete : words.reopen;
        const nextAction = task.status === 'doing' ? 'task_complete' : task.status === 'todo' ? 'task_start' : 'task_reopen';
        const next = actionButton(nextAction, text(nextLabel), { demoTask: task.id }, 'sd-button');
        next.setAttribute('aria-label', text(nextLabel) + ' · ' + taskTitle);
        row.append(meta, status, next);
        find('[data-demo-task-list="' + task.status + '"]').append(row);
      });
      words.statuses.forEach(status => {
        write(find('[data-demo-column-count="' + status.id + '"]'), counts[status.id]);
        find('[data-demo-column-empty="' + status.id + '"]').hidden = counts[status.id] > 0;
      });
      const percent = tasks.length ? Math.round(counts.done / tasks.length * 100) : 0;
      write(find('[data-demo-stat="all"]'), tasks.length);
      write(find('[data-demo-stat="doing"]'), counts.doing);
      write(find('[data-demo-stat="done"]'), counts.done);
      write(find('[data-demo-stat="progress"]'), percent + '%');
      const progress = find('[data-demo-progress]');
      progress.setAttribute('aria-valuenow', String(percent));
      progress.firstElementChild.style.width = percent + '%';
      find('[data-demo-task-input]').placeholder = text(words.placeholder);
      findAll('[data-demo-option]').forEach(option => { write(option, text(words.types[Number(option.dataset.demoOption)].name)); });
      renderTaskError();
      if (preserveFocus) restoreFocus(previous);
    }

    function updateTask(taskId, status) {
      const task = tasks.find(item => item.id === Number(taskId));
      if (!task || !words.statuses.some(item => item.id === status) || task.status === status) return;
      task.status = status;
      const previous = rememberFocus();
      renderTasks();
      restoreFocus(previous);
      if (previous?.task && !previous.status) {
        const next = findAll('[data-demo-action]').find(button => button.dataset.demoTask === previous.task && button.dataset.demoAction !== 'task_delete');
        next?.focus({ preventScroll: true });
      }
      announce(status === 'done' ? 'tools.completed' : 'tools.statusChanged');
      emit(status === 'done' ? 'task_complete' : 'task_update');
    }

    function addTask(event) {
      event.preventDefault();
      const input = find('[data-demo-task-input]');
      const title = input.value.trim().slice(0, 100);
      if (!title || tasks.length >= 30) {
        fieldError = title ? 'tools.limit' : 'tools.emptyInput';
        renderTaskError();
        announce(fieldError, 'notice');
        input.focus({ preventScroll: true });
        return;
      }
      const selectedType = find('[data-demo-task-type]').value;
      const type = words.types.some(item => item.id === selectedType) ? selectedType : words.types[0].id;
      tasks.push({ id: nextTaskId, title, type, status: 'todo' });
      nextTaskId += 1;
      input.value = '';
      fieldError = '';
      renderTasks();
      announce('tools.added');
      emit('task_add');
      input.focus({ preventScroll: true });
    }

    function reset() {
      clearTimeout(previewTimer);
      if (service === 'website') {
        Object.assign(website, { brandEdited: false, headlineEdited: false, style: 'clarity', device: 'desktop' });
        renderWebsite();
      } else if (service === 'pos') {
        basket.clear();
        receipt = null;
        saleNumber = 0;
        renderBasket();
      } else {
        resetTasks();
        find('[data-demo-task-input]').value = '';
        find('[data-demo-task-type]').value = words.types[0].id;
        fieldError = '';
        renderTasks();
      }
      announce('common.resetDone');
      emit('reset');
    }

    function handleClick(event) {
      const button = event.target.closest('button[data-demo-action]');
      if (!button || !root.contains(button) || button.disabled || controls.disabled) return;
      const action = button.dataset.demoAction;
      if (action === 'task_add') return;
      event.preventDefault();
      if (action === 'reset') { reset(); return; }
      if (service === 'website') {
        clearTimeout(previewTimer);
        if (action === 'style' && words.styles.some(style => style.id === button.dataset.demoStyle)) {
          website.style = button.dataset.demoStyle;
          renderWebsite();
          announce('website.styleChanged');
          emit('preview');
        } else if (action === 'device' && ['desktop', 'mobile'].includes(button.dataset.demoDevice)) {
          website.device = button.dataset.demoDevice;
          renderWebsite();
          announce(website.device === 'mobile' ? 'website.mobileChanged' : 'website.desktopChanged');
          emit('preview');
        } else if (action === 'booking' || action === 'inquiry') {
          announce(action === 'booking' ? 'website.bookingResult' : 'website.inquiryResult');
          emit(action);
        }
      } else if (service === 'pos') {
        if (['cart_add', 'cart_increase', 'cart_decrease', 'cart_remove'].includes(action)) {
          changeBasket(action, button.dataset.demoProduct);
        } else if (action === 'checkout') {
          const items = basketItems();
          if (!items.length) { announce('pos.emptyCheckout', 'notice'); return; }
          saleNumber += 1;
          receipt = { number: saleNumber, items };
          basket.clear();
          renderBasket();
          announce('pos.checkedOut');
          find('[data-demo-receipt]').focus({ preventScroll: true });
          emit('checkout');
        } else if (action === 'new_sale') {
          basket.clear();
          receipt = null;
          renderBasket();
          announce('common.resetDone');
          focusButton('cart_add');
          emit('reset');
        }
      } else {
        const task = tasks.find(item => item.id === Number(button.dataset.demoTask));
        if (!task) return;
        if (action === 'task_delete') {
          tasks = tasks.filter(item => item.id !== task.id);
          renderTasks();
          find('[data-demo-task-input]').focus({ preventScroll: true });
          announce('tools.removed');
          emit('task_delete');
        } else if (action === 'task_start' || action === 'task_complete' || action === 'task_reopen') {
          updateTask(task.id, action === 'task_start' ? 'doing' : action === 'task_complete' ? 'done' : 'todo');
        }
      }
    }

    function renderLocale(nextLocale) {
      if (locales.includes(nextLocale)) locale = nextLocale;
      renderCopy();
      if (service === 'website') renderWebsite();
      else if (service === 'pos') renderBasket(true);
      else renderTasks(true);
    }

    root.addEventListener('click', handleClick);
    root.addEventListener('input', event => {
      if (service === 'website' && (event.target.matches('[data-demo-brand]') || event.target.matches('[data-demo-headline]'))) {
        if (event.target.matches('[data-demo-brand]')) website.brandEdited = true;
        else website.headlineEdited = true;
        renderWebsite();
        clearTimeout(previewTimer);
        previewTimer = setTimeout(() => { announce('website.previewUpdated'); emit('preview'); }, 450);
      } else if (service === 'tools' && event.target.matches('[data-demo-task-input]') && fieldError) {
        fieldError = '';
        renderTaskError();
      }
    });
    if (service === 'tools') {
      resetTasks();
      find('[data-demo-task-form]').addEventListener('submit', addTask);
      root.addEventListener('change', event => {
        if (event.target.matches('[data-demo-task-status]')) updateTask(event.target.dataset.demoTask, event.target.value);
      });
    }
    window.addEventListener('boycelab:languagechange', event => {
      const nextLocale = event.detail?.locale || window.BoyceI18n?.locale;
      queueMicrotask(() => renderLocale(nextLocale));
    });
    controls.disabled = false;
    root.dataset.demoReady = 'true';
    renderLocale(locale);
  }

  function boot() {
    document.querySelectorAll('[data-service-demo]').forEach(initialize);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
