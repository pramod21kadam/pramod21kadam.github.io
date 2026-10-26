/*
 * ============================================================================
 *  SITE CONTENT — edit this file to update the portfolio.
 * ============================================================================
 *
 *  Everything visible on the page (except <head> metadata in index.html) comes
 *  from the SITE object below. You never need to touch script.js or index.html
 *  to add a skill, a job, a project or a whole new section.
 *
 *  Text placeholders (work in any string):
 *    {years}  -> completed years of experience since profile.careerStart
 *    {name}   -> profile.name
 *
 *  Section types (set `type` on each entry in `sections`):
 *    "text"      { paragraphs: ["...", "..."] }
 *    "tags"      { groups: [{ name: "Group", items: ["A", "B"] }] }      -> grouped list
 *    "cards"     { items: [{ title, label, summary, tags: [], links: [{ label, url }], featured }],
 *                  moreTitle: "..." }
 *                -> items with `featured: true` become large glass cards;
 *                   the rest are listed compactly under `moreTitle`
 *    "timeline"  { items: [{ title, org, period, points: [] }] }
 *    "contact"   { intro: "..." }  -> renders profile.links as contact cards
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
    role: "Data Engineer",
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

  hero: {
    eyebrow: "Data Engineer",
    // Shown after the name in a softer colour.
    headline: "I build data pipelines that scale.",
    lede: "{years}+ years designing ETL workflows and big data processing with Apache Spark, Hadoop, SQL and Python, on-premise and on Google Cloud.",
    actions: [
      { label: "View projects", href: "#projects", primary: true },
      { label: "Get in touch", href: "#contact" },
    ],
    // Glass panel next to the headline.
    panelLabel: "Data flow",
    // Each stage is clickable/hoverable and reveals its tools. A plain string ("Ingest") also works.
    pipeline: [
      { stage: "Sources", tools: ["MySQL", "NoSQL", "HDFS", "Cloud Storage"] },
      { stage: "Ingest", tools: ["Python", "Cloud Functions", "Airflow", "Control-M"] },
      { stage: "Transform", tools: ["Apache Spark (PySpark)", "Spark SQL", "Hive", "Dataproc"], selected: true },
      { stage: "Load", tools: ["Hive", "BigQuery", "Data Lake", "Star / Snowflake schema"] },
      { stage: "Serve", tools: ["BigQuery", "Impala", "SQL"] },
    ],
    facts: [
      { label: "Experience", value: "{years}+ years" },
      { label: "Core stack", value: "Spark · Hadoop · Python" },
      { label: "Cloud", value: "Google Cloud" },
      { label: "Status", value: "Open to opportunities" },
    ],
  },

  sections: [
    {
      id: "about",
      title: "About",
      type: "text",
      paragraphs: [
        "I design, develop and maintain scalable data pipelines for enterprise solutions. At Tata Consultancy Services I worked as an Apache Spark developer, building ETL processes for data ingestion, transformation and big data processing, and troubleshooting existing applications to improve data quality and reliability.",
        "I enjoy architecting data platforms for efficient storage and processing, and working with cross-functional teams of developers, data scientists and business analysts in an agile environment. I'm looking for data engineering roles where I can apply cloud and big data frameworks to support data-driven decisions.",
      ],
    },
    {
      id: "skills",
      title: "Skills",
      type: "tags",
      groups: [
        { name: "Languages", items: ["Python", "Java", "SQL", "Spark SQL"] },
        { name: "Processing", items: ["Apache Spark (PySpark)", "Hadoop", "Hive", "Impala"] },
        { name: "Storage & Modelling", items: ["HDFS", "Data Lake", "Star / Snowflake schema", "MySQL", "NoSQL"] },
        { name: "Cloud · GCP", items: ["BigQuery", "Cloud Storage", "Cloud Functions", "Dataproc"] },
        { name: "Orchestration & Ops", items: ["Airflow", "Control-M", "Splunk", "Linux"] },
        { name: "Tooling & Practice", items: ["Git", "Bitbucket", "JIRA", "ETL development", "Data mapping", "Performance tuning", "Agile", "Mentoring"] },
      ],
    },
    {
      id: "projects",
      title: "Projects",
      type: "cards",
      moreTitle: "Personal projects",
      items: [
        {
          title: "MIS — Management Information System",
          label: "Work · TCS",
          featured: true,
          summary: "Led the design and implementation of a data pipeline that collects, integrates, stores and organises financial data from multiple sources. Built and optimised Apache Spark jobs for transformation, cleansing and enrichment, and delivered structured data to end customers.",
          tags: ["Apache Spark", "ETL"],
          links: [],
        },
        {
          title: "SDP — Standard Data Protocol",
          label: "Work · TCS",
          featured: true,
          summary: "Worked on a Python ETL tool built on Apache Spark and Hadoop for transforming and transferring data between data stores. Developed custom data mapping protocols for structured and unstructured data and mentored new team members.",
          tags: ["Python", "Apache Spark", "Hadoop"],
          links: [],
        },
        {
          title: "Anonymous Chat Platform",
          label: "Personal",
          summary: "A real-time web application for anonymous conversations, with a Flask back-end and a Vue.js front-end.",
          tags: ["Python", "Flask", "Vue.js"],
          links: [], // TODO: [{ label: "Source", url: "https://github.com/pramod21kadam/<repo>" }]
        },
        {
          title: "Digital Token System for Wine Shops",
          label: "Personal",
          summary: "A crowd-management solution to regulate customer flow at wine shops during the COVID-19 pandemic and reduce congestion.",
          tags: [],
          links: [], // TODO: add GitHub repository link
        },
        {
          title: "Plant Disease Identification App",
          label: "Personal",
          summary: "A web-based tool that uses image recognition to identify plant species and diagnose diseases early.",
          tags: ["Image recognition"],
          links: [], // TODO: add GitHub repository link
        },
      ],
    },
    {
      id: "experience",
      title: "Experience",
      type: "timeline",
      items: [
        {
          title: "Apache Spark Developer (Data Engineer)",
          org: "Tata Consultancy Services",
          period: "Aug 2021 – Sep 2025",
          points: [
            "Designed and executed scalable data architectures for data collection, processing and analysis.",
            "Developed automated ETL workflows for data ingestion, transformation and real-time processing.",
            "Applied data governance and security measures in line with standards and regulations.",
            "Monitored and optimised data systems for availability, performance and reliability.",
          ],
        },
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
          points: ["CGPA: 8.75 / 10"],
        },
        {
          title: "Higher Secondary Certificate (Science)",
          org: "Nowrosjee Wadia College, Pune",
          period: "2016 – 2017",
          points: [],
        },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      type: "contact",
      intro: "Open to data engineering roles and collaborations. The quickest way to reach me is by email or LinkedIn.",
    },
  ],
};
