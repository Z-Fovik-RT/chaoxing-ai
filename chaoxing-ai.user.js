// ==UserScript==
// @name         学习通AI助手
// @namespace    https://github.com/Z-Fovik-RT/chaoxing-ai
// @version      1.2.1
// @description  学习通全自动学习助手 | 10大AI模型 + 第三方题库 + 视频自动播放 + 字体解密 + 章节导航 + 粘贴解锁 + 自动提交
// @author       Z-Fovik-RT
// @homepage     https://github.com/Z-Fovik-RT/chaoxing-ai
// @supportURL   https://github.com/Z-Fovik-RT/chaoxing-ai/issues
// @icon         https://raw.githubusercontent.com/Z-Fovik-RT/chaoxing-ai/main/icon.png
// @tag          学习通
// @tag          自定义API
// @tag          AI答题
// @tag          自动刷课
// @tag          超星
// @tag          免费
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @connect      *
// @connect      raw.githubusercontent.com
// @connect      github.com
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_getResourceText
// @grant        GM_setClipboard
// @compatible    chrome ScriptCat / Tampermonkey
// @compatible    firefox ScriptCat / Tampermonkey
// @require      https://scriptcat.org/lib/668/1.0/TyprMd5.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.1.0/sweetalert2.all.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @resource     Table https://116611.xyz/table.json
// @updateURL    https://raw.githubusercontent.com/Z-Fovik-RT/chaoxing-ai/main/chaoxing-ai.user.js
// @downloadURL  https://raw.githubusercontent.com/Z-Fovik-RT/chaoxing-ai/main/chaoxing-ai.user.js
// @license      MIT
// ==/UserScript==

