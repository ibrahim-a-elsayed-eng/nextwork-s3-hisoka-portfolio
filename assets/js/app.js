const SNIPPETS = {
  vpc: `# AWS VPC Networking Series (Part 1 & 2 - Verified)
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value="NextWork VPC"}]'
aws ec2 create-subnet --vpc-id <vpc-id> --cidr-block 10.0.0.0/24 --availability-zone us-east-2a
aws ec2 create-internet-gateway && aws ec2 attach-internet-gateway --vpc-id <vpc-id> --internet-gateway-id <igw-id>

# Make subnet truly public via Route Table + inspect Security boundaries:
aws ec2 create-route --route-table-id <rtb-id> --destination-cidr-block 0.0.0.0/0 --gateway-id <igw-id>
# Teardown Gate: All lab VPC/EC2/EIP resources verified deleted -> AWS Spend: $0.00`,

  abac: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ec2:*",
      "Resource": "*",
      "Condition": { "StringEquals": { "ec2:ResourceTag/Env": "development" } }
    },
    { "Effect": "Allow", "Action": "ec2:Describe*", "Resource": "*" },
    { "Effect": "Deny", "Action": ["ec2:CreateTags", "ec2:DeleteTags"], "Resource": "*" }
  ]
}`,

  n8n: `# Private n8n on AWS EC2 (Loopback + SSH Tunnel Boundary)
services:
  n8n:
    image: n8nio/n8n:2.48.5
    restart: unless-stopped
    ports:
      - "127.0.0.1:5678:5678"   # Zero public exposure on EC2 ENI
    volumes:
      - n8n_data:/home/node/.n8n

# Operator access strictly via encrypted local port forward:
# ssh -N -L 127.0.0.1:5678:127.0.0.1:5678 -i <key>.pem ubuntu@<ec2-ip>`,

  linux: `#!/usr/bin/env bash
set -euo pipefail
# Hardened systemd oneshot unit (user: log-monitor, UMask=0027)
recent_log="$(tail -n 200 /var/log/demo-app/application.log)"
error_count="$(grep -c 'level=ERROR' <<<"$recent_log" || true)"
(( error_count > 0 )) && printf 'ALERT errors=%s\\n' "$error_count" >&2`
};

