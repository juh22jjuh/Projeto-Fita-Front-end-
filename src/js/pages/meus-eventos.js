// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const criarEventoBtn = document.getElementById('criarEventoBtn');
    const criarEventoModal = document.getElementById('criarEventoModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelarBtn = document.getElementById('cancelarBtn');
    const salvarRascunhoBtn = document.getElementById('salvarRascunhoBtn');
    const criarEventoSubmitBtn = document.getElementById('criarEventoSubmitBtn');
    const descricaoEvento = document.getElementById('descricaoEvento');
    const charCount = document.getElementById('charCount');
    const eventoForm = document.getElementById('eventoForm');
    
    // Criar modais de feedback
    criarModaisFeedback();
    
    // Open create event modal
    criarEventoBtn.addEventListener('click', function() {
        criarEventoModal.style.display = 'flex';
    });
    
    // Close modal when close buttons are clicked
    closeModalBtn.addEventListener('click', function() {
        if (confirm('Tem certeza que deseja cancelar? Todas as informações não salvas serão perdidas.')) {
            criarEventoModal.style.display = 'none';
            eventoForm.reset();
            charCount.textContent = '0';
        }
    });
    
    cancelarBtn.addEventListener('click', function() {
        if (confirm('Tem certeza que deseja cancelar? Todas as informações não salvas serão perdidas.')) {
            criarEventoModal.style.display = 'none';
            eventoForm.reset();
            charCount.textContent = '0';
        }
    });
    
    // Close modal when clicking outside the modal content
    criarEventoModal.addEventListener('click', function(e) {
        if (e.target === criarEventoModal) {
            if (confirm('Tem certeza que deseja cancelar? Todas as informações não salvas serão perdidas.')) {
                criarEventoModal.style.display = 'none';
                eventoForm.reset();
                charCount.textContent = '0';
            }
        }
    });
    
    // Character count for description
    descricaoEvento.addEventListener('input', function() {
        const count = this.value.length;
        charCount.textContent = count;
        
        if (count < 100) {
            this.style.borderColor = '#dc2626';
            charCount.style.color = '#dc2626';
        } else {
            this.style.borderColor = '#059669';
            charCount.style.color = '#059669';
        }
    });
    
    // Save as draft
    salvarRascunhoBtn.addEventListener('click', function() {
        if (validateForm(true)) {
            // In a real application, you would save the draft here
            const titulo = document.getElementById('tituloEvento').value || 'Sem título';
            
            criarEventoModal.style.display = 'none';
            eventoForm.reset();
            charCount.textContent = '0';
            
            // Add to events table as draft
            addEventToTable({
                titulo: titulo,
                categoria: document.getElementById('categoriaEvento').value || 'Não definida',
                tipo: document.getElementById('tipoEvento').value || 'Não definido',
                data: document.getElementById('dataEvento').value || '--/--/----',
                horario: document.getElementById('horarioEvento').value || '--:--',
                duracao: document.getElementById('duracaoEvento').value || '--',
                participantes: '-/--',
                status: 'draft'
            }, Date.now());
            
            // Mostrar modal de sucesso
            mostrarModalSucesso('Rascunho Salvo!', `O evento "${titulo}" foi salvo como rascunho com sucesso.`);
        }
    });
    
    // Create event
    eventoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const titulo = document.getElementById('tituloEvento').value;
            
            criarEventoModal.style.display = 'none';
            
            // Add to events table
            addEventToTable({
                titulo: titulo,
                categoria: document.getElementById('categoriaEvento').value,
                tipo: document.getElementById('tipoEvento').value,
                data: formatDate(document.getElementById('dataEvento').value),
                horario: document.getElementById('horarioEvento').value,
                duracao: document.getElementById('duracaoEvento').value,
                participantes: '0/200',
                status: 'active'
            }, Date.now());
            
            eventoForm.reset();
            charCount.textContent = '0';
            
            // Mostrar modal de sucesso
            mostrarModalSucesso('Evento Criado!', `O evento "${titulo}" foi criado com sucesso!`);
        }
    });
    
    // Form validation
    function validateForm(isDraft = false) {
        const titulo = document.getElementById('tituloEvento').value;
        const tipo = document.getElementById('tipoEvento').value;
        const categoria = document.getElementById('categoriaEvento').value;
        const instrutor = document.getElementById('instrutorEvento').value;
        const local = document.getElementById('localEvento').value;
        const data = document.getElementById('dataEvento').value;
        const horario = document.getElementById('horarioEvento').value;
        const duracao = document.getElementById('duracaoEvento').value;
        const descricao = document.getElementById('descricaoEvento').value;
        
        if (!isDraft) {
            if (!titulo) {
                mostrarModalErro('Campo Obrigatório', 'Por favor, preencha o título do evento.');
                return false;
            }
            
            if (!tipo) {
                mostrarModalErro('Campo Obrigatório', 'Por favor, selecione o tipo de evento.');
                return false;
            }
            
            if (!categoria) {
                mostrarModalErro('Campo Obrigatório', 'Por favor, selecione a categoria do evento.');
                return false;
            }
            
            if (!instrutor) {
                mostrarModalErro('Campo Obrigatório', 'Por favor, preencha o nome do instrutor/palestrante.');
                return false;
            }
            
            if (!local) {
                mostrarModalErro('Campo Obrigatório', 'Por favor, preencha o local do evento.');
                return false;
            }
            
            if (!data) {
                mostrarModalErro('Campo Obrigatório', 'Por favor, selecione a data do evento.');
                return false;
            }
            
            if (!horario) {
                mostrarModalErro('Campo Obrigatório', 'Por favor, selecione o horário do evento.');
                return false;
            }
            
            if (!duracao) {
                mostrarModalErro('Campo Obrigatório', 'Por favor, selecione a duração do evento.');
                return false;
            }
            
            if (descricao.length < 100) {
                mostrarModalErro('Descrição Insuficiente', 'A descrição deve ter pelo menos 100 caracteres.');
                return false;
            }
        }
        
        return true;
    }
    
    // Format date from YYYY-MM-DD to DD/MM/YYYY
    function formatDate(dateString) {
        if (!dateString) return '--/--/----';
        
        const parts = dateString.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateString;
    }
    
    // Add event to table
    function addEventToTable(event, eventId) {
        const tableBody = document.querySelector('.meus-eventos-table tbody');
        const newRow = document.createElement('tr');
        newRow.className = 'meus-eventos-clickable-row';
        newRow.setAttribute('data-event-id', eventId);
        
        // Adicionar evento de clique para redirecionamento
        newRow.addEventListener('click', function(e) {
            // Não redirecionar se o clique foi em um botão de ação
            if (!e.target.closest('.meus-eventos-actions')) {
                window.location.href = `../organizador/organizador.html?id=${eventId}`;
            }
        });
        
        const statusClass = event.status === 'active' ? 'meus-eventos-status-active' : 
                           event.status === 'draft' ? 'meus-eventos-status-draft' : 
                           'meus-eventos-status-finished';
        
        const statusText = event.status === 'active' ? 'Ativo' : 
                          event.status === 'draft' ? 'Rascunho' : 
                          'Finalizado';
        
        const actionButton = event.status === 'draft' ? 'Continuar' : 'Editar';
        const actionIcon = event.status === 'draft' ? 'fa-edit' : 
                          event.status === 'active' ? 'fa-edit' : 'fa-eye';
        
        newRow.innerHTML = `
            <td>
                <div class="meus-eventos-event-title">${event.titulo}</div>
                <div class="meus-eventos-event-category">${event.categoria}</div>
            </td>
            <td>${event.tipo}</td>
            <td>
                <div class="meus-eventos-event-date">${event.data}</div>
                <div class="meus-eventos-event-time">${event.horario} (${event.duracao}min)</div>
            </td>
            <td>
                <div class="meus-eventos-event-participants">${event.participantes}</div>
            </td>
            <td>
                <span class="meus-eventos-status ${statusClass}">${statusText}</span>
            </td>
            <td>
                <div class="meus-eventos-actions">
                    <button class="meus-eventos-action-btn" onclick="editarEvento(${eventId}, event)">
                        <i class="fas ${actionIcon}"></i> ${actionButton}
                    </button>
                    <button class="meus-eventos-action-btn meus-eventos-action-danger" onclick="excluirEvento(${eventId}, event)">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </td>
        `;
        
        tableBody.prepend(newRow);
        
        // Atualizar estatísticas
        atualizarEstatisticas();
    }
    
    // Adicionar eventos de clique para as linhas existentes
    const existingRows = document.querySelectorAll('.meus-eventos-clickable-row');
    existingRows.forEach(row => {
        const eventId = row.getAttribute('data-event-id');
        row.addEventListener('click', function(e) {
            // Não redirecionar se o clique foi em um botão de ação
            if (!e.target.closest('.meus-eventos-actions')) {
                window.location.href = `../pages/organizador.html?id=${eventId}`;
            }
        });
        
        // Adicionar cursor pointer para indicar que é clicável
        row.style.cursor = 'pointer';
    });
    
    // Filter buttons functionality
    const filterButtons = document.querySelectorAll('.meus-eventos-tab');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('meus-eventos-tab-active'));
            
            // Add active class to clicked button
            this.classList.add('meus-eventos-tab-active');
            
            // Filter events based on tab
            const filter = this.textContent.trim();
            filterEvents(filter);
        });
    });
    
    // Filter events function
    function filterEvents(filter) {
        const rows = document.querySelectorAll('.meus-eventos-clickable-row');
        
        rows.forEach(row => {
            const statusElement = row.querySelector('.meus-eventos-status');
            const status = statusElement.textContent.trim();
            
            switch(filter) {
                case 'Todos':
                    row.style.display = '';
                    break;
                case 'Ativos':
                    row.style.display = status === 'Ativo' ? '' : 'none';
                    break;
                case 'Finalizados':
                    row.style.display = status === 'Finalizado' ? '' : 'none';
                    break;
                case 'Rascunhos':
                    row.style.display = status === 'Rascunho' ? '' : 'none';
                    break;
            }
        });
    }
    
    // Search functionality
    const searchInput = document.querySelector('.meus-eventos-search-input');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('.meus-eventos-clickable-row');
        
        rows.forEach(row => {
            const title = row.querySelector('.meus-eventos-event-title').textContent.toLowerCase();
            const category = row.querySelector('.meus-eventos-event-category').textContent.toLowerCase();
            const type = row.cells[1].textContent.toLowerCase();
            
            if (title.includes(searchTerm) || category.includes(searchTerm) || type.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
    
    // Export CSV functionality
    const exportBtn = document.querySelector('.meus-eventos-export-btn');
    
    exportBtn.addEventListener('click', function() {
        // Criar dados CSV
        const eventos = [];
        document.querySelectorAll('.meus-eventos-clickable-row').forEach(row => {
            const titulo = row.querySelector('.meus-eventos-event-title').textContent;
            const categoria = row.querySelector('.meus-eventos-event-category').textContent;
            const tipo = row.cells[1].textContent;
            const data = row.querySelector('.meus-eventos-event-date').textContent;
            const horario = row.querySelector('.meus-eventos-event-time').textContent;
            const participantes = row.querySelector('.meus-eventos-event-participants').textContent;
            const status = row.querySelector('.meus-eventos-status').textContent;
            
            eventos.push({
                titulo, categoria, tipo, data, horario, participantes, status
            });
        });
        
        // Converter para CSV
        const headers = ['Título', 'Categoria', 'Tipo', 'Data', 'Horário', 'Participantes', 'Status'];
        const csvContent = [
            headers.join(','),
            ...eventos.map(event => [
                `"${event.titulo}"`,
                `"${event.categoria}"`,
                `"${event.tipo}"`,
                `"${event.data}"`,
                `"${event.horario}"`,
                `"${event.participantes}"`,
                `"${event.status}"`
            ].join(','))
        ].join('\n');
        
        // Criar e baixar arquivo
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'meus-eventos-fita.csv');
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Mostrar modal de sucesso
        mostrarModalSucesso('Exportação Concluída!', 'Seus eventos foram exportados para CSV com sucesso.');
    });
});

