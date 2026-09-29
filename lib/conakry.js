// Communes de Conakry desservies par Monmarché et leurs principaux quartiers.
// Une page par commune (et non par quartier) : des centaines de pages quasi
// identiques seraient traitées par Google comme des pages satellites.
export const COMMUNES = [
  {
    slug: "kaloum",
    name: "Kaloum",
    description:
      "centre administratif et d'affaires de Conakry, avec ses ministères, banques, bureaux et le port autonome",
    quartiers: [
      "Almamya",
      "Boulbinet",
      "Coronthie",
      "Fotoba",
      "Kouléwondy",
      "Manquepas",
      "Sandervalia",
      "Sans-Fil",
      "Téminétaye",
      "Tombo",
    ],
  },
  {
    slug: "dixinn",
    name: "Dixinn",
    description:
      "commune résidentielle et universitaire, entre la corniche et l'université Gamal Abdel Nasser",
    quartiers: [
      "Belle-Vue",
      "Camayenne",
      "Cameroun",
      "Dixinn Centre",
      "Dixinn Port",
      "Hafia",
      "Kénien",
      "Landréah",
      "Minière",
    ],
  },
  {
    slug: "matam",
    name: "Matam",
    description:
      "commune commerçante au cœur de Conakry, connue pour le grand marché de Madina",
    quartiers: [
      "Bonfi",
      "Boussoura",
      "Carrière",
      "Coléah",
      "Hermakono",
      "Madina",
      "Mafanco",
      "Matam Centre",
      "Touguiwondy",
    ],
  },
  {
    slug: "ratoma",
    name: "Ratoma",
    description:
      "la commune la plus peuplée de Conakry, de Kipé et Taouyah jusqu'à Lambanyi et Sonfonia",
    quartiers: [
      "Bambeto",
      "Cosa",
      "Dar-es-Salam",
      "Hamdallaye",
      "Kakimbo",
      "Kaporo",
      "Kipé",
      "Kobaya",
      "Koloma",
      "Lambanyi",
      "Nongo",
      "Ratoma Centre",
      "Sonfonia",
      "Taouyah",
      "Wanindara",
    ],
  },
  {
    slug: "matoto",
    name: "Matoto",
    description:
      "commune de l'aéroport international de Gbessia, vaste zone résidentielle et commerciale",
    quartiers: [
      "Dabompa",
      "Dabondy",
      "Enta",
      "Gbessia",
      "Kissosso",
      "Matoto Centre",
      "Sangoyah",
      "Simbaya",
      "Tombolia",
      "Yimbaya",
    ],
  },
];

export function getCommune(slug) {
  return COMMUNES.find((commune) => commune.slug === slug) || null;
}
