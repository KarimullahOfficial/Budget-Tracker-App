const express = require('express');
const transactionController = require('../controller/transcationcontroller');  
const router = express.Router();

 
router.post('/', transactionController.addTransaction);  
router.get('/', transactionController.getAllTransactions);  
router.get('/:id', transactionController.getTransactionById);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);  

module.exports = router;
