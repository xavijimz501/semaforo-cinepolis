import { Fragment, useMemo, useState } from "react";
import type { HeatmapRow } from "../../../types/dashboard.types";
import { GetObtenerFub } from "../../../services/dashboard.service";
import { CircleSlash, Siren } from "lucide-react";

type FubRecord = {
    fub: string | number; estatusVictima?: string; edad?: number; fechaHechos?: string;
    fechaPercato?: string; fechaCaptura?: string; existeAlertamiento?: string;
    [key: string]: any;
};

const getFubRecords = (response: any, depth = 0): FubRecord[] => {
    if (depth > 5 || response == null) return [];
    if (Array.isArray(response)) return response.flatMap(item => getFubRecords(item, depth + 1));
    if (typeof response !== "object") return [];

    const keys = Object.keys(response);
    const fubKey = keys.find(k => k.toLowerCase() === "fub" || k.toLowerCase() === "foliofub" || k.toLowerCase() === "nofub");
    if (fubKey && response[fubKey] !== undefined && response[fubKey] !== null && response[fubKey] !== "") {
        const getField = (name: string) => {
            const foundKey = keys.find(k => k.toLowerCase() === name.toLowerCase());
            return foundKey ? response[foundKey] : undefined;
        };

        return [{
            ...response,
            fub: String(response[fubKey]),
            fechaCaptura: getField("fechaCaptura") ?? getField("fecha_captura") ?? getField("fechacaptura") ?? getField("fecha") ?? "",
            estatusVictima: getField("estatusVictima") ?? getField("estatus_victima") ?? getField("estatus") ?? "",
            edad: getField("edad"),
            fechaHechos: getField("fechaHechos") ?? getField("fecha_hechos") ?? "",
            fechaPercato: getField("fechaPercato") ?? getField("fecha_percato") ?? "",
            existeAlertamiento: getField("existeAlertamiento") ?? getField("existe_alertamiento") ?? "",
        }];
    }

    for (const key of Object.keys(response)) {
        if (response[key] && (Array.isArray(response[key]) || typeof response[key] === "object")) {
            const records = getFubRecords(response[key], depth + 1);
            if (records.length) return records;
        }
    }
    return [];
};

const dateKey = (date?: string) => {
    if (!date) return "";
    const str = String(date).trim();
    const isoMatch = str.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (isoMatch) {
        const y = isoMatch[1];
        const m = isoMatch[2].padStart(2, "0");
        const d = isoMatch[3].padStart(2, "0");
        return `${y}-${m}-${d}`;
    }
    const ddmmyyyy = str.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
    if (ddmmyyyy) {
        const d = ddmmyyyy[1].padStart(2, "0");
        const m = ddmmyyyy[2].padStart(2, "0");
        const y = ddmmyyyy[3];
        return `${y}-${m}-${d}`;
    }
    return str.slice(0, 10);
};

const getTotalRegistros = (response: any, recordsLength: number): number => {
    if (response == null) return recordsLength;
    if (typeof response.totalRegistros === "number") return response.totalRegistros;
    if (typeof response.totalRegistros === "string" && !isNaN(Number(response.totalRegistros))) return Number(response.totalRegistros);
    if (typeof response.total === "number") return response.total;
    if (typeof response.totalFubs === "number") return response.totalFubs;
    if (response.data && typeof response.data.totalRegistros === "number") return response.data.totalRegistros;
    return recordsLength;
};

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

