// JobWave Portal JavaScript - Con Vista de Detalle
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
  createJobDetailModal();
}

// Crear modal de detalle de trabajo
function createJobDetailModal() {
  const existingModal = document.getElementById("jobDetailModal");
  if (existingModal) {
    existingModal.remove();
  }

  const modalHTML = `
    <div id="jobDetailModal" class="modal" style="display: none;">
      <div class="modal-content" style="max-width: 800px; width: 90%; max-height: 90vh; overflow-y: auto;">
        <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid #eee;">
          <h2 id="jobDetailTitle" style="margin: 0; color: var(--primary-color);">Título del Trabajo</h2>
          <span class="close" onclick="closeJobDetailModal()" style="font-size: 1.5rem; cursor: pointer; color: #666;">&times;</span>
        </div>
        
        <div class="modal-body" style="padding: 2rem;">
          <div class="job-detail-header" style="margin-bottom: 2rem;">
            <div class="company-info" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
              <div class="company-icon" style="width: 60px; height: 60px; background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
                <i class="fas fa-building"></i>
              </div>
              <div>
                <h3 id="jobDetailCompany" style="margin: 0; color: var(--text-color);">Empresa</h3>
                <div id="jobDetailLocation" style="color: var(--light-text); margin-top: 0.25rem;">
                  <i class="fas fa-map-marker-alt"></i> Ubicación
                </div>
              </div>
            </div>
            
            <div class="job-meta" style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
              <div class="meta-item" style="background: #f8f9fa; padding: 0.5rem 1rem; border-radius: 8px; display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-briefcase" style="color: var(--primary-color);"></i>
                <span id="jobDetailType">Tipo de trabajo</span>
              </div>
              <div class="meta-item" style="background: #f8f9fa; padding: 0.5rem 1rem; border-radius: 8px; display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-dollar-sign" style="color: var(--primary-color);"></i>
                <span id="jobDetailSalary">Salario</span>
              </div>
              <div class="meta-item" style="background: #f8f9fa; padding: 0.5rem 1rem; border-radius: 8px; display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-chart-line" style="color: var(--primary-color);"></i>
                <span id="jobDetailExperience">Experiencia</span>
              </div>
              <div class="meta-item" style="background: #f8f9fa; padding: 0.5rem 1rem; border-radius: 8px; display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-calendar-alt" style="color: var(--primary-color);"></i>
                <span id="jobDetailDate">Fecha</span>
              </div>
            </div>
          </div>
          
          <div class="job-detail-content">
            <div class="detail-section" style="margin-bottom: 2rem;">
              <h4 style="color: var(--primary-color); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-align-left"></i> Descripción del Puesto
              </h4>
              <div id="jobDetailDescription" style="line-height: 1.6; color: var(--text-color); background: #f8f9fa; padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--primary-color);">
                Descripción del trabajo...
              </div>
            </div>
            
            <div class="detail-section" style="margin-bottom: 2rem;">
              <h4 style="color: var(--primary-color); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-list-check"></i> Requisitos
              </h4>
              <div id="jobDetailRequirements" style="line-height: 1.6; color: var(--text-color); background: #f8f9fa; padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--secondary-color);">
                Requisitos del puesto...
              </div>
            </div>
            
            <div class="detail-section" style="margin-bottom: 2rem;">
              <h4 style="color: var(--primary-color); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-envelope"></i> Información de Contacto
              </h4>
              <div class="contact-info" style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #28a745;">
                <div style="margin-bottom: 0.5rem;">
                  <strong>Email:</strong> 
                  <a id="jobDetailEmail" href="#" style="color: var(--primary-color); text-decoration: none;">email@ejemplo.com</a>
                </div>
                <div>
                  <strong>Teléfono:</strong> 
                  <span id="jobDetailPhone">No proporcionado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer" style="padding: 1.5rem; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
          <button onclick="applyToJob()" class="btn-primary" style="padding: 0.75rem 2rem; border-radius: 8px; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-paper-plane"></i> Aplicar a este puesto
          </button>
          <button onclick="shareJob()" class="btn-secondary" style="padding: 0.75rem 1.5rem; border-radius: 8px; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-share-alt"></i> Compartir
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
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
  console.log("Trabajos guardados:", publishedJobs);
}

// Cargar trabajos guardados
function loadStoredJobs() {
  if (publishedJobs.length === 0) {
    publishedJobs = [
      {
        id: "job-1",
        title: "Desarrollador Frontend React",
        company: "TechCorp",
        location: "Buenos Aires, CABA",
        jobType: "remoto",
        salary: "$80,000 - $120,000",
        experience: "2-4 años",
        description:
          "Buscamos un desarrollador Frontend especializado en React para unirse a nuestro equipo dinámico. El candidato ideal tendrá experiencia sólida en JavaScript moderno, React, Redux y herramientas de desarrollo frontend. Trabajarás en proyectos innovadores que impactan a miles de usuarios.",
        requirements:
          "• Experiencia mínima de 2 años con React\n• Dominio de JavaScript ES6+\n• Conocimiento de Redux o Context API\n• Experiencia con Git y metodologías ágiles\n• Inglés intermedio\n• Conocimientos de testing (Jest, React Testing Library)",
        contactEmail: "rrhh@techcorp.com",
        contactPhone: "+54 11 4567-8901",
        datePublished: "15/06/2025",
        status: "active",
      },
      {
        id: "job-2",
        title: "Diseñador UX/UI Senior",
        company: "DesignStudio",
        location: "Córdoba, Córdoba",
        jobType: "hibrido",
        salary: "$70,000 - $100,000",
        experience: "3-5 años",
        description:
          "Únete a nuestro equipo creativo como Diseñador UX/UI Senior. Serás responsable de crear experiencias digitales excepcionales, desde la investigación de usuarios hasta la implementación de interfaces. Trabajarás en proyectos variados para clientes de diferentes industrias.",
        requirements:
          "• Experiencia mínima de 3 años en UX/UI\n• Dominio de Figma, Sketch o Adobe XD\n• Conocimiento de principios de usabilidad\n• Experiencia en research y testing de usuarios\n• Portfolio sólido con casos de estudio\n• Conocimientos básicos de HTML/CSS",
        contactEmail: "jobs@designstudio.com",
        contactPhone: "+54 351 123-4567",
        datePublished: "14/06/2025",
        status: "active",
      },
      {
        id: "job-3",
        title: "Analista de Datos",
        company: "DataInsights",
        location: "Rosario, Santa Fe",
        jobType: "tiempo-completo",
        salary: "A convenir",
        experience: "1-3 años",
        description:
          "Estamos buscando un Analista de Datos para unirse a nuestro equipo de Business Intelligence. El rol incluye análisis de datos complejos, creación de reportes y dashboards, y colaboración estrecha con diferentes áreas de la empresa para generar insights valiosos.",
        requirements:
          "• Experiencia con SQL y bases de datos\n• Conocimiento de Python o R\n• Manejo de herramientas de visualización (Tableau, Power BI)\n• Experiencia en análisis estadístico\n• Capacidad analítica y atención al detalle\n• Inglés intermedio",
        contactEmail: "careers@datainsights.com",
        contactPhone: "No proporcionado",
        datePublished: "13/06/2025",
        status: "active",
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
        <div class="job-preview-card" onclick="showJobDetails('${
          job.id
        }')" style="cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;" 
             onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)'"
             onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.1)'">
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
          <div style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--primary-color); font-weight: 500;">
            Ver detalles →
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

// Mostrar detalles del trabajo (NUEVA FUNCIÓN MEJORADA)
function showJobDetails(jobId) {
  const job = publishedJobs.find((j) => j.id === jobId);
  if (!job) return;

  // Actualizar contenido del modal
  document.getElementById("jobDetailTitle").textContent = job.title;
  document.getElementById("jobDetailCompany").textContent = job.company;
  document.getElementById(
    "jobDetailLocation"
  ).innerHTML = `<i class="fas fa-map-marker-alt"></i> ${job.location}`;
  document.getElementById("jobDetailType").textContent = getJobTypeLabel(
    job.jobType
  );
  document.getElementById("jobDetailSalary").textContent = job.salary;
  document.getElementById("jobDetailExperience").textContent = job.experience;
  document.getElementById("jobDetailDate").textContent = job.datePublished;
  document.getElementById("jobDetailDescription").innerHTML = formatText(
    job.description
  );
  document.getElementById("jobDetailRequirements").innerHTML = formatText(
    job.requirements
  );
  document.getElementById("jobDetailEmail").textContent = job.contactEmail;
  document.getElementById("jobDetailEmail").href = `mailto:${job.contactEmail}`;
  document.getElementById("jobDetailPhone").textContent = job.contactPhone;

  // Mostrar modal
  const modal = document.getElementById("jobDetailModal");
  modal.style.display = "block";

  // Agregar animación de entrada
  const modalContent = modal.querySelector(".modal-content");
  modalContent.style.animation = "modalSlideIn 0.3s ease-out";

  // Enfocar el modal para accesibilidad
  modal.setAttribute("tabindex", "-1");
  modal.focus();
}

// Cerrar modal de detalle
function closeJobDetailModal() {
  const modal = document.getElementById("jobDetailModal");
  const modalContent = modal.querySelector(".modal-content");

  modalContent.style.animation = "modalSlideOut 0.3s ease-in";

  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

// Formatear texto para mostrar saltos de línea
function formatText(text) {
  return text
    .replace(/\n/g, "<br>")
    .replace(
      /•/g,
      '<span style="color: var(--primary-color); font-weight: bold;">•</span>'
    );
}

// Aplicar a trabajo
function applyToJob() {
  const jobTitle = document.getElementById("jobDetailTitle").textContent;
  const companyName = document.getElementById("jobDetailCompany").textContent;
  const contactEmail = document.getElementById("jobDetailEmail").textContent;

  // Crear enlace mailto con información predefinida
  const subject = `Aplicación para el puesto de ${jobTitle}`;
  const body = `Estimado/a equipo de ${companyName},\n\nMe dirijo a ustedes para expresar mi interés en el puesto de ${jobTitle} que han publicado.\n\nAdjunto mi CV para su consideración.\n\nQuedo a la espera de sus noticias.\n\nSaludos cordiales,\n[Su nombre]`;

  const mailtoLink = `mailto:${contactEmail}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  // Abrir cliente de correo
  window.location.href = mailtoLink;

  // Mostrar confirmación
  showNotification(
    "¡Aplicación enviada! Se ha abierto tu cliente de correo.",
    "success"
  );
}

