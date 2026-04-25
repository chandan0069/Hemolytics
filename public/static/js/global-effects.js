/* ================= FADE ON SCROLL ================= */
const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    },
    { threshold: 0.15 }
);

window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".section, .card, .stat, .flow-step")
        .forEach(el => observer.observe(el));
});
