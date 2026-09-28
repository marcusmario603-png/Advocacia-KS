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

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');

  if (!reducedMotion.matches && finePointer.matches) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let backgroundFrame = null;

    const moveBackground = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      document.body.style.setProperty('--background-pointer-x', `${currentX}%`);
      document.body.style.setProperty('--background-pointer-y', `${currentY}%`);

      if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
        backgroundFrame = requestAnimationFrame(moveBackground);
      } else {
        backgroundFrame = null;
      }
    };

    window.addEventListener('pointermove', event => {
      targetX = ((event.clientX / window.innerWidth) - 0.5) * 3.2;
      targetY = ((event.clientY / window.innerHeight) - 0.5) * 2.4;

      if (backgroundFrame === null) {
        backgroundFrame = requestAnimationFrame(moveBackground);
      }
    }, { passive: true });
  }

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#menu');
  const navLinks = [...document.querySelectorAll('.nav a')];
  const toast = document.querySelector('.toast');

  const setActiveNavLink = (targetId) => {
    navLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${targetId}`;
      link.classList.toggle('active', active);
      if (active) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        const targetId = link.getAttribute('href')?.replace('#', '');
        if (targetId) setActiveNavLink(targetId);
      });
    });
  }

  const sectionObserver = new IntersectionObserver((entries) => {
    const visibleEntries = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visibleEntries[0]) {
      const id = visibleEntries[0].target.getAttribute('id');
      if (id) setActiveNavLink(id);
    }
  }, {
    rootMargin: '-25% 0px -45% 0px',
    threshold: [0.15, 0.35, 0.6]
  });

  document.querySelectorAll('section[id]').forEach(section => sectionObserver.observe(section));

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

  document.querySelectorAll('.back-to-top').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', window.location.pathname + window.location.search);
      } else {
        window.location.hash = '';
      }
    });
  });

  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
