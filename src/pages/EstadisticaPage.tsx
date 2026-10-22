import { useEffect, useState } from "react";

import { ArrowLeft } from "lucide-react";
import ChartSkeleton from "../components/Dashboard/Skeleton/SkeletonChart";

import AlertaMatriz from "../components/Dashboard/matriz/AlertaMatriz";
import EdadChart from "../components/Dashboard/charts/EdadChart";
import EnfoqueChart from "../components/Dashboard/charts/EnfoqueChart";
import LoaderStyled from "../components/Dashboard/Loader/Loader";

import SexoChart from "../components/Dashboard/charts/SexoChart";

import type { HeatmapRow } from "../types/dashboard.types";

import { GetEntidadesByAlertaTable, GetEntidadesByAlertaTableEstado, GetTotalesIncremento } from "../services/dashboard.service";



export default function EstadisticasPage() {

    // const [filters, setFilters] = useState<{ estado_id: number | null, municipio_id: number | null }>({ estado_id: null, municipio_id: null });

    const [estadoFilter, setEstadoFilter] = useState<number | null>();

    const [heatmapEstados, setHeatmapEstados] = useState<HeatmapRow[]>([]);
    const [dataChart, setDataChart] = useState<any>(null);

    const [loadingHeatmap, setLoadingHeatmap] = useState<boolean>(true);
    const [loadingCharts, setLoadingCharts] = useState<boolean>(true);

    useEffect(() => {
        loadMatriz();
        loadGraficas();
    }, []);

    const loadMatriz = async (estadoID?: number) => {
        try {

            setLoadingHeatmap(true);

            const response = await (estadoID != undefined ? GetEntidadesByAlertaTableEstado(estadoID) : GetEntidadesByAlertaTable());

            let rows: HeatmapRow[] = [];

            if (estadoID != undefined) {

                const estado = response[0];

                rows = estado.municipios.map((municipio: any) => ({
                    id: String(municipio.idMunicipio),
                    estadoId: estado.idEstado,
                    name: municipio.municipio,
                    values: municipio.detalleUltimos30Dias.map((dia: any) => ({
                        day: dia.fecha,
                        fechaConsulta: dia.fecha,
                        total: dia.totalRegistros,
                        estatus: dia.estatusDia,
                        estadoId: estado.idEstado,
                        municipioId: municipio.idMunicipio,
                    })),
                }));

            } else {

                rows = response.map((estado: any) => ({
                    id: String(estado.idEstado),

                    estadoId: estado.idEstado,

                    name: estado.entidad,

                    values: estado.detalleUltimos30Dias.map((dia: any) => ({
                        day: dia.fecha.slice(0, 10),
                        fechaConsulta: dia.fecha,
                        total: dia.totalRegistros,
                        estatus: dia.estatusDia,
                        estadoId: estado.idEstado,
                        municipioId: 0,
                    })),
                }));

            }

            setHeatmapEstados(rows);
            setLoadingHeatmap(false)

        } catch (error) {
            console.log("No se pudo obtener la información de la matriz inicial");
        }
    }

    const loadGraficas = async (estadoID?: number) => {

        try {
            setLoadingCharts(true);
            const response = await GetTotalesIncremento(estadoID);
            setDataChart(response);
            setLoadingCharts(false);

        } catch (error) {
            console.log("No se pudo obtener la información de las graficas iniciales");
        }

    };

    const handleEstadoClick = (estadoId: number) => {

        console.log("Estado ID:", estadoId);

        if (estadoId == 0) {
            loadMatriz();
            loadGraficas();
        } else {
            loadMatriz(estadoId);
            loadGraficas(estadoId);
        }

        setEstadoFilter(estadoId)

    };

    const handleCellClick = (_data: { estadoId: number; municipioId: number; fecha: string; }) => {
        //console.log("Click celda", data);
        // setFilters(prev => ({
        //     ...prev,
        //     estado_id:
        //         data.estadoId,
        // }));
    };

    return (
        <>
            <div className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-[1800px] px-4 lg:px-6">

                    <div className="mb-8 border-b border-gray-200 pb-5">
                        <h1 className="text-4xl font-bold text-[#611232]">
                            Panel Estadístico
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Análisis estadístico y comportamiento de registros.
                        </p>
                    </div>


                    {/* Matriz de datos */}
                    <section className="bg-slate-50 mb-8">
                        <div className="rounded-3xl border border-gray-200 p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-800">
                                        Matriz de Comportamiento
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Monitoreo de registros durante los últimos 30 días
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 text-xs">

                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-[#611232]" />
                                        <span>Alto</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-orange-500" />
                                        <span>Medio</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-[#00AFAA]" />
                                        <span>Bajo</span>
                                    </div>
                                </div>

                                {(estadoFilter != null && estadoFilter !== 0) && (
                                    <button
                                        onClick={() => handleEstadoClick(0)}
                                        className="mb-4 rounded-lg bg-blue-500 px-4 py-2 cursor-pointer text-white"
                                    >
                                        <div className="flex items-center gap-2">
                                            <ArrowLeft /> <span className="text-sm font-semibold">Volver a vista nacional</span>
                                        </div>
                                    </button>
                                )}
                            </div>

                            {
                                loadingHeatmap ? (
                                    <LoaderStyled text="Cargando Matriz de datos" />
                                ) : (
                                    <AlertaMatriz
                                        rows={heatmapEstados}
                                        level={(estadoFilter != null && estadoFilter !== 0) ? "municipio" : "estado"}
                                        onRowClick={handleEstadoClick}
                                        onCellClick={handleCellClick}
                                    />
                                )
                            }


                        </div>
                    </section>

                    <section className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">

                        {
                            loadingCharts ? (
                                <ChartSkeleton />
                            ) : (
                                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <h2 className="mb-4 text-lg font-semibold text-gray-800">
                                        Distribución por Sexo
                                    </h2>

                                    <SexoChart sexo={dataChart?.sexo} />
                                </div>
                            )
                        }


                        {
                            loadingCharts ? (
                                <ChartSkeleton />
                            ) : (
                                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <h2 className="mb-4 text-lg font-semibold text-gray-800">
                                        Distribución por Edad
                                    </h2>

                                    <EdadChart grupoEtario={dataChart?.grupoEtario} />
                                </div>
                            )
                        }

                    </section>

                    <section className="mb-8">
                        {
                            loadingCharts ? (
                                <ChartSkeleton />
                            ) : (
                                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <div className="mb-5">
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            Enfoque Diferenciado
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            Distribución de registros por grupo de atención prioritaria.
                                        </p>
                                    </div>

                                    <EnfoqueChart
                                        enfoqueDiferenciado={dataChart?.enfoqueDiferenciado}
                                    />
                                </div>
                            )
                        }
                    </section>
                </div >
            </div >
        </>
    );
}
