// Long-form, human-written reference copy for river and glacial-lake pages.
// Kept separate from himalaya.ts (structured geo data) so page content can
// grow without cluttering the data module.

export interface RiverContent {
  overview: string;
  locationContext: string;
  historicalNote: string;
}

export const RIVER_CONTENT: Record<string, RiverContent> = {
  "ganga-haridwar": {
    overview:
      "The Ganga (Ganges) begins at the Gangotri Glacier in Uttarakhand and is one of the most important rivers in the Himalaya, both for the hundreds of millions of people who depend on it downstream and for how directly its headwaters are tied to Himalayan glacier and snowmelt.",
    locationContext:
      "Haridwar sits where the Ganga leaves the mountains and enters the plains — the first major town on the river's course and a natural point to watch for changes in flow coming out of the upper catchment, including the Mandakini and Alaknanda tributaries.",
    historicalNote:
      "The upper Ganga basin was the site of the June 2013 Uttarakhand floods, one of India's deadliest flood disasters, triggered by unusually intense rainfall combined with glacial lake and moraine failures above Kedarnath in the Mandakini sub-catchment.",
  },
  "ganga-varanasi": {
    overview:
      "By the time the Ganga reaches Varanasi it has picked up the Yamuna and other tributaries and carries a much larger, slower-moving volume of water than in the hills — but its base flow still originates in Himalayan glacier and snowmelt hundreds of kilometers upstream.",
    locationContext:
      "Varanasi is a densely populated riverside city where even moderate rises in Ganga discharge affect ghats, low-lying neighborhoods, and river traffic, making it a useful downstream checkpoint for monsoon and upstream-melt driven flow changes.",
    historicalNote:
      "Varanasi and the middle Ganga plain regularly see monsoon-season flood warnings; sustained high discharge readings here often reflect heavy rainfall or snowmelt events far upstream in the Himalaya days earlier.",
  },
  "brahmaputra-guwahati": {
    overview:
      "The Brahmaputra begins as the Yarlung Tsangpo in Tibet, cuts through the eastern Himalaya in one of the deepest gorges on Earth, and enters India through Arunachal Pradesh — making it one of the most direct links between Himalayan glacier melt and downstream flooding.",
    locationContext:
      "Guwahati, Assam's largest city, sits directly on the Brahmaputra and is one of the most closely watched flood-risk points in the region — the river here carries the combined melt and monsoon runoff of the entire eastern Himalaya and Tibetan plateau catchment.",
    historicalNote:
      "The Brahmaputra basin floods almost every monsoon season to some degree; Assam's annual flood cycle is one of the most consistently damaging in South Asia, driven by the sheer scale of the catchment feeding a single main channel.",
  },
  "teesta-siliguri": {
    overview:
      "The Teesta originates near the Pahunri glacier in North Sikkim and is fed by a chain of glacial lakes in the high Sikkim Himalaya, making it one of the rivers most directly exposed to glacial lake outburst flood (GLOF) risk anywhere in the world.",
    locationContext:
      "Siliguri and the Coronation Bridge crossing sit downstream of the Teesta's steep Sikkim catchment, in the path of any major discharge event originating from the glacial lakes above — including South Lhonak, the largest and fastest-growing lake in the basin.",
    historicalNote:
      "In October 2023, a glacial lake outburst flood from South Lhonak Lake sent a sudden surge down the Teesta, breaching the Chungthang dam and causing a major disaster across Sikkim and into North Bengal — the clearest real-world example of the earthquake/instability-to-GLOF risk chain this tracker is built around.",
  },
  "koshi-chatara": {
    overview:
      "The Koshi is formed by seven tributaries draining a huge stretch of the eastern Nepal Himalaya, including glacier-fed rivers below Everest and Kanchenjunga, and is known for carrying an exceptionally large and fast-changing sediment and water load.",
    locationContext:
      "The Chatara barrage marks where the Koshi leaves the Himalayan foothills and spreads onto the plains of Nepal and Bihar — historically one of the most flood-prone transitions of any river in the region.",
    historicalNote:
      "The Koshi is nicknamed the 'Sorrow of Bihar' for its long history of shifting course and catastrophic flooding; a 2008 embankment breach upstream in Nepal displaced millions of people downstream, underscoring how quickly conditions in the upper catchment can turn into a plains-level disaster.",
  },
  "gandaki-narayanghat": {
    overview:
      "The Gandaki (known as the Narayani in its lower reaches) drains the Annapurna and Manaslu massifs, including several glacial lakes such as Thulagi, and is one of central Nepal's major Himalaya-fed rivers.",
    locationContext:
      "Narayanghat, where the river exits the hills, is a key downstream monitoring point for flow changes originating in the Annapurna/Manaslu glacial catchment.",
    historicalNote:
      "The Gandaki basin has a documented history of glacial lake instability, including long-term monitoring of Thulagi Lake for outburst risk as it continues to expand.",
  },
  "indus-skardu": {
    overview:
      "The Indus rises on the Tibetan plateau and flows through some of the highest and most heavily glaciated terrain on Earth in the Karakoram before reaching the plains of Pakistan, making its upper reaches especially sensitive to glacier and snowmelt dynamics.",
    locationContext:
      "Skardu, in Gilgit-Baltistan, sits in the heart of the Karakoram — a region with one of the world's highest concentrations of glaciers and glacial lakes, and correspondingly high GLOF exposure.",
    historicalNote:
      "Northern Pakistan regularly experiences glacial lake outburst floods from Karakoram valleys feeding the upper Indus system, and the wider Indus basin was the site of Pakistan's catastrophic 2010 floods, driven by an extreme monsoon interacting with the river's huge Himalaya-and-Karakoram catchment.",
  },
  "jhelum-srinagar": {
    overview:
      "The Jhelum drains the Kashmir valley, fed by both monsoon rainfall and snowmelt from the surrounding western Himalaya, and flows directly through Srinagar before continuing into Pakistan.",
    locationContext:
      "Srinagar's low-lying, densely populated areas sit close to the Jhelum's banks, making the city particularly sensitive to even moderate rises in the river's discharge.",
    historicalNote:
      "In September 2014, the Jhelum overflowed its banks after days of extreme rainfall, flooding large parts of Srinagar in one of the worst floods the Kashmir valley has experienced in decades.",
  },
};

