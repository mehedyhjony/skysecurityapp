
import { Module, Lab, BlogPost } from './types';

// --- SECTOR GENERATORS (Existing) ---
const generateTacticalLabs = (
  sectorPrefix: string, 
  phases: { name: string, technique: string, bnTechnique: string, tools: string[], os: string }[],
  labCount: number = 300,
  isDefensive: boolean = false
): Lab[] => {
  const labsPerPhase = Math.ceil(labCount / phases.length);
  
  return Array.from({ length: labCount }, (_, i) => {
    const phaseIndex = Math.min(Math.floor(i / labsPerPhase), phases.length - 1);
    const phase = phases[phaseIndex];
    const subId = (i % labsPerPhase) + 1;
    
    const difficulty = i < (labCount * 0.3) ? "Foundational" : i < (labCount * 0.7) ? "Specialist" : "Elite";
    const labNumber = String(i + 1).padStart(4, '0');
    
    const instructions = isDefensive ? [
      `Phase Shield: Configure ${phase.tools[0]} rules on node 0x${(i + 100).toString(16)}.`,
      `Analysis: Detect the ${difficulty.toLowerCase()} breach attempt in ${phase.name}.`,
      `Remediation: Deploy the hardening patch version ${subId}.0.safe.`,
      `Integrity: Verify the system hash {SKY_${sectorPrefix}_SECURE_${i}} matches the baseline.`
    ] : [
      `Phase Recon: Execute ${phase.tools[0]} against target node 0x${(i + 100).toString(16)}.`,
      `Analysis: Identify the ${difficulty.toLowerCase()} security flaw in the ${phase.name} configuration.`,
      `Exploitation: Deploy the tactical payload version ${subId}.0.alpha.`,
      `Confirmation: Retrieve the unique signature {SKY_${sectorPrefix}_SIG_${i}} from the target environment.`
    ];

    const bnInstructions = isDefensive ? [
      `${phase.tools[0]} ব্যবহার করে নোড (node) 0x${(i + 100).toString(16)} এ সিকিউরিটি রুল কনফিগার করুন।`,
      `${phase.name} এ ${difficulty.toLowerCase()} ব্রিচ অ্যাটেম্পট (breach attempt) শনাক্ত করুন।`,
      `হার্ডেনিং প্যাচ (hardening patch) ভার্সন ${subId}.0.safe ডেপ্লয় করুন।`,
      `সিস্টেম হাশ (system hash) {SKY_${sectorPrefix}_SECURE_${i}} বেসলাইনের সাথে যাচাই করুন।`
    ] : [
      `${phase.tools[0]} ব্যবহার করে টার্গেট নোড (target node) 0x${(i + 100).toString(16)} এর উপর ফেজ রিকন শুরু করুন।`,
      `${phase.name} কনফিগারেশনে ${difficulty.toLowerCase()} সিকিউরিটি ফ্ল শনাক্ত করুন।`,
      `ট্যাকটিক্যাল পেলোড (tactical payload) ভার্সন ${subId}.0.alpha ডেপ্লয় করুন।`,
      `টার্গেট এনভায়রনমেন্ট থেকে ইউনিক সিগনেচার {SKY_${sectorPrefix}_SIG_${i}} সংগ্রহ করুন।`
    ];

    const finalCommand = isDefensive ? 
      `sky-shield --monitor --node 10.0.${phaseIndex}.${subId} --policy-id P-${i}` :
      `sky-breach --exploit ${sectorPrefix.toLowerCase()} --target-id ${i} --payload auto`;

    const redSetup = `[RED_TEAM_PROTOCOL_44]:
1. Provisioning Offensive Kali Instance on Subnet 10.10.${phaseIndex}.0/24.
2. Initializing Exploitation Framework: ${phase.tools.join(', ')}.
3. Deploying Vulnerable Target Node: ${phase.os} @ 10.10.${phaseIndex}.${subId}.
4. Tunneling Command & Control (C2) through encrypted proxy...
5. READY. Target identity confirmed.`;

    const blueSetup = `[BLUE_TEAM_PROTOCOL_SECURE]:
1. Provisioning Defensive SIEM Node (Splunk/ELK) on Subnet 192.168.${phaseIndex}.0/24.
2. Mounting Defense Arsenal: ${phase.tools.join(', ')} Monitoring Agents.
3. Deploying Hardened Gateway: ${phase.os} @ 192.168.${phaseIndex}.${subId}.
4. Initializing Real-time Packet Inspection and Log Aggregation...
5. READY. Perimeter secure. Monitoring for anomalies...`;

    return {
      name: `${sectorPrefix}-${labNumber}: ${phase.name} (Mod ${subId})`,
      objective: `[${difficulty}] ${isDefensive ? 'Defensive hardening' : 'Offensive exploitation'} of ${phase.name}. Mission: Secure 0x${(5000 + i).toString(16)} using tactical methods.`,
      bnObjective: `[${difficulty}] ${phase.name} এর ${isDefensive ? 'ডিফেন্সিভ হার্ডেনিং' : 'অফেন্সিভ এক্সপ্লয়টেশন'}। মিশন: ০x${(5000 + i).toString(16)} নোডটি সুরক্ষিত করা।`,
      hackerTechnique: phase.technique,
      bnHackerTechnique: phase.bnTechnique,
      command: finalCommand,
      targetOs: phase.os,
      requiredTools: phase.tools,
      setupWalkthrough: isDefensive ? blueSetup : redSetup,
      instructions,
      bnInstructions,
      quiz: [{
        question: `What is the primary objective in this ${phase.name} scenario?`,
        options: ["Neutralize the threat", "Execute the payload", "Monitor traffic", "Update the kernel"],
        correctAnswer: isDefensive ? 0 : 1
      }]
    };
  });
};

// --- DATA DEFINITIONS ---

