import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

function InfoCard({ title, value, linkText, linkTo }) {
  return (
    <Card className="bg-primary text-white rounded-3 p-4 mb-4 shadow">
      <Card.Body>
        <Card.Title className="h2">{title}</Card.Title>
        <Card.Text className="display-4 font-weight-bold mb-3">{value}</Card.Text>
        {linkText && linkTo && ( // Render the link if both linkText and linkTo are provided
          <Card.Link as={Link} to={linkTo} className="text-white">
            {linkText}
            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </Card.Link>
        )}
      </Card.Body>
    </Card>
  );
}

export default InfoCard;
