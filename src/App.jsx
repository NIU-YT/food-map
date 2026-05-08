import React, { useEffect, useMemo, useRef, useState } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";

/**
 * 你需要先安装：
 * npm install @amap/amap-jsapi-loader
 *
 * 如果之前装过 Leaflet，可以卸载：
 * npm uninstall leaflet react-leaflet react-leaflet-cluster
 */

// =========================
// 1. 填你的高德地图配置
// =========================
const AMAP_KEY = "3c8de71501c9252586f5ab220d9fddbb";
const AMAP_SECURITY_CODE = "243808539cc1da2d4ff9459b5ca9f64b";

// 高德新版 JS API 安全密钥配置
window._AMapSecurityConfig = {
  securityJsCode: AMAP_SECURITY_CODE,
};

// =========================
// 2. 店铺数据 stores.js 先写在这里
// 注意：高德地图坐标顺序是 lng, lat，也就是经度在前，纬度在后
// =========================
const stores = [
  {
    id: 1,
    city: "上海",
    name: "% Arabica 武康路店",
    category: "咖啡",
    rating: 4.7,
    comment: "韩系感很强，适合散步的时候买一杯，拍照也很好看。",
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
    comment: "氛围很舒服，适合周末慢慢吃，整体比较精致。",
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
    comment: "甜品颜值高，适合和朋友聊天拍照。",
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
    emoji: "🍓",
  },
  北京: {
    center: [116.4074, 39.9042],
    zoom: 11,
    cover:
      "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=1200&q=80",
    emoji: "🍰",
  },
  杭州: {
    center: [120.1551, 30.2741],
    zoom: 12,
    cover:
      "https://images.unsplash.com/photo-1599376792011-0a7f1d8b6c9f?auto=format&fit=crop&w=1200&q=80",
    emoji: "🍵",
  },
  成都: {
    center: [104.0665, 30.5728],
    zoom: 12,
    cover:
      "https://images.unsplash.com/photo-1541696490-8744a5dc0228?auto=format&fit=crop&w=1200&q=80",
    emoji: "🌶️",
  },
};

