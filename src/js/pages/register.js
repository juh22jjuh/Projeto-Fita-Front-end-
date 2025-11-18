/**
 * Arquivo: ../js/pages/register.js
 * * Script completo com:
 * 1. Funções de validação em tempo real (seu código).
 * 2. Conexão com o back-end (fetch) na submissão.
 * 3. Tratamento de erro do servidor.
 */

// 1. FUNÇÕES DE UTILIDADE E VALIDAÇÃO (SEU CÓDIGO - CORRETO)
// ===================================================================

function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const toggleButton = input.parentNode.querySelector('.register-password-toggle i');
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  toggleButton.classList.toggle('fa-eye', !isPassword);
  toggleButton.classList.toggle('fa-eye-slash', isPassword);
}

// Regex patterns
const patterns = {
  nome: /^[A-Za-zÀ-ÿ\s]{2,100}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
  senha: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/ // Sua regex de senha forte
};

// Mensagens de erro para validação local
const errorMessages = {
  nome: 'Nome deve conter apenas letras e espaços (2-100 caracteres)',
  email: 'Por favor, insira um email válido',
  senha: 'Senha deve ter 8+ caracteres, 1 maiúscula, 1 minúscula e 1 número',
  confirmarSenha: 'As senhas não coincidem'
};

function showError(field, message) {
  removeError(field);
  const errorElement = document.createElement('div');
  errorElement.className = 'register-error-message';
  errorElement.textContent = message;
  const formGroup = field.closest('.register-form-group');
  if (formGroup) {
    formGroup.appendChild(errorElement);
  }
}

