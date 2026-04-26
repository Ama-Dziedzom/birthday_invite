/* ── Page Flip Logic (Rewritten) ──────────────────────────── */

let currentPage = 1;
const totalPages = 5;
let isAnimating = false; // Lock to prevent mid-animation triggers

const pages = document.querySelectorAll('.page');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const pageCounter = document.getElementById('pageCounter');

// Detect touch device for hint
const flipHint = document.getElementById('flipHint');
if (flipHint && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
  flipHint.textContent = 'SWIPE TO FLIP →';
}

/* ── Core State Setup ──────────────────────────────────────── */
function initPages() {
  pages.forEach((page, i) => {
    const pageNum = i + 1;
    // Strip everything
    page.classList.remove('active', 'flipped', 'next-up', 'flipping-forward', 'flipping-backward');
    page.style.visibility = '';
    page.style.zIndex = '';

    if (pageNum === 1) {
      page.classList.add('active');
    } else if (pageNum === 2) {
      page.classList.add('next-up');
    } else {
      page.style.visibility = 'hidden';
    }
  });

  updateControls();
}

function updateControls() {
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
  pageCounter.textContent = `${currentPage} / ${totalPages}`;
}

/* ── Flip Forward ──────────────────────────────────────────── */
function flipForward() {
  if (isAnimating || currentPage >= totalPages) return;
  isAnimating = true;

  const leavingPage = pages[currentPage - 1];   // page going away (currently active)
  const enteringPage = pages[currentPage];       // page coming in (next-up)
  const afterEntering = pages[currentPage + 1]; // peek at the one after

  currentPage++;
  updateControls();

  // Stack order: leaving page flips on top of everything
  leavingPage.style.zIndex = '15';
  enteringPage.style.zIndex = '10';

  // Make sure entering page is visible and in resting state BEFORE animation starts
  enteringPage.classList.remove('next-up', 'flipped');
  enteringPage.style.visibility = 'visible';
  enteringPage.style.transform = 'rotateY(0deg)';

  // Trigger the flip on the leaving page
  leavingPage.classList.remove('active');
  leavingPage.classList.add('flipping-forward');

  // When the flip animation ends, clean up
  leavingPage.addEventListener('animationend', () => {
    leavingPage.classList.remove('flipping-forward');
    leavingPage.classList.add('flipped');
    leavingPage.style.zIndex = '';
    leavingPage.style.visibility = 'hidden'; // Hide it — it's behind everything now

    enteringPage.classList.add('active');
    enteringPage.style.transform = ''; // Let CSS class handle it
    enteringPage.style.zIndex = '';

    // Pre-position the next page if it exists
    if (afterEntering) {
      afterEntering.classList.add('next-up');
      afterEntering.style.visibility = 'visible';
    }

    // Hide all pages that are more than 1 behind current
    pages.forEach((page, i) => {
      if (i < currentPage - 2) {
        page.style.visibility = 'hidden';
      }
    });

    isAnimating = false;
  }, { once: true });
}

/* ── Flip Backward ─────────────────────────────────────────── */
function flipBackward() {
  if (isAnimating || currentPage <= 1) return;
  isAnimating = true;

  const enteringPage = pages[currentPage - 2]; // page coming back (was flipped)
  const leavingPage = pages[currentPage - 1];  // page going away (currently active)

  currentPage--;
  updateControls();

  // Prepare the entering (previously flipped) page
  enteringPage.classList.remove('flipped');
  enteringPage.style.visibility = 'visible';
  enteringPage.style.zIndex = '15'; // It needs to animate on top

  // It starts at -180deg (flipped state), animate back to 0
  enteringPage.classList.add('flipping-backward');

  // Move current page to next-up state
  leavingPage.classList.remove('active');
  leavingPage.classList.add('next-up');
  leavingPage.style.zIndex = '10';

  enteringPage.addEventListener('animationend', () => {
    enteringPage.classList.remove('flipping-backward');
    enteringPage.classList.add('active');
    enteringPage.style.zIndex = '';

    leavingPage.classList.remove('next-up');
    leavingPage.style.zIndex = '';

    // Hide pages ahead of current + 1
    pages.forEach((page, i) => {
      const pageNum = i + 1;
      if (pageNum > currentPage + 1) {
        page.style.visibility = 'hidden';
        page.classList.remove('next-up');
      }
    });

    isAnimating = false;
  }, { once: true });
}

/* ── Button Controls ───────────────────────────────────────── */
nextBtn.addEventListener('click', flipForward);
prevBtn.addEventListener('click', flipBackward);

// Click book to flip forward (but not on interactive elements)
document.getElementById('book').addEventListener('click', (e) => {
  if (e.target.closest('button, input, label, a')) return;
  flipForward();
});

/* ── Swipe Support ─────────────────────────────────────────── */
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', e => {
  const deltaX = e.changedTouches[0].screenX - touchStartX;
  const deltaY = e.changedTouches[0].screenY - touchStartY;

  // Only register as a swipe if horizontal movement dominates
  if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) return;

  if (deltaX < 0) {
    flipForward();  // Swipe left → next
  } else {
    flipBackward(); // Swipe right → prev
  }
}, { passive: true });

/* ── RSVP Form ─────────────────────────────────────────────── */
const form = document.getElementById('rsvpForm');
const successMsg = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    btn.textContent = '...';
    btn.disabled = true;

    setTimeout(() => {
      const input = form.querySelector('input');
      if (input) input.disabled = true;
      if (successMsg) successMsg.style.display = 'block';
    }, 1000);
  });
}

/* ── Init ──────────────────────────────────────────────────── */
initPages();