import { GoogleGenAI } from "@google/genai";
import { Restaurant, Coordinates, Review } from "../types";

// Initialize Gemini Client
// @ts-ignore - process.env.API_KEY is injected by the runtime
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Robust Image Strategy:
// 1. Specific high-res images for known popular places (simulating Maps Photos).
// 2. High-quality category fallbacks.
const IMAGE_DATABASE = {
    specific: {
        "zeljo": "https://images.unsplash.com/photo-1599021408783-6c61f2f0c765?auto=format&fit=crop&w=1600&q=95",
        "ferhatovic": "https://images.unsplash.com/photo-1630402773489-3286dc9b9e54?auto=format&fit=crop&w=1600&q=95",
        "petica": "https://images.unsplash.com/photo-1630402773489-3286dc9b9e54?auto=format&fit=crop&w=1600&q=95",
        "safije": "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=95",
        "park princeva": "https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&w=1600&q=95",
        "kibe": "https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&w=1600&q=95",
        "inat": "https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?auto=format&fit=crop&w=1600&q=95",
        "pivnica": "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=1600&q=95",
        "metropolis": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=95",
        "vatra": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1600&q=95",
        "manolo": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=95",
        "revolucija": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=95",
        "klopa": "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&w=1600&q=95",
        "dveri": "https://images.unsplash.com/photo-1550966871-3ed3c6227b3f?auto=format&fit=crop&w=1600&q=95",
        "avlija": "https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?auto=format&fit=crop&w=1600&q=95",
        "chipas": "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=1600&q=95",
        "paper moon": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1600&q=95",
        "napoli": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=1600&q=95",
        "sushi": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1600&q=95",
        "kimono": "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1600&q=95",
        "burger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=95",
        "blind tiger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=95",
        "bascarsija": "https://images.unsplash.com/photo-1623961990059-28356e22bc8e?auto=format&fit=crop&w=1600&q=95",
        "buregdzinica": "https://images.unsplash.com/photo-1623961990059-28356e22bc8e?auto=format&fit=crop&w=1600&q=95",
        "sac": "https://images.unsplash.com/photo-1623961990059-28356e22bc8e?auto=format&fit=crop&w=1600&q=95",
        "bosna": "https://images.unsplash.com/photo-1623961990059-28356e22bc8e?auto=format&fit=crop&w=1600&q=95",
    },
    categories: {
        "cevapi": "https://images.unsplash.com/photo-1599021408783-6c61f2f0c765?auto=format&fit=crop&w=1600&q=95",
        "rostilj": "https://images.unsplash.com/photo-1599021408783-6c61f2f0c765?auto=format&fit=crop&w=1600&q=95",
        "bosanska": "https://images.unsplash.com/photo-1550966871-3ed3c6227b3f?auto=format&fit=crop&w=1600&q=95",
        "traditional": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=95",
        "pita": "https://images.unsplash.com/photo-1623961990059-28356e22bc8e?auto=format&fit=crop&w=1600&q=95",
        "burek": "https://images.unsplash.com/photo-1623961990059-28356e22bc8e?auto=format&fit=crop&w=1600&q=95",
        "pizza": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=1600&q=95",
        "italijanska": "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=1600&q=95",
        "pasta": "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=1600&q=95",
        "burger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=95",
        "fast": "https://images.unsplash.com/photo-1561758033-d8f19662cb23?auto=format&fit=crop&w=1600&q=95",
        "sushi": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1600&q=95",
        "azijska": "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1600&q=95",
        "mexican": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1600&q=95",
        "tacos": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1600&q=95",
        "coffee": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1600&q=95",
        "cafe": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=95",
        "kolaci": "https://images.unsplash.com/photo-1579306194872-64d3b7bac4c2?auto=format&fit=crop&w=1600&q=95",
        "slatkisi": "https://images.unsplash.com/photo-1579306194872-64d3b7bac4c2?auto=format&fit=crop&w=1600&q=95",
        "luxury": "https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&w=1600&q=95",
        "fina": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=95",
        "garden": "https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?auto=format&fit=crop&w=1600&q=95",
        "steak": "https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&w=1600&q=95",
        "fish": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1600&q=95",
        "default": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=95"
    }
};