(function() {
'use strict';


/*
╔═══════════════════════════════════════════════════════════════════════╗
║  ███████╗ ███████╗  ██████╗ ██╗   ██╗ ██╗ ██╗  ██╗ ██████╗ ████████╗  ║
║  ╚══███╔╝ ██╔════╝ ██╔═══██╗██║   ██║ ██║ ██║ ██╔╝ ██╔══██╗╚══██╔══╝  ║
║    ███╔╝  █████╗   ██║   ██║██║   ██║ ██║ █████╔╝  ██████╔╝   ██║     ║
║   ███╔╝   ██╔══╝   ██║   ██║╚██╗ ██╔╝ ██║ ██╔═██╗  ██╔══██╗   ██║     ║
║  ███████╗ ██║      ╚██████╔╝ ╚████╔╝  ██║ ██║  ██╗ ██║  ██║   ██║     ║
║  ╚══════╝ ╚═╝       ╚═════╝   ╚═══╝   ╚═╝ ╚═╝  ╚═╝ ╚═╝  ╚═╝   ╚═╝     ║
║                   ⚡ Script Author: Z-Fovik-RT ⚡                    ║
╚═══════════════════════════════════════════════════════════════════════╝
*/

// ═══════════════════════════════════════════════════════════════════════════════
//  § 1. AI Provider 注册表
//  PROVIDERS 对象：AI 服务商 API 配置
// ═══════════════════════════════════════════════════════════════════════════════

// ── AI Provider 注册表 ──
var PROVIDERS = {
    deepseek: {
        name: 'DeepSeek',
        endpoint: 'https://api.deepseek.com/v1/chat/completions',
        models: ['deepseek-v4-pro', 'deepseek-v4-flash', 'deepseek-chat', 'deepseek-reasoner'],
        authType: 'bearer', format: 'openai',
    },
    qwen: {
        name: '通义千问 (Qwen)',
        endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        models: ['qwen3.7-max', 'qwen3.6-plus', 'qwen3.6-flash', 'qwen3.5-omni-plus', 'qwen3.5-omni', 'qwen-turbo'],
        authType: 'bearer', format: 'openai',
    },
    zhipu: {
        name: '智谱 (GLM)',
        endpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
        models: ['glm-5', 'glm-4.7', 'glm-4.7-flash', 'glm-4.6', 'glm-4.5'],
        authType: 'bearer', format: 'openai',
    },
    kimi: {
        name: 'Kimi (Moonshot)',
        endpoint: 'https://api.moonshot.cn/v1/chat/completions',
        models: ['kimi-k2.6', 'kimi-k2.5', 'kimi-k2-turbo-preview', 'moonshot-v1-128k', 'moonshot-v1-32k'],
        authType: 'bearer', format: 'openai',
    },
    openai: {
        name: 'OpenAI',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        models: ['gpt-5.4', 'gpt-5', 'gpt-4.1', 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
        authType: 'bearer', format: 'openai',
    },
    claude: {
        name: 'Claude (Anthropic)',
        endpoint: 'https://api.anthropic.com/v1/messages',
        models: ['claude-opus-4-6', 'claude-sonnet-4-6', 'claude-haiku-4-5'],
        authType: 'x-api-key', format: 'anthropic',
    },
    ernie: {
        name: '文心一言 (ERNIE)',
        endpoint: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/',
        models: ['ernie-5.1', 'ernie-4.5', 'ernie-4.0-8k', 'ernie-3.5-8k', 'ernie-speed-128k'],
        authType: 'oauth', format: 'ernie',
    },
    doubao: {
        name: '豆包 (Doubao)',
        endpoint: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
        models: ['doubao-seed-2.0-pro-256k', 'doubao-seed-2.0-lite-256k', 'doubao-seed-1.8', 'doubao-seed-1.6-flash', 'doubao-seed-2.0-code', 'doubao-seed-2.0-mini'],
        authType: 'bearer', format: 'openai',
    },
    mimo: {
        name: 'Mimo (小米)',
        endpoint: 'https://token-plan-cn.xiaomimimo.com/v1/chat/completions',
        models: ['mimo-v2.5-pro', 'mimo-v2.5', 'mimo-v2.5-omni'],
        authType: 'bearer', format: 'openai',
    },
    siliconflow: {
        name: '硅基流动 (SiliconFlow)',
        endpoint: 'https://api.siliconflow.cn/v1/chat/completions',
        models: ['DeepSeek-V4-Pro-Max', 'DeepSeek-V4-Pro', 'DeepSeek-V4-Flash', 'Qwen/Qwen3.6-35B-A3B', 'THUDM/glm-5', 'THUDM/glm-4.7', 'Kimi/K2.6'],
        authType: 'bearer', format: 'openai',
    },
};

// ── 脚本运行参数 ──
var cxaiCfg = {
    cxai_showBox: 1,     // 显示脚本浮窗，0为关闭，1为开启，不建议关闭
    apiHost: '',    // API代理地址，例如 https://your-domain.com

    task: 0,        // 只处理任务点任务，0为关闭，1为开启

    video: 1,       // 处理视频，0为关闭，1为开启
    audio: 1,       // 处理音频，0为关闭，1为开启
    rate: 1,        // 视频/音频倍速，默认 1（正常），可在浮窗设置中调整（1/1.25/1.5/2）
    review: 0,      // 复习模式，0为关闭，1为开启可以补挂视频时长

    work: 1,        // 测验自动处理，0为关闭，1为开启，开启将会处理测验，关闭会跳过测验
    time: 2500,     // 答题时间间隔，默认2.5s=2500
    reqIntervalTime: 3, // 搜题（AI）请求最小间隔(秒)。0 为不节流；高并发可设 1~3 秒，避免被服务端限流
    sub: 0,         // 测验自动提交，0为关闭,1为开启，当没答案时测验将不会提交，如需提交请设置force：1
    force: 0,       // 测验强制提交，0为关闭，1为开启，开启此功能将会强制提交测验（无论作答与否）
    decrypt: 1,     // 字体解密，0为关闭，1为开启，推荐开启
    redo: 0,        // 重做模式，0为关闭，1为开启，开启后不跳过已答题，重新AI作答覆盖旧答案
    fuzzyMatch: 1,  // 相似度匹配，0为关闭，1为开启，开启后当精确匹配失败时使用相似度匹配选择最接近的选项

    examTurn: 0,     // 考试自动跳转下一题，0为关闭，1为开启
    examTurnTime: 0, // 考试自动跳转下一题随机间隔时间(3-7s)之间，0为关闭，1为开启
    goodStudent: 1,  // 好学生模式,不自动选择答案,仅将单选题和多选题的ABCD加粗
    alterTitle: 1,  //修改题目,将AI回复的答案插入题目中
};

// ═══════════════════════════════════════════════════════════════════════════════
//  § 2. AI 请求 & 响应处理
//  构建请求体、解析响应、ERNIE Token、Provider 配置读取、自适应参数
// ═══════════════════════════════════════════════════════════════════════════════

// 辅助函数：将答案（可能是数字索引）转换为显示文本
// 参数：answer - 答案字符串，optionsArr - 选项数组
// 返回：显示用的文本
function cxaiGetDisplayAnswer(answer, optionsArr) {
    if (!answer) return answer;

    // 防止AI回显题目文本：如果答案与当前题目相同或以题目开头，说明AI在复述题目而非作答
    if (cxai_currentQuestionMeta && cxai_currentQuestionMeta.questionText) {
        var _ans = String(answer).trim();
        var _q = cxai_currentQuestionMeta.questionText.trim();
        if (_q.length > 5 && (_ans === _q || _ans.indexOf(_q) === 0)) {
            return '[⚠️ AI回显了题目，已跳过]';
        }
        // 增强：检查答案是否包含题目中的连续长片段（部分回显）
        if (_q.length > 15 && _ans.length > 10) {
            for (var _qi = 0; _qi <= _q.length - 15; _qi += 5) {
                if (_ans.indexOf(_q.substring(_qi, _qi + 15)) !== -1) {
                    return '[⚠️ AI回显了题目片段，已跳过]';
                }
            }
        }
    }

    if (!optionsArr || optionsArr.length === 0) return answer;

    // 单个数字索引
    if (/^\d+$/.test(answer)) {
        var numIdx = parseInt(answer, 10);
        if (numIdx >= 0 && numIdx < optionsArr.length) {
            return optionsArr[numIdx] + ' (选项' + (numIdx + 1) + ')';
        }
    }

    // 多个数字索引用 | 分隔（多选题）
    if (/^\d+(\|\d+)*$/.test(answer)) {
        var indices = answer.split('|').map(function(s) { return parseInt(s, 10); });
        var parts = indices.map(function(idx) {
            return (idx >= 0 && idx < optionsArr.length) ? optionsArr[idx] : String(idx);
        });
        return parts.join(' | ');
    }

    return answer;
}


function cxaiBuildRequest(format, userMsg, opts) {
    if (format === 'openai') {
        return JSON.stringify({
            model: opts.model,
            messages: [
                { role: 'system', content: CXAI_SYSTEM_PROMPT },
                { role: 'user', content: userMsg },
            ],
            temperature: opts.temperature,
            max_tokens: opts.maxTokens,
            top_p: opts.topP || 1,
        });
    } else if (format === 'anthropic') {
        return JSON.stringify({
            model: opts.model,
            max_tokens: opts.maxTokens,
            system: CXAI_SYSTEM_PROMPT,
            messages: [{ role: 'user', content: userMsg }],
            temperature: opts.temperature,
        });
    } else if (format === 'ernie') {
        return JSON.stringify({
            messages: [{ role: 'user', content: CXAI_SYSTEM_PROMPT + '\n\n' + userMsg }],
            temperature: opts.temperature,
            max_output_tokens: opts.maxTokens,
        });
    }
    return '';
}

function cxaiParseResponse(format, raw) {
    if (raw.error) {
        var msg = raw.error.message || raw.error.msg || JSON.stringify(raw.error);
        throw new Error('API错误: ' + msg);
    }
    var result;
    if (format === 'openai') {
        if (!raw.choices || !raw.choices[0] || !raw.choices[0].message) {
            throw new Error('响应格式异常: ' + JSON.stringify(raw).slice(0, 200));
        }
        result = raw.choices[0].message.content || '';
        if (!result.trim() && raw.choices[0].message.reasoning_content) {
            var reasoning = raw.choices[0].message.reasoning_content.trim();
            var patterns = [/答案[是为：:]\s*(.+)/, /选\s*([A-Da-d]+)/, /正确[的]?[选答][项案]?[是为：:]\s*(.+)/, /[因此所以][，,]?\s*(.+)$/m];
            for (var i = 0; i < patterns.length; i++) {
                var m = reasoning.match(patterns[i]);
                if (m && m[1].trim().length > 0) { result = m[1].trim(); break; }
            }
            if (!result.trim()) {
                var lines = reasoning.split('\n').filter(function (l) { return l.trim(); });
                if (lines.length > 0) result = lines[lines.length - 1].trim();
            }
        }
    } else if (format === 'anthropic') {
        if (!raw.content || !raw.content[0]) {
            throw new Error('Claude响应格式异常: ' + JSON.stringify(raw).slice(0, 200));
        }
        result = raw.content[0].text;
    } else if (format === 'ernie') {
        result = raw.result;
    }
    if (!result || (typeof result === 'string' && result.trim().length === 0)) {
        throw new Error('API返回空答案');
    }
    return result;
}


function cxaiGetERNIEToken(apiKey, secretKey) {
    return new Promise(function (resolve, reject) {
        var cached = null;
        try { cached = JSON.parse(localStorage.getItem('cxaiSetting.ernieToken') || 'null'); } catch (e) { /* empty */ }
        if (cached && cached.expiresAt > Date.now()) return resolve(cached.accessToken);
        if (!apiKey || !secretKey) return reject(new Error('ERNIE需要API Key和Secret Key'));
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + apiKey + '&client_secret=' + secretKey,
            headers: { 'Content-Type': 'application/json' },
            data: '',
            timeout: 15000,
            onload: function (xhr) {
                try {
                    var data = JSON.parse(xhr.responseText);
                    if (data.access_token) {
                        localStorage.setItem('cxaiSetting.ernieToken', JSON.stringify({
                            accessToken: data.access_token,
                            expiresAt: Date.now() + (data.expires_in - 86400) * 1000,
                        }));
                        resolve(data.access_token);
                    } else {
                        reject(new Error('ERNIE token获取失败: ' + JSON.stringify(data).slice(0, 200)));
                    }
                } catch (e) { reject(e); }
            },
            onerror: function () { reject(new Error('ERNIE token请求失败')); },
            ontimeout: function () { reject(new Error('ERNIE token请求超时')); },
        });
    });
}


function cxaiGetProviderConfig() {
    var providerKey = localStorage.getItem('cxaiSetting.provider') || 'deepseek';
    var provider = PROVIDERS[providerKey];
    if (!provider) { providerKey = 'deepseek'; provider = PROVIDERS.deepseek; }
    // 优先从分 Provider 存储读取 API Key，回退旧版单一 key
    var apiKey = '';
    try {
        var _keys = JSON.parse(localStorage.getItem('cxaiSetting.apiKeys') || '{}');
        apiKey = _keys[providerKey] || '';
    } catch (e) { apiKey = localStorage.getItem('cxaiSetting.apiKey') || ''; }
    var model = localStorage.getItem('cxaiSetting.model') || provider.models[0];
    return { key: providerKey, provider: provider, apiKey: apiKey, model: model };
}


function cxaiGetModelParams(questionType) {
    var preciseTypes = [0, 1, 2, 3]; // 单选/多选/填空/判断 需要低温度精确回答
    if (preciseTypes.indexOf(questionType) !== -1) {
        return { temperature: 0.1, maxTokens: 1024, topP: 0.1 };
    }
    // 写作/翻译/简答等长文本题型，增大 token 上限防止截断
    return { temperature: 0.5, maxTokens: 4096, topP: 0.8 };
}


var CXAI_SYSTEM_PROMPT = `你是一个答题助手，只输出答案，不要任何解释。
单选题：只回复一个大写字母，例如 B
多选题：只回复字母，用逗号分隔，例如 A,C,D
填空题：只回复答案文本，多个空用逗号分隔
判断题：只回复 A（表示正确）或 B（表示错误）
简答题：直接返回答案内容

重要：不要输出题号、不要输出解析、不要输出多余文字。只输出答案字母或答案文本。
禁止输出"一个正确的描述"、"直接解决"等描述性文本，必须输出具体的选项字母。`;


// ═══════════════════════════════════════════════════════════════════════════════
//  § 3. 全局变量 & 早期初始化
//  快捷引用、全局状态、颜色映射、页面路由分发
// ═══════════════════════════════════════════════════════════════════════════════

var cxai_w = unsafeWindow,
    _l = location,
    _d = cxai_w.document,
    $ = cxai_w.jQuery || top.jQuery,
    md5 = md5 || window.md5,
    UE = cxai_w.UE,
    Swal = Swal || window.Swal;

// API代理地址（从 cxaiCfg.apiHost 读取，用户在设置面板中配置）
var cxai_host = '';

var cxai_mlist, _defaults, _domList, $subBtn, $saveBtn, $frame_c, $okBtn;
var cxai_currentQuestionMeta = null;
// AI 搜题请求节流：记录下一次可发起请求的时间戳（ms），由 cxai_getAnswer 内部维护
var _cxaiNextAiAllowedAt = 0;

// 颜色映射表（提前定义，避免变量提升问题）
var _cxaiLogColorMap = {
    red: '#dc2626', green: '#059669', blue: '#2563eb',
    yellow: '#ca8a04', orange: '#ea580c', purple: '#7c3aed',
    pink: '#db2777', gray: '#64748b', grey: '#64748b'
};

try { $('.navshow').find('a:contains(体验新版)')[0] ? $('.navshow').find('a:contains(体验新版)')[0].click() : ''; } catch (e) { /* ignore */ }

try { cxaiCfg.decrypt ? cxai_decryptFont() : ''; } catch (e) { console.warn('[ChaoxingAI] cxai_decryptFont error:', e); }

try { cxaiInitPasteBypass(); } catch (e) { console.warn('[ChaoxingAI] pasteBypass error:', e); }

// 兼容检测：如果同时运行了“ChatGPT学习通作业考试助手”(NE-21)，自动禁用其答题功能避免冲突
try {
    if (unsafeWindow && unsafeWindow.setting && unsafeWindow.setting.work !== undefined) {
        unsafeWindow.setting.work = 0;
        unsafeWindow.setting.examTurn = 0;
        console.log('[ChaoxingAI] 检测到NE-21脚本已运行，已自动禁用其答题功能');
    }
} catch (e) { /* 无法访问其 cxaiCfg 对象，跳过 */ }


if (_l.hostname == 'i.mooc.chaoxing.com' || _l.hostname == "i.chaoxing.com") {
    // 
} else if (_l.pathname.includes('/mycourse/studentstudy')) {
    cxai_showBox()
    $('#cxai-log', window.parent.document).html('初始化完毕！')
    cxai_setupAntiSleep()
    cxai_setupAutoRefresh()
} else if (_l.pathname.includes('/knowledge/cards')) {
    cxai_setupAntiSleep()
    var params = cxai_getTaskParams()
    var parsedParams = null;
    if (params && params !== '$mArg') {
        try { parsedParams = $.parseJSON(params); } catch (e) { parsedParams = null; }
    }
    if (!parsedParams || !parsedParams['attachments'] || parsedParams['attachments'].length <= 0) {
        cxai_logger('无任务点可处理，即将跳转页面', 'red')
        cxai_toNext()
    } else {
        cxai_waitForJQueryElement('.wrap .ans-cc .ans-attach-ct').then(function () {
            top.checkJob ? top.checkJob = () => false : true
            _domList = []
            cxai_mlist = parsedParams['attachments']
            _defaults = parsedParams['defaults']
            $.each($('.wrap .ans-cc .ans-attach-ct'), (i, t) => {
                _domList.push($(t).find('iframe'))
            })
            cxai_missonStart()
        });
    }
} else if (_l.pathname.includes('/exam/test/reVersionTestStartNew')) {
    cxai_showBox()
    cxai_waitForJQueryElement('.mark_table .whiteDiv').then(function () { cxai_missonExam() });
} else if (_l.pathname.includes('/mooc2/exam/preview')) {
    cxai_showBox()
    cxai_waitForJQueryElement('.mark_table .questionLi').then(function () { cxai_missonExamPreview() });
} else if (_l.pathname.includes('/mooc2/work/dowork')) {
    cxai_showBox()
    cxai_waitForJQueryElement('.mark_table form').then(function () { cxai_missonHomeWork() });
} else if (_l.pathname.includes('/work/phone/doHomeWork')) {
    var _oldal = cxai_w.alert
    cxai_w.alert = function (msg) {
        if (msg == '保存成功') {
            return;
        }
        return _oldal(msg)
    }
    var _oldcf = cxai_w.confirm
    cxai_w.confirm = function (msg) {
        if (msg.includes('确认提交') || msg.includes('未做完')) {
            return true
        }
        return _oldcf(msg)
    }
} else if (_l.pathname.includes('/mooc2/exam/exam-list')) {
    // Swal.fire('学习通AI助手提示', '注意：请谨慎使用脚本考试，开始考试之前请确保该账号已激活脚本。', 'info')
} else if (_l.pathname == '/mycourse/stu') {
    cxai_checkBrowser()
} else {
    // console.log(_l.pathname)
}


// ═══════════════════════════════════════════════════════════════════════════════
//  § 4. 答案匹配引擎
//  单选/多选匹配、字母索引、数字索引、去标点匹配、模糊相似度、判断题解析
// ═══════════════════════════════════════════════════════════════════════════════

// 统一多选点击：取消非目标 → 选中目标 → 验证 + 补选
// optionsElems: jQuery选项元素数组, indices: 要点击的索引数组
// clickFn(idx): 点击函数, verifyFn(idx): 验证是否已选中的函数
function cxaiClickOptions(optionsElems, indices, clickFn, verifyFn) {
    if (!indices || indices.length === 0) return;
    var CLICK_INTERVAL = 600; // 每个选项间隔600ms
    var delay = 300;

    // 构建目标索引集合
    var targetSet = {};
    for (var s = 0; s < indices.length; s++) targetSet[indices[s]] = true;

    // 第零轮：取消非目标选项的已选状态（解决用户已全选但AI答案更少的问题）
    for (var d = 0; d < optionsElems.length; d++) {
        if (!targetSet[d] && verifyFn(d)) {
            (function(idx, dly) {
                setTimeout(function() { clickFn(idx); }, dly);
            })(d, delay);
            delay += CLICK_INTERVAL;
        }
    }

    // 第一轮：错开点击目标选项
    for (var i = 0; i < indices.length; i++) {
        (function(idx, dly) {
            setTimeout(function() { clickFn(idx); }, dly);
        })(indices[i], delay + i * CLICK_INTERVAL);
    }

    // 第二轮：验证 + 补选（在所有点击完成后执行）
    var verifyDelay = delay + indices.length * CLICK_INTERVAL + 500;
    setTimeout(function() {
        var missed = [];
        for (var j = 0; j < indices.length; j++) {
            if (!verifyFn(indices[j])) missed.push(indices[j]);
        }
        if (missed.length === 0) {
            console.log('[CXAI] 多选点击验证通过，' + indices.length + '个选项全部选中');
        } else {
            console.log('[CXAI] 多选点击验证：' + missed.length + '个选项未选中，补选中...');
            for (var k = 0; k < missed.length; k++) {
                (function(idx2, delay2) {
                    setTimeout(function() { clickFn(idx2); }, delay2);
                })(missed[k], k * 500);
            }
        }
    }, verifyDelay);
}


function cxaiExtractLetterIndices(answerStr, optionCount) {
    if (!answerStr) return null;
    var letters = answerStr.toUpperCase().match(/[A-Z]/g);
    if (!letters || letters.length === 0) return null;
    var indices = [];
    for (var i = 0; i < letters.length; i++) {
        var idx = letters[i].charCodeAt(0) - 65; // A=0, B=1, ...
        if (idx >= 0 && idx < (optionCount || 26)) {
            if (indices.indexOf(idx) === -1) indices.push(idx);
        }
    }
    return indices.length > 0 ? indices : null;
}



function cxaiExtractImages(htmlStr) {
    if (!htmlStr) return [];
    var imgs = [];
    var re = /<img[^>]+src=["']([^"']+)["'][^>]*/gi;
    var m;
    while ((m = re.exec(htmlStr)) !== null) {
        if (m[1] && m[1].indexOf('data:') === -1) { imgs.push(m[1]); }
    }
    return imgs;
}

function cxaiMatchByLetter(answerStr, optionCount) {
    if (!answerStr || !optionCount) return -1;
    var s = answerStr.replace(/[\s\u3000]+/g, '').trim();
    var m = s.match(/([A-Ga-g])(?=[^A-Za-z\u4e00-\u9fa5]*$)/);
    if (!m) {
        m = s.match(/[\u201c\u201d\u2018\u2019\u300c]([A-Ga-g])[\u201c\u201d\u2018\u2019\u300d]/);
    }
    if (!m || !m[1]) {
        var _pure = s.replace(/[^A-Za-z]/g, '');
        if (_pure.length === 1 && /[A-Ga-g]/.test(_pure)) {
            var _idx = _pure.toUpperCase().charCodeAt(0) - 65;
            if (_idx >= 0 && _idx < optionCount) return _idx;
        }
    }
    if (m && m[1]) {
        var idx = m[1].toUpperCase().charCodeAt(0) - 65;
        if (idx >= 0 && idx < optionCount) return idx;
    }
    return -1;
}

function cxaiMatchMultipleByLetter(answerStr, optionCount) {
    if (!answerStr || !optionCount) return [];
    var s = answerStr.replace(/[\s\u3000]+/g, '').trim();
    var letters = s.match(/[A-Ga-g]/g);
    if (!letters || letters.length < 2) return [];
    var indices = [];
    var seen = {};
    for (var i = 0; i < letters.length; i++) {
        var idx = letters[i].toUpperCase().charCodeAt(0) - 65;
        if (idx >= 0 && idx < optionCount && !seen[idx]) {
            seen[idx] = true;
            indices.push(idx);
        }
    }
    return indices.length >= 2 ? indices : [];
}

function cxaiFindAnswerIndex(optionsArr, answerStr) {
    // ★ 优先：数字索引直接使用（题库返回的索引号）
    if (/^\d+$/.test(answerStr)) {
        var numIdx = parseInt(answerStr, 10);
        if (numIdx >= 0 && numIdx < optionsArr.length) {
            console.log('[CXAI匹配] 数字索引直接命中: 答案"' + answerStr + '" → 选项[' + numIdx + '] = "' + optionsArr[numIdx] + '"');
            return numIdx;
        }
    }
    // 文本精确匹配
    var _i = optionsArr.findIndex(function (item) { return item === answerStr; });
    if (_i !== -1) return _i;
    // ★ 去标点精确匹配（解决 AI 返回答案缺少末尾标点的问题）
    var _stripPunc = function(s) { return s.replace(/[。，、；：！？…·""''【】（）《》\.\,\;\!\?\:\'\"\(\)\[\]\<\>]/g, '').trim(); };
    var _strippedAnswer = _stripPunc(answerStr);
    if (_strippedAnswer.length > 0) {
        var _j = optionsArr.findIndex(function (item) { return _stripPunc(item) === _strippedAnswer; });
        if (_j !== -1) {
            console.log('[CXAI匹配] 去标点匹配命中: 答案"' + answerStr + '" → 选项[' + _j + '] = "' + optionsArr[_j] + '"');
            return _j;
        }
    }
    // 字母索引匹配（仅当答案是纯字母格式时才使用，避免从解释性文本中误提取技术术语的字母）
    var _letterIdx = cxaiExtractLetterIndices(answerStr, optionsArr.length);
    var _cleanedAnswer = answerStr.replace(/[\|｜\n;；,，、\s]/g, '');
    if (_letterIdx && _letterIdx.length > 0 && /^[A-Za-z]+$/.test(_cleanedAnswer)) {
        cxai_logger('字母索引匹配: ' + answerStr + ' → 选项[' + _letterIdx[0] + ']', 'blue');
        return _letterIdx[0];
    }
    // 模糊匹配
    return cxai_findBestFuzzyMatch(optionsArr, answerStr);
}


function cxaiFindMultipleIndices(optionsArr, answerStr) {
    // ★ 优先：数字索引直接使用（支持 | , ; 、和 等多种分隔符，如 "0|2|3"、"0,1"、"1和2"、"选项1和选项2"）
    // 剥离 "选项"/"第" 前缀后再检测纯数字序列
    var _cleaned = answerStr.replace(/选项|第/g, '');
    if (/^\d[\d\s|,;，、和]+$/.test(_cleaned) || /^\d+$/.test(_cleaned)) {
        var nums = _cleaned.split(/[\s|,;，、和]+/).map(function(s) { return parseInt(s, 10); }).filter(function(n) {
            return !isNaN(n) && n >= 0 && n < optionsArr.length;
        });
        if (nums.length > 0) {
            console.log('[CXAI匹配] 多选数字索引直接命中: "' + answerStr + '"' + (_cleaned !== answerStr ? ' (清洗后: "' + _cleaned + '")' : '') + ' → 选项' + JSON.stringify(nums));
            return nums;
        }
    }

    // ★ 优先：字母索引匹配（处理 "A|B|C"、"A、B、C"、"ABC"、"A B C" 等字母格式）
    // 安全检查：只有当答案在去除分隔符和空格后仅含字母时才使用字母索引（避免误判含中文的文本答案）
    var _letterIdx = cxaiExtractLetterIndices(answerStr, optionsArr.length);
    var _answerLettersOnly = answerStr.replace(/[\|｜\n;；,，、\s]/g, '');
    if (_letterIdx && _letterIdx.length > 1 && /^[A-Za-z]+$/.test(_answerLettersOnly)) {
        // 多个字母且纯字母 → 直接返回多选索引（如 "ABC" → [0,1,2]，"A|C" → [0,2]）
        console.log('[CXAI匹配] 多选字母索引直接命中: "' + answerStr + '" → 选项' + JSON.stringify(_letterIdx));
        return _letterIdx;
    }

    var _stripPunc = function(s) { return s.replace(/[。，、；：！？…·""''【】（）《》\.\,\;\!\?\:\'\"\(\)\[\]\<\>]/g, '').trim(); };

    // ★★★ 增强：先用分隔符拆分答案，逐片段匹配选项（解决AI返回非标准格式导致少选的问题）
    var _parts = answerStr.split(/[\|｜\n;；,，、]+/).map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
    if (_parts.length >= 2) {
        var matched = [];
        var _fuzzyEnabled = typeof cxai_isFuzzyMatchEnabled === 'function' && cxai_isFuzzyMatchEnabled();
        for (var p = 0; p < _parts.length; p++) {
            var part = _parts[p];
            var partStripped = _stripPunc(part);
            var partMatched = false;
            // 0) 单字母片段 → 字母索引匹配（处理 "A|B|C" 格式）
            if (/^[A-Ga-g]$/.test(part.trim())) {
                var _li = part.trim().toUpperCase().charCodeAt(0) - 65;
                if (_li >= 0 && _li < optionsArr.length && matched.indexOf(_li) === -1) {
                    matched.push(_li);
                    partMatched = true;
                    console.log('[CXAI匹配] 片段字母索引命中: "' + part + '" → 选项' + _li);
                }
            }
            if (partMatched) continue;
            // 1) 精确包含匹配（防短答案误匹配：选项包含短答案时，必须唯一命中才采纳）
            for (var i = 0; i < optionsArr.length; i++) {
                if (matched.indexOf(i) !== -1) continue;
                var optStripped = _stripPunc(optionsArr[i]);
                var _optLen = optionsArr[i].length;
                var _partLen = part.length;
                // 答案包含选项 → 答案是长文本，选项是短文本，正常匹配
                if (part.indexOf(optionsArr[i]) !== -1 || (partStripped.length > 0 && optStripped.length > 0 && partStripped.indexOf(optStripped) !== -1)) {
                    matched.push(i);
                    partMatched = true;
                    break;
                }
                // 选项包含答案 → 需检查是否唯一命中（防止短答案同时匹配多个相似选项）
                if (optionsArr[i].indexOf(part) !== -1 || (partStripped.length > 0 && optStripped.length > 0 && optStripped.indexOf(partStripped) !== -1)) {
                    var _hitCount = 0;
                    for (var ci = 0; ci < optionsArr.length; ci++) {
                        if (optionsArr[ci].indexOf(part) !== -1 ||
                            (partStripped.length > 0 && _stripPunc(optionsArr[ci]).indexOf(partStripped) !== -1)) _hitCount++;
                    }
                    if (_hitCount === 1) {
                        matched.push(i);
                        partMatched = true;
                        break;
                    } else {
                        console.log('[CXAI匹配] 短答案"' + part + '"匹配' + _hitCount + '个选项，跳过包含匹配，交给模糊匹配处理');
                        break; // 跳出选项循环，交给模糊匹配
                    }
                }
            }
            if (partMatched) continue;
            // 2) 模糊匹配兜底（对未匹配的片段尝试相似度匹配）
            if (_fuzzyEnabled && part.length >= 2) {
                var bestIdx = -1, bestScore = 0;
                for (var j = 0; j < optionsArr.length; j++) {
                    if (matched.indexOf(j) !== -1) continue;
                    var score = cxai_stringSimilarity(optionsArr[j], part);
                    if (score > bestScore) { bestScore = score; bestIdx = j; }
                }
                if (bestIdx !== -1 && bestScore >= 0.5) {
                    matched.push(bestIdx);
                    console.log('[CXAI匹配] 片段模糊匹配: "' + part + '" → 选项' + bestIdx + ' 相似度=' + (bestScore * 100).toFixed(1) + '%');
                }
            }
        }
        if (matched.length > 0) {
            console.log('[CXAI匹配] 分隔符拆分匹配命中(多选): "' + answerStr + '" → 拆分' + _parts.length + '段 → 匹配' + matched.length + '个 → 选项' + JSON.stringify(matched));
            return matched;
        }
    }

    var matched = [];
    // 先尝试文本包含匹配（整体匹配）
    for (var i = 0; i < optionsArr.length; i++) {
        if (answerStr.indexOf(optionsArr[i]) !== -1) {
            matched.push(i);
        }
    }
    if (matched.length > 0) return matched;
    // ★ 去标点包含匹配（解决 AI 返回答案缺少末尾标点的问题）
    var _strippedAnswer = _stripPunc(answerStr);
    if (_strippedAnswer.length > 0) {
        for (var k = 0; k < optionsArr.length; k++) {
            if (_strippedAnswer.indexOf(_stripPunc(optionsArr[k])) !== -1) {
                if (matched.indexOf(k) === -1) matched.push(k);
            }
        }
    }
    if (matched.length > 0) {
        console.log('[CXAI匹配] 去标点匹配命中(多选): "' + answerStr + '" → 选项' + JSON.stringify(matched));
        return matched;
    }
    // 单字母答案回退（如 "B" 可能是单选但走到多选逻辑的情况）
    if (_letterIdx && _letterIdx.length > 0) {
        console.log('[CXAI匹配] 字母索引回退(多选): ' + answerStr + ' → 选项' + JSON.stringify(_letterIdx));
        return _letterIdx;
    }
    // 模糊匹配
    return cxai_findFuzzyMatchMultiple(optionsArr, answerStr);
}


function cxai_stringSimilarity(s1, s2) {
    if (!s1 && !s2) return 1;
    if (!s1 || !s2) return 0;
    // 统一小写、去除首尾空白
    s1 = s1.toLowerCase().trim();
    s2 = s2.toLowerCase().trim();
    if (s1 === s2) return 1;
    var len1 = s1.length, len2 = s2.length;
    if (len1 === 0 || len2 === 0) return 0;
    // Levenshtein距离 - 空间优化版
    var prev = [], curr = [];
    for (var j = 0; j <= len2; j++) prev[j] = j;
    for (var i = 1; i <= len1; i++) {
        curr[0] = i;
        for (var j = 1; j <= len2; j++) {
            if (s1[i - 1] === s2[j - 1]) {
                curr[j] = prev[j - 1];
            } else {
                curr[j] = 1 + Math.min(prev[j], curr[j - 1], prev[j - 1]);
            }
        }
        var tmp = prev; prev = curr; curr = tmp;
    }
    var maxLen = Math.max(len1, len2);
    return 1 - prev[len2] / maxLen;
}


function cxai_findBestFuzzyMatch(optionTexts, aiAnswer, threshold, silent) {
    if (!cxai_isFuzzyMatchEnabled()) return -1;
    if (!aiAnswer || !optionTexts || optionTexts.length === 0) return -1;
    threshold = (threshold !== undefined) ? threshold : 0.5;
    var bestIndex = -1, bestScore = 0;
    for (var i = 0; i < optionTexts.length; i++) {
        var score = cxai_stringSimilarity(optionTexts[i], aiAnswer);
        if (score > bestScore) {
            bestScore = score;
            bestIndex = i;
        }
    }
    if (bestScore >= threshold) {
        if (!silent) cxai_logger('相似度匹配: 最佳匹配项[' + bestIndex + '] 相似度=' + (bestScore * 100).toFixed(1) + '%', 'blue');
        return bestIndex;
    }
    if (!silent) cxai_logger('相似度匹配: 所有选项相似度均低于阈值(' + (threshold * 100) + '%)，最高=' + (bestScore * 100).toFixed(1) + '%', 'orange');
    return -1;
}


function cxai_findFuzzyMatchMultiple(optionTexts, aiAnswer, threshold) {
    if (!cxai_isFuzzyMatchEnabled()) return [];
    if (!aiAnswer || !optionTexts || optionTexts.length === 0) return [];
    threshold = (threshold !== undefined) ? threshold : 0.5;
    var parts = aiAnswer.split(/[\|｜\n;；,，、]+/).map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
    var matched = [];
    for (var p = 0; p < parts.length; p++) {
        var part = parts[p].trim();
        if (!part) continue;
        var bestIndex = -1, bestScore = 0;
        for (var i = 0; i < optionTexts.length; i++) {
            var score = cxai_stringSimilarity(optionTexts[i], part);
            if (score > bestScore) {
                bestScore = score;
                bestIndex = i;
            }
        }
        if (bestScore >= threshold && matched.indexOf(bestIndex) === -1) {
            matched.push(bestIndex);
            cxai_logger('相似度匹配(多选): "' + part + '" → 选项[' + bestIndex + '] 相似度=' + (bestScore * 100).toFixed(1) + '%', 'blue');
        }
    }
    return matched;
}


function cxai_getRate() {
    var stored = localStorage.getItem('cxaiSetting.rate');
    var n = stored !== null ? parseFloat(stored) : (cxaiCfg.rate || 1);
    if (!isFinite(n) || n <= 0) n = 1;
    if (n > 16) n = 16;
    return n;
}


function cxai_parseJudgeAnswer(agrs) {
    if (!agrs) return null;
    var s = agrs.replace(/[。，.,!！\s]/g, '').toLowerCase();
    var trueWords = ['正确', '是', '对', '√', 't', 'true', 'ri', 'right', 'yes', 'a'];
    var falseWords = ['错误', '否', '错', '×', 'f', 'false', 'wr', 'wrong', 'no', 'b'];
    // 精确匹配
    for (var i = 0; i < trueWords.length; i++) {
        if (s === trueWords[i]) return 'true';
    }
    for (var i = 0; i < falseWords.length; i++) {
        if (s === falseWords[i]) return 'false';
    }
    // 包含匹配（优先判断"错"避免"正确的"误判——先检查否定词）
    for (var i = 0; i < falseWords.length; i++) {
        if (s.indexOf(falseWords[i]) !== -1) return 'false';
    }
    for (var i = 0; i < trueWords.length; i++) {
        if (s.indexOf(trueWords[i]) !== -1) return 'true';
    }
    return null;
}


function cxai_findJudgeOptionIndex(optionTexts, isTrue) {
    var trueWords = ['正确', '是', '对', '√', 'T', 'ri'];
    var falseWords = ['错误', '否', '错', '×', 'F', 'wr'];
    var words = isTrue ? trueWords : falseWords;
    for (var i = 0; i < optionTexts.length; i++) {
        var t = optionTexts[i];
        for (var j = 0; j < words.length; j++) {
            if (t.indexOf(words[j]) !== -1) return i;
        }
    }
    return -1;
}


function cxai_findAnswerTextareas($container) {
    if (!$container || $container.length === 0) return $();
    // 1) 标准 UEditor 下层 textarea，name="answerEditor{questionId}{i}"
    var $eles = $container.find('textarea[name^="answerEditor"]');
    if ($eles.length > 0) return $eles;
    // 2) 旧版/兼容路径
    $eles = $container.find('.subEditor textarea, .Answer .divText textarea, .stem_answer textarea, .edui-editor textarea');
    if ($eles.length > 0) return $eles;
    // 3) 兜底：容器内任意 textarea
    return $container.find('textarea');
}


function cxai_updateLocalStorage(event) {
    var checkbox = event.target;
    localStorage.setItem(checkbox.id, checkbox.checked);
}


function cxai_isRedoMode() {
    var stored = localStorage.getItem('cxaiSetting.redo');
    if (stored !== null) return stored === 'true';
    return !!cxaiCfg.redo;
}


function cxai_isFuzzyMatchEnabled() {
    var stored = localStorage.getItem('cxaiSetting.fuzzyMatch');
    if (stored !== null) return stored === 'true';
    return !!cxaiCfg.fuzzyMatch;
}


// ═══════════════════════════════════════════════════════════════════════════════
//  § 5. UI 浮窗 & 日志
//  cxai_showBox 浮窗渲染/拖拽/设置面板，cxai_logger 日志输出
// ═══════════════════════════════════════════════════════════════════════════════

function cxai_showBox() {
    //公告
    if (cxaiCfg.cxai_showBox && top.document.querySelector('#cxai-notice') == undefined) {
        // 注入样式（仅一次）
        if (!top.document.getElementById('cxai-style')) {
            var styleEl = top.document.createElement('style');
            styleEl.id = 'cxai-style';
            styleEl.textContent = `
            /* === Dark Glass — 深色毛玻璃主题 (v6) === */
            #cxai-box{position:fixed;top:5%;right:16%;width:352px;z-index:99999;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;font-size:13px;color:rgba(230,232,240,.92);color-scheme:dark;background:linear-gradient(165deg,rgba(38,42,55,.80) 0%,rgba(30,34,46,.74) 50%,rgba(26,30,40,.70) 100%);backdrop-filter:blur(28px) saturate(170%) brightness(1.02);-webkit-backdrop-filter:blur(28px) saturate(170%) brightness(1.02);border:1px solid rgba(255,255,255,.12);border-radius:16px;box-shadow:0 0 0 .5px rgba(0,0,0,.28),0 24px 52px -12px rgba(0,0,0,.45),0 8px 24px -6px rgba(0,0,0,.30),inset 0 1px 0 rgba(255,255,255,.09),inset 0 -1px 0 rgba(0,0,0,.15);overflow:hidden;transition:opacity .3s cubic-bezier(.4,0,.2,1),transform .3s cubic-bezier(.4,0,.2,1);animation:cxai-in .5s cubic-bezier(.16,1,.3,1) both;}
            #cxai-box::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,rgba(94,234,212,.35) 0%,rgba(165,180,252,.50) 50%,rgba(94,234,212,.35) 100%);z-index:1;border-radius:16px 16px 0 0;opacity:.70}
            @keyframes cxai-in{from{opacity:0;transform:translateY(-10px) scale(.975)}to{opacity:1;transform:none}}
            /* ── Header ── */
            #cxai-box .cxai-header{position:relative;display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:linear-gradient(180deg,rgba(255,255,255,.065) 0%,rgba(255,255,255,.025) 100%);color:rgba(235,237,245,.92);border-bottom:1px solid rgba(255,255,255,.075);cursor:move;user-select:none}
            #cxai-box.cxai-collapsed .cxai-body{display:none}
            #cxai-box.cxai-collapsed .cxai-header{border-bottom:none}
            #cxai-box .cxai-title{display:flex;align-items:center;gap:9px;font-weight:600;font-size:14px;letter-spacing:.2px;margin:0;color:inherit}
            #cxai-box .cxai-dot{width:8px;height:8px;border-radius:50%;background:#5eead4;box-shadow:0 0 8px 1px rgba(94,234,212,.45),0 0 0 1px rgba(94,234,212,.25),inset 0 0 3px rgba(255,255,255,.5);animation:cxai-pulse-dk 2.5s infinite ease-in-out;flex-shrink:0}
            @keyframes cxai-pulse-dk{0%,100%{box-shadow:0 0 8px 1px rgba(94,234,212,.45),0 0 0 1px rgba(94,234,212,.25)}50%{box-shadow:0 0 14px 2px rgba(94,234,212,.55),0 0 0 1px rgba(94,234,212,.30)}}
            #cxai-box #cxai-close{margin:0;width:25px;height:25px;padding:0;display:inline-flex;align-items:center;justify-content:center;font-size:17px;line-height:1;color:rgba(200,204,218,.55);cursor:pointer;border:1px solid rgba(255,255,255,.08);border-radius:50%;background:rgba(255,255,255,.04);box-shadow:inset 0 1px 0 rgba(255,255,255,.06);transition:all .2s ease;user-select:none;font-family:inherit}
            #cxai-box #cxai-close:hover{color:rgba(220,222,235,.82);background:rgba(255,255,255,.09);border-color:rgba(255,255,255,.13)}
            #cxai-box #cxai-close:active{transform:scale(.91);transition-duration:.08s}
            /* ── Body ── */
            #cxai-box .cxai-body{padding:14px 18px 18px}
            #cxai-box #cxai-notice{border-top:none!important;margin:0 0 10px!important;overflow:visible}
            #cxai-box .cxai-uid{display:flex;align-items:center;gap:6px;color:rgba(160,166,186,.70);font-size:12px;margin-bottom:11px;padding:9px 13px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.065);border-radius:11px;box-shadow:inset 0 1px 0 rgba(255,255,255,.04)}
            #cxai-box .cxai-uid b{background:linear-gradient(135deg,#a5b4fc,#5eead4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:600}
            #cxai-box .cxai-row{display:flex;gap:8px;align-items:center}
            /* ── Buttons ── */
            #cxai-box .cxai-btn{display:inline-flex;align-items:center;justify-content:center;padding:7px 14px;font-size:12px;font-weight:500;border-radius:10px;cursor:pointer;border:1px solid rgba(255,255,255,.09);transition:all .18s ease;white-space:nowrap;-webkit-font-smoothing:antialiased}
            #cxai-box .cxai-btn-primary{color:rgba(225,228,240,.95);background:linear-gradient(180deg,rgba(130,145,230,.22),rgba(110,125,210,.14));border-color:rgba(165,180,252,.20);box-shadow:0 1px 4px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.08)}
            #cxai-box .cxai-btn-primary:hover{color:#fff;background:linear-gradient(180deg,rgba(140,158,240,.30),rgba(120,138,220,.20));border-color:rgba(165,180,252,.28);transform:translateY(-1px);box-shadow:0 2px 8px rgba(0,0,0,.22),0 0 0 1px rgba(165,180,252,.08),inset 0 1px 0 rgba(255,255,255,.10)}
            #cxai-box .cxai-btn-secondary{color:rgba(180,186,206,.65);background:transparent;border-color:rgba(255,255,255,.065)}
            #cxai-box .cxai-btn-secondary:hover{color:rgba(210,214,230,.85);background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.11)}
            #cxai-box .cxai-btn:active{transform:scale(.97)!important;transition-duration:.08s!important}
            /* ── Selects & Inputs ── */
            #cxai-box #cxai-provider,#cxai-box #cxai-model{flex:1;min-width:0;padding:7.5px 11px;font-size:12px;border-radius:10px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.045);color:rgba(220,224,236,.86);cursor:pointer;outline:none;box-shadow:inset 0 1px 3px rgba(0,0,0,.10);transition:all .18s ease;-webkit-font-smoothing:antialiased}
            #cxai-box #cxai-provider:hover,#cxai-box #cxai-model:hover{border-color:rgba(255,255,255,.14);background:rgba(255,255,255,.07)}
            #cxai-box #cxai-provider:focus,#cxai-box #cxai-model:focus{border-color:rgba(165,180,252,.30);box-shadow:0 0 0 2.5px rgba(165,180,252,.10),inset 0 1px 3px rgba(0,0,0,.10)}
            #cxai-box .cxai-select{padding:5.5px 9px;font-size:12px;border-radius:9px;border:1px solid rgba(255,255,255,.085);background:rgba(255,255,255,.04);color:rgba(220,224,236,.86);cursor:pointer;outline:none;min-width:80px;flex-shrink:0;transition:all .18s ease;-webkit-font-smoothing:antialiased}
            #cxai-box .cxai-select:hover{border-color:rgba(255,255,255,.135);background:rgba(255,255,255,.065)}
            #cxai-box .cxai-select:focus{border-color:rgba(165,180,252,.26);box-shadow:0 0 0 2.5px rgba(165,180,252,.08)}
            /* ── User Info Card ── */
            #cxai-box #cxai-userInfo{margin:11px 0 0;padding:10px 13px;background:rgba(255,255,255,.032);border:1px solid rgba(255,255,255,.07);border-radius:11px;box-shadow:inset 0 1px 0 rgba(255,255,255,.04);font-size:12px;color:rgba(170,178,200,.68);line-height:1.6;overflow:hidden;transition:border-color .2s}
            #cxai-box #cxai-userInfo:empty{display:none}
            #cxai-box #cxai-userInfo b{background:linear-gradient(135deg,#a5b4fc,#5eead4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:600}
            /* ── Settings Panel ── */
            #cxai-box #cxai-moreSettings{padding:6px 10px 10px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);border-radius:13px;box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 1px 4px rgba(0,0,0,.10);margin:11px 0 0}
            #cxai-box #cxai-moreSettings label{display:flex;flex-direction:row-reverse;align-items:center;justify-content:space-between;margin:0;padding:8px 6px;font-size:12px;color:rgba(175,181,202,.72);cursor:pointer;user-select:none;line-height:1.4;-webkit-font-smoothing:antialiased;transition:all .18s ease;border-radius:8px}
            #cxai-box #cxai-moreSettings label:hover{color:rgba(210,216,234,.90);background:rgba(255,255,255,.04)}
            #cxai-box #cxai-moreSettings label.cxai-field{flex-direction:column;align-items:stretch;gap:4px;cursor:default;padding:9px 6px;color:rgba(155,162,184,.60);font-size:11.8px}
            #cxai-box #cxai-moreSettings label + label:not(.cxai-field):not(:has(+ .cxai-pair)){border-top:1px solid rgba(255,255,255,.045)}
            #cxai-box #cxai-moreSettings input[type=checkbox]{appearance:none;-webkit-appearance:none;width:32px;height:18px;border:1px solid rgba(255,255,255,.08);border-radius:18px;cursor:pointer;position:relative;transition:all .25s ease;background:rgba(80,86,106,.30);box-shadow:inset 0 1px 2px rgba(0,0,0,.15);margin:0 0 0 10px;flex-shrink:0}
            #cxai-box #cxai-moreSettings input[type=checkbox]::before{content:'';position:absolute;top:1.5px;left:1.5px;width:13px;height:13px;border-radius:50%;background:linear-gradient(180deg,rgba(210,214,228,.95),rgba(170,176,196));box-shadow:0 1px 2px rgba(0,0,0,.18);transition:all .25s ease}
            #cxai-box #cxai-moreSettings input[type=checkbox]:hover{background:rgba(100,108,132,.36)}
            #cxai-box #cxai-moreSettings input[type=checkbox]:checked{background:linear-gradient(135deg,rgba(140,155,220,.45),rgba(94,234,212,.25));border-color:rgba(165,180,252,.25);box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 0 8px rgba(165,180,252,.15)}
            #cxai-box #cxai-moreSettings input[type=checkbox]:checked:hover{background:linear-gradient(135deg,rgba(150,165,230,.50),rgba(94,234,212,.30));box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 0 12px rgba(165,180,252,.20)}
            #cxai-box #cxai-moreSettings input[type=checkbox]:checked::before{transform:translateX(14px);background:linear-gradient(180deg,#e0e2ec,#c8cce0);box-shadow:0 1px 2px rgba(0,0,0,.15)}
            #cxai-box #cxai-moreSettings .cxai-pair{display:grid;grid-template-columns:1fr 1fr;gap:0 7px;padding:0}
            #cxai-box #cxai-moreSettings .cxai-pair label{margin:0;padding:8px 6px;border-top:none!important}
            #cxai-box #cxai-moreSettings .cxai-pair + *{border-top:1px solid rgba(255,255,255,.045)}
            #cxai-box #cxai-moreSettings p{display:none}
            #cxai-box #cxai-moreSettings span[style*="color:#888"]{color:rgba(120,130,150,.50)!important}
            #cxai-box #cxai-moreSettings input[type=text],#cxai-box #cxai-moreSettings input[type=password],#cxai-box #cxai-moreSettings input[type=number]{padding:6px 9px;font-size:11.5px;border-radius:9px;border:1px solid rgba(255,255,255,.09);background:rgba(0,0,0,.20);color:rgba(220,224,236,.86);outline:none;box-shadow:inset 0 1px 3px rgba(0,0,0,.12);transition:all .18s ease;-webkit-font-smoothing:antialiased}
            #cxai-box #cxai-moreSettings input[type=text]::-webkit-input-placeholder,#cxai-box #cxai-moreSettings input[type=password]::-webkit-input-placeholder,#cxai-box #cxai-moreSettings input[type=number]::-webkit-input-placeholder{color:rgba(120,130,150,.45)}
            #cxai-box #cxai-moreSettings input[type=text]:hover,#cxai-box #cxai-moreSettings input[type=password]:hover,#cxai-box #cxai-moreSettings input[type=number]:hover{border-color:rgba(255,255,255,.135);background:rgba(0,0,0,.26)}
            #cxai-box #cxai-moreSettings input[type=text]:focus,#cxai-box #cxai-moreSettings input[type=password]:focus,#cxai-box #cxai-moreSettings input[type=number]:focus{border-color:rgba(165,180,252,.26);box-shadow:0 0 0 2.5px rgba(165,180,252,.08),inset 0 1px 3px rgba(0,0,0,.12)}
            #cxai-box #cxai-moreSettings select,#cxai-box .cxai-select,#cxai-box #cxai-provider,#cxai-box #cxai-model{-moz-appearance:none;-webkit-appearance:none;appearance:none;color-scheme:dark;background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Cpath fill='rgba(160,170,200,.5)' d='M0 2.5h10L5 7.5z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 8px center;background-size:10px;padding-right:22px}
            /* ── Thinking (Hidden) ── */
            #cxai-box #cxai-thinking{display:none!important}
            /* ── Animations ── */
            @keyframes cxai-spin{to{transform:rotate(360deg)}}
            @keyframes cxai-dot{0%,80%,100%{transform:scale(.5);opacity:.30}40%{transform:scale(1);opacity:1}}
            /* ── Log Console ── */
            #cxai-box #cxai-log .cxai-log-spinner{display:inline-block;width:9px;height:9px;margin-right:5px;border:1.5px solid rgba(255,255,255,.10);border-top-color:rgba(165,180,252,.65);border-radius:50%;vertical-align:-2px;animation:cxai-spin .8s linear infinite}
            #cxai-box #cxai-log .cxai-log-dots{display:inline-flex;gap:2.5px;margin-left:4px;vertical-align:1px}
            #cxai-box #cxai-log .cxai-log-dots i{width:3px;height:3px;border-radius:50%;background:rgba(165,180,252,.58);opacity:.55;animation:cxai-dot 1.2s infinite ease-in-out both;display:inline-block}
            #cxai-box #cxai-log .cxai-log-dots i:nth-child(2){animation-delay:.16s}
            #cxai-box #cxai-log .cxai-log-dots i:nth-child(3){animation-delay:.32s}
            #cxai-box #cxai-log{max-height:152px;overflow-y:auto;margin:13px 0 0;padding:11px 13px;background:rgba(0,0,0,.12);border:1px solid rgba(255,255,255,.07);border-radius:11px;box-shadow:inset 0 1px 0 rgba(255,255,255,.04),inset 0 0 8px rgba(0,0,0,.06);font-family:"SF Mono","Cascadia Code","Consolas","Menlo",monospace;font-size:11px;line-height:1.65;color:rgba(200,208,225,.85);position:relative}
            #cxai-box #cxai-log:empty{display:none}
            #cxai-box #cxai-log::-webkit-scrollbar{width:4px}
            #cxai-box #cxai-log::-webkit-scrollbar-track{background:transparent}
            #cxai-box #cxai-log::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:3px}
            #cxai-box #cxai-log::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.14)}
            #cxai-box #cxai-log p{margin:0;padding:3px 0;word-break:break-all;transition:opacity .15s}
            #cxai-box #cxai-log hr{display:none}
            #cxai-box #cxai-log .cxai-time{color:rgba(165,180,252,.35);margin-right:7px;font-weight:400}
            #cxai-copy-modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.6);display:none;justify-content:center;align-items:center;z-index:100000}
            #cxai-copy-modal-content{background:#1e1e2e;padding:24px;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.4);width:80%;max-width:850px;max-height:90%;display:flex;flex-direction:column;border:1px solid rgba(255,255,255,.08)}
            #cxai-copy-modal-content h3{margin:0 0 16px;color:rgba(210,216,234,.95);font-size:15px;font-weight:600}
            #cxai-copy-modal-view{width:100%;flex-grow:1;min-height:400px;height:500px;overflow-y:auto;border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:12px;font-size:13px;line-height:1.6;box-sizing:border-box;background:#11111b;color:rgba(210,216,234,.90)}
            
            #cxai-copy-modal-footer{display:flex;justify-content:flex-end;gap:10px;margin-top:16px}
            #cxai-copy-modal-cancel{padding:7px 16px;border:1px solid rgba(255,255,255,.1);border-radius:8px;background:transparent;cursor:pointer;font-size:12px;color:rgba(180,186,206,.7)}
            #cxai-copy-modal-cancel:hover{background:rgba(255,255,255,.05);color:rgba(210,216,234,.9)}
            #cxai-copy-modal-copy{padding:7px 16px;border:none;border-radius:8px;background:linear-gradient(135deg,rgba(94,234,212,.25),rgba(165,180,252,.25));color:rgba(225,228,240,.95);cursor:pointer;font-size:12px;font-weight:500}
            #cxai-copy-modal-copy:hover{background:linear-gradient(135deg,rgba(94,234,212,.35),rgba(165,180,252,.35))}
            `;
            top.document.head.appendChild(styleEl);
        }
        var box_html = `
            <div id="cxai-box">
                <div class="cxai-header" title="按住标题栏可拖动 / 点击右侧按钮收起">
                    <h3 class="cxai-title"><span class="cxai-dot"></span>学习通AI助手</h3>
                    <button id="cxai-close" type="button" aria-label="收起">−</button>
                </div>
                <div class="cxai-body">
                    <div id="cxai-notice"></div>
                    <div id="cxai-userInfo"></div>
                    <div id="cxai-moreSettings" style="display:none;">
                        <label class="cxai-field">API Key：<input type="password" id="cxaiSetting.apiKey" class="cxai-select" placeholder="输入API Key" style="width:100%;margin-top:2px;"></label>
                        <label class="cxai-field" id="cxai-ernie-secret" style="display:none">Secret Key：<input type="password" id="cxaiSetting.ernieSecretKey" class="cxai-select" placeholder="ERNIE Secret Key" style="width:100%;margin-top:2px;"></label>
                        <p></p>
                        <label class="cxai-field" title="AI代理服务器地址（留空则使用上方Provider直连）">代理地址(可选)：<input type="text" id="cxaiSetting.apiHost" class="cxai-select" placeholder="https://your-domain.com" style="width:100%;margin-top:2px;"></label>
                        <p></p>
                        <label><input type="checkbox" id="cxaiSetting.searchEnabled" checked>启用搜题</label>
                        <label><input type="checkbox" id="cxaiSetting.thirdPartyApi">启用第三方题库（lyck6.cn）</label>
                        <label class="cxai-field" id="cxai-tp-token-row" style="display:none" title="10位付费token，留空走免费接口">第三方题库Token：<input type="password" id="cxaiSetting.thirdPartyToken" class="cxai-select" placeholder="留空=免费接口" maxlength="10" style="width:100%;margin-top:2px;"></label>
                        <p></p>
                        <div class="cxai-pair">
                            <label class="cxai-field"><select id="cxaiSetting.rate" class="cxai-select"><option value="1">1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="2">2×</option></select>视频/音频倍速</label>
                            <label class="cxai-field" title="两次 AI 搜题请求之间的最小间隔（秒）。0 为不节流；高并发整卷预览、小号被限流时可设 1~3">
                                <input type="number" id="cxaiSetting.reqIntervalTime" class="cxai-select" min="0" max="60" step="1" style="min-width:56px;width:56px;padding:5px 8px;">搜题间隔 (秒)
                            </label>
                        </div>
                        <div class="cxai-pair">
                            <label><input type="checkbox" id="cxaiSetting.unlockPaste">解锁粘贴限制</label>
                            <label><input type="checkbox" id="cxaiSetting.sub">测验自动提交</label>
                        </div>
                        <div class="cxai-pair">
                            <label><input type="checkbox" id="cxaiSetting.force">测验强制提交</label>
                            <label><input type="checkbox" id="cxaiSetting.examTurn">考试自动跳转</label>
                        </div>
                        <div class="cxai-pair">
                            <label><input type="checkbox" id="cxaiSetting.goodStudent">答案加粗不选择</label>
                            <label><input type="checkbox" id="cxaiSetting.alterTitle" checked>答案插入题目后</label>
                            </div>
                        <div class="cxai-pair">
                            <label><input type="checkbox" id="cxaiSetting.redo">重做模式</label>
                            <label><input type="checkbox" id="cxaiSetting.fuzzyMatch" checked>模糊匹配</label>
                        </div>
                    </div>
                    <div id="cxai-thinking">
                        <div class="cxai-thinking-spinner"></div>
                        <span class="cxai-thinking-text">AI 思考中<span class="cxai-thinking-dots"><i></i><i></i><i></i></span></span>
                    </div>
                    <div id="cxai-log"></div>
                </div>
            </div>
        `;
        $(box_html).appendTo('body');

        // 恢复保存的位置与收起/展开状态
        (function () {
            var $box = $('#cxai-box');
            // 恢复位置
            try {
                var savedPos = localStorage.getItem('cxaiSetting.boxPosition');
                if (savedPos) {
                    var pos = JSON.parse(savedPos);
                    if (pos && typeof pos.left === 'number' && typeof pos.top === 'number') {
                        var vw = window.innerWidth, vh = window.innerHeight;
                        var w = $box.outerWidth() || 340;
                        // 约束：避免恢复后跑到视窗外不可见
                        var nx = Math.max(40 - w, Math.min(pos.left, vw - 40));
                        var ny = Math.max(0, Math.min(pos.top, vh - 40));
                        $box.css({ left: nx + 'px', top: ny + 'px', right: 'auto' });
                    }
                }
            } catch (_) { /* empty */ }
            // 恢复收起/展开状态
            if (localStorage.getItem('cxaiSetting.boxCollapsed') === 'true') {
                $box.addClass('cxai-collapsed');
                $('#cxai-close').text('+').attr('aria-label', '展开');
            }
        })();

        // 收起/展开按钮：切换 .cxai-collapsed，按钮文本在 − / + 之间切换
        $('#cxai-close').on('mousedown', function (e) {
            e.stopPropagation(); // 避免触发标题栏拖动
        }).on('click', function (e) {
            e.stopPropagation();
            var collapsed = $('#cxai-box').toggleClass('cxai-collapsed').hasClass('cxai-collapsed');
            $(this).text(collapsed ? '+' : '−');
            $(this).attr('aria-label', collapsed ? '展开' : '收起');
            // 持久化收起/展开状态
            try { localStorage.setItem('cxaiSetting.boxCollapsed', collapsed ? 'true' : 'false'); } catch (_) { /* empty */ }
        });
        // 标题栏拖动：拖动结束后写入 localStorage，刷新后保持上次位置
        (function () {
            var $box = $('#cxai-box');
            var $header = $box.find('.cxai-header');
            var dragging = false, startX = 0, startY = 0, startLeft = 0, startTop = 0;
            $header.on('mousedown', function (e) {
                if (e.which !== 1) return; // 仅响应鼠标左键
                if ($(e.target).closest('#cxai-close').length) return; // 点在按钮上不拖动
                dragging = true;
                var rect = $box[0].getBoundingClientRect();
                startX = e.clientX;
                startY = e.clientY;
                startLeft = rect.left;
                startTop = rect.top;
                // 清空 right，把 left/top 改为像素值，避免与默认 left:66% 计算冲突
                $box.css({ left: startLeft + 'px', top: startTop + 'px', right: 'auto' });
                $('body').css('user-select', 'none');
                e.preventDefault();
            });
            $(document).on('mousemove.cxaidrag', function (e) {
                if (!dragging) return;
                var nx = startLeft + (e.clientX - startX);
                var ny = startTop + (e.clientY - startY);
                var w = $box.outerWidth();
                var vw = window.innerWidth;
                var vh = window.innerHeight;
                // 约束：保留至少 40px 标题栏在视窗内，便于回拉
                nx = Math.max(40 - w, Math.min(nx, vw - 40));
                ny = Math.max(0, Math.min(ny, vh - 40));
                $box.css({ left: nx + 'px', top: ny + 'px' });
            }).on('mouseup.cxaidrag', function () {
                if (!dragging) return;
                dragging = false;
                $('body').css('user-select', '');
                // 持久化位置
                try {
                    var rect = $box[0].getBoundingClientRect();
                    localStorage.setItem('cxaiSetting.boxPosition', JSON.stringify({ left: rect.left, top: rect.top }));
                } catch (_) { /* empty */ }
            });
        })();

        // 设置面板切换 + 复选框监听器
        (function () {
            var moreSettings = document.getElementById('cxai-moreSettings');
            var userInfo = document.getElementById('cxai-userInfo');
            if (!moreSettings || !userInfo) return;

            // #cxai-moreSettingsBtn 由 $('#cxai-notice').html(...) 在后面动态注入，
            // 此时还不存在，且每次 cxai_showBox() 都会被重建，因此使用事件委托。
            var isSettingsVisible = false;
            $('#cxai-box').on('click', '#cxai-moreSettingsBtn', function () {
                userInfo.style.display = isSettingsVisible ? 'block' : 'none';
                moreSettings.style.display = isSettingsVisible ? 'none' : 'block';
                this.textContent = isSettingsVisible ? '设置' : '返回';
                isSettingsVisible = !isSettingsVisible;
            });

            // 修改题目默认开启（仅初始化一次，避免 forEach 内重复执行）
            if (localStorage.getItem('cxaiSetting.alterTitle') === null) {
                localStorage.setItem('cxaiSetting.alterTitle', 'true');
            }
            // 相似度匹配默认开启
            if (localStorage.getItem('cxaiSetting.fuzzyMatch') === null) {
                localStorage.setItem('cxaiSetting.fuzzyMatch', 'true');
            }

            ['sub', 'force', 'examTurn', 'goodStudent', 'alterTitle', 'redo', 'fuzzyMatch', 'unlockPaste', 'thirdPartyApi', 'searchEnabled'].forEach(function (settingId) {
                var checkbox = document.getElementById('cxaiSetting.' + settingId);
                if (!checkbox) return;
                checkbox.addEventListener('change', cxai_updateLocalStorage);
                checkbox.checked = localStorage.getItem('cxaiSetting.' + settingId) === 'true';
            });
            // 解锁粘贴：即时切换
            var unlockPasteCb = document.getElementById('cxaiSetting.unlockPaste');
            if (unlockPasteCb) {
                unlockPasteCb.addEventListener('change', function () {
                    cxaiInitPasteBypassToggle(unlockPasteCb.checked);
                });
            }


            // 第三方题库 Token 行显隐
            var tpApiCb = document.getElementById('cxaiSetting.thirdPartyApi');
            var tpTokenRow = document.getElementById('cxai-tp-token-row');
            if (tpApiCb && tpTokenRow) {
                tpTokenRow.style.display = tpApiCb.checked ? '' : 'none';
                tpApiCb.addEventListener('change', function () {
                    tpTokenRow.style.display = tpApiCb.checked ? '' : 'none';
                });
            }
            // 第三方题库 Token
            var tpTokenInput = document.getElementById('cxaiSetting.thirdPartyToken');
            if (tpTokenInput) {
                tpTokenInput.value = localStorage.getItem('cxaiSetting.thirdPartyToken') || '';
                tpTokenInput.addEventListener('change', function () {
                    localStorage.setItem('cxaiSetting.thirdPartyToken', tpTokenInput.value);
                });
            }

            // 倍速下拉：恢复上次选择并持久化
            var rateSelect = document.getElementById('cxaiSetting.rate');
            if (rateSelect) {
                rateSelect.value = localStorage.getItem('cxaiSetting.rate') || '1';
                rateSelect.addEventListener('change', function () {
                    localStorage.setItem('cxaiSetting.rate', rateSelect.value);
                });
            }
            // 搜题间隔输入框：恢复上次值并持久化（范围 0~60 秒）
            var reqIntervalInput = document.getElementById('cxaiSetting.reqIntervalTime');
            if (reqIntervalInput) {
                var savedInterval = localStorage.getItem('cxaiSetting.reqIntervalTime');
                reqIntervalInput.value = (savedInterval !== null && isFinite(parseInt(savedInterval, 10)))
                    ? savedInterval
                    : String(cxaiCfg.reqIntervalTime || 0);
                reqIntervalInput.addEventListener('input', function () {
                    var v = parseInt(reqIntervalInput.value, 10);
                    if (!isFinite(v) || v < 0) v = 0;
                    if (v > 60) v = 60;
                    localStorage.setItem('cxaiSetting.reqIntervalTime', String(v));
                });
                reqIntervalInput.addEventListener('change', function () {
                    var v = parseInt(reqIntervalInput.value, 10);
                    if (!isFinite(v) || v < 0) v = 0;
                    if (v > 60) v = 60;
                    reqIntervalInput.value = String(v);
                    localStorage.setItem('cxaiSetting.reqIntervalTime', String(v));
                });
            }
            // API地址输入框：恢复上次值并持久化
            var apiHostInput = document.getElementById('cxaiSetting.apiHost');
            if (apiHostInput) {
                var savedHost = localStorage.getItem('cxaiSetting.apiHost');
                if (savedHost) {
                    apiHostInput.value = savedHost;
                    cxaiCfg.apiHost = savedHost;
                }
                apiHostInput.addEventListener('change', function () {
                    var v = apiHostInput.value.replace(/\/+$/, '');
                    apiHostInput.value = v;
                    localStorage.setItem('cxaiSetting.apiHost', v);
                    cxaiCfg.apiHost = v;
                    cxai_host = v;
                });
            }
            // 每个 Provider 独立 API Key 存取
            function _getApiKeys() {
                try { return JSON.parse(localStorage.getItem('cxaiSetting.apiKeys') || '{}'); } catch (e) { return {}; }
            }
            function _saveApiKeys(obj) {
                try { localStorage.setItem('cxaiSetting.apiKeys', JSON.stringify(obj)); } catch (e) { /* empty */ }
            }
            function _getSecretKeys() {
                try { return JSON.parse(localStorage.getItem('cxaiSetting.secretKeys') || '{}'); } catch (e) { return {}; }
            }
            function _saveSecretKeys(obj) {
                try { localStorage.setItem('cxaiSetting.secretKeys', JSON.stringify(obj)); } catch (e) { /* empty */ }
            }
            // API Key 输入框：按 Provider 分开存储
            var apiKeyInput = document.getElementById('cxaiSetting.apiKey');
            if (apiKeyInput) {
                var _initPk = localStorage.getItem('cxaiSetting.provider') || 'deepseek';
                var _initKeys = _getApiKeys();
                // 兼容旧版单一 key：迁移一次后删除旧 key，避免重复迁移
                var _oldKey = localStorage.getItem('cxaiSetting.apiKey');
                if (_oldKey && !_initKeys[_initPk]) {
                    _initKeys[_initPk] = _oldKey;
                    _saveApiKeys(_initKeys);
                }
                // 删除旧版单一 key（已迁移至 per-provider 存储）
                if (_oldKey) { try { localStorage.removeItem('cxaiSetting.apiKey'); } catch (_) {} }
                apiKeyInput.value = _initKeys[_initPk] || '';
                // 用 data 属性记录当前编辑的 provider，避免切换 provider 时 input 失焦触发 change 导致竞态
                apiKeyInput.setAttribute('data-current-pk', _initPk);
                apiKeyInput.addEventListener('input', function () {
                    var _pk = apiKeyInput.getAttribute('data-current-pk') || 'deepseek';
                    var _keys = _getApiKeys();
                    _keys[_pk] = apiKeyInput.value;
                    _saveApiKeys(_keys);
                });
            }
            // ERNIE Secret Key 输入框：按 Provider 分开存储
            var ernieSecretInput = document.getElementById('cxaiSetting.ernieSecretKey');
            if (ernieSecretInput) {
                var _initSk = _getSecretKeys();
                var _oldSk = localStorage.getItem('cxaiSetting.ernieSecretKey');
                if (_oldSk && !_initSk['ernie']) {
                    _initSk['ernie'] = _oldSk;
                    _saveSecretKeys(_initSk);
                }
                ernieSecretInput.value = _initSk['ernie'] || '';
                ernieSecretInput.addEventListener('change', function () {
                    var _sk = _getSecretKeys();
                    _sk['ernie'] = ernieSecretInput.value;
                    _saveSecretKeys(_sk);
                });
            }
        })();
    } else {
        $('#cxai-log', window.parent.document).html('')
    }
    let _u = cxai_getCk('_uid') || cxai_getCk('UID')
    // 生成 Provider 下拉选项
    var _providerOpts = '';
    $.each(PROVIDERS, function (k, v) { _providerOpts += '<option value="' + k + '">' + v.name + '</option>'; });
    $('#cxai-notice').html(`
        <div class="cxai-uid">学习通账号 UID：<b>${_u || '-'}</b> <button id="cxai-copy-btn" class="cxai-btn cxai-btn-primary" title="一键提取页面所有题目到剪贴板，可粘贴到搜索网站找答案" style="padding:4px 12px;font-size:12px;margin-left:8px;vertical-align:middle;">📋 复制题目</button></div>
        <div class="cxai-row">
            <select id="cxai-provider" class="cxai-select" style="flex:1;min-width:0;">${_providerOpts}</select>
            <select id="cxai-model" class="cxai-select" style="flex:1;min-width:0;"></select>
            <button id="cxai-moreSettingsBtn" class="cxai-btn cxai-btn-secondary">设置</button>
        </div>
    `);

    // 恢复 Provider/Model 选择
    var _savedProvider = localStorage.getItem('cxaiSetting.provider') || 'deepseek';
    var _savedModel = localStorage.getItem('cxaiSetting.model');
    $('#cxai-provider').val(PROVIDERS[_savedProvider] ? _savedProvider : 'deepseek');
    // 更新 Model 下拉框
    function _updateModelDropdown() {
        var _pk = $('#cxai-provider').val();
        var _models = PROVIDERS[_pk] ? PROVIDERS[_pk].models : [];
        var _html = '';
        for (var i = 0; i < _models.length; i++) { _html += '<option value="' + _models[i] + '">' + _models[i] + '</option>'; }
        $('#cxai-model').html(_html);
        if (_savedModel && _models.indexOf(_savedModel) !== -1) { $('#cxai-model').val(_savedModel); }
        _savedModel = null; // 仅首次恢复
    }
    _updateModelDropdown();
    // 绑定 change 事件
    $('#cxai-provider').off('change.cxaiProvider').on('change.cxaiProvider', function () {
        var _prevPk = (function () { try { return JSON.parse(localStorage.getItem('cxaiSetting.apiKeys') || '{}'); } catch (e) { return {}; } })();
        var $apiKeyOld = $('#cxaiSetting.apiKey');
        var _oldPk = $apiKeyOld.length ? $apiKeyOld.attr('data-current-pk') : null;
        if (_oldPk && $apiKeyOld.length) {
            _prevPk[_oldPk] = $apiKeyOld.val();
            try { localStorage.setItem('cxaiSetting.apiKeys', JSON.stringify(_prevPk)); } catch (e) {}
        }
        var _pk = $(this).val();
        localStorage.setItem('cxaiSetting.provider', _pk);
        _updateModelDropdown();
        localStorage.setItem('cxaiSetting.model', $('#cxai-model').val());
        $('#cxai-ernie-secret').toggle(_pk === 'ernie');
        // 切换 Provider 时自动带出对应的 API Key
        var _keys = (function () { try { return JSON.parse(localStorage.getItem('cxaiSetting.apiKeys') || '{}'); } catch (e) { return {}; } })();
        var $apiKey = $('#cxaiSetting.apiKey');
        if ($apiKey.length) {
            $apiKey.val(_keys[_pk] || '');
            $apiKey.attr('data-current-pk', _pk);
        }
        // ERNIE Secret Key 同理
        var _sk = (function () { try { return JSON.parse(localStorage.getItem('cxaiSetting.secretKeys') || '{}'); } catch (e) { return {}; } })();
        var $ernieSk = $('#cxaiSetting.ernieSecretKey');
        if ($ernieSk.length) { $ernieSk.val(_sk[_pk] || ''); }
    });
    $('#cxai-model').off('change.cxaiModel').on('change.cxaiModel', function () {
        localStorage.setItem('cxaiSetting.model', $(this).val());
    });

    // Provider 状态提示
    var _cfg = cxaiGetProviderConfig();
    if (_cfg.apiKey) {
        $('#cxai-userInfo').html('当前: <b>' + _cfg.provider.name + '</b> / ' + _cfg.model);
    } else if (cxaiCfg.apiHost) {
        cxai_host = cxaiCfg.apiHost;
        $('#cxai-userInfo').html('代理模式: <b>' + cxaiCfg.apiHost + '</b>');
    } else {
        $('#cxai-userInfo').html('请在设置中配置 API Key 或代理地址');
    }
}


function cxai_logger(str, color) {
    var _time = new Date().toLocaleTimeString()
    var c = _cxaiLogColorMap[color] || color || '#334155'
    var $p = $('<p><span class="cxai-time">[' + _time + ']</span><span class="cxai-msg" style="color:' + c + ';">' + str + '</span></p>')
    $('#cxai-log', window.parent.document).prepend($p)
    return $p
}


function cxai_updateLogEntry($p, str, color) {
    if (!$p || !$p.length) return
    var c = _cxaiLogColorMap[color] || color || '#334155'
    $p.find('.cxai-msg').css('color', c).html(str)
}


// ── 日志更新 ──
// 原地更新一条已存在的日志(由 cxai_logger 返回的 jQuery <p> 元素)。
// 用于把 "AI 思考中..." 占位行原地替换为答案/错误提示, 避免反复出现/消失。


// ═══════════════════════════════════════════════════════════════════════════════
//  § 10. 章节导航 & 任务调度
//  章节跳转、任务队列、子页面检测、课程列表刷新
// ═══════════════════════════════════════════════════════════════════════════════

function cxai_checkBrowser() {
    var userAgent = navigator.userAgent
    if (userAgent.indexOf('Chrome') == -1 || GM_info.scriptHandler != 'ScriptCat') {
        // 非推荐环境，但不弹出警告
        // Swal.fire('您使用的不是推荐运行环境(edge、谷歌浏览器+ScriptCat)，脚本运行可能会发生问题.')
    }
}


function cxai_parseUrlParams() {
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    let _p = {}
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        _p[pair[0]] = pair[1]
    }
    return _p
}


function cxai_getStr(str, start, end) {
    let res = str.match(new RegExp(`${start}(.*?)${end}`))
    return res ? res[1] : null
}


function cxai_getTaskParams() {
    try {
        var _iframeScripts = _d.scripts,
            _p = null;
        for (let i = 0; i < _iframeScripts.length; i++) {
            if (_iframeScripts[i].innerHTML.indexOf('mArg = "";') != -1 && _iframeScripts[i].innerHTML.indexOf('==UserScript==') == -1) {
                _p = cxai_getStr(_iframeScripts[i].innerHTML.replace(/\s/g, ""), 'try{mArg=', ';}catch');
                return _p
            }
        }
        return _p
    } catch (e) {
        return null
    }

}


function cxai_getCk(name) {
    return document.cookie.match(`[;\\s+]?${name}=([^;]*)`)?.pop();
}


function cxai_toNext() {
    cxai_refreshCourseList().then((res) => {

        // 检测当前课时是否还有未完成的页面（兼容多种 DOM 结构）
        // 返回 { activeIndex, total, hasNext, tabs } 或 null
        function detectSubTabPosition() {
            try {
                // 兼容现代版（.prev_ul）、旧版（#prev_tab）、备用版（#prevTabBox）
                var selectors = ['#prev_tab > li', '.prev_ul > li', '#prevTabBox > li'];
                for (var i = 0; i < selectors.length; i++) {
                    var nodes = top.document.querySelectorAll(selectors[i]);
                    if (!nodes || nodes.length === 0) continue;
                    var tabs = Array.prototype.slice.call(nodes);
                    var activeIdx = -1;
                    for (var j = 0; j < tabs.length; j++) {
                        if (tabs[j].classList && tabs[j].classList.contains('active')) {
                            activeIdx = j;
                            break;
                        }
                    }
                    if (activeIdx === -1) continue;
                    return {
                        activeIndex: activeIdx,
                        total: tabs.length,
                        hasNext: activeIdx < tabs.length - 1,
                        tabs: tabs
                    };
                }
                // 兼容风格：span.currents ~ span（当前页指示器后还有兄弟节点表示存在下一页）
                var currents = top.document.querySelector('span.currents');
                if (currents) {
                    var nextSibs = [];
                    var sib = currents.nextElementSibling;
                    while (sib) {
                        if (sib.tagName === 'SPAN') nextSibs.push(sib);
                        sib = sib.nextElementSibling;
                    }
                    if (nextSibs.length > 0) {
                        return { activeIndex: 0, total: nextSibs.length + 1, hasNext: true, tabs: null };
                    }
                }
            } catch (e) { /* ignore */ }
            return null;
        }

        // 点击章节内 “下一页” 按钮（仅在当前课时尚有页面时使用，避免误跳到下一章节）
        function clickNextPageBtn() {
            $('#cxai-log', window.parent.document).html('')
            var nextBtn = top.document.querySelector('#mainid > .prev_next.next')
            if (nextBtn) { nextBtn.click(); return true }
            return false
        }

        // 点击 “下一章节” 按钮：优先尝试章节内的“下一页/下一节”统一按钮，
        // 找不到时再退回 #prevNextFocusNext（仅用于章节级跳转）
        function clickNextChapterBtn() {
            $('#cxai-log', window.parent.document).html('')
            var nextBtn = top.document.querySelector('#mainid > .prev_next.next')
            if (nextBtn) { nextBtn.click(); return true }
            var focusBtn = top.document.querySelector('#prevNextFocusNext')
            if (focusBtn) { focusBtn.click(); return true }
            return false
        }

        // 优先级 1：当前课时若仍有未完成的页面，先切换到下一页，避免漏刷
        var sub = detectSubTabPosition()
        if (sub && sub.hasNext) {
            cxai_logger('当前课时存在未完成页面（' + (sub.activeIndex + 1) + '/' + sub.total + '），准备切换到下一页', 'blue')
            setTimeout(() => {
                if (!clickNextPageBtn()) {
                    cxai_logger('未找到本课时下一页按钮，回退到下一章节跳转', 'orange')
                    clickNextChapterBtn()
                }
            }, 5000)
            return
        }

        if (cxaiCfg.review || !cxaiCfg.work) {
            cxai_logger('本课时已无未完成页面，准备切换到下一章节', 'blue')
            setTimeout(() => { clickNextChapterBtn() }, 5000)
            return
        }
        let _t = []
        $.each($(res).find('li'), (_, t) => {
            let curid = $(t).find('.posCatalog_select').attr('id'),
                status = $(t).find('.prevHoverTips').text(),
                name = $(t).find('.posCatalog_name').attr('title');
            if (curid.indexOf('cur') != -1) {
                _t.push({ 'curid': curid, 'status': status, 'name': name })
            }
        })

        let _curChaterId = $('#coursetree', window.parent.document).find('.posCatalog_active').attr('id')
        let _curIndex = _t.findIndex((item) => item['curid'] == _curChaterId)
        for (_curIndex; _curIndex < _t.length - 1; _curIndex++) {
            // 当前章节仍标记为待完成，但章节内已无更多页面（hasNext=false 已在前面判定过）
            // 此分支保留作为兜底：万一 detectSubTabPosition 漏检，仍尝试调用一次
            if (_t[_curIndex]['status'].indexOf('待完成') != -1) {
                var subAgain = detectSubTabPosition()
                if (subAgain && subAgain.hasNext) {
                    cxai_logger('兜底检测到本课时仍有未完成页面（' + (subAgain.activeIndex + 1) + '/' + subAgain.total + '），切换到下一页', 'blue')
                    setTimeout(() => {
                        if (!clickNextPageBtn()) clickNextChapterBtn()
                    }, 5000)
                    return
                }
            }
            let t = _t[_curIndex + 1]
            if (t['status'].indexOf('待完成') != -1) {
                setTimeout(() => {
                    clickNextChapterBtn()
                    cxai_showBox()
                }, 5000)
                return
            } else if (t['status'].indexOf('闯关') != -1) {
                cxai_logger('当前为闯关模式，存在未完成任务点，脚本已暂停运行，请手动完成并点击下一章节', 'red')
                return
            } else if (t['status'].indexOf('开放') != -1) {
                cxai_logger('章节未开放', 'red')
                return
            } else {
                //  console.log(t)
            }
        }
        cxai_logger('此课程处理完毕', 'green')
        return
    }).catch(function (err) {
        cxai_logger('获取课程列表失败: ' + (err && err.message || err || '未知错误') + '，5秒后重试', 'red')
        setTimeout(cxai_toNext, 5000)
    })
}


function cxai_missonStart() {
    cxai_showBox()
    if (cxai_mlist.length <= 0) {
        cxai_logger('此页面任务处理完毕，准备跳转页面', 'green')
        return cxai_toNext()
    }
    let _type = cxai_mlist[0]['type'],
        _dom = _domList[0],
        _task = cxai_mlist[0];
    if (_type == undefined) {
        _type = cxai_mlist[0]['property']["module"]
    }
    switch (_type) {
        case "video":
            if (cxai_mlist[0]['property']['module'] == 'insertvideo') {
                cxai_logger('开始处理视频', 'purple')
                cxai_missonVideo(_dom, _task)
                break
            } else if (cxai_mlist[0]['property']['module'] == 'insertaudio') {
                cxai_logger('开始处理音频', 'purple')
                cxai_missonVideo(_dom, _task)
                break
            } else {
                cxai_logger('未知类型任务，请联系作者，跳过', 'red')
                cxai_switchMission()
                break
            }
        case "workid":
            cxai_logger('开始处理测验', 'purple')
            cxai_missonWork(_dom, _task)
            break
        case "document":
            cxai_logger('开始处理文档', 'purple')
            cxai_missonDoucument(_dom, _task)
            break
        case "read":
            cxai_logger('开始处理阅读', 'purple')
            cxai_missonRead(_dom, _task)
            break
        case "insertbook":
            cxai_logger('开始处理读书', 'purple')
            cxai_missonBook(_dom, _task)
            break
        default: {
            // 无需处理或不算任务点的占位类型：图片、答疑、分享、外链题库等
            let GarbageTasks = ['insertimage', 'insertanswerquestion', 'insertshare', 'insertquestion', 'insertdiscuss', 'insertsubject']
            if (GarbageTasks.indexOf(_type) != -1) {
                cxai_logger('发现无需处理任务（' + _type + '），跳过。', 'red')
                cxai_switchMission()
            } else {
                cxai_logger('暂不支持处理此类型:' + _type + '，跳过。', 'red')
                cxai_switchMission()
            }
        }
    }
}


function cxai_switchMission() {
    cxai_mlist.splice(0, 1)
    _domList.splice(0, 1)
    setTimeout(cxai_missonStart, 5000)
}


function cxai_refreshCourseList() {
    let _p = cxai_parseUrlParams()
    return new Promise((resolve, reject) => {
        $.ajax({
            url: _l.protocol + '//' + _l.host + '/mycourse/studentstudycourselist?courseId=' + _p['courseid'] + '&chapterId=' + _p['knowledgeid'] + '&clazzid=' + _p['clazzid'] + '&mooc2=1',
            type: 'GET',
            dataType: 'html',
            success: function (res) {
                resolve(res)
            },
            error: function (xhr, status, err) {
                cxai_logger('课程列表刷新失败: ' + (status || err || '未知错误'), 'red')
                reject(err || new Error(status))
            }
        })
    })

}


// ═══════════════════════════════════════════════════════════════════════════════
//  § 6. 视频/音频任务
//  视频播放控制、倍速锁定、播放速率检测
// ═══════════════════════════════════════════════════════════════════════════════

function cxai_missonVideo(dom, obj) {
    const { isPassed, otherInfo, property } = obj;
    const { _jobid: jobId, name, objectid: objectId, module } = property;

    // 同一函数处理视频与音频两种任务，按 module 区分日志/开关
    const isAudioTask = module === 'insertaudio';
    const taskLabel = isAudioTask ? '音频' : '视频';

    if (isAudioTask ? !cxaiCfg.audio : !cxaiCfg.video) {
        cxai_logger(`用户设置不处理${taskLabel}任务，准备开始下一个任务。`, 'red');
        return setTimeout(cxai_switchMission, 3000);
    }

    if (!cxaiCfg.review && isPassed === true) {
        cxai_logger(`${taskLabel}：${name} 检测已完成，准备处理下一个任务`, 'green');
        return cxai_switchMission();
    }

    // 使用传入的 dom 参数查找相关的 iframe，而不是搜索整个文档
    let target = dom.length > 0 ? dom[0] : null;
    let mediaType = isAudioTask ? 'audio' : 'video'; // 按任务类型预设，循环里再以 DOM 为准

    if (!target) {
        cxai_logger(`未找到${taskLabel} iframe，3 秒后重试……`, 'orange');
        return setTimeout(() => cxai_missonVideo(dom, obj), 3000);
    }

    cxai_logger(`处理${taskLabel}：${name}，正在解析`);
    let executed = false;
    const doc = target.contentDocument || target.contentWindow.document;

    const intervalId = setInterval(() => {
        // 先尝试查找视频，如果没有则尝试查找音频
        let media = doc.querySelector('video');
        if (!media) {
            media = doc.querySelector('audio');
            mediaType = 'audio';
        }

        if (media && !executed) {
            executed = true;
            clearInterval(intervalId);

            // 计算最终倍速：优先用户设置；若超星禁用了倍速菜单则强制 1×
            const userRate = cxai_getRate();
            const rateDisabled = mediaType === 'video' && cxai_isPlaybackRateDisabled(doc);
            const finalRate = rateDisabled ? 1 : userRate;
            if (rateDisabled && userRate > 1) {
                cxai_logger(`${name} 超星禁用了此视频的倍速菜单，已回退至 1×（强行倍速会被清空进度）`, 'orange');
            } else if (userRate > 1) {
                cxai_logger(`已开启倍速：${userRate}×（高倍速可能被超星判定异常）`, 'orange');
            }

            cxai_logger(`${name} - ${mediaType} 播放成功，开始控制播放（${finalRate}×）`);
            media.pause();
            media.muted = true;
            cxai_hookMediaRate(media, finalRate);
            media.play();

            // 防止暂停的通用恢复函数
            const resume = () => {
                if (media.paused) {
                    media.play();
                }
            };

            media.addEventListener('pause', resume);
            if (mediaType === 'video' && media.parentElement) {
                media.parentElement.addEventListener('mouseleave', resume);
            }

            // 临近结尾自动恢复 1×（仅当当前为倍速）—— 避免任务点判定失败
            let rateRestored = finalRate <= 1;
            if (!rateRestored) {
                const onTimeUpdate = () => {
                    if (!rateRestored && isFinite(media.duration) && media.duration - media.currentTime < 10) {
                        rateRestored = true;
                        try { delete media.playbackRate; } catch (_) { /* empty */ }
                        cxai_hookMediaRate(media, 1);
                        media.removeEventListener('timeupdate', onTimeUpdate);
                    }
                };
                media.addEventListener('timeupdate', onTimeUpdate);
            }

            media.addEventListener('ended', () => {
                cxai_logger(`${name} - ${mediaType} 已播放完成`);
                media.removeEventListener('pause', resume);
                clearInterval(intervalId);
                setTimeout(cxai_switchMission, 1000);
            });
        }
    }, 2500);
}


function cxai_hookMediaRate(media, rate) {
    try { media.playbackRate = rate; } catch (_) { /* empty */ }
    try {
        Object.defineProperty(media, 'playbackRate', {
            configurable: true,
            get: function () { return rate; },
            set: function () { /* 阻止外部改写 */ }
        });
    } catch (_) {
        try {
            media.addEventListener('ratechange', function () {
                if (media.playbackRate !== rate) {
                    try { media.playbackRate = rate; } catch (__) { /* empty */ }
                }
            });
        } catch (___) { /* empty */ }
    }
}


function cxai_isPlaybackRateDisabled(iframeDocument) {
    try {
        var items = iframeDocument.querySelectorAll('.vjs-playback-rate .vjs-menu-content .vjs-menu-item');
        return items.length === 0;
    } catch (_) {
        return false;
    }
}


// ═══════════════════════════════════════════════════════════════════════════════
//  § 7. 读书/文档/阅读任务
//  书籍、文档、阅读类任务点处理
// ═══════════════════════════════════════════════════════════════════════════════

function cxai_missonBook(dom, obj) {
    if (cxaiCfg.task) {
        if (obj['jobid'] == undefined) {
            cxai_logger("当前只处理任务点任务,跳过", 'red')
            cxai_switchMission()
            return
        }
    }
    let jobId = obj['property']['jobid'],
        name = obj['property']['bookname'],
        jtoken = obj['jtoken'],
        knowledgeId = _defaults['knowledgeid'],
        courseId = _defaults['courseid'],
        clazzId = _defaults['clazzId'];
    if (obj['job'] == undefined) {
        cxai_logger('读书：' + name + '检测已完成，准备执行下一个任务。', 'green')
        cxai_switchMission()
        return
    }
    $.ajax({
        url: _l.protocol + '//' + _l.host + '/ananas/job?jobid=' + jobId + '&knowledgeid=' + knowledgeId + '&courseid=' + courseId + '&clazzid=' + clazzId + '&jtoken=' + jtoken + '&_dc=' + String(Math.round(new Date())),
        method: 'GET',
        success: function (res) {
            if (res.status) {
                cxai_logger('读书：' + name + res.msg + ',准备执行下一个任务。', 'green')
            } else {
                cxai_logger('读书：' + name + '处理异常,跳过。', 'red')
            }
            cxai_switchMission()
            return
        },
    })
}


function cxai_missonDoucument(dom, obj) {
    if (cxaiCfg.task) {
        if (obj['jobid'] == undefined) {
            cxai_logger("当前只处理任务点任务,跳过", 'red')
            cxai_switchMission()
            return
        }
    }
    let jobId = obj['property']['jobid'],
        name = obj['property']['name'],
        jtoken = obj['jtoken'],
        knowledgeId = _defaults['knowledgeid'],
        courseId = _defaults['courseid'],
        clazzId = _defaults['clazzId'];
    if (obj['job'] == undefined) {
        cxai_logger('文档：' + name + '检测已完成，准备执行下一个任务。', 'green')
        cxai_switchMission()
        return
    }
    $.ajax({
        url: _l.protocol + '//' + _l.host + '/ananas/job/document?jobid=' + jobId + '&knowledgeid=' + knowledgeId + '&courseid=' + courseId + '&clazzid=' + clazzId + '&jtoken=' + jtoken + '&_dc=' + String(Math.round(new Date())),
        method: 'GET',
        success: function (res) {
            if (res.status) {
                cxai_logger('文档：' + name + res.msg + ',准备执行下一个任务。', 'green')
            } else {
                cxai_logger('文档：' + name + '处理异常,跳过。', 'red')
            }
            cxai_switchMission()
            return
        },
    })

}


function cxai_missonRead(dom, obj) {
    if (cxaiCfg.task) {
        if (obj['jobid'] == undefined) {
            cxai_logger("当前只处理任务点任务,跳过", 'red')
            cxai_switchMission()
            return
        }
    }
    let jobId = obj['property']['jobid'],
        name = obj['property']['title'],
        jtoken = obj['jtoken'],
        knowledgeId = _defaults['knowledgeid'],
        courseId = _defaults['courseid'],
        clazzId = _defaults['clazzId'];
    if (obj['job'] == undefined) {
        cxai_logger('阅读：' + name + ',检测已完成，准备执行下一个任务。', 'green')
        cxai_switchMission()
        return
    }
    $.ajax({
        url: _l.protocol + '//' + _l.host + '/ananas/job/readv2?jobid=' + jobId + '&knowledgeid=' + knowledgeId + '&courseid=' + courseId + '&clazzid=' + clazzId + '&jtoken=' + jtoken + '&_dc=' + String(Math.round(new Date())),
        method: 'GET',
        success: function (res) {
            if (res.status) {
                cxai_logger('阅读：' + name + res.msg + ',准备执行下一个任务。', 'green')
            } else {
                cxai_logger('阅读：' + name + '处理异常,跳过。', 'red')
            }
            cxai_switchMission()
            return
        }
    })
}


// ═══════════════════════════════════════════════════════════════════════════════
//  § 8. 测验/作业答题
//  手机端/PC端测验处理、作业答题、逐题作答逻辑
// ═══════════════════════════════════════════════════════════════════════════════

function cxai_missonWork(dom, obj) {
    if (!cxaiCfg.work) {
        cxai_logger('用户设置不自动处理测验，准备处理下一个任务', 'green')
        cxai_switchMission()
        return
    }
    let isDo;
    if (cxaiCfg.task) {
        cxai_logger("当前只处理任务点任务", 'red')
        if (obj['jobid'] == undefined ? false : true) {
            isDo = true
        } else {
            isDo = false
        }
    } else {
        cxai_logger("当前默认处理所有任务（包括非任务点任务）", 'red')
        isDo = true
    }
    if (isDo) {
        if (obj['jobid'] !== undefined) {
            var phoneWeb = _l.protocol + '//' + _l.host + '/work/phone/work?workId=' + obj['jobid'].replace('work-', '') + '&courseId=' + _defaults['courseid'] + '&clazzId=' + _defaults['clazzId'] + '&knowledgeId=' + _defaults['knowledgeid'] + '&jobId=' + obj['jobid'] + '&enc=' + obj['enc']
            // setTimeout(() => { cxai_startDoCyWork(0, dom) }, 3000)
            setTimeout(() => { cxai_startDoPhoneCyWork(0, dom, phoneWeb) }, 3000)
        } else {
            setTimeout(() => { cxai_startDoCyWork(0, dom) }, 3000)
        }
        // } else if (!GM_getValue('cando')) {
        //     cxai_logger('存在未完成任务点，脚本已暂停执行，请手动处理后刷新网页。', 'red')
        //     return
    } else {
        cxai_logger('用户设置只处理属于任务点的任务，准备处理下一个任务', 'green')
        cxai_switchMission()
        return
    }
}


function cxai_doPhoneWork($dom) {
    let $cy = $dom.find('.Wrappadding form')
    $subBtn = $cy.find('.zquestions .zsubmit .btn-ok-bottom')
    $okBtn = $dom.find('#okBtn')
    $saveBtn = $cy.find('.zquestions .zsubmit .btn-save')
    let TimuList = $cy.find('.zquestions .Py-mian1')
    cxai_startDoPhoneTimu(0, TimuList)
}


function cxai_startDoPhoneTimu(index, TimuList) {
    if (index == TimuList.length) {
        if (localStorage.getItem('cxaiSetting.sub') === 'true') {
            cxai_logger('测验处理完成，准备自动提交。', 'green')
            setTimeout(() => {
                $subBtn.click()
                setTimeout(() => {
                    $okBtn.click()
                    cxai_logger('提交成功，准备切换下一个任务。', 'green')
                    cxai_mlist.splice(0, 1)
                    _domList.splice(0, 1)
                    setTimeout(() => { cxai_switchMission() }, 3000)
                }, 3000)
            }, 5000)
        } else if (localStorage.getItem('cxaiSetting.force') === 'true') {
            cxai_logger('测验处理完成，存在无答案题目,由于用户设置了强制提交，准备自动提交。', 'red')
            setTimeout(() => {
                $subBtn.click()
                setTimeout(() => {
                    $okBtn.click()
                    cxai_logger('提交成功，准备切换下一个任务。', 'green')
                    cxai_mlist.splice(0, 1)
                    _domList.splice(0, 1)
                    setTimeout(() => { cxai_switchMission() }, 3000)
                }, 3000)
            }, 5000)
        } else {
            cxai_logger('测验处理完成，存在无答案题目或用户设置不自动提交，自动保存！', 'green')
            setTimeout(() => {
                $saveBtn.click()
                setTimeout(() => {
                    cxai_logger('保存成功，准备切换下一个任务。', 'green')
                    cxai_mlist.splice(0, 1)
                    _domList.splice(0, 1)
                    setTimeout(() => { cxai_switchMission() }, 3000)
                }, 3000)
            }, 5000)
        }
        return
    }
    // 获取当前题目所属的window对象 (可能是iframe)
    let contextWindow = TimuList[index] ? (TimuList[index].ownerDocument.defaultView || unsafeWindow) : unsafeWindow;
    let questionFull = $(TimuList[index]).find('.Py-m1-title').html()
    let _question = cxai_tidyQuestion(questionFull).replace(/.*?\[.*?题\]\s*\n\s*/, '').trim()
    let _questionImages = cxaiExtractImages(questionFull)
    if (_questionImages.length > 0) { cxai_logger('检测到题目包含 ' + _questionImages.length + ' 张图片', 'blue') }
    let typeName = questionFull.match(/.*?[\[(](.*?)[\])]|$/)[1];
    let _type = ({
        单选题: 0, 单项选择题: 0, 单选: 0, 选择题: 0,
        多选题: 1, 多项选择题: 1, 多选: 1,
        填空题: 2, 填空: 2,
        判断题: 3, 是非题: 3, 判断: 3,
        简答题: 4, 简答: 4, 问答题: 4, 名词解释: 4, 论述题: 4, 论述: 4,
        计算题: 4, 计算: 4, 分录题: 4, 资料题: 4, 作图题: 4, 其他: 4, 其它: 4, 阅读理解: 4, 阅读: 4, 阅读题: 4, 理解题: 4, 完形填空: 4, 完形: 4, 综合题: 4,
        写作题: 5,
        翻译题: 6
    })[typeName]
    let _a = []
    let _answerTmpArr
    var check_answer_flag = 0;

    // 如果题型不在预设类型中，根据DOM结构自动识别题型
    if (_type === undefined) {
        cxai_logger('未知题型: ' + typeName + '，尝试自动识别', 'blue');

        // 检查选项列表特征
        let singleChoiceList = $(TimuList[index]).find('.answerList.singleChoice li');
        let multiChoiceList = $(TimuList[index]).find('.answerList.multiChoice li');

        if (singleChoiceList && singleChoiceList.length > 0) {
            _type = 0; // 单选题
            cxai_logger('自动识别为单选题', 'green');
        } else if (multiChoiceList && multiChoiceList.length > 0) {
            _type = 1; // 多选题
            cxai_logger('自动识别为多选题', 'green');
        } else {
            // 检查是否为填空题
            let tkList = $(TimuList[index]).find('.blankList2 input');
            if (tkList && tkList.length > 0) {
                _type = 2; // 填空题
                cxai_logger('自动识别为填空题', 'green');
            } else {
                // 判断题等其他情况
                let panduanList = $(TimuList[index]).find('.answerList.panduan li');
                if (panduanList && panduanList.length > 0) {
                    _type = 3; // 判断题
                    cxai_logger('自动识别为判断题', 'green');
                } else {
                    // 检查是否为简答题或材料题
                    let textareaList = $(TimuList[index]).find('textarea');
                    let editorList = $(TimuList[index]).find('.edui-editor');

                    if ((textareaList && textareaList.length > 0) || (editorList && editorList.length > 0)) {
                        _type = 4; // 简答题
                        cxai_logger('自动识别为简答题或材料题', 'green');
                    }
                }
            }
        }
    }

    cxai_currentQuestionMeta = { index: index, total: TimuList.length, typeName: typeName, questionText: _question }
    switch (_type) {
        case 0: {
            //遍历选项列表
            _answerTmpArr = $(TimuList[index]).find('.answerList.singleChoice li')
            let mergedAnswers = [];
            _answerTmpArr.each(function () {
                var answerText = $(this).text().replace(/^[A-Z]\s*/, '').trim();
                mergedAnswers.push(answerText);
            });
            mergedAnswers = mergedAnswers.join("|");

            _question = cxai_buildPrompt({ type: '单选题', question: _question, options: mergedAnswers.split('|') })
            //判断题目是否已作答
            var _redoLogged = false;
            for (let i = 0; i < _answerTmpArr.length; i++) {
                if ($(_answerTmpArr[i]).attr('aria-label')) {
                    if (!cxai_isRedoMode()) {
                        cxai_logger(index + 1 + '此题已作答，准备切换下一题', 'green')
                        check_answer_flag = 1;
                        setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, 30)
                    } else {
                        if (!_redoLogged) { cxai_logger(index + 1 + '此题已作答，重做模式下重新作答', 'blue'); _redoLogged = true; }
                        // 重做模式：先取消已选选项
                        if (localStorage.getItem('cxaiSetting.goodStudent') !== 'true') {
                            $(_answerTmpArr[i]).click()
                        }
                    }
                    break
                }
            }
            if (check_answer_flag == 0) {
                cxai_getAnswer(_type, _question).then((agrs) => {
                    agrs = String(agrs);
                    _answerTmpArr = $(TimuList[index]).find('.answerList.singleChoice li')
                    $.each(_answerTmpArr, (i, t) => {
                        _a.push(cxai_tidyStr($(t).html()).replace(/^[A-Ga-g][.、]?\s*\n?\s*/, '').trim())
                    })
                    let _i = cxaiMatchByLetter(agrs, _a.length);
                    if (_i === -1) { _i = _a.findIndex(function(item) { return item === agrs; }); }
                    if (_i === -1) { _i = cxai_findBestFuzzyMatch(_a, agrs, undefined, true); }
                    if (_i === -1) { _i = cxaiFindAnswerIndex(_a, agrs); }
                    if (_i == -1) {
                        cxai_logger('AI未能完美匹配正确答案，请尝试更换更高级模型或手动选择，跳过此题', 'red')
                        // cxaiCfg.sub = 0
                        setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                    } else {
                        if (localStorage.getItem('cxaiSetting.goodStudent') === 'true') {
                            $(_answerTmpArr[_i]).find('span').css('font-weight', 'bold');
                        } else {
                            $(_answerTmpArr[_i]).click()
                        }
                        cxai_logger('自动答题成功，准备切换下一题', 'green')
                        setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                    }
                }).catch(() => {
                    setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, cxaiCfg.time)
                })
            }
        }
            break
        case 1: {
            //遍历选项列表
            _answerTmpArr = $(TimuList[index]).find('.answerList.multiChoice li')
            let mergedAnswers = [];
            _answerTmpArr.each(function () {
                var answerText = $(this).text().replace(/^[A-Z]\s*/, '').trim();
                mergedAnswers.push(answerText);
            });
            mergedAnswers = mergedAnswers.join("|");
            _question = cxai_buildPrompt({ type: '多选题', question: _question, options: mergedAnswers.split('|'), answer_format: "用'|'分割多个答案" })
            //判断题目是否已作答
            var _redoLogged = false;
            for (let i = 0; i < _answerTmpArr.length; i++) {
                if ($(_answerTmpArr[i]).attr('aria-label')) {
                    if (!cxai_isRedoMode()) {
                        cxai_logger(index + 1 + '此题已作答，准备切换下一题', 'green')
                        check_answer_flag = 1;
                        setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, 30)
                        break
                    } else {
                        if (!_redoLogged) { cxai_logger(index + 1 + '此题已作答，重做模式下重新作答', 'blue'); _redoLogged = true; }
                        // 重做模式：先取消已选选项
                        if (localStorage.getItem('cxaiSetting.goodStudent') !== 'true') {
                            $(_answerTmpArr[i]).click()
                        }
                        // 不break，继续取消其他已选选项
                    }
                }
            }
            if (check_answer_flag == 0) {
                cxai_getAnswer(_type, _question).then((agrs) => {
                    agrs = String(agrs);
                    if (agrs == '暂无答案') {
                        cxai_logger('AI未能完美匹配正确答案，请尝试更换更高级模型或手动选择，跳过此题', 'red')
                        // cxaiCfg.sub = 0
                        setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                    } else {
                        _answerTmpArr = $(TimuList[index]).find('.answerList.multiChoice li')
                        let _multiOptions = []
                        $.each(_answerTmpArr, (i, t) => {
                            _multiOptions.push(cxai_tidyStr($(t).html()).replace(/^[A-Ga-g][.、]?\s*\n?\s*/, '').trim())
                        })
                        let _matchedIndices = cxaiMatchMultipleByLetter(agrs, _multiOptions.length);
                        if (_matchedIndices.length === 0) {
                            $.each(_multiOptions, function(i, t) {
                                if (agrs.indexOf(_multiOptions[i]) !== -1) _matchedIndices.push(i);
                            });
                        }
                        if (_matchedIndices.length === 0) {
                            _matchedIndices = cxaiFindMultipleIndices(_multiOptions, agrs);
                        }
                        if (localStorage.getItem('cxaiSetting.goodStudent') === 'true') {
                            for (let fi = 0; fi < _matchedIndices.length; fi++) {
                                $(_answerTmpArr[_matchedIndices[fi]]).find('span').css('font-weight', 'bold');
                            }
                        } else {
                            cxaiClickOptions(_answerTmpArr, _matchedIndices,
                                function(idx) { $(_answerTmpArr[idx]).click(); },
                                function(idx) { return ($(_answerTmpArr[idx]).attr('class') || '').indexOf('cur') !== -1; }
                            );
                        }
                        // 最终检查（等待点击+补选全部完成）
                        var _totalWait = 300 + _answerTmpArr.length * 600 + _matchedIndices.length * 600 + 500 + (_matchedIndices.length) * 500 + 600;
                        setTimeout(() => {
                            if (_matchedIndices.length === 0) {
                                cxai_logger('AI未能匹配任何选项，请手动选择', 'red')
                            } else {
                                var allSelected = true;
                                for (var ci = 0; ci < _matchedIndices.length; ci++) {
                                    if (($(_answerTmpArr[_matchedIndices[ci]]).attr('class') || '').indexOf('cur') === -1) {
                                        allSelected = false;
                                    }
                                }
                                if (allSelected) {
                                    cxai_logger('自动答题成功，准备切换下一题', 'green')
                                } else {
                                    cxai_logger('部分选项未能选中，请手动确认', 'orange')
                                }
                            }
                            setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                        }, _totalWait)
                    }
                }).catch(() => {
                    setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, cxaiCfg.time)
                })
            }
        }
            break
        case 2: {
            // 填空题处理 - 使用全局editors数组 (ExtJS)
            let tkList = $(TimuList[index]).find('.blankList2 input')
            // 使用属性选择器匹配包含editorIndex的元素
            let tkEditorBlocks = $(TimuList[index]).find('[data-editorindex]')

            // 检查是否使用UEditor编辑器（手机页面）
            if (tkEditorBlocks && tkEditorBlocks.length > 0) {
                let firstTextarea = $(TimuList[index]).find('textarea[name^="answer"]')
                if (firstTextarea.length > 0 && $(firstTextarea[0]).val() && $(firstTextarea[0]).val().trim() !== '' && !cxai_isRedoMode()) {
                    cxai_logger("此题已作答,跳过", "green");
                    setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, 30);
                    break
                }

                _question = cxai_buildPrompt({ type: '填空题', question: _question, answer_format: "多个填空用'|'分隔" })
                cxai_getAnswer(_type, _question).then((agrs) => {
                    agrs = String(agrs);
                    if (agrs == '暂无答案') {
                        cxai_logger('AI未能完美匹配正确答案，请尝试更换更高级模型或手动选择，跳过此题', 'red')
                        setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                        return
                    }
                    let answers = agrs.split('|')
                    let editorBlocks = $(TimuList[index]).find('[data-editorindex]')

                    $.each(editorBlocks, (i, block) => {
                        let editorIndex = $(block).attr('data-editorindex')
                        let itemId = $(block).attr('data-itemid')
                        let answerContent = answers[i] || answers[0] || agrs

                        setTimeout(() => {
                            try {
                                let ueditor = null

                                // 1. 尝试通过 contextWindow.editors 获取
                                if (contextWindow.editors && contextWindow.editors[editorIndex]) {
                                    ueditor = contextWindow.editors[editorIndex].ueditor
                                }

                                // 2. 尝试通过 contextWindow.UE.instants 获取
                                if (!ueditor && contextWindow.UE && contextWindow.UE.instants) {
                                    let instantKey = 'ueditorInstant' + editorIndex
                                    ueditor = contextWindow.UE.instants[instantKey]
                                }

                                // 3. 尝试通过标准ID获取 (ananas-editor-answer + itemId)
                                if (!ueditor && itemId && contextWindow.UE && contextWindow.UE.getEditor) {
                                    ueditor = contextWindow.UE.getEditor('ananas-editor-answer' + itemId)
                                }

                                if (ueditor) {
                                    ueditor.setContent(answerContent)
                                    cxai_logger(`填空题第${i + 1}空已填入 (Index: ${editorIndex})`, 'green')
                                } else {
                                    cxai_logger(`填空题第${i + 1}空未找到编辑器实例 (Index: ${editorIndex}, ItemId: ${itemId})`, 'yellow')
                                }

                                // 始终尝试更新隐藏的textarea作为兜底
                                if (itemId) {
                                    let textarea = $('#answer' + itemId)
                                    if (textarea.length > 0) {
                                        textarea.val(answerContent)
                                        try {
                                            if (textarea[0].value === answerContent) {
                                                textarea[0].dispatchEvent(new Event('change'))
                                                textarea[0].dispatchEvent(new Event('input'))
                                            }
                                        } catch (e) { /* empty */ }
                                    }
                                }
                            } catch (e) {
                                cxai_logger('填空题填入详情失败：' + e.message, 'red')
                            }
                        }, 500 * (i + 1))
                    })

                    setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, cxaiCfg.time + 300 * editorBlocks.length)
                }).catch(() => {
                    setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, cxaiCfg.time)
                })
            } else if (tkList && tkList.length > 0) {
                // 普通input模式（旧版页面）
                if ($(tkList[0]).val() && $(tkList[0]).val().trim() !== '' && !cxai_isRedoMode()) {
                    cxai_logger("此题已作答,跳过", "green");
                    setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, 30);
                    break
                }
                cxai_getAnswer(_type, _question).then((agrs) => {
                    agrs = String(agrs);
                    if (agrs == '暂无答案') {
                        cxai_logger('AI未能完美匹配正确答案，请尝试更换更高级模型或手动选择，跳过此题', 'red')
                        setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                        return
                    }
                    let answers = agrs.split('|')
                    let inputList = $(TimuList[index]).find('.blankList2 input')
                    $.each(inputList, (i, t) => {
                        setTimeout(() => {
                            $(t).val(answers[i] || answers[0] || agrs)
                            // 触发input事件以确保框架能够检测到值的变化
                            $(t).trigger('input').trigger('change')
                        }, 200)
                    })
                    setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                }).catch(() => {
                    setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, cxaiCfg.time)
                })
            } else {
                cxai_logger('未找到填空题输入区域，跳过此题', 'red')
                setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, cxaiCfg.time)
            }
            break
        }
        case 3: {
            _answerTmpArr = $(TimuList[index]).find('.answerList.panduan li')
            $.each(_answerTmpArr, (i, t) => {
                _a.push($(t).text().trim())
            })
            //判断题目是否已作答
            var _redoLogged = false;
            for (let i = 0; i < _answerTmpArr.length; i++) {
                if ($(_answerTmpArr[i]).attr('aria-label')) {
                    if (!cxai_isRedoMode()) {
                        cxai_logger(index + 1 + '此题已作答，准备切换下一题', 'green')
                        check_answer_flag = 1;
                        setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, 30)
                    } else {
                        if (!_redoLogged) { cxai_logger(index + 1 + '此题已作答，重做模式下重新作答', 'blue'); _redoLogged = true; }
                        // 重做模式：先取消已选选项
                        if (localStorage.getItem('cxaiSetting.goodStudent') !== 'true') {
                            $(_answerTmpArr[i]).click()
                        }
                    }
                    break
                }
            }
            if (check_answer_flag == 0) {
                _question = cxai_buildPrompt({ type: '判断题', question: _question, answer_format: "只回答正确或错误" })
                cxai_getAnswer(_type, _question).then((agrs) => {
                    agrs = String(agrs);
                    let judgeResult = cxai_parseJudgeAnswer(agrs)
                    if (judgeResult === null) {
                        cxai_logger('答案匹配出错，准备切换下一题', 'red')
                        setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                        return
                    }
                    let _i = cxai_findJudgeOptionIndex(_a, judgeResult === 'true')
                    if (_i === -1) {
                        cxai_logger('未匹配到正确选项，跳过', 'red')
                        setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                        return
                    }
                    setTimeout(() => {
                        if (localStorage.getItem('cxaiSetting.goodStudent') === 'true') {
                            $(_answerTmpArr[_i]).find('span').css('font-weight', 'bold');
                        } else {
                            $(_answerTmpArr[_i]).click()
                        }
                        cxai_logger('自动答题成功，准备切换下一题', 'green')
                        setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                    }, 300)
                }).catch(() => {
                    setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, cxaiCfg.time)
                })
            }
            break
        }
        case 4: { // 简答题或材料题
            _question = cxai_buildPrompt({ type: '简答题或材料题', question: _question })

            // 查找可能的编辑器区域（通过data-editorindex）
            let jdEditorBlocks = $(TimuList[index]).find('[data-editorindex]')
            let jdTextareas = $(TimuList[index]).find('textarea[name^="answer"]')

            // 检查是否已作答
            let jdIsAnswered = false

            // 优先处理UEditor编辑器（手机页面）
            if (jdEditorBlocks && jdEditorBlocks.length > 0) {
                if (jdTextareas.length > 0 && $(jdTextareas[0]).val() && $(jdTextareas[0]).val().trim() !== '' && !cxai_isRedoMode()) {
                    cxai_logger(index + 1 + '简答题已作答，准备切换下一题', 'green')
                    setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, 30)
                    break
                }

                cxai_getAnswer(_type, _question).then((agrs) => {
                    agrs = String(agrs);
                    if (agrs == '暂无答案') {
                        cxai_logger('AI无法匹配答案，请手动完成', 'red')
                        setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                        return
                    }

                    // 获取第一个编辑器（简答题通常只有一个）
                    let firstBlock = jdEditorBlocks.first()
                    if (firstBlock.length > 0) {
                        let editorIndex = firstBlock.attr('data-editorindex')
                        let itemId = firstBlock.attr('data-itemid')
                        // 如果container上没有itemid，尝试从子元素或关联的textarea找
                        if (!itemId && jdTextareas.length > 0) {
                            let tid = $(jdTextareas[0]).attr('id')
                            if (tid) itemId = tid.replace('answer', '')
                        }

                        setTimeout(() => {
                            try {
                                let ueditor = null

                                // 1. 尝试通过 contextWindow.editors 获取
                                if (contextWindow.editors && contextWindow.editors[editorIndex]) {
                                    ueditor = contextWindow.editors[editorIndex].ueditor
                                }

                                // 2. 尝试通过 contextWindow.UE.instants 获取
                                if (!ueditor && contextWindow.UE && contextWindow.UE.instants) {
                                    let instantKey = 'ueditorInstant' + editorIndex
                                    ueditor = contextWindow.UE.instants[instantKey]
                                }

                                // 3. 尝试通过标准ID获取 (ananas-editor-answer + itemId)
                                if (!ueditor && itemId && contextWindow.UE && contextWindow.UE.getEditor) {
                                    ueditor = contextWindow.UE.getEditor('ananas-editor-answer' + itemId)
                                }

                                if (ueditor) {
                                    ueditor.setContent(agrs)
                                    cxai_logger(`简答题已填入 (Index: ${editorIndex})`, 'green')
                                } else {
                                    cxai_logger(`简答题未找到编辑器实例 (Index: ${editorIndex}, ItemId: ${itemId})`, 'yellow')
                                }

                                // 兜底：更新隐藏textarea
                                if (jdTextareas.length > 0) {
                                    let ta = $(jdTextareas[0])
                                    ta.val(agrs)
                                    // 触发change/input事件
                                    try {
                                        ta[0].dispatchEvent(new Event('change'))
                                        ta[0].dispatchEvent(new Event('input'))
                                    } catch (e) { /* empty */ }
                                }
                            } catch (e) {
                                cxai_logger('简答题填入失败：' + e.message, 'red')
                                // 尝试直接设置textarea
                                if (jdTextareas.length > 0) {
                                    $(jdTextareas[0]).val(agrs)
                                    cxai_logger('简答题通过textarea填入答案', 'blue')
                                }
                            }
                        }, 500)
                    } else {
                        // Fallback direct textarea
                        if (jdTextareas.length > 0) {
                            $(jdTextareas[0]).val(agrs)
                            cxai_logger('简答题通过textarea填入答案', 'blue')
                        }
                    }

                    setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                }).catch(() => {
                    setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, cxaiCfg.time)
                })
            }
            // 如果没有编辑器，但有textarea，直接使用textarea
            else if (jdTextareas && jdTextareas.length > 0) {
                // 检查是否已作答
                if ($(jdTextareas[0]).val() && $(jdTextareas[0]).val().trim() !== '' && !cxai_isRedoMode()) {
                    cxai_logger(index + 1 + '简答题已作答，准备切换下一题', 'green')
                    jdIsAnswered = true
                    setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, 30)
                } else {
                    cxai_getAnswer(_type, _question).then((agrs) => {
                        agrs = String(agrs);
                        if (agrs == '暂无答案') {
                            cxai_logger('AI无法匹配答案，请手动完成', 'red')
                        } else {
                            $(jdTextareas[0]).val(agrs)
                            $(jdTextareas[0]).trigger('input').trigger('change')
                            cxai_logger('简答题自动答题成功，准备切换下一题', 'green')
                        }
                        setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                    }).catch(() => {
                        setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, cxaiCfg.time)
                    })
                }
            }
            // 如果以上方法都失败
            else {
                cxai_logger('无法找到简答题输入区域，请手动完成', 'red')
                setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, cxaiCfg.time)
            }
            break
        }
        case 5: {
            cxai_getAnswer(_type, _question).then((agrs) => {
                // cxaiCfg.sub = 0
                cxai_logger('此类型题目无法区分单/多选，请手动选择答案', 'red')
                setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
            }).catch(() => {
                setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, cxaiCfg.time)
            })
            break
        }
        default:
            cxai_logger('暂不支持处理此类型题目：' + questionFull.match(/.*?\[(.*?)]|$/)[1] + '，跳过！请手动作答。', 'red')
            // cxaiCfg.sub = 0
            setTimeout(() => { cxai_startDoPhoneTimu(index + 1, TimuList) }, cxaiCfg.time)
            break
    }
}


