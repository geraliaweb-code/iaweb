export * from "./dataset-types"

export * from "./portugal/portugal-materials"
export * from "./portugal/portugal-labor"
export * from "./portugal/portugal-equipment"
export * from "./portugal/portugal-suppliers"
export * from "./portugal/portugal-productivity"

export * from "./france/france-materials"
export * from "./france/france-labor"
export * from "./france/france-equipment"
export * from "./france/france-suppliers"
export * from "./france/france-productivity"

export * from "./spain/spain-materials"
export * from "./spain/spain-labor"
export * from "./spain/spain-equipment"
export * from "./spain/spain-suppliers"
export * from "./spain/spain-productivity"

import { portugalEquipment } from "./portugal/portugal-equipment"
import { portugalLabor } from "./portugal/portugal-labor"
import { portugalMaterials } from "./portugal/portugal-materials"
import { portugalProductivity } from "./portugal/portugal-productivity"
import { portugalSuppliers } from "./portugal/portugal-suppliers"
import { franceEquipment } from "./france/france-equipment"
import { franceLabor } from "./france/france-labor"
import { franceMaterials } from "./france/france-materials"
import { franceProductivity } from "./france/france-productivity"
import { franceSuppliers } from "./france/france-suppliers"
import { spainEquipment } from "./spain/spain-equipment"
import { spainLabor } from "./spain/spain-labor"
import { spainMaterials } from "./spain/spain-materials"
import { spainProductivity } from "./spain/spain-productivity"
import { spainSuppliers } from "./spain/spain-suppliers"

export const europeanMaterials = [...portugalMaterials, ...franceMaterials, ...spainMaterials]
export const europeanLabor = [...portugalLabor, ...franceLabor, ...spainLabor]
export const europeanEquipment = [...portugalEquipment, ...franceEquipment, ...spainEquipment]
export const europeanSuppliers = [...portugalSuppliers, ...franceSuppliers, ...spainSuppliers]
export const europeanProductivity = [...portugalProductivity, ...franceProductivity, ...spainProductivity]
