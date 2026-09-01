/* Scroll progress bar with car marker — runs on every page. */
(function () {
  const fill = document.getElementById('progress-fill');
  const marker = document.getElementById('progress-marker');
  if (!fill || !marker) return;

  function update() {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const pct = height > 0 ? Math.min(100, Math.max(0, (scrollTop / height) * 100)) : 0;
    fill.style.width = pct + '%';
    marker.style.left = pct + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

function wireImageSkeleton(img) {
  const wrap = img.closest('.card-image');
  function mark() {
    img.classList.add('is-loaded');
    if (wrap) wrap.classList.add('is-loaded');
  }
  if (img.complete && img.naturalWidth > 0) {
    mark();
  } else {
    img.addEventListener('load', mark);
    img.addEventListener('error', mark);
  }
}

function wireAllImageSkeletons(root) {
  (root || document).querySelectorAll('img').forEach(wireImageSkeleton);
}

document.addEventListener('DOMContentLoaded', function () {
  wireAllImageSkeletons(document);
});

/* Renders a project's markdown file into #content.
   Expects a data-md attribute on the <main id="content"> element
   pointing at the markdown file, relative to the current page. */

(function () {
  const el = document.getElementById('content');
  if (!el) return;

  const src = el.getAttribute('data-md');
  if (!src) return;

  fetch(src)
    .then(function (res) {
      if (!res.ok) throw new Error('Could not load ' + src);
      return res.text();
    })
    .then(function (md) {
      el.innerHTML = marked.parse(md, { gfm: true, breaks: false });
      pairAdjacentImages(el);
      wireAllImageSkeletons(el);
      document.title = deriveTitle(el) + ' \u2014 Dohyun Yang';
    })
    .catch(function (err) {
      el.innerHTML =
        '<div class="loading-state">Could not load this page\u2019s content (' +
        err.message +
        ').</div>';
      console.error(err);
    });

  // Two consecutive images render side by side rather than stacked
  // full-width. Markdown puts consecutive image lines (no blank line
  // between) into ONE <p> with multiple <img> children, so first split
  // those into individual <p> tags, then pair up neighbors.
  function pairAdjacentImages(root) {
    root.querySelectorAll('p').forEach(function (p) {
      const imgs = Array.from(p.children).filter(function (c) { return c.tagName === 'IMG'; });
      if (imgs.length > 1 && imgs.length === p.children.length) {
        imgs.forEach(function (img) {
          const wrapper = document.createElement('p');
          wrapper.appendChild(img);
          p.parentNode.insertBefore(wrapper, p);
        });
        p.remove();
      }
    });

    const paras = Array.from(root.querySelectorAll('p'));
    let i = 0;
    while (i < paras.length - 1) {
      const a = paras[i];
      const b = paras[i + 1];
      const aImg = a.children.length === 1 && a.children[0].tagName === 'IMG';
      const bImg = b.children.length === 1 && b.children[0].tagName === 'IMG';
      if (aImg && bImg && a.nextElementSibling === b) {
        const wrap = document.createElement('div');
        wrap.className = 'img-pair';
        a.parentNode.insertBefore(wrap, a);
        wrap.appendChild(a);
        wrap.appendChild(b);
        i += 2;
      } else {
        i += 1;
      }
    }
  }

  function deriveTitle(root) {
    const h1 = root.querySelector('h1');
    return h1 ? h1.textContent.trim() : 'Project';
  }
})();
