import { s as stackOffsetNone, a as stackOffsetExpand, b as stackOffsetSilhouette, c as stackOffsetWiggle, d as stackOffsetDiverging, e as d3Stack, f as stackOrderInsideOut, g as createArc } from "./d3-shape.mjs";
import { b as band } from "./d3-scale.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "./react.mjs";
function resolveScaleInput(source, options) {
  const infer = isScaleFactory(source);
  const created = infer ? source() : source;
  if (typeof created !== "function" || typeof created.copy !== "function" || typeof created.domain !== "function" || typeof created.range !== "function") {
    throw new TypeError(
      "A scale factory must return a copyable scale with domain and range methods"
    );
  }
  const scale = created.copy();
  if (infer) {
    const domain = inferScaleDomain(scale, options.values, options.includeZero);
    if (domain) {
      const inferable = scale;
      inferable.domain(domain);
    }
  }
  applyScaleNice(scale, options.nice, options.niceCount);
  return scale;
}
function isScaleFactory(source) {
  return typeof source === "function" && !("copy" in source);
}
function inferScaleDomain(scale, values, includeZero = false) {
  const observed = values.filter(isChartValue$1);
  if (!observed.length) return void 0;
  if (typeof scale.bandwidth === "function" || typeof scale.ticks !== "function") {
    const domain = [];
    const seen = /* @__PURE__ */ new Set();
    for (const value of observed) {
      const key = value instanceof Date ? `date:${value.getTime()}` : `${typeof value}:${String(value)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      domain.push(value);
    }
    return domain;
  }
  const temporal = scale.domain().some((value) => value instanceof Date);
  if (temporal) {
    const dates = observed.filter(
      (value) => value instanceof Date
    );
    if (dates.length !== observed.length) {
      throw new TypeError(
        "A temporal scale factory requires Date channel values"
      );
    }
    let minimum2 = Infinity;
    let maximum2 = -Infinity;
    for (const value of dates) {
      const number2 = value.getTime();
      minimum2 = Math.min(minimum2, number2);
      maximum2 = Math.max(maximum2, number2);
    }
    if (!Number.isFinite(minimum2) || !Number.isFinite(maximum2)) {
      throw new TypeError(
        "A temporal scale factory requires Date channel values"
      );
    }
    if (minimum2 === maximum2) {
      const halfDay = 432e5;
      minimum2 -= halfDay;
      maximum2 += halfDay;
    }
    return [new Date(minimum2), new Date(maximum2)];
  }
  let minimum = Infinity;
  let maximum = -Infinity;
  for (const value of observed) {
    if (!isFiniteNumber$2(value)) {
      throw new TypeError(
        "A quantitative scale factory requires numeric values"
      );
    }
    minimum = Math.min(minimum, value);
    maximum = Math.max(maximum, value);
  }
  if (!Number.isFinite(minimum) || !Number.isFinite(maximum)) {
    throw new TypeError("A quantitative scale factory requires numeric values");
  }
  const logarithmic = isLogarithmicScale(scale);
  if (includeZero) {
    if (logarithmic) {
      throw new TypeError(
        "An inferred log scale cannot include an implicit zero baseline"
      );
    }
    minimum = Math.min(0, minimum);
    maximum = Math.max(0, maximum);
  }
  validateInferredLogDomain(scale, minimum, maximum);
  if (minimum === maximum) {
    if (minimum === 0) return [0, 1];
    const offset = Math.abs(minimum) * 0.05 || 1;
    minimum -= offset;
    maximum += offset;
  }
  return [minimum, maximum];
}
function isLogarithmicScale(scale) {
  return "base" in scale && typeof scale.base === "function";
}
function validateInferredLogDomain(scale, minimum, maximum) {
  if (isLogarithmicScale(scale) && (minimum === 0 || maximum === 0 || minimum < 0 && maximum > 0)) {
    throw new TypeError("An inferred log domain cannot include or cross zero");
  }
}
function applyScaleNice(scale, nice, defaultCount = 5) {
  if (!nice) return;
  const candidate = scale;
  if (typeof candidate.nice !== "function") {
    throw new TypeError("This scale does not support nicening");
  }
  candidate.nice(typeof nice === "number" ? nice : defaultCount);
}
function createColorScale(values, options, theme) {
  if (options?.scale) {
    const infer = isColorScaleFactory(options.scale);
    const source = infer ? options.scale() : options.scale;
    if (typeof source !== "function" || typeof source.copy !== "function") {
      throw new TypeError("A color scale must be callable and copyable");
    }
    if (infer && (typeof source.domain !== "function" || typeof source.range !== "function")) {
      throw new TypeError(
        "A color scale factory must return a scale with domain and range methods"
      );
    }
    const scale = source.copy();
    const kind = colorScaleKind(scale);
    if (infer) {
      const inferable = scale;
      if (options.range?.length) {
        inferable.range(options.range);
      }
      const domain3 = options.domain ?? inferColorDomain(inferable, values);
      if (options.domain !== void 0 || domain3.length) {
        inferable.domain(domain3);
      }
      const range3 = inferable.range();
      if (!range3.length || range3.some((value) => typeof value !== "string")) {
        throw new TypeError("A color-scale factory requires a string range");
      }
    }
    if (options.nice) {
      const nice = scale.nice;
      if (typeof nice !== "function") {
        throw new TypeError("This color scale does not support nicening");
      }
      nice.call(scale, typeof options.nice === "number" ? options.nice : 5);
    }
    const domain2 = scale.domain?.() ?? options.domain ?? [];
    const range2 = (scale.range?.() ?? options.range ?? theme.palette).map(
      String
    );
    return {
      type: "configured",
      kind,
      domain: domain2,
      range: range2,
      map: (value) => {
        if (value == null) return range2[0] ?? "currentColor";
        const output = scale(value);
        return output == null ? "currentColor" : String(output);
      }
    };
  }
  if (options?.resolver) {
    return options.resolver.resolve({
      values,
      domain: options.domain,
      range: options.range,
      theme
    });
  }
  const range = options?.range?.length ? options.range : theme.palette;
  const domain = uniqueChartKeys(options?.domain ?? values);
  const mappedKeys = domain.map(valueKey);
  const map = (value) => {
    if (value == null) return range[0] ?? "currentColor";
    let index = mappedKeys.indexOf(valueKey(value));
    if (index < 0) index = mappedKeys.push(valueKey(value)) - 1;
    return range[index % range.length] ?? "currentColor";
  };
  return { type: "ordinal", kind: "categorical", domain, range, map };
}
function uniqueChartKeys(values) {
  return [...new Set(values.filter(isChartKey$1))];
}
function isChartKey$1(value) {
  return typeof value === "string" || typeof value === "number";
}
function isColorScaleFactory(source) {
  return typeof source === "function" && !("copy" in source);
}
function inferColorDomain(scale, values) {
  const observed = values.filter(isChartKey$1);
  const quantiles = scale.quantiles;
  const thresholds = scale.thresholds;
  if (quantiles) {
    return quantitativeColorValues(observed);
  }
  if (scale.invertExtent && !thresholds) {
    throw new TypeError(
      "Threshold color-scale factory requires an explicit domain"
    );
  }
  if (scale.ticks || thresholds) {
    const numeric = quantitativeColorValues(observed);
    let minimum = Infinity;
    let maximum = -Infinity;
    for (const value of numeric) {
      minimum = Math.min(minimum, value);
      maximum = Math.max(maximum, value);
    }
    if (!Number.isFinite(minimum) || !Number.isFinite(maximum)) {
      return [];
    }
    validateInferredLogDomain(scale, minimum, maximum);
    if (minimum === maximum) {
      if (minimum === 0) {
        maximum = 1;
      } else {
        const offset = Math.abs(minimum) * 0.05 || 1;
        minimum -= offset;
        maximum += offset;
      }
    }
    if (thresholds) return [minimum, maximum];
    const stopCount = Math.max(2, scale.domain().length, scale.range().length);
    return Array.from(
      { length: stopCount },
      (_value, index) => minimum + (maximum - minimum) * index / (stopCount - 1)
    );
  }
  return uniqueChartKeys(observed);
}
function quantitativeColorValues(values) {
  const numeric = values.filter(
    (value) => typeof value === "number" && Number.isFinite(value)
  );
  if (numeric.length !== values.length) colorScaleTypeMismatch();
  return numeric;
}
function colorScaleTypeMismatch() {
  throw new TypeError(
    "A quantitative color-scale factory requires numeric values"
  );
}
function colorScaleKind(scale) {
  if (scale.quantiles) {
    return scale.invertExtent ? "quantile" : "continuous";
  }
  if (scale.thresholds) return "quantize";
  if (scale.invertExtent) return "threshold";
  return scale.ticks ? "continuous" : "categorical";
}
function valueKey(value) {
  if (value instanceof Date) return `date:${value.getTime()}`;
  if (typeof value === "string") return `string:${value.length}:${value}`;
  return `${typeof value}:${String(value)}`;
}
const warnedKeyFallbacks = /* @__PURE__ */ new WeakSet();
function isChartValue$1(value) {
  return typeof value === "string" || value instanceof Date && Number.isFinite(value.getTime()) || isFiniteNumber$2(value);
}
function isFiniteNumber$2(value) {
  return typeof value === "number" && Number.isFinite(value);
}
function isNonnegativeFiniteNumber(value) {
  return isFiniteNumber$2(value) && value >= 0;
}
function createMark(initialize, motion) {
  const normalizedInitialize = (context) => {
    const initialized = normalizeMarkInitialization(initialize(context));
    return motion === void 0 || initialized.motion !== void 0 ? initialized : { ...initialized, motion };
  };
  return motion === void 0 ? { initialize: normalizedInitialize } : { initialize: normalizedInitialize, motion };
}
function normalizeMarkInitialization(initialized) {
  if (typeof initialized.render === "function") return initialized;
  return {
    ...initialized,
    render: () => {
      throw new TypeError(
        `Mark "${initialized.id}" must resolve its layout before rendering`
      );
    }
  };
}
function markStates(data, definitions) {
  return definitions?.length ? {
    data,
    definitions
  } : void 0;
}
function visualValue(channel, datum, index, data, fallback) {
  return typeof channel === "function" ? channel(datum, { index, data }) : channel ?? fallback;
}
function channelValues(data, channel, fallback) {
  if (typeof channel === "function") {
    return data.map((datum, index) => channel(datum, { index, data }));
  }
  if (channel !== void 0) {
    return data.map(
      (datum) => datum != null && typeof datum === "object" ? datum[channel] : void 0
    );
  }
  return data.map((datum, index) => fallback(datum, { index, data }));
}
function inferredKeyValues(data, key, options = {}) {
  if (key !== void 0) {
    return channelValues(data, key, (_datum, { index }) => index);
  }
  const candidates = [
    data.map(
      (datum) => datum != null && typeof datum === "object" ? datum.id : void 0
    ),
    data.map((datum) => {
      if (datum == null || typeof datum !== "object") return void 0;
      const nested = datum.data;
      return nested != null && typeof nested === "object" ? nested.id : void 0;
    }),
    ...options.candidates ?? []
  ];
  for (const candidate of candidates) {
    if (candidate.length !== data.length) continue;
    const normalized = candidate.map(normalizeInferredKey);
    if (normalized.every((value) => value !== void 0) && keysAreUniqueWithinGroups(normalized, options.groups)) {
      return normalized;
    }
  }
  warnAboutKeyFallback(
    options.markId,
    options.candidates,
    options.warningIdentity
  );
  return data.map((_datum, index) => index);
}
function normalizeInferredKey(value) {
  if (isChartKey$1(value)) return value;
  if (value instanceof Date && Number.isFinite(value.getTime())) {
    return `date:${value.getTime()}`;
  }
  return void 0;
}
function keysAreUniqueWithinGroups(keys, groups) {
  const seen = /* @__PURE__ */ new Set();
  for (let index = 0; index < keys.length; index += 1) {
    const identity = JSON.stringify([
      valueKey(groups?.[index] ?? null),
      valueKey(keys[index])
    ]);
    if (seen.has(identity)) return false;
    seen.add(identity);
  }
  return true;
}
function warnAboutKeyFallback(markId, candidates, warningIdentity) {
  if (!markId || !candidates?.length || !warningIdentity || warnedKeyFallbacks.has(warningIdentity) || typeof process === "undefined" || true) {
    return;
  }
}
function stackExtents(input, options = {}) {
  const anchorFraction = resolveAnchorFraction(options);
  if (input.length === 0) return /* @__PURE__ */ new Map();
  const positions = [];
  const positionIndex = /* @__PURE__ */ new Map();
  const seriesInput = [];
  const seriesSeen = /* @__PURE__ */ new Set();
  for (const row of input) {
    const positionIdentity = valueKey(row.position);
    if (!positionIndex.has(positionIdentity)) {
      positionIndex.set(positionIdentity, positions.length);
      positions.push(row.position);
    }
    const seriesIdentity = valueKey(row.series);
    if (!seriesSeen.has(seriesIdentity)) {
      seriesSeen.add(seriesIdentity);
      seriesInput.push(row.series);
    }
  }
  const rows = positions.map(
    () => /* @__PURE__ */ Object.create(null)
  );
  const sourceIndices = /* @__PURE__ */ new Map();
  for (const row of input) {
    const position = positionIndex.get(valueKey(row.position));
    const seriesIdentity = valueKey(row.series);
    const identity = `${position}:${seriesIdentity}`;
    if (sourceIndices.has(identity)) {
      throw new TypeError(
        `A stack requires at most one value for each position and series; duplicate ${String(row.position)} / ${String(row.series)}`
      );
    }
    sourceIndices.set(identity, row.index);
    rows[position][seriesIdentity] = row.value;
  }
  const insideOut = options.order === "inside-out";
  if (anchorFraction !== void 0 && input.some(({ value }) => value < 0)) {
    throw new TypeError("A stack anchor requires nonnegative values");
  }
  const series = orderedSeries(input, seriesInput, options.order);
  if (options.reverse && !insideOut) series.reverse();
  const identities2 = series.map(valueKey);
  const offset = options.anchor ? stackOffsetNone : options.offset === "normalize" ? stackOffsetExpand : options.offset === "center" ? stackOffsetSilhouette : options.offset === "wiggle" ? stackOffsetWiggle : stackOffsetDiverging;
  const generator = d3Stack().keys(identities2).value((row, key) => row[key] ?? 0).offset(offset);
  if (insideOut) {
    generator.order(
      options.reverse ? (seriesValues) => stackOrderInsideOut(seriesValues).reverse() : stackOrderInsideOut
    );
  }
  const stacked = generator(rows);
  if (options.anchor && anchorFraction !== void 0) {
    translateAnchorToZero(stacked, options.anchor.series, anchorFraction);
  }
  if (options.offset === "wiggle") translateWiggleToZero(stacked);
  const output = /* @__PURE__ */ new Map();
  stacked.forEach((seriesValues) => {
    const seriesIdentity = seriesValues.key;
    seriesValues.forEach((extent, position) => {
      const sourceIndex = sourceIndices.get(`${position}:${seriesIdentity}`);
      if (sourceIndex === void 0) return;
      output.set(sourceIndex, { start: extent[0], end: extent[1] });
    });
  });
  return output;
}
function resolveAnchorFraction(options) {
  const anchor = options.anchor;
  if (!anchor) return void 0;
  if (options.offset !== void 0 && options.offset !== "diverging") {
    throw new TypeError(
      "A stack anchor can only be used with the diverging offset"
    );
  }
  const fraction = anchor.fraction ?? 0.5;
  if (!Number.isFinite(fraction) || fraction < 0 || fraction > 1) {
    throw new TypeError("A stack anchor fraction must be between zero and one");
  }
  return fraction;
}
function translateAnchorToZero(stacked, series, fraction) {
  const anchorIdentity = valueKey(series);
  const anchorSeries = stacked.find(
    (seriesValues) => seriesValues.key === anchorIdentity
  );
  if (!anchorSeries) {
    throw new TypeError(
      `Stack anchor series "${String(series)}" is not in the resolved series order`
    );
  }
  anchorSeries.forEach((anchorExtent, position) => {
    const shift = anchorExtent[0] + (anchorExtent[1] - anchorExtent[0]) * fraction;
    for (const seriesValues of stacked) {
      const extent = seriesValues[position];
      if (!extent) continue;
      extent[0] -= shift;
      extent[1] -= shift;
    }
  });
}
function translateWiggleToZero(stacked) {
  let baseline = Number.POSITIVE_INFINITY;
  for (const series of stacked) {
    for (const extent of series) baseline = Math.min(baseline, extent[0]);
  }
  if (!Number.isFinite(baseline) || baseline === 0) return;
  for (const series of stacked) {
    for (const extent of series) {
      extent[0] -= baseline;
      extent[1] -= baseline;
    }
  }
}
function stackValues(positions, values, series, options = {}, fallbackSeries = "value") {
  const input = [];
  for (let index = 0; index < positions.length; index += 1) {
    const position = positions[index];
    const value = values[index];
    if (!isChartValue(position) || !isFiniteNumber$1(value)) continue;
    const seriesValue = series[index];
    input.push({
      index,
      position,
      value,
      series: isChartKey(seriesValue) ? seriesValue : fallbackSeries === "index" ? index : "value"
    });
  }
  const extents = stackExtents(input, options);
  const starts = Array.from(
    { length: positions.length },
    () => void 0
  );
  const ends = Array.from(
    { length: positions.length },
    () => void 0
  );
  for (const [index, extent] of extents) {
    starts[index] = extent.start;
    ends[index] = extent.end;
  }
  return { starts, ends };
}
function isChartKey(value) {
  return typeof value === "string" || typeof value === "number";
}
function isChartValue(value) {
  return typeof value === "string" || isFiniteNumber$1(value) || value instanceof Date && Number.isFinite(value.getTime());
}
function isFiniteNumber$1(value) {
  return typeof value === "number" && Number.isFinite(value);
}
function orderedSeries(rows, input, order) {
  if (Array.isArray(order)) {
    const explicit = [...order];
    const explicitKeys = new Set(explicit.map(valueKey));
    return [
      ...explicit,
      ...input.filter((value) => !explicitKeys.has(valueKey(value)))
    ];
  }
  if (order !== "ascending" && order !== "descending") return [...input];
  const totals = new Map(input.map((value) => [valueKey(value), 0]));
  for (const row of rows) {
    const key = valueKey(row.series);
    totals.set(key, (totals.get(key) ?? 0) + Math.abs(row.value));
  }
  return [...input].sort((left, right) => {
    const difference = (totals.get(valueKey(left)) ?? 0) - (totals.get(valueKey(right)) ?? 0);
    return order === "ascending" ? difference : -difference;
  });
}
function areaY(source, options = {}) {
  const data = Array.isArray(source) ? source : Array.from(source);
  return createMark(({ markIndex }) => {
    const id = options.id ?? `area-y-${markIndex}`;
    const xValues = channelValues(data, options.x, (_datum, { index }) => index);
    const rawY = options.y ?? options.y2;
    const rawYValues = typeof rawY === "number" ? data.map(() => rawY) : channelValues(
      data,
      rawY,
      (datum) => typeof datum === "number" ? datum : void 0
    );
    const zValues = channelValues(data, options.z, () => null);
    const colorValues = options.color === void 0 ? zValues : channelValues(data, options.color, () => null);
    const groupValues = options.z === void 0 && options.color !== void 0 ? colorValues : zValues;
    const explicitExtent = options.y1 !== void 0 || options.y2 !== void 0;
    if (explicitExtent && options.layout) {
      throw new TypeError(
        "An area with explicit y1 or y2 endpoints cannot also configure a stack layout"
      );
    }
    const stacked = explicitExtent ? void 0 : stackValues(xValues, rawYValues, groupValues, options.layout);
    const y1Values = explicitExtent ? typeof options.y1 === "number" ? data.map(() => options.y1) : channelValues(data, options.y1, () => 0) : stacked.starts;
    const y2Values = explicitExtent ? typeof options.y2 === "number" ? data.map(() => options.y2) : channelValues(data, options.y2 ?? options.y, () => void 0) : stacked.ends;
    const keys = inferredKeyValues(data, options.key, {
      groups: groupValues,
      candidates: [xValues],
      markId: id,
      warningIdentity: options
    });
    const groups = /* @__PURE__ */ new Map();
    groupValues.forEach((value, index) => {
      const key = valueKey(value ?? null);
      const group = groups.get(key);
      if (group) group.push(index);
      else groups.set(key, [index]);
    });
    return {
      id,
      states: markStates(data, options.states),
      seriesFromColor: options.z === void 0 && options.color !== void 0,
      channels: {
        x: { scale: "x", values: xValues.filter(isChartValue$1) },
        y: {
          scale: "y",
          values: [
            ...y2Values.filter(isFiniteNumber$2),
            ...y1Values.filter(isFiniteNumber$2)
          ],
          includeZero: options.y1 === void 0
        },
        color: {
          scale: "color",
          values: colorValues.filter(isChartKey$1)
        }
      },
      render: ({ scales, color: resolveColor }) => {
        const nodes = [];
        for (const [groupKey, indices] of groups) {
          const firstIndex = indices[0];
          if (firstIndex === void 0) continue;
          const group = groupValues[firstIndex] ?? null;
          const datum = data[firstIndex];
          const resolvedColor = resolveColor(colorValues[firstIndex] ?? null);
          const fill = visualValue(
            options.fill,
            datum,
            firstIndex,
            data,
            resolvedColor
          );
          const stroke = options.stroke === void 0 ? void 0 : visualValue(
            options.stroke,
            datum,
            firstIndex,
            data,
            resolvedColor
          );
          let top = [];
          let bottom = [];
          let segmentPoints = [];
          let segmentIndex = 0;
          const flush = () => {
            if (!top.length) return;
            const lower = [...bottom].reverse();
            const path = options.curve?.area(top, bottom);
            nodes.push({
              kind: "area",
              key: `${id}:${groupKey}:segment:${segmentIndex}`,
              points: [...top, ...lower],
              path,
              interaction: { points: segmentPoints, affinity: "x" },
              style: {
                fill,
                fillOpacity: options.fillOpacity ?? 0.2,
                stroke,
                strokeWidth: options.strokeWidth
              }
            });
            top = [];
            bottom = [];
            segmentPoints = [];
            segmentIndex += 1;
          };
          for (const datumIndex of indices) {
            const xValue = xValues[datumIndex];
            const yValue = rawYValues[datumIndex];
            const y1Value = y1Values[datumIndex];
            const y2Value = y2Values[datumIndex];
            if (!isChartValue$1(xValue) || !isFiniteNumber$2(yValue) || !isFiniteNumber$2(y1Value) || !isFiniteNumber$2(y2Value)) {
              flush();
              continue;
            }
            const x = scales.x.map(xValue);
            const y = scales.y.map(y2Value);
            top.push([x, y]);
            bottom.push([x, scales.y.map(y1Value)]);
            const key = `${id}:${groupKey}:${valueKey(keys[datumIndex])}`;
            const point = {
              key,
              markId: id,
              group,
              groupLabel: group == null ? id : String(group),
              datum: data[datumIndex],
              datumIndex,
              xValue,
              yValue,
              y1Value,
              y2Value,
              yInterval: "difference",
              x,
              y,
              color: fill
            };
            segmentPoints.push(point);
          }
          flush();
        }
        return {
          nodes: [
            {
              kind: "group",
              key: id,
              className: "ts-chart__area",
              ariaHidden: true,
              children: nodes
            }
          ]
        };
      }
    };
  }, options.motion);
}
function resolveConfiguredScale(source, context) {
  const scale = resolveScaleInput(source, {
    values: context.values,
    includeZero: context.includeZero,
    nice: context.options?.nice,
    niceCount: context.tickCount
  });
  const contentDomain = copyDomain(scale.domain());
  const viewport = resolveViewport(scale, context, contentDomain);
  const categorical = scale.bandwidth !== void 0;
  const naturalRange = categorical && context.id === "y" ? [Math.min(...context.range), Math.max(...context.range)] : context.range;
  const range = context.options?.reverse ? [naturalRange[1], naturalRange[0]] : naturalRange;
  scale.range(range);
  const domain = copyDomain(scale.domain());
  if (viewport && (!sameDomain(domain, viewport.domain) || !mapsDomainToRange(scale, viewport.domain, range))) {
    throw new TypeError(
      `Chart viewport "${context.id}" requires independent configurable domain and range capabilities`
    );
  }
  const tickOptions = context.options?.axis === false ? void 0 : context.options?.axis?.ticks;
  const configuredTicks = tickOptions === false ? void 0 : tickOptions;
  const tickValues = configuredTicks?.values ?? scale.ticks?.(context.tickCount) ?? domain;
  const tickFormat = scale.tickFormat?.(context.tickCount);
  const bandwidth = scale.bandwidth?.() ?? 0;
  const map = (value) => {
    const result = scale(value);
    return result === void 0 ? Number.NaN : result + bandwidth / 2;
  };
  const invert = scale.invert ? (position) => scale.invert(position - bandwidth / 2) : void 0;
  return {
    id: context.id,
    type: categorical ? "band" : "configured",
    domain,
    map,
    ...invert ? { invert } : {},
    ticks: tickValues.map((value) => ({
      value,
      position: map(value),
      label: configuredTicks?.format?.(value) ?? tickFormat?.(value) ?? formatValue(value)
    })),
    bandwidth,
    ...viewport ? {
      viewport: {
        contentDomain,
        domain: viewport.domain,
        translate: viewport.translate,
        map: (value) => map(value) + viewport.translate
      }
    } : {}
  };
}
function resolveViewport(scale, context, contentDomain) {
  const viewport = context.options?.viewport;
  if (!viewport) return void 0;
  const capable = scale;
  if (scale.bandwidth !== void 0 || typeof scale.ticks !== "function" || typeof capable.invert !== "function") {
    throw new TypeError(
      `Chart viewport "${context.id}" requires a continuous numeric or temporal scale`
    );
  }
  if (typeof capable.clamp === "function" && capable.clamp() === true) {
    throw new TypeError(
      `Chart viewport "${context.id}" does not support a clamped scale`
    );
  }
  const domain = viewport.domain;
  if (domain.length !== 2 || !sameContinuousType(domain[0], domain[1])) {
    invalidViewportDomain(context.id);
  }
  const first = continuousNumber(domain[0]);
  const last = continuousNumber(domain[1]);
  if (!Number.isFinite(first) || !Number.isFinite(last) || first === last) {
    invalidViewportDomain(context.id);
  }
  validateViewportLogDomains(scale, context.id, contentDomain, domain);
  const translate = viewport.translate ?? 0;
  if (!Number.isFinite(translate)) {
    throw new TypeError(
      `Chart viewport "${context.id}" translate must be a finite number`
    );
  }
  if (sameDomain(scale.domain(), domain)) {
    configureScaleDomain(
      scale,
      [domain[1], domain[0]],
      context.id
    );
  }
  configureScaleDomain(scale, domain, context.id);
  const resolved = copyDomain(scale.domain());
  if (resolved.length !== 2 || !sameContinuousType(resolved[0], resolved[1])) {
    invalidConfigurableDomain(context.id);
  }
  return {
    domain: resolved,
    translate
  };
}
function configureScaleDomain(scale, domain, id) {
  const setDomain = scale.domain;
  try {
    setDomain.call(scale, [...domain]);
  } catch {
    invalidConfigurableDomain(id);
  }
  if (!sameDomain(scale.domain(), domain)) invalidConfigurableDomain(id);
}
function sameDomain(resolved, expected) {
  return resolved.length === expected.length && resolved.every((value, index) => sameChartValue$1(value, expected[index]));
}
function mapsDomainToRange(scale, domain, range) {
  const first = scale(domain[0]);
  const last = scale(domain[1]);
  return first !== void 0 && last !== void 0 && Number.isFinite(first) && Number.isFinite(last) && Math.abs(first - range[0]) <= 1e-6 && Math.abs(last - range[1]) <= 1e-6;
}
function copyDomain(domain) {
  return domain.map(
    (value) => value instanceof Date ? new Date(value.getTime()) : value
  );
}
function invalidConfigurableDomain(id) {
  throw new TypeError(
    `Chart viewport "${id}" requires a scale with a configurable domain`
  );
}
function validateViewportLogDomains(scale, id, contentDomain, viewportDomain) {
  if (!isLogarithmicScale(scale)) return;
  const contentSign = logarithmicDomainSign(contentDomain);
  const viewportSign = logarithmicDomainSign(viewportDomain);
  if (contentSign === void 0 || viewportSign === void 0 || contentSign !== viewportSign) {
    throw new TypeError(
      `Chart viewport "${id}" logarithmic content and viewport domains must be finite, nonzero, and stay on the same side of zero`
    );
  }
}
function logarithmicDomainSign(domain) {
  let sign;
  for (const value of domain) {
    if (typeof value !== "number" || !Number.isFinite(value) || value === 0) {
      return void 0;
    }
    const current = Math.sign(value);
    if (sign !== void 0 && current !== sign) return void 0;
    sign = current;
  }
  return sign;
}
function sameContinuousType(first, last) {
  return typeof first === "number" && typeof last === "number" || first instanceof Date && last instanceof Date;
}
function continuousNumber(value) {
  return value instanceof Date ? value.getTime() : value;
}
function sameChartValue$1(left, right) {
  return left instanceof Date && right instanceof Date ? left.getTime() === right.getTime() : Object.is(left, right);
}
function invalidViewportDomain(id) {
  throw new TypeError(
    `Chart viewport "${id}" domain must contain two distinct finite numbers or Dates`
  );
}
function formatValue(value) {
  return value instanceof Date ? value.toLocaleDateString() : String(value);
}
const defaultFontSize = 16;
const defaultFontWeight = 400;
const defaultTypography = {
  fontFamily: "sans-serif",
  fontStyle: "normal",
  fontStretch: "normal",
  letterSpacing: 0,
  direction: "inherit",
  fontScale: 1
};
function estimateSceneText(text, style) {
  const fontScale = finitePositive(style.fontScale, 1);
  const fontSize = finiteNonNegative(style.fontSize, defaultFontSize) * fontScale;
  const fontWeight = finiteNonNegative(style.fontWeight, defaultFontWeight);
  const letterSpacing = finiteNumber(style.letterSpacing, 0) * fontScale;
  if (!text || fontSize === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  let emWidth = 0;
  for (const character of text) {
    emWidth += estimateCharacterWidth(character);
  }
  const clampedWeight = Math.min(900, Math.max(100, fontWeight));
  const weightFactor = 1 + (clampedWeight - 400) / 12500;
  const width = Math.max(
    0,
    emWidth * fontSize * weightFactor + Math.max(0, Array.from(text).length - 1) * letterSpacing
  );
  const height = fontSize;
  const x = style.anchor === "middle" ? -width / 2 : style.anchor === "end" ? -width : 0;
  const y = style.baseline === "middle" ? -height / 2 : style.baseline === "hanging" ? 0 : -fontSize * 0.8;
  return { x, y, width, height };
}
function measureSceneLabelBounds(label, measureText = estimateSceneText) {
  const fontSize = finiteNonNegative(label.fontSize, defaultFontSize);
  const anchor = label.anchor ?? "start";
  const baseline = label.baseline ?? "auto";
  const measured = label.text.length === 0 ? { x: 0, y: 0, width: 0, height: 0 } : measureText(label.text, {
    fontSize,
    fontWeight: label.fontWeight,
    ...defaultTypography,
    anchor,
    baseline
  });
  const x = finiteNumber(measured.x, 0);
  const y = finiteNumber(measured.y, 0);
  const width = finiteNonNegative(measured.width, 0);
  const height = finiteNonNegative(measured.height, 0);
  const bounds = {
    x: label.x + x,
    y: label.y + y,
    width,
    height
  };
  if (!label.rotate) {
    return bounds;
  }
  return rotateBounds(bounds, label.x, label.y, label.rotate);
}
function withChartTextTypography(measureText = estimateSceneText, typography = {}) {
  const resolved = {
    ...defaultTypography,
    ...typography,
    fontFamily: typography.fontFamily || defaultTypography.fontFamily,
    fontStyle: typography.fontStyle || defaultTypography.fontStyle,
    fontStretch: typography.fontStretch || defaultTypography.fontStretch,
    letterSpacing: finiteNumber(typography.letterSpacing, 0),
    fontScale: finitePositive(typography.fontScale, 1)
  };
  return (text, options) => measureText(text, { ...options, ...resolved });
}
function rotateBounds(bounds, originX, originY, degrees) {
  const radians = degrees * Math.PI / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  const centerX = bounds.x + bounds.width / 2 - originX;
  const centerY = bounds.y + bounds.height / 2 - originY;
  const width = Math.abs(bounds.width * cosine) + Math.abs(bounds.height * sine);
  const height = Math.abs(bounds.width * sine) + Math.abs(bounds.height * cosine);
  const rotatedCenterX = centerX * cosine - centerY * sine + originX;
  const rotatedCenterY = centerX * sine + centerY * cosine + originY;
  return {
    x: rotatedCenterX - width / 2,
    y: rotatedCenterY - height / 2,
    width,
    height
  };
}
function estimateCharacterWidth(character) {
  if (/\s/u.test(character)) return 0.33;
  if (/[\u0300-\u036f]/u.test(character)) return 0;
  if (/[ilI1|!.,:;'`]/u.test(character)) return 0.28;
  if (/[mwMW@#%&]/u.test(character)) return 0.9;
  if (/[A-Z]/u.test(character)) return 0.64;
  if (/[0-9]/u.test(character)) return 0.56;
  if (character.codePointAt(0) > 127) return 1;
  return 0.54;
}
function finiteNonNegative(value, fallback) {
  return value !== void 0 && Number.isFinite(value) && value >= 0 ? value : fallback;
}
function finiteNumber(value, fallback) {
  return value !== void 0 && Number.isFinite(value) ? value : fallback;
}
function finitePositive(value, fallback) {
  return value !== void 0 && Number.isFinite(value) && value > 0 ? value : fallback;
}
const sceneInteractionCache = /* @__PURE__ */ new WeakMap();
function nearestPoint(points, x, y, maxDistance) {
  let result;
  let resultDistance = Infinity;
  for (let index = points.length; index--; ) {
    const point = points[index];
    const dx = point.x - x;
    const dy = point.y - y;
    const distance = dx * dx + dy * dy;
    if (distance <= resultDistance) {
      result = point;
      resultDistance = distance;
    }
  }
  return result && resultDistance <= Math.max(0, maxDistance) ** 2 ? result : null;
}
function nearestScenePoint(scene, x, y, maxDistance, points = scene.points) {
  const index = interactionIndex(scene);
  const allowed = points === scene.points ? void 0 : new Set(points);
  if (!index.targets.length && !index.attachedPoints.size) {
    return nearestPoint(points, x, y, maxDistance);
  }
  const contained = findContainingScenePoint(scene, x, y, points);
  if (contained) return contained.point;
  let resultPoint;
  let resultInteraction;
  let resultPrimaryDistance = Infinity;
  let resultGeometryDistance = Infinity;
  for (const target of index.targets) {
    const interaction = target.node.interaction;
    if (!hasAllowedInteractionPoint(interaction, allowed)) continue;
    const affinity = interaction.affinity ?? "xy";
    if (affinity === "geometry") continue;
    const axis = affinity === "x" ? "x" : affinity === "y" ? "y" : void 0;
    const primaryDistance = axis ? squaredAxisDistance(target.bounds, axis === "x" ? x : y, axis) : distanceToTarget(target, x, y);
    if (primaryDistance > resultPrimaryDistance) continue;
    const geometryDistance = axis ? distanceToTarget(target, x, y) : primaryDistance;
    if (primaryDistance < resultPrimaryDistance || primaryDistance === resultPrimaryDistance && geometryDistance < resultGeometryDistance) {
      resultInteraction = interaction;
      resultPoint = void 0;
      resultPrimaryDistance = primaryDistance;
      resultGeometryDistance = geometryDistance;
    }
  }
  if (resultPrimaryDistance !== 0) {
    for (const point of points) {
      if (index.attachedPoints.has(point)) continue;
      const dx = point.x - x;
      const dy = point.y - y;
      const distance = dx * dx + dy * dy;
      if (distance < resultPrimaryDistance) {
        resultPoint = point;
        resultInteraction = void 0;
        resultPrimaryDistance = distance;
        resultGeometryDistance = distance;
      }
    }
  }
  if (resultPrimaryDistance > Math.max(0, maxDistance) ** 2) return null;
  const result = resultPoint ?? (resultInteraction ? bestInteractionPoint(resultInteraction, x, y, allowed) : void 0);
  return result ?? null;
}
function findContainingScenePoint(scene, x, y, points = scene.points) {
  const index = interactionIndex(scene);
  const allowed = points === scene.points ? void 0 : new Set(points);
  for (let targetIndex = index.targets.length; targetIndex--; ) {
    const target = index.targets[targetIndex];
    if (containsBounds(target.bounds, x, y) && containsTarget(target, x, y)) {
      const interaction = target.node.interaction;
      const point = bestInteractionPoint(interaction, x, y, allowed);
      const hasSemanticPoint = interaction.point ? true : interaction.points.length > 0;
      if (point || !allowed || !hasSemanticPoint) {
        return {
          point
        };
      }
    }
  }
  return null;
}
function interactionIndex(scene) {
  const cached = sceneInteractionCache.get(scene);
  if (cached) return cached;
  const targets = [];
  const attachedPoints = /* @__PURE__ */ new Set();
  collectTargets(scene.nodes, 0, 0, void 0, targets, attachedPoints);
  const index = { targets, attachedPoints };
  sceneInteractionCache.set(scene, index);
  return index;
}
function collectTargets(nodes, offsetX, offsetY, clip, targets, attachedPoints) {
  for (const node of nodes) {
    if (node.kind === "group") {
      if (node.focus) continue;
      const nextOffsetX = offsetX + (node.translateX ?? 0);
      const nextOffsetY = offsetY + (node.translateY ?? 0);
      const groupClip = node.clip ? translateBounds(node.clip, nextOffsetX, nextOffsetY) : void 0;
      const nextClip = clip === null ? null : intersectBounds(clip, groupClip);
      collectTargets(
        node.children,
        nextOffsetX,
        nextOffsetY,
        nextClip,
        targets,
        attachedPoints
      );
      continue;
    }
    if (node.kind === "label" || !node.interaction) continue;
    if (node.interaction.point) attachedPoints.add(node.interaction.point);
    else {
      for (const point of node.interaction.points) attachedPoints.add(point);
    }
    if (clip === null) continue;
    const localBounds = boundsForNode(node);
    if (!localBounds) continue;
    const paintedBounds2 = translateBounds(localBounds, offsetX, offsetY);
    const visibleBounds = clip ? intersectBounds(paintedBounds2, clip) : paintedBounds2;
    if (visibleBounds == null) continue;
    targets.push({
      node,
      offsetX,
      offsetY,
      bounds: visibleBounds,
      clip
    });
  }
}
function bestInteractionPoint(interaction, x, y, allowed) {
  if (interaction.point) {
    return !allowed || allowed.has(interaction.point) ? interaction.point : null;
  }
  const affinity = interaction.affinity ?? "xy";
  let result;
  let primaryDistance = Infinity;
  let secondaryDistance = Infinity;
  for (const point of interaction.points) {
    if (allowed && !allowed.has(point)) continue;
    const dx = point.x - x;
    const dy = point.y - y;
    const fullDistance = dx * dx + dy * dy;
    const nextPrimary = affinity === "x" ? dx * dx : affinity === "y" ? dy * dy : fullDistance;
    if (nextPrimary < primaryDistance || nextPrimary === primaryDistance && fullDistance < secondaryDistance) {
      result = point;
      primaryDistance = nextPrimary;
      secondaryDistance = fullDistance;
    }
  }
  return result ?? null;
}
function hasAllowedInteractionPoint(interaction, allowed) {
  if (!allowed) return true;
  return interaction.point ? allowed.has(interaction.point) : interaction.points.some((point) => allowed.has(point));
}
function containsTarget(target, x, y) {
  const localX = x - target.offsetX;
  const localY = y - target.offsetY;
  const { node } = target;
  switch (node.kind) {
    case "rect":
      return containsRoundedRect(node, localX, localY);
    case "dot": {
      const dx = localX - node.x;
      const dy = localY - node.y;
      const radius = Math.max(0, node.radius);
      return dx * dx + dy * dy <= radius * radius;
    }
    case "area":
      return node.polygons === void 0 ? containsPolygon(node.points, localX, localY) : containsPolygons(node.polygons, localX, localY);
    case "polyline":
      return squaredDistanceToPolyline(node.points, localX, localY, false) <= strokeRadius(node) ** 2;
    case "rule":
      return squaredDistanceToSegment(
        node.x1,
        node.y1,
        node.x2,
        node.y2,
        localX,
        localY
      ) <= strokeRadius(node) ** 2;
  }
}
function distanceToTarget(target, x, y) {
  const localX = x - target.offsetX;
  const localY = y - target.offsetY;
  const { node } = target;
  let distance;
  switch (node.kind) {
    case "rect":
      distance = node.radius ? squaredDistanceToRoundedRect(node, localX, localY) : squaredDistanceToBounds(node, localX, localY);
      break;
    case "dot": {
      const dx = localX - node.x;
      const dy = localY - node.y;
      const amount = Math.max(
        0,
        Math.sqrt(dx * dx + dy * dy) - Math.max(0, node.radius)
      );
      distance = amount * amount;
      break;
    }
    case "area":
      distance = node.polygons === void 0 ? squaredDistanceToPolyline(node.points, localX, localY, true) : squaredDistanceToPolygons(node.polygons, localX, localY);
      break;
    case "polyline": {
      const raw = squaredDistanceToPolyline(node.points, localX, localY, false);
      const amount = Math.max(0, Math.sqrt(raw) - strokeRadius(node));
      distance = amount * amount;
      break;
    }
    case "rule": {
      const raw = squaredDistanceToSegment(
        node.x1,
        node.y1,
        node.x2,
        node.y2,
        localX,
        localY
      );
      const amount = Math.max(0, Math.sqrt(raw) - strokeRadius(node));
      distance = amount * amount;
      break;
    }
  }
  return target.clip ? Math.max(distance, squaredDistanceToBounds(target.clip, x, y)) : distance;
}
function boundsForNode(node) {
  switch (node.kind) {
    case "rect":
      return normalizeRect(node);
    case "dot": {
      const radius = Math.max(0, node.radius);
      return {
        x: node.x - radius,
        y: node.y - radius,
        width: radius * 2,
        height: radius * 2
      };
    }
    case "area":
      return node.polygons === void 0 ? boundsFromPoints(node.points) : boundsFromPolygons(node.polygons);
    case "polyline": {
      const bounds = boundsFromPoints(node.points);
      return bounds ? expandBounds(bounds, strokeRadius(node)) : null;
    }
    case "rule":
      return expandBounds(
        {
          x: Math.min(node.x1, node.x2),
          y: Math.min(node.y1, node.y2),
          width: Math.abs(node.x2 - node.x1),
          height: Math.abs(node.y2 - node.y1)
        },
        strokeRadius(node)
      );
  }
}
function containsRoundedRect(node, x, y) {
  const bounds = normalizeRect(node);
  if (!containsBounds(bounds, x, y)) return false;
  const radius = Math.max(
    0,
    Math.min(node.radius ?? 0, bounds.width / 2, bounds.height / 2)
  );
  if (radius === 0 || x >= bounds.x + radius && x <= bounds.x + bounds.width - radius || y >= bounds.y + radius && y <= bounds.y + bounds.height - radius) {
    return true;
  }
  const cornerX = x < bounds.x + radius ? bounds.x + radius : bounds.x + bounds.width - radius;
  const cornerY = y < bounds.y + radius ? bounds.y + radius : bounds.y + bounds.height - radius;
  const dx = x - cornerX;
  const dy = y - cornerY;
  return dx * dx + dy * dy <= radius * radius;
}
function squaredDistanceToRoundedRect(node, x, y) {
  const bounds = normalizeRect(node);
  const halfWidth = bounds.width / 2;
  const halfHeight = bounds.height / 2;
  const radius = Math.max(0, Math.min(node.radius ?? 0, halfWidth, halfHeight));
  const offsetX = Math.abs(x - (bounds.x + halfWidth)) - (halfWidth - radius);
  const offsetY = Math.abs(y - (bounds.y + halfHeight)) - (halfHeight - radius);
  const outside = Math.sqrt(Math.max(0, offsetX) ** 2 + Math.max(0, offsetY) ** 2) - radius;
  return Math.max(0, outside) ** 2;
}
function containsPolygon(points, x, y) {
  let inside = false;
  for (let index = 0, previous = points.length - 1; index < points.length; previous = index++) {
    const current = points[index];
    const prior = points[previous];
    if (current[1] > y !== prior[1] > y && x < (prior[0] - current[0]) * (y - current[1]) / (prior[1] - current[1]) + current[0]) {
      inside = !inside;
    }
  }
  return inside;
}
function containsPolygons(polygons, x, y) {
  return polygons.some(([exterior, ...holes]) => {
    if (!exterior || !containsPolygon(exterior, x, y)) return false;
    return !holes.some((hole) => containsPolygon(hole, x, y));
  });
}
function squaredDistanceToPolygons(polygons, x, y) {
  let distance = Infinity;
  for (const polygon of polygons) {
    for (const ring of polygon) {
      distance = Math.min(distance, squaredDistanceToPolyline(ring, x, y, true));
    }
  }
  return distance;
}
function squaredDistanceToPolyline(points, x, y, closed) {
  if (!points.length) return Infinity;
  if (points.length === 1) {
    const point = points[0];
    return (point[0] - x) ** 2 + (point[1] - y) ** 2;
  }
  let distance = Infinity;
  const segmentCount = closed ? points.length : Math.max(0, points.length - 1);
  for (let index = 0; index < segmentCount; index += 1) {
    const start = points[index];
    const end = points[(index + 1) % points.length];
    distance = Math.min(
      distance,
      squaredDistanceToSegment(start[0], start[1], end[0], end[1], x, y)
    );
  }
  return distance;
}
function squaredDistanceToSegment(x1, y1, x2, y2, x, y) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = dx * dx + dy * dy;
  const amount = length ? Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / length)) : 0;
  const offsetX = x - (x1 + amount * dx);
  const offsetY = y - (y1 + amount * dy);
  return offsetX * offsetX + offsetY * offsetY;
}
function boundsFromPoints(points) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const point of points) {
    if (!Number.isFinite(point[0]) || !Number.isFinite(point[1])) continue;
    minX = Math.min(minX, point[0]);
    minY = Math.min(minY, point[1]);
    maxX = Math.max(maxX, point[0]);
    maxY = Math.max(maxY, point[1]);
  }
  return Number.isFinite(minX) ? { x: minX, y: minY, width: maxX - minX, height: maxY - minY } : null;
}
function boundsFromPolygons(polygons) {
  return boundsFromPoints(polygons.flatMap((polygon) => polygon.flat()));
}
function normalizeRect(rect) {
  return {
    x: Math.min(rect.x, rect.x + rect.width),
    y: Math.min(rect.y, rect.y + rect.height),
    width: Math.abs(rect.width),
    height: Math.abs(rect.height)
  };
}
function translateBounds(bounds, x, y) {
  const normalized = normalizeRect(bounds);
  return { ...normalized, x: normalized.x + x, y: normalized.y + y };
}
function expandBounds(bounds, amount) {
  return {
    x: bounds.x - amount,
    y: bounds.y - amount,
    width: bounds.width + amount * 2,
    height: bounds.height + amount * 2
  };
}
function intersectBounds(left, right) {
  if (!left) return right;
  if (!right) return left;
  const x = Math.max(left.x, right.x);
  const y = Math.max(left.y, right.y);
  const rightEdge = Math.min(left.x + left.width, right.x + right.width);
  const bottomEdge = Math.min(left.y + left.height, right.y + right.height);
  return rightEdge < x || bottomEdge < y ? null : { x, y, width: rightEdge - x, height: bottomEdge - y };
}
function containsBounds(bounds, x, y) {
  return x >= bounds.x && x <= bounds.x + bounds.width && y >= bounds.y && y <= bounds.y + bounds.height;
}
function squaredAxisDistance(bounds, value, axis) {
  const start = axis === "x" ? bounds.x : bounds.y;
  const size = axis === "x" ? bounds.width : bounds.height;
  const distance = value < start ? start - value : value > start + size ? value - start - size : 0;
  return distance * distance;
}
function squaredDistanceToBounds(bounds, x, y) {
  const normalized = normalizeRect(bounds);
  const dx = x < normalized.x ? normalized.x - x : x > normalized.x + normalized.width ? x - normalized.x - normalized.width : 0;
  const dy = y < normalized.y ? normalized.y - y : y > normalized.y + normalized.height ? y - normalized.y - normalized.height : 0;
  return dx * dx + dy * dy;
}
function strokeRadius(node) {
  return Math.max(0, node.style?.strokeWidth ?? 1) / 2;
}
function viewportTranslationChanged(previous, next) {
  return ["x", "y"].some(
    (axis) => (previous.scales[axis]?.viewport?.translate ?? 0) !== (next.scales[axis]?.viewport?.translate ?? 0)
  );
}
function mapScenePointReferences(nodes, mapPoint) {
  return nodes.map((node) => {
    if (node.kind === "group") {
      return {
        ...node,
        children: mapScenePointReferences(node.children, mapPoint),
        ...node.focus ? {
          focus: {
            ...node.focus,
            points: node.focus.points.map(mapPoint)
          }
        } : {},
        ...node.states ? {
          states: {
            ...node.states,
            points: node.states.points.map(mapPoint)
          }
        } : {}
      };
    }
    if (node.kind === "label" || !node.interaction) return node;
    return {
      ...node,
      interaction: node.interaction.point ? { ...node.interaction, point: mapPoint(node.interaction.point) } : {
        ...node.interaction,
        points: node.interaction.points.map(mapPoint)
      }
    };
  });
}
const chartSceneSource = /* @__PURE__ */ Symbol("chart-scene-source");
const defaultChartTheme = {
  foreground: "currentColor",
  muted: "currentColor",
  grid: "currentColor",
  background: "transparent",
  palette: [
    "var(--ts-chart-1, #2563eb)",
    "var(--ts-chart-2, #f97316)",
    "var(--ts-chart-3, #10b981)",
    "var(--ts-chart-4, #8b5cf6)",
    "var(--ts-chart-5, #ec4899)",
    "var(--ts-chart-6, #06b6d4)"
  ]
};
function defineChart(definition, options) {
  return typeof definition === "function" ? { chart: definition } : definition;
}
function createChartScene(definition, size, layout = {}) {
  return createChartSceneWithScaleResolver(
    definition,
    size,
    (context) => {
      if (!context.options?.scale) {
        throw new TypeError(
          `Chart scale "${context.id}" requires a configured scale`
        );
      }
      return resolveSuppliedScale(context.options.scale, context);
    },
    layout
  );
}
function resolveSuppliedScale(scale, context) {
  if (typeof scale === "function") return resolveConfiguredScale(scale, context);
  if (context.options?.viewport) {
    throw new TypeError(
      `Chart viewport "${context.id}" requires a configured or inferable continuous scale`
    );
  }
  return scale.resolve(context);
}
function createChartSceneWithScaleResolver(definition, size, resolveScale, layout) {
  const width = finiteSize(size.width);
  const height = finiteSize(size.height);
  const layoutOptions = {
    ...layout,
    measureText: withChartTextTypography(layout.measureText, layout.typography)
  };
  const platformTheme = {
    ...defaultChartTheme,
    ...layoutOptions.defaultTheme,
    palette: layoutOptions.defaultTheme?.palette ?? defaultChartTheme.palette
  };
  const theme = {
    ...platformTheme,
    ...definition.theme,
    palette: definition.theme?.palette ?? platformTheme.palette
  };
  const initialized = definition.marks.map(
    (mark, markIndex) => mark.initialize({ markIndex })
  );
  const xChannels = collectScaleChannels(initialized, "x");
  const yChannels = collectScaleChannels(initialized, "y");
  const axes = definition.guides === false ? 0 : +(definition.x != null && definition.x.axis !== false) | +(definition.y != null && definition.y.axis !== false) << 1;
  const resolvedLayout = resolveSceneLayout(
    definition,
    initialized,
    width,
    height,
    theme,
    xChannels,
    yChannels,
    axes,
    resolveScale,
    layoutOptions
  );
  const {
    margin,
    chart,
    scales,
    axes: axisNodes,
    marks,
    colors,
    legend,
    legendBounds
  } = resolvedLayout;
  const markEntries = [];
  const defaultFocusEntries = [];
  const points = [];
  const translateX = scales.x.viewport?.translate ?? 0;
  const translateY = scales.y.viewport?.translate ?? 0;
  const focusGuides = [];
  const firstBaseMarkIndex = marks.findIndex(
    (mark) => !mark.focus && !mark.focusGuideOnly
  );
  marks.forEach((mark, markIndex) => {
    const viewportX = Boolean(
      scales.x.viewport && markUsesViewportAxis(mark, "x")
    );
    const viewportY = Boolean(
      scales.y.viewport && markUsesViewportAxis(mark, "y")
    );
    const pointMap = /* @__PURE__ */ new Map();
    const presentPoint = (point) => {
      const existing = pointMap.get(point);
      if (existing) return existing;
      const presented = viewportX || viewportY ? {
        ...point,
        x: point.x + (viewportX ? translateX : 0),
        y: point.y + (viewportY ? translateY : 0)
      } : point;
      pointMap.set(point, presented);
      return presented;
    };
    let rendered = mark.render({
      markIndex,
      surface: { x: 0, y: 0, width, height },
      chart,
      scales,
      theme,
      color: colors.map,
      colors,
      layout: layoutOptions
    });
    if (legend?.filterMark) {
      rendered = legend.filterMark(rendered, {
        seriesFromColor: mark.seriesFromColor
      });
    }
    if (mark.postDomain) rendered = mark.postDomain(rendered);
    const renderedPoints = collectRenderedPoints(
      rendered.nodes,
      rendered.points
    );
    const renderedNodes = viewportX || viewportY ? mapScenePointReferences(rendered.nodes, presentPoint) : rendered.nodes;
    const presentedPoints = renderedPoints.map(presentPoint);
    const entryNodes = [];
    const placement = firstBaseMarkIndex < 0 || markIndex < firstBaseMarkIndex ? "under" : "over";
    for (const guide of rendered.focusGuides ?? []) {
      focusGuides.push({ ...guide, placement: guide.placement ?? placement });
    }
    if (mark.focus) {
      const retarget = mark.focus.retarget === true;
      entryNodes.push({
        kind: "group",
        key: `focus:${mark.id}`,
        className: "ts-chart__focus-layer",
        ariaHidden: true,
        focus: {
          match: mark.focus.match ?? "primary",
          anchors: rendered.focusAnchors ?? renderedPoints,
          points: presentedPoints,
          placement,
          ...retarget ? { retarget: true, candidates: renderedNodes } : {}
        },
        children: retarget ? [] : renderedNodes
      });
    } else {
      const markPoints = presentedPoints;
      if (mark.states) {
        entryNodes.push({
          kind: "group",
          key: `states:${mark.id}`,
          children: renderedNodes,
          states: {
            data: mark.states.data,
            definitions: mark.states.definitions,
            points: markPoints
          }
        });
      } else {
        for (const node of renderedNodes) entryNodes.push(node);
      }
      for (const point of markPoints) points.push(point);
      if (markPoints.length) {
        defaultFocusEntries.push({
          markId: mark.id,
          points: markPoints,
          clipped: viewportX || viewportY
        });
      }
    }
    markEntries.push({ key: mark.id, nodes: entryNodes, viewportX, viewportY });
  });
  const markNodes = arrangeViewportMarkNodes(
    markEntries,
    translateX,
    translateY,
    chart
  );
  const nodes = [
    {
      kind: "group",
      key: "marks",
      className: "ts-chart__marks",
      clip: definition.clip ? chart : void 0,
      children: markNodes
    }
  ];
  if (definition.guides !== false && (definition.x?.grid || definition.y?.grid)) {
    nodes.unshift(createGrid(chart, scales, definition, theme));
  }
  if (axes) {
    nodes.push(axisNodes);
  }
  const controls = [];
  const controlIds = /* @__PURE__ */ new Set();
  for (const control of definition.controls ?? []) {
    if (!control.id.trim()) {
      throw new TypeError("Chart control ids must be nonempty");
    }
    if (controlIds.has(control.id)) {
      throw new TypeError(`Duplicate chart control id "${control.id}"`);
    }
    controlIds.add(control.id);
    const resolved = control.resolve({
      chart,
      scales,
      colors,
      theme,
      width,
      height
    });
    if (resolved.nodes) nodes.push(...resolved.nodes);
    if (resolved.controls) controls.push(...resolved.controls);
  }
  if (legend && legendBounds) {
    const legendContext = {
      colors,
      chart,
      bounds: legendBounds,
      theme,
      width,
      height
    };
    nodes.push(legend.render(legendContext));
    if (legend.control) controls.push(legend.control(legendContext));
  }
  const hostControlIds = /* @__PURE__ */ new Set();
  for (const control of controls) {
    const identity = `${control.extension.id}:${control.key}`;
    if (hostControlIds.has(identity)) {
      throw new TypeError(`Duplicate chart host control "${identity}"`);
    }
    hostControlIds.add(identity);
  }
  if (definition.focus !== false && definition.focusRing !== false && points.length) {
    for (const entry of defaultFocusEntries) {
      nodes.push({
        kind: "group",
        key: `default-focus:${entry.markId}`,
        className: "ts-chart__focus-layer ts-chart__focus-layer--default",
        ariaHidden: true,
        clip: entry.clipped ? chart : void 0,
        focus: {
          match: "primary",
          anchors: entry.points,
          points: entry.points,
          placement: "over"
        },
        children: entry.points.map((point) => ({
          kind: "dot",
          key: point.key,
          x: point.x,
          y: point.y,
          radius: 5,
          style: {
            fill: "var(--ts-chart-focus-fill, Canvas)",
            stroke: point.color,
            strokeWidth: 2.5
          }
        }))
      });
    }
  }
  return {
    width,
    height,
    margin,
    chart,
    nodes,
    points,
    scales,
    colors,
    gradients: definition.gradients ?? [],
    theme,
    ...controls.length ? { controls } : {},
    ...focusGuides.length ? { focusGuides } : {},
    [chartSceneSource]: [definition, initialized]
  };
}
function markUsesViewportAxis(mark, axis) {
  const ownership = mark.viewport?.[axis];
  if (ownership) return ownership === "content";
  return Object.values(mark.channels).some((channel) => channel.scale === axis);
}
function arrangeViewportMarkNodes(entries, translateX, translateY, chart) {
  return entries.flatMap((entry) => {
    if (!entry.viewportX && !entry.viewportY) return [...entry.nodes];
    return [
      {
        kind: "group",
        key: `viewport-clip:${entry.key}`,
        className: "ts-chart__viewport-clip",
        clip: chart,
        children: [
          {
            kind: "group",
            key: `viewport-content:${entry.key}`,
            className: "ts-chart__viewport-content",
            ...entry.viewportX ? { translateX } : {},
            ...entry.viewportY ? { translateY } : {},
            children: entry.nodes
          }
        ]
      }
    ];
  });
}
function findNearestPoint(scene, x, y, maxDistance = Infinity, points = scene.points) {
  return nearestScenePoint(scene, x, y, maxDistance, points);
}
function viewportInteractionPoints(scene, points = scene.points) {
  if (!scene.scales.x?.viewport && !scene.scales.y?.viewport) return points;
  const { x, y, width, height } = scene.chart;
  const right = x + width;
  const bottom = y + height;
  const visible = points.filter(
    (point) => !pointUsesViewportClip(scene, point) || point.x >= x && point.x <= right && point.y >= y && point.y <= bottom
  );
  return visible.length === points.length ? points : visible;
}
function pointUsesViewportClip(scene, point) {
  const source = scene[chartSceneSource];
  const mark = source?.[1].find((candidate) => candidate.id === point.markId);
  if (!mark) return true;
  return Boolean(
    scene.scales.x?.viewport && markUsesViewportAxis(mark, "x") || scene.scales.y?.viewport && markUsesViewportAxis(mark, "y")
  );
}
function collectRenderedPoints(nodes, emitted) {
  const points = emitted ? [...emitted] : [];
  const seen = new Set(points);
  const visit = (children) => {
    for (const node of children) {
      if (node.kind === "group") {
        if (!node.focus) visit(node.children);
        continue;
      }
      if (node.kind === "label" || !node.interaction) continue;
      const interaction = node.interaction;
      if (interaction.point) {
        if (!seen.has(interaction.point)) {
          seen.add(interaction.point);
          points.push(interaction.point);
        }
      } else {
        for (const point of interaction.points) {
          if (seen.has(point)) continue;
          seen.add(point);
          points.push(point);
        }
      }
    }
  };
  visit(nodes);
  return points;
}
function collectScaleChannels(marks, scaleId) {
  const values = [];
  let includeZero = false;
  let materialized = false;
  for (const mark of marks) {
    for (const channel of Object.values(mark.channels)) {
      if (channel.scale !== scaleId) continue;
      materialized = true;
      for (const value of channel.values) values.push(value);
      includeZero ||= channel.includeZero ?? false;
    }
  }
  return { values, includeZero, materialized };
}
const automaticGuideInset = 4;
const layoutPassLimit = 4;
const layoutTolerance = 0.25;
function resolveSceneLayout(definition, initialized, width, height, theme, xChannels, yChannels, axes, resolveScale, layout) {
  const locks = resolveMarginLocks(definition.margin);
  const inset = axes ? automaticGuideInset : 0;
  let margin = mergeMarginLocks(uniformMargin(inset), locks);
  let safeMargin = margin;
  for (let pass = 0; pass < layoutPassLimit; pass += 1) {
    const resolved2 = compileSceneLayout(margin);
    const next = measureMargin(resolved2);
    safeMargin = mergeMarginLocks(next, locks, safeMargin);
    if (marginsEqual(margin, next)) return resolved2;
    margin = next;
  }
  let resolved = compileSceneLayout(safeMargin);
  const finalMargin = mergeMarginLocks(
    measureMargin(resolved),
    locks,
    safeMargin
  );
  if (!marginsEqual(safeMargin, finalMargin)) {
    resolved = compileSceneLayout(finalMargin);
  }
  return resolved;
  function compileSceneLayout(margin2) {
    const chart = {
      x: margin2.left,
      y: margin2.top,
      width: Math.max(1, width - margin2.left - margin2.right),
      height: Math.max(1, height - margin2.top - margin2.bottom)
    };
    const xTickCount = resolveTickCount(definition.x, chart.width, 92, 8);
    const yTickCount = resolveTickCount(definition.y, chart.height, 48, 7);
    const scales = {
      x: definition.x == null ? createUnusedScale("x", xChannels.materialized, definition.x) : resolveScale({
        id: "x",
        values: xChannels.values,
        range: [chart.x, chart.x + chart.width],
        options: definition.x,
        tickCount: xTickCount,
        includeZero: xChannels.includeZero
      }),
      y: definition.y == null ? createUnusedScale("y", yChannels.materialized, definition.y) : resolveScale({
        id: "y",
        values: yChannels.values,
        range: [chart.y + chart.height, chart.y],
        options: definition.y,
        tickCount: yTickCount,
        includeZero: yChannels.includeZero
      })
    };
    const marks = resolveMarkLayouts(initialized, {
      chart,
      scales,
      theme,
      layout
    });
    const colorChannels = collectScaleChannels(marks, "color");
    const colors = createColorScale(
      colorChannels.values,
      definition.color,
      theme
    );
    if (colors.kind !== "categorical" && marks.some((mark) => mark.seriesFromColor)) {
      throw new TypeError(
        "A continuous color channel cannot infer series identity; supply z explicitly"
      );
    }
    const legend = colors.domain.length ? definition.color?.legend : void 0;
    if (legend?.seriesVisible && colors.kind !== "categorical") {
      throw new TypeError(
        "An interactive color legend requires a categorical color scale"
      );
    }
    const legendHeight = legend?.height(colors.domain.length, {
      colors,
      chart,
      bounds: { x: chart.x, y: 0, width: chart.width, height: 0 },
      theme,
      width,
      height
    });
    const legendBounds = legend && legendHeight !== void 0 ? {
      x: chart.x,
      y: legend.placement === "bottom" ? height - legendHeight : 0,
      width: chart.width,
      height: legendHeight
    } : void 0;
    const resolvedAxes = createAxes(
      chart,
      scales,
      definition,
      theme,
      width,
      axes,
      layout.measureText
    );
    return {
      margin: margin2,
      chart,
      scales,
      axes: resolvedAxes.axes,
      guideMargin: resolvedAxes.margin,
      marks,
      colors,
      legend,
      legendBounds
    };
  }
  function measureMargin(resolved2) {
    const automatic = resolved2.guideMargin;
    if (resolved2.legend) {
      const legendHeight = resolved2.legend.height(
        resolved2.colors.domain.length,
        {
          colors: resolved2.colors,
          chart: resolved2.chart,
          bounds: {
            x: resolved2.chart.x,
            y: 0,
            width: resolved2.chart.width,
            height: 0
          },
          theme,
          width,
          height
        }
      );
      if (resolved2.legend.placement === "bottom") {
        if (locks.bottom === void 0) automatic.bottom += legendHeight;
      } else if (locks.top === void 0) {
        automatic.top = Math.max(automatic.top, legendHeight);
      }
    }
    if (!definition.clip) {
      resolved2.marks.forEach((mark, markIndex) => {
        const autoClipped = Boolean(
          resolved2.scales.x.viewport && markUsesViewportAxis(mark, "x") || resolved2.scales.y.viewport && markUsesViewportAxis(mark, "y")
        );
        if (autoClipped) return;
        const labels = mark.layoutLabels?.({
          markIndex,
          surface: { x: 0, y: 0, width, height },
          chart: resolved2.chart,
          scales: resolved2.scales,
          theme,
          color: resolved2.colors.map,
          colors: resolved2.colors,
          layout
        });
        for (const label of labels ?? []) {
          includeLabelMargin(
            automatic,
            resolved2.chart,
            label,
            layout.measureText
          );
        }
      });
    }
    return mergeMarginLocks(automatic, locks);
  }
}
function resolveMarkLayouts(marks, context) {
  return marks.map((mark, markIndex) => {
    if (typeof mark.resolveLayout !== "function") {
      return mark;
    }
    const resolved = mark.resolveLayout({ ...context, markIndex });
    return {
      id: mark.id,
      channels: resolved.channels ?? mark.channels,
      viewport: mark.viewport,
      focusGuideOnly: mark.focusGuideOnly,
      seriesFromColor: mark.seriesFromColor,
      focus: mark.focus,
      states: resolved.states ?? mark.states,
      postDomain: resolved.postDomain ?? mark.postDomain,
      layoutLabels: resolved.layoutLabels ?? mark.layoutLabels,
      render: resolved.render
    };
  });
}
function includeLabelMargin(margin, chart, label, measureText) {
  const bounds = measureSceneLabelBounds(label, measureText);
  if (!label.text) return bounds;
  margin.top = Math.max(margin.top, chart.y - bounds.y + automaticGuideInset);
  margin.right = Math.max(
    margin.right,
    bounds.x + bounds.width - chart.x - chart.width + automaticGuideInset
  );
  margin.bottom = Math.max(
    margin.bottom,
    bounds.y + bounds.height - chart.y - chart.height + automaticGuideInset
  );
  margin.left = Math.max(margin.left, chart.x - bounds.x + automaticGuideInset);
  return bounds;
}
function resolveMarginLocks(margin) {
  if (typeof margin === "number") {
    return uniformMargin(finiteMargin(margin));
  }
  if (!margin) return {};
  const locks = {};
  for (const side of marginSides) {
    if (margin[side] !== void 0) locks[side] = finiteMargin(margin[side]);
  }
  return locks;
}
const marginSides = ["top", "right", "bottom", "left"];
function mergeMarginLocks(automatic, locks, previous) {
  const margin = { ...automatic };
  for (const side of marginSides) {
    margin[side] = locks[side] ?? (previous ? Math.max(previous[side], automatic[side]) : automatic[side]);
  }
  return margin;
}
function marginsEqual(left, right) {
  return marginSides.every(
    (side) => Math.abs(left[side] - right[side]) <= layoutTolerance
  );
}
function finiteMargin(value) {
  return value !== void 0 && Number.isFinite(value) ? Math.max(0, value) : 0;
}
function uniformMargin(value) {
  return { top: value, right: value, bottom: value, left: value };
}
function createUnusedScale(id, materialized, axis) {
  if (materialized) {
    throw new TypeError(
      axis === null ? `Chart scale "${id}" cannot be null when a mark materializes its channel` : `Chart scale "${id}" requires a configured scale when a mark materializes its channel`
    );
  }
  return {
    id,
    type: "none",
    domain: [],
    map: () => {
      throw new TypeError(`Chart scale "${id}" is not configured`);
    },
    ticks: [],
    bandwidth: 0
  };
}
function createGrid(chart, scales, definition, theme) {
  const children = [];
  if (definition.y?.grid) {
    for (const tick of scales.y.ticks) {
      children.push({
        kind: "rule",
        key: `y-grid:${valueKey(tick.value)}`,
        x1: chart.x,
        x2: chart.x + chart.width,
        y1: tick.position,
        y2: tick.position
      });
    }
  }
  if (definition.x?.grid) {
    for (const tick of scales.x.ticks) {
      children.push({
        kind: "rule",
        key: `x-grid:${valueKey(tick.value)}`,
        x1: tick.position,
        x2: tick.position,
        y1: chart.y,
        y2: chart.y + chart.height
      });
    }
  }
  return {
    kind: "group",
    key: "grid",
    className: "ts-chart__grid",
    ariaHidden: true,
    children,
    style: {
      stroke: theme.grid,
      strokeOpacity: 0.11,
      strokeWidth: 1
    }
  };
}
function createAxes(chart, scales, definition, theme, width, axes, measureText) {
  const showX = axes & 1;
  const showY = axes & 2;
  const xAxis = axisPresentation(definition.x);
  const yAxis = axisPresentation(definition.y);
  const children = !showX || xAxis?.line === false ? [] : [
    {
      kind: "rule",
      key: "x-axis",
      x1: chart.x,
      x2: chart.x + chart.width,
      y1: chart.y + chart.height,
      y2: chart.y + chart.height,
      style: {
        stroke: theme.foreground,
        strokeOpacity: 0.28
      }
    }
  ];
  if (showY && yAxis?.line !== false) {
    children.push({
      kind: "rule",
      key: "y-axis",
      x1: chart.x,
      x2: chart.x,
      y1: chart.y,
      y2: chart.y + chart.height,
      style: {
        stroke: theme.foreground,
        strokeOpacity: 0.28
      }
    });
  }
  const xTickLabels = tickLabelPresentation(xAxis);
  const yTickLabels = tickLabelPresentation(yAxis);
  let xTickBottom = chart.y + chart.height;
  let yTickLeft = chart.x;
  const inset = axes ? automaticGuideInset : 0;
  const margin = uniformMargin(inset);
  const addLabel = (label) => includeLabelMargin(margin, chart, label, measureText);
  const xTicks = xAxis?.ticks === false ? [] : scales.x.ticks;
  const yTicks = yAxis?.ticks === false ? [] : scales.y.ticks;
  const xTickSize = finiteMargin(
    xAxis?.ticks === false ? 0 : xAxis?.ticks?.size ?? 4
  );
  const yTickSize = finiteMargin(
    yAxis?.ticks === false ? 0 : yAxis?.ticks?.size ?? 4
  );
  const xTickPadding = finiteMargin(
    xAxis?.ticks === false ? 0 : xAxis?.ticks?.padding ?? 4
  );
  const yTickPadding = finiteMargin(
    yAxis?.ticks === false ? 0 : yAxis?.ticks?.padding ?? 4
  );
  const xLabelCandidates = xTickLabels === false ? [] : createTickLabelCandidates(
    "x",
    withKeptTicks(scales.x, definition.x, xTickLabels),
    chart,
    xTickSize,
    xTickPadding,
    xTickLabels,
    scales.x.bandwidth,
    width,
    theme,
    measureText
  );
  const yLabelCandidates = yTickLabels === false ? [] : createTickLabelCandidates(
    "y",
    withKeptTicks(scales.y, definition.y, yTickLabels),
    chart,
    yTickSize,
    yTickPadding,
    yTickLabels,
    scales.y.bandwidth,
    width,
    theme,
    measureText
  );
  const visibleXLabels = xTickLabels === false ? [] : thinTickLabels(xLabelCandidates, xTickLabels, scales.x.type === "band");
  const visibleYLabels = yTickLabels === false ? [] : thinTickLabels(yLabelCandidates, yTickLabels, false);
  for (const tick of showX ? xTicks : []) {
    const key = valueKey(tick.value);
    if (xTickSize > 0) {
      children.push({
        kind: "rule",
        key: `x-tick-rule:${key}`,
        x1: tick.position,
        x2: tick.position,
        y1: chart.y + chart.height,
        y2: chart.y + chart.height + xTickSize,
        style: {
          stroke: theme.foreground,
          strokeOpacity: 0.28
        }
      });
    }
  }
  for (const candidate of showX ? visibleXLabels : []) {
    const bounds = addLabel(candidate.label);
    if (axisLabelText(xAxis) && axisLabelOffset(xAxis) === "auto") {
      xTickBottom = Math.max(xTickBottom, bounds.y + bounds.height);
    }
    children.push(candidate.label);
  }
  for (const tick of showY ? yTicks : []) {
    const key = valueKey(tick.value);
    if (yTickSize > 0) {
      children.push({
        kind: "rule",
        key: `y-tick-rule:${key}`,
        x1: chart.x - yTickSize,
        x2: chart.x,
        y1: tick.position,
        y2: tick.position,
        style: {
          stroke: theme.foreground,
          strokeOpacity: 0.28
        }
      });
    }
  }
  for (const candidate of showY ? visibleYLabels : []) {
    const bounds = addLabel(candidate.label);
    if (axisLabelText(yAxis) && axisLabelOffset(yAxis) === "auto") {
      yTickLeft = Math.min(yTickLeft, bounds.x);
    }
    children.push(candidate.label);
  }
  const xAxisLabel = axisLabelText(xAxis);
  if (showX && xAxisLabel) {
    const offset = axisLabelOffset(xAxis);
    const hasOffset = offset !== "auto";
    const label = {
      kind: "label",
      key: "x-label",
      x: chart.x + chart.width / 2,
      y: hasOffset ? chart.y + chart.height + Math.max(0, finiteMargin(offset)) : xTickBottom + 8,
      text: xAxisLabel,
      anchor: "middle",
      baseline: hasOffset ? "auto" : "hanging",
      fontSize: width < 360 ? 10 : 11,
      fontWeight: 600,
      style: { fill: theme.foreground, fillOpacity: 0.76 }
    };
    addLabel(label);
    children.push(label);
  }
  const yAxisLabel = axisLabelText(yAxis);
  if (showY && yAxisLabel) {
    const yLabel = {
      kind: "label",
      key: "y-label",
      x: chart.x,
      y: chart.y + chart.height / 2,
      text: yAxisLabel,
      anchor: "middle",
      baseline: "middle",
      rotate: -90,
      fontSize: 11,
      fontWeight: 600,
      style: { fill: theme.foreground, fillOpacity: 0.76 }
    };
    const offset = axisLabelOffset(yAxis);
    if (offset !== "auto") {
      yLabel.x = chart.x - Math.max(0, finiteMargin(offset));
    } else {
      const localBounds = measureSceneLabelBounds(
        { ...yLabel, x: 0, y: 0 },
        measureText
      );
      yLabel.x = yTickLeft - 8 - (localBounds.x + localBounds.width);
    }
    addLabel(yLabel);
    children.push(yLabel);
  }
  return {
    axes: {
      kind: "group",
      key: "axes",
      className: "ts-chart__axes",
      ariaHidden: true,
      children
    },
    margin
  };
}
function resolveTickCount(axis, length, defaultSpacing, maximum) {
  const ticks2 = axis?.axis === false ? void 0 : axis?.axis?.ticks;
  if (ticks2 === false) {
    return Math.max(2, Math.min(maximum, Math.floor(length / defaultSpacing)));
  }
  const configured = ticks2 ?? {};
  const policies = [
    configured.count !== void 0,
    configured.spacing !== void 0,
    configured.values !== void 0
  ].filter(Boolean).length;
  if (policies > 1) {
    throw new TypeError(
      "Axis ticks accept only one candidate policy: count, spacing, or values"
    );
  }
  if (configured.values) return Math.max(1, configured.values.length);
  if (configured.count !== void 0) {
    return Math.max(1, Math.floor(finiteMargin(configured.count)));
  }
  if (configured.spacing !== void 0) {
    const spacing = Math.max(1, finiteMargin(configured.spacing));
    return Math.max(1, Math.floor(length / spacing));
  }
  return Math.max(2, Math.min(maximum, Math.floor(length / defaultSpacing)));
}
function axisPresentation(axis) {
  if (!axis || axis.axis === false) return void 0;
  return axis.axis ?? {};
}
function tickLabelPresentation(axis) {
  if (axis?.ticks === false || axis?.tickLabels === false) return false;
  return axis?.tickLabels ?? {};
}
function axisLabelText(axis) {
  return typeof axis?.label === "string" ? axis.label : axis?.label?.text;
}
function axisLabelOffset(axis) {
  return typeof axis?.label === "object" ? axis.label.offset ?? "auto" : "auto";
}
function withKeptTicks(scale, axis, labels) {
  const thin = typeof labels.thin === "object" ? labels.thin : void 0;
  const keep = thin?.keep ?? [];
  if (!keep.length) return scale.ticks;
  const formatter = axis?.axis === false || axis?.axis?.ticks === false ? void 0 : axis?.axis?.ticks?.format;
  const ticks2 = scale.ticks.map((tick) => ({
    ...tick,
    hard: keep.some((value) => valueKey(value) === valueKey(tick.value))
  }));
  const seen = new Set(ticks2.map((tick) => valueKey(tick.value)));
  for (const value of keep) {
    const position = scale.map(value);
    if (seen.has(valueKey(value)) || !Number.isFinite(position)) continue;
    ticks2.push({
      value,
      position,
      label: formatter?.(value) ?? formatAxisValue(value),
      hard: true
    });
  }
  return ticks2;
}
function createTickLabelCandidates(axis, ticks2, chart, size, padding, options, bandwidth, width, theme, measureText) {
  const defaultFontSize2 = width < 360 ? 10 : 11;
  return ticks2.map((tick, index) => {
    const context = {
      value: tick.value,
      index,
      position: tick.position,
      bandwidth
    };
    const rotate = options.rotate;
    const fontSize = resolveTickLabelValue(options.fontSize, context) ?? defaultFontSize2;
    const fontWeight = resolveTickLabelValue(options.fontWeight, context);
    const opacity = resolveTickLabelValue(options.opacity, context);
    const dx = resolveTickLabelValue(options.dx, context) ?? 0;
    const dy = resolveTickLabelValue(options.dy, context) ?? 0;
    const defaultAnchor = axis === "y" ? "end" : (rotate ?? 0) < 0 ? "end" : (rotate ?? 0) > 0 ? "start" : "middle";
    const anchor = resolveTickLabelValue(options.anchor, context) ?? defaultAnchor;
    const label = axis === "x" ? {
      kind: "label",
      key: `x-tick-label:${valueKey(tick.value)}`,
      x: tick.position + dx,
      y: chart.y + chart.height + size + padding + fontSize * 0.8 + dy,
      text: tick.label,
      anchor,
      rotate,
      fontSize,
      fontWeight,
      style: {
        fill: theme.muted,
        ...opacity === void 0 ? { fillOpacity: 0.68 } : { opacity }
      }
    } : {
      kind: "label",
      key: `y-tick-label:${valueKey(tick.value)}`,
      x: chart.x - size - padding + dx,
      y: tick.position + dy,
      text: tick.label,
      anchor,
      baseline: "middle",
      rotate,
      fontSize,
      fontWeight,
      style: {
        fill: theme.muted,
        ...opacity === void 0 ? { fillOpacity: 0.68 } : { opacity }
      }
    };
    return {
      value: tick.value,
      label,
      bounds: measureSceneLabelBounds(label, measureText),
      hard: tick.hard ?? false
    };
  });
}
function resolveTickLabelValue(value, context) {
  return typeof value === "function" ? value(context) : value;
}
function thinTickLabels(candidates, options, categoricalX) {
  if (options.thin === false || candidates.length < 2) return [...candidates];
  const thin = typeof options.thin === "object" ? options.thin : {};
  const minGap = Math.max(0, finiteMargin(thin.minGap ?? 4));
  const selected = candidates.filter(
    (candidate) => candidate.hard
  );
  const soft = candidates.filter((candidate) => !candidate.hard);
  const prioritizeEnds = thin.priority === "ends" || categoricalX;
  if (prioritizeEnds && soft.length) {
    const first = soft[0];
    const last = soft.at(-1);
    if (!collidesWithAny(first, selected, minGap)) selected.push(first);
    if (last !== first && !collidesWithAny(last, selected, minGap)) {
      selected.push(last);
    }
  }
  const ordered = distributedCandidates(
    soft.filter((candidate) => !selected.includes(candidate))
  );
  for (const candidate of ordered) {
    if (!collidesWithAny(candidate, selected, minGap)) selected.push(candidate);
  }
  const selectedSet = new Set(selected);
  return candidates.filter((candidate) => selectedSet.has(candidate));
}
function distributedCandidates(candidates) {
  if (candidates.length < 3) return [...candidates];
  const result = [];
  const queue = [candidates];
  while (queue.length) {
    const range = queue.shift();
    if (!range.length) continue;
    const middle = Math.floor(range.length / 2);
    result.push(range[middle]);
    queue.push(range.slice(0, middle), range.slice(middle + 1));
  }
  return result;
}
function collidesWithAny(candidate, selected, gap) {
  return selected.some(
    (other) => boundsCollide(candidate.bounds, other.bounds, gap)
  );
}
function boundsCollide(left, right, gap) {
  return !(left.x + left.width + gap <= right.x || right.x + right.width + gap <= left.x || left.y + left.height + gap <= right.y || right.y + right.height + gap <= left.y);
}
function formatAxisValue(value) {
  return value instanceof Date ? value.toLocaleDateString() : String(value);
}
function finiteSize(value) {
  return Number.isFinite(value) ? Math.max(1, value) : 1;
}
function createChartRuntime(options = {}) {
  const platformTheme = {
    ...defaultChartTheme,
    ...options.defaultTheme,
    palette: options.defaultTheme?.palette ?? defaultChartTheme.palette
  };
  return {
    render(definition, size, layout) {
      if (!isResponsiveChartDefinition(definition)) {
        return createChartScene(definition, size, {
          ...layout,
          defaultTheme: platformTheme
        });
      }
      const { chart, ...options2 } = definition;
      const spec = chart({
        width: size.width,
        height: size.height,
        defaultTheme: platformTheme
      });
      return createChartScene({ ...spec, ...options2 }, size, {
        ...layout,
        defaultTheme: platformTheme
      });
    },
    destroy() {
    }
  };
}
function isResponsiveChartDefinition(definition) {
  return "chart" in definition && typeof definition.chart === "function";
}
function resolveChartAdapterLayout(options) {
  const initialWidth = options.width ?? options.initialWidth ?? 640;
  const aspectRatio = typeof options.aspectRatio === "number" && Number.isFinite(options.aspectRatio) && options.aspectRatio > 0 ? options.aspectRatio : void 0;
  return {
    aspectRatio,
    initialWidth,
    initialHeight: options.height ?? (aspectRatio === void 0 ? 320 : initialWidth / aspectRatio)
  };
}
function resolveChartHostTabIndex(definition, tabIndex = 0) {
  return definition.keyboard === false || definition.focus === false || definition.cursor?.mode === "free" ? -1 : tabIndex;
}
function createDomTextMeasurer(container) {
  const view = container.ownerDocument.defaultView;
  const CanvasContext = view?.CanvasRenderingContext2D;
  const context = CanvasContext ? container.ownerDocument.createElement("canvas").getContext("2d") : null;
  let style = readFontStyle();
  let signature = fontSignature(style);
  const cache = /* @__PURE__ */ new Map();
  return {
    measureText(text, options) {
      if (!context) return estimateSceneText(text, options);
      const key = `${signature}\0${options.fontSize}\0${options.fontWeight ?? ""}\0${options.fontFamily}\0${options.fontStyle}\0${options.fontStretch}\0${options.letterSpacing}\0${options.direction}\0${options.locale ?? ""}\0${options.fontScale}\0${options.anchor}\0${options.baseline}\0${text}`;
      const cached = cache.get(key);
      if (cached) return cached;
      configureContext(context, style.weight, options);
      const measured = context.measureText(text);
      const metrics = paintedBounds(measured, options);
      cache.set(key, metrics);
      return metrics;
    },
    typography() {
      return {
        fontFamily: style.family,
        fontStyle: style.style,
        fontStretch: style.stretch,
        letterSpacing: style.letterSpacing,
        direction: style.direction
      };
    },
    refresh() {
      const nextStyle = readFontStyle();
      const nextSignature = fontSignature(nextStyle);
      if (nextSignature === signature) return false;
      style = nextStyle;
      signature = nextSignature;
      cache.clear();
      return true;
    },
    invalidate() {
      cache.clear();
    }
  };
  function readFontStyle() {
    const computed = view?.getComputedStyle(container);
    return {
      family: computed?.fontFamily || "sans-serif",
      style: computed?.fontStyle || "normal",
      stretch: normalizeFontStretch(computed?.fontStretch),
      weight: computed?.fontWeight || "400",
      direction: computed?.direction === "rtl" ? "rtl" : computed?.direction === "ltr" ? "ltr" : "inherit",
      letterSpacing: finiteCssPixels(computed?.letterSpacing)
    };
  }
}
function configureContext(context, defaultWeight, options) {
  const fontScale = positiveFinite(options.fontScale, 1);
  const fontSize = options.fontSize * fontScale;
  const weight = options.fontWeight ?? defaultWeight;
  context.font = [
    options.fontStyle,
    weight,
    `${fontSize}px`,
    options.fontFamily
  ].join(" ");
  if ("fontStretch" in context) {
    context.fontStretch = normalizeFontStretch(options.fontStretch);
  }
  context.textAlign = options.anchor === "middle" ? "center" : options.anchor;
  context.textBaseline = options.baseline === "auto" ? "alphabetic" : options.baseline;
  context.direction = options.direction;
  if ("letterSpacing" in context) {
    context.letterSpacing = `${options.letterSpacing * fontScale}px`;
  }
}
function paintedBounds(measured, options) {
  const fontSize = options.fontSize * positiveFinite(options.fontScale, 1);
  const left = measured.actualBoundingBoxLeft;
  const right = measured.actualBoundingBoxRight;
  const ascent = measured.actualBoundingBoxAscent;
  const descent = measured.actualBoundingBoxDescent;
  if ([left, right, ascent, descent].every((value) => Number.isFinite(value)) && (left + right > 0 || measured.width === 0) && (ascent + descent > 0 || measured.width === 0)) {
    return {
      x: -left,
      y: -ascent,
      width: left + right,
      height: ascent + descent
    };
  }
  const width = Number.isFinite(measured.width) ? Math.max(0, measured.width) : 0;
  const x = options.anchor === "middle" ? -width / 2 : options.anchor === "end" ? -width : 0;
  const y = options.baseline === "middle" ? -fontSize / 2 : options.baseline === "hanging" ? 0 : -fontSize * 0.8;
  return { x, y, width, height: fontSize };
}
function fontSignature(style) {
  return [
    style.family,
    style.style,
    style.stretch,
    style.weight,
    style.direction,
    style.letterSpacing
  ].join("\0");
}
function normalizeFontStretch(value) {
  if (value === "ultra-condensed" || value === "extra-condensed" || value === "condensed" || value === "semi-condensed" || value === "normal" || value === "semi-expanded" || value === "expanded" || value === "extra-expanded" || value === "ultra-expanded") {
    return value;
  }
  const percentage = Number.parseFloat(value ?? "");
  if (!Number.isFinite(percentage)) return "normal";
  if (percentage <= 50) return "ultra-condensed";
  if (percentage <= 62.5) return "extra-condensed";
  if (percentage <= 75) return "condensed";
  if (percentage <= 87.5) return "semi-condensed";
  if (percentage < 112.5) return "normal";
  if (percentage < 125) return "semi-expanded";
  if (percentage < 150) return "expanded";
  if (percentage < 200) return "extra-expanded";
  return "ultra-expanded";
}
function finiteCssPixels(value) {
  const parsed = Number.parseFloat(value ?? "");
  return Number.isFinite(parsed) ? parsed : 0;
}
function positiveFinite(value, fallback) {
  return value !== void 0 && Number.isFinite(value) && value > 0 ? value : fallback;
}
const focusDisabled = {
  resolve: () => [],
  group: () => [],
  navigation: () => []
};
const focusGroupX = axisFocus("x", true);
const focusGroupY = axisFocus("y", true);
const focusNearestX = axisFocus("x", false);
const focusNearestY = axisFocus("y", false);
function axisFocus(axis, grouped) {
  const coordinate = (point) => axis === "x" ? point.x : point.y;
  const value = (point) => axis === "x" ? point.xValue : point.yValue;
  const secondary = (point) => axis === "x" ? point.y : point.x;
  return {
    resolve(points, context) {
      const { x, y, maxDistance } = context;
      const target = axis === "x" ? x : y;
      let nearest;
      let distance = maxDistance;
      for (const point of points) {
        const nextDistance = Math.abs(coordinate(point) - target);
        if (nextDistance >= distance) continue;
        nearest = point;
        distance = nextDistance;
      }
      if (!nearest) return [];
      const candidates = groupPoints(points, nearest, value);
      const secondaryTarget = axis === "x" ? y : x;
      const primary = candidates.reduce(
        (closest, candidate) => Math.abs(secondary(candidate) - secondaryTarget) < Math.abs(secondary(closest) - secondaryTarget) ? candidate : closest,
        nearest
      );
      return grouped ? [primary, ...candidates.filter((point) => point !== primary)] : [primary];
    },
    group(points, context) {
      const { point } = context;
      return grouped ? groupPoints(points, point, value) : [point];
    },
    navigation(points) {
      const sorted = [...points].sort(
        (left, right) => left.x - right.x || left.y - right.y
      );
      if (!grouped) return sorted;
      const unique = /* @__PURE__ */ new Map();
      for (const point of sorted) {
        const key = valueKey(value(point));
        if (!unique.has(key)) unique.set(key, point);
      }
      return [...unique.values()];
    }
  };
}
function groupPoints(points, point, value) {
  const key = valueKey(value(point));
  const unique = /* @__PURE__ */ new Map();
  unique.set(valueKey(point.group), point);
  for (const candidate of points) {
    if (valueKey(value(candidate)) !== key) continue;
    const group = valueKey(candidate.group);
    if (!unique.has(group)) unique.set(group, candidate);
  }
  const sorted = [...unique.values()].sort((left, right) => left.y - right.y);
  return [point, ...sorted.filter((candidate) => candidate !== point)];
}
function resolveChartFocusStrategy(focus) {
  if (focus === false) return void 0;
  if (typeof focus !== "string") return focus;
  switch (focus) {
    case "nearest-x":
      return focusNearestX;
    case "nearest-y":
      return focusNearestY;
    case "group-x":
      return focusGroupX;
    case "group-y":
      return focusGroupY;
    case "nearest":
      return void 0;
  }
}
function resolveChartPointerFocus(scene, focusMode, x, y, maxDistance, points = scene.points) {
  const strategy = resolveChartFocusStrategy(focusMode);
  if (!strategy) return void 0;
  if (points === scene.points && (strategy === focusNearestX || strategy === focusNearestY || strategy === focusGroupX || strategy === focusGroupY)) {
    const contained = findContainingScenePoint(scene, x, y);
    if (contained) {
      return contained.point ? strategy.group(points, { point: contained.point }) : [];
    }
  }
  return strategy.resolve(points, { x, y, maxDistance });
}
function sameChartPointIdentity(left, right) {
  return left === right || left !== null && right !== null && left.key === right.key && left.markId === right.markId && left.datumIndex === right.datumIndex;
}
function restoreChartFocusPoint(points, previous) {
  const matches = points.filter((point) => point.key === previous.key);
  if (matches.length < 2) return matches[0] ?? null;
  const datumType = typeof previous.datum;
  const hasReferenceIdentity = previous.datum !== null && (datumType === "object" || datumType === "function");
  if (hasReferenceIdentity) {
    const sameDatum = matches.find((point) => point.datum === previous.datum);
    if (sameDatum) return sameDatum;
  }
  return matches.find(
    (point) => point.markId === previous.markId && Object.is(point.group, previous.group) && sameChartValue(point.xValue, previous.xValue) && sameChartValue(point.yValue, previous.yValue)
  ) ?? matches.find(
    (point) => point.markId === previous.markId && point.datumIndex === previous.datumIndex
  ) ?? matches[0] ?? null;
}
function chartPointFromNavigationOrder(points, current, key) {
  const currentIndex = current ? points.findIndex((point) => sameChartPointIdentity(point, current)) : -1;
  let nextIndex;
  switch (key) {
    case "ArrowRight":
    case "ArrowDown":
      nextIndex = Math.min(points.length - 1, currentIndex + 1);
      break;
    case "ArrowLeft":
    case "ArrowUp":
      nextIndex = Math.max(0, currentIndex < 0 ? 0 : currentIndex - 1);
      break;
    case "Home":
      nextIndex = 0;
      break;
    case "End":
      nextIndex = points.length - 1;
      break;
    default:
      return void 0;
  }
  return points[nextIndex] ?? null;
}
function chartPointFromSceneOrder(points, current, key) {
  const direction = key === "ArrowRight" || key === "ArrowDown" ? 1 : key === "ArrowLeft" || key === "ArrowUp" ? -1 : key === "Home" ? 0 : key === "End" ? 2 : void 0;
  if (direction === void 0) return void 0;
  if (!points.length) return null;
  const currentIndex = current ? points.findIndex((point) => sameChartPointIdentity(point, current)) : -1;
  if (!current || currentIndex < 0 || direction === 0 || direction === 2) {
    return navigationExtreme(points, direction === 2);
  }
  let candidate = null;
  let candidateIndex = -1;
  for (let index = 0; index < points.length; index += 1) {
    const point = points[index];
    if (!point) continue;
    const relative = compareNavigationPoints(
      point,
      index,
      current,
      currentIndex
    );
    if (direction > 0 && relative <= 0 || direction < 0 && relative >= 0) {
      continue;
    }
    if (!candidate || direction * compareNavigationPoints(point, index, candidate, candidateIndex) < 0) {
      candidate = point;
      candidateIndex = index;
    }
  }
  return candidate ?? current;
}
function navigationExtreme(points, maximum) {
  let candidate = points[0] ?? null;
  let candidateIndex = 0;
  for (let index = 1; index < points.length; index += 1) {
    const point = points[index];
    if (!point || !candidate) continue;
    const comparison = compareNavigationPoints(
      point,
      index,
      candidate,
      candidateIndex
    );
    if (maximum && comparison > 0 || !maximum && comparison < 0) {
      candidate = point;
      candidateIndex = index;
    }
  }
  return candidate;
}
function compareNavigationPoints(left, leftIndex, right, rightIndex) {
  return left.x - right.x || left.y - right.y || leftIndex - rightIndex;
}
function sameChartValue(left, right) {
  return left instanceof Date && right instanceof Date ? left.getTime() === right.getTime() : Object.is(left, right);
}
function createChartCursorHostSession(binding) {
  const extension = binding.use;
  if (extension.__chartExtensionType !== "cursor") {
    throw new TypeError("A chart cursor requires a cursor host extension.");
  }
  return extension.create(binding.controller);
}
function mountChartRenderer(container, initialOptions, runtime = createChartRuntime()) {
  resolveTooltipInput(initialOptions.definition.tooltip);
  let options = initialOptions;
  let scene;
  let interactionScene;
  let focusedPoint = null;
  let focusSource = "pointer";
  let focusOwner = null;
  let pointerPosition = null;
  let pinnedKey = null;
  let observer;
  let renderFrame;
  let forceScheduledRender = false;
  let scheduledRenderReason;
  let destroyed = false;
  let hasRendered = false;
  let surface;
  let unsubscribePresentation;
  let renderingSurface = false;
  let paintingFocus = false;
  let tooltipExtension;
  let tooltipInstance;
  let suppressNextSurfaceFocus = false;
  let spatialIndex;
  const controlInstances = /* @__PURE__ */ new Map();
  let cursorSession;
  let cursorMode;
  let cursorMatch;
  let cursorExtension;
  let renderedCursorBinding;
  let unsubscribeCursor;
  let cursorPresentation = null;
  let hasCursorPresentation = false;
  const previousPosition = container.style.position;
  const view = container.ownerDocument.defaultView;
  const computedPosition = view?.getComputedStyle(container).position;
  const ownsPosition = !computedPosition || computedPosition === "static";
  const domText = createDomTextMeasurer(container);
  const fontSet = container.ownerDocument.fonts;
  if (ownsPosition) container.style.position = "relative";
  const render = (refreshText = false, reason = "update") => {
    if (destroyed) return;
    if (refreshText && !options.measureText) domText.refresh();
    const previousFocusedPoint = focusedPoint;
    const previousCursorPresentation = cursorPresentation;
    const previousCursorBinding = renderedCursorBinding;
    scene = createHostedScene(createScene());
    interactionScene = scene;
    if (!surface) {
      surface = options.renderer.mount(container, scheduleRender);
      subscribeToPresentation();
    } else if (surface.renderer !== options.renderer) {
      unsubscribePresentation?.();
      unsubscribePresentation = void 0;
      destroyTooltip();
      destroyHostControls();
      surface.destroy();
      container.replaceChildren();
      surface = options.renderer.mount(container, scheduleRender);
      subscribeToPresentation();
      hasRendered = false;
    }
    renderingSurface = true;
    try {
      surface.render(scene, {
        ariaLabel: options.ariaLabel,
        ariaDescription: options.ariaDescription,
        className: options.className,
        tabIndex: resolveChartHostTabIndex(
          options.definition,
          options.tabIndex
        ),
        idPrefix: options.idPrefix,
        animation: hasRendered ? resolveAnimation(options.definition.svgAnimation, container, reason) : void 0
      });
    } finally {
      renderingSurface = false;
    }
    syncHostControls();
    hasRendered = true;
    const presentedPoints = interactionPoints();
    spatialIndex = options.definition.focus === false ? void 0 : options.definition.spatialIndex?.(
      viewportInteractionPoints(scene, scene.points),
      { scene }
    );
    const nextCursorBinding = cursorBinding();
    renderedCursorBinding = nextCursorBinding;
    if (nextCursorBinding) {
      applyCursorState(true);
    } else if (previousCursorBinding) {
      cursorPresentation = null;
      focusedPoint = null;
      pinnedKey = null;
      pointerPosition = null;
      focusOwner = null;
      paintFocus(null, []);
      if (previousFocusedPoint) {
        options.onFocusChange?.(null);
        options.onFocusGroupChange?.([]);
      }
    } else {
      cursorPresentation = null;
      const trackedPointer = (focusOwner === "pointer" || focusOwner === "controlled" && focusSource === "pointer") && pinnedKey === null ? pointerPosition : null;
      const nextFocusedPoints = trackedPointer ? resolvePointerFocus(trackedPointer.x, trackedPointer.y, maxDistance()) : previousFocusedPoint ? (() => {
        const restored = restoreChartFocusPoint(
          presentedPoints,
          previousFocusedPoint
        );
        return restored ? focusPointsForPoint(restored, presentedPoints) : [];
      })() : [];
      const nextFocusedPoint = nextFocusedPoints[0] ?? null;
      focusedPoint = nextFocusedPoint;
      if (!nextFocusedPoint) pinnedKey = null;
      if (previousFocusedPoint || nextFocusedPoint || previousCursorPresentation) {
        if (!trackedPointer) focusSource = "restored";
        paintFocus(nextFocusedPoint, nextFocusedPoints);
        options.onFocusChange?.(nextFocusedPoint);
        options.onFocusGroupChange?.(nextFocusedPoints);
      }
    }
    const onRender = options.onRender;
    if (onRender) {
      onRender({ container, scene, surface, interaction });
    }
  };
  const currentWidth = () => {
    const width = options.width ?? container.getBoundingClientRect().width;
    return options.width !== void 0 || width > 0 ? width : void 0;
  };
  const configureObserver = () => {
    observer?.disconnect();
    observer = void 0;
    if (options.width !== void 0) return;
    const ResizeObserverConstructor = view?.ResizeObserver;
    if (!ResizeObserverConstructor) return;
    observer = new ResizeObserverConstructor(() => {
      const width = currentWidth();
      if (width === void 0 || width === scene.width) return;
      scheduleRender(false, "resize");
    });
    observer.observe(container);
  };
  const scheduleRender = (force = false, reason = "layout") => {
    forceScheduledRender ||= force;
    scheduledRenderReason = scheduledRenderReason === "layout" || reason === "layout" ? "layout" : "resize";
    if (renderFrame !== void 0) return;
    if (!view?.requestAnimationFrame) {
      const nextWidth = currentWidth();
      const shouldRender = forceScheduledRender || nextWidth !== void 0 && nextWidth !== scene.width;
      forceScheduledRender = false;
      const nextReason = scheduledRenderReason ?? "layout";
      scheduledRenderReason = void 0;
      if (shouldRender) render(true, nextReason);
      return;
    }
    renderFrame = view.requestAnimationFrame(() => {
      renderFrame = void 0;
      const nextWidth = currentWidth();
      const shouldRender = forceScheduledRender || nextWidth !== void 0 && nextWidth !== scene.width;
      forceScheduledRender = false;
      const nextReason = scheduledRenderReason ?? "layout";
      scheduledRenderReason = void 0;
      if (shouldRender) render(true, nextReason);
    });
  };
  const handleFontLoad = () => {
    if (destroyed || options.measureText) return;
    domText.invalidate();
    scheduleRender(true);
  };
  const cursorBinding = () => options.definition.cursor;
  const cursorIsPinned = () => cursorSession?.getState()?.pinned === true;
  const interactionIsPinned = () => pinnedKey !== null || cursorIsPinned();
  const configureCursorController = () => {
    const nextBinding = cursorBinding();
    if (nextBinding) hasCursorPresentation = true;
    const nextController = nextBinding?.controller;
    const nextMode = nextBinding?.mode;
    const nextMatch = nextBinding?.mode === "focus" ? nextBinding.match ?? "xy" : void 0;
    if (nextController === cursorSession?.controller && nextMode === cursorMode && nextMatch === cursorMatch && nextBinding?.use === cursorExtension) {
      return;
    }
    unsubscribeCursor?.();
    unsubscribeCursor = void 0;
    cursorSession?.destroy();
    cursorSession = nextBinding ? createChartCursorHostSession(nextBinding) : void 0;
    cursorMode = nextMode;
    cursorMatch = nextMatch;
    cursorExtension = nextBinding?.use;
    unsubscribeCursor = cursorSession?.subscribe(() => {
      if (!destroyed && hasRendered) applyCursorState(false);
    });
  };
  const applyCursorState = (notifyRestored) => {
    const binding = cursorBinding();
    if (!binding) {
      cursorPresentation = null;
      return;
    }
    const session = cursorSession;
    if (!session) return;
    const state = session.getState();
    if (state?.source !== "pointer" || !session.owns(state)) {
      pointerPosition = null;
    }
    cursorPresentation = session.resolvePresentation(scene, binding, state);
    const previous = focusedPoint;
    if (binding.mode === "focus") {
      const focus = resolveChartFocusStrategy(options.definition.focus);
      const points = session.resolveFocus(
        interactionPoints(),
        binding,
        state,
        focus
      );
      const point = points[0] ?? null;
      if (state) focusSource = state.source;
      pinnedKey = state?.pinned && point ? point.key : null;
      focusedPoint = point;
      paintFocus(point, points);
      if (!sameChartPointIdentity(previous, point) || notifyRestored && (previous !== null || point !== null)) {
        options.onFocusChange?.(point);
        options.onFocusGroupChange?.(points);
      }
      return;
    }
    pinnedKey = null;
    focusedPoint = null;
    paintFocus(null, []);
    if (previous) {
      options.onFocusChange?.(null);
      options.onFocusGroupChange?.([]);
    }
  };
  const publishFocusCursor = (points, pinned = interactionIsPinned()) => {
    const binding = cursorBinding();
    if (binding?.mode !== "focus") return false;
    const session = cursorSession;
    if (!session) return false;
    const point = points[0];
    if (!point) {
      session.clearOwnedTransient();
      return true;
    }
    session.publish(
      session.createFocusState(scene, binding, {
        primary: point,
        group: points,
        source: focusSource,
        pinned
      })
    );
    return true;
  };
  const updateFocus = (points, forcePaint = false) => {
    const point = points[0] ?? null;
    if (publishFocusCursor(points)) return;
    if (sameChartPointIdentity(point, focusedPoint)) {
      focusedPoint = point;
      if (forcePaint) paintFocus(point, points);
      return;
    }
    focusedPoint = point;
    paintFocus(point, points);
    options.onFocusChange?.(point);
    options.onFocusGroupChange?.(points);
  };
  const dismissTooltip = () => {
    const binding = cursorBinding();
    if (!focusedPoint && !pinnedKey && !cursorSession?.getState()) return;
    const restoreFocus = Boolean(
      tooltipInstance?.contains(container.ownerDocument.activeElement)
    );
    pinnedKey = null;
    pointerPosition = null;
    focusOwner = null;
    if (binding) cursorSession?.clear();
    else updateFocus([]);
    const element = surface?.element;
    if (restoreFocus && element && "focus" in element && typeof element.focus === "function") {
      suppressNextSurfaceFocus = true;
      element.focus();
    }
  };
  const paintFocus = (point, points) => {
    paintingFocus = true;
    let paintedScene;
    try {
      const focus = point ? {
        primary: point,
        group: points,
        source: focusSource,
        pinned: interactionIsPinned()
      } : null;
      paintedScene = hasCursorPresentation ? surface?.paintFocus(focus, pointerPosition, cursorPresentation) : surface?.paintFocus(focus, pointerPosition);
    } finally {
      paintingFocus = false;
    }
    interactionScene = paintedScene ?? scene;
    paintTooltip(point, points);
  };
  const resolveClientPointer = (clientX, clientY) => {
    const position = surface?.clientToScene?.(scene, clientX, clientY);
    if (!position) return null;
    return {
      position,
      points: resolvePointerFocus(position.x, position.y, maxDistance())
    };
  };
  const pointsAtPointer = (clientX, clientY) => {
    const resolved = resolveClientPointer(clientX, clientY);
    pointerPosition = resolved?.position ?? null;
    return resolved?.points ?? [];
  };
  const interaction = {
    clientToScene(clientX, clientY) {
      if (destroyed) return null;
      return surface?.clientToScene?.(scene, clientX, clientY) ?? null;
    },
    resolvePointer(clientX, clientY) {
      if (destroyed) return null;
      const resolved = resolveClientPointer(clientX, clientY);
      const point = resolved?.points[0];
      return resolved && point ? {
        position: resolved.position,
        point,
        points: resolved.points
      } : null;
    },
    setControlledFocus(target, controlledOptions = {}) {
      if (destroyed) return;
      focusOwner = "controlled";
      if (!target) {
        focusSource = controlledOptions.source ?? "programmatic";
        pointerPosition = null;
        pinnedKey = null;
        updateFocus([]);
        focusOwner = null;
        return;
      }
      let resolution;
      let targetPoint;
      if (isPointerResolution(target)) {
        resolution = target;
        targetPoint = target.point;
      } else {
        resolution = null;
        targetPoint = target;
      }
      focusSource = controlledOptions.source ?? (resolution === null ? "programmatic" : "pointer");
      const points = interactionPoints();
      const point = restoreChartFocusPoint(points, targetPoint);
      pointerPosition = resolution?.position ?? null;
      if (!point) {
        pinnedKey = null;
        updateFocus([]);
        focusOwner = null;
        return;
      }
      const focusPoints = focusPointsForPoint(point, points);
      pinnedKey = controlledOptions.pinned && (tooltipIsSticky() || cursorBinding()?.pin === true) ? point.key : null;
      if (sameChartPointIdentity(point, focusedPoint)) {
        focusedPoint = point;
        paintFocus(point, focusPoints);
        return;
      }
      updateFocus(focusPoints);
    }
  };
  const scenePositionAtPointer = (clientX, clientY) => {
    const position = surface?.clientToScene?.(scene, clientX, clientY);
    pointerPosition = position ?? null;
    return position;
  };
  const updateFreeCursorAtPointer = (clientX, clientY) => {
    const binding = cursorBinding();
    if (binding?.mode !== "free") return false;
    if (cursorIsPinned()) return true;
    const position = scenePositionAtPointer(clientX, clientY);
    if (!position || !plotContains(scene, position)) {
      pointerPosition = null;
      cursorSession?.clearOwnedTransient();
      return true;
    }
    const session = cursorSession;
    if (!session) return false;
    session.publish(
      session.createFreeState(scene, binding, position, "pointer", false)
    );
    return true;
  };
  const handlePointerMove = (event) => {
    if (controlContains(event.target)) {
      if (!interactionIsPinned()) {
        pointerPosition = null;
        updateFocus([]);
      }
      return;
    }
    if (options.definition.pointer === false || interactionIsPinned()) return;
    focusOwner = "pointer";
    focusSource = "pointer";
    if (updateFreeCursorAtPointer(event.clientX, event.clientY)) return;
    updateFocus(
      pointsAtPointer(event.clientX, event.clientY),
      tooltipTracksPointer()
    );
  };
  const handlePointerDown = (event) => {
    if (options.definition.pointer === false || interactionIsPinned()) return;
    focusOwner = "pointer";
    focusSource = "pointer";
    updateFreeCursorAtPointer(event.clientX, event.clientY);
  };
  const clearPointerFocus = ({ relatedTarget }) => {
    if (options.definition.pointer !== false && focusOwner === "pointer" && !interactionIsPinned() && !(view && relatedTarget instanceof view.Node && container.contains(relatedTarget))) {
      pointerPosition = null;
      const binding = cursorBinding();
      if (binding) cursorSession?.clearOwnedTransient();
      else updateFocus([]);
      focusOwner = null;
    }
  };
  const clearKeyboardFocus = ({ relatedTarget }) => {
    if (focusOwner === "keyboard" && !pinnedKey && !(view && relatedTarget instanceof view.Node && container.contains(relatedTarget))) {
      pointerPosition = null;
      const binding = cursorBinding();
      if (binding) cursorSession?.clearOwnedTransient();
      else updateFocus([]);
      focusOwner = null;
    }
  };
  const handleClick = (event) => {
    if (controlContains(event.target)) return;
    if (options.definition.pointer === false) return;
    const activeTooltip = tooltipInstance;
    const NodeConstructor = container.ownerDocument.defaultView?.Node;
    const originatedInTooltip = NodeConstructor ? event.composedPath().some(
      (target) => target instanceof NodeConstructor && activeTooltip?.contains(target)
    ) : activeTooltip?.contains(event.target);
    if (activeTooltip && originatedInTooltip) {
      return;
    }
    focusOwner = "pointer";
    const binding = cursorBinding();
    if (binding?.mode === "free") {
      const state = cursorSession?.getState();
      if (!state) {
        updateFreeCursorAtPointer(event.clientX, event.clientY);
      }
      const current = cursorSession?.getState();
      if (binding.pin && current) {
        if (current.pinned) {
          cursorSession?.clear();
        } else {
          cursorSession?.publish({ ...current, pinned: true });
        }
      }
      options.onSelect?.(null);
      return;
    }
    const points = pointsAtPointer(event.clientX, event.clientY);
    focusSource = "pointer";
    const point = points[0] ?? null;
    let pinChanged = false;
    const canPin = tooltipIsSticky() || binding?.pin === true;
    if (canPin) {
      if (interactionIsPinned()) {
        pinnedKey = null;
        pinChanged = true;
        if (binding) cursorSession?.clear();
      } else if (point) {
        pinnedKey = point.key;
        pinChanged = true;
      }
    }
    if (!(binding && canPin && pinChanged && !pinnedKey)) {
      updateFocus(points, pinChanged);
    }
    options.definition.selection?.change(point, "pointer");
    options.onSelect?.(point);
  };
  const handleKeyDown = (event) => {
    if (controlContains(event.target)) return;
    const binding = cursorBinding();
    if (event.key === "Escape" && cursorSession?.getState()) {
      event.preventDefault();
      dismissTooltip();
      return;
    }
    if (event.key === "Escape" && pinnedKey) {
      event.preventDefault();
      dismissTooltip();
      return;
    }
    if (options.definition.keyboard === false || binding?.mode === "free") {
      return;
    }
    const points = interactionPoints();
    if (!points.length) return;
    if (event.key === "Enter" || event.key === " ") {
      if (!focusedPoint) return;
      event.preventDefault();
      const point2 = focusedPoint;
      const canPin = tooltipIsSticky() || binding?.pin === true;
      if (binding?.mode === "focus" && canPin) {
        if (interactionIsPinned()) {
          pinnedKey = null;
          cursorSession?.clear();
        } else {
          pinnedKey = point2.key;
          publishFocusCursor(focusPointsForPoint(point2), true);
        }
      } else if (tooltipIsSticky()) {
        pinnedKey = pinnedKey ? null : point2.key;
        paintFocus(point2, focusPointsForPoint(point2));
      }
      options.definition.selection?.change(point2, "keyboard");
      options.onSelect?.(point2);
      return;
    }
    const focus = resolveRendererFocusStrategy(options.definition.focus);
    const point = focus ? chartPointFromNavigationOrder(
      focus.navigation(points),
      focusedPoint,
      event.key
    ) : chartPointFromSceneOrder(points, focusedPoint, event.key);
    if (point === void 0) return;
    event.preventDefault();
    pointerPosition = null;
    focusOwner = "keyboard";
    focusSource = "keyboard";
    updateFocus(point ? focusPointsForPoint(point) : []);
  };
  const handleFocus = (event) => {
    if (controlContains(event.target)) {
      if (!pinnedKey) {
        pointerPosition = null;
        updateFocus([]);
      }
      return;
    }
    if (event.target === surface?.element && suppressNextSurfaceFocus) {
      suppressNextSurfaceFocus = false;
      return;
    }
    if (options.definition.keyboard !== false && cursorBinding()?.mode !== "free" && event.target === surface?.element && !focusedPoint) {
      const focus = resolveRendererFocusStrategy(options.definition.focus);
      const points = interactionPoints();
      const point = focus ? focus.navigation(points)[0] : chartPointFromSceneOrder(points, null, "Home");
      pointerPosition = null;
      focusOwner = "keyboard";
      focusSource = "keyboard";
      updateFocus(point ? focusPointsForPoint(point) : []);
    }
  };
  container.addEventListener("pointermove", handlePointerMove);
  container.addEventListener("pointerdown", handlePointerDown);
  container.addEventListener("pointercancel", clearPointerFocus);
  container.addEventListener("mouseleave", clearPointerFocus);
  container.addEventListener("click", handleClick);
  container.addEventListener("keydown", handleKeyDown);
  container.addEventListener("focusin", handleFocus);
  container.addEventListener("focusout", clearKeyboardFocus);
  fontSet?.addEventListener?.("loadingdone", handleFontLoad);
  configureCursorController();
  render();
  configureObserver();
  return {
    interaction,
    update(nextOptions) {
      if (destroyed) return;
      resolveTooltipInput(nextOptions.definition.tooltip);
      const fontChanged = nextOptions.measureText === void 0 && domText.refresh();
      const definitionChanged = options.definition !== nextOptions.definition;
      const sizeChanged = options.height !== nextOptions.height || options.aspectRatio !== nextOptions.aspectRatio || options.width !== nextOptions.width || options.initialWidth !== nextOptions.initialWidth;
      const layoutChanged = options.idPrefix !== nextOptions.idPrefix || options.renderer !== nextOptions.renderer || options.measureText !== nextOptions.measureText || fontChanged;
      const needsRender = definitionChanged || sizeChanged || options.ariaLabel !== nextOptions.ariaLabel || options.ariaDescription !== nextOptions.ariaDescription || options.className !== nextOptions.className || options.tabIndex !== nextOptions.tabIndex || options.idPrefix !== nextOptions.idPrefix || options.renderer !== nextOptions.renderer || options.measureText !== nextOptions.measureText || fontChanged;
      const observerChanged = options.width !== nextOptions.width;
      const pointerDisabled = options.definition.pointer !== false && nextOptions.definition.pointer === false && focusOwner === "pointer";
      options = nextOptions;
      configureCursorController();
      syncTooltip();
      if (pointerDisabled) {
        pointerPosition = null;
        pinnedKey = null;
        focusOwner = null;
        updateFocus([]);
      }
      if (!tooltipIsSticky()) pinnedKey = null;
      if (needsRender) {
        render(
          false,
          layoutChanged ? "layout" : sizeChanged ? "resize" : "update"
        );
      } else {
        if (cursorBinding()) {
          applyCursorState(false);
        } else if (focusedPoint) {
          paintFocus(focusedPoint, focusPointsForPoint(focusedPoint));
        }
      }
      if (observerChanged) configureObserver();
    },
    getScene: () => scene,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      observer?.disconnect();
      unsubscribeCursor?.();
      unsubscribeCursor = void 0;
      cursorSession?.destroy();
      cursorSession = void 0;
      cursorMode = void 0;
      cursorMatch = void 0;
      cursorExtension = void 0;
      fontSet?.removeEventListener?.("loadingdone", handleFontLoad);
      if (renderFrame !== void 0) {
        view?.cancelAnimationFrame?.(renderFrame);
      }
      destroyTooltip();
      destroyHostControls();
      unsubscribePresentation?.();
      unsubscribePresentation = void 0;
      surface?.destroy();
      runtime.destroy();
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointercancel", clearPointerFocus);
      container.removeEventListener("mouseleave", clearPointerFocus);
      container.removeEventListener("click", handleClick);
      container.removeEventListener("keydown", handleKeyDown);
      container.removeEventListener("focusin", handleFocus);
      container.removeEventListener("focusout", clearKeyboardFocus);
      container.replaceChildren();
      if (ownsPosition && container.style.position === "relative") {
        container.style.position = previousPosition;
      }
    }
  };
  function createScene() {
    const width = currentWidth() ?? options.initialWidth ?? 640;
    return runtime.render(
      options.definition,
      {
        width,
        height: options.height ?? (isPositiveFiniteNumber(options.aspectRatio) ? width / options.aspectRatio : 320)
      },
      {
        measureText: options.measureText ?? domText.measureText,
        typography: domText.typography()
      }
    );
  }
  function syncHostControls() {
    const retained = /* @__PURE__ */ new Set();
    for (const control of scene.controls ?? []) {
      const extension = control.extension;
      const identity = `${extension.id}:${control.key}`;
      retained.add(identity);
      let current = controlInstances.get(identity);
      if (current && current.extension !== extension) {
        current.instance.destroy();
        controlInstances.delete(identity);
        current = void 0;
      }
      if (!current) {
        current = {
          extension,
          instance: extension.create({ container, surface })
        };
        controlInstances.set(identity, current);
      }
      current.instance.update(control, scene);
    }
    for (const [identity, current] of controlInstances) {
      if (retained.has(identity)) continue;
      current.instance.destroy();
      controlInstances.delete(identity);
    }
  }
  function destroyHostControls() {
    for (const current of controlInstances.values()) {
      current.instance.destroy();
    }
    controlInstances.clear();
  }
  function controlContains(target) {
    for (const current of controlInstances.values()) {
      if (current.instance.contains?.(target)) return true;
    }
    return false;
  }
  function resolvePointerFocus(x, y, maxDistance2) {
    const points = interactionPoints();
    const focus = resolveRendererFocusStrategy(options.definition.focus);
    const focused = resolveChartPointerFocus(
      interactionScene,
      focus,
      x,
      y,
      maxDistance2,
      points
    );
    if (focused) return focused;
    const presentationPoints = surface?.getPresentationPoints?.();
    const candidate = presentationPoints !== void 0 ? nearestPoint(points, x, y, maxDistance2) : spatialIndex && interactionScene === scene ? spatialIndex.findNearest(x, y, maxDistance2) : findNearestPoint(interactionScene, x, y, maxDistance2, points);
    const point = candidate ? restoreChartFocusPoint(points, candidate) : null;
    return point ? [point] : [];
  }
  function interactionPoints() {
    const points = surface?.getPresentationPoints?.() ?? interactionScene.points;
    return viewportInteractionPoints(scene, points);
  }
  function focusPointsForPoint(point, points = interactionPoints()) {
    return resolveRendererFocusStrategy(options.definition.focus)?.group(points, {
      point
    }) ?? [point];
  }
  function subscribeToPresentation() {
    unsubscribePresentation = surface?.subscribePresentationPoints?.(
      handlePresentationPoints
    );
  }
  function handlePresentationPoints(points) {
    if (destroyed || renderingSurface || paintingFocus) return;
    if (cursorBinding()) {
      applyCursorState(false);
      return;
    }
    const visiblePoints = viewportInteractionPoints(scene, points);
    if (pointerPosition && pinnedKey === null) {
      updateFocus(
        resolvePointerFocus(
          pointerPosition.x,
          pointerPosition.y,
          maxDistance()
        ),
        true
      );
      return;
    }
    if (!focusedPoint) return;
    const point = restoreChartFocusPoint(visiblePoints, focusedPoint);
    updateFocus(point ? focusPointsForPoint(point, visiblePoints) : [], true);
  }
  function maxDistance() {
    return options.definition.maxFocusDistance ?? 48;
  }
  function paintTooltip(point, points) {
    const input = resolveTooltipInput(options.definition.tooltip);
    if (!input || !point || !surface) {
      tooltipInstance?.hide();
      return;
    }
    if (tooltipExtension !== input.extension || !tooltipInstance) {
      destroyTooltip();
      tooltipExtension = input.extension;
      const tooltipMotionCapability = surface.renderer.capabilities?.tooltipMotion;
      tooltipInstance = input.extension.create({
        container,
        motion: tooltipMotionCapability?.protocol === 1 ? tooltipMotionCapability.createController({
          container,
          transition: resolveTooltipMotion
        }) : void 0,
        dismiss: dismissTooltip,
        bodyChange: () => options.onTooltipBodyChange
      });
    }
    const instance = tooltipInstance;
    instance.update(input.options);
    instance.paint({
      point,
      points,
      scene,
      surface,
      pointer: pointerPosition,
      focus: {
        primary: point,
        group: points,
        source: focusSource,
        pinned: interactionIsPinned()
      },
      pinned: interactionIsPinned()
    });
  }
  function resolveTooltipMotion() {
    const definition = options.definition.motion;
    if (definition === false) return false;
    return typeof definition === "function" ? void 0 : definition?.transition;
  }
  function syncTooltip() {
    const input = resolveTooltipInput(options.definition.tooltip);
    if (!input) {
      tooltipInstance?.update(emptyTooltipOptions);
      tooltipInstance?.hide();
    } else if (input.extension !== tooltipExtension) {
      destroyTooltip();
    } else {
      tooltipInstance?.update(input.options);
    }
  }
  function destroyTooltip() {
    tooltipInstance?.destroy();
    tooltipInstance = void 0;
    tooltipExtension = void 0;
  }
  function tooltipIsSticky() {
    const input = resolveTooltipInput(options.definition.tooltip);
    return Boolean(input && input.options.sticky !== false);
  }
  function tooltipTracksPointer() {
    const input = resolveTooltipInput(options.definition.tooltip);
    const anchor = input?.options.anchor;
    return anchor === "pointer" || typeof anchor === "function" || typeof anchor === "object" && (anchor.x === "pointer" || anchor.y === "pointer");
  }
}
const emptyTooltipOptions = {};
function createHostedScene(scene) {
  const fallbackKeys = new Set(
    (scene.controls ?? []).flatMap(
      (control) => control.fallbackNodeKey ? [control.fallbackNodeKey] : []
    )
  );
  if (!fallbackKeys.size) return scene;
  return {
    ...scene,
    nodes: scene.nodes.filter((node) => !fallbackKeys.has(node.key))
  };
}
function isPointerResolution(target) {
  return "position" in target && "point" in target && "points" in target;
}
function resolveTooltipInput(input) {
  if (!input) return null;
  const extension = "create" in input ? input : input.use;
  if (extension.__chartTooltipHost !== "dom") {
    throw new TypeError(
      "DOM chart hosts require a tooltip extension from @tanstack/charts/tooltip."
    );
  }
  const domExtension = extension;
  return "create" in input ? {
    extension: domExtension,
    options: emptyTooltipOptions
  } : {
    extension: domExtension,
    options: input
  };
}
function isPositiveFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}
function resolveRendererFocusStrategy(focus) {
  if (focus === false) return focusDisabled;
  return resolveChartFocusStrategy(focus);
}
function plotContains(scene, position) {
  return position.x >= scene.chart.x && position.x <= scene.chart.x + scene.chart.width && position.y >= scene.chart.y && position.y <= scene.chart.y + scene.chart.height;
}
function resolveAnimation(animation, container, reason) {
  const configured = animation === true ? {} : animation || void 0;
  if (!configured) return void 0;
  if (reason === "layout") return void 0;
  if (reason === "resize" && configured.resize !== true) return void 0;
  if ((configured.respectReducedMotion ?? true) && container.ownerDocument.defaultView?.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  ).matches) {
    return void 0;
  }
  const { resize: _resize, ...resolved } = configured;
  return resolved;
}
const interpolatedAttributes = /* @__PURE__ */ new Set([
  "cx",
  "cy",
  "d",
  "fill-opacity",
  "font-size",
  "font-weight",
  "height",
  "opacity",
  "r",
  "rx",
  "stroke-opacity",
  "stroke-width",
  "transform",
  "width",
  "x",
  "x1",
  "x2",
  "y",
  "y1",
  "y2"
]);
function reconcileChartSvg(container, markup, animation) {
  const template = container.ownerDocument.createElement("template");
  template.innerHTML = markup;
  const nextRoot = template.content.firstElementChild;
  if (!nextRoot) return () => {
  };
  const currentRoot = container.firstElementChild;
  if (!currentRoot || currentRoot.namespaceURI !== nextRoot.namespaceURI || currentRoot.localName !== nextRoot.localName) {
    container.replaceChildren(nextRoot);
    return () => {
    };
  }
  const tweens = [];
  reconcileElement(currentRoot, nextRoot, animation ? tweens : void 0);
  return animation ? runTweens(container, tweens, animation) : () => {
  };
}
function reconcileChartSvgFragment(currentRoot, markup, animation) {
  const template = currentRoot.ownerDocument.createElement("template");
  template.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${markup}</svg>`;
  const wrapper = template.content.firstElementChild;
  const nextRoot = wrapper?.firstElementChild;
  if (!nextRoot) return () => {
  };
  if (currentRoot.namespaceURI !== nextRoot.namespaceURI || currentRoot.localName !== nextRoot.localName) {
    currentRoot.replaceWith(nextRoot);
    return () => {
    };
  }
  const tweens = [];
  reconcileElement(currentRoot, nextRoot, void 0);
  return animation ? runTweens(currentRoot, tweens, animation) : () => {
  };
}
function reconcileElement(current, next, tweens) {
  syncAttributes(current, next, tweens);
  if (!next.firstElementChild) {
    if (current.firstElementChild) {
      for (const child of [...current.children]) {
        if (tweens) addExitTween(child, tweens);
        else child.remove();
      }
    } else if (current.textContent !== next.textContent) {
      current.textContent = next.textContent;
    }
    return;
  }
  const currentChildren = [...current.children];
  const nextChildren = [...next.children];
  const currentByIdentity = indexChildren(currentChildren);
  const nextIdentities = identities(nextChildren);
  const retained = /* @__PURE__ */ new Set();
  let cursor = current.firstElementChild;
  nextChildren.forEach((nextChild, index) => {
    const identity = nextIdentities[index];
    const matched = currentByIdentity.get(identity);
    let rendered;
    if (matched && matched.namespaceURI === nextChild.namespaceURI && matched.localName === nextChild.localName) {
      rendered = matched;
      retained.add(matched);
      if (rendered !== cursor) current.insertBefore(rendered, cursor);
      reconcileElement(rendered, nextChild, tweens);
    } else {
      rendered = nextChild.cloneNode(true);
      current.insertBefore(rendered, cursor);
      addEnterTween(rendered, nextChild, tweens);
    }
    cursor = rendered.nextElementSibling;
  });
  for (const child of currentChildren) {
    if (!retained.has(child) && child.parentElement === current) {
      if (tweens) addExitTween(child, tweens);
      else child.remove();
    }
  }
}
function syncAttributes(current, next, tweens) {
  const nextNames = new Set(next.getAttributeNames());
  for (const name of current.getAttributeNames()) {
    if (!nextNames.has(name)) current.removeAttribute(name);
  }
  for (const name of nextNames) {
    const target = next.getAttribute(name);
    const previous = current.getAttribute(name);
    if (target === previous) continue;
    const interpolate2 = tweens && previous !== null && target !== null && interpolatedAttributes.has(name) ? interpolateAttribute(name, previous, target) : void 0;
    if (interpolate2 && tweens) {
      tweens.push({ element: current, name, interpolate: interpolate2, target });
    } else if (target !== null) {
      current.setAttribute(name, target);
    }
  }
}
function addEnterTween(current, next, tweens) {
  if (!tweens) return;
  const target = next.getAttribute("opacity");
  const targetValue = target ?? "1";
  current.setAttribute("opacity", "0");
  tweens.push({
    element: current,
    name: "opacity",
    interpolate: (progress) => String(Number(targetValue) * Math.max(0, Math.min(1, progress))),
    target
  });
}
function addExitTween(current, tweens) {
  const opacity = Number(current.getAttribute("opacity") ?? 1);
  const start = Number.isFinite(opacity) ? opacity : 1;
  tweens.push({
    element: current,
    name: "opacity",
    interpolate: (progress) => String(start * (1 - progress)),
    target: "0",
    removeOnFinish: true
  });
}
function runTweens(container, tweens, options) {
  if (!tweens.length) return () => {
  };
  const view = container.ownerDocument.defaultView;
  const requestFrame = view?.requestAnimationFrame?.bind(view);
  const cancelFrame = view?.cancelAnimationFrame?.bind(view);
  const duration = Math.max(0, options.duration ?? 240);
  if (!requestFrame || !cancelFrame || duration === 0) {
    finishTweens(tweens);
    return () => {
    };
  }
  let frame = 0;
  let cancelled = false;
  let start;
  const ease = easing(options.easing ?? "ease-out");
  const tick = (time) => {
    if (cancelled) return;
    start ??= time;
    const progress = Math.min(1, (time - start) / duration);
    const eased = ease(progress);
    for (const tween of tweens) {
      tween.element.setAttribute(tween.name, tween.interpolate(eased));
    }
    if (progress < 1) frame = requestFrame(tick);
    else finishTweens(tweens);
  };
  frame = requestFrame(tick);
  return () => {
    cancelled = true;
    cancelFrame(frame);
  };
}
function finishTweens(tweens) {
  for (const tween of tweens) {
    if (tween.removeOnFinish) {
      tween.element.remove();
      continue;
    }
    if (tween.target === null) tween.element.removeAttribute(tween.name);
    else tween.element.setAttribute(tween.name, tween.target);
  }
}
function interpolateAttribute(name, previous, next) {
  const path = name === "d";
  const previousNumbers = extractNumbers(previous, path);
  const nextNumbers = extractNumbers(next, path);
  if (previousNumbers.skeleton !== nextNumbers.skeleton || previousNumbers.values.length !== nextNumbers.values.length || !previousNumbers.values.length) {
    return void 0;
  }
  const template = nextNumbers.skeleton;
  return (progress) => {
    let index = 0;
    return template.replaceAll(/[#!]/g, (placeholder) => {
      const start = previousNumbers.values[index];
      const end = nextNumbers.values[index];
      index += 1;
      return formatNumber(
        placeholder === "!" ? end : start + (end - start) * progress
      );
    });
  };
}
function extractNumbers(value, path = false) {
  const values = [];
  let skeleton = "";
  let command = "";
  let argument = 0;
  let index = 0;
  while (index < value.length) {
    const rest = value.slice(index);
    const arcPosition = argument % 7;
    const arcFlag = path && /a/i.test(command) && arcPosition > 2 && arcPosition < 5;
    const match = arcFlag ? /^[01]/u.exec(rest) : /^-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/iu.exec(rest);
    if (match) {
      values.push(Number(match[0]));
      skeleton += arcFlag ? "!" : "#";
      argument += 1;
      index += match[0].length;
      continue;
    }
    const character = value[index];
    skeleton += character;
    if (path && /[a-z]/i.test(character)) {
      command = character;
      argument = 0;
    }
    index += 1;
  }
  return { skeleton, values };
}
function indexChildren(children) {
  const result = /* @__PURE__ */ new Map();
  identities(children).forEach((identity, index) => {
    result.set(identity, children[index]);
  });
  return result;
}
function identities(children) {
  const counts = /* @__PURE__ */ new Map();
  return children.map((child) => {
    const explicit = child.getAttribute("data-ts-key");
    if (explicit) return `key:${explicit}`;
    const count = counts.get(child.localName) ?? 0;
    counts.set(child.localName, count + 1);
    return `tag:${child.localName}:${count}`;
  });
}
function easing(name) {
  if (typeof name === "function") return name;
  switch (name) {
    case "linear":
      return (value) => value;
    case "ease-in":
      return (value) => value * value;
    case "ease-in-out":
      return (value) => value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;
    case "ease":
    case "ease-out":
      return (value) => 1 - Math.pow(1 - value, 3);
  }
}
function formatNumber(value) {
  return String(Math.round(value * 1e3) / 1e3);
}
function renderChartSvgWithHooks(scene, options, hooks) {
  const idPrefix = options.idPrefix ?? "";
  const className = options.className ? `ts-chart ${options.className}` : "ts-chart";
  const description = options.ariaDescription ? `<desc>${escapeText(options.ariaDescription)}</desc>` : "";
  const definitions = hooks?.renderDefinitions?.(scene, idPrefix) ?? "";
  const background = scene.theme.background === "transparent" ? "" : renderNode(
    {
      kind: "rect",
      key: "background",
      x: 0,
      y: 0,
      width: scene.width,
      height: scene.height,
      style: { fill: scene.theme.background }
    },
    hooks,
    idPrefix
  );
  return `<svg class="${escapeAttribute$1(className)}" width="100%" height="100%" viewBox="0 0 ${number$2(scene.width)} ${number$2(scene.height)}" role="img" aria-roledescription="chart" aria-label="${escapeAttribute$1(options.ariaLabel)}" tabindex="${number$2(options.tabIndex ?? 0)}" style="display:block;overflow:visible">${description}${definitions}${background}${renderSceneNodes(scene.nodes, idPrefix, hooks)}</svg>`;
}
function renderSceneNodes(nodes, idPrefix = "", hooks) {
  return nodes.map((node) => renderNode(node, hooks, idPrefix)).join("");
}
function renderFocusGuideLayer(nodes, placement, idPrefix = "", hooks) {
  const visibility = nodes.length ? "visible" : "hidden";
  return `<g data-ts-key="focus-guide-layer:${placement}" class="ts-chart__focus-guide-layer ts-chart__focus-guide-layer--${placement}" data-ts-focus-layer="${placement}" data-ts-focus-guide-layer="${placement}" aria-hidden="true" visibility="${visibility}">${renderSceneNodes(nodes, idPrefix, focusGuideRenderHooks)}</g>`;
}
const focusGuideRenderHooks = {
  renderGroup: renderFocusGuideClip
};
function renderNode(node, hooks, idPrefix) {
  const common = renderCommon(node, hooks, idPrefix);
  switch (node.kind) {
    case "group": {
      const transform = node.translateX === void 0 && node.translateY === void 0 ? "" : ` transform="translate(${number$2(node.translateX ?? 0)} ${number$2(node.translateY ?? 0)})"`;
      const extension = hooks?.renderGroup?.(node, idPrefix);
      const focus = node.focus ? ` data-ts-focus-layer="${node.focus.placement}"${node.focus.retarget ? ' data-ts-focus-retarget="true"' : ""} visibility="hidden"` : "";
      return `<g${common}${transform}${focus}${extension?.attributes ?? ""}>${extension?.content ?? ""}${node.children.map((child) => renderNode(child, hooks, idPrefix)).join("")}</g>`;
    }
    case "rule":
      return `<line${common} x1="${number$2(node.x1)}" y1="${number$2(node.y1)}" x2="${number$2(node.x2)}" y2="${number$2(node.y2)}"/>`;
    case "polyline": {
      const path = node.path ?? node.points.map(
        ([x, y], index) => `${index === 0 ? "M" : "L"}${number$2(x)},${number$2(y)}`
      ).join("");
      return `<path${common} d="${path}" vector-effect="non-scaling-stroke"/>`;
    }
    case "area": {
      const path = node.polygons !== void 0 ? polygonsPath(node.polygons) : node.path ?? pointsPath(node.points);
      const fillRule = node.polygons === void 0 ? "" : ' fill-rule="evenodd"';
      return `<path${common} d="${path}"${fillRule} vector-effect="non-scaling-stroke"/>`;
    }
    case "dot":
      return `<circle${common} cx="${number$2(node.x)}" cy="${number$2(node.y)}" r="${number$2(node.radius)}"/>`;
    case "rect":
      return `<rect${common} x="${number$2(node.x)}" y="${number$2(node.y)}" width="${number$2(node.width)}" height="${number$2(node.height)}"${node.radius === void 0 ? "" : ` rx="${number$2(node.radius)}"`}/>`;
    case "label": {
      const transform = node.rotate === void 0 ? "" : ` transform="rotate(${number$2(node.rotate)} ${number$2(node.x)} ${number$2(node.y)})"`;
      const anchor = node.anchor ? ` text-anchor="${node.anchor}"` : "";
      const baseline = node.baseline ? ` dominant-baseline="${node.baseline}"` : "";
      const fontSize = node.fontSize === void 0 ? "" : ` font-size="${number$2(node.fontSize)}"`;
      const fontWeight = node.fontWeight === void 0 ? "" : ` font-weight="${number$2(node.fontWeight)}"`;
      return `<text${common} x="${number$2(node.x)}" y="${number$2(node.y)}"${anchor}${baseline}${transform}${fontSize}${fontWeight} font-family="inherit">${escapeText(node.text)}</text>`;
    }
  }
}
function polygonsPath(polygons) {
  return polygons.flatMap((polygon) => polygon).filter((ring) => ring.length > 0).map((ring) => pointsPath(ring)).join("");
}
function pointsPath(points, close) {
  return `${points.map(
    ([x, y], index) => `${index === 0 ? "M" : "L"}${number$2(x)},${number$2(y)}`
  ).join("")}${"Z"}`;
}
function renderFocusGuideClip(node, idPrefix) {
  if (!node.clip) return void 0;
  const prefix = idPrefix.replaceAll(/[^a-zA-Z0-9_-]/g, "");
  const id = `${prefix ? `${prefix}-` : ""}ts-chart-clip-${stableId$1(node.key)}`;
  return {
    attributes: ` clip-path="url(#${id})"`,
    content: `<defs data-ts-key="${escapeAttribute$1(`${node.key}:clip-defs`)}"><clipPath id="${id}"><rect x="${number$2(node.clip.x)}" y="${number$2(node.clip.y)}" width="${number$2(node.clip.width)}" height="${number$2(node.clip.height)}"/></clipPath></defs>`
  };
}
function stableId$1(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 16777619);
  }
  return (hash >>> 0).toString(36);
}
function renderCommon(node, hooks, idPrefix) {
  const key = ` data-ts-key="${escapeAttribute$1(node.key)}"`;
  const className = node.className ? ` class="${escapeAttribute$1(node.className)}"` : "";
  const ariaHidden = node.ariaHidden ? ' aria-hidden="true"' : "";
  return `${key}${className}${ariaHidden}${renderStyle(node.style, hooks, idPrefix)}`;
}
function renderStyle(style, hooks, idPrefix) {
  if (!style) return "";
  const paint = (value) => value && hooks?.resolvePaint ? hooks.resolvePaint(value, idPrefix) : value;
  const attributes = [
    ["fill", paint(style.fill)],
    ["fill-opacity", style.fillOpacity],
    ["stroke", paint(style.stroke)],
    ["stroke-opacity", style.strokeOpacity],
    ["stroke-width", style.strokeWidth],
    ["opacity", style.opacity],
    ["stroke-linecap", style.lineCap],
    ["stroke-linejoin", style.lineJoin],
    ["stroke-dasharray", style.strokeDasharray]
  ];
  return attributes.filter((entry) => entry[1] != null).map(
    ([name, value]) => ` ${name}="${typeof value === "number" ? number$2(value) : escapeAttribute$1(value)}"`
  ).join("");
}
function number$2(value) {
  return String(Math.round(value * 100) / 100);
}
function escapeText(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
function escapeAttribute$1(value) {
  return escapeText(value).replaceAll('"', "&quot;");
}
function renderChartSvg(scene, options) {
  const gradientIds = new Set(scene.gradients.map((gradient) => gradient.id));
  return renderChartSvgWithHooks(scene, options, {
    renderDefinitions: (currentScene, idPrefix) => renderGradients(currentScene, sanitizeId(idPrefix)),
    renderGroup: (group, idPrefix) => renderClip(group, sanitizeId(idPrefix)),
    resolvePaint: (value, idPrefix) => {
      const match = /^url\(#([^)]+)\)$/.exec(value);
      const id = match?.[1];
      return id && gradientIds.has(id) ? `url(#${scopedId(sanitizeId(idPrefix), id)})` : value;
    }
  });
}
function renderGradients(scene, idPrefix) {
  if (!scene.gradients.length) return "";
  return `<defs data-ts-key="gradients">${scene.gradients.map(
    (gradient) => `<linearGradient data-ts-key="gradient:${escapeAttribute(gradient.id)}" id="${escapeAttribute(scopedId(idPrefix, gradient.id))}" x1="${percent(gradient.x1 ?? 0)}" y1="${percent(gradient.y1 ?? 1)}" x2="${percent(gradient.x2 ?? 0)}" y2="${percent(gradient.y2 ?? 0)}">${gradient.stops.map(
      (stop, index) => `<stop data-ts-key="gradient:${escapeAttribute(gradient.id)}:stop:${index}" offset="${percent(stop.offset)}" stop-color="${escapeAttribute(stop.color)}"${stop.opacity === void 0 ? "" : ` stop-opacity="${number$1(stop.opacity)}"`}/>`
    ).join("")}</linearGradient>`
  ).join("")}</defs>`;
}
function renderClip(group, idPrefix) {
  if (!group.clip) return void 0;
  const id = scopedId(idPrefix, `ts-chart-clip-${stableId(group.key)}`);
  return {
    attributes: ` clip-path="url(#${id})"`,
    content: `<defs data-ts-key="${escapeAttribute(`${group.key}:clip-defs`)}"><clipPath id="${id}"><rect x="${number$1(group.clip.x)}" y="${number$1(group.clip.y)}" width="${number$1(group.clip.width)}" height="${number$1(group.clip.height)}"/></clipPath></defs>`
  };
}
function scopedId(prefix, id) {
  return prefix ? `${prefix}-${id}` : id;
}
function sanitizeId(value) {
  return value.replaceAll(/[^a-zA-Z0-9_-]/g, "");
}
function percent(value) {
  return `${number$1(Math.max(0, Math.min(1, value)) * 100)}%`;
}
function stableId(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 16777619);
  }
  return (hash >>> 0).toString(36);
}
function number$1(value) {
  return String(Math.round(value * 100) / 100);
}
function escapeAttribute(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function createScenePointLookup(points) {
  const keys = /* @__PURE__ */ new Map();
  const marks = /* @__PURE__ */ new Map();
  const append = (map, key, point) => {
    const related = map.get(key);
    if (related) related.push(point);
    else map.set(key, [point]);
  };
  for (const point of points) {
    append(marks, point.markId, point);
    let end = point.key.length;
    while (end > 0) {
      append(keys, point.key.slice(0, end), point);
      end = point.key.lastIndexOf(":", end - 1);
    }
  }
  return { points, keys, marks };
}
function sceneNodeOwnedPoints(node, scope, lookup, fallback = scope) {
  if (node.kind === "group") {
    const index = node.focusCandidateIndex;
    if (index !== void 0 && Number.isInteger(index) && index >= 0) {
      const point = scope[index];
      if (point) return [point];
    }
  }
  if (node.pointOwner) {
    const owned = pointCandidates(node.pointOwner, scope);
    if (owned.length) return owned;
  }
  if ("interaction" in node && node.interaction) {
    const candidates = node.interaction.point ? [node.interaction.point] : node.interaction.points;
    const owned = candidates.flatMap(
      (candidate) => pointCandidates(candidate, scope)
    );
    if (owned.length) return owned;
  }
  return sceneKeyOwnedPoints(node.key, scope, lookup, fallback);
}
function sceneKeyOwnedPoints(key, scope, lookup, fallback = scope) {
  const withinScope = (candidates) => candidates === void 0 ? [] : scope === lookup.points ? candidates : candidates.filter((point) => scope.includes(point));
  const related = withinScope(lookup.keys.get(key));
  const exact = related.filter((point) => point.key === key);
  if (exact.length) return exact;
  let candidate = key;
  while (candidate.includes(":")) {
    const separator = candidate.lastIndexOf(":");
    candidate = candidate.slice(0, separator);
    const fragments = withinScope(lookup.keys.get(candidate)).filter(
      (point) => point.key === candidate
    );
    if (fragments.length) return fragments;
  }
  if (related.length) return related;
  const mark = withinScope(lookup.marks.get(key));
  if (mark.length) return mark;
  return fallback;
}
function pointCandidates(owner, scope) {
  const identical = scope.filter((point) => point === owner);
  if (identical.length) return identical;
  const keyed = scope.filter((point) => point.key === owner.key);
  if (keyed.length) return keyed;
  const semantic = scope.filter(
    (point) => Object.is(point.datum, owner.datum) && (isReference$1(owner.datum) || point.datumIndex === owner.datumIndex)
  );
  return semantic.length === 1 ? semantic : [];
}
function isReference$1(value) {
  return typeof value === "object" && value !== null || typeof value === "function";
}
const emptyPoints$1 = [];
function resolveFocusGuides(scene, focus, pointer, cursor) {
  const under = [];
  const over = [];
  if (!cursor && !focus) return { under, over };
  for (const guide of scene.focusGuides ?? []) {
    const localFocus = focus && guideOwnsFocus(guide, focus) ? focus : null;
    if (!cursor && focus && !localFocus) continue;
    const node = guide.resolve({
      scene,
      guide,
      focus: localFocus,
      pointer,
      cursor
    });
    if (!node) continue;
    (guide.placement === "under" ? under : over).push(node);
  }
  return { under, over };
}
function resolveFocusScene(scene, focus) {
  if (!focus) return { scene, retargeted: false };
  let retargeted = false;
  const visit = (nodes2) => nodes2.map((node) => {
    if (node.kind !== "group") return node;
    if (node.focus?.retarget) {
      const points = node.focus.points.filter(
        (point) => matchesFocusAnchor(point, focus, node.focus.match)
      );
      const lookup = createScenePointLookup(node.focus.points);
      const selected = stabilizeSelectedNodes(
        filterNodesWithLookup(
          node.focus.candidates ?? node.children,
          points,
          node.focus.points,
          lookup
        ),
        points,
        node.focus.points,
        lookup,
        node.key
      );
      if (!selected.length) return node;
      retargeted = true;
      return {
        ...node,
        focus: { ...node.focus, activePoints: points },
        children: selected
      };
    }
    const children = visit(node.children);
    return children.some((child, index) => child !== node.children[index]) ? { ...node, children } : node;
  });
  const nodes = visit(scene.nodes);
  return retargeted ? { scene: { ...scene, nodes }, retargeted } : { scene, retargeted };
}
function focusedNodeKeys(layer, focus) {
  if (!layer.focus || !focus) return /* @__PURE__ */ new Set();
  const keys = /* @__PURE__ */ new Set();
  visitNodes(selectedFocusChildren(layer, focus), (node) => keys.add(node.key));
  return keys;
}
function selectedFocusChildren(layer, focus) {
  const state = layer.focus;
  if (state.retarget) return layer.children;
  if (state.anchors) {
    const anchors = state.anchors.filter(
      (anchor) => matchesFocusAnchor(anchor, focus, state.match)
    );
    return filterNodesByAnchors(layer.children, anchors);
  }
  const points = state.points.filter(
    (point) => matchesFocusAnchor(point, focus, state.match)
  );
  return filterNodes(layer.children, points, state.points);
}
function filterNodes(nodes, selectedPoints, candidatePoints) {
  return filterNodesWithLookup(
    nodes,
    selectedPoints,
    candidatePoints,
    createScenePointLookup(candidatePoints)
  );
}
function filterNodesByAnchors(nodes, anchors) {
  const output = [];
  for (const node of nodes) {
    if (node.kind !== "group") {
      if (anchors.some((anchor) => keysRelate(node.key, anchor.key))) {
        output.push(node);
      }
      continue;
    }
    const children = filterNodesByAnchors(node.children, anchors);
    if (children.length) {
      output.push({ ...node, children });
    } else if (anchors.some((anchor) => anchor.key.startsWith(`${node.key}:`))) {
      output.push(node);
    }
  }
  return output;
}
function filterNodesWithLookup(nodes, selectedPoints, candidatePoints, lookup) {
  const output = [];
  for (const node of nodes) {
    if (node.kind !== "group") {
      if (sceneNodeOwnedPoints(node, candidatePoints, lookup, emptyPoints$1).some(
        (point) => selectedPoints.includes(point)
      )) {
        output.push(node);
      }
      continue;
    }
    const structuralPoint = focusCandidatePoint(node, candidatePoints);
    if (structuralPoint) {
      if (selectedPoints.includes(structuralPoint)) output.push(node);
      continue;
    }
    const atomicPoints = atomicGroupPoints(node, candidatePoints, lookup);
    if (atomicPoints.length) {
      if (atomicPoints.some((point) => selectedPoints.includes(point))) {
        output.push(node);
      }
      continue;
    }
    const structuralPoints = sceneNodeOwnedPoints(
      node,
      candidatePoints,
      lookup,
      emptyPoints$1
    );
    const childPoints = structuralPoints.length ? structuralPoints : candidatePoints;
    const children = filterNodesWithLookup(
      node.children,
      selectedPoints,
      childPoints,
      lookup
    );
    if (children.length) {
      output.push({ ...node, children });
    }
  }
  return output;
}
function stabilizeSelectedNodes(nodes, points, candidatePoints, lookup, layerKey) {
  const slots = new Map(points.map((point, index) => [point, index]));
  const visit = (node, path) => {
    const related = sceneNodeOwnedPoints(
      node,
      candidatePoints,
      lookup,
      emptyPoints$1
    ).filter((point2) => slots.has(point2));
    const point = related.length === 1 ? related[0] : void 0;
    let key = node.key;
    if (point && node.key !== point.markId) {
      const slot = `${layerKey}:selection:${slots.get(point) ?? 0}`;
      if (node.key === point.key) key = slot;
      else if (node.key.startsWith(`${point.key}:`)) {
        key = `${slot}${node.key.slice(point.key.length)}`;
      } else if (point.key.startsWith(`${node.key}:`)) {
        key = `${slot}:ancestor:${path}`;
      } else {
        key = `${slot}:node:${path}`;
      }
    }
    return node.kind === "group" ? {
      ...node,
      key,
      children: node.children.map(
        (child, index) => visit(child, `${path}:${index}`)
      )
    } : { ...node, key };
  };
  return nodes.map((node, index) => visit(node, String(index)));
}
function atomicGroupPoints(node, candidatePoints, lookup) {
  const candidate = focusCandidatePoint(node, candidatePoints);
  if (candidate) return [candidate];
  if (node.pointOwner) {
    const owned = sceneNodeOwnedPoints(
      node,
      candidatePoints,
      lookup,
      emptyPoints$1
    );
    if (owned.length) return owned;
  }
  const exact = lookup.keys.get(node.key)?.filter((point) => point.key === node.key);
  return exact === void 0 ? emptyPoints$1 : exact.filter((point) => candidatePoints.includes(point));
}
function focusCandidatePoint(node, candidatePoints) {
  const index = node.focusCandidateIndex;
  if (index === void 0 || !Number.isInteger(index) || index < 0) {
    return void 0;
  }
  return candidatePoints[index];
}
function matchesFocusAnchor(candidate, focus, match) {
  if (match === "x") {
    return candidate.xValue !== void 0 && sameValue(candidate.xValue, focus.primary.xValue);
  }
  if (match === "y") {
    return candidate.yValue !== void 0 && sameValue(candidate.yValue, focus.primary.yValue);
  }
  if (match === "series") {
    return sameValue(candidate.group, focus.primary.group);
  }
  if (match === "key") {
    return candidate.key === focus.primary.key || candidate.datum === focus.primary.datum;
  }
  if (match === "group") {
    return focus.group.some((point) => sameFocusedPoint(candidate, point));
  }
  return sameFocusedPoint(candidate, focus.primary);
}
function sameFocusedPoint(left, right) {
  if (left === right || left.key === right.key) return true;
  if (!Object.is(left.datum, right.datum)) return false;
  return isReference(left.datum) || left.datumIndex === right.datumIndex;
}
function keysRelate(left, right) {
  return left === right || left.startsWith(`${right}:`) || right.startsWith(`${left}:`);
}
function sameValue(left, right) {
  return valueKey(left) === valueKey(right);
}
function isReference(value) {
  return typeof value === "object" && value !== null || typeof value === "function";
}
function visitNodes(nodes, visit) {
  for (const node of nodes) {
    visit(node);
    if (node.kind === "group") visitNodes(node.children, visit);
  }
}
function guideOwnsFocus(guide, focus) {
  return guide.scope === void 0 || focus.primary.key === guide.scope || focus.primary.key.startsWith(`${guide.scope}:`);
}
function renderFocusGuideLayerWithRenderer(svg, scene, nodes, placement, options, renderSvg) {
  const document = svg.ownerDocument;
  const key = `focus-guide-layer:${placement}`;
  const wrapper = {
    kind: "group",
    key,
    className: `ts-chart__focus-guide-layer ts-chart__focus-guide-layer--${placement}`,
    ariaHidden: true,
    children: nodes
  };
  const markup = renderSvg(
    {
      ...scene,
      nodes: [wrapper],
      focusGuides: void 0
    },
    options
  );
  const root = parseSvgMarkup(document, markup);
  const layer = root ? keyedElement(root, key) : void 0;
  if (!root || !layer || layer.localName !== "g") {
    throw new Error(
      `The SVG renderer must preserve a g[data-ts-key="${key}"] element when serializing focus guides.`
    );
  }
  layer.classList.add(
    "ts-chart__focus-guide-layer",
    `ts-chart__focus-guide-layer--${placement}`
  );
  layer.setAttribute("data-ts-focus-layer", placement);
  layer.setAttribute("data-ts-focus-guide-layer", placement);
  layer.setAttribute("aria-hidden", "true");
  layer.setAttribute("visibility", nodes.length ? "visible" : "hidden");
  mergeFocusGuideClipFallback(
    document,
    layer,
    nodes,
    placement,
    options.idPrefix ?? ""
  );
  copyMissingRendererDefinitions(svg, root, layer, key);
  return layer.outerHTML;
}
function mergeFocusGuideClipFallback(document, layer, nodes, placement, idPrefix) {
  const fallback = parseSvgFragment(
    document,
    renderFocusGuideLayer(nodes, placement, idPrefix)
  );
  if (!fallback) return;
  for (const source of keyedElements(fallback)) {
    const clipPath = source.getAttribute("clip-path");
    const key = source.getAttribute("data-ts-key");
    if (!clipPath || !key) continue;
    const target = keyedElement(layer, key);
    if (!target || target.hasAttribute("clip-path")) continue;
    target.setAttribute("clip-path", clipPath);
    const clipDefinition = keyedElement(fallback, `${key}:clip-defs`);
    if (clipDefinition) {
      target.insertBefore(clipDefinition.cloneNode(true), target.firstChild);
    }
  }
}
function copyMissingRendererDefinitions(svg, renderedRoot, layer, layerKey) {
  const pending = [...referencedIds(layer)];
  const visited = /* @__PURE__ */ new Set();
  let definitions;
  while (pending.length) {
    const id = pending.shift();
    if (!id || visited.has(id)) continue;
    visited.add(id);
    if (elementWithId(layer, id) || baseElementWithId(svg, id)) continue;
    const source = elementWithId(renderedRoot, id);
    if (!source) continue;
    if (!definitions) {
      definitions = svg.ownerDocument.createElementNS(
        "http://www.w3.org/2000/svg",
        "defs"
      );
      definitions.setAttribute("data-ts-key", `${layerKey}:renderer-defs`);
      layer.insertBefore(definitions, layer.firstChild);
    }
    const clone = source.cloneNode(true);
    definitions.append(clone);
    pending.push(...referencedIds(clone));
  }
}
function baseElementWithId(svg, id) {
  const element = elementWithId(svg, id);
  return element?.closest("[data-ts-focus-guide-layer]") ? void 0 : element;
}
function referencedIds(root) {
  const ids = /* @__PURE__ */ new Set();
  for (const element of [root, ...root.querySelectorAll("*")]) {
    for (const attribute of element.attributes) {
      for (const match of attribute.value.matchAll(/url\(#([^)]+)\)/g)) {
        if (match[1]) ids.add(match[1]);
      }
      if ((attribute.localName === "href" || attribute.name === "xlink:href") && attribute.value.startsWith("#")) {
        ids.add(attribute.value.slice(1));
      }
    }
  }
  return ids;
}
function elementWithId(root, id) {
  return [
    ...root.getAttribute("id") === id ? [root] : [],
    ...root.querySelectorAll("[id]")
  ].find((element) => element.getAttribute("id") === id);
}
function parseSvgMarkup(document, markup) {
  const template = document.createElement("template");
  template.innerHTML = markup.trim();
  const root = template.content.firstElementChild;
  return root?.localName === "svg" ? root : void 0;
}
function parseSvgFragment(document, markup) {
  const template = document.createElement("template");
  template.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${markup}</svg>`;
  return template.content.firstElementChild?.firstElementChild ?? void 0;
}
function keyedElement(root, key) {
  return keyedElements(root).find(
    (element) => element.getAttribute("data-ts-key") === key
  );
}
function keyedElements(root) {
  return [
    ...root.hasAttribute("data-ts-key") ? [root] : [],
    ...root.querySelectorAll("[data-ts-key]")
  ];
}
function detachSvgFocusGuideLayers(svg) {
  const layers = {};
  if (!svg) return layers;
  for (const placement of ["under", "over"]) {
    const layer = findSvgFocusGuideLayer(svg, placement);
    if (!layer) continue;
    layers[placement] = layer;
    layer.remove();
  }
  return layers;
}
function restoreSvgFocusGuideLayers(svg, layers, include = () => true) {
  for (const placement of ["under", "over"]) {
    const layer = layers[placement];
    if (layer && include(placement)) {
      placeSvgFocusGuideLayer(svg, layer, placement);
    }
  }
}
function ensureSvgFocusGuideLayer(svg, placement) {
  const existing = findSvgFocusGuideLayer(svg, placement);
  if (existing) return existing;
  const layer = svg.ownerDocument.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
  layer.dataset.tsKey = `focus-guide-layer:${placement}`;
  layer.dataset.tsFocusLayer = placement;
  layer.dataset.tsFocusGuideLayer = placement;
  layer.setAttribute(
    "class",
    `ts-chart__focus-guide-layer ts-chart__focus-guide-layer--${placement}`
  );
  layer.setAttribute("aria-hidden", "true");
  layer.setAttribute("visibility", "hidden");
  placeSvgFocusGuideLayer(svg, layer, placement);
  return layer;
}
function removeSvgFocusGuideLayer(svg, placement) {
  findSvgFocusGuideLayer(svg, placement)?.remove();
}
function placeSvgFocusGuideLayer(svg, layer, placement) {
  if (placement === "under") {
    const scene = [...svg.children].find(
      (child) => child.getAttribute("data-ts-key") === "grid" || child.getAttribute("data-ts-key") === "marks" || child.classList.contains("ts-chart__grid") || child.classList.contains("ts-chart__marks")
    );
    svg.insertBefore(layer, scene ?? null);
  } else {
    svg.append(layer);
  }
}
function findSvgFocusGuideLayer(svg, placement) {
  return [...svg.children].find(
    (child) => child.localName === "g" && child.getAttribute("data-ts-focus-guide-layer") === placement
  );
}
function resolveMarkStateScene(scene, focus, pointer = null) {
  if (!focus || !sceneHasMarkStates(scene.nodes)) return { scene };
  let transition;
  const transitions = {};
  const visit = (nodes2, inheritedPoints, definitions, data, inheritedLookup) => nodes2.map((node) => {
    const state = node.kind === "group" ? node.states : void 0;
    const points = state?.points ?? inheritedPoints;
    const nodeDefinitions = state?.definitions ?? definitions;
    const nodeData = state?.data ?? data;
    const lookup = state ? createScenePointLookup(state.points) : inheritedLookup;
    const candidates = points ? lookup ? sceneNodeOwnedPoints(node, points, lookup) : points : emptyPoints;
    const resolved = node.kind !== "group" && nodeDefinitions && nodeData && candidates.length ? resolveNodeState(
      node,
      candidates,
      nodeData,
      nodeDefinitions,
      focus,
      pointer
    ) : { node };
    if (resolved.transition) {
      transition = mergeTransition(transition, resolved.transition);
      for (const point of candidates) {
        transitions[point.markId] = mergeTransition(
          transitions[point.markId],
          resolved.transition
        );
      }
    }
    const next = resolved.node;
    return next.kind === "group" ? {
      ...next,
      children: visit(
        next.children,
        candidates.length ? candidates : points,
        nodeDefinitions,
        nodeData,
        lookup
      )
    } : next;
  });
  const nodes = visit(scene.nodes);
  return {
    scene: { ...scene, nodes },
    transition,
    ...Object.keys(transitions).length ? { transitions } : {}
  };
}
function sceneHasMarkStates(nodes) {
  return nodes.some(
    (node) => node.kind === "group" && (node.states !== void 0 || sceneHasMarkStates(node.children))
  );
}
function resolveNodeState(node, candidates, data, definitions, focus, pointer) {
  let output = node;
  let transition;
  for (const definition of definitions) {
    const context = matchingContext(
      candidates,
      data,
      definition,
      focus,
      pointer
    );
    if (!context) continue;
    output = applyStateStyle(output, definition.style, context);
    if (definition.transition) {
      transition = mergeTransition(transition, definition.transition);
    }
  }
  return { node: output, transition };
}
function matchingContext(candidates, data, definition, focus, pointer) {
  if (typeof definition.when !== "function" && definition.when.focus === "unmatched" && candidates.some((point) => matchesFocusAnchor(point, focus, "group"))) {
    return void 0;
  }
  for (const point of candidates) {
    const context = {
      datum: point.datum,
      index: point.datumIndex,
      data,
      point,
      focus,
      pointer,
      matches: (match) => matchesFocusAnchor(point, focus, match)
    };
    const matches = typeof definition.when === "function" ? definition.when(context) : matchesSelector(definition.when, context);
    if (matches) return context;
  }
  return void 0;
}
function matchesSelector(selector, context) {
  const source = selector.source;
  if (source !== void 0 && !(Array.isArray(source) ? source.includes(context.focus.source) : source === context.focus.source)) {
    return false;
  }
  if (selector.pinned !== void 0 && selector.pinned !== context.focus.pinned) {
    return false;
  }
  return selector.focus === "unmatched" ? !context.matches("group") : context.matches(selector.focus);
}
function applyStateStyle(node, definition, context) {
  const style = { ...node.style };
  for (const property of styleProperties) {
    const value = resolveValue(definition[property], context);
    if (value !== void 0)
      style[property] = value;
  }
  let output = { ...node, style };
  const dx = resolveValue(definition.dx, context) ?? 0;
  const dy = resolveValue(definition.dy, context) ?? 0;
  const r = resolveValue(definition.r, context);
  const radius = resolveValue(definition.radius, context);
  const inset = resolveValue(definition.inset, context);
  const fontSize = resolveValue(definition.fontSize, context);
  const fontWeight = resolveValue(definition.fontWeight, context);
  const rotate = resolveValue(definition.rotate, context);
  switch (output.kind) {
    case "dot":
      output = {
        ...output,
        x: output.x + dx,
        y: output.y + dy,
        radius: r ?? output.radius
      };
      break;
    case "rect": {
      const currentInset = output.inset ?? 0;
      let nextInset = Math.max(0, inset ?? currentInset);
      if (Number.isFinite(output.maxThickness) && (output.insetAxis === "x" || output.insetAxis === "y")) {
        const currentThickness = output.insetAxis === "x" ? output.width : output.height;
        const bandThickness = currentThickness + currentInset * 2;
        const requestedThickness = Math.max(0, bandThickness - nextInset * 2);
        const cappedThickness = Math.min(
          requestedThickness,
          Math.max(0, output.maxThickness)
        );
        nextInset = (bandThickness - cappedThickness) / 2;
      }
      const amount = nextInset - currentInset;
      const insetX = output.insetAxis !== "y" ? amount : 0;
      const insetY = output.insetAxis !== "x" ? amount : 0;
      output = {
        ...output,
        x: output.x + insetX + dx,
        y: output.y + insetY + dy,
        width: Math.max(0, output.width - insetX * 2),
        height: Math.max(0, output.height - insetY * 2),
        radius: radius ?? output.radius,
        inset: nextInset
      };
      break;
    }
    case "label":
      output = {
        ...output,
        x: output.x + dx,
        y: output.y + dy,
        fontSize: fontSize ?? output.fontSize,
        fontWeight: fontWeight ?? output.fontWeight,
        rotate: rotate ?? output.rotate
      };
      break;
  }
  return output;
}
const styleProperties = [
  "fill",
  "fillOpacity",
  "stroke",
  "strokeOpacity",
  "strokeWidth",
  "opacity",
  "strokeDasharray"
];
function resolveValue(value, context) {
  return typeof value === "function" ? value(context) : value;
}
const emptyPoints = [];
function mergeTransition(current, next) {
  if (!current || current.type !== next.type) return next;
  if (current.type === "spring" && next.type === "spring") {
    return { ...current, ...next };
  }
  if (current.type !== "tween" || next.type !== "tween") return next;
  return {
    ...current,
    ...next,
    duration: Math.max(current.duration ?? 250, next.duration ?? 250)
  };
}
function resolveMarkStateTransition(transition, element) {
  if (!transition || transition.type !== "tween") return void 0;
  if ((transition.respectReducedMotion ?? true) && element.ownerDocument.defaultView?.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  ).matches) {
    return void 0;
  }
  const { type: _type, ...resolved } = transition;
  return resolved;
}
function svgClientToScene(element, scene, clientX, clientY) {
  const matrix = element.getScreenCTM?.();
  if (!matrix) {
    const bounds = element.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return null;
    return {
      x: (clientX - bounds.left) / bounds.width * scene.width,
      y: (clientY - bounds.top) / bounds.height * scene.height
    };
  }
  let inverse;
  try {
    inverse = matrix.inverse();
  } catch {
    return null;
  }
  const x = inverse.a * clientX + inverse.c * clientY + inverse.e;
  const y = inverse.b * clientX + inverse.d * clientY + inverse.f;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { x, y };
}
function createSvgChartRenderer(renderSvg = renderChartSvg) {
  const renderer = {
    id: "svg",
    prerender: renderSvg,
    mount(container) {
      let cancelAnimation = () => {
      };
      let cancelFocusAnimation = () => {
      };
      let scene;
      let renderOptions;
      let stateTransition;
      let markStatePainted = false;
      let retargetedFocus = false;
      const svgElement = () => {
        const svg = container.querySelector("svg.ts-chart");
        if (!svg) {
          throw new Error(
            "The SVG renderer must produce an svg.ts-chart root element."
          );
        }
        return svg;
      };
      const surface = {
        renderer,
        get element() {
          return svgElement();
        },
        render(nextScene, options) {
          const viewportMoved = Boolean(
            scene && viewportTranslationChanged(scene, nextScene)
          );
          cancelAnimation();
          cancelFocusAnimation();
          cancelFocusAnimation = () => {
          };
          const retainsFocusGuideLayers = Boolean(scene?.focusGuides?.length);
          const focusGuideLayers = retainsFocusGuideLayers ? detachSvgFocusGuideLayers(svgElement()) : {};
          cancelAnimation = reconcileChartSvg(
            container,
            renderSvg(nextScene, options),
            viewportMoved ? void 0 : options.animation
          );
          if (retainsFocusGuideLayers) {
            restoreSvgFocusGuideLayers(
              svgElement(),
              focusGuideLayers,
              (placement) => nextScene.focusGuides?.some(
                (guide) => guide.placement === placement
              ) === true
            );
          }
          scene = nextScene;
          renderOptions = options;
          stateTransition = void 0;
          markStatePainted = false;
          retargetedFocus = false;
        },
        clientToScene(scene2, clientX, clientY) {
          return svgClientToScene(svgElement(), scene2, clientX, clientY);
        },
        paintFocus(focus, pointer, cursor) {
          if (!scene || !renderOptions) return;
          const state = resolveMarkStateScene(scene, focus, pointer);
          const resolved = resolveFocusScene(state.scene, focus);
          const previousTransition = stateTransition;
          if (resolved.scene !== scene || markStatePainted || retargetedFocus || previousTransition) {
            cancelFocusAnimation();
            cancelFocusAnimation = () => {
            };
            const focusGuideLayers = detachSvgFocusGuideLayers(svgElement());
            cancelAnimation();
            cancelAnimation = reconcileChartSvg(
              container,
              renderSvg(resolved.scene, renderOptions),
              resolveMarkStateTransition(
                state.transition ?? previousTransition,
                container
              )
            );
            restoreSvgFocusGuideLayers(svgElement(), focusGuideLayers);
          }
          retargetedFocus = resolved.retargeted;
          markStatePainted = Boolean(focus && state.scene !== scene);
          stateTransition = focus ? state.transition ?? previousTransition : void 0;
          paintSvgFocus(svgElement(), resolved.scene, focus);
          cancelFocusAnimation();
          cancelFocusAnimation = paintSvgFocusGuides(
            svgElement(),
            resolved.scene,
            focus,
            pointer,
            cursor,
            renderOptions,
            renderSvg
          );
          return resolved.scene;
        },
        destroy() {
          cancelAnimation();
          cancelFocusAnimation();
        }
      };
      return surface;
    }
  };
  return renderer;
}
function paintSvgFocus(svg, scene, focus) {
  const sceneLayers = collectFocusLayers(scene.nodes);
  const elements = svg.querySelectorAll(
    "[data-ts-focus-layer]:not([data-ts-focus-guide-layer])"
  );
  elements.forEach((element, index) => {
    const layer = sceneLayers[index];
    const visible = layer ? focusedNodeKeys(layer, focus) : /* @__PURE__ */ new Set();
    element.setAttribute(
      "visibility",
      focus && visible.size ? "visible" : "hidden"
    );
    element.querySelectorAll("[data-ts-key]").forEach((child) => {
      const key = child.dataset.tsKey;
      child.setAttribute(
        "visibility",
        key && visible.has(key) ? "visible" : "hidden"
      );
    });
  });
}
function paintSvgFocusGuides(svg, scene, focus, pointer, cursor, renderOptions, renderSvg) {
  const presentation = resolveFocusGuides(scene, focus, pointer, cursor);
  const cancellations = [];
  for (const placement of ["under", "over"]) {
    if (!scene.focusGuides?.some((guide) => guide.placement === placement)) {
      removeSvgFocusGuideLayer(svg, placement);
      continue;
    }
    const layer = ensureSvgFocusGuideLayer(svg, placement);
    const nodes = presentation[placement];
    if (!nodes.length) {
      layer.setAttribute("visibility", "hidden");
      continue;
    }
    const markup = renderSvg === renderChartSvg ? renderFocusGuideLayer(nodes, placement, renderOptions.idPrefix ?? "") : renderFocusGuideLayerWithRenderer(
      svg,
      scene,
      nodes,
      placement,
      renderOptions,
      renderSvg
    );
    cancellations.push(reconcileChartSvgFragment(layer, markup));
  }
  return () => cancellations.forEach((cancel) => cancel());
}
function collectFocusLayers(nodes) {
  const layers = [];
  for (const node of nodes) {
    if (node.kind !== "group") continue;
    if (node.focus) {
      layers.push(node);
    } else {
      layers.push(...collectFocusLayers(node.children));
    }
  }
  return layers;
}
function createChartRendererAdapter(initialOptions) {
  let runtime = createChartRuntime();
  let options = initialOptions;
  let host;
  const getRuntime = () => runtime ??= createChartRuntime();
  return {
    prerender() {
      const layout = resolveChartAdapterLayout(options);
      const scene = getRuntime().render(
        options.definition,
        {
          width: layout.initialWidth,
          height: layout.initialHeight
        },
        { measureText: options.measureText }
      );
      return options.renderer.prerender(scene, {
        ariaLabel: options.ariaLabel,
        ariaDescription: options.ariaDescription,
        className: options.className,
        tabIndex: resolveChartHostTabIndex(
          options.definition,
          options.tabIndex
        ),
        idPrefix: options.idPrefix
      });
    },
    mount(container) {
      if (host) {
        throw new Error("This chart adapter is already mounted.");
      }
      host = mountChartRenderer(container, options, getRuntime());
    },
    update(nextOptions) {
      options = nextOptions;
      host?.update(nextOptions);
    },
    getScene() {
      return host?.getScene();
    },
    destroy() {
      if (host) {
        host.destroy();
        host = void 0;
        runtime = void 0;
      } else if (runtime) {
        runtime.destroy();
        runtime = void 0;
      }
    }
  };
}
function barX(source, options = {}) {
  const data = Array.isArray(source) ? source : Array.from(source);
  return createMark(({ markIndex }) => {
    const id = options.id ?? `bar-x-${markIndex}`;
    const rawXValues = numericChannelValues(
      data,
      options.x ?? options.x2,
      (datum) => typeof datum === "number" ? datum : void 0
    );
    const yValues = channelValues(data, options.y, (_datum, { index }) => index);
    const zValues = channelValues(data, options.z, () => null);
    const colorValues = options.color === void 0 ? zValues : channelValues(data, options.color, () => null);
    const seriesValues = options.z === void 0 && options.color !== void 0 ? colorValues : zValues;
    const explicitExtent = options.x1 !== void 0 || options.x2 !== void 0;
    if (explicitExtent && options.layout?.type === "stack") {
      throw new TypeError(
        "A bar with explicit x1 or x2 endpoints cannot also configure a stack layout"
      );
    }
    const grouped = options.layout?.type === "group";
    const stackLayout = options.layout?.type === "stack" ? options.layout : {};
    const stacked = !explicitExtent && !grouped ? stackValues(yValues, rawXValues, seriesValues, stackLayout, "index") : void 0;
    const x1Values = explicitExtent ? numericChannelValues(data, options.x1, () => 0) : stacked?.starts ?? data.map(() => 0);
    const x2Values = explicitExtent ? numericChannelValues(data, options.x2 ?? options.x, () => void 0) : grouped ? rawXValues : stacked.ends;
    const duplicatePositions = hasDuplicateValues(yValues);
    const groupValues = grouped || !explicitExtent && duplicatePositions ? seriesValues : zValues;
    const keys = inferredKeyValues(data, options.key, {
      groups: groupValues,
      candidates: [yValues],
      markId: id,
      warningIdentity: options
    });
    return {
      id,
      states: markStates(data, options.states),
      seriesFromColor: options.z === void 0 && options.color !== void 0 && (grouped || duplicatePositions),
      channels: {
        x: {
          scale: "x",
          values: [
            ...x2Values.filter(isFiniteNumber$2),
            ...x1Values.filter(isFiniteNumber$2)
          ],
          includeZero: options.x1 === void 0
        },
        y: { scale: "y", values: yValues.filter(isChartValue$1) },
        color: {
          scale: "color",
          values: colorValues.filter(isChartKey$1)
        }
      },
      render: ({ scales, chart, color: resolveColor }) => {
        const totalBandwidth = scales.y.bandwidth || inferBandwidth(scales.y, yValues, chart.height, data.length);
        const groupScale = resolveGroupScale(
          options.layout?.type === "group" ? options.layout : void 0,
          groupValues,
          totalBandwidth
        );
        const groupBandwidth = groupScale?.bandwidth ?? totalBandwidth;
        const thickness = resolveBarThickness(
          groupBandwidth,
          options.inset,
          options.maxThickness
        );
        const nodes = [];
        data.forEach((datum, datumIndex) => {
          const xValue = rawXValues[datumIndex];
          const x1Value = x1Values[datumIndex];
          const x2Value = x2Values[datumIndex];
          const yValue = yValues[datumIndex];
          if (!isFiniteNumber$2(xValue) || !isFiniteNumber$2(x1Value) || !isFiniteNumber$2(x2Value) || !isChartValue$1(yValue))
            return;
          const group = groupValues[datumIndex] ?? null;
          const groupOffset = groupScale?.map(group) ?? 0;
          const resolvedColor = resolveColor(colorValues[datumIndex]);
          const fill = visualValue(
            options.fill,
            datum,
            datumIndex,
            data,
            resolvedColor
          );
          const stroke = visualValue(
            options.stroke,
            datum,
            datumIndex,
            data,
            "none"
          );
          const strokeDasharray = visualValue(
            options.strokeDasharray,
            datum,
            datumIndex,
            data,
            "none"
          );
          const baselinePosition = scales.x.map(x1Value);
          const valuePosition = scales.x.map(x2Value);
          const center = scales.y.map(yValue);
          const y = center - totalBandwidth / 2 + groupOffset + thickness.inset;
          const x = Math.min(baselinePosition, valuePosition);
          const width = Math.abs(baselinePosition - valuePosition);
          const height = thickness.size;
          const key = `${id}:${valueKey(group)}:${valueKey(keys[datumIndex])}`;
          const point = {
            key,
            markId: id,
            group,
            groupLabel: group == null ? id : String(group),
            datum,
            datumIndex,
            xValue,
            yValue,
            x1Value,
            x2Value,
            xInterval: "difference",
            x: valuePosition,
            y: center - totalBandwidth / 2 + groupOffset + groupBandwidth / 2,
            color: fill
          };
          nodes.push({
            kind: "rect",
            key,
            x,
            y,
            width,
            height,
            radius: options.radius,
            inset: thickness.inset,
            insetAxis: "y",
            ...thickness.maximum === void 0 ? {} : { maxThickness: thickness.maximum },
            interaction: { point, affinity: "y" },
            style: {
              fill,
              fillOpacity: options.fillOpacity,
              stroke,
              strokeOpacity: options.strokeOpacity,
              strokeWidth: options.strokeWidth,
              strokeDasharray
            }
          });
        });
        return {
          nodes: [
            {
              kind: "group",
              key: id,
              className: "ts-chart__bar ts-chart__bar-x",
              ariaHidden: true,
              children: nodes
            }
          ]
        };
      }
    };
  }, options.motion);
}
function resolveBarThickness(bandwidth, insetOption, maxThicknessOption) {
  const authoredInset = Math.max(0, insetOption ?? 0);
  const resolvedBandwidth = Math.max(0, bandwidth);
  const available = Math.max(0, resolvedBandwidth - authoredInset * 2);
  const constrained = Number.isFinite(maxThicknessOption);
  const maximum = constrained ? Math.max(0, maxThicknessOption) : available;
  const size = Math.min(available, maximum);
  return {
    inset: (resolvedBandwidth - size) / 2,
    maximum: constrained ? maximum : void 0,
    size
  };
}
function resolveGroupScale(source, values, bandwidth) {
  if (!source) return void 0;
  const scale = resolveScaleInput(
    source.scale ?? (() => band().padding(
      Number.isFinite(source.padding) ? Math.max(0, source.padding) : 0.1
    )),
    { values }
  );
  scale.range([0, bandwidth]);
  const groupBandwidth = scale.bandwidth?.();
  if (groupBandwidth === void 0) {
    throw new TypeError("A grouped bar layout requires a D3 band scale");
  }
  return {
    bandwidth: groupBandwidth,
    map(value) {
      if (value === null) {
        throw new TypeError(
          "A grouped bar requires an explicit z channel or a discrete color channel"
        );
      }
      const position = scale(value);
      if (position === void 0 || !Number.isFinite(position)) {
        throw new TypeError(
          `Bar group value "${String(value)}" is outside the group layout scale domain`
        );
      }
      return position;
    }
  };
}
function hasDuplicateValues(values) {
  const seen = /* @__PURE__ */ new Set();
  for (const value of values) {
    if (!isChartValue$1(value)) continue;
    const identity = valueKey(value);
    if (seen.has(identity)) return true;
    seen.add(identity);
  }
  return false;
}
function inferBandwidth(scale, values, span, count) {
  const positions = [
    ...new Set(
      values.filter(isChartValue$1).map(scale.map).filter((value) => Number.isFinite(value))
    )
  ].sort((a, b) => a - b);
  let minimum = Infinity;
  for (let index = 1; index < positions.length; index += 1) {
    minimum = Math.min(minimum, positions[index] - positions[index - 1]);
  }
  return Number.isFinite(minimum) ? minimum * 0.8 : Math.min(48, span / Math.max(2, count + 1) * 0.8);
}
function numericChannelValues(data, channel, fallback) {
  return typeof channel === "number" ? data.map(() => channel) : channelValues(data, channel, fallback);
}
function createMarkWithScaleValues(initialize, motion) {
  const normalizedInitialize = (context) => {
    const initialized = normalizeMarkInitialization(initialize(context));
    return motion === void 0 || initialized.motion !== void 0 ? initialized : { ...initialized, motion };
  };
  return motion === void 0 ? { initialize: normalizedInitialize } : { initialize: normalizedInitialize, motion };
}
function resolveCompositeMotion(definition, context) {
  return typeof definition === "function" ? definition(context) : definition;
}
function resolveCompositeChildMotion(parent, children, context) {
  let childId;
  for (const candidate of children.keys()) {
    if ((context.markId === candidate || context.markId?.startsWith(`${candidate}:`)) && (!childId || candidate.length > childId.length)) {
      childId = candidate;
    }
  }
  return mergeCompositeMotion(
    resolveCompositeMotion(parent, context),
    childId ? resolveCompositeMotion(children.get(childId), context) : void 0
  );
}
function mergeCompositeMotion(parent, child) {
  if (child === false) return false;
  if (child === void 0) return parent;
  if (parent === false || parent === void 0) return child;
  const path = child.path ?? parent.path;
  return {
    delay: child.delay ?? parent.delay,
    ...path === void 0 ? {} : { path },
    transition: mergeCompositeTransition(parent.transition, child.transition)
  };
}
function mergeCompositeTransition(parent, child) {
  if (!parent) return child;
  if (!child) return parent;
  return parent.type === child.type ? { ...parent, ...child } : child;
}
function toArray(source) {
  return Array.isArray(source) ? source : Array.from(source);
}
function transformValues(data, value) {
  if (typeof value === "function") {
    const accessor = value;
    return data.map((datum, index) => accessor(datum, { index, data }));
  }
  return data.map(
    (datum) => datum != null && typeof datum === "object" ? datum[value] : void 0
  );
}
function orderedIndexes(data, indexes, orderBy, order = "ascending") {
  if (orderBy === void 0) return [...indexes];
  const values = transformValues(data, orderBy);
  const direction = order === "descending" ? -1 : 1;
  return [...indexes].sort((left, right) => {
    const a = values[left];
    const b = values[right];
    const compared = compareChartValues(a, b);
    return compared === 0 ? left - right : compared * direction;
  });
}
function compareChartValues(left, right) {
  const a = left instanceof Date ? left.getTime() : left;
  const b = right instanceof Date ? right.getTime() : right;
  return a < b ? -1 : a > b ? 1 : 0;
}
function lineY(source, options = {}) {
  const data = Array.isArray(source) ? source : Array.from(source);
  return createLineMark(data, options, "line", () => {
    const xValues = channelValues(data, options.x, (_datum, { index }) => index);
    const yValues = channelValues(
      data,
      options.y,
      (datum) => typeof datum === "number" ? datum : void 0
    );
    return {
      xValues,
      yValues,
      isValidX: isChartValue$1,
      isValidY: isFiniteNumber$2,
      keyValues: xValues,
      affinity: "x"
    };
  });
}
function createLineMark(data, options, idPrefix, channels) {
  return createMark(({ markIndex }) => {
    const id = options.id ?? `${idPrefix}-${markIndex}`;
    const { xValues, yValues, isValidX, isValidY, keyValues, affinity } = channels();
    const zValues = channelValues(data, options.z, () => null);
    const colorValues = options.color === void 0 ? zValues : channelValues(data, options.color, () => null);
    const groupValues = options.z === void 0 && options.color !== void 0 ? colorValues : zValues;
    const keys = inferredKeyValues(data, options.key, {
      groups: groupValues,
      candidates: [keyValues],
      markId: id,
      warningIdentity: options
    });
    const rows = data.map((datum, datumIndex) => ({
      datum,
      datumIndex,
      xValue: xValues[datumIndex],
      yValue: yValues[datumIndex],
      groupValue: groupValues[datumIndex],
      datumKey: keys[datumIndex]
    }));
    return {
      id,
      states: markStates(data, options.states),
      seriesFromColor: options.z === void 0 && options.color !== void 0,
      channels: {
        x: {
          scale: "x",
          values: xValues.filter(isValidX)
        },
        y: {
          scale: "y",
          values: yValues.filter(isValidY)
        },
        color: {
          scale: "color",
          values: colorValues.filter(isChartKey$1)
        }
      },
      render: ({ scales, color: resolveColor }) => {
        const groups = groupRows(rows);
        const nodes = [];
        for (const [groupKey, groupRows2] of groups) {
          const firstRow = groupRows2[0];
          if (!firstRow) continue;
          const color = visualValue(
            options.stroke,
            firstRow.datum,
            firstRow.datumIndex,
            data,
            resolveColor(colorValues[firstRow.datumIndex] ?? null)
          );
          const children = [];
          let segment = [];
          let segmentPoints = [];
          let segmentIndex = 0;
          const flushSegment = () => {
            if (!segment.length) return;
            children.push({
              kind: "polyline",
              key: `${id}:${groupKey}:segment:${segmentIndex}`,
              points: segment,
              path: options.curve?.line(segment),
              interaction: {
                points: segmentPoints,
                affinity
              },
              style: {
                fill: "none",
                stroke: color,
                strokeOpacity: options.strokeOpacity,
                strokeWidth: options.strokeWidth ?? 2.25,
                strokeDasharray: options.strokeDasharray,
                lineCap: "round",
                lineJoin: "round"
              }
            });
            segment = [];
            segmentPoints = [];
            segmentIndex += 1;
          };
          for (const row of groupRows2) {
            if (!isValidX(row.xValue) || !isValidY(row.yValue)) {
              flushSegment();
              continue;
            }
            const x = scales.x.map(row.xValue);
            const y = scales.y.map(row.yValue);
            const point = {
              key: `${id}:${groupKey}:${valueKey(row.datumKey)}`,
              markId: id,
              group: row.groupValue ?? null,
              groupLabel: row.groupValue == null ? id : String(row.groupValue),
              datum: row.datum,
              datumIndex: row.datumIndex,
              xValue: row.xValue,
              yValue: row.yValue,
              x,
              y,
              color
            };
            segmentPoints.push(point);
            segment.push([x, y]);
            if (options.points) {
              children.push({
                kind: "dot",
                key: `${point.key}:dot`,
                x,
                y,
                radius: 2.5,
                pointOwner: point,
                style: { fill: color }
              });
            }
          }
          flushSegment();
          nodes.push({
            kind: "group",
            key: `${id}:${groupKey}`,
            className: "ts-chart__line",
            ariaHidden: true,
            children
          });
        }
        return { nodes };
      }
    };
  }, options.motion);
}
function groupRows(rows) {
  const groups = /* @__PURE__ */ new Map();
  for (const row of rows) {
    const key = valueKey(row.groupValue ?? null);
    const group = groups.get(key);
    if (group) group.push(row);
    else groups.set(key, [row]);
  }
  return groups;
}
function allocateProportionalIntervals(weights, options = {}) {
  const start = options.start ?? 0;
  const end = options.end ?? 1;
  const gap = options.gap ?? 0;
  assertFinite$1(start, "start");
  assertFinite$1(end, "end");
  assertNonnegativeFinite$1(gap, "gap");
  const span = end - start;
  if (!Number.isFinite(span)) {
    throw new TypeError("proportional intervals: extent span must be finite");
  }
  let positiveCount = 0;
  let unscaledTotal = 0;
  let maximum = 0;
  weights.forEach((weight, index) => {
    if (!Number.isFinite(weight) || weight < 0) {
      throw new TypeError(
        `proportional intervals: weight at index ${index} must be nonnegative and finite`
      );
    }
    if (weight > 0) positiveCount += 1;
    unscaledTotal += weight;
    maximum = Math.max(maximum, weight);
  });
  const valueScale = Number.isFinite(unscaledTotal) ? 1 : maximum;
  const total = valueScale === 1 ? unscaledTotal : weights.reduce((sum, weight) => sum + weight / valueScale, 0);
  const absoluteSpan = Math.abs(span);
  const gapCount = positiveCount === 0 ? 0 : Math.max(0, positiveCount - 1) + (options.gapAfterLast === true ? 1 : 0);
  const totalGap = gapCount * gap;
  if (!Number.isFinite(totalGap) || totalGap > absoluteSpan) {
    throw new TypeError(
      "proportional intervals: gap leaves insufficient extent"
    );
  }
  const drawableSpan = absoluteSpan - totalGap;
  if (positiveCount > 0 && drawableSpan <= 0) {
    throw new TypeError(
      "proportional intervals: positive weights require drawable extent"
    );
  }
  const direction = span < 0 ? -1 : 1;
  const intervals = [];
  let cursor = start;
  let remainingPositive = positiveCount;
  for (const weight of weights) {
    const fraction = total === 0 ? 0 : weight / valueScale / total;
    const intervalStart = cursor;
    let intervalEnd = cursor;
    if (weight > 0) {
      remainingPositive -= 1;
      intervalEnd = remainingPositive === 0 ? end - (options.gapAfterLast === true ? direction * gap : 0) : cursor + direction * drawableSpan * fraction;
      cursor = intervalEnd;
      if (remainingPositive > 0 || options.gapAfterLast === true) {
        cursor += direction * gap;
      }
    }
    intervals.push({ fraction, start: intervalStart, end: intervalEnd });
  }
  return intervals;
}
function assertFinite$1(value, name) {
  if (!Number.isFinite(value)) {
    throw new TypeError(`proportional intervals: ${name} must be finite`);
  }
}
function assertNonnegativeFinite$1(value, name) {
  if (!Number.isFinite(value) || value < 0) {
    throw new TypeError(
      `proportional intervals: ${name} must be nonnegative and finite`
    );
  }
}
const ChartSurface = reactExports.memo(
  reactExports.forwardRef(function ChartSurface2({ markup }, ref) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref,
        className: "ts-chart-surface",
        style: { width: "100%", height: "100%" },
        dangerouslySetInnerHTML: { __html: markup }
      }
    );
  }),
  () => true
);
function RendererChartImplementation(props) {
  const {
    ariaLabel,
    ariaDescription,
    height,
    aspectRatio,
    width,
    initialWidth = 640,
    className,
    style,
    tabIndex,
    idPrefix: idPrefixOption,
    renderer,
    measureText,
    onFocusChange,
    onFocusGroupChange,
    onSelect,
    onRender,
    onTooltipBodyChange
  } = props;
  const generatedId = reactExports.useId();
  const idPrefix = idPrefixOption ?? `ts-chart-${generatedId.replaceAll(/[^a-zA-Z0-9_-]/g, "")}`;
  const resolvedAspectRatio = typeof aspectRatio === "number" && Number.isFinite(aspectRatio) && aspectRatio > 0 ? aspectRatio : void 0;
  const cssAspectRatio = resolvedAspectRatio === void 0 ? void 0 : String(resolvedAspectRatio);
  const containerRef = reactExports.useRef(null);
  const adapterRef = reactExports.useRef(null);
  const commonHostOptions = {
    renderer,
    ariaLabel,
    ariaDescription,
    height,
    aspectRatio: resolvedAspectRatio,
    width,
    initialWidth,
    tabIndex,
    idPrefix,
    measureText,
    onFocusChange,
    onFocusGroupChange,
    onSelect,
    onRender,
    onTooltipBodyChange
  };
  const hostOptions = {
    ...commonHostOptions,
    definition: props.definition
  };
  adapterRef.current ??= createChartRendererAdapter(hostOptions);
  const adapter = adapterRef.current;
  const initialMarkupRef = reactExports.useRef(null);
  initialMarkupRef.current ??= adapter.prerender();
  reactExports.useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    adapter.update(hostOptions);
    adapter.mount(container);
    return () => adapter.destroy();
  }, []);
  reactExports.useLayoutEffect(() => {
    adapter.update(hostOptions);
  }, [adapter, hostOptions]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: className ? `ts-chart-host ${className}` : "ts-chart-host",
      style: {
        position: "relative",
        width: width === void 0 ? "100%" : width,
        height: height ?? (resolvedAspectRatio ? void 0 : 320),
        aspectRatio: height === void 0 ? cssAspectRatio : void 0,
        ...style
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartSurface, { ref: containerRef, markup: initialMarkupRef.current })
    }
  );
}
function Chart(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ChartImplementation, { ...props });
}
function ChartImplementation(props) {
  const renderSvg = props.renderSvg ?? renderChartSvg;
  const renderer = reactExports.useMemo(
    () => createSvgChartRenderer(renderSvg),
    [renderSvg]
  );
  const onRender = reactExports.useMemo(() => {
    if (!props.onRender) return void 0;
    return (context) => {
      const svg = context.surface.element;
      const SvgElement = context.container.ownerDocument.defaultView?.SVGSVGElement;
      if (!SvgElement || !(svg instanceof SvgElement)) {
        throw new TypeError("Expected the SVG chart surface.");
      }
      props.onRender?.({
        container: context.container,
        scene: context.scene,
        svg,
        interaction: context.interaction
      });
    };
  }, [props.onRender]);
  const rendererProps = {
    ...props,
    renderer,
    onRender
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RendererChartImplementation, { ...rendererProps });
}
function intern(value) {
  return value instanceof Date ? `date:${value.getTime()}` : `${typeof value}:${String(value)}`;
}
function uniqueDomain(values) {
  const domain = [];
  const index = /* @__PURE__ */ new Map();
  for (const value of values) {
    const key = intern(value);
    if (index.has(key)) continue;
    index.set(key, domain.length);
    domain.push(value);
  }
  return { domain, index };
}
function createBandScale(point, first, second) {
  let domain = [];
  let index = /* @__PURE__ */ new Map();
  let positions = [];
  let range = [0, 1];
  let step = 1;
  let bandwidth = point ? 0 : 1;
  let round = false;
  let paddingInner = point ? 1 : 0;
  let paddingOuter = 0;
  let align = 0.5;
  const scale = ((value) => {
    const position = index.get(intern(value));
    return position === void 0 ? void 0 : positions[position];
  });
  const rescale = () => {
    const count = domain.length;
    const reverse = range[1] < range[0];
    let start = reverse ? range[1] : range[0];
    const stop = reverse ? range[0] : range[1];
    step = (stop - start) / Math.max(1, count - paddingInner + paddingOuter * 2);
    if (round) step = Math.floor(step);
    start += (stop - start - step * (count - paddingInner)) * align;
    bandwidth = step * (1 - paddingInner);
    if (round) {
      start = Math.round(start);
      bandwidth = Math.round(bandwidth);
    }
    positions = Array.from(
      { length: count },
      (_value, position) => start + step * position
    );
    if (reverse) positions.reverse();
    return scale;
  };
  scale.domain = ((values) => {
    if (values === void 0) return domain.slice();
    const next = uniqueDomain(values);
    domain = next.domain;
    index = next.index;
    return rescale();
  });
  scale.range = ((values) => {
    if (values === void 0) return [...range];
    range = pair$1(values);
    return rescale();
  });
  scale.rangeRound = (values) => {
    range = pair$1(values);
    round = true;
    return rescale();
  };
  scale.bandwidth = () => bandwidth;
  scale.step = () => step;
  scale.round = ((value) => {
    if (value === void 0) return round;
    round = Boolean(value);
    return rescale();
  });
  scale.padding = ((value) => {
    if (value === void 0) return paddingInner;
    paddingOuter = number(value);
    paddingInner = Math.min(1, paddingOuter);
    return rescale();
  });
  scale.paddingInner = ((value) => {
    if (value === void 0) return paddingInner;
    paddingInner = Math.min(1, number(value));
    return rescale();
  });
  scale.paddingOuter = ((value) => {
    if (value === void 0) return paddingOuter;
    paddingOuter = number(value);
    return rescale();
  });
  scale.align = ((value) => {
    if (value === void 0) return align;
    align = Math.max(0, Math.min(1, number(value)));
    return rescale();
  });
  scale.copy = () => {
    const copy = createBandScale(false, domain, range);
    return copy.round(round).paddingInner(paddingInner).paddingOuter(paddingOuter).align(align);
  };
  if (point) {
    const pointScale = scale;
    pointScale.bandwidth = () => 0;
    pointScale.padding = scale.paddingOuter;
    pointScale.copy = () => {
      const copy = createBandScale(true, domain, range);
      return copy.round(round).padding(paddingOuter).align(align);
    };
    delete pointScale.paddingInner;
    delete pointScale.paddingOuter;
  }
  rescale();
  if (second !== void 0) {
    scale.domain(first).range(second);
  } else if (first !== void 0) {
    scale.range(first);
  }
  return scale;
}
function pair$1(values) {
  const resolved = Array.from(values, number);
  if (resolved.length !== 2 || resolved.some((value) => !Number.isFinite(value))) {
    throw new TypeError("A scale range requires exactly two finite numbers");
  }
  return [resolved[0], resolved[1]];
}
function number(value) {
  return Number(value);
}
function scaleBand(first, second) {
  return createBandScale(false, first, second);
}
const preferredMultiples = [1, 2, 5, 10];
function ticks(start, stop, count) {
  if (!(count > 0)) return [];
  if (start === stop) return [start];
  const descending = stop < start;
  const plan = createTickPlan(
    descending ? stop : start,
    descending ? start : stop,
    count
  );
  if (!(plan.lastIndex >= plan.firstIndex)) return [];
  return Array.from(
    { length: plan.lastIndex - plan.firstIndex + 1 },
    (_value, offset) => valueAtIndex(
      descending ? plan.lastIndex - offset : plan.firstIndex + offset,
      plan.interval
    )
  );
}
function tickIncrement(start, stop, count) {
  return createTickPlan(start, stop, count).interval;
}
function tickStep(start, stop, count) {
  const descending = stop < start;
  const interval = tickIncrement(
    descending ? stop : start,
    descending ? start : stop,
    count
  );
  const magnitude = interval < 0 ? -1 / interval : interval;
  return descending ? -magnitude : magnitude;
}
function createTickPlan(start, stop, count) {
  let requestedCount = count;
  while (true) {
    const interval = chooseInterval(start, stop, requestedCount);
    const firstIndex = indexAtOrAbove(start, interval);
    const lastIndex = indexAtOrBelow(stop, interval);
    if (lastIndex >= firstIndex || !(requestedCount >= 0.5 && requestedCount < 2)) {
      return { firstIndex, lastIndex, interval };
    }
    requestedCount *= 2;
  }
}
function chooseInterval(start, stop, count) {
  const target = (stop - start) / Math.max(0, count);
  const exponent = Math.floor(Math.log10(target));
  const decade = 10 ** exponent;
  const multiple = closestPreferredMultiple(target / decade);
  return exponent < 0 ? -(10 ** -exponent) / multiple : decade * multiple;
}
function closestPreferredMultiple(normalizedTarget) {
  let selected = preferredMultiples[0];
  for (const candidate of preferredMultiples.slice(1)) {
    const midpoint = Math.sqrt(selected * candidate);
    if (!(normalizedTarget >= midpoint)) break;
    selected = candidate;
  }
  return selected;
}
function indexAtOrAbove(value, interval) {
  const position = interval < 0 ? value * -interval : value / interval;
  const nearest = Math.round(position);
  return nearest < position ? nearest + 1 : nearest;
}
function indexAtOrBelow(value, interval) {
  const position = interval < 0 ? value * -interval : value / interval;
  const nearest = Math.round(position);
  return nearest > position ? nearest - 1 : nearest;
}
function valueAtIndex(index, interval) {
  return interval < 0 ? index / -interval : index * interval;
}
function scaleLinear(first, second) {
  let domain = [0, 1];
  let range = [0, 1];
  let clamped = false;
  const scale = ((value) => {
    if (value == null || !Number.isFinite(Number(value))) return void 0;
    return interpolate(Number(value), domain, range, clamped);
  });
  scale.domain = ((values) => {
    if (values === void 0) return [...domain];
    domain = pair(values, "domain");
    return scale;
  });
  scale.range = ((values) => {
    if (values === void 0) return [...range];
    range = pair(values, "range");
    return scale;
  });
  scale.invert = (value) => interpolate(value, range, domain, clamped);
  scale.clamp = ((value) => {
    if (value === void 0) return clamped;
    clamped = Boolean(value);
    return scale;
  });
  scale.ticks = (count = 10) => ticks(domain[0], domain[1], count);
  scale.tickFormat = (count = 10) => {
    const step = Math.abs(tickStep(domain[0], domain[1], count));
    const digits = step > 0 && step < 1 ? Math.min(20, Math.max(0, -Math.floor(Math.log10(step)))) : 0;
    return (value) => {
      const formatted = digits ? value.toFixed(digits) : String(value);
      return formatted === "-0" ? "0" : formatted;
    };
  };
  scale.nice = (count = 10) => {
    let start = domain[0];
    let stop = domain[1];
    let startIndex = 0;
    let stopIndex = 1;
    if (stop < start) {
      [start, stop] = [stop, start];
      [startIndex, stopIndex] = [stopIndex, startIndex];
    }
    let previousStep;
    for (let remaining = 10; remaining > 0; remaining--) {
      const step = tickIncrement(start, stop, count);
      if (step === previousStep) {
        const next = [...domain];
        next[startIndex] = start;
        next[stopIndex] = stop;
        domain = next;
        break;
      }
      if (step > 0) {
        start = Math.floor(start / step) * step;
        stop = Math.ceil(stop / step) * step;
      } else if (step < 0) {
        start = Math.ceil(start * step) / step;
        stop = Math.floor(stop * step) / step;
      } else {
        break;
      }
      previousStep = step;
    }
    return scale;
  };
  scale.copy = () => scaleLinear(domain, range).clamp(clamped);
  if (second !== void 0) {
    scale.domain(first).range(second);
  } else if (first !== void 0) {
    scale.range(first);
  }
  return scale;
}
function interpolate(value, domain, range, clamped) {
  const span = domain[1] - domain[0];
  let ratio = span ? (value - domain[0]) / span : 0.5;
  if (clamped) ratio = Math.max(0, Math.min(1, ratio));
  return range[0] + ratio * (range[1] - range[0]);
}
function pair(values, name) {
  const resolved = Array.from(values, Number);
  if (resolved.length !== 2 || resolved.some((value) => !Number.isFinite(value))) {
    throw new TypeError(
      `A linear scale ${name} requires exactly two finite numbers`
    );
  }
  return [resolved[0], resolved[1]];
}
const defaultPlacements = [
  "top",
  "bottom",
  "right",
  "left"
];
function resolveChartTooltipPlacement(anchor, tooltip2, boundary, placement, offset) {
  const edge = 8;
  const gap = offset !== void 0 && Number.isFinite(offset) ? Math.max(0, offset) : 10;
  const minimumLeft = boundary.left + edge;
  const minimumTop = boundary.top + edge;
  const maxLeft = Math.max(minimumLeft, boundary.right - edge - tooltip2.width);
  const maxTop = Math.max(minimumTop, boundary.bottom - edge - tooltip2.height);
  const placements = placement === void 0 || placement === "auto" ? defaultPlacements : Array.isArray(placement) ? placement.length ? placement : defaultPlacements : [placement];
  const candidates = placements.map(
    (candidate) => tooltipPlacement(
      candidate,
      anchor.x,
      anchor.y,
      tooltip2.width,
      tooltip2.height,
      gap
    )
  );
  let selected = candidates[0];
  let selectedOverflow = overflow(
    selected,
    tooltip2.width,
    tooltip2.height,
    boundary,
    edge
  );
  for (const candidate of candidates) {
    const candidateOverflow = overflow(
      candidate,
      tooltip2.width,
      tooltip2.height,
      boundary,
      edge
    );
    if (candidateOverflow === 0) {
      selected = candidate;
      break;
    }
    if (candidateOverflow < selectedOverflow) {
      selected = candidate;
      selectedOverflow = candidateOverflow;
    }
  }
  return {
    left: clamp(selected.left, minimumLeft, maxLeft),
    top: clamp(selected.top, minimumTop, maxTop),
    placement: selected.placement
  };
}
function tooltipPlacement(placement, anchorX, anchorY, width, height, gap) {
  const xDirection = placement.endsWith("right") || placement === "right" ? 1 : placement.endsWith("left") || placement === "left" ? -1 : 0;
  const yDirection = placement.startsWith("bottom") || placement === "bottom" ? 1 : placement.startsWith("top") || placement === "top" ? -1 : 0;
  return {
    placement,
    left: anchorX + (xDirection - 1) * width / 2 + xDirection * gap,
    top: anchorY + (yDirection - 1) * height / 2 + yDirection * gap
  };
}
function overflow(position, width, height, boundary, edge) {
  return Math.max(0, boundary.left + edge - position.left) + Math.max(0, position.left + width + edge - boundary.right) + Math.max(0, boundary.top + edge - position.top) + Math.max(0, position.top + height + edge - boundary.bottom);
}
function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}
function placeTooltip(tooltip2, anchorX, anchorY, boundary, placement, offset) {
  const width = tooltip2.offsetWidth;
  const height = tooltip2.offsetHeight;
  const resolved = resolveChartTooltipPlacement(
    { x: anchorX, y: anchorY },
    { width, height },
    boundary,
    placement,
    offset
  );
  tooltip2.style.left = `${resolved.left}px`;
  tooltip2.style.top = `${resolved.top}px`;
  tooltip2.dataset.placement = resolved.placement;
}
function orderChartTooltipPoints(points, scene, sort) {
  if (sort === "focus") return [...points];
  if (typeof sort === "function") return [...points].sort(sort);
  if (sort !== "color-domain") {
    const first = points[0];
    const sharedX = first !== void 0 && points.every((point) => sameChartTooltipValue(point.xValue, first.xValue));
    const sharedY = first !== void 0 && points.every((point) => sameChartTooltipValue(point.yValue, first.yValue));
    return [...points].sort(
      (left, right) => sharedY && !sharedX ? left.x - right.x || left.y - right.y : left.y - right.y || left.x - right.x
    );
  }
  return [...points].sort(
    (left, right) => colorOrder(scene, left.group) - colorOrder(scene, right.group)
  );
}
function createChartTooltipContent(points, scene, pinned = false, options, primaryPoint) {
  const point = points[0];
  if (!point) return { rows: [] };
  const context = createTooltipContentContext(scene, pinned, options);
  const content = options?.content?.(points, context);
  if (content !== void 0) return content;
  const formatted = options?.formatGroup?.(points, context) ?? options?.format?.(primaryPoint ?? point, context);
  if (formatted !== void 0) return formatted;
  return defaultTooltipContent(points, scene, options, context);
}
function resolveChartTooltipAnchor(point, points, scene, pointer, options, focus = {
  primary: point,
  group: points,
  source: "programmatic",
  pinned: false
}) {
  const fallback = { x: point.x, y: point.y };
  const anchor = options?.anchor ?? "point";
  if (anchor === "point") return fallback;
  if (anchor === "pointer") return pointer ?? fallback;
  if (anchor === "group-center") {
    let x1 = point.x;
    let x2 = point.x;
    let y1 = point.y;
    let y2 = point.y;
    for (const candidate of points) {
      x1 = Math.min(x1, candidate.x);
      x2 = Math.max(x2, candidate.x);
      y1 = Math.min(y1, candidate.y);
      y2 = Math.max(y2, candidate.y);
    }
    return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
  }
  if (typeof anchor === "object") {
    return {
      x: resolveTooltipCoordinate(
        "x",
        anchor.x,
        point,
        points,
        scene,
        pointer,
        fallback.x
      ),
      y: resolveTooltipCoordinate(
        "y",
        anchor.y,
        point,
        points,
        scene,
        pointer,
        fallback.y
      )
    };
  }
  const resolved = anchor(points, {
    focus,
    pointer,
    plot: scene.chart,
    surface: { width: scene.width, height: scene.height },
    scales: scene.scales
  });
  return resolved && Number.isFinite(resolved.x) && Number.isFinite(resolved.y) ? resolved : fallback;
}
function formatChartTooltipValue(value) {
  return value instanceof Date ? Number.isNaN(+value) ? "Invalid Date" : value.toISOString().replace("T00:00:00.000Z", "") : typeof value === "number" ? value.toLocaleString() : String(value);
}
function createTooltipContentContext(scene, pinned, options) {
  const x = findTooltipChannelItem(options?.items, "x");
  const y = findTooltipChannelItem(options?.items, "y");
  return {
    pinned,
    xLabel: x?.label ?? findSceneLabel(scene, "x-label") ?? "x",
    yLabel: y?.label ?? findSceneLabel(scene, "y-label") ?? "y",
    formatX: formatChartTooltipValue,
    formatY: formatChartTooltipValue
  };
}
function defaultTooltipContent(points, scene, options, context) {
  const point = points[0];
  if (!point) return { rows: [] };
  const x = findTooltipChannelItem(options?.items, "x");
  const y = findTooltipChannelItem(options?.items, "y");
  const group = findTooltipChannelItem(options?.items, "group");
  const sharedX = points.length > 1 && points.every(
    (candidate) => sameChartTooltipValue(candidate.xValue, point.xValue)
  );
  const sharedY = points.length > 1 && points.every(
    (candidate) => sameChartTooltipValue(candidate.yValue, point.yValue)
  );
  if (sharedX || sharedY) {
    const axis = sharedX ? "x" : "y";
    const axisItem = sharedX ? x : y;
    const label = axisItem?.label ?? findSceneLabel(scene, `${axis}-label`);
    const value = formatPointAxis(point, axis, axisItem, context);
    return {
      title: label ? `${label}: ${value}` : value,
      rows: points.map((candidate) => ({
        label: formatTooltipGroup(candidate, group, context),
        value: formatPointAxis(
          candidate,
          sharedX ? "y" : "x",
          sharedX ? y : x,
          context
        ),
        color: candidate.color
      }))
    };
  }
  if (points.length > 1) {
    return {
      rows: points.map((candidate) => ({
        label: formatTooltipGroup(candidate, group, context),
        value: `${formatPointAxis(candidate, "x", x, context)} · ${formatPointAxis(candidate, "y", y, context)}`,
        color: candidate.color
      }))
    };
  }
  const items = options?.items;
  return {
    title: point.group == null || items?.some(isTooltipGroupItem) ? void 0 : formatTooltipGroup(point, group, context),
    color: point.group == null || items?.some(isTooltipGroupItem) ? void 0 : point.color,
    rows: items ? tooltipItemRows(point, items, context) : [
      {
        label: context.xLabel,
        value: formatPointAxis(point, "x", x, context)
      },
      {
        label: context.yLabel,
        value: formatPointAxis(point, "y", y, context)
      }
    ]
  };
}
function tooltipItemRows(point, items, context) {
  return items.flatMap((item) => {
    if (typeof item === "string") {
      if (item === "group") {
        return [{ label: "Group", value: point.groupLabel, color: point.color }];
      }
      return [
        {
          label: item === "x" ? context.xLabel : context.yLabel,
          value: formatPointAxis(point, item, void 0, context)
        }
      ];
    }
    if ("channel" in item) {
      const text = item.text?.(point, context);
      if (item.text && text == null) return [];
      if (item.channel === "group") {
        return [
          {
            label: item.label ?? "Group",
            value: text ?? point.groupLabel,
            color: point.color
          }
        ];
      }
      return [
        {
          label: item.label ?? (item.channel === "x" ? context.xLabel : context.yLabel),
          value: text ?? formatPointAxis(point, item.channel, void 0, context)
        }
      ];
    }
    if ("field" in item) {
      const value2 = point.datum[item.field];
      if (value2 == null) return [];
      const text = item.text?.(point, context);
      if (item.text && text == null) return [];
      return [
        {
          label: item.label ?? item.field,
          value: text ?? formatChartTooltipValue(value2)
        }
      ];
    }
    const value = item.text(point, context);
    return value == null ? [] : [{ label: item.label ?? item.id, value }];
  });
}
function findTooltipChannelItem(items, channel) {
  const item = items?.find(
    (candidate) => tooltipItemChannel(candidate) === channel
  );
  return typeof item === "object" && "channel" in item ? item : void 0;
}
function tooltipItemChannel(item) {
  return typeof item === "string" ? item : "channel" in item ? item.channel : void 0;
}
function isTooltipGroupItem(item) {
  return tooltipItemChannel(item) === "group";
}
function formatTooltipGroup(point, item, context) {
  return item?.text?.(point, context) ?? point.groupLabel;
}
function formatPointAxis(point, axis, item, context) {
  const itemText = item?.text?.(point, context);
  if (itemText != null) return itemText;
  const start = axis === "x" ? point.x1Value : point.y1Value;
  const end = axis === "x" ? point.x2Value : point.y2Value;
  const interval = axis === "x" ? point.xInterval : point.yInterval;
  if (interval === "difference" && typeof start === "number" && typeof end === "number") {
    return formatChartTooltipValue(end - start);
  }
  if (interval === "range" && start !== void 0 && end !== void 0 && !sameChartTooltipValue(start, end)) {
    return `${formatChartTooltipValue(start)}–${formatChartTooltipValue(end)}`;
  }
  return formatChartTooltipValue(axis === "x" ? point.xValue : point.yValue);
}
function findSceneLabel(scene, key) {
  const axes = scene.nodes.find(
    (node) => node.kind === "group" && node.key === "axes"
  );
  if (axes?.kind !== "group") return void 0;
  const label = axes.children.find((node) => node.key === key);
  return label?.kind === "label" ? label.text : void 0;
}
function resolveTooltipCoordinate(axis, source, point, points, scene, pointer, fallback) {
  if (source === "point") return axis === "x" ? point.x : point.y;
  if (source === "pointer") return pointer?.[axis] ?? fallback;
  if (source === "value") {
    const value = axis === "x" ? point.xValue : point.yValue;
    const scale = scene.scales[axis];
    const position = (scale?.viewport?.map ?? scale?.map)?.(value);
    return position !== void 0 && Number.isFinite(position) ? position : fallback;
  }
  if (source === "group-center") {
    let minimum = axis === "x" ? point.x : point.y;
    let maximum = minimum;
    for (const candidate of points) {
      const position = axis === "x" ? candidate.x : candidate.y;
      minimum = Math.min(minimum, position);
      maximum = Math.max(maximum, position);
    }
    return (minimum + maximum) / 2;
  }
  const plot = scene.chart;
  if (axis === "x") {
    if (source === "plot-left") return plot.x;
    if (source === "plot-center") return plot.x + plot.width / 2;
    if (source === "plot-right") return plot.x + plot.width;
  } else {
    if (source === "plot-top") return plot.y;
    if (source === "plot-center") return plot.y + plot.height / 2;
    if (source === "plot-bottom") return plot.y + plot.height;
  }
  return fallback;
}
function colorOrder(scene, group) {
  const index = group == null ? -1 : scene.colors.domain.indexOf(group);
  return index < 0 ? Number.MAX_SAFE_INTEGER : index;
}
function sameChartTooltipValue(left, right) {
  return left instanceof Date && right instanceof Date ? left.getTime() === right.getTime() : Object.is(left, right);
}
const tooltip = {
  id: "tooltip",
  __chartExtensionType: "tooltip",
  __chartTooltipHost: "dom",
  create: createTooltipExtension
};
function createTooltipExtension(extensionContext) {
  let options = {};
  let element;
  let bodyElement;
  let activeBodyChange;
  let bodyVisible = false;
  let bodyScene;
  let bodyPoints = [];
  let bodyPinned = false;
  let bodyDirty = false;
  let paintContext;
  let anchor = null;
  let positionFrame;
  let resizeObserver;
  let portalExtension;
  let portalInstance;
  const { container } = extensionContext;
  const view = container.ownerDocument.defaultView;
  const tooltipMotion = extensionContext.motion;
  function update(nextOptions) {
    if (options !== nextOptions) bodyDirty = true;
    options = nextOptions;
    if (element) syncPortal();
  }
  function paint(nextContext) {
    paintContext = nextContext;
    if (options.visibility === "pinned" && !nextContext.pinned) {
      hide();
      return;
    }
    const tooltipElement = ensureElement();
    syncPortal();
    const motionSnapshot = tooltipMotion?.beforePaint(tooltipElement);
    tooltipElement.style.visibility = "hidden";
    tooltipElement.removeAttribute("hidden");
    tooltipElement.className = options.className ? `ts-chart-tooltip ${options.className}` : "ts-chart-tooltip";
    const points = orderChartTooltipPoints(
      nextContext.points,
      nextContext.scene,
      options.sort
    );
    const resolvedContent = createChartTooltipContent(
      points,
      nextContext.scene,
      nextContext.pinned,
      options,
      nextContext.point
    );
    const custom = renderTooltipBody(
      tooltipElement,
      points,
      resolvedContent,
      nextContext.pinned
    );
    if (!custom) {
      if (typeof resolvedContent === "string") {
        paintPlainTooltip(tooltipElement, resolvedContent);
      } else {
        paintStructuredTooltip(tooltipElement, resolvedContent);
      }
    }
    configureTooltipSemantics(
      tooltipElement,
      resolvedContent,
      custom,
      nextContext.pinned
    );
    tooltipElement.style.pointerEvents = nextContext.pinned ? "auto" : "none";
    tooltipElement.style.userSelect = nextContext.pinned ? "text" : "none";
    tooltipElement.dataset.sticky = String(nextContext.pinned);
    anchor = resolveChartTooltipAnchor(
      nextContext.point,
      points,
      nextContext.scene,
      nextContext.pointer,
      options,
      nextContext.focus
    );
    position();
    tooltipElement.style.removeProperty("visibility");
    if (motionSnapshot) {
      tooltipMotion?.afterPaint(tooltipElement, motionSnapshot, options.motion);
    }
  }
  function ensureElement() {
    if (element) return element;
    element = createTooltip(container.ownerDocument);
    element.addEventListener("keydown", handleKeyDown);
    resizeObserver = view?.ResizeObserver ? new view.ResizeObserver(schedulePosition) : void 0;
    resizeObserver?.observe(element);
    container.append(element);
    return element;
  }
  function handleKeyDown(event) {
    if (event.key !== "Escape" || !paintContext?.pinned) return;
    event.preventDefault();
    event.stopPropagation();
    extensionContext.dismiss();
  }
  function schedulePosition() {
    if (!paintContext || !anchor || positionFrame !== void 0) return;
    if (!view?.requestAnimationFrame) {
      position();
      return;
    }
    positionFrame = view.requestAnimationFrame(() => {
      positionFrame = void 0;
      position();
    });
  }
  function position() {
    if (!paintContext || !element || !anchor) return;
    if (portalInstance) {
      const visible = portalInstance.position({
        scene: paintContext.scene,
        surface: paintContext.surface,
        anchor,
        placement: options.placement,
        offset: options.offset
      });
      if (!visible) element.setAttribute("hidden", "");
      return;
    }
    placeTooltip(
      element,
      anchor.x,
      anchor.y,
      {
        left: 0,
        top: 0,
        right: paintContext.scene.width,
        bottom: paintContext.scene.height
      },
      options.placement,
      options.offset
    );
  }
  function syncPortal() {
    if (!element) return;
    const input = options.portal;
    const nextExtension = input ? "create" in input ? input : input.use : void 0;
    const nextOptions = input && "use" in input ? input : {};
    if (nextExtension !== portalExtension) {
      portalInstance?.destroy();
      portalInstance = void 0;
      portalExtension = nextExtension;
      if (nextExtension) {
        portalInstance = nextExtension.create(
          {
            container,
            element,
            schedulePosition
          },
          nextOptions
        );
      } else {
        moveToContainer();
      }
    } else {
      portalInstance?.update(nextOptions);
    }
  }
  function moveToContainer() {
    if (!element) return;
    if (element.parentNode !== container) container.append(element);
    element.removeAttribute("popover");
    delete element.dataset.tsChartTooltipPortal;
    Object.assign(element.style, {
      position: "absolute",
      zIndex: "1",
      right: "auto",
      bottom: "auto",
      margin: "0"
    });
  }
  function renderTooltipBody(tooltipElement, points, content, pinned) {
    const callback = extensionContext.bodyChange();
    if (!callback) {
      deactivateTooltipBody();
      return false;
    }
    if (activeBodyChange !== callback) {
      activeBodyChange?.(null);
      activeBodyChange = callback;
      bodyVisible = false;
      bodyElement = void 0;
    }
    if (!bodyElement) {
      bodyElement = tooltipElement.ownerDocument.createElement("div");
      bodyElement.className = "ts-chart-tooltip__body";
      tooltipElement.replaceChildren(bodyElement);
    }
    bodyElement.toggleAttribute("inert", !pinned);
    setTooltipContentAccessibility(tooltipElement, content);
    const changed = bodyDirty || !bodyVisible || bodyScene !== paintContext?.scene || bodyPinned !== pinned || !samePointList(points, bodyPoints);
    bodyDirty = false;
    bodyVisible = true;
    bodyScene = paintContext?.scene;
    bodyPoints = points;
    bodyPinned = pinned;
    if (changed) {
      callback({
        element: bodyElement,
        points,
        content,
        pinned,
        dismiss: extensionContext.dismiss
      });
    }
    return true;
  }
  function hideTooltipBody() {
    if (!bodyVisible) return;
    bodyVisible = false;
    activeBodyChange?.(null);
  }
  function deactivateTooltipBody() {
    hideTooltipBody();
    activeBodyChange = void 0;
    bodyElement = void 0;
    bodyScene = void 0;
    bodyPoints = [];
  }
  function hide() {
    paintContext = void 0;
    anchor = null;
    const currentElement = element;
    if (!currentElement || currentElement.hidden) {
      portalInstance?.hide();
      hideTooltipBody();
      return;
    }
    const complete = () => {
      portalInstance?.hide();
      currentElement.setAttribute("hidden", "");
      hideTooltipBody();
    };
    if (tooltipMotion?.hide(currentElement, options.motion, complete)) return;
    complete();
  }
  function destroy() {
    hide();
    deactivateTooltipBody();
    portalInstance?.destroy();
    portalInstance = void 0;
    portalExtension = void 0;
    if (positionFrame !== void 0) {
      view?.cancelAnimationFrame?.(positionFrame);
      positionFrame = void 0;
    }
    tooltipMotion?.destroy(element);
    resizeObserver?.disconnect();
    resizeObserver = void 0;
    element?.remove();
    element = void 0;
  }
  return {
    update,
    paint,
    hide,
    contains: (target) => Boolean(target && element?.contains(target)),
    destroy
  };
}
function samePointList(left, right) {
  return left.length === right.length && left.every(
    (point, index) => point.key === right[index]?.key && point.markId === right[index]?.markId && point.datumIndex === right[index]?.datumIndex
  );
}
function createTooltip(document) {
  const tooltipElement = document.createElement("div");
  tooltipElement.className = "ts-chart-tooltip";
  tooltipElement.setAttribute("role", "status");
  tooltipElement.setAttribute("aria-live", "polite");
  Object.assign(tooltipElement.style, {
    position: "absolute",
    zIndex: "1",
    maxWidth: "var(--ts-chart-tooltip-max-width, min(24rem, 80%))",
    padding: "var(--ts-chart-tooltip-padding, 0.4rem 0.55rem)",
    border: "var(--ts-chart-tooltip-border, 1px solid color-mix(in srgb, CanvasText 18%, transparent))",
    borderRadius: "var(--ts-chart-tooltip-border-radius, 0.45rem)",
    background: "var(--ts-chart-tooltip-background, Canvas)",
    color: "var(--ts-chart-tooltip-color, CanvasText)",
    boxShadow: "var(--ts-chart-tooltip-shadow, 0 6px 24px rgb(0 0 0 / 0.14))",
    font: "var(--ts-chart-tooltip-font, 500 0.75rem/1.3 system-ui, sans-serif)",
    pointerEvents: "none",
    overflowWrap: "anywhere"
  });
  tooltipElement.hidden = true;
  return tooltipElement;
}
function paintPlainTooltip(tooltipElement, text) {
  setTooltipContentAccessibility(tooltipElement, text);
  tooltipElement.textContent = text;
}
function paintStructuredTooltip(tooltipElement, content) {
  const document = tooltipElement.ownerDocument;
  const children = [];
  if (content.title) {
    const title = document.createElement("div");
    title.className = "ts-chart-tooltip__title";
    title.style.cssText = `display:flex;align-items:center;gap:.4rem;font-weight:650;margin-bottom:${content.rows.length ? ".3rem" : "0"}`;
    if (content.color)
      title.append(createTooltipSwatch(document, content.color));
    title.append(content.title);
    children.push(title);
  }
  if (content.rows.length) {
    const rows = document.createElement("div");
    rows.className = "ts-chart-tooltip__rows";
    rows.setAttribute("aria-hidden", "true");
    for (const row of content.rows) {
      const line = document.createElement("div");
      line.className = "ts-chart-tooltip__row";
      line.style.cssText = "display:grid;grid-template-columns:.55rem minmax(0,1fr) auto;align-items:center;column-gap:.4rem";
      const swatch = row.color ? createTooltipSwatch(document, row.color) : document.createElement("span");
      const label = document.createElement("span");
      label.textContent = row.label;
      const value = document.createElement("span");
      value.textContent = row.value;
      value.style.cssText = "text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap";
      line.append(swatch, label, value);
      rows.append(line);
    }
    children.push(rows);
  }
  tooltipElement.replaceChildren(...children);
  setTooltipContentAccessibility(tooltipElement, content);
}
function setTooltipContentAccessibility(tooltipElement, content) {
  if (typeof content === "string") {
    tooltipElement.removeAttribute("aria-label");
    tooltipElement.style.whiteSpace = "pre-wrap";
    return;
  }
  tooltipElement.style.whiteSpace = "normal";
  tooltipElement.setAttribute(
    "aria-label",
    [content.title, ...content.rows.map((row) => `${row.label}: ${row.value}`)].filter(Boolean).join("\n")
  );
}
function configureTooltipSemantics(tooltipElement, content, custom, pinned) {
  if (custom && typeof content === "string") {
    tooltipElement.setAttribute("aria-label", content);
  }
  if (custom && pinned) {
    tooltipElement.setAttribute("role", "dialog");
    tooltipElement.setAttribute("aria-modal", "false");
    tooltipElement.removeAttribute("aria-live");
    return;
  }
  tooltipElement.setAttribute("role", "status");
  tooltipElement.setAttribute("aria-live", "polite");
  tooltipElement.removeAttribute("aria-modal");
  if (!custom && typeof content === "string") {
    tooltipElement.removeAttribute("aria-label");
  }
}
function createTooltipSwatch(document, color) {
  const swatch = document.createElement("span");
  swatch.className = "ts-chart-tooltip__swatch";
  swatch.setAttribute("aria-hidden", "true");
  swatch.style.cssText = "display:block;width:.55rem;height:.55rem;border-radius:.15rem;box-shadow:inset 0 0 0 1px rgb(0 0 0/.12)";
  swatch.style.background = color;
  return swatch;
}
function createPolarMark(initialize, motion) {
  if (motion === void 0) return { initialize };
  return {
    motion,
    initialize(context) {
      return { ...initialize(context), motion };
    }
  };
}
const polarFocusGeometry = /* @__PURE__ */ Symbol("tanstack-charts-polar-focus");
function withPolarFocusGeometry(point, layout, angle, radius, offsetX, offsetY) {
  return Object.assign(point, {
    [polarFocusGeometry]: [layout, angle, radius, offsetX, offsetY]
  });
}
const tau$2 = Math.PI * 2;
function tracePolarArcBoundary(generator, datum, index, data) {
  const points = [];
  const append = (x, y) => {
    if (!isFiniteNumber$2(x) || !isFiniteNumber$2(y)) return;
    const previous = points.at(-1);
    if (previous && Math.abs(previous[0] - x) <= 1e-9 && Math.abs(previous[1] - y) <= 1e-9) {
      return;
    }
    points.push([x, y]);
  };
  const context = {
    moveTo: append,
    lineTo: append,
    arc(centerX, centerY, radius, startAngle, endAngle, counterclockwise = false) {
      const sweep = canvasArcSweep(startAngle, endAngle, counterclockwise);
      if (!isFiniteNumber$2(sweep)) return;
      if (sweep === 0) {
        append(
          centerX + radius * Math.cos(startAngle),
          centerY + radius * Math.sin(startAngle)
        );
        return;
      }
      const steps = Math.max(1, Math.ceil(Math.abs(sweep) / (Math.PI / 24)));
      for (let index2 = 0; index2 <= steps; index2 += 1) {
        const angle = startAngle + sweep * index2 / steps;
        append(
          centerX + radius * Math.cos(angle),
          centerY + radius * Math.sin(angle)
        );
      }
    },
    closePath() {
    }
  };
  const previousContext = generator.context();
  generator.context(context);
  try {
    generator(datum, index, data);
  } finally {
    generator.context(previousContext);
  }
  return points;
}
function canvasArcSweep(startAngle, endAngle, counterclockwise) {
  const difference = endAngle - startAngle;
  if (!isFiniteNumber$2(difference)) return Number.NaN;
  if (counterclockwise) {
    if (difference <= -tau$2) return -tau$2;
    const sweep2 = difference % tau$2;
    return sweep2 > 0 ? sweep2 - tau$2 : sweep2;
  }
  if (difference >= tau$2) return tau$2;
  const sweep = difference % tau$2;
  return sweep < 0 ? sweep + tau$2 : sweep;
}
const tau$1 = Math.PI * 2;
const fullRevolutionTolerance = 1e-12;
function pie(source, options) {
  const data = toArray(source);
  const values = transformValues(data, options.value);
  const startAngle = options.startAngle ?? 0;
  const endAngle = options.endAngle ?? tau$1;
  const gapAngle = options.gapAngle ?? 0;
  assertFinite(startAngle, "startAngle");
  assertFinite(endAngle, "endAngle");
  assertNonnegativeFinite(gapAngle, "gapAngle");
  const sweep = endAngle - startAngle;
  if (!Number.isFinite(sweep) || Math.abs(sweep) > tau$1) {
    throw new TypeError("pie: angular sweep must be no greater than 2π");
  }
  const sourceIndexes = values.flatMap((value, sourceIndex) => {
    if (!isFiniteNumber(value)) return [];
    if (value < 0) {
      throw new TypeError(
        `pie: value at index ${sourceIndex} must be nonnegative`
      );
    }
    return [sourceIndex];
  });
  const ordered = orderedIndexes(
    data,
    sourceIndexes,
    options.orderBy,
    options.order
  );
  const completeRevolution = Math.abs(Math.abs(sweep) - tau$1) <= fullRevolutionTolerance;
  assertPieGapCapacity(ordered, values, sweep, gapAngle, completeRevolution);
  const allocated = allocateProportionalIntervals(
    ordered.map((sourceIndex) => values[sourceIndex]),
    {
      start: startAngle,
      end: endAngle,
      gap: gapAngle,
      gapAfterLast: completeRevolution
    }
  );
  const intervals = /* @__PURE__ */ new Map();
  ordered.forEach((sourceIndex, index) => {
    const interval = allocated[index];
    const value = values[sourceIndex];
    intervals.set(sourceIndex, {
      value,
      index,
      fraction: interval.fraction,
      startAngle: interval.start,
      endAngle: interval.end,
      angle: interval.start + (interval.end - interval.start) / 2,
      padAngle: 0
    });
  });
  return sourceIndexes.map((sourceIndex) => {
    const datum = data[sourceIndex];
    return {
      ...datum,
      ...intervals.get(sourceIndex),
      source: [datum],
      sourceIndexes: [sourceIndex]
    };
  });
}
function assertPieGapCapacity(ordered, values, sweep, gapAngle, completeRevolution) {
  const positiveCount = ordered.reduce(
    (count, sourceIndex) => count + (values[sourceIndex] > 0 ? 1 : 0),
    0
  );
  const absoluteSweep = Math.abs(sweep);
  const gapCount = positiveCount === 0 ? 0 : completeRevolution ? positiveCount : Math.max(0, positiveCount - 1);
  const totalGap = gapCount * gapAngle;
  if (!Number.isFinite(totalGap) || totalGap > absoluteSweep) {
    throw new TypeError("pie: gapAngle leaves insufficient angular space");
  }
  const drawableSweep = absoluteSweep - totalGap;
  if (positiveCount > 0 && drawableSweep <= 0) {
    throw new TypeError("pie: positive values require drawable angular space");
  }
}
function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}
function assertFinite(value, name) {
  if (!Number.isFinite(value)) {
    throw new TypeError(`pie: ${name} must be finite`);
  }
}
function assertNonnegativeFinite(value, name) {
  if (!Number.isFinite(value) || value < 0) {
    throw new TypeError(`pie: ${name} must be nonnegative and finite`);
  }
}
const tau = Math.PI * 2;
function polar(options) {
  return createMarkWithScaleValues(
    ({ markIndex }) => {
      const id = options.id ?? `polar-${markIndex}`;
      const marks = options.marks.map(
        (mark, polarMarkIndex) => mark.initialize({ markIndex: polarMarkIndex, parentId: id })
      );
      const childMotions = new Map(
        marks.flatMap((mark, markIndex2) => {
          const childMotion = mark.motion ?? options.marks[markIndex2]?.motion;
          return childMotion === void 0 ? [] : [[mark.id, childMotion]];
        })
      );
      const motion = options.motion !== void 0 || childMotions.size > 0 ? (context) => resolveCompositeChildMotion(options.motion, childMotions, context) : void 0;
      return {
        id,
        ...motion === void 0 ? {} : { motion },
        channels: {
          color: {
            scale: "color",
            values: marks.flatMap((mark) => mark.colorValues)
          }
        },
        render: ({ chart, color, theme }) => {
          const layout = resolvePolarLayout(options, chart, marks);
          if (marks.some((mark) => mark.requiresAngleScale) && !layout.angle) {
            throw new TypeError(
              `Polar mark in "${id}" requires a configured angle scale`
            );
          }
          if (marks.some((mark) => mark.requiresRadiusScale) && !layout.radiusScale) {
            throw new TypeError(
              `Polar mark in "${id}" requires a configured radius scale`
            );
          }
          const nodes = [];
          const guideForeground = [];
          const points = [];
          for (const [guideIndex, guide] of (options.guides ?? []).entries()) {
            const rendered = guide.render({
              layout,
              theme,
              guideIndex,
              parentId: id
            });
            for (const node of rendered.background) nodes.push(node);
            for (const node of rendered.foreground ?? []) {
              guideForeground.push(node);
            }
          }
          for (const mark of marks) {
            const rendered = mark.render({ layout, color, theme });
            for (const node of rendered.nodes) nodes.push(node);
            for (const point of rendered.points ?? []) points.push(point);
          }
          for (const node of guideForeground) nodes.push(node);
          return {
            nodes: [
              {
                kind: "group",
                key: id,
                className: classes("ts-chart__polar", options.className),
                translateX: layout.centerX,
                translateY: layout.centerY,
                ariaHidden: true,
                children: nodes
              }
            ],
            points
          };
        }
      };
    },
    options.motion
  );
}
function radialArc(source, options = {}) {
  const data = asArray(source);
  return createPolarMark(({ markIndex, parentId }) => {
    const id = options.id ?? `${parentId}:arc-${markIndex}`;
    const startAngles = channelValues(
      data,
      options.startAngle,
      (datum) => numberProperty(datum, "startAngle")
    );
    const endAngles = channelValues(
      data,
      options.endAngle,
      (datum) => numberProperty(datum, "endAngle")
    );
    const padAngles = channelValues(
      data,
      options.padAngle,
      (datum) => numberProperty(datum, "padAngle") ?? 0
    );
    const groups = channelValues(data, options.z, () => null);
    const colorValues = options.color === void 0 ? groups : channelValues(data, options.color, () => null);
    const keys = inferredKeyValues(data, options.key, { groups });
    return {
      id,
      colorValues: colorValues.filter(isChartKey$1),
      angleValues: [],
      radiusValues: [],
      includeZeroRadius: false,
      requiresAngleScale: false,
      requiresRadiusScale: false,
      render: ({ layout, color: resolveColor }) => {
        const innerRadius = resolveLength(options.innerRadius, layout, 0);
        const outerRadius = resolveLength(
          options.outerRadius,
          layout,
          layout.radius
        );
        const generator = options.generator?.(layout) ?? createArc().startAngle((_datum, index) => startAngles[index] ?? 0).endAngle((_datum, index) => endAngles[index] ?? 0).padAngle((_datum, index) => padAngles[index] ?? 0).innerRadius(innerRadius).outerRadius(outerRadius).cornerRadius(resolveLength(options.cornerRadius, layout, 0));
        if (options.padRadius !== void 0 && !options.generator) {
          generator.padRadius(resolveLength(options.padRadius, layout, 0));
        }
        const nodes = [];
        const points = [];
        data.forEach((datum, datumIndex) => {
          const startAngle = startAngles[datumIndex];
          const endAngle = endAngles[datumIndex];
          const padAngle = padAngles[datumIndex];
          if (!options.generator && (!isFiniteNumber$2(startAngle) || !isFiniteNumber$2(endAngle) || !isFiniteNumber$2(padAngle))) {
            return;
          }
          const path = generator(datum, datumIndex, data);
          if (typeof path !== "string" || !path) return;
          const group = groups[datumIndex] ?? null;
          const fallback = resolveColor(colorValues[datumIndex] ?? null);
          const fill = visualValue(
            options.fill,
            datum,
            datumIndex,
            data,
            fallback
          );
          const stroke = options.stroke === void 0 ? void 0 : visualValue(options.stroke, datum, datumIndex, data, fallback);
          const key = `${id}:${valueKey(group)}:${valueKey(keys[datumIndex])}`;
          const generatedStart = generator.startAngle()(datum, datumIndex, data);
          const generatedEnd = generator.endAngle()(datum, datumIndex, data);
          const generatedInner = generator.innerRadius()(
            datum,
            datumIndex,
            data
          );
          const generatedOuter = generator.outerRadius()(
            datum,
            datumIndex,
            data
          );
          const centroid = generator.centroid(datum, datumIndex, data);
          const angleValue = (generatedStart + generatedEnd) / 2;
          const radiusValue = (generatedInner + generatedOuter) / 2;
          const point = withPolarFocusGeometry(
            {
              key,
              markId: id,
              group,
              groupLabel: group == null ? id : String(group),
              datum,
              datumIndex,
              xValue: angleValue,
              yValue: radiusValue,
              x: layout.centerX + centroid[0],
              y: layout.centerY + centroid[1],
              color: fill
            },
            layout,
            angleValue,
            radiusValue,
            centroid[0],
            centroid[1]
          );
          nodes.push({
            kind: "area",
            key,
            points: tracePolarArcBoundary(generator, datum, datumIndex, data),
            path,
            interaction: { point, affinity: "geometry" },
            style: {
              fill,
              fillOpacity: options.fillOpacity,
              stroke,
              strokeOpacity: options.strokeOpacity,
              strokeWidth: options.strokeWidth,
              strokeDasharray: options.strokeDasharray,
              opacity: options.opacity,
              lineJoin: "round"
            }
          });
          points.push(point);
        });
        return {
          nodes: [
            {
              kind: "group",
              key: id,
              className: classes("ts-chart__arc", options.className),
              ariaHidden: true,
              children: nodes
            }
          ],
          points
        };
      }
    };
  }, options.motion);
}
function resolvePolarLayout(options, chart, marks) {
  const startAngle = finite(options.startAngle, 0);
  const endAngle = finite(options.endAngle, tau);
  const inset = Math.max(0, finite(options.inset, 0));
  const radiusRatio = Math.max(0, finite(options.radiusRatio, 1));
  const radius = Math.max(0, Math.min(chart.width, chart.height) / 2 - inset) * radiusRatio;
  const layout = {
    chart,
    centerX: chart.x + chart.width / 2,
    centerY: chart.y + chart.height / 2,
    radius,
    startAngle,
    endAngle
  };
  if (options.angle) {
    const wrapPointScale = options.angle.wrap ?? isCompleteRevolution(startAngle, endAngle);
    layout.angle = resolvePolarScale(
      options.angle.scale,
      collectPolarValues(marks, "angleValues"),
      startAngle,
      endAngle,
      wrapPointScale,
      false,
      options.angle.nice
    );
  }
  if (options.radius) {
    const [rangeStart, rangeEnd] = resolvePolarRadiusRange(
      options.radius.range,
      layout
    );
    layout.radiusScale = resolvePolarScale(
      options.radius.scale,
      collectPolarValues(marks, "radiusValues"),
      rangeStart,
      rangeEnd,
      false,
      marks.some((mark) => mark.includeZeroRadius),
      options.radius.nice
    );
  }
  return layout;
}
function resolvePolarScale(source, values, rangeStart, rangeEnd, wrapPointScale, includeZero, nice) {
  const scale = resolveScaleInput(source, {
    values,
    includeZero,
    nice,
    niceCount: 5
  });
  const domain = scale.domain().filter(isChartValue$1);
  const pointScale = wrapPointScale && typeof scale.bandwidth === "function" && scale.bandwidth() === 0;
  const resolvedEnd = pointScale ? domain.length > 1 ? rangeStart + (rangeEnd - rangeStart) * (domain.length - 1) / domain.length : rangeStart : rangeEnd;
  scale.range([rangeStart, resolvedEnd]);
  const bandwidth = scale.bandwidth?.() ?? 0;
  const map = (value) => {
    const position = scale(value);
    return typeof position === "number" && Number.isFinite(position) ? position + bandwidth / 2 : Number.NaN;
  };
  return {
    domain,
    map,
    ticks: (count) => (scale.ticks?.(count) ?? domain).filter(isChartValue$1),
    bandwidth
  };
}
function collectPolarValues(marks, key) {
  const values = [];
  for (const mark of marks) {
    for (const value of mark[key]) values.push(value);
  }
  return values;
}
function resolveLength(value, context, fallback) {
  const resolved = typeof value === "function" ? value(context) : value ?? fallback;
  return isNonnegativeFiniteNumber(resolved) ? resolved : fallback;
}
function resolvePolarRadiusRange(range, layout) {
  if (!range) return [0, layout.radius];
  if (range.length !== 2) {
    throw new TypeError("Polar radius range must contain exactly two endpoints");
  }
  const resolved = range.map(
    (value) => typeof value === "function" ? value(layout) : value
  );
  if (!resolved.every(isNonnegativeFiniteNumber)) {
    throw new TypeError(
      "Polar radius range endpoints must be nonnegative finite pixel lengths"
    );
  }
  return [resolved[0], resolved[1]];
}
function numberProperty(value, key) {
  if (!value || typeof value !== "object") return void 0;
  const property = value[key];
  return isFiniteNumber$2(property) ? property : void 0;
}
function asArray(source) {
  return Array.isArray(source) ? source : Array.from(source);
}
function finite(value, fallback) {
  return isFiniteNumber$2(value) ? value : fallback;
}
function isCompleteRevolution(startAngle, endAngle) {
  return Math.abs(Math.abs(endAngle - startAngle) - tau) <= 1e-12;
}
function classes(base, custom) {
  return custom ? `${base} ${custom}` : base;
}
function scalePoint(first, second) {
  return createBandScale(true, first, second);
}
export {
  Chart as C,
  polar as a,
  barX as b,
  areaY as c,
  defineChart as d,
  scalePoint as e,
  scaleBand as f,
  lineY as l,
  pie as p,
  radialArc as r,
  scaleLinear as s,
  tooltip as t
};
