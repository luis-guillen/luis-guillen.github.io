let menuVisible = false;

// Función que oculta o muestra el menu
function mostrarOcultarMenu() {
    if (menuVisible) {
        document.getElementById("nav").classList = "";
        menuVisible = false;
    } else {
        document.getElementById("nav").classList = "responsive";
        menuVisible = true;
    }
}

function seleccionar() {
    // Oculto el menu una vez que selecciono una opción
    document.getElementById("nav").classList = "";
    menuVisible = false;
}

// Función que aplica las animaciones de las habilidades
function efectoHabilidades() {
    var skills = document.getElementById("skills");
    var distancia_skills = window.innerHeight - skills.getBoundingClientRect().top;

    if (distancia_skills >= 300) {
        let habilidades = document.getElementsByClassName("progreso");

        // Recorre todas las barras de progreso
        for (let i = 0; i < habilidades.length; i++) {
            let porcentaje = habilidades[i].querySelector("span").textContent; // Obtiene el porcentaje (ej: "90%")
            let valor = parseFloat(porcentaje); // Convierte el porcentaje a número (ej: 90)

            // Aplica el ancho directamente a la barra de progreso
            habilidades[i].style.width = valor + "%";
        }
    }
}

// Detectar el scrolling para aplicar la animación de la barra de habilidades
window.onscroll = function () {
    efectoHabilidades();
};

// Modo oscuro
document.addEventListener("DOMContentLoaded", function () {
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    
    // Verificar si el usuario ya tenía activado el modo claro
    if (localStorage.getItem("dark-mode") === "true") {
        document.body.classList.add("light-mode");
        darkModeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    // Evento de cambio de modo
    darkModeToggle.addEventListener("click", function () {
        document.body.classList.toggle("light-mode");

        // Cambiar icono y guardar preferencia
        if (document.body.classList.contains("light-mode")) {
            darkModeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
            localStorage.setItem("dark-mode", "true");
        } else {
            darkModeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
            localStorage.setItem("dark-mode", "false");
        }
    });

    // Portfolio filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.proyecto');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                // First, remove any existing animation classes
                item.style.animation = 'none';
                item.offsetHeight; // Trigger reflow
                
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    // Reset the animation
                    item.style.animation = 'fadeInUp 0.6s ease-out forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Crear partículas
    const inicio = document.querySelector('.inicio');
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    inicio.appendChild(particlesContainer);

    // Crear 30 partículas (menos cantidad pero más grandes)
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posición aleatoria
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Tamaño aleatorio pero más grande
        const size = Math.random() * 10 + 5; // Entre 5px y 15px
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Duración más lenta para un efecto más suave
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        
        // Retraso aleatorio
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        // Opacidad aleatoria
        particle.style.opacity = (Math.random() * 0.3 + 0.2).toString();
        
        particlesContainer.appendChild(particle);
    }
});

const text = "Luis Guillén Servera";
let index = 0;

function typeWriter() {
    if (index < text.length) {
        document.getElementById("typing").textContent += text.charAt(index);
        index++;
        setTimeout(typeWriter, 150);
    }
}

window.onload = function () {
    typeWriter();
    document.getElementById("preloader").style.display = "none";
};
