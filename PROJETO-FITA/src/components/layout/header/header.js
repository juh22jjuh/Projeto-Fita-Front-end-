class HeaderManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupActiveLinks();
        this.setupUserMenu();
        this.handleResize();
        this.checkLoginStatus();

        // 🔥 ADICIONE ESTA LINHA PARA TESTAR - FORÇAR USUÁRIO LOGADO
        this.forceTestLogin();
    }

    // 🔥 FUNÇÃO PARA TESTE - FORÇAR USUÁRIO LOGADO
    forceTestLogin() {

        const TESTAR_LOGADO = true;

        if (TESTAR_LOGADO) {
            console.log('🔥 MODO TESTE: Usuário LOGADO');
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userData', JSON.stringify({
                nome: 'João Silva',
                email: 'joao@fita.com',
                avatar: '../assets/default-avatar.png'
            }));
        } else {
            console.log('🔥 MODO TESTE: Usuário NÃO logado');
            localStorage.removeItem('userLoggedIn');
            localStorage.removeItem('userData');
        }

        this.checkLoginStatus();
    }

    // Resto do código permanece igual...
    checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');

        console.log('📊 Status login:', isLoggedIn);
        console.log('📊 Dados usuário:', userData);

        if (isLoggedIn) {
            this.showUserSection();
            this.updateUserInfo(userData);
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

        console.log('🎯 Mostrando usuário logado...');

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

        console.log('🎯 Mostrando usuário NÃO logado...');

        if (userSection) userSection.style.display = 'none';
        if (authSection) authSection.style.display = 'flex';
        if (sidebarUser) sidebarUser.style.display = 'none';
        if (sidebarUserItems) sidebarUserItems.style.display = 'none';
        if (sidebarAuth) sidebarAuth.style.display = 'block';
    }

    // Menu do usuário desktop
    setupUserMenu() {
        const userProfile = document.getElementById('user-profile');

        if (userProfile) {
            // Agora o clique funciona em toda a div do perfil
            userProfile.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleUserMenu();
            });
        }

        // Fechar menu ao clicar fora
        document.addEventListener('click', () => {
            this.closeUserMenu();
        });

        // Logout
        const logoutBtns = document.querySelectorAll('.logout-btn');
        logoutBtns.forEach(btn => {
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
            if (isOpen) {
                this.closeUserMenu();
            } else {
                this.openUserMenu();
            }
        }
    }

    openUserMenu() {
        const userMenu = document.getElementById('user-menu');
        if (userMenu) {
            userMenu.style.opacity = '1';
            userMenu.style.visibility = 'visible';
            userMenu.style.transform = 'translateY(5px)';
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

    // Menu mobile
    setupMobileMenu() {
        const mobileHamburger = document.getElementById('mobile-hamburger');
        const mobileSidebar = document.getElementById('mobile-sidebar');

        if (mobileHamburger && mobileSidebar) {
            mobileHamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });

            // Fechar menu ao clicar em um link
            document.querySelectorAll('.sidebar-nav-item').forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });

            // Fechar menu ao clicar fora
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.mobile-sidebar') &&
                    !e.target.closest('.mobile-hamburger') &&
                    mobileSidebar.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            });

            // Prevenir fechamento ao clicar dentro do sidebar
            mobileSidebar.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    toggleMobileMenu() {
        const mobileSidebar = document.getElementById('mobile-sidebar');
        const mobileHamburger = document.getElementById('mobile-hamburger');

        if (mobileSidebar.classList.contains('active')) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        const mobileSidebar = document.getElementById('mobile-sidebar');
        const mobileHamburger = document.getElementById('mobile-hamburger');

        mobileSidebar.classList.add('active');
        mobileHamburger.classList.add('active');

        // Adicionar overlay
        this.addOverlay();
    }

    closeMobileMenu() {
        const mobileSidebar = document.getElementById('mobile-sidebar');
        const mobileHamburger = document.getElementById('mobile-hamburger');

        mobileSidebar.classList.remove('active');
        mobileHamburger.classList.remove('active');

        // Remover overlay
        this.removeOverlay();
    }

    addOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay active';
        overlay.addEventListener('click', () => {
            this.closeMobileMenu();
        });
        document.body.appendChild(overlay);
    }

    removeOverlay() {
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    logout() {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userToken');
        this.closeMobileMenu();
        window.location.href = '../../index.html';
    }

    // Links ativos
    setupActiveLinks() {
        const currentPage = this.getCurrentPage();
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const linkPage = this.getPageFromHref(link.getAttribute('href'));
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page;
    }

    getPageFromHref(href) {
        if (!href) return '';
        return href.split('/').pop();
    }

    // Redimensionamento
    handleResize() {
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
                this.closeUserMenu();
            }
        });
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new HeaderManager();
});