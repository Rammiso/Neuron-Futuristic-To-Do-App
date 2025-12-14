import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import { motion } from "framer-motion";
import { AmbientParticles, CyberBackground } from "../components/AmbientEffects";

export const DashboardLayout = ({ children, showParticles = true }) => {
  return (
    <div className="flex h-screen overflow-hidden relative">
      <CyberBackground />
      
      <div className="relative z-10 flex w-full h-full">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Ambient particles for futuristic effect */}
          {showParticles && (
            <div className="absolute inset-0 pointer-events-none z-0">
              <AmbientParticles density={35} showConnections={true} />
            </div>
          )}

          <Topbar />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto scrollbar-hide relative z-10"
          >
            <div className="p-6 max-w-7xl mx-auto">{children}</div>
          </motion.main>
        </div>
      </div>
    </div>
  );
};
