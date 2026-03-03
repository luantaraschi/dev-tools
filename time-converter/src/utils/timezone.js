// Default timezone
export const DEFAULT_TIMEZONE = 'Europe/Istanbul';
export const DEFAULT_CITY = 'Ankara';
export const DEFAULT_KEY = 'ankara-turkiye';

// Helper to create unique key
const createKey = (city, country) =>
  `${city.toLowerCase().replace(/\s+/g, '-')}-${country.toLowerCase().replace(/\s+/g, '-')}`;

// All major cities with 2M+ population, sorted by timezone offset
const TIMEZONES_RAW = [
  // UTC-12 to UTC-11

  // UTC-10 (Hawaii)
  { id: 'Pacific/Honolulu', city: 'Honolulu', country: 'USA', abbr: 'HST', offset: -10 },

  // UTC-9 (Alaska)
  { id: 'America/Anchorage', city: 'Anchorage', country: 'USA', abbr: 'AKST', offset: -9 },

  // UTC-8 (Pacific)
  { id: 'America/Los_Angeles', city: 'Los Angeles', country: 'USA', abbr: 'PST', offset: -8 },
  { id: 'America/Vancouver', city: 'Vancouver', country: 'Canada', abbr: 'PST', offset: -8 },
  { id: 'America/Tijuana', city: 'Tijuana', country: 'Mexico', abbr: 'PST', offset: -8 },
  { id: 'America/Los_Angeles', city: 'San Francisco', country: 'USA', abbr: 'PST', offset: -8 },
  { id: 'America/Los_Angeles', city: 'San Diego', country: 'USA', abbr: 'PST', offset: -8 },
  { id: 'America/Los_Angeles', city: 'Seattle', country: 'USA', abbr: 'PST', offset: -8 },

  // UTC-7 (Mountain)
  { id: 'America/Denver', city: 'Denver', country: 'USA', abbr: 'MST', offset: -7 },
  { id: 'America/Phoenix', city: 'Phoenix', country: 'USA', abbr: 'MST', offset: -7 },
  { id: 'America/Edmonton', city: 'Calgary', country: 'Canada', abbr: 'MST', offset: -7 },

  // UTC-6 (Central)
  { id: 'America/Chicago', city: 'Chicago', country: 'USA', abbr: 'CST', offset: -6 },
  { id: 'America/Mexico_City', city: 'Mexico City', country: 'Mexico', abbr: 'CST', offset: -6 },
  { id: 'America/Chicago', city: 'Houston', country: 'USA', abbr: 'CST', offset: -6 },
  { id: 'America/Chicago', city: 'Dallas', country: 'USA', abbr: 'CST', offset: -6 },
  { id: 'America/Chicago', city: 'San Antonio', country: 'USA', abbr: 'CST', offset: -6 },
  { id: 'America/Chicago', city: 'Austin', country: 'USA', abbr: 'CST', offset: -6 },
  { id: 'America/Guatemala', city: 'Guatemala City', country: 'Guatemala', abbr: 'CST', offset: -6 },
  { id: 'America/Monterrey', city: 'Monterrey', country: 'Mexico', abbr: 'CST', offset: -6 },
  { id: 'America/Mexico_City', city: 'Guadalajara', country: 'Mexico', abbr: 'CST', offset: -6 },
  { id: 'America/Mexico_City', city: 'Puebla', country: 'Mexico', abbr: 'CST', offset: -6 },

  // UTC-5 (Eastern)
  { id: 'America/New_York', city: 'New York', country: 'USA', abbr: 'EST', offset: -5 },
  { id: 'America/Toronto', city: 'Toronto', country: 'Canada', abbr: 'EST', offset: -5 },
  { id: 'America/New_York', city: 'Philadelphia', country: 'USA', abbr: 'EST', offset: -5 },
  { id: 'America/New_York', city: 'Washington DC', country: 'USA', abbr: 'EST', offset: -5 },
  { id: 'America/New_York', city: 'Miami', country: 'USA', abbr: 'EST', offset: -5 },
  { id: 'America/New_York', city: 'Atlanta', country: 'USA', abbr: 'EST', offset: -5 },
  { id: 'America/New_York', city: 'Boston', country: 'USA', abbr: 'EST', offset: -5 },
  { id: 'America/New_York', city: 'Detroit', country: 'USA', abbr: 'EST', offset: -5 },
  { id: 'America/Bogota', city: 'Bogota', country: 'Colombia', abbr: 'COT', offset: -5 },
  { id: 'America/Lima', city: 'Lima', country: 'Peru', abbr: 'PET', offset: -5 },
  { id: 'America/Panama', city: 'Panama City', country: 'Panama', abbr: 'EST', offset: -5 },
  { id: 'America/Havana', city: 'Havana', country: 'Cuba', abbr: 'CST', offset: -5 },
  { id: 'America/Toronto', city: 'Montreal', country: 'Canada', abbr: 'EST', offset: -5 },
  { id: 'America/Bogota', city: 'Medellin', country: 'Colombia', abbr: 'COT', offset: -5 },
  { id: 'America/Bogota', city: 'Cali', country: 'Colombia', abbr: 'COT', offset: -5 },
  { id: 'America/Guayaquil', city: 'Guayaquil', country: 'Ecuador', abbr: 'ECT', offset: -5 },
  { id: 'America/Guayaquil', city: 'Quito', country: 'Ecuador', abbr: 'ECT', offset: -5 },

  // UTC-4 (Atlantic)
  { id: 'America/Caracas', city: 'Caracas', country: 'Venezuela', abbr: 'VET', offset: -4 },
  { id: 'America/Santiago', city: 'Santiago', country: 'Chile', abbr: 'CLT', offset: -4 },
  { id: 'America/La_Paz', city: 'La Paz', country: 'Bolivia', abbr: 'BOT', offset: -4 },
  { id: 'America/Santo_Domingo', city: 'Santo Domingo', country: 'Dominican Rep.', abbr: 'AST', offset: -4 },
  { id: 'America/Asuncion', city: 'Asuncion', country: 'Paraguay', abbr: 'PYT', offset: -4 },
  { id: 'America/Caracas', city: 'Maracaibo', country: 'Venezuela', abbr: 'VET', offset: -4 },

  // UTC-3 (Brazil/Argentina)
  { id: 'America/Sao_Paulo', city: 'Sao Paulo', country: 'Brazil', abbr: 'BRT', offset: -3 },
  { id: 'America/Argentina/Buenos_Aires', city: 'Buenos Aires', country: 'Argentina', abbr: 'ART', offset: -3 },
  { id: 'America/Sao_Paulo', city: 'Rio de Janeiro', country: 'Brazil', abbr: 'BRT', offset: -3 },
  { id: 'America/Fortaleza', city: 'Fortaleza', country: 'Brazil', abbr: 'BRT', offset: -3 },
  { id: 'America/Sao_Paulo', city: 'Belo Horizonte', country: 'Brazil', abbr: 'BRT', offset: -3 },
  { id: 'America/Recife', city: 'Recife', country: 'Brazil', abbr: 'BRT', offset: -3 },
  { id: 'America/Bahia', city: 'Salvador', country: 'Brazil', abbr: 'BRT', offset: -3 },
  { id: 'America/Sao_Paulo', city: 'Brasilia', country: 'Brazil', abbr: 'BRT', offset: -3 },
  { id: 'America/Sao_Paulo', city: 'Curitiba', country: 'Brazil', abbr: 'BRT', offset: -3 },
  { id: 'America/Montevideo', city: 'Montevideo', country: 'Uruguay', abbr: 'UYT', offset: -3 },
  { id: 'America/Argentina/Buenos_Aires', city: 'Cordoba', country: 'Argentina', abbr: 'ART', offset: -3 },
  { id: 'America/Argentina/Buenos_Aires', city: 'Rosario', country: 'Argentina', abbr: 'ART', offset: -3 },

  // UTC-2

  // UTC-1

  // UTC+0 (GMT)
  { id: 'Europe/London', city: 'London', country: 'UK', abbr: 'GMT', offset: 0 },
  { id: 'Africa/Casablanca', city: 'Casablanca', country: 'Morocco', abbr: 'WET', offset: 0 },
  { id: 'Europe/Lisbon', city: 'Lisbon', country: 'Portugal', abbr: 'WET', offset: 0 },
  { id: 'Africa/Accra', city: 'Accra', country: 'Ghana', abbr: 'GMT', offset: 0 },
  { id: 'Africa/Abidjan', city: 'Abidjan', country: 'Ivory Coast', abbr: 'GMT', offset: 0 },
  { id: 'Europe/Dublin', city: 'Dublin', country: 'Ireland', abbr: 'GMT', offset: 0 },
  { id: 'Africa/Dakar', city: 'Dakar', country: 'Senegal', abbr: 'GMT', offset: 0 },

  // UTC+1 (Central Europe)
  { id: 'Europe/Paris', city: 'Paris', country: 'France', abbr: 'CET', offset: 1 },
  { id: 'Europe/Berlin', city: 'Berlin', country: 'Germany', abbr: 'CET', offset: 1 },
  { id: 'Europe/Madrid', city: 'Madrid', country: 'Spain', abbr: 'CET', offset: 1 },
  { id: 'Europe/Rome', city: 'Rome', country: 'Italy', abbr: 'CET', offset: 1 },
  { id: 'Europe/Amsterdam', city: 'Amsterdam', country: 'Netherlands', abbr: 'CET', offset: 1 },
  { id: 'Europe/Brussels', city: 'Brussels', country: 'Belgium', abbr: 'CET', offset: 1 },
  { id: 'Europe/Vienna', city: 'Vienna', country: 'Austria', abbr: 'CET', offset: 1 },
  { id: 'Europe/Warsaw', city: 'Warsaw', country: 'Poland', abbr: 'CET', offset: 1 },
  { id: 'Europe/Budapest', city: 'Budapest', country: 'Hungary', abbr: 'CET', offset: 1 },
  { id: 'Europe/Prague', city: 'Prague', country: 'Czech Republic', abbr: 'CET', offset: 1 },
  { id: 'Europe/Stockholm', city: 'Stockholm', country: 'Sweden', abbr: 'CET', offset: 1 },
  { id: 'Europe/Copenhagen', city: 'Copenhagen', country: 'Denmark', abbr: 'CET', offset: 1 },
  { id: 'Europe/Oslo', city: 'Oslo', country: 'Norway', abbr: 'CET', offset: 1 },
  { id: 'Europe/Zurich', city: 'Zurich', country: 'Switzerland', abbr: 'CET', offset: 1 },
  { id: 'Europe/Rome', city: 'Milan', country: 'Italy', abbr: 'CET', offset: 1 },
  { id: 'Europe/Madrid', city: 'Barcelona', country: 'Spain', abbr: 'CET', offset: 1 },
  { id: 'Europe/Berlin', city: 'Munich', country: 'Germany', abbr: 'CET', offset: 1 },
  { id: 'Europe/Berlin', city: 'Frankfurt', country: 'Germany', abbr: 'CET', offset: 1 },
  { id: 'Europe/Berlin', city: 'Hamburg', country: 'Germany', abbr: 'CET', offset: 1 },
  { id: 'Africa/Lagos', city: 'Lagos', country: 'Nigeria', abbr: 'WAT', offset: 1 },
  { id: 'Africa/Lagos', city: 'Kano', country: 'Nigeria', abbr: 'WAT', offset: 1 },
  { id: 'Africa/Lagos', city: 'Ibadan', country: 'Nigeria', abbr: 'WAT', offset: 1 },
  { id: 'Africa/Douala', city: 'Douala', country: 'Cameroon', abbr: 'WAT', offset: 1 },
  { id: 'Africa/Douala', city: 'Yaounde', country: 'Cameroon', abbr: 'WAT', offset: 1 },
  { id: 'Africa/Kinshasa', city: 'Kinshasa', country: 'DR Congo', abbr: 'WAT', offset: 1 },
  { id: 'Africa/Luanda', city: 'Luanda', country: 'Angola', abbr: 'WAT', offset: 1 },
  { id: 'Africa/Algiers', city: 'Algiers', country: 'Algeria', abbr: 'CET', offset: 1 },
  { id: 'Africa/Tunis', city: 'Tunis', country: 'Tunisia', abbr: 'CET', offset: 1 },

  // UTC+2 (Eastern Europe)
  { id: 'Europe/Athens', city: 'Athens', country: 'Greece', abbr: 'EET', offset: 2 },
  { id: 'Europe/Bucharest', city: 'Bucharest', country: 'Romania', abbr: 'EET', offset: 2 },
  { id: 'Europe/Helsinki', city: 'Helsinki', country: 'Finland', abbr: 'EET', offset: 2 },
  { id: 'Europe/Kiev', city: 'Kyiv', country: 'Ukraine', abbr: 'EET', offset: 2 },
  { id: 'Africa/Cairo', city: 'Cairo', country: 'Egypt', abbr: 'EET', offset: 2 },
  { id: 'Africa/Johannesburg', city: 'Johannesburg', country: 'South Africa', abbr: 'SAST', offset: 2 },
  { id: 'Africa/Johannesburg', city: 'Cape Town', country: 'South Africa', abbr: 'SAST', offset: 2 },
  { id: 'Africa/Johannesburg', city: 'Durban', country: 'South Africa', abbr: 'SAST', offset: 2 },
  { id: 'Africa/Johannesburg', city: 'Pretoria', country: 'South Africa', abbr: 'SAST', offset: 2 },
  { id: 'Asia/Jerusalem', city: 'Tel Aviv', country: 'Israel', abbr: 'IST', offset: 2 },
  { id: 'Asia/Jerusalem', city: 'Jerusalem', country: 'Israel', abbr: 'IST', offset: 2 },
  { id: 'Asia/Beirut', city: 'Beirut', country: 'Lebanon', abbr: 'EET', offset: 2 },
  { id: 'Asia/Amman', city: 'Amman', country: 'Jordan', abbr: 'EET', offset: 2 },
  { id: 'Asia/Damascus', city: 'Damascus', country: 'Syria', abbr: 'EET', offset: 2 },
  { id: 'Africa/Cairo', city: 'Alexandria', country: 'Egypt', abbr: 'EET', offset: 2 },
  { id: 'Africa/Cairo', city: 'Giza', country: 'Egypt', abbr: 'EET', offset: 2 },
  { id: 'Africa/Harare', city: 'Harare', country: 'Zimbabwe', abbr: 'CAT', offset: 2 },
  { id: 'Africa/Maputo', city: 'Maputo', country: 'Mozambique', abbr: 'CAT', offset: 2 },
  { id: 'Africa/Lubumbashi', city: 'Lubumbashi', country: 'DR Congo', abbr: 'CAT', offset: 2 },
  { id: 'Africa/Khartoum', city: 'Khartoum', country: 'Sudan', abbr: 'CAT', offset: 2 },

  // UTC+3 (Turkey, Moscow, Middle East)
  { id: 'Europe/Istanbul', city: 'Istanbul', country: 'Türkiye', abbr: 'TRT', offset: 3, isDefault: true },
  { id: 'Europe/Istanbul', city: 'Ankara', country: 'Türkiye', abbr: 'TRT', offset: 3 },
  { id: 'Europe/Istanbul', city: 'Izmir', country: 'Türkiye', abbr: 'TRT', offset: 3 },
  { id: 'Europe/Istanbul', city: 'Bursa', country: 'Türkiye', abbr: 'TRT', offset: 3 },
  { id: 'Europe/Istanbul', city: 'Antalya', country: 'Türkiye', abbr: 'TRT', offset: 3 },
  { id: 'Europe/Moscow', city: 'Moscow', country: 'Russia', abbr: 'MSK', offset: 3 },
  { id: 'Europe/Moscow', city: 'St Petersburg', country: 'Russia', abbr: 'MSK', offset: 3 },
  { id: 'Asia/Riyadh', city: 'Riyadh', country: 'Saudi Arabia', abbr: 'AST', offset: 3 },
  { id: 'Asia/Riyadh', city: 'Jeddah', country: 'Saudi Arabia', abbr: 'AST', offset: 3 },
  { id: 'Asia/Riyadh', city: 'Mecca', country: 'Saudi Arabia', abbr: 'AST', offset: 3 },
  { id: 'Asia/Riyadh', city: 'Medina', country: 'Saudi Arabia', abbr: 'AST', offset: 3 },
  { id: 'Asia/Baghdad', city: 'Baghdad', country: 'Iraq', abbr: 'AST', offset: 3 },
  { id: 'Asia/Baghdad', city: 'Basra', country: 'Iraq', abbr: 'AST', offset: 3 },
  { id: 'Asia/Kuwait', city: 'Kuwait City', country: 'Kuwait', abbr: 'AST', offset: 3 },
  { id: 'Asia/Qatar', city: 'Doha', country: 'Qatar', abbr: 'AST', offset: 3 },
  { id: 'Asia/Bahrain', city: 'Manama', country: 'Bahrain', abbr: 'AST', offset: 3 },
  { id: 'Africa/Nairobi', city: 'Nairobi', country: 'Kenya', abbr: 'EAT', offset: 3 },
  { id: 'Africa/Addis_Ababa', city: 'Addis Ababa', country: 'Ethiopia', abbr: 'EAT', offset: 3 },
  { id: 'Africa/Dar_es_Salaam', city: 'Dar es Salaam', country: 'Tanzania', abbr: 'EAT', offset: 3 },
  { id: 'Africa/Kampala', city: 'Kampala', country: 'Uganda', abbr: 'EAT', offset: 3 },
  { id: 'Asia/Aden', city: 'Sanaa', country: 'Yemen', abbr: 'AST', offset: 3 },

  // UTC+3:30 (Iran)
  { id: 'Asia/Tehran', city: 'Tehran', country: 'Iran', abbr: 'IRST', offset: 3.5 },
  { id: 'Asia/Tehran', city: 'Mashhad', country: 'Iran', abbr: 'IRST', offset: 3.5 },
  { id: 'Asia/Tehran', city: 'Isfahan', country: 'Iran', abbr: 'IRST', offset: 3.5 },
  { id: 'Asia/Tehran', city: 'Shiraz', country: 'Iran', abbr: 'IRST', offset: 3.5 },
  { id: 'Asia/Tehran', city: 'Tabriz', country: 'Iran', abbr: 'IRST', offset: 3.5 },

  // UTC+4 (Gulf)
  { id: 'Asia/Dubai', city: 'Dubai', country: 'UAE', abbr: 'GST', offset: 4 },
  { id: 'Asia/Dubai', city: 'Abu Dhabi', country: 'UAE', abbr: 'GST', offset: 4 },
  { id: 'Asia/Dubai', city: 'Sharjah', country: 'UAE', abbr: 'GST', offset: 4 },
  { id: 'Asia/Muscat', city: 'Muscat', country: 'Oman', abbr: 'GST', offset: 4 },
  { id: 'Asia/Baku', city: 'Baku', country: 'Azerbaijan', abbr: 'AZT', offset: 4 },
  { id: 'Asia/Yerevan', city: 'Yerevan', country: 'Armenia', abbr: 'AMT', offset: 4 },
  { id: 'Asia/Tbilisi', city: 'Tbilisi', country: 'Georgia', abbr: 'GET', offset: 4 },
  { id: 'Indian/Mauritius', city: 'Port Louis', country: 'Mauritius', abbr: 'MUT', offset: 4 },

  // UTC+4:30 (Afghanistan)
  { id: 'Asia/Kabul', city: 'Kabul', country: 'Afghanistan', abbr: 'AFT', offset: 4.5 },

  // UTC+5 (Pakistan, Central Asia)
  { id: 'Asia/Karachi', city: 'Karachi', country: 'Pakistan', abbr: 'PKT', offset: 5 },
  { id: 'Asia/Karachi', city: 'Lahore', country: 'Pakistan', abbr: 'PKT', offset: 5 },
  { id: 'Asia/Karachi', city: 'Faisalabad', country: 'Pakistan', abbr: 'PKT', offset: 5 },
  { id: 'Asia/Karachi', city: 'Rawalpindi', country: 'Pakistan', abbr: 'PKT', offset: 5 },
  { id: 'Asia/Karachi', city: 'Multan', country: 'Pakistan', abbr: 'PKT', offset: 5 },
  { id: 'Asia/Karachi', city: 'Islamabad', country: 'Pakistan', abbr: 'PKT', offset: 5 },
  { id: 'Asia/Tashkent', city: 'Tashkent', country: 'Uzbekistan', abbr: 'UZT', offset: 5 },
  { id: 'Asia/Yekaterinburg', city: 'Yekaterinburg', country: 'Russia', abbr: 'YEKT', offset: 5 },
  { id: 'Indian/Maldives', city: 'Male', country: 'Maldives', abbr: 'MVT', offset: 5 },

  // UTC+5:30 (India, Sri Lanka)
  { id: 'Asia/Kolkata', city: 'Mumbai', country: 'India', abbr: 'IST', offset: 5.5 },
  { id: 'Asia/Kolkata', city: 'Delhi', country: 'India', abbr: 'IST', offset: 5.5 },
  { id: 'Asia/Kolkata', city: 'Bangalore', country: 'India', abbr: 'IST', offset: 5.5 },
  { id: 'Asia/Kolkata', city: 'Hyderabad', country: 'India', abbr: 'IST', offset: 5.5 },
  { id: 'Asia/Kolkata', city: 'Chennai', country: 'India', abbr: 'IST', offset: 5.5 },
  { id: 'Asia/Kolkata', city: 'Kolkata', country: 'India', abbr: 'IST', offset: 5.5 },
  { id: 'Asia/Kolkata', city: 'Ahmedabad', country: 'India', abbr: 'IST', offset: 5.5 },
  { id: 'Asia/Kolkata', city: 'Pune', country: 'India', abbr: 'IST', offset: 5.5 },
  { id: 'Asia/Kolkata', city: 'Surat', country: 'India', abbr: 'IST', offset: 5.5 },
  { id: 'Asia/Kolkata', city: 'Jaipur', country: 'India', abbr: 'IST', offset: 5.5 },
  { id: 'Asia/Kolkata', city: 'Lucknow', country: 'India', abbr: 'IST', offset: 5.5 },
  { id: 'Asia/Kolkata', city: 'Kanpur', country: 'India', abbr: 'IST', offset: 5.5 },
  { id: 'Asia/Kolkata', city: 'Nagpur', country: 'India', abbr: 'IST', offset: 5.5 },
  { id: 'Asia/Kolkata', city: 'Indore', country: 'India', abbr: 'IST', offset: 5.5 },
  { id: 'Asia/Kolkata', city: 'Bhopal', country: 'India', abbr: 'IST', offset: 5.5 },
  { id: 'Asia/Kolkata', city: 'Patna', country: 'India', abbr: 'IST', offset: 5.5 },
  { id: 'Asia/Kolkata', city: 'Vadodara', country: 'India', abbr: 'IST', offset: 5.5 },
  { id: 'Asia/Colombo', city: 'Colombo', country: 'Sri Lanka', abbr: 'IST', offset: 5.5 },

  // UTC+5:45 (Nepal)
  { id: 'Asia/Kathmandu', city: 'Kathmandu', country: 'Nepal', abbr: 'NPT', offset: 5.75 },

  // UTC+6 (Bangladesh, Central Asia)
  { id: 'Asia/Dhaka', city: 'Dhaka', country: 'Bangladesh', abbr: 'BST', offset: 6 },
  { id: 'Asia/Dhaka', city: 'Chittagong', country: 'Bangladesh', abbr: 'BST', offset: 6 },
  { id: 'Asia/Dhaka', city: 'Khulna', country: 'Bangladesh', abbr: 'BST', offset: 6 },
  { id: 'Asia/Almaty', city: 'Almaty', country: 'Kazakhstan', abbr: 'ALMT', offset: 6 },
  { id: 'Asia/Omsk', city: 'Omsk', country: 'Russia', abbr: 'OMST', offset: 6 },

  // UTC+6:30 (Myanmar)
  { id: 'Asia/Yangon', city: 'Yangon', country: 'Myanmar', abbr: 'MMT', offset: 6.5 },
  { id: 'Asia/Yangon', city: 'Mandalay', country: 'Myanmar', abbr: 'MMT', offset: 6.5 },

  // UTC+7 (Indochina)
  { id: 'Asia/Bangkok', city: 'Bangkok', country: 'Thailand', abbr: 'ICT', offset: 7 },
  { id: 'Asia/Ho_Chi_Minh', city: 'Ho Chi Minh', country: 'Vietnam', abbr: 'ICT', offset: 7 },
  { id: 'Asia/Ho_Chi_Minh', city: 'Hanoi', country: 'Vietnam', abbr: 'ICT', offset: 7 },
  { id: 'Asia/Jakarta', city: 'Jakarta', country: 'Indonesia', abbr: 'WIB', offset: 7 },
  { id: 'Asia/Jakarta', city: 'Surabaya', country: 'Indonesia', abbr: 'WIB', offset: 7 },
  { id: 'Asia/Jakarta', city: 'Bandung', country: 'Indonesia', abbr: 'WIB', offset: 7 },
  { id: 'Asia/Jakarta', city: 'Medan', country: 'Indonesia', abbr: 'WIB', offset: 7 },
  { id: 'Asia/Jakarta', city: 'Semarang', country: 'Indonesia', abbr: 'WIB', offset: 7 },
  { id: 'Asia/Jakarta', city: 'Palembang', country: 'Indonesia', abbr: 'WIB', offset: 7 },
  { id: 'Asia/Phnom_Penh', city: 'Phnom Penh', country: 'Cambodia', abbr: 'ICT', offset: 7 },
  { id: 'Asia/Vientiane', city: 'Vientiane', country: 'Laos', abbr: 'ICT', offset: 7 },
  { id: 'Asia/Krasnoyarsk', city: 'Krasnoyarsk', country: 'Russia', abbr: 'KRAT', offset: 7 },
  { id: 'Asia/Novosibirsk', city: 'Novosibirsk', country: 'Russia', abbr: 'NOVT', offset: 7 },

  // UTC+8 (China, Singapore, Malaysia, Philippines)
  { id: 'Asia/Shanghai', city: 'Shanghai', country: 'China', abbr: 'CST', offset: 8 },
  { id: 'Asia/Shanghai', city: 'Beijing', country: 'China', abbr: 'CST', offset: 8 },
  { id: 'Asia/Shanghai', city: 'Guangzhou', country: 'China', abbr: 'CST', offset: 8 },
  { id: 'Asia/Shanghai', city: 'Shenzhen', country: 'China', abbr: 'CST', offset: 8 },
  { id: 'Asia/Shanghai', city: 'Chengdu', country: 'China', abbr: 'CST', offset: 8 },
  { id: 'Asia/Shanghai', city: 'Chongqing', country: 'China', abbr: 'CST', offset: 8 },
  { id: 'Asia/Shanghai', city: 'Tianjin', country: 'China', abbr: 'CST', offset: 8 },
  { id: 'Asia/Shanghai', city: 'Wuhan', country: 'China', abbr: 'CST', offset: 8 },
  { id: 'Asia/Shanghai', city: 'Dongguan', country: 'China', abbr: 'CST', offset: 8 },
  { id: 'Asia/Shanghai', city: 'Nanjing', country: 'China', abbr: 'CST', offset: 8 },
  { id: 'Asia/Shanghai', city: 'Xian', country: 'China', abbr: 'CST', offset: 8 },
  { id: 'Asia/Shanghai', city: 'Hangzhou', country: 'China', abbr: 'CST', offset: 8 },
  { id: 'Asia/Shanghai', city: 'Suzhou', country: 'China', abbr: 'CST', offset: 8 },
  { id: 'Asia/Shanghai', city: 'Harbin', country: 'China', abbr: 'CST', offset: 8 },
  { id: 'Asia/Shanghai', city: 'Shenyang', country: 'China', abbr: 'CST', offset: 8 },
  { id: 'Asia/Shanghai', city: 'Qingdao', country: 'China', abbr: 'CST', offset: 8 },
  { id: 'Asia/Shanghai', city: 'Dalian', country: 'China', abbr: 'CST', offset: 8 },
  { id: 'Asia/Shanghai', city: 'Zhengzhou', country: 'China', abbr: 'CST', offset: 8 },
  { id: 'Asia/Shanghai', city: 'Jinan', country: 'China', abbr: 'CST', offset: 8 },
  { id: 'Asia/Shanghai', city: 'Changsha', country: 'China', abbr: 'CST', offset: 8 },
  { id: 'Asia/Shanghai', city: 'Kunming', country: 'China', abbr: 'CST', offset: 8 },
  { id: 'Asia/Shanghai', city: 'Foshan', country: 'China', abbr: 'CST', offset: 8 },
  { id: 'Asia/Shanghai', city: 'Fuzhou', country: 'China', abbr: 'CST', offset: 8 },
  { id: 'Asia/Shanghai', city: 'Xiamen', country: 'China', abbr: 'CST', offset: 8 },
  { id: 'Asia/Hong_Kong', city: 'Hong Kong', country: 'Hong Kong', abbr: 'HKT', offset: 8 },
  { id: 'Asia/Taipei', city: 'Taipei', country: 'Taiwan', abbr: 'CST', offset: 8 },
  { id: 'Asia/Taipei', city: 'Kaohsiung', country: 'Taiwan', abbr: 'CST', offset: 8 },
  { id: 'Asia/Singapore', city: 'Singapore', country: 'Singapore', abbr: 'SGT', offset: 8 },
  { id: 'Asia/Kuala_Lumpur', city: 'Kuala Lumpur', country: 'Malaysia', abbr: 'MYT', offset: 8 },
  { id: 'Asia/Kuala_Lumpur', city: 'Johor Bahru', country: 'Malaysia', abbr: 'MYT', offset: 8 },
  { id: 'Asia/Manila', city: 'Manila', country: 'Philippines', abbr: 'PHT', offset: 8 },
  { id: 'Asia/Manila', city: 'Quezon City', country: 'Philippines', abbr: 'PHT', offset: 8 },
  { id: 'Asia/Manila', city: 'Davao', country: 'Philippines', abbr: 'PHT', offset: 8 },
  { id: 'Asia/Manila', city: 'Cebu City', country: 'Philippines', abbr: 'PHT', offset: 8 },
  { id: 'Asia/Makassar', city: 'Makassar', country: 'Indonesia', abbr: 'WITA', offset: 8 },
  { id: 'Asia/Irkutsk', city: 'Irkutsk', country: 'Russia', abbr: 'IRKT', offset: 8 },
  { id: 'Australia/Perth', city: 'Perth', country: 'Australia', abbr: 'AWST', offset: 8 },

  // UTC+9 (Japan, Korea)
  { id: 'Asia/Tokyo', city: 'Tokyo', country: 'Japan', abbr: 'JST', offset: 9 },
  { id: 'Asia/Tokyo', city: 'Osaka', country: 'Japan', abbr: 'JST', offset: 9 },
  { id: 'Asia/Tokyo', city: 'Nagoya', country: 'Japan', abbr: 'JST', offset: 9 },
  { id: 'Asia/Tokyo', city: 'Yokohama', country: 'Japan', abbr: 'JST', offset: 9 },
  { id: 'Asia/Tokyo', city: 'Fukuoka', country: 'Japan', abbr: 'JST', offset: 9 },
  { id: 'Asia/Tokyo', city: 'Sapporo', country: 'Japan', abbr: 'JST', offset: 9 },
  { id: 'Asia/Tokyo', city: 'Kobe', country: 'Japan', abbr: 'JST', offset: 9 },
  { id: 'Asia/Tokyo', city: 'Kyoto', country: 'Japan', abbr: 'JST', offset: 9 },
  { id: 'Asia/Seoul', city: 'Seoul', country: 'South Korea', abbr: 'KST', offset: 9 },
  { id: 'Asia/Seoul', city: 'Busan', country: 'South Korea', abbr: 'KST', offset: 9 },
  { id: 'Asia/Seoul', city: 'Incheon', country: 'South Korea', abbr: 'KST', offset: 9 },
  { id: 'Asia/Seoul', city: 'Daegu', country: 'South Korea', abbr: 'KST', offset: 9 },
  { id: 'Asia/Pyongyang', city: 'Pyongyang', country: 'North Korea', abbr: 'KST', offset: 9 },
  { id: 'Asia/Yakutsk', city: 'Yakutsk', country: 'Russia', abbr: 'YAKT', offset: 9 },

  // UTC+9:30 (Central Australia)
  { id: 'Australia/Adelaide', city: 'Adelaide', country: 'Australia', abbr: 'ACST', offset: 9.5 },
  { id: 'Australia/Darwin', city: 'Darwin', country: 'Australia', abbr: 'ACST', offset: 9.5 },

  // UTC+10 (Eastern Australia, Papua New Guinea)
  { id: 'Australia/Sydney', city: 'Sydney', country: 'Australia', abbr: 'AEST', offset: 10 },
  { id: 'Australia/Melbourne', city: 'Melbourne', country: 'Australia', abbr: 'AEST', offset: 10 },
  { id: 'Australia/Brisbane', city: 'Brisbane', country: 'Australia', abbr: 'AEST', offset: 10 },
  { id: 'Pacific/Port_Moresby', city: 'Port Moresby', country: 'Papua New Guinea', abbr: 'PGT', offset: 10 },
  { id: 'Pacific/Guam', city: 'Guam', country: 'USA', abbr: 'ChST', offset: 10 },
  { id: 'Asia/Vladivostok', city: 'Vladivostok', country: 'Russia', abbr: 'VLAT', offset: 10 },

  // UTC+11
  { id: 'Pacific/Noumea', city: 'Noumea', country: 'New Caledonia', abbr: 'NCT', offset: 11 },
  { id: 'Asia/Magadan', city: 'Magadan', country: 'Russia', abbr: 'MAGT', offset: 11 },

  // UTC+12 (New Zealand, Fiji)
  { id: 'Pacific/Auckland', city: 'Auckland', country: 'New Zealand', abbr: 'NZST', offset: 12 },
  { id: 'Pacific/Auckland', city: 'Wellington', country: 'New Zealand', abbr: 'NZST', offset: 12 },
  { id: 'Pacific/Fiji', city: 'Suva', country: 'Fiji', abbr: 'FJT', offset: 12 },
  { id: 'Asia/Kamchatka', city: 'Petropavlovsk', country: 'Russia', abbr: 'PETT', offset: 12 },

  // UTC+13
  { id: 'Pacific/Apia', city: 'Apia', country: 'Samoa', abbr: 'WST', offset: 13 },
  { id: 'Pacific/Tongatapu', city: 'Nukualofa', country: 'Tonga', abbr: 'TOT', offset: 13 },
];

