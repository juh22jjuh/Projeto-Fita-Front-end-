/**
 * Arquivo: ../js/pages/login.js
 * * Este script lida com:
 * 1. A função de mostrar/esconder senha (togglePassword).
 * 2. A validação em tempo real dos campos do formulário (setupValidation).
 * 3. A submissão do formulário, enviando os dados para a api_login.php (fetch).
 * 4. O tratamento da resposta do servidor (sucesso ou erro).
 * 5. O redirecionamento para o index.html em caso de login bem-sucedido.
 */

// 1. FUNÇÕES DE VALIDAÇÃO (Seu código original, que está ótimo)
// ===================================================================

/**
 * Alterna a visibilidade da senha (mostrar/esconder).
 */
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const toggleButton = input.parentNode.querySelector('.login-password-toggle i');
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  toggleButton.classList.toggle('fa-eye', !isPassword);
  toggleButton.classList.toggle('fa-eye-slash', isPassword);
}

// Padrão de Regex para validação
const patterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
};

// Mensagens de erro para validação local
const errorMessages = {
  email: 'Por favor, insira um email válido',
  senha: 'Senha é obrigatória'
};

/**
 * Mostra uma mensagem de erro de validação abaixo do campo.
 */
function showError(field, message) {
  removeError(field); // Remove erros antigos primeiro
  const errorElement = document.createElement('div');
  errorElement.className = 'login-error-message';
  errorElement.textContent = message;
  const formGroup = field.closest('.login-form-group');
  if (formGroup) {
    formGroup.appendChild(errorElement);
  }
}

/**
 * Remove a mensagem de erro de validação de um campo.
 */
function removeError(field) {
  const formGroup = field.closest('.login-form-group');
  if (formGroup) {
    const errorElement = formGroup.querySelector('.login-error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }
}

/**
 * Valida um campo individual com base no padrão (regex) e mensagem.
 */
function validateField(field, pattern, errorMessage) {
  const value = field.value.trim();
  const isValid = pattern.test(value);
  removeError(field);
  field.classList.remove('error', 'valid');
  if (value === '') {
    // Não mostra erro se estiver apenas vazio (a menos que seja no submit)
    return false;
  }
  if (!isValid) {
    showError(field, errorMessage);
    field.classList.add('error');
    return false;
  }
  field.classList.add('valid');
  return true;
}

// 2. LÓGICA DE SUBMISSÃO E CONEXÃO (Código Novo/Corrigido)
// ===================================================================

/**
 * Mostra mensagens de resposta do SERVIDOR (ex: "Login bem-sucedido" ou "Senha inválida").
 */
function displayMessage(text, type) {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
        messageContainer.innerHTML = text;
        messageContainer.className = `message-container message-${type}`;
    }
}

/**
 * Configura todos os "ouvintes" de eventos do formulário.
 */
function setupValidation() {
  const form = document.querySelector('.login-form-space');
  if (!form) return;
  
  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');

  // --- Validação em tempo real (Seu código) ---
  emailInput.addEventListener('input', function() {
    this.classList.remove('error', 'valid');
    if (this.value.trim() !== '') {
      validateField(this, patterns.email, errorMessages.email);
    } else {
      removeError(this);
    }
  });

  senhaInput.addEventListener('input', function() {
    this.classList.remove('error', 'valid');
    if (this.value.trim() === '') {
      showError(this, errorMessages.senha);
      this.classList.add('error');
    } else {
      removeError(this);
      this.classList.add('valid');
    }
  });

  // --- Validação no SUBMIT (Aqui acontece a mágica) ---
  form.addEventListener('submit', async function(e) { 
    e.preventDefault(); // Impede o recarregamento da página
    
    // 1. Limpa mensagens antigas do servidor
    displayMessage('', ''); // Limpa o container de mensagens

    // 2. Roda a validação do front-end ANTES de enviar
    const isEmailValid = validateField(emailInput, patterns.email, errorMessages.email);
    const isSenhaValid = senhaInput.value.trim() !== '';
    
    if (!isSenhaValid) {
      showError(senhaInput, errorMessages.senha);
      senhaInput.classList.add('error');
    } else {
      removeError(senhaInput);
      senhaInput.classList.add('valid');
    }
    
    // 3. Se a validação do front-end falhar, PARA AQUI.
    if (!isEmailValid || !isSenhaValid) {
      return; // Não tenta fazer login
    }

    // 4. Se passou, monta os dados para enviar ao back-end
    const formData = {
        email: emailInput.value,
        senha: senhaInput.value
    };

    // 5. Tenta a conexão com o back-end (PHP)
    try {
        const response = await fetch('http://localhost/Projeto-Fita-Back-end-/routes/loginRoutes.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // 'credentials: include' é ESSENCIAL para que o navegador
            // envie o cookie de sessão (PHPSESSID) para o back-end.
            credentials: 'include', 
            body: JSON.stringify(formData)
        });

        // Pega a resposta JSON do servidor (ex: {"message": "Login bem-sucedido."})
        const result = await response.json();

        if (response.ok) { // Status 200 (Sucesso)
            displayMessage(result.message, 'success');
            
            // Redireciona para o index.html após 1.5s
            setTimeout(() => {
                // ATENÇÃO: Ajuste este caminho se o index.html não estiver um nível acima
                window.location.href = '../../index.html'; 
            }, 1500);
            
        } else { // Erro 401, 403, etc. (Ex: "Email ou senha inválidos")
            displayMessage(result.message, 'error');
        }

    } catch (error) {
        // Erro de rede (servidor offline, CORS, etc.)
        console.error('Erro na requisição:', error);
        displayMessage('Não foi possível conectar ao servidor. Tente novamente.', 'error');
    }
  });
}

// 3. INICIALIZAÇÃO
// ===================================================================

// Inicia todo o script quando o HTML é carregado
document.addEventListener('DOMContentLoaded', setupValidation);