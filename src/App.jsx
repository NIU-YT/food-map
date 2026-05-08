import React, { useEffect, useMemo, useRef, useState } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";

// =========================
// 1. 高德地图配置
// =========================
const AMAP_KEY = "3c8de71501c9252586f5ab220d9fddbb";
const AMAP_SECURITY_CODE = "243808539cc1da2d4ff9459b5ca9f64b";

window._AMapSecurityConfig = {
  securityJsCode: AMAP_SECURITY_CODE,
};

// =========================
// 2. 店铺数据
// 高德坐标顺序：lng, lat
// =========================
const stores = [
  {
    id: 1,
    city: "上海",
    name: "% Arabica 武康路店",
    category: "咖啡",
    rating: 4.7,
    comment: "适合散步时买一杯，街区氛围很好，适合慢慢走。",
    address: "上海市徐汇区武康路",
    lng: 121.4381,
    lat: 31.2124,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    city: "上海",
    name: "安福路 Brunch 小店",
    category: "Brunch",
    rating: 4.6,
    comment: "自然光很好，适合周末慢慢吃，整体比较松弛。",
    address: "上海市徐汇区安福路",
    lng: 121.4455,
    lat: 31.2151,
    image:
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    city: "北京",
    name: "三里屯甜品店",
    category: "甜品",
    rating: 4.5,
    comment: "适合和朋友聊天，甜品颜值高，位置也方便。",
    address: "北京市朝阳区三里屯",
    lng: 116.4541,
    lat: 39.9336,
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    city: "杭州",
    name: "西湖边茶馆",
    category: "茶馆",
    rating: 4.8,
    comment: "风景很好，适合下午坐着发呆，体验感很松弛。",
    address: "杭州市西湖区西湖景区附近",
    lng: 120.1452,
    lat: 30.2491,
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    city: "成都",
    name: "太古里火锅店",
    category: "火锅",
    rating: 4.7,
    comment: "味道很香，适合晚上去，热闹又有氛围。",
    address: "成都市锦江区太古里附近",
    lng: 104.0809,
    lat: 30.6543,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    city: "长治",
    name: "东北老毕家庭烤肉",
    category: "烤肉",
    rating: 4.9,
    comment: "牛肋条真的非常惊艳，有很浓的奶味，老板说是齐齐哈尔空运来的",
    address: "长治市潞州区工农巷14号",
    lng: 113.108253,
    lat: 36.209832,
    image:
      "/images/laobi1.jpg",
  },
];

// =========================
// 3. 城市信息
// =========================
const cityMeta = {
  上海: {
    center: [121.4737, 31.2304],
    zoom: 12,
    cover:
      "https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?auto=format&fit=crop&w=1200&q=80",
    subtitle: "梧桐街区、咖啡和城市散步",
  },
  北京: {
    center: [116.4074, 39.9042],
    zoom: 11,
    cover:
      "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=1200&q=80",
    subtitle: "胡同、甜品和周末见面",
  },
  杭州: {
    center: [120.1551, 30.2741],
    zoom: 12,
    cover:
      "https://images.unsplash.com/photo-1599376792011-0a7f1d8b6c9f?auto=format&fit=crop&w=1200&q=80",
    subtitle: "茶馆、西湖和慢下午",
  },
  成都: {
    center: [104.0665, 30.5728],
    zoom: 12,
    cover:
      "https://images.unsplash.com/photo-1541696490-8744a5dc0228?auto=format&fit=crop&w=1200&q=80",
    subtitle: "火锅、街巷和烟火气",
  },
  长治: {
    center: [113.117394, 36.214396],
    zoom: 12,
    cover:
      "/images/changzhi.jpg",
    subtitle: "四季分明、非常宜居的小城",
  },
};

function getAmapNavigationUrl(store) {
  return `https://uri.amap.com/marker?position=${store.lng},${store.lat}&name=${encodeURIComponent(
    store.name
  )}&src=food-map&coordinate=gaode&callnative=1`;
}

