import './styles.css';

// IntersectionObserver para fade-in
const observer = new IntersectionObserver(/* tu lógica */);
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(/* tu implementación */);

// Modal de video
window.openVideoModal = function() { /* tu código */ };
window.closeVideoModal = function() { /* cerrar modal */ };
document.addEventListener('keydown', e => { if(e.key==='Escape') closeVideoModal(); });

// Formulario
window.handleSubmit = function(e) { /* prevenir, alertar, enviar */ };
