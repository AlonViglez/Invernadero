const messages = [
    "Automatización",
    "Invernadero",
    "IoT",
    "YOLOv",
    "Deteccion",
    "Plagas",
    "Sensores",
  ];
  
  let shuffledMessages = [];
  let currentIndex = 0;
  
  // Función para mezclar aleatoriamente la lista
  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }
  
  // Preparar una nueva tanda sin repeticiones
  function prepareMessages() {
    shuffledMessages = shuffleArray([...messages]);
    currentIndex = 0;
  }
  
  // Obtener el siguiente mensaje sin repetir
  function getNextMessage() {
    if (currentIndex >= shuffledMessages.length) {
      prepareMessages();
    }
    return shuffledMessages[currentIndex++];
  }
  
  // Inicializar al comienzo
  prepareMessages();
  
  function createTextBubble() {
    const bubble = document.createElement("div");
    bubble.className = "text-bubble";
    bubble.innerText = getNextMessage();
  
    // Generar posición segura
    const left = Math.random() * 80 + 10;
    const top = Math.random() * 60 + 10;
  
    bubble.style.left = left + "vw";
    bubble.style.top = top + "vh";
  
    const container = document.getElementById("bubbles-text");
    container.appendChild(bubble);
  
    setTimeout(() => {
      bubble.remove();
    }, 6000); // duración que coincide con la animación
  }
  
  // Lanzar burbujas cada 1s 
  setInterval(createTextBubble, 2000);
  