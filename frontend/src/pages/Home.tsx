export default function HomePage() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Hero Section */}
            <section className="bg-white py-20 px-6 text-center border-b border-gray-200">
                <h1 className="text-5xl font-bold text-indigo-900 mb-6">
                    Interactive Localization Board Game
                </h1>
                <p className="max-w-3xl mx-auto text-xl text-gray-600">
                    Bridging the Weser and the Chao Phraya through sound and cultural
                    landmarks.
                </p>
            </section>

            <main className="max-w-5xl mx-auto py-12 px-6 space-y-12">
                {/* Project Rationale */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-indigo-800 border-l-4 border-indigo-600 pl-4">
                        Project Rationale
                    </h2>
                    <p className="text-gray-700 leading-relaxed bg-white p-6 rounded-lg shadow-sm">
                        This project aims to explore the conceptual integration between
                        Bremen and Bangkok. By identifying shared cultural values and
                        representing them through interactive audio installations, we create
                        an immersive experience. Inspired by museum-style exhibits, the
                        system triggers location-based stories and effects when players
                        engage with specific landmarks.
                    </p>
                </section>

                {/* Project Breakdown (3 Main Parts) */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-indigo-800 border-l-4 border-indigo-600 pl-4">
                        Project Architecture
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-bold text-indigo-600 mb-2">
                                1. Hardware & Physical
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Design and 3D printing of game pieces, custom interactive map
                                board, and sensor integration for localization.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-bold text-indigo-600 mb-2">
                                2. Localization System
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Implementation of RSSI-based radio communication using Calliope
                                Mini to track player positioning on the board.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-bold text-indigo-600 mb-2">
                                3. Software & Audio
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Core game mechanics logic and interactive sound integration
                                triggered by the localization system.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Equipment Used */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-indigo-800 border-l-4 border-indigo-600 pl-4">
                        Equipment & Technology
                    </h2>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
                            <li className="flex items-center gap-2">
                                <span>•</span> Calliope Mini (Radio/Localization)
                            </li>
                            <li className="flex items-center gap-2">
                                <span>•</span> 3D Printing Technology
                            </li>
                            <li className="flex items-center gap-2">
                                <span>•</span> Interactive Sound Systems
                            </li>
                            <li className="flex items-center gap-2">
                                <span>•</span> Vector Map Design Software
                            </li>
                            <li className="flex items-center gap-2">
                                <span>•</span> Web Application Support
                            </li>
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
}
