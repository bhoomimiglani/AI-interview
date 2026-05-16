import Question from '../models/Question.model';

const questions = [
  // ── DSA ──────────────────────────────────────────────────────────────────
  {
    text: "What is the time complexity of binary search?",
    type: "dsa", difficulty: "easy", category: "Searching",
    tags: ["binary search", "complexity"],
    options: [
      { text: "O(n)", isCorrect: false },
      { text: "O(log n)", isCorrect: true },
      { text: "O(n²)", isCorrect: false },
      { text: "O(1)", isCorrect: false },
    ],
    explanation: "Binary search divides the search space in half each step, giving O(log n) time complexity. It requires a sorted array.",
    timeLimit: 30,
  },
  {
    text: "Which data structure uses LIFO (Last In, First Out) order?",
    type: "dsa", difficulty: "easy", category: "Data Structures",
    tags: ["stack", "LIFO"],
    options: [
      { text: "Queue", isCorrect: false },
      { text: "Stack", isCorrect: true },
      { text: "Linked List", isCorrect: false },
      { text: "Heap", isCorrect: false },
    ],
    explanation: "A Stack follows LIFO — the last element pushed is the first one popped. A Queue follows FIFO (First In, First Out).",
    timeLimit: 30,
  },
  {
    text: "What is the worst-case time complexity of QuickSort?",
    type: "dsa", difficulty: "medium", category: "Sorting",
    tags: ["quicksort", "complexity"],
    options: [
      { text: "O(n log n)", isCorrect: false },
      { text: "O(n)", isCorrect: false },
      { text: "O(n²)", isCorrect: true },
      { text: "O(log n)", isCorrect: false },
    ],
    explanation: "QuickSort's worst case is O(n²) when the pivot is always the smallest or largest element (e.g., already sorted array with bad pivot choice). Average case is O(n log n).",
    timeLimit: 30,
  },
  {
    text: "Which of the following is NOT a self-balancing binary search tree?",
    type: "dsa", difficulty: "medium", category: "Trees",
    tags: ["BST", "trees"],
    options: [
      { text: "AVL Tree", isCorrect: false },
      { text: "Red-Black Tree", isCorrect: false },
      { text: "Binary Heap", isCorrect: true },
      { text: "B-Tree", isCorrect: false },
    ],
    explanation: "A Binary Heap is a complete binary tree used for priority queues, but it is NOT a self-balancing BST. AVL, Red-Black, and B-Trees are all self-balancing BSTs.",
    timeLimit: 30,
  },
  {
    text: "What does BFS use internally to traverse a graph?",
    type: "dsa", difficulty: "easy", category: "Graphs",
    tags: ["BFS", "graph traversal"],
    options: [
      { text: "Stack", isCorrect: false },
      { text: "Queue", isCorrect: true },
      { text: "Priority Queue", isCorrect: false },
      { text: "Recursion", isCorrect: false },
    ],
    explanation: "BFS (Breadth-First Search) uses a Queue to explore nodes level by level. DFS uses a Stack (or recursion).",
    timeLimit: 30,
  },
  {
    text: "What is the space complexity of merge sort?",
    type: "dsa", difficulty: "medium", category: "Sorting",
    tags: ["merge sort", "space complexity"],
    options: [
      { text: "O(1)", isCorrect: false },
      { text: "O(log n)", isCorrect: false },
      { text: "O(n)", isCorrect: true },
      { text: "O(n log n)", isCorrect: false },
    ],
    explanation: "Merge sort requires O(n) extra space for the temporary arrays used during merging. This is its main disadvantage compared to in-place sorting algorithms.",
    timeLimit: 30,
  },
  {
    text: "In a hash table, what is a collision?",
    type: "dsa", difficulty: "easy", category: "Hash Tables",
    tags: ["hash table", "collision"],
    options: [
      { text: "When the table is full", isCorrect: false },
      { text: "When two keys hash to the same index", isCorrect: true },
      { text: "When a key is not found", isCorrect: false },
      { text: "When the hash function returns null", isCorrect: false },
    ],
    explanation: "A collision occurs when two different keys produce the same hash index. It is handled using chaining (linked lists) or open addressing (probing).",
    timeLimit: 30,
  },

  // ── Technical ─────────────────────────────────────────────────────────────
  {
    text: "What does REST stand for?",
    type: "technical", difficulty: "easy", category: "API Design",
    tags: ["REST", "API"],
    options: [
      { text: "Remote Execution State Transfer", isCorrect: false },
      { text: "Representational State Transfer", isCorrect: true },
      { text: "Reliable Endpoint Service Technology", isCorrect: false },
      { text: "Request-Response State Transfer", isCorrect: false },
    ],
    explanation: "REST stands for Representational State Transfer. It is an architectural style for designing networked applications using stateless HTTP requests.",
    timeLimit: 30,
  },
  {
    text: "Which HTTP method is idempotent but NOT safe?",
    type: "technical", difficulty: "medium", category: "API Design",
    tags: ["HTTP", "REST", "idempotent"],
    options: [
      { text: "GET", isCorrect: false },
      { text: "POST", isCorrect: false },
      { text: "PUT", isCorrect: true },
      { text: "PATCH", isCorrect: false },
    ],
    explanation: "PUT is idempotent (calling it multiple times gives the same result) but NOT safe (it modifies data). GET is both safe and idempotent. POST is neither.",
    timeLimit: 30,
  },
  {
    text: "What is the purpose of an index in a database?",
    type: "technical", difficulty: "easy", category: "Databases",
    tags: ["database", "indexing"],
    options: [
      { text: "To encrypt data", isCorrect: false },
      { text: "To speed up read queries", isCorrect: true },
      { text: "To enforce foreign key constraints", isCorrect: false },
      { text: "To compress table storage", isCorrect: false },
    ],
    explanation: "A database index speeds up read queries by creating a separate data structure (usually a B-tree) that allows faster lookups. The tradeoff is slower writes and extra storage.",
    timeLimit: 30,
  },
  {
    text: "What is the main difference between SQL and NoSQL databases?",
    type: "technical", difficulty: "easy", category: "Databases",
    tags: ["SQL", "NoSQL", "database"],
    options: [
      { text: "SQL is faster than NoSQL", isCorrect: false },
      { text: "SQL uses structured schemas; NoSQL is schema-flexible", isCorrect: true },
      { text: "NoSQL only stores numbers", isCorrect: false },
      { text: "SQL cannot handle large datasets", isCorrect: false },
    ],
    explanation: "SQL databases use fixed schemas and tables with relationships. NoSQL databases (like MongoDB) are schema-flexible and store data as documents, key-value pairs, or graphs.",
    timeLimit: 30,
  },
  {
    text: "What does CORS stand for and what does it prevent?",
    type: "technical", difficulty: "medium", category: "Web Security",
    tags: ["CORS", "security", "web"],
    options: [
      { text: "Cross-Origin Resource Sharing — prevents unauthorized cross-origin requests", isCorrect: true },
      { text: "Cross-Object Request System — prevents SQL injection", isCorrect: false },
      { text: "Client-Origin Response Security — prevents XSS attacks", isCorrect: false },
      { text: "Content-Origin Routing Service — prevents DDoS attacks", isCorrect: false },
    ],
    explanation: "CORS (Cross-Origin Resource Sharing) is a browser security mechanism that restricts web pages from making requests to a different domain than the one that served the page.",
    timeLimit: 30,
  },

  // ── System Design ─────────────────────────────────────────────────────────
  {
    text: "What is the primary purpose of a load balancer?",
    type: "system-design", difficulty: "easy", category: "System Design",
    tags: ["load balancer", "scalability"],
    options: [
      { text: "To store cached data", isCorrect: false },
      { text: "To distribute traffic across multiple servers", isCorrect: true },
      { text: "To encrypt network traffic", isCorrect: false },
      { text: "To compress database queries", isCorrect: false },
    ],
    explanation: "A load balancer distributes incoming network traffic across multiple servers to ensure no single server is overwhelmed, improving availability and reliability.",
    timeLimit: 30,
  },
  {
    text: "Which caching strategy writes data to cache and database simultaneously?",
    type: "system-design", difficulty: "medium", category: "Caching",
    tags: ["caching", "write-through", "system design"],
    options: [
      { text: "Cache-aside", isCorrect: false },
      { text: "Write-behind", isCorrect: false },
      { text: "Write-through", isCorrect: true },
      { text: "Read-through", isCorrect: false },
    ],
    explanation: "Write-through caching writes data to both the cache and the database at the same time, ensuring consistency. Write-behind (write-back) writes to cache first and database later.",
    timeLimit: 30,
  },
  {
    text: "What is the CAP theorem?",
    type: "system-design", difficulty: "hard", category: "Distributed Systems",
    tags: ["CAP theorem", "distributed systems"],
    options: [
      { text: "A system can have Consistency, Availability, and Partition tolerance all at once", isCorrect: false },
      { text: "A distributed system can only guarantee 2 of: Consistency, Availability, Partition tolerance", isCorrect: true },
      { text: "CAP stands for Cache, API, and Performance", isCorrect: false },
      { text: "A system must choose between speed and security", isCorrect: false },
    ],
    explanation: "The CAP theorem states that a distributed system can only guarantee two of three properties: Consistency (all nodes see the same data), Availability (every request gets a response), and Partition tolerance (system works despite network failures).",
    timeLimit: 30,
  },

  // ── Behavioral ────────────────────────────────────────────────────────────
  {
    text: "What does the STAR method stand for in behavioral interviews?",
    type: "behavioral", difficulty: "easy", category: "Interview Skills",
    tags: ["STAR", "behavioral", "interview"],
    options: [
      { text: "Skills, Tasks, Actions, Results", isCorrect: false },
      { text: "Situation, Task, Action, Result", isCorrect: true },
      { text: "Strategy, Thinking, Approach, Review", isCorrect: false },
      { text: "Scope, Timeline, Achievement, Reflection", isCorrect: false },
    ],
    explanation: "STAR stands for Situation, Task, Action, Result. It's a structured method for answering behavioral interview questions by describing a specific experience.",
    timeLimit: 30,
  },
  {
    text: "When asked 'What is your greatest weakness?', what is the best approach?",
    type: "behavioral", difficulty: "easy", category: "Interview Skills",
    tags: ["weakness", "behavioral", "interview"],
    options: [
      { text: "Say you have no weaknesses", isCorrect: false },
      { text: "Mention a real weakness and explain how you are improving it", isCorrect: true },
      { text: "Turn it into a strength (e.g., 'I work too hard')", isCorrect: false },
      { text: "Refuse to answer the question", isCorrect: false },
    ],
    explanation: "The best approach is to mention a genuine weakness while demonstrating self-awareness and showing concrete steps you are taking to improve. Interviewers see through fake answers like 'I work too hard'.",
    timeLimit: 30,
  },
  {
    text: "What is 'culture fit' in the context of job interviews?",
    type: "behavioral", difficulty: "medium", category: "Interview Skills",
    tags: ["culture fit", "behavioral"],
    options: [
      { text: "Whether you dress appropriately for the office", isCorrect: false },
      { text: "How well your values and work style align with the company's environment", isCorrect: true },
      { text: "Whether you have the technical skills for the role", isCorrect: false },
      { text: "Whether you live close to the office", isCorrect: false },
    ],
    explanation: "Culture fit refers to how well a candidate's values, behaviors, and work style align with the company's culture and team dynamics. It is assessed through behavioral questions and conversations.",
    timeLimit: 30,
  },
];

