// ---------------- Feel: toasts, a busy bar, and small things that make the screen answer you ----------------
// A toast says why something didn't happen (or that it did) without a dialog. Display only: no game state.
function toast(msg, kind) {
  if (typeof document === 'undefined' || !document.body || !document.createElement) return;
  let box = document.getElementById('toasts');
  if (!box) { box = document.createElement('div'); box.id = 'toasts'; document.body.appendChild(box); }
  const t = document.createElement('div'); t.className = 'toast ' + (kind || ''); t.textContent = msg; box.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, 3200);
}
