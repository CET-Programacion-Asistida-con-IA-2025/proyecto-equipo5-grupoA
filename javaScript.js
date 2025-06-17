// JobWave Portal JavaScript
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
  loadPublishedJobs();
});

// Variables globales
let publishedJobs = [];

// Inicialización de la aplicación
function initializeApp() {
  setupFormValidation();
  setupModalEvents();
  loadStoredJobs();
}

// Configuración de validación del formulario
function setupFormValidation() {
  const jobForm = document.getElementById("jobForm");
  if (jobForm) {
    jobForm.addEventListener("submit", handleJobSubmission);
  }

  // Validación en tiempo real
  const requiredFields = [
    "jobTitle",
    "company",
    "location",
    "jobType",
    "description",
    "contactEmail",
  ];
  requiredFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener("blur", validateField);
      field.addEventListener("input", clearFieldError);
    }
  });

  // Validación de email
  const emailField = document.getElementById("contactEmail");
  if (emailField) {
    emailField.addEventListener("blur", validateEmail);
  }
}

// Configuración de eventos de modales
function setupModalEvents() {
  // Cerrar modales al hacer clic fuera
  window.addEventListener("click", function (event) {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  });

  // Configurar formularios de login y registro
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }
}

// Manejo del envío del formulario de trabajo
function handleJobSubmission(event) {
  event.preventDefault();

  if (!validateJobForm()) {
    return;
  }

  const formData = collectFormData();

  // Simular envío al servidor
  showLoadingState();

  setTimeout(() => {
    publishJob(formData);
    showSuccessModal();
    resetForm();
    hideLoadingState();
  }, 1500);
}

// Recopilar datos del formulario
function collectFormData() {
  return {
    id: generateJobId(),
    title: document.getElementById("jobTitle").value,
    company: document.getElementById("company").value,
    location: document.getElementById("location").value,
    jobType: document.getElementById("jobType").value,
    salary: document.getElementById("salary").value || "A convenir",
    experience:
      document.getElementById("experience").value || "No especificado",
    description: document.getElementById("description").value,
    requirements:
      document.getElementById("requirements").value || "No especificado",
    contactEmail: document.getElementById("contactEmail").value,
    contactPhone:
      document.getElementById("contactPhone").value || "No proporcionado",
    datePublished: new Date().toLocaleDateString("es-AR"),
    status: "active",
  };
}

// Validar formulario completo
function validateJobForm() {
  let isValid = true;
  const requiredFields = [
    { id: "jobTitle", message: "El título del puesto es obligatorio" },
    { id: "company", message: "El nombre de la empresa es obligatorio" },
    { id: "location", message: "La ubicación es obligatoria" },
    { id: "jobType", message: "Debe seleccionar un tipo de trabajo" },
    { id: "description", message: "La descripción del puesto es obligatoria" },
    { id: "contactEmail", message: "El email de contacto es obligatorio" },
  ];

  // Limpiar errores previos
  clearAllErrors();

  requiredFields.forEach((field) => {
    const element = document.getElementById(field.id);
    if (!element.value.trim()) {
      showFieldError(field.id, field.message);
      isValid = false;
    }
  });

  // Validar email
  const email = document.getElementById("contactEmail").value;
  if (email && !isValidEmail(email)) {
    showFieldError("contactEmail", "Por favor ingrese un email válido");
    isValid = false;
  }

  return isValid;
}

// Validar campo individual
function validateField(event) {
  const field = event.target;
  if (field.hasAttribute("required") && !field.value.trim()) {
    showFieldError(field.id, "Este campo es obligatorio");
  }
}

// Validar email
function validateEmail(event) {
  const email = event.target.value;
  if (email && !isValidEmail(email)) {
    showFieldError("contactEmail", "Por favor ingrese un email válido");
  }
}

// Verificar si el email es válido
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Mostrar error en campo
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const existingError = field.parentNode.querySelector(".error-message");

  if (existingError) {
    existingError.remove();
  }

  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.style.color = "#dc3545";
  errorDiv.style.fontSize = "0.8rem";
  errorDiv.style.marginTop = "0.25rem";
  errorDiv.textContent = message;

  field.style.borderColor = "#dc3545";
  field.parentNode.appendChild(errorDiv);
}