function cxai_pollForElement(iframeDom, selector, interval, maxAttempts) {
    interval = interval || 2000;
    maxAttempts = (typeof maxAttempts === 'number' && maxAttempts > 0) ? maxAttempts : 60; // 默认 60 次 ≈ 2 分钟
    return new Promise(function (resolve) {
        var attempts = 0;
        var check = function () {
            try {
                var doc = $(iframeDom).contents()[0];
                if (doc) {
                    var el = doc.querySelector(selector);
                    if (el) return resolve(el);
                }
            } catch (e) { /* iframe未就绪或跨域 */ }
            attempts++;
            if (attempts >= maxAttempts) {
                cxai_logger('框架等待超时（' + Math.round(attempts * interval / 1000) + 's），上层将重试或跳过', 'red');
                return resolve(null);
            }
            if (attempts % 15 === 0) {
                cxai_logger('框架仍在加载中，已等待' + (attempts * interval / 1000) + '秒...请耐心等待', 'orange');
            }
            setTimeout(check, interval);
        };
        check();
    });
}


function cxai_setupAntiSleep() {
    if (_cxaiAntiSleepStarted) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    function tryStart() {
        if (_cxaiAntiSleepStarted) return;
        try {
            var ac = new AC();
            var osc = ac.createOscillator();
            var gain = ac.createGain();
            gain.gain.value = 0; // 完全静音
            osc.connect(gain);
            gain.connect(ac.destination);
            osc.start();
            _cxaiAntiSleepStarted = true;
            // visibilitychange 后某些浏览器会 suspend AudioContext，主动恢复
            document.addEventListener('visibilitychange', function () {
                try { if (ac.state === 'suspended') ac.resume(); } catch (_) { /* empty */ }
            });
        } catch (_) { /* ignore */ }
    }
    tryStart();
    if (!_cxaiAntiSleepStarted) {
        var onUserGesture = function () {
            tryStart();
            if (_cxaiAntiSleepStarted) {
                document.removeEventListener('click', onUserGesture, true);
                document.removeEventListener('keydown', onUserGesture, true);
                document.removeEventListener('touchstart', onUserGesture, true);
            }
        };
        document.addEventListener('click', onUserGesture, true);
        document.addEventListener('keydown', onUserGesture, true);
        document.addEventListener('touchstart', onUserGesture, true);
    }
}


