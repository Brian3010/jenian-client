type Weather = {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
  current_units: {
    temperature_2m: string;
  };
};
export async function getMelbourneWeather() {
  const res = await fetch(
    'https://api.open-meteo.com/v1/forecast?latitude=-37.8136&longitude=144.9631&current=temperature_2m,weather_code&timezone=Australia%2FMelbourne',
    {
      next: { revalidate: 900 },
    },
  );

  if (!res.ok) return null;

  return res.json() as Promise<Weather>;
}

export function getWeatherLabel(code: number) {
  if (code === 0) return 'Clear';
  if ([1, 2, 3].includes(code)) return 'Cloudy';
  if ([45, 48].includes(code)) return 'Fog';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
  if ([61, 63, 65, 66, 67].includes(code)) return 'Rain';
  if ([80, 81, 82].includes(code)) return 'Showers';
  if ([95, 96, 99].includes(code)) return 'Storm';

  return 'Weather';
}
