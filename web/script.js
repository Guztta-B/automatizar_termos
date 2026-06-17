async function gerarPDF() {
  const dados = {
    data: document.getElementById("data").value,
    nome: document.getElementById("nome").value,
    snteclado: document.getElementById("snteclado").value,
    snheadset: document.getElementById("snheadset").value,
    snote: document.getElementById("snote").value,
    cpf: document.getElementById("cpf").value,
    smonitor: document.getElementById("smonitor").value,

  emailColaborador:
document.getElementById("emailColaborador").value,

emailResponsavel:
document.getElementById("emailResponsavel").value,
  };

    //Aqui deve estar: https://termos-1gbi.onrender.com/gerar 
    //Para conectar servidor final, em caso de testes coloca
    //http://localhost:3000/gerar
  const resposta = await fetch("https://termos-1gbi.onrender.com/gerar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dados)
  });

  const blob = await resposta.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "termo.pdf";
  a.click();
}
const checkboxEmail = document.getElementById("enviarEmail");
const boxEmail = document.getElementById("boxEmail");
const boxEmailResponsavel = document.getElementById("boxEmailResponsavel");

checkboxEmail.addEventListener("change", () => {

  if (checkboxEmail.checked) {

    boxEmail.style.display = "flex";
    boxEmailResponsavel.style.display = "flex";

  } else {

    boxEmail.style.display = "none";
    boxEmailResponsavel.style.display = "none";

    document.getElementById("emailColaborador").value = "";
    document.getElementById("emailResponsavel").value = "";

  }

});