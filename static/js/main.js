(() => {
  const navigation = document.querySelector('.site-nav');
  const toggle = document.querySelector('.menu-toggle');
  if (!navigation || !toggle) return;

  const label = toggle.querySelector('.menu-label');
  const mobile = window.matchMedia('(max-width: 720px)');
  const links = Array.from(navigation.querySelectorAll('a[href^="#"]'));

  function setMenuOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
    if (label) label.textContent = open ? 'Close' : 'Menu';
  }

  toggle.addEventListener('click', () => {
    setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  links.forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      toggle.focus();
    }
  });
  const resetMenu = () => setMenuOpen(false);
  if (mobile.addEventListener) mobile.addEventListener('change', resetMenu);
  else mobile.addListener(resetMenu);
  document.documentElement.classList.add('js');

  const sections = links.map(link => document.getElementById(link.hash.slice(1)));
  let observer;
  let frame;

  function updateCurrentSection() {
    const readingLine = Math.round(document.documentElement.clientHeight * 0.35);
    let current = -1;
    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= readingLine + 1) current = index;
    });
    links.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function observeSections() {
    if (observer) observer.disconnect();
    const height = document.documentElement.clientHeight;
    const bottomMargin = height - Math.round(height * 0.35);
    observer = new IntersectionObserver(updateCurrentSection, {
      rootMargin: `0px 0px -${bottomMargin}px 0px`,
      threshold: 0
    });
    sections.forEach(section => { if (section) observer.observe(section); });
    updateCurrentSection();
  }

  if ('IntersectionObserver' in window) {
    observeSections();
    window.addEventListener('resize', () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(observeSections);
    });
  } else {
    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateCurrentSection);
    };
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    updateCurrentSection();
  }
})();
