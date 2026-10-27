/*
 * ============================================================================
 *  SITE CONTENT — edit this file to update the portfolio.
 * ============================================================================
 *
 *  Everything visible on the page (except <head> metadata and the artwork in
 *  index.html) comes from the SITE object below. Terms used here (intro strip,
 *  role, case study, recognition) are defined in CONTEXT.md.
 *
 *  Only write what you can defend in an interview: real scale, real problems,
 *  real results. No numbers you can't stand behind.
 *
 *  Text placeholders (work in any string):
 *    {years}  -> completed years of experience since profile.careerStart
 *    {name}   -> profile.name
 *  **double asterisks** make a word bold in `intro.summary`, `about.paragraphs`
 *  and `contact.text`.
 *
 *  Artwork: every `art` value names an <svg data-art="..."> inside the
 *  <template id="art"> in index.html.
 *
 *  Section types (set `type` on each entry in `sections`):
 *    "work"     { lede, items: [CaseStudy], closing: { title, text, art } }
 *               CaseStudy = { org, period, year, title, line,
 *                             metric: { value, label }, second: { value, label },
 *                             scale, body, stack: [], art }
 *               `line` is the one-liner on the card; `body` is the full case,
 *               shown when "Read the case" is pressed (and in print).
 *    "path"     { lede, items: [{ years, mark, title, org, text, chips: [], art }] }
 *               most recent first; `mark` is the big outlined year.
 *    "about"    { headline, paragraphs: [], traits: [], stats: [{ value, label }],
 *               skills: [{ name, items: [] }], art }
 *    "contact"  { title, text }  -> renders profile.links
 *
 *  Common section fields:
 *    id      unique, used for the URL anchor (#id) — lowercase, no spaces
 *    title   heading shown on the page
 *    nav     label in the top navigation, or false to leave it out
 *    hidden  true to hide the section without deleting it (default false)
 *
 *  Section order on the page = order in the `sections` array.
 * ============================================================================
 */

