(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('bg-primary shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('bg-primary shadow-sm').css('top', '-150px');
        }
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        items: 1,
        autoplay: true,
        smartSpeed: 1000,
        dots: true,
        loop: true,
        nav: true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });
    
})(jQuery);

let resultIdiomas = document.getElementById("resultIdiomas");



//Obteniendo el elemento donde se imprime el resultado
let resultado = document.getElementById('resultado');


function hablar_imagen(acento,lemguaje,texto_hablar) {
    console.log(texto_hablar+"llego");
    const apiUrl = 'https://eastus.tts.speech.microsoft.com/cognitiveservices/v1'; // Reemplaza con la URL correcta
    const subscriptionKey = 'c57f563494ad41df92dfbe31871ad5cc'; // Reemplaza con tu clave de suscripción

    const headers = new Headers();
    headers.append('Ocp-Apim-Subscription-Key', subscriptionKey);
    headers.append('Content-Type', 'application/ssml+xml');
    headers.append('X-Microsoft-OutputFormat', 'audio-16khz-128kbitrate-mono-mp3');
    headers.append('User-Agent', 'curl');



    const ssml = "<speak version='1.0' xml:lang='"+lemguaje+"'><voice xml:lang='"+lemguaje+"' xml:gender='Female' name='"+acento+"'>"+texto_hablar+"</voice></speak>";

    fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: ssml,
    })
    .then((response) => {
        if (response.ok) {
            return response.blob();
        } else {
            throw new Error('Error en la solicitud a la API.');
        }
    })
    .then((blob) => {
        const url = URL.createObjectURL(blob);

        // Crea un nuevo elemento de audio
        const audio = new Audio(url);
    
        // Reproduce automáticamente el audio
        audio.play();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Servicio de Traduccion y voz
async function traslator(texto) {
    const key = 'c57f563494ad41df92dfbe31871ad5cc';
    const location = 'eastus';
    const endpoint = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=fr&to=en&to=it&to=zh-Hans&to=de&to=es&to=pt&to=zh&to=el&to=ro&to=ru&to=he';
    const headers = {
        "Ocp-Apim-Subscription-Key" : key,
        "Ocp-Apim-Subscription-Region" : location,
        "Content-Type" : "application/json"
    };
    const body = JSON.stringify([{
        'text' : texto
    }]);

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: body
        });
        
        const result = await response.json();
        console.log(result);
        const respuesta = result[0].translations[1].text;
        let html_alert = ""
        let contador = 0
        result[0].translations.forEach(async idioma => {
            
            if(contador == 0){
                html_alert += '<div class="row text-center">'
                html_alert += '<p class="col-4"><span>'+idioma.to+'</span><span> '+idioma.text+'</span><i class="boton_hablar fa-solid fa-volume-high"></i></p>' 
                contador++
            }else if(contador == 3){
                html_alert += '<p class="col-4"><span>'+idioma.to+'</span><span> '+idioma.text+'</span><i class="boton_hablar fa-solid fa-volume-high"></i></p>' 
                html_alert += '</div>'
                contador=0
            }else{
                html_alert += '<p class="col-4"><span>'+idioma.to+'</span><span> '+idioma.text+'</span><i class="boton_hablar fa-solid fa-volume-high"></i></p>' 
            }
            if(contador !=0){
                contador++
            }
            
        });
        Swal.fire({
            title: '<strong>Traducciones</strong>',
            icon: 'success',
            html:
              '<div>'+html_alert+'</div>',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
              '<i class="fa fa-thumbs-up"></i> Great!',
            confirmButtonAriaLabel: 'Thumbs up, great!',
            cancelButtonText:
              '<i class="fa fa-thumbs-down"></i>',
            cancelButtonAriaLabel: 'Thumbs down'
          })
        
    let iconos_hablar = document.querySelectorAll(".boton_hablar")    
    for (let index = 0; index < iconos_hablar.length; index++) {
        iconos_hablar[index].addEventListener("click",()=>{
            let elemento_padre = iconos_hablar[index].parentElement
            let nodos_hijos =elemento_padre.childNodes
            console.log(nodos_hijos);
            let acento = ""
            let lemguaje = ""
            console.log(nodos_hijos[0].textContent+"idioma");
            if(nodos_hijos[0].textContent == "af"){
                acento = "af-ZA-AdriNeural"
                lemguaje = "af-ZA"
            }else if(nodos_hijos[0].textContent == "es"){
                acento = "es-ES-ElviraNeural"
                lemguaje = "es-ES"
            }else if(nodos_hijos[0].textContent == "de"){
                acento = "de-DE-KatjaNeural"
                lemguaje = "de-DE"
            }else if(nodos_hijos[0].textContent == "en"){
                acento = "en-US-JennyMultilingualNeural"
                lemguaje = "en-US"
            }else if(nodos_hijos[0].textContent == "it"){
                acento = "it-IT-ElsaNeural"
                lemguaje = "it-IT"
            }else if(nodos_hijos[0].textContent == "pt"){
                acento = "pt-PT-RaquelNeural"
                lemguaje = "pt-PT"
            }else if(nodos_hijos[0].textContent == "zh"){
                acento = "zh-CN-XiaoxiaoNeural"
                lemguaje = "zh-CN"
            }else if(nodos_hijos[0].textContent == "el"){
                acento = "el-GR-AthinaNeural"
                lemguaje = "el-GR"
            }else if(nodos_hijos[0].textContent == "ro"){
                acento = "ro-RO-AlinaNeural"
                lemguaje = "ro-RO"
            }else if(nodos_hijos[0].textContent == "ru"){
                acento = "ru-RU-SvetlanaNeural"
                lemguaje = "ru-RU"
            }else if(nodos_hijos[0].textContent == "fr"){
                acento = "fr-FR-BrigitteNeural"
                lemguaje = "fr-FR"
            }else if(nodos_hijos[0].textContent == "zh-Hans"){
                acento = "zh-CN-henan-YundengNeural"
                lemguaje = "zh-CN-henan"
            }else if(nodos_hijos[0].textContent == "he"){
                acento = "he-IL-HilaNeural"
                lemguaje = "he-IL"
            }
            console.log("aqui");
            console.log(nodos_hijos[1].textContent+"el texto");
            console.log(acento);
            console.log(lemguaje);
            console.log(nodos_hijos[1].textContent+"el texto");
            hablar_imagen(acento, lemguaje, nodos_hijos[1].textContent)
        })
    }

    } catch (error) {
        console.log(error);
    }
}


