import express from "express";
import { MercadoPagoConfig, Preference } from "mercadopago"; // ✅ Correção aqui
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
// const bodyParser = require("body-parser");
import bodyParser from "body-parser";
import mercadopago from "mercadopago";
import { v4 as uuidv4 } from "uuid";
//import { processPayment } from './controllers/paymentController';

import { Payment } from "mercadopago";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
}); // ✅ Melhor usar do .env

// Rota para processar o pagamento
app.post("/process_payment", async (req, res) => {
  try {
    const { payment_method_id } = req.body;
    console.log("Dados recebidos no backend:", req.body);
    const paymentData = {
      transaction_amount: req.body.transaction_amount,
      token: req.body.token,
      description: req.body.description,
      installments: req.body.installments,
      payment_method_id: payment_method_id,
      issuer_id: req.body.issuer_id,
      payer: {
        email: req.body.payer.email,
        identification: {
          type: req.body.payer.identification.type,
          number: req.body.payer.identification.number,
        },
      },
    };

    // Gerar um idempotencyKey único
    const idempotencyKey = req.headers["X-Idempotency-Key"] || uuidv4();

    // Criar pagamento no Mercado Pago
    const payment = new Payment(client);
    const paymentResponse = await payment.create({
      body: paymentData,
      requestOptions: { idempotencyKey },
    });

    console.log("Resposta do Mercado Pago:", paymentResponse);

    if (paymentResponse.status >= 400 || !paymentResponse.id) {
      throw new Error(`Pagamento recusado: ${paymentResponse.status}`);
    }

    // Verifica se o pagamento é via Pix
    if (payment_method_id === "pix") {
      const qrCodeText = paymentResponse.point_of_interaction?.transaction_data?.qr_code;
      let qrCodeBase64 = null;

      if (qrCodeText) {
        qrCodeBase64 = await gerarQRCodeBase64(qrCodeText);
      }

      return res.json({
        status: paymentResponse.status,
        id: paymentResponse.id,
        status_detail: paymentResponse.status_detail,
        qr_code: qrCodeText,
        qr_code_base64: qrCodeBase64,
      });
    }

    // Se for cartão, retorna apenas os dados normais do pagamento
    res.json({
      status: paymentResponse.status,
      id: paymentResponse.id,
      status_detail: paymentResponse.status_detail,
    });
  } catch (error) {
    console.error("Erro detalhado:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });
    res.status(500).json({
      error: error.message || "Erro no processamento",
      details: error.response?.data,
    });
  }
});

// Função para converter QR Code para Base64
async function gerarQRCodeBase64(qrText) {
  const qrResponse = await axios.get(
    `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrText)}&size=200x200`,
    { responseType: "arraybuffer" }
  );
  return Buffer.from(qrResponse.data).toString("base64");
}


// app.post("/create-preference", async (req, res) => {
//   try {
//     const { title, unit_price } = req.body;

//     if (!title || !unit_price) {
//       return res.status(400).json({ error: "Nome e preço são obrigatórios." });
//     }

//     const preference = new Preference(client);

//     const response = await preference.create({
//       body: {
//         items: [
//           {
//             title: title,
//             quantity: 1,
//             unit_price: parseFloat(unit_price), // Convertendo para número
//           },
//         ],
//         sandbox_init_point: true,
//       },
//     });

//     return res.json({
//       id: response.id,
//       init_point: response.init_point,
//     });
//   } catch (error) {
//     console.error("Erro ao criar preferência:", error);
//     res.status(500).json({ error: "Erro ao criar pagamento" });
//   }
// });

// app.use(bodyParser.json());

// let paymentStatus = "pending"; // Estado inicial do pagamento

// Endpoint para receber Webhooks do Mercado Pago
app.post("/webhook", async (req, res) => {
  console.log("Notificação recebida:", req.body);

  // Verifica se a notificação é sobre atualização de pagamento
  try {
    console.log("Notificação recebida:", req.body);

    const paymentId = req.body.data.id;
    

    if (!paymentId) {
      return res.status(400).send("ID do pagamento não encontrado");
    }

    const payment = new Payment(client);
    const paymentDetails = await payment.get({ id: paymentId });

    console.log("Detalhes do pagamento:", paymentDetails);

    if (paymentDetails.status === "approved") {
      // Aqui você pode salvar no banco de dados que o pagamento foi concluído
      console.log("Pagamento aprovado:", paymentDetails);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Erro no webhook:", error);
    res.sendStatus(500);
  }
});






app.post("/cancel-order", async (req, res) => {
  try {
    const { paymentId } = req.body; // Recebe o ID do pagamento ou pedido
    console.log(paymentId); // Verifique se o paymentId está correto

    if (!paymentId) {
      return res.status(400).json({ error: "ID de pagamento é obrigatório." });
    }

    // Chama a API Mercado Pago para cancelar o pagamento
    const response = await axios.post(
      `https://api.mercadopago.com/v1/payments/${paymentId}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      }
    );

    // Verifique o que o Mercado Pago retorna
    if (response.data.status === "cancelled") {
      return res.json({ message: "Pedido cancelado com sucesso." });
    }

    return res
      .status(400)
      .json({
        error:
          "Erro ao cancelar pedido. Status do pagamento não permite cancelamento.",
      });
  } catch (error) {
    console.error(
      "Erro ao cancelar pedido:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Erro ao processar o cancelamento." });
  }
});

// Endpoint para consultar status do pagamento no frontend
app.get("/payment_status", async (req, res) => {
  try {
    const { paymentId } = req.query;
    console.log("Recebido paymentId:", paymentId);

    if (!paymentId) return res.status(400).send("ID do pagamento é obrigatório");

    const payment = new Payment(client);
    const paymentDetails = await payment.get({ id: paymentId });

    res.json({ status: paymentDetails.status });
  } catch (error) {
    console.error("Erro ao verificar status:", error);
    res.status(500).json({ error: "Erro ao verificar status do pagamento" });
  }
});

console.log("Access Token:", process.env.MERCADO_PAGO_ACCESS_TOKEN);

app.listen(5000, () => console.log("Servidor rodando na porta 5000"));
