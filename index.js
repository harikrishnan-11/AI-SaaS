/* =====================================================================
   Stackly homepage script (moved out of index.html)
   Same behaviour as before. Images are now static <img> tags in the
   HTML, so the old image-API lookup/injection block has been removed.
   ===================================================================== */
(() => {
  "use strict";

  // Scroll reveal + counters
  const io = new IntersectionObserver(
    (e) =>
      e.forEach((x) => {
        if (!x.isIntersecting) return;
        x.target.classList.add("in");
        x.target.querySelectorAll("[data-n]").forEach((c) => {
          const t = +c.dataset.n;
          let v = 0;
          const iv = setInterval(() => {
            v += Math.ceil(t / 40);
            if (v >= t) {
              v = t;
              clearInterval(iv);
            }
            c.textContent = v;
          }, 30);
        });
        io.unobserve(x.target);
      }),
    { threshold: 0.2 },
  );
  document.querySelectorAll(".rv").forEach((e) => io.observe(e));

  // Mobile menu (Font Awesome icon, aria-expanded, closes on link, Escape and desktop resize)
  const nav = document.getElementById("nav"),
    mb = document.getElementById("mb");
  const menu = (o) => {
    nav.classList.toggle("open", o);
    mb.setAttribute("aria-expanded", o);
    mb.innerHTML = o
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  };
  mb.onclick = () => menu(!nav.classList.contains("open"));
  nav.onclick = (e) => {
    if (e.target.closest("a")) menu(false);
  };
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") menu(false);
  });
  matchMedia("(min-width:861px)").addEventListener("change", () => menu(false));

  // Newsletter (demo only: connect to your email provider)
  document.getElementById("nf").onsubmit = (e) => {
    e.preventDefault();
    document.getElementById("nm").textContent =
      "Thanks! Check your inbox to confirm.";
    e.target.reset();
  };

  // Pricing toggle (buttons, so it works with the keyboard)
  document.querySelectorAll("[data-b]").forEach(
    (b) =>
      (b.onclick = () => {
        document.querySelectorAll("[data-b]").forEach((x) => {
          const on = x == b;
          x.classList.toggle("on", on);
          x.setAttribute("aria-pressed", on);
        });
        document.getElementById("gp").textContent =
          b.dataset.b == "y" ? "$39" : "$49";
      }),
  );

  // Scroll effects: progress bar, sticky header, back-to-top, staggered reveals, card glow
  const pg = document.getElementById("pg"),
    hd = document.querySelector("header"),
    tp = document.getElementById("top");
  addEventListener(
    "scroll",
    () => {
      const y = scrollY,
        m = document.documentElement.scrollHeight - innerHeight;
      pg.style.width = (y / m) * 100 + "%";
      hd.classList.toggle("sc", y > 40);
      tp.classList.toggle("on", y > 600);
    },
    { passive: true },
  );
  document
    .querySelectorAll(".rv")
    .forEach((s) =>
      s
        .querySelectorAll(".tx>*,.gc")
        .forEach((e, i) => e.style.setProperty("--d", i * 0.08 + "s")),
    );
  document.querySelectorAll(".gc,.card").forEach((e) =>
    e.addEventListener("mousemove", (v) => {
      const r = e.getBoundingClientRect();
      e.style.setProperty("--mx", v.clientX - r.left + "px");
      e.style.setProperty("--my", v.clientY - r.top + "px");
    }),
  );

  // Footer year
  document
    .querySelectorAll("[data-y]")
    .forEach((e) => (e.textContent = new Date().getFullYear()));
})();