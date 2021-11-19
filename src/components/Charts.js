import React from "react";
import Chartist from "react-chartist";
import ChartistTooltip from "chartist-plugin-tooltips-updated";
import { Bar, Line } from "react-chartjs-2";

export const SalesValueChart = (props) => {
  const data = {
    labels: props.labels,
    datasets: [
      {
        label: "",
        data: props.series,
        fill: false,
        backgroundColor: "rgba(7,113,171, 1)",
        borderColor: "rgba(7,113,171, 0.2)",
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
      },
    },
    aspectRatio: 1.4,
    scales: {
      x: {
        grid: {
          tickColor: "transparent",
        },
      },
      y: {
        grid: {
          tickColor: "transparent",
        },
        beginAtZero: false,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export const SalesValueChartphone = () => {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    series: [[1, 2, 2, 3, 3, 4, 3]],
  };

  const options = {
    low: 0,
    showArea: true,
    fullWidth: false,
    axisX: {
      position: "end",
      showGrid: true,
    },
    axisY: {
      // On the y-axis start means left and end means right
      showGrid: false,
      showLabel: false,
      labelInterpolationFnc: (value) => `$${value / 1}k`,
    },
  };

  const plugins = [ChartistTooltip()];

  return (
    <Chartist
      data={data}
      options={{ ...options, plugins }}
      type="Line"
      className="ct-series-g ct-major-tenth"
    />
  );
};

export const CircleChart = (props) => {
  const { series = [], donutWidth = 20 } = props;
  const sum = (a, b) => a + b;

  const options = {
    low: 0,
    high: 8,
    donutWidth,
    donut: true,
    donutSolid: true,
    fullWidth: false,
    showLabel: false,
    labelInterpolationFnc: (value) =>
      `${Math.round((value / series.reduce(sum)) * 100)}%`,
  };

  const plugins = [ChartistTooltip()];

  return (
    <Chartist
      data={{ series }}
      options={{ ...options, plugins }}
      type="Pie"
      className="ct-golden-section"
    />
  );
};

export const BarChart = (props) => {
  const data = {
    labels: props.labels,
    datasets: [
      {
        label: "",
        data: props.series,
        backgroundColor: "rgba(7,113,171, 1)",
        borderColor: "rgba(7,113,171, 0.2)",
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        displayColors: false,
      },
      legend: {
        display: false,
      },
    },
    aspectRatio: 1.4,
    autoSkip: false,
    scales: {
      x: {
        ticks: {
          callback: function (label, index) {
            return props.labels[label]
              .split(" ")
              .reduce((a, b) => a + " " + b.substring(0, 3) + ".", "");
          },
        },
        grid: {
          color: "transparent",
          tickColor: "transparent",
        },
      },
    },
  };

  return (
    // <div style={{ height: "500px" }}>
    <Bar width={"100%"} data={data} options={options} />
    // </div>
  );
};
