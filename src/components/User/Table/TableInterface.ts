export interface UserTableProps {
  formValues: {
    firstName: string;
    lastName: string;
    age: string;
    email: string;
  };
  allUsers?: Array<{ id: string; firstName: string; lastName: string; age: string; email: string }>;
  deleteSelected: (user: any) => void;
  openEditPopup: (user: any) => void;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}
