"use client";

import { useEffect, useState } from "react";

// Docs
// http://web.archive.org/web/20121115090806/http://www.tuaw.com/2012/03/01/retina-display-macs-ipads-and-hidpi-doing-the-math/
// https://stackoverflow.com/questions/12593936/what-is-the-formula-to-determine-if-a-screen-is-retina-resolution

function getNumber(input: string) {
  const number = Number(input);

  if (isNaN(number)) {
    return 0;
  }
  return number;
}

function calculateWidthAndHeight(
  diagonal: number,
  widthRatio: number,
  heightRatio: number
) {
  // Calculate width and height using the ratios
  const width = diagonal / Math.sqrt(1 + (heightRatio / widthRatio) ** 2);
  const height = width * (heightRatio / widthRatio);
  return [width, height];
}

function calculateRetinaDistance(
  pixelWidthAmount: number,
  screenWidthInInces: number
) {
  const ppi = pixelWidthAmount / screenWidthInInces;
  console.log({ ppi });

  const minimumDistance = 3450 / ppi;

  return minimumDistance;
}

export default function Home() {
  // const [isRetina, setIsRetina] = useState(false);
  const [result, setResult] = useState<
    | { status: "idle"; retinaDistance: null }
    | { status: "success"; retinaDistance: number }
    | { status: "error"; retinaDistance: number }
  >({ status: "idle", retinaDistance: null });

  // Input handlers.
  const [screenDiagonal, setScreenDiagonal] = useState("");
  const [aspectRatio, setAspectRatio] = useState("");
  const [screenResolutionWidth, setScreenResolutionWidth] = useState("");
  const [screenResolutionHeight, setScreenResolutionHeight] = useState("");
  const [distance, setDistance] = useState("");

  useEffect(() => {
    const [widthRatio, heightRatio] = aspectRatio.split(":");

    const [width] = calculateWidthAndHeight(
      getNumber(screenDiagonal),
      getNumber(widthRatio),
      getNumber(heightRatio)
    );

    const retinaDistance = calculateRetinaDistance(
      getNumber(screenResolutionWidth),
      width
    );
    console.log({ retinaDistance });

    const isRetina = getNumber(distance) >= retinaDistance;
    console.log({ isRetina });

    if (!isFinite(retinaDistance)) {
      setResult({ status: "idle", retinaDistance: null });
      return;
    }
    if (isRetina) {
      setResult({ status: "success", retinaDistance });
      return;
    }
    setResult({ status: "error", retinaDistance });
    return;
  }, [
    aspectRatio,
    screenDiagonal,
    screenResolutionHeight,
    screenResolutionWidth,
    distance,
  ]);

  return (
    <main className="grid gap-2 p-2">
      <h1 className="text-2xl mb-4">Is your display Retina?</h1>
      <p className="text-md text-gray-200">
        Retina display is a condition where a screen is super sharp that your
        eyes cannot see individual pixels.
      </p>
      <p className="text-sm text-gray-400">
        We usually want to achieve this metric so that our monitor or laptops
        are looking sharp.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {/* 1. Ukuran layar */}
        <div className=" w-full rounded-md p-2 border-gray-600 border-solid border-2">
          <h4>Ukuran Layar</h4>
          <input
            className="bg-gray-600 p-1 rounded-md"
            placeholder="ukuran layar diagonal"
            value={screenDiagonal}
            onChange={(e) => setScreenDiagonal(e.target.value)}
          />
          <span>&nbsp;inch</span>
        </div>

        {/* 2. Aspect ratio */}
        <div className=" w-full rounded-md p-2 border-gray-600 border-solid border-2">
          <h4>Aspect Ratio</h4>
          <select
            name="cars"
            id="cars"
            className="bg-gray-600 p-1 rounded-md"
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
          >
            <option value="">-Select-</option>
            <option value="16:9">16 : 9</option>
            <option value="4:3">4 : 3</option>
            <option value="21:9">21 : 9</option>
            <option value="32:9">32 : 9</option>
          </select>
        </div>

        {/* 3. Resolusi layar */}
        <div className="gap-1 w-full rounded-md p-2 border-gray-600 border-solid border-2">
          <h4>Resolusi Layar</h4>
          <div className="mb-1">
            <input
              className="bg-gray-600 p-1 rounded-md"
              placeholder="Resolusi lebar"
              value={screenResolutionWidth}
              onChange={(e) => setScreenResolutionWidth(e.target.value)}
            />
            <span>&nbsp;pixel</span>
          </div>
          <div>
            <input
              className="bg-gray-600 p-1 rounded-md"
              placeholder="Resolusi tinggi"
              value={screenResolutionHeight}
              onChange={(e) => setScreenResolutionHeight(e.target.value)}
            />
            <span>&nbsp;pixel</span>
          </div>
        </div>

        {/* 4. Jarak penggunaan */}
        <div className=" w-full rounded-md p-2 border-gray-600 border-solid border-2">
          <h4>Jarak penggunaan</h4>
          <input
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="bg-gray-600 p-1 rounded-md"
            placeholder="Jarak penggunaan"
          />
          <span>&nbsp;inch</span>
        </div>
      </div>

      <div
        className={`gap-1 border-solid border-2 p-2 rounded-md ${
          result.status === "success"
            ? "border-green-700"
            : result.status === "error"
            ? "border-red-800"
            : "border-gray-500"
        }`}
      >
        <h4 className="text-xl">Result</h4>
        <p>
          Is Retina:{" "}
          {result.status === "success"
            ? "YES"
            : result.status === "error"
            ? "no"
            : "N/A"}
        </p>
        <p className="text-sm text-gray-300">
          Device kamu akan tampak retina dari jarak terdekat{" "}
          {result.retinaDistance?.toFixed(2) || 0} inch
        </p>
      </div>
    </main>
  );
}
