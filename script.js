// ===== Google Apps Script URL =====
var SHEET_URL = 'https://script.google.com/macros/s/AKfycby1WZv2bhWrgTw9huDmZhR-cuQTuSkG1AYgNqsvj12Y7CpPo6oQm6XEV1cjjwrqZU4h/exec';
 
// ===== العدادات =====
var counts = { persons: 1, times: 1 };
var mins   = { persons: 1, times: 1 };
var maxs   = { persons: 4, times: 30 };
 
function change(key, delta) {
  counts[key] = Math.min(maxs[key], Math.max(mins[key], counts[key] + delta));
  document.getElementById(key + '-val').textContent = counts[key];
}
 
// ===== تحويل الوقت =====
function fmt(t) {
  if (!t) return '';
  var p = t.split(':');
  var h = parseInt(p[0]);
  var m = p[1];
  var ampm = h >= 12 ? 'م' : 'ص';
  h = h % 12 || 12;
  return h + ':' + m + ' ' + ampm;
}
 
// ===== إظهار الأخطاء =====
function setError(id, has) {
  var inp = document.getElementById(id);
  var err = document.getElementById('err-' + id);
  if (inp) {
    if (has) inp.classList.add('error');
    else inp.classList.remove('error');
  }
  if (err) err.style.display = has ? 'block' : 'none';
}
 
// ===== إرسال الفورم =====
function submitForm() {
  var name  = document.getElementById('name').value.trim();
  var phone = document.getElementById('phone').value.trim().replace(/\s/g, '');
  var from  = document.getElementById('from').value.trim();
  var to    = document.getElementById('to').value.trim();
  var tFrom = document.getElementById('time-from').value;
  var tTo   = document.getElementById('time-to').value;
  var notes = document.getElementById('notes').value.trim();
 
  // التحقق
  var valid = true;
 
  setError('name', !name);
  if (!name) valid = false;
 
  var phoneOk = /^0\d{9,10}$/.test(phone);
  setError('phone', !phoneOk);
  if (!phoneOk) valid = false;
 
  setError('from', !from);
  if (!from) valid = false;
 
  setError('to', !to);
  if (!to) valid = false;
 
  var timeErr = tFrom && tTo && tFrom >= tTo;
  document.getElementById('err-time').style.display = timeErr ? 'block' : 'none';
  if (timeErr) valid = false;
 
  if (!valid) return;
 
  // Loading state
  var btn     = document.getElementById('submit-btn');
  var spinner = document.getElementById('spinner');
  btn.disabled = true;
  btn.textContent = 'جاري الإرسال...';
  if (spinner) spinner.style.display = 'inline-block';
 
  // البيانات
  var data = {
    name:     name,
    phone:    phone,
    from:     from,
    to:       to,
    persons:  counts.persons,
    times:    counts.times,
    timeFrom: fmt(tFrom),
    timeTo:   fmt(tTo),
    notes:    notes
  };
 
  // الإرسال للشيت
  fetch(SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(function() {
    document.getElementById('form-area').style.display = 'none';
    document.getElementById('success-box').style.display = 'block';
  })
  .catch(function() {
    btn.disabled = false;
    btn.textContent = 'إرسال الطلب';
    alert('حصل خطأ، حاول تاني من فضلك');
  });
}
 
// ===== إعادة تعيين الفورم =====
function resetForm() {
  document.getElementById('name').value      = '';
  document.getElementById('phone').value     = '';
  document.getElementById('from').value      = '';
  document.getElementById('to').value        = '';
  document.getElementById('notes').value     = '';
  document.getElementById('time-from').value = '08:00';
  document.getElementById('time-to').value   = '09:00';
 
  counts.persons = 1;
  counts.times   = 1;
  document.getElementById('persons-val').textContent = '1';
  document.getElementById('times-val').textContent   = '1';
 
  ['name', 'phone', 'from', 'to'].forEach(function(id) { setError(id, false); });
  document.getElementById('err-time').style.display = 'none';
 
  var btn = document.getElementById('submit-btn');
  btn.disabled    = false;
  btn.textContent = 'إرسال الطلب';
 
  document.getElementById('form-area').style.display  = 'block';
  document.getElementById('success-box').style.display = 'none';
}
 