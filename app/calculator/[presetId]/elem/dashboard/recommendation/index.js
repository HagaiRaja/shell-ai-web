
import { Button, Container, Row, Col, Form, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { useDispatch, useSelector } from 'react-redux';

import { YearRecommendation } from './year'

export function Recommendation() {
  const startYear = useSelector((state) => state.data.startYear);
  const endYear = useSelector((state) => state.data.endYear);

  let years = []
  for (let year = startYear; year <= endYear; year++) {
    years.push(year)
  }

  return <>
    <Accordion defaultActiveKey="recommendation">
      <Accordion.Item eventKey="recommendation">
        <Accordion.Header>Recommendation</Accordion.Header>
        <Accordion.Body>

        {years.map(year => (
          <YearRecommendation year={year} key={`recommendation-${year}`}/>
        ))}

        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </>
}
  