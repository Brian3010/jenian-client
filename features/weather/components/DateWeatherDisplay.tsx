import { getMelbourneWeather, getWeatherLabel } from '@/features/weather/getWeather';

export default async function DateWeatherDisplay() {
  const weather = await getMelbourneWeather();

  return (
    <div className="pb-4">
      <p className="text-sm text-gray-500">
        {new Date().toLocaleDateString('en-AU', {
          timeZone: 'Australia/Melbourne',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}
      </p>

      {weather && (
        <p className="mt-1 text-sm text-gray-600">
          Melbourne · {Math.round(weather.current.temperature_2m)}
          {weather.current_units.temperature_2m} · {getWeatherLabel(weather.current.weather_code)}
        </p>
      )}
    </div>
  );
}
