import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Card, Table, Modal, InputGroup, Alert } from 'react-bootstrap';
import SidebarNav from '../SidebarNav/SidebarNav';
import BreadcrumbAndProfile from '../BreadcrumbAndProfile/BreadcrumbAndProfile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import InfoCard from '../InfoCard/InfoCard';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function Incomes() {
  const [incomes, setIncomes] = useState(() => {
    const savedIncomes = localStorage.getItem('incomes');
    return savedIncomes ? JSON.parse(savedIncomes) : [];
  });

  const [editing, setEditing] = useState(false);
  const [currentIncome, setCurrentIncome] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);

  const categories = ['Salary', 'Freelance', 'Investment', 'Other'];

  useEffect(() => {
    localStorage.setItem('incomes', JSON.stringify(incomes));
  }, [incomes]);

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
      id: editing ? currentIncome.id : Date.now(),
      ...values,
      status: values.isPaid ? "PAID" : "DUE",
    };

    if (editing) {
      setIncomes(incomes.map(income => income.id === currentIncome.id ? incomeData : income));
    } else {
      setIncomes([...incomes, incomeData]);
    }

    setShowModal(false);
  };

  const handleRemove = (id) => {
    const isConfirmed = window.confirm("Are you sure you want to remove this income?");
    if (isConfirmed) {
      setIncomes(incomes.filter(income => income.id !== id));
    }
  };

  const totalIncome = incomes.reduce((total, income) => total + parseFloat(income.amount), 0);

  const filteredIncomes = searchQuery.length > 0
    ? incomes.filter(income =>
      income.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      income.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (income.category?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    )
    : incomes;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIncomes = filteredIncomes.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
              { name: 'Income', path: '/income', active: true }
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
                linkTo="/ICOME"
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
                <tr key={income.id}>
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
                    <Button variant="danger" size="sm" onClick={() => handleRemove(income.id)} style={{ width: '100px', marginRight: '5px' }}>
                      <FontAwesomeIcon icon={faTrashCan} /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>


          <div className="d-flex justify-content-center mt-3">
            <Button
              onClick={() => paginate(currentPage - 1)}
              variant="outline-primary"
              className="mx-1"
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: Math.ceil(filteredIncomes.length / itemsPerPage) }, (_, i) => (
              <Button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                variant={currentPage === i + 1 ? 'primary' : 'outline-primary'}
                className="mx-1"
              >
                {i + 1}
              </Button>
            ))}
            <Button
              onClick={() => paginate(currentPage + 1)}
              variant="outline-primary"
              className="mx-1"
              disabled={currentPage === Math.ceil(filteredIncomes.length / itemsPerPage)}
            >
              Next
            </Button>
          </div>


          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{editing ? "Edit Income" : "Add Income"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Formik
                initialValues={{
                  name: editing ? currentIncome.name : '',
                  amount: editing ? currentIncome.amount : '',
                  date: editing ? currentIncome.date : '',
                  description: editing ? currentIncome.description : '',
                  category: editing ? currentIncome.category : '',
                  isPaid: editing ? currentIncome.status === "PAID" : false,
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
                      {editing ? "Update Income" : "Add Income"}
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

export default Incomes;