const getSmartImage = (name: string, cuisine: string): string => {
    const normalizedName = name.toLowerCase();
    const normalizedCuisine = cuisine.toLowerCase();
    
    // 1. Check specific places (Most robust strategy for known entities)
    for (const [key, url] of Object.entries(IMAGE_DATABASE.specific)) {
        if (normalizedName.includes(key)) return url;
    }
    
    // 2. Check cuisine/keywords in the name or cuisine type
    const searchTerms = [normalizedCuisine, ...normalizedName.split(' ')];
    for (const term of searchTerms) {
         if (term.length < 3) continue; // Skip short words
         for (const [key, url] of Object.entries(IMAGE_DATABASE.categories)) {
             if (term.includes(key)) return url;
         }
    }
    
    return IMAGE_DATABASE.categories.default;
}

const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: "1",
    name: "Ćevabdžinica Željo",
    rating: 4.9,
    reviewCount: 3240,
    cuisine: "Bosanska",
    distance: "0.1 km",
    address: "Kundurdžiluk 19, Sarajevo 71000",
    imageUrl: IMAGE_DATABASE.specific["zeljo"],
    isOpen: true,
    description: "Institucija Sarajeva. Najpoznatiji ćevapi u gradu, smješteni u srcu Baščaršije. Jednostavan ambijent, ali ukus koji se pamti.",
    googleMapsUri: "https://maps.google.com/?q=Cevabdzinica+Zeljo+Kundurdziluk+19",
    openingHours: "08:00 - 23:00",
    contactNumber: "+387 33 537 969",
    websiteUrl: "https://www.cevabdzinicazeljo.ba",
    reviews: [
      { id: "r1", user: "Marko P.", rating: 5, comment: "Jednostavno najbolji!", date: "Jučer" }
    ]
  },
  {
    id: "2",
    name: "4 Sobe Gospođe Safije",
    rating: 4.8,
    reviewCount: 850,
    cuisine: "Luksuzna",
    distance: "1.5 km",
    address: "Čekaluša 61, Sarajevo 71000",
    imageUrl: IMAGE_DATABASE.specific["safije"],
    isOpen: true,
    description: "Spoj historije, luksuza i vrhunske gastronomije. Idealno mjesto za romantične večere i posebne prilike u prelijepom ambijentu stare bosanske kuće.",
    googleMapsUri: "https://maps.google.com/?q=4+Sobe+Gospode+Safije+Cekalusa+61",
    openingHours: "12:00 - 23:00",
    contactNumber: "+387 33 202 745",
    websiteUrl: "http://www.4sobegospodjesafije.ba"
  },
  {
    id: "3",
    name: "Dveri",
    rating: 4.7,
    reviewCount: 1120,
    cuisine: "Bosanska",
    distance: "0.2 km",
    address: "Prote Bakovića 12, Sarajevo 71000",
    imageUrl: IMAGE_DATABASE.specific["dveri"],
    isOpen: true,
    description: "Domaći hljeb, fantastična vina i tradicionalna jela u rustikalnom ambijentu koji oduzima dah. Osjećajte se kao kod kuće.",
    googleMapsUri: "https://maps.google.com/?q=Dveri+Sarajevo",
    openingHours: "09:00 - 23:00",
    contactNumber: "+387 33 537 020",
    websiteUrl: "https://dveri.co.ba"
  },
  {
    id: "4",
    name: "Metropolis",
    rating: 4.5,
    reviewCount: 2300,
    cuisine: "Kafić",
    distance: "0.4 km",
    address: "Maršala Tita 21, Sarajevo 71000",
    imageUrl: IMAGE_DATABASE.specific["metropolis"],
    isOpen: true,
    description: "Najpopularnije mjesto za kafu i kolače u centru grada kod Vječne vatre. Odlična lokacija za posmatranje gradske vreve.",
    googleMapsUri: "https://maps.google.com/?q=Metropolis+Marsala+Tita",
    openingHours: "07:00 - 23:00",
    contactNumber: "+387 33 267 430",
    websiteUrl: "https://www.metropolis.ba"
  },
  {
    id: "5",
    name: "Avlija",
    rating: 4.6,
    reviewCount: 980,
    cuisine: "Internacionalna",
    distance: "1.8 km",
    address: "Avde Sumbula 2, Sarajevo 71000",
    imageUrl: IMAGE_DATABASE.specific["avlija"],
    isOpen: true,
    description: "Šareni vrt pun cvijeća i pozitivne energije na Koševu. Poznati po svojim pohovanim paprikama i opuštenoj atmosferi.",
    googleMapsUri: "https://maps.google.com/?q=Avlija+Sarajevo",
    openingHours: "08:00 - 23:00",
    contactNumber: "+387 33 444 656",
    websiteUrl: "https://www.avlija.ba"
  },
  {
    id: "6",
    name: "Chipas",
    rating: 4.4,
    reviewCount: 1500,
    cuisine: "Italijanska",
    distance: "0.5 km",
    address: "Zelenih beretki 14, Sarajevo 71000",
    imageUrl: IMAGE_DATABASE.specific["chipas"],
    isOpen: true,
    description: "Najbolja pasta u gradu po pristupačnim cijenama. Brza usluga i moderan enterijer.",
    googleMapsUri: "https://maps.google.com/?q=Chipas+Concept+Sarajevo",
    openingHours: "08:00 - 23:00",
    contactNumber: "+387 33 222 333",
    websiteUrl: "https://www.chipas.ba"
  },
  {
    id: "7",
    name: "Kibe Mahala",
    rating: 4.9,
    reviewCount: 600,
    cuisine: "Luksuzna",
    distance: "2.5 km",
    address: "Vrbanjuša 164, Sarajevo 71000",
    imageUrl: IMAGE_DATABASE.specific["kibe"],
    isOpen: false,
    description: "Spektakularan pogled na Sarajevo uz vrhunsku janjetinu i tradicionalna jela. Obavezna rezervacija.",
    googleMapsUri: "https://maps.google.com/?q=Kibe+Mahala",
    openingHours: "12:00 - 23:00",
    contactNumber: "+387 33 441 936",
    websiteUrl: "http://www.kibemahala.ba"
  },
  {
    id: "8",
    name: "Burger Bar",
    rating: 4.3,
    reviewCount: 450,
    cuisine: "Fast food",
    distance: "0.8 km",
    address: "Branilaca Sarajeva 10, Sarajevo 71000",
    imageUrl: IMAGE_DATABASE.specific["burger"],
    isOpen: true,
    description: "Pravi američki burgeri u srcu Sarajeva. Sočno, veliko i ukusno. Idealno za brzi ručak.",
    googleMapsUri: "https://maps.google.com/?q=Burger+Bar+Sarajevo",
    openingHours: "09:00 - 22:00",
    contactNumber: "+387 62 123 456",
    websiteUrl: "https://www.burgerbar.ba"
  },
  {
    id: "9",
    name: "Sushi San",
    rating: 4.5,
    reviewCount: 320,
    cuisine: "Azijska kuhinja",
    distance: "1.0 km",
    address: "Musa Ćazim Ćatić 29, Sarajevo 71000",
    imageUrl: IMAGE_DATABASE.specific["sushi"],
    isOpen: true,
    description: "Svjež sushi i japanski specijaliteti. Mala, ali autentična lokacija blizu Katedrale.",
    googleMapsUri: "https://maps.google.com/?q=Sushi+San+Sarajevo",
    openingHours: "11:00 - 22:00",
    contactNumber: "+387 33 555 666",
    websiteUrl: "https://www.sushisan.ba"
  },
  {
    id: "10",
    name: "Revolucija 1764",
    rating: 4.5,
    reviewCount: 890,
    cuisine: "Internacionalna",
    distance: "0.3 km",
    address: "Ferhadija 25, Sarajevo 71000",
    imageUrl: IMAGE_DATABASE.specific["revolucija"],
    isOpen: true,
    description: "Moderno mjesto u šetališnoj zoni. Odličan izbor za doručak, ručak ili večernji koktel.",
    googleMapsUri: "https://maps.google.com/?q=Revolucija+1764",
    openingHours: "08:00 - 00:00",
    contactNumber: "+387 33 123 123",
    websiteUrl: "https://revolucija1764.ba"
  },
  {
    id: "11",
    name: "Vatra",
    rating: 4.4,
    reviewCount: 1800,
    cuisine: "Kafić",
    distance: "0.4 km",
    address: "Ferhadija 4, Sarajevo 71000",
    imageUrl: IMAGE_DATABASE.specific["vatra"],
    isOpen: true,
    description: "Vrhunske torte i slana jela u samom centru kod Vječne vatre. Uvijek živo i prometno.",
    googleMapsUri: "https://maps.google.com/?q=Vatra+Sarajevo",
    openingHours: "07:00 - 23:00",
    contactNumber: "+387 33 666 777",
    websiteUrl: "https://vatra.ba"
  },
  {
    id: "12",
    name: "Pizzeria Napoli",
    rating: 4.2,
    reviewCount: 400,
    cuisine: "Italijanska kuhinja",
    distance: "1.1 km",
    address: "Grbavička 8, Sarajevo 71000",
    imageUrl: IMAGE_DATABASE.specific["napoli"],
    isOpen: true,
    description: "Tradicionalna napolitanska pizza iz krušne peći. Ugodan kvartovski ambijent.",
    googleMapsUri: "https://maps.google.com/?q=Pizzeria+Napoli+Sarajevo",
    openingHours: "10:00 - 22:00",
    contactNumber: "+387 33 888 999",
    websiteUrl: "https://pizzerianapoli.ba"
  },
  {
    id: "13",
    name: "Paper Moon",
    rating: 4.6,
    reviewCount: 1100,
    cuisine: "Italijanska kuhinja",
    distance: "3.0 km",
    address: "Hamdije Čemerlića 45, Sarajevo 71000",
    imageUrl: IMAGE_DATABASE.specific["paper moon"],
    isOpen: true,
    description: "Kultno mjesto na Grbavici. Odlična pizza i pasta u zanimljivom ambijentu cigle i drveta.",
    googleMapsUri: "https://maps.google.com/?q=Paper+Moon+Sarajevo",
    openingHours: "08:00 - 23:00",
    contactNumber: "+387 33 713 550",
    websiteUrl: "https://papermoon.ba"
  },
  {
    id: "14",
    name: "Klopa",
    rating: 4.7,
    reviewCount: 950,
    cuisine: "Internacionalna",
    distance: "0.3 km",
    address: "Ferhadija 5, Sarajevo 71000",
    imageUrl: IMAGE_DATABASE.specific["klopa"],
    isOpen: true,
    description: "Zdrava hrana bez dima cigareta. Fokus na svježim namirnicama i jedinstvenim receptima.",
    googleMapsUri: "https://maps.google.com/?q=Klopa+Sarajevo",
    openingHours: "08:00 - 23:00",
    contactNumber: "+387 33 222 555",
    websiteUrl: "https://klopa.ba"
  },
  {
    id: "15",
    name: "Los Amigos",
    rating: 4.3,
    reviewCount: 250,
    cuisine: "Meksička kuhinja",
    distance: "1.2 km",
    address: "Bazardžani 6, Sarajevo 71000",
    imageUrl: IMAGE_DATABASE.categories["mexican"],
    isOpen: false,
    description: "Autentični meksički okusi, tacos i burritos u opuštenoj atmosferi blizu Baščaršije.",
    googleMapsUri: "https://maps.google.com/?q=Los+Amigos+Sarajevo",
    openingHours: "10:00 - 22:00",
    contactNumber: "+387 61 999 000",
    websiteUrl: "https://losamigos.ba"
  }
];

