/* CCS Learner prototype — student chrome, toast, and the course-enroll
   interaction. Static, no build step. */

/* ---- Inline logos (approximations of the CCC seal for the prototype) ---- */
function seal(size) {
  return `<svg class="s-brand__seal" style="width:${size}px;height:${size}px" viewBox="0 0 40 40" aria-hidden="true">
    <circle cx="20" cy="20" r="19" fill="#fff" stroke="#1953A8" stroke-width="1.5"/>
    <circle cx="20" cy="20" r="13" fill="#11366f"/>
    <path d="M20 9 C13 13 12 24 20 31 C16 24 17 15 20 9 Z" fill="#FFB000"/>
    <path d="M20 9 C27 13 28 24 20 31 C24 24 23 15 20 9 Z" fill="#F5A300" opacity=".85"/>
  </svg>`;
}

const NAV = [
  ['Dashboard', 'index.html', 'dashboard'],
  ['Collaboratives', 'collaboratives.html', 'collaboratives'],
  ['Class Schedule', '#', 'schedule'],
  ['Favorite Courses', '#', 'favorites'],
  ['Saved Searches', '#', 'searches'],
];

function mountStudentChrome(active) {
  const icoFaq = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v12H7l-3 3V4z"/></svg>`;
  const icoUser = `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0116 0z"/></svg>`;
  const icoOut = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 4h4v16h-4M3 12h11M9 8l-5 4 5 4"/></svg>`;

  const header = `
  <header class="s-header">
    <div class="s-header__in">
      <a class="s-brand" href="collaboratives.html">
        ${seal(38)}
        <span class="s-brand__txt">
          <span class="s-brand__cc">California<br>Community<br>Colleges</span>
          <span class="s-brand__vc">California<br>Virtual Campus</span>
        </span>
      </a>
      <span class="s-header__home">HOME</span>
      <nav class="s-header__actions">
        <a class="s-act" href="#">${icoFaq} FAQs</a>
        <a class="s-act" href="#">${icoUser} Profile</a>
        <a class="s-act" href="#">${icoOut} Log out</a>
      </nav>
    </div>
  </header>
  <div class="s-subnav">
    <div class="s-subnav__in">
      ${NAV.map(([label, href, key]) =>
        `<a href="${href}"${key === active ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
      <span class="s-subnav__spacer"></span>
      <button class="s-search" onclick="flashToast('Opens the CVC course search'); showPendingToast();">
        Search for Classes
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 9l6 6 6-6z"/></svg>
      </button>
    </div>
  </div>`;

  const footer = `
  <footer class="s-footer">
    <div class="s-footer__in">
      ${seal(64).replace('s-brand__seal', 's-footer__seal')}
      <div class="s-footer__col">
        <a href="#">FAQ</a>
        <a href="#">Contact</a>
      </div>
      <div class="s-footer__col">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <span class="s-footer__muted">Quottly Inc.</span>
      </div>
      <div class="s-footer__brands">
        <span class="s-footer__logo">QUOTTLY</span>
        <span class="s-footer__logo" style="font-size:14px;">N2N SERVICES</span>
      </div>
    </div>
    <div class="s-footer__copy">© 2026 QUOTTLY, INC. ALL RIGHTS RESERVED.</div>
  </footer>`;

  document.body.insertAdjacentHTML('afterbegin', header);
  document.body.insertAdjacentHTML('beforeend', footer);
  showPendingToast();
}

/* ---- Toast ---- */
function flashToast(msg) { sessionStorage.setItem('learner_toast', msg); }
function showPendingToast() {
  const msg = sessionStorage.getItem('learner_toast');
  if (!msg) return;
  sessionStorage.removeItem('learner_toast');
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2600);
}
function toastNow(msg) { flashToast(msg); showPendingToast(); }
function go(url) { window.location.href = url; }

/* ---- Available-courses catalog, keyed by requirement id ---- */
const CATALOG = {
  'accounting': [
    { name: 'ACCT 101 — Financial Accounting', inst: 'Sonoma State University', units: 4, grade: 'C' },
    { name: 'ACCT 102 — Managerial Accounting', inst: 'UC San Francisco', units: 4, grade: 'C' },
    { name: 'BUS 110 — Principles of Accounting', inst: 'Touro University', units: 3, grade: 'C' },
  ],
  'ge-english': [
    { name: 'ENGL 100 — College Composition', inst: 'Sonoma State University', units: 4, grade: 'C' },
    { name: 'ENGL 105 — Critical Reading & Writing', inst: 'UCLA', units: 4, grade: 'C' },
  ],
  'ge-math': [
    { name: 'MATH 110 — College Algebra', inst: 'Sonoma State University', units: 4, grade: 'C' },
    { name: 'STAT 120 — Intro to Statistics', inst: 'USC', units: 4, grade: 'C' },
  ],
};

/* ---- Course enroll modal ---- */
function openCourseModal(reqId, title) {
  const courses = CATALOG[reqId] || [];
  const card = document.querySelector(`.req-card[data-req="${reqId}"]`);
  const ov = document.createElement('div');
  ov.className = 'modal-ov';
  ov.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="Available courses">
      <div class="modal__head"><h3>Available courses · ${title}</h3>
        <button class="modal__x" data-x aria-label="Close">&times;</button></div>
      <div class="modal__body">
        ${courses.map((c, i) => `
          <div class="course-opt" data-i="${i}">
            <div class="course-opt__body">
              <div class="course-opt__name">${c.name}</div>
              <div class="course-opt__meta">${c.inst} · ${c.units} units · Min Grade ${c.grade}</div>
            </div>
            <button class="btn btn--primary btn--sm" data-add="${i}">Add</button>
          </div>`).join('') || '<p class="muted">No more courses available for this requirement.</p>'}
      </div>
    </div>`;
  document.body.appendChild(ov);
  requestAnimationFrame(() => ov.classList.add('show'));
  const close = () => { ov.classList.remove('show'); setTimeout(() => ov.remove(), 200); };
  ov.addEventListener('click', e => { if (e.target === ov) close(); });
  ov.querySelector('[data-x]').onclick = close;
  ov.querySelectorAll('[data-add]').forEach(btn => {
    btn.onclick = () => {
      const c = courses[+btn.dataset.add];
      addEnrolledCourse(card, c);
      btn.closest('.course-opt').classList.add('added');
      btn.textContent = 'Added';
      btn.disabled = true;
      toastNow(`${c.name.split(' — ')[0]} added to your courses`);
    };
  });
}

function addEnrolledCourse(card, course) {
  if (!card) return;
  const list = card.querySelector('.enrolled');
  const empty = card.querySelector('.enrolled__empty');
  if (empty) empty.remove();
  const li = document.createElement('li');
  li.innerHTML = `
    <span class="enrolled__check"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg></span>
    <span class="enrolled__name">${course.name}</span>
    <span class="enrolled__meta"><span>${course.inst}</span><span>${course.units} units</span><span>Min Grade ${course.grade}</span></span>`;
  list.appendChild(li);
  // bump progress
  const done = (+card.dataset.done || 0) + course.units;
  const need = +card.dataset.required || 0;
  card.dataset.done = done;
  updateProgress(card);
  if (need && done >= need) markComplete(card);
}

function updateProgress(card) {
  const done = +card.dataset.done || 0;
  const need = +card.dataset.required || 0;
  const bar = card.querySelector('.progress__bar');
  const label = card.querySelector('.progress-label');
  const pct = need ? Math.min(100, Math.round((done / need) * 100)) : 0;
  if (bar) bar.style.width = pct + '%';
  if (label) label.textContent = `${Math.min(done, need)} of ${need} units completed`;
}

function markComplete(card) {
  card.querySelector('.progress__bar')?.classList.add('is-done');
  const tags = card.querySelector('.req-card__tags');
  if (tags && !tags.querySelector('.pill--done')) {
    tags.insertAdjacentHTML('afterbegin',
      `<span class="pill pill--done"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg> Completed</span>`);
  }
}

/* ---- Explore filter (prototype: just acknowledges) ---- */
function initCollabFilter() {
  const form = document.getElementById('collab-filter');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const v = form.querySelector('select').value;
    toastNow(v ? `Filtered to collaboratives inviting ${v}` : 'Showing all collaboratives');
  });
}
document.addEventListener('DOMContentLoaded', initCollabFilter);
