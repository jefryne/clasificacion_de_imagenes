let tabla_body = document.getElementById("tabla_body")


function traerRegistosPersonas() {
    fetch(`http://127.0.0.1:8000/usuarios`)
    .then(res => res.json())
    .then(data =>{
        console.log(data.registros);
        data.registros.forEach(element => {
            let tr = document.createElement("tr")
            let td = document.createElement("td")
            td.textContent = element[0]
            let td_1 = document.createElement("td")
            td_1.textContent = element[1]
            let td_2 = document.createElement("td")
            td_2.textContent = element[2]
            let td_3= document.createElement("td")
            td_3.textContent = element[3]
            tr.append(td)
            tr.append(td_1)
            tr.append(td_2)
            tr.append(td_3)
            tabla_body.append(tr)
        });
    })
    .catch(error =>{
        console.log(error);
    })
}




traerRegistosPersonas()