import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import './index.view.css';
import { useNavigate } from 'react-router-dom';
import { loadHoldenHistory } from 'store/actions/title';

function TitleHistory() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  useEffect(() => {
    const cb = async () => {
      const data = await loadHoldenHistory();
      console.log(data);
      //@ts-ignore
      setData(data);
    };
    cb();
  }, []);

  return (
    <div className="p-2 max-h-[680px] overflow-y-scroll w-full">
      <div className="title-body p-2">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-secondary-100">
            <thead className="text-sm whitespace-nowrap">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Salesperson
                </th>
                <th scope="col" className="px-6 py-3">
                  STK NO
                </th>
                <th scope="col" className="px-6 py-3">
                  Customer Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Deal Number
                </th>
                <th scope="col" className="px-6 py-3">
                  Sold Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Title Value
                </th>
                <th scope="col" className="px-6 py-3">
                  Select
                </th>
              </tr>
            </thead>
            <tbody className="text-primary-90">
              {data.map((record: any, index: any) => {
                return (
                  <tr className={index % 2 === 0 ? `bg-secondary-20` : ''}>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium whitespace-nowrap flex items-center"
                    >
                      <div>
                        <img
                          src={record.salesperson.avatar}
                          className="w-[38px] h-[38px] rounded-full"
                          alt="avatar"
                        />
                      </div>
                      <div className="ml-5">
                        <p className={'text-secondary-100 text-xs'}>
                          {record.salesperson.permission}
                        </p>
                        <p className=""> {record.salesperson.name}</p>
                      </div>
                    </th>
                    <td className="px-6 py-4 ">{record.stk_no}</td>
                    <td className="px-6 py-4 ">{record.customer_name}</td>
                    <td className="px-6 py-4 ">{record.deal_num}</td>
                    <td className="px-6 py-4 ">{record.sold_date}</td>
                    <td className="px-6 py-4 ">
                      <div className="h-[24px] flex items-center px-3 rounded-md bg-[#00E577] text-center text-primary-100">
                        {record.title_value}
                      </div>
                    </td>
                    <td className="py-4 px-0 pr-3  text-center">
                      <div className="my-auto bg-primary-10 rounded ml-5 px-2 w-fit">
                        <input
                          id="default-checkbox"
                          type="checkbox"
                          value=""
                          className="accent-primary-100"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TitleHistory;