export default function AlertaMatriz({ rows, level, onRowClick, onCellClick, maxHeight = "max-h-[800px]" }: Props) {
    const [fubResult, setFubResult] = useState<{
        rowId: string;
        clickedDate: string;
        records: FubRecord[];
        totalRegistros: number;
        clickedEstatus?: string;
    } | null>(null);
    const [loadingFubRow, setLoadingFubRow] = useState<string | null>(null);
    const [selectedFub, setSelectedFub] = useState<FubRecord | null>(null);

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

                            {/* Cabeceras de fechas */}
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
                            <Fragment key={row.id}>
                                <tr>

                                    {/* Nombre de fila */}
                                    <td className="
                                    sticky left-0 z-10 bg-white
                                    py-0 pr-1
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
                                            text-[8px]
                                            sm:text-[9px]
                                            md:text-[10px]
                                            lg:text-[11px]
                                            font-medium
                                            text-slate-700
                                            group-hover:text-[#611232]
                                            transition-colors
                                            leading-tight
                                        ">
                                                {row.name}
                                            </span>
                                        </button>
                                    </td>

                                    {/* Celdas de color */}
                                    {row.values.map(value => (
                                        <td key={value.day} className="p-[0.5px]">
                                            <button
                                                onClick={async () => {
                                                    const cellDate = dateKey(value.fechaConsulta ?? value.day);
                                                    if (fubResult?.rowId === String(row.id) && fubResult?.clickedDate === cellDate) {
                                                        setFubResult(null);
                                                        return;
                                                    }

                                                    onCellClick?.({
                                                        estadoId: value.estadoId,
                                                        municipioId: value.municipioId,
                                                        fecha: value.fechaConsulta ?? value.day,
                                                    });
                                                    setLoadingFubRow(String(row.id));
                                                    setFubResult(null);
                                                    try {
                                                        const response = await GetObtenerFub(value.estadoId, cellDate);
                                                        const records = getFubRecords(response);
                                                        setFubResult({
                                                            rowId: String(row.id),
                                                            clickedDate: cellDate,
                                                            records,
                                                            totalRegistros: getTotalRegistros(response, records.length),
                                                            clickedEstatus: value.estatus, // Guardamos el estatus exacto del botón clickeado
                                                        });
                                                    } catch (error) {
                                                        console.error("No se pudo obtener el detalle FUB", error);
                                                        setFubResult({ rowId: String(row.id), clickedDate: dateKey(cellDate), records: [], totalRegistros: 0, clickedEstatus: value.estatus });
                                                    } finally {
                                                        setLoadingFubRow(null);
                                                    }
                                                }}
                                                title={`${value.total} registros`}
                                                className={`
                                                w-full
                                                aspect-square
                                                max-w-[22px]
                                                max-h-[22px]
                                                mx-auto
                                                rounded-md
                                                ${getColor(value.estatus)}
                                                transition-transform
                                                duration-150
                                                hover:scale-110
                                                hover:z-20
                                                hover:relative
                                                cursor-pointer
                                                flex
                                                items-center
                                                justify-center
                                                text-[9px]
                                                font-medium
                                                text-slate-100
                                                leading-none
                                            `}
                                            >
                                                {value.total}
                                            </button>
                                        </td>
                                    ))}

                                </tr>
                                {fubResult?.rowId === String(row.id) && (
                                    <tr className="bg-slate-50/70">
                                        <td className="sticky left-0 z-10 border-b border-slate-200 bg-slate-50 px-1 py-1 text-[9px] font-semibold text-slate-700 shadow-sm leading-tight">
                                            Fechas de captura ({fubResult.totalRegistros})
                                        </td>
                                        {dates.map((date, index) => {
                                            const headerDateKey = dateKey(date);
                                            const records = fubResult.records.filter(record => {
                                                const recDateKey = dateKey(record.fechaCaptura);
                                                return recDateKey === headerDateKey;
                                            });

                                            const cellValue = row.values[index] ?? row.values.find(v => dateKey(v.day) === headerDateKey);
                                            const estatusDia = cellValue?.estatus;

                                            return (
                                                <td key={date} className="p-[0.5px]">
                                                    {records.map(record => {
                                                        const noTieneAlertamiento = String(record.existeAlertamiento ?? "").trim().toUpperCase() === "NO"; //Aqui guardamos la consulta en caso de que no tenga alertamiento
                                                        return (
                                                            <button
                                                                key={String(record.fub)}
                                                                onClick={() => setSelectedFub(record)}
                                                                title={`FUB: ${record.fub} · Clic para ver detalle`}
                                                                aria-label={`Ver detalle FUB ${record.fub}`}
                                                                className={`
                                                                    w-full
                                                                    aspect-square
                                                                    max-w-[22px]
                                                                    max-h-[22px]
                                                                    mx-auto
                                                                    rounded-md
                                                                    ${getColor(fubResult?.clickedEstatus ?? estatusDia ?? "")}
                                                                    transition-transform
                                                                    duration-150
                                                                    hover:scale-110
                                                                    hover:z-20
                                                                    hover:relative
                                                                    cursor-pointer
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                    text-[9px]
                                                                    text-slate-100
                                                                `}
                                                            >
                                                                {noTieneAlertamiento ? (
                                                                    <Siren size={13} className="text-white" />
                                                                ) : (
                                                                    <CircleSlash size={13} className="text-white" />
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                    {records.length === 0 && <div aria-hidden="true" className="w-full aspect-square max-w-[22px] mx-auto" />}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                )}
                                {loadingFubRow === String(row.id) && <tr><td colSpan={dates.length + 1} className="bg-slate-50 px-3 py-2 text-xs text-slate-500">Cargando detalle FUB…</td></tr>}
                            </Fragment>
                        ))}
                    </tbody>

                </table>
            </div>

            {selectedFub && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={() => setSelectedFub(null)}>
                    <div role="dialog" aria-modal="true" aria-labelledby="fub-title" className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl" onClick={event => event.stopPropagation()}>
                        <div className="mb-4 flex items-center justify-between"><h2 id="fub-title" className="text-lg font-semibold text-[#611232]">Detalle</h2><button aria-label="Cerrar detalle" onClick={() => setSelectedFub(null)} className="rounded px-2 py-1 text-slate-500 hover:bg-slate-100">✕</button></div>
                        <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 text-sm">
                            {([["FUB", selectedFub.fub], ["Estatus víctima", selectedFub.estatusVictima], ["Edad", selectedFub.edad], ["Fecha de hechos", selectedFub.fechaHechos], ["Fecha de percato", selectedFub.fechaPercato], ["Fecha de captura", selectedFub.fechaCaptura], ["Existe alertamiento", selectedFub.existeAlertamiento]] as const).map(([label, value]) => <Fragment key={label}><dt className="font-medium text-slate-500">{label}</dt><dd className="break-words text-slate-800">{value ?? "—"}</dd></Fragment>)}
                        </dl>
                    </div>
                </div>
            )}

        </div>
    );
}