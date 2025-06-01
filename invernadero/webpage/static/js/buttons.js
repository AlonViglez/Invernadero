document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-bomba");
  const estadoBomba = document.getElementById("estado-bomba");
  
  if (toggleBtn) {
      toggleBtn.addEventListener("click", async function() {
          const currentState = this.dataset.estado;
          const newState = currentState === "off" ? "on" : "off";
          const action = newState === "on" ? "activar" : "desactivar";
          
          console.log(`Estado actual: ${currentState}, Nuevo estado: ${newState}, Acción: ${action}`);
          
          try {
              // Mostrar estado de carga
              this.disabled = true;
              estadoBomba.textContent = "Estado: Procesando...";
              
              // Realizar la petición AJAX
              const response = await fetch(`/control-bomba/?action=${action}`, {
                  method: 'POST',
                  headers: {
                      'X-CSRFToken': getCookie('csrftoken'),
                      'Content-Type': 'application/json'
                  }
              });
              
              const data = await response.json();
              console.log('Respuesta del servidor:', data);
              
              if (data.success) {
                  // Actualizar el estado del botón
                  this.dataset.estado = newState;
                  
                  if (newState === "on") {
                      this.classList.add("active");
                      this.innerHTML = 'Desactivar Bomba <span class="btn-toggle-icon"></span>';
                      estadoBomba.textContent = "Estado: Bomba encendida";
                      estadoBomba.className = "estado-bomba encendida";
                  } else {
                      this.classList.remove("active");
                      this.innerHTML = 'Activar Bomba <span class="btn-toggle-icon"></span>';
                      estadoBomba.textContent = "Estado: Bomba apagada";
                      estadoBomba.className = "estado-bomba apagada";
                  }
              } else {
                  alert(`Error: ${data.message}`);
                  console.error('Error del servidor:', data);
                  estadoBomba.textContent = `Estado: Error - ${data.message}`;
                  estadoBomba.className = "estado-bomba error";
              }
          } catch (error) {
              console.error("Error:", error);
              alert("Error al comunicarse con el servidor");
              estadoBomba.textContent = "Estado: Error de comunicación";
              estadoBomba.className = "estado-bomba error";
          } finally {
              this.disabled = false;
          }
      });
  }
  
  // Función para obtener el token CSRF
  function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
          const cookies = document.cookie.split(';');
          for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i].trim();
              if (cookie.substring(0, name.length + 1) === (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
  }
});