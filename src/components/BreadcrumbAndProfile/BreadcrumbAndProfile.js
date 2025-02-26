import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'; // For integrating with react-router
import './BreadcrumbAndProfile.css'; // Import CSS file for styles

function BreadcrumbAndProfile({ breadcrumbItems, pageTitle }) {
  return (
    <>
      <Breadcrumb className="custom-breadcrumb"> {/* Add custom class */}
        {breadcrumbItems.map((item, index) => (
          <LinkContainer key={index} to={item.path} active={item.active}>
            <Breadcrumb.Item active={item.active}>{item.name}</Breadcrumb.Item>
          </LinkContainer>
        ))}
      </Breadcrumb>

      {/* Display only pageTitle (e.g., Dashboard, Expenses, etc.) */}
      <div>
        <h3>{pageTitle}</h3>
      </div>
    </>
  );
}

export default BreadcrumbAndProfile;