// Função para criar modais de feedback
function criarModaisFeedback() {
    const modaisHTML = `
        <!-- Modal de Sucesso -->
        <div id="meus-eventos-modal-sucesso" class="meus-eventos-feedback-modal">
            <div class="meus-eventos-feedback-content meus-eventos-feedback-success">
                <div class="meus-eventos-feedback-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3 id="meus-eventos-feedback-titulo">Sucesso!</h3>
                <p id="meus-eventos-feedback-mensagem">Operação realizada com sucesso.</p>
                <button class="meus-eventos-feedback-btn" onclick="fecharModalFeedback()">OK</button>
            </div>
        </div>

        <!-- Modal de Erro -->
        <div id="meus-eventos-modal-erro" class="meus-eventos-feedback-modal">
            <div class="meus-eventos-feedback-content meus-eventos-feedback-error">
                <div class="meus-eventos-feedback-icon">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <h3 id="meus-eventos-erro-titulo">Erro!</h3>
                <p id="meus-eventos-erro-mensagem">Ocorreu um erro na operação.</p>
                <button class="meus-eventos-feedback-btn" onclick="fecharModalFeedback()">Entendi</button>
            </div>
        </div>

        <!-- Modal de Confirmação -->
        <div id="meus-eventos-modal-confirmacao" class="meus-eventos-feedback-modal">
            <div class="meus-eventos-feedback-content meus-eventos-feedback-warning">
                <div class="meus-eventos-feedback-icon">
                    <i class="fas fa-question-circle"></i>
                </div>
                <h3 id="meus-eventos-confirmacao-titulo">Confirmação</h3>
                <p id="meus-eventos-confirmacao-mensagem">Tem certeza que deseja realizar esta ação?</p>
                <div class="meus-eventos-feedback-buttons">
                    <button class="meus-eventos-feedback-btn meus-eventos-feedback-cancel" onclick="fecharModalFeedback()">Cancelar</button>
                    <button class="meus-eventos-feedback-btn meus-eventos-feedback-confirm" id="meus-eventos-confirm-btn">Confirmar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modaisHTML);
}

// Funções para mostrar modais
function mostrarModalSucesso(titulo, mensagem) {
    const modal = document.getElementById('meus-eventos-modal-sucesso');
    const tituloEl = document.getElementById('meus-eventos-feedback-titulo');
    const mensagemEl = document.getElementById('meus-eventos-feedback-mensagem');
    
    tituloEl.textContent = titulo;
    mensagemEl.textContent = mensagem;
    modal.style.display = 'flex';
}

function mostrarModalErro(titulo, mensagem) {
    const modal = document.getElementById('meus-eventos-modal-erro');
    const tituloEl = document.getElementById('meus-eventos-erro-titulo');
    const mensagemEl = document.getElementById('meus-eventos-erro-mensagem');
    
    tituloEl.textContent = titulo;
    mensagemEl.textContent = mensagem;
    modal.style.display = 'flex';
}

function mostrarModalConfirmacao(titulo, mensagem, callbackConfirm) {
    const modal = document.getElementById('meus-eventos-modal-confirmacao');
    const tituloEl = document.getElementById('meus-eventos-confirmacao-titulo');
    const mensagemEl = document.getElementById('meus-eventos-confirmacao-mensagem');
    const confirmBtn = document.getElementById('meus-eventos-confirm-btn');
    
    tituloEl.textContent = titulo;
    mensagemEl.textContent = mensagem;
    
    // Remover event listener anterior e adicionar novo
    const novoConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(novoConfirmBtn, confirmBtn);
    
    novoConfirmBtn.addEventListener('click', function() {
        fecharModalFeedback();
        if (callbackConfirm) callbackConfirm();
    });
    
    modal.style.display = 'flex';
}

function fecharModalFeedback() {
    const modais = document.querySelectorAll('.meus-eventos-feedback-modal');
    modais.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Global functions for event actions
function editarEvento(eventId, e) {
    if (e) e.stopPropagation(); // Impede o redirecionamento da linha
    const eventTitle = document.querySelector(`[data-event-id="${eventId}"] .meus-eventos-event-title`).textContent;
    mostrarModalSucesso('Editar Evento', `Editando evento: ${eventTitle}`);
    // Here you would open the edit modal or redirect to edit page
}

function excluirEvento(eventId, e) {
    if (e) e.stopPropagation(); // Impede o redirecionamento da linha
    const eventTitle = document.querySelector(`[data-event-id="${eventId}"] .meus-eventos-event-title`).textContent;
    
    mostrarModalConfirmacao(
        'Excluir Evento', 
        `Tem certeza que deseja excluir o evento "${eventTitle}"? Esta ação não pode ser desfeita.`,
        function() {
            const row = document.querySelector(`[data-event-id="${eventId}"]`);
            row.style.opacity = '0.5';
            setTimeout(() => {
                row.remove();
                atualizarEstatisticas();
                mostrarModalSucesso('Evento Excluído', `O evento "${eventTitle}" foi excluído com sucesso.`);
            }, 500);
        }
    );
}

// Função para atualizar estatísticas após exclusão
function atualizarEstatisticas() {
    const totalEventos = document.querySelectorAll('.meus-eventos-clickable-row').length;
    const eventosAtivos = document.querySelectorAll('.meus-eventos-status-active').length;
    const eventosRascunhos = document.querySelectorAll('.meus-eventos-status-draft').length;
    
    // Atualizar números nos cards (em uma aplicação real, isso viria do backend)
    const statNumbers = document.querySelectorAll('.meus-eventos-stat-number');
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = totalEventos;
        statNumbers[1].textContent = eventosAtivos;
        statNumbers[2].textContent = eventosRascunhos;
    }
}

// Fechar modais ao clicar fora
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('meus-eventos-feedback-modal')) {
        fecharModalFeedback();
    }
});

// Fechar modal com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        fecharModalFeedback();
    }
});