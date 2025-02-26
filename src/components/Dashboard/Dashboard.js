import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SidebarNav from '../SidebarNav/SidebarNav';
import InfoCard from '../InfoCard/InfoCard';
import './Dashboard.css';
import BreadcrumbAndProfile from '../BreadcrumbAndProfile/BreadcrumbAndProfile';
import MonthlySmartChart from '../chart/chart';
function Dashboard({ totalIncomes, totalExpenses, incomes, expenses }) {
  const total = totalIncomes + totalExpenses;

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="sidebar">
          <SidebarNav />
        </Col>
        <Col md={10} className="main">
          {/* Breadcrumb and Profile */}
          <BreadcrumbAndProfile
            breadcrumbItems={[{ name: 'Dashboard', path: '/dashboard', active: false }]}
            pageTitle="Dashboard"
          />

          <Row className="mb-3">
            <Col md={4}>
              <InfoCard
                title="Total"
                value={`$${total}`}
                linkText="View details"
                linkTo="/dashboard"
                style={{ color: 'black', backgroundColor: 'white' }}
              />
            </Col>
            <Col md={4}>
              <InfoCard
                title="Incomes"
                value={`$${totalIncomes}`}
                linkText="Add or manage your Income"
                linkTo="/incomes"
                style={{ color: 'blue' }}
              />
            </Col>
            <Col md={4}>
              <InfoCard
                title="Expenses"
                value={`$${totalExpenses}`}
                linkText="Add or manage your expenses"
                linkTo="/expenses"
                style={{ color: 'black', backgroundColor: 'white' }}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <MonthlySmartChart incomes={incomes} expenses={expenses} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
