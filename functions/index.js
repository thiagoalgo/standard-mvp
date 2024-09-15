/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const axios = require('axios');

exports.createCheckout = onRequest((request, response) => {
  if (request.method !== 'POST') {
    response.sendStatus(405)
    return
  }

  axios
  .request({
    method: 'POST',
    url: 'https://sandbox.api.pagseguro.com/checkouts',
    headers: {
      accept: '*/*',
      Authorization: 'Bearer 9e6d20d5-fba1-4891-850d-62586a321fcf9b40aa804de0af13b0f87885521402c632cb-af94-4746-bca2-90880ba6eaf4',
      'Content-type': 'application/json'
    },
    data: {
      customer: {
        phone: {country: '55', area: '48', number: '998421117'},
        name: 'Thiago Alves Goulart',
        email: 'thiagoalgo@gmail.com',
        tax_id: '04076073908'
      },
      reference_id: 'order-id-123456',
      customer_modifiable: true,
      items: [
        {
          image_url: 'https://cdn-repercussaoparanhana.nuneshost.com/wp-content/uploads/2022/03/lousas-1140x570.jpg',
          quantity: 1,
          unit_amount: 19997,
          name: 'Curso Standard',
          reference_id: '123456',
          description: 'O melhor curso do Brasil'
        }
      ],
      soft_descriptor: 'Standard',
      additional_amount: 0,
      discount_amount: 0,
      payment_methods: [{type: 'CREDIT_CARD'}, {type: 'DEBIT_CARD'}, {type: 'BOLETO'}, {type: 'PIX'}],
      payment_methods_configs: [
        {
          type: 'CREDIT_CARD',
          config_options: [{option: 'INSTALLMENTS_LIMIT', value: '1'}]
        }
      ],
      redirect_url: 'https://www.google.com'
    }
  })
  .then(function (resp) {
    console.log(resp.data);
    response.send(resp.data)
  })
  .catch(function (error) {
    console.error(error);
    response.json(error)
  })

})

exports.paymentNotificarion = onRequest((request, response) => {
  console.log(request.data)
  response(request.data)
})