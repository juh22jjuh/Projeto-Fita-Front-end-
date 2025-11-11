// header.js - Versão corrigida e simplificada para mobile
class HeaderManager {
    constructor() {
        this.isMobileMenuOpen = false;
        this.init();
    }

    init() {
        console.log('🚀 HeaderManager inicializando...');
        this.setupMobileMenu();
        this.setupUserMenu();
        this.checkLoginStatus();
        this.setupActiveLinks();
    }

    setupMobileMenu() {
        console.log('🔧 Configurando menu mobile...');
        
        const mobileHamburger = document.getElementById('mobile-hamburger');
        const mobileSidebar = document.getElementById('mobile-sidebar');
        const sidebarClose = document.getElementById('sidebar-close');
        const sidebarOverlay = document.getElementById('sidebar-overlay');

        if (!mobileHamburger || !mobileSidebar) {
            console.error('❌ Elementos do menu mobile não encontrados!');
            return;
        }

        // Abrir menu
        mobileHamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openMobileMenu();
        });

        // Fechar menu
        if (sidebarClose) {
            sidebarClose.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Fechar ao clicar em links - VERSÃO CORRIGIDA
        document.querySelectorAll('.sidebar-nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                // Se não for link âncora (#), fecha o menu
                const href = link.getAttribute('href');
                if (href && !href.startsWith('#')) {
                    this.closeMobileMenu();
                }
                // Links âncora mantêm o menu aberto para navegação suave
            });
        });

        console.log('✅ Menu mobile configurado!');
    }

    openMobileMenu() {
        console.log('📱 Abrindo menu mobile...');
        const mobileSidebar = document.getElementById('mobile-sidebar');
        const mobileHamburger = document.getElementById('mobile-hamburger');
        const sidebarOverlay = document.getElementById('sidebar-overlay');

        if (mobileSidebar) mobileSidebar.classList.add('active');
        if (mobileHamburger) mobileHamburger.classList.add('active');
        if (sidebarOverlay) sidebarOverlay.classList.add('active');
        
        document.body.classList.add('menu-open');
        this.isMobileMenuOpen = true;
    }

    closeMobileMenu() {
        console.log('📱 Fechando menu mobile...');
        const mobileSidebar = document.getElementById('mobile-sidebar');
        const mobileHamburger = document.getElementById('mobile-hamburger');
        const sidebarOverlay = document.getElementById('sidebar-overlay');

        if (mobileSidebar) mobileSidebar.classList.remove('active');
        if (mobileHamburger) mobileHamburger.classList.remove('active');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        
        document.body.classList.remove('menu-open');
        this.isMobileMenuOpen = false;
    }

    setupUserMenu() {
        const userProfile = document.getElementById('user-profile');
        if (userProfile) {
            userProfile.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleUserMenu();
            });

            // Fechar menu do usuário ao clicar fora
            document.addEventListener('click', () => {
                this.closeUserMenu();
            });
        }

        // Logout
        document.querySelectorAll('.logout-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        });
    }

    toggleUserMenu() {
        const userMenu = document.getElementById('user-menu');
        if (userMenu) {
            const isOpen = userMenu.style.opacity === '1';
            isOpen ? this.closeUserMenu() : this.openUserMenu();
        }
    }

    openUserMenu() {
        const userMenu = document.getElementById('user-menu');
        if (userMenu) {
            userMenu.style.opacity = '1';
            userMenu.style.visibility = 'visible';
            userMenu.style.transform = 'translateY(8px)';
        }
    }

    closeUserMenu() {
        const userMenu = document.getElementById('user-menu');
        if (userMenu) {
            userMenu.style.opacity = '0';
            userMenu.style.visibility = 'hidden';
            userMenu.style.transform = 'translateY(-10px)';
        }
    }

    checkLoginStatus() {
        // Simulação - você pode integrar com sua lógica real
        const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        console.log('🔐 Status login:', isLoggedIn);
        
        if (isLoggedIn) {
            this.showUserSection();
        } else {
            this.showAuthSection();
        }
    }

    showUserSection() {
        const userSection = document.getElementById('user-section');
        const authSection = document.getElementById('auth-section');
        const sidebarUser = document.getElementById('sidebar-user');
        const sidebarUserItems = document.getElementById('sidebar-user-items');
        const sidebarAuth = document.getElementById('sidebar-auth');

        if (userSection) userSection.style.display = 'flex';
        if (authSection) authSection.style.display = 'none';
        if (sidebarUser) sidebarUser.style.display = 'flex';
        if (sidebarUserItems) sidebarUserItems.style.display = 'block';
        if (sidebarAuth) sidebarAuth.style.display = 'none';
    }

    showAuthSection() {
        const userSection = document.getElementById('user-section');
        const authSection = document.getElementById('auth-section');
        const sidebarUser = document.getElementById('sidebar-user');
        const sidebarUserItems = document.getElementById('sidebar-user-items');
        const sidebarAuth = document.getElementById('sidebar-auth');

        if (userSection) userSection.style.display = 'none';
        if (authSection) authSection.style.display = 'flex';
        if (sidebarUser) sidebarUser.style.display = 'none';
        if (sidebarUserItems) sidebarUserItems.style.display = 'none';
        if (sidebarAuth) sidebarAuth.style.display = 'block';
    }

    logout() {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userData');
        this.closeMobileMenu();
        this.closeUserMenu();
        
        // Redirecionar para home
        setTimeout(() => {
            window.location.href = '../../index.html';
        }, 300);
    }

    setupActiveLinks() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        console.log('📍 Página atual:', currentPage);
        
        // Marcar links ativos no menu desktop
        document.querySelectorAll('.nav-link').forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref) {
                const linkPage = linkHref.split('/').pop();
                if (linkPage === currentPage) {
                    link.classList.add('active');
                }
            }
        });

        // Marcar links ativos no menu mobile
        document.querySelectorAll('.sidebar-nav-item').forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref && !linkHref.startsWith('#')) {
                const linkPage = linkHref.split('/').pop();
                if (linkPage === currentPage) {
                    link.style.color = 'var(--blue)';
                    link.style.fontWeight = '600';
                }
            }
        });
    }
}

// Inicialização garantida
function initializeHeader() {
    console.log('📄 Inicializando header...');
    
    // Aguardar um pouco para garantir que o DOM está pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new HeaderManager();
        });
    } else {
        // DOM já está pronto
        setTimeout(() => {
            new HeaderManager();
        }, 100);
    }
}

// Inicializar
initializeHeader();