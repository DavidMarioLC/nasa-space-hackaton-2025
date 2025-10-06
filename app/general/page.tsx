import { useAuthStore } from "@/store";
import {
  AirQualityHeatMap,
  AirQuality,
  AirForecast,
  AirQualityRecommendations,
  AirLegendTable,
  AirHistory,
  AirPollutant,
} from "@/widgets";

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-10 gap-4 ">
        {/* row 1 */}
        <div className="col-span-10 sm:col-span-5 md:col-span-3">
          <AirQuality />
        </div>
        <div className="col-span-10 sm:col-span-5 md:col-span-3">
          <AirLegendTable />
        </div>

        <div className="col-span-10 sm:col-span-5 md:col-span-4">
          <AirForecast />
        </div>

        {/* row 2 */}
        <div className="col-span-10  md:col-span-6">
          <AirQualityHeatMap />
        </div>
        <div className="col-span-10  md:col-span-4">
          <AirQualityRecommendations />
        </div>
        <div className="col-span-10  md:col-span-4">
          <AirHistory />
        </div>
        <div className="col-span-10  md:col-span-6">
          <AirPollutant />
        </div>
      </div>
    </div>
  );
}
