// Espera o HTML carregar antes de rodar o script
document.addEventListener('DOMContentLoaded', () => {

    // Pega as cores do seu CSS para usar nos gráficos
    const rootStyles = getComputedStyle(document.documentElement);
    const toryBlue = rootStyles.getPropertyValue('--tory-blue').trim();
    const hotCinnamon = rootStyles.getPropertyValue('--hot-cinnamon').trim();
    const secondaryGray = '#6c757d'; // Cor do badge 'comunidade'

    // --- Gráfico 1: Inscrições por Tipo (Rosquinha) ---
    const ctxTipo = document.getElementById('inscricoesPorTipoChart');
    if (ctxTipo) {
        new Chart(ctxTipo, {
            type: 'doughnut',
            data: {
                labels: ['Aluno Fatec', 'Ensino Médio', 'Comunidade Geral'],
                datasets: [{
                    label: 'Inscritos',
                    // Dados de exemplo (virão do PHP)
                    data: [150, 85, 45], 
                    backgroundColor: [
                        toryBlue,      // Cor do Aluno Fatec
                        hotCinnamon,   // Cor do Ensino Médio
                        secondaryGray  // Cor da Comunidade
                    ],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom', // Põe a legenda embaixo
                    }
                }
            }
        });
    }

    // --- Gráfico 2: Inscrições por Dia (Barras) ---
    const ctxDia = document.getElementById('inscricoesPorDiaChart');
    if (ctxDia) {
        new Chart(ctxDia, {
            type: 'bar',
            data: {
                labels: ['20/10', '21/10', '22/10', '23/10', '24/10', '25/10', '26/10'],
                datasets: [{
                    label: 'Inscrições Diárias',
                    // Dados de exemplo (virão do PHP)
                    data: [12, 19, 30, 51, 42, 65, 30],
                    backgroundColor: hotCinnamon, // Laranja principal
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false // Esconde a legenda (desnecessária)
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

});