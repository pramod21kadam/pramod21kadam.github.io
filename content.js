/*
 * ============================================================================
 *  SITE CONTENT — edit this file to update the portfolio.
 * ============================================================================
 *
 *  Everything visible on the page (except <head> metadata in index.html) comes
 *  from the SITE object below. You never need to touch script.js or index.html
 *  to add a skill, a role, a case study or a whole new section.
 *  Terms used here (intro strip, role, level, case study, recognition) are
 *  defined in CONTEXT.md.
 *
 *  Only write what you can defend in an interview: real scale, real problems,
 *  real results. No numbers you can't stand behind.
 *
 *  Text placeholders (work in any string):
 *    {years}  -> completed years of experience since profile.careerStart
 *    {name}   -> profile.name
 *
 *  Section types (set `type` on each entry in `sections`):
 *    "text"      { paragraphs: ["...", "..."] }
 *    "tags"      { groups: [{ name: "Group", items: ["A", "B"] }] }      -> grouped list
 *    "timeline"  { items: [Role] }  -> roles / education, most recent first
 *                Role = {
 *                  title, org, level, period,
 *                  summary: "...",                       optional
 *                  caseStudies: [{ title, scale, body, stack: [] }],
 *                  recognition: [{ name, year, note }],
 *                  notes: ["..."],                       short plain lines (e.g. CGPA)
 *                }
 *    "contact"   { intro: "..." }  -> renders profile.links
 *
 *  Common section fields:
 *    id      unique, used for the URL anchor (#id) — lowercase, no spaces
 *    title   heading shown on the page and in the nav
 *    nav     false to keep the section out of the top navigation (default true)
 *    hidden  true to hide the section without deleting it (default false)
 *
 *  Section order on the page = order in the `sections` array.
 * ============================================================================
 */

const SITE = {
  profile: {
    name: "Pramod Kadam",
    title: "Senior Data Engineer",
    employer: "Accenture",
    // First working day; {years} is calculated from this (YYYY-MM-DD).
    careerStart: "2021-08-19",
    // null = count up to today. Set a date (YYYY-MM-DD) to freeze the count.
    careerEnd: null,
    links: [
      { label: "Email", url: "mailto:pramod21dkadam@gmail.com", display: "pramod21dkadam@gmail.com" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/pramod-kadam/", display: "linkedin.com/in/pramod-kadam" },
      { label: "GitHub", url: "https://github.com/pramod21kadam", display: "github.com/pramod21kadam" },
    ],
  },

  // The intro strip at the top of the page. The eyebrow ("<title> at <employer>")
  // and the headline (profile.name) come from `profile`.
  intro: {
    summary: "Building batch data pipelines on Apache Spark and Hadoop since 2021. Now leading development on a migration from on-premise Hadoop to Google Cloud.",
    // Data-flow animation under the summary: raw records -> transform -> rows -> warehouse.
    // `stages` are the four captions under it, in that order. Remove `flow` to hide the animation.
    flow: {
      stages: ["Raw records", "Transform", "Structured rows", "Warehouse"],
    },
    // Key figures: big numbers under the intro. Every one must be true and confirmed.
    // Numbers under 1000 count up when scrolled into view; years stay as they are.
    figures: [
      { value: "{years}+", label: "years in data engineering" },
      { value: "500 GB+", label: "per run through the Spark pipelines I built at TCS" },
      { value: "~30", label: "batch jobs moving to Google Cloud, with me leading development" },
      { value: "2026", label: "Blue Box Award, Accenture" },
    ],
  },

  sections: [
    {
      id: "experience",
      title: "Experience",
      type: "timeline",
      items: [
        {
          title: "Senior Data Engineer",
          org: "Accenture",
          level: "Senior Analyst",
          period: "Sep 2025 – Present",
          caseStudies: [
            {
              title: "On-premise to Google Cloud migration",
              scale: "~30 jobs · ~500 GB tables",
              body: "Team lead for development on the migration of batch jobs from an on-premise Hadoop / Hive platform to Google Cloud, with Spark processing moving to Dataproc and storage to BigQuery.",
              stack: ["Spark", "Hive", "Dataproc", "BigQuery"],
            },
          ],
          recognition: [
            { name: "Blue Box Award", year: "2026", note: "Accenture award for exceptional contribution" },
          ],
        },
        {
          title: "Apache Spark Developer (Data Engineer)",
          org: "Tata Consultancy Services",
          period: "Aug 2021 – Sep 2025",
          caseStudies: [
            {
              title: "MIS — Management Information System",
              scale: "500–600 GB per run",
              body: "Led the design of a pipeline that collects financial data from multiple sources and delivers it, structured, to end customers. Built the Spark jobs for transformation, cleansing and enrichment, and tuned long-running jobs to bring down runtime and compute cost.",
              stack: ["PySpark", "Spark SQL", "Hadoop", "Hive"],
            },
            {
              title: "SDP — Standard Data Protocol",
              scale: "40–150 GB per run",
              body: "Worked on a Python ETL tool built on Spark and Hadoop that transforms and moves data between data stores. Wrote custom data-mapping protocols for structured and unstructured data, and mentored new team members on the tool.",
              stack: ["Python", "Spark", "Hadoop"],
            },
          ],
        },
      ],
    },
    {
      id: "skills",
      title: "Skills",
      type: "tags",
      groups: [
        { name: "Processing", items: ["Apache Spark (PySpark, Spark SQL)", "Hadoop", "Hive", "Impala"] },
        { name: "Google Cloud", items: ["Dataproc", "BigQuery", "Cloud Storage", "Cloud Functions"] },
        { name: "Languages", items: ["Python", "SQL", "Java"] },
        { name: "Orchestration & ops", items: ["Airflow", "Control-M", "Splunk", "Linux", "Git"] },
        { name: "Modelling", items: ["Data lake", "Star / snowflake schema", "Data mapping"] },
      ],
    },
    {
      id: "education",
      title: "Education",
      type: "timeline",
      items: [
        {
          title: "B.E. in Computer Engineering",
          org: "Sinhgad Academy of Engineering, Pune University",
          period: "2017 – 2021",
          notes: ["CGPA 8.75 / 10"],
        },
        {
          title: "Higher Secondary Certificate (Science)",
          org: "Nowrosjee Wadia College, Pune",
          period: "2016 – 2017",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      type: "contact",
      intro: "Email is the quickest way to reach me.",
    },
  ],
};
