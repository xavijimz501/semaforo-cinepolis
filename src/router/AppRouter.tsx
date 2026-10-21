import { BrowserRouter, Routes, Route, Navigate, } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import EstadisticasPage from "../pages/EstadisticaPage";
import EstadisticasDosPage from "../pages/EstadisticasDosPage";



export default function AppRouter() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="/estadisticas" />} />
                    <Route path="estadisticas" element={<EstadisticasPage />} />
                    <Route path="estadisticas-2" element={<EstadisticasDosPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}