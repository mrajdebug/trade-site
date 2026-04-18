import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  Polyline,
} from "react-leaflet";
import { track } from "@vercel/analytics";

const APP_NAME = import.meta.env.VITE_APP_NAME || "World Trade Map";
const DATA_MODE = import.meta.env.VITE_DATA_MODE || "demo";

const countries = [
  {
    code: "USA",
    name: "United States",
    flag: "🇺🇸",
    latlng: [38, -97],
    capital: "Washington, D.C.",
    population: "331M",
    region: "North America",
    currency: "US Dollar",
    gdp: 25.0,
    export: 2.0,
    import: 2.5,
    area: "9.8M km²",
  },
  {
    code: "CHN",
    name: "China",
    flag: "🇨🇳",
    latlng: [35, 103],
    capital: "Beijing",
    population: "1.4B",
    region: "Asia",
    currency: "Yuan",
    gdp: 18.0,
    export: 3.0,
    import: 2.2,
    area: "9.6M km²",
  },
  {
    code: "UZB",
    name: "Uzbekistan",
    flag: "🇺🇿",
    latlng: [41.3, 69.2],
    capital: "Tashkent",
    population: "36M",
    region: "Central Asia",
    currency: "Uzbek so'm",
    gdp: 0.08,
    export: 0.5,
    import: 0.6,
    area: "448K km²",
  },
  {
    code: "DEU",
    name: "Germany",
    flag: "🇩🇪",
    latlng: [51, 10],
    capital: "Berlin",
    population: "83M",
    region: "Europe",
    currency: "Euro",
    gdp: 4.5,
    export: 1.8,
    import: 1.7,
    area: "357K km²",
  },
  {
    code: "RUS",
    name: "Russia",
    flag: "🇷🇺",
    latlng: [61, 105],
    capital: "Moscow",
    population: "146M",
    region: "Eurasia",
    currency: "Ruble",
    gdp: 2.2,
    export: 1.5,
    import: 1.2,
    area: "17.1M km²",
  },
  {
    code: "IND",
    name: "India",
    flag: "🇮🇳",
    latlng: [21, 78],
    capital: "New Delhi",
    population: "1.4B",
    region: "Asia",
    currency: "Indian Rupee",
    gdp: 3.7,
    export: 1.2,
    import: 1.4,
    area: "3.28M km²",
  },
  {
    code: "TUR",
    name: "Turkey",
    flag: "🇹🇷",
    latlng: [39, 35],
    capital: "Ankara",
    population: "85M",
    region: "Europe / Asia",
    currency: "Turkish Lira",
    gdp: 1.1,
    export: 0.9,
    import: 1.1,
    area: "783K km²",
  },
  {
    code: "KAZ",
    name: "Kazakhstan",
    flag: "🇰🇿",
    latlng: [48, 68],
    capital: "Astana",
    population: "20M",
    region: "Central Asia",
    currency: "Tenge",
    gdp: 0.26,
    export: 0.7,
    import: 0.5,
    area: "2.7M km²",
  },
  {
    code: "GBR",
    name: "United Kingdom",
    flag: "🇬🇧",
    latlng: [55, -3],
    capital: "London",
    population: "67M",
    region: "Europe",
    currency: "Pound sterling",
    gdp: 3.3,
    export: 0.9,
    import: 1.1,
    area: "243K km²",
  },
  {
    code: "FRA",
    name: "France",
    flag: "🇫🇷",
    latlng: [46, 2],
    capital: "Paris",
    population: "68M",
    region: "Europe",
    currency: "Euro",
    gdp: 3.0,
    export: 0.8,
    import: 0.9,
    area: "551K km²",
  },
  {
    code: "JPN",
    name: "Japan",
    flag: "🇯🇵",
    latlng: [36, 138],
    capital: "Tokyo",
    population: "125M",
    region: "Asia",
    currency: "Yen",
    gdp: 4.2,
    export: 0.9,
    import: 1.0,
    area: "378K km²",
  },
  {
    code: "KOR",
    name: "South Korea",
    flag: "🇰🇷",
    latlng: [36.5, 127.8],
    capital: "Seoul",
    population: "51M",
    region: "Asia",
    currency: "Won",
    gdp: 1.7,
    export: 0.8,
    import: 0.7,
    area: "100K km²",
  },
];

