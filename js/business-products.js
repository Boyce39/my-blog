(() => {
  'use strict';
  if (!location.pathname.startsWith('/business/')) return;
  const tabs = Array.from(document.querySelectorAll('[data-workflow-tab]'));
  function selectTab(selected,focus) {
    tabs.forEach(tab => {
      const active = tab === selected;
      tab.setAttribute('aria-selected',String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    document.querySelectorAll('[data-workflow-panel]').forEach(panel => { panel.hidden = panel.dataset.workflowPanel !== selected.dataset.workflowTab; });
    if (focus) selected.focus();
  }
  tabs.forEach((tab,index) => {
    tab.addEventListener('click',() => selectTab(tab,false));
    tab.addEventListener('keydown',event => {
      const target = event.key === 'ArrowRight' ? (index+1)%tabs.length : event.key === 'ArrowLeft' ? (index-1+tabs.length)%tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length-1 : -1;
      if (target < 0) return;
      event.preventDefault();
      selectTab(tabs[target],true);
    });
  });
})();
