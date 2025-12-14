import { memo, useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskCard } from './TaskCard';
import { calculateVisibleItems } from '../utils/performance';

// Virtualized task list for performance with large datasets
export const VirtualizedTaskList = memo(({ 
  tasks = [], 
  onEditTask,
  itemHeight = 120,
  containerHeight = 600,
  overscan = 3,
  viewMode = "default",
  className = ""
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // Calculate visible items based on scroll position
  const { startIndex, endIndex, visibleItems } = useMemo(() => {
    const { startIndex, endIndex } = calculateVisibleItems(
      scrollTop, 
      itemHeight, 
      containerHeight, 
      tasks.length
    );
    
    // Add overscan items for smooth scrolling
    const overscanStart = Math.max(0, startIndex - overscan);
    const overscanEnd = Math.min(tasks.length - 1, endIndex + overscan);
    
    const visibleItems = tasks.slice(overscanStart, overscanEnd + 1).map((task, index) => ({
      ...task,
      virtualIndex: overscanStart + index,
      style: {
        position: 'absolute',
        top: (overscanStart + index) * itemHeight,
        left: 0,
        right: 0,
        height: itemHeight - 8, // Account for margin
      }
    }));

    return { 
      startIndex: overscanStart, 
      endIndex: overscanEnd, 
      visibleItems 
    };
  }, [scrollTop, itemHeight, containerHeight, tasks, overscan]);

  // Throttled scroll handler for performance
  const handleScroll = useCallback((e) => {
    const newScrollTop = e.target.scrollTop;
    setScrollTop(newScrollTop);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set new timeout for scroll end detection
    scrollTimeoutRef.current = setTimeout(() => {
      // Scroll ended - could trigger additional optimizations here
    }, 150);
  }, []);

  // Memoized total height
  const totalHeight = useMemo(() => tasks.length * itemHeight, [tasks.length, itemHeight]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Memoized container style
  const containerStyle = useMemo(() => ({
    height: containerHeight,
    overflow: 'auto',
    position: 'relative',
  }), [containerHeight]);

  // Memoized spacer style
  const spacerStyle = useMemo(() => ({
    height: totalHeight,
    position: 'relative',
  }), [totalHeight]);

  // Handle task edit with proper callback
  const handleEditTask = useCallback((task) => {
    onEditTask?.(task);
  }, [onEditTask]);

  // Empty state
  if (tasks.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={containerStyle}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
            <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2 font-mono">No Tasks Found</h3>
          <p className="text-gray-400 font-mono text-sm">
            {viewMode === "calendar" ? "No tasks for this date" : "Create your first task to get started"}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`${className}`}
      style={containerStyle}
      onScroll={handleScroll}
    >
      <div style={spacerStyle}>
        <AnimatePresence mode="popLayout">
          {visibleItems.map((task) => (
            <motion.div
              key={task.id}
              style={task.style}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.2,
                ease: "easeOut"
              }}
              className="px-2 py-1"
            >
              <TaskCard 
                task={task} 
                onEdit={handleEditTask}
                viewMode={viewMode}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Scroll indicators */}
      {tasks.length > 10 && (
        <>
          {/* Top fade */}
          <div 
            className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-gray-900 to-transparent pointer-events-none z-10"
            style={{ 
              opacity: scrollTop > 0 ? 1 : 0,
              transition: 'opacity 0.2s ease'
            }}
          />
          
          {/* Bottom fade */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none z-10"
            style={{ 
              opacity: scrollTop < totalHeight - containerHeight ? 1 : 0,
              transition: 'opacity 0.2s ease'
            }}
          />
        </>
      )}
    </div>
  );
});

// Performance-optimized task grid for calendar view
export const VirtualizedTaskGrid = memo(({ 
  tasksByDate = {},
  selectedDate,
  onEditTask,
  className = ""
}) => {
  const tasksForDate = useMemo(() => 
    tasksByDate[selectedDate?.toDateString()] || [],
    [tasksByDate, selectedDate]
  );

  // Group tasks by time for better organization
  const groupedTasks = useMemo(() => {
    const groups = {
      morning: [],
      afternoon: [],
      evening: [],
      noTime: []
    };

    tasksForDate.forEach(task => {
      const hour = new Date(task.dueDate).getHours();
      if (hour < 12) {
        groups.morning.push(task);
      } else if (hour < 17) {
        groups.afternoon.push(task);
      } else if (hour < 22) {
        groups.evening.push(task);
      } else {
        groups.noTime.push(task);
      }
    });

    return groups;
  }, [tasksForDate]);

  const timeGroups = [
    { key: 'morning', label: 'Morning', icon: '🌅', tasks: groupedTasks.morning },
    { key: 'afternoon', label: 'Afternoon', icon: '☀️', tasks: groupedTasks.afternoon },
    { key: 'evening', label: 'Evening', icon: '🌙', tasks: groupedTasks.evening },
    { key: 'noTime', label: 'All Day', icon: '📅', tasks: groupedTasks.noTime },
  ].filter(group => group.tasks.length > 0);

  if (timeGroups.length === 0) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
            <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2 font-mono">No Tasks Today</h3>
          <p className="text-gray-400 font-mono text-sm">
            {selectedDate?.toDateString() === new Date().toDateString() 
              ? "Enjoy your free time!" 
              : "No tasks scheduled for this date"
            }
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <AnimatePresence>
        {timeGroups.map((group, groupIndex) => (
          <motion.div
            key={group.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: groupIndex * 0.1 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{group.icon}</span>
              <h3 className="text-lg font-bold text-white font-mono">
                {group.label}
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-emerald-400/50 to-transparent" />
              <span className="text-sm text-gray-400 font-mono">
                {group.tasks.length} task{group.tasks.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="grid gap-3">
              {group.tasks.map((task, taskIndex) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (groupIndex * 0.1) + (taskIndex * 0.05) }}
                >
                  <TaskCard 
                    task={task} 
                    onEdit={onEditTask}
                    viewMode="calendar"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});