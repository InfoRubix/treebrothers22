/* =========================================================
   TREEsBROTHERS — Shared interactions
   Loaded on every page; each block guards for its elements.
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Navbar: scroll state + mobile toggle ---------- */
  const nav = document.querySelector(".nav");
  const onScroll = () =>
    nav && nav.classList.toggle("scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.classList.toggle("open", open);
    });
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.classList.remove("open");
      }),
    );
    // auto-close the mobile menu when the user scrolls
    window.addEventListener(
      "scroll",
      () => {
        if (menu.classList.contains("open")) {
          menu.classList.remove("open");
          toggle.classList.remove("open");
        }
      },
      { passive: true },
    );
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* Home service cards are links to services.html; description shows on hover (CSS). */

  /* ---------- Home/Portfolio: Featured project swap ---------- */
  const featured = document.querySelector("[data-featured]");
  if (featured) {
    const fImg = featured.querySelector("img");
    const fTag = featured.querySelector(".tag");
    const fTitle = featured.querySelector("h3");
    const fDesc = featured.querySelector("p");
    const thumbs = document.querySelectorAll(".pf-thumb");

    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        // capture current featured data
        const cur = {
          img: fImg.getAttribute("src"),
          tag: fTag ? fTag.textContent : "",
          title: fTitle.textContent,
          desc: fDesc.textContent,
        };
        // read thumb data
        const next = {
          img: thumb.dataset.img,
          tag: thumb.dataset.tag,
          title: thumb.dataset.title,
          desc: thumb.dataset.desc,
        };
        // swap with a soft fade
        featured.style.opacity = "0";
        setTimeout(() => {
          fImg.src = next.img;
          if (fTag) fTag.textContent = next.tag;
          fTitle.textContent = next.title;
          fDesc.textContent = next.desc;
          featured.style.opacity = "1";
        }, 220);
        // push old featured into the clicked thumb
        const tImg = thumb.querySelector("img");
        const tLabel = thumb.querySelector("span");
        tImg.src = cur.img;
        if (tLabel) tLabel.textContent = cur.title;
        thumb.dataset.img = cur.img;
        thumb.dataset.tag = cur.tag;
        thumb.dataset.title = cur.title;
        thumb.dataset.desc = cur.desc;

        thumbs.forEach((t) => t.classList.remove("is-active"));
        thumb.classList.add("is-active");
      });
    });
    featured.style.transition = "opacity 0.25s ease";
  }

  /* ---------- About: floating side feature panels ---------- */
  const sideBtns = document.querySelectorAll(".side-feature button");
  const panels = document.querySelectorAll(".side-panel");
  const backdrop = document.querySelector(".side-backdrop");
  if (sideBtns.length) {
    const closeAll = () => {
      sideBtns.forEach((b) => b.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("open"));
      backdrop && backdrop.classList.remove("show");
    };
    sideBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = document.getElementById(btn.dataset.panel);
        const isOpen = btn.classList.contains("active");
        closeAll();
        if (!isOpen && target) {
          btn.classList.add("active");
          target.classList.add("open");
          backdrop && backdrop.classList.add("show");
        }
      });
    });
    backdrop && backdrop.addEventListener("click", closeAll);
  }

  /* ---------- About: speaker profile toggle ---------- */
  const speakerCards = document.querySelectorAll(".speaker-card");
  if (speakerCards.length) {
    speakerCards.forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.dataset.profile;
        const profile = document.getElementById(id);
        const isActive = card.classList.contains("active");
        speakerCards.forEach((c) => c.classList.remove("active"));
        document
          .querySelectorAll(".speaker-profile")
          .forEach((p) => p.classList.remove("open"));
        if (!isActive && profile) {
          card.classList.add("active");
          profile.classList.add("open");
          setTimeout(
            () =>
              profile.scrollIntoView({ behavior: "smooth", block: "center" }),
            200,
          );
        }
      });
    });
  }

  /* ---------- Portfolio page: project modal ---------- */
  const overlay = document.querySelector(".modal-overlay");
  if (overlay) {
    const mMedia = overlay.querySelector(".modal-media img");
    const mTag = overlay.querySelector(".modal-body .tag");
    const mTitle = overlay.querySelector(".modal-body h2");
    const mDesc = overlay.querySelector(".modal-desc");
    const mStats = overlay.querySelector(".modal-stats");
    const openModal = (data) => {
      mMedia.src = data.img;
      mTag.textContent = data.tag;
      mTitle.textContent = data.title;
      const rich = data.rich && document.getElementById(data.rich);
      if (rich) {
        mDesc.innerHTML = rich.innerHTML; // full formatted article
        if (mStats) mStats.style.display = "none";
      } else {
        mDesc.textContent = data.desc; // plain project description
        if (mStats) mStats.style.display = "";
      }
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
    };
    const closeModal = () => {
      overlay.classList.remove("open");
      document.body.style.overflow = "";
    };
    document.querySelectorAll(".pf-item, .art-card").forEach((item) => {
      item.addEventListener("click", () => openModal(item.dataset));
    });
    overlay.querySelector(".modal-close").addEventListener("click", closeModal);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  /* ---------- Contact form -> email via FormSubmit ---------- */
  const form = document.querySelector(".contact-form");
  if (form) {
    const ENDPOINT = "https://formsubmit.co/ajax/info@treebrothers.com.my";
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = form.querySelector(".form-note");
      const val = (id) => (form.querySelector(id) ? form.querySelector(id).value : "");
      const data = {
        name: val("#name"),
        email: val("#email"),
        phone: val("#phone"),
        message: val("#message"),
        _subject: "New enquiry — Tree Brothers website",
      };
      note.style.color = "";
      note.textContent = "Sending…";
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      })
        .then((r) => r.json())
        .then(() => {
          const first = data.name ? ", " + data.name.split(" ")[0] : "";
          note.textContent = `Thank you${first}! Your message has been sent — we'll reply within 24 hours.`;
          note.style.color = "#1d8f4a";
          form.reset();
        })
        .catch(() => {
          note.textContent =
            "Sorry, something went wrong. Please email us directly at info@treebrothers.com.my.";
          note.style.color = "#c0392b";
        });
    });
  }

  /* ---------- Footer year ---------- */
  document
    .querySelectorAll("[data-year]")
    .forEach((el) => (el.textContent = new Date().getFullYear()));
});
