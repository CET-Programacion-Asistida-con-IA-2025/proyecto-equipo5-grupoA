// Objeto para manejar el formulario de registro
const RegistrationForm = {
    form: null,
    modal: null,
    
    // Inicializar el formulario
    init() {
        this.form = document.getElementById('registrationForm');
        this.modal = document.getElementById('successModal');
        
        // Event listeners
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.form.addEventListener('reset', this.handleReset.bind(this));
        
        // Validación en tiempo real
        this.setupRealTimeValidation();
        
        // Modal events
        this.setupModalEvents();
        
        // Animaciones al cargar
        this.setupAnimations();
    },
    
    // Configurar validación en tiempo real
    setupRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Validar al perder el foco
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            // Limpiar errores al escribir
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
        
        // Validación especial para confirmar contraseña
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        
        confirmPassword.addEventListener('input', () => {
            this.validatePasswordMatch();
        });
        
        password.addEventListener('input', () => {
            this.validatePasswordStrength();
            if (confirmPassword.value) {
                this.validatePasswordMatch();
            }
        });
    },
    
    // Configurar eventos del modal
    setupModalEvents() {
        const closeBtn = this.modal.querySelector('.close');
        
        closeBtn.addEventListener('click', () => {
            this.closeModal();
        });
        
        // Cerrar modal al hacer clic fuera
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Cerrar modal con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.closeModal();
            }
        });
    },
    
    // Configurar animaciones
    setupAnimations() {
        // Animación suave al scroll
        const formSections = document.querySelectorAll('.form-section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });
        
        formSections.forEach(section => {
            observer.observe(section);
        });
    },
    
    // Manejar envío del formulario
    handleSubmit(e) {
        e.preventDefault();
        
        // Validar todo el formulario
        const isValid = this.validateForm();
        
        if (isValid) {
            // Simular envío del formulario
            this.showLoadingState();
            
            // Simular delay de servidor
            setTimeout(() => {
                this.hideLoadingState();
                this.showSuccessModal();
                this.saveFormData();
            }, 1500);
        } else {
            // Scroll al primer error
            this.scrollToFirstError();
        }
    },
    
    // Manejar reset del formulario
    handleReset() {
        // Limpiar todos los errores
        this.clearAllErrors();
        
        // Confirmación antes de limpiar
        if (!confirm('¿Estás seguro de que quieres limpiar todos los campos?')) {
            return false;
        }
        
        // Animación de limpieza
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach((input, index) => {
            setTimeout(() => {
                input.value = '';
                if (input.type === 'checkbox') {
                    input.checked = false;
                }
            }, index * 50);
        });
    },
    
    // Validar todo el formulario
    validateForm() {
        let isValid = true;
        
        // Campos requeridos
        const requiredFields = [
            'firstName', 'lastName', 'email', 'password', 
            'confirmPassword', 'profession', 'city', 'province'
        ];
        
        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        // Validar términos y condiciones
        const terms = document.getElementById('terms');
        if (!terms.checked) {
            this.showFieldError(terms, 'Debes aceptar los términos y condiciones');
            isValid = false;
        }
        
        return isValid;
    },
    
    // Validar un campo específico
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Validaciones por tipo de campo
        switch (fieldName) {
            case 'firstName':
            case 'lastName':
                if (!value) {
                    errorMessage = 'Este campo es requerido';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Debe tener al menos 2 caracteres';
                    isValid = false;
                } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$/.test(value)) {
                    errorMessage = 'Solo se permiten letras';
                    isValid = false;
                }
                break;
                
            case 'email':
                if (!value) {
                    errorMessage = 'El email es requerido';
                    isValid = false;
                } else if (!this.isValidEmail(value)) {
                    errorMessage = 'Ingresa un email válido';
                    isValid = false;
                }
                break;
                
            case 'phone':
                if (value && !/^[+]?[0-9\\s\\-()]{10,}$/.test(value)) {
                    errorMessage = 'Ingresa un teléfono válido';
                    isValid = false;
                }
                break;
                
            case 'password':
                if (!value) {
                    errorMessage = 'La contraseña es requerida';
                    isValid = false;
                } else if (!this.isValidPassword(value)) {
                    errorMessage = 'La contraseña no cumple con los requisitos';
                    isValid = false;
                }
                break;
                
            case 'confirmPassword':
                if (!value) {
                    errorMessage = 'Confirma tu contraseña';
                    isValid = false;
                } else if (value !== document.getElementById('password').value) {
                    errorMessage = 'Las contraseñas no coinciden';
                    isValid = false;
                }
                break;
                
            case 'profession':
                if (!value) {
                    errorMessage = 'La profesión es requerida';
                    isValid = false;
                } else if (value.length < 3) {
                    errorMessage = 'Debe tener al menos 3 caracteres';
                    isValid = false;
                }
                break;
                
            case 'city':
                if (!value) {
                    errorMessage = 'La ciudad es requerida';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Debe tener al menos 2 caracteres';
                    isValid = false;
                }
                break;
                
            case 'province':
                if (!value) {
                    errorMessage = 'La provincia es requerida';
                    isValid = false;
                }
                break;
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }
        
        return isValid;
    },
    
    // Validar email
    isValidEmail(email) {
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Validar contraseña
    isValidPassword(password) {
        // Mínimo 8 caracteres,