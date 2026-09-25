(() => {
  const loader = document.getElementById('brandLoader');
  const introDuration = 4200;

  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.add('loaded');
      }, introDuration);
    });
  } else {
    document.body.classList.add('loaded');
  }

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#menu');
  const toast = document.querySelector('.toast');

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  document.querySelectorAll('.flip-card').forEach(card => {
    const button = card.querySelector('.read-more');

    const toggleCard = () => {
      const isFlipped = card.classList.toggle('is-flipped');
      if (button) {
        button.setAttribute('aria-expanded', String(isFlipped));
      }
    };

    card.addEventListener('click', (event) => {
      if (event.target.closest('button')) {
        return;
      }
      toggleCard();
    });

    if (button) {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleCard();
      });
    }
  });

  let toastTimer;
  document.querySelectorAll('[data-toast]').forEach(button => {
    button.addEventListener('click', () => {
      toast.textContent = button.dataset.toast || '';
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
    });
  });

  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
