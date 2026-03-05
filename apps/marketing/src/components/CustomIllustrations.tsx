import { motion } from "motion/react";

/* Network Intelligence Illustration */
export function NetworkIllustration() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      {/* Background grid */}
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e5e5" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="400" height="300" fill="url(#grid)" />

      {/* Central Hub */}
      <motion.circle
        cx="200"
        cy="150"
        r="30"
        fill="#064e3b"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      />
      <motion.circle
        cx="200"
        cy="150"
        r="40"
        fill="none"
        stroke="#064e3b"
        strokeWidth="1"
        strokeDasharray="4 4"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Node positions */}
      {[
        { x: 80, y: 80, delay: 0.3 },
        { x: 320, y: 80, delay: 0.4 },
        { x: 80, y: 220, delay: 0.5 },
        { x: 320, y: 220, delay: 0.6 },
        { x: 200, y: 50, delay: 0.7 },
        { x: 200, y: 250, delay: 0.8 },
      ].map((node, i) => (
        <g key={i}>
          {/* Connection lines */}
          <motion.line
            x1={node.x}
            y1={node.y}
            x2="200"
            y2="150"
            stroke="#d4d4d8"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ delay: node.delay, duration: 0.8 }}
          />
          {/* Node circles */}
          <motion.circle
            cx={node.x}
            cy={node.y}
            r="12"
            fill="white"
            stroke="#064e3b"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: node.delay + 0.3, type: "spring" }}
          />
          {/* Data flow particles */}
          <motion.circle
            cx={node.x}
            cy={node.y}
            r="3"
            fill="#064e3b"
            animate={{
              cx: [node.x, 200],
              cy: [node.y, 150],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: node.delay + 1 + i * 0.3,
              repeatDelay: 1,
            }}
          />
        </g>
      ))}

      {/* Central icon */}
      <motion.text
        x="200"
        y="158"
        textAnchor="middle"
        fill="white"
        fontSize="24"
        fontWeight="bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        ⚡
      </motion.text>
    </svg>
  );
}

/* Security & Lock Illustration */
export function SecurityIllustration() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      {/* Background */}
      <rect width="400" height="300" fill="#fafafa" />
      
      {/* Shield outline */}
      <motion.path
        d="M 200 50 L 280 80 L 280 150 Q 280 220 200 250 Q 120 220 120 150 L 120 80 Z"
        fill="white"
        stroke="#064e3b"
        strokeWidth="3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Lock icon inside shield */}
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
      >
        {/* Lock body */}
        <rect x="180" y="150" width="40" height="50" rx="4" fill="#064e3b" />
        {/* Lock shackle */}
        <path
          d="M 185 150 L 185 135 Q 185 120 200 120 Q 215 120 215 135 L 215 150"
          fill="none"
          stroke="#064e3b"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Keyhole */}
        <circle cx="200" cy="170" r="4" fill="white" />
        <rect x="198" y="172" width="4" height="12" rx="2" fill="white" />
      </motion.g>

      {/* Animated shield waves */}
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d="M 200 50 L 280 80 L 280 150 Q 280 220 200 250 Q 120 220 120 150 L 120 80 Z"
          fill="none"
          stroke="#064e3b"
          strokeWidth="2"
          strokeOpacity="0.2"
          initial={{ scale: 1, opacity: 0 }}
          animate={{
            scale: [1, 1.1, 1.2],
            opacity: [0.3, 0.15, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1,
            ease: "easeOut",
          }}
          style={{ transformOrigin: "200px 150px" }}
        />
      ))}

      {/* Check marks around shield */}
      {[
        { x: 140, y: 100, delay: 1.2 },
        { x: 260, y: 100, delay: 1.4 },
        { x: 140, y: 200, delay: 1.6 },
        { x: 260, y: 200, delay: 1.8 },
      ].map((check, i) => (
        <motion.g
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: check.delay, type: "spring" }}
        >
          <circle cx={check.x} cy={check.y} r="12" fill="#10b981" />
          <path
            d={`M ${check.x - 4} ${check.y} L ${check.x - 1} ${check.y + 3} L ${check.x + 4} ${check.y - 4}`}
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </motion.g>
      ))}
    </svg>
  );
}

