
const transactionService = require('../services/transactionServices');
const { getSortPaging, listResponse } = require('../utils/helperSortPagination'); 
const Transaction = require('../scheama/transaction'); 

const getAllTransactions = async (req, res) => {
    try {
      const query = req.query || {};   
      const queryObject = {};  
  
      
      console.log("Request Query:", query);  
  
      
      const { skip, sort, limit } = getSortPaging(query);   
     
      if (query.type) {
        queryObject.type = query.type;   
      }
  
    
      const items = await Transaction.find(queryObject)
        .sort(sort)        
        .skip(skip)       
        .limit(limit)     
        .exec();
  
      // Prepare the response with pagination info
      const response = await listResponse(Transaction, queryObject, items, query);
  
      // Return the response
      res.status(200).json({
        message: 'Transactions retrieved successfully',
        transactions: response.items,
        total: response.total,
        page: response.page,
        limit: response.limit
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);  // Log the actual error for debugging
      res.status(500).json({
        message: error.message || 'Could not fetch transactions.',
      });
    }
  };
  

const addTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.addTransaction(req.body);
    res.status(201).json({
      message: 'Transaction added successfully!',
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Could not add transaction.',
    });
  }
};



const getTransactionById = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await transactionService.getTransactionById(id);
    if (!transaction) {
      return res.status(404).json({
        message: 'Transaction not found',
      });
    }
    res.status(200).json({
      message: 'Transaction retrieved successfully',
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Could not fetch transaction.',
    });
  }
};


const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const transactionData = req.body;

  try {
    const updatedTransaction = await transactionService.updateTransaction(id, transactionData);
    if (!updatedTransaction) {
      return res.status(404).json({
        message: 'Transaction not found',
      });
    }
    res.status(200).json({
      message: 'Transaction updated successfully',
      transaction: updatedTransaction,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Could not update transaction.',
    });
  }
};

const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await transactionService.deleteTransaction(id);
    if (!transaction) {
      return res.status(404).json({
        message: 'Transaction not found',
      });
    }
    res.status(200).json({
      message: 'Transaction deleted successfully',
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Could not delete transaction.',
    });
  }
};

module.exports = {
  addTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
