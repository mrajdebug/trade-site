import { useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  Polyline,
} from "react-leaflet";


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
    gdp: "$25T",
    export: "$2.0T",
    import: "$2.5T",
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
    gdp: "$18T",
    export: "$3.0T",
    import: "$2.2T",
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
    gdp: "$80B",
    export: "$0.5T",
    import: "$0.6T",
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
    gdp: "$4.5T",
    export: "$1.8T",
    import: "$1.7T",
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
    gdp: "$2.2T",
    export: "$1.5T",
    import: "$1.2T",
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
    gdp: "$3.7T",
    export: "$1.2T",
    import: "$1.4T",
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
    gdp: "$1.1T",
    export: "$0.9T",
    import: "$1.1T",
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
    gdp: "$260B",
    export: "$0.7T",
    import: "$0.5T",
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
    gdp: "$3.3T",
    export: "$0.9T",
    import: "$1.1T",
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
    gdp: "$3.0T",
    export: "$0.8T",
    import: "$0.9T",
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
    gdp: "$4.2T",
    export: "$0.9T",
    import: "$1.0T",
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
    gdp: "$1.7T",
    export: "$0.8T",
    import: "$0.7T",
    area: "100K km²",
  },
];

const pairTradeData = {
  "China|Uzbekistan": {
    turnover: "$13.8B",
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
    turnover: "$55.2B",
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
  "Russia|Kazakhstan": {
    turnover: "$26.4B",
    summary:
      "Russia and Kazakhstan trade is dominated by energy, metals, machinery, and regional logistics.",
    categories: [
      { name: "Energy", percent: 31 },
      { name: "Metals", percent: 22 },
      { name: "Machinery", percent: 18 },
      { name: "Agriculture", percent: 14 },
      { name: "Consumer goods", percent: 15 },
    ],
    goods: [
      "Oil and gas products",
      "Steel and metals",
      "Railway machinery",
      "Agricultural goods",
      "Consumer imports",
    ],
    trend: [
      { year: "2020", exportAtoB: 11, exportBtoA: 8, turnover: 19 },
      { year: "2021", exportAtoB: 12, exportBtoA: 8.6, turnover: 20.6 },
      { year: "2022", exportAtoB: 13.5, exportBtoA: 9.2, turnover: 22.7 },
      { year: "2023", exportAtoB: 14.7, exportBtoA: 10.3, turnover: 25.0 },
      { year: "2024", exportAtoB: 15.4, exportBtoA: 11.0, turnover: 26.4 },
    ],
  },
  "China|United States": {
    turnover: "$575B",
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

function CountryCard({ title, country, color }) {
  return (
    <div
      style={{
        background: "#0f1828",
        border: "1px solid #1d2b45",
        borderRadius: 18,
        padding: 16,
      }}
    >
      <div style={{ color, fontWeight: 700, marginBottom: 10 }}>{title}</div>

      {!country ? (
        <div style={{ color: "#8fa5c5" }}>Страна не выбрана</div>
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
          <div><b>GDP:</b> {country.gdp}</div>
          <div><b>Export:</b> {country.export}</div>
          <div><b>Import:</b> {country.import}</div>
        </div>
      )}
    </div>
  );
}

function SearchableSelect({
  label,
  value,
  onChange,
  search,
  onSearchChange,
  options,
  selectedCountry,
}) {
  const filtered = options.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ color: "#8fa5c5", fontSize: 13 }}>{label}</div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "#0f1828",
          border: "1px solid #233652",
          borderRadius: 12,
          padding: "10px 12px",
        }}
      >
        <span style={{ fontSize: 20 }}>{selectedCountry ? selectedCountry.flag : "🌐"}</span>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search country..."
          style={{
            background: "transparent",
            color: "white",
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
          background: "#0f1828",
          color: "white",
          border: "1px solid #233652",
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

function TopGoods({ relation }) {
  return (
    <div
      style={{
        background: "#0f1828",
        border: "1px solid #1d2b45",
        borderRadius: 18,
        padding: 16,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
        Top traded goods
      </div>

      {!relation ? (
        <div style={{ color: "#8fa5c5" }}>
          Выбери две страны, чтобы увидеть ключевые товары.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {relation.goods.map((good) => (
            <div
              key={good}
              style={{
                background: "#0a1220",
                border: "1px solid #1a2940",
                borderRadius: 12,
                padding: "10px 12px",
                color: "#dce7f7",
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

function TrendChart({ relation, country1, country2 }) {
  return (
    <div
      style={{
        background: "#0f1828",
        border: "1px solid #1d2b45",
        borderRadius: 18,
        padding: 16,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
        Yearly trade trends
      </div>

      {!relation ? (
        <div style={{ color: "#8fa5c5" }}>
          Выбери две страны, чтобы увидеть trend.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ color: "#c7d5ea", marginBottom: 4 }}>
            Trend between {country1?.name} and {country2?.name}
          </div>

          {relation.trend.map((item) => (
            <div
              key={item.year}
              style={{
                background: "#0a1220",
                border: "1px solid #1a2940",
                borderRadius: 12,
                padding: "10px 12px",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{item.year}</div>
              <div style={{ color: "#cbd5e1", fontSize: 14 }}>
                Export A → B: {item.exportAtoB}B
              </div>
              <div style={{ color: "#cbd5e1", fontSize: 14 }}>
                Export B → A: {item.exportBtoA}B
              </div>
              <div style={{ color: "#cbd5e1", fontSize: 14 }}>
                Turnover: {item.turnover}B
              </div>
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

  function handleMapClick(country) {
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
    setSelectedCode1("");
    setSelectedCode2("");
    setSearch1("");
    setSearch2("");
  }

  function swapCountries() {
    setSelectedCode1(selectedCode2);
    setSelectedCode2(selectedCode1);
    setSearch1(country2 ? country2.name : "");
    setSearch2(country1 ? country1.name : "");
  }

  const relation = useMemo(() => {
    if (!country1 || !country2) return null;
    const key = [country1.name, country2.name].sort().join("|");

    return (
      pairTradeData[key] || {
        turnover: "Estimated / demo",
        summary:
          `${country1.name} and ${country2.name} can already be compared as a trade pair. ` +
          `For exact bilateral turnover and real product categories, the next step is connecting a real trade API.`,
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
          { year: "2020", exportAtoB: 6, exportBtoA: 4, turnover: 10 },
          { year: "2021", exportAtoB: 7, exportBtoA: 5, turnover: 12 },
          { year: "2022", exportAtoB: 8, exportBtoA: 5.5, turnover: 13.5 },
          { year: "2023", exportAtoB: 9, exportBtoA: 6, turnover: 15 },
          { year: "2024", exportAtoB: 10, exportBtoA: 6.5, turnover: 16.5 },
        ],
      }
    );
  }, [country1, country2]);

  const comparisonText = useMemo(() => {
    if (!country1 || !country2) {
      return "Выбери две страны на карте или через списки сверху.";
    }

    const exportLeader =
      parseFloat(country1.export.replace(/[^0-9.]/g, "")) >=
      parseFloat(country2.export.replace(/[^0-9.]/g, ""))
        ? country1.name
        : country2.name;

    const importLeader =
      parseFloat(country1.import.replace(/[^0-9.]/g, "")) >=
      parseFloat(country2.import.replace(/[^0-9.]/g, ""))
        ? country1.name
        : country2.name;

    return `${country1.name} and ${country2.name} are compared as a trade pair. ${exportLeader} has the larger export scale, while ${importLeader} has the larger import scale. ${relation ? relation.summary : ""}`;
  }, [country1, country2, relation]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #07101d 0%, #0a1424 100%)",
        color: "white",
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
            <div style={{ fontSize: 46, fontWeight: 800 }}>🌍 World Trade Map</div>
            <div style={{ color: "#8fa5c5", marginTop: 6 }}>
              Country comparison, turnover, categories, top goods and yearly trends
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.55fr 1fr",
            gap: 18,
          }}
        >
          <div
            style={{
              background: "#0c1627",
              border: "1px solid #1a2a40",
              borderRadius: 24,
              padding: 16,
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
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
              />

              <SearchableSelect
                label="Country 2"
                value={selectedCode2}
                onChange={setSelectedCode2}
                search={search2}
                onSearchChange={setSearch2}
                options={countries}
                selectedCountry={country2}
              />
            </div>

            <div
              style={{
                height: "72vh",
                borderRadius: 18,
                overflow: "hidden",
                border: "1px solid #1d2b45",
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
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
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
                    background: "rgba(8,16,31,0.92)",
                    border: "1px solid #1e3352",
                    borderRadius: 14,
                    padding: 12,
                    minWidth: 220,
                    pointerEvents: "none",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 22 }}>{hoveredCountry.flag}</span>
                    <strong>{hoveredCountry.name}</strong>
                  </div>
                  <div style={{ color: "#c9d6ea", fontSize: 14, display: "grid", gap: 4 }}>
                    <div>Capital: {hoveredCountry.capital}</div>
                    <div>GDP: {hoveredCountry.gdp}</div>
                    <div>Export: {hoveredCountry.export}</div>
                    <div>Import: {hoveredCountry.import}</div>
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
                color: "#8fa5c5",
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
            <CountryCard title="Country 1" country={country1} color="#22c55e" />
            <CountryCard title="Country 2" country={country2} color="#f59e0b" />

            <div
              style={{
                background: "#0f1828",
                border: "1px solid #1d2b45",
                borderRadius: 18,
                padding: 16,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
                Turnover by categories
              </div>

              {!relation ? (
                <div style={{ color: "#8fa5c5" }}>
                  Выбери две страны, чтобы увидеть товарооборот и категории.
                </div>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  <div>
                    <div style={{ color: "#8fa5c5", marginBottom: 4 }}>
                      Estimated turnover
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 700 }}>
                      {relation.turnover}
                    </div>
                  </div>

                  <div style={{ color: "#c7d5ea", lineHeight: 1.6 }}>
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
                            background: "#0a1220",
                            borderRadius: 999,
                            overflow: "hidden",
                            border: "1px solid #1a2940",
                          }}
                        >
                          <div
                            style={{
                              width: `${item.percent}%`,
                              height: "100%",
                              background:
                                "linear-gradient(90deg, #2563eb, #38bdf8)",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <TopGoods relation={relation} />
            <TrendChart relation={relation} country1={country1} country2={country2} />

            <div
              style={{
                background: "#0f1828",
                border: "1px solid #1d2b45",
                borderRadius: 18,
                padding: 16,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 10 }}>
                Relationships
              </div>
              <div style={{ color: "#c7d5ea", lineHeight: 1.7 }}>
                {comparisonText}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}