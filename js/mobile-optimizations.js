/**
 * Trevão Silagem - Otimizações para Dispositivos Móveis
 * Melhorias de performance e usabilidade em smartphones
 */

document.addEventListener('DOMContentLoaded', function() {
    // Configuração otimizada do AOS para evitar barras de rolagem
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        offset: 50,
        disableMutationObserver: false,
        startEvent: 'DOMContentLoaded',
        mirror: false
    });
    
    // Prevenir overflow durante animações
    const preventOverflow = () => {
        document.documentElement.style.overflowX = 'hidden';
        document.body.style.overflowX = 'hidden';
    };
    
    // Aplicar prevenção de overflow ao carregar e durante o scroll
    preventOverflow();
    window.addEventListener('scroll', preventOverflow, { passive: true });
    window.addEventListener('resize', preventOverflow, { passive: true });
    
    // Função para lidar com a barra de rolagem durante animações
    function handleAnimationScrollbar() {
        // Força a ocultação da barra de rolagem horizontal
        document.documentElement.style.overflowX = 'hidden';
        document.body.style.overflowX = 'hidden';
        
        // Ajusta a largura do conteúdo para evitar overflow
        const contentWidth = window.innerWidth;
        if (document.body.scrollWidth > contentWidth) {
            document.body.style.width = contentWidth + 'px';
            document.body.style.maxWidth = '100%';
        }
    }
    
    // Aplicar ajustes durante as animações para evitar a barra de rolagem
    document.addEventListener('aos:in', handleAnimationScrollbar);
    document.addEventListener('aos:out', handleAnimationScrollbar);
    
    // Verificar e corrigir após todas as animações estarem completas
    document.addEventListener('aos:in:end', preventOverflow);

    // Detectar se é um dispositivo móvel
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Adicionar classe ao body para estilos específicos
        document.body.classList.add('mobile-device');
        
        // Otimizar animações em dispositivos móveis
        const allAnimatedElements = document.querySelectorAll('[data-aos]');
        allAnimatedElements.forEach(element => {
            // Reduzir atrasos em dispositivos móveis para melhorar a experiência
            if (element.getAttribute('data-aos-delay')) {
                const currentDelay = parseInt(element.getAttribute('data-aos-delay'));
                element.setAttribute('data-aos-delay', Math.min(currentDelay, 100));
            }
            
            // Simplificar animações em dispositivos móveis
            element.setAttribute('data-aos-once', 'true');
            
            // Garantir que as animações não causem overflow
            element.style.transformStyle = 'preserve-3d';
            element.style.backfaceVisibility = 'hidden';
            element.style.willChange = 'transform, opacity';
        });
        
        // Melhorar a interação com formulários em dispositivos móveis
        const formInputs = document.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            // Focus/blur para melhorar a experiência de digitação em dispositivos móveis
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('input-focused');
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('input-focused');
                // Ajuste automático da página após preenchimento de um campo
                if (this.value) {
                    window.scrollBy(0, 1);
                    window.scrollBy(0, -1);
                }
            });
        });
        
        // Melhorar o toque em elementos clicáveis
        const clickableItems = document.querySelectorAll('a, button, .service-card, .faq-question');
        clickableItems.forEach(item => {
            item.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, {passive: true});
            
            item.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            }, {passive: true});
        });
    }
    
    // Funções específicas para usabilidade em tela pequena
    
    // 1. Fechar o menu ao clicar fora ou após navegação
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    document.addEventListener('click', function(event) {
        const isMenuOpen = navList.classList.contains('active');
        const clickedInsideMenu = navList.contains(event.target);
        const clickedOnToggle = menuToggle.contains(event.target);
        
        if (isMenuOpen && !clickedInsideMenu && !clickedOnToggle) {
            menuToggle.classList.remove('active');
            navList.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }, {passive: true});
    
    // 2. Ajustar o scroll suave para levar em conta o header fixo em dispositivos móveis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Ajuste específico para dispositivos móveis
                const headerHeight = document.querySelector('.header').offsetHeight;
                let targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                targetPosition -= headerHeight;
                
                // Suavizar a navegação
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Prevenir overflow após o scroll
                preventOverflow();
                
                // Fechar o menu após clicar em um link (em dispositivos móveis)
                if (window.innerWidth < 768 && navList.classList.contains('active')) {
                    menuToggle.classList.remove('active');
                    navList.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }
        });
    });
    
    // 3. Gerenciar altura de elementos para evitar quebras de layout em dispositivos móveis
    function updateMobileLayout() {
        if (window.innerWidth < 768) {
            // Ajustar altura dos cards de serviço
            const serviceCards = document.querySelectorAll('.service-card');
            
            // Resetar alturas
            serviceCards.forEach(card => {
                card.style.height = 'auto';
            });
            
            // Verificar overflow e corrigir se necessário
            const windowWidth = window.innerWidth;
            const bodyWidth = document.body.scrollWidth;
            
            if (bodyWidth > windowWidth) {
                document.body.style.overflowX = 'hidden';
                document.documentElement.style.overflowX = 'hidden';
            }
        }
        
        // Garantir que não haja barra de rolagem horizontal
        preventOverflow();
    }
    
    // Executar ajustes quando o tamanho da janela mudar
    window.addEventListener('resize', updateMobileLayout, { passive: true });
    
    // Executar ajustes na carga inicial
    updateMobileLayout();
    
    // Ajuste final após todos os elementos e imagens estarem carregados
    window.addEventListener('load', function() {
        // Pequeno atraso para garantir que tudo esteja completamente renderizado
        setTimeout(function() {
            preventOverflow();
            // Reinicializar AOS se necessário
            AOS.refresh();
        }, 100);
    });
});

// FastClick para eliminar o atraso de 300ms em interações de toque
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        // Removendo o atraso no toque para todos os elementos clicáveis
        document.body.addEventListener('touchstart', function(){}, {passive: true});
    });
} 