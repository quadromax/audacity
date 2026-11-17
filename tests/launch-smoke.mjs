import {chromium,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
import bs58 from 'bs58';
const path='src/config/token.ts',original=await fs.readFile(path,'utf8');
const mint=bs58.encode(randomBytes(32)); // DEVELOPMENT ONLY: never a project mint.
const browser=await chromium.launch({channel:'msedge',headless:true});
const base='http://127.0.0.1:3148';
try{
 await fs.writeFile(path,'// DEVELOPMENT ONLY — restored in finally.\nexport const TOKEN_MINT_ADDRESS: string = "'+mint+'";\n');
 const page=await browser.newPage({reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 let market={mint,status:'live',verification:'verified',pumpAvailable:true,price:.000123,marketCap:123456,volume:1234,liquidity:45678,change:-2.5,holders:null,pairUrl:'https://dexscreener.com/solana/'+mint,pairAddress:mint,dexName:'fixture-pool',network:'online',updatedAt:'2026-11-17T00:00:00Z',metadata:{name:'QA fixture only',symbol:'AUDTEST',description:null,source:'Pump.fun',socials:{x:null,telegram:null,discord:null}}};
 let unavailable=false,chartAvailable=true;
 await page.route('**/api/market',r=>unavailable?r.fulfill({status:503,json:{error:'test outage'}}):r.fulfill({json:market}));
 const candles=Array.from({length:24},(_,i)=>({time:1700000000+i*3600,open:.0001,high:.00014,low:.00009,close:.00012,volume:10}));
 await page.route('**/api/chart',r=>r.fulfill({json:{status:chartAvailable?'available':'unavailable',candles:chartAvailable?candles:[],interval:'1H',source:'GeckoTerminal',mint,pool:mint}}));
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:1000});await page.goto(base+'/');
  await expect(page.locator('#contract code')).toHaveText(mint);
  const selectors=['.contract-banner','#contract','.closing-plate','.footer-contract','.terminal-identity',...(width===390?['.mobile-trading']:[])];
  for(const selector of selectors){
   const area=page.locator(selector);await area.getByRole('button',{name:'Copy contract address'}).click();await expect(area.getByRole('status')).toHaveText('COPIED!');expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(mint);
  }
  for(const selector of ['#contract','.closing-plate','.terminal-identity','.how-to-buy',...(width===390?['.mobile-trading']:[])]){
   await expect(page.locator(selector).getByRole('link',{name:/BUY/}).first()).toHaveAttribute('href','https://pump.fun/coin/'+mint);
  }
  await expect(page.locator('#contract .plate-ticker > strong')).toHaveText('$AUDTEST');
  await expect(page.locator('#contract .trade-qr svg')).toHaveCount(1);
  await expect(page.locator('#contract .trade-qr')).toHaveAttribute('href','https://pump.fun/coin/'+mint);
  await expect(page.locator('.terminal-identity .terminal-price')).toContainText('$0.000123');
  await expect(page.locator('.candle-canvas canvas').first()).toBeVisible();
  await page.getByText('Accessible price history',{exact:true}).click();await expect(page.locator('.chart-table tbody tr')).toHaveCount(12);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 chartAvailable=false;await page.reload();await expect(page.getByText('PRICE HISTORY UNAVAILABLE',{exact:true})).toBeVisible();await expect(page.locator('.candle-canvas')).toHaveCount(0);await expect(page.getByRole('link',{name:'Open external chart'})).toHaveAttribute('href','https://dexscreener.com/solana/'+mint);
 market={...market,pumpAvailable:false};await page.reload();await expect(page.locator('#contract .buy-token')).toHaveCount(0);await expect(page.locator('a[href*="pump.fun/coin"]')).toHaveCount(0);
 market={...market,status:'unverified',verification:'not-mint',pumpAvailable:false,price:null};await page.reload();await expect(page.locator('#contract .launch-status')).toHaveText('NOT A TOKEN MINT');await expect(page.locator('a[href*="pump.fun/coin"]')).toHaveCount(0);await expect(page.locator('#contract code')).toHaveText(mint);
 unavailable=true;await page.reload();await expect(page.locator('#contract .launch-status')).toHaveText('VERIFICATION UNAVAILABLE',{timeout:15000});await expect(page.locator('#contract .buy-token')).toHaveCount(0);
 await fs.writeFile(path,'// DEVELOPMENT ONLY — restored in finally.\nexport const TOKEN_MINT_ADDRESS: string = "not-a-solana-mint";\n');
 await page.goto(base+'/');
 await expect(page.locator('#contract .launch-status')).toHaveText('CHECK CONFIGURED ADDRESS');
 await expect(page.locator('a[href*="pump.fun/coin"]')).toHaveCount(0);
 expect(await (await page.request.get(base+'/api/market')).json()).toMatchObject({status:'invalid',mint:null,pumpAvailable:false});
 const displayed=await page.locator('#contract code').textContent();
 await page.locator('#contract').getByRole('button',{name:'Copy contract address'}).click();
 await expect(page.locator('#contract').getByRole('status')).toHaveText('COPIED!');
 expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(displayed);
 expect(errors).toEqual([]);
 console.log('PASS: exact clipboard at six locations, metadata ticker, verified Pump/QR/chart URLs, real chart component with explicitly mocked OHLCV, chart-unavailable fallback, missing Pump listing, wallet rejection, API failure, mobile no-overflow. All data in this test is a QA fixture.');
}finally{await fs.writeFile(path,original);await browser.close();console.log('Restored empty real token setting.');}
