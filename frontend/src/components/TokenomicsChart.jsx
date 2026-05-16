import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatEther } from 'ethers';

const TokenomicsChart = ({ contract, account, isRenounced }) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userPercentage, setUserPercentage] = useState(0);

    const COLORS = ['#3b82f6', '#10b981']; // Blue for Public, Green for User/Whale

    useEffect(() => {
        const fetchTokenData = async () => {
            if (!contract || !account) return;
            
            try {
                setIsLoading(true);
                const totalSupplyRaw = await contract.totalSupply();
                const userBalanceRaw = await contract.balanceOf(account);
                
                const totalSupply = parseFloat(formatEther(totalSupplyRaw));
                const userBalance = parseFloat(formatEther(userBalanceRaw));
                const publicBalance = totalSupply - userBalance;
                
                const percentage = (userBalance / totalSupply) * 100;
                setUserPercentage(percentage);

                setData([
                    { name: 'Sisa Pasokan (Publik)', value: publicBalance },
                    { name: 'Saldo Anda', value: userBalance },
                ]);
            } catch (error) {
                console.error("Error fetching tokenomics data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTokenData();
        
        // Listen to transfer events to update chart dynamically if possible
        if (contract) {
            const filterTo = contract.filters.Transfer(null, account);
            const filterFrom = contract.filters.Transfer(account, null);
            
            contract.on(filterTo, fetchTokenData);
            contract.on(filterFrom, fetchTokenData);
            
            return () => {
                contract.off(filterTo, fetchTokenData);
                contract.off(filterFrom, fetchTokenData);
            };
        }
    }, [contract, account]);

    if (!contract || !account) return null;

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl">
                    <p className="text-white font-medium">{payload[0].name}</p>
                    <p className="text-primary-400">{payload[0].value.toLocaleString()} KYT</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="card mt-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                Tokenomics & Distribusi
            </h2>
            <p className="text-sm text-slate-400 mb-6">
                Menganalisis tingkat sentralisasi berdasarkan distribusi pasokan token saat ini.
            </p>

            {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Chart Container */}
                    <div className="w-full md:w-1/2 h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                            <span className="text-2xl font-bold text-white">{userPercentage.toFixed(1)}%</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Milik Anda</span>
                        </div>
                    </div>

                    {/* Analysis Info */}
                    <div className="w-full md:w-1/2 space-y-4">
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Analisis Konsentrasi
                            </h3>
                            <p className="text-sm text-slate-300">
                                Total Pasokan: <strong className="text-white">{(data[0]?.value + data[1]?.value)?.toLocaleString()} KYT</strong>
                            </p>
                            
                            {userPercentage > 50 ? (
                                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <p className="text-xs text-red-400 font-medium">
                                        ⚠️ PERINGATAN: Risiko Manipulasi Tinggi!
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                        Anda memegang <strong>{userPercentage.toFixed(1)}%</strong> dari total pasokan. 
                                        Bahkan jika Anda sudah menekan <span className="text-white font-semibold">Renounce Ownership</span>, 
                                        Anda masih bisa melakukan <em>dumping</em> (menjual besar-besaran) dan menghancurkan harga token. 
                                        Ini membuktikan bahwa desentralisasi sejati membutuhkan distribusi token yang adil, bukan hanya melepas hak akses <em>Smart Contract</em>.
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                    <p className="text-xs text-green-400 font-medium">
                                        ✅ Distribusi Cukup Aman
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                        Kepemilikan Anda berada di bawah batas mayoritas. Distribusi token yang menyebar luas meminimalisir risiko manipulasi pasar oleh satu entitas (Whale).
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TokenomicsChart;
