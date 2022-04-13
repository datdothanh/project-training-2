import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import moment from 'moment';
import { getData } from '../../redux/usedTime/actions';
import Loading from '../../components/Loading/Loading';
import { Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import Menu from '../Menu/Menu';
import Paginatinon from '../../components/Pagination/Paginatinon';
import Filter from './Filter';

const UsedTime = () => {
  const { usedTimeData, isLoading, isError } = useSelector((state) => state.usedTime);
  const listTitleString = ['OS Name', 'Date'];
  const listTitleNumber = ['Total', 'Facebook', 'Youtube', 'Other'];
  const [dataRender, setDataRender] = useState([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('asc');
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('');

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getData([page, sort, search, date, type]));
  }, [page, sort, search, date, type]);

  useEffect(() => {
    if (sort == '' || !sort) {
      setDataRender(usedTimeData);
    } else if (sort == 'asc') {
      const dataSortTemp = usedTimeData;
      const dataSort = dataSortTemp.sort((a, b) => a.userName.localeCompare(b.userName));
      setDataRender(dataSort);
    } else if (sort == 'desc') {
      const dataSortTemp = usedTimeData;
      const dataSort = dataSortTemp.sort((a, b) => b.userName.localeCompare(a.userName));
      setDataRender(dataSort);
    }
    if (search != '') {
      console.log('abcxyz search');
      setDataRender((prev) => {
        return prev.filter((val) => val.userName.toLowerCase().includes(search));
      });
    }
    if (date != '') {
      console.log('abcxyz time');
      setDataRender((prev) => {
        return prev.filter((val) => moment(val.date).format('YYYY-MM-DD').includes(date));
      });
    }
    if (type != '' && type != 'Please select') {
      console.log('abcxyz type');
      setDataRender((prev) => {
        return prev.filter((val) => val.oSName.includes(type));
      });
    }
  }, [usedTimeData, sort, search, date, type]);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    params.page ? '' : (params.page = 1);
    params.sort ? '' : (params.sort = '');
    params.search ? '' : (params.search = '');
    params.date ? '' : (params.date = '');
    params.type ? '' : (params.type = '');
    setPage(params.page);
    setSort(params.sort);
    setSearch(params.search);
    setDate(params.date);
    setType(params.type);
    dispatch(getData([params.page, params.sort, params.search, params.date, params.type]));
  }, [window.location.search]);

  const handleSort = useCallback(
    (s) => {
      if (s === 'asc') {
        setSort('desc');
        const dataSortTemp = usedTimeData;
        const dataSort = dataSortTemp.sort((a, b) => b.userName.localeCompare(a.userName));
        setDataRender(dataSort);
      } else {
        setSort('asc');
        const dataSortTemp = usedTimeData;
        const dataSort = dataSortTemp.sort((a, b) => a.userName.localeCompare(b.userName));
        setDataRender(dataSort);
      }
    },
    [usedTimeData]
  );

  const tableUsedTimeHeader = (
    <thead>
      <tr>
        <th>
          UserName
          {sort == 'desc' ? (
            <FontAwesomeIcon
              icon={faArrowDown}
              data-testid="arrow-circle-down"
              onClick={() => handleSort(sort)}
            />
          ) : (
            <FontAwesomeIcon
              icon={faArrowUp}
              data-testid="arrow-circle-up"
              onClick={() => handleSort(sort)}
            />
          )}
        </th>
        {listTitleString.map((val, index) => {
          return <th key={index + uuidv4()}>{val}</th>;
        })}
        {listTitleNumber.map((val, index) => {
          return <th key={index + uuidv4()}>{val}</th>;
        })}
      </tr>
    </thead>
  );
  const tableUsedTimeBody = (
    <>
      <tbody>
        {isLoading && (
          <tr>
            <td colSpan={7}>
              <Loading />
            </td>
          </tr>
        )}
        {isError && (
          <tr>
            <td colSpan={7}>no data</td>
          </tr>
        )}
        {!isError &&
          !isLoading &&
          dataRender.map((val, index) => {
            return (
              <tr key={index + uuidv4()}>
                <td key={index + uuidv4()}>{val.userName}</td>
                <td key={index + uuidv4()}>{val.oSName}</td>
                <td key={index + uuidv4()}>{moment(val.date).format('YYYY-MM-DD')}</td>
                <td key={index + uuidv4()}>{val.useTimeNumber}</td>
                <td key={index + uuidv4()}>{val.facebookTimeUse}</td>
                <td key={index + uuidv4()}>{val.youtubeTimeUse}</td>
                <td key={index + uuidv4()}>{val.other}</td>
              </tr>
            );
          })}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={7}>
            <Paginatinon
              totalPages={4}
              page={page}
              setPage={setPage}
              sort={sort}
              search={search}
              date={date}
              type={type}
            />
          </td>
        </tr>
      </tfoot>
    </>
  );

  return (
    <div className="usedTime">
      <Menu />
      <div className=" padding-title">
        <Filter
          setDataRender={setDataRender}
          usedTimeData={usedTimeData}
          search={search}
          setSearch={setSearch}
          date={date}
          setDate={setDate}
          type={type}
          setType={setType}
        />
        <div className="usedTime-container">
          <Table striped bordered hover>
            {tableUsedTimeHeader}
            {tableUsedTimeBody}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default UsedTime;
