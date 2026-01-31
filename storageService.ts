
import { FinancialState, Transaction, Budget } from '../types';

const STORAGE_KEY = 'zenmoney_state';

const DEFAULT_STATE: FinancialState = {
  transactions: [],
  budgets: []
};

export const storageService = {
  loadState: (): FinancialState => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return DEFAULT_STATE;
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to load state:', error);
      return DEFAULT_STATE;
    }
  },

  saveState: (state: FinancialState): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  },

  addTransaction: (transaction: Transaction): void => {
    const state = storageService.loadState();
    state.transactions.unshift(transaction);
    storageService.saveState(state);
  },

  deleteTransaction: (id: string): void => {
    const state = storageService.loadState();
    state.transactions = state.transactions.filter(t => t.id !== id);
    storageService.saveState(state);
  },

  updateBudget: (budget: Budget): void => {
    const state = storageService.loadState();
    const existingIndex = state.budgets.findIndex(b => b.category === budget.category);
    if (existingIndex > -1) {
      state.budgets[existingIndex] = budget;
    } else {
      state.budgets.push(budget);
    }
    storageService.saveState(state);
  }
};
