function scrollToSearch() {
  document.getElementById('busqueda').scrollIntoView({ 
    behavior: 'smooth' 
  });
}

// Simulador de Entrevistas
let preguntaActual = 0;
const totalPreguntas = 5;

function iniciarSimulador() {
  document.getElementById('intro').style.display = 'none';
  document.getElementById('pregunta-1').style.display = 'block';
  preguntaActual = 1;
  actualizarProgreso();
}

function siguientePregunta(numPregunta) {
  // Ocultar pregunta actual
  document.getElementById(`pregunta-${preguntaActual}`).style.display = 'none';
  
  // Mostrar siguiente pregunta
  document.getElementById(`pregunta-${numPregunta}`).style.display = 'block';
  preguntaActual = numPregunta;
  actualizarProgreso();
}

function anteriorPregunta(numPregunta) {
  // Ocultar pregunta actual
  document.getElementById(`pregunta-${preguntaActual}`).style.display = 'none';
  
  // Mostrar pregunta anterior
  document.getElementById(`pregunta-${numPregunta}`).style.display = 'block';
  preguntaActual = numPregunta;
  actualizarProgreso();
}

function finalizarSimulador() {
  // Ocultar última pregunta
  document.getElementById('pregunta-5').style.display = 'none';
  
  // Mostrar consejos
  document.getElementById('consejos').style.display = 'block';
  
  // Progreso al 100%
  document.getElementById('progreso').style.width = '100%';
}

function volverIntro() {
  document.getElementById('pregunta-1').style.display = 'none';
  document.getElementById('intro').style.display = 'block';
  preguntaActual = 0;
  actualizarProgreso();
}

function reiniciarSimulador() {
  // Ocultar consejos
  document.getElementById('consejos').style.display = 'none';
  
  // Mostrar intro
  document.getElementById('intro').style.display = 'block';
  
  // Limpiar respuestas
  for (let i = 1; i <= totalPreguntas; i++) {
    document.getElementById(`respuesta-${i}`).value = '';
  }
  
  // Resetear progreso
  preguntaActual = 0;
  actualizarProgreso();
}

function actualizarProgreso() {
  const porcentaje = (preguntaActual / totalPreguntas) * 100;
  document.getElementById('progreso').style.width = porcentaje + '%';
}