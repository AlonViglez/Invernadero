// Función para aplicar el tema guardado
function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      updateThemeIcon('sun');
    } else {
      document.body.classList.remove('dark-mode');
      updateThemeIcon('moon');
    }
  }
  
  // Función para cambiar entre iconos
  function updateThemeIcon(state) {
    const themeButton = document.getElementById('theme-button');
    if (!themeButton) return;
  
    themeButton.className = '';
    if (state === 'sun') {
      themeButton.classList.add('ri-sun-line', 'change-theme');
    } else {
      themeButton.classList.add('ri-moon-line', 'change-theme');
    }
  }
  
  // Cargar tema al iniciar
  const savedTheme = localStorage.getItem('theme');
  applyTheme(savedTheme);
  
  // Escuchar cambios desde otras ventanas/pestañas
  window.addEventListener('storage', function(event) {
    if (event.key === 'theme') {
      applyTheme(event.newValue);
    }
  });
  
  // Función para alternar tema
  function toggleTheme() {
    const isDark = document.body.classList.contains('dark-mode');
  
    if (isDark) {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
      updateThemeIcon('moon');
    } else {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
      updateThemeIcon('sun');
    }
  
    // Disparar evento storage manualmente para sincronizar pestañas
    window.dispatchEvent(new Event('storage'));
  }
  
  // Asignar evento al botón si existe
  document.getElementById('theme-button')?.addEventListener('click', toggleTheme);