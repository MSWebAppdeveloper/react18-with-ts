export interface UserFormProps {
  formData: {
    id: string;
    firstName: string;
    lastName: string;
    age: string;
    email: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isModal: boolean;
  handleClose: () => void;
}