const CASE_STUDIES = {
  vpc: {
    group: 'AWS VPC Networking',
    title: 'Amazon VPC Networking Series (Labs 1–2 Completed)',
    diagram: './assets/diagrams/aws_vpc_part1_architecture.jpg',
    problem: 'Misconfigured subnets, missing routes, or overly broad Security Groups/NACLs expose workloads or silently drop traffic.',
    solution: 'Built NextWork VPC (10.0.0.0/16) in Console & CloudShell CLI, attached IGW, configured Route Tables, compared stateful Security Groups vs stateless NACLs, and audited topology via EC2 Global View.',
    adr: 'Separated Security Group rules (stateful allow-only at ENI level) from Network ACL rules (stateless subnet perimeter including ephemeral return ports) and documented both CLI & Console parity before upcoming Terraform codification (Flagship #1).',
    troubleshooting: 'A subnet named "Public 1" with auto-assign public IPv4 is NOT reachable from the internet until its associated Route Table explicitly routes 0.0.0.0/0 to the attached Internet Gateway.',
    highlights: [
      'Lab 1: Dual implementation via AWS Console and CloudShell AWS CLI.',
      'Lab 2: Route Table association, SG stateful return traffic vs NACL stateless rules, and EC2 Global View audit.',
      'Zero-Spend Gate: Terminated/cleaned VPC resources after verification ($0.00 spend).'
    ],
    snippet: SNIPPETS.vpc,
    github: 'https://github.com/ibrahim-a-elsayed-eng/aws-vpc-networking-series',
    nextwork: 'https://nextwork.ai/hemaa/docs/fe5ed473-5874-57e1-a58f-d9b3d652330c',
    nextworkLabel: 'NextWork Lab 2 Proof ↗'
  },
  n8n: {
    group: 'Cloud Automation & Hosting',
    title: 'Private n8n RSS Alerts on AWS EC2 (SSH Tunnel Only)',
    diagram: './assets/diagrams/n8n_aws_ec2_architecture.jpg',
    problem: 'Self-hosting workflow tools like n8n on a public VM exposes admin port 5678 to internet scanners, while small instances risk OOM crashes.',
    solution: 'Deployed n8n via Docker Compose on Ubuntu EC2 with a persistent 2 GiB /swapfile, bound strictly to 127.0.0.1:5678, accessed exclusively over SSH port forwarding, and automated NASA CNEOS RSS alerts to Telegram.',
    adr: 'Chose 127.0.0.1 loopback binding + Security Group SSH-only (port 22 from operator IP) instead of maintaining a public reverse proxy for a single-operator control plane.',
    troubleshooting: 'Confirmed direct requests to http://<EC2-IP>:5678 timed out/refused and closing the SSH tunnel revoked UI access immediately, proving dual network + host isolation.',
    highlights: [
      '2 GiB swap file persisted in /etc/fstab prevented container OOM kills.',
      'Verified /healthz locally ({"status":"ok"}) and tested both True/False RSS filter branches.',
      'Cleanly terminated EC2/EBS after verification ($0.00 ongoing spend).'
    ],
    snippet: SNIPPETS.n8n,
    github: 'https://github.com/ibrahim-a-elsayed-eng/n8n-private-rss-alerts',
    nextwork: 'https://nextwork.ai/hemaa/docs/3191c4e6-7776-4b75-9db2-40266083fc20',
    nextworkLabel: 'NextWork Project Proof ↗'
  },
  abac: {
    group: 'AWS Security & IAM',
    title: 'AWS IAM Cloud Security & ABAC Access Control',
    diagram: './assets/diagrams/aws_iam_abac_architecture.jpg',
    problem: 'Granting broad ec2:* permissions lets developers accidentally stop or modify production EC2 servers.',
    solution: 'Authored NextWorkDevEnvironmentPolicy using ec2:ResourceTag/Env = development conditions, attached to nextwork-dev-group, and enforced explicit Deny on CreateTags/DeleteTags.',
    adr: 'Explicitly denied ec2:CreateTags and ec2:DeleteTags across Resource:* so a scoped user cannot re-tag a production instance as development to escalate privileges.',
    troubleshooting: 'Verified live in Incognito (stopped dev server, received Access Denied on prod) and in IAM Policy Simulator (DeleteTags -> Explicit Deny).',
    highlights: [
      'Scale-friendly ABAC policy covers future dev instances without hardcoded IDs.',
      'Zero wildcard allow without tag guardrails.',
      'All EC2 test instances and temporary IAM identities removed after lab ($0.00).'
    ],
    snippet: SNIPPETS.abac,
    github: 'https://github.com/ibrahim-a-elsayed-eng/aws-iam-abac-security',
    nextwork: 'https://nextwork.ai/hemaa/docs/51a5fd24-7458-58a6-8653-9b90119a0e4a',
    nextworkLabel: 'NextWork Project Proof ↗'
  },
  baseline: {
    group: 'AWS Security & IAM',
    title: 'AWS Account Security, Billing Guardrails & IAM Baseline',
    diagram: './assets/diagrams/week1_iam_security_baseline_architecture.png',
    problem: 'Running a new AWS account with Root credentials, no billing tripwires, or wildcard IAM policies risks compromise and surprise charges.',
    solution: 'Locked Root behind MFA, isolated daily work to cloud-admin + MFA, set Free Tier alerts + Zero-Spend + $5–$10 Budgets, and scoped S3 reads by prefix and object tag.',
    adr: 'Replaced broad S3 read policies with CustomLeastPrivilegeS3ABAC (doc-example-bucket/config* + s3:ExistingObjectTag/Env = Dev) and audited denials via CloudTrail Event History.',
    troubleshooting: 'IAM Visual Editor showed extra S3 actions sharing the object ARN type; switched to the JSON editor tab to verify only s3:GetObject was granted and validated via Policy Simulator + live Console denial.',
    highlights: [
      'Root user retired to break-glass MFA only.',
      'Cost Explorer + Zero-Spend Budget guardrails verified at $0.00.',
      'Temporary lab-readonly-user deleted cleanly after audit.'
    ],
    snippet: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::doc-example-bucket/config*",
    "Condition": { "ForAnyValue:StringEquals": { "s3:ExistingObjectTag/Env": "Dev" } }
  }]
}`,
    github: 'https://github.com/ibrahim-a-elsayed-eng/week-01-iam-security-baseline',
    nextwork: 'https://nextwork.ai/portfolio/hemaa',
    nextworkLabel: 'NextWork Portfolio ↗'
  },
  linux: {
    group: 'Linux & DevOps Foundations',
    title: 'Linux & DevOps Engineering Journey (7/7 Labs)',
    diagram: './assets/diagrams/linux_devops_7labs_architecture.jpg',
    problem: 'Cloud deployments fail quickly without solid command-line fluency, permission control, process troubleshooting, and fail-fast Bash scripts.',
    solution: 'Completed 7 progressive Ubuntu WSL2 labs from filesystem & DAC permissions (chmod/chown) to network socket triage (ss/curl), cron/logrotate automation, and systemd service sandboxing.',
    adr: 'Hardened log-monitor.service under an unprivileged log-monitor user with NoNewPrivileges=yes, ProtectSystem=strict, PrivateTmp=yes, PrivateDevices=yes, and UMask=0027.',
    troubleshooting: 'Cron and systemd units fail silently on relative paths or missing directories; enforced set -euo pipefail, bash -n syntax dry-runs, absolute paths, and ConditionPathExists.',
    highlights: [
      '7 modular sub-projects with dedicated READMEs, scripts, and CLI cheatsheet.',
      'Practiced SSH hardening + UFW firewall rules + journalctl service debugging.',
      'Executed 100% locally on Ubuntu WSL2 ($0.00 cloud spend).'
    ],
    snippet: `#!/usr/bin/env bash
