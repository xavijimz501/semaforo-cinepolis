import { useMemo } from "react";

import type { AutoridadGroup } from "../../../types/dashboard.types";

interface Props {
    rows: AutoridadGroup[];
    onAutoridadClick?: (autoridad: string) => void;
    maxHeight?: string;
}

export default function AutoridadesTable({ rows, onAutoridadClick, maxHeight = "max-h-[600px]" }: Props) {

    const flatRows = useMemo(() => {
        return rows.flatMap(grupo => grupo.autoridades);
    }, [rows]);

    const totals = useMemo(() =>
        flatRows.reduce((acc, r) => ({
            registros: acc.registros + r.registros,
            art108: acc.art108 + r.art108,
            suceptibles: acc.suceptibles + r.suceptibles,
            conAlerta: acc.conAlerta + r.conAlerta,
            sinAlerta: acc.sinAlerta + r.sinAlerta,
            localizadoSinAlerta: acc.localizadoSinAlerta + r.localizadoSinAlerta,
            sinAlertaFaltanDatos: acc.sinAlertaFaltanDatos + r.sinAlertaFaltanDatos,
        }), {
            registros: 0,
            art108: 0,
            suceptibles: 0,
            conAlerta: 0,
            sinAlerta: 0,
            localizadoSinAlerta: 0,
            sinAlertaFaltanDatos: 0,
        })
        , [flatRows]);

    // Alertas vs Registros = (conAlerta / registros) * 100
    const calcAlertas = (conAlerta: number, registros: number) =>
        registros > 0 ? ((conAlerta / registros) * 100).toFixed(1) + "%" : "—";

    const getAlertasColor = (conAlerta: number, registros: number) => {
        if (!registros) return "";
        const pct = (conAlerta / registros) * 100;
        if (pct >= 70) return "text-emerald-700 font-semibold";
        if (pct >= 40) return "text-amber-700 font-semibold";
        return "text-red-700 font-semibold";
    };

    const thBase = "sticky top-0 z-30 bg-[#611232] px-1 py-2 text-center text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-semibold tracking-tight text-white border-b border-[#4d0e27]";
    const tdBase = "py-1.5 px-1 text-center text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs tabular-nums";


    if (!rows.length) {
        return (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                <span className="text-sm text-slate-500">No hay información disponible</span>
            </div>
        );
    }

    const sortedGroups = useMemo(() => {

        let cnb: any = null;
        let portal: any = null;
        let fgr: any = null;

        //
        // 1. Reagrupar autoridades federales
        //
        const grupos = rows.map(grupo => {

            const autoridades = grupo.autoridades.filter(a => {

                const nombre = (a.autoridad || "").trim().toUpperCase();

                if (nombre === "COMISION NACIONAL DE BUSQUEDA DE PERSONAS") {
                    cnb = a;
                    return false;
                }

                if (nombre === "PORTAL") {
                    portal = a;
                    return false;
                }

                if (
                    nombre === "FISCALIA GENERAL DE LA REPUBLICA" ||
                    nombre === "FISCALÍA GENERAL DE LA REPÚBLICA"
                ) {
                    fgr = a;
                    return false;
                }

                return true;

            });

            //
            // 2. Ordenar autoridades del grupo
            //
            autoridades.sort((a, b) => {

                const tipoA = Number(a.tipoDependencia ?? 999);
                const tipoB = Number(b.tipoDependencia ?? 999);

                if (tipoA !== tipoB) {
                    return tipoA - tipoB;
                }

                return (a.autoridad || "")
                    .localeCompare(b.autoridad || "");

            });

            return {
                ...grupo,
                autoridades
            };

        });

        //
        // 3. Crear grupo federal
        //
        const grupoFederal = [cnb, portal, fgr]
            .filter(Boolean)
            .sort((a, b) => {

                const nombreA = (a.autoridad || "").trim().toUpperCase();
                const nombreB = (b.autoridad || "").trim().toUpperCase();

                const prioridad = (nombre: string) => {

                    if (
                        nombre === "COMISION NACIONAL DE BUSQUEDA DE PERSONAS"
                    ) {
                        return 1;
                    }

                    if (
                        nombre === "PORTAL"
                    ) {
                        return 2;
                    }

                    if (
                        nombre === "FISCALIA GENERAL DE LA REPUBLICA" ||
                        nombre === "FISCALÍA GENERAL DE LA REPÚBLICA"
                    ) {
                        return 3;
                    }

                    return 999;
                };

                return prioridad(nombreA) - prioridad(nombreB);

            });

        if (grupoFederal.length) {

            grupos.push({
                idEstadoAutoridad: -1,
                autoridades: grupoFederal
            });

        }

        //
        // 4. Ordenar grupos por el menor alertasvsRegistros
        //
        return grupos.sort((a, b) => {

            const minA = a.autoridades.length
                ? Math.min(
                    ...a.autoridades.map(
                        x => Number(x.alertasvsRegistros ?? 0)
                    )
                )
                : Infinity;

            const minB = b.autoridades.length
                ? Math.min(
                    ...b.autoridades.map(
                        x => Number(x.alertasvsRegistros ?? 0)
                    )
                )
                : Infinity;

            return minA - minB;

        });

    }, [rows]);

    const getCumplimientoBg = (value: number) => {
        if (value >= 70) return "bg-emerald-500";
        if (value >= 40) return "bg-amber-500";
        return "bg-red-500";
    };

    return (
        <div className={`w-full overflow-y-auto overflow-x-auto ${maxHeight} rounded-2xl border border-slate-200 bg-white shadow-sm`}>

            <table className="w-full border-collapse table-fixed min-w-[680px]">

                <colgroup>
                    {/* Autoridad — más ancha */}
                    <col style={{ width: "18%" }} />
                    {/* Registros, Art108, Suceptibles, Con Alerta, Sin Alerta */}
                    {Array.from({ length: 5 }).map((_, i) => (
                        <col key={i} style={{ width: "7%" }} />
                    ))}
                    {/* Sin Alerta (Localizados) — amarillo */}
                    <col style={{ width: "9%" }} />
                    {/* Sin Alerta (Faltan Datos) — amarillo */}
                    <col style={{ width: "9%" }} />
                    {/* Alertas vs Registros */}
                    <col style={{ width: "9%" }} />
                </colgroup>

                <thead className="sticky top-0 z-30 bg-[#611232]">
                    <tr className="bg-[#611232] text-white">

                        <th className="sticky top-0 left-0 z-40 bg-[#611232] px-3 py-2 text-left text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-semibold text-white border-b border-[#4d0e27]">
                            Autoridad
                        </th>

                        {["Registros", "Art. 108", "Suceptibles", "Con Alerta", "Sin Alerta"].map(label => (
                            <th key={label} className={thBase}>{label}</th>
                        ))}

                        {/* Sin Alerta (Localizados) — encabezado amarillo */}
                        <th className="sticky top-0 z-30 px-1 py-2 text-center text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-semibold tracking-tight bg-amber-400 text-amber-900 border-b border-amber-500">
                            Sin Alerta
                            <br />
                            <span className="font-normal">(Localizados)</span>
                        </th>

                        {/* Sin Alerta (Faltan Datos) — encabezado amarillo */}
                        <th className="sticky top-0 z-30 px-1 py-2 text-center text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-semibold tracking-tight bg-amber-400 text-amber-900 border-b border-amber-500">
                            Sin Alerta
                            <br />
                            <span className="font-normal">(Faltan Datos)</span>
                        </th>

                        <th className={thBase}>
                            Alertas vs
                            <br />
                            <span className="font-normal">Registros</span>
                        </th>

                    </tr>
                </thead>

                <tbody>
                    {
                        sortedGroups.map((grupo, grupoIndex) =>

                            grupo.autoridades.map((row) => (

                                <tr
                                    key={row.numero}
                                    className={`
                                        border-b border-slate-100 transition-colors hover:bg-slate-100
                                        ${grupoIndex % 2 === 0
                                            ? "bg-white"
                                            : "bg-slate-100"}
                                    `}
                                >

                                    <td
                                        className={`
                                            sticky left-0 z-10 px-3 py-1.5
                                            ${grupoIndex % 2 === 0
                                                ? "bg-white"
                                                : "bg-slate-100"}
                                        `}
                                    >
                                        <button
                                            onClick={() => onAutoridadClick?.(row.autoridad)}
                                            className="group flex items-center gap-1.5 cursor-pointer w-full"
                                        >
                                            <div className="h-2 w-2 shrink-0 rounded-full bg-[#611232]" />

                                            <span
                                                title={row.autoridad}
                                                className="
                                                    truncate
                                                    text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs
                                                    font-semibold text-slate-700
                                                    group-hover:text-[#611232]
                                                    transition-colors
                                                "
                                            >
                                                {row.abreviatura}
                                            </span>
                                        </button>
                                    </td>

                                    <td className={tdBase}>{row.registros}</td>
                                    <td className={tdBase}>{row.art108}</td>
                                    <td className={tdBase}>{row.suceptibles}</td>
                                    <td className={tdBase}>{row.conAlerta}</td>
                                    <td className={tdBase}>{row.sinAlerta}</td>

                                    <td className={`${tdBase} bg-amber-50 text-amber-800`}>
                                        {row.localizadoSinAlerta}
                                    </td>

                                    <td className={`${tdBase} bg-amber-50 text-amber-800`}>
                                        {row.sinAlertaFaltanDatos}
                                    </td>

                                    <td className="px-2 py-1.5">
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-1.5 flex-1 rounded-full bg-slate-200 min-w-0">
                                                <div
                                                    className={`h-1.5 rounded-full ${getCumplimientoBg(
                                                        row.alertasvsRegistros
                                                    )}`}
                                                    style={{
                                                        width: `${row.alertasvsRegistros}%`,
                                                    }}
                                                />
                                            </div>

                                            <span
                                                className={`text-xs ${getAlertasColor(
                                                    row.conAlerta,
                                                    row.registros
                                                )}`}
                                            >
                                                {calcAlertas(
                                                    row.conAlerta,
                                                    row.registros
                                                )}
                                            </span>
                                        </div>
                                    </td>

                                </tr>

                            ))
                        )
                    }
                </tbody>

                <tfoot>
                    <tr className="bg-slate-900 text-white font-bold">

                        <td className="px-3 py-2 text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-bold tracking-wider sticky left-0 z-10 bg-slate-900">
                            TOTAL
                        </td>

                        {[
                            totals.registros,
                            totals.art108,
                            totals.suceptibles,
                            totals.conAlerta,
                            totals.sinAlerta,
                        ].map((val, i) => (
                            <td key={i} className="py-2 px-1 text-center text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs">
                                {val}
                            </td>
                        ))}

                        {/* Totales amarillos */}
                        <td className="py-2 px-1 text-center text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs bg-amber-500 text-amber-950 font-bold">
                            {totals.localizadoSinAlerta}
                        </td>
                        <td className="py-2 px-1 text-center text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs bg-amber-500 text-amber-950 font-bold">
                            {totals.sinAlertaFaltanDatos}
                        </td>

                        {/* Alertas vs Registros total */}
                        <td className="py-2 px-1 text-center text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs font-bold">
                            {calcAlertas(totals.conAlerta, totals.registros)}
                        </td>

                    </tr>
                </tfoot>

            </table>

        </div>
    );
}