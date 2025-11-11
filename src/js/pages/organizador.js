// Elementos principais
const searchInput = document.querySelector('.organizador-search-input');
const tabs = document.querySelectorAll('.organizador-tab');
const tableRows = document.querySelectorAll('.organizador-table-row');
const viewButtons = document.querySelectorAll('.organizador-action-view');
const exportButton = document.querySelector('.organizador-export-btn');
const participantModal = document.getElementById('organizador-participant-modal');
const modalClose = document.getElementById('organizador-modal-close');
const modalBody = document.querySelector('.organizador-modal-participant-info');

// Dados de exemplo dos participantes
const participantsData = {
    1: {
        name: "João Silva Santos",
        email: "joao.silva@empresa.com",
        phone: "(11) 99999-9999",
        city: "São Paulo, SP",
        status: "confirmado",
        registrationDate: "15/02/2025",
        company: "AgroTech Solutions",
        position: "Diretor Comercial",
        interests: ["Agronegócio", "Tecnologia", "Inovação", "Sustentabilidade"],
        notes: "Participante muito interessado em soluções de IoT para agronegócio."
    },
    2: {
        name: "Maria Oliveira Costa",
        email: "maria.oliveira@tech.com",
        phone: "(21) 88888-8888",
        city: "Rio de Janeiro, RJ",
        status: "pendente",
        registrationDate: "18/02/2025",
        company: "InovaTech RJ",
        position: "Gerente de Projetos",
        interests: ["Indústria 4.0", "Sustentabilidade", "Digital"],
        notes: "Aguardando confirmação de pagamento."
    },
    3: {
        name: "Pedro Henrique Lima",
        email: "pedro.lima@agro.com",
        phone: "(31) 77777-7777",
        city: "Belo Horizonte, MG",
        status: "cancelado",
        registrationDate: "12/02/2025",
        company: "AgroExport MG",
        position: "CEO",
        interests: ["Agrotech", "Exportação", "Logística"],
        notes: "Cancelou devido a conflito de agenda.",
        cancellationReason: "Conflito de agenda"
    },
    4: {
        name: "Ana Carolina Souza",
        email: "ana.souza@inovacao.com",
        phone: "(47) 66666-6666",
        city: "Blumenau, SC",
        status: "confirmado",
        registrationDate: "20/02/2025",
        company: "TechValley SC",
        position: "CTO",
        interests: ["IoT", "Automação", "Digital", "Inovação"],
        notes: "Vai apresentar palestra sobre Indústria 4.0."
    },
    5: {
        name: "Carlos Eduardo Rodrigues",
        email: "carlos.rodrigues@industria.com",
        phone: "(51) 55555-5555",
        city: "Porto Alegre, RS",
        status: "pendente",
        registrationDate: "22/02/2025",
        company: "Metalúrgica Progresso",
        position: "Diretor Industrial",
        interests: ["Automação", "Eficiência Energética", "Qualidade"],
        notes: "Aguardando aprovação da empresa."
    }
};