// Limpiar error de campo
function clearFieldError(event) {
  const field = event.target;
  const errorMessage = field.parentNode.querySelector(".error-message");

  if (errorMessage) {
    errorMessage.remove();
    field.style.borderColor = "";
  }
}

// Limpiar todos los errores
function clearAllErrors() {
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((error) => error.remove());

  const fields = document.querySelectorAll("input, select, textarea");
  fields.forEach((field) => {
    field.style.borderColor = "";
  });
}

// Publicar trabajo
function publishJob(jobData) {
  publishedJobs.unshift(jobData);

  // Limitar a 6 trabajos mostrados
  if (publishedJobs.length > 6) {
    publishedJobs = publishedJobs.slice(0, 6);
  }

  saveJobsToStorage();
  updateJobsDisplay();
}

// Guardar trabajos en el almacenamiento (simulado con variable)
function saveJobsToStorage() {
  // En un caso real, aquí guardarías en localStorage o enviarías al servidor
  console.log("Trabajos guardados:", publishedJobs);
}

// Cargar trabajos guardados
function loadStoredJobs() {
  // En un caso real, aquí cargarías desde localStorage o el servidor
  // Por ahora, creamos algunos trabajos de ejemplo
  if (publishedJobs.length === 0) {
    publishedJobs = [
      {
        id: "job-1",
        title: "Desarrollador Frontend React",
        company: "TechCorp",
        location: "Buenos Aires, CABA",
        jobType: "remoto",
        salary: "$80,000 - $120,000",
        datePublished: "15/06/2025",
      },
      {
        id: "job-2",
        title: "Diseñador UX/UI Senior",
        company: "DesignStudio",
        location: "Córdoba, Córdoba",
        jobType: "hibrido",
        salary: "$70,000 - $100,000",
        datePublished: "14/06/2025",
      },
      {
        id: "job-3",
        title: "Analista de Datos",
        company: "DataInsights",
        location: "Rosario, Santa Fe",
        jobType: "tiempo-completo",
        salary: "A convenir",
        datePublished: "13/06/2025",
      },
    ];
  }
}

// Cargar y mostrar trabajos publicados
function loadPublishedJobs() {
  updateJobsDisplay();
}

// Actualizar visualización de trabajos
function updateJobsDisplay() {
  const jobsContainer = document.getElementById("jobsPreview");
  if (!jobsContainer) return;

  if (publishedJobs.length === 0) {
    jobsContainer.innerHTML = `
            <div style="text-align: center; color: var(--light-text); padding: 2rem;">
                <i class="fas fa-briefcase" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No hay ofertas publicadas aún. ¡Sé el primero en publicar!</p>
            </div>
        `;
    return;
  }

  jobsContainer.innerHTML = publishedJobs
    .map(
      (job) => `
        <div class="job-preview-card" onclick="showJobDetails('${job.id}')">
            <h3>${escapeHtml(job.title)}</h3>
            <div class="company">${escapeHtml(job.company)}</div>
            <div class="location">
                <i class="fas fa-map-marker-alt"></i>
                ${escapeHtml(job.location)}
            </div>
            <div class="job-type">${getJobTypeLabel(job.jobType)}</div>
            <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--light-text);">
                Publicado: ${job.datePublished}
            </div>
        </div>
    `
    )
    .join("");
}

// Obtener etiqueta de tipo de trabajo
function getJobTypeLabel(jobType) {
  const labels = {
    "tiempo-completo": "Tiempo Completo",
    "medio-tiempo": "Medio Tiempo",
    freelance: "Freelance",
    remoto: "Remoto",
    hibrido: "Híbrido",
  };
  return labels[jobType] || jobType;
}

// Mostrar detalles del trabajo
function showJobDetails(jobId) {
  const job = publishedJobs.find((j) => j.id === jobId);
  if (!job) return;

  alert(
    `Detalles del trabajo:\n\nTítulo: ${job.title}\nEmpresa: ${
      job.company
    }\nUbicación: ${job.location}\nTipo: ${getJobTypeLabel(
      job.jobType
    )}\nSalario: ${
      job.salary
    }\n\nEn una aplicación real, esto abriría una página de detalles.`
  );
}

