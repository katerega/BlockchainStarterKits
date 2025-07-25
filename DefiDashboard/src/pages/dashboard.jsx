import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { fetchDaoData, fetchTokens, fetchNfts } from "../services/defi.service";

const Dashboard = () => {
    const [daoData, setDaoData] = useState([]);
    const [nftData, setNftData] = useState([]);
    const [stablecoinData, setStablecoinData] = useState([]);
    const [loading, setLoading] = useState({
        daos: true,
        nfts: true,
        stablecoins: true
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading({
                    daos: true,
                    nfts: true,
                    stablecoins: true
                });

                const [daos, stableCoins, nfts] = await Promise.all([
                    fetchDaoData(),
                    fetchTokens(),
                    fetchNfts()
                ]);

                setDaoData(daos);
                setNftData(nfts);
                setStablecoinData(stableCoins);

                setLoading({
                    daos: false,
                    nfts: false,
                    stablecoins: false
                });
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading({
                    daos: false,
                    nfts: false,
                    stablecoins: false
                });
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000); // refresh every minute
        return () => clearInterval(interval);
    }, []);

    // Skeleton Loader Components
    const TableSkeleton = ({ rows = 5, columns = 3 }) => (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex space-x-4">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <div
                            key={colIndex}
                            className="h-4 bg-gray-200 rounded animate-pulse"
                            style={{ width: colIndex === 0 ? '40%' : '20%' }}
                        ></div>
                    ))}
                </div>
            ))}
        </div>
    );

    const ChartSkeleton = () => (
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
    );

    return (
        <div className="p-4 md:p-8 space-y-6 bg-gray-50 min-h-screen">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                    <span className="mr-2">🇺🇬</span> Uganda Blockchain Dashboard
                </h1>
                <div className="flex space-x-4">
                    <Link
                        to="/payments"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Make Payment
                    </Link>
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        Updated: {new Date().toLocaleTimeString()}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top DAOs */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Top DAOs{!loading.daos && `(${daoData.length})`}
                            </h2>
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                                Live Data
                            </span>
                        </div>
                        {loading.daos ? (
                            <TableSkeleton rows={5} columns={3} />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left border-b border-gray-200 text-gray-500">
                                            <th className="pb-2 font-medium">Name</th>
                                            <th className="pb-2 font-medium">Txs</th>
                                            <th className="pb-2 font-medium">Proposals</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {daoData.map((dao, index) => (
                                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="py-3 font-medium">{dao.name}</td>
                                                <td className="py-3 text-gray-600">{dao.txs}</td>
                                                <td className="py-3">
                                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                                                        {dao.proposalsLen}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* NFT Volume */}
                <Card>
                    <CardContent className="p-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Local NFT Volume</h2>
                        {loading.nfts ? (
                            <ChartSkeleton />
                        ) : (
                            <>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={nftData}>
                                            <XAxis
                                                dataKey="month"
                                                tick={{ fill: '#6b7280' }}
                                                axisLine={{ stroke: '#e5e7eb' }}
                                            />
                                            <YAxis
                                                tick={{ fill: '#6b7280' }}
                                                axisLine={{ stroke: '#e5e7eb' }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#ffffff',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '0.5rem',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                }}
                                            />
                                            <Bar
                                                dataKey="volume"
                                                fill="#4f46e5"
                                                radius={[4, 4, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-2 text-xs text-gray-500 text-center">
                                    Monthly volume in thousands (UGX)
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* UGX Stablecoin Transfers */}
                <Card className="md:col-span-2">
                    <CardContent className="p-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">UGX-Pegged Stablecoin Transfers</h2>
                        {loading.stablecoins ? (
                            <TableSkeleton rows={3} columns={3} />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left border-b border-gray-200 text-gray-500">
                                            <th className="pb-2 font-medium">Token</th>
                                            <th className="pb-2 font-medium">Transfers (UGX)</th>
                                            <th className="pb-2 font-medium">Usage of Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stablecoinData.map((token, index) => {
                                            const maxTransfers = Math.max(...stablecoinData.map(t => t.transfers));
                                            const relativeWidth = ((token.transfers / maxTransfers) * 100).toFixed(1); // scale to max

                                            return (
                                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                    <td className="py-3 font-medium">{token.token}</td>
                                                    <td className="py-3 text-gray-600">{token.transfers.toLocaleString()}</td>
                                                    <td className="py-3">
                                                        <div className="flex items-center">
                                                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                                                <div
                                                                    className="bg-green-500 h-2 rounded-full"
                                                                    style={{ width: `${relativeWidth}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-xs text-gray-500">
                                                                {token.transfers.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;