import { useEffect, useState } from "react";

import { GetTableAutoridades, GetTableCumplimiento } from "../services/dashboard.service";
import CumplimientoTable from "../components/Dashboard/Tables/CumplimientoTable";
import LoaderStyled from "../components/Dashboard/Loader/Loader";
import AutoridadesTable from "../components/Dashboard/Tables/AutoridadesTable";

export default function EstadisticasDosPage() {

    const [loadingTableCumplimiento, setLoadingTableCumplimiento] = useState<boolean>(true);
    const [loadingTableAutoridades, setLoadingTableAutoridades] = useState<boolean>(true);

    const [dataCumplimiento, setDataCumplimiento] = useState<any>(null);

    const [dataAutoridades, setDataAutoridades] = useState<any>(null);

    useEffect(() => {
        loadTableCumplimiento();
        loadTableAutoridades();
    }, []);

    const loadTableCumplimiento = async (estado?: string) => {
        try {

            setLoadingTableCumplimiento(true);
            const response = await GetTableCumplimiento(estado);
            setDataCumplimiento(response);
            setLoadingTableCumplimiento(false);

        } catch (error) {
            console.log("No se pudo obtener la información de tabla de cumplimiento");
        }
    }

    const loadTableAutoridades = async (estado?: string) => {
        try {

            setLoadingTableAutoridades(true);

            const response = await GetTableAutoridades(estado);

            setDataAutoridades(response);

        } catch (error) {
            console.log("No se pudo obtener la información de tabla de autoridades");
        } finally {
            setLoadingTableAutoridades(false);
        }
    }

    /* const handleEstadoClick = (estado: string) => {

        console.log(
            "Estado seleccionado:",
            estado
        );
        setDataCumplimiento(estado);
        loadTableCumplimiento(estado);
    }; */

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

                    <h1 className="text-2xl font-bold tracking-tight text-[#611232] mb-6">
                        Cumplimiento de Alertas por Autoridad
                    </h1>

                    {
                        loadingTableAutoridades ? (
                            <LoaderStyled text="Cargando Tabla de Autoridades" />
                        ) : (
                            <>
                                <AutoridadesTable rows={dataAutoridades} /* onEstadoClick={handleEstadoClick} */ />
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
                                    <CumplimientoTable rows={dataCumplimiento} /* onEstadoClick={handleEstadoClick} */ />
                                </>

                            )
                        }

                    </div>
                </div>

            </div>
        </>
    );
}