// Filtro de busca
searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    tableRows.forEach(row => {
        const rowText = row.textContent.toLowerCase();
        if (rowText.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

// Filtro por tabs
tabs.forEach(tab => {
    tab.addEventListener('click', function() {
        // Remove classe active de todas as tabs
        tabs.forEach(t => t.classList.remove('organizador-tab-active'));
        // Adiciona classe active na tab clicada
        this.classList.add('organizador-tab-active');
        
        const filter = this.textContent.toLowerCase().trim();
        filterTable(filter);
    });
});

function filterTable(filter) {
    tableRows.forEach(row => {
        const badge = row.querySelector('.organizador-badge');
        const status = badge.textContent.toLowerCase().trim();
        
        if (filter === 'todos') {
            row.style.display = '';
        } else if (filter === 'confirmados' && status.includes('confirmado')) {
            row.style.display = '';
        } else if (filter === 'pendentes' && status.includes('pendente')) {
            row.style.display = '';
        } else if (filter === 'cancelados' && status.includes('cancelado')) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Abrir modal ao clicar na linha da tabela
tableRows.forEach(row => {
    row.addEventListener('click', function(e) {
        // Não abrir modal se clicar nos botões de ação
        if (!e.target.closest('.organizador-action-btn')) {
            const participantId = this.getAttribute('data-participant');
            openParticipantModal(participantId);
        }
    });
});

// Abrir modal ao clicar no botão de visualizar
viewButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.stopPropagation(); // Impedir que o evento chegue na linha
        const row = this.closest('.organizador-table-row');
        const participantId = row.getAttribute('data-participant');
        openParticipantModal(participantId);
    });
});

// Função para abrir modal com dados do participante
function openParticipantModal(participantId) {
    const participant = participantsData[participantId];
    
    if (participant) {
        // Determinar cor do badge baseado no status
        let statusBadgeClass = '';
        let statusIcon = '';
        
        switch(participant.status) {
            case 'confirmado':
                statusBadgeClass = 'organizador-badge-green';
                statusIcon = 'fa-check-circle';
                break;
            case 'pendente':
                statusBadgeClass = 'organizador-badge-yellow';
                statusIcon = 'fa-clock';
                break;
            case 'cancelado':
                statusBadgeClass = 'organizador-badge-red';
                statusIcon = 'fa-times-circle';
                break;
        }
        
        // Gerar avatar com iniciais
        const initials = participant.name.split(' ').map(n => n[0]).join('').toUpperCase();
        
        // Gerar tags de interesses
        const interestsHTML = participant.interests.map(interest => 
            `<span class="organizador-modal-tag">${interest}</span>`
        ).join('');
        
        // HTML do modal
        modalBody.innerHTML = `
            <div class="organizador-user-avatar">
                ${initials}
            </div>
            
            <div class="organizador-modal-info-group">
                <h4>Informações Pessoais</h4>
                <div class="organizador-modal-info-item">
                    <i class="fas fa-user"></i>
                    <span><strong>Nome:</strong> ${participant.name}</span>
                </div>
                <div class="organizador-modal-info-item">
                    <i class="fas fa-envelope"></i>
                    <span><strong>Email:</strong> ${participant.email}</span>
                </div>
                <div class="organizador-modal-info-item">
                    <i class="fas fa-phone"></i>
                    <span><strong>Telefone:</strong> ${participant.phone}</span>
                </div>
                <div class="organizador-modal-info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span><strong>Cidade:</strong> ${participant.city}</span>
                </div>
                <div class="organizador-modal-info-item">
                    <i class="fas fa-calendar"></i>
                    <span><strong>Data de Inscrição:</strong> ${participant.registrationDate}</span>
                </div>
                <div class="organizador-modal-info-item">
                    <i class="fas fa-building"></i>
                    <span><strong>Empresa:</strong> ${participant.company}</span>
                </div>
                <div class="organizador-modal-info-item">
                    <i class="fas fa-briefcase"></i>
                    <span><strong>Cargo:</strong> ${participant.position}</span>
                </div>
                <div class="organizador-modal-info-item">
                    <i class="fas fa-info-circle"></i>
                    <span><strong>Status:</strong> 
                        <span class="organizador-badge ${statusBadgeClass}">
                            <i class="fas ${statusIcon}"></i> ${participant.status}
                        </span>
                    </span>
                </div>
                ${participant.cancellationReason ? `
                <div class="organizador-modal-info-item">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span><strong>Motivo do Cancelamento:</strong> ${participant.cancellationReason}</span>
                </div>
                ` : ''}
            </div>
            
            <div class="organizador-modal-info-group">
                <h4>Áreas de Interesse</h4>
                <div class="organizador-modal-tags">
                    ${interestsHTML}
                </div>
            </div>
            
            <div class="organizador-modal-info-group">
                <h4>Observações</h4>
                <div class="organizador-modal-info-item">
                    <i class="fas fa-sticky-note"></i>
                    <span>${participant.notes}</span>
                </div>
            </div>
        `;
        
        // Abrir modal
        participantModal.style.display = 'flex';
    }
}

// Fechar modal
modalClose.addEventListener('click', closeParticipantModal);
participantModal.addEventListener('click', function(e) {
    if (e.target === participantModal) {
        closeParticipantModal();
    }
});

function closeParticipantModal() {
    participantModal.style.display = 'none';
}

// Botão de exportar
exportButton.addEventListener('click', function() {
    // Simulação de exportação
    const exportData = {
        filename: 'participantes_fita.csv',
        content: 'Nome,Email,Telefone,Cidade,Status,Data Inscrição\nJoão Silva,joao@email.com,(11)99999-9999,São Paulo,Confirmado,15/02/2025\nMaria Oliveira,maria@email.com,(21)88888-8888,Rio de Janeiro,Pendente,18/02/2025'
    };
    
    // Criar e baixar arquivo CSV
    const blob = new Blob([exportData.content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportData.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    // Feedback visual
    const originalText = this.innerHTML;
    this.innerHTML = '<i class="fas fa-check"></i> Exportado!';
    this.style.background = '#10b981';
    
    setTimeout(() => {
        this.innerHTML = originalText;
        this.style.background = '';
    }, 2000);
});

// Botões de ação nos modais
document.querySelectorAll('.organizador-action-edit').forEach(button => {
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        const row = this.closest('.organizador-table-row');
        const participantName = row.querySelector('strong').textContent;
        alert(`Editando participante: ${participantName}`);
    });
});

document.querySelectorAll('.organizador-action-email').forEach(button => {
    button.addEventListener('click', function(e) {
        e.stopPropagation();
        const row = this.closest('.organizador-table-row');
        const email = row.querySelector('.organizador-table-cell:nth-child(2)').textContent.trim();
        window.location.href = `mailto:${email}?subject=3ª FITA - Contato`;
    });
});

// Fechar modal com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeParticipantModal();
    }
});

// Paginação (simulação)
document.querySelectorAll('.organizador-pagination-page').forEach(page => {
    page.addEventListener('click', function() {
        document.querySelectorAll('.organizador-pagination-page').forEach(p => {
            p.classList.remove('organizador-pagination-active');
        });
        this.classList.add('organizador-pagination-active');
    });
});