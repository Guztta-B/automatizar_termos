const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/gerar", async (req, res) => {
  try {

    const {
      data,
      nome,
      cpf,
      snteclado,
      snheadset,
      snote
    } = req.body; 

    let dataBR = "";

if (data) {
  const partes = data.split("-");
  dataBR = `${partes[2]}/${partes[1]}/${partes[0]}`;
}

    // CAMINHO DO PDF
    const caminhoPDF = path.join(__dirname, "assets", "Termo_Final.pdf");
    // LÊ PDF
    const pdfBytes = fs.readFileSync(caminhoPDF);

    // ABRE PDF
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // PEGA PRIMEIRA PAGINA
    const pages = pdfDoc.getPages();
    const page = pages[0];

    // TAMANHO DA PAGINA
    console.log(page.getWidth());
    console.log(page.getHeight());

    // FONTE
   const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // FUNÇÃO ESCREVER
    function escrever(texto, x, y, size = 10) {

      page.drawText(texto || "", {
        x,
        y,
        size,
        font,
        color: rgb(0, 0, 0)
      });

    }

// PÁGINA 1
escrever(dataBR, 100, 502, 12);

// NOME
escrever(nome, 205, 415, 12);

// CPF
escrever(cpf, 170, 401,12);

// NOTEBOOK
page.drawText(snote || "", { 
  x: 662,
  y: 474.5,
  size: 9,
  font,
  color: rgb(0.18, 0.45, 0.71)
});

// TECLADO
page.drawText(snteclado || "" , { 
  x: 635,
  y: 89,
  size: 9,
  font,
  color: rgb(0.18, 0.45, 0.71)
});


// headset
const page2 = pages[1];

page2.drawText(snheadset || "", {
  x: 224,
  y: 472,
  size: 9,
  font,
  color: rgb(0.18, 0.45, 0.71)
});

    // PDF FINAL
    const pdfFinal = await pdfDoc.save();

    // RETORNO
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=termo.pdf"
    );

    res.send(Buffer.from(pdfFinal));

  } catch (erro) {

    console.error(erro);
    res.status(500).send("Erro ao gerar PDF");

  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
