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
      snmouse,
      snheadset,
      smonitor,
      snote,
      headset_simounao,
      monitor_sim,
      headset_sim,
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
// Configuração do X
function desenharX(
  pagina,
  x,
  y,
  cor = rgb(0.75, 0.22, 0.17),
  tamanho = 12
) {
  pagina.drawLine({
    start: { x, y },
    end: {
      x: x + tamanho,
      y: y + tamanho
    },
    color: cor,
    thickness: 1.5
  });

  pagina.drawLine({
    start: {
      x: x + tamanho,
      y
    },
    end: {
      x,
      y: y + tamanho
    },
    color: cor,
    thickness: 1.5
  });
}
    // DATA
page.drawText(dataBR || "", {
      x: 95,
      y: 492,
      size: 10,
      font,
      color: rgb(0, 0, 0)
    });
    // NOME
    escrever(nome, 205, 404.6, 12);

//MONITOR
    page2.drawText(smonitor || "", {
      x: 225,
      y: 305.5,
      size: 9,
      font,
      color: rgb(0.18, 0.45, 0.71)
    });

// CPF
    escrever(cpf, 168, 390.7, 12);
     // alterei posição x caso o erro seja isso voltar para 662
    page.drawText(snote || "", {
      x: 633.5,
      y: 432.5,
      size: 9,
      font,
      color: rgb(0.18, 0.45, 0.71)
    });


 // mouse
    page.drawText(snmouse || "", {
      x: 635,
      y: 80,
      size: 9,
      font,
      color: rgb(0.18, 0.45, 0.71)
    });


    // TECLADO
    page.drawText(snteclado || "", {
      x: 635,
      y: 155.5,
      size: 9,
      font,
      color: rgb(0.18, 0.45, 0.71)
    });

    // HEADSET - PÁGINA 2
    page2.drawText(snheadset || "", {
      x: 224,
      y: 445,
      size: 9,
      font,
      color: rgb(0.18, 0.45, 0.71)
    });

// HEADSET x
if (headset_simounao === "sim") {
  desenharX(page2, 225.3, 487.5, rgb(0.18, 0.45, 0.71), 6.5);
} else if (headset_simounao === "nao") {
  desenharX(page2, 271.3, 487.5, rgb(0.18, 0.45, 0.71), 6.5);
}


// MONITOR x
if (monitor_sim === "sim") {
  desenharX(page2, 224, 348, rgb(0.18, 0.45, 0.71), 6.5);
} else if (monitor_sim === "nao") {
  desenharX(page2, 267, 348, rgb(0.18, 0.45, 0.71), 6.5);
}


//MOUSE x
if (req.body.recebe_mouse === "sim") {
   desenharX(page, 617.4, 122.5, rgb(0.18, 0.45, 0.71), 6.5);
} else if (req.body.recebe_mouse === "nao") {
  desenharX(page, 664.4, 122.55, rgb(0.18, 0.45, 0.71), 6.5);
}


// TECLADO x
if (req.body.recebe_teclado === "sim") {
  desenharX(page, 617.4, 197, rgb(0.18, 0.45, 0.71), 6.5);
} else if (req.body.recebe_teclado === "nao") {
  desenharX(page, 657, 197, rgb(0.18, 0.45, 0.71), 6.5);
}  




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

