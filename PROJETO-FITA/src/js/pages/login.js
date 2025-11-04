function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const toggleButton = input.parentNode.querySelector('.login-password-toggle i');

  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';

  toggleButton.classList.toggle('fa-eye', !isPassword);
  toggleButton.classList.toggle('fa-eye-slash', isPassword);
}

// Regex patterns para login
const patterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
};

// Mensagens de erro
const errorMessages = {
  email: 'Por favor, insira um email válido',
  senha: 'Senha é obrigatória'
};

// Função de validação em tempo real
function setupValidation() {
  const form = document.querySelector('.login-form-space');
  if (!form) return;
  
  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');

  // Validação do email
  emailInput.addEventListener('input', function() {
    // Remove classes anteriores
    this.classList.remove('error', 'valid');
    
    if (this.value.trim() !== '') {
      validateField(this, patterns.email, errorMessages.email);
    } else {
      removeError(this);
    }
  });

  // Validação da senha
  senhaInput.addEventListener('input', function() {
    // Remove classes anteriores
    this.classList.remove('error', 'valid');
    
    if (this.value.trim() === '') {
      showError(this, errorMessages.senha);
      this.classList.add('error');
    } else {
      removeError(this);
      this.classList.add('valid');
    }
  });

  // Validação no submit
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Remove classes anteriores
    emailInput.classList.remove('error', 'valid');
    senhaInput.classList.remove('error', 'valid');
    
    const isEmailValid = validateField(emailInput, patterns.email, errorMessages.email);
    const isSenhaValid = senhaInput.value.trim() !== '';
    
    if (!isSenhaValid) {
      showError(senhaInput, errorMessages.senha);
      senhaInput.classList.add('error');
    } else {
      senhaInput.classList.add('valid');
    }
    
    if (isEmailValid && isSenhaValid) {
      alert('Login realizado com sucesso!');
      form.reset();
      // Remove todos os erros visuais e classes
      document.querySelectorAll('.login-error-message').forEach(error => error.remove());
      emailInput.classList.remove('error', 'valid');
      senhaInput.classList.remove('error', 'valid');
    }
  });
}

// Função para validar campo individual
function validateField(field, pattern, errorMessage) {
  const value = field.value.trim();
  const isValid = pattern.test(value);

  removeError(field);

  // Remove classes anteriores
  field.classList.remove('error', 'valid');

  if (value === '') {
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

// Função para mostrar erro
function showError(field, message) {
  // Remove erro existente primeiro
  removeError(field);
  
  const errorElement = document.createElement('div');
  errorElement.className = 'login-error-message';
  errorElement.textContent = message;

  // Encontra o grupo do formulário pai e adiciona o erro APÓS o input-wrapper
  const formGroup = field.closest('.login-form-group');
  if (formGroup) {
    formGroup.appendChild(errorElement);
  }
}

// Função para remover erro
function removeError(field) {
  const formGroup = field.closest('.login-form-group');
  if (formGroup) {
    const errorElement = formGroup.querySelector('.login-error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }
}

// Inicializar validação quando o DOM carregar
document.addEventListener('DOMContentLoaded', setupValidation);