import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Table, Modal, InputGroup, Alert } from 'react-bootstrap';
import SidebarNav from '../SidebarNav/SidebarNav';
import BreadcrumbAndProfile from '../BreadcrumbAndProfile/BreadcrumbAndProfile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import InfoCard from '../InfoCard/InfoCard';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import useTransactions from '../hook/apihook';

function Incomes() {
  const [editing, setEditing] = useState(false);
  const [currentIncome, setCurrentIncome] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);

  const categories = ['Salary', 'Freelance', 'Investment', 'Other'];

  // Use the custom hook for fetching transactions (incomes)
  const { transactions, loading, error, addTransaction, updateTransaction, deleteTransaction } = useTransactions('income', 0, 10);

  // Filtered and paginated incomes
  const filteredIncomes = searchQuery.length > 0
    ? transactions.filter(income =>
        income.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        income.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (income.category?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      )
    : transactions;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIncomes = filteredIncomes.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    amount: Yup.number()
      .required('Amount is required')
      .positive('Amount must be positive'),
    date: Yup.date().required('Date is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
  });

  const handleEdit = (income) => {
    setEditing(true);
    setCurrentIncome(income);
    setShowModal(true);
  };

  const handleSubmit = (values) => {
    const incomeData = {
      _id: editing ? currentIncome._id : Date.now(),
      ...values,
      status: values.isPaid ? 'PAID' : 'DUE',
      type: 'income',
    };

    if (editing) {
      updateTransaction(currentIncome._id, incomeData); // Update income through the hook
    } else {
      addTransaction(incomeData); // Add income through the hook
    }

    setShowModal(false);
  };

  const handleRemove = (id) => {
    const isConfirmed = window.confirm('Are you sure you want to remove this income?');
    if (isConfirmed) {
      deleteTransaction(id); // Delete income through the hook
    }
  };

  const totalIncome = transactions.reduce((total, income) => total + parseFloat(income.amount), 0);

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="sidebar">
          <SidebarNav />
        </Col>

        <Col md={10} className="main">
          <BreadcrumbAndProfile
            breadcrumbItems={[
              { name: 'Dashboard', path: '/dashboard', active: false },
              { name: 'Income', path: '/income', active: true },
            ]}
          />

          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search incomes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '300px' }}
            />
          </InputGroup>

          {/* Total Income Card */}
          <Row className="d-flex justify-content-between align-items-center mb-3">
            <Col md={4}>
              <InfoCard
                title="Income"
                value={`$${totalIncome}`}
                linkText="View details"
                linkTo="/INCOME"
                style={{ color: 'black', backgroundColor: 'white' }}
              />
            </Col>
            <Col className="text-end">
              <Button onClick={() => setShowModal(true)} className="primary-button">
                <FontAwesomeIcon icon={faPlusCircle} className="icon-right" /> Add Income
              </Button>
            </Col>
          </Row>

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
              {currentIncomes.map((income) => (
                <tr key={income._id}>
                  <td>{income.name}</td>
                  <td>{income.amount}</td>
                  <td>{income.date}</td>
                  <td>{income.description}</td>
                  <td>{income.category || 'Not specified'}</td>
                  <td>{income.status}</td>
                  <td>
                    <Button variant="warning" size="sm" onClick={() => handleEdit(income)} style={{ width: '70px', marginRight: '5px' }}>
                      <FontAwesomeIcon icon={faPenToSquare} /> Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleRemove(income._id)} style={{ width: '100px', marginRight: '5px' }}>
                      <FontAwesomeIcon icon={faTrashCan} /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-center mt-3">
            <Button onClick={() => paginate(currentPage - 1)} variant="outline-primary" className="mx-1" disabled={currentPage === 1}>
              Previous
            </Button>
            {Array.from({ length: Math.ceil(filteredIncomes.length / itemsPerPage) }, (_, i) => (
              <Button key={i + 1} onClick={() => paginate(i + 1)} variant={currentPage === i + 1 ? 'primary' : 'outline-primary'} className="mx-1">
                {i + 1}
              </Button>
            ))}
            <Button onClick={() => paginate(currentPage + 1)} variant="outline-primary" className="mx-1" disabled={currentPage === Math.ceil(filteredIncomes.length / itemsPerPage)}>
              Next
            </Button>
          </div>

          {/* Modal for Add/Edit Income */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{editing ? 'Edit Income' : 'Add Income'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Formik
                initialValues={{
                  name: editing ? currentIncome.name : '',
                  amount: editing ? currentIncome.amount : '',
                  date: editing ? currentIncome.date : '',
                  description: editing ? currentIncome.description : '',
                  category: editing ? currentIncome.category : '',
                  isPaid: editing ? currentIncome.status === 'PAID' : false,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ handleSubmit, setFieldValue }) => (
                  <Form onSubmit={handleSubmit}>
                    <Field name="name" type="text" placeholder="Income name" className="form-control mb-3" />
                    <ErrorMessage name="name" component="div" className="text-danger mb-3" />
                    <Field name="amount" type="number" placeholder="Amount" className="form-control mb-3" />
                    <ErrorMessage name="amount" component="div" className="text-danger mb-3" />
                    <Field name="date" type="date" className="form-control mb-3" />
                    <ErrorMessage name="date" component="div" className="text-danger mb-3" />
                    <Field name="description" type="text" placeholder="Description" className="form-control mb-3" />
                    <ErrorMessage name="description" component="div" className="text-danger mb-3" />
                    <Field as="select" name="category" className="form-control mb-3">
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="category" component="div" className="text-danger mb-3" />
                    <div className="d-flex justify-content-between">
                      <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="primary">
                        {editing ? 'Save Changes' : 'Add Income'}
                      </Button>
                    </div>
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

export default Incomes;
