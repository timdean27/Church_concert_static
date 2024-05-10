import React, { useState, useEffect ,useMemo } from "react";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function Message({ content }) {
  return <p>{content}</p>;
}

const PaymentForm = ({ premiumQuantity, standardQuantity, studentQuantity, totalPrice }) => {
  const [initialOptions, setInitialOptions] = useState({
    "client-id": import.meta.env.VITE_REACT_APP_PAYPAL_CLIENT_ID,
    "enable-funding": "venmo,card",
    "disable-funding": "paylater",
    "data-sdk-integration-source": "integrationbuilder_sc",
  });
  
  useEffect(() => {
    console.log("initialOptions", initialOptions);
  }, [initialOptions]);

  const [message, setMessage] = useState("");
  const [FINALIZEDPurchaseData, setFINALIZEDPurchaseData] = useState(null);
  const BASE_URL_PAYPAL = import.meta.env.VITE_REACT_APP_BASE_URL_PAYPAL;

  useEffect(() => {
    console.log("FINALIZEDPurchaseData", FINALIZEDPurchaseData);
  }, [FINALIZEDPurchaseData]);

  return (
    <div className="App">
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            shape: "rect",
            layout: "vertical",
          }}
          createOrder={async () => {
            try {
              const response = await fetch(`${BASE_URL_PAYPAL}/api/orders`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  cart: [
                    {
                      type: "premium",
                      premiumQuantity: JSON.stringify(premiumQuantity),
                    },
                    {
                      type: "standard",
                      standardQuantity: JSON.stringify(standardQuantity),
                    },
                    {
                      type: "student",
                      studentQuantity: JSON.stringify(studentQuantity),
                    },
                    {
                      type: "total",
                      totalPrice: JSON.stringify(totalPrice),
                    }
                  ],
   
                }),
              });

              const orderData = await response.json();

              if (orderData.id) {
                return orderData.id;
              } else {
                const errorDetail = orderData?.details?.[0];
                const errorMessage = errorDetail
                  ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                  : JSON.stringify(orderData);

                throw new Error(errorMessage);
              }
            } catch (error) {
              console.error(error);
              setMessage(`Could not initiate PayPal Checkout...${error}`);
            }
          }}
          onApprove={async (data, actions) => {
            try {
              const response = await fetch(
                `${BASE_URL_PAYPAL}/api/orders/${data.orderID}/capture`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              const orderData = await response.json();

              const errorDetail = orderData?.details?.[0];

              if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                return actions.restart();
              } else if (errorDetail) {
                throw new Error(
                  `${errorDetail.description} (${orderData.debug_id})`
                );
              } else {
                const transaction =
                  orderData.purchase_units[0].payments.captures[0];
                setMessage(
                  `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
                );
                console.log(
                  "Capture result",
                  orderData,
                  JSON.stringify(orderData, null, 2)
                );
                setFINALIZEDPurchaseData(orderData);
                alert(`Thank you for your purchase!`);
                setTimeout(() => {
                  window.location.href = 'https://greenlawnpresbyterian.com/';
                }, 5000);
              }
            } catch (error) {
              console.error(error);
              setMessage(
                `Sorry, your transaction could not be processed...${error}`
              );
            }
          }}
        />
      </PayPalScriptProvider>
      <Message content={message} />
    </div>
  );
};

export default PaymentForm;
