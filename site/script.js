const revealElements = document.querySelectorAll("[data-reveal]");
const navLinks = document.querySelectorAll(".top-nav a");
const copyButtons = document.querySelectorAll("[data-copy-target]");
const parallaxRoot = document.querySelector("[data-parallax]");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.14 }
  );

  for (const element of revealElements) {
    revealObserver.observe(element);
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible?.target.id) return;

      for (const link of navLinks) {
        const isActive = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("active", isActive);
      }
    },
    {
      rootMargin: "-25% 0px -55% 0px",
      threshold: [0.2, 0.45, 0.7],
    }
  );

  for (const section of document.querySelectorAll("main section[id]")) {
    sectionObserver.observe(section);
  }
} else {
  for (const element of revealElements) {
    element.classList.add("is-visible");
  }
}

for (const button of copyButtons) {
  button.addEventListener("click", async () => {
    const targetId = button.getAttribute("data-copy-target");
    const target = targetId ? document.getElementById(targetId) : null;

    if (!target?.textContent) return;

    try {
      await navigator.clipboard.writeText(target.textContent.trim());
      const originalText = button.textContent;
      button.textContent = "Copied!";
      button.classList.add("is-copied");

      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("is-copied");
      }, 1600);
    } catch {
      button.textContent = "Try again";
      setTimeout(() => {
        button.textContent = "Copy";
      }, 1600);
    }
  });
}

if (parallaxRoot && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const cards = parallaxRoot.querySelectorAll(".terminal-window, .hero-card");
  const baseTransforms = new Map(
    Array.from(cards, (card) => [card, getComputedStyle(card).transform])
  );

  const handleMove = (event) => {
    const rect = parallaxRoot.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

    cards.forEach((card, index) => {
      const depth = (index + 1) * 5;
      const base = baseTransforms.get(card);
      const prefix = base && base !== "none" ? `${base} ` : "";
      card.style.transform = `${prefix}translate3d(${offsetX * depth}px, ${offsetY * depth}px, 0)`;
    });
  };

  const resetMove = () => {
    cards.forEach((card) => {
      const base = baseTransforms.get(card);
      card.style.transform = base && base !== "none" ? base : "";
    });
  };

  parallaxRoot.addEventListener("pointermove", handleMove);
  parallaxRoot.addEventListener("pointerleave", resetMove);
}
