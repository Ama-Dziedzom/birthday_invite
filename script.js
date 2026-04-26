let currentPage = 1;
const totalPages = 5;

const pages = document.querySelectorAll('.page');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const pageCounter = document.getElementById('pageCounter');

// Detect touch device for hint
const flipHint = document.getElementById('flipHint');
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  if (flipHint) flipHint.textContent = 'SWIPE TO FLIP \u2192';
}

function updatePage(direction = 'forward') {
  pages.forEach((page, i) => {
    const pageNum = i + 1;
    
    // Reset all custom state classes except those needed for current animation
    page.classList.remove('active', 'flipped', 'next-up', 'flipping-forward', 'flipping-backward');
    
    if (pageNum === currentPage) {
      page.classList.add('active');
      if (direction === 'backward') page.classList.add('flipping-backward');
    } else if (pageNum < currentPage) {
      page.classList.add('flipped');
      // Apply the 'curl' animation if it was just flipped away
      if (pageNum === currentPage - 1 && direction === 'forward') {
        page.classList.add('flipping-forward');
      }
      
      // Keep the PREVIOUS page visible during the flip to prevent flickering
      if (pageNum < currentPage - 1) {
        page.style.visibility = 'hidden';
      } else {
        page.style.visibility = 'visible';
      }
    } else if (pageNum === currentPage + 1) {
      page.classList.add('next-up');
      page.style.visibility = 'visible';
    } else {
      page.style.visibility = 'hidden';
    }
  });

  prevBtn.disabled = (currentPage === 1);
  nextBtn.disabled = (currentPage === totalPages);
  pageCounter.textContent = `${currentPage} / ${totalPages}`;
}

nextBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    updatePage('forward');
  }
});

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    updatePage('backward');
  }
});

// Click on book to flip forward
document.getElementById('book').addEventListener('click', (e) => {
  // Don't flip if clicking a button or input
  if (e.target.closest('button, input, label')) return;
  
  if (currentPage < totalPages) {
    currentPage++;
    updatePage('forward');
  }
});

/* ── Swipe Support for Mobile ─────────────────────────────── */
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const threshold = 50;
  if (touchStartX - touchEndX > threshold) {
    // Swipe left -> Next
    if (currentPage < totalPages) {
      currentPage++;
      updatePage();
    }
  } else if (touchEndX - touchStartX > threshold) {
    // Swipe right -> Prev
    if (currentPage > 1) {
      currentPage--;
      updatePage();
    }
  }
}

/* ── Form Logic ────────────────────────────────────────────── */
const form = document.getElementById('rsvpForm');
const successMsg = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    btn.textContent = '...';
    btn.disabled = true;

    setTimeout(() => {
      form.querySelector('input').disabled = true;
      successMsg.style.display = 'block';
    }, 1000);
  });
}
