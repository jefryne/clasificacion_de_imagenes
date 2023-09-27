let user_input = document.getElementById("user_input")
let boton_bot = document.getElementById("boton_bot")
let chat = document.getElementById("chat")
let cartas_registros = document.getElementById("cartas_registros")
let boton_modal_bot = document.getElementById("boton_modal_bot")
let boton_microfono = document.getElementById("boton_microfono")
let texto_de_voz = ""
idioma_detectado = "es"
texto_labels = "Nombre Usuario--Telefono Usuario--Correo electronico"
let formular_pregunta_saludo = ""
let formular_pregunta = ""
let correo = " "
let intencion = ""
let telefono = " "
let nombreUsuario = " "
let telefono_texto = ""
let correo_texto = ""
let entidad_nombre = ""
let acento = "es-ES-ElviraNeural"
let lemguaje = "es-ES"



boton_modal_bot.addEventListener('click', ()=>{
    let label_saludo = document.createElement('label')
    label_saludo.classList.add("alert", "alert-primary")
    label_saludo.textContent = "Bienvenido soy el bot charlitos compro y vendo celulares"
    chat.append(label_saludo)
    document.addEventListener("keyup", function(event) {  
        if (event.code === 'Enter') {
            if(user_input.value != null && user_input.value != ""){
                traducir(user_input.value,"entidad") 
            }
              
        }
    });
})

boton_bot.addEventListener("click",()=>{
    if(user_input.value != null && user_input.value != ""){
        traducir(user_input.value,"entidad") 
    } 
})


function peticionDeIntenciones(texto_intencio_detectar) {
    let data_intenciones = {
        "kind":"Conversation",
        "analysisInput":{
            "conversationItem":{
                "id":"1",
                "text": texto_intencio_detectar,
                "modality":"text",
                "language":"es",
                "participantId":"1"
            }
        },
        "parameters":{
            "projectName":"languaje-bot-senasoft",
            "verbose":true,
            "deploymentName":"bot-senasoft",
            "stringIndexType":"TextElement_V8"
        }
    }
    if(user_input.value != null && user_input.value != ""){
        let label_chat_usuario = document.createElement("div");
        label_chat_usuario.classList.add("alert", "alert-warning")
        label_chat_usuario.textContent = user_input.value
        chat.append(label_chat_usuario)
    }else if(texto_de_voz != ""){
        let label_chat_usuario = document.createElement("div");
        label_chat_usuario.classList.add("alert", "alert-warning")
        label_chat_usuario.textContent = texto_de_voz
        chat.append(label_chat_usuario)
    }
 
    url = "https://languaje-day-1.cognitiveservices.azure.com/language/:analyze-conversations?api-version=2022-10-01-preview"
    user_input.value = ""
    fetch(url,{
        method: "POST",
        headers: {
            "Ocp-Apim-Subscription-Key": "1d9dc89c449d4a428acfd2ae9979409b  ",
            "Apim-Request-Id": "4ffcac1c-b2fc-48ba-bd6d-b69d9942995a",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data_intenciones)
    })
    .then(respuesta => respuesta.json())
    .then(data_intenciones => {
        formular_pregunta = ""
        console.log(data_intenciones);
        intencion = data_intenciones.result.prediction.topIntent
        console.log("winder");
        console.log(intencion);
        
        data_intenciones.result.prediction.entities.forEach(element => {
            if(element.category == "Saludo"){
                formular_pregunta_saludo = "Saludo"
                if (element.text == "buenos dias") {
                    formular_pregunta_saludo += " buenos dias"
                }else if(element.text == "Buenas tardes"){
                    formular_pregunta_saludo += " Buenas tardes"
                }else if(element.text == "hola"){
                    formular_pregunta_saludo += " hola"
                }
                console.log(formular_pregunta_saludo);
                peticionPreguntasrespuestas(formular_pregunta_saludo)
            }
            if(element.category == "Correo"){
                correo += element.category
                correo_texto = element.text
            }
            if(element.category == "NumeroTelefono"){
                telefono += element.category
                telefono_texto = element.text
            }
            if(element.category == "NombreUsuario"){
                entidad_nombre = element.category
                nombreUsuario = element.text
            }
            
            formular_pregunta = intencion+entidad_nombre+telefono+correo
            console.log("otro winder");
            console.log(formular_pregunta);
        });
        if(formular_pregunta_saludo == ""){
            console.log("por aqui");
            console.log(formular_pregunta);
            peticionPreguntasrespuestas(formular_pregunta)
        }
         
    })
    .catch(error => {
        console.log(error);
    })    
}


