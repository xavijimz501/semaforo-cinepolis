export interface HeatmapCell {
    day: string;
    total: number;
}

export interface HeatmapValue {
    day: string;
    fechaConsulta?: string;
    total: number;
    estatus: string;
    estadoId: number;
    municipioId: number;
}

export interface HeatmapRow {
    id: string |number;
    estadoId: number | string;
    name: string;
    values: HeatmapValue[];
}

export interface MunicipioData {
    estadoId: string;
    municipios: HeatmapRow[];
}

export type DashboardLevel =
    | "estado"
    | "municipio";

export interface DashboardState {
    level: DashboardLevel;
    selectedState: HeatmapRow | null;
}

export interface CumplimientoEstado {
    estado: string;
    porEstatus: number;
    porEstado: number;
    totalRegistros: number;
    totalDesaparecidos: number;
    totalLocalizados: number;
    totalFichasEnviadas: number;
    totalConAlerta: number;
    totalAlertaLoc: number;
    totalAlertaDes: number;
    totalSinAlerta: number;
    totalSinAlertaLoc: number;
    totalSinAlertaDes: number;
    totalArt108: number;
    totalFaltaDato: number;
    cumplimiento: number;
}

export interface AutoridadRow {
    numero: number;
    abreviatura: string;
    autoridad: string;
    registros: number;
    art108: number;
    suceptibles: number;
    conAlerta: number;
    sinAlerta: number;
    localizadoSinAlerta: number;
    sinAlertaFaltanDatos: number;
    alertasvsRegistros: number;
    destinoCanalizaciones?: string;
    tipoDependencia: number;
}

export interface AutoridadGroup {
    idEstadoAutoridad: number;
    autoridades: AutoridadRow[];
}
