import React, { useState, useEffect, useCallback } from 'react';


import axios from 'axios';

function TaxCalculationForm() {
  const [surname, setSurname] = useState('');
  const [taxAmount, setTaxAmount] = useState(null);
  const [installments, setInstallments] = useState('');
  const [paymentPlan, setPaymentPlan] = useState([]);

  const calculateTax = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`http://45.55.134.230:8593/apiV1/jsonAll?Apellido=${encodeURIComponent(surname)}`);
      setTaxAmount(response.data.ImpuestoCalculado);
    } catch (error) {
      console.error('no se puede procesar la respuesta:', error);
    }
  };

  const calculatePaymentPlan = useCallback(() => {
    if (!installments) return;
  
    const installmentAmount = taxAmount / installments;
    const newPaymentPlan = Array.from({ length: installments }, (_, index) => ({
      installmentNumber: index + 1,
      installmentAmount: installmentAmount.toFixed(2),
    }));
  
    setPaymentPlan(newPaymentPlan);
  }, [taxAmount, installments]); 
  
  
  useEffect(() => {
    calculatePaymentPlan();
  }, [calculatePaymentPlan]); 
  

  return (
    <div>
      <h1>Calcula el impuesto de tu vehiculo</h1>
      <form onSubmit={calculateTax}>
        <label htmlFor="apellido">Ingresa tu apellido:</label>
        <input
          type="text"
          id="apellido"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          required
        />
        <button type="submit">Calcular Impuesto</button>
      </form>

      {taxAmount !== null && (
        <div>
          <p>El impuesto Calculado para el cliente es: "{surname}" es {taxAmount}bs.</p>
          <label htmlFor="installments">Cuantas Cuotas decea solicitar:</label>
          <input
            type="number"
            id="installments"
            value={installments}
            onChange={(e) => setInstallments(e.target.value)}
            min="1"
            required
          />
          <table>
            <thead>
              <tr>
                <th>Cuota #</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {paymentPlan.map((plan) => (
                <tr key={plan.installmentNumber}>
                  <td>{plan.installmentNumber}</td>
                  <td>{plan.installmentAmount}bs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TaxCalculationForm;
