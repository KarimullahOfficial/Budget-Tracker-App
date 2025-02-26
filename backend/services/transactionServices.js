
const Transaction = require('../scheama/transaction'); 

const addTransaction = async (transactionData) => {
    const { name, description, category, amount, date, paid, type,STAT } = transactionData;
    try {
      const newTransaction = new Transaction({
        name,
        description,
        category,
        amount,
        date,
        paid,
        type,
      });
  
      await newTransaction.save();  // This will trigger the pre-save hook and automatically set the `type`
      return newTransaction;
    } catch (error) {
      console.error("Error adding transaction:", error);  // Log the actual error
      throw new Error('Server error. Could not add transaction. ' + error.message);
    }
  };
  

const getTransactionById = async (id) => {
  try {
    const transaction = await Transaction.findById(id);
    return transaction;
  } catch (error) {
    throw new Error('Server error. Could not fetch transaction.');
  }
};

 
const updateTransaction = async (id, transactionData) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      transactionData,
      { new: true, runValidators: true } 
    );
    return updatedTransaction;
  } catch (error) {
    throw new Error('Server error. Could not update transaction.');
  }
};


const deleteTransaction = async (id) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(id);
    return transaction;
  } catch (error) {
    throw new Error('Server error. Could not delete transaction.');
  }
};

module.exports = {
  addTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