function cxai_setupAutoRefresh() {
    var stored = localStorage.getItem('cxaiSetting.autoRefresh');
    var enabled = stored !== null ? (stored === 'true') : false;
    if (!enabled) return;
    var minutes = parseInt(localStorage.getItem('cxaiSetting.autoRefreshMinutes'), 10);
    if (!isFinite(minutes) || minutes < 5) minutes = 30;
    setTimeout(function () {
        cxai_logger('已达到自动刷新时间（' + minutes + '分钟），3 秒后刷新页面...', 'orange');
        setTimeout(function () { try { window.location.reload(); } catch (_) { /* empty */ } }, 3000);
    }, minutes * 60 * 1000);
}


function cxai_startDoPhoneCyWork(index, doms, phoneWeb) {
    if (index == doms.length) {
        cxai_logger('此页面全部测验已处理完毕！准备进行下一项任务')
        setTimeout(cxai_missonStart, 5000)
        return
    }
    cxai_logger('等待测验框架加载...', 'purple')
    cxai_pollForElement(doms[index], 'iframe').then(element => {
        let workIframe = element
        if (!workIframe) {
            setTimeout(() => { cxai_startDoPhoneCyWork(index, doms, phoneWeb) }, 5000)
            return
        }
        let workStatus = $(workIframe).contents().find('.newTestCon .newTestTitle .testTit_status').text().trim()
        if (!workStatus) {
            _domList.splice(0, 1)
            setTimeout(cxai_missonStart, 2000)
            return
        }
        if (cxai_isRedoMode() && workStatus.indexOf("已完成") != -1) {
            cxai_logger('测验：' + (index + 1) + ',重做模式下重新处理已完成测验', 'blue')
            $(workIframe).attr('src', phoneWeb)
            cxai_getElement($(doms[index]).contents()[0], 'iframe[src="' + phoneWeb + '"]').then((element) => {
                setTimeout(() => { cxai_doPhoneWork($(element).contents()) }, 3000)
            })
        } else if (workStatus.indexOf("待做") != -1 || workStatus.indexOf("待完成") != -1 || workStatus.indexOf("重做") != -1 || workStatus.indexOf("未达到") != -1) {
            var isRedoStatus = workStatus.indexOf("重做") != -1 || workStatus.indexOf("未达到") != -1
            cxai_logger('测验：' + (index + 1) + (isRedoStatus ? ',未达到及格线,准备重做...' : ',准备处理此测验...'), 'purple')
            $(workIframe).attr('src', phoneWeb)
            cxai_getElement($(doms[index]).contents()[0], 'iframe[src="' + phoneWeb + '"]').then((element) => {
                setTimeout(() => { cxai_doPhoneWork($(element).contents()) }, 3000)
            })
        } else if (workStatus.indexOf('待批阅') != -1) {
            cxai_mlist.splice(0, 1)
            _domList.splice(0, 1)
            cxai_logger('测验：' + (index + 1) + ',测验待批阅,跳过', 'red')
            setTimeout(() => { cxai_startDoPhoneCyWork(index + 1, doms, phoneWeb) }, 5000)
        } else {
            cxai_mlist.splice(0, 1)
            _domList.splice(0, 1)
            cxai_logger('测验：' + (index + 1) + ',未知状态[' + workStatus + '],跳过', 'red')
            setTimeout(() => { cxai_startDoPhoneCyWork(index + 1, doms, phoneWeb) }, 5000)
        }
    })
}


function cxai_startDoCyWork(index, doms) {
    if (index == doms.length) {
        cxai_logger('此页面全部测验已处理完毕！准备进行下一项任务')
        setTimeout(cxai_missonStart, 5000)
        return
    }
    cxai_logger('等待测验框架加载...', 'purple')
    cxai_pollForElement(doms[index], 'iframe').then(element => {
        let workIframe = element
        if (!workIframe) {
            setTimeout(() => { cxai_startDoCyWork(index, doms) }, 5000)
            return
        }
        let workStatus = $(workIframe).contents().find(".newTestCon .newTestTitle .testTit_status").text().trim()
        if (!workStatus) {
            _domList.splice(0, 1)
            setTimeout(cxai_missonStart, 2000)
            return
        }
        if (cxai_isRedoMode() && workStatus.indexOf("已完成") != -1) {
            cxai_logger('测验：' + (index + 1) + ',重做模式下重新处理已完成测验', 'blue')
            setTimeout(() => { cxai_doWork(index, doms, workIframe) }, 5000)
        } else if (workStatus.indexOf("待做") != -1 || workStatus.indexOf("待完成") != -1 || workStatus.indexOf("重做") != -1 || workStatus.indexOf("未达到") != -1) {
            var isRedoStatus = workStatus.indexOf("重做") != -1 || workStatus.indexOf("未达到") != -1
            cxai_logger('测验：' + (index + 1) + (isRedoStatus ? ',未达到及格线,准备重做...' : ',准备处理此测验...'), 'purple')
            setTimeout(() => { cxai_doWork(index, doms, workIframe) }, 5000)
        } else if (workStatus.indexOf('待批阅') != -1) {
            cxai_mlist.splice(0, 1)
            _domList.splice(0, 1)
            cxai_logger('测验：' + (index + 1) + ',测验待批阅,跳过', 'red')
            setTimeout(() => { cxai_startDoCyWork(index + 1, doms) }, 5000)
        } else {
            cxai_mlist.splice(0, 1)
            _domList.splice(0, 1)
            cxai_logger('测验：' + (index + 1) + ',未知状态[' + workStatus + '],跳过', 'red')
            setTimeout(() => { cxai_startDoCyWork(index + 1, doms) }, 5000)
        }
    })
}


function cxai_getElement(parent, selector, timeout = 0) {
    /**
     * Author   cxxjackie
     * From     https://bbs.tampermonkey.net.cn
     */
    return new Promise(resolve => {
        var result = parent.querySelector(selector);
        if (result) return resolve(result);
        var timer;
        const mutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver;
        if (mutationObserver) {
            const observer = new mutationObserver(mutations => {
                for (var mutation of mutations) {
                    for (var addedNode of mutation.addedNodes) {
                        if (addedNode instanceof Element) {
                            result = addedNode.matches(selector) ? addedNode : addedNode.querySelector(selector);
                            if (result) {
                                observer.disconnect();
                                timer && clearTimeout(timer);
                                return resolve(result);
                            }
                        }
                    }
                }
            });
            observer.observe(parent, {
                childList: true,
                subtree: true
            });
            if (timeout > 0) {
                timer = setTimeout(() => {
                    observer.disconnect();
                    return resolve(null);
                }, timeout);
            }
        } else {
            const listener = e => {
                if (e.target instanceof Element) {
                    result = e.target.matches(selector) ? e.target : e.target.querySelector(selector);
                    if (result) {
                        parent.removeEventListener('DOMNodeInserted', listener, true);
                        timer && clearTimeout(timer);
                        return resolve(result);
                    }
                }
            };
            parent.addEventListener('DOMNodeInserted', listener, true);
            if (timeout > 0) {
                timer = setTimeout(() => {
                    parent.removeEventListener('DOMNodeInserted', listener, true);
                    return resolve(null);
                }, timeout);
            }
        }
    });
}


function cxai_missonHomeWork() {
    cxai_logger('开始处理作业', 'green')
    let $_homeworktable = $('.mark_table').find('form')
    let TimuList = $_homeworktable.find('.questionLi')
    cxai_doHomeWork(0, TimuList)
}