const SITE = {
  profile: {
    name: "Pramod Kadam",
    initials: "PK",
    title: "Senior Data Engineer",
    employer: "Accenture",
    // First working day; {years} is calculated from this (YYYY-MM-DD).
    careerStart: "2021-08-19",
    // null = count up to today. Set a date (YYYY-MM-DD) to freeze the count.
    careerEnd: null,
    email: "pramod21dkadam@gmail.com",
    links: [
      { label: "Email", url: "mailto:pramod21dkadam@gmail.com", display: "pramod21dkadam@gmail.com" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/pramod-kadam/", display: "linkedin.com/in/pramod-kadam" },
      { label: "GitHub", url: "https://github.com/pramod21kadam", display: "github.com/pramod21kadam" },
    ],
  },

  // The intro strip: the full-screen scene at the top of the page.
  intro: {
    headline: "I build data pipelines, and move them from the ground to the cloud.",
    summary: "Senior data engineer with {years}+ years on **Apache Spark** and Hadoop. Now at **Accenture**, leading development on moving **~30 batch jobs** from on-premise Hadoop to **Google Cloud**.",
    sceneLabel: "Illustration: parcels of data ride a pipeline from a warehouse on a floating island up to a building in the clouds.",
    hint: "Scroll to follow the data",
    jump: "or jump to the work",
  },

  sections: [
    {
      id: "work",
      title: "Selected work",
      nav: "Work",
      type: "work",
      lede: "Three pieces of work, newest first.",
      items: [
        {
          org: "Accenture",
          period: "Sep 2025 to now",
          year: "2025",
          title: "On-premise to Google Cloud",
          line: "Moving batch jobs off an on-premise Hadoop / Hive platform, with Spark going to Dataproc and storage to BigQuery.",
          metric: { value: "~30", label: "batch jobs moving to Google Cloud" },
          second: { value: "~500 GB", label: "tables" },
          scale: "~30 jobs · ~500 GB tables",
          body: "Team lead for development on the migration of batch jobs from an on-premise Hadoop / Hive platform to Google Cloud, with Spark processing moving to Dataproc and storage to BigQuery.",
          stack: ["Spark", "Hive", "Dataproc", "BigQuery"],
          art: "migration",
        },
        {
          org: "Tata Consultancy Services",
          period: "2021 to 2025",
          year: "2021",
          title: "MIS, a management information system",
          line: "A Spark pipeline that gathers financial data from many sources and delivers it, structured, to end customers.",
          metric: { value: "500–600", label: "GB through the pipeline per run" },
          second: { value: "Led", label: "the pipeline design" },
          scale: "500–600 GB per run",
          body: "Led the design of a pipeline that collects financial data from multiple sources and delivers it, structured, to end customers. Built the Spark jobs for transformation, cleansing and enrichment, and tuned long-running jobs to bring down runtime and compute cost.",
          stack: ["PySpark", "Spark SQL", "Hadoop", "Hive"],
          art: "mis",
        },
        {
          org: "Tata Consultancy Services",
          period: "2021 to 2025",
          year: "2021",
          title: "SDP, the Standard Data Protocol",
          line: "A Python ETL tool on Spark and Hadoop that moves data between stores, with mapping rules for structured and unstructured data.",
          metric: { value: "40–150", label: "GB moved per run" },
          second: { value: "Mentored", label: "new team members on the tool" },
          scale: "40–150 GB per run",
          body: "Worked on a Python ETL tool built on Spark and Hadoop that transforms and moves data between data stores. Wrote custom data-mapping protocols for structured and unstructured data, and mentored new team members on the tool.",
          stack: ["Python", "Spark", "Hadoop"],
          art: "sdp",
        },
      ],
      closing: {
        title: "Blue Box Award, 2026",
        text: "Accenture's award for exceptional contribution.",
        art: "award",
      },
    },
    {
      id: "path",
      title: "The path so far",
      nav: "Path",
      type: "path",
      lede: "Newest first. From a computer engineering degree to cloud migrations at Accenture.",
      items: [
        {
          years: "2025 to now",
          mark: "2025",
          title: "Senior Data Engineer",
          org: "Accenture · Senior Analyst level",
          text: "Team lead for development on moving batch jobs from on-premise Hadoop to Google Cloud. Blue Box Award in 2026.",
          chips: ["Dataproc", "BigQuery", "Team lead", "Blue Box Award"],
          art: "era-cloud",
        },
        {
          years: "2021 to 2025",
          mark: "2021",
          title: "Apache Spark Developer",
          org: "Tata Consultancy Services",
          text: "Built and tuned Spark pipelines for financial data, 40 to 600 GB a run, and mentored new team members.",
          chips: ["PySpark", "Hive", "Tuning", "Mentoring"],
          art: "era-spark",
        },
        {
          years: "2017 to 2021",
          mark: "2017",
          title: "B.E. in Computer Engineering",
          org: "Sinhgad Academy of Engineering, Pune University",
          text: "Graduated with a CGPA of 8.75 out of 10.",
          chips: ["CGPA 8.75 / 10"],
          art: "era-degree",
        },
        {
          years: "2016 to 2017",
          mark: "2016",
          title: "Higher Secondary Certificate, Science",
          org: "Nowrosjee Wadia College, Pune",
          text: "",
          chips: [],
          art: "era-school",
        },
      ],
    },
    {
      id: "about",
      title: "About",
      nav: "About",
      type: "about",
      art: "about",
      traits: ["Spark since 2021", "Team lead at Accenture", "Mentor", "Blue Box Award 2026"],
      headline: "{years} years of batch data, from Spark jobs at TCS to the cloud at Accenture.",
      paragraphs: [
        "I've worked on batch data since 2021: first as an Apache Spark developer at **Tata Consultancy Services**, now as a senior data engineer at **Accenture**.",
        "At TCS I led the design of a pipeline that turns financial data from many sources into structured deliveries, and tuned long-running Spark jobs to cut runtime and compute cost. I also mentored new team members on an in-house ETL tool.",
        "At Accenture I lead development on moving batch jobs from on-premise Hadoop to Google Cloud. In 2026 I received Accenture's Blue Box Award.",
      ],
      stats: [
        { value: "{years}+", label: "years in data engineering" },
        { value: "500–600", label: "GB per run through the MIS pipeline" },
        { value: "~30", label: "batch jobs on their way to Google Cloud" },
      ],
      skills: [
        { name: "Processing", items: ["Apache Spark", "PySpark", "Spark SQL", "Hadoop", "Hive", "Impala"] },
        { name: "Google Cloud", items: ["Dataproc", "BigQuery", "Cloud Storage", "Cloud Functions"] },
        { name: "Languages", items: ["Python", "SQL", "Java"] },
        { name: "Orchestration & ops", items: ["Airflow", "Control-M", "Splunk", "Linux", "Git"] },
        { name: "Modelling", items: ["Data lake", "Star / snowflake schema", "Data mapping"] },
      ],
    },
    {
      id: "contact",
      title: "Send a packet my way.",
      nav: "Contact",
      type: "contact",
      text: "Write to me at **{email}**. Or press the button and watch it travel down the pipe.",
    },
  ],
};
