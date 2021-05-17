const Radio = ({ input, children }) =>
  // input should contain checked value to indicate
  // if the input is checked
  console.log(input) || (
    <label>
      <input type="radio" {...input} />
      {children}
    </label>
  );

export default Radio;
