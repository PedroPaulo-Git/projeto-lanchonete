import express from "express";
import { MercadoPagoConfig, Preference } from "mercadopago"; // ✅ Correção aqui
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
// const bodyParser = require("body-parser");
import bodyParser from "body-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
}); // ✅ Melhor usar do .env

app.post("/create-preference", async (req, res) => {
    try {
      const { title, unit_price } = req.body;
  
      if (!title || !unit_price) {
        return res.status(400).json({ error: "Nome e preço são obrigatórios." });
      }
  
      const preference = new Preference(client);
  
      const response = await preference.create({
        body: {
          items: [
            {
              title: title,
              quantity: 1,
              unit_price: parseFloat(unit_price), // Convertendo para número
            },
          ],
        },
      });
  
      return res.json({
        id: response.id, 
        init_point: response.init_point, 
      });
  
    } catch (error) {
      console.error("Erro ao criar preferência:", error);
      res.status(500).json({ error: "Erro ao criar pagamento" });
    }
  });
  app.use(bodyParser.json());

  let paymentStatus = "pending"; // Estado inicial do pagamento
  
  // Endpoint para receber Webhooks do Mercado Pago
  app.post("/webhook", (req, res) => {
    console.log("Webhook recebido:", req.body);
  
    // Verifica se a notificação é sobre atualização de pagamento
    if (req.body.action === "payment.updated" && req.body.data && req.body.data.id) {
      const paymentId = req.body.data.id;
      console.log(paymentId)
      console.log(req.body)
  
      // Consulta o status do pagamento na API do Mercado Pago
      axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      })
      .then((response) => {
        paymentStatus = response.data.status;
        console.log("Status atualizado:", paymentStatus);
      })
      .catch((error) => console.error("Erro ao buscar pagamento:", error));
      
    }
  
    res.sendStatus(200); // Responde ao Mercado Pago
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
  
      return res.status(400).json({ error: "Erro ao cancelar pedido. Status do pagamento não permite cancelamento." });
    } catch (error) {
      console.error("Erro ao cancelar pedido:", error.response ? error.response.data : error.message);
      res.status(500).json({ error: "Erro ao processar o cancelamento." });
    }
  });
  
  
  // Endpoint para consultar status do pagamento no frontend
  app.get("/payment-status", (req, res) => {
    const { paymentId } = req.query; // Captura o paymentId da query string
  
    if (!paymentId) {
      return res.status(400).json({ error: "ID do pagamento é obrigatório." });
    }
  
    res.json({ status: paymentStatus });
  });
console.log("Access Token:", process.env.MERCADO_PAGO_ACCESS_TOKEN);

























app.post("/create-payment", async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Valor inválido para pagamento" });
  }

  try {
    const paymentData = {
      transaction_amount: amount,
      payment_method_id: "pix",
     "payer": {
  "email": "TESTUSER2050655442@testuser.com"
}
    };

    const response = await axios.post(
      "https://api.mercadopago.com/v1/payments",
      paymentData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      }
    );

    return res.json({
      qr_code: response.data.point_of_interaction.transaction_data.qr_code,
      qr_code_base64:
        response.data.point_of_interaction.transaction_data.qr_code_base64,
      copia_e_cola:
        response.data.point_of_interaction.transaction_data.ticket_url,
    });
  } catch (error) {
    console.error("Erro ao criar pagamento:", error.response?.data || error);
    res.status(500).json({ error: "Erro ao processar pagamento" });
  }
});

app.listen(5000, () => console.log("Servidor rodando na porta 5000"));
