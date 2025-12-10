import { createContext, useContext, useState, ReactNode } from 'react';
import { UserAccount } from '../types';

const ADMIN_EMAIL = 'admin@jee.com';
const ADMIN_PASSWORD = 'admin123';

const initialAccounts: UserAccount[] = [
  { email: 'akshaymoghe5@gmail.com', password: 'sweetakshay@13', role: 'student', approved: true },
  { email: 'aditidhunde19@gmail.com', password: 'Aditidhunde19', role: 'student', approved: true },
{ email: 'dev879706@gmail.com', password: 'Mithunbplan', role: 'student', approved: true },
{ email: 'Rubalkaur495@gmail.com', password: 'Rubalkaur02', role: 'student', approved: true },
{ email: 'santoshbalakisan@gmail.com', password: '@praveenw2', role: 'student', approved: true },
{ email: 'krushilviramgama243@gmail.co', password: '2425', role: 'student', approved: true },
{ email: 'nainasharma7762@gmail.com', password: '9', role: 'student', approved: true },
{ email: 'manasvirai2007@gmail.com', password: 'Manasvi@04', role: 'student', approved: true },
{ email: 'tabbukumari46@gmail.com', password: '030303', role: 'student', approved: true },
{ email: 'marathadeepakchavhan@gmail.com', password: 'Maratha', role: 'student', approved: true },
{ email: 'yashasgpawar6@gmail.com', password: '1018', role: 'student', approved: true },
{ email: 'mdarifexamuse@gmail.com', password: 'Saheen123', role: 'student', approved: true },
{ email: 'swetasingh242005@gmail.com', password: 'Sweta123', role: 'student', approved: true },
{ email: 'kundankumarsharma7777@gmail.com', password: 'Sharma ji', role: 'student', approved: true },
{ email: 'pratyushvadhwani@gmail.com', password: 'Pratyush@123', role: 'student', approved: true },
{ email: 'stephinaantoa@gmail.com', password: 'Stephina@1509', role: 'student', approved: true },
{ email: 'anjanaparida94@gmail.com', password: 'Sneha2009', role: 'student', approved: true },
{ email: 'efrayamgunji@gmail.com', password: '7396807396', role: 'student', approved: true },
{ email: 'Andhra Pradesh', password: 'Jeemains2026', role: 'student', approved: true },
{ email: 'sudipdalvi18@gmail.com', password: '2510', role: 'student', approved: true },
{ email: 'bhumikashar1807@gmail.com', password: 'bhumika@123', role: 'student', approved: true },
{ email: 'harshjadhav01237890@gmail.com', password: 'HH@15072007', role: 'student', approved: true },
{ email: 'saish.chavan007@gmail.com', password: 'saish123', role: 'student', approved: true },
{ email: '@alabhyadeshmukhgmail.com', password: 'Alabhya_23', role: 'student', approved: true },
{ email: 'adhirajanand21@gmail.com', password: 'adh@123', role: 'student', approved: true },
{ email: 'Manognyaagalla@gmail.com', password: 'Jeemains2026', role: 'student', approved: true },
{ email: 'satyayadav8292329130@gmail.com', password: 'satya', role: 'student', approved: true },
{ email: 'kattaharshith009@gmail.com', password: 'Harshith123', role: 'student', approved: true },
{ email: 'mahparaanjumsheikh@gmail.com', password: 'lastminpaperwork', role: 'student', approved: true },
];

interface LoginResult {
  success: boolean;
  message: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: UserAccount | null;
  accounts: UserAccount[];
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
  addStudent: (email: string, password: string, autoApprove?: boolean) => { success: boolean; message: string };
  deleteStudent: (email: string) => void;
  approveStudent: (email: string) => void;
  rejectStudent: (email: string) => void;
  getPendingStudents: () => UserAccount[];
  getApprovedStudents: () => UserAccount[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<UserAccount[]>(initialAccounts);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  const login = (email: string, password: string): LoginResult => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = accounts.find(
      acc => acc.email.toLowerCase() === normalizedEmail && acc.password === password
    );
    if (user) {
      if (user.role === 'student' && !user.approved) {
        return { success: false, message: 'Your account is pending admin approval. Please wait for the administrator to approve your account.' };
      }
      setIsAuthenticated(true);
      setCurrentUser(user);
      return { success: true, message: 'Login successful', isAdmin: user.role === 'admin' };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const addStudent = (email: string, password: string, autoApprove: boolean = false): { success: boolean; message: string } => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password.trim()) {
      return { success: false, message: 'Please enter both email and password' };
    }
    if (accounts.some(acc => acc.email.toLowerCase() === normalizedEmail)) {
      return { success: false, message: 'This email already exists' };
    }
    const newStudent: UserAccount = { 
      email: email.trim(), 
      password: password.trim(), 
      role: 'student',
      approved: autoApprove
    };
    setAccounts(prev => [...prev, newStudent]);
    if (autoApprove) {
      return { success: true, message: `Student ${normalizedEmail} added and approved successfully!` };
    }
    return { success: true, message: `Student ${normalizedEmail} registered. Pending admin approval.` };
  };

  const deleteStudent = (email: string) => {
    setAccounts(prev => prev.filter(acc => acc.email !== email));
  };

  const approveStudent = (email: string) => {
    setAccounts(prev => prev.map(acc => 
      acc.email === email ? { ...acc, approved: true } : acc
    ));
  };

  const rejectStudent = (email: string) => {
    setAccounts(prev => prev.filter(acc => acc.email !== email));
  };

  const getPendingStudents = () => {
    return accounts.filter(acc => acc.role === 'student' && !acc.approved);
  };

  const getApprovedStudents = () => {
    return accounts.filter(acc => acc.role === 'student' && acc.approved);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      currentUser,
      accounts,
      login,
      logout,
      addStudent,
      deleteStudent,
      approveStudent,
      rejectStudent,
      getPendingStudents,
      getApprovedStudents,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