const webRedPhases = [
  { name: "SQL Injection", technique: "Union-based exfiltration.", bnTechnique: "ইউনিয়ন-বেসড ডাটা এক্সফিল্ট্রেশন।", tools: ["SQLMap"], os: "Ubuntu/MySQL" },
  { name: "XSS Mastery", technique: "Stored/DOM-based session hijacking.", bnTechnique: "স্টোর্ড/ডম-বেসড সেশন হাইজ্যাকিং।", tools: ["BeEF"], os: "Debian/Apache" }
];
const webBluePhases = [
  { name: "SQLi Defense", technique: "Implementing prepared statements.", bnTechnique: "প্রিপেয়ারড স্টেটমেন্ট ইমপ্লিমেন্ট করা।", tools: ["WAF", "ModSecurity"], os: "Linux Gateway" },
  { name: "XSS Sanitization", technique: "Enforcing strict CSP policies.", bnTechnique: "কঠোর CSP পলিসি প্রয়োগ করা।", tools: ["CSP-Gen"], os: "Web Node" }
];

const netRedPhases = [
  { name: "Network Recon", technique: "Stealth port scanning.", bnTechnique: "স্টিলথ পোর্ট স্ক্যানিং।", tools: ["Nmap"], os: "Kali Linux" },
  { name: "AD Exploitation", technique: "Kerberoasting and Relay attacks.", bnTechnique: "কার্বারোস্টিং এবং রিলে অ্যাটাক।", tools: ["Mimikatz"], os: "Windows Server" }
];
const netBluePhases = [
  { name: "IDS Monitoring", technique: "Analyzing traffic for scan patterns.", bnTechnique: "স্ক্যান প্যাটার্ন শনাক্ত করতে ট্রাফিক অ্যানালাইসিস করা।", tools: ["Snort"], os: "Sensor Node" },
  { name: "Hardening AD", technique: "Disabling LLMNR/NBT-NS.", bnTechnique: "LLMNR/NBT-NS নিষ্ক্রিয় করা।", tools: ["GPO"], os: "Domain Controller" }
];

const passRedPhases = [
  { name: "Online Bruteforce", technique: "Credential cracking via live services.", bnTechnique: "লাইভ সার্ভিসের মাধ্যমে ক্রেডেনশিয়াল ক্র্যাকিং।", tools: ["Hydra"], os: "SSH Target" },
  { name: "Dictionary Attacks", technique: "Using wordlists like rockyou.txt.", bnTechnique: "রকইউ (rockyou.txt) এর মতো ওয়ার্ডলিস্ট ব্যবহার করা।", tools: ["John"], os: "Offline Lab" }
];
const passBluePhases = [
  { name: "MFA Enforcement", technique: "Enforcing 2FA/FIDO2 challenges.", bnTechnique: "2FA/FIDO2 চ্যালেঞ্জ প্রয়োগ করা।", tools: ["Duo"], os: "Auth Server" },
  { name: "Hashing Audit", technique: "Migrating to Argon2id/Bcrypt.", bnTechnique: "Argon2id/Bcrypt এ মাইগ্রেট করা।", tools: ["Hash-Audit"], os: "DB Node" }
];

const cloudRedPhases = [
  { name: "S3 Exfiltration", technique: "Finding unauthenticated buckets.", bnTechnique: "আনঅথেন্টিকেটেড বাকেট খুঁজে বের করা।", tools: ["S3Scanner"], os: "AWS Admin" },
  { name: "IMDS Hijacking", technique: "Exploiting SSRF for IAM keys.", bnTechnique: "IAM কী-এর জন্য SSRF এক্সপ্লয়েট করা।", tools: ["Pacu"], os: "EC2 Node" }
];
const cloudBluePhases = [
  { name: "Bucket Locking", technique: "Implementing IAM Block Public Access.", bnTechnique: "IAM ব্লক পাবলিক এক্সেস ইমপ্লিমেন্ট করা।", tools: ["AWS-Config"], os: "Cloud Console" },
  { name: "IMDSv2 Enforcement", technique: "Requiring signed metadata tokens.", bnTechnique: "সাইনড মেটাডাটা টোকেন বাধ্যতামূলক করা।", tools: ["CloudTrail"], os: "Policy Engine" }
];

const socialRedPhases = [
  { name: "Spear Phishing", technique: "Crafting highly targeted malicious emails to steal corporate credentials.", bnTechnique: "কর্পোরেট ক্রেডেনশিয়াল চুরি করার জন্য অত্যন্ত লক্ষ্যযুক্ত (targeted) ম্যালিশিয়াস ইমেইল তৈরি করা।", tools: ["Social Engineer Toolkit (SET)", "Gophish"], os: "Attacker VM" },
  { name: "Vishing (Voice)", technique: "Impersonating IT support over voice calls to bypass MFA.", bnTechnique: "MFA বাইপাস করার জন্য ভয়েস কলের মাধ্যমে IT সাপোর্টের ছদ্মবেশ ধারণ করা।", tools: ["Asterisk", "Deepfake Audio"], os: "VoIP Server" },
  { name: "Baiting", technique: "Leaving infected USB drives in common areas to gain physical entry.", bnTechnique: "শারীরিক প্রবেশাধিকার পাওয়ার জন্য সাধারণ এলাকায় ইনফেক্টেড USB ড্রাইভ ফেলে রাখা।", tools: ["Rubber Ducky", "Malicious HID"], os: "Physical Lab" }
];

const socialBluePhases = [
  { name: "Email Security", technique: "Implementing SPF, DKIM, and DMARC to prevent spoofing and domain misuse.", bnTechnique: "স্পুফিং এবং ডোমেইন অপব্যবহার রোধ করতে SPF, DKIM এবং DMARC ইমপ্লিমেন্ট করা।", tools: ["Proofpoint", "DMARC Analyzer"], os: "Mail Gateway" },
  { name: "Phishing Simulation", technique: "Running internal simulations to identify and train high-risk employees.", bnTechnique: "ঝুঁকিপূর্ণ কর্মীদের শনাক্ত ও প্রশিক্ষণ দেওয়ার জন্য ইন্টারনাল ফিশিং সিমুলেশন চালানো।", tools: ["KnowBe4", "PhishMe"], os: "Security Console" },
  { name: "Identity Verification", technique: "Enforcing strict challenge-response protocols for all helpdesk requests.", bnTechnique: "সব হেল্পডেস্ক রিকোয়েস্টের জন্য কঠোর চ্যালেঞ্জ-রেসপন্স প্রোটোকল প্রয়োগ করা।", tools: ["Okta", "ServiceNow Security"], os: "Auth Hub" }
];

