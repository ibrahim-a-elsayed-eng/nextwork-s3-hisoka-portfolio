![Hisoka Portfolio Banner](./hisoka-banner.jpg)

# Ibrahim Ahmed (Hisoka) — Cloud & DevOps Portfolio | معرض أعمال السحابة وDevOps

> **Live Site / الموقع المباشر:** [ibrahim-a-elsayed-eng.github.io/nextwork-s3-hisoka-portfolio](https://ibrahim-a-elsayed-eng.github.io/nextwork-s3-hisoka-portfolio/)

---

## 🌟 How This Project Started / كيف بدأ هذا المشروع
- **EN:** This repository originally started as my NextWork project (**Hosting a Static Website on Amazon S3**). Instead of using a basic HTML page, I built my own portfolio site (`index.html`, `error.html`, `hisoka-banner.jpg`) and hosted it in an S3 bucket (`nextwork-website-hisoka-portfolio`, `eu-north-1`). During testing, I fixed a `403 Forbidden` error by making the objects public using ACL, and fixed an access denied error when deleting objects by deleting the restrictive bucket policy. After finishing the lab, I moved hosting to **GitHub Pages** to avoid AWS costs, and continued expanding the site to document my Cloud and Linux projects.
- **AR:** بدأ هذا المستودع في الأصل كمشروع على منصة NextWork (**استضافة موقع ثابت على Amazon S3**). وبدلاً من استخدام صفحة HTML بسيطة، بنيتُ موقع البورتفوليو الخاص بي (`index.html`، `error.html`، `hisoka-banner.jpg`) واستضفته في حاوية S3 (`nextwork-website-hisoka-portfolio` في منطقة `eu-north-1`). أثناء الاختبار، أصلحتُ خطأ `403 Forbidden` بجعل الملفات عامة عبر ACL، وأصلحتُ خطأ رفض الحذف بحذف سياسة الحاوية المقيدة. بعد إنهاء المعمل، نقلتُ الاستضافة إلى **GitHub Pages** لتجنب تكاليف AWS، وواصلتُ توسيع الموقع لتوثيق مشاريع السحابة ولينكس.

---

## 📚 Projects in the Portfolio / المشاريع في البورتفوليو

| Project / المشروع | Type / النوع | Status / الحالة | Page / الصفحة |
| :--- | :--- | :--- | :--- |
| **Hosting a Static Website on Amazon S3** | NextWork Project | Completed | [projects/aws-s3-hosting.html](./projects/aws-s3-hosting.html) |
| **AWS IAM Cloud Security & ABAC Access Control** | NextWork Project | Completed | [projects/iam-cloud-security.html](./projects/iam-cloud-security.html) |
| **AWS VPC Series (Part 1: Console & CLI)** | NextWork Project | In progress (1 of 9) | [projects/aws-vpc-networking.html](./projects/aws-vpc-networking.html) |
| **Linux Log Watchdog & Hardening Practice** | Training Project (Ubuntu WSL) | Completed | [projects/linux-log-watchdog.html](./projects/linux-log-watchdog.html) |

> Note: `projects/disk-space-monitor.html` also exists in the repository and is pending content review.

---

## 📁 Repository Structure / هيكل المستودع
- `index.html` — Main portfolio page and project cards / الصفحة الرئيسية وبطاقات المشاريع
- `projects/` — Individual project pages and series pages / صفحات المشاريع التفصيلية
- `images/` — Project screenshots / لقطات شاشة المشاريع
- `hisoka-banner.jpg`, `iam-abac-banner.jpg`, `vpc-banner.jpg`, `linux-banner.jpg` — Project banners / صور واجهات المشاريع

---

## 🛠️ Tech Used / التقنيات المستخدمة
- HTML, CSS, JavaScript
- Git & GitHub
- GitHub Pages (hosting)