export interface LakeContent {
  intro: string;
}

export const LAKE_CONTENT: Record<string, LakeContent> = {
  "south-lhonak": {
    intro:
      "South Lhonak Lake, in North Sikkim, is one of the fastest-growing and highest-risk glacial lakes in the Himalaya. Its October 2023 outburst sent a flash flood down the Teesta valley, breaching the Chungthang dam and causing widespread destruction — one of the clearest documented cases of a Himalayan GLOF disaster in the past decade.",
  },
  "imja-tsho": {
    intro:
      "Imja Tsho, below Island Peak in the Everest (Khumbu) region, formed and grew rapidly over just a few decades as the glacier feeding it retreated — a textbook example of how quickly climate-driven glacier melt can create new flood hazards that didn't exist a generation ago.",
  },
  "tsho-rolpa": {
    intro:
      "Tsho Rolpa, in Nepal's Rolwaling valley, has been monitored for outburst risk since the 1990s and was fitted with an artificial outlet channel to lower its water level — one of the first engineered GLOF mitigation projects in the Himalaya.",
  },
  thulagi: {
    intro:
      "Thulagi Lake sits below the Manaslu massif and drains into the Marsyangdi and then the Gandaki river system. It has been the subject of long-running scientific monitoring as it continues to expand with glacier retreat.",
  },
  "lower-barun": {
    intro:
      "Lower Barun Lake, below Makalu in eastern Nepal, is among the more rapidly expanding glacial lakes documented in recent satellite surveys of the region, feeding into the Barun-Arun-Koshi river system.",
  },
  gangabal: {
    intro:
      "Gangabal Lake sits high in the Kashmir Himalaya, in a seismically active part of the western Himalayan belt, feeding into the Jhelum system that runs through Srinagar.",
  },
  chorabari: {
    intro:
      "The Chorabari glacier and lake area above Kedarnath, in the Mandakini sub-catchment of the Ganga basin, was central to the catastrophic June 2013 Uttarakhand floods — a disaster caused by extreme rainfall interacting with unstable moraine and lake terrain at high altitude.",
  },
  raphstreng: {
    intro:
      "Raphstreng Tsho, in Bhutan's Pho Chhu valley, has been closely monitored since a nearby lake, Luggye Tsho, suffered a major outburst in 1994 — one of the events that first drew international attention to Himalayan GLOF risk.",
  },
};