const aiRedPhases = [
  { name: "Prompt Injection", technique: "Bypassing system guardrails via adversarial prompting.", bnTechnique: "অ্যাডভারসারিয়াল প্রম্পটিংয়ের মাধ্যমে সিস্টেম গার্ডরেইল বাইপাস করা।", tools: ["PyRIT", "Garak"], os: "PyTorch Node" },
  { name: "Indirect Injection", technique: "Using external data sources (websites, files) to hijack LLM logic.", bnTechnique: "এক্সটারনাল ডাটা সোর্স (ওয়েবসাইট, ফাইল) ব্যবহার করে LLM লজিক হাইজ্যাক করা।", tools: ["Burp Suite", "Python"], os: "Web Crawler" },
  { name: "Data Exfiltration", technique: "Retrieving PII/secrets from model training sets via extraction attacks.", bnTechnique: "এক্সট্রাকশন অ্যাটাকের মাধ্যমে মডেল ট্রেনিং সেট থেকে PII বা সিক্রেট সংগ্রহ করা।", tools: ["PromptMap", "Python"], os: "Jupyter Cluster" },
  { name: "Membership Inference", technique: "Determining if specific data was used in the model training set.", bnTechnique: "নির্দিষ্ট ডাটা মডেল ট্রেনিং সেটে ব্যবহৃত হয়েছিল কিনা তা নির্ধারণ করা।", tools: ["ART", "Scikit-Learn"], os: "Analytics Node" },
  { name: "Model Poisoning", technique: "Manipulating model behavior via malicious fine-tuning data.", bnTechnique: "ম্যালিশিয়াস ফাইন-টিউনিং ডাটার মাধ্যমে মডেলের আচরণ পরিবর্তন করা।", tools: ["HuggingFace-CLI", "ART"], os: "GPU Farm" },
  { name: "Adversarial Evasion", technique: "Crafting inputs that cause the model to output incorrect or unsafe results.", bnTechnique: "এমন ইনপুট তৈরি করা যা মডেলকে ভুল বা অনিরাপদ ফলাফল দিতে বাধ্য করে।", tools: ["Foolbox", "Torch"], os: "Inference Server" }
];

const aiBluePhases = [
  { name: "Prompt Shielding", technique: "Implementing input filtering and semantic analysis for safety.", bnTechnique: "নিরাপত্তার জন্য ইনপুট ফিল্টারিং এবং সিম্যান্টিক অ্যানালাইসিস প্রয়োগ করা।", tools: ["NeMo Guardrails", "Llama-Guard"], os: "Inference API" },
  { name: "Context Hardening", technique: "Using system prompt isolation and few-shot defensive patterns.", bnTechnique: "সিস্টেম প্রম্পট আইসোলেশন এবং ফিউ-শট ডিফেন্সিভ প্যাটার্ন ব্যবহার করা।", tools: ["LangChain", "OpenAI-Evals"], os: "API Gateway" },
  { name: "RAG Security", technique: "Securing vector databases and preventing retrieval manipulation.", bnTechnique: "ভেক্টর ডাটাবেস সুরক্ষিত করা এবং রিট্রিভাল ম্যানিপুলেশন প্রতিরোধ করা।", tools: ["Pinecone-SEC", "LangChain"], os: "Vector Storage" },
  { name: "Privacy Budgeting", technique: "Applying differential privacy to prevent data extraction attacks.", bnTechnique: "ডাটা এক্সট্রাকশন অ্যাটাক প্রতিরোধে ডিফারেনশিয়াল প্রাইভেসি প্রয়োগ করা।", tools: ["Opacus", "PySyft"], os: "Training Node" },
  { name: "Robustness Audit", technique: "Evaluating model integrity against adversarial drift and jailbreaks.", bnTechnique: "অ্যাডভারসারিয়াল ড্রিফট এবং জেলব্রেকের বিরুদ্ধে মডেল ইন্টিগ্রিটি মূল্যায়ন করা।", tools: ["Azure AI Content Safety", "MLflow"], os: "Compliance Node" },
  { name: "Sanitization Layers", technique: "Implementing output checking and content moderation filters.", bnTechnique: "আউটপুট চেকিং এবং কন্টেন্ট মডারেশন ফিল্টার ইমপ্লিমেন্ট করা।", tools: ["Perspective API", "CleanLab"], os: "Filter Node" }
];

const mobRedPhases = [
  { name: "APK Decompilation", technique: "Analyzing bytecode for hardcoded secrets and logic flaws.", bnTechnique: "হার্ডকোডেড সিক্রেট এবং লজিক ফ্ল খোঁজার জন্য বাইটকোড অ্যানালাইসিস করা।", tools: ["JADX", "Apktool"], os: "Android SDK" },
  { name: "Insecure Storage", technique: "Extracting sensitive data from local SQLite databases and shared prefs.", bnTechnique: "লোকাল SQLite ডাটাবেস এবং শেয়ারড প্রেফারেন্স থেকে সেনসিটিভ ডাটা সংগ্রহ করা।", tools: ["Drozer", "ADB"], os: "Rooted Android" },
  { name: "SSL Pinning Bypass", technique: "Intercepting HTTPS traffic using dynamic instrumentation.", bnTechnique: "ডায়নামিক ইন্সট্রুমেন্টেশন ব্যবহার করে HTTPS ট্রাফিক ইন্টারসেপ্ট করা।", tools: ["Frida", "Burp Suite"], os: "iOS/Android" },
  { name: "IPC Exploitation", technique: "Manipulating intents and activities to bypass authentication.", bnTechnique: "অথেন্টিকেশন বাইপাস করার জন্য ইনটেন্ট এবং অ্যাক্টিভিটি ম্যানিপুলেট করা।", tools: ["Drozer", "Python"], os: "Android Runtime" }
];

