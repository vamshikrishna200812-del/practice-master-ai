import { CourseModuleData, QuizQuestion, LearningObjective } from "@/components/courses/CourseModule";

// Comprehensive 10-question quizzes with explanations for each course
export const courseModulesData: Record<string, CourseModuleData> = {
  "Mastering Technical Interviews": {
    courseTitle: "Mastering Technical Interviews",
    learningObjectives: [
      {
        id: "obj-1",
        title: "Understand the Technical Interview Structure",
        description: "Learn the typical stages of technical interviews at top tech companies including phone screens, coding rounds, and system design."
      },
      {
        id: "obj-2",
        title: "Master Algorithm Complexity Analysis",
        description: "Analyze time and space complexity using Big O notation to optimize your solutions and communicate efficiency clearly."
      },
      {
        id: "obj-3",
        title: "Apply Core Data Structures",
        description: "Implement and manipulate arrays, linked lists, trees, graphs, and hash tables to solve common interview problems."
      },
      {
        id: "obj-4",
        title: "Develop Problem-Solving Strategies",
        description: "Break down complex problems into manageable steps, identify patterns, and communicate your thought process effectively."
      },
      {
        id: "obj-5",
        title: "Practice Live Coding Under Pressure",
        description: "Build confidence in writing clean, working code while explaining your approach in real-time."
      }
    ],
    topicExplanation: `
**Technical Interview Fundamentals**

Technical interviews are designed to evaluate your problem-solving abilities, coding skills, and how you think under pressure. Unlike academic exams, interviewers care more about your thought process than just getting the right answer.

**The Interview Structure:**
Most technical interviews follow a pattern:
1. **Introduction (5 min)** - Brief introductions and role overview
2. **Problem Presentation (2 min)** - The interviewer presents a coding challenge
3. **Clarification (3-5 min)** - You ask questions to understand requirements
4. **Solution Design (5-10 min)** - Discuss your approach before coding
5. **Implementation (20-30 min)** - Write the actual code
6. **Testing & Optimization (5-10 min)** - Debug and improve your solution
7. **Questions (5 min)** - Your turn to ask questions

**Big O Notation Essentials:**
Understanding complexity is crucial:
- O(1) - Constant time (array access, hash lookup)
- O(log n) - Logarithmic (binary search)
- O(n) - Linear (single loop through data)
- O(n log n) - Linearithmic (efficient sorting)
- O(n²) - Quadratic (nested loops)
- O(2^n) - Exponential (recursive fibonacci)

**Key Problem-Solving Patterns:**
1. **Two Pointers** - Use for sorted arrays, palindromes
2. **Sliding Window** - Subarray/substring problems
3. **Hash Maps** - O(1) lookups, frequency counting
4. **BFS/DFS** - Tree/graph traversal
5. **Dynamic Programming** - Overlapping subproblems

**Communication Tips:**
- Think out loud - share your thought process
- Start with brute force, then optimize
- Ask clarifying questions
- Test with examples before finalizing
    `,
    quiz: [
      {
        id: "q1",
        question: "What is the primary purpose of a technical interview?",
        options: [
          "To test your memorization of algorithms",
          "To evaluate your problem-solving skills and thinking process",
          "To check how fast you can code",
          "To see if you know specific programming languages"
        ],
        correctIndex: 1,
        explanation: "Technical interviews focus on evaluating your problem-solving approach and thought process. Interviewers want to see how you break down problems, consider trade-offs, and communicate your solutions - not just whether you memorized algorithms.",
        topic: "Interview Purpose"
      },
      {
        id: "q2",
        question: "What is the time complexity of accessing an element by index in an array?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
        correctIndex: 2,
        explanation: "Array index access is O(1) or constant time because arrays store elements in contiguous memory locations. The position can be calculated directly using the base address + (index × element size), requiring no iteration.",
        topic: "Big O Notation"
      },
      {
        id: "q3",
        question: "Which approach should you typically start with when solving a new problem?",
        options: [
          "Immediately write the most optimized solution",
          "Start with a brute force solution, then optimize",
          "Ask the interviewer for the solution",
          "Skip to a different problem"
        ],
        correctIndex: 1,
        explanation: "Starting with a brute force solution demonstrates your understanding of the problem and provides a working baseline. You can then discuss optimization opportunities, showing your ability to analyze and improve code - a key skill interviewers look for.",
        topic: "Problem-Solving Strategy"
      },
      {
        id: "q4",
        question: "What is the time complexity of binary search?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
        correctIndex: 2,
        explanation: "Binary search has O(log n) complexity because it eliminates half of the remaining elements with each comparison. For a million elements, it takes at most ~20 comparisons (log₂ 1,000,000 ≈ 20) instead of a million.",
        topic: "Algorithm Complexity"
      },
      {
        id: "q5",
        question: "When should you use a hash map in your solution?",
        options: [
          "When you need to maintain sorted order",
          "When you need O(1) average lookup, insert, or delete",
          "When memory is extremely limited",
          "When you need to find the minimum element"
        ],
        correctIndex: 1,
        explanation: "Hash maps excel at O(1) average-case operations for lookup, insert, and delete. They're ideal for frequency counting, detecting duplicates, or caching results. The trade-off is memory usage and no guaranteed ordering.",
        topic: "Data Structures"
      },
      {
        id: "q6",
        question: "What is the 'Two Pointers' technique best suited for?",
        options: [
          "Searching in unsorted arrays",
          "Problems involving sorted arrays or finding pairs",
          "Tree traversal problems",
          "Dynamic programming problems"
        ],
        correctIndex: 1,
        explanation: "Two Pointers is optimal for sorted arrays, linked lists, or when finding pairs that satisfy conditions (like two-sum in a sorted array). By moving pointers from both ends or at different speeds, you can solve problems in O(n) instead of O(n²).",
        topic: "Algorithm Patterns"
      },
      {
        id: "q7",
        question: "Why is it important to ask clarifying questions at the start of a problem?",
        options: [
          "To waste time and show you're thinking",
          "To understand constraints, edge cases, and requirements",
          "To impress the interviewer with your communication",
          "It's not important - you should start coding immediately"
        ],
        correctIndex: 1,
        explanation: "Clarifying questions reveal crucial information: input size (affects algorithm choice), edge cases (empty arrays, negative numbers), expected output format, and whether you can modify the input. This prevents solving the wrong problem.",
        topic: "Interview Communication"
      },
      {
        id: "q8",
        question: "What is the space complexity of an in-place sorting algorithm?",
        options: ["O(n)", "O(n²)", "O(1)", "O(log n)"],
        correctIndex: 2,
        explanation: "In-place algorithms use O(1) auxiliary space - they sort by swapping elements within the original array without creating additional data structures proportional to input size. Examples include bubble sort, selection sort, and heap sort.",
        topic: "Space Complexity"
      },
      {
        id: "q9",
        question: "Which traversal method explores all neighbors at the current depth before moving deeper?",
        options: [
          "Depth-First Search (DFS)",
          "Breadth-First Search (BFS)",
          "In-order traversal",
          "Pre-order traversal"
        ],
        correctIndex: 1,
        explanation: "BFS uses a queue to explore all nodes at the current level before moving to the next. This makes it ideal for finding shortest paths in unweighted graphs, level-order tree traversal, and exploring neighbors systematically.",
        topic: "Graph Traversal"
      },
      {
        id: "q10",
        question: "What indicates a problem might be solved with dynamic programming?",
        options: [
          "The problem involves sorting",
          "The problem has overlapping subproblems and optimal substructure",
          "The problem requires graph traversal",
          "The problem uses string manipulation"
        ],
        correctIndex: 1,
        explanation: "Dynamic Programming applies when: 1) Optimal substructure - optimal solution contains optimal sub-solutions, and 2) Overlapping subproblems - same subproblems are solved repeatedly. Memoization or tabulation stores results to avoid recomputation.",
        topic: "Dynamic Programming"
      }
    ]
  },

  "Behavioral Interview Excellence": {
    courseTitle: "Behavioral Interview Excellence",
    learningObjectives: [
      {
        id: "obj-1",
        title: "Understand Behavioral Interview Goals",
        description: "Learn why companies use behavioral interviews and what competencies they're designed to assess."
      },
      {
        id: "obj-2",
        title: "Master the STAR Method",
        description: "Structure compelling responses using Situation, Task, Action, and Result for maximum impact."
      },
      {
        id: "obj-3",
        title: "Build Your Story Bank",
        description: "Identify and prepare 8-10 versatile stories from your experience that demonstrate key competencies."
      },
      {
        id: "obj-4",
        title: "Handle Challenging Questions",
        description: "Navigate difficult topics like failures, conflicts, and weaknesses with authenticity and professionalism."
      },
      {
        id: "obj-5",
        title: "Demonstrate Leadership and Teamwork",
        description: "Showcase your ability to lead, collaborate, and influence without formal authority."
      }
    ],
    topicExplanation: `
**Why Behavioral Interviews Matter**

Behavioral interviews are based on the premise that past behavior predicts future performance. Companies use them to assess soft skills that technical interviews miss: leadership, communication, conflict resolution, and cultural fit.

**The STAR Method Explained:**

**S - Situation**: Set the scene with relevant context
- When and where did this happen?
- What was the business context?
- Keep it brief (2-3 sentences)

**T - Task**: Define your specific responsibility
- What was your role?
- What was expected of you?
- What was at stake?

**A - Action**: Detail what YOU did (not the team)
- Use "I" statements
- Be specific about your contributions
- Explain your reasoning

**R - Result**: Share the outcome with metrics
- Quantify impact when possible
- Include lessons learned
- Connect to the job you're applying for

**Key Competencies Companies Assess:**
1. **Leadership** - Driving results, influencing others
2. **Ownership** - Taking responsibility, seeing things through
3. **Collaboration** - Working across teams, handling disagreements
4. **Problem-Solving** - Analytical thinking, creativity
5. **Adaptability** - Handling change, ambiguity
6. **Communication** - Clarity, persuasion, listening

**Common Question Categories:**
- Tell me about a time you led a project...
- Describe a conflict with a colleague...
- Share an example of a failure...
- How do you handle tight deadlines...
- Describe a time you went above and beyond...

**Tips for Excellence:**
- Prepare 8-10 versatile stories
- Keep responses to 2-3 minutes
- Be authentic - don't fabricate
- Show growth and self-awareness
- Always end with impact and learning
    `,
    quiz: [
      {
        id: "q1",
        question: "What does the 'A' in STAR stand for?",
        options: ["Assessment", "Action", "Analysis", "Approach"],
        correctIndex: 1,
        explanation: "The 'A' stands for Action - the specific steps YOU took to address the situation. This is the most important part of your response, where you demonstrate your skills, decision-making, and personal contribution. Always use 'I' statements, not 'we'.",
        topic: "STAR Method"
      },
      {
        id: "q2",
        question: "Why do companies use behavioral interviews?",
        options: [
          "They're easier to conduct than technical interviews",
          "Past behavior is the best predictor of future performance",
          "They take less time than other interview types",
          "They're required by law"
        ],
        correctIndex: 1,
        explanation: "Research shows that past behavior is the strongest predictor of future behavior. By asking about real situations you've handled, interviewers can assess how you'll likely perform in similar situations at their company.",
        topic: "Interview Purpose"
      },
      {
        id: "q3",
        question: "How long should a typical STAR response be?",
        options: ["30 seconds", "2-3 minutes", "10-15 minutes", "As long as possible"],
        correctIndex: 1,
        explanation: "A well-structured STAR response should be 2-3 minutes. This provides enough detail to be compelling without losing the interviewer's attention. If they want more detail, they'll ask follow-up questions.",
        topic: "Response Structure"
      },
      {
        id: "q4",
        question: "When describing a failure, what should you always include?",
        options: [
          "Blame for teammates who caused the failure",
          "Lessons learned and how you've grown from the experience",
          "Excuses that justify the failure",
          "Minimal details to avoid looking bad"
        ],
        correctIndex: 1,
        explanation: "Failure questions assess self-awareness and growth mindset. Take ownership, explain what went wrong, and most importantly, share what you learned and how you've applied those lessons since. This shows maturity and continuous improvement.",
        topic: "Handling Failures"
      },
      {
        id: "q5",
        question: "In the STAR method, which part should you spend the MOST time on?",
        options: ["Situation", "Task", "Action", "Result"],
        correctIndex: 2,
        explanation: "Spend about 60% of your response on the Action portion. This is where you demonstrate your specific contributions, decision-making process, and skills. The Situation and Task should be brief context-setters.",
        topic: "STAR Method"
      },
      {
        id: "q6",
        question: "How many prepared stories should you have ready for behavioral interviews?",
        options: ["2-3 stories", "8-10 versatile stories", "1 story per competency", "20+ stories"],
        correctIndex: 1,
        explanation: "Having 8-10 well-prepared stories allows you to cover most competencies while being flexible. Each story should be versatile enough to demonstrate multiple skills (e.g., one story might show leadership, problem-solving, AND communication).",
        topic: "Interview Preparation"
      },
      {
        id: "q7",
        question: "What's the best way to handle a behavioral question you haven't prepared for?",
        options: [
          "Make up a fictional story",
          "Say you have no relevant experience",
          "Take a moment to think, then draw from a related experience",
          "Ask to skip the question"
        ],
        correctIndex: 2,
        explanation: "It's okay to pause and think. Say 'Let me think of the best example...' then find a related experience from your story bank. Interviewers appreciate thoughtful responses over rushed, irrelevant answers. Authenticity matters more than perfection.",
        topic: "Interview Skills"
      },
      {
        id: "q8",
        question: "When discussing team conflicts, what should you emphasize?",
        options: [
          "How you were right and others were wrong",
          "How you sought to understand perspectives and found resolution",
          "How you avoided the conflict entirely",
          "How management solved the problem for you"
        ],
        correctIndex: 1,
        explanation: "Conflict questions assess your emotional intelligence and collaboration skills. Show that you seek to understand different perspectives, communicate respectfully, and work toward solutions that benefit the team and business.",
        topic: "Conflict Resolution"
      },
      {
        id: "q9",
        question: "What makes a STAR story 'versatile'?",
        options: [
          "It can only be used for one type of question",
          "It demonstrates multiple competencies like leadership, problem-solving, and communication",
          "It's very long and detailed",
          "It involves many different people"
        ],
        correctIndex: 1,
        explanation: "A versatile story can be adapted to answer different question types by emphasizing different aspects. The same project might highlight your leadership when asked about influence, or your analytical skills when asked about problem-solving.",
        topic: "Story Preparation"
      },
      {
        id: "q10",
        question: "Why is it important to quantify results in your STAR responses?",
        options: [
          "Interviewers only care about numbers",
          "Metrics make your impact concrete and memorable",
          "You can't have a good answer without statistics",
          "It's not actually important"
        ],
        correctIndex: 1,
        explanation: "Quantified results (e.g., 'reduced costs by 30%', 'improved load time from 5s to 1s') make your impact concrete and memorable. They transform vague claims into credible achievements. If exact numbers aren't available, use estimates or relative improvements.",
        topic: "Result Metrics"
      }
    ]
  },

  "System Design Fundamentals": {
    courseTitle: "System Design Fundamentals",
    learningObjectives: [
      {
        id: "obj-1",
        title: "Understand System Design Interview Format",
        description: "Learn the structure of system design interviews and what evaluators look for at different experience levels."
      },
      {
        id: "obj-2",
        title: "Master Scalability Concepts",
        description: "Apply horizontal and vertical scaling, load balancing, and caching strategies to handle millions of users."
      },
      {
        id: "obj-3",
        title: "Design Database Architectures",
        description: "Choose between SQL and NoSQL, implement sharding, replication, and design efficient data models."
      },
      {
        id: "obj-4",
        title: "Build Distributed Systems",
        description: "Understand CAP theorem, consistency models, and design fault-tolerant architectures."
      },
      {
        id: "obj-5",
        title: "Apply Design Patterns",
        description: "Use common patterns like microservices, event-driven architecture, and API design best practices."
      }
    ],
    topicExplanation: `
**System Design Interview Overview**

System design interviews test your ability to design large-scale distributed systems. Unlike coding interviews, there's no single correct answer - interviewers evaluate your approach, trade-off analysis, and communication.

**The Interview Framework:**
1. **Requirements Clarification (5 min)**
   - Functional requirements: What should the system do?
   - Non-functional: Scale, latency, availability
   - Constraints: Budget, timeline, existing systems

2. **High-Level Design (10-15 min)**
   - Draw main components
   - Define data flow
   - Identify APIs

3. **Deep Dive (15-20 min)**
   - Pick critical components to detail
   - Address bottlenecks
   - Discuss alternatives

4. **Wrap-up (5 min)**
   - Identify edge cases
   - Discuss monitoring and maintenance
   - Future improvements

**Core Concepts:**

**Scalability:**
- Vertical Scaling: Add more power to existing machines
- Horizontal Scaling: Add more machines
- Rule: Design for horizontal scaling

**Database Design:**
- SQL: ACID compliance, complex queries, relationships
- NoSQL: Flexibility, horizontal scaling, eventual consistency
- Sharding: Distribute data across databases
- Replication: Copy data for redundancy and reads

**Caching:**
- CDN: Cache static content globally
- Application Cache: Redis, Memcached
- Database Cache: Query results
- Browser Cache: Reduce requests

**Load Balancing:**
- Round Robin: Simple rotation
- Least Connections: Send to least busy
- IP Hash: Consistent user routing

**CAP Theorem:**
You can only guarantee 2 of 3:
- Consistency: All nodes see same data
- Availability: System always responds
- Partition Tolerance: Works despite network issues
    `,
    quiz: [
      {
        id: "q1",
        question: "What is horizontal scaling?",
        options: [
          "Adding more RAM to an existing server",
          "Adding more machines to distribute the load",
          "Upgrading the CPU of a server",
          "Reducing the number of servers"
        ],
        correctIndex: 1,
        explanation: "Horizontal scaling (scaling out) means adding more machines to your pool of resources. Unlike vertical scaling (adding more power to one machine), horizontal scaling has no theoretical limit and provides better fault tolerance through redundancy.",
        topic: "Scalability"
      },
      {
        id: "q2",
        question: "When should you choose a NoSQL database over SQL?",
        options: [
          "When you need complex JOIN operations",
          "When you need strict ACID transactions",
          "When you need flexible schema and horizontal scalability",
          "When data relationships are complex"
        ],
        correctIndex: 2,
        explanation: "NoSQL excels when you need: flexible schemas (data structure evolves), horizontal scalability (petabyte scale), high write throughput, or simple access patterns. SQL is better for complex queries, ACID transactions, and relational data.",
        topic: "Database Selection"
      },
      {
        id: "q3",
        question: "What is the purpose of a CDN (Content Delivery Network)?",
        options: [
          "To process backend API requests",
          "To serve static content from geographically distributed servers",
          "To store database backups",
          "To handle user authentication"
        ],
        correctIndex: 1,
        explanation: "CDNs cache static content (images, CSS, JS) on edge servers worldwide. When a user requests content, it's served from the nearest edge location, reducing latency significantly. Example: A user in Tokyo gets content from a Tokyo edge server instead of a US-based origin.",
        topic: "Caching & CDN"
      },
      {
        id: "q4",
        question: "What does the CAP theorem state?",
        options: [
          "You can have all three: Consistency, Availability, Partition tolerance",
          "You can only guarantee 2 of 3: Consistency, Availability, Partition tolerance",
          "Systems must be Cached, Available, and Performant",
          "Code should be Clean, Accurate, and Professional"
        ],
        correctIndex: 1,
        explanation: "CAP theorem states that in a distributed system with network partitions, you must choose between Consistency (all nodes see the same data) and Availability (system always responds). Partition tolerance is essential, so the real choice is CA during normal operations.",
        topic: "Distributed Systems"
      },
      {
        id: "q5",
        question: "What is database sharding?",
        options: [
          "Creating backup copies of a database",
          "Splitting data across multiple database instances based on a shard key",
          "Encrypting sensitive database columns",
          "Compressing database storage"
        ],
        correctIndex: 1,
        explanation: "Sharding horizontally partitions data across multiple database instances. Each shard holds a subset of data (e.g., users A-M on shard 1, N-Z on shard 2). This enables massive scale but adds complexity for cross-shard queries and transactions.",
        topic: "Database Scaling"
      },
      {
        id: "q6",
        question: "What load balancing algorithm ensures a user always connects to the same server?",
        options: [
          "Round Robin",
          "Random",
          "IP Hash / Sticky Sessions",
          "Least Connections"
        ],
        correctIndex: 2,
        explanation: "IP Hash (or sticky sessions) routes requests from the same client IP to the same server. This is important for stateful applications or when session data is stored locally. However, it can cause uneven load distribution.",
        topic: "Load Balancing"
      },
      {
        id: "q7",
        question: "What is the primary benefit of microservices architecture?",
        options: [
          "Simpler deployment than monoliths",
          "Independent scaling and deployment of services",
          "Reduced network latency",
          "Lower infrastructure costs"
        ],
        correctIndex: 1,
        explanation: "Microservices allow each service to be scaled, deployed, and developed independently. The payment service can scale during checkout surges without affecting the search service. However, this adds complexity in terms of networking, debugging, and data consistency.",
        topic: "Architecture Patterns"
      },
      {
        id: "q8",
        question: "What is eventual consistency?",
        options: [
          "Data is always immediately consistent across all nodes",
          "Data will become consistent across nodes given enough time",
          "Data is never consistent",
          "Consistency is guaranteed by transactions"
        ],
        correctIndex: 1,
        explanation: "Eventual consistency means that if no new updates are made, all replicas will eventually have the same data. It's a trade-off for higher availability and performance. Example: A social media post might take seconds to appear for all followers globally.",
        topic: "Consistency Models"
      },
      {
        id: "q9",
        question: "Why is replication used in distributed databases?",
        options: [
          "To reduce storage costs",
          "To provide redundancy, fault tolerance, and faster reads",
          "To slow down write operations",
          "To simplify database queries"
        ],
        correctIndex: 1,
        explanation: "Replication copies data to multiple nodes. Benefits include: fault tolerance (if one node fails, others serve requests), faster reads (route to nearest replica), and higher availability. The trade-off is complexity in keeping replicas synchronized.",
        topic: "Database Replication"
      },
      {
        id: "q10",
        question: "What should you do first when approaching a system design problem?",
        options: [
          "Start drawing the architecture immediately",
          "Clarify requirements and constraints with the interviewer",
          "Choose the database technology",
          "Estimate the number of servers needed"
        ],
        correctIndex: 1,
        explanation: "Always start by clarifying requirements. Ask about: expected scale (users, requests/second), feature priorities, latency requirements, consistency needs, and constraints (budget, existing systems). Designing without requirements leads to over-engineering or missing critical needs.",
        topic: "Interview Approach"
      }
    ]
  },

  "Communication Skills for Developers": {
    courseTitle: "Communication Skills for Developers",
    learningObjectives: [
      {
        id: "obj-1",
        title: "Articulate Technical Concepts Clearly",
        description: "Explain complex technical ideas to both technical and non-technical audiences with appropriate depth."
      },
      {
        id: "obj-2",
        title: "Master Active Listening",
        description: "Develop listening skills to fully understand questions before responding and build rapport with interviewers."
      },
      {
        id: "obj-3",
        title: "Project Confidence Non-Verbally",
        description: "Use body language, eye contact, and posture to convey confidence and professionalism."
      },
      {
        id: "obj-4",
        title: "Handle Difficult Questions Gracefully",
        description: "Navigate uncertainty, admit knowledge gaps honestly, and redirect conversations constructively."
      },
      {
        id: "obj-5",
        title: "Excel in Virtual Interviews",
        description: "Optimize your remote interview setup for professional presentation and clear communication."
      }
    ],
    topicExplanation: `
**Why Communication Matters for Developers**

Technical skills alone don't guarantee interview success or career growth. The ability to communicate effectively determines how well you:
- Explain your solutions during interviews
- Collaborate with teammates
- Influence technical decisions
- Advance into leadership roles

**Explaining Technical Concepts:**

**The Pyramid Principle:**
Start with the conclusion, then support with details:
1. Lead with the main point
2. Group supporting ideas
3. Order logically (importance, chronology)

**Audience Calibration:**
- Technical audience: Use precise terminology, go deep
- Non-technical: Use analogies, focus on impact
- Mixed: Start high-level, offer to go deeper

**Active Listening:**

**The HEAR Framework:**
- H - Halt: Stop what you're doing, give full attention
- E - Engage: Lean in, maintain eye contact
- A - Anticipate: Think about what's being communicated
- R - Replay: Paraphrase to confirm understanding

**Avoid These Listening Pitfalls:**
- Interrupting before they finish
- Formulating your response while they speak
- Assuming you know what they'll ask

**Body Language Essentials:**

**Positive Signals:**
- Maintain comfortable eye contact (80% of time)
- Sit upright but relaxed
- Use hand gestures naturally
- Nod to show understanding
- Smile genuinely when appropriate

**Signals to Avoid:**
- Crossing arms (defensive)
- Fidgeting or touching face
- Looking away frequently
- Slouching or leaning back
- Over-gesturing (distracting)

**Virtual Interview Best Practices:**

**Setup Checklist:**
- Camera at eye level
- Face well-lit (light in front, not behind)
- Neutral, uncluttered background
- Hardwired internet if possible
- Test audio/video before interview

**Engagement Tips:**
- Look at camera (not screen) for eye contact
- Mute when not speaking (if appropriate)
- Have backup plan for technical issues
- Dress professionally (full outfit, you might stand up!)
    `,
    quiz: [
      {
        id: "q1",
        question: "When explaining a technical concept to a non-technical stakeholder, what should you do?",
        options: [
          "Use as much technical jargon as possible to sound knowledgeable",
          "Use analogies and focus on business impact rather than implementation details",
          "Refuse to explain until they learn the technical terminology",
          "Provide a detailed technical specification document"
        ],
        correctIndex: 1,
        explanation: "Non-technical stakeholders care about outcomes and impact, not implementation details. Use relatable analogies (e.g., 'caching is like keeping frequently-used items on your desk instead of in storage') and focus on how the solution benefits them.",
        topic: "Technical Communication"
      },
      {
        id: "q2",
        question: "What is active listening?",
        options: [
          "Preparing your response while the other person speaks",
          "Fully concentrating, understanding, and responding thoughtfully to what's being said",
          "Listening while doing other tasks",
          "Agreeing with everything the speaker says"
        ],
        correctIndex: 1,
        explanation: "Active listening means giving full attention to the speaker, understanding their message, and responding thoughtfully. It involves not just hearing words, but understanding context, emotions, and intent. This builds rapport and ensures you address the actual question.",
        topic: "Active Listening"
      },
      {
        id: "q3",
        question: "What's the best approach when you don't know the answer to an interview question?",
        options: [
          "Make up an answer to avoid looking incompetent",
          "Say 'I don't know' and remain silent",
          "Acknowledge the gap honestly, share related knowledge, and explain how you'd find the answer",
          "Quickly change the subject"
        ],
        correctIndex: 2,
        explanation: "Honesty is valued. Say something like: 'I haven't worked with that specific technology, but based on my experience with [related topic], I'd approach it by [method]. I'd also research [specific resources] to learn more.' This shows integrity and problem-solving ability.",
        topic: "Handling Uncertainty"
      },
      {
        id: "q4",
        question: "What does the Pyramid Principle suggest about structuring your communication?",
        options: [
          "Save the main point for the end to build suspense",
          "Start with the conclusion/main point, then provide supporting details",
          "Present information chronologically regardless of importance",
          "Use as many words as possible to be thorough"
        ],
        correctIndex: 1,
        explanation: "The Pyramid Principle advocates leading with your main point or conclusion, then supporting it with grouped, logical arguments. This respects the listener's time, ensures your key message is heard, and structures complex information clearly.",
        topic: "Communication Structure"
      },
      {
        id: "q5",
        question: "How much eye contact should you maintain during an in-person interview?",
        options: [
          "0% - avoid eye contact to seem humble",
          "100% - never look away",
          "About 60-80% - enough to show engagement without staring",
          "Only when answering questions"
        ],
        correctIndex: 2,
        explanation: "Maintaining eye contact about 60-80% of the time conveys confidence and engagement. Looking away occasionally (when thinking) is natural. Too little suggests nervousness or disinterest; too much can feel aggressive or uncomfortable.",
        topic: "Body Language"
      },
      {
        id: "q6",
        question: "During a virtual interview, where should you look to maintain 'eye contact'?",
        options: [
          "At your own video preview",
          "At the interviewer's face on screen",
          "At the camera lens",
          "At your notes beside the screen"
        ],
        correctIndex: 2,
        explanation: "Looking at the camera lens creates the illusion of eye contact for the viewer. Looking at their face on screen makes you appear to be looking slightly down or away. It feels unnatural at first, but practice helps. Glance at the screen occasionally to catch their reactions.",
        topic: "Virtual Interviews"
      },
      {
        id: "q7",
        question: "What body language signal often indicates defensiveness?",
        options: [
          "Leaning forward",
          "Maintaining eye contact",
          "Crossing arms",
          "Using hand gestures"
        ],
        correctIndex: 2,
        explanation: "Crossed arms often signal defensiveness or closed-off behavior, even if you're just cold or comfortable. In interviews, keep your posture open with arms relaxed at your sides or hands visible on the table to appear approachable and engaged.",
        topic: "Body Language"
      },
      {
        id: "q8",
        question: "Before a virtual interview, what should you test in advance?",
        options: [
          "Only the internet connection",
          "Audio, video, lighting, internet, and software",
          "Just the camera angle",
          "Nothing - just join the call"
        ],
        correctIndex: 1,
        explanation: "Test everything: camera quality and angle, microphone audio clarity, lighting (no backlighting), stable internet (preferably wired), and the video conferencing software. Technical difficulties can derail an otherwise great interview. Have a backup plan (phone number, mobile hotspot).",
        topic: "Virtual Interviews"
      },
      {
        id: "q9",
        question: "What should you do before answering a complex question?",
        options: [
          "Start talking immediately to show enthusiasm",
          "Ask if you can skip it",
          "Take a brief pause to gather your thoughts",
          "Ask them to repeat it multiple times"
        ],
        correctIndex: 2,
        explanation: "A brief pause (2-3 seconds) shows you're thoughtful rather than impulsive. You might say, 'That's a great question, let me think about that for a moment.' This leads to more structured, coherent answers and is viewed positively by interviewers.",
        topic: "Interview Skills"
      },
      {
        id: "q10",
        question: "What's an effective way to confirm you understood a question correctly?",
        options: [
          "Assume you understood and start answering",
          "Paraphrase the question back before answering",
          "Ask them to repeat it word-for-word",
          "Answer a different question you prefer"
        ],
        correctIndex: 1,
        explanation: "Paraphrasing confirms understanding and demonstrates active listening. Example: 'So you're asking about how I handled a situation where team priorities conflicted - is that right?' This prevents answering the wrong question and shows strong communication skills.",
        topic: "Active Listening"
      }
    ]
  },
  "AI & Machine Learning with Python": {
    courseTitle: "AI & Machine Learning with Python",
    learningObjectives: [
      { id: "obj-1", title: "Understand AI & ML Foundations", description: "Differentiate AI, ML, and deep learning and identify real-world applications." },
      { id: "obj-2", title: "Master Python for Data Science", description: "Use NumPy, Pandas, and Matplotlib for data manipulation and visualization." },
      { id: "obj-3", title: "Build ML Models", description: "Implement supervised and unsupervised learning algorithms from scratch." },
      { id: "obj-4", title: "Deep Learning & Neural Networks", description: "Build and train neural networks using TensorFlow and Keras." },
      { id: "obj-5", title: "Deploy ML Models", description: "Export, serve, and deploy machine learning models to production." }
    ],
    topicExplanation: `
**AI & Machine Learning Fundamentals**

Machine Learning is a subset of AI that enables systems to learn from data without explicit programming.

**Types of Machine Learning:**
1. **Supervised Learning** — Labeled data (classification, regression)
2. **Unsupervised Learning** — Unlabeled data (clustering, dimensionality reduction)
3. **Reinforcement Learning** — Agent learns through rewards/penalties

**Key Python Libraries:**
- **NumPy** — Numerical computing and array operations
- **Pandas** — Data manipulation and analysis
- **Scikit-learn** — ML algorithms and model evaluation
- **TensorFlow/Keras** — Deep learning frameworks
- **Matplotlib/Seaborn** — Data visualization

**The ML Pipeline:**
Data Collection → Preprocessing → Feature Engineering → Model Training → Evaluation → Deployment

**Model Evaluation Metrics:**
| Metric | Use Case |
|--------|----------|
| Accuracy | Balanced datasets |
| Precision | When false positives are costly |
| Recall | When false negatives are costly |
| F1 Score | Imbalanced datasets |
| AUC-ROC | Binary classification |
    `,
    quiz: [
      { id: "q1", question: "What type of ML uses labeled training data?", options: ["Unsupervised learning", "Supervised learning", "Reinforcement learning", "Transfer learning"], correctIndex: 1, explanation: "Supervised learning uses labeled data where the algorithm learns to map inputs to known outputs.", topic: "ML Fundamentals" },
      { id: "q2", question: "Which library is the primary tool for data manipulation in Python?", options: ["NumPy", "TensorFlow", "Pandas", "Flask"], correctIndex: 2, explanation: "Pandas provides DataFrames — the core data structure for data analysis in Python.", topic: "Python Libraries" },
      { id: "q3", question: "What is overfitting?", options: ["Model performs poorly on all data", "Model memorizes training data and fails on new data", "Model is too simple", "Model has too few features"], correctIndex: 1, explanation: "Overfitting occurs when a model learns noise in training data, performing well on training but poorly on unseen data.", topic: "Model Evaluation" },
      { id: "q4", question: "What activation function is commonly used in hidden layers?", options: ["Sigmoid", "ReLU", "Softmax", "Linear"], correctIndex: 1, explanation: "ReLU (Rectified Linear Unit) is the most popular activation function for hidden layers due to its simplicity and effectiveness.", topic: "Neural Networks" },
      { id: "q5", question: "What is the purpose of a train-test split?", options: ["To speed up training", "To evaluate model performance on unseen data", "To reduce dataset size", "To remove outliers"], correctIndex: 1, explanation: "Splitting data ensures we can evaluate how well the model generalizes to new, unseen data.", topic: "Model Evaluation" },
      { id: "q6", question: "Which algorithm is best for binary classification?", options: ["Linear Regression", "Logistic Regression", "K-Means", "PCA"], correctIndex: 1, explanation: "Logistic Regression is designed for binary classification, predicting probabilities of two classes.", topic: "Algorithms" },
      { id: "q7", question: "What is a CNN primarily used for?", options: ["Natural language processing", "Image recognition", "Time series forecasting", "Recommendation systems"], correctIndex: 1, explanation: "Convolutional Neural Networks (CNNs) excel at image recognition by detecting spatial patterns.", topic: "Deep Learning" },
      { id: "q8", question: "What does backpropagation do?", options: ["Forward passes data through the network", "Adjusts weights by calculating gradients of the loss", "Normalizes input data", "Splits data into batches"], correctIndex: 1, explanation: "Backpropagation computes gradients of the loss function to update network weights during training.", topic: "Neural Networks" },
      { id: "q9", question: "What is transfer learning?", options: ["Moving data between databases", "Using a pre-trained model for a new task", "Transferring files between servers", "Converting Python to JavaScript"], correctIndex: 1, explanation: "Transfer learning leverages knowledge from pre-trained models to solve new, related problems with less data.", topic: "Deep Learning" },
      { id: "q10", question: "Which metric is best for imbalanced datasets?", options: ["Accuracy", "F1 Score", "Mean Squared Error", "R-squared"], correctIndex: 1, explanation: "F1 Score balances precision and recall, making it ideal for imbalanced datasets where accuracy can be misleading.", topic: "Model Evaluation" }
    ]
  },
  "Data Science & Analytics": {
    courseTitle: "Data Science & Analytics",
    learningObjectives: [
      { id: "obj-1", title: "Understand the Data Science Lifecycle", description: "Learn the end-to-end process from data collection to insight delivery." },
      { id: "obj-2", title: "Master Data Wrangling", description: "Clean, transform, and prepare messy data for analysis." },
      { id: "obj-3", title: "Apply Statistical Analysis", description: "Use descriptive and inferential statistics to derive insights." },
      { id: "obj-4", title: "Create Compelling Visualizations", description: "Build charts and dashboards that tell data stories." },
      { id: "obj-5", title: "Write SQL for Analytics", description: "Query databases efficiently for data extraction and analysis." }
    ],
    topicExplanation: `
**Data Science Fundamentals**

Data Science combines statistics, programming, and domain expertise to extract insights from data.

**The Data Science Pipeline:**
1. **Define the Problem** — What question are we answering?
2. **Collect Data** — APIs, databases, web scraping, surveys
3. **Clean & Wrangle** — Handle missing values, outliers, formatting
4. **Explore (EDA)** — Visualize patterns, correlations, distributions
5. **Model/Analyze** — Statistical tests, ML models, aggregations
6. **Communicate** — Dashboards, reports, presentations

**Essential Statistical Concepts:**
- **Mean, Median, Mode** — Measures of central tendency
- **Standard Deviation** — Spread of data
- **Correlation** — Relationship between variables
- **Hypothesis Testing** — Making data-driven decisions
- **p-value** — Probability of observing results under null hypothesis
    `,
    quiz: [
      { id: "q1", question: "What is the first step in a data science project?", options: ["Build a model", "Define the problem clearly", "Clean the data", "Create visualizations"], correctIndex: 1, explanation: "Clearly defining the business problem ensures all subsequent work is focused and relevant.", topic: "Data Science Lifecycle" },
      { id: "q2", question: "Which Pandas function handles missing values?", options: ["pd.merge()", "df.fillna()", "df.sort_values()", "pd.concat()"], correctIndex: 1, explanation: "fillna() replaces missing values with a specified value, mean, median, or other strategy.", topic: "Data Wrangling" },
      { id: "q3", question: "What does a p-value less than 0.05 typically indicate?", options: ["No significance", "Statistical significance", "Data error", "Perfect correlation"], correctIndex: 1, explanation: "A p-value < 0.05 means there's less than 5% probability the results occurred by chance.", topic: "Statistics" },
      { id: "q4", question: "Which chart is best for showing distributions?", options: ["Pie chart", "Histogram", "Line chart", "Scatter plot"], correctIndex: 1, explanation: "Histograms show the frequency distribution of continuous data, revealing shape, spread, and outliers.", topic: "Visualization" },
      { id: "q5", question: "What SQL clause filters aggregated results?", options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], correctIndex: 1, explanation: "HAVING filters groups after GROUP BY aggregation, while WHERE filters individual rows.", topic: "SQL" },
      { id: "q6", question: "What is a window function in SQL?", options: ["A function that opens windows", "Performs calculations across related rows", "Creates database views", "Joins two tables"], correctIndex: 1, explanation: "Window functions perform calculations across a set of rows related to the current row.", topic: "SQL" },
      { id: "q7", question: "What is the correlation coefficient range?", options: ["0 to 1", "-1 to 1", "0 to 100", "-100 to 100"], correctIndex: 1, explanation: "Correlation ranges from -1 (perfect negative) to 1 (perfect positive), with 0 meaning no correlation.", topic: "Statistics" },
      { id: "q8", question: "What does EDA stand for?", options: ["Extended Data Application", "Exploratory Data Analysis", "Estimated Data Assessment", "External Data Access"], correctIndex: 1, explanation: "Exploratory Data Analysis is the process of visually and statistically examining data to understand its characteristics.", topic: "EDA" },
      { id: "q9", question: "Which library creates interactive Python visualizations?", options: ["NumPy", "Plotly", "Scikit-learn", "BeautifulSoup"], correctIndex: 1, explanation: "Plotly creates interactive, web-based visualizations including charts, dashboards, and maps.", topic: "Visualization" },
      { id: "q10", question: "What is a CTE in SQL?", options: ["Common Table Expression", "Central Tracking Engine", "Code Translation Engine", "Client Transfer Entity"], correctIndex: 0, explanation: "CTEs (Common Table Expressions) create temporary named result sets for cleaner, more readable queries.", topic: "SQL" }
    ]
  },
  "Cybersecurity Fundamentals": {
    courseTitle: "Cybersecurity Fundamentals",
    learningObjectives: [
      { id: "obj-1", title: "Understand the Threat Landscape", description: "Identify common threats, attack vectors, and threat actors." },
      { id: "obj-2", title: "Master Network Security", description: "Configure firewalls, IDS/IPS, and secure network architectures." },
      { id: "obj-3", title: "Apply Cryptography", description: "Understand encryption, hashing, and digital certificate management." },
      { id: "obj-4", title: "Secure Web Applications", description: "Prevent OWASP Top 10 vulnerabilities in web applications." },
      { id: "obj-5", title: "Respond to Incidents", description: "Build and execute incident response plans effectively." }
    ],
    topicExplanation: `
**Cybersecurity Essentials**

Cybersecurity protects systems, networks, and data from digital attacks.

**The CIA Triad:**
- **Confidentiality** — Only authorized access to data
- **Integrity** — Data is accurate and unaltered
- **Availability** — Systems are accessible when needed

**Common Attack Types:**
| Attack | Description |
|--------|-------------|
| Phishing | Social engineering via fake emails |
| SQL Injection | Malicious SQL through input fields |
| XSS | Injecting scripts into web pages |
| DDoS | Overwhelming servers with traffic |
| Ransomware | Encrypting data for ransom |
| Man-in-the-Middle | Intercepting communications |

**Defense Layers:**
1. **Perimeter** — Firewalls, WAF
2. **Network** — IDS/IPS, segmentation
3. **Endpoint** — Antivirus, EDR
4. **Application** — Secure coding, input validation
5. **Data** — Encryption, access controls
6. **Identity** — MFA, RBAC, least privilege
    `,
    quiz: [
      { id: "q1", question: "What does the 'I' in CIA triad stand for?", options: ["Intelligence", "Integrity", "Internet", "Infrastructure"], correctIndex: 1, explanation: "Integrity ensures data remains accurate, complete, and unaltered by unauthorized parties.", topic: "CIA Triad" },
      { id: "q2", question: "What type of attack uses fake emails to steal credentials?", options: ["DDoS", "Phishing", "SQL Injection", "Brute Force"], correctIndex: 1, explanation: "Phishing uses deceptive emails or messages to trick users into revealing sensitive information.", topic: "Threat Types" },
      { id: "q3", question: "What is the purpose of an IDS?", options: ["Block all traffic", "Detect suspicious network activity", "Encrypt data", "Manage user accounts"], correctIndex: 1, explanation: "Intrusion Detection Systems monitor network traffic for suspicious activity and alert administrators.", topic: "Network Security" },
      { id: "q4", question: "Which encryption type uses the same key for encryption and decryption?", options: ["Asymmetric", "Symmetric", "Hashing", "Digital signature"], correctIndex: 1, explanation: "Symmetric encryption (like AES) uses one shared key for both encrypting and decrypting data.", topic: "Cryptography" },
      { id: "q5", question: "What is SQL Injection?", options: ["A database backup method", "Inserting malicious SQL through user inputs", "A SQL optimization technique", "A data migration tool"], correctIndex: 1, explanation: "SQL Injection exploits vulnerable input fields to execute unauthorized database commands.", topic: "Web Security" },
      { id: "q6", question: "What does MFA stand for?", options: ["Multiple File Access", "Multi-Factor Authentication", "Main Firewall Application", "Managed Feature Audit"], correctIndex: 1, explanation: "Multi-Factor Authentication requires two or more verification methods to grant access.", topic: "Identity Security" },
      { id: "q7", question: "What is the principle of least privilege?", options: ["Give everyone admin access", "Grant minimum access needed for the job", "Remove all user permissions", "Only use root accounts"], correctIndex: 1, explanation: "Least privilege means users get only the minimum permissions necessary to perform their duties.", topic: "Access Control" },
      { id: "q8", question: "What does a WAF protect against?", options: ["Physical theft", "Web application attacks", "Power outages", "Hardware failures"], correctIndex: 1, explanation: "Web Application Firewalls filter and monitor HTTP traffic to protect against web-based attacks.", topic: "Web Security" },
      { id: "q9", question: "What is the first step in incident response?", options: ["Eradication", "Preparation", "Recovery", "Containment"], correctIndex: 1, explanation: "Preparation is the first phase — having an IR plan, team, and tools ready before incidents occur.", topic: "Incident Response" },
      { id: "q10", question: "What is ethical hacking?", options: ["Illegal hacking", "Authorized testing to find security vulnerabilities", "Hacking for personal gain", "Disabling security systems"], correctIndex: 1, explanation: "Ethical hacking involves authorized security testing to identify and fix vulnerabilities before attackers exploit them.", topic: "Penetration Testing" }
    ]
  },
  "Cloud Computing (AWS & Azure)": {
    courseTitle: "Cloud Computing (AWS & Azure)",
    learningObjectives: [
      { id: "obj-1", title: "Understand Cloud Models", description: "Learn IaaS, PaaS, SaaS and deployment models." },
      { id: "obj-2", title: "Master AWS Core Services", description: "Deploy and manage EC2, S3, RDS, Lambda, and IAM." },
      { id: "obj-3", title: "Work with Azure", description: "Navigate Azure portal and deploy key Azure services." },
      { id: "obj-4", title: "Containerize Applications", description: "Use Docker and Kubernetes for cloud-native deployment." },
      { id: "obj-5", title: "Build CI/CD Pipelines", description: "Automate testing and deployment with DevOps practices." }
    ],
    topicExplanation: `
**Cloud Computing Essentials**

Cloud computing delivers computing resources over the internet on a pay-as-you-go basis.

**Service Models:**
- **IaaS** — Virtual machines, storage, networking (EC2, Azure VMs)
- **PaaS** — Platform for building apps (Elastic Beanstalk, Azure App Service)
- **SaaS** — Ready-to-use software (Gmail, Salesforce)

**Key AWS Services:**
| Service | Purpose |
|---------|---------|
| EC2 | Virtual servers |
| S3 | Object storage |
| RDS | Managed databases |
| Lambda | Serverless compute |
| IAM | Identity & access management |
| CloudFront | CDN |

**Key Azure Services:**
| Service | Purpose |
|---------|---------|
| Virtual Machines | Compute |
| Blob Storage | Object storage |
| Azure SQL | Managed database |
| Functions | Serverless compute |
| Azure AD | Identity management |

**Cloud Architecture Principles:**
1. Design for failure — everything fails eventually
2. Decouple components — use queues and microservices
3. Think elastic — auto-scale based on demand
4. Secure by default — least privilege, encryption
    `,
    quiz: [
      { id: "q1", question: "What is IaaS?", options: ["Software delivered via browser", "Infrastructure provided as a cloud service", "A programming language", "A networking protocol"], correctIndex: 1, explanation: "Infrastructure as a Service provides virtualized computing resources over the internet.", topic: "Cloud Models" },
      { id: "q2", question: "Which AWS service provides serverless compute?", options: ["EC2", "S3", "Lambda", "RDS"], correctIndex: 2, explanation: "AWS Lambda runs code without provisioning servers — you only pay for compute time used.", topic: "AWS" },
      { id: "q3", question: "What is the primary purpose of IAM?", options: ["Store files", "Manage user access and permissions", "Host websites", "Send emails"], correctIndex: 1, explanation: "IAM (Identity and Access Management) controls who can access which AWS resources.", topic: "Security" },
      { id: "q4", question: "What does a container do?", options: ["Stores physical servers", "Packages an app with its dependencies for consistent deployment", "Creates virtual machines", "Manages databases"], correctIndex: 1, explanation: "Containers package applications with all dependencies, ensuring consistency across environments.", topic: "Containers" },
      { id: "q5", question: "What is Kubernetes used for?", options: ["Writing code", "Container orchestration", "Database management", "Email services"], correctIndex: 1, explanation: "Kubernetes automates deployment, scaling, and management of containerized applications.", topic: "Containers" },
      { id: "q6", question: "What is auto-scaling?", options: ["Manual server addition", "Automatically adjusting resources based on demand", "Turning off servers at night", "Upgrading hardware"], correctIndex: 1, explanation: "Auto-scaling automatically adds or removes resources based on current demand.", topic: "Cloud Architecture" },
      { id: "q7", question: "What is a VPC?", options: ["Virtual Private Cloud — isolated network in the cloud", "Very Private Computer", "Virtual Processing Core", "Vendor Price Calculator"], correctIndex: 0, explanation: "VPC provides an isolated virtual network where you can launch cloud resources.", topic: "Networking" },
      { id: "q8", question: "What CI/CD practice deploys code automatically after tests pass?", options: ["Manual deployment", "Continuous Deployment", "Code review", "Load testing"], correctIndex: 1, explanation: "Continuous Deployment automatically releases code to production after passing all tests.", topic: "DevOps" },
      { id: "q9", question: "What is Azure Blob Storage?", options: ["A compute service", "Object storage for unstructured data", "A database service", "A messaging service"], correctIndex: 1, explanation: "Azure Blob Storage stores large amounts of unstructured data like images, videos, and backups.", topic: "Azure" },
      { id: "q10", question: "What is the shared responsibility model?", options: ["Cloud provider handles everything", "Customer handles everything", "Provider secures infrastructure, customer secures their data and apps", "No one is responsible"], correctIndex: 2, explanation: "In the shared responsibility model, the cloud provider secures the underlying infrastructure while customers secure their own data and applications.", topic: "Cloud Security" }
    ]
  },
  "Digital Marketing Mastery": {
    courseTitle: "Digital Marketing Mastery",
    learningObjectives: [
      { id: "obj-1", title: "Build a Digital Strategy", description: "Create comprehensive digital marketing strategies aligned with business goals." },
      { id: "obj-2", title: "Master SEO", description: "Optimize websites for search engines to drive organic traffic." },
      { id: "obj-3", title: "Run Paid Campaigns", description: "Create and optimize PPC campaigns on Google and social platforms." },
      { id: "obj-4", title: "Create Engaging Content", description: "Develop content strategies and compelling copywriting." },
      { id: "obj-5", title: "Analyze Marketing Data", description: "Use analytics tools to measure ROI and optimize campaigns." }
    ],
    topicExplanation: `
**Digital Marketing Essentials**

Digital marketing promotes products and services through digital channels to reach and engage customers.

**Core Channels:**
1. **SEO** — Organic search visibility
2. **PPC** — Paid search and display advertising
3. **Social Media** — Platform-specific engagement
4. **Content Marketing** — Valuable content creation
5. **Email Marketing** — Direct communication
6. **Affiliate Marketing** — Partner-driven sales

**SEO Fundamentals:**
- **On-Page** — Title tags, meta descriptions, headings, content
- **Off-Page** — Backlinks, social signals, brand mentions
- **Technical** — Site speed, mobile-friendly, structured data

**Key Metrics:**
| Metric | What It Measures |
|--------|-----------------|
| CTR | Click-through rate |
| CPC | Cost per click |
| ROAS | Return on ad spend |
| CAC | Customer acquisition cost |
| LTV | Customer lifetime value |
| Bounce Rate | Single-page visits |
    `,
    quiz: [
      { id: "q1", question: "What does SEO stand for?", options: ["Social Engagement Optimization", "Search Engine Optimization", "Site Enhancement Operation", "Standard Email Outreach"], correctIndex: 1, explanation: "Search Engine Optimization improves website visibility in organic search results.", topic: "SEO" },
      { id: "q2", question: "What is a meta description?", options: ["A database field", "A brief summary shown in search results", "A social media post", "An email subject line"], correctIndex: 1, explanation: "Meta descriptions are HTML elements that provide a brief summary of a page shown in search engine results.", topic: "SEO" },
      { id: "q3", question: "What does PPC stand for?", options: ["Post Per Channel", "Pay Per Click", "Profile Page Content", "Public Private Communication"], correctIndex: 1, explanation: "Pay Per Click is an advertising model where you pay each time someone clicks your ad.", topic: "Paid Advertising" },
      { id: "q4", question: "What is A/B testing in marketing?", options: ["Testing two versions to see which performs better", "Grading marketing campaigns", "Alphabetical sorting of content", "Testing on Android and iOS"], correctIndex: 0, explanation: "A/B testing compares two versions of content to determine which drives better results.", topic: "Analytics" },
      { id: "q5", question: "What is ROAS?", options: ["Rate of Average Sales", "Return on Ad Spend", "Reach of Audience Size", "Results of A/B Studies"], correctIndex: 1, explanation: "Return on Ad Spend measures revenue generated per dollar spent on advertising.", topic: "Analytics" },
      { id: "q6", question: "Which copywriting framework follows Attention, Interest, Desire, Action?", options: ["PAS", "AIDA", "STAR", "SWOT"], correctIndex: 1, explanation: "AIDA guides the reader through Attention → Interest → Desire → Action for conversion.", topic: "Copywriting" },
      { id: "q7", question: "What is a conversion funnel?", options: ["A kitchen tool", "The journey from awareness to purchase", "A type of chart", "An email template"], correctIndex: 1, explanation: "A conversion funnel maps the customer journey from initial awareness through to final purchase.", topic: "Strategy" },
      { id: "q8", question: "What is the purpose of UTM parameters?", options: ["Speed up websites", "Track campaign traffic sources in analytics", "Create email templates", "Manage social media accounts"], correctIndex: 1, explanation: "UTM parameters are tags added to URLs to track which campaigns drive traffic and conversions.", topic: "Analytics" },
      { id: "q9", question: "What is email segmentation?", options: ["Splitting email into paragraphs", "Dividing subscribers into groups based on criteria", "Blocking spam emails", "Forwarding emails automatically"], correctIndex: 1, explanation: "Email segmentation divides your subscriber list into targeted groups for more relevant messaging.", topic: "Email Marketing" },
      { id: "q10", question: "What is bounce rate?", options: ["Email delivery failure rate", "Percentage of visitors who leave after viewing one page", "Social media unfollows", "Ad click rate"], correctIndex: 1, explanation: "Bounce rate measures the percentage of visitors who leave your site after viewing only one page.", topic: "Analytics" }
    ]
  },
  "Full Stack Development": {
    courseTitle: "Full Stack Development",
    learningObjectives: [
      { id: "obj-1", title: "Understand Full Stack Architecture", description: "Learn how frontend, backend, and database layers work together." },
      { id: "obj-2", title: "Build React Frontends", description: "Create modern, responsive UIs with React and Tailwind CSS." },
      { id: "obj-3", title: "Create Backend APIs", description: "Build RESTful APIs with Node.js and Express." },
      { id: "obj-4", title: "Design Databases", description: "Model data with PostgreSQL and implement efficient queries." },
      { id: "obj-5", title: "Deploy Full Stack Apps", description: "Containerize and deploy applications to production." }
    ],
    topicExplanation: `
**Full Stack Development**

Full stack developers build complete web applications — from the user interface to the server and database.

**The Three Layers:**
1. **Frontend** — What users see and interact with (React, HTML, CSS)
2. **Backend** — Server logic, APIs, business rules (Node.js, Express)
3. **Database** — Data storage and retrieval (PostgreSQL, MongoDB)

**Modern Tech Stack:**
| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Auth | JWT, OAuth 2.0 |
| Deployment | Docker, CI/CD |

**REST API Design:**
- **GET** — Read resources
- **POST** — Create resources
- **PUT/PATCH** — Update resources
- **DELETE** — Remove resources

**Key Concepts:**
- Component-based architecture
- State management (hooks, context)
- Middleware and error handling
- Database normalization
- Authentication vs Authorization
    `,
    quiz: [
      { id: "q1", question: "What is the role of the backend in a full stack app?", options: ["Style the UI", "Handle server logic and data processing", "Display images", "Manage CSS"], correctIndex: 1, explanation: "The backend handles business logic, database interactions, authentication, and serves data to the frontend.", topic: "Architecture" },
      { id: "q2", question: "What is a React component?", options: ["A database table", "A reusable piece of UI", "A CSS class", "A server endpoint"], correctIndex: 1, explanation: "React components are reusable, self-contained pieces of UI that manage their own state and rendering.", topic: "React" },
      { id: "q3", question: "What HTTP method creates a new resource?", options: ["GET", "POST", "DELETE", "PATCH"], correctIndex: 1, explanation: "POST is used to create new resources on the server, sending data in the request body.", topic: "REST APIs" },
      { id: "q4", question: "What is database normalization?", options: ["Making the database faster", "Organizing data to reduce redundancy", "Deleting old records", "Converting data types"], correctIndex: 1, explanation: "Normalization organizes data into tables to minimize redundancy and improve data integrity.", topic: "Database" },
      { id: "q5", question: "What is JWT used for?", options: ["Styling components", "Secure token-based authentication", "Database queries", "Image processing"], correctIndex: 1, explanation: "JSON Web Tokens are used for stateless authentication, encoding user identity and claims.", topic: "Authentication" },
      { id: "q6", question: "What is middleware in Express?", options: ["A database layer", "Functions that process requests between receipt and response", "A frontend library", "A testing tool"], correctIndex: 1, explanation: "Middleware functions have access to the request and response objects and can modify them or end the request cycle.", topic: "Backend" },
      { id: "q7", question: "What is the useState hook in React?", options: ["A routing function", "A hook for managing component state", "A CSS utility", "A database connector"], correctIndex: 1, explanation: "useState is a React Hook that lets functional components manage local state.", topic: "React" },
      { id: "q8", question: "What does CORS handle?", options: ["CSS styling", "Cross-origin resource sharing between domains", "Database connections", "File uploads"], correctIndex: 1, explanation: "CORS controls which domains can make requests to your API, preventing unauthorized cross-origin access.", topic: "Security" },
      { id: "q9", question: "What is Docker used for?", options: ["Writing code", "Containerizing applications for consistent deployment", "Managing databases", "Creating UI components"], correctIndex: 1, explanation: "Docker packages applications with their dependencies into containers for consistent deployment across environments.", topic: "Deployment" },
      { id: "q10", question: "What is the difference between authentication and authorization?", options: ["They are the same thing", "Authentication verifies identity, authorization verifies permissions", "Authentication is for servers, authorization is for clients", "There is no difference"], correctIndex: 1, explanation: "Authentication confirms WHO you are, while authorization determines WHAT you can do.", topic: "Security" }
    ]
  }
};

export default courseModulesData;
