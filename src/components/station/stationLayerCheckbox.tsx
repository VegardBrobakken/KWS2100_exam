import React, { useContext, useEffect, useState } from "react";
import { useLayer } from "../map/useLayer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";
import { Feature, MapBrowserEvent } from "ol";
import { Point } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { MapContext } from "../map/mapContext";

const stationLayer = new VectorLayer({
  source: new VectorSource({
    url: "/kws2100_exam/stations.json",
    format: new GeoJSON(),
  }),
  style: stationStyle,
});

type StationProperties = {
  navn: string;
};

type StationFeature = { getProperties(): StationProperties } & Feature<Point>;

function stationStyle(f: FeatureLike) {
  const feature = f as StationFeature;
  return new Style({
    image: new Circle({
      stroke: new Stroke({ color: "white", width: 1 }),
      fill: new Fill({
        color: "blue",
      }),
      radius: 4,
    }),
  });
}

export function StationLayerCheckbox() {
  const { map } = useContext(MapContext);
  const [checked, setChecked] = useState(false);

  const [activeFeature, setActiveFeature] = useState<StationFeature>();

  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    const resolution = map.getView().getResolution();
    if (!resolution || resolution > 100) {
      return;
    }
    const features: FeatureLike[] = [];
    map.forEachFeatureAtPixel(e.pixel, (f) => features.push(f), {
      hitTolerance: 5,
      layerFilter: (l) => l === stationLayer,
    });
    if (features.length === 1) {
      setActiveFeature(features[0] as StationFeature);
    } else {
      setActiveFeature(undefined);
    }
  }

  useLayer(stationLayer, checked);

  useEffect(() => {
    if (checked) {
      map?.on("pointermove", handlePointerMove);
    }
    return () => map?.un("pointermove", handlePointerMove);
  }, [checked]);

  return (
    <div>
      <label>
        <input
          type={"checkbox"}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        Show stations
      </label>
    </div>
  );
}