function HomePage({ cities, onSelectCity }) {
  return (
    <div className="min-h-screen bg-[#f6f5f2] text-[#2f332b]">
      <section className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-16">
        <header className="mb-12 grid gap-8 md:grid-cols-[1.4fr_0.6fr] md:items-end">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#6f8a68]">
              Personal City Map
            </p>

            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.04em] md:text-6xl">
              记录每一次
              <br />
              城市里的停留
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-[#6b6f63]">
              一张属于自己的探店地图。把喜欢的咖啡、茶馆、甜品和小店，安静地留在城市坐标里。
            </p>
          </div>

          <div className="rounded-3xl border border-[#e4e0d7] bg-white/70 p-5">
            <p className="text-sm text-[#73786c]">已记录地点</p>
            <div className="mt-2 text-5xl font-semibold tracking-[-0.05em] text-[#6f8a68]">
              {stores.length}
            </div>
            <p className="mt-2 text-sm text-[#73786c]">places worth returning to</p>
          </div>
        </header>

        <div className="grid gap-5 md:grid-cols-4">
          {cities.map((city) => {
            const count = stores.filter((store) => store.city === city).length;
            const meta = cityMeta[city];

            return (
              <button
                key={city}
                onClick={() => onSelectCity(city)}
                className="group overflow-hidden rounded-3xl border border-[#e4e0d7] bg-white text-left transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(47,51,43,0.10)]"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={meta.cover}
                    alt={city}
                    className="h-full w-full object-cover saturate-[0.86] transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-[#53684e]">
                    {count} places
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-[-0.03em]">
                      {city}
                    </h2>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef1e9] text-[#6f8a68]">
                      →
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#6b6f63]">
                    {meta.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function CityMapPage({ city, onBack }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const infoWindowRef = useRef(null);
  const markersRef = useRef([]);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [category, setCategory] = useState("全部");
  const [selectedStore, setSelectedStore] = useState(null);

  const cityStores = useMemo(
    () => stores.filter((store) => store.city === city),
    [city]
  );

  const categories = useMemo(() => {
    return ["全部", ...Array.from(new Set(cityStores.map((store) => store.category)))];
  }, [cityStores]);

  const filteredStores = useMemo(() => {
    if (category === "全部") return cityStores;
    return cityStores.filter((store) => store.category === category);
  }, [cityStores, category]);

  useEffect(() => {
    let destroyed = false;

    async function initMap() {
      try {
        const AMap = await AMapLoader.load({
          key: AMAP_KEY,
          version: "2.0",
          plugins: ["AMap.Scale", "AMap.ToolBar"],
        });

        if (destroyed || !mapRef.current) return;

        const map = new AMap.Map(mapRef.current, {
          viewMode: "2D",
          resizeEnable: true,
          zoom: cityMeta[city].zoom,
          center: cityMeta[city].center,
          mapStyle: "amap://styles/fresh",
        });

        map.addControl(new AMap.Scale());
        map.addControl(
          new AMap.ToolBar({
            position: "RB",
          })
        );

        mapInstanceRef.current = map;
        infoWindowRef.current = new AMap.InfoWindow({
          isCustom: true,
          offset: new AMap.Pixel(0, -56),
        });

        setMapLoaded(true);
      } catch (error) {
        console.error(error);
        setLoadError("高德地图加载失败，请检查 Key 和 securityJsCode 是否正确。");
      }
    }

    initMap();

    return () => {
      destroyed = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
      setMapLoaded(false);
    };
  }, [city]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded || !window.AMap) return;

    const AMap = window.AMap;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const markers = filteredStores.map((store) => {
      const marker = new AMap.Marker({
        position: [store.lng, store.lat],
        title: store.name,
        content: `
          <div style="
            position: relative;
            width: 54px;
            height: 54px;
            border-radius: 999px;
            background: #ffffff;
            border: 2px solid #6f8a68;
            box-shadow: 0 10px 30px rgba(47,51,43,0.22);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 18px;
              height: 18px;
              border-radius: 999px;
              background: #6f8a68;
            "></div>
            <div style="
              position: absolute;
              inset: -8px;
              border-radius: 999px;
              border: 1px solid rgba(111,138,104,0.35);
            "></div>
          </div>
        `,
        offset: new AMap.Pixel(-27, -54),
      });

      marker.on("click", () => {
        setSelectedStore(store);

        const content = document.createElement("div");
        content.innerHTML = `
          <div style="
            width: 292px;
            overflow: hidden;
            border-radius: 20px;
            background: #ffffff;
            border: 1px solid #e4e0d7;
            box-shadow: 0 18px 50px rgba(47,51,43,0.18);
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          ">
            <img src="${store.image}" style="
              width: 100%;
              height: 142px;
              object-fit: cover;
              filter: saturate(0.88);
            " />

            <div style="padding: 16px;">
              <div style="display: flex; justify-content: space-between; gap: 12px; align-items: flex-start;">
                <div>
                  <div style="font-size: 18px; font-weight: 700; color: #2f332b;">
                    ${store.name}
                  </div>
                  <div style="margin-top: 5px; font-size: 12px; color: #6f8a68;">
                    ${store.category}
                  </div>
                </div>

                <div style="
                  border-radius: 999px;
                  background: #eef1e9;
                  color: #53684e;
                  padding: 5px 10px;
                  font-size: 13px;
                  font-weight: 700;
                  white-space: nowrap;
                ">
                  ★ ${store.rating}
                </div>
              </div>

              <div style="margin-top: 12px; font-size: 14px; line-height: 1.75; color: #62675c;">
                ${store.comment}
              </div>

              <div style="margin-top: 10px; font-size: 12px; line-height: 1.6; color: #8b8f84;">
                ${store.address}
              </div>

              <a href="${getAmapNavigationUrl(store)}" target="_blank" style="
                display: block;
                margin-top: 14px;
                border-radius: 999px;
                background: #2f332b;
                color: white;
                padding: 11px 16px;
                text-align: center;
                font-size: 14px;
                font-weight: 700;
                text-decoration: none;
              ">
                打开高德地图导航
              </a>
            </div>
          </div>
        `;

        infoWindowRef.current.setContent(content);
        infoWindowRef.current.open(map, [store.lng, store.lat]);
      });

      marker.setMap(map);
      return marker;
    });

    markersRef.current = markers;

    if (markers.length > 0) {
      map.setFitView(markers, false, [120, 120, 120, 380], 15);
    }
  }, [filteredStores, mapLoaded]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#f6f5f2]">
      <div ref={mapRef} className="h-full w-full" />

      {loadError && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-[#f6f5f2] p-6">
          <div className="max-w-md rounded-3xl bg-white p-6 text-center shadow-xl">
            <h2 className="text-2xl font-semibold text-[#2f332b]">地图加载失败</h2>
            <p className="mt-3 text-sm leading-6 text-[#6b6f63]">{loadError}</p>
          </div>
        </div>
      )}

      <div className="absolute left-4 right-4 top-4 z-[1000] md:left-5 md:right-auto md:w-[330px]">
        <div className="rounded-3xl border border-[#e4e0d7] bg-white/88 p-4 shadow-[0_10px_30px_rgba(47,51,43,0.10)] backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onBack}
              className="rounded-full bg-[#2f332b] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#53684e]"
            >
              ← 返回
            </button>

            <div className="rounded-full bg-[#eef1e9] px-4 py-2 text-sm font-semibold text-[#53684e]">
              {filteredStores.length} 家
            </div>
          </div>

          <h1 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-[#2f332b]">
            {city}城市停留
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#6b6f63]">
            点击地图上的绿色圆点，查看你记录过的店铺、评价和导航。
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  category === item
                    ? "bg-[#6f8a68] text-white"
                    : "bg-[#f1f0eb] text-[#6b6f63] hover:bg-[#e7e9df]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedStore && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] md:left-auto md:right-5 md:w-[310px]">
          <div className="rounded-3xl border border-[#e4e0d7] bg-white/90 p-4 shadow-[0_10px_30px_rgba(47,51,43,0.10)] backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6f8a68]">
              Selected
            </p>
            <h3 className="mt-1 text-lg font-semibold text-[#2f332b]">
              {selectedStore.name}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#6b6f63]">
              {selectedStore.comment}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const cities = useMemo(
    () => Array.from(new Set(stores.map((store) => store.city))),
    []
  );
  const [selectedCity, setSelectedCity] = useState(null);

  if (selectedCity) {
    return <CityMapPage city={selectedCity} onBack={() => setSelectedCity(null)} />;
  }

  return <HomePage cities={cities} onSelectCity={setSelectedCity} />;
}