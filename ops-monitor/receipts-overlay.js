'use strict';
function applyVerifiedReceipts(html, receipt) {
  if (!receipt || receipt.schema_version !== 1 || receipt.kind !== 'boycelab_verified_mail_receipts' || receipt.sender !== 'inbox@boycelab.com' || !/^\d{4}-\d{2}-\d{2}$/.test(receipt.business_date) || !Number.isFinite(Date.parse(receipt.checked_at)) || !Array.isArray(receipt.events) || receipt.events.length > 100) throw Error('receipt format');
  const match = /<script id="initial-data" type="application\/json">([\s\S]*?)<\/script>/.exec(html);
  if (!match) throw Error('dashboard data');
  const data = JSON.parse(match[1]);
  if (data.schema_version !== 1 || !data.daily || !data.metrics || !Array.isArray(data.contacts)) throw Error('dashboard schema');
  if (data.daily.date !== receipt.business_date) return html;
  const byCompany = new Map(), messageIds = new Set();
  for (const event of receipt.events) {
    if (!event || typeof event.contact_id !== 'string' || !/^[A-Za-z0-9_-]{1,80}$/.test(event.contact_id) || typeof event.company !== 'string' || event.company.length > 150 || !/^[a-f0-9]{12,64}$/.test(event.message_id) || event.thread_id !== event.message_id || event.status !== 'sent_verified' || event.sender_copy_read !== true || !Number.isFinite(Date.parse(event.sent_at))) throw Error('event validation');
    const day = new Date(Date.parse(event.sent_at) + 8*3600000).toISOString().slice(0,10);
    if (day !== receipt.business_date || Date.parse(event.sent_at) > Date.parse(receipt.checked_at)) throw Error('event time');
    if (!byCompany.has(event.contact_id) && !messageIds.has(event.message_id)) { byCompany.set(event.contact_id,event); messageIds.add(event.message_id); }
  }
  const n = byCompany.size;
  const numeric = x => Number.isFinite(x) && x >= 0 ? x : 0;
  data.daily.outreach_observed = Math.max(numeric(data.daily.outreach_observed),n);
  const target = numeric(data.daily.outreach_target) || 50;
  data.daily.remaining = Math.max(0,target-data.daily.outreach_observed);
  data.daily.outreach_count_kind = 'sender_receipt_reconciled_minimum';
  data.daily.date_scope_note = '寄件回執獨立核對：'+receipt.checked_at+'；是已寄出證據，不代表送達、閱讀或成交。';
  data.metrics.first_contact_emails_sent_to_prospects = Math.max(numeric(data.metrics.first_contact_emails_sent_to_prospects),n);
  for (const event of byCompany.values()) {
    let contact=data.contacts.find(c=>c.id===event.contact_id);
    if (!contact) { contact={id:event.contact_id,company:event.company,reply_confirmed:null,need_confirmed:null,delivery_confirmed:null};data.contacts.push(contact); }
    contact.sent_at=event.sent_at;
    contact.sent_message_id=event.message_id;
    contact.sent_verified=true;
    if (!contact.reply_confirmed && !contact.need_confirmed && !contact.rejected && !contact.opted_out) {
      contact.status='已寄出・回執已核實';
      contact.next_step='不可重寄首次信；只依實際回覆推進下一步。';
    }
    contact.source_url='https://mail.google.com/mail/u/?authuser=inbox%40boycelab.com#all/'+event.message_id;
  }
  data.summary='已核實實寄至少 '+data.daily.outreach_observed+'/'+target+' 家；寄件回執已對帳，研究與代理狀態仍依原台帳。';
  data.receipt_reconciliation={checked_at:receipt.checked_at,business_date:receipt.business_date,known_distinct_companies:n,source:'Gmail sender message readback',codex_source_commit_unchanged:data.source_commit};
  const serialized=JSON.stringify(data).replace(/</g,'\\u003c');
  return html.slice(0,match.index)+'<script id="initial-data" type="application/json">'+serialized+'</script>'+html.slice(match.index+match[0].length);
}