export const seedQuestions = async (): Promise<void> => {
  try {
    const count = await Question.countDocuments();
    if (count > 0) return;
    await Question.insertMany(questions);
    console.log(`✅ Seeded ${questions.length} MCQ questions`);
  } catch (error) {
    console.error('Error seeding questions:', error);
  }
};

// Extra questions appended for new topics — added via seedExtraQuestions()
export const extraQuestions = [
  // ── JavaScript ────────────────────────────────────────────────────────────
  {
    text: "What is the difference between `==` and `===` in JavaScript?",
    type: "javascript", difficulty: "easy", category: "JavaScript Basics",
    tags: ["javascript", "equality"],
    options: [
      { text: "They are identical", isCorrect: false },
      { text: "`==` checks value only; `===` checks value AND type", isCorrect: true },
      { text: "`===` checks value only; `==` checks value AND type", isCorrect: false },
      { text: "`==` is used for objects only", isCorrect: false },
    ],
    explanation: "`==` performs type coercion before comparing (e.g., `'5' == 5` is true). `===` (strict equality) checks both value and type without coercion (`'5' === 5` is false).",
    timeLimit: 30,
  },
  {
    text: "What does `typeof null` return in JavaScript?",
    type: "javascript", difficulty: "easy", category: "JavaScript Basics",
    tags: ["javascript", "typeof", "null"],
    options: [
      { text: "'null'", isCorrect: false },
      { text: "'undefined'", isCorrect: false },
      { text: "'object'", isCorrect: true },
      { text: "'boolean'", isCorrect: false },
    ],
    explanation: "`typeof null` returns `'object'` — this is a well-known JavaScript bug that has existed since the language's creation and was never fixed for backward compatibility.",
    timeLimit: 30,
  },
  {
    text: "What is a closure in JavaScript?",
    type: "javascript", difficulty: "medium", category: "JavaScript Advanced",
    tags: ["closure", "scope", "javascript"],
    options: [
      { text: "A function that runs immediately after being defined", isCorrect: false },
      { text: "A function that has access to its outer scope even after the outer function has returned", isCorrect: true },
      { text: "A way to close/terminate a function early", isCorrect: false },
      { text: "A method to prevent variable mutation", isCorrect: false },
    ],
    explanation: "A closure is a function that retains access to variables from its outer (enclosing) scope even after that outer function has finished executing. Closures are fundamental to JavaScript's module pattern and callbacks.",
    timeLimit: 30,
  },
  {
    text: "What is the event loop in JavaScript?",
    type: "javascript", difficulty: "medium", category: "JavaScript Advanced",
    tags: ["event loop", "async", "javascript"],
    options: [
      { text: "A loop that iterates over DOM events", isCorrect: false },
      { text: "A mechanism that handles asynchronous callbacks by monitoring the call stack and task queue", isCorrect: true },
      { text: "A built-in for...of loop for arrays", isCorrect: false },
      { text: "A way to repeat a function at intervals", isCorrect: false },
    ],
    explanation: "The event loop continuously checks if the call stack is empty. If it is, it picks the next task from the callback/task queue and pushes it onto the stack. This is how JavaScript handles async operations despite being single-threaded.",
    timeLimit: 30,
  },
  {
    text: "What is the difference between `let`, `const`, and `var`?",
    type: "javascript", difficulty: "easy", category: "JavaScript Basics",
    tags: ["let", "const", "var", "scope"],
    options: [
      { text: "They are all identical in modern JavaScript", isCorrect: false },
      { text: "`var` is function-scoped and hoisted; `let`/`const` are block-scoped; `const` cannot be reassigned", isCorrect: true },
      { text: "`const` variables can be reassigned but not redeclared", isCorrect: false },
      { text: "`let` is globally scoped", isCorrect: false },
    ],
    explanation: "`var` is function-scoped and hoisted (initialized as undefined). `let` and `const` are block-scoped and not initialized until declaration. `const` cannot be reassigned after declaration (but object properties can still be mutated).",
    timeLimit: 30,
  },

  // ── React ─────────────────────────────────────────────────────────────────
  {
    text: "What is the Virtual DOM in React?",
    type: "react", difficulty: "easy", category: "React Fundamentals",
    tags: ["virtual DOM", "react"],
    options: [
      { text: "A copy of the real DOM stored in a database", isCorrect: false },
      { text: "A lightweight in-memory representation of the real DOM used to optimize updates", isCorrect: true },
      { text: "A browser API for faster rendering", isCorrect: false },
      { text: "A CSS-in-JS solution", isCorrect: false },
    ],
    explanation: "React's Virtual DOM is a lightweight JavaScript object tree that mirrors the real DOM. When state changes, React diffs the new Virtual DOM against the previous one and only updates the changed parts in the real DOM (reconciliation).",
    timeLimit: 30,
  },
  {
    text: "What is the purpose of the `useEffect` hook?",
    type: "react", difficulty: "easy", category: "React Hooks",
    tags: ["useEffect", "hooks", "react"],
    options: [
      { text: "To manage component state", isCorrect: false },
      { text: "To perform side effects (data fetching, subscriptions, DOM manipulation) after render", isCorrect: true },
      { text: "To memoize expensive calculations", isCorrect: false },
      { text: "To create context providers", isCorrect: false },
    ],
    explanation: "`useEffect` runs after every render by default. You can control when it runs using the dependency array: empty `[]` runs once on mount, `[value]` runs when `value` changes, and no array runs after every render.",
    timeLimit: 30,
  },
  {
    text: "What is the difference between `useMemo` and `useCallback`?",
    type: "react", difficulty: "medium", category: "React Hooks",
    tags: ["useMemo", "useCallback", "performance"],
    options: [
      { text: "They are identical hooks", isCorrect: false },
      { text: "`useMemo` memoizes a computed value; `useCallback` memoizes a function reference", isCorrect: true },
      { text: "`useCallback` memoizes a value; `useMemo` memoizes a function", isCorrect: false },
      { text: "`useMemo` is for class components only", isCorrect: false },
    ],
    explanation: "`useMemo` caches the result of a computation and recomputes only when dependencies change. `useCallback` caches a function reference so it doesn't get recreated on every render — useful when passing callbacks to child components.",
    timeLimit: 30,
  },
  {
    text: "What triggers a re-render in a React functional component?",
    type: "react", difficulty: "medium", category: "React Fundamentals",
    tags: ["re-render", "state", "props"],
    options: [
      { text: "Only when the component is first mounted", isCorrect: false },
      { text: "When state changes, props change, or the parent re-renders", isCorrect: true },
      { text: "Only when `forceUpdate()` is called", isCorrect: false },
      { text: "Only when the URL changes", isCorrect: false },
    ],
    explanation: "A React functional component re-renders when: (1) its own state changes via `useState`, (2) its props change, or (3) its parent component re-renders. You can prevent unnecessary re-renders using `React.memo`, `useMemo`, and `useCallback`.",
    timeLimit: 30,
  },

  // ── Node.js ───────────────────────────────────────────────────────────────
  {
    text: "What is the Node.js event-driven, non-blocking I/O model?",
    type: "nodejs", difficulty: "easy", category: "Node.js Fundamentals",
    tags: ["nodejs", "event-driven", "non-blocking"],
    options: [
      { text: "Node.js uses multiple threads for each request", isCorrect: false },
      { text: "Node.js uses a single thread with an event loop to handle async I/O without blocking", isCorrect: true },
      { text: "Node.js blocks the thread while waiting for I/O", isCorrect: false },
      { text: "Node.js creates a new process for each request", isCorrect: false },
    ],
    explanation: "Node.js runs on a single thread and uses the event loop to handle I/O operations asynchronously. When an I/O operation completes, its callback is queued and executed when the call stack is free — this makes Node.js highly scalable for I/O-heavy applications.",
    timeLimit: 30,
  },
  {
    text: "What is middleware in Express.js?",
    type: "nodejs", difficulty: "easy", category: "Express.js",
    tags: ["middleware", "express", "nodejs"],
    options: [
      { text: "A database connection layer", isCorrect: false },
      { text: "Functions that execute during the request-response cycle with access to req, res, and next", isCorrect: true },
      { text: "A caching mechanism for API responses", isCorrect: false },
      { text: "A template engine for rendering HTML", isCorrect: false },
    ],
    explanation: "Middleware functions in Express have access to `req`, `res`, and `next`. They can execute code, modify request/response objects, end the cycle, or call `next()` to pass control to the next middleware. Common uses: authentication, logging, body parsing.",
    timeLimit: 30,
  },
  {
    text: "What is the difference between `process.nextTick()` and `setImmediate()`?",
    type: "nodejs", difficulty: "hard", category: "Node.js Advanced",
    tags: ["event loop", "nextTick", "setImmediate"],
    options: [
      { text: "They are identical", isCorrect: false },
      { text: "`process.nextTick()` fires before I/O events; `setImmediate()` fires after I/O events in the event loop", isCorrect: true },
      { text: "`setImmediate()` fires before I/O events; `process.nextTick()` fires after", isCorrect: false },
      { text: "`process.nextTick()` is deprecated", isCorrect: false },
    ],
    explanation: "`process.nextTick()` callbacks execute before the event loop continues (before any I/O). `setImmediate()` executes in the check phase of the event loop, after I/O events. Use `process.nextTick()` for high-priority callbacks.",
    timeLimit: 30,
  },

  // ── Frontend ──────────────────────────────────────────────────────────────
  {
    text: "What is CSS specificity?",
    type: "frontend", difficulty: "easy", category: "CSS",
    tags: ["CSS", "specificity"],
    options: [
      { text: "The order in which CSS files are loaded", isCorrect: false },
      { text: "A weight system that determines which CSS rule applies when multiple rules target the same element", isCorrect: true },
      { text: "The number of CSS properties in a rule", isCorrect: false },
      { text: "How fast CSS renders on screen", isCorrect: false },
    ],
    explanation: "CSS specificity is calculated as: inline styles (1000) > IDs (100) > classes/attributes/pseudo-classes (10) > elements/pseudo-elements (1). The rule with the highest specificity wins. `!important` overrides all.",
    timeLimit: 30,
  },
  {
    text: "What is the difference between `display: none` and `visibility: hidden`?",
    type: "frontend", difficulty: "easy", category: "CSS",
    tags: ["CSS", "display", "visibility"],
    options: [
      { text: "They are identical", isCorrect: false },
      { text: "`display: none` removes the element from layout; `visibility: hidden` hides it but keeps its space", isCorrect: true },
      { text: "`visibility: hidden` removes the element from layout", isCorrect: false },
      { text: "`display: none` only hides the element visually", isCorrect: false },
    ],
    explanation: "`display: none` removes the element from the document flow entirely — no space is reserved. `visibility: hidden` makes the element invisible but it still occupies space in the layout.",
    timeLimit: 30,
  },
  {
    text: "What is the CSS Box Model?",
    type: "frontend", difficulty: "easy", category: "CSS",
    tags: ["CSS", "box model"],
    options: [
      { text: "A 3D rendering technique for CSS shapes", isCorrect: false },
      { text: "The model describing content, padding, border, and margin around every HTML element", isCorrect: true },
      { text: "A CSS grid layout system", isCorrect: false },
      { text: "A method for creating CSS animations", isCorrect: false },
    ],
    explanation: "Every HTML element is a rectangular box with: Content (actual content), Padding (space inside the border), Border (surrounds padding), and Margin (space outside the border). `box-sizing: border-box` includes padding and border in the element's total width/height.",
    timeLimit: 30,
  },

  // ── Backend ───────────────────────────────────────────────────────────────
  {
    text: "What is JWT (JSON Web Token) and how does it work?",
    type: "backend", difficulty: "medium", category: "Authentication",
    tags: ["JWT", "authentication", "security"],
    options: [
      { text: "A database encryption standard", isCorrect: false },
      { text: "A compact, self-contained token with header, payload, and signature used for stateless authentication", isCorrect: true },
      { text: "A session storage mechanism", isCorrect: false },
      { text: "A hashing algorithm for passwords", isCorrect: false },
    ],
    explanation: "JWT consists of three base64-encoded parts: Header (algorithm), Payload (claims/data), and Signature (verification). The server signs the token with a secret key. Clients send it in the Authorization header. It's stateless — no server-side session needed.",
    timeLimit: 30,
  },
  {
    text: "What is the difference between authentication and authorization?",
    type: "backend", difficulty: "easy", category: "Security",
    tags: ["authentication", "authorization", "security"],
    options: [
      { text: "They are the same thing", isCorrect: false },
      { text: "Authentication verifies WHO you are; authorization determines WHAT you can do", isCorrect: true },
      { text: "Authorization verifies WHO you are; authentication determines WHAT you can do", isCorrect: false },
      { text: "Authentication is only for APIs", isCorrect: false },
    ],
    explanation: "Authentication = verifying identity (login with username/password). Authorization = verifying permissions (can this user access this resource?). You must be authenticated before you can be authorized.",
    timeLimit: 30,
  },

  // ── DevOps ────────────────────────────────────────────────────────────────
  {
    text: "What is the difference between a Docker image and a Docker container?",
    type: "devops", difficulty: "easy", category: "Docker",
    tags: ["docker", "container", "image"],
    options: [
      { text: "They are the same thing", isCorrect: false },
      { text: "An image is a read-only blueprint; a container is a running instance of an image", isCorrect: true },
      { text: "A container is a blueprint; an image is a running instance", isCorrect: false },
      { text: "Images run on the cloud; containers run locally", isCorrect: false },
    ],
    explanation: "A Docker image is a read-only template (like a class in OOP). A container is a running instance of that image (like an object). You can run multiple containers from the same image.",
    timeLimit: 30,
  },
  {
    text: "What does CI/CD stand for?",
    type: "devops", difficulty: "easy", category: "CI/CD",
    tags: ["CI/CD", "devops", "automation"],
    options: [
      { text: "Code Integration / Code Deployment", isCorrect: false },
      { text: "Continuous Integration / Continuous Delivery (or Deployment)", isCorrect: true },
      { text: "Container Infrastructure / Container Deployment", isCorrect: false },
      { text: "Cloud Integration / Cloud Delivery", isCorrect: false },
    ],
    explanation: "CI (Continuous Integration) automatically builds and tests code on every commit. CD (Continuous Delivery/Deployment) automatically delivers tested code to staging or production. Together they reduce manual effort and catch bugs early.",
    timeLimit: 30,
  },

  // ── Database ──────────────────────────────────────────────────────────────
  {
    text: "What does ACID stand for in database transactions?",
    type: "database", difficulty: "medium", category: "Database Concepts",
    tags: ["ACID", "transactions", "database"],
    options: [
      { text: "Atomicity, Consistency, Isolation, Durability", isCorrect: true },
      { text: "Availability, Consistency, Integrity, Distribution", isCorrect: false },
      { text: "Atomicity, Concurrency, Isolation, Distribution", isCorrect: false },
      { text: "Accuracy, Consistency, Integrity, Durability", isCorrect: false },
    ],
    explanation: "ACID properties ensure reliable database transactions: Atomicity (all or nothing), Consistency (data remains valid), Isolation (concurrent transactions don't interfere), Durability (committed data persists even after crashes).",
    timeLimit: 30,
  },
  {
    text: "What is the difference between INNER JOIN and LEFT JOIN in SQL?",
    type: "database", difficulty: "easy", category: "SQL",
    tags: ["SQL", "JOIN", "database"],
    options: [
      { text: "They return the same results", isCorrect: false },
      { text: "INNER JOIN returns only matching rows; LEFT JOIN returns all left table rows plus matching right rows", isCorrect: true },
      { text: "LEFT JOIN returns only matching rows; INNER JOIN returns all rows", isCorrect: false },
      { text: "INNER JOIN is faster but LEFT JOIN is more accurate", isCorrect: false },
    ],
    explanation: "INNER JOIN returns only rows where there is a match in BOTH tables. LEFT JOIN returns ALL rows from the left table and matching rows from the right table (NULL for non-matching right rows).",
    timeLimit: 30,
  },

  // ── Python ────────────────────────────────────────────────────────────────
  {
    text: "What is the difference between a list and a tuple in Python?",
    type: "python", difficulty: "easy", category: "Python Basics",
    tags: ["python", "list", "tuple"],
    options: [
      { text: "Lists are faster than tuples", isCorrect: false },
      { text: "Lists are mutable (changeable); tuples are immutable (cannot be changed after creation)", isCorrect: true },
      { text: "Tuples can hold more items than lists", isCorrect: false },
      { text: "Lists use () and tuples use []", isCorrect: false },
    ],
    explanation: "Lists `[]` are mutable — you can add, remove, or change elements. Tuples `()` are immutable — once created, they cannot be modified. Tuples are slightly faster and can be used as dictionary keys.",
    timeLimit: 30,
  },
  {
    text: "What is a Python decorator?",
    type: "python", difficulty: "medium", category: "Python Advanced",
    tags: ["python", "decorator", "functions"],
    options: [
      { text: "A way to add CSS styling to Python output", isCorrect: false },
      { text: "A function that wraps another function to extend its behavior without modifying it", isCorrect: true },
      { text: "A class inheritance mechanism", isCorrect: false },
      { text: "A Python package manager command", isCorrect: false },
    ],
    explanation: "A decorator is a function that takes another function as input, adds some behavior, and returns a new function. Used with `@decorator_name` syntax. Common examples: `@staticmethod`, `@property`, `@login_required` in Django.",
    timeLimit: 30,
  },
];

export const seedAllQuestions = async (): Promise<void> => {
  try {
    const count = await Question.countDocuments();
    if (count >= questions.length + extraQuestions.length) return;
    // Only insert extra questions that don't exist yet
    for (const q of extraQuestions) {
      const exists = await Question.findOne({ text: q.text });
      if (!exists) await Question.create(q);
    }
    console.log(`✅ Extra questions seeded`);
  } catch (error) {
    console.error('Error seeding extra questions:', error);
  }
};