// Compartir trabajo
function shareJob() {
  const jobTitle = document.getElementById("jobDetailTitle").textContent;
  const companyName = document.getElementById("jobDetailCompany").textContent;

  const shareText = `¡Mira esta oportunidad laboral! ${jobTitle} en ${companyName}`;

  // Usar Web Share API si está disponible
  if (navigator.share) {
    navigator
      .share({
        title: jobTitle,
        text: shareText,
        url: window.location.href,
      })
      .then(() => {
        showNotification("¡Trabajo compartido exitosamente!", "success");
      })
      .catch(() => {
        fallbackShare(shareText);
      });
  } else {
    fallbackShare(shareText);
  }
}

// Función de respaldo para compartir
function fallbackShare(text) {
  // Copiar al portapapeles
  navigator.clipboard
    .writeText(text)
    .then(() => {
      showNotification("¡Enlace copiado al portapapeles!", "success");
    })
    .catch(() => {
      // Crear input temporal para copiar
      const tempInput = document.createElement("input");
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      showNotification("¡Texto copiado al portapapeles!", "success");
    });
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

  if (email && password) {
    showNotification("¡Inicio de sesión exitoso!", "success");
    closeLoginModal();
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

  showNotification("¡Registro exitoso! Ya puede iniciar sesión.", "success");
  closeRegisterModal();
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

// Agregar estilos de animación
const animationStyles = document.createElement("style");
animationStyles.textContent = `
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
    
    @keyframes modalSlideIn {
        from {
            transform: translateY(-50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes modalSlideOut {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(-50px);
            opacity: 0;
        }
    }
    
    /* Estilos adicionales para el modal de detalle */
    .job-detail-header {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        margin: -2rem -2rem 2rem -2rem;
        padding: 2rem;
        border-radius: 8px 8px 0 0;
    }
    
    .detail-section h4 {
        border-bottom: 2px solid #f8f9fa;
        padding-bottom: 0.5rem;
    }
    
    .meta-item {
        transition: all 0.3s ease;
    }
    
    .meta-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .job-preview-card:hover .company {
        color: var(--primary-color);
    }
    
    /* Responsive para móviles */
    @media (max-width: 768px) {
        .modal-content {
            width: 95% !important;
            margin: 5% auto !important;
        }
        
        .job-meta {
            flex-direction: column;
        }
        
        .modal-footer {
            flex-direction: column;
            gap: 1rem;
        }
        
        .modal-footer button {
            width: 100%;
        }
    }
`;
document.head.appendChild(animationStyles);

// Funciones adicionales para mejorar la experiencia

// Función para agregar trabajos favoritos (funcionalidad extra)
function toggleFavorite(jobId) {
  const favorites = JSON.parse(localStorage.getItem("favoriteJobs") || "[]");
  const index = favorites.indexOf(jobId);

  if (index === -1) {
    favorites.push(jobId);
    showNotification("Trabajo agregado a favoritos", "success");
  } else {
    favorites.splice(index, 1);
    showNotification("Trabajo removido de favoritos", "success");
  }

  localStorage.setItem("favoriteJobs", JSON.stringify(favorites));
}

// Función para filtrar trabajos por tipo
function filterJobs(filterType) {
  const filteredJobs =
    filterType === "all"
      ? publishedJobs
      : publishedJobs.filter((job) => job.jobType === filterType);

  const jobsContainer = document.getElementById("jobsPreview");
  if (!jobsContainer) return;

  if (filteredJobs.length === 0) {
    jobsContainer.innerHTML = `
      <div style="text-align: center; color: var(--light-text); padding: 2rem;">
        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
        <p>No se encontraron trabajos con el filtro seleccionado.</p>
      </div>
    `;
    return;
  }

  jobsContainer.innerHTML = filteredJobs
    .map(
      (job) => `
      <div class="job-preview-card" onclick="showJobDetails('${
        job.id
      }')" style="cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;" 
           onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)'"
           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.1)'">
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
        <div style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--primary-color); font-weight: 500;">
          Ver detalles →
        </div>
      </div>
    `
    )
    .join("");
}

// Función para buscar trabajos
function searchJobs(searchTerm) {
  const term = searchTerm.toLowerCase();
  const filteredJobs = publishedJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(term) ||
      job.company.toLowerCase().includes(term) ||
      job.location.toLowerCase().includes(term) ||
      job.description.toLowerCase().includes(term)
  );

  const jobsContainer = document.getElementById("jobsPreview");
  if (!jobsContainer) return;

  if (filteredJobs.length === 0) {
    jobsContainer.innerHTML = `
      <div style="text-align: center; color: var(--light-text); padding: 2rem;">
        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
        <p>No se encontraron trabajos que coincidan con "${searchTerm}".</p>
      </div>
    `;
    return;
  }

  jobsContainer.innerHTML = filteredJobs
    .map(
      (job) => `
      <div class="job-preview-card" onclick="showJobDetails('${
        job.id
      }')" style="cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;" 
           onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)'"
           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.1)'">
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
        <div style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--primary-color); font-weight: 500;">
          Ver detalles →
        </div>
      </div>
    `
    )
    .join("");
}

// Función para manejo de teclado en el modal
document.addEventListener("keydown", function (event) {
  const modal = document.getElementById("jobDetailModal");
  if (modal && modal.style.display === "block") {
    if (event.key === "Escape") {
      closeJobDetailModal();
    }
  }
});

// Función para mejorar la accesibilidad
function improveAccessibility() {
  // Agregar roles ARIA
  const jobCards = document.querySelectorAll(".job-preview-card");
  jobCards.forEach((card) => {
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", "Ver detalles del trabajo");

    // Agregar soporte para navegación por teclado
    card.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const jobId = card.getAttribute("onclick").match(/'([^']+)'/)[1];
        showJobDetails(jobId);
      }
    });
  });
}

// Llamar a la función de accesibilidad después de actualizar los trabajos
const originalUpdateJobsDisplay = updateJobsDisplay;
updateJobsDisplay = function () {
  originalUpdateJobsDisplay();
  improveAccessibility();
};
