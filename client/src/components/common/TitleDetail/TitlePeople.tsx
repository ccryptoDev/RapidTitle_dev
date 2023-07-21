import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import './index.view.css';
import { useNavigate } from 'react-router-dom';
import { loadHoldenPeople } from 'store/actions/title';
import badgePeople3 from 'assets/icons/badgePeople3.svg';
import badgePeople4 from 'assets/icons/badgePeople4.svg';
import imagepeople4 from 'assets/img/titledetail-people/imagepeople4.png';
import imagepeople5 from 'assets/img/titledetail-people/imagepeople5.png';

function TitlePeople() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  useEffect(() => {
    const cb = async () => {
      const data = await loadHoldenPeople();
      //@ts-ignore
      setData(data.slice(0, 4));
    };
    cb();
  }, []);

  return (
    <div className="p-1 max-h-[590px] overflow-x-scroll w-[990px]">
      <div className="p-1 h-full">
        <div className="flex gap-5 overflow-x-auto shadow-md rounded-lg ">
          {data.map((record: any, index: number) => {
            return (
              <div className="min-w-[259px] rounded-md  bg-secondary-90">
                <div className="p-2 w-full h-[44px]">
                  {index === 2 ? (
                    <img src={badgePeople3} alt="logo" />
                  ) : index === 3 ? (
                    <img src={badgePeople4} alt="logo" />
                  ) : (
                    <img src={record.sales_image} alt="logo" />
                  )}
                </div>
                {index === 2 ? (
                  <img
                    src={imagepeople5}
                    alt="logo"
                    className="w-[259px] h-[219px]"
                  />
                ) : index === 3 ? (
                  <img
                    src={imagepeople4}
                    alt="logo"
                    className="w-[259px] h-[219px]"
                  />
                ) : (
                  <img
                    src={record.sales_logo}
                    alt="logo"
                    className="w-[259px] h-[219px]"
                  />
                )}
                <div className="py-4 px-3 mb-10">
                  <p className="text-primary-40 text-xs">
                    {index === 1
                      ? 'DMV ID'
                      : index === 2
                      ? 'SALESPERSON ID:'
                      : index === 3
                      ? 'STORE ID:'
                      : 'BANK ID:'}{' '}
                    {record.bank_id}
                  </p>
                  <p className="text-primary-0 text-[26px]">
                    {index === 2
                      ? 'Salesperson'
                      : index === 3
                      ? 'Sacramento'
                      : `${record.seller}`}
                  </p>
                  <p className="text-accent1-90 text-lg">
                    {index === 2
                      ? 'Dealership'
                      : index === 3
                      ? 'Dealership Store'
                      : `${record.seller_name}`}
                  </p>
                  <div className="flex flex-col gap-1">
                    <p className="text-secondary-20 text-sm">
                      Title Associated: {record.title_accociated}
                    </p>
                    <p className="text-secondary-20 text-sm">
                      Date of Title Affiliation: {record.affiliation_date}
                    </p>
                    <p className="text-secondary-20 text-sm">
                      {index === 2
                        ? 'Salesperson position: Senior'
                        : `Representative: ${record.representive}`}
                    </p>
                  </div>
                </div>

                <p className="mb-7 w-[142px] h-[34px] flex justify-center items-center whitespace-nowrap mx-auto rounded-md bg-secondary-100 cursor-pointer text-primary-0 text-sm font-bold">
                  See Digital Identity
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TitlePeople;