// Usando el endpoint de custom vision subiendo imagen desde una URL
let direccionImg = document.getElementById('direccionImg');
let image = document.getElementById('image');

direccionImg.addEventListener('input',async () => {
    image.src = direccionImg.value;
    identifyImageURL(direccionImg.value);
    let anality = await getAnalisis(direccionImg.value);
    let descrip = await traslatorAnality(anality);
    image.setAttribute('title',descrip);
})


//Clasificacion por URL
function identifyImageURL(imageUrl) {
    const predictionUrl = "https://servicios-azure.cognitiveservices.azure.com/customvision/v3.0/Prediction/24dc9b83-0ec2-4a5d-8609-bf2e6c0ddd5a/classify/iterations/modelov2/url";
    const predictionKey = "b562ea315899456c9fcde921ce10926b";
    const headers = {
        'Prediction-Key': predictionKey,
        'Content-Type': 'application/json'
    };
    const body = JSON.stringify({
        url: imageUrl
    });

    fetch(predictionUrl, {
        method: 'POST',
        headers: headers,
        body: body
    })
    .then(response => {
        return response.json();
    })
    .then(prediction =>  {

        (async () => {
            let responseUrl = prediction.predictions[0].tagName;
            resultado.textContent = responseUrl;
            traslator(responseUrl);
            aumentardatos(responseUrl);
        })();
    })
    .catch(error => {
        resultado.textContent = "An error occurred:", error;
    });
}



//Usando el endpoint de custom vision para imagen local
const fileInput = document.getElementById("fileInput");
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            image.src = e.target.result;
            identifyImageFILE();
        };

        reader.readAsDataURL(file);
    }
});



// Claficacion cargando localmente
function identifyImageFILE() {
    

    if (fileInput.files.length === 0) {
        resultado.innerHTML = "Por favor, seleccione una imagen.";
        return;
    }

    const apiKey = "b562ea315899456c9fcde921ce10926b";
    const apiUrl = "https://servicios-azure.cognitiveservices.azure.com/customvision/v3.0/Prediction/24dc9b83-0ec2-4a5d-8609-bf2e6c0ddd5a/classify/iterations/modelov2/image";
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("file", file);

    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Prediction-Key": apiKey,
        },
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.predictions[0].tagName);
        let responseFile = data.predictions[0].tagName;
        resultado.textContent = responseFile;
        traslator(responseFile);
        aumentardatos(responseFile);
    })
    .catch(error => {
        resultado.textContent = "Hubo un error al hacer la solicitud: " + error.message;
    });
};


//Analisis de imagenes
async function getAnalisis(img) {
    const key = 'b562ea315899456c9fcde921ce10926b';
    const endpoint = 'https://servicios-azure.cognitiveservices.azure.com/';
    const headers = {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/json"
    };
    const body = JSON.stringify({ url: img });

    const response = await fetch(`${endpoint}vision/v3.2/analyze?visualFeatures=Categories,Description,Objects`, {
        method: 'POST',
        headers: headers,
        body: body
    });
    const result = await response.json();
    let textoDescription = result.description.captions[0].text;
    return textoDescription;
}

