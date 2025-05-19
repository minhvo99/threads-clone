import { MuiOtpInput } from "mui-one-time-password-input";

const OPTInput = ({ value, onChange }) => {
  return (
    <MuiOtpInput
      display="flex"
      className="w-[370px]"
      autoFocus
      onChange={onChange}
      length={4}
      value={value}
    />
  );
};

export default OPTInput;
