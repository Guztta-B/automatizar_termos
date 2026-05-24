async function gerarPDF() {
  const dados = {
    data: document.getElementById("data").value,
    nome: document.getElementById("nome").value,
    snteclado: document.getElementById("snteclado").value,
    snheadset: document.getElementById("snheadset").value,
    snote: document.getElementById("snote").value,
    cpf: document.getElementById("cpf").value
  };

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