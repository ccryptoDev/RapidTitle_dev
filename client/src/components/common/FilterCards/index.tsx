import React, { BaseSyntheticEvent, useState } from 'react';
import './index.view.css';
import downArrow from 'assets/icons/chevronDown.svg';
import building from 'assets/icons/buildingIcon.svg';
import refreshIcon from 'assets/icons/refreshIcon.svg';
import graphIcon from 'assets/icons/circleProcessIcon.svg';
import warning from 'assets/icons/warningIcon.svg';
import chartValueOverTime from 'assets/img/charts/GraphValueOverTime.png';
import chartValueOverTime2 from 'assets/img/charts/GraphValueOverTime2.png';
import ArrowDown from 'components/icons/ArrowDown';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

function FilterCards() {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title
  );

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false
    },
    stacked: false,
    plugins: {
      title: {
        display: false,
        text: 'Value Over Time'
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };

  const labels = ['11/25', '12/10', '12/15', '12/20', '12/30'];

  const LineData = {
    labels,
    datasets: [
      {
        label: 'blue',
        data: [70, 83, 79, 87, 76],
        borderColor: '#FF3366',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        lineTension: 0.4,
        yAxisID: 'y'
      },
      {
        label: 'gray1',
        data: [30, 53, 69, 47, 76],
        borderColor: 'gray',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y1',
        lineTension: 0.4
      }
    ]
  };

  const data = {
    labels: [],
    datasets: [
      {
        label: '',
        data: [29, 71],
        backgroundColor: ['rgba(75, 85, 99, 0.3 )', 'rgba(255, 99, 132, 0.3)'],
        borderColor: ['rgba(75, 85, 99, 1 )', 'rgba(255, 99, 132, 1)'],
        borderWidth: 0.5
      }
    ]
  };

  return (
    <div className="flex flex-col justify-evenly min-w-[320px]">
      <div className="mb-2 pt-3 pb-[30px] px-4 bg-primary-0 drop-shadow-card rounded-xl ">
        {/* first filter */}
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold text-accent1-100">Current Store</h4>
          <button type="button">
            <img src={downArrow} alt="down arrow icon" />
          </button>
        </div>
        <div className="flex justify-between items-center">
          <p className="font-bold">Los Angeles HQ</p>
          <img src={building} alt="building icon" />
        </div>
      </div>
      {/* second filter */}
      <div className="mb-5 pt-3 pb-[30px] px-4 bg-primary-0 drop-shadow-card rounded-xl ">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold text-accent1-100">
            Current Titles Value
          </h4>
          <button type="button">
            <img src={refreshIcon} alt="refresh icon" />
          </button>
        </div>
        <div className="flex justify-between items-center">
          <p className="font-bold">
            2,855 <span className="text-secondary-40"> Titles</span>
          </p>
          <p className="text-secondary-40">&rarr;</p>
          <p className="font-bold">
            81,693,224 <span className="text-secondary-40"> USD</span>
          </p>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <img
            src={graphIcon}
            alt="graph icon"
            className="w-[49px] h-[49px] drop-shadow-pink"
          />

          <div className="flex flex-col">
            <p className="">30% of Titles</p>
            <h2 className="text-xs text-secondary-40">Are pending</h2>
          </div>

          <img src={warning} alt="warning icon" />
        </div>
      </div>
      {/* last filter */}
      <div className="pt-3 pb-[30px] px-4 bg-primary-0 border border-primary-10 rounded-xl ">
        <div className="flex justify-between items-center mb-1">
          <p className="">Value Over Time</p>
          <div className="flex items-center">
            <button className="h-7 px-2 bg-secondary-100 text-primary-0 font-bold rounded ">
              <p className="font-medium text-sm">30 Days</p>
            </button>
            <ArrowDown stroke="#333399" />
          </div>
        </div>
        <div className="mt-3">
          {/* TODO: add the functionality to toggle between images and fix checkbox styles */}
          <img
            src={isChecked ? chartValueOverTime2 : chartValueOverTime}
            alt="chart value over time"
          />
          {/* <Line options={options} data={LineData} height={250} width={400} /> */}
        </div>
        <div className="mt-7 flex justify-between items-center text-sm">
          <div className="flex items-center gap-1">
            <input
              type="checkbox"
              name="value"
              id="value"
              checked
              className=" accent-accent1-100"
            />
            <label htmlFor="value" className="font-bold">
              Value
            </label>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="checkbox"
              name="floorPlan"
              id="floorPlan"
              className="accent-secondary-30"
              onChange={() => setIsChecked((prev) => !prev)}
            />
            <label htmlFor="floorPlan" className="text-secondary-50 font-bold">
              FloorPlan
            </label>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-accent1-100 shadow-pink rounded-full"></div>
            <p className="text-secondary-50">12/25/2022</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterCards;
