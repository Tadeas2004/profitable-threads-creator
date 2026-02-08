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

        // Zavřít menu při kliknutí na odkaz
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    /* --- 2. INFINITE TICKER LOGIC (Responsive) --- */
    const track = document.getElementById('testimonial-track');
    
    if (track) {
        const originalHTML = track.innerHTML;
        let isCurrentlyDesktop = window.innerWidth >= 1024;

        const setupTicker = () => {
            const shouldBeDesktop = window.innerWidth >= 1024;
            
            if (shouldBeDesktop) {
                // Desktop: Zduplikovat obsah pro nekonečnou smyčku
                // Kontrola, abychom neduplikovali už zduplikované
                if (track.innerHTML === originalHTML) {
                     track.innerHTML = originalHTML + originalHTML;
                }
            } else {
                // Mobil: Reset na jeden set
                track.innerHTML = originalHTML;
            }
            isCurrentlyDesktop = shouldBeDesktop;
        };

        // Spustit hned po načtení
        setupTicker();

        // Debounce resize listener (šetří výkon)
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

    /* --- 3. SCROLL REVEAL (Mobile Optimized) --- */
    const revealOptions = {
        threshold: 0, // Spustit hned, jak se dotkne "zóny"
        // Desktop: -50px (malé zpoždění pro efekt)
        // Mobile: 200px (načíst s předstihem 200px pod obrazovkou!)
        rootMargin: window.innerWidth > 768 ? "0px 0px -50px 0px" : "0px 0px 200px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // PERFORMANCE FIX: 
                // Pokud jsou uvnitř lazy obrázky, vynutíme jejich načtení tím, že je "probudíme"
                const lazyImages = entry.target.querySelectorAll('img[loading="lazy"]');
                lazyImages.forEach(img => {
                    img.setAttribute('loading', 'eager'); // Přepne na okamžité načtení jakmile je sekce "visible"
                });

                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));


    /* --- 4. STATS COUNT UP (Počítání čísel) --- */
    // Funkce je nyní bezpečně uvnitř DOMContentLoaded
    const countUp = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2500; // 2.5 sekundy
        const startTime = performance.now();

        const update = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing: easeOutQuad
            const easeOutQuad = (t) => t * (2 - t);
            const currentCount = Math.floor(easeOutQuad(progress) * target);
            
            // Formátování s mezerami (např. 16 559 861)
            // Pokud chceš čárky (americký styl), změň " " na ","
            el.innerText = currentCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                // Ujistíme se, že na konci je přesné cílové číslo
                el.innerText = target.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            }
        };

        requestAnimationFrame(update);
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                observer.unobserve(entry.target); // Spustit jen jednou
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
        
        // Zavřít ostatní otevřené otázky (volitelné - pokud chceš, aby byl otevřený jen jeden)
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) item.classList.remove('active');
        });

        // Přepnout aktuální
        faqItem.classList.toggle('active');
    });
});