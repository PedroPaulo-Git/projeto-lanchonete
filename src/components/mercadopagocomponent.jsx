import React, { useEffect } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

const MercadoPagoComponent = () => {
    useEffect(() => {
      initMercadoPago('APP_USR-d5f7862a-ca34-4f79-95f8-53e9ad4308b1', { locale: 'pt-BR' });
    }, []);

    return (
      <div>
        <Wallet initialization={{preferenceId: '<PREFERENCE_ID>'}} />
      </div>
    );
};

export default MercadoPagoComponent;