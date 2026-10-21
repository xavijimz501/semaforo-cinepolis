import type { HeatmapRow, MunicipioData } from "../types/dashboard.types";

const estados = [
    "Aguascalientes",
    "Baja California",
    "Baja California Sur",
    "Campeche",
    "Chiapas",
    "Chihuahua",
    "Ciudad de México",
    "Coahuila",
    "Colima",
    "Durango",
    "Guanajuato",
    "Guerrero",
    "Hidalgo",
    "Jalisco",
    "México",
    "Michoacán",
    "Morelos",
    "Nayarit",
    "Nuevo León",
    "Oaxaca",
    "Puebla",
    "Querétaro",
    "Quintana Roo",
    "San Luis Potosí",
    "Sinaloa",
    "Sonora",
    "Tabasco",
    "Tamaulipas",
    "Tlaxcala",
    "Veracruz",
    "Yucatán",
    "Zacatecas",
];

export const DAYS = Array.from(
    { length: 30 },
    (_, index) => `${index + 1}`
);

function random(min: number, max: number) {
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}

export const estadosMock: HeatmapRow[] =
    estados.map((estado, index) => ({
        id: (index + 1).toString(),
        estadoId: index + 1,
        name: estado,
        values: DAYS.map((day) => ({
            day,
            total: random(0, 50),
            estatus: "",
            estadoId: index + 1,
            municipioId: 0,
        })),
    }));

function generateMunicipios(
    estadoId: string,
    estadoNombre: string
): MunicipioData {

    const municipios: HeatmapRow[] =
        Array.from(
            { length: 15 },
            (_, index) => ({
                id: `${estadoId}-${index + 1}`,
                estadoId: Number(estadoId),
                name: `${estadoNombre} Municipio ${index + 1}`,

                values: DAYS.map((day) => ({
                    day,
                    total: random(0, 30),
                    estatus: "verde",
                    estadoId: Number(estadoId),
                    municipioId: index + 1,
                })),
            })
        );

    return {
        estadoId,
        municipios,
    };
}

export const municipiosMock: MunicipioData[] =
    estadosMock.map((estado) =>
        generateMunicipios(
            String(estado.id),
            estado.name
        )
    );