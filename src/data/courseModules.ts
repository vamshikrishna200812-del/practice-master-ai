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
  }
};

export default courseModulesData;