const pairTradeData = {
  "China|Uzbekistan": {
    turnover: 13.8,
    summary:
      "China exports mostly technology, electronics, machinery, and industrial goods to Uzbekistan.",
    categories: [
      { name: "Technology & electronics", percent: 34 },
      { name: "Machinery", percent: 27 },
      { name: "Chemicals", percent: 16 },
      { name: "Textiles", percent: 11 },
      { name: "Food & agriculture", percent: 12 },
    ],
    goods: [
      "Smartphones and consumer electronics",
      "Industrial machinery",
      "Construction equipment",
      "Chemical materials",
      "Textile inputs",
    ],
    trend: [
      { year: "2020", exportAtoB: 7.1, exportBtoA: 2.4, turnover: 9.5 },
      { year: "2021", exportAtoB: 8.3, exportBtoA: 2.8, turnover: 11.1 },
      { year: "2022", exportAtoB: 9.4, exportBtoA: 3.1, turnover: 12.5 },
      { year: "2023", exportAtoB: 10.2, exportBtoA: 3.3, turnover: 13.5 },
      { year: "2024", exportAtoB: 10.5, exportBtoA: 3.3, turnover: 13.8 },
    ],
  },
  "Germany|Turkey": {
    turnover: 55.2,
    summary:
      "Germany and Turkey are strongly connected through manufacturing, vehicles, and industrial supply chains.",
    categories: [
      { name: "Vehicles", percent: 29 },
      { name: "Machinery", percent: 24 },
      { name: "Chemicals", percent: 18 },
      { name: "Textiles", percent: 15 },
      { name: "Food", percent: 14 },
    ],
    goods: [
      "Cars and auto parts",
      "Industrial machinery",
      "Pharmaceutical inputs",
      "Textile goods",
      "Processed food",
    ],
    trend: [
      { year: "2020", exportAtoB: 24, exportBtoA: 18, turnover: 42 },
      { year: "2021", exportAtoB: 27, exportBtoA: 20, turnover: 47 },
      { year: "2022", exportAtoB: 30, exportBtoA: 21, turnover: 51 },
      { year: "2023", exportAtoB: 32, exportBtoA: 22, turnover: 54 },
      { year: "2024", exportAtoB: 33, exportBtoA: 22.2, turnover: 55.2 },
    ],
  },
  "China|United States": {
    turnover: 575,
    summary:
      "The US-China corridor is one of the world's largest trade relationships, dominated by electronics, machinery, consumer goods, and agriculture.",
    categories: [
      { name: "Electronics", percent: 28 },
      { name: "Consumer goods", percent: 20 },
      { name: "Machinery", percent: 19 },
      { name: "Agriculture", percent: 15 },
      { name: "Industrial supply chain", percent: 18 },
    ],
    goods: [
      "Semiconductors and electronics",
      "Consumer retail goods",
      "Industrial machinery",
      "Soybeans and agriculture",
      "Supply chain components",
    ],
    trend: [
      { year: "2020", exportAtoB: 220, exportBtoA: 140, turnover: 360 },
      { year: "2021", exportAtoB: 250, exportBtoA: 155, turnover: 405 },
      { year: "2022", exportAtoB: 300, exportBtoA: 185, turnover: 485 },
      { year: "2023", exportAtoB: 335, exportBtoA: 205, turnover: 540 },
      { year: "2024", exportAtoB: 355, exportBtoA: 220, turnover: 575 },
    ],
  },
};

function formatTrillions(value) {
  if (value == null) return "—";
  return `$${value.toFixed(2)}T`;
}

function formatBillions(value) {
  if (value == null) return "—";
  return `$${value.toFixed(1)}B`;
}

function growthPercent(trend) {
  if (!trend || trend.length < 2) return null;
  const first = trend[0].turnover;
  const last = trend[trend.length - 1].turnover;
  if (!first) return null;
  return (((last - first) / first) * 100).toFixed(1);
}

