type CityOption = {
  id: number;
  name: string;
};

type CitySelectorProps = {
  cities: CityOption[];
  selectedCityId: number | "";
  onChange: (value: number | "") => void;
};

export default function CitySelector({
  cities,
  selectedCityId,
  onChange,
}: CitySelectorProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        City
      </label>

      <select
        value={selectedCityId}
        onChange={(e) =>
          onChange(e.target.value ? Number(e.target.value) : "")
        }
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
      >
        <option value="">Select a city</option>
        {cities.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>
    </div>
  );
}