// traductor para el analisis de imagen
async function traslatorAnality(texto) {
    const key = 'c57f563494ad41df92dfbe31871ad5cc';
    const location = 'eastus';
    const endpoint = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=es';
    const headers = {
        "Ocp-Apim-Subscription-Key" : key,
        "Ocp-Apim-Subscription-Region" : location,
        "Content-Type" : "application/json"
    };
    const body = JSON.stringify([{
        'text' : texto
    }]);
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: body
        });
        const result = await response.json();
        const respuesta = result[0].translations[0].text;
        return respuesta;
    } catch (error) {
        console.error(error);
    }
}


// Parte 2 del reto deteccion de rostros y objetos


let imageContainer = document.getElementById('image-container');
let marcar_caras = document.getElementById('marcar_caras');

// inputs
let direccionImgRostro1 = document.getElementById('direccionImgRostro1');
let direccionImgRostro2 = document.getElementById('direccionImgRostro2');
let fileInputRostro3 = document.getElementById('fileInputRostro3');
let fileInputRostro4 = document.getElementById('fileInputRostro4');
let direccionImgRostro4 = document.getElementById('direccionImgRostro4');

// imagenes
let imgRostro1 = document.getElementById('imgRostro1');
let imgRostro2 = document.getElementById('imgRostro2');
let imgRostro3 = document.getElementById('imgRostro3');
let imgRostro4 = document.getElementById('imgRostro4');

// ul para añadir los objetos detectados
let ulObjet1 = document.getElementById('objDetec1');
let ulObjet2 = document.getElementById('objDetec2');
let ulObjet3 = document.getElementById('objDetec3');
let ulObjet4 = document.getElementById('objDetec4');

// marcas
let marcar_caras3 = document.getElementById('marcar_caras3');

//cargando imagen desde url
direccionImgRostro1.addEventListener('input', async ()  => {
    imgRostro1.src = direccionImgRostro1.value;
    getDeteccionFace(direccionImgRostro1.value);
    getDetectionURL(direccionImgRostro1.value,ulObjet1);
    
    let anality = await getAnalisis(direccionImgRostro1.value);
    let descrip = await traslatorAnality(anality);
    imgRostro1.setAttribute('title',descrip);
    
    if (direccionImgRostro1.value == '') {
        removerHijos(marcar_caras);
    }  

});



//cargando imagen desde url
direccionImgRostro2.addEventListener('input',async () => {
    imgRostro2.src = direccionImgRostro2.value;
    getDetectionURL(direccionImgRostro2.value,ulObjet2);

    let anality = await getAnalisis(direccionImgRostro2.value);
    let descrip = await traslatorAnality(anality);
    imgRostro2.setAttribute('title',descrip);
});

//cargando imagen localmente
fileInputRostro3.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            imgRostro3.src = e.target.result;
            getDetectionFile(fileInputRostro3,ulObjet3);
        };

        reader.readAsDataURL(file);
    }
});

//Deteccion de Objetos cargando imagen localmente
fileInputRostro4.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            imgRostro4.src = e.target.result;
            removerHijos(ulObjet4);
            getDetectionFile(fileInputRostro4,ulObjet4);
        };
        
        reader.readAsDataURL(file);
    }
});

direccionImgRostro4.addEventListener('input',() => {
    imgRostro4.src = direccionImgRostro4.value;
    removerHijos(ulObjet4);
    getDetectionURL(direccionImgRostro4.value,ulObjet4);    
});

// Funcion para quitar las marcas de la caras detectadas
function removerHijos(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);    
    }
}
// Funcion para consumir el API del recurso
function getDeteccionFace(img) {
    const key = "281022dafc984cb096a3256c20fc212e";    
    const endpoint = "https://face-adso.cognitiveservices.azure.com/";

    const headers = {
        "Ocp-Apim-Subscription-Key": key,    
        "Content-Type": "application/json"
    };

    const body = JSON.stringify({ url: img });

    console.log("Analyzing image...\n");

    fetch(`${endpoint}/face/v1.0/detect?detectionModel=detection_01`, {
        method: 'POST',    
        headers: headers,
        body: body
    })
        .then(response => response.json())
        .then(result => {
            const analysis = result;    
            console.log(result);
            analysis.forEach(face => {
                console.log(`Face location: ${JSON.stringify(face.faceRectangle)}\n`);    
                let newDiv = document.createElement('div');
                newDiv.classList.add('position-absolute');
                newDiv.style.left = `${(face.faceRectangle.left / imgRostro1.naturalWidth) * 100}%`;
                newDiv.style.top = `${(face.faceRectangle.top / imgRostro1.naturalHeight) * 100}%`;
                newDiv.style.width = `${(face.faceRectangle.width / imgRostro1.naturalWidth) * 100}%`;
                newDiv.style.height = `${(face.faceRectangle.height / imgRostro1.naturalHeight) * 100}%`;
                newDiv.style.border = "2px solid red";
                marcar_caras.appendChild(newDiv);
            });
        })
        .catch(error => console.error('Error:', error));
}
// Fin del Deteccion de rostros