// Add unique keys to each timezone
export const TIMEZONES = TIMEZONES_RAW.map(tz => ({
  ...tz,
  key: createKey(tz.city, tz.country),
}));

// Helper to find timezone by key
export const findByKey = (key) => TIMEZONES.find(tz => tz.key === key);

// Get current offset for a timezone (in hours)
export function getTimezoneOffset(timezoneId) {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezoneId,
    timeZoneName: 'shortOffset',
  });
  const parts = formatter.formatToParts(now);
  const offsetPart = parts.find(p => p.type === 'timeZoneName');
  if (!offsetPart) return 0;

  const match = offsetPart.value.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return 0;

  const sign = match[1] === '+' ? 1 : -1;
  const hours = parseInt(match[2], 10);
  const minutes = match[3] ? parseInt(match[3], 10) : 0;

  return sign * (hours + minutes / 60);
}

// Format UTC offset for display
export function formatOffset(offset) {
  if (offset === 0) return 'UTC';
  const sign = offset >= 0 ? '+' : '-';
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset);
  const minutes = Math.round((absOffset - hours) * 60);
  if (minutes === 0) {
    return `UTC${sign}${hours}`;
  }
  return `UTC${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
}

// Convert time from one timezone to another
export function convertTime(date, fromTimezone, toTimezone) {
  // Create a date string in the source timezone
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: toTimezone,
  };

  const formatter = new Intl.DateTimeFormat('en-CA', options);
  const parts = formatter.formatToParts(date);

  const getPart = (type) => parts.find(p => p.type === type)?.value || '00';

  return {
    year: parseInt(getPart('year'), 10),
    month: parseInt(getPart('month'), 10),
    day: parseInt(getPart('day'), 10),
    hour: parseInt(getPart('hour'), 10),
    minute: parseInt(getPart('minute'), 10),
    second: parseInt(getPart('second'), 10),
  };
}

// Format time for display
export function formatTime(hour, minute, use24Hour = true) {
  if (use24Hour) {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
}

// Format date for display
export function formatDate(year, month, day) {
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

// Get current time in a timezone
export function getCurrentTimeInTimezone(timezoneId) {
  const now = new Date();
  return convertTime(now, 'UTC', timezoneId);
}

// Calculate time difference between two timezones
export function getTimeDifference(fromTimezone, toTimezone) {
  const fromOffset = getTimezoneOffset(fromTimezone);
  const toOffset = getTimezoneOffset(toTimezone);
  return toOffset - fromOffset;
}

// Detect user's timezone (defaults to Ankara, Turkey)
export function getUserTimezone() {
  return DEFAULT_TIMEZONE;
}

// Quick presets for team regions
export const PRESETS = {
  'US Team': ['America/New_York', 'America/Los_Angeles', 'America/Chicago'],
  'Europe': ['Europe/London', 'Europe/Paris', 'Europe/Berlin'],
  'Asia Pacific': ['Asia/Tokyo', 'Asia/Singapore', 'Australia/Sydney'],
  'Global': ['America/New_York', 'Europe/London', 'Asia/Tokyo'],
};

// Check if time is within working hours (9-17)
export function isWorkingHours(hour) {
  return hour >= 9 && hour < 17;
}

// Generate shareable URL
export function generateShareableUrl(hour, minute, sourceTimezone, targetTimezones, selectedDate) {
  const params = new URLSearchParams();
  params.set('h', hour);
  params.set('m', minute);
  params.set('src', sourceTimezone);
  params.set('targets', targetTimezones.join(','));
  if (selectedDate) {
    params.set('date', selectedDate);
  }
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

// Parse URL parameters
export function parseUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const hour = params.get('h');
  const minute = params.get('m');
  const source = params.get('src');
  const targets = params.get('targets');
  const date = params.get('date');

  if (hour && minute && source && targets) {
    return {
      hour: parseInt(hour, 10),
      minute: parseInt(minute, 10),
      sourceTimezone: source,
      targetTimezones: targets.split(',').filter(t => TIMEZONES.some(tz => tz.id === t)),
      selectedDate: date || null,
    };
  }
  return null;
}

// LocalStorage helpers
const STORAGE_KEY = 'timezone_favorites';

export function saveFavorites(timezones) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timezones));
  } catch (e) {
    console.warn('Could not save favorites:', e);
  }
}

export function loadFavorites() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.filter(t => TIMEZONES.some(tz => tz.id === t));
    }
  } catch (e) {
    console.warn('Could not load favorites:', e);
  }
  return null;
}

// Create a date object from time input in a specific timezone
export function createDateInTimezone(hour, minute, timezoneId, baseDate = new Date()) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const day = baseDate.getDate();

  // Create an ISO string for the given time in the timezone
  const isoString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;

  // Parse this as if it were in UTC, then adjust
  const utcDate = new Date(isoString + 'Z');
  const offset = getTimezoneOffset(timezoneId);

  // Subtract the offset to get UTC time that represents this local time
  return new Date(utcDate.getTime() - offset * 60 * 60 * 1000);
}
