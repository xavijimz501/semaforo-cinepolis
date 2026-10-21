import { useMemo } from "react";
import type { HeatmapRow } from "../../../types/dashboard.types";

interface Props {
    rows: HeatmapRow[];
    level: "estado" | "municipio";
    onRowClick?: (estadoId: number) => void;
    onCellClick?: (data: {
        estadoId: number;
        municipioId: number;
        fecha: string;
    }) => void;
    maxHeight?: string;
}

export default function AlertaMatriz({ rows, level, onRowClick, onCellClick, maxHeight = "max-h-[600px]" }: Props) {

    const dates = useMemo(() => {
        if (!rows.length) return [];
        return rows[0].values.map(value => value.day);
    }, [rows]);

    const getColor = (estatus: string) => {
        switch (estatus?.toLowerCase()) {
            case "rojo": return "bg-[#611232]";
            case "naranja": return "bg-orange-500";
            case "verde": return "bg-[#00AFAA]";
            default: return "bg-slate-200";
        }
    };

    if (!rows.length) {
        return (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                <span className="text-sm text-slate-500">No hay información disponible</span>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-3">

            {/* Título */}
            <div className="mb-5 flex items-center justify-center">
                <div className="rounded-lg bg-[#BC955B] px-5 py-1.5 shadow-sm">
                    <span className="text-sm font-semibold text-white">
                        Matriz{" "}
                        {level === "estado"
                            ? "Nacional"
                            : rows.length > 0
                                ? rows[0].name.toLowerCase()
                                : "Municipal"}
                    </span>
                </div>
            </div>

            {/* Tabla con scroll vertical y encabezado fijo */}
            <div className={`w-full overflow-y-auto ${maxHeight}`}>
                <table className="w-full border-collapse table-fixed">

                    <thead className="sticky top-0 z-30 bg-white">
                        <tr className="bg-white">
                            {/* Columna de nombres */}
                            <th className="
                                w-[22%]
                                sm:w-[20%]
                                md:w-[18%]
                                lg:w-[15%]
                                xl:w-[12%]
                                2xl:w-[10%]
                                sticky top-0 left-0 z-40 bg-white border-b border-slate-200
                            " />

                            {/* Cabeceras de fechas: distribuidas equitativamente */}
                            {dates.map(date => (
                                <th
                                    key={date}
                                    className="sticky top-0 z-30 bg-white p-0 align-bottom border-b border-slate-200"
                                    style={{ width: `${78 / dates.length}%` }}
                                >
                                    <div className="
                                        flex items-end justify-center
                                        h-10
                                        sm:h-12
                                        md:h-14
                                        overflow-hidden
                                    ">
                                        <span className="
                                            block
                                            -rotate-90
                                            origin-center
                                            whitespace-nowrap
                                            text-[6px]
                                            sm:text-[7px]
                                            md:text-[8px]
                                            lg:text-[9px]
                                            font-medium
                                            text-slate-500
                                            mb-5
                                        ">
                                            {date}
                                        </span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map(row => (
                            <tr key={row.id}>

                                {/* Nombre de fila */}
                                <td className="
                                    sticky left-0 z-10 bg-white
                                    py-px pr-1.5
                                ">
                                    <button
                                        onClick={() => {
                                            if (level === "estado") onRowClick?.(Number(row.estadoId));
                                        }}
                                        className="group flex w-full items-center text-left"
                                    >
                                        <span className="
                                            block
                                            truncate
                                            text-[9px]
                                            sm:text-[10px]
                                            md:text-[11px]
                                            lg:text-xs
                                            xl:text-sm
                                            font-medium
                                            text-slate-700
                                            group-hover:text-[#611232]
                                            transition-colors
                                        ">
                                            {row.name}
                                        </span>
                                    </button>
                                </td>

                                {/* Celdas de color */}
                                {row.values.map(value => (
                                    <td key={value.day} className="p-[1px]">
                                        <button
                                            onClick={() =>
                                                onCellClick?.({
                                                    estadoId: value.estadoId,
                                                    municipioId: value.municipioId,
                                                    fecha: value.day,
                                                })
                                            }
                                            title={`${value.total} registros`}
                                            className={`
                                                w-full
                                                aspect-square
                                                rounded-xl
                                                ${getColor(value.estatus)}
                                                transition-transform
                                                duration-150
                                                hover:scale-110
                                                hover:z-20
                                                hover:relative
                                                cursor-pointer
                                                block
                                                text-xs
                                                text-slate-100
                                            `}
                                        >
                                            {value.total}
                                        </button>
                                    </td>
                                ))}

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </div>
    );
}