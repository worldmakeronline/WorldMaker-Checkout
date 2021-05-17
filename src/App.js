import Styles from "./Styles";
import { Form, Field } from "react-final-form";
import Radio from "./Radio";

window.OmiseCard.configure({
  publicKey: process.env.OMISE_PUBLIC_KEY || "pkey_test_5m0zmp9uaoa38oiuooc"
});

const onSubmit = (values) => {
  return new Promise((resolve) => {
    console.log(values);
    window.OmiseCard.open({
      amount: 20000,
      frameLabel: "Checkout",
      frameDescription: "",
      hideAmount: "true",
      currency: "THB",
      submitLabel: `Subscribe ${values.type}`,
      onCreateTokenSuccess: async (nonce) => {
        console.log(nonce);
        if (nonce.startsWith("tokn_")) {
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          const raw = JSON.stringify({
            type: values.type,
            email: values.email,
            card: nonce
            // hello: "world"
          });

          const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw
          };

          const res = await fetch(
            "https://7eonc.sse.codesandbox.io/",
            requestOptions
          )
            .then((response) => response.json())
            .catch((error) => console.error("error", error));
          window.location.href = "https://world-maker.ghost.io/#/portal/signin";
          resolve(res);
        } else {
          console.error(nonce);
          resolve();
        }
      },
      onFormClosed: () => {
        resolve();
      }
    });
  });
};

export default function App() {
  return (
    <Styles>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, submitting, invalid, submitError }) => {
          console.log(submitError);
          return (
            <form onSubmit={handleSubmit}>
              <h3>Subscription Type</h3>
              <div>
                <Field
                  name="type"
                  type="radio"
                  value="Monthly"
                  component={Radio}
                  validate={(v) => !v}
                >
                  Monthly
                </Field>
                <label>
                  <Field
                    name="type"
                    type="radio"
                    value="Yearly"
                    component="input"
                  />
                  Yearly
                </label>
              </div>
              <h3>Email</h3>
              <div>
                <Field
                  name="email"
                  component="input"
                  type="email"
                  placeholder="Email"
                  validate={(v) => !v}
                />
              </div>
              {submitError && <div>{submitError}</div>}
              <div className="buttons">
                <button type="submit" disabled={submitting || invalid}>
                  {submitting ? "Submitting Payment..." : "Pay with Omise"}
                </button>
              </div>
            </form>
          );
        }}
      />
    </Styles>
  );
}
