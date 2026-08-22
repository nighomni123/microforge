# Idea Backlog — the factory's product pipeline

Score each idea with the model in [scoring-model.md](scoring-model.md):

```
Priority = Demand×0.35 + CompetitionGap×0.20 + BuildSpeed×0.20 + Monetization×0.15 + LowRisk×0.10
```

Only build ideas scoring **≥ 7.0**. One CSV row per idea — this file is the machine's fuel.
(The table below is pre-formatted as CSV so it pastes straight into a spreadsheet.)

```csv
Idea,Category,Platform,Demand Score,Competition Gap,Build Speed,Monetization,Risk (10=safe),Priority Score,Status,URL,Keywords,Competitor Links,MVP Scope,Build Template,Launch Date,Revenue,Retention,Notes
Freelance Hourly Rate Calculator,calculators,web,8,7,9,6,9,7.75,live,/calculators/freelance-rate-calculator,freelance hourly rate calculator,,3-input formula + 3 outputs,formula-v1,,,,Reference implementation
Tip Split Calculator,calculators,web,7,6,9,6,9,7.20,live,/calculators/tip-split-calculator,tip calculator per person,,chained outputs tip->total->per-person,formula-v1,,,,Chained-output reference
Savings Goal Calculator,calculators,web,8,7,8,6,9,7.45,live,/calculators/savings-goal-calculator,savings goal calculator,,compound months w/ zero-rate branch,formula-v1,,,,Conditional+log formulas proof
Password Strength Checker,utilities,web,8,5,9,4,9,6.85,live,/utilities/password-strength-checker,password strength checker,,entropy+crack time via customCompute,custom-v1,,,,Privacy-first customCompute
Random Decision Maker,generators,web,7,5,9,4,9,6.50,live,/generators/random-decision-maker,random decision maker,,comma list picker + action button,custom-v1,,,,autoCompute:false pattern
Calorie Deficit Calculator,calculators,web,9,7,8,7,6,7.90,backlog,,calorie deficit calculator,,Mifflin-St Jeor TDEE then deficit,formula-v2,,,,YMYL-adjacent: add disclaimers
Rent Split Calculator,calculators,web,8,6,9,6,9,7.55,backlog,,rent split calculator roommates,,room size/income weighting variants,formula-v1,,,,Strong evergreen demand
Pomodoro Timer With Session Stats,timers,web,8,7,7,6,9,7.40,backlog,,pomodoro timer online,,25/5 timer + localStorage session log,timer-v1,,,,Needs interval engine template
Study Planner Generator,planners,web,7,7,7,5,9,6.90,backlog,,study planner generator,,subject+days -> daily schedule,generator-v1,,,,Seasonal spikes around exams
Car Loan Calculator,calculators,web,8,6,9,7,8,7.35,backlog,,car loan payment calculator,,PMT formula + amortization summary,formula-v1,,,,
Budget Split 50/30/20,calculators,web,7,6,9,6,9,7.20,backlog,,50 30 20 budget calculator,,income -> needs/wants/savings buckets,formula-v1,,,,Quick win after launch set
Wedding Budget Planner,planners,web,7,7,7,7,8,7.10,backlog,,wedding budget calculator,,guests+category allocations,formula-v1,,,,
Habit Tracker Web,trackers,web,8,6,6,6,9,7.05,backlog,,habit tracker online free,,daily checkoff + streaks in localStorage,tracker-v1,,,,First CRUD-style template
Unit Converter,converters,web,8,4,9,5,9,6.95,backlog,,unit converter,,category select + factor tables,converter-v1,,,,High volume low RPM; do later
Resume Bullet Generator,generators,web,8,6,6,6,7,6.80,backlog,,resume bullet points generator,,role+verb+metric templates,generator-v1,,,,
Subscription Cost Calculator,calculators,web,6,7,9,5,9,6.55,backlog,,subscription cost tracker monthly,,recurring list -> monthly/yearly totals,formula-v1,,,,
Invoice Tax Calculator,calculators,web,6,7,9,6,7,6.60,backlog,,invoice tax calculator,,subtotal x region rate select,formula-v1,,,,
Reaction Time Test,quizzes,game-web,7,5,6,6,9,6.55,backlog,,reaction time test,,click-on-green ms score best-of-5,game-v1,,,,Needs game template phase
Gym Routine Generator,generators,web,7,6,6,6,7,6.55,backlog,,workout routine generator,,goal+days split templates,generator-v1,,,,Content-heavy; needs care
Word Scramble Game,quizzes,game-web,7,6,5,6,8,6.35,backlog,,word scramble game,,word list + shuffle + guess loop,game-v1,,,,
AI Username Generator,generators,web,7,6,7,5,8,6.45,backlog,,username generator,,adjective+noun lists + style select,generator-v1,,,,Thin-content risk; vary genuinely
Speed Math Game,quizzes,game-web,6,6,6,6,9,6.30,backlog,,speed math game,,timed arithmetic questions + score,game-v1,,,,
Memory Match Emoji,quizzes,game-web,6,5,6,6,8,5.95,backlog,,memory match game,,grid flip pairs + move counter,game-v1,,,,
Simple Habit Tracker Android,trackers,android,8,6,5,7,7,6.75,backlog,,habit tracker app android,,Capacitor wrap of web tracker + AdMob,capacitor-v1,,,,After $25 Play fee
Water Reminder Android,trackers,android,7,5,5,7,7,6.20,backlog,,water reminder app android,,notifications + AdMob banner,capacitor-v1,,,,
Score Counter Android,utilities,android,6,6,6,6,8,6.15,backlog,,score counter app game,,two-player +/- counter dark mode,native-v1,,,,
```
