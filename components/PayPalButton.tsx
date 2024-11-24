import { PayPalButtons } from "@paypal/react-paypal-js";

interface PayPalButtonProps {
  onSuccess: (details: { id: string; status: string; payer: { email_address: string } }) => void;
}

export default function PayPalButton({ onSuccess }: PayPalButtonProps) {
  return (
    <PayPalButtons
      style={{ layout: "vertical" }}
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: "9.99",
              },
            },
          ],
        });
      }}
      onApprove={async (data, actions) => {
        if (actions.order) {
          const details = await actions.order.capture();
          onSuccess(details);
        }
      }}
    />
  );
}