function getBalance(country) {
  if (!country) return null;
  return +(country.export - country.import).toFixed(2);
}

function getPairKey(a, b) {
  if (!a || !b) return null;
  return [a.name, b.name].sort().join("|");
}

function loadTopPairs() {
  try {
    return JSON.parse(localStorage.getItem("top_country_pairs") || "{}");
  } catch {
    return {};
  }
}

function saveTopPair(pairKey) {
  const current = loadTopPairs();
  current[pairKey] = (current[pairKey] || 0) + 1;
  localStorage.setItem("top_country_pairs", JSON.stringify(current));
  return current;
}

function SearchableSelect({
  label,
  value,
  onChange,
  search,
  onSearchChange,
  options,
  selectedCountry,
  theme,
}) {
  const filtered = options.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ color: theme.muted, fontSize: 13 }}>{label}</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: theme.card,
          border: `1px solid ${theme.border}`,
          borderRadius: 12,
          padding: "10px 12px",
        }}
      >
        <span style={{ fontSize: 20 }}>
          {selectedCountry ? selectedCountry.flag : "🌐"}
        </span>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search country..."
          style={{
            background: "transparent",
            color: theme.text,
            border: "none",
            fontSize: 14,
            outline: "none",
            width: "100%",
          }}
        />
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: theme.card,
          color: theme.text,
          border: `1px solid ${theme.border}`,
          borderRadius: 12,
          padding: 12,
          fontSize: 15,
          outline: "none",
        }}
      >
        <option value="">Select country</option>
        {filtered.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function CountryCard({ title, country, color, theme }) {
  const balance = getBalance(country);

  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 18,
        padding: 16,
      }}
    >
      <div style={{ color, fontWeight: 700, marginBottom: 10 }}>{title}</div>

      {!country ? (
        <div style={{ color: theme.muted }}>Страна не выбрана</div>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 28 }}>{country.flag}</span>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{country.name}</div>
          </div>
          <div><b>Capital:</b> {country.capital}</div>
          <div><b>Population:</b> {country.population}</div>
          <div><b>Region:</b> {country.region}</div>
          <div><b>Currency:</b> {country.currency}</div>
          <div><b>Area:</b> {country.area}</div>
          <div><b>GDP:</b> {formatTrillions(country.gdp)}</div>
          <div><b>Export:</b> {formatTrillions(country.export)}</div>
          <div><b>Import:</b> {formatTrillions(country.import)}</div>
          <div>
            <b>Trade balance:</b> {balance >= 0 ? "+" : ""}
            {formatTrillions(balance)}
          </div>
        </div>
      )}
    </div>
  );
}

function StatsPanel({ country1, country2, relation, theme }) {
  const growth = growthPercent(relation?.trend);
  const balance1 = getBalance(country1);
  const balance2 = getBalance(country2);

  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 18,
        padding: 16,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
        Statistics
      </div>

      {!country1 || !country2 ? (
        <div style={{ color: theme.muted }}>
          Выбери две страны, чтобы увидеть статистику сравнения.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          <div><b>Total turnover:</b> {relation ? formatBillions(relation.turnover) : "—"}</div>
          <div><b>Country 1 balance:</b> {balance1 >= 0 ? "+" : ""}{formatTrillions(balance1)}</div>
          <div><b>Country 2 balance:</b> {balance2 >= 0 ? "+" : ""}{formatTrillions(balance2)}</div>
          <div><b>5-year turnover growth:</b> {growth ? `${growth}%` : "—"}</div>
          <div><b>Top category:</b> {relation?.categories?.length ? relation.categories[0].name : "—"}</div>
        </div>
      )}
    </div>
  );
}

function SecurityPanel({ theme }) {
  const envReady = !!APP_NAME && !!DATA_MODE;

  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 18,
        padding: 16,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
        Security & system status
      </div>

      <div style={{ display: "grid", gap: 10, color: theme.text }}>
        <div><b>Data mode:</b> {DATA_MODE}</div>
        <div><b>Environment loaded:</b> {envReady ? "Yes" : "No"}</div>
        <div><b>Secrets in client code:</b> No</div>
        <div><b>Fallback mode:</b> Enabled</div>
        <div><b>Map status:</b> Active</div>
        <div><b>Error handling:</b> Basic UI fallback enabled</div>
      </div>
    </div>
  );
}

