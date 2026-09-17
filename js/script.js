// Lumany Tech — pequenas interações do site estático

document.addEventListener("DOMContentLoaded", function () {
  // marca o link do menu correspondente à página atual
  var current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a[data-page]").forEach(function (link) {
    if (link.getAttribute("data-page") === current) {
      link.classList.add("is-active");
    }
  });
});
