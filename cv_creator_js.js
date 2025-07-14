let currentScale = 0.5;
let photoDataUrl = null;

// Inicializar
document.addEventListener("DOMContentLoaded", function () {
  addExperience();
  addEducation();
  updateCV();
  setupEventListeners();
});

function setupEventListeners() {
  // Color pickers
  document
    .getElementById("primaryColor")
    .addEventListener("input", updateColors);
  document
    .getElementById("secondaryColor")
    .addEventListener("input", updateColors);
  document.getElementById("textColor").addEventListener("input", updateColors);
  document
    .getElementById("accentColor")
    .addEventListener("input", updateColors);

  // Font family
  document.getElementById("fontFamily").addEventListener("change", updateFont);

  // Photo upload
  document
    .getElementById("photoUpload")
    .addEventListener("change", handlePhotoUpload);

  // Todos los inputs de texto
  const inputs = document.querySelectorAll("input, textarea, select");
  inputs.forEach((input) => {
    input.addEventListener("input", updateCV);
  });
}

function updateColors() {
  const primary = document.getElementById("primaryColor").value;
  const secondary = document.getElementById("secondaryColor").value;
  const text = document.getElementById("textColor").value;
  const accent = document.getElementById("accentColor").value;

  document.getElementById("primaryColorText").textContent = primary;
  document.getElementById("secondaryColorText").textContent = secondary;
  document.getElementById("textColorText").textContent = text;
  document.getElementById("accentColorText").textContent = accent;

  const cvContent = document.getElementById("cv-content");
  cvContent.style.setProperty("--primary-color", primary);
  cvContent.style.setProperty("--secondary-color", secondary);
  cvContent.style.setProperty("--text-color", text);
  cvContent.style.setProperty("--accent-color", accent);
}

function updateFont() {
  const font = document.getElementById("fontFamily").value;
  document.getElementById("cv-content").style.fontFamily = font;
  document.getElementById("fontPreview").style.fontFamily = font;
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      photoDataUrl = e.target.result;
      document.getElementById("photoPreview").src = photoDataUrl;
      document.getElementById("photoPreview").style.display = "block";
      updateCV();
    };
    reader.readAsDataURL(file);
  }
}

function addExperience() {
  const container = document.getElementById("experience-container");
  const div = document.createElement("div");
  div.className = "experience-item";
  div.innerHTML = `
        <div class="form-group">
            <input type="text" placeholder="Puesto" class="exp-position">
        </div>
        <div class="form-group">
            <input type="text" placeholder="Empresa" class="exp-company">
        </div>
        <div class="form-group">
            <input type="text" placeholder="Período (ej. 2020-2023)" class="exp-period">
        </div>
        <div class="form-group">
            <textarea placeholder="Descripción de responsabilidades..." class="exp-description"></textarea>
        </div>
        <button type="button" class="btn btn-secondary" onclick="removeItem(this)">Eliminar</button>
        <hr style="margin: 15px 0;">
    `;
  container.appendChild(div);

  // Agregar event listeners
  div.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("input", updateCV);
  });
}

function addEducation() {
  const container = document.getElementById("education-container");
  const div = document.createElement("div");
  div.className = "education-item";
  div.innerHTML = `
        <div class="form-group">
            <input type="text" placeholder="Título/Grado" class="edu-degree">
        </div>
        <div class="form-group">
            <input type="text" placeholder="Institución" class="edu-institution">
        </div>
        <div class="form-group">
            <input type="text" placeholder="Año" class="edu-year">
        </div>
        <button type="button" class="btn btn-secondary" onclick="removeItem(this)">Eliminar</button>
        <hr style="margin: 15px 0;">
    `;
  container.appendChild(div);

  // Agregar event listeners
  div.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", updateCV);
  });
}

function removeItem(button) {
  button.parentElement.remove();
  updateCV();
}

function updateCV() {
  const cvContent = document.getElementById("cv-content");

  // Información personal
  const fullName = document.getElementById("fullName").value || "Tu Nombre";
  const jobTitle = document.getElementById("jobTitle").value || "Tu Profesión";
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const location = document.getElementById("location").value;
  const linkedin = document.getElementById("linkedin").value;
  const profile = document.getElementById("profile").value;

  // Header
  let headerHTML = '<div class="cv-header">';
  if (photoDataUrl) {
    headerHTML += `<img src="${photoDataUrl}" class="cv-photo" alt="Foto de perfil">`;
  }
  headerHTML += `
        <h1 class="cv-name">${fullName}</h1>
        <p class="cv-title">${jobTitle}</p>
        <div class="cv-contact">
    `;

  if (email)
    headerHTML += `<span><i class="fas fa-envelope"></i> ${email}</span>`;
  if (phone) headerHTML += `<span><i class="fas fa-phone"></i> ${phone}</span>`;
  if (location)
    headerHTML += `<span><i class="fas fa-map-marker-alt"></i> ${location}</span>`;
  if (linkedin)
    headerHTML += `<span><i class="fab fa-linkedin"></i> ${linkedin}</span>`;

  headerHTML += "</div></div>";

  // Perfil profesional
  let profileHTML = "";
  if (profile) {
    profileHTML = `
            <div class="cv-section">
                <h2>Perfil Profesional</h2>
                <p>${profile}</p>
            </div>
        `;
  }

  // Experiencia laboral
  let experienceHTML = '<div class="cv-section"><h2>Experiencia Laboral</h2>';
  const experiences = document.querySelectorAll(".experience-item");
  experiences.forEach((exp) => {
    const position = exp.querySelector(".exp-position").value;
    const company = exp.querySelector(".exp-company").value;
    const period = exp.querySelector(".exp-period").value;
    const description = exp.querySelector(".exp-description").value;

    if (position || company) {
      experienceHTML += `
                <div class="cv-item">
                    <h3>${position}</h3>
                    <div class="cv-item-meta">${company} | ${period}</div>
                    <p>${description}</p>
                </div>
            `;
    }
  });
  experienceHTML += "</div>";

  // Educación
  let educationHTML = '<div class="cv-section"><h2>Educación</h2>';
  const educations = document.querySelectorAll(".education-item");
  educations.forEach((edu) => {
    const degree = edu.querySelector(".edu-degree").value;
    const institution = edu.querySelector(".edu-institution").value;
    const year = edu.querySelector(".edu-year").value;

    if (degree || institution) {
      educationHTML += `
                <div class="cv-item">
                    <h3>${degree}</h3>
                    <div class="cv-item-meta">${institution} | ${year}</div>
                </div>
            `;
    }
  });
  educationHTML += "</div>";

  // Habilidades
  let skillsHTML = "";
  const skills = document.getElementById("skills").value;
  if (skills) {
    const skillArray = skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill);
    if (skillArray.length > 0) {
      skillsHTML =
        '<div class="cv-section"><h2>Habilidades</h2><div class="skills-grid">';
      skillArray.forEach((skill) => {
        skillsHTML += `<div class="skill-item">${skill}</div>`;
      });
      skillsHTML += "</div></div>";
    }
  }

  cvContent.innerHTML =
    headerHTML + profileHTML + experienceHTML + educationHTML + skillsHTML;
  updateColors();
  updateFont();
}

function scaleCV(change) {
  currentScale = Math.max(0.2, Math.min(1.5, currentScale + change));
  const cvContent = document.getElementById("cv-content");
  cvContent.style.transform = `scale(${currentScale})`;
  document.getElementById("scaleValue").textContent =
    Math.round(currentScale * 100) + "%";
}

function downloadPDF() {
  window.print();
}

function printCV() {
  window.print();
}

    
