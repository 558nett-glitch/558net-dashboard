import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Customer } from '../types';
import { googleSheetsService } from '../services/googleSheets';
import { generateDemoData } from '../utils/demoData';

interface CustomerContextType {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  lastSync: Date | null;
  addCustomer: (customer: Omit<Customer, 'id'>) => Promise<void>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
  isUsingDemo: boolean;
}

const CustomerContext = createContext<CustomerContextType | null>(null);

export const CustomerProvider = ({ children }: { children: ReactNode }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isUsingDemo, setIsUsingDemo] = useState(false);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await googleSheetsService.getCustomers();
      setCustomers(data);
      setLastSync(new Date());
      setIsUsingDemo(false);
    } catch (err) {
      console.warn('Google Sheets not configured, using demo data:', err);
      setCustomers(generateDemoData());
      setIsUsingDemo(true);
      setLastSync(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 60000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const addCustomer = async (customerData: Omit<Customer, 'id'>) => {
    const newId = `558NET-${Date.now()}`;
    const newCustomer: Customer = { ...customerData, id: newId };
    
    if (!isUsingDemo) {
      try {
        await googleSheetsService.addCustomer(newCustomer);
      } catch {
        console.warn('Failed to sync to Google Sheets');
      }
    }
    setCustomers(prev => [newCustomer, ...prev]);
    setLastSync(new Date());
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    const updatedCustomers = customers.map(c => c.id === id ? { ...c, ...updates } : c);
    setCustomers(updatedCustomers);
    setLastSync(new Date());

    if (!isUsingDemo) {
      const updatedCustomer = updatedCustomers.find(c => c.id === id);
      if (updatedCustomer) {
        try {
          await googleSheetsService.updateCustomer(id, updatedCustomer);
        } catch {
          console.warn('Failed to sync to Google Sheets');
        }
      }
    }
  };

  const deleteCustomer = async (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    setLastSync(new Date());

    if (!isUsingDemo) {
      try {
        await googleSheetsService.deleteCustomer(id);
      } catch {
        console.warn('Failed to sync to Google Sheets');
      }
    }
  };

  return (
    <CustomerContext.Provider value={{
      customers,
      loading,
      error,
      lastSync,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      refreshData,
      isUsingDemo,
    }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () => {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error('useCustomers must be used within CustomerProvider');
  return ctx;
};
