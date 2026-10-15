/**
 * VIMAL RAJ | PORTFOLIO APPLICATION CORE
 * Interactive Logic for IR & Global Policy Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroNetwork();
  initPathwayFilter();
  initTimelineAccordion();
  initSkillsRadar();
  initPublicationsModal();
  initCvModals();
  initContactForm();
  initNavigationScroll();
});

/* ==========================================================================
   1. HERO CANVAS GEOPOLITICAL NETWORK ANIMATION
   ========================================================================== */
function initHeroNetwork() {
  const canvas = document.getElementById('hero-network-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animationFrameId;

  // Key Geopolitical Coordinate Nodes (Relative positions representing global hubs)
  // New Delhi, Washington D.C., Geneva, Oxford/London, Nairobi, Jerusalem, Singapore, Tokyo, Addis Ababa
  const globalHubs = [
    { name: "New Delhi", xRatio: 0.68, yRatio: 0.44, primary: true },
    { name: "Washington D.C.", xRatio: 0.25, yRatio: 0.35, primary: true },
    { name: "Geneva / UN", xRatio: 0.50, yRatio: 0.32, primary: true },
    { name: "Oxford / London", xRatio: 0.48, yRatio: 0.28, primary: true },
    { name: "Jerusalem", xRatio: 0.58, yRatio: 0.40, primary: false },
    { name: "Nairobi", xRatio: 0.59, yRatio: 0.58, primary: false },
    { name: "Singapore", xRatio: 0.78, yRatio: 0.54, primary: false },
    { name: "Tokyo", xRatio: 0.86, yRatio: 0.36, primary: false },
    { name: "Niamey (Niger)", xRatio: 0.49, yRatio: 0.49, primary: false },
    { name: "Chennai", xRatio: 0.70, yRatio: 0.49, primary: true }
  ];

  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  let mouse = { x: null, y: null, maxDist: 150 };

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
    recalculateNodes();
  });

  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    heroSection.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });
  }

  // Floating background ambient particles
  const particleCount = 42;
  const particles = [];

  function recalculateNodes() {
    particles.length = 0;
    
    // Add geopolitical hubs
    globalHubs.forEach(hub => {
      particles.push({
        x: hub.xRatio * width,
        y: hub.yRatio * height,
        baseX: hub.xRatio * width,
        baseY: hub.yRatio * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: hub.primary ? 4.5 : 3.0,
        name: hub.name,
        isHub: true,
        primary: hub.primary,
        pulse: Math.random() * Math.PI * 2
      });
    });

    // Add ambient telemetry nodes
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        isHub: false,
        pulse: Math.random() * Math.PI
      });
    }
  }

  recalculateNodes();

  // Dynamic connection arcs
  let flightArcProgress = 0;

  function render() {
    ctx.clearRect(0, 0, width, height);

    flightArcProgress += 0.006;
    if (flightArcProgress > 1) flightArcProgress = 0;

    // Draw grid longitude / latitude lines subtle background
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 120) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 80) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Connect nodes with proximity lines
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];

      // Update positions
      p1.x += p1.vx;
      p1.y += p1.vy;
      p1.pulse += 0.03;

      if (p1.x < 0 || p1.x > width) p1.vx *= -1;
      if (p1.y < 0 || p1.y > height) p1.vy *= -1;

      // Mouse influence
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - p1.x;
        const dy = mouse.y - p1.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.maxDist) {
          const force = (1 - dist / mouse.maxDist) * 1.5;
          p1.x -= (dx / dist) * force;
          p1.y -= (dy / dist) * force;
        }
      }

      // Proximity lines
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        const maxThreshold = (p1.isHub && p2.isHub) ? 220 : 130;

        if (dist < maxThreshold) {
          const alpha = (1 - dist / maxThreshold) * (p1.isHub && p2.isHub ? 0.35 : 0.12);
          ctx.strokeStyle = p1.isHub && p2.isHub 
            ? `rgba(197, 155, 39, ${alpha})` 
            : `rgba(147, 197, 253, ${alpha})`;
          ctx.lineWidth = p1.isHub && p2.isHub ? 1.2 : 0.75;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // Draw active flight arcs between key capitals (Chennai -> New Delhi, New Delhi -> Washington, New Delhi -> Oxford)
    const hubChennai = particles.find(p => p.name === "Chennai");
    const hubDelhi = particles.find(p => p.name === "New Delhi");
    const hubOxford = particles.find(p => p.name === "Oxford / London");
    const hubGeneva = particles.find(p => p.name === "Geneva / UN");

    if (hubDelhi && hubOxford && hubGeneva) {
      drawCurvedArc(ctx, hubDelhi, hubOxford, flightArcProgress, 'rgba(197, 155, 39, 0.45)');
      drawCurvedArc(ctx, hubDelhi, hubGeneva, (flightArcProgress + 0.4) % 1, 'rgba(96, 165, 250, 0.45)');
    }

    // Draw nodes
    particles.forEach(p => {
      ctx.beginPath();
      const currentRadius = p.radius + (p.isHub ? Math.sin(p.pulse) * 1.2 : 0);
      ctx.arc(p.x, p.y, Math.max(currentRadius, 1), 0, Math.PI * 2);

      if (p.isHub) {
        if (p.primary) {
          ctx.fillStyle = '#f6e05e';
          ctx.shadowColor = 'rgba(246, 224, 94, 0.6)';
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = '#93c5fd';
          ctx.shadowColor = 'rgba(147, 197, 253, 0.5)';
          ctx.shadowBlur = 6;
        }
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Draw ring around primary hubs
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = p.primary ? 'rgba(197, 155, 39, 0.3)' : 'rgba(147, 197, 253, 0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // City labels (subtle)
        if (width > 768) {
          ctx.font = '10px -apple-system, Inter, sans-serif';
          ctx.fillStyle = 'rgba(226, 232, 240, 0.65)';
          ctx.fillText(p.name, p.x + 8, p.y + 3);
        }
      } else {
        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.fill();
      }
    });

    animationFrameId = requestAnimationFrame(render);
  }

  function drawCurvedArc(context, start, end, progress, color) {
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2 - 40; // Arc upward

    context.beginPath();
    context.moveTo(start.x, start.y);
    context.quadraticCurveTo(midX, midY, end.x, end.y);
    context.strokeStyle = color;
    context.lineWidth = 1.2;
    context.setLineDash([4, 6]);
    context.stroke();
    context.setLineDash([]); // reset

    // Animated traveler dot along the curve
    const t = progress;
    const curX = (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * midX + t * t * end.x;
    const curY = (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * midY + t * t * end.y;

    context.beginPath();
    context.arc(curX, curY, 3, 0, Math.PI * 2);
    context.fillStyle = '#ffffff';
    context.shadowColor = '#ffffff';
    context.shadowBlur = 8;
    context.fill();
    context.shadowBlur = 0;
  }

  render();
}

/* ==========================================================================
   2. THE "CHOOSE YOUR PATH" FILTER (CORE FEATURE)
   ========================================================================== */
function initPathwayFilter() {
  const filterButtons = document.querySelectorAll('.path-filter-btn');
  const insightBanner = document.getElementById('pathway-insight-banner');
  const timelineItems = document.querySelectorAll('.timeline-item');
  const publicationCards = document.querySelectorAll('.pub-card');

  // Pathway specific metadata configurations
  const pathwayData = {
    all: {
      title: "Comprehensive Dossier: IR, Policy, & Academic Research",
      desc: "An integrated trajectory across qualitative research, bilateral/multilateral diplomacy, open-source intelligence monitoring, and government communication strategy.",
      tags: ["All Trajectories", "UGC NET Qualified", "World Bank IAMP", "Oxford Saïd AI", "Public Relations"]
    },
    academic: {
      title: "Academic & Scholarly Research Pathway",
      desc: "Rigorous scholarly foundations in international relations theories, defence policy analysis, theological diplomacy (Israel-US), and UGC NET qualifications for assistant professorship.",
      tags: ["UGC NET IR (Code 90)", "University of Madras M.A.", "Dissertation: US-Israel Diplomacy", "Oxford AI Governance", "Trade Law (IIT KGP)"]
    },
    policy: {
      title: "International Organizations & Global Policy Pathway",
      desc: "Direct field and institutional experience in multilateral program assessment (World Bank-funded IAMP), comparative governance analysis (India & Niger), and government media monitoring.",
      tags: ["World Bank-assisted IAMP", "MAWS Swachh Bharat Mission", "Comparative Project Analysis", "UN Res 2758 / MUN", "WTO Multilateralism"]
    }
  };

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedPath = btn.getAttribute('data-path');

      // 1. Update button states
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // 2. Smoothly update Insight Banner
      if (insightBanner && pathwayData[selectedPath]) {
        insightBanner.style.opacity = '0';
        insightBanner.style.transform = 'translateY(6px)';

        setTimeout(() => {
          const data = pathwayData[selectedPath];
          const titleEl = insightBanner.querySelector('.insight-title');
          const descEl = insightBanner.querySelector('.insight-desc');
          const tagsContainer = insightBanner.querySelector('.insight-focus-tags');

          if (titleEl) titleEl.textContent = data.title;
          if (descEl) descEl.textContent = data.desc;
          if (tagsContainer) {
            tagsContainer.innerHTML = data.tags
              .map(tag => `<span class="focus-tag">${tag}</span>`)
              .join('');
          }

          insightBanner.style.opacity = '1';
          insightBanner.style.transform = 'translateY(0)';
        }, 180);
      }

      // 3. Filter Timeline Items
      timelineItems.forEach(item => {
        const itemPaths = item.getAttribute('data-paths') || '';
        const match = selectedPath === 'all' || itemPaths.includes(selectedPath);

        if (match) {
          item.classList.remove('filtered-out');
          item.style.display = 'block';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        } else {
          item.classList.add('filtered-out');
          setTimeout(() => {
            if (item.classList.contains('filtered-out')) {
              item.style.display = 'none';
            }
          }, 350);
        }
      });

      // 4. Filter Publication Cards
      publicationCards.forEach(card => {
        const cardPaths = card.getAttribute('data-paths') || '';
        const match = selectedPath === 'all' || cardPaths.includes(selectedPath);

        if (match) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0.2';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            if (card.style.opacity === '0.2') {
              card.style.display = 'none';
            }
          }, 350);
        }
      });

      // 5. Trigger Skills Radar category highlight if applicable
      if (window.highlightRadarCategory) {
        window.highlightRadarCategory(selectedPath);
      }
    });
  });
}

