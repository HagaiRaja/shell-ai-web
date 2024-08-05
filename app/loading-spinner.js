// LoadingSpinner.js
import React from 'react';
import { Spinner } from 'react-bootstrap';

export function LoadingSpinner() {
  return <>
    <div className="loading-overlay">
      <Spinner animation="border" variant="primary" />
    </div>
  </>
};
