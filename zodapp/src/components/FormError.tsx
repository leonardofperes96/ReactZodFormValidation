interface FormErrorInterface {
  error?: string;
}

const FormError = ({ error }: FormErrorInterface) => {
  return <span className="error">{error}</span>;
};

export default FormError;