// Generar ID único para trabajos
function generateJobId() {
  return "job-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Mostrar modal de éxito
function showSuccessModal() {
  const modal = document.getElementById("successModal");
  if (modal) {
    modal.style.display = "block";
  }
}

// Cerrar modal de éxito
function closeSuccessModal() {
  const modal = document.getElementById("successModal");
  if (modal) {
    modal.style.display = "none";
  }
}

// Limpiar formulario
function resetForm() {
  const form = document.getElementById("jobForm");
  if (form) {
    form.reset();
    clearAllErrors();
  }
}

// Estados de carga
function showLoadingState() {
  const submitBtn = document.querySelector('#jobForm button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Publicando...';
  }
}

function hideLoadingState() {
  const submitBtn = document.querySelector('#jobForm button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Publicar Oferta';
  }
}

// Funciones para modales de login y registro
function showLoginModal() {
  const modal = document.getElementById("loginModal");
  if (modal) {
    modal.style.display = "block";
  }
}

function closeLoginModal() {
  const modal = document.getElementById("loginModal");
  if (modal) {
    modal.style.display = "none";
  }
}

function showRegisterModal() {
  const modal = document.getElementById("registerModal");
  if (modal) {
    modal.style.display = "block";
  }
}

function closeRegisterModal() {
  const modal = document.getElementById("registerModal");
  if (modal) {
    modal.style.display = "none";
  }
}

// Manejo de login
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Simulación de login
  if (email && password) {
    showNotification("¡Inicio de sesión exitoso!", "success");
    closeLoginModal();

    // Aquí podrías actualizar la interfaz para mostrar el usuario logueado
    updateUserInterface(email);
  } else {
    showNotification("Por favor complete todos los campos", "error");
  }
}

// Manejo de registro
function handleRegister(event) {
  event.preventDefault();

  const companyName = document.getElementById("companyName").value;
  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  // Validaciones básicas
  if (!companyName || !fullName || !email || !password) {
    showNotification("Por favor complete todos los campos", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showNotification("Por favor ingrese un email válido", "error");
    return;
  }

  if (password.length < 6) {
    showNotification("La contraseña debe tener al menos 6 caracteres", "error");
    return;
  }

  // Simulación de registro exitoso
  showNotification("¡Registro exitoso! Ya puede iniciar sesión.", "success");
  closeRegisterModal();

  // Limpiar formulario
  document.getElementById("registerForm").reset();
}

// Actualizar interfaz de usuario
function updateUserInterface(userEmail) {
  const navButtons = document.querySelector(".nav-buttons");
  if (navButtons) {
    navButtons.innerHTML = `
            <span style="color: white; margin-right: 1rem;">
                <i class="fas fa-user"></i> ${userEmail}
            </span>
            <button class="btn-secondary" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
            </button>
        `;
  }
}

// Cerrar sesión
function logout() {
  const navButtons = document.querySelector(".nav-buttons");
  if (navButtons) {
    navButtons.innerHTML = `
            <button class="btn-secondary" onclick="showLoginModal()">
                Iniciar Sesión
            </button>
            <button class="btn-primary" onclick="showRegisterModal()">
                Registrarse
            </button>
        `;
  }
  showNotification("Sesión cerrada exitosamente", "success");
}

// Mostrar notificaciones
function showNotification(message, type = "success") {
  // Remover notificación existente
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <i class="fas fa-${
          type === "success" ? "check-circle" : "exclamation-circle"
        }"></i>
        ${message}
    `;

  // Estilos de la notificación
  Object.assign(notification.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: type === "success" ? "#28a745" : "#dc3545",
    color: "white",
    padding: "1rem 2rem",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    zIndex: "3000",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    animation: "slideInRight 0.3s ease",
  });

  document.body.appendChild(notification);

  // Remover después de 3 segundos
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 3000);
}

// Agregar estilos de animación para notificaciones
const notificationStyles = document.createElement("style");
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);