set -euo pipefail
# Runs inside hardened systemd unit (log-monitor.service, UMask=0027)
recent_log="$(tail -n "$window_lines" "$source_log")"
warning_count="$(grep -c 'level=WARN' <<<"$recent_log" || true)"
error_count="$(grep -c 'level=ERROR' <<<"$recent_log" || true)"`,
    github: 'https://github.com/ibrahim-a-elsayed-eng/linux-basics-project',
    nextwork: 'https://nextwork.ai/portfolio/hemaa',
    nextworkLabel: 'NextWork Portfolio ↗'
  },
  s3pages: {
    group: 'Cloud Automation & Hosting',
    title: 'Amazon S3 Static Hosting -> GitHub Pages Migration',
    diagram: './assets/diagrams/s3_github_pages_architecture.jpg',
    problem: 'Needed a permanent, custom-designed public engineering portfolio without recurring AWS S3 storage/request bills after finishing the S3 lab.',
    solution: 'Built and validated static website hosting on Amazon S3 (eu-north-1), debugged ACLs and bucket policies, tore down the S3 bucket cleanly, and consolidated production hosting onto ibrahim-a-elsayed-eng.github.io.',
    adr: 'Consolidated the original Amazon S3 lab history and permanent GitHub Pages portfolio into the single ibrahim-a-elsayed-eng.github.io repository so all S3 troubleshooting proof and live hosting live cleanly under one root domain.',
    troubleshooting: 'Resolved 403 Forbidden caused by private-by-default S3 uploads via ACLs, and resolved AccessDenied during bucket deletion by removing the restrictive bucket policy first.',
    highlights: [
      'Cleanly decoupled learning lab proof (S3) from $0.00 permanent production hosting.',
      'Unified branding, links, and project taxonomy across GitHub, NextWork, and LinkedIn.',
      'Custom 404 route handling and theme-adaptive engineering UI.'
    ],
    snippet: `# Amazon S3 Lab -> Production GitHub Pages (Single Consolidated Repo)
