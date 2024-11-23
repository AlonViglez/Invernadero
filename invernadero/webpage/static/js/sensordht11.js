var $Temp = $('#Temperatura');  // asignamos el objeto Temperatura a una variable nueva


var $Hum= $('#Humedad'); // asignamos el objeto  Humedad a una variable nueva


var temp=0;


var hum=0;


var particle = new Particle();


var token;


particle.login({username:
'mafuba61@gmail.com', password: 'mafuba62'}).then(


  function(data) {


     token = data.body.access_token;


  },


  function (err) {


    console.log('Could not log in.', err);


  }


);


setInterval(function()
{


 


  particle.getVariable({ deviceId:
'40003c000e47313037363132', name: 'TEMP', auth: token }).then(function(data) {


 


  console.log('Device variable retrievedsuccessfully:', data);


  temp=data.body.result;


  


},
function(err) {


  console.log('An error occurred while gettingattrs:', err);


});


      particle.getVariable({ deviceId:
'40003c000e47313037363132', name: 'HUM', auth: token }).then(function(data) {


 


  console.log('Device variable retrievedsuccessfully:', data);


  hum=data.body.result;


  


},
function(err) {


  console.log('An error occurred while gettingattrs:', err);


});


 Hum = hum.toFixed(2);


Temp = temp.toFixed(2);


$Hum.text(Hum+"%");


$Temp.text(Temp+"°C");


},6000);