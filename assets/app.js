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
  ['Dashboard', 'dashboard.html', 'dashboard'],
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
        <img class="s-brand__logo" src="assets/ccc-logo.png" alt="California Community Colleges · California Virtual Campus">
      </a>
      <span class="s-header__home">HOME</span>
      <nav class="s-header__actions">
        <a class="s-act" href="#">${icoFaq} FAQs</a>
        <span class="s-act__div"></span>
        <button class="s-id" title="Jordan Rivera · Student ID UCSD-0042318 — click to copy" onclick="flashToast('Student ID copied'); showPendingToast(); return false;">
          <span class="s-id__av">JR</span>
          <span class="s-id__txt"><b>Jordan Rivera</b><span>ID&nbsp;UCSD&#8209;0042318</span></span>
        </button>
        <a class="s-act" href="#">${icoOut} Log out</a>
      </nav>
    </div>
  </header>
  <div class="s-subnav">
    <div class="s-subnav__in">
      ${NAV.map(([label, href, key]) =>
        `<a href="${href}"${key === active ? ' aria-current="page"' : ''}>${label}</a>`).join('<span class="s-subnav__div"></span>')}
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
      <img class="s-footer__seal" src="assets/ccc-seal.png" alt="California Community Colleges">
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
        <img class="s-footer__brandimg" src="assets/quottly-n2n.png" alt="Quottly · N2N Services">
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

/* LN-35 — student opts into a pathway and becomes a Collaborative student.
   Course selection stays locked until they join. */
function joinPathway() {
  document.body.classList.add('joined');
  document.querySelectorAll('.req-card .btn[disabled]').forEach(function (b) { b.disabled = false; });
  toastNow("You're now a Collaborative student — you can add courses");
}

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
  const card = document.querySelector(`[data-req="${reqId}"]`);
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
  if (typeof refreshIdeal === 'function') refreshIdeal();
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

