import React, { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * stores.js 可以先长这样：
 * export const stores = [...]
 * 为了方便你直接预览，我先把数据写在同一个文件里。
 */
const stores = [
  {
    id: 1,
    city: "东京",
    name: "一兰拉面 涩谷店",
    category: "拉面",
    rating: 4.4,
    comment: "汤底浓郁，游客很多，但第一次来东京吃很有仪式感。",
    address: "日本东京都涩谷区神南1丁目22-7",
    lat: 35.6604,
    lng: 139.7005,
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80",
    visitDate: "2026-04-12",
  },
  {
    id: 2,
    city: "东京",
    name: "Blue Bottle Coffee 清澄白河",
    category: "咖啡",
    rating: 4.6,
    comment: "空间很舒服，适合散步后坐一会儿，咖啡稳定不踩雷。",
    address: "日本东京都江东区平野1丁目4-8",
    lat: 35.6812,
    lng: 139.7991,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
    visitDate: "2026-03-28",
  },
  {
    id: 3,
    city: "东京",
    name: "Tsukiji Sushi Spot",
    category: "寿司",
    rating: 4.8,
    comment: "鱼很新鲜，早上去体验最好，价格略高但值得。",
    address: "日本东京都中央区筑地4丁目",
    lat: 35.6655,
    lng: 139.7707,
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80",
    visitDate: "2026-02-18",
  },
  {
    id: 4,
    city: "大阪",
    name: "道顿堀章鱼烧",
    category: "小吃",
    rating: 4.3,
    comment: "热乎乎很好吃，外面软糯，适合边逛边吃。",
    address: "日本大阪府大阪市中央区道顿堀",
    lat: 34.6687,
    lng: 135.5012,
    image:
      "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=900&q=80",
    visitDate: "2026-01-10",
  },
  {
    id: 5,
    city: "大阪",
    name: "心斋桥烤肉店",
    category: "烤肉",
    rating: 4.7,
    comment: "肉质不错，适合朋友聚餐，建议提前预约。",
    address: "日本大阪府大阪市中央区心斋桥筋",
    lat: 34.6721,
    lng: 135.5015,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
    visitDate: "2026-01-11",
  },
  {
    id: 6,
    city: "京都",
    name: "祇园抹茶甜品店",
    category: "甜品",
    rating: 4.5,
    comment: "抹茶味很浓，环境安静，适合逛完祇园休息。",
    address: "日本京都府京都市东山区祇园町",
    lat: 35.0037,
    lng: 135.7788,
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80",
    visitDate: "2025-12-20",
  },
];

const cityMeta = {
  东京: {
    center: [35.6762, 139.6503],
    zoom: 12,
    cover:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
    description: "拉面、咖啡、寿司和各种小店都很多。",
  },
  大阪: {
    center: [34.6937, 135.5023],
    zoom: 13,
    cover:
      "https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=1200&q=80",
    description: "适合吃小吃、烤肉和热闹的街边店。",
  },
  京都: {
    center: [35.0116, 135.7681],
    zoom: 13,
    cover:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    description: "适合慢慢走、喝茶、吃甜品。",
  },
};

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function getGoogleMapsUrl(store) {
  return `https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`;
}

function CityFitBounds({ cityStores }) {
  const map = useMap();

  React.useEffect(() => {
    if (!cityStores.length) return;
    const bounds = L.latLngBounds(cityStores.map((store) => [store.lat, store.lng]));
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
  }, [cityStores, map]);

  return null;
}

function HomePage({ cities, onSelectCity }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fff7f1] text-[#3f3028]">
      <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-pink-200/60 blur-3xl" />
      <div className="absolute right-[-80px] top-32 h-72 w-72 rounded-full bg-orange-200/70 blur-3xl" />
      <div className="absolute bottom-[-80px] left-1/3 h-72 w-72 rounded-full bg-rose-100 blur-3xl" />

      <section className="relative mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-16">
        <div className="mb-10 rounded-[36px] border border-white/70 bg-white/65 p-7 shadow-[0_20px_70px_rgba(214,150,120,0.18)] backdrop-blur-xl md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#ffe8df] px-4 py-2 text-sm font-bold text-[#d66b54]">
                <span>🍓</span>
                <span>MY CUTE FOOD MAP</span>
              </div>

              <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
                今天也要把好吃的，
                <br />
                悄悄收藏进地图里 ♡
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-[#7c675d] md:text-lg">
                选择一个城市，进入你的探店地图。每一个小标记，都是一次吃到开心的记录。
              </p>
            </div>

            <div className="rounded-[28px] bg-[#3f3028] px-6 py-5 text-white shadow-xl rotate-1">
              <p className="text-sm text-white/70">已收藏店铺</p>
              <div className="mt-1 text-5xl font-black text-[#ffd2c2]">{stores.length}</div>
              <p className="mt-1 text-sm text-white/70">yummy places</p>
            </div>
          </div>
        </div>

        <div className="grid gap-7 md:grid-cols-3">
          {cities.map((city) => {
            const count = stores.filter((store) => store.city === city).length;

            return (
              <button
                key={city}
                onClick={() => onSelectCity(city)}
                className="group relative overflow-hidden rounded-[36px] border-[6px] border-white bg-white text-left shadow-[0_18px_50px_rgba(208,139,113,0.2)] transition duration-500 hover:-translate-y-2 hover:rotate-1 hover:shadow-[0_24px_70px_rgba(208,139,113,0.3)]"
              >
                <div className="relative h-[360px] overflow-hidden rounded-[28px]">
                  <img
                    src={cityMeta[city].cover}
                    alt={city}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3f3028]/75 via-[#3f3028]/10 to-transparent" />

                  <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-sm font-black text-[#d66b54] shadow-md backdrop-blur">
                    🧁 {count} 家
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-4xl font-black tracking-tight text-[#3f3028]">{city}</h2>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffe8df] text-2xl transition group-hover:scale-110">
                      📍
                    </div>
                  </div>

                  <p className="text-sm leading-6 text-[#8b7469]">
                    点进去看看你在这座城市吃过哪些可爱小店。
                  </p>

                  <div className="mt-5 inline-flex rounded-full bg-[#3f3028] px-5 py-3 text-sm font-bold text-white transition group-hover:bg-[#d66b54]">
                    进入地图 ♡
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function StorePopup({ store }) {
  return (
    <div className="w-64 overflow-hidden rounded-2xl bg-white">
      <img src={store.image} alt={store.name} className="h-32 w-full object-cover" />
      <div className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-stone-900">{store.name}</h3>
            <p className="mt-1 text-xs text-stone-500">{store.category}</p>
          </div>
          <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-bold text-orange-700">
            ★ {store.rating}
          </span>
        </div>
        <p className="mt-3 text-sm leading-5 text-stone-700">{store.comment}</p>
        <p className="mt-3 text-xs leading-5 text-stone-500">{store.address}</p>
        <a
          href={getGoogleMapsUrl(store)}
          target="_blank"
          rel="noreferrer"
          className="mt-3 block rounded-xl bg-stone-900 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-stone-700"
        >
          打开 Google Maps 导航
        </a>
      </div>
    </div>
  );
}

function CityMapPage({ city, onBack }) {
  const [category, setCategory] = useState("全部");
  const [minRating, setMinRating] = useState(0);

  const cityStores = useMemo(() => stores.filter((store) => store.city === city), [city]);
  const categories = useMemo(
    () => ["全部", ...Array.from(new Set(cityStores.map((store) => store.category)))],
    [cityStores]
  );

  const filteredStores = cityStores.filter((store) => {
    const categoryMatched = category === "全部" || store.category === category;
    const ratingMatched = store.rating >= Number(minRating);
    return categoryMatched && ratingMatched;
  });

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-stone-900">
      <MapContainer
        center={cityMeta[city].center}
        zoom={cityMeta[city].zoom}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CityFitBounds cityStores={filteredStores} />

        <MarkerClusterGroup chunkedLoading>
          {filteredStores.map((store) => (
            <Marker key={store.id} position={[store.lat, store.lng]} icon={markerIcon}>
              <Popup closeButton={false} className="food-popup">
                <StorePopup store={store} />
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      <div className="pointer-events-none absolute left-4 right-4 top-4 z-[1000] flex flex-col gap-3 md:left-6 md:right-auto md:w-[360px]">
        <div className="pointer-events-auto rounded-3xl bg-white/95 p-4 shadow-xl backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onBack}
              className="rounded-full bg-stone-100 px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-200"
            >
              ← 返回
            </button>
            <span className="rounded-full bg-orange-100 px-3 py-2 text-sm font-bold text-orange-700">
              {filteredStores.length} 家店
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-stone-900">{city}探店地图</h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            缩小时会自动聚合，放大后会展开成具体店铺。点击标记可以看图片、评分、评价和地址。
          </p>
        </div>

        <div className="pointer-events-auto rounded-3xl bg-white/95 p-4 shadow-xl backdrop-blur">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">分类筛选</label>
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                  category === item
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              最低评分：{minRating === 0 ? "不限" : `${minRating} 分`}
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={minRating}
              onChange={(event) => setMinRating(event.target.value)}
              className="mt-3 w-full accent-stone-900"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-[1000] rounded-2xl bg-white/90 px-4 py-3 text-sm text-stone-600 shadow-lg backdrop-blur md:left-auto md:right-6 md:w-[360px]">
        提示：以后你可以把“新增店铺”做成后台表单，数据存到 Supabase 或 Firebase。
      </div>
    </div>
  );
}

export default function App() {
  const cities = useMemo(() => Array.from(new Set(stores.map((store) => store.city))), []);
  const [selectedCity, setSelectedCity] = useState(null);

  if (selectedCity) {
    return <CityMapPage city={selectedCity} onBack={() => setSelectedCity(null)} />;
  }

  return <HomePage cities={cities} onSelectCity={setSelectedCity} />;
}