function peticionPreguntasrespuestas(pregunta) {
    console.log("preguntas");
    console.log(pregunta);
    let data_preguntas_respuestas = {
        "top":3,
        "question":pregunta,
        "includeUnstructuredSources":true,
        "confidenceScoreThreshold":"0.8",
        "answerSpanRequest":{
            "enable":false,
        "topAnswersWithSpan":1,
        "confidenceScoreThreshold":"0.8"
        },
        "filters":{
            "metadataFilter":{
            "logicalOperation":"AND",
            }
        }
    }

    url = "https://languaje-day-1.cognitiveservices.azure.com/language/:query-knowledgebases?projectName=preguntas-senasoft&api-version=2021-10-01&deploymentName=production"
    fetch(url,{
        method: "POST",
        headers: {
            "Ocp-Apim-Subscription-Key": "1d9dc89c449d4a428acfd2ae9979409b",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data_preguntas_respuestas)
    })
    .then(respuesta => respuesta.json())
    .then(data_preguntas_respuestas => {
        console.log(data_preguntas_respuestas);
        console.log(data_preguntas_respuestas.answers[0].answer); 
        traducir(data_preguntas_respuestas.answers[0].answer,"respuesta") 
    })
    .catch(error => {
        console.log(error);
    })    
}

function crearRegistros(nombre_usuario,telefono_texto,correo_texto) {
    data = {
        "nombre_usuario": nombre_usuario,
        "correo": telefono_texto,
        "telefono": correo_texto
    }

    fetch("http://127.0.0.1:8000/",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(respuesta => respuesta.json())
    .then(data =>{
        console.log(data);
    })
    .catch(error =>{
        console.log(error);
    })
}




function hablar(texto_hablar, acento, lemguaje) {
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
        texto_de_voz=""
        if(formular_pregunta_saludo != ""){
            setTimeout(()=>{
                peticionPreguntasrespuestas(formular_pregunta)
                formular_pregunta_saludo = ""
            },2000)
            
            
        }
        if(intencion == "Estadisticas"){
            top_clasificados()
        }

        
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
function traducir(texto_traducir,accion) {
    
    fetch("https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to="+((accion=="entidad") ? "es": idioma_detectado),{
        method: "POST",
        headers: {
            "Ocp-Apim-Subscription-Key": "c57f563494ad41df92dfbe31871ad5cc",
            "Ocp-Apim-Subscription-Region": "eastus",
            "Content-Type": "application/json"
            
        },
        body: JSON.stringify([{'text': texto_traducir}]) 
    })
    .then(respuesta => respuesta.json())
    .then(data =>{
        console.log(data);
        if(accion == "entidad"){
            idioma_detectado = data[0].detectedLanguage.language
            console.log(idioma_detectado);
            peticionDeIntenciones(data[0].translations[0].text);
        }else if(accion == "respuesta"){
            let label_chat = document.createElement("div");
            label_chat.classList.add("alert", "alert-primary")
            if(idioma_detectado == "af"){
                acento = "af-ZA-AdriNeural"
                lemguaje = "af-ZA"
            }else if(idioma_detectado == "es"){
                acento = "es-ES-ElviraNeural"
                lemguaje = "es-ES"
            }else if(idioma_detectado == "de"){
                acento = "de-DE-KatjaNeural"
                lemguaje = "de-DE"
            }else if(idioma_detectado == "en"){
                acento = "en-US-JennyMultilingualNeural"
                lemguaje = "en-US"
            }else if(idioma_detectado == "it"){
                acento = "it-IT-ElsaNeural"
                lemguaje = "it-IT"
            }else if(idioma_detectado == "pt"){
                acento = "pt-PT-RaquelNeural"
                lemguaje = "pt-PT"
            }else if(idioma_detectado == "zh"){
                acento = "zh-CN-XiaoxiaoNeural"
                lemguaje = "zh-CN"
            }else if(idioma_detectado == "el"){
                acento = "el-GR-AthinaNeural"
                lemguaje = "el-GR"
            }else if(idioma_detectado == "ro"){
                acento = "ro-RO-AlinaNeural"
                lemguaje = "ro-RO"
            }else if(idioma_detectado == "ru"){
                acento = "ru-RU-SvetlanaNeural"
                lemguaje = "ru-RU"
            }else if(idioma_detectado == "fr"){
                acento = "fr-FR-BrigitteNeural"
                lemguaje = "fr-FR"
            }else if(idioma_detectado == "zh-Hans"){
                acento = "zh-CN-henan-YundengNeural"
                lemguaje = "zh-CN-henan"
            }
            if(formular_pregunta_saludo != ""){
                label_chat.textContent = data[0].translations[0].text+" "+nombreUsuario
                hablar(textContent = data[0].translations[0].text+" "+nombreUsuario, acento, lemguaje)
                // formular_pregunta_saludo = ""
            }else{
                label_chat.textContent = data[0].translations[0].text
                hablar(textContent = data[0].translations[0].text,acento, lemguaje )
            }
            chat.append(label_chat)
            
            console.log(intencion+"--"+correo+"--"+telefono);
            if(intencion != "" && telefono != " " && correo != " "){
                traducir(texto_labels, "formulario")
            }
        }else if(accion == "formulario"){
            console.log(data[0].translations[0].text);
            arreglo_palabras_label = data[0].translations[0].text.split('--'); 
            console.log(arreglo_palabras_label);
            let form_guardar_registro = document.createElement('form')
            form_guardar_registro.classList.add("alert", "alert-primary")
            let label_nombre = document.createElement("label")
            label_nombre.textContent =  arreglo_palabras_label[0]+" :"
            let input_nombre = document.createElement("input")
            input_nombre.setAttribute("id", "input_nombre")
            input_nombre.setAttribute("value", nombreUsuario)
            let label_telefono = document.createElement("label")
            label_telefono.textContent =  arreglo_palabras_label[1]+" :"
            let input_telefono = document.createElement("input")
            input_telefono.setAttribute("id", "input_telefono")
            input_telefono.setAttribute("value", telefono_texto)
            let label_correo = document.createElement("label")
            label_correo.textContent =  arreglo_palabras_label[2]+" :"
            let input_correo = document.createElement("input")
            input_correo.setAttribute("id", "input_correo")
            input_correo.setAttribute("value", correo_texto)
            let boton_sutmit = document.createElement("button")
            boton_sutmit.classList.add("btn", "btn-primary","m-1")
            boton_sutmit.setAttribute("id", "boton_sutmit")
            boton_sutmit.textContent = "Enviar"
            let br = []
            for (let index = 0; index < 11; index++) {
                br[index]= document.createElement("br")
            }
            
            form_guardar_registro.append(label_nombre)
            form_guardar_registro.append(br[0])
            form_guardar_registro.append(input_nombre)
            form_guardar_registro.append(br[1])
            form_guardar_registro.append(label_telefono)
            form_guardar_registro.append(br[2])
            form_guardar_registro.append(input_telefono)
            form_guardar_registro.append(br[3])
            form_guardar_registro.append(label_correo)
            form_guardar_registro.append(br[6])
            form_guardar_registro.append(input_correo)
            form_guardar_registro.append(br[7])
            form_guardar_registro.append(boton_sutmit)
            form_guardar_registro.append(br[10])
            chat.append(form_guardar_registro)
            boton_sutmit.addEventListener("click",()=>{
                crearRegistros(input_nombre.value,input_telefono.value,input_correo.value)
            })
        }
    })
    .catch(error => {
        console.log(error);
    })
}





let audioContext = null;
let recognizer = null;

// Función para iniciar el AudioContext después de una interacción del usuario
function iniciarAudioContext() {
    // Verificar si el contexto ya está creado para evitar errores
    if (audioContext === null) {
        // Crear el contexto de audio
        audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Configuración de reconocimiento de voz
        const speechConfig = SpeechSDK.SpeechConfig.fromSubscription("c57f563494ad41df92dfbe31871ad5cc", "eastus");

        // Configura el idioma deseado (por ejemplo, español)
        speechConfig.speechRecognitionLanguage = "es-ES"; // Cambia a tu idioma deseado

        const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

        // Crear el reconocedor de voz
        recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
        

        recognizer.recognized = (s, e) => {
            if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
                console.log(e.result.text);
                texto_de_voz = e.result.text
                traducir(texto_de_voz,"entidad") 
            }
        };

        recognizer.canceled = (s, e) => {
            console.log(`CANCELED: Reason=${e.reason}`);

            if (e.reason === SpeechSDK.CancellationReason.Error) {
                console.log(`CANCELED: ErrorCode=${e.ErrorCode}`);
                console.log(`CANCELED: ErrorDetails=${e.ErrorDetails}`);
            }
        };
    }
}

// Agregar un evento de clic al botón para iniciar el reconocimiento
document.getElementById('boton_microfono_star').addEventListener('click', () => {
    iniciarAudioContext();

    // Ocultar el botón de inicio y mostrar el botón de detener
    document.getElementById('boton_microfono_star').style.display = 'none';
    document.getElementById('boton_microfono_end').style.display = 'block';

    // Iniciar el reconocimiento de voz continuo
    recognizer.startContinuousRecognitionAsync();
});

// Agregar un evento de clic al botón para detener el reconocimiento
document.getElementById('boton_microfono_end').addEventListener('click', () => {
    // Detener el reconocimiento de voz
    recognizer.stopContinuousRecognitionAsync();

    // Ocultar el botón de detener y mostrar el botón de inicio
    document.getElementById('boton_microfono_end').style.display = 'none';
    document.getElementById('boton_microfono_star').style.display = 'block';
});


function top_clasificados() {
    fetch("http://127.0.0.1:8000/top-clasificados")
    .then(res => res.json())
    .then(data =>{
        let label_container = document.createElement("div");
        label_container.classList.add("alert", "alert-secondary", "text-center")
        let icono = document.createElement("i");
        icono.classList.add("fa-solid","fa-ranking-star")
        let label_chat_estadisticas_icono = document.createElement("div"); 
        label_chat_estadisticas_icono.classList.add("alert", "alert-primary", "text-center")
        label_chat_estadisticas_icono.append(icono)
        let label_chat_estadisticas_1 = document.createElement("div");
        label_chat_estadisticas_1.classList.add("alert", "alert-primary")
        let label_chat_estadisticas_2 = document.createElement("div");
        label_chat_estadisticas_2.classList.add("alert", "alert-primary")
        let label_chat_estadisticas_3 = document.createElement("div");
        label_chat_estadisticas_3.classList.add("alert", "alert-primary")
        label_chat_estadisticas_1.textContent += data.clasificados[0][0]+" - Cant:"+data.clasificados[0][1]
        label_chat_estadisticas_2.textContent += data.clasificados[1][0]+" - Cant:"+data.clasificados[1][1]
        label_chat_estadisticas_3.textContent += data.clasificados[2][0]+" - Cant:"+data.clasificados[2][1]
        label_container.append(label_chat_estadisticas_icono)
        label_container.append(label_chat_estadisticas_1)
        label_container.append(label_chat_estadisticas_2)
        label_container.append(label_chat_estadisticas_3)
        chat.append(label_container)
        console.log(data.clasificados[0]);
    })
    .catch(error =>{
        console.log(error);
    })
}