//Deteccion de Objetos por URL
function getDetectionURL(imageUrl,ul) {
    const predictionUrl = "https://servicios-azure.cognitiveservices.azure.com/customvision/v3.0/Prediction/34154355-5074-4e27-85a3-bb9549d802f2/detect/iterations/deteccionV4/url";
    const predictionKey = "b562ea315899456c9fcde921ce10926b";
    const headers = {
        'Prediction-Key': predictionKey,
        'Content-Type': 'application/json'
    };
    const body = JSON.stringify({
        url: imageUrl
    });

    fetch(predictionUrl, {
        method: 'POST',
        headers: headers,
        body: body
    })
    .then(response => {
        return response.json();
    })
    .then(prediction =>  {

        (async () => {
        
            let arrayPredictions = prediction.predictions;
            arrayPredictions.forEach(elemento => {
                if (elemento.probability > 0.95) {
                    const li = document.createElement("li");
                    
                    // Traducir el texto del elemento antes de asignarlo al <li>
                    //const translatedText = await traslator(en,es,element);
                    li.textContent = `${elemento.tagName} - ${elemento.probability}%`;
                    
                    li.classList.add("list-group-item");
                    ul.appendChild(li);
                    
                    
                }
            });
            console.log(prediction);
            
        
        })();
    })
    .catch(error => {
        resultado.textContent = "An error occurred:", error;
    });
}

//Deteccion de Objetos cargando imagen localmente
function getDetectionFile(fileInputRostro,ul) {
    if (fileInputRostro.files.length === 0) {
        resultado.innerHTML = "Por favor, seleccione una imagen.";
        return;
    }
    const apiKey = "b562ea315899456c9fcde921ce10926b";
    const endpoint = "https://servicios-azure.cognitiveservices.azure.com/customvision/v3.0/Prediction/34154355-5074-4e27-85a3-bb9549d802f2/detect/iterations/deteccionV4/image";
    const file = fileInputRostro.files[0];
    
    const formData = new FormData();
    formData.append("file", file);
    
    fetch(endpoint, {
        method: "POST",
        headers: {
            "Prediction-Key": apiKey,
        },
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        let arrayPredictions = data.predictions;
        arrayPredictions.forEach(elemento => {
            if (elemento.probability > 0.95) {
                const li = document.createElement("li");
                //marcasObjetos(elemento.boundingBox.height,elemento.boundingBox.left,elemento.boundingBox.top,elemento.boundingBox.width,imgRostro3,marcar_caras3);
                
                // Traducir el texto del elemento antes de asignarlo al <li>
                //const translatedText = await traslator(en,es,element);
                li.textContent = `${elemento.tagName} - ${elemento.probability}%`;
                
                li.classList.add("list-group-item");
                ul.appendChild(li);
                
            }
        });
        console.log(data);
    })
    .catch(error => {
        resultado.textContent = "Hubo un error al hacer la solicitud: " + error.message;
    });
    
}



//Funcion para aumentar el conteo de el objeto que se clasifica
function aumentardatos(categoria) {
    fetch(`http://127.0.0.1:8000/aumetar-categoria/${categoria}`)
    .then(res => res.json())
    .then(data =>{
        console.log(data);
    })
    .catch(error =>{
        console.log(error);
    })
}

//Boton para limpiar las fotos y el input
let limpiarDatos1 = document.getElementById('limpiarDatos1');
let limpiarDatos2 = document.getElementById('limpiarDatos2');
let limpiarDatos3 = document.getElementById('limpiarDatos3');
let limpiarDatos4 = document.getElementById('limpiarDatos4');
let limpiarDatos5 = document.getElementById('limpiarDatos5');

limpiarDatos1.addEventListener('click', () => {
    image.src = "";
    direccionImg.value = "";
    fileInput.value = "";
    resultado.textContent = "";
});


limpiarDatos2.addEventListener('click', () => {
    removerHijos(ulObjet1);
    removerHijos(marcar_caras);
    imgRostro1.src = "";
    direccionImgRostro1.value = "";
});


limpiarDatos3.addEventListener('click', () => {
    removerHijos(ulObjet2);
    imgRostro2.src = "";
    direccionImgRostro2.value = "";
});


limpiarDatos4.addEventListener('click', () => {
    removerHijos(ulObjet3);
    imgRostro3.src = "";
    fileInputRostro3.value = "";
});


limpiarDatos5.addEventListener('click', () => {
    removerHijos(ulObjet4);
    imgRostro4.src = "";
    fileInputRostro4.value = "";
    direccionImgRostro4.value = "";
});