function cxai_doHomeWork(index, TiMuList) {
    if (index == TiMuList.length) {
        cxai_logger('作业题目已全部完成', 'green')
        return
    }


    // Helper function for handling normal textareas
    function handleNormalTextarea(textareaList, jdt, index, TiMuList) {
        if (!textareaList || textareaList.length === 0) {
            setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time);
            return;
        }
        cxai_getAnswer(4, jdt).then((agrs) => {
            $.each(textareaList, (i, t) => {
                let _id = $(t).attr('id') || $(t).attr('name');
                setTimeout(() => {
                    try { UE.getEditor(_id).setContent(agrs) } catch (e) { /* ignore */ }
                }, 300 + i * 200);
            });
            cxai_logger('自动答题成功，准备切换下一题', 'green');
            setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time + 200 * textareaList.length);
        }).catch(() => {
            setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time);
        });
    }

    let typeName = $(TiMuList[index]).attr('typename');
    let _type = ({
        单选题: 0, 单项选择题: 0, 单选: 0,
        多选题: 1, 多项选择题: 1, 多选: 1,
        填空题: 2, 填空: 2,
        判断题: 3, 是非题: 3, 判断: 3,
        简答题: 4, 简答: 4, 问答题: 4, 名词解释: 4, 论述题: 4, 论述: 4,
        计算题: 4, 计算: 4, 分录题: 4, 资料题: 4, 作图题: 4, 其他: 4, 其它: 4, 阅读理解: 4, 阅读: 4, 阅读题: 4, 理解题: 4, 完形填空: 4, 完形: 4, 综合题: 4,
        写作题: 5,
        翻译题: 6
    })[typeName]
    cxai_currentQuestionMeta = { index: index, total: TiMuList.length, typeName: typeName }
    let _questionFull = $(TiMuList[index]).find('.mark_name').html()
    let _question = cxai_tidyQuestion(_questionFull).replace(/^[(].*?[)]/, '').trim()
    cxai_currentQuestionMeta.questionText = _question
    let _a = []
    let _answerTmpArr, _textareaList
    var check_answer_flag = 0;

    // 如果题型不在预设类型中，根据DOM结构自动识别题型
    if (_type === undefined) {
        cxai_logger('未知题型: ' + typeName + '，尝试自动识别', 'blue');

        // 检查是否有选择题特征
        _answerTmpArr = $(TiMuList[index]).find('.stem_answer').find('.answer_p')
        if (_answerTmpArr && _answerTmpArr.length > 0) {
            _type = 0; // 假定为单选题

            // 检查是否有多个可选项
            let multiChoiceCheck = $(TiMuList[index]).find('.stem_answer input[type="checkbox"]');
            if (multiChoiceCheck && multiChoiceCheck.length > 0) {
                _type = 1; // 多选题
                cxai_logger('自动识别为多选题', 'green');
            } else {
                cxai_logger('自动识别为单选题', 'green');
            }
        }
        // 检查是否有文本输入框特征
        else {
            _textareaList = $(TiMuList[index]).find('.stem_answer').find('.subEditor textarea, .Answer .divText textarea, .Answer .divText .textDIV textarea, textarea[name^="answerEditor"], .edui-editor textarea');
            if (_textareaList && _textareaList.length > 0) {
                _type = 4; // 简答题
                cxai_logger('自动识别为简答题', 'green');
            }
        }
    }

    switch (_type) {
        case 0: {
            _answerTmpArr = $(TiMuList[index]).find('.stem_answer').find('.answer_p')

            //遍历选项列表
            let mergedAnswers = [];
            _answerTmpArr.each(function () {
                var answerText = $(this).text().replace(/^[A-Z]\s*/, '').trim();
                mergedAnswers.push(answerText);
            });
            mergedAnswers = mergedAnswers.join("|");
            _question = cxai_buildPrompt({ type: '单选题', question: _question, options: mergedAnswers.split('|') })
            //判断题目是否已作答
            var _redoLogged = false;
            for (let i = 0; i < _answerTmpArr.length; i++) {
                if (($(_answerTmpArr[i]).parent().find('span').attr('class') || '').indexOf('check_answer') == -1) {
                    //没有被选择
                } else {
                    if (!cxai_isRedoMode()) {
                        cxai_logger(index + 1 + '此题已作答，准备切换下一题', 'green')
                        check_answer_flag = 1;
                        setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, 30)
                    } else {
                        if (!_redoLogged) { cxai_logger(index + 1 + '此题已作答，重做模式下重新作答', 'blue'); _redoLogged = true; }
                        if (localStorage.getItem('cxaiSetting.goodStudent') !== 'true') {
                            $(_answerTmpArr[i]).parent().click()
                        }
                    }
                    break
                }
            }
            if (check_answer_flag == 0) {
                // 先构建选项数组，供后续使用
                $.each(_answerTmpArr, (i, t) => {
                    _a.push(cxai_tidyStr($(t).html()))
                })
                cxai_getAnswer(_type, _question).then((agrs) => {
                    agrs = String(agrs)
                    if (localStorage.getItem('cxaiSetting.alterTitle') === 'true') {
                        let timuele = $(TiMuList[index]).find('.mark_name')
                        timuele.html(timuele.html() + '<p style="color:green;">📖 ' + cxaiGetDisplayAnswer(agrs, _a) + '</p>')
                    }
                    let _i = cxaiMatchByLetter(agrs, _a.length);
                    if (_i === -1) { _i = _a.findIndex(function(item) { return item === agrs; }); }
                    if (_i === -1) { _i = cxai_findBestFuzzyMatch(_a, agrs, undefined, true); }
                    if (_i === -1) { _i = cxaiFindAnswerIndex(_a, agrs); }
                    if (_i == -1) {
                        cxai_logger('AI未能完美匹配正确答案，请尝试更换更高级模型或手动选择，跳过此题', 'red')
                        setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                    } else {
                        setTimeout(() => {
                            let check = $(_answerTmpArr[_i]).parent().find('span').attr('class') || ''
                            if (check.indexOf('check_answer') == -1) {
                                if (localStorage.getItem('cxaiSetting.goodStudent') === 'true') {
                                    $(_answerTmpArr[_i]).parent().find('span').css('font-weight', 'bold');
                                } else {
                                    $(_answerTmpArr[_i]).parent().click()
                                }
                            }
                            cxai_logger('自动答题成功，准备切换下一题', 'green')
                            setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                        }, 300)
                    }
                }).catch(() => {
                    setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time)
                })
            }
        }
            break

        case 1: {
            _answerTmpArr = $(TiMuList[index]).find('.stem_answer').find('.answer_p')
            //遍历选项列表
            let mergedAnswers = [];
            _answerTmpArr.each(function () {
                var answerText = $(this).text().replace(/^[A-Z]\s*/, '').trim();
                mergedAnswers.push(answerText);
            });
            mergedAnswers = mergedAnswers.join("|");
            _question = cxai_buildPrompt({ type: '多选题', question: _question, options: mergedAnswers.split('|'), answer_format: "用'|'分割多个答案" })
            //判断题目是否已作答
            for (let i = 0; i < _answerTmpArr.length; i++) {
                if (($(_answerTmpArr[i]).parent().find('span').attr('class') || '').indexOf('check_answer') == -1) {
                    //没有被选择
                } else {
                    if (!cxai_isRedoMode()) {
                        cxai_logger(index + 1 + '此题已作答，准备切换下一题', 'green')
                        check_answer_flag = 1;
                        setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, 30)
                        break
                    } else {
                        cxai_logger(index + 1 + '此题已作答，重做模式下取消旧答案', 'blue')
                        if (localStorage.getItem('cxaiSetting.goodStudent') !== 'true') {
                            $(_answerTmpArr[i]).parent().click()
                        }
                        // 不break，继续取消其他已选选项
                    }
                }
            }
            if (check_answer_flag == 0) {
                $.each(_answerTmpArr, (i, t) => {
                    _a.push(cxai_tidyStr($(t).html()))
                })
                cxai_getAnswer(_type, _question).then((agrs) => {
                    agrs = String(agrs)
                    if (localStorage.getItem('cxaiSetting.alterTitle') === 'true') {
                        let timuele = $(TiMuList[index]).find('.mark_name')
                        timuele.html(timuele.html() + '<p style="color:green;">📖 ' + cxaiGetDisplayAnswer(agrs, _a) + '</p>')
                    }
                    let _matchedIndices = cxaiMatchMultipleByLetter(agrs, _a.length);
                    if (_matchedIndices.length === 0) {
                        $.each(_a, function(i, t) {
                            if (agrs.indexOf(_a[i]) !== -1) _matchedIndices.push(i);
                        });
                    }
                    if (_matchedIndices.length === 0) {
                        _matchedIndices = cxaiFindMultipleIndices(_a, agrs);
                    }
                    if (localStorage.getItem('cxaiSetting.goodStudent') === 'true') {
                        for (let fi = 0; fi < _matchedIndices.length; fi++) {
                            $(_answerTmpArr[_matchedIndices[fi]]).parent().find('span').css('font-weight', 'bold');
                        }
                    } else {
                        cxaiClickOptions(_answerTmpArr, _matchedIndices,
                            function(idx) { $(_answerTmpArr[idx]).parent().click(); },
                            function(idx) { return ($(_answerTmpArr[idx]).parent().find('span').attr('class') || '').indexOf('check_answer_dx') !== -1; }
                        );
                    }
                    if (_matchedIndices.length === 0) {
                        cxai_logger('AI未能匹配任何选项，请手动选择', 'red')
                    } else {
                        cxai_logger('自动答题成功，准备切换下一题', 'green')
                    }
                    setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time + _answerTmpArr.length * 600 + _matchedIndices.length * 600)
                }).catch(() => {
                    setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time)
                })
            }
        }
            break
        case 2: {
            _question = cxai_buildPrompt({ type: '填空题', question: _question, answer_format: "用'|'分割多个答案" });
            _textareaList = cxai_findAnswerTextareas($(TiMuList[index]));
            if (!_textareaList || _textareaList.length === 0) {
                cxai_logger('未找到填空题输入区域，跳过此题', 'red');
                setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time);
                break
            }
            // 判断题目是否已作答（用 try/catch 防止 UE.getEditor 抛错；id 为空则回退 name）
            let _id = $(_textareaList[0]).attr('id') || $(_textareaList[0]).attr('name');
            let firstAnswered = false;
            try {
                if (_id && UE.getEditor(_id) && UE.getEditor(_id).getContent && UE.getEditor(_id).getContent() !== '') firstAnswered = true;
            } catch (e) { firstAnswered = false; }
            if (firstAnswered && !cxai_isRedoMode()) {
                cxai_logger(index + 1 + '此题已作答，准备切换下一题', 'green');
                setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, 30);
            } else {
                cxai_getAnswer(_type, _question).then((agrs) => {
                    let _answerTmpArr = (agrs || '').split('|');
                    $.each(_textareaList, (i, t) => {
                        let _currentId = $(t).attr('id') || $(t).attr('name');
                        let val = _answerTmpArr[i] !== undefined ? _answerTmpArr[i] : (_answerTmpArr[0] || agrs);
                        setTimeout(() => {
                            try { UE.getEditor(_currentId).setContent(val) } catch (e) { /* ignore */ }
                        }, 300 + i * 200);
                    });
                    setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time + 200 * _textareaList.length);
                    cxai_logger('自动答题成功，准备切换下一题', 'green');
                }).catch(() => {
                    setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time);
                });
            }
            break
        }
        case 3: {
            _answerTmpArr = $(TiMuList[index]).find('.stem_answer').find('.answer_p')
            $.each(_answerTmpArr, (i, t) => {
                _a.push($(t).text().trim())
            })
            //判断题目是否已作答
            var _redoLogged = false;
            for (let i = 0; i < _answerTmpArr.length; i++) {
                if (($(_answerTmpArr[i]).parent().find('span').attr('class') || '').indexOf('check_answer') == -1) {
                    //没有被选择
                } else {
                    if (!cxai_isRedoMode()) {
                        cxai_logger(index + 1 + '此题已作答，准备切换下一题', 'green')
                        check_answer_flag = 1;
                        setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, 30)
                    } else {
                        if (!_redoLogged) { cxai_logger(index + 1 + '此题已作答，重做模式下重新作答', 'blue'); _redoLogged = true; }
                        if (localStorage.getItem('cxaiSetting.goodStudent') !== 'true') {
                            $(_answerTmpArr[i]).parent().click()
                        }
                    }
                    break
                }
            }
            if (check_answer_flag == 0) {
                _question = cxai_buildPrompt({ type: '判断题', question: _question, answer_format: "只回答正确或错误" })
                cxai_getAnswer(_type, _question).then((agrs) => {
                    agrs = String(agrs)
                    if (localStorage.getItem('cxaiSetting.alterTitle') === 'true') {
                        let timuele = $(TiMuList[index]).find('.mark_name')
                        timuele.html(timuele.html() + '<p style="color:green;">📖 ' + cxaiGetDisplayAnswer(agrs, _a) + '</p>')
                    }
                    let judgeResult = cxai_parseJudgeAnswer(agrs)
                    if (judgeResult === null) {
                        cxai_logger('答案匹配出错，准备切换下一题', 'red')
                        setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                        return
                    }
                    let _i = cxai_findJudgeOptionIndex(_a, judgeResult === 'true')
                    if (_i === -1) {
                        cxai_logger('未匹配到正确选项，跳过', 'red')
                        setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                        return
                    }
                    setTimeout(() => {
                        let check = $(_answerTmpArr[_i]).parent().find('span').attr('class') || ''
                        if (check.indexOf('check_answer') == -1) {
                            if (localStorage.getItem('cxaiSetting.goodStudent') === 'true') {
                                $(_answerTmpArr[_i]).parent().find('span').css('font-weight', 'bold');
                            } else {
                                $(_answerTmpArr[_i]).parent().click()
                            }
                        }
                        cxai_logger('自动答题成功，准备切换下一题', 'green')
                        setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                    }, 300)
                }).catch(() => {
                    setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time)
                })
            }
            break
        }
        case 4: {
            let _answerEle = cxai_findAnswerTextareas($(TiMuList[index]))
            if (!_answerEle || _answerEle.length === 0) {
                cxai_logger((index + 1) + ' 未找到文本作答区域，跳过此题', 'red')
                setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time)
                break
            }
            let _isAnswered4 = false
            $.each(_answerEle, function (i, t) {
                let _eid = $(t).attr('id') || $(t).attr('name')
                try { if (_eid && UE.getEditor(_eid) && UE.getEditor(_eid).getContent && UE.getEditor(_eid).getContent() !== '') _isAnswered4 = true } catch (e) { /* ignore */ }
            })
            if (_isAnswered4 && !cxai_isRedoMode()) {
                cxai_logger((index + 1) + ' 此题已作答，准备切换下一题', 'green')
                setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, 30)
                break
            }
            let jdt = cxai_buildPrompt({ type: typeName || '简答题', question: _question, answer_format: "用50字简要回答" })
            cxai_getAnswer(_type, jdt).then((agrs) => {
                agrs = String(agrs)
                if (localStorage.getItem('cxaiSetting.alterTitle') === 'true') {
                    let timuele = $(TiMuList[index]).find('.mark_name')
                    timuele.html(timuele.html() + '<p style="color:green;">📖 ' + cxaiGetDisplayAnswer(agrs, _a) + '</p>')
                }
                $.each(_answerEle, (i, t) => {
                    let _id = $(t).attr('id') || $(t).attr('name')
                    setTimeout(() => {
                        try { UE.getEditor(_id).setContent(agrs) } catch (e) { /* ignore */ }
                    }, 300 + i * 200);
                });
                cxai_logger('自动答题成功，准备切换下一题', 'green')
                setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time + 200 * _answerEle.length);
            }).catch((err) => {
                setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time)
            });
        }
            break
        case 5: {
            let _answerEle5 = cxai_findAnswerTextareas($(TiMuList[index]))
            if (!_answerEle5 || _answerEle5.length === 0) {
                cxai_logger((index + 1) + ' 未找到写作题文本框，跳过此题', 'red')
                setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time)
                break
            }
            // 已作答检测
            let _isAnswered5 = false
            $.each(_answerEle5, function (i, t) {
                let _eid = $(t).attr('id') || $(t).attr('name')
                try { if (_eid && UE.getEditor(_eid) && UE.getEditor(_eid).getContent && UE.getEditor(_eid).getContent() !== '') _isAnswered5 = true } catch (e) { /* ignore */ }
            })
            if (_isAnswered5 && !cxai_isRedoMode()) {
                cxai_logger((index + 1) + ' 此题已作答，准备切换下一题', 'green')
                setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, 30)
                break
            }
            let jdt5 = cxai_buildPrompt({ type: typeName || '写作题', question: _question, answer_format: "用英文根据题目进行写作" })
            cxai_getAnswer(_type, jdt5).then((agrs) => {
                agrs = String(agrs)
                if (localStorage.getItem('cxaiSetting.alterTitle') === 'true') {
                    let timuele = $(TiMuList[index]).find('.mark_name')
                    timuele.html(timuele.html() + '<p style="color:green;">📖 ' + cxaiGetDisplayAnswer(agrs, _a) + '</p>')
                }
                $.each(_answerEle5, (i, t) => {
                    let _id = $(t).attr('id') || $(t).attr('name')
                    setTimeout(() => {
                        try { UE.getEditor(_id).setContent(agrs) } catch (e) { /* ignore */ }
                    }, 300 + i * 200);
                });
                cxai_logger('自动答题成功，准备切换下一题', 'green')
                setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time + 200 * _answerEle5.length);
            }).catch((err) => {
                setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time)
            });
        }
            break
        case 6: {
            let _answerEle6 = cxai_findAnswerTextareas($(TiMuList[index]))
            if (!_answerEle6 || _answerEle6.length === 0) {
                cxai_logger((index + 1) + ' 未找到翻译题文本框，跳过此题', 'red')
                setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time)
                break
            }
            // 已作答检测
            let _isAnswered6 = false
            $.each(_answerEle6, function (i, t) {
                let _eid = $(t).attr('id') || $(t).attr('name')
                try { if (_eid && UE.getEditor(_eid) && UE.getEditor(_eid).getContent && UE.getEditor(_eid).getContent() !== '') _isAnswered6 = true } catch (e) { /* ignore */ }
            })
            if (_isAnswered6 && !cxai_isRedoMode()) {
                cxai_logger((index + 1) + ' 此题已作答，准备切换下一题', 'green')
                setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, 30)
                break
            }
            let jdt6 = cxai_buildPrompt({ type: typeName || '翻译题', question: _question, answer_format: "中文英文互译" })
            cxai_getAnswer(_type, jdt6).then((agrs) => {
                agrs = String(agrs)
                if (localStorage.getItem('cxaiSetting.alterTitle') === 'true') {
                    let timuele = $(TiMuList[index]).find('.mark_name')
                    timuele.html(timuele.html() + '<p style="color:green;">📖 ' + cxaiGetDisplayAnswer(agrs, _a) + '</p>')
                }
                $.each(_answerEle6, (i, t) => {
                    let _id = $(t).attr('id') || $(t).attr('name')
                    setTimeout(() => {
                        try { UE.getEditor(_id).setContent(agrs) } catch (e) { /* ignore */ }
                    }, 300 + i * 200);
                });
                cxai_logger('自动答题成功，准备切换下一题', 'green')
                setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time + 200 * _answerEle6.length);
            }).catch((err) => {
                setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time)
            });
        }
            break
        default: {
            if (_type === undefined) {
                cxai_logger('无法识别题型：' + typeName + '，跳过此题', 'red')
                setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time)
            } else {
                // 尝试获取文本输入区域
                _textareaList = $(TiMuList[index]).find('.stem_answer').find('textarea, .subEditor textarea, .divText textarea, .eidtDiv textarea, .divText .edui-editor, textarea[name^="answerEditor"]');
                if (_textareaList && _textareaList.length > 0) {
                    cxai_logger('检测到文本输入区域，尝试回答', 'green');
                    let jdt = cxai_buildPrompt({ type: typeName || '未知题型', question: _question, answer_format: "请根据题目作答" })

                    // 检查是否有富文本编辑器特有的textarea
                    let editorTextareas = $(TiMuList[index]).find('.stem_answer textarea[name^="answerEditor"]');
                    if (editorTextareas && editorTextareas.length > 0) {
                        // 使用富文本编辑器ID
                        let editorId = $(editorTextareas[0]).attr('id');
                        if (editorId) {
                            cxai_getAnswer(_type || 4, jdt).then((agrs) => {
                                setTimeout(() => { UE.getEditor(editorId).setContent(agrs) }, 300);
                                cxai_logger('使用富文本编辑器ID回答成功，准备切换下一题', 'green');
                                setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time));
                            }).catch(() => {
                                setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time);
                            });
                        } else {
                            cxai_logger('找到富文本编辑器但无法获取ID，改用普通方法', 'yellow');
                            // 如果没有ID，退回到常规处理
                            handleNormalTextarea(_textareaList, jdt, index, TiMuList);
                        }
                    } else {
                        // 处理普通文本输入区域
                        handleNormalTextarea(_textareaList, jdt, index, TiMuList);
                    }


                } else {
                    cxai_logger('无法处理此题型：' + typeName + '，跳过此题', 'red');
                    setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time);
                }
            }
        }
    }
}


var _cxaiAntiSleepStarted = false;


// ═══════════════════════════════════════════════════════════════════════════════
//  § 9. 考试答题
//  单题考试、整卷预览、考试跳转
// ═══════════════════════════════════════════════════════════════════════════════

