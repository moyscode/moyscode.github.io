let combinedChart;
let CBChart;
let hydelChart;
let KBChart;

let combinedCapacityChart;
let CBCapacityChart;
let hydelCapacityChart;
let KBCapacityChart;

// function to get all values of a key at all levels in an object of objects
// function findAllByKey(obj, keyToFind) {
//   return Object.entries(obj).reduce(
//     (acc, [key, value]) =>
//       key === keyToFind
//         ? acc.concat(value)
//         : typeof value === "object"
//         ? acc.concat(findAllByKey(value, keyToFind))
//         : acc,
//     []
//   );
// }

// function to get all values of a key at all levels in an array of objects
function getValue(obj, findKey) {
  const output = [];

  for (const key in obj) {
    if (key === findKey) output.push(obj[key]);
    else if (typeof obj[key] === "object")
      output.push(...getValue(obj[key], findKey));
  }

  return output;
}

function getData(data, resv = "") {
  if (resv) return data[resv].details;
  return Object.values(data).flatMap((arr) => arr.details);
}

d3.csv("./data/info.csv").then((data) => {
  // prepare and clean data
  const dataset = d3.groups(data, (d) => d.item);
  const presentReservoirLevelData = dataset[0][1];
  const presentStorageData = dataset[1][1];
  const inFlowData = dataset[2][1];
  const outFlowData = dataset[3][1];

  console.log(presentStorageData);
  console.log(presentReservoirLevelData);

  const chartData = STATICDATA.reduce((acc, h) => {
    const cur = presentStorageData.find((c) => c.reservoir === h.reservoir);
    const reservoirCategory = h.baseline.reservoirCategory;
    const keys = Object.keys(cur).filter(
      (key) => key !== "reservoir" && key !== "item"
    );
    const values = keys.map((key) => ({
      date: dateParse(key),
      storageLevel: +((cur[key] / h.baseline.grossCapacity) * 100).toFixed(1),
    }));

    if (acc[reservoirCategory]) {
      acc[reservoirCategory].details.push({
        reservoir: h.reservoir,
        values: values,
      });
    } else {
      acc[reservoirCategory] = {
        details: [
          {
            reservoir: h.reservoir,
            values: values,
          },
        ],
      };
    }

    return acc;
  }, {});

  const capacityChartData = STATICDATA.reduce((acc, h) => {
    const cur = presentReservoirLevelData.find(
      (c) => c.reservoir === h.reservoir
    );
    const reservoirCategory = h.baseline.reservoirCategory;
    const keys = Object.keys(cur).filter(
      (key) => key !== "reservoir" && key !== "item"
    );
    const values = keys.map((key) => ({
      date: dateParse(key),
      waterLevel: +(cur[key] - h.baseline.fullLevelHeight).toFixed(2),
    }));

    if (acc[reservoirCategory]) {
      acc[reservoirCategory].details.push({
        reservoir: h.reservoir,
        values: values,
      });
    } else {
      acc[reservoirCategory] = {
        details: [
          {
            reservoir: h.reservoir,
            values: values,
          },
        ],
      };
    }

    return acc;
  }, {});

  const storageData = STATICDATA.reduce((acc, h) => {
    const cur = presentStorageData.find((c) => c.reservoir === h.reservoir);
    const reservoirCategory = h.baseline.reservoirCategory;
    const keys = Object.keys(cur).filter(
      (key) => key !== "reservoir" && key !== "item"
    );
    const values = keys.map((key) => ({
      date: dateParse(key),
      storage: +cur[key],
    }));

    if (acc[reservoirCategory]) {
      acc[reservoirCategory].details.push({
        reservoir: h.reservoir,
        values: values,
      });
    } else {
      acc[reservoirCategory] = {
        details: [
          {
            reservoir: h.reservoir,
            values: values,
          },
        ],
      };
    }

    return acc;
  }, {});

  $(document).ready(updateCharts);

  $("#var-select").on("change", updateCharts);

  function updateCharts() {
    switch ($("#var-select").val()) {
      case "water-level":
        combinedCapacityChart = new WaterLevelChart(
          "#combined-chart",
          "",
          capacityChartData
        );
        CBCapacityChart = new WaterLevelChart(
          "#CB-chart",
          "CauveryBasin",
          capacityChartData
        );
        hydelCapacityChart = new WaterLevelChart(
          "#hydel-chart",
          "Hydel",
          capacityChartData
        );
        KBCapacityChart = new WaterLevelChart(
          "#KB-chart",
          "KrishnaBasin",
          capacityChartData
        );
        break;

      case "storage-quantity": {
        combinedStorageChart = new StorageQuantityChart(
          "#combined-chart",
          "",
          storageData
        );
        CBStorageChart = new StorageQuantityChart(
          "#CB-chart",
          "CauveryBasin",
          storageData
        );
        hydelStorageChart = new StorageQuantityChart(
          "#hydel-chart",
          "Hydel",
          storageData
        );
        KBStorageChart = new StorageQuantityChart(
          "#KB-chart",
          "KrishnaBasin",
          storageData
        );
        break;
      }
      case "storage-level": {
        combinedChart = new StorageLevelChart("#combined-chart", "", chartData);
        CBChart = new StorageLevelChart("#CB-chart", "CauveryBasin", chartData);
        hydelChart = new StorageLevelChart("#hydel-chart", "Hydel", chartData);
        KBChart = new StorageLevelChart("#KB-chart", "KrishnaBasin", chartData);
        break;
      }
    }
  }
});
