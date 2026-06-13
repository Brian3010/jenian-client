import ShiftCalculatorCard from '@/features/shift/components/ShiftCalculatorCard';
import TelegramIntegrationCard from '@/features/telegram/components/TelegramIntegrationCard';
import { cookies } from 'next/headers';

type Weather = {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
  current_units: {
    temperature_2m: string;
  };
};
async function getMelbourneWeather() {
  const res = await fetch(
    'https://api.open-meteo.com/v1/forecast?latitude=-37.8136&longitude=144.9631&current=temperature_2m,weather_code&timezone=Australia%2FMelbourne',
    {
      next: { revalidate: 900 },
    },
  );

  if (!res.ok) return null;

  return res.json() as Promise<Weather>;
}

function getWeatherLabel(code: number) {
  if (code === 0) return 'Clear';
  if ([1, 2, 3].includes(code)) return 'Cloudy';
  if ([45, 48].includes(code)) return 'Fog';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
  if ([61, 63, 65, 66, 67].includes(code)) return 'Rain';
  if ([80, 81, 82].includes(code)) return 'Showers';
  if ([95, 96, 99].includes(code)) return 'Storm';

  return 'Weather';
}

export default async function Dashboard() {
  const cookieStore = await cookies();
  const weather = await getMelbourneWeather();
  return (
    <div className="w-full p-3">
      <div className="pb-4">
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-AU', {
            timeZone: 'Australia/Melbourne',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </p>

        <h1 className="mt-1 text-lg font-semibold text-gray-900">
          Hello, {cookieStore.get('userName')?.value ?? 'there'}
        </h1>

        {weather && (
          <p className="mt-1 text-sm text-gray-600">
            Melbourne · {Math.round(weather.current.temperature_2m)}
            {weather.current_units.temperature_2m} · {getWeatherLabel(weather.current.weather_code)}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TelegramIntegrationCard />
        <ShiftCalculatorCard />
      </div>
    </div>
  );
}
