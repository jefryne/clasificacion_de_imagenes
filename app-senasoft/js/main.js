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

//Idioma predeterminado
let idioma_detectado = "it"

//Obteniendo el elemento donde se imprime el resultado
let resultado = document.getElementById('resultado');

// Obteniendo el elmento para agregar los resultados en varios idiomas
let resultIdiomas = document.getElementById('resultIdiomas');

// Usando el endpoint de custom vision subiendo imagen desde una URL
let direccionImg = document.getElementById('direccionImg');
let image = document.getElementById('image');

direccionImg.addEventListener('input',() => {
    image.src = direccionImg.value;
    identifyImageURL(direccionImg.value);
})

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
    .then(prediction => {
        let responseUrl = prediction.predictions[0].tagName;
        resultado.textContent = responseUrl;
        traducir(responseUrl,idioma_detectado);
        //aumentardatos(responseUrl);
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
        traducir(responseFile,idioma_detectado);
        //aumentardatos(responseFile);
    })
    .catch(error => {
        resultado.textContent = "Hubo un error al hacer la solicitud: " + error.message;
    });
};


// Traductor del resultado

function traducir(texto_traducir, idioma_detectado) {
    
    fetch("https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to="+idioma_detectado+"&to=fr&to=zh",{
        method: "POST",
        headers: {
            "Ocp-Apim-Subscription-Key": "b562ea315899456c9fcde921ce10926b",
            "Ocp-Apim-Subscription-Region": "eastus",
            "Content-Type": "application/json"
            
        },
        body: JSON.stringify([{'text': texto_traducir}]) 
    })
    .then(respuesta => respuesta.json())
    .then(data =>{
        console.log(data[0].translations);
        
        data[0].translations.forEach(idiomas => {
            
            // let boton = document.createElement('button');

            // let icono = document.createElement('i');
            // icono.classList.add('fa-solid fa-volume-high fa-fade');

            // boton.append(icono);

            let resultadoTraducido = document.createElement('h6');

            resultadoTraducido.textContent = `Lenguaje detectado: (${idiomas.to}) = ${idiomas.text}`;
            resultadoTraducido.classList.add('text-center text-dark');
            //resultadoTraducido.append(boton);

            resultIdiomas.append(resultadoTraducido);
        });

    })
    .catch(error => {
        console.log(error);
    })
}


// texto a voz

//chino zh-CN
// <speak version='1.0' xml:lang='zh-CN'>
//   <voice xml:lang='zh-CN' xml:gender='Female' name='zh-CN-XiaoxueNeural'>"+texto_hablar+"</voice>
// </speak>


//frances fr-FR
// <speak version='1.0' xml:lang='fr-FR'>
//   <voice xml:lang='fr-FR' xml:gender='Female' name='fr-FR-AdeleNeural'>"+texto_hablar+"</voice>
// </speak>

//italiano zh-CN


// function hablar(texto_hablar,lang,name) {
//     const apiUrl = 'https://eastus.tts.speech.microsoft.com/cognitiveservices/v1';
//     const subscriptionKey = '64bd01cdd7d94e569857f92701fd3a38'; 
    
//     fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//             'Ocp-Apim-Subscription-Key': subscriptionKey,
//             'Content-Type': 'application/ssml+xml',
//             'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
//             'User-Agent': 'curl'
//         },
//             // <speak version='1.0' xml:lang='it-IT'><voice xml:lang='it-IT' xml:gender='Female' name='it-IT-FedericaNeural'>"+texto_hablar+"</voice></speak>
//         body: `<speak version='1.0' xml:lang='${lang}'><voice xml:lang='${lang}' xml:gender='Female' name='${name}'>${texto_hablar}</voice></speak>`
//     })
//     .then((response) => {
//         if (response.ok) {
//             return response.blob();
//         } else {
//             throw new Error('Error en la solicitud a la API.');
//         }
//     })
//     .then((blob) => {
//         const url = URL.createObjectURL(blob);

//         // Crea un nuevo elemento de audio
//         const audio = new Audio(url);
    
//         // Reproduce automáticamente el audio
//         audio.play();
//         texto_de_voz=""
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });
// }


// Deteccion de rostro
// const drawButton = document.getElementById('drawButton');
// const imageRostro = document.getElementById('imageRostro'); 
// const line = document.getElementById('line');
// const leftInput = document.getElementById('left');
// const topInput = document.getElementById('top');
// const widthInput = document.getElementById('width');
// const heightInput = document.getElementById('height');
// const imageUrlInput = document.getElementById('imageUrl');
// const deleteUrl = document.getElementById('deleteUrl');
// const container_marcas = document.getElementById('marcar_caras');

//Cuando le de click al boton start
// drawButton.addEventListener('click', () => {
//     const left = parseInt(leftInput.value);    
//     const top = parseInt(topInput.value);
//     const width = parseInt(widthInput.value);
//     const height = parseInt(heightInput.value);
//     let img = imageUrlInput.value;
//     getDeteccion(img);
// });
//Cuando le de click al boton X
// deleteUrl.addEventListener('click',() =>{
//     imageUrlInput.value = '';    
//     imageRostro.src = imageUrlInput;
//     deleteMarcas(container_marcas);
// });
//Cuando ingrese la URL de la imagen cargue de una vez la imagen
// imageUrlInput.addEventListener('input', () => {
//     imageRostro.src = imageUrlInput.value;    
//     if (imageUrlInput.value == '') {
//         deleteMarcas(container_marcas);    
//     }
// });
//Funcion para quitar las marcas de la caras detectadas
// function deleteMarcas(element) {
//     while (element.firstChild) {
//         element.removeChild(element.firstChild);    
//     }
// }
//Funcion para consumir el API del recurso
// function getDeteccion(img) {
//     const key = "281022dafc984cb096a3256c20fc212e";    
//     const endpoint = "https://face-adso.cognitiveservices.azure.com/";

//     const headers = {
//         "Ocp-Apim-Subscription-Key": key,    
//         "Content-Type": "application/json"
//     };

//     const body = JSON.stringify({ url: img });

//     console.log("Analyzing image...\n");

//     fetch(`${endpoint}/face/v1.0/detect?detectionModel=detection_01`, {
//         method: 'POST',    
//         headers: headers,
//         body: body
//     })
//         .then(response => response.json())
//         .then(result => {
//             const analysis = result;    
//             console.log(result);
//             analysis.forEach(face => {
//                 console.log(`Face location: ${JSON.stringify(face.faceRectangle)}\n`);    
//                 let newDiv = document.createElement('div');
//                 newDiv.classList.add('position-absolute');
//                 newDiv.style.left = `${(face.faceRectangle.left / imageRostro.naturalWidth) * 50}%`;
//                 newDiv.style.top = `${(face.faceRectangle.top / imageRostro.naturalHeight) * 100}%`;
//                 newDiv.style.width = `${(face.faceRectangle.width / imageRostro.naturalWidth) * 50}%`;
//                 newDiv.style.height = `${(face.faceRectangle.height / imageRostro.naturalHeight) * 100}%`;
//                 newDiv.style.border = "2px solid red";
//                 container_marcas.appendChild(newDiv);
//             });
//         })
//         .catch(error => console.error('Error:', error));
// }


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

