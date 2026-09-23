const reportData = {
  years: [
    { year: '2021', sales: 637963.99, profit: 82744.66 },
    { year: '2022', sales: 758106.39, profit: 88201.59 },
    { year: '2023', sales: 964331.52, profit: 121826.46 },
    { year: '2024', sales: 1206038.16, profit: 139281.67 }
  ],
  monthly: [
    [22637.69,1009.34],[36804.97,5240.35],[32453.55,5708.28],[30544.95,4704.42],[45295,5685.22],[63993.5,9784.4],[32003.66,1453.7],[60858.23,6933.53],[60411.68,6229.31],[78061.05,13644.69],[81228.86,8252.96],[93670.85,14098.46],
    [48983.81,7309.78],[41882.31,3880.8],[37600.99,2481.85],[39619.76,4246.97],[66477.46,13429],[77527.29,10476.45],[22110.14,1074.46],[91444.25,13203.14],[60655.18,4335.55],[100556.81,12196.19],[83812.36,8339.02],[87436.04,7228.37],
    [66736.08,6521.76],[41018.69,4521.23],[50946.39,9581.55],[33158.62,2333.62],[86402.92,10039.72],[132021.7,18625.24],[64434.05,8241.74],[112337.96,11847.38],[98286.69,13017.63],[96802.76,11162],[86465.27,13395.08],[95720.39,12539.51],
    [77142.49,5509.06],[57912.92,4392.26],[84232.39,10184.68],[59069.99,6359.6],[99655.85,8840.69],[106875.64,11423.92],[69112.01,7671.71],[123420.54,8984.43],[110975.79,18189.39],[142079.99,21790.83],[154350.27,23461.47],[121210.27,12473.62]
  ],
  regions: [
    { name: '北亞', margin: 19.5, sales: 848179.94, color: '#4774a8' },
    { name: '中亞', margin: 17.5, sales: 733968.15, color: '#b7cb54' },
    { name: '大洋洲', margin: 10.9, sales: 1100184.61, color: '#f0644e' },
    { name: '東南亞', margin: 2.0, sales: 884107.36, color: '#efc45e' }
  ],
  categories: [
    { name: '技術', sales: 1350845.47, profit: 202955.47 },
    { name: '傢具', sales: 1335218.95, profit: 124417.51 },
    { name: '辦公用品', sales: 880375.64, profit: 104681.40 }
  ]
};

const formatNumber = (value) => new Intl.NumberFormat('zh-TW', { maximumFractionDigits: 0 }).format(value);
const formatShort = (value) => value >= 1000000 ? `${(value / 1000000).toFixed(2)}M` : `${Math.round(value / 1000)}K`;

function renderYearChart() {
  const chart = document.querySelector('#yearChart');
  const width = 700;
  const height = 220;
  const padX = 30;
  const padTop = 10;
  const padBottom = 27;
  const maxValue = 1250000;
  const x = (index) => padX + index * ((width - padX * 2) / (reportData.years.length - 1));
  const y = (value) => padTop + (height - padTop - padBottom) * (1 - value / maxValue);
  const points = (key) => reportData.years.map((item, index) => `${x(index)},${y(item[key])}`).join(' ');
  const labels = reportData.years.map((item, index) => `<text x="${x(index)}" y="${height - 4}" text-anchor="middle">${item.year}</text>`).join('');
  const circles = (key, color) => reportData.years.map((item, index) => `<circle cx="${x(index)}" cy="${y(item[key])}" r="4.5" fill="${color}" stroke="#fbfaf6" stroke-width="3"><title>${item.year} ${key === 'sales' ? '銷售額' : '利潤'}：${formatNumber(item[key])}</title></circle>`).join('');
  chart.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="2021 至 2024 年度銷售額與利潤趨勢"><polyline points="${points('sales')}" fill="none" stroke="#f0644e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><polyline points="${points('profit')}" fill="none" stroke="#4774a8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${circles('sales', '#f0644e')}${circles('profit', '#4774a8')}<g fill="#707a80" font-family="DM Mono" font-size="10">${labels}</g></svg>`;
}

function renderFilteredYearChart(month = 'all') {
  if (month === 'all') {
    renderYearChart();
    return;
  }
  const monthIndex = Number(month) - 1;
  const filteredYears = reportData.years.map((item, index) => ({
    year: item.year,
    sales: reportData.monthly[index * 12 + monthIndex][0],
    profit: reportData.monthly[index * 12 + monthIndex][1]
  }));
  const originalYears = reportData.years;
  reportData.years = filteredYears;
  renderYearChart();
  reportData.years = originalYears;
}

function renderRegions() {
  const list = document.querySelector('#regionList');
  list.innerHTML = reportData.regions.map((region) => `<div class="region-row"><label>${region.name}</label><div class="region-bar"><span style="width: ${region.margin / 20 * 100}%"></span></div><strong>${region.margin.toFixed(1)}%</strong></div>`).join('');
}

function renderRegionPie() {
  const total = reportData.regions.reduce((sum, region) => sum + region.sales, 0);
  let start = 0;
  const stops = reportData.regions.map((region) => {
    const percentage = region.sales / total * 100;
    const stop = `${region.color} ${start}% ${start + percentage}%`;
    start += percentage;
    return stop;
  }).join(', ');
  document.querySelector('#regionPie').style.background = `conic-gradient(${stops})`;
  document.querySelector('#regionPieLegend').innerHTML = reportData.regions.map((region) => `<div class="pie-legend-row"><i style="background:${region.color}"></i><span>${region.name}</span><strong>${(region.sales / total * 100).toFixed(1)}%</strong></div>`).join('');
}

function renderCategories(metric = 'sales') {
  const chart = document.querySelector('#categoryChart');
  const max = Math.max(...reportData.categories.map((category) => category[metric]));
  chart.innerHTML = reportData.categories.map((category) => `<div class="cat-row"><label>${category.name}</label><div class="cat-track"><div class="cat-fill" style="width: ${(category[metric] / max) * 100}%"></div></div><span class="cat-value">${formatShort(category[metric])}</span></div>`).join('');
}

renderYearChart();
renderRegions();
renderRegionPie();
renderCategories();
document.querySelector('#categoryMetric').addEventListener('change', (event) => renderCategories(event.target.value));
document.querySelector('#monthFilter').addEventListener('change', (event) => renderFilteredYearChart(event.target.value));
document.querySelector('#printReport').addEventListener('click', () => window.print());
