import React, { useState } from 'react';

const PaymentForm = () => {
  const [paymentMethod, setPaymentMethod] = useState('credit');

  return (
    <div className="max-w-5xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Pago</h2>
      <p className="text-gray-600 mb-4">Elige tu método de pago:</p>

      {/* Métodos de pago */}
      <div className="flex gap-6 mb-8">
        <button
          onClick={() => setPaymentMethod('credit')}
          className={`flex-1 border-2 rounded-lg py-4 px-6 text-center ${
            paymentMethod === 'credit' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
              alt="Tarjeta"
              className="h-6"
            />
            <span className="font-semibold text-gray-700">Tarjeta de crédito</span>
          </div>
        </button>

        <button
          onClick={() => setPaymentMethod('paypal')}
          className={`flex-1 border-2 rounded-lg py-4 px-6 text-center ${
            paymentMethod === 'paypal' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'
          }`}
        >
          <div className="flex justify-center items-center gap-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              alt="PayPal"
              className="h-6"
            />
            <span className="font-semibold text-gray-700">PayPal</span>
          </div>
        </button>

        <button
          onClick={() => setPaymentMethod('amazon')}
          className={`flex-1 border-2 rounded-lg py-4 px-6 text-center ${
            paymentMethod === 'amazon' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
          }`}
        >
          <div className="flex justify-center items-center gap-2">
            <img
              src="https://cdn.worldvectorlogo.com/logos/amazon-pay.svg"
              alt="Amazon Pay"
              className="h-6"
              onError={(e) => {
                e.currentTarget.src =
                  'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg';
              }}
            />
            <span className="font-semibold text-gray-700">Amazon Pay</span>
          </div>
        </button>
      </div>

      {/* Formulario de facturación y tarjeta */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Información de facturación */}
        <div>
          <h3 className="text-lg font-semibold mb-4">1. Información de facturación</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nombre completo"
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            <input
              type="text"
              placeholder="Dirección"
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Ciudad"
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
              <input
                type="text"
                placeholder="Código postal"
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>
            <input
              type="text"
              placeholder="País"
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
          </div>
        </div>

        {/* Información de tarjeta */}
        <div>
          <h3 className="text-lg font-semibold mb-4">2. Información de tarjeta</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nombre del titular"
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            <input
              type="text"
              placeholder="Número de tarjeta"
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Mes exp."
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
              <input
                type="text"
                placeholder="Año exp."
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
              <input
                type="text"
                placeholder="CVC"
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-between mt-10">
        <button className="text-blue-600 hover:underline">Volver a tienda</button>
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Proceder al pago
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;
