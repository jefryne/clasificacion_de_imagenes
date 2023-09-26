let idioma_detectado = "it"

function traducir(texto_traducir, idioma_detectado) {
    
    fetch("https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to="+idioma_detectado+"&to=fr&to=zh",{
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
    })
    .catch(error => {
        console.log(error);
    })
}

traducir("pato",idioma_detectado)