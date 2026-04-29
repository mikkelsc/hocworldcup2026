// FIFA World Cup 2026 - Group Stage Matches
// 48 teams, 16 groups of 3 teams each
// Matches from June 11 – July 2, 2026 (USA, Canada, Mexico)

export const GROUPS = {
  A: { teams: ["Mexico", "Poland", "Saudi Arabia"], color: "#c0392b" },
  B: { teams: ["Argentina", "Canada", "Peru"], color: "#8e44ad" },
  C: { teams: ["USA", "Panama", "Uruguay"], color: "#2980b9" },
  D: { teams: ["France", "Belgium", "New Zealand"], color: "#16a085" },
  E: { teams: ["Spain", "Ukraine", "Kenya"], color: "#e67e22" },
  F: { teams: ["Morocco", "Portugal", "South Korea"], color: "#27ae60" },
  G: { teams: ["Germany", "Japan", "Ecuador"], color: "#d35400" },
  H: { teams: ["Brazil", "Colombia", "Algeria"], color: "#1abc9c" },
  I: { teams: ["England", "Senegal", "Slovakia"], color: "#9b59b6" },
  J: { teams: ["Netherlands", "Nigeria", "Venezuela"], color: "#f39c12" },
  K: { teams: ["Italy", "Ivory Coast", "Cuba"], color: "#3498db" },
  L: { teams: ["Australia", "Iran", "Paraguay"], color: "#e74c3c" },
  M: { teams: ["Switzerland", "Cameroon", "Egypt"], color: "#2ecc71" },
  N: { teams: ["Serbia", "South Africa", "Costa Rica"], color: "#e74c3c" },
  O: { teams: ["Croatia", "Chile", "DR Congo"], color: "#95a5a6" },
  P: { teams: ["Turkey", "China", "Honduras"], color: "#e91e63" },
};

const matchId = (g, n) => `group_${g}_${n}`;

export const GROUP_STAGE_MATCHES = Object.entries(GROUPS).flatMap(([group, { teams }]) => [
  {
    id: matchId(group, 1),
    group,
    stage: "Group Stage",
    home: teams[0],
    away: teams[1],
    date: getGroupDate(group, 0),
    venue: getVenue(group, 0),
  },
  {
    id: matchId(group, 2),
    group,
    stage: "Group Stage",
    home: teams[0],
    away: teams[2],
    date: getGroupDate(group, 1),
    venue: getVenue(group, 1),
  },
  {
    id: matchId(group, 3),
    group,
    stage: "Group Stage",
    home: teams[1],
    away: teams[2],
    date: getGroupDate(group, 2),
    venue: getVenue(group, 2),
  },
]);

function getGroupDate(group, matchIndex) {
  const groupOrder = Object.keys(GROUPS);
  const groupIdx = groupOrder.indexOf(group);
  const baseDay = 0; // June 11 = day 0
  const dayOffset = Math.floor(groupIdx / 4) + matchIndex * 6;
  const date = new Date(2026, 5, 11); // June 11, 2026
  date.setDate(date.getDate() + dayOffset + (groupIdx % 4));
  return date.toISOString().split("T")[0];
}

function getVenue(group, matchIndex) {
  const venues = [
    "MetLife Stadium, New York/NJ",
    "SoFi Stadium, Los Angeles",
    "AT&T Stadium, Dallas",
    "Levi's Stadium, San Francisco",
    "Hard Rock Stadium, Miami",
    "Empower Field, Denver",
    "Arrowhead Stadium, Kansas City",
    "Lumen Field, Seattle",
    "Lincoln Financial Field, Philadelphia",
    "Gillette Stadium, Boston",
    "Mercedes-Benz Stadium, Atlanta",
    "NRG Stadium, Houston",
    "BC Place, Vancouver",
    "BMO Field, Toronto",
    "Estadio Azteca, Mexico City",
    "Estadio BBVA, Monterrey",
  ];
  const groupIdx = Object.keys(GROUPS).indexOf(group);
  return venues[(groupIdx + matchIndex) % venues.length];
}

export const KNOCKOUTSTAGES = [
  { id: "r32", name: "Round of 32", stage: "Knockout" },
  { id: "r16", name: "Round of 16", stage: "Knockout" },
  { id: "qf", name: "Quarter-Finals", stage: "Knockout" },
  { id: "sf", name: "Semi-Finals", stage: "Knockout" },
  { id: "3rd", name: "Third Place", stage: "Knockout" },
  { id: "final", name: "Final", stage: "Knockout" },
];

export const FLAG_EMOJI = {
  Mexico: "🇲🇽", Poland: "🇵🇱", "Saudi Arabia": "🇸🇦",
  Argentina: "🇦🇷", Canada: "🇨🇦", Peru: "🇵🇪",
  USA: "🇺🇸", Panama: "🇵🇦", Uruguay: "🇺🇾",
  France: "🇫🇷", Belgium: "🇧🇪", "New Zealand": "🇳🇿",
  Spain: "🇪🇸", Ukraine: "🇺🇦", Kenya: "🇰🇪",
  Morocco: "🇲🇦", Portugal: "🇵🇹", "South Korea": "🇰🇷",
  Germany: "🇩🇪", Japan: "🇯🇵", Ecuador: "🇪🇨",
  Brazil: "🇧🇷", Colombia: "🇨🇴", Algeria: "🇩🇿",
  England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", Senegal: "🇸🇳", Slovakia: "🇸🇰",
  Netherlands: "🇳🇱", Nigeria: "🇳🇬", Venezuela: "🇻🇪",
  Italy: "🇮🇹", "Ivory Coast": "🇨🇮", Cuba: "🇨🇺",
  Australia: "🇦🇺", Iran: "🇮🇷", Paraguay: "🇵🇾",
  Switzerland: "🇨🇭", Cameroon: "🇨🇲", Egypt: "🇪🇬",
  Serbia: "🇷🇸", "South Africa": "🇿🇦", "Costa Rica": "🇨🇷",
  Croatia: "🇭🇷", Chile: "🇨🇱", "DR Congo": "🇨🇩",
  Turkey: "🇹🇷", China: "🇨🇳", Honduras: "🇭🇳",
  "TBD": "🏳️",
};
