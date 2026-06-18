/**
 * Reliable event imagery via Pexels CDN (free to use, hotlink-friendly).
 */

export const pexels = (id, w = 800, h = 500) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

export const FALLBACK_EVENT_IMAGE = pexels(2774556);

const pools = {
  music: [1763075, 1540406, 1105666, 1670920, 1670920, 1763075],
  technology: [3861969, 1181677, 577585, 265087, 3861969, 1181244],
  sports: [3621104, 274422, 4679182, 87651, 3621104, 274422],
  arts: [1194420, 3137054, 1191710, 934174, 3137054, 1194420],
  business: [3184292, 7688336, 3184465, 7415120, 3184292, 7688336],
  food: [1267320, 1640777, 941864, 2253877, 1267320, 1640777],
  education: [207691, 5212345, 5905442, 256541, 207691, 5212345],
  wellness: [3822622, 3822861, 3757942, 4056535, 3822622, 3822861],
};

const categoryPool = {
  cat_music: 'music',
  cat_technology: 'technology',
  cat_sports: 'sports',
  cat_arts: 'arts',
  cat_business: 'business',
  cat_food: 'food',
  cat_education: 'education',
  cat_wellness: 'wellness',
};

const slugPool = {
  music: 'music',
  technology: 'technology',
  sports: 'sports',
  'arts-culture': 'arts',
  business: 'business',
  'food-drink': 'food',
  education: 'education',
  'health-wellness': 'wellness',
};

/** Build 1–3 image URLs for an event from its category pool */
export const eventImages = (categoryId, seed = 0, count = 2) => {
  const poolName = categoryPool[categoryId] || 'music';
  const ids = pools[poolName];
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(pexels(ids[(seed + i) % ids.length]));
  }
  return result;
};

export const categoryImage = (slugOrId, w = 600) => {
  const poolName = categoryPool[slugOrId] || slugPool[slugOrId] || 'music';
  return pexels(pools[poolName][0], w, Math.round(w * 0.65));
};

export const organizerLogo = (seed = 0, size = 200) => {
  const ids = [3184292, 7688336, 3184465];
  return pexels(ids[seed % ids.length], size, size);
};

/** Hero / page backgrounds */
export const HERO_POSTER = pexels(2774556, 1920, 1080);
export const HERO_BG_CONCERT = pexels(1763075, 1920, 1080);
export const HERO_BG_CROWD = pexels(1540406, 1920, 1080);
export const HERO_BG_VENUE = pexels(2774556, 1920, 1080);
