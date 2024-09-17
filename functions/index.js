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

  const data = {
    customer_modifiable: true,
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

  data.reference_id = request.body.reference_id
  data.customer = request.body.customer
  data.items = request.body.items

  axios
  .request({
    method: 'POST',
    url: 'https://sandbox.api.pagseguro.com/checkouts',
    headers: {
      accept: '*/*',
      Authorization: 'Bearer 9e6d20d5-fba1-4891-850d-62586a321fcf9b40aa804de0af13b0f87885521402c632cb-af94-4746-bca2-90880ba6eaf4',
      'Content-type': 'application/json'
    },
    data: data
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

exports.paymentNotification = onRequest((request, response) => {
  if (request.method !== 'POST') {
    response.sendStatus(405)
    return
  }

  if (request.body.charges[0]?.status == 'PAID') {
    // aqui cadastrar o usuário no firebase
    // enviar email com dados de acesso
    console.log(request.body.charges[0]?.status)
    response.sendStatus(200)
    return
  }
  
  response.sendStatus(500)
})