(function(root){
  'use strict';
  const SNAPSHOT='2026-09-14T12:00:00+08:00';
  const SOURCES=['TapTap 站内','玩家社群','客服工单','竞品社区'];
  const GROUPS={login:{title:'更新后登录失败',category:'账号登录',priority:'P0',impact:5,effort:2,keywords:['登录','登陆','闪退','进不去','白屏','验证码'],summary:'反馈集中指向更新后的登录链路，需要按版本、设备和网络环境排查。',proposal:'完善登录异常提示与一键诊断入口',metric:'登录成功率、同类问题重复咨询率',target:'验证目标：登录成功率 ≥ 99%，重复咨询率较基线下降 20%（待真实数据验证）'},pay:{title:'支付与到账异常',category:'支付争议',priority:'P0',impact:5,effort:3,keywords:['支付','扣款','充值','到账','退款','订单','付费'],summary:'涉及订单和资金问题，需人工核对，不自动作出退款或到账承诺。',proposal:'增加订单状态查询与异常申诉引导',metric:'支付异常首次解决率、平均处理时长',target:'验证目标：首次解决率 ≥ 85%（待真实数据验证）'},download:{title:'下载与更新体验',category:'下载更新',priority:'P1',impact:4,effort:2,keywords:['下载','更新','安装','进度','断点'],summary:'下载中断、进度提示不清晰影响用户完成安装，适合从状态解释和重试恢复切入。',proposal:'增加下载断点续传与失败原因解释',metric:'下载完成率、失败后重试成功率',target:'验证目标：重试成功率提升 10 个百分点（待真实数据验证）'},community:{title:'社区内容与治理',category:'社区体验',priority:'P1',impact:3,effort:3,keywords:['评论','社区','帖子','举报','广告','剧透','刷屏','封禁'],summary:'社区治理和信息展示问题混合出现，需人工区分内容安全事件与体验建议。',proposal:'完善举报进度反馈与评论筛选',metric:'举报结果触达率、社区相关重复投诉率',target:'验证目标：举报结果触达率 ≥ 95%（待真实数据验证）'},feature:{title:'产品功能建议',category:'功能建议',priority:'P2',impact:2,effort:2,keywords:['希望','建议','收藏','筛选','提醒','推荐','预约','功能'],summary:'将具体场景和预期行为结构化，先验证需求频次和受影响用户范围。',proposal:'优化预约提醒与内容收藏体验',metric:'功能使用率、任务完成率',target:'先访谈 5 位目标用户并验证原型，再设定量化目标'},other:{title:'待人工研判',category:'其他反馈',priority:'P2',impact:2,effort:3,keywords:[],summary:'当前规则无法可靠识别意图，需人工阅读原文后分类。',proposal:'补充用户场景并明确问题边界',metric:'待确认',target:'完成原文复核后设定验证指标'}};
  const KB=[{id:'KB-001',title:'登录失败排查指引',group:'login',updated:'2026.09.12',text:'先确认客户端版本、设备系统和网络环境，保存报错截图；尝试切换网络并重启应用。如仍失败，转人工核查。请勿索取玩家密码或验证码。'}, {id:'KB-002',title:'支付异常转人工规范',group:'pay',updated:'2026.09.13',text:'由人工核对订单状态。请玩家在安全工单渠道提供脱敏订单编号和支付时间，不收集完整银行卡信息；不承诺退款时效或结果。'}, {id:'KB-003',title:'下载失败与更新恢复',group:'download',updated:'2026.09.11',text:'确认可用存储空间、网络状态和客户端版本，暂停后重试；仍失败时保留错误提示并转人工。不要默认建议清除游戏数据。'}, {id:'KB-004',title:'社区举报与反馈',group:'community',updated:'2026.09.10',text:'引导玩家通过内容页举报入口提交问题并保留内容链接。涉及隐私泄露、人身威胁等风险应立即升级人工审核。'}];
  const records=[
    ['TapTap 站内','橘子汽水','更新 2.8 以后一直卡在登录页，验证码输完就白屏，重启也没用。','11:48',22],
    ['玩家社群','小岛','安卓更新之后点登录直接闪退，今天第三次了，有人也这样吗？','11:41',18],
    ['客服工单','北岸','昨天还能进，今天登录一直转圈。小米手机，切换 Wi-Fi 也不行。','11:32',0],
    ['TapTap 站内','阿葵','验证码明明正确，还是提示登录失败，希望赶紧修一下。','11:20',13],
    ['玩家社群','像素猫','升级新版以后进不去，群里好几个人都卡在启动白屏。','11:07',16],
    ['客服工单','森','充值扣款成功但道具没到账，已经等了半小时，请帮忙查询订单。','10:58',0],
    ['TapTap 站内','慢半拍','下载到 99% 就不动了，失败后还要重新下整包。','10:46',11],
    ['竞品社区','方块','别的平台更新中断可以断点续传，这个体验希望也能有。','10:35',8],
    ['TapTap 站内','蓝尾','登录报错没有错误码，客服让我重启，试了还是没用。','10:22',19],
    ['玩家社群','七月','收到扣款短信但是订单显示失败，不敢再付一次。','10:12',5],
    ['TapTap 站内','折纸','评论里广告刷屏，举报后不知道有没有人处理。','09:57',14],
    ['客服工单','麦田','下载中断后重新开始，流量一下就用完了。','09:44',0],
    ['TapTap 站内','逐星','希望能按类型筛选预约的游戏，列表太长不好找。','09:32',7],
    ['玩家社群','松果','登录进不去，清缓存之前想问会不会影响本地数据？','09:21',8],
    ['竞品社区','灰鲸','社区支持屏蔽剧透标签就好了，新游戏被提前透完了。','09:06',6],
    ['客服工单','月台','账号突然被封禁了，想知道原因和申诉的流程。','08:58',0],
    ['TapTap 站内','玻璃海','预约游戏上线了却没有提醒，错过测试有点可惜。','08:43',9],
    ['玩家社群','时雨','退款进度一直没变化，客服两次给的说法都不同。','08:31',4],
    ['客服工单','飞鸟','安卓 14，最新版本登录后马上闪退，之前旧版正常。','08:18',0],
    ['TapTap 站内','白桃','更新包比游戏还大，希望下载页能提示剩余空间是否够用。','08:06',6],
    ['竞品社区','小满','收藏的攻略能不能按游戏分组，现在找起来好麻烦。','07:49',5],
    ['TapTap 站内','晚风','帖子举报之后一周都没反馈，希望增加处理进度。','07:31',10],
    ['玩家社群','河豚','游戏安装包校验失败，换了两次网络依然不能下载。','07:17',4],
    ['客服工单','木木','第二次联系，登录还是提示网络异常，能转技术同学看看吗？','07:05',0]
  ];
  function classify(text){
    const risk=/隐私|人肉|威胁|未成年|自杀|报警|诈骗/.test(text);
    const ranked=Object.entries(GROUPS).filter(([id])=>id!=='other').map(([id,g])=>({id,hits:g.keywords.filter(k=>text.includes(k))})).sort((a,b)=>b.hits.length-a.hits.length);
    const first=ranked[0], group=first.hits.length?first.id:'other';
    return {group,category:GROUPS[group].category,priority:risk?'P0':GROUPS[group].priority,risk,confidence:group==='other'?0:Math.min(.94,.58+first.hits.length*.08),matches:first.hits};
  }
  function seed(){
    const feedback=records.map((r,i)=>({id:'FB-'+String(i+1).padStart(3,'0'),source:r[0],user:r[1],text:r[2],time:r[3],likes:r[4],...classify(r[2])}));
    return {version:1,feedback,tickets:[{id:'TK-1048',feedbackId:'FB-001',title:'更新后登录白屏，重复尝试无效',group:'login',priority:'P0',status:'待处理',assignee:'一线 A 组',user:'橘子汽水',text:records[0][2],created:'09:50',due:'11:50',reply:'',history:['09:50 工单进入队列','10:15 一线客服记录重复故障，待运营复核'],quality:null},{id:'TK-1047',feedbackId:'FB-006',title:'充值扣款成功，游戏道具未到账',group:'pay',priority:'P0',status:'处理中',assignee:'升级专席',user:'森',text:records[5][2],created:'10:58',due:'12:58',reply:'已记录您的问题，正在人工核对订单。请勿重复支付。',history:['10:58 创建工单','11:05 升级专席接单核对'],quality:null},{id:'TK-1046',feedbackId:'FB-012',title:'下载中断导致整包重新下载',group:'download',priority:'P1',status:'待处理',assignee:'一线 B 组',user:'麦田',text:records[11][2],created:'09:44',due:'13:44',reply:'',history:['09:44 创建工单'],quality:null},{id:'TK-1045',feedbackId:'FB-016',title:'账号封禁原因与申诉入口咨询',group:'community',priority:'P1',status:'已解决',assignee:'一线 A 组',user:'月台',text:records[15][2],created:'08:58',due:'12:58',reply:'理解您暂时无法使用账号的困扰。请在账号帮助页进入申诉入口，提交账号标识和相关截图，由审核团队核查。请勿提供密码或验证码。',history:['08:58 创建工单','09:30 人工解释流程并提供申诉入口','09:45 玩家确认已找到入口，标记解决'],quality:{score:100,checks:[true,true,true,true],note:'说明边界清楚，未承诺解封。'}},{id:'TK-1044',feedbackId:'FB-022',title:'举报处理进度咨询',group:'community',priority:'P1',status:'已解决',assignee:'一线 B 组',user:'晚风',text:records[21][2],created:'07:31',due:'11:31',reply:'会处理的，请耐心等待。',history:['07:31 创建工单','08:15 客服回复后标记解决'],quality:{score:25,checks:[false,false,false,true],note:'缺少共情、具体查询路径和后续跟进安排，已列入培训复盘。'}}],demands:[{id:'REQ-201',group:'download',title:'增加下载断点续传与失败原因解释',status:'方案设计',owner:'产品 · 林',priority:'P1',created:'09.13',history:['09.13 由重复下载反馈建立需求'],note:'先验证下载状态提示，再评估断点续传实现成本。',validation:''},{id:'REQ-202',group:'community',title:'补充举报处理进度与结果通知',status:'待验证',owner:'产品 · 陈',priority:'P1',created:'09.12',history:['09.12 完成演示原型，等待用户验证'],note:'用原型验证玩家能否找到举报记录和处理进度。',validation:''}],kbEnabled:KB.map(x=>x.id),lastImport:null};
  }
  function clusters(state){return Object.entries(GROUPS).map(([id,g])=>{const rows=state.feedback.filter(f=>f.group===id);const reach=rows.length;const confidence=rows.length?rows.reduce((s,r)=>s+r.confidence,0)/rows.length:0;return {id,...g,rows,reach,confidence,score:Math.round(reach*g.impact*confidence/g.effort*10)/10};}).filter(g=>g.reach).sort((a,b)=>b.score-a.score);}
  function normalized(t){return t.trim().replace(/\s+/g,' ').toLowerCase();}
  function importFeedback(state,text,source){
    if(!SOURCES.includes(source))throw new Error('请选择有效来源');
    const lines=text.split(/\r?\n/).map(t=>t.trim()).filter(Boolean);
    if(!lines.length)throw new Error('请至少输入一条反馈');
    if(lines.length>100)throw new Error('单次最多导入 100 条反馈');
    if(lines.some(t=>t.length>2000))throw new Error('每条反馈最多 2000 字');
    const known=new Set(state.feedback.map(f=>normalized(f.text)));let added=0,duplicates=0;
    let next=Math.max(...state.feedback.map(f=>Number(f.id.split('-')[1])),0)+1;
    for(const line of lines){const key=normalized(line);if(known.has(key)){duplicates++;continue;}known.add(key);state.feedback.unshift({id:'FB-'+String(next++).padStart(3,'0'),source,user:'导入玩家',text:line,time:'新导入',likes:0,...classify(line)});added++;}
    state.lastImport={added,duplicates};return {added,duplicates};
  }
  function makeTicket(state,id){const feedback=state.feedback.find(f=>f.id===id);if(!feedback)throw new Error('找不到反馈');const exists=state.tickets.find(t=>t.feedbackId===id);if(exists)return {ticket:exists,existing:true};const next=Math.max(...state.tickets.map(t=>Number(t.id.split('-')[1])),1000)+1;const ticket={id:'TK-'+next,feedbackId:id,title:feedback.text.slice(0,28),group:feedback.group,priority:feedback.priority,status:'待处理',assignee:feedback.risk?'升级专席':'一线 A 组',user:feedback.user,text:feedback.text,created:'12:00',due:feedback.priority==='P0'?'14:00':'16:00',reply:'',history:['12:00 从玩家反馈创建演示工单'],quality:null};state.tickets.unshift(ticket);return {ticket,existing:false};}
  function makeDemand(state,group){if(!GROUPS[group])throw new Error('无效需求分类');const exists=state.demands.find(d=>d.group===group);if(exists)return {demand:exists,existing:true};const g=GROUPS[group];const next=Math.max(...state.demands.map(d=>Number(d.id.split('-')[1])),200)+1;const demand={id:'REQ-'+next,group,title:g.proposal,status:'待评估',owner:'产品 · 林',priority:g.priority,created:'09.14',history:['09.14 从反馈聚类生成需求，待人工评审'],note:g.summary,validation:''};state.demands.unshift(demand);return {demand,existing:false};}
  function updateTicket(state,id,fields){const ticket=state.tickets.find(t=>t.id===id);if(!ticket)throw new Error('工单不存在');if(!['待处理','处理中','待回访','已解决'].includes(fields.status)||!['一线 A 组','一线 B 组','升级专席'].includes(fields.assignee))throw new Error('无效处理状态或负责人');if(['待回访','已解决'].includes(fields.status)&&!fields.reply.trim())throw new Error('请先填写处理说明，再标记待回访或已解决');if(fields.reply.length>4000)throw new Error('处理说明最多 4000 字');const change=ticket.status!==fields.status||ticket.assignee!==fields.assignee;const replyChanged=ticket.reply!==fields.reply.trim();if(replyChanged)ticket.quality=null;Object.assign(ticket,{status:fields.status,assignee:fields.assignee,reply:fields.reply.trim()});if(change||replyChanged)ticket.history.push('演示操作：'+fields.assignee+' · '+fields.status+(replyChanged?' · 已保存处理说明，需重新质检':''));return ticket;}
  function draftAnswer(state,text){if(!text.trim())throw new Error('请先输入玩家问题');const c=classify(text);const kb=KB.find(k=>k.group===c.group&&state.kbEnabled.includes(k.id));if(c.risk)return {human:true,category:c.category,citations:[],reason:'命中高风险词，需要人工复核',text:'已收到您的反馈。这个情况需要人工优先核查，请通过安全的客服渠道提供必要信息；我们不会在公开评论中索取敏感资料。演示系统已建议升级人工处理。'};if(!kb)return {human:true,category:c.category,citations:[],reason:'没有启用的匹配知识条目，避免猜测',text:'已收到您的问题。当前知识库没有足够依据给出准确答复，建议转人工核查；可以先补充具体操作步骤、发生时间和报错提示，请勿提供密码或验证码。'};const prefix={login:'理解您无法正常登录的着急。',pay:'理解扣款后未到账给您带来的担心。',download:'下载反复失败确实很影响体验。',community:'感谢您反馈社区使用中的问题。'}[c.group];return {human:c.group==='pay'||c.group==='community',category:c.category,citations:[kb.id],reason:'关键词匹配 '+c.matches.join('、')+'；引用启用知识条目',text:prefix+kb.text};}
  function metrics(state){const open=state.tickets.filter(t=>t.status!=='已解决');return {feedback:state.feedback.length,open:open.length,urgent:open.filter(t=>t.priority==='P0').length,overdue:open.filter(t=>t.due<'12:00').length,demands:state.demands.length,resolved:state.tickets.filter(t=>t.status==='已解决').length};}
  function report(state){const groups=clusters(state);return ['# 玩家反馈与需求研判报告','', '> 独立作品演示；全部样例为虚构数据，导入内容来自当前浏览器。本报告由确定性规则汇总，不代表 TapTap 真实业务或大模型分析。','', '样例统计时点：2026-09-14 12:00（导入数据不计入历史趋势）','', '## 运营概况',`反馈 ${state.feedback.length} 条；未解决工单 ${metrics(state).open} 条；体验需求 ${state.demands.length} 项。`,'','## 需求排序','评分 = 当前样例条数 × 影响系数 × 规则匹配分 / 预估工作量。仅用于演示排序，不是用户规模估计。','',...groups.flatMap(g=>[`### ${g.title}`,`- 样例数：${g.reach}；优先级：${g.priority}；评分：${g.score}`,`- 判断：${g.summary}`,`- 建议：${g.proposal}`,`- 验证：${g.target}`,'- 原文证据：',...g.rows.slice(0,3).map(r=>`  - ${r.id} · ${r.source}：${r.text}`),'']), '## 需求跟进',...state.demands.map(d=>`- ${d.id} ${d.title}｜${d.status}｜${d.owner}｜验证记录：${d.validation||'尚未验证'}`),'','## 待确认','- 用真实样本验证分类效果，复核偏差与风险词误报。','- 基于授权数据源接入工单和社群数据，建立持续采集与去重机制。','- 采集优化前基线及上线后指标，再判断体验是否改善。'].join('\n');}
  const api={SNAPSHOT,SOURCES,GROUPS,KB,seed,classify,clusters,importFeedback,makeTicket,makeDemand,updateTicket,draftAnswer,metrics,report};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.OpsModel=api;
})(typeof globalThis!=='undefined'?globalThis:this);