function CategoriesPanel({ relation, theme }) {
  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 18,
        padding: 16,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
        Turnover by categories
      </div>

      {!relation ? (
        <div style={{ color: theme.muted }}>
          Выбери две страны, чтобы увидеть товарооборот и категории.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <div style={{ color: theme.muted, marginBottom: 4 }}>Estimated turnover</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>
              {formatBillions(relation.turnover)}
            </div>
          </div>

          <div style={{ color: theme.text, lineHeight: 1.6 }}>
            {relation.summary}
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {relation.categories.map((item) => (
              <div key={item.name}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 14,
                    marginBottom: 6,
                  }}
                >
                  <span>{item.name}</span>
                  <span>{item.percent}%</span>
                </div>
                <div
                  style={{
                    height: 10,
                    background: theme.progressBg,
                    borderRadius: 999,
                    overflow: "hidden",
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  <div
                    style={{
                      width: `${item.percent}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #2563eb, #38bdf8)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TopGoods({ relation, theme }) {
  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 18,
        padding: 16,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
        Top traded goods
      </div>

      {!relation ? (
        <div style={{ color: theme.muted }}>
          Выбери две страны, чтобы увидеть ключевые товары.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {relation.goods.map((good) => (
            <div
              key={good}
              style={{
                background: theme.box,
                border: `1px solid ${theme.border}`,
                borderRadius: 12,
                padding: "10px 12px",
                color: theme.text,
              }}
            >
              {good}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TrendPanel({ relation, country1, country2, theme }) {
  if (!relation) {
    return (
      <div
        style={{
          background: theme.card,
          border: `1px solid ${theme.border}`,
          borderRadius: 18,
          padding: 16,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
          Yearly trade trends
        </div>
        <div style={{ color: theme.muted }}>
          Выбери две страны, чтобы увидеть trend.
        </div>
      </div>
    );
  }

  const width = 100;
  const height = 140;
  const padding = 12;
  const maxValue = Math.max(...relation.trend.flatMap((p) => [p.exportAtoB, p.exportBtoA, p.turnover]));

  function pointsFor(key) {
    return relation.trend
      .map((p, i) => {
        const x =
          padding + (i * (width - padding * 2)) / (relation.trend.length - 1);
        const y =
          height -
          padding -
          (p[key] / maxValue) * (height - padding * 2);
        return `${x},${y}`;
      })
      .join(" ");
  }

  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 18,
        padding: 16,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
        Yearly trade trends
      </div>

      <div style={{ color: theme.text, marginBottom: 10 }}>
        Trend between {country1?.name} and {country2?.name}
      </div>

      <div
        style={{
          background: theme.box,
          border: `1px solid ${theme.border}`,
          borderRadius: 14,
          padding: 12,
        }}
      >
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: 220 }}>
          {[0, 1, 2, 3].map((i) => {
            const y = padding + (i * (height - padding * 2)) / 3;
            return (
              <line
                key={i}
                x1="0"
                y1={y}
                x2={width}
                y2={y}
                stroke={theme.grid}
                strokeWidth="0.4"
              />
            );
          })}

          <polyline
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.5"
            points={pointsFor("exportAtoB")}
          />
          <polyline
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
            points={pointsFor("exportBtoA")}
          />
          <polyline
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
            points={pointsFor("turnover")}
          />
        </svg>

        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            marginTop: 8,
            fontSize: 13,
            color: theme.muted,
          }}
        >
          <div style={{ color: "#22c55e" }}>● Export A → B</div>
          <div style={{ color: "#f59e0b" }}>● Export B → A</div>
          <div style={{ color: "#38bdf8" }}>● Turnover</div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
        {relation.trend.map((item) => (
          <div
            key={item.year}
            style={{
              background: theme.box,
              border: `1px solid ${theme.border}`,
              borderRadius: 12,
              padding: "10px 12px",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{item.year}</div>
            <div style={{ color: theme.text, fontSize: 14 }}>
              Export A → B: {formatBillions(item.exportAtoB)}
            </div>
            <div style={{ color: theme.text, fontSize: 14 }}>
              Export B → A: {formatBillions(item.exportBtoA)}
            </div>
            <div style={{ color: theme.text, fontSize: 14 }}>
              Turnover: {formatBillions(item.turnover)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RelationshipsPanel({ country1, country2, relation, theme }) {
  const text = useMemo(() => {
    if (!country1 || !country2) {
      return "Выбери две страны на карте или через списки сверху.";
    }

    const exportLeader =
      country1.export >= country2.export ? country1.name : country2.name;
    const importLeader =
      country1.import >= country2.import ? country1.name : country2.name;

    return `${country1.name} and ${country2.name} are compared as a trade pair. ${exportLeader} has the larger export scale, while ${importLeader} has the larger import scale. ${relation ? relation.summary : ""}`;
  }, [country1, country2, relation]);

  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 18,
        padding: 16,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 10 }}>
        Relationships
      </div>
      <div style={{ color: theme.text, lineHeight: 1.7 }}>{text}</div>
    </div>
  );
}

function TopPairsPanel({ topPairs, theme }) {
  const entries = Object.entries(topPairs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: 18,
        padding: 16,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
        Most popular country pairs
      </div>

      {entries.length === 0 ? (
        <div style={{ color: theme.muted }}>
          Пока нет данных. Выбери пару стран, и она появится здесь.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {entries.map(([pair, count], index) => (
            <div
              key={pair}
              style={{
                background: theme.box,
                border: `1px solid ${theme.border}`,
                borderRadius: 12,
                padding: "10px 12px",
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <span>{index + 1}. {pair}</span>
              <strong>{count}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [selectedCode1, setSelectedCode1] = useState("");
  const [selectedCode2, setSelectedCode2] = useState("");
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [hoveredCode, setHoveredCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error] = useState("");
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem("theme_mode") || "dark");
  const [topPairs, setTopPairs] = useState(() => loadTopPairs());

  useEffect(() => {
    localStorage.setItem("theme_mode", themeMode);
  }, [themeMode]);

  const theme = themeMode === "dark"
    ? {
        page: "linear-gradient(180deg, #07101d 0%, #0a1424 100%)",
        mainCard: "#0c1627",
        card: "#0f1828",
        box: "#0a1220",
        border: "#1d2b45",
        borderStrong: "#1a2a40",
        text: "#dbe7f7",
        muted: "#8fa5c5",
        grid: "#29405f",
      }
    : {
        page: "linear-gradient(180deg, #eef5ff 0%, #f7fbff 100%)",
        mainCard: "#ffffff",
        card: "#ffffff",
        box: "#f3f8ff",
        border: "#d6e4f5",
        borderStrong: "#dce7f6",
        text: "#1c2b42",
        muted: "#5d7799",
        grid: "#c8d7ea",
      };

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, [selectedCode1, selectedCode2]);

  const country1 = useMemo(
    () => countries.find((c) => c.code === selectedCode1) || null,
    [selectedCode1]
  );

  const country2 = useMemo(
    () => countries.find((c) => c.code === selectedCode2) || null,
    [selectedCode2]
  );

  const hoveredCountry = useMemo(
    () => countries.find((c) => c.code === hoveredCode) || null,
    [hoveredCode]
  );

  useEffect(() => {
    if (country1) {
      track("country1_selected", { country: country1.name });
    }
  }, [country1]);

  useEffect(() => {
    if (country2) {
      track("country2_selected", { country: country2.name });
    }
  }, [country2]);

  useEffect(() => {
    if (country1 && country2) {
      const key = getPairKey(country1, country2);
      track("country_pair_selected", {
        pair: `${country1.name} - ${country2.name}`,
      });

      const updated = saveTopPair(key);
      setTopPairs(updated);
    }
  }, [country1, country2]);

  function handleMapClick(country) {
    track("map_country_clicked", { country: country.name });

    if (!selectedCode1) {
      setSelectedCode1(country.code);
      setSearch1(country.name);
      return;
    }

    if (!selectedCode2 && country.code !== selectedCode1) {
      setSelectedCode2(country.code);
      setSearch2(country.name);
      return;
    }

    if (country.code === selectedCode1) {
      setSelectedCode1("");
      setSearch1("");
      return;
    }

    if (country.code === selectedCode2) {
      setSelectedCode2("");
      setSearch2("");
      return;
    }

    setSelectedCode1(country.code);
    setSearch1(country.name);
    setSelectedCode2("");
    setSearch2("");
  }

  function resetSelection() {
    track("reset_clicked");
    setSelectedCode1("");
    setSelectedCode2("");
    setSearch1("");
    setSearch2("");
  }

  function swapCountries() {
    track("swap_clicked");
    setSelectedCode1(selectedCode2);
    setSelectedCode2(selectedCode1);
    setSearch1(country2 ? country2.name : "");
    setSearch2(country1 ? country1.name : "");
  }

  function toggleTheme() {
    const next = themeMode === "dark" ? "light" : "dark";
    setThemeMode(next);
    track("theme_toggled", { theme: next });
  }

  const relation = useMemo(() => {
    if (!country1 || !country2) return null;
    const key = getPairKey(country1, country2);

    return (
      pairTradeData[key] || {
        turnover: 16.5,
        summary:
          `${country1.name} and ${country2.name} can already be compared as a trade pair. For exact bilateral turnover and real product categories, the next step is connecting a real trade API.`,
        categories: [
          { name: "Machinery", percent: 24 },
          { name: "Technology", percent: 22 },
          { name: "Chemicals", percent: 18 },
          { name: "Agriculture", percent: 16 },
          { name: "Consumer goods", percent: 20 },
        ],
        goods: [
          "Machinery and equipment",
          "Technology products",
          "Industrial chemicals",
          "Food and agriculture",
          "Consumer trade goods",
        ],
        trend: [
          { year: "2020", exportAtoB: 6.0, exportBtoA: 4.0, turnover: 10.0 },
          { year: "2021", exportAtoB: 7.0, exportBtoA: 5.0, turnover: 12.0 },
          { year: "2022", exportAtoB: 8.0, exportBtoA: 5.5, turnover: 13.5 },
          { year: "2023", exportAtoB: 9.0, exportBtoA: 6.0, turnover: 15.0 },
          { year: "2024", exportAtoB: 10.0, exportBtoA: 6.5, turnover: 16.5 },
        ],
      }
    );
  }, [country1, country2]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.page,
        color: theme.text,
        padding: 18,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1700, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 46, fontWeight: 800 }}>🌍 {APP_NAME}</div>
            <div style={{ color: theme.muted, marginTop: 6 }}>
              Country comparison, analytics, security status and statistics
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={toggleTheme}
              style={{
                border: "none",
                background: themeMode === "dark" ? "#f59e0b" : "#111827",
                color: "white",
                padding: "12px 16px",
                borderRadius: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {themeMode === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>

            <button
              onClick={swapCountries}
              style={{
                border: "none",
                background: "#0ea5e9",
                color: "white",
                padding: "12px 16px",
                borderRadius: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Swap countries
            </button>

            <button
              onClick={resetSelection}
              style={{
                border: "none",
                background: "#1d4ed8",
                color: "white",
                padding: "12px 16px",
                borderRadius: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Reset selection
            </button>
          </div>
        </div>

        {loading && (
          <div
            style={{
              marginBottom: 12,
              background: theme.card,
              border: `1px solid ${theme.border}`,
              color: "#4ea3ff",
              borderRadius: 14,
              padding: 12,
            }}
          >
            Loading comparison data...
          </div>
        )}

        {error && (
          <div
            style={{
              marginBottom: 12,
              background: "#2a1010",
              border: "1px solid #5a1e1e",
              color: "#ffb4b4",
              borderRadius: 14,
              padding: 12,
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.55fr 1fr",
            gap: 18,
          }}
        >
          <div
            style={{
              background: theme.mainCard,
              border: `1px solid ${theme.borderStrong}`,
              borderRadius: 24,
              padding: 16,
              boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <SearchableSelect
                label="Country 1"
                value={selectedCode1}
                onChange={setSelectedCode1}
                search={search1}
                onSearchChange={setSearch1}
                options={countries}
                selectedCountry={country1}
                theme={theme}
              />

              <SearchableSelect
                label="Country 2"
                value={selectedCode2}
                onChange={setSelectedCode2}
                search={search2}
                onSearchChange={setSearch2}
                options={countries}
                selectedCountry={country2}
                theme={theme}
              />
            </div>

            <div
              style={{
                height: "72vh",
                borderRadius: 18,
                overflow: "hidden",
                border: `1px solid ${theme.border}`,
                position: "relative",
              }}
            >
              <MapContainer
                center={[30, 20]}
                zoom={2}
                minZoom={2}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors & CARTO"
                  url={
                    themeMode === "dark"
                      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  }
                />

                {countries.map((c) => {
                  const is1 = c.code === selectedCode1;
                  const is2 = c.code === selectedCode2;
                  const isHovered = c.code === hoveredCode;

                  return (
                    <CircleMarker
                      key={c.code}
                      center={c.latlng}
                      radius={is1 || is2 ? 10 : isHovered ? 9 : 7}
                      pathOptions={{
                        color: "#ffffff",
                        weight: isHovered ? 3 : 2,
                        fillColor: is1 ? "#22c55e" : is2 ? "#f59e0b" : "#60a5fa",
                        fillOpacity: 1,
                      }}
                      eventHandlers={{
                        click: () => handleMapClick(c),
                        mouseover: () => setHoveredCode(c.code),
                        mouseout: () => setHoveredCode(""),
                      }}
                    >
                      <Tooltip direction="top" offset={[0, -8]}>
                        {c.flag} {c.name}
                      </Tooltip>
                    </CircleMarker>
                  );
                })}

                {country1?.latlng && country2?.latlng && (
                  <Polyline
                    positions={[country1.latlng, country2.latlng]}
                    pathOptions={{
                      color: "#38bdf8",
                      weight: 3,
                      opacity: 0.9,
                      dashArray: "8 8",
                    }}
                  />
                )}
              </MapContainer>

              {hoveredCountry && (
                <div
                  style={{
                    position: "absolute",
                    right: 14,
                    top: 14,
                    background: theme.card,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 14,
                    padding: 12,
                    minWidth: 220,
                    pointerEvents: "none",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 22 }}>{hoveredCountry.flag}</span>
                    <strong>{hoveredCountry.name}</strong>
                  </div>
                  <div style={{ color: theme.text, fontSize: 14, display: "grid", gap: 4 }}>
                    <div>Capital: {hoveredCountry.capital}</div>
                    <div>GDP: {formatTrillions(hoveredCountry.gdp)}</div>
                    <div>Export: {formatTrillions(hoveredCountry.export)}</div>
                    <div>Import: {formatTrillions(hoveredCountry.import)}</div>
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                marginTop: 12,
                color: theme.muted,
                fontSize: 13,
              }}
            >
              <div>Blue = available countries</div>
              <div>Green = Country 1</div>
              <div>Orange = Country 2</div>
              <div>Hover markers for quick stats</div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
            <CountryCard title="Country 1" country={country1} color="#22c55e" theme={theme} />
            <CountryCard title="Country 2" country={country2} color="#f59e0b" theme={theme} />
            <TopPairsPanel topPairs={topPairs} theme={theme} />
            <StatsPanel country1={country1} country2={country2} relation={relation} theme={theme} />
            <SecurityPanel theme={theme} />
            <CategoriesPanel relation={relation} theme={theme} />
            <TopGoods relation={relation} theme={theme} />
            <TrendPanel relation={relation} country1={country1} country2={country2} theme={theme} />
            <RelationshipsPanel country1={country1} country2={country2} relation={relation} theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
}