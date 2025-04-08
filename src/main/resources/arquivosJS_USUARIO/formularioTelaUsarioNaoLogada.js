document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("form").addEventListener("submit", function (event) {
        event.preventDefault();



        let email = document.getElementById("email").value.trim();
        let senha = document.getElementById("senha").value.trim();

        const user = {
            email: email,
            senha: senha,
        };

        fetch("http://localhost:8080/usuarios/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Email ou senha inválidos!");
                }
                return response.json();
            })
            .then(data => {
                console.log(typeof(data))
                // alert(message);
                if (data.grupo === "admin"||data.grupo === "admin") {
                    window.location.href = "menuAdm.html";
                } else if (data.grupo === "Estoquista"||data.grupo === "estoquista") {
                    window.location.href = "menuEstoquista.html";
                } else {
                    alert("Grupo de usuário não reconhecido.");
                }
            })
            .catch(error => {
                alert(error.message);
            });
    });
});