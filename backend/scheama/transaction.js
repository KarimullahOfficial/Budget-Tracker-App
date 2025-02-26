const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Transaction name is required'], 
      trim: true,
      minlength: [3, 'Name should be at least 3 characters long'], 
      maxlength: [100, 'Name should not exceed 100 characters'], 
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [5, 'Description should be at least 5 characters long'], 
      maxlength: [500, 'Description should not exceed 500 characters'], 
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: ['Food', 'Entertainment', 'Utilities', 'Transportation', 'Health', 'Other', 'Salary', 'Freelance', 'Investment'], // Added income-related categories
        message: 'Category must be one of the following: Food, Entertainment, Utilities, Transportation, Health, Other, Salary, Freelance, Investment',
      },
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'], // Amount must be >= 0
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
      validate: {
        validator: function(value) {
          return value <= Date.now(); // Ensure the date is not in the future
        },
        message: 'Date cannot be in the future',
      },
    },
    paid: {
      type: Boolean,
      required: true,
      default: false,
    },
    type: {  
      type: String,
      required: true,
      enum: ['income', 'expense'],
    },
  },
  {
    timestamps: true, 
  }
);


transactionSchema.pre('save', function(next) {
  if (['Salary', 'Freelance', 'Investment'].includes(this.category)) {
    this.type = 'income';  
  } else if (['Food', 'Entertainment', 'Utilities', 'Transportation', 'Health', 'Other'].includes(this.category)) {
    this.type = 'expense'; 
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