/* ---- Ideal program-details: accordion + stepper + overall progress ---- */
function initIdeal() {
  const root = document.querySelector('.req-ideal');
  if (!root) return;
  root.querySelectorAll('.acc-head').forEach(h => {
    h.addEventListener('click', () => h.closest('.acc-item').classList.toggle('is-open'));
  });
  root.querySelectorAll('.rail-step').forEach(s => {
    s.addEventListener('click', () => {
      const item = root.querySelector(`.acc-item[data-acc="${s.dataset.step}"]`);
      if (item) { item.classList.add('is-open'); item.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });
  });
  refreshIdeal();
}

function refreshIdeal() {
  const root = document.querySelector('.req-ideal');
  if (!root) return;
  const items = [...root.querySelectorAll('.acc-item')];
  let done = 0;
  items.forEach(item => {
    let complete;
    if (item.dataset.acc === 'choose') {
      complete = [...item.querySelectorAll('[data-req]')].some(o =>
        +o.dataset.required > 0 && (+o.dataset.done || 0) >= +o.dataset.required);
    } else {
      complete = +item.dataset.required > 0 && (+item.dataset.done || 0) >= +item.dataset.required;
    }
    item.dataset.status = complete ? 'done' : 'progress';
    const rail = root.querySelector(`.rail-step[data-step="${item.dataset.acc}"]`);
    if (rail) rail.dataset.status = complete ? 'done' : 'progress';
    if (complete) done++;
  });
  const total = items.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const ring = root.querySelector('.prog-rail .ring');
  if (ring) { ring.style.setProperty('--p', pct); ring.querySelector('span').textContent = `${done}/${total}`; }
  const note = root.querySelector('.prog-rail__pct b');
  if (note) note.textContent = `${done} of ${total} requirements`;
}
document.addEventListener('DOMContentLoaded', initIdeal);

/* ============================================================
   Shared course catalog — single source of truth for the merged
   requirement pathway (cards) and the course-detail page. Keyed by
   course code so both pages render identical data and can't drift.
   ============================================================ */
const COURSE_CATALOG = {
  'ENGL 101': {
    code: 'ENGL 101', name: 'College Composition', inst: 'UCLA', units: '4.0', grade: 'C',
    cid: 'ENGL 100', tuition: '$172.00', ztc: true, quality: true, status: 'Open', location: 'Online',
    desc: 'Develops college-level reading, writing, and critical-thinking skills through expository and argumentative essays. Emphasis on the research process, source evaluation, and academic citation. Required of all degree-seeking students.',
    prereq: '',
    equiv: [
      { code: 'ENGL 1A', name: 'Reading & Composition', inst: 'USC', cid: 'ENGL 100', units: '4.0' },
      { code: 'ENGL 100', name: 'College Writing', inst: 'UC San Diego', cid: 'ENGL 100', units: '3.0' },
    ],
    sections: [
      { term: 'Fall 2026 - Semester', dates: 'Aug 24 to Dec 21', crn: '43391', format: 'Online - Asynchronous', ztc: true, status: 'Open', time: 'TBA', prof: 'Danish Khan', seats: '28', price: '$172.00', notes: 'Fully online class with no set meeting times. All coursework is completed through Canvas. Students should expect to complete a minimum number of online work hours per week as outlined in the syllabus.' },
      { term: 'Fall 2026 - Semester', dates: 'Aug 24 to Dec 21', crn: '43412', format: 'Online - Synchronous', ztc: false, status: 'Open', time: 'Tue/Thu 10:00–11:50am', prof: 'M. Alvarez', seats: '12', price: '$172.00', notes: 'Live online sessions held over Zoom at the scheduled meeting times.' },
    ],
  },
  'ENGL 105': {
    code: 'ENGL 105', name: 'Critical Reading & Writing', inst: 'USC', units: '4.0', grade: 'C',
    cid: 'ENGL 105', tuition: '$184.00', ztc: true, quality: true, status: 'Open', location: 'Online',
    desc: 'Builds on first-year composition with advanced critical reading, rhetorical analysis, and argument. Students write extended researched essays and engage with a range of academic and public texts.',
    prereq: 'ENGL 101 — College Composition (or equivalent)',
    equiv: [
      { code: 'ENGL 101', name: 'College Composition', inst: 'UCLA', cid: 'ENGL 100', units: '4.0' },
    ],
    sections: [
      { term: 'Fall 2026 - Semester', dates: 'Aug 24 to Dec 21', crn: '51022', format: 'Online - Asynchronous', ztc: true, status: 'Open', time: 'TBA', prof: 'R. Okafor', seats: '9', price: '$184.00', notes: 'Asynchronous online. Weekly discussion posts and four major writing assignments.' },
    ],
  },
  'PSYC 101': {
    code: 'PSYC 101', name: 'Introduction to Psychology', inst: 'UCLA', units: '4.0', grade: 'C',
    cid: 'PSY 110', tuition: '$172.00', ztc: true, quality: true, status: 'Open', location: 'Online',
    desc: 'Survey of the scientific study of behavior and mental processes: research methods, biological bases of behavior, sensation and perception, learning, memory, development, personality, and psychological disorders.',
    prereq: '',
    equiv: [
      { code: 'PSYC 100', name: 'General Psychology', inst: 'USC', cid: 'PSY 110', units: '4.0' },
    ],
    sections: [
      { term: 'Fall 2026 - Semester', dates: 'Aug 24 to Dec 21', crn: '60188', format: 'Online - Asynchronous', ztc: true, status: 'Open', time: 'TBA', prof: 'S. Nguyen', seats: '34', price: '$172.00', notes: 'Fully online. Proctored midterm and final via the campus online proctoring service.' },
    ],
  },
  'PSYC 100': {
    code: 'PSYC 100', name: 'General Psychology', inst: 'USC', units: '4.0', grade: 'C',
    cid: 'PSY 110', tuition: '$184.00', ztc: false, quality: true, status: 'Open', location: 'Online',
    desc: 'Introductory survey of psychology as a science, covering the major areas of the discipline from biological foundations through social behavior.',
    prereq: '',
    equiv: [
      { code: 'PSYC 101', name: 'Introduction to Psychology', inst: 'UCLA', cid: 'PSY 110', units: '4.0' },
    ],
    sections: [
      { term: 'Fall 2026 - Semester', dates: 'Aug 24 to Dec 21', crn: '60204', format: 'Online - Synchronous', ztc: false, status: 'Open', time: 'Mon/Wed 1:00–2:50pm', prof: 'D. Park', seats: '7', price: '$184.00', notes: 'Live online lecture with weekly section meetings.' },
    ],
  },
  'MATH 110': {
    code: 'MATH 110', name: 'College Algebra', inst: 'UC San Diego', units: '3.0', grade: 'C',
    cid: 'MATH 150', tuition: '$158.00', ztc: true, quality: true, status: 'Open', location: 'Online',
    desc: 'Functions and graphs, linear and quadratic equations, polynomial and rational functions, exponential and logarithmic functions, systems of equations. Satisfies the quantitative-reasoning requirement.',
    prereq: 'Intermediate Algebra (or placement)',
    equiv: [
      { code: 'MATH 1', name: 'College Algebra', inst: 'USC', cid: 'MATH 150', units: '3.0' },
    ],
    sections: [
      { term: 'Fall 2026 - Semester', dates: 'Aug 24 to Dec 21', crn: '70511', format: 'Online - Asynchronous', ztc: true, status: 'Open', time: 'TBA', prof: 'L. Mehta', seats: '21', price: '$158.00', notes: 'Asynchronous. Homework delivered through an online math platform; two proctored exams.' },
    ],
  },
  'STAT 120': {
    code: 'STAT 120', name: 'Intro to Statistics', inst: 'UC San Diego', units: '3.0', grade: 'C',
    cid: 'MATH 110', tuition: '$158.00', ztc: true, quality: true, status: 'Open', location: 'Online',
    desc: 'Descriptive statistics, probability, sampling distributions, estimation, hypothesis testing, correlation, and regression. Satisfies the quantitative-reasoning requirement.',
    prereq: '',
    equiv: [],
    sections: [
      { term: 'Fall 2026 - Semester', dates: 'Aug 24 to Dec 21', crn: '70620', format: 'Online - Asynchronous', ztc: true, status: 'Open', time: 'TBA', prof: 'A. Romero', seats: '16', price: '$158.00', notes: 'Asynchronous online. Uses an open-source statistics text (zero textbook cost).' },
    ],
  },
  'BIOL 6A': {
    code: 'BIOL 6A', name: 'Human Anatomy', inst: 'UCLA', units: '4.0', grade: 'C',
    cid: 'BIOL 105', tuition: '$196.00', ztc: false, quality: true, status: 'Open', location: 'Hybrid',
    desc: 'Structure of the human body across the major organ systems, with a laboratory component covering anatomical models, histology, and dissection. Required for clinical and allied-health programs.',
    prereq: '',
    equiv: [
      { code: 'BISC 240', name: 'Human Anatomy', inst: 'USC', cid: 'BIOL 105', units: '4.0' },
    ],
    sections: [
      { term: 'Fall 2026 - Semester', dates: 'Aug 24 to Dec 21', crn: '80155', format: 'Hybrid', ztc: false, status: 'Open', time: 'Lab Fri 9:00–11:50am', prof: 'H. Okonkwo', seats: '18', price: '$196.00', notes: 'Lecture online; required in-person lab on Fridays.' },
    ],
  },
  'HLTH 50': {
    code: 'HLTH 50', name: 'Medical Terminology', inst: 'USC', units: '3.0', grade: 'C',
    cid: 'HLTH 50', tuition: '$158.00', ztc: true, quality: true, status: 'Open', location: 'Online',
    desc: 'Systematic study of medical terms — roots, prefixes, and suffixes — used across nursing and allied-health fields. Builds the vocabulary needed for clinical coursework and patient records.',
    prereq: '',
    equiv: [
      { code: 'ALDH 110', name: 'Medical Terminology', inst: 'Cal State Long Beach', cid: 'HLTH 50', units: '3.0' },
    ],
    sections: [
      { term: 'Fall 2026 - Semester', dates: 'Aug 24 to Dec 21', crn: '80422', format: 'Online - Asynchronous', ztc: true, status: 'Open', time: 'TBA', prof: 'P. Salazar', seats: '25', price: '$158.00', notes: 'Fully online, zero textbook cost.' },
    ],
  },
};

/* Persisted enrollment state (prototype): a set of enrolled course codes,
   so the pathway and course-detail pages agree on what's enrolled. */
function getEnrolled() {
  try { return JSON.parse(sessionStorage.getItem('cvc_enrolled') || '[]'); }
  catch (e) { return []; }
}
function setEnrolledList(arr) {
  sessionStorage.setItem('cvc_enrolled', JSON.stringify(arr));
}
function isEnrolled(code) { return getEnrolled().indexOf(code) !== -1; }
function enrollCourse(code) {
  const a = getEnrolled();
  if (a.indexOf(code) === -1) { a.push(code); setEnrolledList(a); }
}
function unenrollCourse(code) {
  setEnrolledList(getEnrolled().filter(function (c) { return c !== code; }));
}
/* Escape helper for building HTML from data. */
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

/* ---- Dashboard V2 tabs (current / past courses) ---- */
function initTabs() {
  document.querySelectorAll('.tabbar').forEach(bar => {
    const btns = [...bar.querySelectorAll('button')];
    btns.forEach(btn => btn.addEventListener('click', () => {
      btns.forEach(b => b.setAttribute('aria-selected', b === btn ? 'true' : 'false'));
      const target = btn.dataset.tab;
      document.querySelectorAll('[data-pane]').forEach(p => {
        p.style.display = p.dataset.pane === target ? '' : 'none';
      });
    }));
  });
}
document.addEventListener('DOMContentLoaded', initTabs);
