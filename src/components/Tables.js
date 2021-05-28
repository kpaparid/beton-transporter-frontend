
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faArrowDown, faArrowUp, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Nav, Card, Image, Button, Table, ProgressBar, Pagination, Form } from '@themesberg/react-bootstrap';
import { pageVisits, pageTraffic, pageRanking, workersTotalHours, vacation } from "../data/tables";
import transactions, { labels } from "../data/transactions";
import commands from "../data/commands";
import MyTextArea from "../pages/myComponents/MyTextArea";
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { ACTIONS } from "../pages/reducers/redux";
import { loadTransactionsData } from "../pages/reducers/loadTransactionsData";



const ValueChange = ({ value, suffix }) => {
  const valueIcon = value < 0 ? faAngleDown : faAngleUp;
  const valueTxtColor = value < 0 ? "text-danger" : "text-success";

  return (
    value ? <span className={valueTxtColor}>
      <FontAwesomeIcon icon={valueIcon} />
      <span className="fw-bold ms-1">
        {Math.abs(value)}{suffix}
      </span>
    </span> : "--"
  );
};

export const PageVisitsTable = () => {
  const TableRow = (props) => {
    const { pageName, views, returnValue, bounceRate } = props;
    const bounceIcon = bounceRate < 0 ? faArrowDown : faArrowUp;
    const bounceTxtColor = bounceRate < 0 ? "text-danger" : "text-success";

    return (
      <tr>
        <th scope="row">{pageName}</th>
        <td>{views}</td>
        <td>${returnValue}</td>
        <td>
          <FontAwesomeIcon icon={bounceIcon} className={`${bounceTxtColor} me-3`} />
          {Math.abs(bounceRate)}%
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm">
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            <h5>Page visits</h5>
          </Col>
          <Col className="text-end">
            <Button variant="secondary" size="sm">See all</Button>
          </Col>
        </Row>
      </Card.Header>
      <Table responsive className="align-items-center table-flush">
        <thead className="thead-light">
          <tr>
            <th scope="col">Page name</th>
            <th scope="col">Page Views</th>
            <th scope="col">Page Value</th>
            <th scope="col">Bounce rate</th>
          </tr>
        </thead>
        <tbody>
          {pageVisits.map(pv => <TableRow key={`page-visit-${pv.id}`} {...pv} />)}
        </tbody>
      </Table>
    </Card>
  );
};
export const WorkerHoursTable = () => {
  const TableRow = (props) => {
    const { hours, workerName } = props;
    return (
      <tr>
        <th scope="row">{workerName}</th>
        <td>{hours}</td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm">
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            <h5>Total working time in March</h5>
          </Col>
          <Col className="text-end">
            <Button variant="secondary" size="sm">See all</Button>
          </Col>
        </Row>
      </Card.Header>
      <Table responsive className="align-items-center table-flush">
        <thead className="thead-light">
          <tr>
            <th scope="col">Worker Name</th>
            <th scope="col">Hours</th>
          </tr>
        </thead>
        <tbody>
          {workersTotalHours.map(wh => <TableRow key={`worker-hour-${wh.id}`} {...wh} />)}
        </tbody>
      </Table>
    </Card>
  );
};
export const VacationsTable = () => {
  const TableRow = (props) => {
    const { workerName, vacationStart, vacationEnd } = props;

    return (
      <tr>
        <th scope="row">{workerName}</th>
        <td>{vacationStart}</td>
        <td>{vacationEnd}</td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm">
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            <h5>Current Vacations</h5>
          </Col>
          <Col className="text-end">
            <Button variant="secondary" size="sm">See all</Button>
          </Col>
        </Row>
      </Card.Header>
      <Table responsive className="align-items-center table-flush">
        <thead className="thead-light">
          <tr>
            <th scope="col">Worker Name</th>
            <th scope="col">from</th>
            <th scope="col">to</th>
          </tr>
        </thead>
        <tbody>
          {vacation.map(wh => <TableRow key={`worker-vacation-${wh.id}`} {...wh} />)}
        </tbody>
      </Table>
    </Card>
  );
};

export const PageTrafficTable = () => {
  const TableRow = (props) => {
    const { id, source, sourceIcon, sourceIconColor, sourceType, category, rank, trafficShare, change } = props;

    return (
      <tr>
        <td>
          <Card.Link href="#" className="text-primary fw-bold">{id}</Card.Link>
        </td>
        <td className="fw-bold">
          <FontAwesomeIcon icon={sourceIcon} className={`icon icon-xs text-${sourceIconColor} w-30`} />
          {source}
        </td>
        <td>{sourceType}</td>
        <td>{category ? category : "--"}</td>
        <td>{rank ? rank : "--"}</td>
        <td>
          <Row className="d-flex align-items-center">
            <Col xs={12} xl={2} className="px-0">
              <small className="fw-bold">{trafficShare}%</small>
            </Col>
            <Col xs={12} xl={10} className="px-0 px-xl-1">
              <ProgressBar variant="primary" className="progress-lg mb-0" now={trafficShare} min={0} max={100} />
            </Col>
          </Row>
        </td>
        <td>
          <ValueChange value={change} suffix="%" />
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm mb-4">
      <Card.Body className="pb-0">
        <Table responsive className="table-centered table-nowrap rounded mb-0">
          <thead className="thead-light">
            <tr>
              <th className="border-0">#</th>
              <th className="border-0">Traffic Source</th>
              <th className="border-0">Source Type</th>
              <th className="border-0">Category</th>
              <th className="border-0">Global Rank</th>
              <th className="border-0">Traffic Share</th>
              <th className="border-0">Change</th>
            </tr>
          </thead>
          <tbody>
            {pageTraffic.map(pt => <TableRow key={`page-traffic-${pt.id}`} {...pt} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export const RankingTable = () => {
  const TableRow = (props) => {
    const { country, countryImage, overallRank, overallRankChange, travelRank, travelRankChange, widgetsRank, widgetsRankChange } = props;

    return (
      <tr>
        <td className="border-0">
          <Card.Link href="#" className="d-flex align-items-center">
            <Image src={countryImage} className="image-small rounded-circle me-2" />
            <div><span className="h6">{country}</span></div>
          </Card.Link>
        </td>
        <td className="fw-bold border-0">
          {overallRank ? overallRank : "-"}
        </td>
        <td className="border-0">
          <ValueChange value={overallRankChange} />
        </td>
        <td className="fw-bold border-0">
          {travelRank ? travelRank : "-"}
        </td>
        <td className="border-0">
          <ValueChange value={travelRankChange} />
        </td>
        <td className="fw-bold border-0">
          {widgetsRank ? widgetsRank : "-"}
        </td>
        <td className="border-0">
          <ValueChange value={widgetsRankChange} />
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm">
      <Card.Body className="pb-0">
        <Table responsive className="table-centered table-nowrap rounded mb-0">
          <thead className="thead-light">
            <tr>
              <th className="border-0">Country</th>
              <th className="border-0">All</th>
              <th className="border-0">All Change</th>
              <th className="border-0">Travel & Local</th>
              <th className="border-0">Travel & Local Change</th>
              <th className="border-0">Widgets</th>
              <th className="border-0">Widgets Change</th>
            </tr>
          </thead>
          <tbody>
            {pageRanking.map(r => <TableRow key={`ranking-${r.id}`} {...r} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};










export const TransactionsTable = (props) => {
  const totalTransactions = transactions.length;

  // const checkedAll = useSelector((state) => {
  //   const checkedIdLength = state.tourTable.checkedId.length
  //   const allIdLength = state.tourTable.allId.length

  //   return checkedIdLength === allIdLength
  // });
  const checkedAll = true;
  const stateAPIStatus = useLoadTransactionsData();
  // const displayColumn = useSelector(selectorMenu4)


  const shownTourTable = useSelector(shownToursSelector, shallowEqual)

  function shownToursSelector(state){
    const shownId = state.tourTable.shownId
    const table = []
    
    shownId.forEach(item => {
      table.push( {id: item, value: state.tourTable.byId[item]} )
    })
    console.log('rerender')
    return [...table]
  }
  


  const dispatch = useDispatch();
  function handleAllClick() {
    dispatch({
      type: ACTIONS.TOGGLE_CHECK_ALL,
    });
  }




  function handleCheckboxClick(id, event) {
    
    dispatch({
      type: ACTIONS.CHECK_ONE,
      payload: {
        id: id

      }
    });
  }



  const TableRow = (props) => {
    const { index, row, displayColumn } = props;
    const r = row.value
    const id = row.id
    // const checked = useSelector(selectorMenu)
    // function selectorMenu(state) {
    //   const { tourTable } = state;
    //   const checked = tourTable.checkedId.findIndex(item => item === id) === -1 ? false : true 
    //   // console.log(checked)
    //   return checked;
    // }

    return (
      <tr className="text-left align-middle" style={{ backgroundColor: '#c5ded6' }}>
        <td className="px-2" style={{width:'30px'}}>
          <Form.Check
            key={`checkbox_tablerow_${index}`}
            id={`checkbox_tablerow_${index}`}
            htmlFor={`checkbox_tablerow_${index}`}
            defaultChecked={'checked'}
            onChange={(event) =>handleCheckboxClick(id, event)}
          />
        </td>
        <TablerowContents
          key={`tablerow_contents_${id}`}
          row={r}
          id={id}
          // displayColumn={displayColumn}
        />
      </tr>
    );
  };
  function TablerowContents(props) {
    const {row, id, displayColumn} = props
    
    
    return <>
     {Object.keys(row)
       .filter(key => (key !== 'id') 
       )
       .map((key, i) =>
         <td key={`$td-${key}`} 
           className="text-center px-1 text-wrap" 
          //  style={{ display: displayColumn[i] }}
           >
             <span>
               {/* <MyTextArea
                key={`$myTextArea_${id}_${key}`}
                myId={id}
                myKey={key}
                text={row[key]}
                 /> */}
             </span>
         </td>)}
    </>
  }

  const HeaderRow = (props) => {
    const { table, displayColumn }= props
    
    return (
      <tr className="align-middle">
        <th className="border-bottom px-2 text-left" style={{width:'30px'}}>
          <Form.Check
            id="checkboxAll"
            htmlFor="checkboxAll"
            checked={checkedAll}
            onChange={handleAllClick}
          />
        </th>
        {table.map((key, index) =>
          <th key={`$s-${key}`}
            className="border-bottom  px-2 text-wrap text-center "
            // style={{display:displayColumn[index]}}
            >
            {key}
          </th>
        )}
      </tr>
    );
  };

  function useLoadTransactionsData() {
    const [stateAPIStatus, setAPIStatus] = useState('idle');
    const dispatch = useDispatch();

    useEffect(() => {
      setAPIStatus('loading');
      loadTransactionsData()
        .then((data) => {
          dispatch({
            type: ACTIONS.LOAD_TRANSACTIONS_TABLE,
            payload: {
              table: data,
            },
          });
          setAPIStatus('success');
        })
        .catch((error) => {
          setAPIStatus('error');
        });
    }, [dispatch]);

    return stateAPIStatus;
  }

  // useEffect(() => {
  //   console.log('SERVER_EVENT: menu list changed');
  //   console.log(shownTourTable)

  // }, [shownTourTable]);


  return (
    <Card border="light" className="table-wrapper table-responsive shadow table">
      <Card.Body className="px-1">
        <Table className="user-table align-items-center">
          {/* <thead className="thead-light">
            <HeaderRow
              table={labels.map(item => item.text)}
              // displayColumn={displayColumn} 
              />
          </thead> */}
          <tbody>
            {shownTourTable.map((t, index) =>
              <TableRow key={`transaction-${t.id}`}
                row={t}
                index={index}
                // displayColumn={displayColumn}
              />)}
          </tbody>
        </Table>
        <Card.Footer className="px-3 border-0 d-lg-flex align-items-center justify-content-between">
          <Nav>
            <Pagination className="mb-2 mb-lg-0">
              <Pagination.Prev>
                Previous
              </Pagination.Prev>
              <Pagination.Item active>1</Pagination.Item>
              <Pagination.Item>2</Pagination.Item>
              <Pagination.Item>3</Pagination.Item>
              <Pagination.Item>4</Pagination.Item>
              <Pagination.Item>5</Pagination.Item>
              <Pagination.Next>
                Next
              </Pagination.Next>
            </Pagination>
          </Nav>
          <small className="fw-bold">
            Showing <b>{totalTransactions}</b> out of <b>25</b> entries
          </small>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};


export const CommandsTable = () => {
  const TableRow = (props) => {
    const { name, usage = [], description, link } = props;

    return (
      <tr>
        <td className="border-0" style={{ width: '5%' }}>
          <code>{name}</code>
        </td>
        <td className="fw-bold border-0" style={{ width: '5%' }}>
          <ul className="ps-0">
            {usage.map(u => (
              <ol key={u} className="ps-0">
                <code>{u}</code>
              </ol>
            ))}
          </ul>
        </td>
        <td className="border-0" style={{ width: '50%' }}>
          <pre className="m-0 p-0">{description}</pre>
        </td>
        <td className="border-0" style={{ width: '40%' }}>
          <pre><Card.Link href={link} target="_blank">Read More <FontAwesomeIcon icon={faExternalLinkAlt} className="ms-1" /></Card.Link></pre>
        </td>
      </tr>
    );
  };

  return (
    <Card border="light" className="shadow-sm">
      <Card.Body>
        <Table responsive className="table-centered rounded" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          <thead className="thead-light">
            <tr>
              <th className="border-0" style={{ width: '5%' }}>Name</th>
              <th className="border-0" style={{ width: '5%' }}>Usage</th>
              <th className="border-0" style={{ width: '50%' }}>Description</th>
              <th className="border-0" style={{ width: '40%' }}>Extra</th>
            </tr>
          </thead>
          <tbody>
            {commands.map(c => <TableRow key={`command-${c.id}`} {...c} />)}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};