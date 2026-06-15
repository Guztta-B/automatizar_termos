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

  const ano = partes[0];
  const mes = partes[1];
  const dia = partes[2];

  const meses = {
    "01": "janeiro",
    "02": "fevereiro",
    "03": "março",
    "04": "abril",
    "05": "maio",
    "06": "junho",
    "07": "julho",
    "08": "agosto",
    "09": "setembro",
    "10": "outubro",
    "11": "novembro",
    "12": "dezembro"
  };

  dataBR = `${dia} de ${meses[mes]} de ${ano}`;
}

    // CAMINHO DO PDF
    const caminhoPDF = path.join(__dirname, "assets", "Termo_Final.pdf");

    // LÊ PDF
    const pdfBytes = fs.readFileSync(caminhoPDF);

    // ABRE PDF
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // PEGA AS PÁGINAS
    const pages = pdfDoc.getPages();
    const page = pages[0];
    const page2 = pages[1];

    // FONTE
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // FUNÇÃO ESCREVER NA PÁGINA 1
    function escrever(texto, x, y, size = 10) {
      page.drawText(texto || "", {
        x,
        y,
        size,
        font,
        color: rgb(0, 0, 0)
      });
    }

    // DATA
page.drawText(dataBR || "", {
      x: 95,
      y: 503,
      size: 10,
      font,
      color: rgb(0, 0, 0)
    });
    // NOME
    escrever(nome, 205, 415, 12);

    // CPF
    escrever(cpf, 170, 401, 12);

    // NOTEBOOK
     // alterei posição x caso o erro seja isso voltar para 662
    page.drawText(snote || "", {
      x: 664,
      y: 474.5,
      size: 9,
      font,
      color: rgb(0.18, 0.45, 0.71)
    });

    // TECLADO
    page.drawText(snteclado || "", {
      x: 635,
      y: 89,
      size: 9,
      font,
      color: rgb(0.18, 0.45, 0.71)
    });

    // HEADSET - PÁGINA 2
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