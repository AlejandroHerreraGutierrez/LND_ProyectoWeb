const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aparecer');
        }
    });
});

document.querySelectorAll('.oculto').forEach((el) => observer.observe(el));