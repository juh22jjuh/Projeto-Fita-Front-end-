// listarEventos.js
document.addEventListener('DOMContentLoaded', function() {
    // 🔍 Elementos do DOM
    const busca = document.getElementById("busca");
    const filtroData = document.getElementById("filtro-data");
    const checkboxesTipo = document.querySelectorAll('input[name="tipo-evento"]');
    const eventos = document.querySelectorAll(".event-card");

    // Simulação de dados do usuário
    const usuarioLogado = {
        id: 123,
        nome: "João Silva",
        eventosInscritos: [1, 3] // IDs dos eventos em que o usuário já está inscrito
    };

    // Configurar badges de status para cada evento
    configurarBadgesEventos(usuarioLogado);

    // Configurar comportamento do checkbox "Todos"
    configurarCheckboxTodos();

    function filtrarEventos() {
        const termoBusca = busca.value.toLowerCase();
        const dataSelecionada = filtroData.value;
        const tiposSelecionados = Array.from(checkboxesTipo)
            .filter(cb => cb.checked && cb.value !== 'todos')
            .map(cb => cb.value);

        eventos.forEach(evento => {
            const textoEvento = evento.innerText.toLowerCase();
            const tipoEvento = evento.dataset.tipo;
            const dataEvento = evento.dataset.data;

            const correspondeBusca = textoEvento.includes(termoBusca);
            const correspondeData = dataSelecionada === "todos" || dataEvento === dataSelecionada;
            const correspondeTipo = tiposSelecionados.length === 0 || tiposSelecionados.includes(tipoEvento);

            evento.style.display = (correspondeBusca && correspondeData && correspondeTipo) ? "block" : "none";
        });
    }

    function configurarCheckboxTodos() {
        const checkboxTodos = document.querySelector('input[value="todos"]');
        
        checkboxTodos.addEventListener('change', function() {
            if (this.checked) {
                // Desmarcar todos os outros checkboxes
                checkboxesTipo.forEach(cb => {
                    if (cb.value !== 'todos') {
                        cb.checked = false;
                    }
                });
            }
            filtrarEventos();
        });

        // Quando qualquer outro checkbox for marcado, desmarcar "Todos"
        checkboxesTipo.forEach(cb => {
            if (cb.value !== 'todos') {
                cb.addEventListener('change', function() {
                    if (this.checked) {
                        checkboxTodos.checked = false;
                    }
                    filtrarEventos();
                });
            }
        });
    }

    // Event listeners para todos os filtros
    busca.addEventListener("input", filtrarEventos);
    filtroData.addEventListener("change", filtrarEventos);

    // 📝 Funcionalidade do botão Inscrever-se
    document.querySelectorAll('.event-subscribe-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.disabled) return;
            
            const eventCard = this.closest('.event-card');
            const eventId = parseInt(eventCard.dataset.id);
            const eventName = eventCard.querySelector('h2').textContent;
            const vagasCount = eventCard.querySelector('.vagas-count');
            const badge = eventCard.querySelector('.event-status-badge');
            
            // Simular inscrição
            const vagasText = vagasCount.textContent;
            const [currentVagas, totalVagas] = vagasText.split('/').map(v => parseInt(v.trim()));
            const novasVagas = currentVagas - 1;
            
            if (novasVagas >= 0) {
                vagasCount.textContent = `${novasVagas}/${totalVagas} vagas`;
                
                // Adicionar à lista de inscrições do usuário
                usuarioLogado.eventosInscritos.push(eventId);
                
                // Atualizar badge e botão
                badge.textContent = 'Inscrito';
                badge.className = 'event-status-badge cadastrado';
                
                this.textContent = 'Já Inscrito ✓';
                this.classList.add('cadastrado');
                this.disabled = true;
                
                alert(`Inscrição realizada para: ${eventName}`);
                
                // Verificar se o evento ficou esgotado
                if (novasVagas === 0) {
                    badge.textContent = 'Esgotado';
                    badge.className = 'event-status-badge esgotado';
                    
                    // Atualizar todos os eventos com mesmo ID
                    document.querySelectorAll(`.event-card[data-id="${eventId}"]`).forEach(card => {
                        const cardBadge = card.querySelector('.event-status-badge');
                        const cardBtn = card.querySelector('.event-subscribe-btn');
                        
                        cardBadge.textContent = 'Esgotado';
                        cardBadge.className = 'event-status-badge esgotado';
                        cardBtn.disabled = true;
                        cardBtn.textContent = 'Esgotado';
                    });
                }
            }
        });
    });

    function configurarBadgesEventos(usuario) {
        eventos.forEach(evento => {
            const idEvento = parseInt(evento.getAttribute('data-id'));
            const badge = evento.querySelector('.event-status-badge');
            const btnInscricao = evento.querySelector('.event-subscribe-btn');
            const vagasElement = evento.querySelector('.vagas-count');
            
            // Extrair informações de vagas
            const textoVagas = vagasElement.textContent;
            const [vagasOcupadas, vagasTotais] = textoVagas.split('/').map(v => parseInt(v.trim()));
            const vagasDisponiveis = vagasTotais - vagasOcupadas;
            
            // Verificar se o usuário já está inscrito
            const usuarioInscrito = usuario.eventosInscritos.includes(idEvento);
            
            // Verificar se o evento está esgotado
            const eventoEsgotado = vagasDisponiveis === 0;
            
            // Verificar se há poucas vagas (menos de 25% disponíveis)
            const poucasVagas = (vagasDisponiveis / vagasTotais) < 0.25 && !eventoEsgotado;
            
            // Aplicar badge de acordo com o status
            if (eventoEsgotado) {
                badge.textContent = 'Esgotado';
                badge.classList.add('esgotado');
                btnInscricao.disabled = true;
                btnInscricao.textContent = 'Esgotado';
            } else if (usuarioInscrito) {
                badge.textContent = 'Inscrito';
                badge.classList.add('cadastrado');
                btnInscricao.textContent = 'Já Inscrito ✓';
                btnInscricao.classList.add('cadastrado');
                btnInscricao.disabled = true;
            } else if (poucasVagas) {
                badge.textContent = 'Poucas Vagas';
                badge.classList.add('poucas-vagas');
            }
        });
    }
});