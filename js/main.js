/**
 * Trevão Silagem - JavaScript principal
 * Responsável pelas interações da landing page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicialização do AOS será feita pelo arquivo mobile-optimizations.js
    // para evitar duplicação e configurar corretamente os parâmetros de animação
    
    // Verificar se estamos em um dispositivo móvel
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Função auxiliar para prevenir overflow durante animações
    function preventOverflow() {
        document.documentElement.style.overflowX = 'hidden';
        document.body.style.overflowX = 'hidden';
    }
    
    // Garantir que não haja scrollbar horizontal
    preventOverflow();

    // Header com transparência no scroll
    const header = document.querySelector('.header');
    
    function toggleHeaderClass() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', toggleHeaderClass);
    toggleHeaderClass(); // Verificar posição inicial
    
    // Menu mobile
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        navList.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = navList.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnToggle && navList.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navList.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Fechar menu ao clicar em links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navList.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Fechar outros itens abertos
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle do item atual
                item.classList.toggle('active');
            });
        });
    }
    
    // Formulário de contato
    const contactForm = document.getElementById('formulario-contato');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Captura os valores do formulário
            const formData = {
                nome: document.getElementById('nome').value,
                empresa: document.getElementById('empresa').value,
                email: document.getElementById('email').value,
                telefone: document.getElementById('telefone').value,
                mensagem: document.getElementById('mensagem').value,
                newsletter: document.getElementById('newsletter').checked
            };
            
            // Simulação de envio (aqui você implementaria o envio real)
            console.log('Dados do formulário:', formData);
            
            // Feedback para o usuário
            alert('Obrigado! Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.');
            
            // Reset do formulário
            contactForm.reset();
        });
    }
    
    // Máscara para o campo de telefone
    const telefoneInput = document.getElementById('telefone');
    
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value;
            
            // Remove todos os caracteres não numéricos
            value = value.replace(/\D/g, '');
            
            // Aplica a máscara de telefone (formato brasileiro)
            if (value.length <= 11) {
                if (value.length > 2) {
                    value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
                }
                if (value.length > 10) {
                    value = `${value.substring(0, 10)}-${value.substring(10)}`;
                }
            }
            
            e.target.value = value;
        });
    }
    
    // Lazy loading de imagens
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores que não suportam IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
    
    // Botão Voltar ao Topo
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Smooth scroll para as âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Prevenir overflow após o scroll
                preventOverflow();
            }
        });
    });
});