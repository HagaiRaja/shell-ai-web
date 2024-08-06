
import { Button, Container, Row, Col, Form, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

import { BuyRecommendation } from './buy'
import { UseRecommendation } from './use'
import { SellRecommendation } from './sell'

export function YearRecommendation({year}) {

  return <>
    <Accordion defaultActiveKey="recom-head-2025" className='mb-2'>
      <Accordion.Item eventKey="recommendation">
        <Accordion.Header>{year}</Accordion.Header>
        <Accordion.Body>
            
          <BuyRecommendation year={year}/>
          <UseRecommendation year={year}/>
          <SellRecommendation year={year} />

        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </>
}
  