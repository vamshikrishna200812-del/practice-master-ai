/**
 * Downloadable note content for each course lesson.
 * Keys follow the format: "CourseTitle-LessonId"
 */

export const courseNoteContent: Record<string, string> = {
  // ==========================================
  // MASTERING TECHNICAL INTERVIEWS
  // ==========================================
  "Mastering Technical Interviews-1": `## Introduction to Technical Interviews

### What Companies Look For
- **Problem-solving ability**: Can you break down complex problems?
- **Communication**: Can you explain your thought process clearly?
- **Code quality**: Is your code clean, readable, and efficient?
- **Cultural fit**: Do you collaborate well and handle feedback?

### Typical Interview Pipeline
| Stage | Duration | Focus |
|-------|----------|-------|
| Phone Screen | 30-45 min | Basic coding + behavioral |
| Technical Round 1 | 45-60 min | Data structures & algorithms |
| Technical Round 2 | 45-60 min | System design or domain-specific |
| Behavioral Round | 30-45 min | STAR method questions |
| Hiring Manager | 30 min | Team fit & career goals |

### Mental Preparation Tips
1. **Practice under time pressure** — Use a timer during mock sessions
2. **Think out loud** — Interviewers want to hear your reasoning
3. **It's okay to ask questions** — Clarifying shows maturity
4. **Start with brute force** — Then optimize step by step
5. **Handle mistakes gracefully** — Everyone makes them; recovery matters

### Common Mistakes to Avoid
- Jumping into code without understanding the problem
- Not considering edge cases (empty input, single element, negatives)
- Ignoring time/space complexity discussion
- Over-engineering the solution
- Not testing your code with examples`,

  "Mastering Technical Interviews-2": `## Big O Notation & Complexity Analysis

### What is Big O?
Big O notation describes the upper bound of an algorithm's growth rate. It tells us how the runtime or space usage scales as the input grows.

### Common Complexities (Best to Worst)

| Notation | Name | Example | 1K items | 1M items |
|----------|------|---------|----------|----------|
| O(1) | Constant | Array access | 1 op | 1 op |
| O(log n) | Logarithmic | Binary search | 10 ops | 20 ops |
| O(n) | Linear | Single loop | 1K ops | 1M ops |
| O(n log n) | Linearithmic | Merge sort | 10K ops | 20M ops |
| O(n²) | Quadratic | Nested loops | 1M ops | 1T ops |
| O(2^n) | Exponential | Recursive fib | ∞ | ∞ |

### Rules for Calculating Big O
1. **Drop constants**: O(2n) → O(n)
2. **Drop lower-order terms**: O(n² + n) → O(n²)
3. **Different inputs = different variables**: O(a + b), not O(n)
4. **Multiply nested operations**: Loop inside loop → O(n × m)

### Space Complexity
- **In-place algorithms**: O(1) extra space (e.g., swapping)
- **Auxiliary arrays**: O(n) space
- **Recursive call stack**: O(depth) space
- **Hash maps**: O(n) space for n entries

### Practice Problems
1. What is the complexity of finding max in an unsorted array? → O(n)
2. What is the complexity of checking if an array is sorted? → O(n)
3. What is the complexity of generating all pairs? → O(n²)`,

  "Mastering Technical Interviews-3": `## Arrays & Strings Deep Dive

### Two Pointers Technique
Use when the array is sorted or you need to find pairs.

**Pattern:**
- Initialize two pointers (start & end, or slow & fast)
- Move them toward each other based on a condition
- Common use: Two Sum in sorted array, removing duplicates

**Example — Two Sum (Sorted Array):**
\`\`\`
left = 0, right = length - 1
while left < right:
    sum = arr[left] + arr[right]
    if sum == target: return [left, right]
    if sum < target: left++
    else: right--
\`\`\`

### Sliding Window Technique
Use for subarray/substring problems with a constraint.

**Pattern:**
- Maintain a window [left, right]
- Expand right to include more elements
- Shrink left when the constraint is violated

**Use cases:**
- Maximum sum subarray of size k
- Longest substring without repeating characters
- Minimum window substring

### Hash Map for O(1) Lookups
- **Frequency counting**: Count occurrences of each element
- **Two Sum (unsorted)**: Store complement → index mapping
- **Anagram detection**: Compare character frequency maps

### Edge Cases to Always Consider
- Empty array or string
- Single element
- All elements the same
- Already sorted / reverse sorted
- Negative numbers
- Integer overflow`,

  "Mastering Technical Interviews-4": `## Linked Lists & Two Pointers

### Linked List Basics
A linked list is a linear data structure where each node points to the next.

**Types:**
- Singly Linked List: Each node → next
- Doubly Linked List: Each node → next & prev
- Circular: Last node → first node

### Floyd's Cycle Detection (Tortoise & Hare)
**Problem:** Detect if a linked list has a cycle.
**Approach:**
- Slow pointer moves 1 step at a time
- Fast pointer moves 2 steps at a time
- If they meet → cycle exists
- If fast reaches null → no cycle

### Reversing a Linked List
**Iterative approach:**
\`\`\`
prev = null, current = head
while current:
    next = current.next
    current.next = prev
    prev = current
    current = next
return prev
\`\`\`

### Finding the Middle Element
Use slow/fast pointers:
- Slow moves 1 step, fast moves 2 steps
- When fast reaches end, slow is at middle

### Common Interview Problems
1. Reverse a linked list (iterative & recursive)
2. Detect and find the start of a cycle
3. Merge two sorted linked lists
4. Remove Nth node from end
5. Check if a linked list is a palindrome
6. Find the intersection of two linked lists`,

  "Mastering Technical Interviews-5": `## Trees & Graph Traversal

### Tree Terminology
- **Root**: Top node with no parent
- **Leaf**: Node with no children
- **Height**: Longest path from root to leaf
- **Depth**: Distance from root to a node
- **Binary Tree**: Each node has at most 2 children
- **BST**: Left < Parent < Right

### BFS (Breadth-First Search)
**Uses a queue.** Explores level by level.
\`\`\`
queue = [root]
while queue:
    node = queue.pop(0)
    process(node)
    if node.left: queue.append(node.left)
    if node.right: queue.append(node.right)
\`\`\`
**Use for:** Shortest path, level-order traversal

### DFS (Depth-First Search)
**Uses a stack (or recursion).** Goes deep first.
- **Pre-order**: Root → Left → Right
- **In-order**: Left → Root → Right (gives sorted order for BST)
- **Post-order**: Left → Right → Root

### Graph Representations
| Method | Space | Edge lookup | Add edge |
|--------|-------|-------------|----------|
| Adjacency Matrix | O(V²) | O(1) | O(1) |
| Adjacency List | O(V+E) | O(degree) | O(1) |

### Key Problems
1. Maximum depth of a binary tree → DFS
2. Level order traversal → BFS
3. Validate BST → In-order check
4. Lowest Common Ancestor → DFS
5. Number of islands → BFS/DFS on grid
6. Course schedule → Topological sort`,

  "Mastering Technical Interviews-6": `## Dynamic Programming Essentials

### What is Dynamic Programming?
DP solves complex problems by breaking them into overlapping subproblems, storing results to avoid recomputation.

### Two Key Properties
1. **Optimal Substructure**: Solution built from optimal sub-solutions
2. **Overlapping Subproblems**: Same subproblems solved repeatedly

### Two Approaches

| Approach | Direction | Method |
|----------|-----------|--------|
| Memoization | Top-down | Recursion + cache |
| Tabulation | Bottom-up | Iterative + table |

### Classic DP Problems

**1. Fibonacci Numbers**
- Naive recursion: O(2^n)
- With DP: O(n) time, O(n) or O(1) space

**2. Climbing Stairs**
- ways(n) = ways(n-1) + ways(n-2)

**3. 0/1 Knapsack**
- dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])

**4. Longest Common Subsequence**
- If chars match: dp[i][j] = dp[i-1][j-1] + 1
- If not: dp[i][j] = max(dp[i-1][j], dp[i][j-1])

**5. Coin Change**
- dp[amount] = min(dp[amount], dp[amount - coin] + 1)

### Steps to Solve DP Problems
1. Identify if the problem has optimal substructure
2. Define the state (what variables change?)
3. Write the recurrence relation
4. Decide: memoization or tabulation?
5. Handle base cases
6. Optimize space if possible`,

  "Mastering Technical Interviews-7": `## Mock Interview Practice Guide

### Before the Interview
- [ ] Test your setup (camera, mic, screen share)
- [ ] Have a whiteboard or notepad ready
- [ ] Keep water nearby
- [ ] Close unnecessary tabs/apps
- [ ] Review your top 5 algorithm patterns

### During the Interview
1. **Listen carefully** — Don't interrupt the problem statement
2. **Repeat the problem** — Confirm understanding
3. **Ask clarifying questions** — Input type, constraints, edge cases
4. **Think out loud** — Share your reasoning process
5. **Start with brute force** — Then optimize
6. **Write clean code** — Use meaningful variable names
7. **Test with examples** — Walk through your solution
8. **Discuss complexity** — Time and space

### Time Management (45-min interview)
| Phase | Time | Activity |
|-------|------|----------|
| Understand | 5 min | Read, clarify, examples |
| Plan | 5 min | Discuss approach |
| Code | 20 min | Implement solution |
| Test | 10 min | Debug & edge cases |
| Optimize | 5 min | Improve if possible |

### After the Interview
- Write down the problems you were asked
- Note areas where you struggled
- Practice similar problems
- Review your communication approach

### Self-Assessment Checklist
- [ ] Did I clarify the problem before coding?
- [ ] Did I discuss my approach before implementing?
- [ ] Did I consider edge cases?
- [ ] Was my code clean and readable?
- [ ] Did I test my solution?
- [ ] Did I discuss time/space complexity?`,

  // ==========================================
  // BEHAVIORAL INTERVIEW EXCELLENCE
  // ==========================================
  "Behavioral Interview Excellence-1": `## Understanding Behavioral Interviews

### Why Behavioral Interviews Matter
- Past behavior is the strongest predictor of future performance
- They assess soft skills that technical interviews miss
- 65% of hiring decisions are influenced by behavioral rounds

### What Interviewers Evaluate
| Competency | What They Look For |
|-----------|-------------------|
| Leadership | Driving results, influencing others |
| Ownership | Taking responsibility, initiative |
| Collaboration | Teamwork, conflict resolution |
| Problem-Solving | Analytical thinking, creativity |
| Adaptability | Handling change and ambiguity |
| Communication | Clarity, empathy, listening |

### Preparing Your Mindset
1. Think of yourself as a **storyteller**
2. Every answer should have a clear **beginning, middle, and end**
3. Focus on **YOUR** contributions, not just the team's
4. Be **authentic** — fabricated stories fall apart under follow-ups
5. Show **growth** — what did you learn?`,

  "Behavioral Interview Excellence-2": `## The STAR Method Framework

### Breaking Down STAR

**S — Situation (15% of your answer)**
Set the scene with relevant context:
- When and where did this happen?
- What was the business context?
- Keep it brief (2-3 sentences)

**T — Task (10% of your answer)**
Define your specific responsibility:
- What was YOUR role?
- What was expected of you?
- What was at stake?

**A — Action (60% of your answer)**
Detail what YOU did:
- Use "I" statements, not "we"
- Be specific about steps you took
- Explain your reasoning and decisions
- This is the MOST important part

**R — Result (15% of your answer)**
Share the outcome:
- Quantify impact (%, $, time saved)
- Include lessons learned
- Connect to the role you're applying for

### Example STAR Response Template
"In [situation/context], I was responsible for [task]. I decided to [action 1], then [action 2], because [reasoning]. As a result, [quantified outcome]. This taught me [lesson learned]."

### Common Mistakes
❌ Being too vague — "I helped the team improve"
✅ Being specific — "I reduced deploy time from 2 hours to 15 minutes"

❌ Taking all the credit — "I single-handedly saved the project"
✅ Showing collaboration — "I led the initiative and coordinated with 3 teams"`,

  "Behavioral Interview Excellence-3": `## Crafting Leadership Stories

### Leadership Without a Title
You don't need to be a manager to demonstrate leadership:
- **Initiative**: Identifying and solving problems proactively
- **Influence**: Convincing others through data and empathy
- **Mentoring**: Helping teammates grow their skills
- **Ownership**: Taking on responsibility beyond your role

### Story Mining Exercise
Think about times when you:
1. Proposed a new idea or process improvement
2. Mentored a junior colleague
3. Led a project or workstream
4. Stepped up during a crisis
5. Made a difficult decision
6. Rallied the team around a common goal

### Leadership Story Structure
1. **Context**: What was the challenge or opportunity?
2. **Your decision**: Why did you step up?
3. **Actions**: How did you lead?
4. **Impact**: What changed because of your leadership?
5. **Learning**: What did this teach you about leadership?

### Quantifying Leadership Impact
- "Led a team of 5 to deliver the project 2 weeks early"
- "Introduced code reviews, reducing bugs by 40%"
- "Mentored 3 interns, 2 received full-time offers"
- "Organized weekly knowledge-sharing sessions attended by 20+ engineers"`,

  "Behavioral Interview Excellence-4": `## Demonstrating Teamwork

### What Interviewers Want to See
- You can collaborate effectively across teams
- You handle disagreements professionally
- You give credit where it's due
- You adapt your communication style

### Conflict Resolution Framework
1. **Acknowledge** the other person's perspective
2. **Seek to understand** before being understood
3. **Find common ground** — shared goals
4. **Propose solutions** collaboratively
5. **Follow up** to ensure resolution sticks

### Sample Teamwork Scenarios
| Scenario | Key Skill Demonstrated |
|----------|----------------------|
| Disagreed with a teammate's approach | Respectful communication |
| Worked with a difficult colleague | Emotional intelligence |
| Cross-functional project | Stakeholder management |
| Helped a struggling teammate | Empathy & mentoring |
| Team missed a deadline | Accountability & recovery |

### Power Phrases for Teamwork Answers
- "I made sure to understand their perspective first..."
- "We aligned on the shared goal of..."
- "I facilitated a discussion where everyone could contribute..."
- "I recognized their expertise in X and leveraged it..."`,

  "Behavioral Interview Excellence-5": `## Handling Failure Questions

### Why Failure Questions Matter
- They test self-awareness and humility
- They reveal your growth mindset
- They show how you handle adversity

### Framework for Failure Stories
1. **Own it**: Take responsibility, don't blame others
2. **Explain the context**: What made it challenging?
3. **Describe the failure**: What specifically went wrong?
4. **Share the learning**: What did you take away?
5. **Show the change**: How have you applied this lesson since?

### Red Flags to Avoid
❌ "I can't think of any failures" — Shows lack of self-awareness
❌ "It was my teammate's fault" — Shows inability to take responsibility
❌ "I worked too hard" — Disguised humble-brag; interviewers see through it

### Good Failure Examples
- Underestimated project complexity → Now I pad estimates by 30%
- Didn't communicate a risk early enough → Now I flag risks at first sign
- Built a feature without user research → Now I validate assumptions first
- Took on too much at once → Now I prioritize ruthlessly

### Recovery Narrative Template
"In [situation], I made the mistake of [failure]. This resulted in [consequence]. I learned that [lesson], and since then I've [specific change]. For example, [recent application of the lesson]."`,

  "Behavioral Interview Excellence-6": `## Cultural Fit & Motivation

### Researching Company Culture
1. Read the company's values/leadership principles
2. Check Glassdoor reviews for real employee experiences
3. Look at their engineering blog and open-source contributions
4. Review recent press releases and product launches
5. Connect with current employees on LinkedIn

### Aligning Your Values
| Company Value | How to Demonstrate |
|--------------|-------------------|
| Innovation | Share a time you tried something new |
| Customer Focus | Describe how you prioritized user needs |
| Ownership | Tell about going above and beyond |
| Collaboration | Show cross-team partnership |
| Learning | Discuss your growth journey |

### "Why This Company?" Framework
1. **Mission**: Connect their mission to your personal purpose
2. **Product**: Show genuine interest in what they build
3. **Growth**: Explain how this role fits your career trajectory
4. **Culture**: Reference specific values that resonate with you

### Questions to Ask the Interviewer
- "What does success look like in the first 90 days?"
- "How does the team celebrate wins?"
- "What's the biggest challenge the team is facing?"
- "How do you support professional development?"
- "What's your favorite part about working here?"`,

  "Behavioral Interview Excellence-7": `## Practice: Tell Me About Yourself

### The 2-Minute Pitch Framework

**Opening (20 sec)**: Professional identity
"I'm a [role] with [X years] of experience in [domain]..."

**Body (60 sec)**: Key achievements & journey
- 2-3 career highlights with numbers
- What drives you professionally
- Your unique value proposition

**Bridge (20 sec)**: Why this role
"I'm excited about [company] because [specific reason]..."

**Close (20 sec)**: Forward-looking
"I'm looking to [goal] and I believe [company] is the perfect place to do that."

### Do's and Don'ts

| ✅ Do | ❌ Don't |
|------|---------|
| Tailor to the role | Give your life story |
| Quantify achievements | Be vague about impact |
| Show enthusiasm | Sound rehearsed |
| Be concise (2 min) | Ramble for 5+ minutes |
| End with a hook | End abruptly |

### Practice Exercise
1. Write out your pitch
2. Time yourself (aim for 90-120 seconds)
3. Record yourself and watch it back
4. Get feedback from a friend
5. Refine and practice until it flows naturally`,

  // ==========================================
  // SYSTEM DESIGN FUNDAMENTALS
  // ==========================================
  "System Design Fundamentals-1": `## Introduction to System Design

### What is a System Design Interview?
You're asked to design a large-scale system (e.g., Twitter, URL shortener). It evaluates:
- Your ability to handle ambiguity
- Knowledge of distributed systems
- Trade-off analysis skills
- Communication and structured thinking

### The 4-Step Framework
| Step | Time | Activity |
|------|------|----------|
| 1. Requirements | 5 min | Clarify functional & non-functional requirements |
| 2. High-Level Design | 10 min | Draw the architecture diagram |
| 3. Deep Dive | 15 min | Detail critical components |
| 4. Wrap Up | 5 min | Address bottlenecks & trade-offs |

### Key Questions to Ask
- Who are the users? How many?
- What are the core features?
- What's more important: consistency or availability?
- What's the read-to-write ratio?
- Do we need real-time updates?

### Non-Functional Requirements
- **Scalability**: Handle growth (users, data, traffic)
- **Availability**: 99.9% uptime = ~8.7 hours downtime/year
- **Latency**: Response time targets (p50, p99)
- **Durability**: Data must not be lost
- **Security**: Authentication, encryption, access control`,

  "System Design Fundamentals-2": `## Scalability Principles

### Vertical vs Horizontal Scaling
| Aspect | Vertical (Scale Up) | Horizontal (Scale Out) |
|--------|-------------------|----------------------|
| Method | Bigger machine | More machines |
| Cost | Expensive hardware | Commodity hardware |
| Limit | Physical ceiling | Virtually unlimited |
| Complexity | Simple | Requires distribution |
| Downtime | Yes (to upgrade) | No (rolling updates) |

### Horizontal Scaling Strategies
1. **Stateless services**: No local state → easy to add instances
2. **Load balancing**: Distribute traffic across servers
3. **Database sharding**: Split data across databases
4. **Caching**: Reduce load on the database
5. **CDN**: Serve static content from edge locations

### Capacity Estimation (Back-of-Envelope)
Quick math for system design:
- 1 day = 86,400 seconds ≈ 100K seconds
- 1 million requests/day ≈ 12 requests/second
- 1 billion requests/day ≈ 12,000 requests/second

### Handling Traffic Spikes
- **Auto-scaling**: Automatically add/remove servers
- **Queue-based processing**: Buffer requests with message queues
- **Rate limiting**: Protect services from overload
- **Circuit breakers**: Fail fast to prevent cascading failures`,

  "System Design Fundamentals-3": `## Database Design & Selection

### SQL vs NoSQL Decision Matrix
| Factor | Choose SQL | Choose NoSQL |
|--------|-----------|-------------|
| Schema | Fixed, well-defined | Flexible, evolving |
| Relationships | Complex joins needed | Minimal relationships |
| Consistency | Strong consistency | Eventual consistency OK |
| Scale | Moderate scale | Massive scale |
| Examples | PostgreSQL, MySQL | MongoDB, Cassandra, DynamoDB |

### Database Indexing
- Indexes speed up reads but slow down writes
- B-Tree index: Good for range queries
- Hash index: Good for equality lookups
- Composite index: Multiple columns

### Data Modeling Best Practices
1. **Normalize** for write-heavy workloads (avoid duplication)
2. **Denormalize** for read-heavy workloads (avoid joins)
3. **Use appropriate data types** (don't store numbers as strings)
4. **Add indexes on query columns** (WHERE, JOIN, ORDER BY)
5. **Partition large tables** by time, geography, or hash

### CAP Theorem
You can only guarantee 2 of 3:
- **Consistency**: Every read gets the most recent write
- **Availability**: Every request gets a response
- **Partition Tolerance**: System works despite network splits

In practice, P is always needed → choose between CP and AP.`,

  "System Design Fundamentals-4": `## Caching Strategies

### Why Cache?
- Reduce database load
- Decrease response latency
- Improve user experience
- Save infrastructure costs

### Cache Placement
| Layer | Tool | Use Case |
|-------|------|----------|
| Client-side | Browser cache | Static assets |
| CDN | CloudFront, Akamai | Media files |
| Application | Redis, Memcached | Session data, API responses |
| Database | Query cache | Repeated queries |

### Cache Strategies
1. **Cache-Aside (Lazy Loading)**
   - App checks cache first → if miss, read from DB → write to cache
   - Pros: Only requested data is cached
   - Cons: Cache miss = 3 round trips

2. **Write-Through**
   - Write to cache and DB simultaneously
   - Pros: Cache always up-to-date
   - Cons: Higher write latency

3. **Write-Behind (Write-Back)**
   - Write to cache only → async write to DB
   - Pros: Fast writes
   - Cons: Risk of data loss

### Cache Invalidation
The hardest problem in caching!
- **TTL (Time-To-Live)**: Auto-expire after X seconds
- **Event-driven**: Invalidate on data change
- **Version-based**: Include version in cache key`,

  "System Design Fundamentals-5": `## Load Balancing & CDNs

### Load Balancing Algorithms
| Algorithm | Description | Best For |
|-----------|------------|----------|
| Round Robin | Rotate through servers | Equal-capacity servers |
| Weighted Round Robin | Proportional distribution | Mixed-capacity servers |
| Least Connections | Send to least busy server | Varying request durations |
| IP Hash | Same client → same server | Session persistence |
| Random | Random server selection | Stateless services |

### Load Balancer Types
- **Layer 4 (Transport)**: Routes based on IP/port, faster
- **Layer 7 (Application)**: Routes based on content, smarter

### CDN (Content Delivery Network)
Distributes static content to edge servers worldwide.

**Benefits:**
- Reduced latency (content served from nearest edge)
- Reduced origin server load
- DDoS protection
- Automatic failover

**What to Put on a CDN:**
- Images, videos, CSS, JavaScript
- Static HTML pages
- Fonts and icons
- API responses (with proper cache headers)

### Session Persistence
- **Sticky sessions**: Route same user to same server
- **Shared session store**: Redis/Memcached for session data
- **JWT tokens**: Stateless authentication (recommended)`,

  "System Design Fundamentals-6": `## Designing a URL Shortener

### Requirements
**Functional:**
- Given a long URL, generate a short URL
- Redirect short URL to original URL
- Custom aliases (optional)
- Analytics (click count, geography)

**Non-Functional:**
- 100M URLs created per month
- 10:1 read-to-write ratio
- Low latency redirects (< 100ms)
- High availability (99.9%)

### High-Level Design
\`\`\`
Client → Load Balancer → API Servers → Database
                                    → Cache (Redis)
\`\`\`

### URL Shortening Approaches
1. **Base62 encoding**: Convert auto-increment ID to base62
   - 6 chars = 62^6 = 56.8 billion unique URLs
2. **MD5/SHA256 hash**: Hash the URL, take first 6-7 chars
   - Need collision handling
3. **Pre-generated keys**: Generate keys in advance
   - No collision, but need key management

### Database Schema
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Auto-increment primary key |
| short_url | VARCHAR(7) | Generated short code |
| long_url | TEXT | Original URL |
| created_at | TIMESTAMP | Creation time |
| expires_at | TIMESTAMP | Expiration (optional) |
| click_count | INT | Analytics |

### Optimizations
- Cache popular URLs in Redis
- Use database read replicas
- Shard by short_url hash
- Rate limit creation API`,

  "System Design Fundamentals-7": `## Designing Twitter/Instagram

### Requirements Gathering
**Functional:**
- Post tweets/photos (with text, images, videos)
- Follow/unfollow users
- News feed (timeline)
- Like, comment, retweet
- Search

**Non-Functional:**
- 500M daily active users
- 100K tweets per second
- Feed loads in < 500ms
- Eventually consistent (slight delay OK)

### High-Level Architecture
\`\`\`
Clients → CDN → Load Balancer → API Gateway
    → Tweet Service → Tweet DB
    → User Service → User DB
    → Feed Service → Feed Cache
    → Media Service → Object Storage (S3)
    → Notification Service → Push/Email
    → Search Service → Elasticsearch
\`\`\`

### Feed Generation Approaches
| Approach | Pros | Cons |
|----------|------|------|
| Fan-out on Write | Fast reads | Slow writes for celebrities |
| Fan-out on Read | Fast writes | Slow reads |
| Hybrid | Best of both | Complex implementation |

### Media Storage
- Store images/videos in object storage (S3)
- Use CDN for delivery
- Generate thumbnails asynchronously
- Compress and optimize for different devices

### Key Design Decisions
1. **Feed ranking**: Chronological vs algorithmic
2. **Celebrity handling**: Separate pipeline for high-follower accounts
3. **Real-time updates**: WebSocket for live notifications
4. **Data partitioning**: Shard by user_id`,

  // ==========================================
  // COMMUNICATION SKILLS FOR DEVELOPERS
  // ==========================================
  "Communication Skills for Developers-1": `## Why Communication Matters

### The Impact on Your Career
- Engineers who communicate well get promoted 2x faster
- Clear communication reduces bugs and misunderstandings
- Remote work makes written communication even more critical

### Communication in Tech Contexts
| Context | Key Skill |
|---------|----------|
| Code reviews | Constructive feedback |
| Stand-ups | Concise updates |
| Design docs | Written clarity |
| Presentations | Storytelling |
| 1:1 meetings | Active listening |
| Interviews | Structured thinking |

### Common Pitfalls
1. Using too much jargon with non-technical stakeholders
2. Not adjusting complexity for your audience
3. Skipping the "why" and jumping to the "how"
4. Not asking for feedback on your communication
5. Sending long messages when a quick call would be better

### Self-Assessment
Ask yourself:
- Can I explain my current project to a non-engineer?
- Do I actively seek feedback on my communication?
- Do I adapt my style for different audiences?
- Do I listen to understand, or listen to reply?`,

  "Communication Skills for Developers-2": `## Explaining Technical Concepts

### The Feynman Technique
1. Choose a concept
2. Explain it as if teaching a 12-year-old
3. Identify gaps in your explanation
4. Simplify and use analogies

### Analogy Framework
**Technical Concept → Everyday Analogy:**
- API → Restaurant waiter (takes your order, brings food)
- Cache → Bookmark (quick access to frequently visited pages)
- Database index → Book index (find content without reading every page)
- Load balancer → Airport check-in desks (distribute passengers)
- Microservices → Lego blocks (independent, combinable pieces)

### Adjusting for Your Audience
| Audience | Focus On | Avoid |
|----------|---------|-------|
| Executives | Business impact, ROI | Implementation details |
| Product managers | User experience, timelines | Code-level decisions |
| Other engineers | Architecture, trade-offs | Over-explaining basics |
| Non-tech stakeholders | Analogies, visuals | All jargon |

### Tips for Clear Explanations
1. Start with the "why" before the "what"
2. Use visuals (diagrams, flowcharts)
3. Check for understanding: "Does that make sense?"
4. Build from familiar → unfamiliar
5. Keep sentences short and direct`,

  "Communication Skills for Developers-3": `## Active Listening Techniques

### What is Active Listening?
Fully concentrating on what's being said rather than passively hearing.

### The HEAR Framework
- **H**alt — Stop what you're doing, give full attention
- **E**mpathize — Try to understand their perspective
- **A**sk — Clarify with thoughtful questions
- **R**eview — Summarize what you heard

### Techniques for Better Listening
1. **Paraphrase**: "So what you're saying is..."
2. **Ask clarifying questions**: "Can you elaborate on...?"
3. **Acknowledge emotions**: "I can see this is frustrating..."
4. **Don't interrupt**: Wait 2 seconds after they finish
5. **Take notes**: Shows you value their input

### In Interview Context
- Listen to the FULL question before thinking about your answer
- Repeat the question back to confirm understanding
- Ask "Is there a specific aspect you'd like me to focus on?"
- Don't rush — thoughtful pauses show confidence

### Common Listening Mistakes
❌ Thinking about your response while they're talking
❌ Interrupting to share your own experience
❌ Assuming you know what they'll say
❌ Checking your phone or looking away
❌ Dismissing ideas before fully understanding them`,

  "Communication Skills for Developers-4": `## Body Language & Confidence

### Non-Verbal Communication in Interviews
Studies show 55% of communication is body language, 38% is tone, and only 7% is words.

### Confident Body Language Checklist
✅ Sit upright with shoulders back
✅ Maintain natural eye contact (70% of the time)
✅ Use open gestures (don't cross arms)
✅ Nod to show engagement
✅ Smile genuinely when appropriate
✅ Use purposeful hand gestures

### Virtual Interview Tips
| Element | Best Practice |
|---------|-------------|
| Camera | Eye level, centered |
| Lighting | In front of you, not behind |
| Background | Clean, professional |
| Eye contact | Look at camera, not screen |
| Posture | Sit up straight, lean slightly forward |
| Hands | Visible, use for emphasis |

### Managing Nervousness
1. **Power posing**: 2 minutes before the interview
2. **Box breathing**: 4 seconds in, hold, out, hold
3. **Preparation**: Confidence comes from practice
4. **Reframe anxiety**: "I'm excited" vs "I'm nervous"
5. **Slow down**: Speak 10% slower than you think you should

### Common Nervous Habits to Avoid
- Fidgeting with pen, hair, or clothes
- Excessive "um," "like," "you know"
- Speaking too fast
- Avoiding eye contact
- Crossed arms or hunched posture`,

  "Communication Skills for Developers-5": `## Handling Difficult Questions

### When You Don't Know the Answer
1. **Acknowledge honestly**: "I'm not familiar with that specific technology"
2. **Show your approach**: "Here's how I would figure it out..."
3. **Connect to what you know**: "While I haven't used X, I've used Y which is similar..."
4. **Be curious**: "That's interesting — can you tell me more about how you use it?"

### Strategies for Curveball Questions
- Take a moment to think (silence is OK!)
- Ask for clarification if the question is ambiguous
- Break complex questions into parts
- Think out loud to show your reasoning process

### "What's Your Biggest Weakness?" Framework
1. Choose a REAL weakness (not "I work too hard")
2. Show self-awareness
3. Describe what you're doing to improve
4. Give evidence of progress

**Example:**
"I used to struggle with estimating project timelines. I would be overly optimistic. I've since started breaking tasks into smaller chunks and adding a 30% buffer. My last three projects were delivered on time."

### Handling Salary Questions
- Research market rates beforehand (Levels.fyi, Glassdoor)
- Deflect early: "I'd like to learn more about the role first"
- Give a range, not a single number
- Consider total compensation (base + equity + benefits)`,

  "Communication Skills for Developers-6": `## Virtual Interview Best Practices

### Technical Setup Checklist
- [ ] Stable internet connection (use ethernet if possible)
- [ ] Test camera and microphone 30 minutes before
- [ ] Close unnecessary applications
- [ ] Have a backup device ready
- [ ] Share your phone number in case of technical issues

### Environment Setup
- [ ] Clean, professional background
- [ ] Good front-facing lighting
- [ ] Quiet room with door closed
- [ ] "Do Not Disturb" mode on all devices
- [ ] Glass of water nearby

### During the Interview
1. Look at the camera when speaking (not the screen)
2. Use a headset for better audio quality
3. Have notes/resume on a second screen or printed
4. Keep facial expressions engaged and warm
5. Mute when not speaking (if in group)

### Screen Sharing Best Practices
- Close personal tabs and notifications
- Increase font size in your IDE
- Use a clean desktop
- Narrate what you're doing as you code
- Test screen sharing before the interview

### Handling Technical Issues
- "I seem to be having a connection issue. Can you hear me now?"
- "Let me try reconnecting. I'll be right back."
- Stay calm — interviewers understand tech problems
- Always have a backup plan (phone call, different platform)`,
};