const mobBluePhases = [
  { name: "Code Obfuscation", technique: "Renaming classes and methods to hinder reverse engineering.", bnTechnique: "রিভার্স ইঞ্জিনিয়ারিং কঠিন করার জন্য ক্লাস এবং মেথড রিনেম করা।", tools: ["ProGuard", "DexGuard"], os: "Build Server" },
  { name: "Anti-Tampering", technique: "Implementing integrity checks and root/jailbreak detection.", bnTechnique: "ইন্টিগ্রিটি চেক এবং রুট/জেলব্রেক ডিটেকশন ইমপ্লিমেন্ট করা।", tools: ["RASP", "SafetyNet"], os: "Mobile Runtime" },
  { name: "Secure Storage", technique: "Encrypting local assets using hardware-backed KeyStore.", bnTechnique: "হার্ডওয়্যার-ব্যাকড KeyStore ব্যবহার করে লোকাল অ্যাসেট এনক্রিপ্ট করা।", tools: ["Android KeyStore", "Keychain"], os: "Secure Enclave" },
  { name: "Biometric Auth", technique: "Enforcing strong biometric challenges for sensitive actions.", bnTechnique: "সেনসিটিভ অ্যাকশনের জন্য শক্তিশালী বায়োমেট্রিক চ্যালেঞ্জ বাধ্যতামূলক করা।", tools: ["BiometricPrompt", "LocalAuthentication"], os: "Mobile OS" }
];