function getAmapNavigationUrl(store) {
  return `https://uri.amap.com/marker?position=${store.lng},${store.lat}&name=${encodeURIComponent(
    store.name
  )}&src=food-map&coordinate=gaode&callnative=1`;
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

        <div className="grid gap-7 md:grid-cols-4">
          {cities.map((city) => {
            const count = stores.filter((store) => store.city === city).length;
            const meta = cityMeta[city];

            return (
              <button
                key={city}
                onClick={() => onSelectCity(city)}
                className="group relative overflow-hidden rounded-[36px] border-[6px] border-white bg-white text-left shadow-[0_18px_50px_rgba(208,139,113,0.2)] transition duration-500 hover:-translate-y-2 hover:rotate-1 hover:shadow-[0_24px_70px_rgba(208,139,113,0.3)]"
              >
                <div className="relative h-[300px] overflow-hidden rounded-[28px]">
                  <img
                    src={meta.cover}
                    alt={city}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3f3028]/75 via-[#3f3028]/10 to-transparent" />

                  <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-sm font-black text-[#d66b54] shadow-md backdrop-blur">
                    {meta.emoji} {count} 家
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-3xl font-black tracking-tight text-[#3f3028]">{city}</h2>
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

function StoreCard({ store }) {
  return (
    <div className="w-[280px] overflow-hidden rounded-[24px] bg-white shadow-xl">
      <img src={store.image} alt={store.name} className="h-36 w-full object-cover" />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-[#3f3028]">{store.name}</h3>
            <p className="mt-1 text-xs font-bold text-[#d66b54]">{store.category}</p>
          </div>

          <div className="rounded-full bg-[#ffe8df] px-3 py-1 text-sm font-black text-[#d66b54]">
            ★ {store.rating}
          </div>
        </div>

        <p className="mt-3 text-sm leading-6 text-[#7c675d]">{store.comment}</p>
        <p className="mt-3 text-xs leading-5 text-[#9a857b]">{store.address}</p>

        <a
          href={getAmapNavigationUrl(store)}
          target="_blank"
          rel="noreferrer"
          className="mt-4 block rounded-full bg-[#3f3028] px-4 py-3 text-center text-sm font-black text-white transition hover:bg-[#d66b54]"
        >
          打开高德地图导航
        </a>
      </div>
    </div>
  );
}

function CityMapPage({ city, onBack }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const infoWindowRef = useRef(null);
  const markersRef = useRef([]);
  const clusterRef = useRef(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [category, setCategory] = useState("全部");
  const [selectedStore, setSelectedStore] = useState(null);

  const cityStores = useMemo(() => stores.filter((store) => store.city === city), [city]);

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
          plugins: ["AMap.Scale", "AMap.ToolBar", "AMap.MarkerCluster"],
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
          offset: new AMap.Pixel(0, -64),
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
      if (clusterRef.current) {
        clusterRef.current.setMap(null);
        clusterRef.current = null;
      }
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

    if (clusterRef.current) {
      clusterRef.current.setMap(null);
      clusterRef.current = null;
    }

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const markers = filteredStores.map((store) => {
      const marker = new AMap.Marker({
        position: [store.lng, store.lat],
        title: store.name,
        content: `
        <div style="
          position: relative;
          width: 72px;
          height: 72px;
          border-radius: 999px;
          background: linear-gradient(135deg, #fff 0%, #ffe8df 100%);
          border: 6px solid #ffffff;
          box-shadow: 0 14px 36px rgba(92, 55, 40, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 34px;
        ">
          <div style="
            position: absolute;
            inset: -10px;
            border-radius: 999px;
            background: rgba(214, 107, 84, 0.18);
            z-index: -1;
          "></div>
          📍
        </div>
        `,
        offset: new AMap.Pixel(-36, -72),
      });

      marker.on("click", () => {
        setSelectedStore(store);
        const content = document.createElement("div");
        content.innerHTML = `
          <div style="
            width: 280px;
            overflow: hidden;
            border-radius: 24px;
            background: white;
            box-shadow: 0 20px 50px rgba(60, 40, 30, 0.25);
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          ">
            <img src="${store.image}" style="width: 100%; height: 140px; object-fit: cover;" />
            <div style="padding: 16px;">
              <div style="display: flex; justify-content: space-between; gap: 12px; align-items: flex-start;">
                <div>
                  <div style="font-size: 18px; font-weight: 900; color: #3f3028;">${store.name}</div>
                  <div style="margin-top: 4px; font-size: 12px; font-weight: 800; color: #d66b54;">${store.category}</div>
                </div>
                <div style="border-radius: 999px; background: #ffe8df; color: #d66b54; padding: 4px 10px; font-size: 13px; font-weight: 900; white-space: nowrap;">★ ${store.rating}</div>
              </div>
              <div style="margin-top: 12px; font-size: 14px; line-height: 1.7; color: #7c675d;">${store.comment}</div>
              <div style="margin-top: 10px; font-size: 12px; line-height: 1.6; color: #9a857b;">${store.address}</div>
              <a href="${getAmapNavigationUrl(store)}" target="_blank" style="
                display: block;
                margin-top: 14px;
                border-radius: 999px;
                background: #3f3028;
                color: white;
                padding: 12px 16px;
                text-align: center;
                font-size: 14px;
                font-weight: 900;
                text-decoration: none;
              ">打开高德地图导航</a>
            </div>
          </div>
        `;

        infoWindowRef.current.setContent(content);
        infoWindowRef.current.open(map, [store.lng, store.lat]);
      });

      return marker;
    });

    markersRef.current = markers;

    if (markers.length > 0) {
      clusterRef.current = new AMap.MarkerCluster(map, markers, {
        gridSize: 90,
        maxZoom: 16,
        renderClusterMarker: (context) => {
          const count = context.count;
          context.marker.setContent(`
            <div style="
              position: relative;
              width: 88px;
              height: 88px;
              border-radius: 999px;
              background: linear-gradient(135deg, #3f3028 0%, #d66b54 100%);
              border: 8px solid #ffd2c2;
              color: white;
              box-shadow: 0 18px 44px rgba(92, 55, 40, 0.42);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              font-size: 20px;
              font-weight: 900;
              line-height: 1.05;
            ">
              <div style="
                position: absolute;
                inset: -14px;
                border-radius: 999px;
                background: rgba(214, 107, 84, 0.18);
                z-index: -1;
              "></div>
              <div>${count}</div>
              <div style="font-size: 12px; margin-top: 4px;">家店</div>
            </div>
          `);
          context.marker.setOffset(new AMap.Pixel(-44, -44));
        },
      });

      map.setFitView(markers, false, [80, 80, 80, 80], 15);
    }
  }, [filteredStores, mapLoaded]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#fff7f1]">
      <div ref={mapRef} className="h-full w-full" />

      {loadError && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-[#fff7f1] p-6">
          <div className="max-w-md rounded-[28px] bg-white p-6 text-center shadow-xl">
            <div className="text-4xl">🥲</div>
            <h2 className="mt-3 text-2xl font-black text-[#3f3028]">地图加载失败</h2>
            <p className="mt-3 text-sm leading-6 text-[#7c675d]">{loadError}</p>
          </div>
        </div>
      )}

      <div className="absolute left-4 right-4 top-4 z-[1000] md:left-6 md:right-auto md:w-[380px]">
        <div className="rounded-[32px] border border-white/70 bg-white/85 p-5 shadow-[0_18px_50px_rgba(208,139,113,0.25)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onBack}
              className="rounded-full bg-[#3f3028] px-4 py-2 text-sm font-black text-white transition hover:bg-[#d66b54]"
            >
              ← 返回
            </button>

            <div className="rounded-full bg-[#ffe8df] px-4 py-2 text-sm font-black text-[#d66b54]">
              {filteredStores.length} 家店
            </div>
          </div>

          <h1 className="mt-5 text-3xl font-black text-[#3f3028]">
            {city}探店地图 ♡
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#7c675d]">
            缩小时自动聚合，放大后显示具体店铺。点击小标记可以查看评价和导航。
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full px-4 py-2 text-sm font-black transition ${
                  category === item
                    ? "bg-[#d66b54] text-white"
                    : "bg-[#fff0e9] text-[#8b7469] hover:bg-[#ffe1d5]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedStore && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] md:left-auto md:right-6 md:w-[320px]">
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_18px_50px_rgba(208,139,113,0.25)] backdrop-blur-xl">
            <p className="text-xs font-black text-[#d66b54]">当前选中</p>
            <h3 className="mt-1 text-xl font-black text-[#3f3028]">{selectedStore.name}</h3>
            <p className="mt-2 text-sm leading-6 text-[#7c675d]">{selectedStore.comment}</p>
          </div>
        </div>
      )}
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