/* AI Learning Illustration */
export function AILearningIllustration() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      {/* Background */}
      <rect width="400" height="300" fill="#fafafa" />

      {/* Neural network nodes */}
      <g>
        {/* Input layer */}
        {[60, 100, 140, 180, 220].map((y, i) => (
          <motion.circle
            key={`input-${i}`}
            cx="80"
            cy={y}
            r="8"
            fill="white"
            stroke="#064e3b"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 * i, type: "spring" }}
          />
        ))}

        {/* Hidden layer 1 */}
        {[80, 120, 160, 200].map((y, i) => (
          <motion.circle
            key={`hidden1-${i}`}
            cx="180"
            cy={y}
            r="10"
            fill="white"
            stroke="#064e3b"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + 0.1 * i, type: "spring" }}
          />
        ))}

        {/* Hidden layer 2 */}
        {[100, 140, 180].map((y, i) => (
          <motion.circle
            key={`hidden2-${i}`}
            cx="280"
            cy={y}
            r="10"
            fill="white"
            stroke="#064e3b"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 + 0.1 * i, type: "spring" }}
          />
        ))}

        {/* Output layer */}
        {[120, 160].map((y, i) => (
          <motion.circle
            key={`output-${i}`}
            cx="340"
            cy={y}
            r="12"
            fill="#064e3b"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.9 + 0.1 * i, type: "spring" }}
          />
        ))}
      </g>

      {/* Connection lines with animated data flow */}
      <g>
        {/* Input to Hidden1 connections */}
        {[60, 100, 140, 180, 220].map((y1, i) =>
          [80, 120, 160, 200].map((y2, j) => (
            <motion.line
              key={`ih1-${i}-${j}`}
              x1="80"
              y1={y1}
              x2="180"
              y2={y2}
              stroke="#d4d4d8"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ delay: 0.2 + (i + j) * 0.02, duration: 0.5 }}
            />
          ))
        )}

        {/* Hidden1 to Hidden2 connections */}
        {[80, 120, 160, 200].map((y1, i) =>
          [100, 140, 180].map((y2, j) => (
            <motion.line
              key={`h1h2-${i}-${j}`}
              x1="180"
              y1={y1}
              x2="280"
              y2={y2}
              stroke="#d4d4d8"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ delay: 0.5 + (i + j) * 0.02, duration: 0.5 }}
            />
          ))
        )}

        {/* Hidden2 to Output connections */}
        {[100, 140, 180].map((y1, i) =>
          [120, 160].map((y2, j) => (
            <motion.line
              key={`h2o-${i}-${j}`}
              x1="280"
              y1={y1}
              x2="340"
              y2={y2}
              stroke="#d4d4d8"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ delay: 0.8 + (i + j) * 0.02, duration: 0.5 }}
            />
          ))
        )}
      </g>

      {/* Animated signal pulses */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={`pulse-${i}`}
          r="3"
          fill="#064e3b"
          animate={{
            cx: [80, 180, 280, 340],
            cy: [140, 140, 140, 140],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.7,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Label text */}
      <motion.text
        x="200"
        y="270"
        textAnchor="middle"
        fontSize="12"
        fill="#71717a"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        Adaptive Learning Pipeline
      </motion.text>
    </svg>
  );
}

/* Dashboard Analytics Illustration */
export function DashboardIllustration() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      <rect width="400" height="300" fill="#064e3b" />
      
      {/* Window chrome */}
      <rect x="20" y="20" width="360" height="260" rx="8" fill="#18181b" />
      <rect x="20" y="20" width="360" height="30" rx="8" fill="#27272a" />
      <circle cx="35" cy="35" r="4" fill="#ef4444" />
      <circle cx="48" cy="35" r="4" fill="#eab308" />
      <circle cx="61" cy="35" r="4" fill="#22c55e" />

      {/* Dashboard content */}
      <g>
        {/* Chart bars with animation */}
        {[
          { x: 60, h: 80, delay: 0.2 },
          { x: 100, h: 120, delay: 0.3 },
          { x: 140, h: 90, delay: 0.4 },
          { x: 180, h: 140, delay: 0.5 },
          { x: 220, h: 100, delay: 0.6 },
          { x: 260, h: 130, delay: 0.7 },
          { x: 300, h: 110, delay: 0.8 },
        ].map((bar, i) => (
          <motion.rect
            key={i}
            x={bar.x}
            y={250 - bar.h}
            width="25"
            height={bar.h}
            fill="#fafafa"
            initial={{ height: 0, y: 250 }}
            animate={{ height: bar.h, y: 250 - bar.h }}
            transition={{ delay: bar.delay, duration: 0.8, ease: "easeOut" }}
          />
        ))}

        {/* Trend line */}
        <motion.path
          d="M 60 200 L 100 160 L 140 180 L 180 130 L 220 150 L 260 120 L 300 140"
          stroke="#22c55e"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1, duration: 1.2, ease: "easeInOut" }}
        />

        {/* Data points */}
        {[
          { x: 60, y: 200 },
          { x: 100, y: 160 },
          { x: 140, y: 180 },
          { x: 180, y: 130 },
          { x: 220, y: 150 },
          { x: 260, y: 120 },
          { x: 300, y: 140 },
        ].map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#22c55e"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2 + i * 0.1, type: "spring" }}
          />
        ))}

        {/* Metric cards */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <rect x="340" y="70" width="30" height="30" rx="4" fill="#22c55e" opacity="0.2" />
          <text x="355" y="90" textAnchor="middle" fontSize="16" fill="#22c55e">↑</text>
        </motion.g>
      </g>
    </svg>
  );
}
