import { BrowserRouter, Routes, Route, Navigate, } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import EstadisticasPage from "../pages/EstadisticaPage";
import EstadisticasDosPage from "../pages/EstadisticasDosPage";
import EstadisticasTresPage from "../pages/EstadisticasTresPage";



export default function AppRouter() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="/estadisticas" />} />
                    <Route path="estadisticas" element={<EstadisticasPage />} />
                    <Route path="estadisticas-2" element={<EstadisticasDosPage />} />
                    <Route path="estadisticas-3" element={<EstadisticasTresPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}