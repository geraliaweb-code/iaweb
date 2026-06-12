import type { MaterialDataset } from "../dataset-types"

export const franceMaterials: MaterialDataset[] = [
  { id: "fr-structure-beton-c25-normal", country: "Franca", category: "STRUCTURE", subcategory: "Beton pret a l'emploi", name: "Beton C25/30", brand: "Lafarge", unit: "m3", segment: "normal", minCost: 112, avgCost: 128, maxCost: 148 },
  { id: "fr-structure-beton-c30-premium", country: "Franca", category: "STRUCTURE", subcategory: "Beton pret a l'emploi", name: "Beton C30/37", brand: "Lafarge", unit: "m3", segment: "premium", minCost: 126, avgCost: 144, maxCost: 168 },
  { id: "fr-structure-acier-normal", country: "Franca", category: "STRUCTURE", subcategory: "Acier", name: "Acier HA FeE500", brand: null, unit: "kg", segment: "normal", minCost: 1.08, avgCost: 1.26, maxCost: 1.48 },
  { id: "fr-masonry-brique-economic", country: "Franca", category: "MASONRY", subcategory: "Brique", name: "Brique creuse terre cuite", brand: "Saint-Gobain", unit: "un", segment: "economic", minCost: 0.52, avgCost: 0.68, maxCost: 0.86 },
  { id: "fr-masonry-parpaing-normal", country: "Franca", category: "MASONRY", subcategory: "Parpaing", name: "Bloc beton creux 20 cm", brand: "Point.P", unit: "un", segment: "normal", minCost: 1.32, avgCost: 1.68, maxCost: 2.18 },
  { id: "fr-etics-eps-saint-gobain-normal", country: "Franca", category: "ETICS", subcategory: "ITE EPS", name: "Isolation thermique exterieure EPS 60 mm", brand: "Saint-Gobain", unit: "m2", segment: "normal", minCost: 36, avgCost: 46, maxCost: 58 },
  { id: "fr-etics-lm-saint-gobain-premium", country: "Franca", category: "ETICS", subcategory: "ITE laine minerale", name: "Isolation exterieure laine minerale 80 mm", brand: "Saint-Gobain", unit: "m2", segment: "premium", minCost: 58, avgCost: 72, maxCost: 92 },
  { id: "fr-plasterboard-ba13-knauf-normal", country: "Franca", category: "PLASTERBOARD", subcategory: "Plaque standard", name: "Plaque de platre BA13", brand: "Knauf", unit: "m2", segment: "normal", minCost: 5.4, avgCost: 6.9, maxCost: 9.2 },
  { id: "fr-plasterboard-hydro-knauf-premium", country: "Franca", category: "PLASTERBOARD", subcategory: "Plaque hydrofuge", name: "Plaque de platre hydrofuge", brand: "Knauf", unit: "m2", segment: "premium", minCost: 7.8, avgCost: 9.8, maxCost: 12.6 },
  { id: "fr-painting-mate-normal", country: "Franca", category: "PAINTING", subcategory: "Peinture interieure", name: "Peinture interieure mate", brand: "Saint-Gobain", unit: "l", segment: "normal", minCost: 10.2, avgCost: 13.2, maxCost: 17.4 },
  { id: "fr-painting-gedimat-economic", country: "Franca", category: "PAINTING", subcategory: "Peinture interieure", name: "Peinture acrylique blanche", brand: "Gedimat", unit: "l", segment: "economic", minCost: 8.6, avgCost: 11.1, maxCost: 14.2 },
  { id: "fr-flooring-carrelage-normal", country: "Franca", category: "FLOORING", subcategory: "Carrelage", name: "Carrelage gres cerame moyen format", brand: "Point.P", unit: "m2", segment: "normal", minCost: 18, avgCost: 31, maxCost: 52 },
  { id: "fr-flooring-parquet-premium", country: "Franca", category: "FLOORING", subcategory: "Parquet", name: "Parquet contrecolle chene", brand: null, unit: "m2", segment: "premium", minCost: 42, avgCost: 62, maxCost: 92 },
  { id: "fr-windows-alu-normal", country: "Franca", category: "WINDOWS", subcategory: "Menuiserie aluminium", name: "Menuiserie aluminium rupture pont thermique", brand: "Saint-Gobain", unit: "m2", segment: "normal", minCost: 230, avgCost: 295, maxCost: 395 },
  { id: "fr-hvac-pac-normal", country: "Franca", category: "HVAC", subcategory: "Pompe a chaleur", name: "Unite PAC air-air", brand: null, unit: "kw", segment: "normal", minCost: 620, avgCost: 790, maxCost: 1040 },
  { id: "fr-electrical-tableau-normal", country: "Franca", category: "ELECTRICAL", subcategory: "Tableau electrique", name: "Tableau electrique modulaire", brand: null, unit: "un", segment: "normal", minCost: 340, avgCost: 520, maxCost: 790 },
  { id: "fr-ited-rj45-normal", country: "Franca", category: "ITED", subcategory: "VDI", name: "Cable RJ45 Cat6", brand: null, unit: "m", segment: "normal", minCost: 0.38, avgCost: 0.58, maxCost: 0.86 },
  { id: "fr-scie-detecteur-normal", country: "Franca", category: "SCIE", subcategory: "Detection incendie", name: "Detecteur optique adressable", brand: null, unit: "un", segment: "normal", minCost: 38, avgCost: 56, maxCost: 84 },
]
