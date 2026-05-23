const express = require("express");
const cors = require("cors");
const PDFDocument = require("pdfkit");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/gerar", async (req, res) => {
  try {
    const {
      data,
      nome,
      snteclado,
      snheadset,
      snote,
      cpf
    } = req.body;

    const doc = new PDFDocument({
      size: "A4",
      margin: 50
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=termo.pdf"
    );

    doc.pipe(res);

    // TÍTULO
    doc
      .fontSize(22)
      .fillColor("#5c1020")
      .text("HELP ESQUECE - TERMOS", {
        align: "center"
      });

    doc.moveDown(2);

    // CAMPOS
    doc
      .fontSize(13)
      .fillColor("black");

    doc.text(`Data: ${data || "Não informado"}`);
    doc.moveDown();

    doc.text(`Nome: ${nome || "Não informado"}`);
    doc.moveDown();

    doc.text(`SN Teclado: ${snteclado || "Não informado"}`);
    doc.moveDown();

    doc.text(`SN Headset: ${snheadset || "Não informado"}`);
    doc.moveDown();

    doc.text(`SN Notebook: ${snote || "Não informado"}`);
    doc.moveDown();

    doc.text(`CPF: ${cpf || "Não informado"}`);

    doc.moveDown(5);

    // ASSINATURA
    doc.text(
      "________________________________________",
      {
        align: "center"
      }
    );

    doc.text("Assinatura", {
      align: "center"
    });

    doc.end();

  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao gerar PDF");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});