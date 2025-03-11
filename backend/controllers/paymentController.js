import { Payment, MercadoPagoConfig } from 'mercadopago';
import { v4 as uuidv4 } from 'uuid';

// Configuração do Mercado Pago com o token de acesso
const client = new MercadoPagoConfig({ accessToken: '<ACCESS_TOKEN>' });

// Controller para processar o pagamento
export const processPayment = async (req, res) => {
  try {
    // Gerar o UUID para o idempotencyKey
    const idempotencyKey = uuidv4();
    
    // Criar o pagamento
    const payment = await client.payment.create({
      body: { 
        transaction_amount: req.body.transaction_amount,
        token: req.body.token,
        description: req.body.description,
        installments: req.body.installments,
        payment_method_id: req.body.paymentMethodId,
        issuer_id: req.body.issuer,
        payer: {
          email: req.body.email,
          identification: {
            type: req.body.identificationType,
            number: req.body.identificationNumber,
          },
        },
      },
      requestOptions: { idempotencyKey }, // Passando o idempotencyKey gerado
    });

    // Retornar o resultado do pagamento
    res.status(200).json(payment);
  } catch (error) {
    console.error('Erro no pagamento:', error);
    res.status(500).json({ error: 'Erro no processamento do pagamento' });
  }
};
