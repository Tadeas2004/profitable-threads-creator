document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. NAVIGATION & BURGER MENU --- */
    const burger = document.getElementById('burger-menu');
    const navLinks = document.getElementById('nav-links');
    
    if (burger && navLinks) {
        const toggleMenu = () => {
            burger.classList.toggle('active');
            navLinks.classList.toggle('active');
        };

        burger.addEventListener('click', toggleMenu);

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    /* --- 2. INFINITE TICKER LOGIC --- */
    const track = document.getElementById('testimonial-track');
    
    if (track) {
        const originalHTML = track.innerHTML;
        let isCurrentlyDesktop = window.innerWidth >= 1024;

        const setupTicker = () => {
            const shouldBeDesktop = window.innerWidth >= 1024;
            
            if (shouldBeDesktop) {
                if (track.innerHTML === originalHTML) {
                     track.innerHTML = originalHTML + originalHTML;
                }
            } else {
                track.innerHTML = originalHTML;
            }
            isCurrentlyDesktop = shouldBeDesktop;
        };

        setupTicker();

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const isNowDesktop = window.innerWidth >= 1024;
                if (isNowDesktop !== isCurrentlyDesktop) {
                    setupTicker();
                }
            }, 250);
        });
    }

    /* --- 3. SCROLL REVEAL --- */
    const revealOptions = {
        threshold: 0,
        rootMargin: window.innerWidth > 768 ? "0px 0px -50px 0px" : "0px 0px 200px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                const lazyImages = entry.target.querySelectorAll('img[loading="lazy"]');
                lazyImages.forEach(img => {
                    img.setAttribute('loading', 'eager'); // Přepne na okamžité načtení jakmile je sekce "visible"
                });

                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));


    /* --- 4. STATS COUNT UP --- */
    const countUp = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2500; // 2.5 sekundy
        const startTime = performance.now();

        const update = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuad = (t) => t * (2 - t);
            const currentCount = Math.floor(easeOutQuad(progress) * target);
            
            el.innerText = currentCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.innerText = target.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            }
        };

        requestAnimationFrame(update);
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const numbers = document.querySelectorAll('.stat-number');
    if (numbers.length > 0) {
        numbers.forEach(num => statsObserver.observe(num));
    }
});

/* --- FAQ ACCORDION LOGIC --- */
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) item.classList.remove('active');
        });

        faqItem.classList.toggle('active');
    });
});