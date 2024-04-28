import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

import "./application.css";
import "ol/ol.css";
import { map, MapContext } from "../map/mapContext";

import { View } from "ol";
import { Layer } from "ol/layer";
import { StationLayerCheckbox } from "../station/stationLayerCheckbox";

export function Application() {
  function handleFocusUser(e: React.MouseEvent) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      map.getView().animate({
        center: [longitude, latitude],
        zoom: 12,
      });
    });
  }

  const [baseLayer, setBaseLayer] = useState<Layer>(
    () => new TileLayer({ source: new OSM() }),
  );

  const [view, setView] = useState(new View({ center: [10, 59], zoom: 8 }));
  useEffect(() => map.setView(view), [view]);

  useEffect(() => {
    const projection = baseLayer?.getSource()?.getProjection();
    if (projection) {
      setView(
        (oldView) =>
          new View({
            center: oldView.getCenter(),
            zoom: oldView.getZoom(),
            projection,
          }),
      );
    }
  }, [baseLayer]);

  const [vectorLayers, setVectorLayers] = useState<Layer[]>([]);
  const layers = useMemo(
    () => [baseLayer, ...vectorLayers],
    [baseLayer, vectorLayers],
  );
  useEffect(() => map.setLayers(layers), [layers]);

  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);
  return (
    <MapContext.Provider
      value={{ map, vectorLayers, setVectorLayers, setBaseLayer }}
    >
      <header>
        <h1>Trainapp</h1>
      </header>
      <nav>
        <a href={"#"} onClick={handleFocusUser}>
          Show my location
        </a>
        <StationLayerCheckbox />
      </nav>
      <main>
        <div ref={mapRef}></div>
      </main>
    </MapContext.Provider>
  );
}
