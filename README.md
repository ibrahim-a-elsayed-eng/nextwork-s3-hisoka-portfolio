<div align="center">

# Ibrahim Ahmed El Sayed — Cloud & DevOps Engineering Portfolio

[![Live Portfolio](https://img.shields.io/badge/Live%20Site-ibrahim--a--elsayed--eng.github.io-FF9900?style=for-the-badge&logo=githubpages&logoColor=white)](https://ibrahim-a-elsayed-eng.github.io/)
[![GitHub](https://img.shields.io/badge/GitHub-Profile-0F172A?style=for-the-badge)](https://github.com/ibrahim-a-elsayed-eng)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge)](https://www.linkedin.com/in/ibrahim-ahmed-elsayed-eng)
[![NextWork](https://img.shields.io/badge/NextWork-12%2B%20Labs-10B981?style=for-the-badge)](https://nextwork.ai/portfolio/hemaa)

**Production-oriented Cloud & DevOps portfolio showcasing AWS networking, IAM least-privilege guardrails, Linux server hardening, automation pipelines, and `$0.00` teardown discipline — consolidated with its original Amazon S3 static hosting lab history.**

</div>

---

## 1. Live Portfolio & Alignment

- **Live URL:** [ibrahim-a-elsayed-eng.github.io](https://ibrahim-a-elsayed-eng.github.io/)
- **Portfolio Synchronization:** Project taxonomy mirrors the 4 groups maintained across [NextWork](https://nextwork.ai/portfolio/hemaa), [GitHub Profile](https://github.com/ibrahim-a-elsayed-eng), and [LinkedIn](https://www.linkedin.com/in/ibrahim-ahmed-elsayed-eng):
  1. **AWS VPC Networking** (`2/9` Series -> Flagship #1 Terraform Target)
  2. **AWS Security & IAM** (ABAC EC2 isolation & Root/CloudTrail/Budget baseline)
  3. **Cloud Automation & Hosting** (Private SSH-tunneled `n8n` on EC2, S3 -> GitHub Pages migration, `StackPulse AI` multi-agent pipeline)
  4. **Linux & DevOps Foundations** (`7/7` Ubuntu WSL2 administration & `systemd` hardening labs)

---

## 2. Amazon S3 Static Hosting Lab -> GitHub Pages Migration

![Architecture Diagram](./assets/diagrams/s3_github_pages_architecture.jpg)

```mermaid
flowchart LR
    Repo["GitHub Repository\n(ibrahim-a-elsayed-eng.github.io)"] -->|Originally Tested On| S3["Amazon S3 Static Hosting\n(eu-north-1, torn down cleanly)"]
    Repo -->|Production Hosting ($0.00/mo)| GHP["GitHub Pages\nibrahim-a-elsayed-eng.github.io"]
```

> [!IMPORTANT]
> **Key Design Decision:** Built and validated S3 static website hosting first (troubleshooting `403 Forbidden` ACLs and restrictive bucket policies), tore down the S3 bucket cleanly (`$0.00`), and consolidated live hosting plus the preserved 24-commit S3 lab history into this single `ibrahim-a-elsayed-eng.github.io` repository.

| Aspect | Detail |
| :--- | :--- |
| **Problem** | Needed a live public engineering portfolio beyond a basic single HTML page without paying recurring cloud hosting fees after completing the S3 lab. |
| **Solution** | Built and tested static website hosting on Amazon S3 (`eu-north-1`), then upgraded to a custom Hologram Cloud Ops HUD portfolio served at zero cost via GitHub Pages. |
| **Troubleshooting & Fixes** | **Issue 1 (`403 Forbidden`):** Private-by-default S3 uploads blocked public access; enabled public object reads via ACLs during lab verification.<br>**Issue 2 (`AccessDenied` on Delete):** Teardown object deletion failed due to a restrictive S3 bucket policy; removed the bucket policy first, then emptied and deleted the bucket cleanly. |

---

## 3. Repository Structure

```text
ibrahim-a-elsayed-eng.github.io/
├── index.html                  # Primary interactive Hologram Cloud Ops HUD portfolio
├── 404.html                    # Custom route-not-found page
├── README.md                   # Portfolio overview + preserved Amazon S3 lab documentation
└── assets/
    ├── favicon.svg             # Cloud topology emblem
    ├── css/style.css           # Dark/Light AWS Slate design tokens & responsive layout
    ├── js/app.js               # Interactive terminal, Hologram HUD, filters, case-study modal
    └── diagrams/               # Verified 16:9 architecture diagrams across portfolio projects
```

---

## 4. Cost & Hygiene Verification (`$0.00`)
- [x] Amazon S3 lab bucket (`eu-north-1`) emptied and deleted after verification.
- [x] Permanent production hosting running at `$0.00/mo` on GitHub Pages (`https://ibrahim-a-elsayed-eng.github.io/`).
- [x] Zero exposed AWS Account IDs, private keys, tokens, or real workstation IPs.