export const INITIAL_MODULES: Module[] = [
  // RED TEAM SECTORS
  { id: "red-web", title: "Web Pentesting", category: "Web Exploitation", type: "Red Team", difficulty: "Advanced", credits: 10000, labs: generateTacticalLabs("RED-WEB", webRedPhases, 1000) },
  { id: "red-net", title: "Network Pentesting", category: "Infrastructure", type: "Red Team", difficulty: "Advanced", credits: 5000, labs: generateTacticalLabs("RED-NET", netRedPhases, 500) },
  { id: "red-pass", title: "Password Attacks", category: "Auth Sploits", type: "Red Team", difficulty: "Intermediate", credits: 1000, labs: generateTacticalLabs("RED-PASS", passRedPhases, 100) },
  { id: "red-cloud", title: "Cloud Breaching", category: "Cloud Security", type: "Red Team", difficulty: "Advanced", credits: 3000, labs: generateTacticalLabs("RED-CL", cloudRedPhases, 300) },
  { id: "red-social", title: "Social Engineering", category: "Human Hacking", type: "Red Team", difficulty: "Advanced", credits: 5000, labs: generateTacticalLabs("RED-SE", socialRedPhases, 500) },
  { id: "red-ai", title: "AI/LLM Hacking", category: "AI Security", type: "Red Team", difficulty: "Advanced", credits: 4000, labs: generateTacticalLabs("RED-AI", aiRedPhases, 400) },
  { id: "red-mob", title: "Mobile Pentesting", category: "Mobile Security", type: "Red Team", difficulty: "Advanced", credits: 4000, labs: generateTacticalLabs("RED-MOB", mobRedPhases, 400) },
  
  // BLUE TEAM SECTORS
  { id: "blue-web", title: "Web Defense", category: "Application Security", type: "Blue Team", difficulty: "Advanced", credits: 10000, labs: generateTacticalLabs("BLUE-WEB", webBluePhases, 1000, true) },
  { id: "blue-net", title: "Network Hardening", category: "Infrastructure Defense", type: "Blue Team", difficulty: "Advanced", credits: 5000, labs: generateTacticalLabs("BLUE-NET", netBluePhases, 500, true) },
  { id: "blue-pass", title: "Identity Protection", category: "Authentication Defense", type: "Blue Team", difficulty: "Intermediate", credits: 1000, labs: generateTacticalLabs("BLUE-PASS", passBluePhases, 100, true) },
  { id: "blue-cloud", title: "Cloud Guarding", category: "Cloud Hardening", type: "Blue Team", difficulty: "Advanced", credits: 3000, labs: generateTacticalLabs("BLUE-CL", cloudBluePhases, 300, true) },
  { id: "blue-social", title: "Human Firewall", category: "Social Defense", type: "Blue Team", difficulty: "Advanced", credits: 5000, labs: generateTacticalLabs("BLUE-SE", socialBluePhases, 500, true) },
  { id: "blue-ai", title: "AI Shielding", category: "AI Defense", type: "Blue Team", difficulty: "Advanced", credits: 4000, labs: generateTacticalLabs("BLUE-AI", aiBluePhases, 400, true) },
  { id: "blue-mob", title: "Mobile Hardening", category: "Mobile Security", type: "Blue Team", difficulty: "Advanced", credits: 4000, labs: generateTacticalLabs("BLUE-MOB", mobBluePhases, 400, true) }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "lab-001",
    title: "Masterclass: Red Team Lab Architecture Blueprint",
    bnTitle: "মাস্টারক্লাস: রেড টিম ল্যাব আর্কিটেকচার ব্লুপ্রিন্ট",
    author: "Lead_Architect",
    date: "2024-06-15",
    category: "Lab Setup",
    excerpt: "The ultimate guide to building a secure, isolated, and powerful Red Team laboratory. Learn about RAM, CPU, and network segments.",
    bnExcerpt: "একটি সুরক্ষিত, আইসোলেটেড এবং শক্তিশালী রেড টিম ল্যাবরেটরি তৈরির চূড়ান্ত গাইড। র‍্যাম, সিপিইউ এবং নেটওয়ার্ক সেগমেন্ট সম্পর্কে জানুন।",
    content: {
      overview: "Every Red Teamer needs a home base. We recommend a host machine with at least 32GB RAM and 8 CPU cores. Use Proxmox for server-side or VMware Workstation for local virtualization.",
      bnOverview: "প্রত্যেক রেড টিম মেম্বারের একটি হোম বেস প্রয়োজন। আমরা অন্তত ৩২ জিবি র‍্যাম এবং ৮টি সিপিইউ কোর সহ একটি হোস্ট মেশিনের পরামর্শ দিই। সার্ভার-সাইডের জন্য Proxmox বা লোকাল ভার্চুয়ালাইজেশনের জন্য VMware Workstation ব্যবহার করুন।",
      labSetup: "Virtualization: VMware/VirtualBox | Net: Host-Only (10.0.0.0/24)",
      bnLabSetup: "ভার্চুয়ালাইজেশন: VMware/VirtualBox | নেটওয়ার্ক: হোস্ট-অনলি (10.0.0.0/24)",
      attackSteps: [
        "Create Internal Network: Isolated from host LAN.",
        "Provision Host Machine: 32GB RAM recommended.",
        "Setup Firewall VM: Use pfSense to route traffic between lab segments."
      ],
      bnAttackSteps: [
        "ইন্টারনাল নেটওয়ার্ক তৈরি করুন: হোস্ট ল্যান থেকে আইসোলেটেড।",
        "হোস্ট মেশিন প্রোভিশন করুন: ৩২ জিবি র‍্যাম রিকমেন্ডেড।",
        "ফায়ারওয়াল ভিএম সেটআপ করুন: ল্যাব সেগমেন্টের মধ্যে ট্রাফিক রাউট করতে pfSense ব্যবহার করুন।"
      ],
      remediation: "Always use snapshots to revert target machines after exploitation.",
      bnRemediation: "এক্সপ্লয়েটেশনের পরে টার্গেট মেশিনগুলি আগের অবস্থায় ফিরিয়ে নিতে সবসময় স্ন্যাপশট ব্যবহার করুন।"
    }
  },
  {
    id: "lab-002",
    title: "The Offensive Blade: Kali Linux & Commando VM Setup",
    bnTitle: "অফেন্সিভ ব্লেড: কালি লিনাক্স এবং কমান্ডো ভিএম সেটআপ",
    author: "Blade_Master",
    date: "2024-06-16",
    category: "Lab Setup",
    excerpt: "Configure your primary attacker machines. Setup Kali Linux and the Windows-based Commando VM for Active Directory hacking.",
    bnExcerpt: "আপনার প্রাথমিক অ্যাটাকার মেশিনগুলি কনফিগার করুন। অ্যাক্টিভ ডিরেক্টরি হ্যাকিংয়ের জন্য কালি লিনাক্স এবং উইন্ডোজ-ভিত্তিক কমান্ডো ভিএম সেটআপ করুন।",
    content: {
      overview: "You need both Linux and Windows attacker machines. Kali is standard, but Commando VM provides essential Windows-native tools for C# based exploits.",
      bnOverview: "আপনার লিনাক্স এবং উইন্ডোজ উভয় অ্যাটাকার মেশিন প্রয়োজন। কালি লিনাক্স স্ট্যান্ডার্ড, তবে কমান্ডো ভিএম সি-শার্প ভিত্তিক এক্সপ্লয়েটের জন্য প্রয়োজনীয় উইন্ডোজ-নেটিভ টুল সরবরাহ করে।",
      labSetup: "OS 1: Kali Linux (4GB RAM) | OS 2: Windows 10 Pro (8GB RAM) + Commando VM Script",
      bnLabSetup: "ওএস ১: কালি লিনাক্স (৪ জিবি র‍্যাম) | ওএস ২: উইন্ডোজ ১০ প্রো (৮ জিবি র‍্যাম) + কমান্ডো ভিএম স্ক্রিপ্ট",
      attackSteps: [
        "Install Kali Linux: Use the latest rolling release ISO.",
        "Deploy Windows 10: Run the Commando VM installation script.",
        "Sync Tools: Ensure both have Metasploit, Burp Suite, and Python3."
      ],
      bnAttackSteps: [
        "কালি লিনাক্স ইনস্টল করুন: লেটেস্ট রোলিং রিলিজ আইএসও ব্যবহার করুন।",
        "উইন্ডোজ ১০ ডেপ্লয় করুন: কমান্ডো ভিএম ইনস্টলেশন স্ক্রিপ্ট চালান।",
        "টুলস সিঙ্ক করুন: নিশ্চিত করুন যে দুটিতেই মেটাসপ্লয়েট, বার্প স্যুট এবং পাইথন৩ আছে।"
      ],
      remediation: "Keep your attacker tools updated with 'apt update && apt full-upgrade'.",
      bnRemediation: "'apt update && apt full-upgrade' কমান্ড দিয়ে আপনার অ্যাটাকার টুলস সবসময় আপডেট রাখুন।"
    }
  },
  {
    id: "lab-003",
    title: "Web Sector Lab: Dockerizing Vulnerable Apps",
    bnTitle: "ওয়েব সেক্টর ল্যাব: ভালনারেবল অ্যাপস ডকারাইজ করা",
    author: "Web_Ghost",
    date: "2024-06-17",
    category: "Web Exploitation",
    excerpt: "Learn how to use Docker to quickly spawn targets like DVWA, Juice Shop, and Hackazon without manual installation.",
    bnExcerpt: "ম্যানুয়াল ইনস্টলেশন ছাড়াই DVWA, Juice Shop এবং Hackazon-এর মতো টার্গেট দ্রুত তৈরি করতে ডকার কীভাবে ব্যবহার করবেন তা শিখুন।",
    content: {
      overview: "Docker is the most efficient way to manage web targets. One command can spawn a full vulnerable environment.",
      bnOverview: "ওয়েব টার্গেট ম্যানেজ করার সবচেয়ে কার্যকর উপায় হলো ডকার। একটি কমান্ডের মাধ্যমেই সম্পূর্ণ একটি দুর্বল এনভায়রনমেন্ট তৈরি করা সম্ভব।",
      labSetup: "OS: Ubuntu Server (4GB RAM) | Engine: Docker CE + Docker Compose",
      bnLabSetup: "ওএস: উবুন্টু সার্ভার (৪ জিবি র‍্যাম) | ইঞ্জিন: ডকার সিই + ডকার কম্পোজ",
      attackSteps: [
        "Install Docker: sudo apt install docker.io",
        "Spawn Juice Shop: docker run -d -p 3000:3000 bkimminich/juice-shop",
        "Configure Burp Bridge: Redirect all traffic from host to container IP."
      ],
      bnAttackSteps: [
        "ডকার ইনস্টল করুন: sudo apt install docker.io",
        "জুস শপ চালু করুন: docker run -d -p 3000:3000 bkimminich/juice-shop",
        "বার্প ব্রিজ কনফিগার করুন: হোস্ট থেকে কন্টেইনার আইপিতে সব ট্রাফিক রিডাইরেক্ট করুন।"
      ],
      remediation: "Always isolate your Docker network using the --network flag.",
      bnRemediation: "সবসময় --network ফ্ল্যাগ ব্যবহার করে আপনার ডকার নেটওয়ার্ক আইসোলেট করুন।"
    }
  },
  {
    id: "lab-004",
    title: "AD Forest: Building the Infrastructure Lab",
    bnTitle: "এডি ফরেস্ট: ইনফ্রাস্ট্রাকচার ল্যাব তৈরি",
    author: "Domain_Shadow",
    date: "2024-06-18",
    category: "Infrastructure",
    excerpt: "Build a mini-enterprise environment. Step-by-step setup of Windows Server 2022 Domain Controller and Windows 10 clients.",
    bnExcerpt: "একটি মিনি-এন্টারপ্রাইজ এনভায়রনমেন্ট তৈরি করুন। উইন্ডোজ সার্ভার ২০২২ ডোমেইন কন্ট্রোলার এবং উইন্ডোজ ১০ ক্লায়েন্টের ধাপে ধাপে সেটআপ।",
    content: {
      overview: "Infrastructure hacking requires Active Directory. We will set up a forest with a Domain Controller (DC) and joined clients.",
      bnOverview: "ইনফ্রাস্ট্রাকচার হ্যাকিংয়ের জন্য অ্যাক্টিভ ডিরেক্টরি প্রয়োজন। আমরা একটি ডোমেইন কন্ট্রোলার (DC) এবং জয়েন করা ক্লায়েন্ট সহ একটি ফরেস্ট সেটআপ করব।",
      labSetup: "VM1: Win Server 2022 (8GB RAM) | VM2: Win 10 (4GB RAM) | VM3: Win 11 (4GB RAM)",
      bnLabSetup: "ভিএম ১: উইন্ডোজ সার্ভার ২০২২ (৮ জিবি র‍্যাম) | ভিএম ২: উইন্ডোজ ১০ (৪ জিবি র‍্যাম) | ভিএম ৩: উইন্ডোজ ১১ (৪ জিবি র‍্যাম)",
      attackSteps: [
        "Promote DC: Install AD DS and DNS roles.",
        "Join Clients: Connect Windows 10/11 VMs to the .local domain.",
        "Create Users: Setup service accounts with SPNs for Kerberoasting practice."
      ],
      bnAttackSteps: [
        "ডিসি প্রমোট করুন: AD DS এবং DNS রোল ইনস্টল করুন।",
        "ক্লায়েন্ট জয়েন করুন: উইন্ডোজ ১০/১১ ভিএম গুলিকে .local ডোমেইনের সাথে কানেক্ট করুন।",
        "ইউজার তৈরি করুন: কার্বারোস্টিং প্র্যাকটিসের জন্য এসপিএন (SPN) সহ সার্ভিস অ্যাকাউন্ট সেটআপ করুন।"
      ],
      remediation: "Audit logs on the DC using Sysmon to detect lateral movement.",
      bnRemediation: "ল্যাটারাল মুভমেন্ট শনাক্ত করতে Sysmon ব্যবহার করে ডিসি-তে অডিট লগ চেক করুন।"
    }
  },
  {
    id: "lab-005",
    title: "Cracking Rig: Setup Hashcat & Wordlists",
    bnTitle: "ক্র্যাকিং রিগ: হ্যাশক্যাট এবং ওয়ার্ডলিস্ট সেটআপ",
    author: "Hash_Ripper",
    date: "2024-06-19",
    category: "Auth Security",
    excerpt: "Turn your local hardware into a cracking machine. Optimize Hashcat with GPU passthrough and the RockYou wordlist.",
    bnExcerpt: "আপনার লোকাল হার্ডওয়্যারকে একটি ক্র্যাকিং মেশিনে রূপান্তর করুন। জিপিইউ পাসথ্রু এবং RockYou ওয়ার্ডলিস্টের মাধ্যমে হ্যাশক্যাট অপ্টিমাইজ করুন।",
    content: {
      overview: "Passwords aren't hacked, they are cracked. You need Hashcat and a massive collection of wordlists.",
      bnOverview: "পাসওয়ার্ড হ্যাক করা হয় না, ক্র্যাক করা হয়। আপনার হ্যাশক্যাট এবং বিশাল ওয়ার্ডলিস্টের কালেকশন প্রয়োজন।",
      labSetup: "Software: Hashcat v6.x | Wordlists: RockYou.txt, Seclists (GitHub)",
      bnLabSetup: "সফটওয়্যার: হ্যাশক্যাট v6.x | ওয়ার্ডলিস্ট: RockYou.txt, Seclists (GitHub)",
      attackSteps: [
        "Enable GPU: Install OpenCL/CUDA drivers on the host.",
        "Download Wordlists: Clone the SecLists repository.",
        "Performance Test: Run 'hashcat -b' to check your cracking speed."
      ],
      bnAttackSteps: [
        "জিপিইউ এনাবল করুন: হোস্ট মেশিনে OpenCL/CUDA ড্রাইভার ইনস্টল করুন।",
        "ওয়ার্ডলিস্ট ডাউনলোড করুন: SecLists রিপোজিটরি ক্লোন করুন।",
        "পারফরম্যান্স টেস্ট: আপনার ক্র্যাকিং স্পিড চেক করতে 'hashcat -b' কমান্ডটি চালান।"
      ],
      remediation: "Enforce MFA and move away from legacy NTLM hashes.",
      bnRemediation: "সবসময় এমএফএ (MFA) বাধ্যতামূলক করুন এবং পুরনো NTLM হ্যাশ ব্যবহার বন্ধ করুন।"
    }
  },
  {
    id: "lab-006",
    title: "Cloud Simulator: LocalStack & AWS CLI",
    bnTitle: "ক্লাউড সিমুলেটর: লোকালস্ট্যাক এবং এডাব্লিউএস সিএলআই",
    author: "Cloud_Stalker",
    date: "2024-06-20",
    category: "Cloud Security",
    excerpt: "Practice cloud hacking without a credit card. Set up LocalStack to simulate AWS S3, IAM, and Lambda services locally.",
    bnExcerpt: "ক্রেডিট কার্ড ছাড়াই ক্লাউড হ্যাকিং প্র্যাকটিস করুন। এডাব্লিউএস এস৩, আইএএম এবং ল্যাম্বডা সার্ভিস লোকালি সিমুলেট করতে লোকালস্ট্যাক সেটআপ করুন।",
    content: {
      overview: "LocalStack provides a fully functional local AWS environment. Perfect for testing S3 bucket leaks and IAM misconfigurations.",
      bnOverview: "লোকালস্ট্যাক একটি সম্পূর্ণ কার্যকরী লোকাল এডাব্লিউএস এনভায়রনমেন্ট সরবরাহ করে। এস৩ বাকেট লিক এবং আইএএম মিসকনফিগারেশন টেস্ট করার জন্য এটি উপযুক্ত।",
      labSetup: "OS: Linux | Tools: LocalStack, AWS-CLI, Python Boto3",
      bnLabSetup: "ওএস: লিনক্স | টুলস: লোকালস্ট্যাক, এডাব্লিউএস-সিএলআই, পাইথন Boto3",
      attackSteps: [
        "Start LocalStack: docker-compose up -d localstack",
        "Configure CLI: Use 'aws configure' with dummy keys.",
        "Create Bucket: aws --endpoint-url=http://localhost:4566 s3 mb s3://leak-test"
      ],
      bnAttackSteps: [
        "লোকালস্ট্যাক শুরু করুন: docker-compose up -d localstack",
        "সিএলআই কনফিগার করুন: ডামি কী দিয়ে 'aws configure' ব্যবহার করুন।",
        "বাকেট তৈরি করুন: aws --endpoint-url=http://localhost:4566 s3 mb s3://leak-test"
      ],
      remediation: "Always use IAM Condition Keys to restrict cross-account access.",
      bnRemediation: "ক্রস-অ্যাকাউন্ট অ্যাক্সেস সীমাবদ্ধ করতে সবসময় IAM Condition Keys ব্যবহার করুন।"
    }
  },
  {
    id: "lab-007",
    title: "Mobile Lab: Android Emulator & Frida Bridge",
    bnTitle: "মোবাইল ল্যাব: অ্যান্ড্রয়েড এমুলেটর এবং ফ্রিডা ব্রিজ",
    author: "Droid_Runner",
    date: "2024-06-21",
    category: "Mobile Security",
    excerpt: "Setting up a professional mobile pentesting lab with Genymotion, ADB, and dynamic instrumentation using Frida.",
    bnExcerpt: "Genymotion, ADB এবং ফ্রিডা ব্যবহার করে ডায়নামিক ইন্সট্রুমেন্টেশন সহ একটি প্রফেশনাল মোবাইল পেন্টেসিং ল্যাব সেটআপ করুন।",
    content: {
      overview: "Mobile hacking requires specialized emulators. We use rooted AVDs to perform dynamic analysis on APKs.",
      bnOverview: "মোবাইল হ্যাকিংয়ের জন্য বিশেষ এমুলেটর প্রয়োজন। এপিকে-তে ডায়নামিক অ্যানালাইসিস করতে আমরা রুটেড এভিডি (AVD) ব্যবহার করি।",
      labSetup: "Software: Genymotion / Android Studio | Tools: Frida, JADX, ADB",
      bnLabSetup: "সফটওয়্যার: Genymotion / Android Studio | টুলস: ফ্রিডা, JADX, ADB",
      attackSteps: [
        "Launch Emulator: Start a Google Pixel 4 AVD (API 30).",
        "Push Frida Server: adb push frida-server /data/local/tmp/",
        "Inject Script: Use frida-cli to hook into the running application logic."
      ],
      bnAttackSteps: [
        "এমুলেটর চালু করুন: একটি গুগল পিক্সেল ৪ এভিডি (API 30) শুরু করুন।",
        "ফ্রিডা সার্ভার পুশ করুন: adb push frida-server /data/local/tmp/",
        "স্ক্রিপ্ট ইনজেক্ট করুন: রানিং অ্যাপ্লিকেশন লজিক হুক করতে frida-cli ব্যবহার করুন।"
      ],
      remediation: "Implement RASP (Runtime Application Self-Protection) and certificate pinning.",
      bnRemediation: "RASP (Runtime Application Self-Protection) এবং সার্টিফিকেট পিনিং ইমপ্লিমেন্ট করুন।"
    }
  },
  {
    id: "lab-008",
    title: "AI Security Lab: Jupyter & Adversarial Toolkits",
    bnTitle: "এআই সিকিউরিটি ল্যাব: জুপিটার এবং অ্যাডভারসারিয়াল টুলকিটস",
    author: "Neural_Architect",
    date: "2024-06-22",
    category: "AI Security",
    excerpt: "Setup the environment to hack LLMs. Learn to install PyRIT, Garak, and manage model inference locally.",
    bnExcerpt: "এলএলএম (LLM) হ্যাক করার এনভায়রনমেন্ট সেটআপ করুন। PyRIT, Garak ইনস্টল করা এবং লোকালি মডেল ইনফারেন্স ম্যানেজ করা শিখুন।",
    content: {
      overview: "AI hacking is all about manipulating the prompt and model weights. You need a stable Python environment.",
      bnOverview: "এআই হ্যাকিং হলো প্রম্পট এবং মডেল ওয়েইটস ম্যানিপুলেট করা। আপনার একটি স্থিতিশীল পাইথন এনভায়রনমেন্ট প্রয়োজন।",
      labSetup: "OS: Ubuntu (GPU enabled) | Tools: Jupyter, Conda, PyRIT, Garak",
      bnLabSetup: "ওএস: উবুন্টু (জিপিইউ এনাবল্ড) | টুলস: জুপিটার, কন্ডা, PyRIT, Garak",
      attackSteps: [
        "Install Conda: Create a 'hacking-ai' environment.",
        "Install PyRIT: pip install pyrit-toolkit",
        "Run Jupyter: Open local notebooks to test prompt injection payloads."
      ],
      bnAttackSteps: [
        "কান্ডা ইনস্টল করুন: একটি 'hacking-ai' এনভায়রনমেন্ট তৈরি করুন।",
        "PyRIT ইনস্টল করুন: pip install pyrit-toolkit",
        "জুপিটার রান করুন: প্রম্পট ইনজেকশন পেলোড টেস্ট করতে লোকাল নোটবুক ওপেন করুন।"
      ],
      remediation: "Use Llama-Guard or NeMo-Guardrails to sanitize inputs.",
      bnRemediation: "ইনপুট স্যানিটাইজ করতে Llama-Guard বা NeMo-Guardrails ব্যবহার করুন।"
    }
  },
  {
    id: "lab-009",
    title: "Social Engineering Lab: Gophish & SMTP Gateways",
    bnTitle: "সোশ্যাল ইঞ্জিনিয়ারিং ল্যাব: গোফিশ এবং এসএমটিপি গেটওয়ে",
    author: "Human_Hacker",
    date: "2024-06-23",
    category: "Human Hacking",
    excerpt: "Setup a phishing simulation lab. Deploy Gophish on a cloud VPS or local server to track clicks and credential harvests.",
    bnExcerpt: "একটি ফিশিং সিমুলেশন ল্যাব সেটআপ করুন। ক্লিক এবং ক্রেডেনশিয়াল হার্ভেস্ট ট্র্যাক করতে ক্লাউড ভিপিএস বা লোকাল সার্ভারে গোফিশ ডেপ্লয় করুন।",
    content: {
      overview: "To learn social engineering, you need to track human behavior. Gophish provides the ultimate framework for this.",
      bnOverview: "সোশ্যাল ইঞ্জিনিয়ারিং শিখতে মানুষের আচরণ ট্র্যাক করা প্রয়োজন। গোফিশ এর জন্য সেরা ফ্রেমওয়ার্ক সরবরাহ করে।",
      labSetup: "OS: Debian | Tool: Gophish | Gateway: Mailtrap (Safe Testing)",
      bnLabSetup: "ওএস: ডেবিয়ান | টুল: গোফিশ | গেটওয়ে: মেইলট্র্যাপ (নিরাপদ টেস্টিং)",
      attackSteps: [
        "Download Gophish: Extract and run the binary.",
        "Setup SMTP: Connect to a safe testing gateway like Mailtrap.io.",
        "Import Templates: Create landing pages that mimic Outlook or Gmail."
      ],
      bnAttackSteps: [
        "গোফিশ ডাউনলোড করুন: বাইনারি এক্সট্রাক্ট করে রান করুন।",
        "এসএমটিপি সেটআপ করুন: মেইলট্র্যাপ এর মতো নিরাপদ টেস্টিং গেটওয়ের সাথে কানেক্ট করুন।",
        "টেমপ্লেট ইমপোর্ট করুন: আউটলুক বা জিমেইল এর ছদ্মবেশী ল্যান্ডিং পেজ তৈরি করুন।"
      ],
      remediation: "Run security awareness training and move to FIDO2 hardware keys.",
      bnRemediation: "সিকিউরিটি অ্যাওয়ারনেস ট্রেনিং পরিচালনা করুন এবং FIDO2 হার্ডওয়্যার কী-তে মাইগ্রেট করুন।"
    }
  },
  {
    id: "lab-010",
    title: "The Defensive Lab: ELK Stack & Forensics",
    bnTitle: "ডিফেন্সিভ ল্যাব: ইএলকে স্ট্যাক এবং ফরেনসিক",
    author: "Shield_Lead",
    date: "2024-06-24",
    category: "Lab Setup",
    excerpt: "Don't just attack—learn to detect. Set up an ELK (Elasticsearch, Logstash, Kibana) stack to analyze your own attack logs.",
    bnExcerpt: "শুধু আক্রমণ নয়—শনাক্ত করতেও শিখুন। আপনার নিজের অ্যাটাক লগগুলি বিশ্লেষণ করতে একটি ইএলকে (ELK) স্ট্যাক সেটআপ করুন।",
    content: {
      overview: "The best Red Teamers understand Blue Team logs. We will setup an ELK stack to capture events from our targets.",
      bnOverview: "সেরা রেড টিমাররা ব্লু টিমের লগগুলি বোঝেন। টার্গেট থেকে ইভেন্ট ক্যাপচার করতে আমরা একটি ইএলকে স্ট্যাক সেটআপ করব।",
      labSetup: "OS: Ubuntu (8GB RAM) | Stack: Elasticsearch, Kibana, Filebeat",
      bnLabSetup: "ওএস: উবুন্টু (৮ জিবি র‍্যাম) | স্ট্যাক: Elasticsearch, Kibana, Filebeat",
      attackSteps: [
        "Install Elasticsearch: Configure a single-node cluster.",
        "Install Filebeat: Ship logs from your Windows target to ELK.",
        "Build Dashboard: Visualize failed login attempts and process creation."
      ],
      bnAttackSteps: [
        "Elasticsearch ইনস্টল করুন: একটি সিঙ্গেল-নোড ক্লাস্টার কনফিগার করুন।",
        "Filebeat ইনস্টল করুন: আপনার উইন্ডোজ টার্গেট থেকে ইএলকে-তে লগ পাঠান।",
        "ড্যাশবোর্ড তৈরি করুন: ব্যর্থ লগইন চেষ্টা এবং প্রসেস ক্রিয়েশন ভিজ্যুয়ালাইজ করুন।"
      ],
      remediation: "Setup alerts for 'Pass-the-Hash' patterns in security logs.",
      bnRemediation: "সিকিউরিটি লগে 'Pass-the-Hash' প্যাটার্নের জন্য অ্যালার্ট সেটআপ করুন।"
    }
  }
];
