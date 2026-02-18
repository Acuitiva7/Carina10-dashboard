# CARINA-10 Dashboard
### Cognitive Architecture for Reasoning with Intelligent Networked Agents

![CARINA](https://img.shields.io/badge/CARINA-10-2980B9?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite)
![Recharts](https://img.shields.io/badge/Recharts-2.10-22C55E?style=for-the-badge)

---

## Overview

CARINA-10 is an interactive dashboard that simulates a **two-level cognitive architecture** for an Intelligent Tutoring System (ITS). It demonstrates how an Anytime Algorithm at the **Object Level** generates and refines personalized study plans for students, while a **Meta Level** monitors and controls the reasoning process in real time.

The system is aligned with the **Colombian T&I (Technology & Informatics) curricular guidelines** and processes up to three student profiles simultaneously.

---

## Architecture

```
META LEVEL (Metacognitive)
│
│   PerformancePredictionFunction  →  Predicts Q(t+1)
│   TerminationDecisionFunction    →  Decides STOP / CONTINUE
│   ResourceAllocationFunction     →  Allocates compute budget
│   SelfMonitoringFunction         →  Updates Model of the Self
│   StrategySelectionFunction      →  Selects reasoning strategy
│
└── controls ↓

OBJECT LEVEL (Cognitive)
│
│   PlanningFunction    →  Generates / refines learning plans
│   EvaluationFunction  →  Scores plan quality Q(t)
│   CognitiveLoop       →  Plan → Evaluate → repeat
│
└── reads from ↓

MODEL OF THE WORLD          MODEL OF THE SELF
StudentProfile              CognitiveProfiles
LearningCatalog             MetacognitiveDecisions
CurricularObjectives        PerformanceHistory
```

---

## Features

- **Real-time Anytime Algorithm visualization** — watch quality Q(t) converge iteration by iteration
- **3 pre-built student profiles** with different learning styles, socioeconomic levels, and devices
- **Simultaneous processing** — run 1, 2, or all 3 students at the same time
- **Convergence comparison chart** — overlays all profiles on a single Quality vs. Time graph
- **Personalized study plan output** — each plan adapts resources to the student's learning style
- **Colombian T&I curriculum alignment** — covers Computational Thinking, Networks, Hardware, Software, Digital Design, and Digital Citizenship
- **Configurable parameters** — max iterations, processing time, and prediction model

---

## Student Profiles

| ID | Name | Grade | Learning Style | NSE | Devices |
|---|---|---|---|---|---|
| STU-001 | Valentina Ríos | 9° | Visual | Medium | Tablet, Smartphone |
| STU-002 | Mateo Guerrero | 10° | Kinesthetic | Low | Smartphone only |
| STU-003 | Isabella Moreno | 11° | Reading/Writing | High | Laptop, Tablet, Smartphone |

---

## Quality Function

The plan quality score is computed as:

```
Q(t) = Σ wᵢ · Cᵢ  −  TemporalCost(t)
```

| Component | Weight | Description |
|---|---|---|
| Personalization | 30% | Alignment between student level and unit difficulty |
| Sequencing | 25% | Prerequisites met in correct order |
| Coverage | 25% | Percentage of learning objectives covered |
| Feasibility | 20% | Plan fits within available weekly hours |
| Temporal Cost | − | Penalty applied for excessive processing time |

---

## Termination Criteria (Decision Committee)

The Anytime Algorithm stops when **any** of these conditions is met:

1. **Convergence** — Predicted Q(t+1) ≤ Current Q(t)
2. **Adaptive Timeout** — Elapsed time exceeds the dynamic limit
3. **Marginal Improvement** — ΔQ falls below the 0.001 threshold
4. **Max Iterations** — Hard iteration limit is reached
5. **Cost > Benefit** — Iteration cost exceeds the expected quality gain

---

## Project Structure

```
carina10-dashboard/
├── index.html          # Entry point (root level required by Vite)
├── package.json        # Dependencies and npm scripts
├── vite.config.js      # Vite + React plugin configuration
├── public/             # Static assets
└── src/
    ├── index.jsx       # React DOM root
    └── App.jsx         # Full CARINA-10 dashboard component
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Navigate to the project folder
cd carina10-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Usage

1. **Configure** — Set max iterations (5–50), processing time in seconds, number of students to process, and prediction model
2. **Run** — Click **▶ RUN CARINA** to start the Anytime Algorithm
3. **Watch** — Observe each student's quality curve converging in real time
4. **Compare** — The combined chart overlays all profiles' convergence on one graph
5. **Explore** — Click on any student card to view their full personalized study plan

---

## Prediction Models

| Model | Description |
|---|---|
| **Hybrid** *(recommended)* | Combines empirical trends with an analytical decay model |
| Empirical | Weighted moving average of recent quality improvements |
| Analytical | Exponential decay: k · e^(−λt) |

---

## Curricular Areas — T&I Colombia

| Area | Est. Hours | Level |
|---|---|---|
| Computational Thinking | 20h | Core |
| Software & Operating Systems | 18h | Core |
| Networks & Communications | 16h | Core |
| Digital Design & Multimedia | 16h | Core |
| Hardware & Maintenance | 14h | Core |
| Digital Citizenship | 10h | Core |

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18.2 | UI framework |
| Vite | 5.0 | Build tool and dev server |
| Recharts | 2.10 | Charts and data visualization |
| Inter (Google Fonts) | — | Typography |

---

## References

- Caro, M. F. (2026). *Benchmarking Artificial Metacognition in Self-Improving Agents*. arXiv preprint.
- CARINA-11 Documentation: *Metacognitive Functions: Technical Analysis & Implementation* (2026).
- Russell, S. & Wefald, E. (1991). *Principles of Metareasoning*.
- Cox, M. & Raja, A. (2011). *Meta-Level Architectures*.
- Colombian Ministry of Education — *Curricular Guidelines for Technology & Informatics*.

---

## Author

Developed as part of the **CARINA Cognitive Architecture** research project for intelligent tutoring systems in smart educational environments.

---

*CARINA — A cognitive architecture for artificial intelligent agents in smart educational environments*