function cxai_missonExam() {
    let $_examtable = $('.mark_table').find('.whiteDiv')
    let _questionFull = cxai_tidyStr($_examtable.find('h3.mark_name').html().trim())
    let typeName = _questionFull.match(/[(](.*?),.*?分[)]|$/)[1];
    let _qType = ({
        单选题: 0, 单项选择题: 0, 单选: 0,
        多选题: 1, 多项选择题: 1, 多选: 1,
        填空题: 2, 填空: 2,
        判断题: 3, 是非题: 3, 判断: 3,
        简答题: 4, 简答: 4, 问答题: 4, 名词解释: 4, 论述题: 4, 论述: 4,
        计算题: 4, 计算: 4, 分录题: 4, 资料题: 4, 作图题: 4, 其他: 4, 其它: 4, 阅读理解: 4, 阅读: 4, 阅读题: 4, 理解题: 4, 完形填空: 4, 完形: 4, 综合题: 4,
        写作题: 5,
        翻译题: 6
    })[typeName]
    // 尝试从导航栏获取当前题号
    let _examCurIdx = null
    try {
        let $curLi = $('.mark_table .mark_li_list li.active, .mark_table .mark_li_list li.current')
        if ($curLi.length) _examCurIdx = parseInt($curLi.text().trim()) - 1
    } catch (_) { /* empty */ }
    cxai_currentQuestionMeta = { index: isFinite(_examCurIdx) ? _examCurIdx : null, total: null, typeName: typeName }
    let _question = cxai_tidyQuestion(_questionFull.replace(/[(].*?分[)]/, '').replace(/^\s*/, ''))
    cxai_currentQuestionMeta.questionText = _question
    let $_ansdom = $_examtable.find('#submitTest').find('.stem_answer')
    let _answerTmpArr;
    let _a = []

    function handleStandardExamTextarea(standardTextareas, _question) {
        cxai_logger('检测到标准文本输入区域，尝试回答', 'green');
        let jdt = cxai_buildPrompt({ type: typeName || '未知题型', question: _question, answer_format: "请根据题目作答" })
        cxai_getAnswer(4, jdt).then((agrs) => {
            $.each(standardTextareas, (i, t) => {
                let _id = $(t).attr('id')
                setTimeout(() => { UE.getEditor(_id).setContent(agrs) }, 300)
            })
            cxai_logger('自动答题成功，准备切换下一题', 'green')
            cxai_toNextExam()
        }).catch(() => {
            cxai_toNextExam()
        })
    }

    // 如果题型不在预设类型中，根据DOM结构自动识别题型
    if (_qType === undefined) {
        cxai_logger('未知题型: ' + typeName + '，尝试自动识别', 'blue');

        // 检查是否有选择题特征
        _answerTmpArr = $_ansdom.find('.clearfix.answerBg .fl.answer_p');
        if (_answerTmpArr && _answerTmpArr.length > 0) {
            _qType = 0; // 假定为单选题

            // 检查是否有多个可选项
            let multiChoiceCheck = $_ansdom.find('.clearfix.answerBg input[type="checkbox"]');
            if (multiChoiceCheck && multiChoiceCheck.length > 0) {
                _qType = 1; // 多选题
                cxai_logger('自动识别为多选题', 'green');
            } else {
                cxai_logger('自动识别为单选题', 'green');
            }
        }
        // 检查是否有文本输入框特征
        else {
            let _textareaList = $_ansdom.find('.Answer .divText .subEditor textarea, .Answer .divText .edui-editor, .Answer .divText textarea, textarea[name^="answerEditor"]');
            if (_textareaList && _textareaList.length > 0) {
                _qType = 4; // 简答题
                cxai_logger('自动识别为简答题', 'green');
            }
        }
    }

    switch (_qType) {
        case 0: {
            _answerTmpArr = $_ansdom.find('.clearfix.answerBg .fl.answer_p')
            // 已作答前置检查：兼容 check_answer 与 check_answer_dx（indexOf('check_answer') 都能命中）
            let _answeredIdxE0 = -1
            for (let _ai = 0; _ai < _answerTmpArr.length; _ai++) {
                let _cls = $(_answerTmpArr[_ai]).parent().find('span').attr('class') || ''
                if (_cls.indexOf('check_answer') !== -1) { _answeredIdxE0 = _ai; break }
            }
            if (_answeredIdxE0 !== -1 && !cxai_isRedoMode()) {
                cxai_logger('此题已作答，准备切换下一题', 'green')
                cxai_toNextExam()
                break
            }
            if (_answeredIdxE0 !== -1 && cxai_isRedoMode()) {
                cxai_logger('此题已作答，重做模式下重新作答', 'blue')
                if (localStorage.getItem('cxaiSetting.goodStudent') !== 'true') {
                    $(_answerTmpArr[_answeredIdxE0]).parent().click()
                }
            }
            //遍历选项列表
            let mergedAnswers = [];
            _answerTmpArr.each(function () {
                var answerText = $(this).text().replace(/^[A-Z]\s*/, '').trim();
                mergedAnswers.push(answerText);
            });
            mergedAnswers = mergedAnswers.join("|");
            _question = cxai_buildPrompt({ type: '单选题', question: _question, options: mergedAnswers.split('|') })
            $.each(_answerTmpArr, (i, t) => {
                _a.push(cxai_tidyStr($(t).html()))
            })
            cxai_getAnswer(_qType, _question).then((agrs) => {
                agrs = String(agrs)
                if (localStorage.getItem('cxaiSetting.alterTitle') === 'true') {
                    let timuele = $_examtable.find('h3.mark_name')
                    timuele.html(timuele.html() + '<p style="color:green;">📖 ' + cxaiGetDisplayAnswer(agrs, _a) + '</p>')
                }

                let _i = cxaiMatchByLetter(agrs, _a.length);
                if (_i === -1) { _i = _a.findIndex(function(item) { return item === agrs; }); }
                if (_i === -1) { _i = cxai_findBestFuzzyMatch(_a, agrs, undefined, true); }
                if (_i === -1) { _i = cxaiFindAnswerIndex(_a, agrs); }
                if (_i == -1) {
                    cxai_logger('AI未能完美匹配正确答案，请尝试更换更高级模型或手动选择，跳过此题', 'red')
                    setTimeout(cxai_toNextExam, 5000)
                } else {
                    setTimeout(() => {
                        if (($(_answerTmpArr[_i]).parent().find('span').attr('class') || '').indexOf('check_answer') == -1) {
                            //好学生模式,ABCD加粗
                            if (localStorage.getItem('cxaiSetting.goodStudent') === 'true') {
                                $(_answerTmpArr[_i]).parent().find('span').css('font-weight', 'bold');
                            } else {
                                setTimeout(() => { $(_answerTmpArr[_i]).parent().click() }, 300)
                            }
                            cxai_logger('自动答题成功，准备切换下一题', 'green')
                            cxai_toNextExam()
                        } else {
                            cxai_logger('此题已作答，准备切换下一题', 'green')
                            cxai_toNextExam()
                        }
                    }, 300)
                }
            }).catch(() => {
                cxai_toNextExam()
            })
        }
            break
        case 1: {
            _answerTmpArr = $_ansdom.find('.clearfix.answerBg .fl.answer_p')
            // 已作答前置检查（多选用 check_answer_dx）
            let _alreadyAnsweredE1 = $_ansdom.find('.clearfix.answerBg span.check_answer_dx, .clearfix.answerBg span.check_answer').length > 0
            if (_alreadyAnsweredE1 && !cxai_isRedoMode()) {
                cxai_logger('此题已作答，准备切换下一题', 'green')
                cxai_toNextExam()
                break
            }
            if (_alreadyAnsweredE1 && cxai_isRedoMode()) {
                cxai_logger('此题已作答，重做模式下重新作答', 'blue')
                if (localStorage.getItem('cxaiSetting.goodStudent') !== 'true') {
                    $.each(_answerTmpArr, function (_i2, _t2) {
                        var _cls2 = $(_t2).parent().find('span').attr('class') || ''
                        if (_cls2.indexOf('check_answer') !== -1) {
                            $(_t2).parent().click()
                        }
                    })
                }
            }
            //遍历选项列表
            let mergedAnswers = [];
            _answerTmpArr.each(function () {
                var answerText = $(this).text().replace(/^[A-Z]\s*/, '').trim();
                mergedAnswers.push(answerText);
            });
            mergedAnswers = mergedAnswers.join("|");
            _question = cxai_buildPrompt({ type: '多选题', question: _question, options: mergedAnswers.split('|'), answer_format: "用'|'分割多个答案" })
            $.each(_answerTmpArr, (i, t) => {
                _a.push(cxai_tidyStr($(t).html()))
            })
            cxai_getAnswer(_qType, _question).then((agrs) => {
                agrs = String(agrs)
                if (localStorage.getItem('cxaiSetting.alterTitle') === 'true') {
                    let timuele = $_examtable.find('h3.mark_name')
                    timuele.html(timuele.html() + '<p style="color:green;">📖 ' + cxaiGetDisplayAnswer(agrs, _a) + '</p>')
                }

                {
                    let _matchedIndices = cxaiMatchMultipleByLetter(agrs, _a.length);
                    if (_matchedIndices.length === 0) {
                        $.each(_a, function(i, t) {
                            if (agrs.indexOf(_a[i]) !== -1) _matchedIndices.push(i);
                        });
                    }
                    if (_matchedIndices.length === 0) {
                        _matchedIndices = cxaiFindMultipleIndices(_a, agrs);
                    }
                    if (localStorage.getItem('cxaiSetting.goodStudent') === 'true') {
                        for (let fi = 0; fi < _matchedIndices.length; fi++) {
                            $(_answerTmpArr[_matchedIndices[fi]]).parent().find('span').css('font-weight', 'bold');
                        }
                    } else {
                        cxaiClickOptions(_answerTmpArr, _matchedIndices,
                            function(idx) { $(_answerTmpArr[idx]).parent().click(); },
                            function(idx) { return ($(_answerTmpArr[idx]).parent().find('span').attr('class') || '').indexOf('check_answer_dx') !== -1; }
                        );
                    }
                    if (_matchedIndices.length === 0) {
                        cxai_logger('AI未能匹配任何选项，请手动选择', 'red')
                    } else {
                        cxai_logger('自动答题成功，准备切换下一题', 'green')
                    }
                    cxai_toNextExam()
                }
            }).catch(() => {
                cxai_toNextExam()
            })
        }
            break
        case 2: {
            let _textareaList = $_ansdom.find('.Answer .divText .subEditor textarea')
            // 已作答前置检查：任一 textarea 已有内容即视为已作答
            let _alreadyAnsweredE2 = false
            $.each(_textareaList, function (_i2, _t2) {
                let _eid = $(_t2).attr('id')
                try {
                    if (_eid && typeof UE !== 'undefined' && UE.getEditor(_eid) && UE.getEditor(_eid).getContent && UE.getEditor(_eid).getContent() !== '') {
                        _alreadyAnsweredE2 = true
                    }
                } catch (_e) { /* ignore */ }
            })
            if (_alreadyAnsweredE2 && !cxai_isRedoMode()) {
                cxai_logger('此题已作答，准备切换下一题', 'green')
                cxai_toNextExam()
                break
            }
            if (_alreadyAnsweredE2 && cxai_isRedoMode()) {
                cxai_logger('此题已作答，重做模式下重新作答', 'blue')
                $.each(_textareaList, function (_i2, _t2) {
                    let _eid = $(_t2).attr('id')
                    try { if (_eid && UE.getEditor(_eid)) UE.getEditor(_eid).setContent('') } catch (_e) { /* ignore */ }
                })
            }
            _question = cxai_buildPrompt({ type: '填空题', question: _question, answer_format: "用'|'分割多个答案" });
            // cxai_logger(_textareaList)
            cxai_getAnswer(_qType, _question).then((agrs) => {
                let _answerTmpArr = agrs.split('|')
                $.each(_textareaList, (i, t) => {
                    let _id = $(t).attr('id')
                    setTimeout(() => { UE.getEditor(_id).setContent(_answerTmpArr[i]) }, 300)
                })
                cxai_logger('自动答题成功，准备切换下一题', 'green')
                cxai_toNextExam()
            }).catch(() => {
                cxai_toNextExam()
            })
            break
        }
        case 3: {
            _answerTmpArr = $_ansdom.find('.clearfix.answerBg .fl.answer_p')
            // 已作答前置检查
            let _answeredIdxE3 = -1
            for (let _ai = 0; _ai < _answerTmpArr.length; _ai++) {
                let _cls = $(_answerTmpArr[_ai]).parent().find('span').attr('class') || ''
                if (_cls.indexOf('check_answer') !== -1) { _answeredIdxE3 = _ai; break }
            }
            if (_answeredIdxE3 !== -1 && !cxai_isRedoMode()) {
                cxai_logger('此题已作答，准备切换下一题', 'green')
                cxai_toNextExam()
                break
            }
            if (_answeredIdxE3 !== -1 && cxai_isRedoMode()) {
                cxai_logger('此题已作答，重做模式下重新作答', 'blue')
                if (localStorage.getItem('cxaiSetting.goodStudent') !== 'true') {
                    $(_answerTmpArr[_answeredIdxE3]).parent().click()
                }
            }
            _question = cxai_buildPrompt({ type: '判断题', question: _question, answer_format: "只回答正确或错误" });
            $.each(_answerTmpArr, (i, t) => {
                _a.push($(t).text().trim())
            })
            cxai_getAnswer(_qType, _question).then((agrs) => {
                agrs = String(agrs)
                if (localStorage.getItem('cxaiSetting.alterTitle') === 'true') {
                    let timuele = $_examtable.find('h3.mark_name')
                    timuele.html(timuele.html() + '<p style="color:green;">📖 ' + cxaiGetDisplayAnswer(agrs, _a) + '</p>')
                }

                let judgeResult = cxai_parseJudgeAnswer(agrs)
                if (judgeResult === null) {
                    cxai_logger('答案匹配出错，准备切换下一题', 'red')
                    cxai_toNextExam()
                    return
                }
                let _i = cxai_findJudgeOptionIndex(_a, judgeResult === 'true')
                if (_i === -1) {
                    cxai_logger('未匹配到正确选项，跳过', 'red')
                    cxai_toNextExam()
                    return
                }
                if (($(_answerTmpArr[_i]).parent().find('span').attr('class') || '').indexOf('check_answer') == -1) {
                    //好学生模式,ABCD加粗
                    if (localStorage.getItem('cxaiSetting.goodStudent') === 'true') {
                        setTimeout(() => { $(_answerTmpArr[_i]).parent().find('span').css('font-weight', 'bold'); }, 300)
                    } else {
                        $(_answerTmpArr[_i]).parent().click()
                    }
                    cxai_logger('自动答题成功，准备切换下一题', 'green')
                    cxai_toNextExam()
                } else {
                    cxai_logger('此题已作答，准备切换下一题', 'green')
                    cxai_toNextExam()
                }
            }).catch(() => {
                cxai_toNextExam()
            })
            break
        }
        case 4: {
            let _answerEle = cxai_findAnswerTextareas($_ansdom)
            if (!_answerEle || _answerEle.length === 0) { cxai_toNextExam(); break }
            // 已作答检测
            let _isAnsweredE4 = false
            $.each(_answerEle, function (i, t) {
                let _eid = $(t).attr('id') || $(t).attr('name')
                try { if (_eid && UE.getEditor(_eid) && UE.getEditor(_eid).getContent && UE.getEditor(_eid).getContent() !== '') _isAnsweredE4 = true } catch (e) { /* ignore */ }
            })
            if (_isAnsweredE4 && !cxai_isRedoMode()) {
                cxai_logger('此题已作答，准备切换下一题', 'green')
                cxai_toNextExam()
                break
            }
            let jdt = cxai_buildPrompt({ type: typeName || '简答题', question: _question, answer_format: "用50字简要回答" })
            cxai_getAnswer(_qType, jdt).then((agrs) => {
                agrs = String(agrs)
                if (localStorage.getItem('cxaiSetting.alterTitle') === 'true') {
                    let timuele = $_examtable.find('h3.mark_name')
                    timuele.html(timuele.html() + '<p style="color:green;">📖 ' + cxaiGetDisplayAnswer(agrs, _a) + '</p>')
                }
                $.each(_answerEle, (i, t) => {
                    let _id = $(t).attr('id') || $(t).attr('name')
                    setTimeout(() => {
                        try { UE.getEditor(_id).setContent(agrs) } catch (e) { /* ignore */ }
                    }, 300 + i * 200);
                });
                setTimeout(cxai_toNextExam, 300 + 200 * _answerEle.length);
            }).catch(() => { cxai_toNextExam(); });
        }
            break
        case 5: {
            let _answerEle = cxai_findAnswerTextareas($_ansdom)
            if (!_answerEle || _answerEle.length === 0) { cxai_toNextExam(); break }
            // 已作答检测
            let _isAnsweredE5 = false
            $.each(_answerEle, function (i, t) {
                let _eid = $(t).attr('id') || $(t).attr('name')
                try { if (_eid && UE.getEditor(_eid) && UE.getEditor(_eid).getContent && UE.getEditor(_eid).getContent() !== '') _isAnsweredE5 = true } catch (e) { /* ignore */ }
            })
            if (_isAnsweredE5 && !cxai_isRedoMode()) {
                cxai_logger('此题已作答，准备切换下一题', 'green')
                cxai_toNextExam()
                break
            }
            let jdt = cxai_buildPrompt({ type: typeName || '写作题', question: _question, answer_format: "用英文根据题目进行写作" })
            cxai_getAnswer(_qType, jdt).then((agrs) => {
                agrs = String(agrs)
                if (localStorage.getItem('cxaiSetting.alterTitle') === 'true') {
                    let timuele = $_examtable.find('h3.mark_name')
                    timuele.html(timuele.html() + '<p style="color:green;">📖 ' + cxaiGetDisplayAnswer(agrs, _a) + '</p>')
                }
                $.each(_answerEle, (i, t) => {
                    let _id = $(t).attr('id') || $(t).attr('name')
                    setTimeout(() => {
                        try { UE.getEditor(_id).setContent(agrs) } catch (e) { /* ignore */ }
                    }, 300 + i * 200);
                });
                setTimeout(cxai_toNextExam, 300 + 200 * _answerEle.length);
            }).catch(() => { cxai_toNextExam(); });
        }
            break
        case 6: {
            let _answerEle = cxai_findAnswerTextareas($_ansdom)
            if (!_answerEle || _answerEle.length === 0) { cxai_toNextExam(); break }
            // 已作答检测
            let _isAnsweredE6 = false
            $.each(_answerEle, function (i, t) {
                let _eid = $(t).attr('id') || $(t).attr('name')
                try { if (_eid && UE.getEditor(_eid) && UE.getEditor(_eid).getContent && UE.getEditor(_eid).getContent() !== '') _isAnsweredE6 = true } catch (e) { /* ignore */ }
            })
            if (_isAnsweredE6 && !cxai_isRedoMode()) {
                cxai_logger('此题已作答，准备切换下一题', 'green')
                cxai_toNextExam()
                break
            }
            let jdt = cxai_buildPrompt({ type: typeName || '翻译题', question: _question, answer_format: "中文英文互译" })
            cxai_getAnswer(_qType, jdt).then((agrs) => {
                agrs = String(agrs)
                if (localStorage.getItem('cxaiSetting.alterTitle') === 'true') {
                    let timuele = $_examtable.find('h3.mark_name')
                    timuele.html(timuele.html() + '<p style="color:green;">📖 ' + cxaiGetDisplayAnswer(agrs, _a) + '</p>')
                }
                $.each(_answerEle, (i, t) => {
                    let _id = $(t).attr('id') || $(t).attr('name')
                    setTimeout(() => {
                        try { UE.getEditor(_id).setContent(agrs) } catch (e) { /* ignore */ }
                    }, 300 + i * 200);
                });
                setTimeout(cxai_toNextExam, 300 + 200 * _answerEle.length);
            }).catch(() => { cxai_toNextExam(); });
        }
            break
        default: {
            if (_qType === undefined) {
                cxai_logger('无法识别题型：' + typeName + '，跳过此题', 'red')
                cxai_toNextExam()
            } else {
                // 尝试获取文本输入区域
                // 查找所有可能的文本输入区域
                let standardTextareas = $_ansdom.find('.Answer .divText .subEditor textarea');
                let richEditors = $_ansdom.find('.Answer .divText .edui-editor');

                // 首先检查是否有材料题特有的富文本编辑器textarea
                let editorTextareas = $_ansdom.find('textarea[name^="answerEditor"]');

                if (editorTextareas && editorTextareas.length > 0) {
                    cxai_logger('检测到材料题富文本编辑器，尝试回答', 'green');
                    let editorId = $(editorTextareas[0]).attr('id');
                    if (editorId) {
                        let jdt = cxai_buildPrompt({ type: '材料题', question: _question, answer_format: "请根据材料详细回答" })
                        cxai_getAnswer(4, jdt).then((agrs) => {
                            setTimeout(() => { UE.getEditor(editorId).setContent(agrs) }, 300);
                            cxai_logger('材料题自动答题成功，准备切换下一题', 'green');
                            cxai_toNextExam();
                        }).catch(() => {
                            cxai_toNextExam();
                        });
                    } else {
                        cxai_logger('找到材料题编辑器但无法获取ID，尝试其他方法', 'yellow');
                        handleStandardExamTextarea(standardTextareas, _question);
                    }
                }
                // 处理标准文本区域
                else if (standardTextareas && standardTextareas.length > 0) {
                    handleStandardExamTextarea(standardTextareas, _question);
                }
                // 处理其他类型的富文本编辑器
                else if (richEditors && richEditors.length > 0) {
                    cxai_logger('检测到富文本编辑器，尝试查找编辑器ID', 'green');

                    // 尝试在页面中查找所有可能的编辑器ID
                    let editorScripts = $('script:contains("UE.getEditor")');
                    let editorIdMatch = null;

                    if (editorScripts && editorScripts.length > 0) {
                        // 从脚本中提取编辑器ID
                        let scriptContent = editorScripts.text();
                        let matches = scriptContent.match(/UE\.getEditor\(['"](.*?)['"]/);
                        if (matches && matches.length > 1) {
                            editorIdMatch = matches[1];
                            cxai_logger('从脚本中发现编辑器ID: ' + editorIdMatch, 'green');
                        }
                    }

                    if (editorIdMatch) {
                        let jdt = cxai_buildPrompt({ type: '材料题', question: _question, answer_format: "请根据材料详细回答" })
                        cxai_getAnswer(4, jdt).then((agrs) => {
                            setTimeout(() => { UE.getEditor(editorIdMatch).setContent(agrs) }, 300);
                            cxai_logger('使用脚本找到的编辑器ID回答成功，准备切换下一题', 'green');
                            cxai_toNextExam();
                        }).catch(() => {
                            cxai_toNextExam();
                        });
                    } else {
                        cxai_logger('无法找到有效的编辑器ID，跳过此题', 'red');
                        cxai_toNextExam();
                    }
                }
                else {
                    cxai_logger('无法处理此题型：' + typeName + '，跳过此题', 'red');
                    cxai_toNextExam();
                }


            }
        }
    }
}


function cxai_toNextExam() {
    if (localStorage.getItem('cxaiSetting.examTurn') === 'true') {
        let $_examtable = $('.mark_table').find('.whiteDiv')
        let $nextbtn = $_examtable.find('.nextDiv a.jb_btn')
        setTimeout(() => {
            $nextbtn.click()
        }, cxaiCfg.examTurnTime ? 2000 + (Math.floor(Math.random() * 5 + 1) * 1000) : 2000)
    } else {
        cxai_logger('用户设置不自动跳转下一题，请手动点击', 'blue')
    }
}


function cxai_missonExamPreview() {
    cxai_logger('进入整卷预览页面，开始处理考试', 'green')
    let TiMuList = $('.mark_table').find('.questionLi')
    if (!TiMuList || TiMuList.length === 0) {
        cxai_logger('未解析到题目，请确认页面已渲染', 'red')
        return
    }
    cxai_logger('共解析到 ' + TiMuList.length + ' 道题', 'blue')
    cxai_doExamPreview(0, TiMuList)
}


function cxai_getExamPreviewDelay() {
    let base = (cxaiCfg && cxaiCfg.time) ? cxaiCfg.time : 2500
    return base + Math.floor(Math.random() * 1500)
}


function cxai_getExamPreviewType($timu) {
    let typeMap = {
        单选题: 0, 单项选择题: 0, 单选: 0,
        多选题: 1, 多项选择题: 1, 多选: 1,
        填空题: 2, 填空: 2,
        判断题: 3, 是非题: 3, 判断: 3,
        简答题: 4, 简答: 4, 问答题: 4, 名词解释: 4, 论述题: 4, 论述: 4,
        计算题: 4, 计算: 4, 分录题: 4, 资料题: 4, 作图题: 4, 其他: 4, 其它: 4, 阅读理解: 4, 阅读: 4, 阅读题: 4, 理解题: 4, 完形填空: 4, 完形: 4, 综合题: 4,
        写作题: 5,
        翻译题: 6
    }
    let typeName = $timu.attr('typename')
    if (typeName && typeMap[typeName] !== undefined) {
        return { type: typeMap[typeName], typeName: typeName }
    }
    let prefixText = $timu.find('.colorShallow').text() || $timu.find('.mark_name').text() || ''
    let m = prefixText.match(/(单选题|多选题|填空题|判断题|简答题|论述题|写作题|翻译题)/)
    if (m && typeMap[m[1]] !== undefined) {
        return { type: typeMap[m[1]], typeName: m[1] }
    }
    let qid = $timu.attr('data') || $timu.find('.questionId').val() || $timu.find('input.questionId').val()
    if (qid) {
        let typeVal = $('[name="type' + qid + '"]').val()
        if (typeVal !== undefined && typeVal !== null && typeVal !== '') {
            let n = parseInt(typeVal)
            if (!isNaN(n) && n >= 0 && n <= 6) {
                return { type: n, typeName: typeName || ('类型' + n) }
            }
        }
    }
    let $opts = $timu.find('.answerBg .answer_p')
    if ($opts && $opts.length > 0) {
        let hasCheckbox = $timu.find('.answerBg input[type="checkbox"]').length > 0
        return { type: hasCheckbox ? 1 : 0, typeName: typeName || (hasCheckbox ? '多选题' : '单选题') }
    }
    let $textareas = $timu.find('textarea[name^="answerEditor"], .subEditor textarea')
    if ($textareas && $textareas.length > 0) {
        return { type: 4, typeName: typeName || '简答题' }
    }
    return { type: undefined, typeName: typeName || '未知' }
}


function cxai_doExamPreview(index, TiMuList) {
    if (index >= TiMuList.length) {
        cxai_logger('整卷预览答题已完成，请人工核对后手动交卷', 'green')
        return
    }
    let $timu = $(TiMuList[index])
    let typeInfo = cxai_getExamPreviewType($timu)
    let _type = typeInfo.type
    let typeName = typeInfo.typeName
    let _questionFull = $timu.find('.mark_name').html() || ''
    let _question = cxai_tidyQuestion(_questionFull).replace(/^[(].*?[)]/, '').trim()
    let _a = []
    let _answerTmpArr, _textareaList
    let alreadyAnswered = 0
    let prefix = '第' + (index + 1) + '题: '

    function nextSoon() {
        setTimeout(function () { cxai_doExamPreview(index + 1, TiMuList) }, cxai_getExamPreviewDelay())
    }
    function nextFast() {
        setTimeout(function () { cxai_doExamPreview(index + 1, TiMuList) }, 30)
    }

    cxai_currentQuestionMeta = { index: index, total: TiMuList.length, typeName: typeName, questionText: _question }

    if (_type === undefined) {
        cxai_logger(prefix + '无法识别题型(' + typeName + ')，跳过此题', 'red')
        return nextSoon()
    }

    switch (_type) {
        case 0: {
            _answerTmpArr = $timu.find('.answerBg .answer_p')
            if (!_answerTmpArr || _answerTmpArr.length === 0) {
                cxai_logger(prefix + '未找到选项，跳过', 'red')
                return nextSoon()
            }
            let mergedAnswers = []
            _answerTmpArr.each(function () {
                mergedAnswers.push($(this).text().replace(/^[A-Z]\s*/, '').trim())
            })
            let prompt = cxai_buildPrompt({ type: '单选题', question: _question, options: mergedAnswers })
            for (let i = 0; i < _answerTmpArr.length; i++) {
                let cls = $(_answerTmpArr[i]).parent().find('span').attr('class') || ''
                if (cls.indexOf('check_answer') !== -1) {
                    if (!cxai_isRedoMode()) {
                        cxai_logger(prefix + '已作答，跳过', 'green')
                        alreadyAnswered = 1
                    } else {
                        cxai_logger(prefix + '已作答，重做模式下重新作答', 'blue')
                        if (localStorage.getItem('cxaiSetting.goodStudent') !== 'true') {
                            $(_answerTmpArr[i]).parent().click()
                        }
                    }
                    break
                }
            }
            if (alreadyAnswered) return nextFast()
            $.each(_answerTmpArr, function (i, t) { _a.push(cxai_tidyStr($(t).html())) })
            cxai_getAnswer(_type, prompt).then(function (agrs) {
                agrs = String(agrs)
                if (localStorage.getItem('cxaiSetting.alterTitle') === 'true') {
                    let timuele = $timu.find('.mark_name')
                    timuele.html(timuele.html() + '<p style="color:green;">📖 ' + cxaiGetDisplayAnswer(agrs, _a) + '</p>')
                }
                let _i = cxaiMatchByLetter(agrs, _a.length);
                if (_i === -1) { _i = _a.findIndex(function(item) { return item === agrs; }); }
                if (_i === -1) { _i = cxai_findBestFuzzyMatch(_a, agrs, undefined, true); }
                if (_i === -1) { _i = cxaiFindAnswerIndex(_a, agrs); }
                if (_i === -1) {
                    cxai_logger(prefix + 'AI无法完美匹配正确答案，请手动选择', 'red')
                    return nextSoon()
                }
                setTimeout(function () {
                    let cls = $(_answerTmpArr[_i]).parent().find('span').attr('class') || ''
                    if (cls.indexOf('check_answer') === -1) {
                        if (localStorage.getItem('cxaiSetting.goodStudent') === 'true') {
                            $(_answerTmpArr[_i]).parent().find('span').css('font-weight', 'bold')
                        } else {
                            $(_answerTmpArr[_i]).parent().click()
                        }
                    }
                    cxai_logger(prefix + '自动答题成功', 'green')
                    nextSoon()
                }, 300)
            }).catch(function () { nextSoon() })
            return
        }
        case 1: {
            _answerTmpArr = $timu.find('.answerBg .answer_p')
            if (!_answerTmpArr || _answerTmpArr.length === 0) {
                cxai_logger(prefix + '未找到选项，跳过', 'red')
                return nextSoon()
            }
            let mergedAnswers = []
            _answerTmpArr.each(function () {
                mergedAnswers.push($(this).text().replace(/^[A-Z]\s*/, '').trim())
            })
            let prompt = cxai_buildPrompt({ type: '多选题', question: _question, options: mergedAnswers, answer_format: "用'|'分割多个答案" })
            for (let i = 0; i < _answerTmpArr.length; i++) {
                let cls = $(_answerTmpArr[i]).parent().find('span').attr('class') || ''
                if (cls.indexOf('check_answer') !== -1) {
                    if (!cxai_isRedoMode()) {
                        cxai_logger(prefix + '已作答，跳过', 'green')
                        alreadyAnswered = 1
                        break
                    } else {
                        cxai_logger(prefix + '已作答，重做模式下取消旧答案', 'blue')
                        if (localStorage.getItem('cxaiSetting.goodStudent') !== 'true') {
                            $(_answerTmpArr[i]).parent().click()
                        }
                    }
                }
            }
            if (alreadyAnswered) return nextFast()
            $.each(_answerTmpArr, function (i, t) { _a.push(cxai_tidyStr($(t).html())) })
            cxai_getAnswer(_type, prompt).then(function (agrs) {
                agrs = String(agrs)
                if (localStorage.getItem('cxaiSetting.alterTitle') === 'true') {
                    let timuele = $timu.find('.mark_name')
                    timuele.html(timuele.html() + '<p style="color:green;">📖 ' + cxaiGetDisplayAnswer(agrs, _a) + '</p>')
                }
                let _matchedIndices = cxaiMatchMultipleByLetter(agrs, _a.length);
                if (_matchedIndices.length === 0) {
                    $.each(_a, function(i, t) {
                        if (agrs.indexOf(_a[i]) !== -1) _matchedIndices.push(i);
                    });
                }
                if (_matchedIndices.length === 0) {
                    _matchedIndices = cxaiFindMultipleIndices(_a, agrs);
                }
                if (localStorage.getItem('cxaiSetting.goodStudent') === 'true') {
                    for (let fi = 0; fi < _matchedIndices.length; fi++) {
                        $(_answerTmpArr[_matchedIndices[fi]]).parent().find('span').css('font-weight', 'bold')
                    }
                } else {
                    cxaiClickOptions(_answerTmpArr, _matchedIndices,
                        function(idx) { $(_answerTmpArr[idx]).parent().click(); },
                        function(idx) { return ($(_answerTmpArr[idx]).parent().find('span').attr('class') || '').indexOf('check_answer_dx') !== -1; }
                    );
                }
                if (_matchedIndices.length === 0) {
                    cxai_logger(prefix + 'AI未能匹配任何选项，请手动选择', 'red')
                } else {
                    cxai_logger(prefix + '自动答题成功', 'green')
                }
                nextSoon()
            }).catch(function () { nextSoon() })
            return
        }
        case 2: {
            _textareaList = $timu.find('textarea[name^="answerEditor"]')
            if (!_textareaList || _textareaList.length === 0) {
                _textareaList = $timu.find('.subEditor textarea')
            }
            if (!_textareaList || _textareaList.length === 0) {
                cxai_logger(prefix + '未找到填空文本框，跳过', 'red')
                return nextSoon()
            }
            let isAnswered = false
            $.each(_textareaList, function (i, t) {
                let _id = $(t).attr('id') || $(t).attr('name')
                try {
                    if (_id && UE.getEditor(_id) && UE.getEditor(_id).getContent && UE.getEditor(_id).getContent() !== '') {
                        isAnswered = true
                    }
                } catch (e) { /* ignore */ }
            })
            if (isAnswered && !cxai_isRedoMode()) {
                cxai_logger(prefix + '已作答，跳过', 'green')
                return nextFast()
            }
            let prompt = cxai_buildPrompt({ type: '填空题', question: _question, answer_format: "用'|'分割多个答案" })
            cxai_getAnswer(_type, prompt).then(function (agrs) {
                agrs = String(agrs)
                let parts = (agrs || '').split('|')
                $.each(_textareaList, function (i, t) {
                    let _id = $(t).attr('id') || $(t).attr('name')
                    let val = parts[i] !== undefined ? parts[i] : (parts[parts.length - 1] || '')
                    setTimeout(function () {
                        try { UE.getEditor(_id).setContent(val) } catch (e) { /* ignore */ }
                    }, 300 + i * 200)
                })
                cxai_logger(prefix + '自动答题成功', 'green')
                nextSoon()
            }).catch(function () { nextSoon() })
            return
        }
        case 3: {
            _answerTmpArr = $timu.find('.answerBg .answer_p')
            if (!_answerTmpArr || _answerTmpArr.length === 0) {
                cxai_logger(prefix + '未找到判断选项，跳过', 'red')
                return nextSoon()
            }
            $.each(_answerTmpArr, function (i, t) { _a.push($(t).text().trim()) })
            for (let i = 0; i < _answerTmpArr.length; i++) {
                let cls = $(_answerTmpArr[i]).parent().find('span').attr('class') || ''
                if (cls.indexOf('check_answer') !== -1) {
                    if (!cxai_isRedoMode()) {
                        cxai_logger(prefix + '已作答，跳过', 'green')
                        alreadyAnswered = 1
                    } else {
                        cxai_logger(prefix + '已作答，重做模式下重新作答', 'blue')
                        if (localStorage.getItem('cxaiSetting.goodStudent') !== 'true') {
                            $(_answerTmpArr[i]).parent().click()
                        }
                    }
                    break
                }
            }
            if (alreadyAnswered) return nextFast()
            let prompt = cxai_buildPrompt({ type: '判断题', question: _question, answer_format: "只回答正确或错误" })
            cxai_getAnswer(_type, prompt).then(function (agrs) {
                agrs = String(agrs)
                if (localStorage.getItem('cxaiSetting.alterTitle') === 'true') {
                    let timuele = $timu.find('.mark_name')
                    timuele.html(timuele.html() + '<p style="color:green;">📖 ' + cxaiGetDisplayAnswer(agrs, _a) + '</p>')
                }
                let judgeResult = cxai_parseJudgeAnswer(agrs)
                let _i = judgeResult !== null ? cxai_findJudgeOptionIndex(_a, judgeResult === 'true') : -1
                if (_i === -1) {
                    cxai_logger(prefix + '答案匹配出错，跳过', 'red')
                    return nextSoon()
                }
                setTimeout(function () {
                    let cls = $(_answerTmpArr[_i]).parent().find('span').attr('class') || ''
                    if (cls.indexOf('check_answer') === -1) {
                        if (localStorage.getItem('cxaiSetting.goodStudent') === 'true') {
                            $(_answerTmpArr[_i]).parent().find('span').css('font-weight', 'bold')
                        } else {
                            $(_answerTmpArr[_i]).parent().click()
                        }
                    }
                    cxai_logger(prefix + '自动答题成功', 'green')
                    nextSoon()
                }, 300)
            }).catch(function () { nextSoon() })
            return
        }
        case 4: {
            let _answerEle = cxai_findAnswerTextareas($timu)
            if (!_answerEle || _answerEle.length === 0) {
                cxai_logger(prefix + '未找到答题文本框，跳过', 'red')
                return nextSoon()
            }
            let isAnswered = false
            $.each(_answerEle, function (i, t) {
                let _id = $(t).attr('id') || $(t).attr('name')
                try {
                    if (_id && UE.getEditor(_id) && UE.getEditor(_id).getContent && UE.getEditor(_id).getContent() !== '') {
                        isAnswered = true
                    }
                } catch (e) { /* ignore */ }
            })
            if (isAnswered && !cxai_isRedoMode()) {
                cxai_logger(prefix + '已作答，跳过', 'green')
                return nextFast()
            }
            let prompt = cxai_buildPrompt({ type: typeName || '简答题', question: _question, answer_format: "用50字简要回答" })
            cxai_getAnswer(_type, prompt).then(function (agrs) {
                agrs = String(agrs)
                $.each(_answerEle, function (i, t) {
                    let _id = $(t).attr('id') || $(t).attr('name')
                    setTimeout(function () {
                        try { UE.getEditor(_id).setContent(agrs) } catch (e) { /* ignore */ }
                    }, 300 + i * 200)
                })
                cxai_logger(prefix + '自动答题成功', 'green')
                nextSoon()
            }).catch(function () { nextSoon() })
            return
        }
        case 5: {
            let _answerEle = cxai_findAnswerTextareas($timu)
            if (!_answerEle || _answerEle.length === 0) {
                cxai_logger(prefix + '未找到答题文本框，跳过', 'red')
                return nextSoon()
            }
            // 已作答检测
            let isAnswered5 = false
            $.each(_answerEle, function (i, t) {
                let _id = $(t).attr('id') || $(t).attr('name')
                try {
                    if (_id && UE.getEditor(_id) && UE.getEditor(_id).getContent && UE.getEditor(_id).getContent() !== '') {
                        isAnswered5 = true
                    }
                } catch (e) { /* ignore */ }
            })
            if (isAnswered5 && !cxai_isRedoMode()) {
                cxai_logger(prefix + '已作答，跳过', 'green')
                return nextFast()
            }
            let prompt = cxai_buildPrompt({ type: typeName || '写作题', question: _question, answer_format: "用英文根据题目进行写作" })
            cxai_getAnswer(_type, prompt).then(function (agrs) {
                agrs = String(agrs)
                $.each(_answerEle, function (i, t) {
                    let _id = $(t).attr('id') || $(t).attr('name')
                    setTimeout(function () {
                        try { UE.getEditor(_id).setContent(agrs) } catch (e) { /* ignore */ }
                    }, 300 + i * 200)
                })
                cxai_logger(prefix + '自动答题成功', 'green')
                nextSoon()
            }).catch(function () { nextSoon() })
            return
        }
        case 6: {
            let _answerEle = cxai_findAnswerTextareas($timu)
            if (!_answerEle || _answerEle.length === 0) {
                cxai_logger(prefix + '未找到答题文本框，跳过', 'red')
                return nextSoon()
            }
            // 已作答检测
            let isAnswered6 = false
            $.each(_answerEle, function (i, t) {
                let _id = $(t).attr('id') || $(t).attr('name')
                try {
                    if (_id && UE.getEditor(_id) && UE.getEditor(_id).getContent && UE.getEditor(_id).getContent() !== '') {
                        isAnswered6 = true
                    }
                } catch (e) { /* ignore */ }
            })
            if (isAnswered6 && !cxai_isRedoMode()) {
                cxai_logger(prefix + '已作答，跳过', 'green')
                return nextFast()
            }
            let prompt = cxai_buildPrompt({ type: typeName || '翻译题', question: _question, answer_format: "中文英文互译" })
            cxai_getAnswer(_type, prompt).then(function (agrs) {
                agrs = String(agrs)
                $.each(_answerEle, function (i, t) {
                    let _id = $(t).attr('id') || $(t).attr('name')
                    setTimeout(function () {
                        try { UE.getEditor(_id).setContent(agrs) } catch (e) { /* ignore */ }
                    }, 300 + i * 200)
                })
                cxai_logger(prefix + '自动答题成功', 'green')
                nextSoon()
            }).catch(function () { nextSoon() })
            return
        }
        default: {
            cxai_logger(prefix + '无法处理此题型: ' + typeName + '，跳过', 'red')
            nextSoon()
        }
    }
}


// 构造结构化提示词，使 AI 能更精确地理解题目并回答。
// 入参 opts:
//   - type:          题型(如 单选题/多选题/判断题/填空题/简答题/写作题/翻译题)
//   - question:      题干
//   - options:       选项数组(可选)
//   - answer_format: 答案格式说明(可选,如 "用'|'分割多个答案"、"只回答正确或错误")
// 返回 { payload, display }:
//   - payload: 发送给 AI 的 JSON 字符串(更精确,便于 AI 解析)
//   - display: 用于用户日志展示的简洁文本(仅含题干与选项,不含题型/答案格式等元信息)
// ═══════════════════════════════════════════════════════════════════════════════
//  § 11. AI 答题引擎
//  Prompt 构建、题库查询、第三方 API、答案质量判断、cxai_getAnswer 主入口
// ═══════════════════════════════════════════════════════════════════════════════

function cxai_buildPrompt(opts) {
    opts = opts || {}
    let q = opts.question != null ? String(opts.question) : ''
    let payloadObj = {}
    let type = opts.type || ''
    payloadObj.question = q
    if (Array.isArray(opts.options) && opts.options.length > 0) {
        payloadObj.options = opts.options.map(function (s) { return String(s == null ? '' : s).trim() })
    }
    let payload = JSON.stringify(payloadObj, null, 2)
    let display = q
    if (payloadObj.options && payloadObj.options.length) {
        display += '\n' + payloadObj.options.join(' | ')
    }
    return { payload: payload, display: display }
}



function cxaiQueryThirdPartyApi(questionText, options, type) {
    return new Promise(function (resolve) {
        if (localStorage.getItem('cxaiSetting.thirdPartyApi') !== 'true') {
            console.log('[CXAI题库] 第三方题库未启用，跳过');
            return resolve(null);
        }
        var token = localStorage.getItem('cxaiSetting.thirdPartyToken') || '';
        var hasValidToken = token.length === 10;
        var gpt = localStorage.getItem('cxaiSetting.thirdPartyGpt');
        if (gpt === null || gpt === undefined || gpt === '') gpt = -1;
        var baseService = 'https://lyck6.cn/scriptService/api';
        var postData = JSON.stringify({ question: questionText, options: options, type: type, location: location.href });

        // 内部请求函数：发起指定 URL 的请求，遇到"负载过高"时自动用 Token 付费接口重试
        function _request(url, isPaidRetry) {
            var label = isPaidRetry ? '付费' : '免费';
            console.log('[CXAI题库] 请求lyck6.cn(' + label + '):', url, '| 题型:', type, '| Token:', hasValidToken ? token : '(无/无效)');
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: { 'Content-Type': 'application/json;charset=utf-8' },
                data: postData,
                timeout: 15000,
                onload: function (r) {
                    console.log('[CXAI题库] lyck6.cn(' + label + ') HTTP状态:', r.status);
                    var rawText = r.responseText || '';
                    // ★ 限流检测：HTTP 429 或响应体包含"负载过高"，均需用 Token 付费接口重试
                    var isOverloaded = (r.status === 429) || /负载过高/.test(rawText);
                    if (!isPaidRetry && isOverloaded) {
                        if (hasValidToken) {
                            console.log('[CXAI题库] 免费接口限流(' + (r.status === 429 ? 'HTTP 429' : '负载过高') + ')，Token 有效，切换付费接口重试...');
                            var paidUrl = baseService + '/autoAnswer/' + token + '?gpt=' + gpt;
                            return _request(paidUrl, true);
                        } else {
                            console.warn('[CXAI题库] 免费接口限流，但无有效 Token（需10位），跳过');
                            return resolve(null);
                        }
                    }
                    // 付费接口仍被限流
                    if (r.status === 429) {
                        console.warn('[CXAI题库] lyck6.cn(' + label + ') 限流(HTTP 429)');
                        return resolve(null);
                    }
                    try {
                        var res = JSON.parse(rawText);
                        console.log('[CXAI题库] lyck6.cn(' + label + ') 响应:', JSON.stringify(res).slice(0, 500));
                        if (res.code !== 0) {
                            console.warn('[CXAI题库] lyck6.cn(' + label + ') 返回错误码:', res.code, res.message || res.msg || res.error_msg || '');
                            return resolve(null);
                        }
                        // 兼容两种响应结构：res.result.answers 或 res.answer
                        var answers = null;
                        if (res.result && res.result.answers && res.result.answers.length > 0) {
                            answers = res.result.answers;
                        } else if (res.answer && res.answer.allAnswer && res.answer.allAnswer.length > 0) {
                            answers = res.answer.allAnswer;
                        }
                        if (answers) {
                            console.log('[CXAI题库] lyck6.cn(' + label + ') 命中答案:', JSON.stringify(answers).slice(0, 200));
                            return resolve(answers);
                        }
                        console.log('[CXAI题库] lyck6.cn(' + label + ') 无答案');
                    } catch (e) {
                        console.warn('[CXAI题库] lyck6.cn(' + label + ') 响应解析失败:', e.message, rawText.slice(0, 200));
                    }
                    resolve(null);
                },
                onerror: function (e) {
                    console.warn('[CXAI题库] lyck6.cn(' + label + ') 网络错误:', e.error || e.statusText || '未知');
                    resolve(null);
                },
                ontimeout: function () {
                    console.warn('[CXAI题库] lyck6.cn(' + label + ') 请求超时(15s)');
                    resolve(null);
                }
            });
        }

        // ★ 始终先走免费接口
        _request(baseService + '/autoFreeAnswer', false);
    });
}


function cxaiIsGarbageAnswer(s) {
    if (s == null) return true;
    var str = String(s).trim();
    if (str === '') return true;
    // 纯前缀无内容（如 "暂无答案"、"见解析"）— 前缀已在 _handleResponse 中剥离，这里兜底
    if (/^(有正确答案|正确答案|暂无答案|暂无|见解析|见答案|见详解|答案略|参考答案|详见解析|请查看解析)$/i.test(str)) return true;
    // 精确匹配（必须完全等于这些才算垃圾，避免误杀含"略"、"无"的正常答案）
    if (/^(略|无|不确定|不知道|不清楚|未填写|待补充|略略略?|错误的?|正确的?|不对|不正确|以上都[是对]|以上都[不没错]|都不是|都是)$/i.test(str)) return true;
    // ★ AI 返回描述性文本而非答案（如 "一个正确的描述"、"直接解决"、"以这可能是正确的"）
    if (/^(一个|这个|那个|某种|任何|所有|每个|某个).{0,6}(描述|说法|选项|答案|结论|解释|分析|表述|值)$/i.test(str)) return true;
    if (/^(直接|间接|简单|复杂|快速|高效)(解决|处理|回答|作答|解答)$/i.test(str)) return true;
    if (/^(以|这|那|该|此).{0,4}(可能|应该|必定|肯定|或许|也许).{0,4}(正确|错误|对|错)/i.test(str)) return true;
    if (/^某个值$/.test(str)) return true;
    // ★ AI 返回空谈/废话（长度较短的无效回答）
    if (/^(有子网|有.*的IP|以网络|以接收|关于.*选项|选项是[A-D]|以下是|这是一个|根据题意|首先|我们需要|让我|题目要求)/i.test(str) && str.length < 60) return true;
    // ★ AI 返回推理/分析文本而非答案（含"题目描述"、"需要基于"、"无法直接"等推理关键词）
    if (/题目描述|无法直接|需要基于|基于常见|来推理|工作原理|但我|我需要|我无法|无法查看/.test(str) && str.length > 15) return true;
    // ★ AI 返回题目片段（如 "太网的介质访问控制" — 从题目截取的碎片）
    if (cxai_currentQuestionMeta && cxai_currentQuestionMeta.questionText) {
        var _qCheck = cxai_currentQuestionMeta.questionText.trim();
        // 如果答案是题目中连续出现的子串（长度>=4），且不是选项文本，判为垃圾
        if (_qCheck.length > 8 && str.length >= 4 && str.length <= 30 && _qCheck.indexOf(str) !== -1) {
            // 排除：答案恰好是某个选项文本的情况
            console.log('[CXAI] 检测到答案是题目片段: "' + str + '"');
            return true;
        }
    }
    // 纯标点/符号（如 "："、"。"、"、" 等不是有效答案）
    if (/^[：:。、，,；;！!？?…·\-—]+$/.test(str)) return true;
    // AI 回显 prompt 指令片段（如 "有正确答案，并用"|"分隔每个选项的完整文本"）
    if (/分隔.*选项|选项.*完整文本|返回.*选项|选择.*正确答案|直接返回|完整文本|的完整$|^项的|^选项的|^的选项/i.test(str) && str.length < 80) return true;
    // 判断题格式混入选择题（如 "- A: 正确"、"A.正确"、"B: 错误"）
    if (/^[—\-–]?\s*[A-Za-z]\s*[.:：]?\s*(正确|错误|对|错|是|否|√|×)\s*$/.test(str)) return true;
    // 过短且不含有效内容（2个字符以内，且不是有意义的单字答案）
    if (str.length <= 2 && !/^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(str)) return true;
    // ★ 题目回显检测：AI返回了题目文本的片段而非答案
    if (cxai_currentQuestionMeta && cxai_currentQuestionMeta.questionText) {
        var _qText = cxai_currentQuestionMeta.questionText.trim();
        // 检查答案是否与题目有大量重叠（包含题目中连续15字以上的片段）
        if (_qText.length > 15 && str.length > 10) {
            for (var qi = 0; qi <= _qText.length - 15; qi++) {
                var _frag = _qText.substring(qi, qi + 15);
                if (str.indexOf(_frag) !== -1) {
                    console.log('[CXAI] 检测到答案回显题目片段: "' + _frag + '"');
                    return true;
                }
            }
        }
    }
    // ★ 推理过程检测：AI返回了推理/分析文本而非答案（含常见推理关键词且长度较长）
    if (str.length > 15 && /^(我们需要|首先|根据题目|由题意|设|令|假设|由于|因为|所以|通过计算|经过|分析|让我们|我们来|下面|接下来)/i.test(str)) return true;
    return false;
}


function cxaiProcessBankAnswer(answerList, optionsArr, type) {
    if (!answerList || answerList.length === 0) { console.log('[CXAI题库] 答案列表为空'); return null; }
    console.log('[CXAI题库] 处理答案 - 题型:', type, '| 答案:', JSON.stringify(answerList), '| 选项:', JSON.stringify(optionsArr));

    // 填空题/主观题/问答题/名词解释/论述题：直接返回答案文本
    if (type === 2 || type === 4 || type === 5 || type === 6 || type === 7) {
        // 数字索引类型也需转文本
        return answerList.map(function(a) { return String(a); }).join('\n');
    }

    // 判断题
    if (type === 3) {
        var ansText = String(answerList[0]);
        // 数字：0=对/正确, 1=错/错误
        if (typeof answerList[0] === 'number') {
            return answerList[0] === 0 ? '正确' : '错误';
        }
        var truePattern = /(^|,)(正确|是|对|√|T|ri|true|A)(,|$)/;
        var falsePattern = /(^|,)(错误|否|错|×|F|不是|wr|false|B)(,|$)/;
        if (truePattern.test(ansText)) return '正确';
        if (falsePattern.test(ansText)) return '错误';
        return null;
    }

    // 单选题/多选题：数字索引直接用 + 字母→索引 + 文本匹配 + 模糊匹配

    // ★ 垃圾答案过滤：剔除题库返回的无意义文本
    answerList = answerList.filter(function(a) {
        if (cxaiIsGarbageAnswer(a)) {
            console.log('[CXAI题库] 过滤垃圾答案: "' + String(a) + '"');
            return false; // 移除垃圾答案
        }
        // ★ 多选题答案不是合法的字母格式（应为 "A,B,C" 或 "ABC" 等）
        var _aStr = String(a);
        if (cxai_currentQuestionMeta && (cxai_currentQuestionMeta.typeName === '多选题' || cxai_currentQuestionMeta.typeName === '多项选择题') && _aStr.length > 2) {
            // 合法格式: 纯字母如 "AB"、"A,B,C"、"A、B、D"、数字索引如 "0|2|3"
            var _isLegalMulti = /^[A-Ga-g\s,，、|;；]+$/.test(_aStr) || /^\d[\d\s|,;，、和]+$/.test(_aStr) || /^\d+$/.test(_aStr);
            if (!_isLegalMulti) {
                console.log('[CXAI] 多选题答案格式不合法，判为垃圾: "' + _aStr.slice(0, 40) + '"');
                return false; // 移除不合法格式
            }
        }
        return true; // 保留有效答案
    });
    if (answerList.length === 0) { console.log('[CXAI题库] 过滤后答案列表为空'); return null; }

    var targetIndices = [];
    for (var k = 0; k < answerList.length; k++) {
        var ans = answerList[k];

        // ★ 关键修复：lyck6返回数字时直接当选项索引
        if (typeof ans === 'number' && Number.isInteger(ans)) {
            if (ans >= 0 && ans < (optionsArr ? optionsArr.length : 10)) {
                targetIndices.push(ans);
                console.log('[CXAI题库] 数字索引直接命中: 选项' + (ans + 1));
                continue;
            }
        }

        ans = String(ans);

        // 字母索引匹配（如 "B" → 1）
        if (ans.length === 1 && /^[A-G]$/.test(ans)) {
            targetIndices.push(ans.charCodeAt(0) - 65);
            continue;
        }
        // 数字字符串（如 "2"）也当索引
        if (/^\d+$/.test(ans)) {
            var numIdx = parseInt(ans, 10);
            if (numIdx >= 0 && numIdx < (optionsArr ? optionsArr.length : 10)) {
                targetIndices.push(numIdx);
                continue;
            }
        }
        // 文本精确匹配
        var found = false;
        if (optionsArr) {
            for (var j = 0; j < optionsArr.length; j++) {
                if (optionsArr[j] === ans || optionsArr[j].indexOf(ans) !== -1 || ans.indexOf(optionsArr[j]) !== -1) {
                    targetIndices.push(j);
                    found = true;
                    break;
                }
            }
        }
        // 模糊匹配 fallback
        if (!found && ans.length >= 2 && optionsArr) {
            var bestIdx = cxai_findBestFuzzyMatch(optionsArr, ans);
            if (bestIdx !== -1) targetIndices.push(bestIdx);
        }
    }

    if (targetIndices.length === 0) { console.log('[CXAI题库] 无法匹配任何选项'); return null; }

    console.log('[CXAI题库] 最终匹配索引:', targetIndices);

    // 单选：返回单个索引
    if (type === 0) return targetIndices[0];
    // 多选：返回去重后的索引数组
    if (type === 1) {
        var unique = [];
        for (var u = 0; u < targetIndices.length; u++) {
            if (unique.indexOf(targetIndices[u]) === -1) unique.push(targetIndices[u]);
        }
        return unique;
    }
    return targetIndices[0];
}


function cxai_getAnswer(_t, _q, retryCount = 0) {
    // 搜题总开关：关闭时静默跳过
    if (localStorage.getItem('cxaiSetting.searchEnabled') === 'false') {
        return Promise.reject({ 'c': 0, _instant: true });
    }
    // 兼容: _q 既可为字符串(旧调用),也可为 cxai_buildPrompt() 返回的 { payload, display } 对象
    let _payload, _display
    if (_q && typeof _q === 'object' && (_q.payload != null || _q.display != null)) {
        _payload = _q.payload != null ? String(_q.payload) : ''
        _display = _q.display != null ? String(_q.display) : _payload
    } else {
        _payload = _q == null ? '' : String(_q)
        _display = _payload
    }
    let _qPrefix = ''
    if (cxai_currentQuestionMeta) {
        var _m = cxai_currentQuestionMeta
        _qPrefix = '第' + ((_m.index != null ? _m.index : -1) + 1)
        if (_m.total) _qPrefix += '/' + _m.total
        _qPrefix += '题 [' + (_m.typeName || '未知') + '] '
    }
    cxai_logger(_qPrefix + '题目:' + _display, 'pink')
    // 在日志中插入一条 "AI 思考中..." 占位行, 拿到响应后原地替换为答案/错误, 避免独立提示框反复出现/消失
    let _thinkingHtml = '<span class="cxai-log-spinner"></span>AI 思考中<span class="cxai-log-dots"><i></i><i></i><i></i></span>' + (retryCount > 0 ? '（第' + (retryCount + 1) + '次）' : '')
    let $thinkingLog = cxai_logger(_thinkingHtml, 'gray')
    return new Promise((resolve, reject) => {
        let _u = cxai_getCk('_uid') || cxai_getCk('UID')
        let requestCompleted = false;  // 标记请求是否已完成
        let longWaitTimer = null;  // 长时间等待定时器

        // 同步搜题间隔到答题间隔：让 cxaiCfg.time 与 UI 设置的 reqIntervalTime 保持一致
        var _syncedSec = parseInt(localStorage.getItem('cxaiSetting.reqIntervalTime'), 10);
        if (isFinite(_syncedSec) && _syncedSec >= 0) {
            cxaiCfg.time = Math.min(60000, _syncedSec * 1000);
        }

        // 按用户设置的搜题间隔节流：计算本次需要等待的 ms，并预订下一次可发起时间
        let _intervalSec = parseInt(localStorage.getItem('cxaiSetting.reqIntervalTime'), 10)
        if (!isFinite(_intervalSec) || _intervalSec < 0) _intervalSec = (cxaiCfg && cxaiCfg.reqIntervalTime) || 0
        let _intervalMs = Math.min(60000, _intervalSec * 1000)
        let _nowTs = Date.now()
        let _waitMs = Math.max(0, _cxaiNextAiAllowedAt - _nowTs)
        // 预订下一次最早可发起时刻：当前/解锁时间 + 间隔
        _cxaiNextAiAllowedAt = Math.max(_nowTs, _cxaiNextAiAllowedAt) + _intervalMs
        if (_waitMs > 0) {
            cxai_updateLogEntry($thinkingLog, '搜题间隔限制，等待 ' + Math.round(_waitMs / 1000) + 's 后发起请求...', 'gray')
        }

        // 设置5分钟的监控定时器（覆盖 throttle 等待时间）
        longWaitTimer = setTimeout(() => {
            if (!requestCompleted) {
                requestCompleted = true;  // 标记为已完成，避免处理旧响应
                if (retryCount >= 3) {
                    // 最多重试3次，避免网络不可用时无限循环
                    cxai_updateLogEntry($thinkingLog, '请求超过5分钟未响应，已重试' + (retryCount + 1) + '次仍失败，跳过此题', 'red')
                    reject({ 'c': 0 })
                } else {
                    // 原地把 "AI 思考中" 行替换为重试提示, 不再追加新日志
                    cxai_updateLogEntry($thinkingLog, '请求超过5分钟未响应，正在重新发起请求...（第' + (retryCount + 1) + '次重试）', 'orange')
                    // 重新发起请求(递归调用会创建新的 "思考中" 行)
                    cxai_getAnswer(_t, _q, retryCount + 1).then(resolve).catch(reject)
                }
            }
        }, 300000 + _waitMs);  // 5分钟 = 300000毫秒

        setTimeout(function () {
        if (requestCompleted) return; // 若已因 5 分钟超时进入重试，则不再发送本次请求

        // 请求实际发起前，若节流等待行还在显示，更新为"思考中"
        if (_waitMs > 0) {
            let _resumeHtml = '<span class="cxai-log-spinner"></span>AI 思考中<span class="cxai-log-dots"><i></i><i></i><i></i></span>' + (retryCount > 0 ? '（第' + (retryCount + 1) + '次）' : '')
            cxai_updateLogEntry($thinkingLog, _resumeHtml, 'gray')
        }

        // 读取 Provider 配置
        var _cfg = cxaiGetProviderConfig();
        var _useProvider = !!_cfg.apiKey;  // 有 API Key 走直连，否则走代理

        // 检查是否有任何答案来源（题库 或 AI Provider/代理）
        var _hasQuestionBank = localStorage.getItem('cxaiSetting.thirdPartyApi') === 'true';
        var _hasAI = !!(_useProvider || (cxaiCfg.apiHost || cxai_host));
        if (!_hasQuestionBank && !_hasAI) {
            cxai_updateLogEntry($thinkingLog, '请先在设置中配置 API Key、代理地址 或 题库', 'red')
            reject({ 'c': 0 })
            return
        }

        // 自适应参数
        var _adapt = cxaiGetModelParams(_t);
        var _reqOpts = { model: _cfg.model, temperature: _adapt.temperature, maxTokens: _adapt.maxTokens, topP: _adapt.topP };

        // 统一响应处理
        // isFromBank: 题库答案不做首字母清洗（避免 "B" 被清为空）
        function _handleResponse(answer, isFromBank) {
            if (requestCompleted) return;
            var _ans = isFromBank ? answer.trim() : answer.replace(/[。.]$/, '').replace(/^[A-Z]\s*\n\s*/, '').trim();

            // ★ 题目回显检测（增强版）：如果答案与题目有大量文本重叠，说明AI在复述题目
            if (!isFromBank && cxai_currentQuestionMeta && cxai_currentQuestionMeta.questionText) {
                var _qFull = cxai_currentQuestionMeta.questionText.trim();
                if (_qFull.length > 10 && _ans.length > 10) {
                    // 计算答案与题目的重叠字符数
                    var _overlapCount = 0;
                    var _checkFragments = function(src, target) {
                        var count = 0;
                        for (let fi = 0; fi <= src.length - 8; fi++) {
                            if (target.indexOf(src.substring(fi, fi + 8)) !== -1) count++;
                        }
                        return count;
                    };
                    _overlapCount = Math.max(_checkFragments(_ans, _qFull), _checkFragments(_qFull, _ans));
                    // 如果重叠片段超过5个（约40字重叠），判定为题目回显
                    if (_overlapCount > 5) {
                        console.log('[CXAI] 检测到答案回显题目(重叠' + _overlapCount + '段): "' + _ans.slice(0, 40) + '..."');
                        _ans = '';
                    }
                }
            }

            // ★ 剥离 AI 常见答案前缀（"正确答案："、"答案："、"参考答案：" 等），防止长答案被误判垃圾
            if (!isFromBank && _ans.length > 0) {
                var _stripped = _ans.replace(/^(有正确答案|正确答案|参考答案|答案|该题答案)\s*[：:，,。\s]*/i, '').trim();
                if (_stripped.length > 0 && _stripped.length < _ans.length) {
                    console.log('[CXAI] 剥离答案前缀: "' + _ans.slice(0, 30) + '..." → "' + _stripped.slice(0, 30) + '..."');
                    _ans = _stripped;
                }
            }

            // ★ 检测AI推理/无法回答的情况（如 "图片无法直接查看"、"需要基于...来推理"）
            if (!isFromBank && _ans.length > 15) {
                if (/图片.*无法|无法.*查看|无法.*识别|需要.*推理|基于.*推理|但我.*无法|我无法.*确定/.test(_ans)) {
                    console.log('[CXAI] 检测到AI无法回答(图片/推理): "' + _ans.slice(0, 50) + '..."');
                    _ans = ''; // 清空，触发垃圾检测
                }
            }

            // ★ 增强：从长解释文本中提取答案字母
            if (!isFromBank && _ans.length > 3) {
                var _directM = _ans.match(/答案[是为：:\s]*([A-Ga-g])\b/) ||
                               _ans.match(/选[择了取]?[：:\s]*([A-Ga-g])\b/) ||
                               _ans.match(/正确[答选][案项]?[是为：:\s]*([A-Ga-g])\b/);
                if (_directM && _directM[1]) {
                    console.log('[CXAI] 从解释中提取答案(字母): "' + _ans.slice(0, 40) + '..." \u2192 ' + _directM[1].toUpperCase());
                    _ans = _directM[1].toUpperCase();
                }
                if (_ans.length > 3) {
                    var _quotedM = _ans.match(/[\u201c\u201d"']([A-Ga-g])[\u201c\u201d"']/);
                    if (_quotedM && _quotedM[1]) {
                        console.log('[CXAI] 从解释中提取答案(引号字母): "' + _ans.slice(0, 40) + '..." \u2192 ' + _quotedM[1].toUpperCase());
                        _ans = _quotedM[1].toUpperCase();
                    }
                }
            }
            
            // ★ 从解释性文本中提取答案（如 "正确选项是B，对应"IP"" → "IP"）
            if (!isFromBank && _ans.length > 10) {
                var _m = null;
                // 模式1: 提取末尾引号内容（最精确，如 '...应该是"IP"' → "IP"）
                _m = _ans.match(/[""「]([^""」]{1,30})[""」]\s*$/);
                if (_m && _m[1]) {
                    console.log('[CXAI] 从解释中提取答案(引号): "' + _ans.slice(0, 40) + '..." → "' + _m[1] + '"');
                    _ans = _m[1];
                } else {
                    // 模式2: "对应X" 或 "答案为X"（如 "对应IP"）
                    _m = _ans.match(/(?:对应|答案为|选[择为])\s*[：:为]?\s*[""「]?([^""」,，。.\s]{1,20})/i);
                    if (_m && _m[1]) {
                        console.log('[CXAI] 从解释中提取答案(对应): "' + _ans.slice(0, 40) + '..." → "' + _m[1] + '"');
                        _ans = _m[1];
                    } else {
                        // 模式3: "正确选项/答案是X" 或 "应选X"
                        _m = _ans.match(/(?:正确选项|正确答案|应该?[是选]择?)\s*[为是：:]\s*[""「]?([^""」,，。.\s]{1,20})/i);
                        if (_m && _m[1]) {
                            console.log('[CXAI] 从解释中提取答案(正确选项): "' + _ans.slice(0, 40) + '..." → "' + _m[1] + '"');
                            _ans = _m[1];
                        } else {
                            // 模式4: 末尾是"是/为/选X"（如 "...所以正确答案是IP"）
                            _m = _ans.match(/[是为选]\s*[""「]?([A-Za-z\u4e00-\u9fa5]{1,20})\s*$/);
                            if (_m && _m[1]) {
                                console.log('[CXAI] 从解释中提取答案(尾部): "' + _ans.slice(0, 40) + '..." → "' + _m[1] + '"');
                                _ans = _m[1];
                            }
                        }
                    }
                }
            }

            // ★ 解析"选项N"格式：将"选项1、选项2、选项3"或"选项A、选项B"转为索引格式
            if (/选项[\dA-Za-z]/.test(_ans)) {
                var _optMatches = _ans.match(/选项([\dA-Za-z]+)/g);
                if (_optMatches && _optMatches.length > 0) {
                    var _optIndices = _optMatches.map(function(s) {
                        var val = s.replace('选项', '');
                        if (/^\d+$/.test(val)) {
                            return parseInt(val, 10) - 1;  // "选项1" → 0
                        } else if (/^[A-Za-z]$/.test(val)) {
                            return val.toUpperCase().charCodeAt(0) - 65;  // "选项A" → 0, "选项B" → 1
                        }
                        return -1;
                    }).filter(function(n) { return n >= 0; });
                    if (_optIndices.length > 0) {
                        console.log('[CXAI] 解析"选项N"格式: "' + _ans + '" → "' + _optIndices.join('|') + '"');
                        _ans = _optIndices.join('|');
                    }
                }
            }

            // ★ 解析判断题格式的回答（如 "- A: 正确, B: 错误, C: 正确" → 提取正确选项字母）
            if (/正确|对|是|√|T\b|true/i.test(_ans) && /[A-Za-z]\s*[.:：]?\s*(正确|错误|对|错|是|否|√|×)/i.test(_ans)) {
                var _correctLetters = [];
                var _judgeMatches = _ans.match(/[A-Za-z]\s*[.:：]?\s*(正确|对|是|√|T\b|true)/gi);
                if (_judgeMatches) {
                    for (var ji = 0; ji < _judgeMatches.length; ji++) {
                        var _letterMatch = _judgeMatches[ji].match(/^([A-Za-z])/);
                        if (_letterMatch) _correctLetters.push(_letterMatch[1].toUpperCase());
                    }
                }
                if (_correctLetters.length > 0) {
                    var _extracted = _correctLetters.join('|');
                    console.log('[CXAI] 从判断题格式中提取正确选项: "' + _ans + '" → "' + _extracted + '"');
                    _ans = _extracted;
                }
            }

            // ★ 垃圾答案拦截：题库/AI 返回无意义文本时直接跳过
            if (cxaiIsGarbageAnswer(_ans)) {
                console.log('[CXAI] 拦截垃圾答案(' + (isFromBank ? '题库' : 'AI') + '): "' + _ans + '"');
                if (isFromBank) {
                    // 题库返回垃圾：不标记完成，让 AI 接管
                    cxai_updateLogEntry($thinkingLog, '题库返回无意义答案，尝试AI...', 'orange');
                    reject({ 'c': 0 });
                } else {
                    // AI 返回垃圾：重试一次，而非直接放弃
                    if (retryCount < 1) {
                        cxai_updateLogEntry($thinkingLog, 'AI返回无意义答案，自动重试中...', 'orange');
                        // 不标记完成，让 cxai_getAnswer 递归重试
                        requestCompleted = true; // 先标记当前请求完成
                        clearTimeout(longWaitTimer);
                        setTimeout(function () {
                            cxai_getAnswer(_t, _q, retryCount + 1).then(resolve).catch(reject);
                        }, 1500);
                    } else {
                        // 重试仍失败，放弃
                        requestCompleted = true;
                        clearTimeout(longWaitTimer);
                        cxai_updateLogEntry($thinkingLog, 'AI返回无意义答案: "' + _ans + '"，重试仍失败，跳过此题', 'red');
                        reject({ 'c': 0 });
                    }
                }
                return;
            }

            requestCompleted = true;
            clearTimeout(longWaitTimer);

            // 对于数字索引，显示选项内容而不是索引号
            var displayAns = _ans;
            if (isFromBank && /^\d+$/.test(_ans) && _qOptions) {
                var numIdx = parseInt(_ans, 10);
                if (numIdx >= 0 && numIdx < _qOptions.length) {
                    displayAns = _qOptions[numIdx] + ' (选项' + (numIdx + 1) + ')';
                }
            }
            cxai_updateLogEntry($thinkingLog, '答案:' + displayAns, 'purple')
            resolve(_ans)
        }
        function _handleError(msg, code) {
            if (requestCompleted) return;
            requestCompleted = true;
            clearTimeout(longWaitTimer);
            cxai_updateLogEntry($thinkingLog, msg, 'red')
            if (code !== 403 && code !== 500) localStorage.setItem('cxaiSetting.sub', false)
            reject({ 'c': code || 0 })
        }

        // AI 请求逻辑（提取为函数，供题库未命中时调用）
        function _doAILogic() {
        // 题库未命中且无 AI 配置时，直接报错
        if (!_hasAI) {
            _handleError('题库未命中，且未配置 AI Key 或代理地址', 0);
            return;
        }

        if (_useProvider) {
            // === 直连 Provider ===
            var _provider = _cfg.provider;
            var _url = _provider.endpoint;
            var _headers = { 'Content-Type': 'application/json' };
            var _body;

            if (_provider.format === 'openai') {
                _headers['Authorization'] = 'Bearer ' + _cfg.apiKey;
                _body = cxaiBuildRequest('openai', _payload, _reqOpts);
            } else if (_provider.format === 'anthropic') {
                _headers['x-api-key'] = _cfg.apiKey;
                _headers['anthropic-version'] = '2023-06-01';
                _body = cxaiBuildRequest('anthropic', _payload, _reqOpts);
            } else if (_provider.format === 'ernie') {
                // ERNIE 需要先获取 token（优先从分 Provider 存储读取）
                var _ernieKey = '';
                try {
                    var _sk = JSON.parse(localStorage.getItem('cxaiSetting.secretKeys') || '{}');
                    _ernieKey = _sk['ernie'] || localStorage.getItem('cxaiSetting.ernieSecretKey') || '';
                } catch (e) { _ernieKey = localStorage.getItem('cxaiSetting.ernieSecretKey') || ''; }
                cxaiGetERNIEToken(_cfg.apiKey, _ernieKey).then(function (token) {
                    _url = _url + _reqOpts.model + '?access_token=' + token;
                    _body = cxaiBuildRequest('ernie', _payload, _reqOpts);
                    _doRequest(_url, _headers, _body, _provider.format);
                }).catch(function (err) {
                    _handleError(err.message || 'ERNIE token获取失败', 0);
                });
                return; // ERNIE 异步，提前返回
            }
            _doRequest(_url, _headers, _body, _provider.format);
        } else {
            // === 代理回退 ===
            var _proxyUrl = (cxaiCfg.apiHost || cxai_host) + '/api/v1/cx?v=' + GM_info['script']['version'];
            var _proxyHeaders = { 'Content-type': 'application/x-www-form-urlencoded', 'Authorization': '' };
            var _proxyBody = 'question=' + encodeURIComponent(_payload) + '&u=' + _u + '&model=' + _cfg.model;
            _doRequest(_proxyUrl, _proxyHeaders, _proxyBody, 'proxy');
        }
        } // end _doAILogic

        function _doRequest(url, headers, body, format) {
            GM_xmlhttpRequest({
                method: 'POST', url: url, headers: headers, data: body, timeout: 120000,
                onload: function (xhr) {
                    if (requestCompleted) return;
                    if (xhr.status == 200) {
                        try {
                            var raw = $.parseJSON(xhr.responseText) || {};
                            if (format === 'proxy') {
                                // 代理模式：旧的响应格式
                                var _answer = raw.data && raw.data.answer ? raw.data.answer : '';
                                if (raw.code == 200 && _answer) {
                                    _handleResponse(_answer)
                                } else if (raw.msg) {
                                    _handleError(raw.msg, 0)
                                } else {
                                    _handleError('暂无答案', 0)
                                }
                            } else {
                                // 直连 Provider：统一解析
                                var result = cxaiParseResponse(format, raw);
                                _handleResponse(result);
                            }
                        } catch (e) {
                            _handleError(e.message || '响应解析失败', 0)
                        }
                    } else if (xhr.status == 401 || xhr.status == 403) {
                        _handleError('API Key无效或请求被拒绝', xhr.status)
                    } else if (xhr.status == 429) {
                        _handleError('请求过于频繁，请稍后再试', 403)
                    } else if (xhr.status == 500) {
                        _handleError('服务器压力过大,请稍后重试', 500)
                    } else {
                        try {
                            var errObj = $.parseJSON(xhr.responseText) || {};
                            _handleError(errObj.error ? (errObj.error.message || errObj.error.msg) : ('请求异常(HTTP ' + xhr.status + ')'), xhr.status)
                        } catch (e) {
                            _handleError('请求异常(HTTP ' + xhr.status + ')', xhr.status)
                        }
                    }
                },
                ontimeout: function () {
                    if (requestCompleted) return;
                    _handleError('请求超时，请检查网络或稍后重试', 666)
                }
            });
        }

        // ★ 优先查题库，题库全部未命中才走 AI（串行，非并行）
        var _qText = _display;
        var _qOptions = [];
        try {
            var _parsed = JSON.parse(_payload);
            _qText = _parsed.question || _display;
            _qOptions = _parsed.options || [];
        } catch (e) { /* not JSON, use as-is */ }

        // 阶段1：先查题库

        cxaiQueryThirdPartyApi(_qText, _qOptions, _t).then(function (tpAnswers) {

            if (requestCompleted) return;

            console.log('[CXAI题库] 查询结果 - lyck6:', tpAnswers ? tpAnswers.length + '条' : 'null');

            var allAnswers = [];

            if (tpAnswers && tpAnswers.length > 0) allAnswers.push.apply(allAnswers, tpAnswers);

            if (allAnswers.length === 0) {

                console.log('[CXAI题库] 所有题库均无答案，转向AI');

                _doAILogic();

                return;

            }

            console.log('[CXAI题库] 合并答案:', JSON.stringify(allAnswers).slice(0, 300));

            var processed = cxaiProcessBankAnswer(allAnswers, _qOptions, _t);

            console.log('[CXAI题库] 处理后结果:', processed);

            if (processed !== null && processed !== undefined) {

                var displayAnswer = '';

                if (_t === 0 && typeof processed === 'number' && _qOptions && processed < _qOptions.length) {

                    displayAnswer = _qOptions[processed];

                } else if (_t === 1 && Array.isArray(processed) && _qOptions) {

                    displayAnswer = processed.map(function(idx) {

                        return (idx < _qOptions.length) ? _qOptions[idx] : idx;

                    }).join(' | ');

                } else {

                    displayAnswer = String(processed);

                }

                cxai_logger('题库命中: ' + _qText.slice(0, 30), 'green');

                _handleResponse(String(processed), true);

            } else {

                console.log('[CXAI题库] 答案处理后为空，转向AI');

                _doAILogic();

            }

        }).catch(function (e) {

            console.warn('[CXAI题库] 查询异常:', e);

            if (!requestCompleted) _doAILogic();

        });


        }, _waitMs);
    })
}


// ═══════════════════════════════════════════════════════════════════════════════
//  § 12. 工具函数
//  任务切换、字符串清洗、字体解密、粘贴绕过
// ═══════════════════════════════════════════════════════════════════════════════

function cxai_doWork(index, doms, dom) {
    $frame_c = $(dom).contents();
    let $CyHtml = $frame_c.find('.CeYan')
    let TiMuList = $CyHtml.find('.TiMu')
    $subBtn = $frame_c.find(".ZY_sub").find(".btnSubmit");
    $saveBtn = $frame_c.find(".ZY_sub").find(".btnSave");
    cxai_startDoWork(index, doms, 0, TiMuList)
}


function cxai_startDoWork(index, doms, c, TiMuList) {
    if (c == TiMuList.length) {
        if (localStorage.getItem('cxaiSetting.sub') === 'true') {
            cxai_logger('测验处理完成，准备自动提交。', 'green')
            setTimeout(() => {
                $subBtn.click()
                setTimeout(() => {
                    $frame_c.find('#confirmSubWin > div > div > a.bluebtn').click()
                    cxai_logger('提交成功，准备切换下一个任务。', 'green')
                    cxai_mlist.splice(0, 1)
                    _domList.splice(0, 1)
                    setTimeout(() => { cxai_startDoCyWork(index + 1, doms) }, 3000)
                }, 3000)
            }, 5000)
        } else if (localStorage.getItem('cxaiSetting.force') === 'true') {
            cxai_logger('测验处理完成，存在无答案题目,由于用户设置了强制提交，准备自动提交。', 'red')
            setTimeout(() => {
                $subBtn.click()
                setTimeout(() => {
                    $frame_c.find('#confirmSubWin > div > div > a.bluebtn').click()
                    cxai_logger('提交成功，准备切换下一个任务。', 'green')
                    cxai_mlist.splice(0, 1)
                    _domList.splice(0, 1)
                    setTimeout(() => { cxai_startDoCyWork(index + 1, doms) }, 3000)
                }, 3000)
            }, 5000)
        } else {
            cxai_logger('测验处理完成，存在无答案题目或者用户设置不提交。', 'red')
        }
        return
    }
    let questionFull = $(TiMuList[c]).find('.Zy_TItle.clearfix > div').html() || ''
    questionFull = cxai_tidyQuestion(questionFull).replace(/<span.*?>.*?<\/span>/g, "");
    let _question = cxai_tidyQuestion(questionFull)
    let _questionImages = cxaiExtractImages(questionFull)
    if (_questionImages.length > 0) { cxai_logger('检测到题目包含 ' + _questionImages.length + ' 张图片', 'blue') }
    let typeName = (questionFull.match(/^【(.*?)】/) || [])[1] || (questionFull.match(/(单选题|多选题|填空题|判断题|简答题|论述题)/) || [])[1] || '未知';
    let _TimuType = {
        单选题: 0, 单项选择题: 0, 单选: 0,
        多选题: 1, 多项选择题: 1, 多选: 1,
        填空题: 2, 填空: 2,
        判断题: 3, 是非题: 3, 判断: 3,
        简答题: 4, 简答: 4, 问答题: 4, 名词解释: 4, 论述题: 4, 论述: 4,
        计算题: 4, 计算: 4, 分录题: 4, 资料题: 4, 作图题: 4, 其他: 4, 其它: 4, 阅读理解: 4, 阅读: 4, 阅读题: 4, 理解题: 4, 完形填空: 4, 完形: 4, 综合题: 4,
        写作题: 5,
        翻译题: 6
    }[typeName]
    cxai_currentQuestionMeta = { index: c, total: TiMuList.length, typeName: typeName, questionText: _question }
    let _a = []
    let _answerTmpArr

    // 如果题型不在预设类型中，根据DOM结构自动识别题型
    if (_TimuType === undefined) {
        cxai_logger('未知题型: ' + typeName + '，尝试自动识别', 'blue');

        // 检查是否有选择题特征
        let choiceList = $(TiMuList[c]).find('.Zy_ulTop li');
        if (choiceList && choiceList.length > 0) {
            // 检查是否为判断题
            if (choiceList.length === 2 &&
                ($(choiceList[0]).text().includes('对') || $(choiceList[0]).text().includes('√')) &&
                ($(choiceList[1]).text().includes('错') || $(choiceList[1]).text().includes('×'))) {
                _TimuType = 3; // 判断题
                cxai_logger('自动识别为判断题', 'green');
            }
            // 检查是否为选择题
            else {
                // 默认为单选题，后续可根据页面特征判断是否为多选题
                _TimuType = 0;
                cxai_logger('自动识别为单选题', 'green');
            }
        }
        // 检查是否有填空题特征
        else {
            let fillBlankList = $(TiMuList[c]).find('.Zy_ulTk .XztiHover1');
            if (fillBlankList && fillBlankList.length > 0) {
                _TimuType = 2; // 填空题
                cxai_logger('自动识别为填空题', 'green');
            } else {
                // 检查是否有富文本编辑器
                let editorList = $(TiMuList[c]).find('.edui-editor');
                if (editorList && editorList.length > 0) {
                    _TimuType = 4; // 简答题
                    cxai_logger('检测到富文本编辑器，识别为简答题', 'green');
                } else {
                    // 默认当作简答题处理
                    _TimuType = 4;
                    cxai_logger('无法准确判断题型，按简答题处理', 'blue');
                }
            }
        }
    }

    switch (_TimuType) {
        case 0: {
            _answerTmpArr = $(TiMuList[c]).find('.Zy_ulTop li').find('a')
            //遍历选项列表
            let mergedAnswers = [];
            _answerTmpArr.each(function () {
                var answerText = $(this).text().replace(/^[A-Z]\s*/, '').trim();
                mergedAnswers.push(answerText);
            });
            mergedAnswers = mergedAnswers.join("|");
            _question = cxai_buildPrompt({ type: '单选题', question: _question, options: mergedAnswers.split('|') })
            $.each(_answerTmpArr, (i, t) => {
                _a.push(cxai_tidyStr($(t).html()))
            })
            cxai_getAnswer(_TimuType, _question).then((agrs) => {
                agrs = String(agrs)
                if (localStorage.getItem('cxaiSetting.alterTitle') === 'true') {
                    let timuele = $(TiMuList[c]).find('.Zy_TItle.clearfix > div')
                    timuele.html(timuele.html() + '<p style="color:green;">📖 ' + cxaiGetDisplayAnswer(agrs, _a) + '</p>')
                }
                let _i = cxaiMatchByLetter(agrs, _a.length);
                if (_i === -1) { _i = _a.findIndex(function(item) { return item === agrs; }); }
                if (_i === -1) { _i = cxai_findBestFuzzyMatch(_a, agrs, undefined, true); }
                if (_i === -1) { _i = cxaiFindAnswerIndex(_a, agrs); }
                if (_i == -1) {
                    cxai_logger('AI无法完美匹配正确答案,请手动选择，跳过', 'red')
                } else {
                    if (localStorage.getItem('cxaiSetting.goodStudent') === 'true') {
                        $(_answerTmpArr[_i]).parent().find('span').css('font-weight', 'bold');
                    } else {
                        $(_answerTmpArr[_i]).parent().click();
                    }
                }
                setTimeout(() => { cxai_startDoWork(index, doms, c + 1, TiMuList) }, cxaiCfg.time)
            }).catch((agrs) => {
                setTimeout(() => { cxai_startDoWork(index, doms, c + 1, TiMuList) }, cxaiCfg.time)
            })
            break
        }
        case 1: {
            _answerTmpArr = $(TiMuList[c]).find('.Zy_ulTop li').find('a')
            //遍历选项列表
            let mergedAnswers = [];
            _answerTmpArr.each(function () {
                var answerText = $(this).text().replace(/^[A-Z]\s*/, '').trim();
                mergedAnswers.push(answerText);
            });
            mergedAnswers = mergedAnswers.join("|");
            _question = cxai_buildPrompt({ type: '多选题', question: _question, options: mergedAnswers.split('|'), answer_format: "用'|'分割多个答案" })
            cxai_getAnswer(_TimuType, _question).then((agrs) => {
                agrs = String(agrs)
                if (localStorage.getItem('cxaiSetting.alterTitle') === 'true') {
                    let timuele = $(TiMuList[c]).find('.Zy_TItle.clearfix > div')
                    timuele.html(timuele.html() + '<p style="color:green;">📖 ' + cxaiGetDisplayAnswer(agrs, _a) + '</p>')
                }
                let _multiOptions = []
                $.each(_answerTmpArr, (i, t) => {
                    _multiOptions.push(cxai_tidyStr($(t).html()))
                })
                let _matchedIndices = cxaiMatchMultipleByLetter(agrs, _multiOptions.length);
                if (_matchedIndices.length === 0) {
                    $.each(_multiOptions, function(i, t) {
                        if (agrs.indexOf(_multiOptions[i]) !== -1) _matchedIndices.push(i);
                    });
                }
                if (_matchedIndices.length === 0) {
                    _matchedIndices = cxaiFindMultipleIndices(_multiOptions, agrs);
                }
                for (let fi = 0; fi < _matchedIndices.length; fi++) {
                    _a.push(['A', 'B', 'C', 'D', 'E', 'F', 'G'][_matchedIndices[fi]])
                }
                if (localStorage.getItem('cxaiSetting.goodStudent') === 'true') {
                    for (let fi = 0; fi < _matchedIndices.length; fi++) {
                        $(_answerTmpArr[_matchedIndices[fi]]).parent().find('span').css('font-weight', 'bold');
                    }
                } else {
                    cxaiClickOptions(_answerTmpArr, _matchedIndices,
                        function(idx) { $(_answerTmpArr[idx]).parent().click(); },
                        function(idx) { return ($(_answerTmpArr[idx]).parent().find('span').attr('class') || '').indexOf('check_answer_dx') !== -1; }
                    );
                }
                let _onclickAttr = $(TiMuList[c]).find('.Zy_ulTop li:nth-child(1)').attr('onclick') || '';
                let id = _onclickAttr ? cxai_getStr(_onclickAttr, 'addcheck(', ');').replace('(', '').replace(')', '') : '';
                if (_matchedIndices.length === 0) {
                    cxai_logger('AI未能匹配任何选项，请手动选择', 'red')
                } else if (_a.length <= 0) {
                    cxai_logger('AI无法完美匹配正确答案,请手动选择，跳过', 'red')
                    // cxaiCfg.sub = 0
                } else {
                    $(TiMuList[c]).find('.Zy_ulTop').parent().find('#answer' + id).val(_a.join(""))
                }
                setTimeout(() => { cxai_startDoWork(index, doms, c + 1, TiMuList) }, cxaiCfg.time)
            }).catch((agrs) => {
                setTimeout(() => { cxai_startDoWork(index, doms, c + 1, TiMuList) }, cxaiCfg.time)
            })
            break
        }
        case 2: {
            _question = cxai_buildPrompt({ type: '填空题', question: _question, answer_format: "多个填空用'|'分隔" })
            let _textareaList = $(TiMuList[c]).find('.Zy_ulTk .XztiHover1')
            cxai_getAnswer(_TimuType, _question).then((agrs) => {
                agrs = String(agrs)
                if (localStorage.getItem('cxaiSetting.alterTitle') === 'true') {
                    let timuele = $(TiMuList[c]).find('.Zy_TItle.clearfix > div')
                    timuele.html(timuele.html() + '<p style="color:green;">📖 ' + cxaiGetDisplayAnswer(agrs, _a) + '</p>')
                }
                let _answerList = agrs.split("|")
                $.each(_textareaList, (i, t) => {
                    setTimeout(() => {
                        $(t).find('#ueditor_' + i).contents().find('.view p').html(_answerList[i]);
                        $(t).find('textarea').html('<p>' + _answerList[i] + '</p>')
                    }, 300)
                })
                setTimeout(() => { cxai_startDoWork(index, doms, c + 1, TiMuList) }, cxaiCfg.time)
            }).catch((agrs) => {
                setTimeout(() => { cxai_startDoWork(index, doms, c + 1, TiMuList) }, cxaiCfg.time)
            })
            break
        }
        case 3: {
            _answerTmpArr = $(TiMuList[c]).find(".Zy_ulTop li").find("a");
            let _true = "正确|是|对|√|T|ri";
            $.each(_answerTmpArr, (i, t) => {
                _a.push(cxai_tidyStr($(t).html()));
            });
            _question = cxai_buildPrompt({ type: '判断题', question: _question, answer_format: "只回答正确或错误" })
            cxai_getAnswer(_TimuType, _question).then((agrs) => {
                agrs = String(agrs)
                if (localStorage.getItem('cxaiSetting.alterTitle') === 'true') {
                    let timuele = $(TiMuList[c]).find('.Zy_TItle.clearfix > div')
                    timuele.html(timuele.html() + '<p style="color:green;">📖 ' + cxaiGetDisplayAnswer(agrs, _a) + '</p>')
                }
                let judgeResult = cxai_parseJudgeAnswer(agrs)
                if (judgeResult === null) {
                    cxai_logger("答案匹配出错，跳过", "red");
                    setTimeout(() => { cxai_startDoWork(index, doms, c + 1, TiMuList) }, cxaiCfg.time)
                    return
                }
                let _i = cxai_findJudgeOptionIndex(_a, judgeResult === 'true');
                if (_i == -1) {
                    cxai_logger("未匹配到正确答案，跳过", "red");
                } else {
                    if (localStorage.getItem('cxaiSetting.goodStudent') === 'true') {
                        $(_answerTmpArr[_i]).parent().find('span').css('font-weight', 'bold');
                    } else {
                        $(_answerTmpArr[_i]).parent().click();
                    }
                }
                setTimeout(() => {
                    cxai_startDoWork(index, doms, c + 1, TiMuList);
                }, cxaiCfg.time);
            }).catch((agrs) => {
                setTimeout(() => {
                    cxai_startDoWork(index, doms, c + 1, TiMuList);
                }, cxaiCfg.time);
            });
            break;
        }
        case 4: {
            let _textareaLista = $(TiMuList[c]).find('.Zy_ulTk .XztiHover1')
            cxai_getAnswer(_TimuType, _question).then((agrs) => {
                if (agrs == '暂无答案') {
                    // cxaiCfg.sub = 0
                }
                let _answerList = agrs.split("|")
                $.each(_textareaLista, (i, t) => {
                    setTimeout(() => {
                        $(t).find('#ueditor_' + i).contents().find('.view p').html(_answerList[i]);
                        $(t).find('textarea').html('<p>' + _answerList[i] + '</p>')
                    }, 300)
                })
                setTimeout(() => { cxai_startDoWork(index, doms, c + 1, TiMuList) }, cxaiCfg.time)
            }).catch((agrs) => {
                setTimeout(() => { cxai_startDoWork(index, doms, c + 1, TiMuList) }, cxaiCfg.time)
            })
            break
        }
    }
}


// 通用文字规范化（全角→半角、引号统一、句号替换、去末尾标点、合并空白）
// 与404小站 formatString 对齐，提升 lyck6.cn 题库匹配率
function cxai_tidyStr(s) {
    if (s) {
        let str = s.replace(/<(?!img).*?>/g, "").replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').trim().replace(/&nbsp;/g, '').replace(new RegExp("&nbsp;", ("gm")), '').replace(/^\s+/, '').replace(/\s+$/, '');
        return str
    } else {
        return null
    }
}


function cxai_tidyQuestion(s) {
    if (s) {
        let str = s.replace(/<(?!img).*?>/g, "").replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').replace(/^\d+[.、]/, '').trim().replace(/&nbsp;/g, '').replace('javascript:void(0);', '').replace(new RegExp("&nbsp;", ("gm")), '').replace(/^\s+/, '').replace(/\s+$/, '');
        return str
    } else {
        return null;
    }
}


var _cxaiFontTableCache = null;

function cxai_decryptFont() {
    var font = null;
    var $tip = $('style:contains(font-cxsecret)');
    if (!$tip.length) { console.log('[ChaoxingAI] 字体解密: 无待解密元素'); return; }
    var fontMatch = $tip.text().match(/base64,([\w\W]+?)'/);
    if (!fontMatch || !fontMatch[1]) { console.warn('[ChaoxingAI] cxai_decryptFont: 未找到字体 base64 数据'); return; }
    font = Typr.parse(cxai_base64ToUint8Array(fontMatch[1]));
    if (!font || !font[0]) { console.warn('[ChaoxingAI] cxai_decryptFont: 字体解析失败'); return; }
    font = font[0];
    var tableText = GM_getResourceText('Table');
    if (!tableText && !_cxaiFontTableCache) {
        console.warn('[ChaoxingAI] 字体映射表(@resource)加载失败，尝试直接获取...');
        _cxaiFetchFontTable($tip);
        return;
    }
    var tableStr = tableText || _cxaiFontTableCache;
    var table = JSON.parse(tableStr);
    var match = {};
    for (var i = 19968; i < 40870; i++) {
        $tip = Typr.U.codeToGlyph(font, i);
        if (!$tip) continue;
        $tip = Typr.U.glyphToPath(font, $tip);
        $tip = md5(JSON.stringify($tip)).slice(24);
        match[i] = table[$tip];
    }
    var matchCount = Object.keys(match).length;
    console.log('[ChaoxingAI] 字体解密: 映射表 ' + matchCount + ' 个字符, 待解密元素 ' + $('.font-cxsecret').length + ' 个');
    if (matchCount === 0) { console.warn('[ChaoxingAI] 字体解密: 映射表为空，可能是字体映射表(CDN)加载失败'); return; }
    $('.font-cxsecret').html(function (index, html) {
        $.each(match, function (key, value) {
            key = String.fromCharCode(key);
            key = new RegExp(key, 'g');
            value = String.fromCharCode(value);
            html = html.replace(key, value);
        });
        return html;
    }).removeClass('font-cxsecret');
}


function _cxaiFetchFontTable($tip) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://116611.xyz/table.json?_=' + Date.now(),
        timeout: 15000,
        onload: function (r) {
            if (r.status === 200 && r.responseText) {
                _cxaiFontTableCache = r.responseText;
                console.log('[ChaoxingAI] 字体映射表直接获取成功，重新执行解密...');
                try { cxai_decryptFont(); } catch (e) { console.warn('[ChaoxingAI] 重试解密失败:', e); }
            } else {
                console.warn('[ChaoxingAI] 字体映射表直接获取失败: HTTP ' + r.status);
            }
        },
        onerror: function () { console.warn('[ChaoxingAI] 字体映射表网络请求失败'); },
        ontimeout: function () { console.warn('[ChaoxingAI] 字体映射表请求超时'); }
    });
}

function cxai_base64ToUint8Array(base64) {
    var data = window.atob(base64);
    var buffer = new Uint8Array(data.length);
    for (var i = 0; i < data.length; ++i) {
        buffer[i] = data.charCodeAt(i);
    }
    return buffer;
}


function cxai_waitForJQueryElement(selector) {
    return new Promise(function (resolve) {
        var interval = setInterval(function () {
            if ($(selector).length > 0) {
                clearInterval(interval);
                resolve();
            }
        }, 500);
    });
}


// ── 粘贴限制绕过 ──
var _cxaiPasteBypassEnabled = false;
var _cxaiPasteBypassStyleEl = null;

function _cxaiOnPasteBypass(e) {
    var t = e.target;
    if (t && (t.tagName === 'TEXTAREA' || t.tagName === 'INPUT' || t.contentEditable === 'true')) {
        e.stopImmediatePropagation();
    }
}

function cxaiInitPasteBypassToggle(enable) {
    if (enable) {
        if (_cxaiPasteBypassEnabled) return;
        _cxaiPasteBypassEnabled = true;
        _cxaiPasteBypassStyleEl = document.createElement('style');
        _cxaiPasteBypassStyleEl.textContent = 'input,textarea,[contenteditable="true"],.edit_text,.edui-body-container,.ueditor_wrap,.answercontent,.mark_answer,.answerTextContent{-webkit-user-select:text!important;-moz-user-select:text!important;-ms-user-select:text!important;user-select:text!important;-webkit-touch-callout:default!important}';
        document.head.appendChild(_cxaiPasteBypassStyleEl);
        document.addEventListener('paste', _cxaiOnPasteBypass, true);
        cxai_logger('粘贴限制绕过已启用', 'green');
        try { cxaiInitPasteBypass(); } catch (_) {}
    } else {
        if (!_cxaiPasteBypassEnabled) return;
        _cxaiPasteBypassEnabled = false;
        document.removeEventListener('paste', _cxaiOnPasteBypass, true);
        if (_cxaiPasteBypassStyleEl) { try { _cxaiPasteBypassStyleEl.remove(); } catch (_) {} _cxaiPasteBypassStyleEl = null; }
        cxai_logger('粘贴限制绕过已关闭', 'gray');
    }
}

function cxaiInitPasteBypass() {
    if (localStorage.getItem('cxaiSetting.unlockPaste') !== 'true') return;
    try {
        var script = document.createElement('script');
        script.textContent = '(' + function () {
            'use strict';
            window.editorPaste = function () { return true; };
            var checkObj = setInterval(function () {
                if (window.obj) {
                    if (window.obj.circle) { window.obj.circle.prohibitReplyPasting = 0; }
                    window.obj.isManager = 1;
                    clearInterval(checkObj);
                }
            }, 500);
            setTimeout(function () { clearInterval(checkObj); }, 10000);
            window.addEventListener('paste', function (e) {
                if (localStorage.getItem('cxaiSetting.unlockPaste') !== 'true') return;
                var target = e.target;
                if (target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
                    e.stopImmediatePropagation();
                }
            }, true);
            var uTimer = setInterval(function () {
                if (!window.UE || !UE.instants) return;
                clearInterval(uTimer);
                for (var key in UE.instants) {
                    var editor = UE.instants[key];
                    if (!editor) continue;
                    try { editor.removeListener('beforepaste', window.editorPaste); } catch (_) {}
                    try { editor.addListener('beforepaste', function () { return true; }); } catch (_) {}
                    if (editor.iframe) {
                        var doc = editor.iframe.contentDocument;
                        if (doc && doc.body) {
                            doc.addEventListener('paste', function (e) {
                                var cd = e.clipboardData || window.clipboardData;
                                if (!cd) return;
                                var hasFile = false;
                                if (cd.items) { for (var i = 0; i < cd.items.length; i++) { if (cd.items[i].kind === 'file') { hasFile = true; break; } } }
                                if (hasFile || !!cd.getData('text/html')) {
                                    e.preventDefault();
                                    e.stopImmediatePropagation();
                                    var text = cd.getData('text/plain');
                                    if (text) editor.execCommand('insertHtml', text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>'), true);
                                }
                            }, true);
                        }
                    }
                }
            }, 500);
            var cTimer = setInterval(function () {
                var codeEditors = window.codeEditors || {};
                if (Object.keys(codeEditors).length === 0) return;
                clearInterval(cTimer);
                for (var eid in codeEditors) {
                    var cm = codeEditors[eid];
                    if (cm && !cm._isUnlocked) {
                        cm.on('beforeChange', function (cmInst, change) {
                            if (change.origin === 'paste') {
                                change.cancel();
                                var pastedText = change.text ? change.text.join('\n') : '';
                                var cursor = cmInst.getCursor();
                                cmInst.operation(function () { cmInst.replaceRange(pastedText, cursor); });
                            }
                        });
                        cm._isUnlocked = true;
                    }
                }
            }, 1000);
        } + ')();';
        document.documentElement.appendChild(script);
        script.remove();
        cxai_logger('粘贴限制绕过已注入', 'green');
    } catch (e) {
        cxai_logger('粘贴绕过注入失败: ' + e.message, 'red');
    }
    cxaiInitPasteBypassToggle(true);
}



// ═══════════════════════════════════════════════════════════════════════════════
//  一键复制所有题目功能
// ═══════════════════════════════════════════════════════════════════════════════
(function cxaiInitCopyAllQuestions() {
    // 注入模态框 HTML
    var modalHtml = '<div id="cxai-copy-modal-overlay">'
        + '<div id="cxai-copy-modal-content">'
        + '<h3>全部题目预览与编辑</h3>'
        + '<div id="cxai-copy-modal-view" style="width:100%;flex-grow:1;min-height:400px;height:500px;overflow-y:auto;border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:12px;font-size:13px;line-height:1.6;box-sizing:border-box;background:#11111b;color:rgba(210,216,234,.90);white-space:pre-wrap;"></div>'
        + '<textarea id="cxai-copy-modal-textarea" style="display:none;"></textarea>'
        + '<div id="cxai-copy-modal-footer">'
        + '<button id="cxai-copy-modal-cancel" type="button">取消</button>'
        + '<button id="cxai-copy-modal-copy" type="button">一键复制</button>'
        + '</div></div></div>';
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    var overlay = document.getElementById('cxai-copy-modal-overlay');
    var textarea = document.getElementById('cxai-copy-modal-textarea');
    var btnCancel = document.getElementById('cxai-copy-modal-cancel');
    var btnCopy = document.getElementById('cxai-copy-modal-copy');

    if (btnCancel) {
        btnCancel.addEventListener('click', function () {
            if (overlay) overlay.style.display = 'none';
        });
    }
    if (btnCopy) {
        btnCopy.addEventListener('click', function () {
            var text = textarea ? textarea.value : '';
            cxaiShowCopyToast('正在下载图片...');
            // 提取所有图片 URL，下载为 base64
            var imgUrls = [];
            text.replace(/\[图片:(https?:\/\/[^\]]+)\]/g, function(m, url) { imgUrls.push(url); return m; });
            var imgMap = {};
            var done = 0;
            if (imgUrls.length === 0) {
                _doCopy(text, {});
                return;
            }
            imgUrls.forEach(function(url) {
                GM_xmlhttpRequest({
                    method: 'GET', url: url, responseType: 'blob',
                    onload: function(resp) {
                        var reader = new FileReader();
                        reader.onloadend = function() {
                            imgMap[url] = reader.result;
                            done++;
                            if (done === imgUrls.length) _doCopy(text, imgMap);
                        };
                        reader.readAsDataURL(resp.response);
                    },
                    onerror: function() { imgMap[url] = url; done++; if (done === imgUrls.length) _doCopy(text, imgMap); },
                    ontimeout: function() { imgMap[url] = url; done++; if (done === imgUrls.length) _doCopy(text, imgMap); }
                });
            });
            function _doCopy(text, imgMap) {
                // 构建 HTML（给 Word 等富文本编辑器，含 base64 图片）
                var html = text.replace(/\[图片:(https?:\/\/[^\]]+)\]/g, function(m, url) {
                    var src = imgMap[url] || url;
                    return '<div style="margin:4px 0;"><img src="' + src + '" style="max-width:400px;max-height:200px;" /></div>';
                });
                html = html.replace(/^(# .+)$/gm, '<h2></h2>');
                html = html.replace(/^(\d+)\. /gm, '<p><strong>. </strong>');
                html = html.replace(/^([A-G])\. /gm, '<br/><strong>. </strong>');
                html = '<div style="font-family:sans-serif;font-size:14px;line-height:1.8;">' + html + '</div>';
                // 构建纯文本（给豆包等网页聊天框，图片保留 URL）
                var plainText = text.replace(/\[图片:(https?:\/\/[^\]]+)\]/g, function(m, url) {
                    return '[图片: ' + url + ']';
                });
                cxaiCopyToClipboard(plainText, html).then(function() {
                    cxaiShowCopyToast('已复制题目内容（含' + Object.keys(imgMap).length + '张图片）');
                    if (overlay) overlay.style.display = 'none';
                }).catch(function() {
                    cxaiShowCopyToast('复制失败，请手动选中复制');
                });
            }
        });
    }
    // 点击遮罩关闭
    if (overlay) {
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) overlay.style.display = 'none';
        });
    }

    // 绑定复制按钮 — 使用事件委托，因为按钮在 cxai_showBox() 中动态创建
    document.addEventListener('click', function (e) {
        var copyBtn = e.target.closest('#cxai-copy-btn');
        if (!copyBtn) return;
        // 确保字体解密已执行（如果初始加载时映射表未就绪，此时重试）
        function _ensureFontDecrypted() {
            return new Promise(function (resolve) {
                try {
                    if ($('.font-cxsecret').length === 0) { resolve(); return; }
                    if (typeof cxai_decryptFont !== 'function') { resolve(); return; }
                    if (_cxaiFontTableCache || GM_getResourceText('Table')) {
                        cxai_decryptFont();
                        resolve();
                    } else {
                        console.log('[CXAI复制] 字体解密: 映射表未就绪，尝试直接获取...');
                        _cxaiFetchFontTable(null);
                        // 等待获取完成后再解密（最多等5秒）
                        var _wait = 0;
                        var _interval = setInterval(function () {
                            _wait += 200;
                            if (_cxaiFontTableCache || _wait >= 5000) {
                                clearInterval(_interval);
                                if (_cxaiFontTableCache) {
                                    try { cxai_decryptFont(); } catch (e) {}
                                }
                                resolve();
                            }
                        }, 200);
                    }
                } catch (_) { resolve(); }
            });
        }
        console.log('[CXAI复制] 开始采集题目...');
        _ensureFontDecrypted().then(function () {
            return cxaiCollectAllQuestions();
        }).then(function (result) {
            var content = result.text || '';
            var images = result.images || [];
            if (!content || !content.trim()) {
                cxaiShowCopyToast('未找到题目内容');
                return;
            }
            if (textarea) textarea.value = content;
            var view = document.getElementById('cxai-copy-modal-view');
            if (view) {
                // 渲染 HTML：每道题后的图片 URL 替换为 <img> 标签
                var html = content.replace(/\[图片:(https?:\/\/[^\]]+)\]/g, function(match, url) {
                    return '<div style="margin:4px 0;display:inline-block;"><img src="' + url + '" style="max-width:100%;max-height:200px;border-radius:4px;border:1px solid rgba(255,255,255,.1);" onerror="this.style.display=\'none\'" /></div>';
                });
                html = html.replace(/\[图片\d+\]: (https?:\/\/[^\s]+)/g, function(match, url) {
                    return '<div style="margin:4px 0"><img src="' + url + '" style="max-width:100%;max-height:200px;border-radius:4px;border:1px solid rgba(255,255,255,.1);" onerror="this.style.display=\'none\'" /></div>';
                });
                // 题目编号加粗
                html = html.replace(/^(\d+\.) /gm, '<span style="color:rgba(165,180,252,.9);font-weight:600;"></span> ');
                // 选项字母着色
                html = html.replace(/^([A-G])\. /gm, '<span style="color:rgba(94,234,212,.8);font-weight:500;">.</span> ');
                // 章节标题
                html = html.replace(/^(# .+)$/gm, '<span style="color:rgba(245,210,70,.9);font-weight:600;"></span>');
                view.innerHTML = html;
            }
            if (overlay) overlay.style.display = 'flex';
        });
    }, true);

    // 从指定 document 中提取题目
    // // 从节点提取文本，保留内嵌图片为 [图片:URL] 占位符
    function cxaiTitleToText(node) {
        if (!node) return '';
        // 直接从 DOM 查询 img 标签提取图片 URL（不受 innerHTML/字体解密影响）
        var imgPlaceholders = [];
        var imgs = node.querySelectorAll('img');
        for (var ii = 0; ii < imgs.length; ii++) {
            var src = imgs[ii].getAttribute('data-src') || imgs[ii].getAttribute('data-original') || imgs[ii].getAttribute('data-lazy') || imgs[ii].src || '';
            if (src && src.indexOf('data:') !== 0 && src.indexOf('http') !== -1) {
                imgPlaceholders.push(' [图片:' + src + '] ');
            }
        }
        // 使用 textContent 获取文本（字体解密后是正确文本）
        var text = (node.textContent || '').replace(/\s+/g, ' ').trim();
        // 在文本末尾追加图片占位符
        if (imgPlaceholders.length > 0) {
            text = text + imgPlaceholders.join('');
        }
        return text;
    }
    // 从 [图片:URL] 占位符中提取所有图片 URL
    function cxaiExtractImgsFromText(text) {
        if (!text) return [];
        var matches = text.match(/\[图片:(https?:\/\/[^\]]+)\]/g) || [];
        return matches.map(function(s) {
            var m = s.match(/\[图片:(.+)\]/);
            return m ? m[1] : null;
        }).filter(Boolean);
    }
    // 从容器中提取所有图片（排除选项区域的图片，但不排除标题区域——标题可能含图片）
    function cxaiExtractContainerImgs(box, titleNode, ul) {
        if (!box) return [];
        var excludeNodes = [];
        if (ul) excludeNodes.push(ul);
        var allImgs = Array.prototype.slice.call(box.querySelectorAll('img'));
        return allImgs.filter(function(img) {
            if (excludeNodes.some(function(en) { return en.contains(img); })) return false;
            var src = img.src || img.getAttribute('data-src') || '';
            if (!src || src.indexOf('data:') === 0) return false;
            return true;
        }).map(function(img) {
            return img.src || img.getAttribute('data-src') || '';
        }).filter(Boolean);
    }
        // 从指定 document 中提取题目（支持多种页面结构）
    function cxaiExtractQuestionsFromDoc(doc) {
        var questions = [];

        // ── 1. 测验/作业页面 (.TiMu 容器，含 .Zy_TItle 字体解密) ──
        var timuContainers = Array.prototype.slice.call(doc.querySelectorAll('.TiMu'));
        if (timuContainers.length > 0) {
            timuContainers.forEach(function (box) {
                var titleNode = box.querySelector('.Zy_TItle .fontLabel, .Zy_Title .fontLabel, .newZy_TItle .fontLabel, .newZy_Title .fontLabel')
                    || box.querySelector('.Zy_TItle, .Zy_Title, .newZy_TItle, .newZy_Title');
                var title = cxaiTitleToText(titleNode);
                if (!title) return;
                var titleImgs = cxaiExtractImgsFromText(title);
                var ul = box.querySelector('ul.Zy_ulTop.w-top.fl');
                var lis = ul ? Array.prototype.slice.call(ul.querySelectorAll(':scope > li')) : [];
                var options = lis.map(function (li, idx) {
                    var p = li.querySelector('p') || li.querySelector('a') || li;
                    var text = cxaiTitleToText(p);
                    return String.fromCharCode(65 + idx) + '. ' + text;
                }).filter(Boolean);
                // 提取容器中标题和选项之外的独立图片（去重）
                var containerImgs = cxaiExtractContainerImgs(box, titleNode, ul);
                containerImgs.forEach(function(url) {
                    if (titleImgs.indexOf(url) === -1) {
                        title += ' [图片:' + url + ']';
                        titleImgs.push(url);
                    }
                });
                // 去重图片
                var _seenImg = {}; titleImgs = titleImgs.filter(function(u) { if (_seenImg[u]) return false; _seenImg[u] = true; return true; });
                questions.push({ title: title, options: options, images: titleImgs });
            });
            if (questions.length > 0) return questions;
        }

        // ── 2. 独立作业/考试页面 (.questionLi + .mark_name) ──
        var questionLis = Array.prototype.slice.call(doc.querySelectorAll('.mark_table .questionLi, .questionLi'));
        if (questionLis.length > 0) {
            questionLis.forEach(function (li) {
                var nameNode = li.querySelector('.mark_name');
                var title = cxaiTitleToText(nameNode);
                if (!title) return;
                var titleImgs = cxaiExtractImgsFromText(title);
                var answerPs = Array.prototype.slice.call(li.querySelectorAll('.stem_answer .answer_p'));
                var options = answerPs.map(function (p, idx) {
                    var text = cxaiTitleToText(p);
                    return String.fromCharCode(65 + idx) + '. ' + text;
                }).filter(Boolean);
                // 提取容器中标题和选项之外的独立图片（去重）
                var containerImgs = cxaiExtractContainerImgs(li, nameNode, null);
                containerImgs.forEach(function(url) {
                    if (titleImgs.indexOf(url) === -1) {
                        title += ' [图片:' + url + ']';
                        titleImgs.push(url);
                    }
                });
                var _seenImg2 = {}; titleImgs = titleImgs.filter(function(u) { if (_seenImg2[u]) return false; _seenImg2[u] = true; return true; });
                questions.push({ title: title, options: options, images: titleImgs });
            });
            if (questions.length > 0) return questions;
        }

        // ── 3. 手机端作业 (.Py-mian1) ──
        var pyMians = Array.prototype.slice.call(doc.querySelectorAll('.Py-mian1'));
        if (pyMians.length > 0) {
            pyMians.forEach(function (box) {
                var titleNode = box.querySelector('.Py-m1-title, .Py-mian-T, .mark_name, h3');
                var title = cxaiTitleToText(titleNode);
                if (!title) return;
                var titleImgs = cxaiExtractImgsFromText(title);
                var optionNodes = Array.prototype.slice.call(box.querySelectorAll('.xuanxiang li, .stem_answer .answer_p, li'));
                var options = optionNodes.map(function (n, idx) {
                    var text = cxaiTitleToText(n);
                    return String.fromCharCode(65 + idx) + '. ' + text;
                }).filter(function (t) { return t.length > 3; });
                // 提取容器中标题和选项之外的独立图片（去重）
                var containerImgs = cxaiExtractContainerImgs(box, titleNode, null);
                containerImgs.forEach(function(url) {
                    if (titleImgs.indexOf(url) === -1) {
                        title += ' [图片:' + url + ']';
                        titleImgs.push(url);
                    }
                });
                var _seenImg3 = {}; titleImgs = titleImgs.filter(function(u) { if (_seenImg3[u]) return false; _seenImg3[u] = true; return true; });
                questions.push({ title: title, options: options, images: titleImgs });
            });
            if (questions.length > 0) return questions;
        }

        // ── 4. 兜底：从标题列表提取 ──
        var primarySelectors = [
            '.Zy_TItle .fontLabel', '.Zy_Title .fontLabel',
            '.newZy_TItle .fontLabel', '.newZy_Title .fontLabel',
            '[class*="Zy_"][class*="TItle"] .fontLabel',
            '[class*="Zy_"][class*="Title"] .fontLabel',
            '.mark_name',
            '.Py-mian-T'
        ];
        var fallbackSelectors = ['.Zy_TItle', '.Zy_Title', '.newZy_TItle', '.newZy_Title', '.mark_name', '.Py-mian-T'];
        var seen = {};
        function addFromSelectors(selectors) {
            selectors.forEach(function (sel) {
                Array.prototype.slice.call(doc.querySelectorAll(sel)).forEach(function (n) {
                    var titleText = cxaiTitleToText(n);
                    if (titleText && !seen[titleText]) {
                        seen[titleText] = true;
                        var imgs = cxaiExtractImgsFromText(titleText);
                        questions.push({ title: titleText, options: [], images: imgs });
                    }
                });
            });
        }
        addFromSelectors(primarySelectors);
        if (questions.length === 0) addFromSelectors(fallbackSelectors);

        // ── 5. 终极兜底：文本模式匹配（章节测试等非常规页面） ──
        if (questions.length === 0) {
            var body = doc.body;
            if (body) {
                var fullText = body.innerText || body.textContent || "";
                // 模式1: 严格匹配 - 必须有题型标记 [多选题] [单选题] 等
                var qPattern = /(?:^|\n)\s*(\d+)\s*[.．、]\s*[\[【]?(单选题|多选题|判断题|填空题|简答题|论述题|名词解释|翻译题|写作题|选择题|不定项选择)[】\]]?\s*\n?([\s\S]*?)(?=(?:^|\n)\s*\d+\s*[.．、]\s*[\[【]?(?:单选题|多选题|判断题|填空题|简答题|论述题|名词解释|翻译题|写作题|选择题|不定项选择)|$)/g;
                var m;
                while ((m = qPattern.exec(fullText)) !== null) {
                    var qNum = m[1];
                    var qType = m[2];
                    var qBody = m[3] || "";
                    if (qBody.trim().length < 3) continue;
                    // 从题目体中提取选项
                    var optMatches = qBody.match(/(?:^|\n)\s*([A-G])\s*[.．、\s]\s*(.+)/g);
                    var opts = [];
                    var titleText = qBody;
                    if (optMatches && optMatches.length >= 2) {
                        opts = optMatches.map(function(line) {
                            var om = line.trim().match(/^([A-G])\s*[.．、\s]\s*(.+)/);
                            return om ? om[1] + ". " + om[2].trim() : null;
                        }).filter(Boolean);
                        // 标题 = 第一个选项之前的部分
                        var firstOptIdx = qBody.indexOf(optMatches[0].trim());
                        titleText = qBody.substring(0, firstOptIdx).trim();
                    }
                    titleText = titleText.replace(/^\s*\n?/, "").trim();
                    if (titleText.length > 2) {
                        questions.push({ title: titleText, options: opts, type: qType, images: [] });
                    }
                }
                // 模式2: 宽松匹配 - 纯数字编号 + 至少2个ABCD选项（章节测验常见格式）
                if (questions.length === 0) {
                    var loosePattern = /(?:^|\n)\s*(\d+)\s*[.．、\)\）]\s*([\s\S]*?)(?=(?:^|\n)\s*\d+\s*[.．、\)\）]\s*[A-Da-d]|[A-G]\s*[.．、\s]|$)/g;
                    var lm;
                    while ((lm = loosePattern.exec(fullText)) !== null) {
                        var lBody = lm[2] || "";
                        if (lBody.trim().length < 5) continue;
                        var lOpts = lBody.match(/(?:^|\n)\s*([A-G])\s*[.．、\s]\s*(.+)/g);
                        if (lOpts && lOpts.length >= 2) {
                            var lTitle = lBody.substring(0, lBody.indexOf(lOpts[0].trim())).trim();
                            var lParsedOpts = lOpts.map(function(line) {
                                var om2 = line.trim().match(/^([A-G])\s*[.．、\s]\s*(.+)/);
                                return om2 ? om2[1] + ". " + om2[2].trim() : null;
                            }).filter(Boolean);
                            if (lTitle.length > 2) {
                                questions.push({ title: lTitle, options: lParsedOpts, images: [] });
                            }
                        }
                    }
                }
            }
        }

        return questions;
    }

    // 终极兜底：遍历所有 DOM 元素，查找含选择题格式的文本块
    function cxaiExtractByWalkingDOM(doc) {
        var questions = [];
        if (!doc || !doc.body) return questions;
        var allEls = doc.body.querySelectorAll('*');
        for (var i = 0; i < allEls.length; i++) {
            var el = allEls[i];
            // 跳过脚本、样式、不可见元素
            if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'NOSCRIPT') continue;
            if (el.offsetParent === null && el.tagName !== 'BODY') continue;
            var t = el.textContent || '';
            if (t.length < 10) continue;
            // 检测是否包含选择题特征：至少2个 A. B. 格式的选项
            var optCount = (t.match(/(?:^|\n)\s*[A-D]\s*[.．、]\s*\S/g) || []).length;
            if (optCount >= 2) {
                // 提取题目文本和选项
                var lines = t.split('\n').map(function(l) { return l.trim(); }).filter(function(l) { return l.length > 0; });
                var opts = [];
                var titleParts = [];
                for (var j = 0; j < lines.length; j++) {
                    var om = lines[j].match(/^([A-D])\s*[.．、]\s*(.+)/);
                    if (om) {
                        opts.push(om[1] + '. ' + om[2].trim());
                    } else if (opts.length === 0 && lines[j].length > 2) {
                        titleParts.push(lines[j]);
                    }
                }
                var titleText = titleParts.join(' ').trim();
                if (titleText.length > 2 && opts.length >= 2) {
                    // 去重
                    var key = titleText.substring(0, 30);
                    var isDup = false;
                    for (var k = 0; k < questions.length; k++) {
                        if (questions[k].title.substring(0, 30) === key) { isDup = true; break; }
                    }
                    if (!isDup) {
                        questions.push({ title: titleText, options: opts, images: [] });
                    }
                }
            }
        }
        return questions;
    }

    // 递归采集所有 document（含 iframe）
    function cxaiCollectFromDoc(doc) {
        var sections = [];

        var header = '';
        var h3 = doc.querySelector('.ceyan_name h3');
        if (h3 && h3.textContent) header = h3.textContent.trim();
        if (!header) {
            var testName = doc.querySelector('.newTestTitle .TestTitle_name');
            if (testName && testName.textContent) header = testName.textContent.trim();
        }
        if (!header) {
            var h2s = Array.prototype.slice.call(doc.querySelectorAll('h2'));
            var anchor = h2s.filter(function (h) { return h.textContent && h.textContent.indexOf('章节详情') !== -1; });
            if (anchor.length && anchor[0].textContent) header = anchor[0].textContent.trim();
        }

        var questions = cxaiExtractQuestionsFromDoc(doc);
        console.log('[CXAI复制] doc=' + (doc.title || doc.location?.href || 'unknown') + ' 提取到 ' + questions.length + ' 道题');
        if (questions.length > 0) {
            sections.push({ header: header || doc.title || '', questions: questions });
        }

        var frames = Array.prototype.slice.call(doc.querySelectorAll('iframe'));
        console.log('[CXAI复制] 找到 ' + frames.length + ' 个 iframe，尝试递归...');
        for (var fi = 0; fi < frames.length; fi++) {
            var frame = frames[fi];
            try {
                var fdoc = frame.contentDocument || (frame.contentWindow && frame.contentWindow.document);
                if (fdoc && fdoc.body) {
                    console.log('[CXAI复制] iframe[' + fi + '] 可访问，src=' + (frame.src || 'none').slice(0, 80));
                    sections = sections.concat(cxaiCollectFromDoc(fdoc));
                }
            } catch (err) {
                console.log('[CXAI复制] iframe[' + fi + '] 跨域无法访问: ' + (frame.src || 'none').slice(0, 80));
            }
        }
        return sections;
    }

    // 汇总所有题目为文本
    function cxaiCollectAllQuestions() {
        return new Promise(function (resolve) {
            var sections = cxaiCollectFromDoc(document);
            var totalQ = 0;
            sections.forEach(function(s) { if (s.questions) totalQ += s.questions.length; });
            if (totalQ === 0) {
                setTimeout(function () {
                    var retry = cxaiCollectFromDoc(document);
                    // 如果仍然没找到，尝试 DOM 遍历兜底
                    var retryQ = 0;
                    retry.forEach(function(s) { if (s.questions) retryQ += s.questions.length; });
                    if (retryQ === 0) {
                        var domWalk = cxaiExtractByWalkingDOM(document);
                        if (domWalk.length > 0) {
                            retry = [{ header: document.title || '', questions: domWalk }];
                        }
                    }
                    buildAndResolve(retry);
                }, 2000);
            } else {
                buildAndResolve(sections);
            }
            function buildAndResolve(sections) {
            var lines = [];
            var allImages = [];
            sections.forEach(function (section) {
                if (section.questions && section.questions.length) {
                    if (section.header) {
                        lines.push('# ' + section.header);
                        lines.push('');
                    }
                    section.questions.forEach(function (q, idx) {
                        lines.push((idx + 1) + '. ' + q.title);

                        if (q.images && q.images.length) {
                            // 去重：同一张图片只保留一次
                            var seenImgs = {};
                            q.images.forEach(function(imgUrl) {
                                if (!seenImgs[imgUrl]) {
                                    seenImgs[imgUrl] = true;
                                    allImages.push(imgUrl);
                                }
                            });
                        }
                        if (q.options && q.options.length) {
                            q.options.forEach(function (opt) { lines.push(opt); });
                        }
                        lines.push('');
                    });
                }
            });
            resolve({ text: lines.join('\n'), images: allImages });
            }
        });
    }

    // 复制到剪贴板（同时写入 HTML + 纯文本，兼容 Word 和网页聊天框）
    function cxaiCopyToClipboard(text, html) {
        return new Promise(function (resolve, reject) {
            // 优先用 Clipboard API 同时写入两种格式
            if (navigator.clipboard && navigator.clipboard.write) {
                var htmlBlob = new Blob([html || text], { type: 'text/html' });
                var textBlob = new Blob([text], { type: 'text/plain' });
                var item = new ClipboardItem({
                    'text/html': htmlBlob,
                    'text/plain': textBlob
                });
                navigator.clipboard.write([item]).then(resolve).catch(function () {
                    // Clipboard API 失败，降级
                    _cxaiFallbackCopy(text, html, resolve);
                });
            } else {
                _cxaiFallbackCopy(text, html, resolve);
            }
        });
    }
    function _cxaiFallbackCopy(text, html, resolve) {
        if (html && typeof GM_setClipboard === 'function') {
            GM_setClipboard(html, 'html');
            resolve();
        } else if (html) {
            _fallbackHtmlCopy(text, html, resolve);
        } else {
            cxFallbackCopy(text); resolve();
        }
    }
    function _fallbackHtmlCopy(text, html, resolve) {
        if (html) {
            var div = document.createElement('div');
            div.innerHTML = html;
            div.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
            document.body.appendChild(div);
            var range = document.createRange();
            range.selectNodeContents(div);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            try { document.execCommand('copy'); } catch (e) {}
            sel.removeAllRanges();
            document.body.removeChild(div);
            resolve();
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(resolve).catch(function () {
                cxFallbackCopy(text); resolve();
            });
        } else {
            cxFallbackCopy(text); resolve();
        }
    }

    function cxFallbackCopy(text) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (_) {}
        document.body.removeChild(ta);
    }

    // toast 提示
    function cxaiShowCopyToast(msg) {
        var el = document.createElement('div');
        el.textContent = msg;
        el.style.cssText = 'position:fixed;left:50%;top:24px;transform:translateX(-50%);background:rgba(0,0,0,.78);color:#fff;padding:8px 16px;border-radius:6px;font-size:13px;z-index:100001;pointer-events:none;';
        document.body.appendChild(el);
        setTimeout(function () { el.remove(); }, 1800);
    }
})();
})();
