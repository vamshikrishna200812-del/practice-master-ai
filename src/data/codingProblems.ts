export interface TestCase {
  input: string;
  expectedOutput: string;
  hidden?: boolean;
}

export interface CodingProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  tags: string[];
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  sampleCases: { input: string; output: string; explanation?: string }[];
  testCases: TestCase[];
  starterCode: Record<string, string>;
  editorial?: string;
  hints: string[];
}

export interface CodingCourse {
  id: string;
  title: string;
  description: string;
  icon: string;
  problemIds: string[];
}

export const codingProblems: CodingProblem[] = [
  // ─── EASY ───
  {
    id: "two-sum",
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    category: "Arrays",
    tags: ["arrays", "hash-map"],
    description:
      "Given an array of integers `nums` and an integer `target`, return the **indices** of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    inputFormat: "First line: space-separated integers (the array)\nSecond line: an integer (the target)",
    outputFormat: "Two space-separated integers representing the indices (0-indexed).",
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists.",
    ],
    sampleCases: [
      { input: "2 7 11 15\n9", output: "0 1", explanation: "nums[0] + nums[1] = 2 + 7 = 9" },
      { input: "3 2 4\n6", output: "1 2" },
      { input: "3 3\n6", output: "0 1" },
    ],
    testCases: [
      { input: "2 7 11 15\n9", expectedOutput: "0 1" },
      { input: "3 2 4\n6", expectedOutput: "1 2" },
      { input: "3 3\n6", expectedOutput: "0 1" },
      { input: "1 5 3 7 2\n9", expectedOutput: "1 3", hidden: true },
      { input: "-1 -2 -3 -4 -5\n-8", expectedOutput: "2 4", hidden: true },
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // Write your solution here\n  \n}\n\n// Read input\nconst lines = input.trim().split("\\n");\nconst nums = lines[0].split(" ").map(Number);\nconst target = parseInt(lines[1]);\nconst result = twoSum(nums, target);\nconsole.log(result.join(" "));`,
      python: `def two_sum(nums, target):\n    # Write your solution here\n    pass\n\n# Read input\nlines = input_data.strip().split("\\n")\nnums = list(map(int, lines[0].split()))\ntarget = int(lines[1])\nresult = two_sum(nums, target)\nprint(" ".join(map(str, result)))`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String[] parts = sc.nextLine().split(" ");\n        int[] nums = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);\n        int target = sc.nextInt();\n        int[] res = twoSum(nums, target);\n        System.out.println(res[0] + " " + res[1]);\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <sstream>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your solution here\n    return {};\n}\n\nint main() {\n    string line;\n    getline(cin, line);\n    istringstream iss(line);\n    vector<int> nums;\n    int n;\n    while (iss >> n) nums.push_back(n);\n    int target;\n    cin >> target;\n    auto res = twoSum(nums, target);\n    cout << res[0] << " " << res[1] << endl;\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nvoid twoSum(int* nums, int numsSize, int target, int* result) {\n    // Write your solution here\n}\n\nint main() {\n    int nums[10000], n = 0, target;\n    char line[100000];\n    fgets(line, sizeof(line), stdin);\n    char *p = line;\n    while (sscanf(p, "%d", &nums[n]) == 1) {\n        n++;\n        while (*p && *p != ' ') p++;\n        while (*p == ' ') p++;\n    }\n    scanf("%d", &target);\n    int result[2];\n    twoSum(nums, n, target, result);\n    printf("%d %d\\n", result[0], result[1]);\n    return 0;\n}`,
    },
    hints: [
      "A brute-force approach would check every pair — O(n²).",
      "Can you use a hash map to bring it to O(n)?",
      "For each number, check if (target - number) has been seen before.",
    ],
    editorial:
      "Use a hash map to store each number's index as you iterate. For each element, check if `target - nums[i]` already exists in the map. If yes, return both indices. Time: O(n), Space: O(n).",
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    slug: "reverse-string",
    difficulty: "Easy",
    category: "Strings",
    tags: ["strings", "two-pointers"],
    description:
      "Write a function that reverses a string. The input string is given as a single line.",
    inputFormat: "A single line containing a string.",
    outputFormat: "The reversed string.",
    constraints: ["1 ≤ s.length ≤ 10⁵", "s consists of printable ASCII characters."],
    sampleCases: [
      { input: "hello", output: "olleh", explanation: "The string is simply reversed character by character." },
      { input: "Hannah", output: "hannaH" },
    ],
    testCases: [
      { input: "hello", expectedOutput: "olleh" },
      { input: "Hannah", expectedOutput: "hannaH" },
      { input: "a", expectedOutput: "a" },
      { input: "racecar", expectedOutput: "racecar", hidden: true },
      { input: "Hello World!", expectedOutput: "!dlroW olleH", hidden: true },
    ],
    starterCode: {
      javascript: `// Read input and print the reversed string\nconst s = input.trim();\n// Write your solution here\nconsole.log(s);`,
      python: `s = input_data.strip()\n# Write your solution here\nprint(s)`,
      java: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        // Write your solution here\n        System.out.println(s);\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    // Write your solution here\n    cout << s << endl;\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[100001];\n    fgets(s, sizeof(s), stdin);\n    s[strcspn(s, \"\\n\")] = 0;\n    // Write your solution here\n    printf(\"%s\\n\", s);\n    return 0;\n}`,
    },
    hints: ["Use two pointers at the start and end, swap and move inward.", "Or simply use a built-in reverse method."],
    editorial: "Two-pointer: swap characters from both ends moving inward. Time O(n), Space O(1) if in-place.",
  },
  {
    id: "fizzbuzz",
    title: "FizzBuzz",
    slug: "fizzbuzz",
    difficulty: "Easy",
    category: "Basics",
    tags: ["loops", "conditionals"],
    description:
      'Given an integer `n`, print numbers from 1 to `n`. But for multiples of 3 print `"Fizz"`, for multiples of 5 print `"Buzz"`, and for multiples of both 3 and 5 print `"FizzBuzz"`.',
    inputFormat: "A single integer n.",
    outputFormat: "n lines, each containing the number, Fizz, Buzz, or FizzBuzz.",
    constraints: ["1 ≤ n ≤ 10⁵"],
    sampleCases: [
      { input: "5", output: "1\n2\nFizz\n4\nBuzz" },
      { input: "15", output: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz" },
    ],
    testCases: [
      { input: "5", expectedOutput: "1\n2\nFizz\n4\nBuzz" },
      { input: "15", expectedOutput: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz" },
      { input: "1", expectedOutput: "1" },
      { input: "3", expectedOutput: "1\n2\nFizz", hidden: true },
      { input: "30", expectedOutput: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n16\n17\nFizz\n19\nBuzz\nFizz\n22\n23\nFizz\nBuzz\n26\nFizz\n28\n29\nFizzBuzz", hidden: true },
    ],
    starterCode: {
      javascript: `const n = parseInt(input.trim());\n// Write your solution here\n`,
      python: `n = int(input_data.strip())\n# Write your solution here\n`,
      java: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        int n = new Scanner(System.in).nextInt();\n        // Write your solution here\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Write your solution here\n    return 0;\n}`,
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    // Write your solution here\n    return 0;\n}`,
    },
    hints: ["Check divisibility by 15 first, then 3, then 5.", "Use the modulus operator %."],
    editorial: "Simple loop from 1 to n. Check `i % 15 == 0` first, then `i % 3`, then `i % 5`, else print `i`.",
  },
  {
    id: "palindrome-check",
    title: "Palindrome Check",
    slug: "palindrome-check",
    difficulty: "Easy",
    category: "Strings",
    tags: ["strings", "two-pointers"],
    description:
      "Given a string `s`, determine whether it is a palindrome, considering only alphanumeric characters and ignoring cases.\n\nPrint `true` if it is a palindrome, `false` otherwise.",
    inputFormat: "A single line string.",
    outputFormat: "`true` or `false`",
    constraints: ["1 ≤ s.length ≤ 2 × 10⁵"],
    sampleCases: [
      { input: "A man, a plan, a canal: Panama", output: "true", explanation: "After removing non-alphanumeric and lowering: 'amanaplanacanalpanama' is a palindrome." },
      { input: "race a car", output: "false" },
    ],
    testCases: [
      { input: "A man, a plan, a canal: Panama", expectedOutput: "true" },
      { input: "race a car", expectedOutput: "false" },
      { input: " ", expectedOutput: "true" },
      { input: "Was it a car or a cat I saw?", expectedOutput: "true", hidden: true },
      { input: "hello", expectedOutput: "false", hidden: true },
    ],
    starterCode: {
      javascript: `const s = input.trim();\n// Write your solution here\nconsole.log("true or false");`,
      python: `s = input_data.strip()\n# Write your solution here\nprint("true or false")`,
      java: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        String s = new Scanner(System.in).nextLine();\n        // Write your solution here\n        System.out.println("true or false");\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    // Write your solution here\n    cout << "true or false" << endl;\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <ctype.h>\n#include <string.h>\n\nint main() {\n    char s[200001];\n    fgets(s, sizeof(s), stdin);\n    // Write your solution here\n    printf(\"true or false\\n\");\n    return 0;\n}`,
    },
    hints: ["Filter out non-alphanumeric characters first.", "Compare the cleaned string with its reverse."],
    editorial: "Filter non-alphanumeric, lowercase everything, then use two pointers from both ends. O(n) time.",
  },
  {
    id: "max-subarray",
    title: "Maximum Subarray",
    slug: "maximum-subarray",
    difficulty: "Medium",
    category: "Arrays",
    tags: ["arrays", "dynamic-programming", "greedy"],
    description:
      "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    inputFormat: "A single line of space-separated integers.",
    outputFormat: "A single integer — the maximum subarray sum.",
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
    sampleCases: [
      { input: "-2 1 -3 4 -1 2 1 -5 4", output: "6", explanation: "The subarray [4, -1, 2, 1] has the largest sum = 6." },
      { input: "1", output: "1" },
      { input: "5 4 -1 7 8", output: "23" },
    ],
    testCases: [
      { input: "-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6" },
      { input: "1", expectedOutput: "1" },
      { input: "5 4 -1 7 8", expectedOutput: "23" },
      { input: "-1", expectedOutput: "-1", hidden: true },
      { input: "-2 -1", expectedOutput: "-1", hidden: true },
    ],
    starterCode: {
      javascript: `const nums = input.trim().split(" ").map(Number);\n// Write your solution here — print the max subarray sum\n`,
      python: `nums = list(map(int, input_data.strip().split()))\n# Write your solution here\n`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String[] parts = sc.nextLine().split(" ");\n        int[] nums = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);\n        // Write your solution here\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <sstream>\nusing namespace std;\n\nint main() {\n    string line;\n    getline(cin, line);\n    istringstream iss(line);\n    vector<int> nums;\n    int n;\n    while (iss >> n) nums.push_back(n);\n    // Write your solution here\n    return 0;\n}`,
      c: `#include <stdio.h>\n\nint main() {\n    int nums[100000], n = 0, x;\n    while (scanf(\"%d\", &x) == 1) nums[n++] = x;\n    // Write your solution here\n    return 0;\n}`,
    },
    hints: [
      "Kadane's algorithm solves this in O(n).",
      "Track the current subarray sum; reset it to 0 when it goes negative.",
      "Keep a global max updated at each step.",
    ],
    editorial:
      "Kadane's Algorithm: maintain `currentSum` and `maxSum`. At each element, `currentSum = max(num, currentSum + num)`. Update `maxSum = max(maxSum, currentSum)`. O(n) time, O(1) space.",
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    difficulty: "Easy",
    category: "Stacks",
    tags: ["stacks", "strings"],
    description:
      'Given a string `s` containing just the characters `\'(\'`, `\')\'`, `\'{\'`, `\'}\'`, `\'[\'` and `\']\'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets are closed by the same type.\n2. Open brackets are closed in the correct order.\n3. Every close bracket has a corresponding open bracket.',
    inputFormat: "A single line containing the string of brackets.",
    outputFormat: "`true` or `false`",
    constraints: ["1 ≤ s.length ≤ 10⁴", "s consists of parentheses only: ()[]{}"],
    sampleCases: [
      { input: "()", output: "true" },
      { input: "()[]{}", output: "true" },
      { input: "(]", output: "false" },
    ],
    testCases: [
      { input: "()", expectedOutput: "true" },
      { input: "()[]{}", expectedOutput: "true" },
      { input: "(]", expectedOutput: "false" },
      { input: "([)]", expectedOutput: "false", hidden: true },
      { input: "{[]}", expectedOutput: "true", hidden: true },
      { input: "(", expectedOutput: "false", hidden: true },
    ],
    starterCode: {
      javascript: `const s = input.trim();\n// Write your solution here\nconsole.log("true or false");`,
      python: `s = input_data.strip()\n# Write your solution here\nprint("true or false")`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        String s = new Scanner(System.in).nextLine();\n        // Write your solution here\n        System.out.println("true or false");\n    }\n}`,
      cpp: `#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    // Write your solution here\n    cout << "true or false" << endl;\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[10001];\n    scanf(\"%s\", s);\n    // Write your solution here\n    printf(\"true or false\\n\");\n    return 0;\n}`,
    },
    hints: ["Use a stack to track opening brackets.", "When you see a closing bracket, check if the top of the stack matches."],
    editorial: "Push opening brackets onto a stack. For each closing bracket, check the stack top matches. At the end, the stack must be empty. O(n).",
  },
  {
    id: "binary-search",
    title: "Binary Search",
    slug: "binary-search",
    difficulty: "Easy",
    category: "Searching",
    tags: ["binary-search", "arrays"],
    description:
      "Given a **sorted** array of integers `nums` and an integer `target`, return the **index** of `target`. If `target` is not found, return `-1`.",
    inputFormat: "First line: space-separated sorted integers\nSecond line: the target integer",
    outputFormat: "The index of target, or -1.",
    constraints: ["1 ≤ nums.length ≤ 10⁴", "-10⁴ ≤ nums[i], target ≤ 10⁴", "All values in nums are unique.", "nums is sorted in ascending order."],
    sampleCases: [
      { input: "-1 0 3 5 9 12\n9", output: "4" },
      { input: "-1 0 3 5 9 12\n2", output: "-1" },
    ],
    testCases: [
      { input: "-1 0 3 5 9 12\n9", expectedOutput: "4" },
      { input: "-1 0 3 5 9 12\n2", expectedOutput: "-1" },
      { input: "5\n5", expectedOutput: "0" },
      { input: "1 2 3 4 5 6 7 8 9 10\n10", expectedOutput: "9", hidden: true },
      { input: "1 2 3 4 5 6 7 8 9 10\n0", expectedOutput: "-1", hidden: true },
    ],
    starterCode: {
      javascript: `const lines = input.trim().split("\\n");\nconst nums = lines[0].split(" ").map(Number);\nconst target = parseInt(lines[1]);\n// Write your solution here\n`,
      python: `lines = input_data.strip().split("\\n")\nnums = list(map(int, lines[0].split()))\ntarget = int(lines[1])\n# Write your solution here\n`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String[] p = sc.nextLine().split(" ");\n        int[] nums = new int[p.length];\n        for(int i=0;i<p.length;i++) nums[i]=Integer.parseInt(p[i]);\n        int target = sc.nextInt();\n        // Write your solution here\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <sstream>\nusing namespace std;\n\nint main() {\n    string line;\n    getline(cin, line);\n    istringstream iss(line);\n    vector<int> nums;\n    int n;\n    while(iss >> n) nums.push_back(n);\n    int target;\n    cin >> target;\n    // Write your solution here\n    return 0;\n}`,
      c: `#include <stdio.h>\n\nint main() {\n    int nums[10000], n=0, target, x;\n    char line[100000];\n    fgets(line, sizeof(line), stdin);\n    char *p = line;\n    while(sscanf(p,\"%d\",&x)==1){nums[n++]=x;while(*p&&*p!=' ')p++;while(*p==' ')p++;}\n    scanf(\"%d\", &target);\n    // Write your solution here\n    return 0;\n}`,
    },
    hints: ["Use two pointers: left and right.", "Compare the middle element with target to decide which half to search."],
    editorial: "Classic binary search. Maintain left/right bounds, check mid. O(log n).",
  },
  {
    id: "merge-sorted-arrays",
    title: "Merge Two Sorted Arrays",
    slug: "merge-sorted-arrays",
    difficulty: "Easy",
    category: "Arrays",
    tags: ["arrays", "two-pointers", "sorting"],
    description:
      "Given two sorted integer arrays `nums1` and `nums2`, merge them into a single sorted array and print the result.",
    inputFormat: "First line: space-separated integers (nums1)\nSecond line: space-separated integers (nums2)",
    outputFormat: "A single line of space-separated sorted integers.",
    constraints: ["0 ≤ nums1.length, nums2.length ≤ 10⁴"],
    sampleCases: [
      { input: "1 2 4\n1 3 4", output: "1 1 2 3 4 4" },
      { input: "1\n0", output: "0 1" },
    ],
    testCases: [
      { input: "1 2 4\n1 3 4", expectedOutput: "1 1 2 3 4 4" },
      { input: "1\n0", expectedOutput: "0 1" },
      { input: "\n1", expectedOutput: "1", hidden: true },
      { input: "1 3 5 7\n2 4 6 8", expectedOutput: "1 2 3 4 5 6 7 8", hidden: true },
    ],
    starterCode: {
      javascript: `const lines = input.trim().split("\\n");\nconst nums1 = lines[0] ? lines[0].split(" ").map(Number) : [];\nconst nums2 = lines[1] ? lines[1].split(" ").map(Number) : [];\n// Write your solution here\n`,
      python: `lines = input_data.strip().split("\\n")\nnums1 = list(map(int, lines[0].split())) if lines[0] else []\nnums2 = list(map(int, lines[1].split())) if len(lines)>1 and lines[1] else []\n# Write your solution here\n`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String l1 = sc.nextLine().trim();\n        String l2 = sc.nextLine().trim();\n        // Parse and solve\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <sstream>\nusing namespace std;\n\nint main() {\n    string line1, line2;\n    getline(cin, line1);\n    getline(cin, line2);\n    // Parse and solve\n    return 0;\n}`,
      c: `#include <stdio.h>\n\nint main() {\n    // Read two lines of integers, merge and sort\n    return 0;\n}`,
    },
    hints: ["Use the two-pointer technique since both arrays are already sorted."],
    editorial: "Two pointers, one on each array. Compare heads and push smaller. O(n + m).",
  },
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    slug: "climbing-stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    tags: ["dynamic-programming", "math"],
    description:
      "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    inputFormat: "A single integer n.",
    outputFormat: "A single integer — the number of distinct ways.",
    constraints: ["1 ≤ n ≤ 45"],
    sampleCases: [
      { input: "2", output: "2", explanation: "1+1 or 2. Two ways." },
      { input: "3", output: "3", explanation: "1+1+1, 1+2, 2+1. Three ways." },
    ],
    testCases: [
      { input: "2", expectedOutput: "2" },
      { input: "3", expectedOutput: "3" },
      { input: "1", expectedOutput: "1" },
      { input: "5", expectedOutput: "8", hidden: true },
      { input: "10", expectedOutput: "89", hidden: true },
    ],
    starterCode: {
      javascript: `const n = parseInt(input.trim());\n// Write your solution here\n`,
      python: `n = int(input_data.strip())\n# Write your solution here\n`,
      java: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        int n = new Scanner(System.in).nextInt();\n        // Write your solution here\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Write your solution here\n    return 0;\n}`,
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    // Write your solution here\n    return 0;\n}`,
    },
    hints: ["This is the Fibonacci sequence.", "dp[i] = dp[i-1] + dp[i-2]"],
    editorial: "This is equivalent to Fibonacci. dp[1]=1, dp[2]=2, dp[i]=dp[i-1]+dp[i-2]. O(n).",
  },
  // ─── MEDIUM ───
  {
    id: "longest-substring",
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring",
    difficulty: "Medium",
    category: "Strings",
    tags: ["strings", "sliding-window", "hash-map"],
    description:
      "Given a string `s`, find the length of the **longest substring** without repeating characters.",
    inputFormat: "A single string.",
    outputFormat: "A single integer.",
    constraints: ["0 ≤ s.length ≤ 5 × 10⁴", "s consists of English letters, digits, symbols, and spaces."],
    sampleCases: [
      { input: "abcabcbb", output: "3", explanation: "The answer is 'abc' with length 3." },
      { input: "bbbbb", output: "1" },
      { input: "pwwkew", output: "3" },
    ],
    testCases: [
      { input: "abcabcbb", expectedOutput: "3" },
      { input: "bbbbb", expectedOutput: "1" },
      { input: "pwwkew", expectedOutput: "3" },
      { input: "", expectedOutput: "0", hidden: true },
      { input: "dvdf", expectedOutput: "3", hidden: true },
    ],
    starterCode: {
      javascript: `const s = input.trim();\n// Write your solution here\n`,
      python: `s = input_data.strip()\n# Write your solution here\n`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        String s = new Scanner(System.in).nextLine();\n        // Write your solution here\n    }\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    // Write your solution here\n    return 0;\n}`,
      c: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[50001];\n    fgets(s, sizeof(s), stdin);\n    s[strcspn(s,\"\\n\")]=0;\n    // Write your solution here\n    return 0;\n}`,
    },
    hints: ["Use a sliding window approach.", "Maintain a set of characters in the current window.", "When a duplicate is found, shrink the window from the left."],
    editorial: "Sliding window with a hash set. Expand right, shrink left on duplicates. Track max window size. O(n).",
  },
  {
    id: "linked-list-cycle",
    title: "Detect Cycle in Linked List",
    slug: "linked-list-cycle",
    difficulty: "Medium",
    category: "Linked Lists",
    tags: ["linked-lists", "two-pointers"],
    description:
      'Given an array representing linked list values and a `pos` indicating where the tail connects to (0-indexed, -1 if no cycle), determine if the linked list has a cycle.\n\nPrint `true` if there is a cycle, `false` otherwise.',
    inputFormat: "First line: space-separated node values\nSecond line: pos (-1 for no cycle)",
    outputFormat: "`true` or `false`",
    constraints: ["0 ≤ list length ≤ 10⁴", "-10⁵ ≤ Node.val ≤ 10⁵", "pos is -1 or a valid index"],
    sampleCases: [
      { input: "3 2 0 -4\n1", output: "true", explanation: "Tail connects to node at index 1." },
      { input: "1 2\n0", output: "true" },
      { input: "1\n-1", output: "false" },
    ],
    testCases: [
      { input: "3 2 0 -4\n1", expectedOutput: "true" },
      { input: "1 2\n0", expectedOutput: "true" },
      { input: "1\n-1", expectedOutput: "false" },
      { input: "1 2 3 4 5\n-1", expectedOutput: "false", hidden: true },
      { input: "1 2 3 4 5\n2", expectedOutput: "true", hidden: true },
    ],
    starterCode: {
      javascript: `const lines = input.trim().split("\\n");\nconst values = lines[0].split(" ").map(Number);\nconst pos = parseInt(lines[1]);\n// Simulate: if pos >= 0, there's a cycle\n// Write your solution here\n`,
      python: `lines = input_data.strip().split("\\n")\nvalues = list(map(int, lines[0].split()))\npos = int(lines[1])\n# Write your solution here\n`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String[] p = sc.nextLine().split(" ");\n        int pos = sc.nextInt();\n        // Write your solution here\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <sstream>\nusing namespace std;\n\nint main() {\n    string line;\n    getline(cin, line);\n    int pos;\n    cin >> pos;\n    // Write your solution here\n    return 0;\n}`,
      c: `#include <stdio.h>\n\nint main() {\n    // Read values and pos, determine cycle\n    return 0;\n}`,
    },
    hints: ["Floyd's Tortoise and Hare algorithm.", "Use slow and fast pointers."],
    editorial: "Floyd's cycle detection: slow moves 1 step, fast moves 2 steps. If they meet, there's a cycle. O(n) time, O(1) space.",
  },
  {
    id: "sort-array",
    title: "Sort an Array",
    slug: "sort-array",
    difficulty: "Medium",
    category: "Sorting",
    tags: ["sorting", "divide-and-conquer"],
    description: "Given an array of integers `nums`, sort the array in ascending order and return it. You must solve it **without using built-in sort functions**.",
    inputFormat: "A single line of space-separated integers.",
    outputFormat: "A single line of space-separated sorted integers.",
    constraints: ["1 ≤ nums.length ≤ 5 × 10⁴", "-5 × 10⁴ ≤ nums[i] ≤ 5 × 10⁴"],
    sampleCases: [
      { input: "5 2 3 1", output: "1 2 3 5" },
      { input: "5 1 1 2 0 0", output: "0 0 1 1 2 5" },
    ],
    testCases: [
      { input: "5 2 3 1", expectedOutput: "1 2 3 5" },
      { input: "5 1 1 2 0 0", expectedOutput: "0 0 1 1 2 5" },
      { input: "1", expectedOutput: "1" },
      { input: "3 -1 0 2 -5", expectedOutput: "-5 -1 0 2 3", hidden: true },
      { input: "10 9 8 7 6 5 4 3 2 1", expectedOutput: "1 2 3 4 5 6 7 8 9 10", hidden: true },
    ],
    starterCode: {
      javascript: `const nums = input.trim().split(" ").map(Number);\n// Implement merge sort, quick sort, or another O(n log n) algorithm\n`,
      python: `nums = list(map(int, input_data.strip().split()))\n# Implement merge sort or quick sort\n`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String[] p = sc.nextLine().split(" ");\n        int[] nums = new int[p.length];\n        for(int i=0;i<p.length;i++) nums[i]=Integer.parseInt(p[i]);\n        // Implement sorting\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <sstream>\nusing namespace std;\n\nint main() {\n    string line;\n    getline(cin, line);\n    istringstream iss(line);\n    vector<int> nums;\n    int n;\n    while(iss >> n) nums.push_back(n);\n    // Implement sorting\n    return 0;\n}`,
      c: `#include <stdio.h>\n\nint main() {\n    int nums[50000], n=0, x;\n    while(scanf(\"%d\",&x)==1) nums[n++]=x;\n    // Implement sorting\n    return 0;\n}`,
    },
    hints: ["Merge sort guarantees O(n log n) in all cases.", "Quick sort has O(n log n) average but O(n²) worst case."],
    editorial: "Implement merge sort for guaranteed O(n log n). Divide array in half, recursively sort, then merge.",
  },
  // ─── HARD ───
  {
    id: "median-two-sorted",
    title: "Median of Two Sorted Arrays",
    slug: "median-two-sorted",
    difficulty: "Hard",
    category: "Arrays",
    tags: ["arrays", "binary-search", "divide-and-conquer"],
    description:
      "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the **median** of the two sorted arrays.\n\nThe overall run-time complexity should be **O(log(m+n))**.",
    inputFormat: "First line: space-separated integers (nums1)\nSecond line: space-separated integers (nums2)",
    outputFormat: "The median as a number (with one decimal place if not an integer).",
    constraints: ["0 ≤ m, n ≤ 1000", "1 ≤ m + n ≤ 2000", "-10⁶ ≤ nums1[i], nums2[i] ≤ 10⁶"],
    sampleCases: [
      { input: "1 3\n2", output: "2.0", explanation: "merged = [1,2,3], median = 2.0" },
      { input: "1 2\n3 4", output: "2.5", explanation: "merged = [1,2,3,4], median = (2+3)/2 = 2.5" },
    ],
    testCases: [
      { input: "1 3\n2", expectedOutput: "2.0" },
      { input: "1 2\n3 4", expectedOutput: "2.5" },
      { input: "\n1", expectedOutput: "1.0", hidden: true },
      { input: "1 2 3 4 5\n6 7 8 9 10", expectedOutput: "5.5", hidden: true },
    ],
    starterCode: {
      javascript: `const lines = input.trim().split("\\n");\nconst nums1 = lines[0] ? lines[0].split(" ").map(Number) : [];\nconst nums2 = lines[1] ? lines[1].split(" ").map(Number) : [];\n// Write your solution here\n`,
      python: `lines = input_data.strip().split("\\n")\nnums1 = list(map(int, lines[0].split())) if lines[0] else []\nnums2 = list(map(int, lines[1].split())) if len(lines)>1 and lines[1] else []\n# Write your solution here\n`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Parse two arrays and find median\n    }\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <sstream>\nusing namespace std;\n\nint main() {\n    // Parse two arrays and find median\n    return 0;\n}`,
      c: `#include <stdio.h>\n\nint main() {\n    // Parse two arrays and find median\n    return 0;\n}`,
    },
    hints: [
      "A simple O(m+n) approach: merge and find middle.",
      "For O(log(min(m,n))): use binary search on the shorter array.",
      "Partition both arrays such that left halves combined equal right halves combined.",
    ],
    editorial: "Binary search on the shorter array. Partition so left side count equals right. Check max(leftA, leftB) ≤ min(rightA, rightB). O(log(min(m,n))).",
  },
  {
    id: "lru-cache",
    title: "LRU Cache",
    slug: "lru-cache",
    difficulty: "Hard",
    category: "Design",
    tags: ["hash-map", "linked-lists", "design"],
    description:
      'Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.\n\nImplement operations:\n- `PUT key value` — Set the key to value. If the cache exceeds capacity, evict the least recently used key.\n- `GET key` — Return the value or -1 if not found.\n\nProcess a series of operations and output the result of each GET.',
    inputFormat: "First line: capacity\nFollowing lines: operations (PUT key value or GET key)",
    outputFormat: "For each GET, print the result on a new line.",
    constraints: ["1 ≤ capacity ≤ 3000", "0 ≤ key, value ≤ 10⁴", "At most 2 × 10⁵ operations."],
    sampleCases: [
      {
        input: "2\nPUT 1 1\nPUT 2 2\nGET 1\nPUT 3 3\nGET 2\nPUT 4 4\nGET 1\nGET 3\nGET 4",
        output: "1\n-1\n-1\n3\n4",
        explanation: "After PUT 3, key 2 is evicted (LRU). After PUT 4, key 1 is evicted.",
      },
    ],
    testCases: [
      {
        input: "2\nPUT 1 1\nPUT 2 2\nGET 1\nPUT 3 3\nGET 2\nPUT 4 4\nGET 1\nGET 3\nGET 4",
        expectedOutput: "1\n-1\n-1\n3\n4",
      },
      { input: "1\nPUT 1 10\nGET 1\nPUT 2 20\nGET 1\nGET 2", expectedOutput: "10\n-1\n20", hidden: true },
    ],
    starterCode: {
      javascript: `const lines = input.trim().split("\\n");\nconst capacity = parseInt(lines[0]);\n// Implement LRU Cache and process operations\nfor (let i = 1; i < lines.length; i++) {\n  const parts = lines[i].split(" ");\n  // Handle PUT and GET\n}\n`,
      python: `lines = input_data.strip().split("\\n")\ncapacity = int(lines[0])\n# Implement LRU Cache and process operations\n`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int capacity = Integer.parseInt(sc.nextLine());\n        // Implement LRU Cache\n    }\n}`,
      cpp: `#include <iostream>\n#include <unordered_map>\n#include <list>\nusing namespace std;\n\nint main() {\n    int capacity;\n    cin >> capacity;\n    cin.ignore();\n    // Implement LRU Cache\n    return 0;\n}`,
      c: `#include <stdio.h>\n\nint main() {\n    int capacity;\n    scanf(\"%d\", &capacity);\n    // Implement LRU Cache\n    return 0;\n}`,
    },
    hints: [
      "Use a hash map + doubly linked list.",
      "The hash map gives O(1) lookup, the linked list maintains order.",
      "On each access, move the node to the head of the list.",
    ],
    editorial: "Hash map maps key → linked list node. Doubly linked list tracks recency. GET and PUT both O(1).",
  },
  {
    id: "n-queens",
    title: "N-Queens",
    slug: "n-queens",
    difficulty: "Hard",
    category: "Backtracking",
    tags: ["backtracking", "recursion"],
    description:
      "The **N-Queens** puzzle is the problem of placing `n` queens on an `n × n` chessboard such that no two queens attack each other.\n\nGiven an integer `n`, print the number of distinct solutions.",
    inputFormat: "A single integer n.",
    outputFormat: "A single integer — the number of solutions.",
    constraints: ["1 ≤ n ≤ 9"],
    sampleCases: [
      { input: "4", output: "2" },
      { input: "1", output: "1" },
    ],
    testCases: [
      { input: "4", expectedOutput: "2" },
      { input: "1", expectedOutput: "1" },
      { input: "8", expectedOutput: "92", hidden: true },
      { input: "5", expectedOutput: "10", hidden: true },
    ],
    starterCode: {
      javascript: `const n = parseInt(input.trim());\n// Write your solution here\n`,
      python: `n = int(input_data.strip())\n# Write your solution here\n`,
      java: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        int n = new Scanner(System.in).nextInt();\n        // Write your solution here\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Write your solution here\n    return 0;\n}`,
      c: `#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    // Write your solution here\n    return 0;\n}`,
    },
    hints: [
      "Use backtracking: place queens row by row.",
      "Track columns, diagonals, and anti-diagonals that are under attack.",
    ],
    editorial: "Backtracking: place one queen per row, use sets to track attacked columns and diagonals. O(n!).",
  },
];

export const codingCourses: CodingCourse[] = [
  {
    id: "c-programming",
    title: "C Programming",
    description: "Master the fundamentals of C — pointers, memory, and low-level programming.",
    icon: "🔧",
    problemIds: ["fizzbuzz", "reverse-string", "binary-search", "sort-array", "n-queens"],
  },
  {
    id: "data-structures",
    title: "Data Structures",
    description: "Arrays, linked lists, stacks, trees, and more — the building blocks of algorithms.",
    icon: "🏗️",
    problemIds: ["two-sum", "valid-parentheses", "linked-list-cycle", "lru-cache", "max-subarray"],
  },
  {
    id: "python-fundamentals",
    title: "Python Fundamentals",
    description: "Learn Python through hands-on problems from beginner to advanced.",
    icon: "🐍",
    problemIds: ["fizzbuzz", "reverse-string", "palindrome-check", "climbing-stairs", "longest-substring"],
  },
  {
    id: "java-mastery",
    title: "Java Mastery",
    description: "Strengthen your Java skills with classic algorithm and data structure challenges.",
    icon: "☕",
    problemIds: ["two-sum", "binary-search", "merge-sorted-arrays", "sort-array", "median-two-sorted"],
  },
  {
    id: "javascript-challenges",
    title: "JavaScript Challenges",
    description: "Solve real-world coding challenges using modern JavaScript.",
    icon: "⚡",
    problemIds: ["fizzbuzz", "two-sum", "valid-parentheses", "longest-substring", "lru-cache"],
  },
];

export const allTags = Array.from(new Set(codingProblems.flatMap((p) => p.tags))).sort();
export const allCategories = Array.from(new Set(codingProblems.map((p) => p.category))).sort();