# Primary Portfolio: https://ibrahim-a-elsayed-eng.github.io/
# Repository:        https://github.com/ibrahim-a-elsayed-eng/ibrahim-a-elsayed-eng.github.io
# Ongoing AWS Cost:  $0.00 (lab S3 bucket emptied and deleted after verification)`,
    github: 'https://github.com/ibrahim-a-elsayed-eng/ibrahim-a-elsayed-eng.github.io',
    nextwork: 'https://nextwork.ai/portfolio/hemaa',
    nextworkLabel: 'NextWork Portfolio ↗'
  },
  stackpulse: {
    group: 'Cloud Automation & Hosting',
    title: 'StackPulse AI — Multi-Agent Python Automation Pipeline',
    diagram: './assets/diagrams/stackpulse_ai_architecture.svg',
    problem: 'End-to-end content/media workflows often break silently without strict data contracts, duplicate guards, and human review gates before publishing.',
    solution: 'Built a 4-agent Python 3.12 pipeline (Product Hunt RSS -> Gemini Research -> Script -> Edge-TTS/Playwright/Faster-Whisper/FFmpeg -> YouTube Unlisted + Telegram HITL preview) backed by SQLite deduplication and 115+ pytest tests.',
    adr: 'Enforced privacy_status="unlisted" in Pydantic contracts and routed previews through Telegram HITL before manual publishing; selected this real workload as the upcoming Docker + GitHub Actions DevSecOps target (Flagships #3 & #4).',
    troubleshooting: 'Mitigated Cloudflare/bot challenges via automated screenshot challenge detection and fallback providers, and pinned av>=12,<15 dependencies cleanly in Python 3.12.',
    highlights: [
      'Strict Pydantic v2 schemas across all 4 agents + SQLite uniqueness constraint.',
      '115+ automated pytest checks covering offline, mock, and contract edge cases.',
      'Target workload for Phase 6–7 (Docker, GitHub Actions OIDC, Trivy/Checkov, CloudWatch).'
    ],
    snippet: `# StackPulse AI Offline Verification Command
.\\.venv\\Scripts\\python.exe -m pytest -v   # 115+ automated tests
.\\.venv\\Scripts\\python.exe orchestrator.py --step all --mock --offline --dry-run
# Upcoming Roadmap Target: Docker Compose + GitHub Actions CI/CD + AWS Cloud Capstone`,
    github: 'https://github.com/ibrahim-a-elsayed-eng',
    nextwork: 'https://www.youtube.com/@StackPulseAITools',
    nextworkLabel: 'Channel (@StackPulseAITools) ↗'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Theme switcher
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('portfolio_theme') || 'dark';
  root.setAttribute('data-theme', savedTheme);
  const themeBtn = document.getElementById('theme-toggle');
  const syncThemeIcon = () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    themeBtn.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    themeBtn.innerHTML = isLight ? '🌙' : '☀️';
  };
  syncThemeIcon();
  themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('portfolio_theme', next);
    syncThemeIcon();
  });

  // Console widget + Hologram node sync
  const consoleCode = document.getElementById('console-code');
  const copyBtn = document.getElementById('console-copy');
  let activeTab = 'vpc';
  const renderTab = (tab) => {
    if (!SNIPPETS[tab]) return;
    activeTab = tab;
    consoleCode.textContent = SNIPPETS[tab];
    document.querySelectorAll('.console-tab').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    document.querySelectorAll('.holo-node').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.holo === tab);
    });
  };
  document.querySelectorAll('.console-tab').forEach((btn) => {
    btn.addEventListener('click', () => renderTab(btn.dataset.tab));
  });
  document.querySelectorAll('.holo-node').forEach((btn) => {
    btn.addEventListener('click', () => renderTab(btn.dataset.holo));
  });
  renderTab('vpc');

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(SNIPPETS[activeTab]);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => (copyBtn.textContent = 'Copy'), 1500);
    } catch {
      copyBtn.textContent = 'Selected';
    }
  });

  // Group filtering + Ecosystem jump links
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  const applyFilter = (group) => {
    filterBtns.forEach((b) => b.classList.toggle('active', b.dataset.filter === group));
    cards.forEach((card) => {
      const show = group === 'all' || card.dataset.group === group;
      card.classList.toggle('hidden', !show);
    });
  };
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });

  document.querySelectorAll('[data-jump-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyFilter(btn.dataset.jumpFilter);
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  document.querySelectorAll('[data-jump-roadmap]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Case study modal
  const modal = document.getElementById('case-modal');
  const modalClose = document.getElementById('modal-close');
  const openModal = (id) => {
    const item = CASE_STUDIES[id];
    if (!item) return;
    document.getElementById('modal-group').textContent = item.group;
    document.getElementById('modal-title').textContent = item.title;
    document.getElementById('modal-diagram').src = item.diagram;
    document.getElementById('modal-diagram').alt = item.title + ' architecture diagram';
    document.getElementById('modal-problem').textContent = item.problem;
    document.getElementById('modal-solution').textContent = item.solution;
    document.getElementById('modal-adr').textContent = item.adr;
    document.getElementById('modal-troubleshooting').textContent = item.troubleshooting;
    document.getElementById('modal-highlights').innerHTML = item.highlights.map((h) => `<li>${h}</li>`).join('');
    document.getElementById('modal-snippet').textContent = item.snippet;
    document.getElementById('modal-github').href = item.github;
    const nwLink = document.getElementById('modal-nextwork');
    nwLink.href = item.nextwork;
    nwLink.textContent = item.nextworkLabel;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-case]').forEach((el) => {
    el.addEventListener('click', () => openModal(el.dataset.case));
  });
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  // Email copy
  const emailBtn = document.getElementById('copy-email');
  if (emailBtn) {
    emailBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText('ibrahim.a.elsayed.eng@gmail.com');
        emailBtn.textContent = 'Copied Email ✓';
        setTimeout(() => (emailBtn.textContent = 'Copy Email'), 1800);
      } catch {}
    });
  }

  // Hologram background topology mesh
  const initHoloBackground = () => {
    const canvas = document.getElementById('holo-bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = 0;
    let h = 0;
    const mouse = { x: -9999, y: -9999 };
    const nodes = Array.from({ length: 42 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00035,
      vy: (Math.random() - 0.5) * 0.00035,
      r: (i % 3) + 1.4,
      color: i % 5 === 0 ? '#ff9900' : i % 4 === 0 ? '#10b981' : '#22d3ee'
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const pts = nodes.map((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
        return { ...n, px: n.x * w, py: n.y * h };
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].px - pts[j].px;
          const dy = pts[i].py - pts[j].py;
          const dist = Math.hypot(dx, dy);
          if (dist < 155) {
            ctx.strokeStyle = `rgba(34, 211, 238, ${(1 - dist / 155) * 0.16})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pts[i].px, pts[i].py);
            ctx.lineTo(pts[j].px, pts[j].py);
            ctx.stroke();
          }
        }
        const mDist = Math.hypot(pts[i].px - mouse.x, pts[i].py - mouse.y);
        if (mDist < 180) {
          ctx.strokeStyle = `rgba(255, 153, 0, ${(1 - mDist / 180) * 0.28})`;
          ctx.beginPath();
          ctx.moveTo(pts[i].px, pts[i].py);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
        ctx.fillStyle = pts[i].color;
        ctx.globalAlpha = 0.72;
        ctx.beginPath();
        ctx.arc(pts[i].px, pts[i].py, pts[i].r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  };

  // Central Hologram Orb HUD renderer
  const initHoloCore = () => {
    const canvas = document.getElementById('holo-core-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let cw = 0;
    let ch = 0;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = rect.width;
      ch = rect.height;
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const anchors = [
      { id: 'vpc', fx: 0.16, fy: 0.2, color: '#ff9900' },
      { id: 'abac', fx: 0.84, fy: 0.2, color: '#22d3ee' },
      { id: 'n8n', fx: 0.16, fy: 0.8, color: '#10b981' },
      { id: 'linux', fx: 0.84, fy: 0.8, color: '#38bdf8' }
    ];

    const render = (now) => {
      const t = now * 0.001;
      ctx.clearRect(0, 0, cw, ch);
      const cx = cw * 0.5;
      const cy = ch * 0.5;

      // Energy links + travelling packets to each corner node
      anchors.forEach((a, idx) => {
        const ax = cw * a.fx;
        const ay = ch * a.fy;
        const isActive = a.id === activeTab;

        ctx.save();
        ctx.strokeStyle = isActive ? a.color : 'rgba(56, 189, 248, 0.26)';
        ctx.lineWidth = isActive ? 2 : 1.1;
        ctx.setLineDash([5, 5]);
        ctx.lineDashOffset = -t * 22;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(ax, ay);
        ctx.stroke();
        ctx.restore();

        const p = (t * 0.48 + idx * 0.25) % 1;
        const px = cx + (ax - cx) * p;
        const py = cy + (ay - cy) * p;
        ctx.fillStyle = isActive ? a.color : '#22d3ee';
        ctx.shadowColor = isActive ? a.color : '#22d3ee';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(px, py, isActive ? 3.5 : 2.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Outer & inner rotating holographic rings
      const rings = [
        { r: 66, speed: 0.55, dash: [14, 10], color: 'rgba(34, 211, 238, 0.55)', w: 1.5 },
        { r: 53, speed: -0.8, dash: [6, 8], color: 'rgba(255, 153, 0, 0.6)', w: 1.4 },
        { r: 41, speed: 1.15, dash: [20, 12], color: 'rgba(16, 185, 129, 0.5)', w: 1.2 }
      ];
      rings.forEach((ring) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * ring.speed);
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = ring.w;
        ctx.setLineDash(ring.dash);
        ctx.beginPath();
        ctx.arc(0, 0, ring.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // Glowing core orb
      const pulse = 26 + Math.sin(t * 2.6) * 2.2;
      const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, pulse * 1.9);
      grad.addColorStop(0, 'rgba(34, 211, 238, 0.95)');
      grad.addColorStop(0.45, 'rgba(14, 165, 233, 0.42)');
      grad.addColorStop(1, 'rgba(14, 165, 233, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, pulse * 1.9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#071022';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(cx, cy, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = '700 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('AWS', cx, cy - 5);
      ctx.fillStyle = '#22d3ee';
      ctx.fillText('CLOUD', cx, cy + 6);

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  };

  initHoloBackground();
  initHoloCore();
});
