// Elementos principais
const perfilForm = document.getElementById('perfil-form');
const perfilPictureInput = document.getElementById('perfil-picture-input');
const perfilPicture = document.getElementById('perfil-picture');
const changePictureBtn = document.getElementById('change-picture-btn');
const changePasswordBtn = document.getElementById('change-password-btn');
const passwordModal = document.getElementById('perfil-password-modal');
const passwordForm = document.getElementById('perfil-password-form');
const successModal = document.getElementById('perfil-success-modal');
const messageContainer = document.getElementById('perfil-message-container');

// Elementos do modal de senha
const passwordModalClose = document.getElementById('perfil-password-modal-close');
const passwordCancelBtn = document.getElementById('perfil-password-cancel');
const modalCloseBtn = document.getElementById('perfil-modal-close-btn');

// Toggle de visibilidade de senha nos modais
document.querySelectorAll('.perfil-password-toggle').forEach(toggle => {
    toggle.addEventListener('click', function() {
        const input = this.parentElement.querySelector('input');
        const icon = this.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// Alterar foto de perfil
changePictureBtn.addEventListener('click', function() {
    perfilPictureInput.click();
});

perfilPictureInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            showMessage('A imagem deve ter no máximo 5MB', 'error');
            return;
        }

        if (!file.type.startsWith('image/')) {
            showMessage('Por favor, selecione uma imagem válida', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            perfilPicture.src = e.target.result;
            showMessage('Foto alterada com sucesso! Lembre-se de salvar as alterações.', 'success');
        };
        reader.readAsDataURL(file);
    }
});

// Modal de alteração de senha
changePasswordBtn.addEventListener('click', function() {
    openPasswordModal();
});

passwordModalClose.addEventListener('click', closePasswordModal);
passwordCancelBtn.addEventListener('click', closePasswordModal);

// Fechar modal ao clicar fora
passwordModal.addEventListener('click', function(e) {
    if (e.target === passwordModal) {
        closePasswordModal();
    }
});

successModal.addEventListener('click', function(e) {
    if (e.target === successModal) {
        closeSuccessModal();
    }
});

// Validação do formulário principal
perfilForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateMainForm()) {
        simulateSave().then(success => {
            if (success) {
                showSuccessModal();
            } else {
                showMessage('Erro ao salvar as alterações. Tente novamente.', 'error');
            }
        });
    }
});

// Validação do formulário de senha
passwordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validatePasswordForm()) {
        simulatePasswordChange().then(success => {
            if (success) {
                closePasswordModal();
                showMessage('Senha alterada com sucesso!', 'success');
                passwordForm.reset();
            } else {
                showMessage('Erro ao alterar a senha. Tente novamente.', 'error');
            }
        });
    }
});

// Funções de abertura/fechamento de modais
function openPasswordModal() {
    passwordModal.style.display = 'flex';
    document.getElementById('modal-current-password').focus();
}

function closePasswordModal() {
    passwordModal.style.display = 'none';
    passwordForm.reset();
    clearPasswordErrors();
}

function closeSuccessModal() {
    successModal.style.display = 'none';
}

modalCloseBtn.addEventListener('click', closeSuccessModal);

// Validações
function validateMainForm() {
    let isValid = true;
    clearErrors();

    const name = document.getElementById('name').value.trim();
    if (!name) {
        showError('name', 'Nome é obrigatório');
        isValid = false;
    } else if (name.length < 2) {
        showError('name', 'Nome deve ter pelo menos 2 caracteres');
        isValid = false;
    }

    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        showError('email', 'Email é obrigatório');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showError('email', 'Email inválido');
        isValid = false;
    }

    const phone = document.getElementById('phone').value.trim();
    const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    if (phone && !phoneRegex.test(phone)) {
        showError('phone', 'Telefone inválido. Use o formato (00) 00000-0000');
        isValid = false;
    }

    return isValid;
}

function validatePasswordForm() {
    let isValid = true;
    clearPasswordErrors();

    const currentPassword = document.getElementById('modal-current-password').value;
    const newPassword = document.getElementById('modal-new-password').value;
    const confirmPassword = document.getElementById('modal-confirm-password').value;

    if (!currentPassword) {
        showPasswordError('modal-current-password', 'Senha atual é obrigatória');
        isValid = false;
    }

    if (!newPassword) {
        showPasswordError('modal-new-password', 'Nova senha é obrigatória');
        isValid = false;
    } else if (newPassword.length < 6) {
        showPasswordError('modal-new-password', 'Nova senha deve ter pelo menos 6 caracteres');
        isValid = false;
    }

    if (!confirmPassword) {
        showPasswordError('modal-confirm-password', 'Confirmação de senha é obrigatória');
        isValid = false;
    } else if (newPassword !== confirmPassword) {
        showPasswordError('modal-confirm-password', 'As senhas não coincidem');
        isValid = false;
    }

    return isValid;
}

// Funções auxiliares
function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);
    
    errorElement.textContent = message;
    inputElement.classList.add('error');
}

function showPasswordError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);
    
    errorElement.textContent = message;
    inputElement.classList.add('error');
}

function clearErrors() {
    document.querySelectorAll('.perfil-error-message').forEach(el => {
        el.textContent = '';
    });
    
    document.querySelectorAll('.perfil-form-input').forEach(el => {
        el.classList.remove('error', 'valid');
    });
}

function clearPasswordErrors() {
    const passwordFields = ['modal-current-password', 'modal-new-password', 'modal-confirm-password'];
    passwordFields.forEach(fieldId => {
        const errorElement = document.getElementById(`${fieldId}-error`);
        const inputElement = document.getElementById(fieldId);
        
        if (errorElement) errorElement.textContent = '';
        if (inputElement) inputElement.classList.remove('error');
    });
}

function showMessage(message, type) {
    messageContainer.textContent = message;
    messageContainer.className = `perfil-message-container perfil-message-${type}`;
    messageContainer.style.display = 'block';
    
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 5000);
}

function showSuccessModal() {
    successModal.style.display = 'flex';
}

// Simulações
function simulateSave() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, 1000);
    });
}

function simulatePasswordChange() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, 1000);
    });
}

// Máscara para telefone
document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = value;
    }
});

// Validação em tempo real
document.querySelectorAll('#perfil-form .perfil-form-input').forEach(input => {
    input.addEventListener('blur', function() {
        const fieldId = this.id;
        const value = this.value.trim();
        
        if (fieldId === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showError(fieldId, 'Email inválido');
            } else {
                clearFieldError(fieldId);
            }
        }
        
        if (fieldId === 'phone' && value) {
            const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
            if (!phoneRegex.test(value)) {
                showError(fieldId, 'Use o formato (00) 00000-0000');
            } else {
                clearFieldError(fieldId);
            }
        }
    });
});

function clearFieldError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);
    
    errorElement.textContent = '';
    inputElement.classList.remove('error');
    inputElement.classList.add('valid');
}

// Fechar modais com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (passwordModal.style.display === 'flex') {
            closePasswordModal();
        }
        if (successModal.style.display === 'flex') {
            closeSuccessModal();
        }
    }
});