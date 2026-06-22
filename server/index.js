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
      smonitor,
      snote,
      headset_simounao,
      monitor_sim,
      headset_sim
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
    const caminhoPDF = path.join(__dirname, "assets", "termo final.pdf");

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
//Configuração do sim ou nao no caso X 
function desenharX(
  pagina,
  x,
  y,
  cor = rgb(0.75, 0.22, 0.17)
) {
  pagina.drawLine({
    start: { x, y },
    end: { x: x + 12, y: y + 12 },
    color: cor,
    thickness: 1.5
  });

  pagina.drawLine({
    start: { x: x + 12, y },
    end: { x, y: y + 12 },
    color: cor,
    thickness: 1.5
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

//MONITOR
    page2.drawText(smonitor || "", {
      x: 230,
      y: 333.5,
      size: 9,
      font,
      color: rgb(0.18, 0.45, 0.71)
    });

// CPF
    escrever(cpf, 170, 401, 12);
    
    // NOTEBOOK
     // alterei posição x caso o erro seja isso voltar para 662
    page.drawText(snote || "", {
      x: 663.5,
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

//POSIÇÂO X DO HEADSET
if (headset_simounao === "sim") {
  desenharX(page2, 300, 470, rgb(0.18, 0.45, 0.71));
} else {
  desenharX(page2, 350, 470, rgb(0.18, 0.45, 0.71));
}

// POSIÇÂO X DO MONITOR 
if (monitor_sim === "sim") {
  desenharX(page2, 300, 330, rgb(0.18, 0.45, 0.71));
} else {
  desenharX(page2, 350, 330, rgb(0.18, 0.45, 0.71));
}

//POSIÇÂO X DO TECLADO
if (req.body.recebe_teclado === "sim") {
  desenharX(page, 650, 90,rgb(0.18, 0.45, 0.71));
} else {
  desenharX(page, 700, 90,rgb(0.18, 0.45, 0.71));
}
//POSIÇÂO X DO MONITOR

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