function removeError(field) {
  if (!field) return;
  const formGroup = field.closest('.register-form-group');
  if (formGroup) {
    const errorElement = formGroup.querySelector('.register-error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }
}

function validateField(field, pattern, errorMessage) {
  if (!field) return false;
  const value = field.value.trim();
  const isValid = pattern.test(value);
  removeError(field);
  field.classList.remove('error', 'valid');
  if (value === '') {
    return false; // Não valida se vazio (exceto no submit)
  }
  if (!isValid) {
    showError(field, errorMessage);
    if (field.dataset.touched === 'true') {
      field.classList.add('error');
    }
    return false;
  }
  if (field.dataset.touched === 'true') {
    field.classList.add('valid');
  }
  return true;
}

function validatePasswordMatch() {
  const senha = document.getElementById('senha');
  const confirmarSenha = document.getElementById('confirmarSenha');
  if (!confirmarSenha) return true;
  removeError(confirmarSenha);
  confirmarSenha.classList.remove('error', 'valid');
  if (confirmarSenha.value.trim() === '') {
    return false;
  }
  if (senha.value !== confirmarSenha.value) {
    showError(confirmarSenha, errorMessages.confirmarSenha);
    if (confirmarSenha.dataset.touched === 'true') {
      confirmarSenha.classList.add('error');
    }
    return false;
  }
  if (confirmarSenha.dataset.touched === 'true') {
    confirmarSenha.classList.add('valid');
  }
  return true;
}

function validateTipoParticipante() {
  const tipoSelect = document.getElementById('tipo');
  if (!tipoSelect) return true;
  removeError(tipoSelect);
  tipoSelect.classList.remove('error', 'valid');
  if (!tipoSelect.value) {
    if (tipoSelect.dataset.touched === 'true') {
      showError(tipoSelect, 'Por favor, selecione um tipo de participante');
      tipoSelect.classList.add('error');
    }
    return false;
  }
  if (tipoSelect.dataset.touched === 'true') {
    tipoSelect.classList.add('valid');
  }
  return true;
}

// 2. FUNÇÃO PARA EXIBIR MENSAGENS DO SERVIDOR
// ===================================================================

/**
 * Mostra uma mensagem de resposta do SERVIDOR (ex: "Sucesso" ou "Email já existe").
 */
function displayMessage(text, type) {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
        messageContainer.innerHTML = text;
        messageContainer.className = `message-container message-${type}`;
    }
}


// 3. LÓGICA PRINCIPAL DE VALIDAÇÃO E SUBMISSÃO
// ===================================================================

function setupValidation() {
  const form = document.querySelector('.register-form-space');
  if (!form) return;

  form.setAttribute('novalidate', 'novalidate');

  const nomeInput = document.getElementById('nome');
  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');
  const confirmarSenhaInput = document.getElementById('confirmarSenha');
  const tipoSelect = document.getElementById('tipo');
  const submitButton = form.querySelector('button[type="submit"]');

  const inputs = [nomeInput, emailInput, senhaInput, confirmarSenhaInput, tipoSelect].filter(Boolean);

  // --- Eventos de 'blur' e 'input' (Seu código, correto) ---
  inputs.forEach(i => {
    i.classList.remove('error', 'valid');
    i.dataset.touched = 'false';

    i.addEventListener('blur', () => {
      i.dataset.touched = 'true';
      if (i === confirmarSenhaInput) {
        validatePasswordMatch();
      } else if (i === senhaInput) {
        validateField(senhaInput, patterns.senha, errorMessages.senha);
        validatePasswordMatch();
      } else if (i === emailInput) {
        validateField(emailInput, patterns.email, errorMessages.email);
      } else if (i === nomeInput) {
        validateField(nomeInput, patterns.nome, errorMessages.nome);
      } else if (i === tipoSelect) {
        validateTipoParticipante();
      }
    });

    i.addEventListener('input', () => {
      if (i.dataset.touched === 'true') {
        if (i === confirmarSenhaInput) {
          validatePasswordMatch();
        } else if (i === senhaInput) {
          validateField(senhaInput, patterns.senha, errorMessages.senha);
          validatePasswordMatch();
        } else if (i === emailInput) {
          validateField(emailInput, patterns.email, errorMessages.email);
        } else if (i === nomeInput) {
          validateField(nomeInput, patterns.nome, errorMessages.nome);
        }
      } else {
        removeError(i);
        i.classList.remove('error', 'valid');
      }
    });
  });

  tipoSelect.addEventListener('change', function() {
    if (this.dataset.touched === 'true') {
      validateTipoParticipante();
    }
  });

  //
  // ▼▼▼ ESTE É O BLOCO QUE FOI TOTALMENTE CORRIGIDO ▼▼▼
  //
  // Submit - Agora com 'async' e 'fetch'
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    displayMessage('', ''); // Limpa mensagens antigas

    // Marcar todos como tocados para exibir erros
    inputs.forEach(i => i.dataset.touched = 'true');

    // 1. Executa a validação local PRIMEIRO
    const isNomeValid = validateField(nomeInput, patterns.nome, errorMessages.nome);
    const isEmailValid = validateField(emailInput, patterns.email, errorMessages.email);
    const isSenhaValid = validateField(senhaInput, patterns.senha, errorMessages.senha);
    const isPasswordMatch = validatePasswordMatch();
    const isTipoValid = validateTipoParticipante();

    // 2. Se a validação local falhar, PARA AQUI.
    if (!isNomeValid || !isEmailValid || !isSenhaValid || !isPasswordMatch || !isTipoValid) {
      return; // Impede o envio se o formulário for inválido
    }

    // 3. Se a validação local PASSOU, envia para o back-end
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;

    const formData = {
      nome: nomeInput.value,
      email: emailInput.value,
      senha: senhaInput.value,
      // O AuthController que criamos espera 'nivel_acesso'.
      // 'participante' é o padrão para quem se cadastra.
      nivel_acesso: 'participante' 
    };

    try {
      // O caminho agora aponta para /routes/registerRoutes.php
      const response = await fetch('http://localhost/Projeto-Fita-Back-end-/routes/registerRoutes.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Essencial para CORS e sessões
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) { // Sucesso (ex: 201 Created)
        displayMessage(result.message, 'success');
        form.reset();
        inputs.forEach(i => {
          removeError(i);
          i.dataset.touched = 'false';
          i.classList.remove('error', 'valid');
        });

        // Redireciona para o login após o sucesso
        setTimeout(() => {
          window.location.href = 'login.html'; // Ajuste o caminho se necessário
        }, 2000);

      } else { // Erro do servidor (ex: 409 "Email já existe")
        displayMessage(result.message, 'error');
      }

    } catch (error) { // Erro de rede (offline, CORS, etc.)
      console.error('Erro na requisição:', error);
      displayMessage('Não foi possível conectar ao servidor.', 'error');
    
    } finally {
      // Restaura o botão
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
    }
  });
}

// 4. INICIALIZAÇÃO
// ===================================================================
document.addEventListener('DOMContentLoaded', setupValidation);