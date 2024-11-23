// script.js

// Inicializar el gauge para la Humedad
var gaugeHumedad = new JustGage({
    id: "gauge3",
    value: 0, // Valor inicial
    min: 0,
    max: 90,
    decimals: 2,
    gaugeWidthScale: 0.6,
    valueFontColor: "#1f1d1d"
});

function actualizarGaugeH() {
    // Obtener el valor actual del span de Humedad
    var Humedad = parseFloat(document.getElementById("Humedad").innerText);

    // Verificar si el valor es un número válido
    if (!isNaN(Humedad)) {
        // Actualizar el gauge con la nueva Humedad
        gaugeHumedad.refresh(Humedad);
    } else {
        console.error("El valor de la Humedad no es un número válido:", Humedad);
    }
}

// Actualizar el gauge de humedad cada 500 ms
setInterval(actualizarGaugeH, 500);

// Inicializar el gauge para la Temperatura
var gaugeTemperatura = new JustGage({
    id: "gauge4",
    value: 0, // Valor inicial
    min: 0,
    max: 40,
    decimals: 2,
    gaugeWidthScale: 0.6,
    valueFontColor: "#1f1d1d"
});

function actualizarGaugeT() {
    // Obtener el valor actual del span de Temperatura
    var Temperatura = parseFloat(document.getElementById("Temperatura").innerText);

    // Verificar si el valor es un número válido
    if (!isNaN(Temperatura)) {
        // Actualizar el gauge con la nueva Temperatura
        gaugeTemperatura.refresh(Temperatura);
    } else {
        console.error("El valor de la Temperatura no es un número válido:", Temperatura);
    }
}

// Actualizar el gauge de temperatura cada 500 ms
setInterval(actualizarGaugeT, 500);
