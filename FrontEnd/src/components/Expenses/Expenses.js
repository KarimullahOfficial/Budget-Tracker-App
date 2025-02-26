import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Card, Table, Modal, InputGroup, Alert } from 'react-bootstrap';
import SidebarNav from '../SidebarNav/SidebarNav';
import BreadcrumbAndProfile from '../BreadcrumbAndProfile/BreadcrumbAndProfile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Formik, Field, ErrorMessage } from 'formik'; // Import Formik components
import * as Yup from 'yup'; // Import Yup for validation
import InfoCard from '../InfoCard/InfoCard';
import useTransactions from '../hook/apihook';

function Expenses() {
  const { transactions, loading, error, addTransaction, updateTransaction, deleteTransaction } = useTransactions('expense');
  const [editing, setEditing] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const categories = ['Utility', 'Rent', 'Groceries', 'Entertainment', 'Other'];


  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    amount: Yup.number()
      .required('Amount is required')
      .positive('Amount must be positive'),
    date: Yup.date().required('Date is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
  });

  const handleEdit = (expense) => {
    setEditing(true);
    setCurrentExpense(expense);
    setShowModal(true);
  };

  const handleSubmit = (values) => {
    const expenseData = {
      id: editing ? currentExpense.id : Date.now(),
      ...values,
      status: values.isPaid ? "PAID" : "DUE",
      type: "expense",
    };

    if (editing) {
      updateTransaction(currentExpense.id, expenseData);
    } else {
      addTransaction(expenseData);
    }

    setShowModal(false);
  };

  const handleRemove = (id) => {
    const isConfirmed = window.confirm("Are you sure you want to remove this expense?");
    if (isConfirmed) {
      deleteTransaction(id);
    }
  };

  const totalExpense = transactions.reduce((total, expense) => total + parseFloat(expense.amount), 0);

  const filteredExpenses = searchQuery.length > 0
    ? transactions.filter(expense =>
        expense.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (expense.category?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      )
    : transactions;


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExpenses = filteredExpenses.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="sidebar">
          <SidebarNav />
        </Col>
        <Col md={10} className="main">
          {/* Top Bar */}
          <BreadcrumbAndProfile
            breadcrumbItems={[
              { name: 'Dashboard', path: '/dashboard', active: false },
              { name: 'Expenses', path: '/expenses', active: true }
            ]}
          />

          {/* Search Bar */}
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '300px' }}
            />
          </InputGroup>

          <Row className="d-flex justify-content-between align-items-center mb-3">
            <Col md={4}>
              <InfoCard
                title="Expenses"
                value={`$${totalExpense}`}
                linkText="View details"
                linkTo="/expense"
                style={{ color: 'black', backgroundColor: 'white' }}
              />
            </Col>
            <Col className="text-end">
              <Button onClick={() => setShowModal(true)} className="primary-button">
                <FontAwesomeIcon icon={faPlusCircle} className="icon-right" /> Add Expense
              </Button>
            </Col>
          </Row>

          {/* Expense Table */}
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount (€)</th>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.name}</td>
                  <td>{expense.amount}</td>
                  <td>{expense.date}</td>
                  <td>{expense.description}</td>
                  <td>{expense.category || 'Not specified'}</td>
                  <td>{expense.status}</td>
                  <td>
                    <Button variant="warning" size="sm" onClick={() => handleEdit(expense)} style={{ width: '70px', marginRight: '5px' }}>
                      <FontAwesomeIcon icon={faPenToSquare} /> Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleRemove(expense.id)} style={{ width: '70px' }}>
                      <FontAwesomeIcon icon={faTrashCan} /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-3">
            {Array.from({ length: Math.ceil(filteredExpenses.length / itemsPerPage) }, (_, i) => (
              <Button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                variant={currentPage === i + 1 ? 'primary' : 'outline-primary'}
                className="mx-1"
              >
                {i + 1}
              </Button>
            ))}
          </div>

          {/* Modal for Add/Edit Expense */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{editing ? "Edit Expense" : "Add Expense"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Formik
                initialValues={{
                  name: editing ? currentExpense.name : '',
                  amount: editing ? currentExpense.amount : '',
                  date: editing ? currentExpense.date : '',
                  description: editing ? currentExpense.description : '',
                  category: editing ? currentExpense.category : '',
                  isPaid: editing ? currentExpense.status === "PAID" : false,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ handleSubmit, handleChange, values, errors, touched }) => (
                  <Form onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Field
                        as={Form.Control}
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        isInvalid={touched.name && !!errors.name}
                      />
                      <ErrorMessage name="name" component={Alert} variant="danger" />
                    </Form.Group>

                    {/* Description Field */}
                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Field
                        as={Form.Control}
                        type="text"
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        isInvalid={touched.description && !!errors.description}
                      />
                      <ErrorMessage name="description" component={Alert} variant="danger" />
                    </Form.Group>

                    {/* Amount Field */}
                    <Form.Group className="mb-3">
                      <Form.Label>Amount</Form.Label>
                      <Field
                        as={Form.Control}
                        type="number"
                        name="amount"
                        value={values.amount}
                        onChange={handleChange}
                        isInvalid={touched.amount && !!errors.amount}
                      />
                      <ErrorMessage name="amount" component={Alert} variant="danger" />
                    </Form.Group>

                    {/* Date Field */}
                    <Form.Group className="mb-3">
                      <Form.Label>Date</Form.Label>
                      <Field
                        as={Form.Control}
                        type="date"
                        name="date"
                        value={values.date}
                        onChange={handleChange}
                        isInvalid={touched.date && !!errors.date}
                      />
                      <ErrorMessage name="date" component={Alert} variant="danger" />
                    </Form.Group>

                    {/* Category Field */}
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Field
                        as={Form.Select}
                        name="category"
                        value={values.category}
                        onChange={handleChange}
                        isInvalid={touched.category && !!errors.category}
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat, index) => (
                          <option key={index} value={cat}>{cat}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="category" component={Alert} variant="danger" />
                    </Form.Group>

                    {/* Paid Checkbox */}
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Paid"
                        name="isPaid"
                        checked={values.isPaid}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    {/* Submit Button */}
                    <Button type="submit" className="primary-button">
                      {editing ? "Update Expense" : "Add Expense"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Modal.Body>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
}

export default Expenses;
