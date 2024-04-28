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

const lineLayer = new VectorLayer({
  source: new VectorSource({
    url: "/kws2100_exam/lines.json",
    format: new GeoJSON(),
  }),
  style: lineStyle,
});

function lineStyle(f: FeatureLike) {
  return new Style({
    stroke: new Stroke({
      color: "red",
      width: 3,
    }),
  });
}

export function LineLayerCheckbox() {
  const { map } = useContext(MapContext);
  const [checked, setChecked] = useState(false);

  useLayer(lineLayer, checked);

  return (
    <div>
      <label>
        <input
          type={"checkbox"}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        Show trainlines
      </label>
    </div>
  );
}
