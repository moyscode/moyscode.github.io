const MARGIN = { LEFT: 60, RIGHT: 20, TOP: 20, BOTTOM: 40 };
const WIDTH = 550 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 300 - MARGIN.TOP - MARGIN.BOTTOM;

const ticksAmount = 5,
  minTicks = 5,
  maxTicks = 170;
const tickStep = (maxTicks - minTicks) / ticksAmount;
const step = Math.ceil(tickStep / 5) * 5;

const STATICDATA = [
  {
    reservoir: "Linganamakki",
    baseline: {
      fullLevelHeight: "554.44",
      grossCapacity: "151.75",
      reservoirCategory: "Hydel",
    },
  },
  {
    reservoir: "Supa",
    baseline: {
      fullLevelHeight: "564",
      grossCapacity: "145.33",
      reservoirCategory: "Hydel",
    },
  },
  {
    reservoir: "Varahi",
    baseline: {
      fullLevelHeight: "594.36",
      grossCapacity: "31.1",
      reservoirCategory: "Hydel",
    },
  },
  {
    reservoir: "Harangi",
    baseline: {
      fullLevelHeight: "871.38",
      grossCapacity: "8.5",
      reservoirCategory: "CauveryBasin",
    },
  },
  {
    reservoir: "Hemavathi",
    baseline: {
      fullLevelHeight: "890.58",
      grossCapacity: "37.1",
      reservoirCategory: "CauveryBasin",
    },
  },
  {
    reservoir: "KRS",
    baseline: {
      fullLevelHeight: "38.04",
      grossCapacity: "49.45",
      reservoirCategory: "CauveryBasin",
    },
  },
  {
    reservoir: "Kabini",
    baseline: {
      fullLevelHeight: "696.13",
      grossCapacity: "19.52",
      reservoirCategory: "CauveryBasin",
    },
  },
  {
    reservoir: "Bhadra",
    baseline: {
      fullLevelHeight: "657.73",
      grossCapacity: "71.54",
      reservoirCategory: "KrishnaBasin",
    },
  },
  {
    reservoir: "Tungabhadra",
    baseline: {
      fullLevelHeight: "497.71",
      grossCapacity: "100.86",
      reservoirCategory: "KrishnaBasin",
    },
  },
  {
    reservoir: "Ghataprabha",
    baseline: {
      fullLevelHeight: "662.91",
      grossCapacity: "51",
      reservoirCategory: "KrishnaBasin",
    },
  },
  {
    reservoir: "Malaprabha",
    baseline: {
      fullLevelHeight: "633.8",
      grossCapacity: "37.73",
      reservoirCategory: "KrishnaBasin",
    },
  },
  {
    reservoir: "Almatti",
    baseline: {
      fullLevelHeight: "519.6",
      grossCapacity: "123.08",
      reservoirCategory: "KrishnaBasin",
    },
  },
  {
    reservoir: "Narayanapura",
    baseline: {
      fullLevelHeight: "492.25",
      grossCapacity: "33.31",
      reservoirCategory: "KrishnaBasin",
    },
  },
];

const COLORS = {
  Linganamakki: "#2be619",
  Supa: "#1ea112",
  Varahi: "#115c0a",
  Harangi: "#8ca9f3",
  Hemavathi: "#4675ec",
  KRS: "#1853e7",
  Kabini: "#1342b9",
  Bhadra: "#f5c1a3",
  Tungabhadra: "#f0a275",
  Ghataprabha: "#ec8346",
  Malaprabha: "#e76418",
  Almatti: "#b95013",
  Narayanapura: "#8a3c0f",
  "#KB-chart": "#fcdfcf",
  "#combined-chart": "hsla(43, 14%, 90%, 0.8)",
  "#CB-chart": "#cfdcfc",
  "#hydel-chart": "#d2fccf",
};

const BACKGROUNDCOLORS = {
  CauveryBasin: "#cfdcfc",
  Hydel: "#d2fccf",
  KrishnaBasin: "#fcdfcf",
};

const FONTSIZE = {
  "axis-label": "12px",
  "legend-text": "10px",
  "tool-tip-header": "12px",
  "tool-tip-content": "12px",
};

// Constants to parse date
const dateParse = d3.timeParse("%e-%b-%y"),
  formatTime = d3.timeFormat("%e%b%y");
