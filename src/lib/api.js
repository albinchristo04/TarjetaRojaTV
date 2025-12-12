const DATA_URL = 'https://raw.githubusercontent.com/albinchristo04/TarjetaRojaTV/main/events.json';

export async function getEvents() {
    try {
        const res = await fetch(DATA_URL);
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching events:", error);
        // In development or if fetch fails, one might want to fallback to local import if possible,
        // but for now we return null or empty structure.
        return null;
    }
}
