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
  senha: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
};

const errorMessages = {
  nome: 'Nome deve conter apenas letras e espaços (2-100 caracteres)',
  email: 'Por favor, insira um email válido',
  senha: 'Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número',
  confirmarSenha: 'As senhas não coincidem'
};

function setupValidation() {
  const form = document.querySelector('.register-form-space');
  if (!form) return;

  form.setAttribute('novalidate', 'novalidate');

  const nomeInput = document.getElementById('nome');
  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');
  const confirmarSenhaInput = document.getElementById('confirmarSenha');
  const tipoSelect = document.getElementById('tipo');

  const inputs = [nomeInput, emailInput, senhaInput, confirmarSenhaInput, tipoSelect].filter(Boolean);

  // Inicialização
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

  // Validação do tipo de participante
  tipoSelect.addEventListener('change', function() {
    if (this.dataset.touched === 'true') {
      validateTipoParticipante();
    }
  });

  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Marcar todos como tocados para exibir erros
    inputs.forEach(i => i.dataset.touched = 'true');

    const isNomeValid = validateField(nomeInput, patterns.nome, errorMessages.nome);
    const isEmailValid = validateField(emailInput, patterns.email, errorMessages.email);
    const isSenhaValid = validateField(senhaInput, patterns.senha, errorMessages.senha);
    const isPasswordMatch = validatePasswordMatch();
    const isTipoValid = validateTipoParticipante();

    if (isNomeValid && isEmailValid && isSenhaValid && isPasswordMatch && isTipoValid) {
      alert('Cadastro realizado com sucesso!');
      form.reset();
      inputs.forEach(i => {
        removeError(i);
        i.dataset.touched = 'false';
        i.classList.remove('error', 'valid');
      });
    }
  });
}

function validateField(field, pattern, errorMessage) {
  if (!field) return false;
  const value = field.value.trim();
  const isValid = pattern.test(value);

  removeError(field);
  field.classList.remove('error', 'valid');

  if (value === '') {
    return false;
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

// Função para mostrar erro
function showError(field, message) {
  removeError(field);
  
  const errorElement = document.createElement('div');
  errorElement.className = 'register-error-message';
  errorElement.textContent = message;

  // Encontra o grupo do formulário pai e adiciona o erro APÓS o input-wrapper
  const formGroup = field.closest('.register-form-group');
  if (formGroup) {
    formGroup.appendChild(errorElement);
  }
}

// Função para remover erro
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

document.addEventListener('DOMContentLoaded', setupValidation);