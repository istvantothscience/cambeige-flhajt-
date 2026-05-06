import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Anchor, ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'motion/react';

export const LessonExperiment: React.FC = () => {
  const [boatSelected, setBoatSelected] = useState<'ball' | 'flat' | 'bowl' | null>(null);
  const [coins, setCoins] = useState(0);
  const [boatSunk, setBoatSunk] = useState(false);
  const [depth, setDepth] = useState(0); // 0 to 100

  // Constants for physical simulation
  const COIN_WEIGHT = 10; // "Weight units" per coin
  const BASE_WEIGHTS = {
      ball: 20,
      flat: 20,
      bowl: 20
  };
  const MAX_VOLUMES = {
      ball: 15,    // Cramped ball displaces very little water
      flat: 40,    // Flat displaces some water
      bowl: 120    // Bowl shape displaces a LOT of water
  };

  const currentWeight = boatSelected ? BASE_WEIGHTS[boatSelected] + (coins * COIN_WEIGHT) : 0;
  const currentMaxUpthrust = boatSelected ? MAX_VOLUMES[boatSelected] : 0;
  
  // Calculate depth based on weight vs upthrust
  useEffect(() => {
     if (!boatSelected) return;

     if (currentWeight > currentMaxUpthrust) {
         setBoatSunk(true);
         setDepth(98); // Sinks to bottom (98% to leave room for the object)
     } else {
         setBoatSunk(false);
         // Water surface is at ~37.5% (150px/400px).
         // It sinks slightly more as it gets heavier.
         const submergedRatio = currentWeight / currentMaxUpthrust;
         setDepth(37.5 + (submergedRatio * 12));
     }
  }, [coins, boatSelected, currentWeight, currentMaxUpthrust]);

  const handleAddCoin = () => {
    if (boatSunk || !boatSelected) return;
    setCoins(prev => prev + 1);
  };

  const selectBoat = (type: 'ball' | 'flat' | 'bowl') => {
    setBoatSelected(type);
    setBoatSunk(false);
    setCoins(0);
  };

  const handleResetBoat = () => {
    setBoatSunk(false);
    setCoins(0);
    setBoatSelected(null);
  };

  // Upthrust currently exactly matches weight UNLESS it sinks, then it maxes out
  const currentUpthrust = boatSunk ? currentMaxUpthrust : currentWeight;

  return (
    <div className="space-y-12 pb-20 w-full max-w-4xl mx-auto">
      
      {/* 4.4 Floating and Sinking */}
      <section className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-8 bg-blue-400 rounded-full"></div>
          <h2 className="text-3xl font-bold">Topic 4.4: Upthrust & Floating</h2>
        </div>
        
        <p className="text-blue-100 mb-6 text-lg xl:text-xl leading-relaxed">
          Some objects float and some sink. Water exerts an upwards pushing force called <strong>upthrust</strong>. 
          Objects float when their <em>weight is equal to or less than the maximum upthrust</em> they can generate!
          Upthrust depends on how much water the object's shape pushes away (displaces).
        </p>

        <div className="bg-blue-900/40 p-6 rounded-xl border border-blue-500/30">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-yellow-300">
            <Anchor /> Activity: The Great Boat Challenge
          </h3>
          <p className="mb-4 text-sm text-blue-200">
            Select a shape made from the exact same amount of clay (same starting weight). Add coins! How many can it hold before the <strong>Weight</strong> overcomes the <strong>Upthrust</strong>?
          </p>

          {!boatSelected ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
              <Button onClick={() => selectBoat('ball')} className="flex flex-col items-center gap-4 py-8 bg-slate-800 hover:bg-slate-700 hover:-translate-y-2 transition-transform shadow-lg border border-slate-600">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 shadow-inner"></div>
                <div className="text-center">
                   <h4 className="font-bold text-lg text-white">Crumpled Ball</h4>
                   <p className="text-xs text-slate-400 mt-1">Displaces tiny amount of water</p>
                </div>
              </Button>
              <Button onClick={() => selectBoat('flat')} className="flex flex-col items-center justify-between gap-4 py-8 bg-slate-800 hover:bg-slate-700 hover:-translate-y-2 transition-transform shadow-lg border border-slate-600">
                <div className="w-24 h-3 bg-gradient-to-br from-gray-300 to-gray-500 rounded-sm mt-12 shadow-inner"></div>
                <div className="text-center mt-auto">
                   <h4 className="font-bold text-lg text-white">Flat Sheet</h4>
                   <p className="text-xs text-slate-400 mt-1">Displaces some water</p>
                </div>
              </Button>
              <Button onClick={() => selectBoat('bowl')} className="flex flex-col items-center justify-between gap-4 py-8 bg-slate-800 hover:bg-slate-700 hover:-translate-y-2 transition-transform shadow-lg border border-slate-600">
                <div className="w-28 h-12 bg-gradient-to-b from-transparent to-gray-400 border-x-4 border-b-4 border-gray-400 rounded-b-2xl mt-4 shadow-inner"></div>
                <div className="text-center mt-auto">
                   <h4 className="font-bold text-lg text-white">Bowl Shape</h4>
                   <p className="text-xs text-slate-400 mt-1">Displaces lots of water!</p>
                </div>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center mt-8">
               
               {/* Force Meters */}
               <div className="flex flex-row justify-center gap-12 w-full mb-8 px-4">
                  <div className="flex flex-col items-center w-24">
                    <p className="text-red-300 font-bold mb-2 uppercase tracking-widest text-sm text-center line-clamp-1">Weight</p>
                    <div className="h-40 w-8 bg-black/40 rounded-full border border-red-900/50 relative overflow-hidden flex flex-col justify-end">
                       <motion.div 
                          className="w-full bg-red-500"
                          animate={{ height: `${Math.min(100, (currentWeight/150)*100)}%` }}
                          transition={{ type: 'spring', bounce: 0.4 }}
                       />
                    </div>
                    <p className="text-white font-mono mt-2">{currentWeight}N</p>
                  </div>
                  
                  <div className="flex flex-col items-center w-24">
                    <p className="text-cyan-300 font-bold mb-2 uppercase tracking-widest text-sm text-center">Upthrust</p>
                    <div className="h-40 w-8 bg-black/40 rounded-full border border-cyan-900/50 relative overflow-hidden flex flex-col justify-end">
                       {/* Max capacity indicator line */}
                       <div className="absolute w-full h-0.5 bg-yellow-400/50 z-10" style={{ bottom: `${(currentMaxUpthrust/150)*100}%` }} title="Maximum possible upthrust for this shape"></div>
                       <motion.div 
                          className="w-full bg-cyan-400"
                          animate={{ height: `${Math.min(100, (currentUpthrust/150)*100)}%` }}
                          transition={{ type: 'spring', bounce: 0.4 }}
                       />
                    </div>
                    <p className="text-white font-mono mt-2">{currentUpthrust}N</p>
                  </div>
               </div>

               {/* Water Tank */}
               <div className="relative w-full max-w-2xl h-[400px] bg-blue-900/20 rounded-2xl border-4 border-blue-800 overflow-hidden mb-8 shadow-2xl">
                  {/* Background grid */}
                  <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  
                  {/* Sky/Air */}
                  <div className="absolute top-0 w-full h-[150px] bg-gradient-to-b from-sky-400/20 to-transparent"></div>

                  {/* Water */}
                  <div className="absolute bottom-0 w-full h-[250px] bg-cyan-500/40 border-t-2 border-cyan-300/60 backdrop-blur-[2px]">
                     {/* Water waves effect via CSS */}
                     <div className="absolute -top-[2px] w-[200%] h-2 bg-cyan-200/40 rounded-full animate-[wave_4s_ease-in-out_infinite_alternate]" style={{ filter: 'blur(3px)' }}></div>
                  </div>
                  
                  {/* Object rendering */}
                  <motion.div 
                     key={boatSelected}
                     className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-end z-20 w-fit"
                     animate={{ top: `${depth}%` }}
                     initial={{ top: '10%' }}
                     transition={{ type: "spring", stiffness: 35, damping: 10, mass: 2 }}
                     style={{ y: '-100%' }} // Aligns the bottom of the boat to the calculated 'top' position
                  >
                     {/* Force Arrows Container - Follows the object */}
                     <div className="absolute inset-[-60px] pointer-events-none flex flex-col items-center justify-between">
                         {/* Upthrust Arrow (Cyan) */}
                         {!boatSunk && (
                            <motion.div 
                               initial={{ opacity: 0 }} 
                               animate={{ opacity: 1, scaleY: Math.max(0.5, currentUpthrust/20) }}
                               className="text-cyan-400 flex flex-col items-center origin-bottom absolute -top-16"
                            >
                               <ArrowUp size={32} strokeWidth={4} />
                            </motion.div>
                         )}
                         {/* Weight Arrow (Red) */}
                         <motion.div 
                             initial={{ opacity: 0 }} 
                             animate={{ opacity: 1, scaleY: Math.max(0.5, currentWeight/20) }}
                             className="text-red-500 flex flex-col items-center origin-top absolute -bottom-16"
                         >
                            <ArrowDown size={32} strokeWidth={4} />
                         </motion.div>
                     </div>

                     {/* The Shapes */}
                     {boatSelected === 'ball' && (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-600 shadow-lg border-2 border-slate-400 flex flex-col items-center justify-center p-2 relative z-10">
                            {coins > 0 && <span className="text-white font-bold text-xs">+{coins} 🪙</span>}
                        </div>
                     )}
                     
                     {boatSelected === 'flat' && (
                        <div className="w-32 h-4 bg-gradient-to-br from-gray-300 to-gray-600 shadow-lg border-2 border-slate-400 rounded-sm relative z-10 flex justify-center items-center gap-1">
                           {Array.from({ length: coins }).map((_, i) => (
                             <div key={i} className="w-4 h-4 rounded-full bg-yellow-400 border border-yellow-600 -top-4 absolute" style={{ left: `${10 + (i * 15)}%`, transform: 'translateX(-50%)' }}></div>
                           ))}
                        </div>
                     )}
                     
                     {boatSelected === 'bowl' && (
                        <div className="w-40 h-16 bg-gradient-to-b from-gray-600/50 to-gray-600 border-x-4 border-b-4 border-slate-400 rounded-b-3xl relative z-10 flex justify-center items-end pb-2 gap-1 flex-wrap px-4 overflow-hidden shadow-lg">
                          <div className="absolute inset-0 bg-black/20 rounded-b-2xl"></div>
                          {Array.from({ length: coins }).map((_, i) => (
                             <motion.div 
                               initial={{ y: -20, opacity: 0 }}
                               animate={{ y: 0, opacity: 1 }}
                               key={i} 
                               className="w-5 h-5 rounded-full bg-gradient-to-b from-yellow-300 to-yellow-600 border border-yellow-700 shadow-sm relative z-20"
                             ></motion.div>
                          ))}
                        </div>
                     )}
                  </motion.div>

                  {/* Bubbles if sunk */}
                  {boatSunk && (
                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-64 pointer-events-none">
                        {[1,2,3,4,5].map(i => (
                           <motion.div 
                              key={i}
                              className="w-4 h-4 rounded-full border border-white/50 bg-white/20 absolute"
                              initial={{ y: 200, x: Math.random() * 60 - 30, opacity: 0, scale: 0.5 }}
                              animate={{ y: -100, x: Math.random() * 100 - 50, opacity: [0, 1, 0], scale: 1.5 }}
                              transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                           />
                        ))}
                     </div>
                  )}
               </div>

               <div className="flex gap-4 items-center flex-wrap justify-center">
                 <Button onClick={handleAddCoin} disabled={boatSunk} className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold px-8 shadow-lg shadow-orange-500/30 text-lg">
                   Add Heavy Coin (+10N)
                 </Button>
                 <Button onClick={handleResetBoat} variant="danger" className="text-lg px-8">Try New Shape</Button>
               </div>
               
               <div className="mt-8 h-20 flex items-center justify-center w-full max-w-2xl">
                 {boatSunk ? (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-red-500/20 border border-red-500 text-red-200 px-6 py-3 rounded-xl font-bold text-lg text-center w-full">
                       💥 The weight ({currentWeight}N) became greater than the maximum upthrust ({currentMaxUpthrust}N).<br/>IT SANK!
                    </motion.div>
                 ) : (
                    <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 px-6 py-3 rounded-xl font-bold text-lg text-center flex items-center justify-center gap-3 w-full">
                       ✅ Floating perfectly! Upthrust ({currentUpthrust}N) balances the Weight ({currentWeight}N).
                    </div>
                 )}
               </div>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};