// Helper to filter mock data intelligently
const filterMockData = (query: string): Restaurant[] => {
  const lowerQuery = query.toLowerCase().trim();

  // If query is generic or "all", return everything
  if (lowerQuery === 'restaurants' || lowerQuery === 'sve' || lowerQuery === '') {
    return MOCK_RESTAURANTS;
  }

  return MOCK_RESTAURANTS.filter(r => {
     // Check name match
     const nameMatch = r.name.toLowerCase().includes(lowerQuery);
     
     // Check description match
     const descMatch = r.description.toLowerCase().includes(lowerQuery);

     // Check cuisine match
     const queryWords = lowerQuery.split(' ');
     const cuisineMatch = queryWords.some(word => 
        word.length > 2 && r.cuisine.toLowerCase().includes(word)
     );

     return nameMatch || descMatch || cuisineMatch;
  });
};

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
}

export const searchRestaurants = async (
  query: string,
  userLocation: Coordinates | null
): Promise<Restaurant[]> => {
  // @ts-ignore
  const apiKey = process.env.API_KEY;

  // If no API key, fallback to mock
  if (!apiKey) {
    console.warn("No API Key found, using mock data");
    return filterMockData(query);
  }

  // Use Google Places API (New) for robust data
  try {
    const requestBody: any = {
        textQuery: query,
        locationBias: {
            circle: {
                center: userLocation ? 
                    { latitude: userLocation.latitude, longitude: userLocation.longitude } : 
                    { latitude: 43.8563, longitude: 18.4131 },
                radius: 5000 // 5km radius bias
            }
        }
    };

    const fieldMask = [
        'places.id',
        'places.displayName',
        'places.formattedAddress',
        'places.types',
        'places.rating',
        'places.userRatingCount',
        'places.websiteUri',
        'places.internationalPhoneNumber',
        'places.regularOpeningHours',
        'places.photos',
        'places.editorialSummary',
        'places.reviews',
        'places.location'
    ].join(',');

    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': fieldMask
        },
        body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!data.places || data.places.length === 0) {
        // Fallback to mock if API returns nothing (e.g. query too weird)
        console.warn("Places API returned 0 results, falling back to mock.");
        return filterMockData(query);
    }

    return data.places.map((place: any) => {
         // Get Image URL
         const photoName = place.photos?.[0]?.name;
         const photoUrl = photoName 
            ? `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=800&maxWidthPx=1000&key=${apiKey}`
            : getSmartImage(place.displayName?.text || "", "");

         // Calculate Distance
         let distanceLabel = "N/A";
         if (userLocation && place.location) {
             const d = getDistanceFromLatLonInKm(
                 userLocation.latitude, userLocation.longitude,
                 place.location.latitude, place.location.longitude
             );
             distanceLabel = `${d.toFixed(1)} km`;
         }

         // Map Reviews
         const reviews: Review[] = place.reviews?.map((r: any) => ({
             id: r.name, // resource name
             user: r.authorAttribution?.displayName || "Google User",
             rating: r.rating,
             comment: r.text?.text || r.originalText?.text || "",
             date: r.relativePublishTimeDescription || ""
         })) || [];

         // Infer Cuisine/Type
         const types = place.types || [];
         let cuisine = "Restoran";
         if (types.includes('cafe')) cuisine = "Kafić";
         else if (types.includes('bar')) cuisine = "Bar";
         else if (types.includes('pizza_restaurant')) cuisine = "Pizzeria";
         else if (types.includes('hamburger_restaurant')) cuisine = "Burger";
         else if (types.includes('italian_restaurant')) cuisine = "Italijanska";
         else if (types.includes('steak_house')) cuisine = "Steakhouse";
         else if (types.includes('mexican_restaurant')) cuisine = "Meksička";
         else if (types.includes('asian_restaurant')) cuisine = "Azijska";
         else if (types.includes('bakery')) cuisine = "Pekara";

         return {
             id: place.id,
             name: place.displayName?.text || "Nepoznato",
             rating: place.rating || 0,
             reviewCount: place.userRatingCount || 0,
             cuisine: cuisine,
             distance: distanceLabel,
             imageUrl: photoUrl,
             isOpen: place.regularOpeningHours?.openNow || false,
             address: place.formattedAddress,
             description: place.editorialSummary?.text || place.displayName?.text || "Nema dostupnog opisa.",
             reviews: reviews,
             googleMapsUri: `https://www.google.com/maps/place/?q=place_id:${place.id}`,
             openingHours: place.regularOpeningHours?.weekdayDescriptions?.[0] || "Provjerite na mapi",
             contactNumber: place.internationalPhoneNumber,
             websiteUrl: place.websiteUri
         };
    });

  } catch (error) {
    console.error("Places API Error:", error);
    // Fallback to filtered mock data
    return filterMockData(query);
  }
};

export const getMockData = () => MOCK_RESTAURANTS;