import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { auth, db } from '../firebase'; 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, farm: string, role: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mantiene la sesión viva
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser({ id: firebaseUser.uid, ...docSnap.data() } as User);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error("Error Login:", error);
      alert("Credenciales incorrectas");
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, farm: string, role: string, extraData: any = {}): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = {
        name, 
        email, 
        farm: role === 'AGRICULTOR' ? farm : '', 
        role,
        ...extraData, // Guardamos datos extra como pricePerKm, maxCapacity, etc.
        created_at: new Date().toISOString()
      };
      // Guardamos datos extra en Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), newUser);
      setUser({ id: userCredential.user.uid, ...newUser });
      return true;
    } catch (error) {
      console.error("Error Registro:", error);
      alert("Error al registrar usuario");
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};