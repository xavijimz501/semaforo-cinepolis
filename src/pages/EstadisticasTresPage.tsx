import { useEffect, useState } from "react";

import { Clock, Calendar } from "lucide-react";
import { GetTableAutoridades, GetTableCumplimiento } from "../services/dashboard.service";
import LoaderStyled from "../components/Dashboard/Loader/Loader";
import AutoridadesTable from "../components/Dashboard/Tables/AutoridadesTable";
import CumplimientoTableHomologada from "../components/Dashboard/Tables/CumplimientoTableHomologada";

type PeriodoType = "15dias" | "72horas";

export default function EstadisticasTresPage() {

    const [periodo, setPeriodo] = useState<PeriodoType>("15dias");
    const [loadingTableAutoridades, setLoadingTableAutoridades] = useState<boolean>(true);
    const [loadingTableCumplimiento, setLoadingTableCumplimiento] = useState<boolean>(true);
    const [dataAutoridades, setDataAutoridades] = useState<any>(null);
    const [dataCumplimiento, setDataCumplimiento] = useState<any>(null);

    useEffect(() => {
        loadTableCumplimiento();
        loadTableAutoridades(undefined, periodo);
    }, [periodo]);

    const loadTableCumplimiento = async (estado?: string) => {
        try {
            setLoadingTableCumplimiento(true);
            const response = await GetTableCumplimiento(estado);
            setDataCumplimiento(response);
            setLoadingTableCumplimiento(false);
        } catch (error) {
            console.log("No se pudo obtener la información de tabla de cumplimiento");
        }
    };

    const loadTableAutoridades = async (estado?: string, periodoSeleccionado: PeriodoType = periodo) => {
        try {
            setLoadingTableAutoridades(true);
            const response = await GetTableAutoridades(estado, periodoSeleccionado);
            setDataAutoridades(response);

        } catch (error) {
            console.log("No se pudo obtener la información de tabla de autoridades", error);
        } finally {
            setLoadingTableAutoridades(false);
        }
    };

    return (
        <>
            <div className="p-8">

                <div className="mb-8">
                    <div className="flex items-center justify-between">

                        <div>
                            <div className="mb-2 inline-flex items-center rounded-full bg-[#611232]/10 px-4 py-1 text-sm font-medium text-[#611232]">
                                Seguimiento Nacional
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight text-[#611232]">
                                Monitoreo de Alertamientos
                            </h1>

                            <p className="mt-3 max-w-3xl text-sm text-slate-600">
                                Monitoreo institucional del cumplimiento de los procesos
                                de alertamiento, localización y clasificación de registros
                                a nivel nacional.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
                            <div className="text-xs uppercase tracking-wide text-slate-500">
                                Última actualización
                            </div>
                            <div className="mt-1 font-semibold text-slate-800">
                                {new Date().toLocaleDateString("es-MX")}
                            </div>
                        </div>

                    </div>
                </div>

                <div>
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="text-2xl font-bold tracking-tight text-[#611232]">
                            Cumplimiento de Alertas por Autoridad
                        </h1>

                        {/* Pestañas de Período */}
                        <div className="inline-flex rounded-xl bg-slate-200/80 p-1 shadow-inner">
                            <button
                                type="button"
                                onClick={() => setPeriodo("15dias")}
                                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${periodo === "15dias"
                                    ? "bg-[#611232] text-white shadow-sm"
                                    : "text-slate-600 hover:text-slate-900"
                                    }`}
                            >
                                <Calendar size={15} />
                                15 Días
                            </button>

                            <button
                                type="button"
                                onClick={() => setPeriodo("72horas")}
                                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${periodo === "72horas"
                                    ? "bg-[#611232] text-white shadow-sm"
                                    : "text-slate-600 hover:text-slate-900"
                                    }`}
                            >
                                <Clock size={15} />
                                72 Horas
                            </button>
                        </div>
                    </div>

                    {
                        loadingTableAutoridades ? (
                            <LoaderStyled text={`Cargando Tabla de Autoridades (${periodo === "15dias" ? "15 Días" : "72 Horas"})`} />
                        ) : (
                            <>
                                <AutoridadesTable rows={dataAutoridades ?? []} />
                            </>
                        )
                    }
                </div>

                <div className="my-5 space-y-10">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#611232] mb-6">
                            Cumplimiento de Alertas por entidad
                        </h1>

                        {
                            loadingTableCumplimiento ? (
                                <LoaderStyled text="Cargando Tabla de cumplimiento" />
                            ) : (
                                <>
                                    <CumplimientoTableHomologada rows={dataCumplimiento} /* onEstadoClick={handleEstadoClick} */ />
                                </>

                            )
                        }

                    </div>
                </div>

            </div>
        </>
    );
}