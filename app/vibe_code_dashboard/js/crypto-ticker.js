// ══ CRYPTO STRIP ══
const cryptos = [
  {sym:'BTC',  price:84247,      chg:-2.3,  up:false},
  {sym:'ETH',  price:3891,       chg:-5.1,  up:false},
  {sym:'DOGE', price:0.082,      chg:420.0, up:true},
  {sym:'SHIB', price:0.000001,   chg:69.4,  up:true},
  {sym:'SOL',  price:142,        chg:-8.7,  up:false},
  {sym:'PEPE', price:0.00001,    chg:1337,  up:true},
  {sym:'HARLEYCOIN',price:0.000000001,chg:-99.9,up:false,rug:true},
  {sym:'RUGPULL.EXE',price:0.00, chg:Infinity,up:true,rug:true},
  {sym:'COPIUM',price:0.001,     chg:69420, up:true},
  {sym:'HOPIUM',price:0.420,     chg:888,   up:true},
  {sym:'DEBTCOIN',price:14847,   chg:-0.1,  up:false},
  {sym:'MARTINGALE',price:0.00,  chg:-100,  up:false,rug:true},
  {sym:'BIGYAHUCOIN',price:0.003,chg:42,    up:true},
  {sym:'MAGACOIN',price:1.12,    chg:-33.3, up:false},
];
function buildCryptoStrip() {
  const items = cryptos.map(c=>{
    const cls = c.rug ? 'crug' : (c.up?'cup':'cdown');
    const arrow = c.up?'▲':'▼';
    const chg = isFinite(c.chg) ? `${c.up?'+':''}${c.chg}%` : '∞%';
    const price = c.price>=1 ? '$'+c.price.toLocaleString() : '$'+c.price;
    const tag = c.rug ? '🚨RUGGED' : '';
    return `<span class="ctick ${cls}">${c.sym} ${price} ${arrow}${chg}${tag}</span>`;
  }).join('<span style="color:#1a003a"> ║ </span>');
  const full = items+'<span style="color:#1a003a"> ║ </span>'+items;
  document.getElementById('crypto-inner').innerHTML = full;
}
buildCryptoStrip();
setInterval(()=>{
  cryptos.forEach(c=>{ if(!c.rug&&c.price>0.001) c.price=Math.max(0.001,c.price*(1+(Math.random()-0.5)*0.02)); });
  buildCryptoStrip();
},3000);
