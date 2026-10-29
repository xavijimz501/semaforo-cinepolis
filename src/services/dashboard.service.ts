import { apiRequest } from "../lib/api";
import { axiosInstance } from "../lib/axios";

export const GetEntidadesByAlertaTable = () =>
    apiRequest<any>(
        axiosInstance.get(`/api/Alertas`)
    );

export const GetEntidadesByAlertaTableEstado = (idEstado: any) =>
    apiRequest<any>(
        axiosInstance.get(`/api/Alertas/alertas-entidad`, {
            params: {
                idEstado,
            },
        })
    );

export const GetTotalesIncremento = (idEstado: any) =>
    apiRequest<any>(
        axiosInstance.get(`/api/Alertas/incremento-desaparecidos`, {
            params: {
                idEstado,
            },
        })
    );

export const GetObtenerFub = (idEstado: number, fechaConsulta: string) => {
    let formattedDate = fechaConsulta.trim();
    // Si viene en DD/MM/YYYY o DD-MM-YYYY convertir a YYYY-MM-DD
    const ddmmyyyy = formattedDate.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
    if (ddmmyyyy) {
        const d = ddmmyyyy[1].padStart(2, "0");
        const m = ddmmyyyy[2].padStart(2, "0");
        const y = ddmmyyyy[3];
        formattedDate = `${y}-${m}-${d}`;
    } else {
        const isoMatch = formattedDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
        if (isoMatch) {
            const y = isoMatch[1];
            const m = isoMatch[2].padStart(2, "0");
            const d = isoMatch[3].padStart(2, "0");
            formattedDate = `${y}-${m}-${d}`;
        }
    }

    return apiRequest<any>(
        axiosInstance.get(`/api/Alertas/obtenerFUB`, {
            params: { idEstado, fechaConsulta: formattedDate },
        })
    );
};

export const GetTableCumplimiento = (estado?: any, periodo?: string) =>
    apiRequest<any>(
        axiosInstance.get(`/api/Fichas/estadistica-rnpdno-alerta`, {
            params: {
                estado,
                ...(periodo ? { periodo } : {}),
            },
        })
    );

export const GetTableAutoridades = (estado?: any, periodo?: string) =>
    apiRequest<any>(
        axiosInstance.get(`/api/Fichas/estadistica-rnpdno-alerta-canalizacion`, {
            params: {
                estado,
                ...(periodo ? { periodo } : {}),
            },
        })
    );
