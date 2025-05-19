import FormField from "../../components/FormField";
import { useForm } from "react-hook-form";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import OPTInput from "../../components/FormInputs/OPTInput";

const OTPVeriyPage = () => {
  const { control, handleSubmit } = useForm();
  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <>
      <p className="mb-5 text-center text-2xl font-bold">
        Two-Step Verification 💬
      </p>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="otp"
          label="Type your 6 digit security code"
          control={control}
          Component={OPTInput}
        />
        <Button variant="contained" className="w-full">
          Verify my account
        </Button>
      </form>
      <p className="mt-4 text-center">
        Didn&apos;t get the code? <Link className="text-blue-500">Resend</Link>
      </p>
    </>
  );
};

export default OTPVeriyPage;
