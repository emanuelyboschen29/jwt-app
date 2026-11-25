export type ApiUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  isAdmin: boolean;
  active: boolean;
  createdAt: string;
};

export type Category = {
  id: number;
  name: string;
  description: string | null;
};

export type Author = {
  id: number;
  name: string;
  nationality: string | null;
  birthDate: string | null;
};

export type Book = {
  id: number;
  title: string;
  isbn: string;
  year: number | null;
  totalCopies: number;
  availableCopies: number;
  categoryId: number;
  Category?: Category;
  Authors?: Author[];
  category?: Category;
  authors?: Author[];
};

export type Reader = {
  id: number;
  name: string;
  cpf: string;
  email: string | null;
  phone: string | null;
};

export type Loan = {
  id: number;
  loanDate: string;
  dueDate: string;
  returnDate: string | null;
  status: "ATIVO" | "ATRASADO" | "DEVOLVIDO";
  fine: number;
  bookId: number;
  readerId: number;
  userId: number;
  Book?: Book;
  Reader?: Reader;
  User?: ApiUser;
  book?: Book;
  reader?: Reader;
  user?: ApiUser;
};

export type DashboardReport = {
  totalBooks: number;
  totalCopies: number;
  availableCopies: number;
  activeLoans: number;
  borrowedBooks: number;
  overdueLoans: number;
  totalFines: number;
  pendingFines: number;
};
