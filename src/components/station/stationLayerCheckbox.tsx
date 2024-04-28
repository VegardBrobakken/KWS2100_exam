import React from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Fill, Stroke, Style } from "ol/style";
import { useState } from "react";
import { useLayer } from "../map/useLayer";
import CircleStyle from "ol/style/Circle";

const stationLayer = new VectorLayer({
  source: new VectorSource({
    url: "/stations.json",
    format: new GeoJSON(),
  }),
  style: new Style({
    image: new CircleStyle({
      radius: 4,
      fill: new Fill({ color: "blue" }),
      stroke: new Stroke({ color: "white", width: 2 }),
    }),
  }),
});

export function StationLayerCheckbox() {
  const [checked, setChecked] = useState(true);

  useLayer(stationLayer, checked);

  return (
    <div>
      <label>
        <input
          type={"checkbox"}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        Show trainstations
      </label>
    </div>
  );
}
