import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import { motion } from "framer-motion";
import { ParticleBackground } from "../components/ParticleBackground";

export const DashboardLayout = ({ children, showParticles = true }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-900">
      {/* Cyberpunk Background */}
      {showParticles && <ParticleBackground />}
      
      <div className="relative z-10 flex w-full h-full">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <Topbar />
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 overflow-y-auto scrollbar-hide relative z-10"
          >
            <div className="p-6 max-w-7xl mx-auto">{children}</div>
          </motion.main>
        </div>
      </div>
    </div>
  );
};
