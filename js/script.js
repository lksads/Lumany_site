// Lumany Tech — interações do site estático (versão orientada a objetos)

class NavController {
  constructor(navSelector = ".main-nav") {
    this.nav = document.querySelector(navSelector);
  }

  getCurrentPage() {
    return window.location.pathname.split("/").pop() || "index.html";
  }

  highlightCurrentPage() {
    if (!this.nav) return;
    const current = this.getCurrentPage();
    this.nav.querySelectorAll("a[data-page]").forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("data-page") === current);
    });
  }
}

class WhatsAppButton {
  constructor(selector) {
    this.elements = Array.from(document.querySelectorAll(selector));
  }

  bindClickTracking() {
    this.elements.forEach((el) => {
      el.addEventListener("click", () => {
        // ponto único para plugar analytics/pixel de conversão no futuro
        document.dispatchEvent(
          new CustomEvent("lumany:whatsapp-click", { detail: { href: el.href } })
        );
      });
    });
  }
}

class RevealOnScroll {
  constructor(selector = "[data-reveal]") {
    this.elements = Array.from(document.querySelectorAll(selector));
  }

  revealAll() {
    this.elements.forEach((el) => el.classList.add("is-visible"));
  }

  init() {
    if (!this.elements.length) return;

    // marca que o JS está ativo: só agora a animação (opacity:0 inicial)
    // entra em vigor via CSS. Sem isso, o conteúdo já nasce visível.
    document.documentElement.classList.add("has-js");

    if (!("IntersectionObserver" in window)) {
      this.revealAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    this.elements.forEach((el) => observer.observe(el));

    // rede de segurança: se por algum motivo o observer nunca disparar
    // para algum elemento, garante que o conteúdo apareça mesmo assim.
    window.setTimeout(() => this.revealAll(), 2500);
  }
}

class LumanyTechSite {
  constructor() {
    this.nav = new NavController();
    this.whatsapp = new WhatsAppButton('a[href*="wa.me"]');
    this.reveal = new RevealOnScroll();
  }

  init() {
    this.nav.highlightCurrentPage();
    this.whatsapp.bindClickTracking();
    this.reveal.init();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new LumanyTechSite().init();
});
