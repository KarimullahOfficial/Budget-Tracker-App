import { useState, useEffect } from 'react';
import axios from 'axios';

const useTransactions = (type, skip = 0, limit = 10, sort = 'createdAt', order = 'asc') => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:800/api/transactions`,  // Ensure this is the correct endpoint
          {
            params: {
              skip,
              limit,
              sort,
              order,
              type,
            },
            headers: {
              'Content-Type': 'application/json', // You can add other headers here, such as Authorization if needed
            },
          }
        );
        setTransactions(response.data.transactions); // Assuming the API returns { transactions: [...] }
      } catch (error) {
        setError(error.response ? error.response.data : error.message);  // More detailed error handling
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [type, skip, limit, sort, order]);

  const addTransaction = async (transactionData) => {
    try {
      const response = await axios.post('http://localhost:800/api/transactions', transactionData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setTransactions((prev) => [...prev, response.data]);  // Assuming the response returns the created transaction
    } catch (error) {
      setError(error.response ? error.response.data : error.message);  // More detailed error handling
    }
  };

  const updateTransaction = async (id, updatedData) => {
    try {
      const response = await axios.put(`http://localhost:800/api/transactions/${id}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction._id === id ? { ...transaction, ...response.data } : transaction
        )
      );
    } catch (error) {
      setError(error.response ? error.response.data : error.message);  // More detailed error handling
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`http://localhost:800/api/transactions/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setTransactions((prev) => prev.filter((transaction) => transaction._id !== id));
    } catch (error) {
      setError(error.response ? error.response.data : error.message);  // More detailed error handling
    }
  };

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
};

export default useTransactions;
