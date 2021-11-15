import React from "react";
import Chartist from "react-chartist";
import ChartistTooltip from "chartist-plugin-tooltips-updated";

export const SalesValueChart = (props) => {
  const data = {
    labels: props.labels,
    series: props.series,
  };

  const options = {
    low: 75,
    showArea: true,
    fullWidth: true,
    fullHeight: true,
    axisX: {
      position: "end",
      showGrid: true,
    },
    axisY: {
      // On the y-axis start means left and end means right
      showGrid: false,
      showLabel: true,
      labelInterpolationFnc: (value) => `${value / 1}€`,
    },
  };

  const plugins = [ChartistTooltip()];

  return (
    <Chartist
      data={data}
      options={{ ...options, plugins }}
      type="Line"
      className="ct-golden-section"
    />
  );
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
  const {
    labels1 = [],
    series1 = [],
    chartClassName = "ct-golden-section",
  } = props;

  const labels = ["Werk 1", "Werk 2", "Werk 3"];
  const series = [200, 150, 320];
  const data = { labels, series };

  const options = {
    low: 100,
    showArea: true,
    axisX: {
      position: "end",
    },
    axisY: {
      showGrid: true,
      showLabel: true,
    },
    distributeSeries: true,
  };

  const plugins = [ChartistTooltip()];

  return (
    <Chartist
      data={data}
      options={{ ...options, plugins }}
      type="Bar"
      className={chartClassName}
    />
  );
};
