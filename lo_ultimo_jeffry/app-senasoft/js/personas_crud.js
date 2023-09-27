function traerRegistosPersonas() {
    fetch(`http://127.0.0.1:8000/usuarios`)
    .then(res => res.json())
    .then(data =>{
        console.log(data);
    })
    .catch(error =>{
        console.log(error);
    })
}




traerRegistosPersonas()