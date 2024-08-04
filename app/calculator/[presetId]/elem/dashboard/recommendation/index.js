
import { Button, Container, Row, Col, Form, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { useDispatch, useSelector } from 'react-redux';

import { YearRecommendation } from './year'

export function Recommendation() {
  const allData = useSelector((state) => state.data.value);

  return <>
    <Accordion defaultActiveKey="recommendation">
      <Accordion.Item eventKey="recommendation">
        <Accordion.Header>Recommendation</Accordion.Header>
        <Accordion.Body>

          <YearRecommendation year={2025} />
          <YearRecommendation year={2026} />
          <YearRecommendation year={2027} />
          <YearRecommendation year={2028} />
          <YearRecommendation year={2029} />

        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </>
}
  