import { NavLink } from "react-router-dom";

import { BarChart3, Grid3X3 } from "lucide-react";
import logoSystem from "../../../assets/CNB.png";

export default function Header() {

    const menu = [
        {
            label: "Estadísticas",
            icon: BarChart3,
            path: "/estadisticas",
        },
        //{
        //label: "Estadísticas 2",
        //icon: Map,
        //path: "/estadisticas-2",
        //},
        {
            label: "Estadísticas 3",
            icon: Grid3X3,
            path: "/estadisticas-3",
        },
    ];

    return (

        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">

            <div className="h-20 px-6 flex items-center justify-between max-w-[1800px] mx-auto">

                {/* Logo */}
                <div className="flex items-center gap-4">

                    <img src={logoSystem} alt="Logo" className="h-12 w-auto object-contain" />

                    <div>

                        <h1 className="text-xl font-bold text-[#611232]">
                            Dashboard
                        </h1>

                        <p className="text-xs text-gray-500">
                            Sistema de Estadísticas
                        </p>

                    </div>

                </div>

                {/* Menú */}
                <nav className="flex items-center gap-3">

                    {menu.map((item) => {

                        const Icon = item.icon;

                        return (

                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({
                                    isActive,
                                }) =>
                                    `
                                    flex
                                    items-center
                                    gap-2
                                    px-5
                                    py-3
                                    rounded-xl
                                    font-medium
                                    transition-all

                                    ${isActive
                                        ? "bg-[#611232] text-white shadow-md"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }
                                `
                                }
                            >

                                <Icon
                                    size={18}
                                />

                                {item.label}

                            </NavLink>
                        );
                    })}

                </nav>

            </div>

        </header>
    );
}