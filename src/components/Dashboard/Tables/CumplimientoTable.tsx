import { useMemo } from "react";
import type { CumplimientoEstado } from "../../../types/dashboard.types";

interface Props {
    rows: CumplimientoEstado[];
    onEstadoClick?: (estado: string) => void;
    maxHeight?: string;
}

export default function CumplimientoTable({ rows, onEstadoClick, maxHeight = "max-h-[600px]" }: Props) {

    const totals = useMemo(() => {
        return rows.reduce((acc, item) => ({
            totalRegistros: acc.totalRegistros + item.totalRegistros,
            totalDesaparecidos: acc.totalDesaparecidos + item.totalDesaparecidos,
            totalLocalizados: acc.totalLocalizados + item.totalLocalizados,
            totalConAlerta: acc.totalConAlerta + item.totalConAlerta,
            totalAlertaLoc: acc.totalAlertaLoc + item.totalAlertaLoc,
            totalAlertaDes: acc.totalAlertaDes + item.totalAlertaDes,
            totalSinAlerta: acc.totalSinAlerta + item.totalSinAlerta,
            totalSinAlertaLoc: acc.totalSinAlertaLoc + item.totalSinAlertaLoc,
            totalSinAlertaDes: acc.totalSinAlertaDes + item.totalSinAlertaDes,
            totalArt108: acc.totalArt108 + item.totalArt108,
            totalFaltaDato: acc.totalFaltaDato + item.totalFaltaDato,
        }), {
            totalRegistros: 0, totalDesaparecidos: 0, totalLocalizados: 0,
            totalConAlerta: 0, totalAlertaLoc: 0, totalAlertaDes: 0,
            totalSinAlerta: 0, totalSinAlertaLoc: 0, totalSinAlertaDes: 0,
            totalArt108: 0, totalFaltaDato: 0,
        });
    }, [rows]);

    const getCumplimientoColor = (value: number) => {
        if (value >= 90) return "bg-emerald-500";
        if (value >= 70) return "bg-amber-500";
        return "bg-red-500";
    };

    if (!rows.length) {
        return (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                <span className="text-sm text-slate-500">No hay información disponible</span>
            </div>
        );
    }

    // Clases compartidas para compactar celdas de datos
    const cellBase = "py-1.5 px-1 text-center text-xs";
    const thBase = "sticky top-0 z-30 bg-[#611232] px-1 py-2 text-center text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-semibold tracking-tight text-white border-b border-[#4d0e27]";

    const sortedRows = useMemo(() => {
        return [...rows].sort((a, b) => a.cumplimiento - b.cumplimiento);
    }, [rows]);

    return (
        <div className={`w-full overflow-y-auto overflow-x-auto ${maxHeight} rounded-2xl border border-slate-200 bg-white shadow-sm`}>

            <table className="w-full border-collapse table-fixed min-w-[700px]">

                {/* Anchos de columna proporcionales */}
                <colgroup>
                    {/* Estado — más ancha */}
                    <col className="w-[14%]" />
                    {/* 11 columnas numéricas — distribuidas */}
                    {Array.from({ length: 11 }).map((_, i) => (
                        <col key={i} style={{ width: "5.5%" }} />
                    ))}
                    {/* Cumplimiento — algo más ancha */}
                    <col className="w-[9%]" />
                </colgroup>

                <thead className="sticky top-0 z-30 bg-[#611232]">
                    <tr className="bg-[#611232] text-white">

                        <th className="sticky top-0 left-0 z-40 bg-[#611232] px-3 py-2 text-left text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-semibold text-white border-b border-[#4d0e27]">
                            Estado
                        </th>

                        {[
                            "Registros", "Desaparecidos", "Localizados",
                            "Con Alerta", "Alerta Loc.", "Alerta Des.",
                            "Sin Alerta", "Sin Alerta Loc.", "Sin Alerta Des.",
                            "Art.108",
                        ].map(label => (
                            <th key={label} className={thBase}>{label}</th>
                        ))}

                        {/* Falta Dato — amarillo */}
                        <th className="sticky top-0 z-30 px-1 py-2 text-center text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-semibold tracking-tight bg-amber-400 text-amber-900 border-b border-amber-500">
                            Falta Dato
                        </th>

                        <th className={thBase}>Cumplimiento</th>

                    </tr>
                </thead>

                <tbody>
                    {sortedRows.map((row, index) => (
                        <tr
                            key={row.estado}
                            className={`
                                border-b border-slate-100 transition-colors hover:bg-slate-100
                                ${index % 2 === 0 ? "bg-white" : "bg-slate-100"}
                            `}
                        >
                            {/* Nombre del estado */}
                            <td className={`
                                sticky left-0 z-10 px-3 py-1.5
                                ${index % 2 === 0 ? "bg-white" : "bg-slate-100"}
                            `}>
                                <button
                                    onClick={() => onEstadoClick?.(row.estado)}
                                    className="group flex items-center gap-1.5 cursor-pointer w-full"
                                >
                                    <div className="h-2 w-2 shrink-0 rounded-full bg-[#611232]" />
                                    <span className="
                                        truncate
                                        text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs
                                        font-semibold text-slate-700 group-hover:text-[#611232]
                                        transition-colors
                                    ">
                                        {row.estado}
                                    </span>
                                </button>
                            </td>

                            <td className={cellBase}>{row.totalRegistros}</td>
                            <td className={cellBase}>{row.totalDesaparecidos}</td>
                            <td className={cellBase}>{row.totalLocalizados}</td>
                            <td className={cellBase}>{row.totalConAlerta}</td>
                            <td className={cellBase}>{row.totalAlertaLoc}</td>
                            <td className={cellBase}>{row.totalAlertaDes}</td>
                            <td className={cellBase}>{row.totalSinAlerta}</td>
                            <td className={cellBase}>{row.totalSinAlertaLoc}</td>
                            <td className={cellBase}>{row.totalSinAlertaDes}</td>
                            <td className={cellBase}>{row.totalArt108}</td>

                            {/* Falta Dato — fondo amarillo */}
                            <td className={`${cellBase} bg-amber-50 text-amber-800 font-medium`}>
                                {row.totalFaltaDato}
                            </td>

                            {/* Cumplimiento con barra */}
                            <td className="px-2 py-1.5">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-1.5 flex-1 rounded-full bg-slate-200 min-w-0">
                                        <div
                                            className={`h-1.5 rounded-full ${getCumplimientoColor(row.cumplimiento)}`}
                                            style={{ width: `${row.cumplimiento}%` }}
                                        />
                                    </div>
                                    <span className="shrink-0 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-semibold">
                                        {row.cumplimiento.toFixed(0)}%
                                    </span>
                                </div>
                            </td>

                        </tr>
                    ))}
                </tbody>

                <tfoot>
                    <tr className="bg-slate-900 text-white font-bold">

                        <td className="px-3 py-2 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-bold tracking-wider sticky left-0 z-10 bg-slate-900 text-white">
                            TOTAL
                        </td>

                        {[
                            totals.totalRegistros, totals.totalDesaparecidos, totals.totalLocalizados,
                            totals.totalConAlerta, totals.totalAlertaLoc, totals.totalAlertaDes,
                            totals.totalSinAlerta, totals.totalSinAlertaLoc, totals.totalSinAlertaDes,
                            totals.totalArt108,
                        ].map((val, i) => (
                            <td key={i} className="py-2 px-1 text-center text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs">
                                {val}
                            </td>
                        ))}

                        {/* Total Falta Dato — amarillo en footer también */}
                        <td className="py-2 px-1 text-center text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs bg-amber-500 text-amber-950 font-bold">
                            {totals.totalFaltaDato}
                        </td>

                        <td />
                    </tr>
                </tfoot>

            </table>

        </div>
    );
}