/* ==========================================================================
   3. INTERACTIVE TIMELINE / WORK MATRIX ACCORDIONS
   ========================================================================== */
function initTimelineAccordion() {
  const cards = document.querySelectorAll('.timeline-card');

  cards.forEach(card => {
    const header = card.querySelector('.card-main-header');
    if (!header) return;

    header.addEventListener('click', (e) => {
      // Don't toggle if user clicked an inner link or button
      if (e.target.closest('button') || e.target.closest('a')) return;

      const isExpanded = card.classList.contains('expanded');

      // Optional: keep single expand or multi expand. Multi expand is friendlier for comparing.
      if (isExpanded) {
        card.classList.remove('expanded');
        const text = card.querySelector('.expand-toggle-text span');
        if (text) text.textContent = "View Strategic Scope & Metrics";
      } else {
        card.classList.add('expanded');
        const text = card.querySelector('.expand-toggle-text span');
        if (text) text.textContent = "Collapse Scope & Metrics";
      }
    });
  });
}

/* ==========================================================================
   4. DYNAMIC SKILLS & TOOLS RADAR CHART
   ========================================================================== */
function initSkillsRadar() {
  const canvas = document.getElementById('skills-radar-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Radar Metrics Dimensions (Grouped into 4 quadrants)
  const skillsData = [
    { label: "Qualitative Research", value: 0.94, category: "academic", tool: "NVivo & Field Work" },
    { label: "Open-Source Monitoring", value: 0.92, category: "policy", tool: "Daily Press Briefs" },
    { label: "Comparative Policy", value: 0.90, category: "policy", tool: "TN IAMP vs Niger" },
    { label: "Security & Defence Analysis", value: 0.88, category: "academic", tool: "India's Foreign Policy" },
    { label: "Trade Law & WTO", value: 0.86, category: "academic", tool: "IIT Kharagpur Certified" },
    { label: "Multilateral Governance", value: 0.90, category: "policy", tool: "World Bank & UN Frameworks" },
    { label: "AI Governance & Data", value: 0.85, category: "policy", tool: "Oxford Saïd Certified" },
    { label: "Strategic PR & Comm", value: 0.92, category: "policy", tool: "MAWS & Visual Comm" }
  ];

  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
    drawRadar();
  });

  let activeHighlight = 'all';

  window.highlightRadarCategory = function(category) {
    activeHighlight = category;
    drawRadar();
  };

  let hoveredIndex = -1;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 50;

    let found = -1;
    skillsData.forEach((skill, i) => {
      const angle = (Math.PI * 2 / skillsData.length) * i - Math.PI / 2;
      const pointR = radius * skill.value;
      const px = centerX + Math.cos(angle) * pointR;
      const py = centerY + Math.sin(angle) * pointR;

      if (Math.hypot(mouseX - px, mouseY - py) < 14) {
        found = i;
      }
    });

    if (found !== hoveredIndex) {
      hoveredIndex = found;
      drawRadar();
    }
  });

  canvas.addEventListener('mouseleave', () => {
    if (hoveredIndex !== -1) {
      hoveredIndex = -1;
      drawRadar();
    }
  });

  function drawRadar() {
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 55;
    const total = skillsData.length;

    // Draw concentric web polygons (20%, 40%, 60%, 80%, 100%)
    const levels = 5;
    for (let level = 1; level <= levels; level++) {
      const r = (radius / levels) * level;
      ctx.beginPath();
      for (let i = 0; i < total; i++) {
        const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = level === levels ? 'rgba(30, 58, 100, 0.35)' : 'rgba(203, 213, 225, 0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Label concentric percentage
      ctx.font = '10px -apple-system, Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`${level * 20}%`, centerX + 4, centerY - r + 11);
    }

    // Draw radial axes lines
    for (let i = 0; i < total; i++) {
      const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.7)';
      ctx.stroke();

      // Axis label text
      const labelRadius = radius + 22;
      const lx = centerX + Math.cos(angle) * labelRadius;
      const ly = centerY + Math.sin(angle) * labelRadius;

      ctx.font = '11px -apple-system, Inter, sans-serif';
      ctx.fillStyle = (hoveredIndex === i || (activeHighlight !== 'all' && skillsData[i].category === activeHighlight))
        ? '#0b1728' 
        : '#475569';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Slight word wrapping or label adjustments
      const label = skillsData[i].label;
      ctx.fillText(label, lx, ly);
    }

    // Draw Data Polygon Fill
    ctx.beginPath();
    skillsData.forEach((skill, i) => {
      const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
      const r = radius * skill.value;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();

    const gradient = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(37, 99, 235, 0.35)');
    gradient.addColorStop(1, 'rgba(11, 23, 40, 0.15)');
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = '#0b1728';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw Data Point Nodes
    skillsData.forEach((skill, i) => {
      const angle = (Math.PI * 2 / total) * i - Math.PI / 2;
      const r = radius * skill.value;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;

      const isHovered = hoveredIndex === i;
      const isPathMatch = activeHighlight === 'all' || skill.category === activeHighlight;

      ctx.beginPath();
      ctx.arc(x, y, isHovered ? 7 : (isPathMatch ? 5 : 3.5), 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? '#c59b27' : (isPathMatch ? '#1e3a64' : '#94a3b8');
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Tooltip for hovered point
      if (isHovered) {
        ctx.fillStyle = '#0b1728';
        const tooltipW = 160;
        const tooltipH = 46;
        const tx = Math.min(Math.max(x - tooltipW / 2, 10), width - tooltipW - 10);
        const ty = y - tooltipH - 12;

        ctx.beginPath();
        ctx.roundRect(tx, ty, tooltipW, tooltipH, 6);
        ctx.fill();

        ctx.font = 'bold 11px -apple-system, Inter, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText(`${skill.label} (${Math.round(skill.value * 100)}%)`, tx + 8, ty + 18);

        ctx.font = '10px -apple-system, Inter, sans-serif';
        ctx.fillStyle = '#f6e05e';
        ctx.fillText(`Key: ${skill.tool}`, tx + 8, ty + 34);
      }
    });
  }

  drawRadar();
}

/* ==========================================================================
   5. SELECTED PUBLICATIONS & POLICY PAPERS MODAL
   ========================================================================== */
function initPublicationsModal() {
  const modalBackdrop = document.getElementById('publication-modal-backdrop');
  const modalTitle = document.getElementById('modal-pub-title');
  const modalMeta = document.getElementById('modal-pub-meta');
  const modalContent = document.getElementById('modal-pub-body');
  const closeBtn = document.getElementById('modal-pub-close');

  const pubDossiers = {
    rupee: {
      title: "The Fall of the Indian Rupee and the Need to Arrest It",
      type: "Analytical Macroeconomic & Geopolitical Article",
      period: "2023 | Geoeconomics & Trade Strategy",
      body: `
        <h4 style="font-size:1.1rem; color:#0b1728; margin-bottom:0.5rem;">Executive Summary</h4>
        <p style="margin-bottom:1rem; color:#475569;">
          An incisive examination of post-pandemic currency volatility, rising US Federal Reserve interest rates, and the geoeconomic vulnerabilities of India’s trade balance. The paper dissects capital outflows, crude oil pricing mechanisms, and the strategic rationale for rupee-denominated bilateral trade arrangements.
        </p>
        <h4 style="font-size:1.1rem; color:#0b1728; margin-bottom:0.5rem;">Core Policy Insights</h4>
        <ul style="margin-left:1.25rem; color:#334155; margin-bottom:1rem; line-height:1.7;">
          <li><strong>Structural Trade Deficits:</strong> Assessing reliance on imported crude and electronics, recommending tariff adjustments aligned with WTO rules.</li>
          <li><strong>Internationalization of the Rupee:</strong> Exploring Vostro accounts and bilateral currency swaps (e.g., India-UAE, India-Russia) as insulation against dollar hegemony.</li>
          <li><strong>Strategic Reserve Management:</strong> RBI intervention paradigms to dampen speculative pressures without exhausting critical foreign currency buffers.</li>
        </ul>
      `
    },
    'uk-devolution': {
      title: "What if the UK breaks up? Lessons for India's trade deals from the Cardiff MoU",
      type: "Analytical Trade Policy & Constitutional Geopolitics Paper",
      period: "2024 | Trade Policy, Devolution & Geoeconomics",
      body: `
        <h4 style="font-size:1.1rem; color:#0b1728; margin-bottom:0.5rem;">Executive Summary</h4>
        <p style="margin-bottom:1rem; color:#475569;">
          This analytical inquiry examines the constitutional stresses facing the United Kingdom post-Brexit and the potential fragmentation risks among devolved administrations (Scotland, Wales, Northern Ireland). Using the Cardiff Memorandum of Understanding (MoU) on Devolution as an analytical framework, the paper evaluates intergovernmental friction over international treaty-making powers, and extracts actionable strategic lessons for India’s bilateral trade negotiations (such as the India-UK Free Trade Agreement).
        </p>
        <h4 style="font-size:1.1rem; color:#0b1728; margin-bottom:0.5rem;">Core Policy Insights</h4>
        <ul style="margin-left:1.25rem; color:#334155; margin-bottom:1rem; line-height:1.7;">
          <li><strong>Devolution & Treaty Implementation Risks:</strong> Assesses how devolved jurisdictions possess statutory competence over agriculture, environmental baselines, and public procurement—creating ratification and compliance bottlenecks for UK-wide trade deals.</li>
          <li><strong>The Cardiff MoU Mechanism:</strong> Analyzes the Joint Ministerial Committee (JMC) and intergovernmental consultation machinery, highlighting institutional weaknesses when central treaty negotiators fail to secure subnational consensus.</li>
          <li><strong>Strategic Hedging for India:</strong> Recommends Indian trade negotiators incorporate subnational consultation safeguards, sectoral carve-outs, and legal risk insulation against constitutional instability in partner states.</li>
        </ul>
      `
    },
    israel: {
      title: "Israel-US and Protestant Diplomacy",
      type: "Master of Arts Dissertation | University of Madras",
      period: "2024 | Theopolitics & Foreign Policy Lobbying",
      body: `
        <h4 style="font-size:1.1rem; color:#0b1728; margin-bottom:0.5rem;">Dissertation Abstract</h4>
        <p style="margin-bottom:1rem; color:#475569;">
          A comprehensive scholarly inquiry into the influence of American Evangelical and Protestant theological movements on United States bilateral diplomacy towards the State of Israel. Submitted in partial fulfillment of the Master of Arts in International Relations at the University of Madras.
        </p>
        <h4 style="font-size:1.1rem; color:#0b1728; margin-bottom:0.5rem;">Methodology & Research Contributions</h4>
        <ul style="margin-left:1.25rem; color:#334155; margin-bottom:1rem; line-height:1.7;">
          <li><strong>Theological Underpinnings:</strong> Analyzed Christian Zionism, dispensationalist eschatology, and their transformation into congressional lobbying mechanisms (e.g., CUFI, AIPAC alignments).</li>
          <li><strong>Bipartisanship Erosion:</strong> Mapped the shifting domestic political calculus surrounding the Abraham Accords and embassy relocations to Jerusalem.</li>
          <li><strong>Qualitative Discourse Analysis:</strong> Synthesized diplomatic cables, congressional records, and institutional literature across five decades of US foreign policy.</li>
        </ul>
      `
    },
    iamp: {
      title: "Comparative Study: Tamil Nadu IAMP & Niger’s Kandadji Project",
      type: "World Bank-Assisted Policy Research Report",
      period: "2023 | Multilateral Project Implementation & Governance",
      body: `
        <h4 style="font-size:1.1rem; color:#0b1728; margin-bottom:0.5rem;">Project Evaluation Dossier</h4>
        <p style="margin-bottom:1rem; color:#475569;">
          Conducted under the Tamil Nadu Irrigated Agriculture Modernization Project (TN-IAMP), this qualitative assessment benchmarked inter-departmental convergence in Tamil Nadu against the institutional and political economy bottlenecks experienced in West Africa's Kandadji Dam project along the Niger River basin.
        </p>
        <h4 style="font-size:1.1rem; color:#0b1728; margin-bottom:0.5rem;">Core Comparative Takeaways</h4>
        <ul style="margin-left:1.25rem; color:#334155; margin-bottom:1rem; line-height:1.7;">
          <li><strong>Inter-Agency Coordination:</strong> Tamil Nadu’s model connected 8 line departments (Water Resources, Agriculture, Horticulture, Animal Husbandry, Fisheries, Agri-Marketing, etc.) through a central project directorate.</li>
          <li><strong>Institutional Friction:</strong> Analyzed institutional capacity gaps, land acquisition delays, and environmental compliance frameworks between South Asia and the Sahel.</li>
          <li><strong>Stakeholder Feedback Loops:</strong> Formulated actionable frameworks for community water-user associations (WUAs) to maintain infrastructure post-multilateral funding.</li>
        </ul>
      `
    },
    taiwan: {
      title: "Taiwan’s Sovereignty Status Under UN Resolution 2758",
      type: "Model United Nations Simulation Research Paper",
      period: "2023, 2024 | Christ University, Bengaluru",
      body: `
        <h4 style="font-size:1.1rem; color:#0b1728; margin-bottom:0.5rem;">Diplomatic Analysis</h4>
        <p style="margin-bottom:1rem; color:#475569;">
          An examination of the legal ambiguities and diplomatic interpretations surrounding United Nations General Assembly Resolution 2758 (1971), which recognized the PRC as the sole representative of China to the UN, and its contemporary implications for Taiwan’s participation in specialized UN agencies (WHO, ICAO).
        </p>
        <h4 style="font-size:1.1rem; color:#0b1728; margin-bottom:0.5rem;">Analytical Breakdown</h4>
        <ul style="margin-left:1.25rem; color:#334155; margin-bottom:1rem; line-height:1.7;">
          <li><strong>The "One China" Duality:</strong> Deconstructing Beijing’s "One China Principle" versus Washington’s "One China Policy" within multilateral treaties.</li>
          <li><strong>Nuclear Proliferation Simulation:</strong> Represented Uganda in simulated international crisis committee examining East Asian deterrence matrices and cross-strait non-proliferation treaties.</li>
        </ul>
      `
    }
  };

  document.querySelectorAll('.open-pub-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const pubId = btn.getAttribute('data-pub');
      const data = pubDossiers[pubId];
      if (!data || !modalBackdrop) return;

      modalTitle.textContent = data.title;
      modalMeta.textContent = `${data.type} · ${data.period}`;
      modalContent.innerHTML = data.body;

      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn && modalBackdrop) {
    closeBtn.addEventListener('click', () => {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    });

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ==========================================================================
   6. CV DOWNLOAD & MODAL PREVIEW HANDLERS
   ========================================================================== */
function initCvModals() {
  const previewModal = document.getElementById('cv-preview-modal-backdrop');
  const cvModalTitle = document.getElementById('modal-cv-title');
  const cvModalContent = document.getElementById('modal-cv-body');
  const cvCloseBtn = document.getElementById('modal-cv-close');
  const cvPrintBtn = document.getElementById('modal-cv-print');

  const cvResearchContent = `
    <div style="font-family:'Newsreader', Georgia, serif; color:#0b1728; max-width:720px; margin:0 auto; padding:1rem 0;">
      <div style="text-align:center; border-bottom:2px solid #0b1728; padding-bottom:1rem; margin-bottom:1.5rem;">
        <h1 style="font-size:1.85rem; margin-bottom:0.25rem; font-weight:700;">VIMAL RAJ</h1>
        <p style="font-family:'Inter', sans-serif; font-size:0.85rem; color:#475569; margin-bottom:0.25rem;">
          rajvimal3232@gmail.com | +91 88382 80781 | Chennai, Tamil Nadu 600101 | linkedin.com/in/vimal1
        </p>
        <p style="font-family:'Inter', sans-serif; font-size:0.8rem; font-weight:600; color:#1e3a64; text-transform:uppercase; letter-spacing:0.08em;">
          Academic & Research Curriculum Vitae · International Relations
        </p>
      </div>

      <div style="margin-bottom:1.5rem;">
        <h3 style="font-size:1.15rem; border-bottom:1px solid #cbd5e1; padding-bottom:0.25rem; margin-bottom:0.75rem; text-transform:uppercase; letter-spacing:0.05em;">Scholarly Credentials & Academic Summary</h3>
        <p style="font-family:'Inter', sans-serif; font-size:0.88rem; color:#334155; line-height:1.65;">
          International Relations postgraduate (University of Madras) qualified with UGC NET (Assistant Professor, Subject Code 90). Advanced competencies in qualitative policy inquiry, comparative international governance, defense analysis, and technology diplomacy. Dedicated to rigorous background research, literature synthesis, and open-source intelligence analysis for think tanks and security programs.
        </p>
      </div>

      <div style="margin-bottom:1.5rem;">
        <h3 style="font-size:1.15rem; border-bottom:1px solid #cbd5e1; padding-bottom:0.25rem; margin-bottom:0.75rem; text-transform:uppercase; letter-spacing:0.05em;">Higher Education & Certifications</h3>
        
        <div style="margin-bottom:1rem;">
          <div style="display:flex; justify-content:space-between; font-weight:600; font-family:'Inter', sans-serif; font-size:0.92rem;">
            <span>Master of Arts, International Relations | University of Madras, Chennai</span>
            <span>2024</span>
          </div>
          <p style="font-family:'Inter', sans-serif; font-size:0.82rem; color:#475569; margin-top:0.25rem;">
            <strong>Coursework:</strong> Theories of IR · Foreign Policy of India · Defence Policy Analysis · India–Major Powers Relations · AI and Tech Diplomacy · Supply Chain Challenges · International Organizations.<br>
            <strong>Dissertation:</strong> <em>Israel-US and Protestant Diplomacy</em> (Theological geopolitics & foreign policy lobbying).<br>
            <strong>National Qualification:</strong> UGC NET Qualified (Assistant Professor, International Relations, Subject Code 90).
          </p>
        </div>

        <div style="margin-bottom:1rem;">
          <div style="display:flex; justify-content:space-between; font-weight:600; font-family:'Inter', sans-serif; font-size:0.92rem;">
            <span>Certificate, AI and Digital Transformation in Government | Saïd Business School, Oxford (online)</span>
            <span>2026</span>
          </div>
          <p style="font-family:'Inter', sans-serif; font-size:0.82rem; color:#475569; margin-top:0.25rem;">
            AI in governance, ethical risk management, algorithmic accountability, and treating data as a public asset.
          </p>
        </div>

        <div style="margin-bottom:1rem;">
          <div style="display:flex; justify-content:space-between; font-weight:600; font-family:'Inter', sans-serif; font-size:0.92rem;">
            <span>Certificate, International Trade Law | IIT Kharagpur</span>
            <span>2023</span>
          </div>
          <p style="font-family:'Inter', sans-serif; font-size:0.82rem; color:#475569; margin-top:0.25rem;">
            WTO agreements, plurilateralism, SPS and tariff/non-tariff measures, and the post–Cold War geoeconomic order.
          </p>
        </div>

        <div style="margin-bottom:0.5rem;">
          <div style="display:flex; justify-content:space-between; font-weight:600; font-family:'Inter', sans-serif; font-size:0.92rem;">
            <span>Bachelor’s, Visual Communication | SRM University, Chennai</span>
            <span>2018</span>
          </div>
          <p style="font-family:'Inter', sans-serif; font-size:0.82rem; color:#475569; margin-top:0.25rem;">
            Media studies, digital communication strategy, visual storytelling, and strategic public relations.
          </p>
        </div>
      </div>

      <div style="margin-bottom:1.5rem;">
        <h3 style="font-size:1.15rem; border-bottom:1px solid #cbd5e1; padding-bottom:0.25rem; margin-bottom:0.75rem; text-transform:uppercase; letter-spacing:0.05em;">Policy Research & Institutional Engagements</h3>
        
        <div style="margin-bottom:1rem;">
          <div style="display:flex; justify-content:space-between; font-weight:600; font-family:'Inter', sans-serif; font-size:0.92rem;">
            <span>Research Intern | Tamil Nadu IAMP (World Bank-funded), Water Resources Dept</span>
            <span>2023</span>
          </div>
          <ul style="font-family:'Inter', sans-serif; font-size:0.82rem; color:#475569; margin-left:1.25rem; margin-top:0.25rem; line-height:1.6;">
            <li>Conducted qualitative research across 8 state line departments assessing World Bank-assisted Irrigated Agriculture Modernization Project implementation.</li>
            <li>Conducted comparative institutional assessment between Tamil Nadu’s IAMP and Niger’s Kandadji Dam Project to isolate policy implementation hurdles.</li>
            <li>Engaged inter-agency leadership in review symposia to track quantitative progress and address policy friction.</li>
          </ul>
        </div>

        <div style="margin-bottom:0.5rem;">
          <div style="display:flex; justify-content:space-between; font-weight:600; font-family:'Inter', sans-serif; font-size:0.92rem;">
            <span>Public Relations Coordinator | Swachh Bharat Mission (MAWS Department)</span>
            <span>2026 – Present</span>
          </div>
          <ul style="font-family:'Inter', sans-serif; font-size:0.82rem; color:#475569; margin-left:1.25rem; margin-top:0.25rem; line-height:1.6;">
            <li>Monitored major newspapers and open-source intelligence for regional governance developments, preparing daily strategic briefs for senior departmental leadership and executive decision-makers.</li>
            <li>Reviewed and fact-checked municipal daily reports ensuring empirical data precision.</li>
            <li>Led digital transparency channels across social platforms (X, Instagram).</li>
          </ul>
        </div>
      </div>

      <div style="margin-bottom:1rem;">
        <h3 style="font-size:1.15rem; border-bottom:1px solid #cbd5e1; padding-bottom:0.25rem; margin-bottom:0.75rem; text-transform:uppercase; letter-spacing:0.05em;">Writing, Simulations & Languages</h3>
        <p style="font-family:'Inter', sans-serif; font-size:0.82rem; color:#334155; line-height:1.6;">
          <strong>Analytical Papers:</strong> "The Fall of the Indian Rupee and the Need to Arrest It"; "What if the UK breaks up? Lessons for India's trade deals from the Cardiff MoU."<br>
          <strong>Diplomatic Simulations:</strong> Christ University MUN (2023, 2024): UN Resolution 2758 & Taiwan Sovereignty; Nuclear proliferation in East Asia.<br>
          <strong>Languages:</strong> English (Proficient), Tamil (Native), Hindi (Upper Intermediate), French (Intermediate), Mandarin Chinese (Elementary).<br>
          <strong>Research Software:</strong> NVivo, Qualitative Content Analysis, Open-Source Intelligence (OSINT).
        </p>
      </div>
    </div>
  `;

  const cvProfessionalContent = `
    <div style="font-family:'Inter', sans-serif; color:#0b1728; max-width:720px; margin:0 auto; padding:1rem 0;">
      <div style="border-bottom:3px solid #1e3a64; padding-bottom:1rem; margin-bottom:1.5rem;">
        <h1 style="font-size:1.85rem; margin-bottom:0.25rem; font-weight:700; color:#0b1728;">VIMAL RAJ</h1>
        <p style="font-size:0.85rem; color:#475569; margin-bottom:0.25rem;">
          rajvimal3232@gmail.com | +91 88382 80781 | Chennai, Tamil Nadu 600101 | linkedin.com/in/vimal1
        </p>
        <p style="font-size:0.8rem; font-weight:700; color:#c59b27; text-transform:uppercase; letter-spacing:0.08em;">
          Policy Analyst · Communications Strategist · Multilateral Project Coordinator
        </p>
      </div>

      <div style="margin-bottom:1.5rem;">
        <h3 style="font-size:1.05rem; font-weight:700; color:#0b1728; border-bottom:1px solid #cbd5e1; padding-bottom:0.25rem; margin-bottom:0.6rem; text-transform:uppercase;">Executive Profile</h3>
        <p style="font-size:0.88rem; color:#334155; line-height:1.6;">
          Results-driven International Relations professional with multidisciplinary expertise in government communications, World Bank-funded policy evaluation, stakeholder management, and open-source intelligence monitoring. Proven track record in orchestrating multi-agency coordination, synthesizing high-stakes executive briefs for senior leadership, and managing high-profile corporate client operations.
        </p>
      </div>

      <div style="margin-bottom:1.5rem;">
        <h3 style="font-size:1.05rem; font-weight:700; color:#0b1728; border-bottom:1px solid #cbd5e1; padding-bottom:0.25rem; margin-bottom:0.6rem; text-transform:uppercase;">Professional Experience</h3>
        
        <div style="margin-bottom:1.2rem;">
          <div style="display:flex; justify-content:space-between; font-weight:700; font-size:0.92rem;">
            <span>Public Relations Coordinator | Swachh Bharat Mission (MAWS Dept)</span>
            <span style="color:#64748b;">2026 – Present</span>
          </div>
          <ul style="font-size:0.84rem; color:#475569; margin-left:1.25rem; margin-top:0.35rem; line-height:1.55;">
            <li>Synthesized daily open-source regional media intelligence into actionable briefs for senior departmental leadership and executive decision-makers.</li>
            <li>Led empirical fact-checking and data reconciliation across daily municipal operational reporting frameworks.</li>
            <li>Managed departmental communications on X and Instagram, increasing public engagement and accountability.</li>
          </ul>
        </div>

        <div style="margin-bottom:1.2rem;">
          <div style="display:flex; justify-content:space-between; font-weight:700; font-size:0.92rem;">
            <span>Research Intern | Tamil Nadu IAMP (World Bank-Funded), WRD</span>
            <span style="color:#64748b;">2023</span>
          </div>
          <ul style="font-size:0.84rem; color:#475569; margin-left:1.25rem; margin-top:0.35rem; line-height:1.55;">
            <li>Coordinated qualitative policy research across 8 state departments to streamline World Bank project deliverables.</li>
            <li>Authored comparative study assessing policy bottlenecks between Tamil Nadu IAMP and West Africa's Kandadji Dam Project.</li>
            <li>Facilitated stakeholder coordination across high-level inter-departmental review sessions.</li>
          </ul>
        </div>

        <div style="margin-bottom:1.2rem;">
          <div style="display:flex; justify-content:space-between; font-weight:700; font-size:0.92rem;">
            <span>Projects Coordinator | Eco-Club, University of Madras</span>
            <span style="color:#64748b;">2022 – 2024</span>
          </div>
          <ul style="font-size:0.84rem; color:#475569; margin-left:1.25rem; margin-top:0.35rem; line-height:1.55;">
            <li>Mobilized and directed 60+ student volunteers across environmental sustainability campaigns.</li>
            <li>Spearheaded partnerships with premier NGOs (Nizhal & Exnora) on urban afforestation and community initiatives.</li>
          </ul>
        </div>

        <div style="margin-bottom:0.5rem;">
          <div style="display:flex; justify-content:space-between; font-weight:700; font-size:0.92rem;">
            <span>Event Operations Executive | Brandwise Event Management</span>
            <span style="color:#64748b;">2019 – 2020</span>
          </div>
          <ul style="font-size:0.84rem; color:#475569; margin-left:1.25rem; margin-top:0.35rem; line-height:1.55;">
            <li>Executed corporate launches and operations for multinational clients: Asian Paints, Danfoss, Husqvarna, Van Heusen.</li>
            <li>Supervised site operations, vendor matrices, budget deadlines, and VIP client relations.</li>
          </ul>
        </div>
      </div>

      <div style="margin-bottom:1.25rem;">
        <h3 style="font-size:1.05rem; font-weight:700; color:#0b1728; border-bottom:1px solid #cbd5e1; padding-bottom:0.25rem; margin-bottom:0.6rem; text-transform:uppercase;">Education & Credentials</h3>
        <p style="font-size:0.84rem; color:#334155; line-height:1.55;">
          • <strong>M.A. International Relations</strong> | University of Madras (2024) — UGC NET Qualified (Subject Code 90)<br>
          • <strong>AI and Digital Transformation in Government</strong> | Saïd Business School, Oxford (2026)<br>
          • <strong>International Trade Law</strong> | IIT Kharagpur (2023)<br>
          • <strong>B.Sc. Visual Communication</strong> | SRM University (2018)
        </p>
      </div>

      <div>
        <h3 style="font-size:1.05rem; font-weight:700; color:#0b1728; border-bottom:1px solid #cbd5e1; padding-bottom:0.25rem; margin-bottom:0.6rem; text-transform:uppercase;">Core Competencies</h3>
        <p style="font-size:0.84rem; color:#334155; line-height:1.55;">
          <strong>Core Skills:</strong> Open-Source Media Intelligence, Policy Briefing, Stakeholder Relations, Fact-Checking, Corporate Logistics.<br>
          <strong>Languages:</strong> English, Tamil, Hindi, French, Mandarin Chinese.<br>
          <strong>Tools:</strong> NVivo, Microsoft Office Suite, X/Twitter Analytics, Meta Suite, OSINT Synthesis.
        </p>
      </div>
    </div>
  `;

  document.querySelectorAll('.open-cv-preview').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const type = btn.getAttribute('data-cv-type'); // 'research' or 'professional'

      if (type === 'research') {
        cvModalTitle.textContent = "Academic & Research Curriculum Vitae (UGC NET & Oxford Saïd Focus)";
        cvModalContent.innerHTML = cvResearchContent;
      } else {
        cvModalTitle.textContent = "Professional & Policy Resume (Operations, PR & World Bank Focus)";
        cvModalContent.innerHTML = cvProfessionalContent;
      }

      previewModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (cvCloseBtn && previewModal) {
    cvCloseBtn.addEventListener('click', () => {
      previewModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    previewModal.addEventListener('click', (e) => {
      if (e.target === previewModal) {
        previewModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  if (cvPrintBtn) {
    cvPrintBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ==========================================================================
   7. CONTACT FORM & INTERACTION NOTIFICATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const toast = document.getElementById('contact-toast');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const org = form.querySelector('[name="organization"]').value.trim();
    const focus = form.querySelector('[name="focus"]').value;
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      alert("Please provide your name, email, and message.");
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Transmitting Message...</span>`;
    submitBtn.disabled = true;

    // Simulate reliable transmission & prepare mailto link
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      form.reset();

      // Show toast
      if (toast) {
        toast.classList.add('show');
        setTimeout(() => {
          toast.classList.remove('show');
        }, 5000);
      }

      // Also trigger mailto as fallback so user can send immediately
      const subject = encodeURIComponent(`[Portfolio Inquiry] ${focus} from ${name} (${org || 'Independent'})`);
      const body = encodeURIComponent(`Dear Vimal Raj,\n\n${message}\n\nFrom: ${name} (${email})\nOrganization: ${org || 'N/A'}`);
      const mailtoLink = `mailto:rajvimal3232@gmail.com?subject=${subject}&body=${body}`;
      
      const link = document.createElement('a');
      link.href = mailtoLink;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 900);
  });
}

/* ==========================================================================
   8. NAVIGATION & MOBILE MENU
   ========================================================================== */
function initNavigationScroll() {
  const header = document.querySelector('.site-header');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }
}
