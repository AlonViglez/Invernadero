var $Temp = $('#Temperatura');
var $Hum = $('#Humedad');
var $Humidity = $('#Humedadsuelo');

var temp = 0;
var hum = 0;
var humidity = 0;

var particle = new Particle();
var token;

particle.login({username: 'mafuba61@gmail.com', password: 'mafuba62'}).then(
    function(data) {
        token = data.body.access_token;
    },
    function(err) {
        console.error('Could not log in.', err);
    }
);

setInterval(function() {
    Promise.all([
        particle.getVariable({ deviceId: '40003c000e47313037363132', name: 'TEMP', auth: token }),
        particle.getVariable({ deviceId: '40003c000e47313037363132', name: 'HUM', auth: token }),
        particle.getVariable({ deviceId: '40003c000e47313037363132', name: 'Humidity', auth: token })
    ]).then(function([tempData, humData, humidityData]) {
        temp = tempData.body.result;
        hum = humData.body.result;
        humidity = humidityData.body.result;

        let Temp = temp.toFixed(2);
        let Hum = hum.toFixed(2);
        let Humidity = humidity.toFixed(2);

        $Temp.text(Temp + "°C");
        $Hum.text(Hum + "%");
        $Humidity.text(Humidity + "%");
    }).catch(function(err) {
        console.error('Error retrieving variables:', err);
    });
}, 5000);
