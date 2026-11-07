/* ==========================================================================
   Site-wide facts. Owned by S1.  Edit text here, not in the HTML pages.
   `sample: true` marks placeholder content — scripts/check-samples.mjs
   fails the pre-launch check while any remain.
   ========================================================================== */
window.NEXT = window.NEXT || {};
NEXT.site = {
  name: "Next Inc.",
  url: "https://www.wearenext.tech",
  email: "ariblabib360@gmail.com",
  tagline: "Where research becomes working software.",
  blurb: "Next Inc. is an innovation lab and full-stack technology partner. We bridge the gap between cutting-edge research and practical application — web and app development, enterprise SaaS, and sophisticated AI and LLM modeling.",

  hubs: [
    { id: "us", label: "Pennsylvania", name: "Pennsylvania, USA",            role: "USA Operations Hub",    lat: 40.9, lon: -77.8 },
    { id: "bd", label: "Rajshahi", name: "Vodra, Rajshahi, Bangladesh",  role: "Engineering & R&D Hub", lat: 24.37, lon: 88.6 }
  ],

  /* "Disciplines" — copy carried over from the old four pillars */
  disciplines: [
    { name: "Comprehensive Digital Engineering",
      text: "We design and develop responsive, user-centric websites and intuitive mobile applications that drive engagement and deliver seamless digital experiences across all devices.",
      outputs: "Websites · Web apps · Mobile apps · Design systems" },
    { name: "Advanced AI & LLM Capabilities",
      text: "We build and integrate custom artificial intelligence and Large Language Models to automate complex workflows, enhance decision-making, and unlock powerful, data-driven insights.",
      outputs: "Custom models · LLM integration · Agents · Workflow automation" },
    { name: "Scalable SaaS Architecture",
      text: "We create robust, cloud-based Software-as-a-Service platforms engineered for high performance, security, and long-term enterprise scalability.",
      outputs: "Multi-tenant platforms · APIs · Cloud infrastructure · Security" },
    { name: "Research-Driven Innovation",
      text: "Our dedicated focus on continuous R&D means we are not just reacting to technology trends — we are exploring new methodologies and pioneering solutions that keep our clients ahead.",
      outputs: "Prototypes · Feasibility studies · Evaluation · Technical reports" }
  ],

  /* "Algorithm 1" on the home page. indent: 0|1|2.  Wrap keywords in <b>. */
  method: {
    title: "The Next Inc. method",
    input: "a problem worth solving",
    output: "software people rely on",
    lines: [
      { i: 0, t: "<b>Listen</b> to the people who live with the problem", cm: "no assumptions" },
      { i: 0, t: "<b>Frame</b> a hypothesis and decide how we will measure it", cm: "before any code" },
      { i: 0, t: "<b>repeat</b>" },
      { i: 1, t: "<b>Prototype</b> the smallest thing that could prove us wrong", cm: "days, not months" },
      { i: 1, t: "<b>Test</b> it with real users; record what happened, not what we hoped" },
      { i: 1, t: "<b>Revise</b> the design" },
      { i: 0, t: "<b>until</b> the measure moves" },
      { i: 0, t: "<b>Build</b> it properly — tested, documented, observable", cm: "production grade" },
      { i: 0, t: "<b>Ship</b>, then keep measuring", cm: "the work is never done" }
    ]
  },

  /* Honest facts first. The last one is a SAMPLE figure — replace with real numbers. */
  stats: [
    { n: 2,  label: "Operating hubs",   tag: "USA · Bangladesh" },
    { n: 3,  label: "Founders",         tag: "CEO · CTO · COO" },
    { n: 4,  label: "Disciplines",      tag: "Web · AI · SaaS · R&D" },
    { n: 12, suffix: "+", label: "Projects shipped", tag: "Sample figure", sample: true }
  ],

  marquee: ["Websites & web apps", "Mobile applications", "Enterprise SaaS", "AI & LLM systems", "Agents & automation", "Research & prototyping", "Design systems"]
};
