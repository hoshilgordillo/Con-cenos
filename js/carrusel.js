
document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // MENÚ RESPONSIVO
    // =====================================

    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {

            navMenu.classList.toggle("active");

            const abierto = navMenu.classList.contains("active");

            menuToggle.textContent = abierto ? "✕" : "☰";
            menuToggle.setAttribute("aria-expanded", abierto);

        });

        document.querySelectorAll(".nav-menu a").forEach(enlace => {

            enlace.addEventListener("click", () => {

                navMenu.classList.remove("active");
                menuToggle.textContent = "☰";
                menuToggle.setAttribute("aria-expanded", "false");

            });

        });

    }


    // =====================================
    // ENCABEZADO Y BOTÓN VOLVER ARRIBA
    // =====================================

    const header = document.getElementById("header");
    const volverArriba = document.getElementById("volver-arriba");

    function actualizarScroll() {

        const posicion = window.scrollY;

        if (header) {
            header.classList.toggle("scrolled", posicion > 50);
        }

        if (volverArriba) {
            volverArriba.classList.toggle("visible", posicion > 400);
        }

    }

    window.addEventListener("scroll", actualizarScroll, {
        passive: true
    });

    actualizarScroll();

    if (volverArriba) {

        volverArriba.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    // =====================================
    // ANIMACIONES AL DESPLAZARSE
    // =====================================

    const elementosReveal = document.querySelectorAll(".reveal");

    const reducirMovimiento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if ("IntersectionObserver" in window && !reducirMovimiento) {

        const observerReveal = new IntersectionObserver((entradas, observer) => {

            entradas.forEach(entrada => {

                if (entrada.isIntersecting) {

                    entrada.target.classList.add("visible");

                    observer.unobserve(entrada.target);

                }

            });

        }, {
            threshold: 0.12
        });

        elementosReveal.forEach(elemento => {
            observerReveal.observe(elemento);
        });

    } else {

        elementosReveal.forEach(elemento => {
            elemento.classList.add("visible");
        });

    }


    // =====================================
    // CONTADORES ANIMADOS
    // =====================================

    const contadores = document.querySelectorAll(".contador");

    function animarContador(elemento) {

        const objetivo = Number(elemento.dataset.target);

        if (!Number.isFinite(objetivo) || objetivo < 0) {
            return;
        }

        const duracion = 1800;
        const inicio = performance.now();

        function actualizar(tiempo) {

            const progreso = Math.min(
                (tiempo - inicio) / duracion,
                1
            );

            // Efecto de aceleración y desaceleración
            const suavizado = 1 - Math.pow(1 - progreso, 4);

            const valor = Math.floor(objetivo * suavizado);

            elemento.textContent = valor.toLocaleString("es-MX");

            if (progreso < 1) {
                requestAnimationFrame(actualizar);
            } else {
                elemento.textContent = objetivo.toLocaleString("es-MX");
            }

        }

        requestAnimationFrame(actualizar);

    }

    if ("IntersectionObserver" in window) {

        const observerContadores = new IntersectionObserver((entradas, observer) => {

            entradas.forEach(entrada => {

                if (entrada.isIntersecting) {

                    animarContador(entrada.target);

                    observer.unobserve(entrada.target);

                }

            });

        }, {
            threshold: 0.5
        });

        contadores.forEach(contador => {
            observerContadores.observe(contador);
        });

    } else {

        contadores.forEach(animarContador);

    }


    // =====================================
    // GALERÍA LIGHTBOX
    // =====================================

    const lightbox = document.getElementById("lightbox");
    const imagenLightbox = document.getElementById("lightbox-imagen");

    const cerrarLightbox = document.getElementById("lightbox-cerrar");
    const anteriorLightbox = document.getElementById("lightbox-anterior");
    const siguienteLightbox = document.getElementById("lightbox-siguiente");

    const contadorLightbox = document.getElementById("lightbox-contador");

    const imagenesGaleria = document.querySelectorAll(".galeria-item");

    let imagenActual = 0;
    let elementoAnteriorFocus = null;

    if (lightbox && imagenLightbox && imagenesGaleria.length > 0) {

        // Obtener fotografías
        const fotografias = Array.from(imagenesGaleria).map(elemento => {

            return {
                src: elemento.dataset.full || elemento.querySelector("img").src,
                alt: elemento.querySelector("img").alt
            };

        });


        // Mostrar fotografía
        function mostrarFotografia(indice) {

            imagenActual = (
                indice + fotografias.length
            ) % fotografias.length;

            imagenLightbox.src = fotografias[imagenActual].src;
            imagenLightbox.alt = fotografias[imagenActual].alt;

            contadorLightbox.textContent =
                `${imagenActual + 1} / ${fotografias.length}`;

        }


        // Abrir visor
        function abrirLightbox(indice) {

            elementoAnteriorFocus = document.activeElement;

            mostrarFotografia(indice);

            lightbox.classList.add("active");
            lightbox.setAttribute("aria-hidden", "false");

            document.body.classList.add("lightbox-abierto");

            cerrarLightbox.focus();

        }


        // Cerrar visor
        function cerrarVisor() {

            lightbox.classList.remove("active");
            lightbox.setAttribute("aria-hidden", "true");

            document.body.classList.remove("lightbox-abierto");

            imagenLightbox.src = "";

            if (elementoAnteriorFocus) {
                elementoAnteriorFocus.focus();
            }

        }


        // Abrir al seleccionar una fotografía
        imagenesGaleria.forEach((elemento, indice) => {

            elemento.addEventListener("click", () => {
                abrirLightbox(indice);
            });

        });


        // Fotografía anterior
        anteriorLightbox.addEventListener("click", () => {

            mostrarFotografia(imagenActual - 1);

        });


        // Fotografía siguiente
        siguienteLightbox.addEventListener("click", () => {

            mostrarFotografia(imagenActual + 1);

        });


        // Cerrar con botón
        cerrarLightbox.addEventListener("click", cerrarVisor);


        // Cerrar al hacer clic fuera de la imagen
        lightbox.addEventListener("click", evento => {

            if (evento.target === lightbox) {
                cerrarVisor();
            }

        });


        // Navegación con teclado
        document.addEventListener("keydown", evento => {

            if (!lightbox.classList.contains("active")) {
                return;
            }

            if (evento.key === "Escape") {
                cerrarVisor();
            }

            if (evento.key === "ArrowRight") {
                mostrarFotografia(imagenActual + 1);
            }

            if (evento.key === "ArrowLeft") {
                mostrarFotografia(imagenActual - 1);
            }

        });


        // Deslizar fotografías en celulares
        let inicioX = 0;

        lightbox.addEventListener("touchstart", evento => {

            inicioX = evento.changedTouches[0].clientX;

        }, {
            passive: true
        });

        lightbox.addEventListener("touchend", evento => {

            const finalX = evento.changedTouches[0].clientX;
            const diferencia = finalX - inicioX;

            if (Math.abs(diferencia) < 50) {
                return;
            }

            if (diferencia < 0) {
                mostrarFotografia(imagenActual + 1);
            } else {
                mostrarFotografia(imagenActual - 1);
            }

        }, {
            passive: true
        });

    }


    // =====================================
    // CARRUSEL ANTERIOR (COMPATIBILIDAD)
    // =====================================

    const pista = document.getElementById("carrusel-pista");
    const slides = document.querySelectorAll(".slide");

    const botonAnterior = document.getElementById("anterior");
    const botonSiguiente = document.getElementById("siguiente");

    const indicadores = document.getElementById("indicadores");

    if (pista && slides.length > 0 && botonAnterior && botonSiguiente) {

        let indice = 0;
        let intervalo;

        // Crear indicadores
        if (indicadores) {

            slides.forEach((slide, i) => {

                const punto = document.createElement("button");

                punto.type = "button";
                punto.classList.add("indicador");

                punto.setAttribute(
                    "aria-label",
                    `Mostrar imagen ${i + 1}`
                );

                punto.addEventListener("click", () => {

                    mostrarSlide(i);
                    reiniciarCarrusel();

                });

                indicadores.appendChild(punto);

            });

        }

        const puntos = indicadores
            ? indicadores.querySelectorAll(".indicador")
            : [];

        function mostrarSlide(nuevoIndice) {

            indice = (nuevoIndice + slides.length) % slides.length;

            pista.style.transform =
                `translateX(-${indice * 100}%)`;

            puntos.forEach((punto, i) => {

                punto.classList.toggle(
                    "activo",
                    i === indice
                );

            });

        }

        botonAnterior.addEventListener("click", () => {

            mostrarSlide(indice - 1);
            reiniciarCarrusel();

        });

        botonSiguiente.addEventListener("click", () => {

            mostrarSlide(indice + 1);
            reiniciarCarrusel();

        });

        function iniciarCarrusel() {

            clearInterval(intervalo);

            if (!document.hidden && slides.length > 1) {

                intervalo = setInterval(() => {

                    mostrarSlide(indice + 1);

                }, 4000);

            }

        }

        function reiniciarCarrusel() {
            iniciarCarrusel();
        }

        const carrusel = document.querySelector(".carrusel");

        if (carrusel) {

            carrusel.addEventListener("mouseenter", () => {
                clearInterval(intervalo);
            });

            carrusel.addEventListener("mouseleave", iniciarCarrusel);

        }

        document.addEventListener("visibilitychange", iniciarCarrusel);

        mostrarSlide(0);
        iniciarCarrusel();

    }

    console.log("Página Conócenos cargada correctamente.");

});
