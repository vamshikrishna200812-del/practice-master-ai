/**
 * Story scenarios for every coding problem.
 * Keyed by problem.id. Rendered above the problem description in ProblemDetail.
 *
 * Format:
 *   story  – 1-3 sentence creative scenario that frames the problem.
 *   note?  – Optional hint or edge-case warning shown at the bottom.
 */
export interface ProblemStory {
  story: string;
  note?: string;
}

export const problemStories: Record<string, ProblemStory> = {
  // ===================== EASY =====================
  "two-sum": {
    story: "At Galactic Bank, every transaction is logged as an integer amount. Auditor Nova must quickly find the two ledger entries that, when summed, exactly match a suspicious target transfer — and report their positions.",
    note: "A hash map of value→index lets you confirm each pair in a single pass.",
  },
  "reverse-string": {
    story: "An ancient scroll was discovered written backwards by a secretive monk order. Help the archaeologist flip the text so historians can finally read it from beginning to end.",
    note: "Two pointers from both ends keep the work in-place and O(n).",
  },
  "fizzbuzz": {
    story: "The town clock of Numeria rings every second. On every 3rd chime it shouts 'Fizz', on every 5th 'Buzz', and on shared multiples 'FizzBuzz'. Print what the clock yells from second 1 to n.",
    note: "Always check divisibility by 15 first to catch FizzBuzz before Fizz/Buzz.",
  },
  "palindrome-check": {
    story: "Inscriptions on the Mirror Temple are only valid if they read identically backward and forward — ignoring punctuation and case. Tell the priests whether the inscription before you is sacred.",
    note: "Strip non-alphanumerics, lowercase, then two pointers.",
  },
  "valid-parentheses": {
    story: "A pyramid vault opens only when its sequence of stone tiles `()[]{}` is properly matched and nested. Decide whether the carved sequence will trigger the lock.",
    note: "Stack-based: push openers, pop and verify on closers, finish empty.",
  },
  "binary-search": {
    story: "The treasure index of King Bibos is sorted alphabetically. You must find the page of a relic in O(log n) — or report it doesn't exist.",
    note: "Watch out for integer overflow on `mid`; use `left + (right-left)/2`.",
  },
  "merge-sorted-arrays": {
    story: "Two warehouses each ship sorted lists of inventory IDs. Combine them into one sorted manifest without re-sorting from scratch.",
    note: "Walk both arrays with two pointers; total cost is O(n+m).",
  },
  "climbing-stairs": {
    story: "A space elevator has n rungs. Each push lifts you 1 or 2 rungs. How many distinct lift sequences reach the top?",
    note: "This is Fibonacci in disguise: ways(n) = ways(n-1) + ways(n-2).",
  },
  "single-number": {
    story: "Every twin in the Glass Kingdom is registered in pairs — except one orphan. Identify the orphan ID using only constant memory.",
    note: "XOR cancels duplicates: a ^ a = 0, so XOR of all leaves the loner.",
  },
  "max-depth-bt": {
    story: "An ancient family tree is engraved as a binary structure on a stone wall. Determine how many generations deep the longest line of descent runs.",
    note: "Recursive DFS: depth = 1 + max(left, right).",
  },
  "invert-binary-tree": {
    story: "A wizard's mirror reflects a binary tree as its perfect mirror image. Output the mirrored tree in level order.",
    note: "Swap left and right children at every node — recursion or BFS both work.",
  },
  "linked-list-reverse": {
    story: "A train of cargo cars must be reattached to the locomotive in reverse order before crossing a one-way tunnel. Reverse the list head-to-tail.",
    note: "Three pointers: prev, curr, next. Iterative is O(1) extra space.",
  },
  "contains-duplicate": {
    story: "The voter registry must reject anyone enrolled twice. Decide whether any ID appears more than once.",
    note: "Hash set on the fly: insert and check membership in O(1) average.",
  },
  "counting-sort": {
    story: "Marbles are dropped through chutes labelled by colour code 0..k. Recombine them back into a single sorted line by counting how many landed in each chute.",
    note: "O(n + k) time, O(k) extra space — beats comparison sort for small k.",
  },
  "valid-anagram": {
    story: "Two cryptic messages were intercepted. Verify whether one is simply an anagram of the other before sounding the alarm.",
    note: "Frequency-count both strings; equal counts ⇒ anagram.",
  },
  "move-zeroes": {
    story: "On the conveyor belt, defective items (0s) must drift to the back while good items keep their relative order at the front.",
    note: "Two-pointer trick keeps it in-place and stable.",
  },
  "symmetric-tree": {
    story: "An architect's blueprint folds along its central spine. Verify the binary tree mirrors itself perfectly across that fold.",
    note: "Compare left.left vs right.right and left.right vs right.left recursively.",
  },
  "best-time-buy-sell": {
    story: "Daily stock prices for a year are given. As a trader who may buy once and sell once later, what is the maximum profit you could have locked in?",
    note: "Track the running minimum price; max-profit = max(price - minSoFar).",
  },

  // ===================== MEDIUM =====================
  "max-subarray": {
    story: "A weather satellite recorded daily temperature anomalies across the season. Find the contiguous span of days with the largest cumulative anomaly.",
    note: "Kadane's algorithm: O(n), O(1) — reset running sum whenever it dips below 0.",
  },
  "longest-substring": {
    story: "A code-cracker scans an enemy transmission character by character. Report the longest run of consecutive characters with no repeats — that's the active cipher window.",
    note: "Sliding window with a 'last seen' map shrinks from the left when a repeat is found.",
  },
  "linked-list-cycle": {
    story: "A subway loop may have a fault that sends trains around forever. Detect whether the line contains a cycle, using only constant memory.",
    note: "Floyd's tortoise & hare: slow and fast pointers meet inside any cycle.",
  },
  "sort-array": {
    story: "Astronaut bunk numbers got jumbled during turbulence. Sort them efficiently before re-boarding.",
    note: "Quicksort/mergesort/heapsort all qualify — aim for O(n log n).",
  },
  "coin-change": {
    story: "A vending bot accepts coins of given denominations. Compute the fewest coins needed to make the requested amount, or -1 if impossible.",
    note: "Bottom-up DP: dp[a] = 1 + min(dp[a - coin]) over all coins.",
  },
  "longest-common-subseq": {
    story: "Two students copied lecture notes independently. Find the length of the longest sequence of characters appearing in both — in order, not necessarily contiguous.",
    note: "Classic 2-D DP on (i, j); O(n·m).",
  },
  "number-of-islands": {
    story: "A satellite map shows land ('1') and water ('0'). Count the number of distinct islands floating in the ocean.",
    note: "DFS/BFS flood-fill from each unvisited '1' cell.",
  },
  "course-schedule": {
    story: "The university registrar lists course prerequisites. Decide whether all courses can be completed without a circular dependency.",
    note: "Cycle detection in a directed graph — Kahn's algorithm or DFS coloring.",
  },
  "binary-tree-level-order": {
    story: "A royal court must be addressed level-by-level, top to bottom. Output every level of the binary court hierarchy as separate groups.",
    note: "BFS with a queue; record the queue size at each level boundary.",
  },
  "validate-bst": {
    story: "A library claims its index is a valid Binary Search Tree. Verify the claim — every node must respect the strict BST invariant globally, not just locally.",
    note: "Pass (lo, hi) bounds down the recursion, not just compare with parent.",
  },
  "house-robber": {
    story: "A thief plans to loot a row of houses, but adjacent burglaries trigger the alarm. Maximize loot under the no-two-adjacent rule.",
    note: "DP with two rolling variables: prev, curr. O(n), O(1).",
  },
  "rotate-image": {
    story: "An astronaut snapped a square photograph upside-down sideways. Rotate the n×n image 90° clockwise, in place.",
    note: "Transpose, then reverse each row — O(n²), O(1).",
  },
  "subsets": {
    story: "A music DJ wants every possible mood-playlist combination from a set of unique songs. Generate all subsets of the input array.",
    note: "Backtracking or bitmask: 2ⁿ total subsets.",
  },
  "permutations": {
    story: "A tour planner must list every possible visit-order through n unique cities. Print all permutations.",
    note: "Backtrack with a 'used' set; n! results.",
  },
  "combination-sum": {
    story: "A pharmacy can repeat any pill from a set of doses. Find every multiset that sums exactly to the target dosage.",
    note: "Backtracking; sort first to prune branches that overshoot the target.",
  },
  "word-search": {
    story: "A child traces letters on a fridge-magnet grid. Tell whether the target word can be spelled by walking 4-directionally without reusing a magnet.",
    note: "DFS with a temporary mark on the visited cell, restored on backtrack.",
  },
  "topological-sort": {
    story: "A factory line has tasks with strict 'must-precede' relations. Output one valid order in which all tasks can be performed.",
    note: "Kahn's BFS over indegree-0 nodes — detects cycles for free.",
  },
  "dijkstra": {
    story: "A delivery drone must find the shortest weighted path from the warehouse to every district. Roads have positive travel times.",
    note: "Min-heap of (dist, node); skip stale entries on pop.",
  },
  "bfs-graph": {
    story: "A virus spreads across a social graph one hop per second from patient zero. Output the order in which everyone gets infected.",
    note: "Standard BFS with a visited set and a FIFO queue.",
  },
  "knapsack-01": {
    story: "A treasure hunter's bag holds W kilograms. Each gem has weight and value, and may be taken at most once. Maximize value carried.",
    note: "2-D DP on (i, capacity); O(n·W).",
  },
  "longest-increasing-subseq": {
    story: "A botanist measures plant heights over months. Find the length of the longest stretch (not necessarily contiguous) of strictly increasing growth.",
    note: "Patience-sort with binary search hits O(n log n).",
  },

  // ===================== HARD =====================
  "median-two-sorted": {
    story: "Two hospitals merged their patient blood-pressure logs (already sorted). The chief researcher needs the median of the combined data — without merging.",
    note: "Binary-search the partition; target O(log min(n,m)).",
  },
  "lru-cache": {
    story: "A streaming service caches recently watched videos. When capacity is full, evict the Least-Recently-Used title. Implement get/put in O(1).",
    note: "Combine a doubly-linked list with a hashmap pointing to nodes.",
  },
  "n-queens": {
    story: "Queen Vega wants n royal guards on an n×n chessboard such that none threatens another. Enumerate every valid arrangement.",
    note: "Backtrack column-by-column; track used rows and both diagonals as sets.",
  },
  "merge-k-sorted": {
    story: "K parallel sensor streams produce sorted readings. Merge them into one chronological stream efficiently.",
    note: "Min-heap of size k; total O(N log k).",
  },
  "word-ladder": {
    story: "A secret society challenges you to morph one code-word into another by changing one letter at a time, every intermediate being a valid dictionary word. Find the shortest chain length.",
    note: "BFS on the implicit graph of one-letter-edits; pre-build pattern buckets to speed neighbor lookup.",
  },
  "trapping-rain-water": {
    story: "A row of skyscrapers has varying heights. After a storm, how many units of water remain trapped between them?",
    note: "Two-pointer technique computes the answer in one pass, O(1) space.",
  },
  "edit-distance": {
    story: "An autocorrect engine must report the minimum number of insert/delete/replace operations to morph one user word into the dictionary suggestion.",
    note: "Levenshtein DP on (i, j); O(n·m) time and space.",
  },
  "serialize-deserialize-bt": {
    story: "Mission control beams a binary command tree to a Mars rover. Encode it as a string for transmission, then reconstruct it on the rover.",
    note: "Pre-order with explicit nulls is the cleanest round-trip.",
  },
  "lowest-common-ancestor": {
    story: "Genealogy software must find the most recent common ancestor of two royals in the family BST.",
    note: "Walk down: if both keys are smaller go left, both larger go right, otherwise current node is the LCA.",
  },
  "graph-coloring": {
    story: "A radio authority must assign frequencies (colors) to towers so no two neighboring towers share a frequency. Decide if k colors suffice.",
    note: "NP-hard in general — backtracking with constraint propagation handles small k.",
  },
  "sudoku-solver": {
    story: "An ancient temple door is locked by a 9×9 Sudoku puzzle. Fill in the missing digits to unlock it.",
    note: "Backtracking with row/col/box bitmasks — usually solves in milliseconds.",
  },
  "matrix-chain-mult": {
    story: "An engineering firm chains matrix transformations. Choose the parenthesization that minimizes total scalar multiplications.",
    note: "Interval DP on (i, j); O(n³) time.",
  },
  "kruskal-mst": {
    story: "A frontier town must connect every settlement with the cheapest possible road network. Build the Minimum Spanning Tree.",
    note: "Sort edges, add greedily, skip edges that close a cycle (Union-Find).",
  },
  "longest-path-dag": {
    story: "Project tasks form a DAG with durations on edges. Find the critical path — the longest possible sequence start-to-finish.",
    note: "Topological order then relax edges; O(V+E).",
  },
  "activity-selection": {
    story: "A conference room has back-to-back proposals with start/end times. Schedule the maximum number of non-overlapping talks.",
    note: "Greedy: sort by finish time, pick whenever start ≥ last finish.",
  },

  // ===================== Math / Bits / Misc Easies =====================
  "sum-of-digits": {
    story: "An ATM enforces 'digital root' security: keep summing the digits of a PIN until a single digit remains. Compute that final digit.",
    note: "You can also use the formula 1 + (n-1) % 9 for non-negatives.",
  },
  "power-of-two": {
    story: "A starship reactor only stabilizes if its core's energy quanta is exactly a power of two. Verify the input.",
    note: "n > 0 && (n & (n-1)) === 0.",
  },
  "missing-number": {
    story: "A team of n+1 numbered hikers should be present, but exactly one disappeared on the trail. Identify the missing hiker number from 0..n.",
    note: "XOR all numbers and indices, or use Gauss's sum formula.",
  },
  "roman-to-integer": {
    story: "An archaeologist uncovered Roman numerals on an ancient ledger. Convert the inscription to an integer for the modern catalog.",
    note: "Subtract when a smaller numeral precedes a larger one (IV, IX, etc.).",
  },
  "majority-element": {
    story: "An electoral commission must determine if any candidate received strictly more than half the votes. Identify them in O(n) time, O(1) space.",
    note: "Boyer–Moore voting algorithm.",
  },
  "product-except-self": {
    story: "A shop owner displays the price of every item except the one a customer is holding, alongside the product of all the others. Compute that product list — without using division.",
    note: "Two passes: prefix products from left, suffix products from right.",
  },
  "group-anagrams": {
    story: "A linguist sorts a giant pile of word cards into piles where each pile contains anagrams of one another.",
    note: "Use sorted-string (or 26-letter count tuple) as the hash key.",
  },
  "min-stack": {
    story: "A parking garage attendant needs the cheapest active ticket at any moment, while supporting push and pop in O(1).",
    note: "Maintain a parallel 'min so far' stack alongside the value stack.",
  },
  "three-sum": {
    story: "An astronomer scans a list of stellar masses for any triplet summing to zero net pull — a candidate for a stable three-body system. List all unique triplets.",
    note: "Sort, fix one element, two-pointer the rest. Skip duplicates carefully.",
  },
  "spiral-matrix": {
    story: "A drone photographs an n×m field flying in a spiral starting top-left. Output the order in which cells are captured.",
    note: "Maintain four bounds (top, bottom, left, right) and shrink them after each pass.",
  },
  "regular-expression-match": {
    story: "A log filter must support `.` (any char) and `*` (zero or more of previous). Decide whether the pattern matches the entire log line.",
    note: "DP on (i, j); handle `*` by branching: skip pattern pair OR consume one input char.",
  },
  "max-profit-cooldown": {
    story: "A trader can buy/sell stocks repeatedly but must rest one day after every sell. Maximize profit across the price series.",
    note: "Three-state DP: hold / sold / rest.",
  },
  "alien-dictionary": {
    story: "A linguist receives a word list sorted in an alien language's alphabet. Reconstruct the alphabet's letter order, or report inconsistency.",
    note: "Topological sort on character-precedence edges derived from adjacent words.",
  },
  "sliding-window-max": {
    story: "Mars wind-speed sensors stream data each second. Report the max wind speed inside every k-second window.",
    note: "Monotonic deque of indices keeps the answer in O(n).",
  },
  "trie-implementation": {
    story: "A search engine needs an autocomplete dictionary. Implement insert / search / startsWith on a Trie.",
    note: "Each node stores 26 children + an isEnd flag.",
  },

  // ===================== More EASY block =====================
  "count-vowels": {
    story: "A poetry analyzer counts the vowels in every line to estimate musicality. Return the number of vowels in the input string.",
    note: "Treat 'a','e','i','o','u' (and uppercase) — single linear scan.",
  },
  "second-largest": {
    story: "At the Galactic Sprint, the silver medalist is the runner-up by speed. Identify the second-largest distinct value, or -1 if it doesn't exist.",
    note: "Track top two distinct values in one pass — initialize to -∞ to handle negatives.",
  },
  "capitalize-words": {
    story: "A typesetter is preparing book titles. Capitalize the first letter of every word while leaving the rest untouched.",
    note: "Walk the string; uppercase characters following spaces (or at index 0).",
  },
  "array-rotation": {
    story: "A wheel of n positions must spin k notches to the right. Output the new arrangement after the rotation.",
    note: "Reverse-three-times trick: reverse all, reverse first k, reverse rest.",
  },
  "remove-duplicates-sorted": {
    story: "A registry was already sorted but contains duplicates. Compact it in place and report the new length.",
    note: "Two pointers: write pointer advances only on a new value.",
  },
  "string-compression": {
    story: "A telegrapher compresses repeated letters into letter+count format ('aaabb' → 'a3b2') to save bandwidth.",
    note: "Watch out for runs of length 1: write the letter, count = 1.",
  },
  "intersection-arrays": {
    story: "Two librarians compare their borrowed-book lists. Return the books that appear in both — distinct values only.",
    note: "Hash set of one array, then membership-check the other.",
  },
  "linked-list-middle": {
    story: "A medical drone must reach the middle patient in a linked queue of arrivals. Return that middle node's value.",
    note: "Slow/fast pointer: when fast hits the end, slow is the middle.",
  },
  "plus-one": {
    story: "A digital odometer is represented as an array of digits. Add one and return the new digit array, handling carries.",
    note: "Walk from the end; carry propagates only through trailing 9s.",
  },
  "first-unique-char": {
    story: "A spam-filter scans the first non-repeating character in every email subject as a quick fingerprint. Find that character's index, or -1.",
    note: "Two passes with a 26-char frequency table.",
  },
  "merge-linked-lists": {
    story: "Two sorted parade routes must merge into a single sorted procession of marchers. Combine them without breaking the sort.",
    note: "Iterate with a dummy head; attach the smaller current node each step.",
  },
  "max-consecutive-ones": {
    story: "A factory's quality stream is binary: 1 = pass, 0 = fail. Find the longest streak of consecutive passes.",
    note: "Single linear scan with a running counter, reset on every 0.",
  },
  "reverse-words": {
    story: "A messenger garbled the order of words in a battlefield report. Reverse the words (not the letters within them) so the general can read it.",
    note: "Trim, split on whitespace, reverse, join with single spaces.",
  },
  "linked-list-nth-from-end": {
    story: "A video stream stores frames as a linked list. Return the value of the n-th frame from the live edge.",
    note: "Two pointers spaced n apart; slow lands on the answer.",
  },
  "prefix-sum-range": {
    story: "A weather station answers many 'sum of temperatures from day i to day j' queries. Pre-compute so each query is O(1).",
    note: "prefix[i] = sum of first i elements; range = prefix[j+1] - prefix[i].",
  },

  // ===================== More MEDIUM block =====================
  "longest-palindrome-substring": {
    story: "An archaeologist scans a stone tablet for the longest palindromic carving — a clue to ancient symmetry rituals.",
    note: "Expand around each center (odd & even); O(n²) and very simple.",
  },
  "container-most-water": {
    story: "Vertical lines on a graph represent walls of varying heights. Pick two walls so the trapped water rectangle holds the most volume.",
    note: "Two pointers from both ends; always move the shorter wall inward.",
  },
  "zigzag-conversion": {
    story: "A spy writes a message in a zigzag pattern across n rails, then reads row-by-row to encode it. Reproduce the encoded string.",
    note: "Track current row + direction; flip direction at top and bottom rails.",
  },
  "remove-nth-node": {
    story: "A queue of attendees has its n-th-from-the-end member removed at the door. Output the updated queue as a linked list.",
    note: "Use a dummy head + two pointers spaced n apart.",
  },
  "string-multiply": {
    story: "A calculator app must multiply numbers larger than 64-bit integers. Multiply two non-negative numbers given as strings.",
    note: "Schoolbook multiply into an n+m result array, then trim leading zeros.",
  },
  "add-two-numbers-ll": {
    story: "Two enormous numbers are stored digit-by-digit in linked lists, least-significant first. Add them and return the sum as a linked list.",
    note: "Walk both lists, carry forward; don't forget the final carry node.",
  },
  "next-permutation": {
    story: "A combination lock cycles through arrangements lexicographically. Given the current permutation, output the next one.",
    note: "Find first descending pair from the right, swap with successor, reverse suffix.",
  },
  "flatten-linked-list": {
    story: "A deeply nested filesystem is encoded as a list of lists (and lists-of-lists). Flatten it to a single list of integers.",
    note: "Recurse on nested elements; or use an iterator with a stack.",
  },
  "subarray-sum-k": {
    story: "An accountant searches the daily transaction log for every contiguous span whose sum equals exactly k. Count them.",
    note: "Prefix sum + hash map of (sum → count of occurrences).",
  },
  "string-to-integer-atoi": {
    story: "Reproduce C's classic atoi: parse leading whitespace, optional sign, digits — and clamp to 32-bit int range.",
    note: "Mind overflow before the multiplication, not after.",
  },
  "sort-linked-list": {
    story: "A train of cargo cars drifted out of order. Sort the linked list in O(n log n) with O(1) extra space.",
    note: "Merge sort on linked list — split with slow/fast, merge with two pointers.",
  },
  "jump-game": {
    story: "A frog hops along an array; each cell tells the maximum jump length from there. Determine if it can reach the last cell.",
    note: "Greedy: track the furthest reachable index as you scan.",
  },
  "decode-ways": {
    story: "A WWII code maps 1→A, 2→B, …, 26→Z. Given a digit string, count how many ways it can be decoded.",
    note: "DP: dp[i] = dp[i-1] (if s[i]≠'0') + dp[i-2] (if s[i-1..i] in 10..26).",
  },
  "linked-list-palindrome": {
    story: "A linked-list mantra must read the same backwards. Decide whether the chant is a palindrome — using O(1) extra space.",
    note: "Find the middle, reverse the second half, compare halves.",
  },
  "peak-element": {
    story: "A hiker on a sawtooth ridge wants to reach any local peak. Return the index of any element greater than both neighbors.",
    note: "Binary search: move toward the higher neighbor — a peak must lie that way.",
  },
  "count-and-say": {
    story: "A children's chant evolves: each line describes the previous one — '1' → 'one 1' → 'two 1s' → '21'... Output the n-th term.",
    note: "Iteratively scan the previous string and emit count+digit pairs.",
  },
  "rotate-linked-list": {
    story: "A round-robin music playlist must be rotated k positions to the right. Reattach the linked list accordingly.",
    note: "Make it circular, walk to the new tail, then break the loop.",
  },
  "longest-common-prefix": {
    story: "A tree of file paths shares a base directory. Return the deepest prefix common to every input path.",
    note: "Vertical scan: compare each character across all strings until mismatch.",
  },
  "partition-list": {
    story: "Concert attendees are partitioned: everyone with a ticket value < x stands on the left, everyone else on the right — preserving original order in each half.",
    note: "Build two dummy chains (less / greater_or_equal), then concatenate.",
  },
  "set-matrix-zeroes": {
    story: "A spreadsheet macro: any cell holding 0 zeroes its entire row and column. Apply this in-place using O(1) extra space.",
    note: "Use the first row/column themselves as markers — process them last.",
  },

  // ===================== More HARD block =====================
  "reverse-nodes-k-group": {
    story: "A train must flip every group of k consecutive cars before crossing the bridge. Reverse nodes in groups of k; leave a partial tail untouched.",
    note: "Iterative with a dummy head — count k, reverse the group, splice back in.",
  },
  "wildcard-matching": {
    story: "A search engine supports `?` (any single char) and `*` (any sequence). Decide whether the pattern matches the entire query string.",
    note: "DP on (i, j); `*` either matches empty (skip pattern) or one more char (skip text).",
  },
  "minimum-window-substring": {
    story: "An editor scans an article for the shortest passage that contains every required keyword character. Return that minimum window.",
    note: "Sliding window with frequency counters; expand right, shrink left when valid.",
  },
  "max-path-sum-bt": {
    story: "An adventurer walks a binary network of caverns where every node has a treasure value (possibly negative). Find the maximum sum path that bends at most once at any node.",
    note: "Recursion that returns max-gain-from-this-node while updating a global best with through-paths.",
  },
  "merge-intervals": {
    story: "A booking calendar has overlapping reservations. Merge them into the minimum set of non-overlapping intervals.",
    note: "Sort by start, then sweep — extend the current interval if it overlaps.",
  },
  "copy-random-list": {
    story: "Clone a linked list whose every node also has a random pointer to anywhere in the list — without breaking the topology.",
    note: "Three-pass interleave trick avoids extra hash maps and runs in O(1) extra space.",
  },
  "find-kth-largest": {
    story: "An arena ranks gladiators by strength. Find the k-th strongest in expected O(n) time.",
    note: "Quickselect (Hoare partition) averages O(n); min-heap of size k is O(n log k).",
  },
  "text-justification": {
    story: "A newspaper typesetter wraps a list of words into lines of exactly maxWidth, distributing spaces as evenly as possible.",
    note: "Greedy line packing + careful slot-by-slot space distribution; last line is left-justified.",
  },
  "detect-remove-ll-cycle": {
    story: "A subway loop must be straightened before maintenance. Detect any cycle, locate its entry, and unlink it.",
    note: "Floyd's algorithm finds entry: reset slow to head; advance both 1-step until they meet.",
  },
  "first-missing-positive": {
    story: "A scoreboard records positive integers. Find the smallest positive integer NOT present, in O(n) time and O(1) extra memory.",
    note: "In-place placement: put each value v at index v-1, then scan for the first slot that doesn't match.",
  },
  "longest-valid-parentheses": {
    story: "A code linter highlights the longest balanced sub-expression in a string of '(' and ')'. Return its length.",
    note: "Stack of indices, or two-pass counters scanning left-then-right.",
  },
  "interleave-linked-list": {
    story: "Two parade marching bands must interleave their members by alternating one from each — into a single linked list.",
    note: "Walk both lists; splice nodes in alternating order.",
  },
  "max-sum-submatrix": {
    story: "A satellite scan reports a 2-D temperature anomaly map. Find the rectangular sub-area with the highest cumulative anomaly.",
    note: "Fix top/bottom rows, collapse to 1-D, then run Kadane. O(rows² · cols).",
  },
  "smallest-range-k-lists": {
    story: "K weather stations each return a sorted list of readings. Find the smallest temperature range that contains at least one reading from every station.",
    note: "Min-heap with one element per list; track current max; shrink window on heap-pop.",
  },
  "count-inversions": {
    story: "A quality auditor counts how many out-of-order pairs exist in a list — a measure of sorting effort needed.",
    note: "Modified merge sort counts inversions in O(n log n).",
  },

  // ===================== Bit / Math / Patterns =====================
  "count-set-bits": {
    story: "A network packet's flags byte is given as an integer. Count how many flag bits are set to 1.",
    note: "Brian Kernighan's trick: n &= n-1 strips the lowest set bit each step.",
  },
  "bitwise-and-range": {
    story: "A range of register values must be AND-ed together to produce the common bit-pattern. Compute it without iterating each value.",
    note: "Find the common high-bit prefix of left and right by right-shifting both until equal.",
  },
  "gcd-two-numbers": {
    story: "An ancient tile-cutter wants the largest square tile that fits perfectly in both an m×n room and an a×b room. Return the GCD of two integers.",
    note: "Euclidean algorithm: gcd(a, b) = gcd(b, a mod b).",
  },
  "count-primes": {
    story: "A cryptographer needs to know how many prime numbers exist below n for keysize selection. Compute the count efficiently.",
    note: "Sieve of Eratosthenes in O(n log log n).",
  },
  "happy-number": {
    story: "A meditation app declares a number 'happy' if repeatedly summing the squares of its digits eventually reaches 1. Decide whether n is happy.",
    note: "Floyd's cycle detection on the digit-square-sum function.",
  },
  "integer-to-roman": {
    story: "A coin-press die-cutter converts integers into Roman numeral inscriptions for new collectible coins.",
    note: "Greedy with paired (value, symbol) including the subtractive ones (CM, CD, XC, XL, IX, IV).",
  },
  "max-sum-subarray-k": {
    story: "A solar farm reports daily energy yields. Find the highest total over any k-day stretch — the marketing team wants that headline.",
    note: "Fixed-size sliding window; add the new, drop the old.",
  },
  "longest-substring-k-distinct": {
    story: "A music DJ wants the longest contiguous segment of a track-list using at most k distinct moods.",
    note: "Sliding window with a frequency map; shrink left when distinct count exceeds k.",
  },
  "fruits-into-baskets": {
    story: "An orchard worker can carry only two basket types. Walking down a row of trees, find the longest contiguous span yielding at most 2 fruit types.",
    note: "It's the longest substring with at most 2 distinct characters.",
  },

  // ===================== Matrix / Heap / Recursion =====================
  "search-2d-matrix": {
    story: "A spreadsheet sorted both row-wise and column-wise must answer 'is target present?' efficiently.",
    note: "Treat as one sorted sequence and binary search, or staircase-walk from top-right corner.",
  },
  "kth-largest-element": {
    story: "A high-score board reveals the k-th best score for tournament seeding. Compute it in efficient time.",
    note: "Min-heap of size k or quickselect.",
  },
  "merge-k-sorted-arrays": {
    story: "K parallel research teams produced sorted result lists. Merge all of them into one chronological list efficiently.",
    note: "Min-heap holding (value, listIdx, elemIdx); total O(N log k).",
  },
  "tower-of-hanoi": {
    story: "An ancient temple has 3 rods and n golden disks of decreasing size. Output the sequence of moves to relocate them all to the destination rod, never placing larger over smaller.",
    note: "Classic recursion: move n-1 to aux, move bottom, move n-1 from aux to dest.",
  },
  "generate-parentheses": {
    story: "A lexer-test generator needs every valid combination of n pairs of parentheses. Produce them in any order.",
    note: "Backtrack while open<n and close<open; emit when length == 2n.",
  },
  "next-greater-element": {
    story: "A weather analyst, looking forward in time, wants the next day with a higher temperature than today — for every day.",
    note: "Monotonic decreasing stack of indices; pop while top is smaller than current.",
  },
  "daily-temperatures": {
    story: "A meteorology dashboard answers 'how many days until a warmer day?' for each day of the year.",
    note: "Same monotonic stack pattern as Next Greater Element.",
  },
  "largest-rectangle-histogram": {
    story: "An architect inspects a skyline of bar heights and wants the largest rectangular billboard that fits within the silhouette.",
    note: "Monotonic stack computes each bar's left/right limits in O(n).",
  },
  "gas-station": {
    story: "A road-trip across n gas stations on a circular route. Each station offers gas and the next leg costs gas. Find the starting station that lets you complete the loop, or report it's impossible.",
    note: "If total_gas ≥ total_cost, exactly one valid start exists — the one after the last deficit.",
  },
  "meeting-rooms-ii": {
    story: "A startup books n meetings with start/end times. Find the minimum number of conference rooms required to host them all simultaneously.",
    note: "Min-heap of end-times: pop when the next start ≥ heap top.",
  },
  "clone-graph": {
    story: "A social network's friend graph must be deep-cloned for backup, preserving every reference.",
    note: "DFS or BFS with a hash map old→new node.",
  },
  "graph-bipartite": {
    story: "A wedding planner must assign every guest to one of two tables so that no two guests who dislike each other share a table. Decide if such a 2-coloring exists.",
    note: "BFS coloring: assign alternating colors; conflict ⇒ not bipartite.",
  },
  "longest-repeating-substring": {
    story: "A plagiarism detector scans a manuscript for the longest substring that appears more than once.",
    note: "Binary-search the answer length and use a rolling-hash set to verify.",
  },
  "isomorphic-strings": {
    story: "A cipher tool replaces letters one-to-one. Decide whether s could be transformed into t by such a consistent character mapping.",
    note: "Two hash maps enforcing bijection (s→t and t→s).",
  },
  "unique-paths": {
    story: "A delivery robot in an m×n warehouse can only step right or down. Count the distinct routes from top-left to bottom-right.",
    note: "DP grid or combinatorics: C(m+n-2, m-1).",
  },
  "word-break": {
    story: "A primitive tokenizer must decide if a long string can be sliced into a sequence of valid dictionary words.",
    note: "DP: dp[i] = true if some j<i has dp[j] true AND s[j..i] in dict.",
  },

  // ===================== NEW PROBLEMS =====================
  "robot-assembly-line": {
    story: "At the NovaBots factory, robots roll off the conveyor with a quality score. The factory ships only robots scoring strictly above the day's average — customers expect 'above-average' quality.",
    note: "Compare i*n vs sum to avoid floating-point pitfalls.",
  },
  "pharaohs-vault": {
    story: "Deep inside an Egyptian pyramid, a sealed vault opens only when its sequence of `()[]{}` tiles is properly matched and nested — exactly as the priests intended.",
    note: "Stack-based: push openers, pop and verify on closers.",
  },
  "martian-wind-tunnel": {
    story: "On Mars, a rover records wind speed each second. Mission control needs the strongest gust within every k-second window to plan safe rover movement.",
    note: "Monotonic deque of indices keeps it O(n) instead of O(n·k).",
  },
  "hospital-triage-queue": {
    story: "St. Aurora's ER triages patients by severity (1–100). Doctors always treat the most critical first, while new patients keep arriving. The system must respond instantly.",
    note: "Max-heap for instant 'most critical' lookup; both ops are O(log n).",
  },
  "galaxy-bridge-network": {
    story: "The Galactic Federation links planets via hyperspace bridges. The Council wants to know how many independent star clusters exist across the federation.",
    note: "Union-Find with path compression; or BFS/DFS over the adjacency list.",
  },
  "greedy-pirate": {
    story: "Captain Blackwave finds a row of treasure chests on a deserted island. Opening adjacent chests sets off a trap — pick a non-adjacent subset that maximizes total gold.",
    note: "House-Robber DP with two rolling variables — O(n), O(1).",
  },
};
