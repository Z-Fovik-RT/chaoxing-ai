// ==UserScript==
// @name         学习通 · AI智脑Pro
// @namespace    https://github.com/Z-Fovik-RT/chaoxing-ai
// @version      1.2.7
// @description  学习通AI智脑Pro | AI+题库双引擎自动答题 | 视频音频倍速播放 | 字体解密 | 章节自动导航 | 粘贴限制绕过 | 题目一键复制 | 反检测增强 | 作业/考试全自动 | 截图OCR搜题
// @author       Z-Fovik-RT
// @homepage     https://github.com/Z-Fovik-RT/chaoxing-ai
// @supportURL   https://github.com/Z-Fovik-RT/chaoxing-ai/issues
// @icon         https://raw.githubusercontent.com/Z-Fovik-RT/chaoxing-ai/main/icon.png
// @tag          学习通
// @tag          自动答题
// @tag          刷课
// @tag          题库
// @tag          考试辅助
// @tag          模型自定义API
// @tag          AI答题
// @tag          学习辅助
// @antifeature  payment AI功能需用户自备API Key（费用自担）
// @antifeature  membership 题库功能需付费Token，由题库作者发放
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @connect      *
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_getResourceText
// @grant        GM_setClipboard
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @compatible    chrome ScriptCat / Tampermonkey
// @compatible    edge ScriptCat / Tampermonkey
// @compatible    firefox ScriptCat / Tampermonkey
// @require      https://scriptcat.org/lib/668/1.0/TyprMd5.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.1.0/sweetalert2.all.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://registry.npmmirror.com/html2canvas-pro/2.0.4/files/dist/html2canvas-pro.min.js
// @require      https://unpkg.com/docx@8.5.0/build/index.umd.js
// @resource     Table https://116611.xyz/table.json
// @resource     TableTH https://tihai.oss-cn-hangzhou.aliyuncs.com/cx_table.json
// @license      MIT
// @updateURL    https://raw.githubusercontent.com/Z-Fovik-RT/chaoxing-ai/main/chaoxing-ai.user.js
// @downloadURL  https://raw.githubusercontent.com/Z-Fovik-RT/chaoxing-ai/main/chaoxing-ai.user.js
// ==/UserScript==

try { (function() {
     'use strict';

// ★ 尽早暴露 cxai_getAnswer，确保即使后续代码崩溃，划词搜题模块仍能调用
// 函数声明提升使 cxai_getAnswer 在 IIFE 内任意位置可用
try {
    if (typeof cxai_getAnswer === 'function') {
        if (typeof unsafeWindow !== 'undefined') unsafeWindow.cxai_getAnswer = cxai_getAnswer;
        if (typeof window !== 'undefined') window.cxai_getAnswer = cxai_getAnswer;
        if (typeof top !== 'undefined' && top !== window) { try { top.cxai_getAnswer = cxai_getAnswer; } catch(_e) {} }
    }
} catch(_e) { /* 忽略 */ }

// 解决失去焦点暂停视频与后台检测问题
try {
    Object.defineProperty(unsafeWindow, 'onblur', {
        get: function () { return function () { }; },
        set: function () { }
    });
    document.hasFocus = function () { return true; };
    Object.defineProperty(document, 'visibilityState', {
        get: function () { return 'visible'; },
        configurable: true
    });
    Object.defineProperty(document, 'hidden', {
        get: function () { return false; },
        configurable: true
    });
} catch (e) {
    console.warn('[AI智脑Pro] 无法劫持 window.onblur / document.hasFocus', e);
}


// 基于 GM_getValue/GM_setValue 实现跨子域名共享的 localStorage 代理（安全且支持域名隔离版）
var localStorage = {
    _getPrefix: function () {
        try {
            var host = window.location.hostname;
            var matches = host.match(/([^.]+\.(?:com|net|org|edu)\.cn|[^.]+\.[^.]+)$/i);
            return (matches ? matches[0] : host) + ':';
        } catch (e) {
            return '';
        }
    },
    getItem: function (key) {
        var prefixedKey = this._getPrefix() + key;
        var val = undefined;
        try { val = GM_getValue(prefixedKey); } catch (e) { console.warn("[AI智脑Pro] 异常:", e && e.message || 'error'); }
        if (val === undefined || val === null) {
            try {
                val = window.localStorage.getItem(key);
                if (val !== null) GM_setValue(prefixedKey, val);
            } catch (e) { console.warn("[AI智脑Pro] 异常:", e && e.message || 'error'); }
        }
        return (val !== undefined && val !== null) ? val : null;
    },
    setItem: function (key, value) {
        var prefixedKey = this._getPrefix() + key;
        try { GM_setValue(prefixedKey, String(value)); } catch (e) { console.warn("[AI智脑Pro] 异常:", e && e.message || 'error'); }
        try { window.localStorage.setItem(key, String(value)); } catch (e) { console.warn("[AI智脑Pro] 异常:", e && e.message || 'error'); }
    },
    removeItem: function (key) {
        var prefixedKey = this._getPrefix() + key;
        try { GM_deleteValue(prefixedKey); } catch (e) { console.warn("[AI智脑Pro] 异常:", e && e.message || 'error'); }
        try { window.localStorage.removeItem(key); } catch (e) { console.warn("[AI智脑Pro] 异常:", e && e.message || 'error'); }
    }
};

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
var PROVIDERS = {};

// ── 脚本运行参数 ──
var cxaiCfg = {
    cxai_showBox: 1,     // 显示脚本浮窗，0为关闭，1为开启，不建议关闭

    task: 0,        // 只处理任务点任务，0为关闭，1为开启

    video: 1,       // 处理视频，0为关闭，1为开启
    audio: 1,       // 处理音频，0为关闭，1为开启
    rate: 1,        // 视频/音频倍速，默认 1（正常），可在浮窗设置中调整（1/1.25/1.5/2）
    review: 0,      // 复习模式，0为关闭，1为开启可以补挂视频时长

    work: 1,        // 测验自动处理，0为关闭，1为开启，开启将会处理测验，关闭会跳过测验
    bankTime: 2500,     // 题库答题间隔(ms)：答完「题库答案」后等待时长
    aiTime: 2500,       // AI 答题间隔(ms)：答完「AI 答案」后等待时长
    _lastAnswerIsAi: false,  // 上一次答案来源标记（决定 time 访问器返回 bankTime 还是 aiTime）
    // time 作为访问器：根据答案来源自动返回 bankTime(题库) 或 aiTime(AI)，实现题库/AI 间隔分开管理
    get time() {
        // 实时从 localStorage 读取，确保用户改输入框后立刻生效，不依赖内存变量更新时机
        if (this._lastAnswerIsAi) {
            var _ai = localStorage.getItem('cxaiSetting.aiTime');
            if (_ai !== null) return Math.min(60000, Math.round(parseFloat(_ai) * 1000));
            return this.aiTime;
        }
        var _bank = localStorage.getItem('cxaiSetting.time');
        if (_bank !== null) return Math.min(60000, Math.round(parseFloat(_bank) * 1000));
        return this.bankTime;
    },
    set time(v) { this.bankTime = v; },  // 兼容旧赋值，回落到 bankTime
    reqIntervalTime: 3, // AI 请求最小间隔(秒)（仅限流防 ban，不再影响每题停顿）。0 为不节流
    sub: 0,         // 测验自动提交，0为关闭,1为开启，当没答案时测验将不会提交，如需提交请设置force：1
    force: 0,       // 测验强制提交，0为关闭，1为开启，开启此功能将会强制提交测验（无论作答与否）
    decrypt: 1,     // 字体解密，0为关闭，1为开启，推荐开启
    redo: 0,        // 重做模式，0为关闭，1为开启，开启后不跳过已答题，重新AI作答覆盖旧答案
    fuzzyMatch: 1,  // 相似度匹配，0为关闭，1为开启，开启后当精确匹配失败时使用相似度匹配选择最接近的选项

    examTurn: 1,     // 考试自动跳转下一题，默认开启
    examTurnTime: 1,  // 考试自动跳转随机间隔(3-7s)，默认开启
    alterTitle: 1,  //修改题目,将AI回复的答案插入题目中
};



// =============== 自定义 Provider / 模型管理 ===============
// 用户可在浮窗中自行添加、编辑、删除 Provider 和模型
// 存储键: cxaiSetting.customProviders (JSON 数组)

function cxai_getCustomProviders() {
    try {
        var raw = localStorage.getItem('cxaiSetting.customProviders');
        return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
}

function cxai_saveCustomProviders(list) {
    try { localStorage.setItem('cxaiSetting.customProviders', JSON.stringify(list)); } catch (e) { console.warn("[AI智脑Pro] 异常:", e && e.message || 'error'); }
}

function cxai_getAllProviders() {
    // 合并内置 PROVIDERS 和用户自定义 providers
    var merged = {};
    for (var k in PROVIDERS) { if (PROVIDERS.hasOwnProperty(k)) merged[k] = PROVIDERS[k]; }
    var customs = cxai_getCustomProviders();
    for (var i = 0; i < customs.length; i++) {
        var cp = customs[i];
        if (cp.id && cp.name && cp.endpoint) {
            merged[cp.id] = {
                name: cp.name,
                endpoint: cp.endpoint,
                models: (cp.models || []).slice(),
                authType: cp.authType || 'bearer',
                format: cp.format || 'openai',
                isCustom: true,
                customId: cp.id,
                apiKey: cp.apiKey || ''
            };
        }
    }
    return merged;
}

function cxai_findProviderByKey(key) {
    var all = cxai_getAllProviders();
    return all[key] || null;
}

// 生成唯一 ID
function cxai_generateId() {
    return 'custom_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
}

function cxai_escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}


// =============== BZM 题库（高质量题库）集成 ===============
// 注意：BZM 需要 API Key，请先在面板获取

var BZM_API_SERVERS = [
    { url: "https://soti.ucuc.net/api/search.php", name: "BZM主接口" },
    { url: "https://n1t.cn/api/search.php", name: "BZM备用1" },
    { url: "https://tk.swk.tw/api/search.php", name: "BZM备用2" }
];
var bzm_currentServerIndex = 0;

function bzm_getCurrentApiUrl() {
    return BZM_API_SERVERS[bzm_currentServerIndex].url;
}

function bzm_getApiKey() {
    return localStorage.getItem('cxaiSetting.bzmApiKey') || '';
}

function bzm_hasApiKey() {
    var key = bzm_getApiKey();
    return key && key.trim() !== '';
}

// BZM 题库选项清理
function bzm_cleanOptionText(text) {
    if (!text) return text;
    var cleaned = text.replace(/<[^>]*>/g, '');
    cleaned = cleaned.replace(/^[A-Z][\s]*[.、．）)\s]+/, '');
    cleaned = cleaned.replace(/^\([A-Z]\)[\s]*/, '');
    cleaned = cleaned.replace(/^（[A-Z]）[\s]*/, '');
    cleaned = cleaned.replace(/^[:\s\-_]+/, '');
    return cleaned.trim();
}

// BZM 题库字符串清理
function bzm_tidyString(s) {
    if (!s) return null;
    var cleaned = s.replace(/<(?!img).*?>/g, "").replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').trim().replace(/&nbsp;/g, '');
    return bzm_cleanOptionText(cleaned);
}

function bzm_tidyQuestion(s) {
    if (!s) return null;
    var cleaned = s.replace(/<(?!img).*?>/g, "").replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '').replace(/^\d+[.、]/, '').trim();
    return bzm_cleanOptionText(cleaned);
}

function bzm_normalizeForCompare(text) {
    if (!text) return '';
    return text.toUpperCase().replace(/[^\u4e00-\u9fa5A-Z0-9]/g, '').trim();
}

function bzm_splitAnswer(answer) {
    if (!answer) return [];
    var parts = answer.split(/[#]+/).map(function(a) { return a.trim(); }).filter(function(a) { return a !== ''; });
    if (parts.length === 0 && answer.trim() !== '') return [answer.trim()];
    return parts;
}

// =============== BZM 题库答案处理 ===============
// 单选题/多选题/判断题/填空题/简答题 的匹配逻辑与 BZM 原版保持一致
function cxaiProcessBZMAnswer(answerList, optionsArr, type) {
    if (!answerList || answerList.length === 0) {
        console.log('[AI智脑Pro-BZM题库] 答案列表为空');
        return null;
    }

    // 填空题/简答题：直接返回答案文本
    if (type === 2 || type === 4) {
        return answerList.map(function(a) { return String(a); }).join('\n');
    }

    // 判断题
    if (type === 3) {
        var ansText = String(answerList[0]);
        if (typeof answerList[0] === 'number') {
            return answerList[0] === 0 ? '正确' : '错误';
        }
        var trueKeywords = '正确|是|对|√|T|ri';
        if (trueKeywords.indexOf(ansText) !== -1 || trueKeywords.toLowerCase().indexOf(ansText.toLowerCase()) !== -1) {
            return '正确';
        }
        return '错误';
    }

    // 单选题/多选题
    var targetIndices = [];
    for (var k = 0; k < answerList.length; k++) {
        var ans = answerList[k];

        // 数字索引直接用
        if (typeof ans === 'number' && Number.isInteger(ans)) {
            if (ans >= 0 && ans < (optionsArr ? optionsArr.length : 10)) {
                targetIndices.push(ans);
                continue;
            }
        }

        ans = String(ans);

        // 字母索引匹配（如 "B" → 1, "d" → 3）
        if (ans.length === 1 && /^[A-Ga-g]$/.test(ans)) {
            targetIndices.push(ans.toUpperCase().charCodeAt(0) - 65);
            continue;
        }

        // ★ BZM 格式：选项文本用 # 分隔（如 "选项A文本#选项B文本"）
        if (ans.indexOf('#') !== -1 && optionsArr && optionsArr.length > 0) {
            var parts = ans.split('#');
            for (var pi = 0; pi < parts.length; pi++) {
                var partText = parts[pi].trim();
                if (!partText) continue;
                var partNorm = bzm_normalizeForCompare(partText);
                for (var pj = 0; pj < optionsArr.length; pj++) {
                    var optNorm = bzm_normalizeForCompare(optionsArr[pj]);
                    if (optNorm === partNorm || optNorm.indexOf(partNorm) !== -1 || partNorm.indexOf(optNorm) !== -1) {
                        if (targetIndices.indexOf(pj) === -1) targetIndices.push(pj);
                        break;
                    }
                }
            }
            if (targetIndices.length > 0) continue;
        }

        // ★ 多选题：先用 bzm_splitAnswer 拆分
        var ansParts = null;
        if (type === 1) {
            ansParts = bzm_splitAnswer(ans);
        }

        // 数字字符串（如 "2"）也当索引
        if (/^\d+$/.test(ans)) {
            var numIdx = parseInt(ans, 10);
            if (numIdx >= 0 && numIdx < (optionsArr ? optionsArr.length : 10)) {
                targetIndices.push(numIdx);
                continue;
            }
        }

        // 文本匹配
        if (optionsArr) {
            var normalizedAns = bzm_normalizeForCompare(ans);
            for (var j = 0; j < optionsArr.length; j++) {
                var normalizedOpt = bzm_normalizeForCompare(optionsArr[j]);
                if (normalizedOpt === normalizedAns || normalizedOpt.indexOf(normalizedAns) !== -1 || normalizedAns.indexOf(normalizedOpt) !== -1) {
                    targetIndices.push(j);
                    break;
                }
            }
        }

        // ★ 多选题：对拆分后的每一段也做匹配
        if (type === 1 && ansParts && ansParts.length > 1) {
            for (var ak = 0; ak < ansParts.length; ak++) {
                var partAns = ansParts[ak];
                if (!partAns) continue;
                var partAnsNorm = bzm_normalizeForCompare(partAns);
                for (var aj = 0; aj < optionsArr.length; aj++) {
                    var partOptNorm = bzm_normalizeForCompare(optionsArr[aj]);
                    if (partOptNorm === partAnsNorm || partOptNorm.indexOf(partAnsNorm) !== -1 || partAnsNorm.indexOf(partOptNorm) !== -1) {
                        if (targetIndices.indexOf(aj) === -1) targetIndices.push(aj);
                        break;
                    }
                }
            }
        }
    }

    if (targetIndices.length === 0) {
        console.log('[AI智脑Pro-BZM题库] 无法匹配任何选项');
        return null;
    }

    console.log('[AI智脑Pro-BZM题库] 最终匹配索引:', targetIndices);

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

// BZM 题库查询函数
function cxaiQueryBZMTiku(questionText, options, type) {
    // BZM 内部无需操作外层全局超时定时器，定义空函数避免 ReferenceError
    var _clearBankTimer = function() {};
    return new Promise(function(resolve) {
        var apiKey = bzm_getApiKey();
        if (!apiKey || apiKey.trim() === '') {
            console.log('[AI智脑Pro-BZM题库] 未配置 API Key，跳过');
            return resolve(null);
        }
        
        var typeMap = {0:'单选题',1:'多选题',2:'填空题',3:'判断题',4:'简答题'};
        var typeText = typeMap[type] || '单选题';
        
        // 清理题目和选项
        var cleanQuestion = bzm_tidyQuestion(questionText) || questionText;
        var cleanOptions = [];
        if (options && options.length > 0) {
            for (var i = 0; i < options.length; i++) {
                cleanOptions.push(bzm_tidyString(options[i]) || options[i]);
            }
        }
        
        function tryServer(index) {
            if (index >= BZM_API_SERVERS.length) {
                console.log('[AI智脑Pro-BZM题库] 所有接口均失败');
                _clearBankTimer();
                return resolve(null);
            }
            var apiUrl = BZM_API_SERVERS[index].url;
            var formData = 'question=' + encodeURIComponent(cleanQuestion) + '&key=' + encodeURIComponent(apiKey) + '&type=' + encodeURIComponent(typeText);
            if (cleanOptions.length > 0) {
                formData += '&options=' + encodeURIComponent(JSON.stringify(cleanOptions));
            }
            
            console.log('[AI智脑Pro-BZM题库] 请求接口' + (index + 1) + ':', apiUrl);
            GM_xmlhttpRequest({
                method: 'POST',
                url: apiUrl,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: formData,
                timeout: 15000,
                onload: function(xhr) {
                    try {
                        var res = JSON.parse(xhr.responseText);
                        
                        if (res.code === 1 || res.code == 400) {
                            var answerData = null;
                            if (Array.isArray(res.data) && res.data.length > 0) {
                                if (res.data[0].answer) {
                                    answerData = res.data[0].answer;
                                } else if (res.data[0].question && res.data[0].question !== "抱歉无答案") {
                                    answerData = res.data[0].question;
                                }
                            } else if (typeof res.data === 'string') {
                                answerData = res.data;
                            } else if (res.data && typeof res.data === 'object' && res.data.answer) {
                                answerData = res.data.answer;
                            }

                            if (answerData && answerData !== "抱歉无答案" && !answerData.includes("无答案")) {
                                _clearBankTimer();
                                bzm_currentServerIndex = index;
                                return resolve([String(answerData)]);
                            }
                        }
                        // 当前接口无答案，尝试下一个
                        tryServer(index + 1);
                    } catch(e) {
                        console.warn('[AI智脑Pro-BZM题库] 解析失败:', e.message);
                        _clearBankTimer();
                        tryServer(index + 1);
                    }
                },
                onerror: function() {
                    console.warn('[AI智脑Pro-BZM题库] 接口' + (index + 1) + '网络错误');
                    _clearBankTimer();
                    tryServer(index + 1);
                },
                ontimeout: function() {
                    console.warn('[AI智脑Pro-BZM题库] 接口' + (index + 1) + '超时');
                    _clearBankTimer();
                    tryServer(index + 1);
                }
            });
        }
        tryServer(0);
    });
}


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


// 智能补全接口地址：中转站用户常填基址(https://xxx.com)或带 /v1，
// 而脚本需要完整 /chat/completions 路径。这里自动补全，避免 404。
function cxaiNormalizeEndpoint(ep) {
    if (!ep) return ep;
    ep = String(ep).trim().replace(/\/+$/, '');
    if (!ep) return ep;
    // 已经是 chat/completions / completions 结尾，直接用
    if (/chat\/completions$/i.test(ep) || /completions$/i.test(ep)) return ep;
    // 已含 /v1 段（如 https://xxx.com/v1 或 https://xxx.com/api/v1）
    if (/\/v1(\/|$)/i.test(ep)) return ep + '/chat/completions';
    // 否则按 OpenAI 兼容补全
    return ep + '/v1/chat/completions';
}

function cxaiBuildRequest(format, userMsg, opts) {
    // 统一使用 OpenAI 兼容格式（用户自定义接口均为 OpenAI 兼容）
    var _prompt = opts.rawMode ? CXAI_RAW_PROMPT : CXAI_SYSTEM_PROMPT;
    return JSON.stringify({
        model: opts.model,
        messages: [
            { role: 'system', content: _prompt },
            { role: 'user', content: userMsg },
        ],
        temperature: opts.temperature,
        max_tokens: opts.rawMode ? Math.max(opts.maxTokens, 4096) : opts.maxTokens,
        top_p: opts.topP || 1,
    });
}

function cxaiParseResponse(format, raw) {
    if (raw.error) {
        var msg = raw.error.message || raw.error.msg || JSON.stringify(raw.error);
        throw new Error('API错误: ' + msg);
    }
    var result;
    // 统一使用 OpenAI 兼容格式解析
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
    // 从用户自定义列表中读取当前选中的 Provider
    var providerKey = localStorage.getItem('cxaiSetting.provider') || '';
    var provider = cxai_findProviderByKey(providerKey);
    
    // 获取启用模型列表，用于过滤
    var enabledModels = cxai_getEnabledModels();
    var hasEnabledModels = enabledModels.length > 0;
    
    // 辅助：检查 provider+model 是否启用
    function isEnabled(pKey, mName) {
        if (!hasEnabledModels) return true;
        return enabledModels.indexOf(pKey + ':' + mName) !== -1;
    }
    
    // 辅助：找第一个有启用模型的 provider
    function findFirstEnabled(allProviders) {
        for (var k in allProviders) {
            if (!allProviders.hasOwnProperty(k)) continue;
            if (!allProviders[k].models) continue;
            for (var m = 0; m < allProviders[k].models.length; m++) {
                if (isEnabled(k, allProviders[k].models[m])) {
                    return { key: k, provider: allProviders[k], model: allProviders[k].models[m] };
                }
            }
        }
        return null;
    }
    
    if (!provider) {
        // 如果没有选中的，尝试找第一个可用的
        var all = cxai_getAllProviders();
        var found = findFirstEnabled(all);
        if (!found) {
            // 回退到第一个 provider（未配置启用列表时）
            var keys = Object.keys(all);
            if (keys.length === 0) {
                return { key: '', provider: null, apiKey: '', model: '' };
            }
            providerKey = keys[0];
            provider = all[providerKey];
            localStorage.setItem('cxaiSetting.provider', providerKey);
            var apiKey = '';
            try {
                var _keys = JSON.parse(localStorage.getItem('cxaiSetting.apiKeys') || '{}');
                apiKey = _keys[providerKey] || '';
            } catch (e) { apiKey = localStorage.getItem('cxaiSetting.apiKey') || ''; }
            if (!apiKey && provider.isCustom && provider.apiKey) apiKey = provider.apiKey;
            var model = localStorage.getItem('cxaiSetting.model') || (provider.models && provider.models[0]) || '';
            return { key: providerKey, provider: provider, apiKey: apiKey, model: model };
        }
        providerKey = found.key;
        provider = found.provider;
        localStorage.setItem('cxaiSetting.provider', providerKey);
        localStorage.setItem('cxaiSetting.model', found.model);
        var apiKey2 = '';
        try {
            var _keys2 = JSON.parse(localStorage.getItem('cxaiSetting.apiKeys') || '{}');
            apiKey2 = _keys2[providerKey] || '';
        } catch (e) { apiKey2 = localStorage.getItem('cxaiSetting.apiKey') || ''; }
        if (!apiKey2 && provider.isCustom && provider.apiKey) apiKey2 = provider.apiKey;
        return { key: providerKey, provider: provider, apiKey: apiKey2, model: found.model };
    }
    
    // 优先从分 Provider 存储读取 API Key，回退旧版单一 key
    var apiKey = '';
    try {
        var _keys = JSON.parse(localStorage.getItem('cxaiSetting.apiKeys') || '{}');
        apiKey = _keys[providerKey] || '';
    } catch (e) { apiKey = localStorage.getItem('cxaiSetting.apiKey') || ''; }
    // 自定义 Provider 可能自带 apiKey
    if (!apiKey && provider.isCustom && provider.apiKey) { apiKey = provider.apiKey; }
    var model = localStorage.getItem('cxaiSetting.model') || (provider.models && provider.models[0]) || '';
    
    // 如果当前模型未启用，找第一个启用的模型
    if (hasEnabledModels && model && !isEnabled(providerKey, model)) {
        for (var i = 0; i < provider.models.length; i++) {
            if (isEnabled(providerKey, provider.models[i])) {
                model = provider.models[i];
                localStorage.setItem('cxaiSetting.model', model);
                break;
            }
        }
    }
    
    // 如果当前 provider 没有启用模型，切换到第一个有启用模型的 provider
    if (hasEnabledModels && provider.models) {
        var anyEnabled = false;
        for (var j = 0; j < provider.models.length; j++) {
            if (isEnabled(providerKey, provider.models[j])) { anyEnabled = true; break; }
        }
        if (!anyEnabled) {
            var all2 = cxai_getAllProviders();
            var found2 = findFirstEnabled(all2);
            if (found2) {
                providerKey = found2.key;
                provider = found2.provider;
                localStorage.setItem('cxaiSetting.provider', providerKey);
                localStorage.setItem('cxaiSetting.model', found2.model);
                var apiKey3 = '';
                try {
                    var _keys3 = JSON.parse(localStorage.getItem('cxaiSetting.apiKeys') || '{}');
                    apiKey3 = _keys3[providerKey] || '';
                } catch (e) { apiKey3 = localStorage.getItem('cxaiSetting.apiKey') || ''; }
                if (!apiKey3 && provider.isCustom && provider.apiKey) apiKey3 = provider.apiKey;
                return { key: providerKey, provider: provider, apiKey: apiKey3, model: found2.model };
            }
        }
    }
    
    return { key: providerKey, provider: provider, apiKey: apiKey, model: model };
}

// 检查模型是否在启用列表中（未配置时默认全部启用）
function cxai_isModelEnabled(providerId, modelName) {
    try {
        var enabled = JSON.parse(localStorage.getItem('cxaiSetting.enabledModels') || '[]');
        if (enabled.length === 0) return true; // 未配置时默认全部启用
        return enabled.indexOf(providerId + ':' + modelName) !== -1;
    } catch (e) { return true; }
}

// 获取所有启用的模型标识
function cxai_getEnabledModels() {
    try {
        return JSON.parse(localStorage.getItem('cxaiSetting.enabledModels') || '[]');
    } catch (e) { return []; }
}
function cxai_setEnabledModels(list) {
    try { localStorage.setItem('cxaiSetting.enabledModels', JSON.stringify(list)); } catch (e) { console.warn("[AI智脑Pro] 异常:", e && e.message || 'error'); }
}

// 设置模型启用状态
function cxai_setModelEnabled(providerId, modelName, enabled) {
    try {
        var list = JSON.parse(localStorage.getItem('cxaiSetting.enabledModels') || '[]');
        var key = providerId + ':' + modelName;
        if (enabled) {
            if (list.indexOf(key) === -1) list.push(key);
        } else {
            list = list.filter(function(k) { return k !== key; });
        }
        localStorage.setItem('cxaiSetting.enabledModels', JSON.stringify(list));
        // 同步到 modelPriority：启用时自动追加到优先级列表末尾
        if (enabled) {
            var _p = cxai_getModelPriority();
            if (_p.indexOf(key) === -1) {
                _p.push(key);
                cxai_setModelPriority(_p);
            }
        }
    } catch (e) { console.warn("[AI智脑Pro] 异常:", e && e.message || 'error'); }
}

// 获取模型优先级列表（数组，越靠前优先级越高）
function cxai_getModelPriority() {
    try {
        var raw = localStorage.getItem('cxaiSetting.modelPriority');
        if (raw) {
            var arr = JSON.parse(raw);
            if (Array.isArray(arr) && arr.length > 0) return arr;
        }
    } catch (e) { console.warn("[AI智脑Pro] 异常:", e && e.message || 'error'); }
    // 未配置时默认返回空数组，表示按当前选中模型单一执行
    return [];
}

// 设置模型优先级列表
function cxai_setModelPriority(list) {
    try {
        localStorage.setItem('cxaiSetting.modelPriority', JSON.stringify(list));
    } catch (e) { console.warn("[AI智脑Pro] 异常:", e && e.message || 'error'); }
}

// 把 providerId:modelName 格式化为 "Provider名称 / 模型名"
function cxai_formatModelKey(key) {
    if (!key || typeof key !== 'string') return '';
    var parts = key.split(':');
    if (parts.length !== 2) return cxai_escapeHtml(key);
    var pKey = parts[0], mName = parts[1];
    var all = cxai_getAllProviders ? cxai_getAllProviders() : {};
    var provider = all[pKey];
    var pName = provider ? (provider.name || pKey) : pKey;
    return cxai_escapeHtml(pName) + ' / ' + cxai_escapeHtml(mName);
}

// 把当前选中的 provider/model 同步到优先级列表第一位
function cxai_syncCurrentModelToPriority() {
    var priority = cxai_getModelPriority();
    if (priority.length === 0) return;
    var first = priority[0];
    var parts = first.split(':');
    if (parts.length !== 2) return;
    var pKey = parts[0], mName = parts[1];
    var all = cxai_getAllProviders();
    if (!all[pKey] || (all[pKey].models || []).indexOf(mName) === -1) return;
    localStorage.setItem('cxaiSetting.provider', pKey);
    localStorage.setItem('cxaiSetting.model', mName);
}

// 根据当前 provider+model 和优先级列表，构建重试顺序
function cxai_buildRetrySequence(providerKey, modelName) {
    var priority = cxai_getModelPriority();
    if (priority.length === 0) return [{ key: providerKey, model: modelName }]; // 无优先级配置时只试当前模型

    var seq = [];
    var seen = {};

    // 按全局优先级排序：优先级列表中越靠前的越先尝试
    for (var i = 0; i < priority.length; i++) {
        var parts = priority[i].split(':');
        if (parts.length !== 2) continue;
        var pKey = parts[0], mName = parts[1];
        var k = pKey + ':' + mName;
        if (!seen[k] && cxai_isModelEnabled(pKey, mName)) {
            seq.push({ key: pKey, model: mName });
            seen[k] = true;
        }
    }

    // 如果当前模型不在优先级列表里，作为最后兜底加进去
    var currentKey = providerKey + ':' + modelName;
    if (!seen[currentKey] && cxai_isModelEnabled(providerKey, modelName)) {
        seq.push({ key: providerKey, model: modelName });
        seen[currentKey] = true;
    }

    return seq.length > 0 ? seq : [{ key: providerKey, model: modelName }];
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

var CXAI_RAW_PROMPT = `你是一个专业的题目解析助手。请详细解答用户给出的题目，包含：题目分析、关键知识点、推导过程、最终答案。

单选题：先给出详细解析，最后一行单独写"答案：X"（X为选项字母）
多选题：先给出详细解析，最后一行单独写"答案：A,B,C"
填空题：先给出详细解析，最后一行单独写"答案：xxx"
判断题：先给出详细解析，最后一行单独写"答案：A"（正确）或"答案：B"（错误）
简答题：直接给出完整答案

要求：解析必须详尽（至少200字），涉及定义/原理/公式推导，可以使用分点和列表。`;


// ═══════════════════════════════════════════════════════════════════════════════
//  § 3. 全局变量 & 早期初始化
//  快捷引用、全局状态、颜色映射、页面路由分发
// ═══════════════════════════════════════════════════════════════════════════════

var cxai_w = unsafeWindow,
    _l = location,
    _d = (typeof unsafeWindow !== 'undefined' && unsafeWindow.document) ? unsafeWindow.document : document,
    $ = cxai_w.jQuery || top.jQuery,
    md5 = md5 || window.md5,
    UE = cxai_w.UE,
    Swal = Swal || window.Swal;

var cxai_mlist, _defaults, _domList, $subBtn, $saveBtn, $frame_c, $okBtn;
var _cxaiInitPending = false; // 标记是否有正在进行的章节页初始化等待，避免自动初始化与恢复逻辑重复触发
var cxai_currentQuestionMeta = null;
// AI 搜题请求节流：记录下一次可发起请求的时间戳（ms），由 cxai_getAnswer 内部维护
var _cxaiNextAiAllowedAt = 0;
// 恢复任务时用的防抖定时器
var _cxaiResumeTimer = null;
// ==================== 复制题目功能模块 ====================
(function cxaiInitCopyAllQuestions() {
    var _copyModalPaths = ['/mycourse/', '/course/', '/knowledge/', '/multimedia/', '/video/', '/work/', '/exam/', '/ztnodedetailcontroller/', '/read/', '/mooc1/', '/mooc2/', '/mooc-ans/'];
    function _isCopyModalPage() {
        return _copyModalPaths.some(function(p) { return location.pathname.indexOf(p) !== -1; });
    }
    if (!_isCopyModalPage()) {
        try {
            var oldOverlay = top.document.getElementById('cxai-copy-modal-overlay');
            if (oldOverlay) oldOverlay.remove();
        } catch (_) {}
        return;
    }
    function _ensureOverlay() {
        try {
            if (top.document.getElementById('cxai-copy-modal-overlay')) return;
        } catch (_) {}
        var modalHtml = '<div id="cxai-copy-modal-overlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.6);display:none;justify-content:center;align-items:center;z-index:100000;">'
            + '<div id="cxai-copy-modal-content" style="background:#1e1e2e;padding:24px;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.4);width:80%;max-width:850px;max-height:90%;display:flex;flex-direction:column;border:1px solid rgba(255,255,255,.1);">'
            + '<h3 style="margin:0 0 16px;color:rgba(210,216,234,.95);font-size:15px;font-weight:600;">全部题目预览与编辑</h3>'
            + '<div id="cxai-copy-modal-view" style="width:100%;flex-grow:1;min-height:400px;height:500px;overflow-y:auto;border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:12px;font-size:13px;line-height:1.6;box-sizing:border-box;background:#11111b;color:rgba(210,216,234,.90);white-space:pre-wrap;"></div>'
            + '<textarea id="cxai-copy-modal-textarea" style="display:none;"></textarea>'
            + '<div id="cxai-copy-modal-footer" style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px;">'
            + '<button id="cxai-copy-modal-cancel" type="button" style="padding:7px 16px;border:1px solid rgba(255,255,255,.1);border-radius:8px;background:transparent;cursor:pointer;font-size:12px;color:rgba(180,186,206,.7);">取消</button>'
            + '<button id="cxai-copy-modal-copy-plain" type="button" style="padding:7px 16px;border:none;border-radius:8px;background:linear-gradient(135deg,rgba(94,234,212,.25),rgba(165,180,252,.25));color:rgba(225,228,240,.95);cursor:pointer;font-size:12px;font-weight:500;" title="复制纯文本��可粘贴到AI聊天框">📋 复制纯文本（AI）</button>'
            + '<button id="cxai-copy-modal-copy-html" type="button" style="padding:7px 16px;border:none;border-radius:8px;background:linear-gradient(135deg,rgba(245,210,70,.25),rgba(255,130,130,.25));color:rgba(225,228,240,.95);cursor:pointer;font-size:12px;font-weight:500;" title="复制富文本（含图片），可粘贴到Word等">📄 复制图片+文字（Word）</button>'
            + '</div></div></div>';
        try {
            top.document.body.insertAdjacentHTML('beforeend', modalHtml);
        } catch (_) {}
        // 创建后立即同步当前主题
        try {
            var _saved = localStorage.getItem('cxaiSetting.theme') || 'auto';
            var _resolved = _saved;
            if (_saved === 'auto') {
                _resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            _applyCopyModalTheme(_resolved);
        } catch (e) { console.warn('[AI智脑Pro] 复制弹窗初始主题同步失败:', e.message); }
    }
    function _applyCopyModalTheme(theme) {
        try {
            var ov = top.document.getElementById('cxai-copy-modal-overlay');
            if (!ov) return;
            if (theme === 'light') {
                ov.style.background = 'rgba(255,255,255,.92)';
                var ct = ov.querySelector('#cxai-copy-modal-content');
                if (ct) {
                    ct.style.background = '#ffffff';
                    ct.style.border = '1px solid rgba(0,0,0,.1)';
                    ct.style.boxShadow = '0 12px 40px rgba(0,0,0,.1)';
                    ct.style.color = 'rgba(30,30,40,.95)';
                }
                var h3 = ov.querySelector('#cxai-copy-modal-content h3');
                if (h3) h3.style.color = 'rgba(30,30,40,.95)';
                var v = top.document.getElementById('cxai-copy-modal-view');
                if (v) {
                    v.style.background = '#f8f9fa';
                    v.style.border = '1px solid rgba(0,0,0,.08)';
                    v.style.color = 'rgba(30,30,40,.92)';
                }
                var f = top.document.getElementById('cxai-copy-modal-footer');
                if (f) f.style.borderTop = '1px solid rgba(0,0,0,.08)';
                // 按钮文字颜色
                var cancelBtn = ov.querySelector('#cxai-copy-modal-cancel');
                if (cancelBtn) cancelBtn.style.color = 'rgba(30,30,40,.65)';
                var plainBtn = ov.querySelector('#cxai-copy-modal-copy-plain');
                if (plainBtn) plainBtn.style.color = 'rgba(30,30,40,.85)';
                var htmlBtn = ov.querySelector('#cxai-copy-modal-copy-html');
                if (htmlBtn) htmlBtn.style.color = 'rgba(30,30,40,.85)';
            } else {
                ov.style.background = 'rgba(0,0,0,.6)';
                var ct2 = ov.querySelector('#cxai-copy-modal-content');
                if (ct2) {
                    ct2.style.background = '#1e1e2e';
                    ct2.style.border = '1px solid rgba(255,255,255,.1)';
                    ct2.style.boxShadow = '0 8px 32px rgba(0,0,0,.4)';
                    ct2.style.color = 'rgba(210,216,234,.95)';
                }
                var h3_2 = ov.querySelector('#cxai-copy-modal-content h3');
                if (h3_2) h3_2.style.color = 'rgba(210,216,234,.95)';
                var v2 = top.document.getElementById('cxai-copy-modal-view');
                if (v2) {
                    v2.style.background = '#11111b';
                    v2.style.border = '1px solid rgba(255,255,255,.1)';
                    v2.style.color = 'rgba(210,216,234,.90)';
                }
                var f2 = top.document.getElementById('cxai-copy-modal-footer');
                if (f2) f2.style.borderTop = '1px solid rgba(255,255,255,.05)';
                var cancelBtn2 = ov.querySelector('#cxai-copy-modal-cancel');
                if (cancelBtn2) cancelBtn2.style.color = 'rgba(180,186,206,.7)';
            }
        } catch (e) { console.warn('[AI智脑Pro] 复制弹窗主题同步失败:', e.message); }
    }
    function _hideOverlay() {
        try {
            var ov = top.document.getElementById('cxai-copy-modal-overlay');
            if (ov) ov.style.display = 'none';
        } catch (_) {}
    }
    function _showOverlay() {
        _ensureOverlay();
        try {
            var ov = top.document.getElementById('cxai-copy-modal-overlay');
            if (ov) {
                ov.style.display = 'flex';
                // 每次显示时同步主题（用户可能在弹窗隐藏期间切换了主题）
                try {
                    var _saved = localStorage.getItem('cxaiSetting.theme') || 'auto';
                    var _resolved = _saved;
                    if (_saved === 'auto') {
                        _resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                    _applyCopyModalTheme(_resolved);
                } catch (e) { console.warn('[AI智脑Pro] 复制弹窗显示主题同步失败:', e.message); }
            }
        } catch (_) {}
    }
    // 字体解密 Promise（提升到 IIFE 顶层，供 pill 按钮直接调用）
    function _ensureFontDecrypted() {
        return new Promise(function (resolve) {
            try {
                if ($('.font-cxsecret').length === 0) { resolve(); return; }
                if (typeof cxai_decryptFont !== 'function') { resolve(); return; }
                if (_cxaiFontTableCache || GM_getResourceText('Table')) {
                    cxai_decryptFont();
                    resolve();
                } else {
                    console.log('[AI智脑Pro复制] 字体解密: 映射表未就绪，尝试直接获取...');
                    _cxaiFetchFontTable(null);
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
    // 等待所有 iframe 加载完成（提升到 IIFE 顶层，供 pill 按钮直接调用）
    function _waitForAllIframes(doc, depth) {
        depth = depth || 0;
        if (depth > 5) return Promise.resolve();
        if (!doc || !doc.querySelectorAll) return Promise.resolve();
        return new Promise(function (resolve) {
            var frames = doc.querySelectorAll('iframe');
            if (frames.length === 0) { resolve(); return; }
            var pending = frames.length;
            var resolved = false;
            function checkDone() {
                pending--;
                if (pending <= 0 && !resolved) { resolved = true; resolve(); }
            }
            for (var i = 0; i < frames.length; i++) {
                (function(f) {
                    if (!f) { checkDone(); return; }
                    try {
                        var fdoc = f.contentDocument;
                        if (fdoc && fdoc.body && fdoc.body.children.length > 0) {
                            _waitForAllIframes(fdoc, depth + 1).then(checkDone);
                        } else {
                            pending--;
                            if (pending <= 0 && !resolved) { resolved = true; resolve(); }
                        }
                    } catch (e) { checkDone(); }
                })(frames[i]);
            }
            setTimeout(function () { if (!resolved) { resolved = true; resolve(); } }, 8000);
        });
    }
    try {
        top.document.addEventListener('click', function (e) {
            if (e.target.id === 'cxai-copy-modal-cancel') _hideOverlay();
            if (e.target.id === 'cxai-copy-modal-overlay') _hideOverlay();
        });
    } catch (_) {}
    try {
        top.document.addEventListener('click', function (e) {
            var btnPlain = e.target.closest('#cxai-copy-modal-copy-plain');
            var btnHtml = e.target.closest('#cxai-copy-modal-copy-html');
            if (!btnPlain && !btnHtml) return;
            _ensureOverlay();
            var _doc;
            try { _doc = top.document; } catch(_) { _doc = document; }
            var textarea = _doc.getElementById('cxai-copy-modal-textarea');
            var text = textarea ? textarea.value : '';
            var isPlainMode = !!btnPlain;
            cxaiShowCopyToast(isPlainMode ? '正在复制...' : '正在下载图片...');
            var imgUrls = [];
            text.replace(/\[图片:(https?:\/\/[^\]]+)\]/g, function(m, url) { imgUrls.push(url); return m; });
            var imgMap = {};
        var done = 0;
        if (imgUrls.length === 0 || isPlainMode) {
            _doCopy(text, {}, isPlainMode);
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
                        if (done === imgUrls.length) _doCopy(text, imgMap, false);
                    };
                    reader.readAsDataURL(resp.response);
                },
                onerror: function() { imgMap[url] = url; done++; if (done === imgUrls.length) _doCopy(text, imgMap, false); },
                ontimeout: function() { imgMap[url] = url; done++; if (done === imgUrls.length) _doCopy(text, imgMap, false); }
            });
        });
        function _doCopy(text, imgMap, plainOnly) {
            var plainText = text.replace(/\[图片:(https?:\/\/[^\]]+)\]/g, function(m, url) {
                return '[图片: ' + url + ']';
            });
            if (plainOnly) {
                cxFallbackCopy(plainText);
                cxaiShowCopyToast('✅ 已复制（可粘贴到AI）');
                _hideOverlay();
                return;
            }
            var html = text.replace(/\[图片:(https?:\/\/[^\]]+)\]/g, function(m, url) {
                var src = imgMap[url] || url;
                return '<div style="margin:4px 0;"><img src="' + src + '" style="max-width:400px;max-height:200px;" /></div>';
            });
            html = html.replace(/^(# .+)$/gm, '<h2>$1</h2>');
            html = html.replace(/^(\d+)\. (.+)$/gm, '<p><strong>$1. </strong>$2</p>');
            html = html.replace(/^([A-G])\. (.+)$/gm, '<br/><strong>$1. </strong>$2');
            html = '<div style="font-family:sans-serif;font-size:14px;line-height:1.8;">' + html + '</div>';
            cxaiCopyToClipboard(plainText, html).then(function() {
                cxaiShowCopyToast('✅ 已复制（含' + Object.keys(imgMap).length + '张图片）');
                _hideOverlay();
            }).catch(function() {
                cxaiShowCopyToast('复制失败');
            });
        }
    });
    } catch (_) {}
    var _cxaiLastUrl = location.href;
    setInterval(function () {
        if (location.href !== _cxaiLastUrl) {
            _cxaiLastUrl = location.href;
            _hideOverlay();
        }
    }, 500);
    document.addEventListener('click', function (e) {
        var copyBtn = e.target.closest('#cxai-copy-btn');
        if (!copyBtn) return;
        console.log('[AI智脑Pro复制] 开始采集题目...');
        _ensureFontDecrypted().then(function () {
            return _waitForAllIframes(document);
        }).then(function () {
            return cxaiCollectAllQuestions();
        }).then(function (result) {
            var content = result.text || '';
            var images = result.images || [];
            console.log('[AI智脑Pro复制] 采集完成，题目数:', content ? content.split('\n').filter(function(l){return /^\d+\./.test(l)}).length : 0, '内容长度:', content.length);
            if (!content || !content.trim()) {
                cxaiShowCopyToast('未找到题目');
                return;
            }
            if (_isCopyModalPage()) _showOverlay();
            var _ta, _viewDoc;
            try { _viewDoc = top.document; } catch (_) { _viewDoc = document; }
            _ta = _viewDoc.getElementById('cxai-copy-modal-textarea');
            if (_ta) _ta.value = content;
            var view = _viewDoc.getElementById('cxai-copy-modal-view');
            if (view) {
                var html = content.replace(/\[图片:(https?:\/\/[^\]]+)\]/g, function(match, url) {
                    return '<div style="margin:4px 0;display:inline-block;"><img src="' + url + '" style="max-width:100%;max-height:200px;border-radius:4px;border:1px solid rgba(255,255,255,.1);" onerror="this.style.display=\'none\'" /></div>';
                });
                html = html.replace(/\[图片\d+\]: (https?:\/\/[^\s]+)/g, function(match, url) {
                    return '<div style="margin:4px 0"><img src="' + url + '" style="max-width:100%;max-height:200px;border-radius:4px;border:1px solid rgba(255,255,255,.1);" onerror="this.style.display=\'none\'" /></div>';
                });
                html = html.replace(/^(\d+\.) (.+)$/gm, '<span style="color:rgba(165,180,252,.9);font-weight:600;">$1</span> $2');
                html = html.replace(/^([A-G])\. (.+)$/gm, '<span style="color:rgba(94,234,212,.8);font-weight:500;">$1.</span> $2');
                html = html.replace(/^(# .+)$/gm, '<span style="color:rgba(245,210,70,.9);font-weight:600;">$1</span>');
                view.innerHTML = html;
                console.log('[AI智脑Pro复制] view已渲染，innerHTML长度:', view.innerHTML.length);
            } else {
                console.warn('[AI智脑Pro复制] 未找到 view 元素!');
            }
        });
    }, true);

    function cxaiTitleToText(node) {
        if (!node) return '';
        var imgPlaceholders = [];
        var imgs = node.querySelectorAll('img');
        for (var ii = 0; ii < imgs.length; ii++) {
            var src = imgs[ii].getAttribute('data-src') || imgs[ii].getAttribute('data-original') || imgs[ii].getAttribute('data-lazy') || imgs[ii].src || '';
            if (src && src.indexOf('data:') !== 0 && src.indexOf('http') !== -1) {
                imgPlaceholders.push(' [图片:' + src + '] ');
            }
        }
        // 优先用 innerText 保留可见文本结构，回退到 textContent
        var text = (node.innerText || node.textContent || '').replace(/\s+/g, ' ').trim();
        if (imgPlaceholders.length > 0) {
            text = text + imgPlaceholders.join('');
        }
        return text;
    }
    function cxaiExtractImgsFromText(text) {
        if (!text) return [];
        var matches = text.match(/\[图片:(https?:\/\/[^\]]+)\]/g) || [];
        return matches.map(function(s) {
            var m = s.match(/\[图片:(.+)\]/);
            return m ? m[1] : null;
        }).filter(Boolean);
    }
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
    function cxaiExtractQuestionsFromDoc(doc) {
        var questions = [];
        var timuContainers = Array.prototype.slice.call(doc.querySelectorAll('.TiMu'));
        if (timuContainers.length > 0) {
            timuContainers.forEach(function (box) {
                var titleNode = box.querySelector('.Zy_TItle .fontLabel, .Zy_Title .fontLabel, .newZy_TItle .fontLabel, .newZy_Title .fontLabel')
                    || box.querySelector('.Zy_TItle, .Zy_Title, .newZy_TItle, .newZy_TTitle');
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
                var containerImgs = cxaiExtractContainerImgs(box, titleNode, ul);
                containerImgs.forEach(function(url) {
                    if (titleImgs.indexOf(url) === -1) {
                        title += ' [图片:' + url + ']';
                        titleImgs.push(url);
                    }
                });
                var _seenImg = {}; titleImgs = titleImgs.filter(function(u) { if (_seenImg[u]) return false; _seenImg[u] = true; return true; });
                questions.push({ title: title, options: options, images: titleImgs });
            });
            if (questions.length > 0) return questions;
        }
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
        var primarySelectors = [
            '.Zy_TItle .fontLabel', '.Zy_Title .fontLabel',
            '.newZy_TItle .fontLabel', '.newZy_TTitle .fontLabel',
            '[class*="Zy_"][class*="TItle"] .fontLabel',
            '[class*="Zy_"][class*="Title"] .fontLabel',
            '.mark_name',
            '.Py-mian-T'
        ];
        var fallbackSelectors = ['.Zy_TItle', '.Zy_Title', '.newZy_TItle', '.newZy_TTitle', '.mark_name', '.Py-mian-T'];
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
        if (questions.length === 0) {
            var body = doc.body;
            if (body) {
                var fullText = body.innerText || body.textContent || "";
                var qPattern = /(?:^|\n)\s*(\d+)\s*[.．、]\s*[\[【]?(单选题|多选题|判断题|填空题|简答题|论述题|名词解释|翻译题|写作题|选择题|不定项选择)[】\]]?\s*\n?([\s\S]*?)(?=(?:^|\n)\s*\d+\s*[.．、]\s*[\[【]?(?:单选题|多选题|判断题|填空题|简答题|论述题|名词解释|翻译题|写作题|选择题|不定项选择)|$)/g;
                var m;
                while ((m = qPattern.exec(fullText)) !== null) {
                    var qNum = m[1];
                    var qType = m[2];
                    var qBody = m[3] || "";
                    if (qBody.trim().length < 3) continue;
                    var optMatches = qBody.match(/(?:^|\n)\s*([A-G])\s*[.．、\s]\s*(.+)/g);
                    var opts = [];
                    var titleText = qBody;
                    if (optMatches && optMatches.length >= 2) {
                        opts = optMatches.map(function(line) {
                            var om = line.trim().match(/^([A-G])\s*[.．、\s]\s*(.+)/);
                            return om ? om[1] + ". " + om[2].trim() : null;
                        }).filter(Boolean);
                        var firstOptIdx = qBody.indexOf(optMatches[0].trim());
                        titleText = qBody.substring(0, firstOptIdx).trim();
                    }
                    titleText = titleText.replace(/^\s*\n?/, "").trim();
                    if (titleText.length > 2) {
                        questions.push({ title: titleText, options: opts, type: qType, images: [] });
                    }
                }
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
    function cxaiExtractByWalkingDOM(doc) {
        var questions = [];
        if (!doc || !doc.body) return questions;
        var allEls = doc.body.querySelectorAll('*');
        for (var i = 0; i < allEls.length; i++) {
            var el = allEls[i];
            if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'NOSCRIPT') continue;
            // 不跳过隐藏元素（任务点完成后题目可能被 display:none，但仍需可复制）
            var t = el.textContent || '';
            if (t.length < 10) continue;
            var optCount = (t.match(/(?:^|\n)\s*[A-D]\s*[.．、]\s*\S/g) || []).length;
            if (optCount >= 2) {
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
        console.log('[AI智脑Pro复制] doc=' + (doc.title || doc.location?.href || 'unknown') + ' 提取到 ' + questions.length + ' 道题');
        if (questions.length > 0) {
            sections.push({ header: header || doc.title || '', questions: questions });
        }
        var frames = Array.prototype.slice.call(doc.querySelectorAll('iframe'));
        console.log('[AI智脑Pro复制] 找到 ' + frames.length + ' 个 iframe，尝试递归...');
        for (var fi = 0; fi < frames.length; fi++) {
            var frame = frames[fi];
            try {
                var fdoc = frame.contentDocument || (frame.contentWindow && frame.contentWindow.document);
                if (fdoc && fdoc.body) {
                    console.log('[AI智脑Pro复制] iframe[' + fi + '] 可访问，src=' + (frame.src || 'none').slice(0, 80));
                    sections = sections.concat(cxaiCollectFromDoc(fdoc));
                }
            } catch (err) {
                console.log('[AI智脑Pro复制] iframe[' + fi + '] 跨域无法访问: ' + (frame.src || 'none').slice(0, 80));
            }
        }
        return sections;
    }
    function cxaiCollectAllQuestions() {
        return new Promise(function (resolve) {
            var sections = cxaiCollectFromDoc(document);
            var totalQ = 0;
            sections.forEach(function(s) { if (s.questions) totalQ += s.questions.length; });
            if (totalQ === 0) {
                setTimeout(function () {
                    var retry = cxaiCollectFromDoc(document);
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
                var seenTitles = {}; // 全局去重：同一题目只保留第一次提取的结果
                sections.forEach(function (section) {
                    if (section.questions && section.questions.length) {
                        if (section.header) {
                            lines.push('# ' + section.header);
                            lines.push('');
                        }
                        section.questions.forEach(function (q, idx) {
                            var titleKey = (q.title || '').substring(0, 40).trim();
                            if (titleKey && seenTitles[titleKey]) return; // 跳过重复题目
                            if (titleKey) seenTitles[titleKey] = true;
                            lines.push((idx + 1) + '. ' + q.title);
                            // 图片去重：标题里已经包含的图片不再单独输出一行
                            var titleImgUrls = [];
                            if (q.title) {
                                var imgMatches = q.title.match(/\[图片:(https?:\/\/[^\]]+)\]/g) || [];
                                imgMatches.forEach(function(m) {
                                    var url = m.replace(/^\[图片:/, '').replace(/\]$/, '');
                                    if (url) titleImgUrls.push(url);
                                });
                            }
                            if (q.images && q.images.length) {
                                var seenImgs = {};
                                q.images.forEach(function(imgUrl) {
                                    if (!seenImgs[imgUrl]) {
                                        seenImgs[imgUrl] = true;
                                        // 如果标题里已经包含了该图片，只记录到 allImages，不重复输出到 lines
                                        if (titleImgUrls.indexOf(imgUrl) === -1) {
                                            allImages.push(imgUrl);
                                            lines.push('[图片] ' + imgUrl);
                                        } else {
                                            allImages.push(imgUrl); // 图片仍需复制，但不重复打印
                                        }
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
    function cxaiCopyToClipboard(text, html) {
        return new Promise(function (resolve, reject) {
            if (navigator.clipboard && navigator.clipboard.write) {
                var htmlBlob = new Blob([html || text], { type: 'text/html' });
                var textBlob = new Blob([text], { type: 'text/plain' });
                var item = new ClipboardItem({
                    'text/html': htmlBlob,
                    'text/plain': textBlob
                });
                navigator.clipboard.write([item]).then(resolve).catch(function () {
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
    var _cxaiCopyToastTimer = null;
    function cxaiShowCopyToast(msg) {
        var doc;
        try { doc = top.document; } catch (_) { doc = document; }
        var old = doc.getElementById('cxai-copy-toast');
        if (old) old.remove();
        if (_cxaiCopyToastTimer) { clearTimeout(_cxaiCopyToastTimer); _cxaiCopyToastTimer = null; }
        var el = doc.createElement('div');
        el.id = 'cxai-copy-toast';
        el.textContent = msg;
        el.style.cssText = 'position:fixed;left:50%;top:24px;transform:translateX(-50%);background:rgba(0,0,0,.78);color:#fff;padding:8px 16px;border-radius:6px;font-size:13px;z-index:100001;pointer-events:none;';
        doc.body.appendChild(el);
        _cxaiCopyToastTimer = setTimeout(function () { el.remove(); _cxaiCopyToastTimer = null; }, 1800);
    }
    window.cxaiTriggerCopyFlow = function() {
        cxai_logger('📋 开始复制题目流程...', 'info');
        _ensureFontDecrypted().then(function () {
            cxai_logger('📋 字体解密完成，等待 iframe...', 'gray');
            return _waitForAllIframes(document);
        }).then(function () {
            cxai_logger('📋 开始收集题目...', 'gray');
            return cxaiCollectAllQuestions();
        }).then(function (result) {
            var content = result.text || '';
            var images = result.images || [];
            cxai_logger('📋 题目收集完成，内容长度: ' + content.length, 'gray');
            if (!content || !content.trim()) {
                cxaiShowCopyToast('未找到题目');
                cxai_logger('📋 未找到题目内容', 'warn');
                return;
            }
            if (_isCopyModalPage()) _showOverlay();
            var _copyDoc;
            try { _copyDoc = top.document; } catch(_) { _copyDoc = document; }
            var _ta = _copyDoc.getElementById('cxai-copy-modal-textarea');
            if (_ta) _ta.value = content;
            var view = _copyDoc.getElementById('cxai-copy-modal-view');
            if (view) {
                var html = content.replace(/\[图片:(https?:\/\/[^\]]+)\]/g, function(match, url) {
                    return '<div style="margin:4px 0;display:inline-block;"><img src="' + url + '" style="max-width:100%;max-height:200px;border-radius:4px;border:1px solid rgba(255,255,255,.1);" onerror="this.style.display=\'none\'" /></div>';
                });
                html = html.replace(/\[图片\d+\]: (https?:\/\/[^\s]+)/g, function(match, url) {
                    return '<div style="margin:4px 0"><img src="' + url + '" style="max-width:100%;max-height:200px;border-radius:4px;border:1px solid rgba(255,255,255,.1);" onerror="this.style.display=\'none\'" /></div>';
                });
                html = html.replace(/^(\d+\.) (.+)$/gm, '<span style="color:rgba(165,180,252,.9);font-weight:600;">$1</span> $2');
                html = html.replace(/^([A-G])\. (.+)$/gm, '<span style="color:rgba(94,234,212,.8);font-weight:500;">$1.</span> $2');
                html = html.replace(/^(# .+)$/gm, '<span style="color:rgba(245,210,70,.9);font-weight:600;">$1</span>');
                view.innerHTML = html;
                cxai_logger('📋 题目已渲染到弹窗', 'success');
            } else {
                cxai_logger('📋 未找到弹窗视图元素 #cxai-copy-modal-view', 'warn');
            }
        }).catch(function(err) {
            cxaiShowCopyToast('复制失败: ' + (err && err.message || 'unknown'));
            cxai_logger('📋 复制失败: ' + (err && err.message || 'unknown'), 'error');
        });
    };
    // 复制按钮在 top.document 中，点击时在 top.window 作用域查找函数；同步到 top 确保跨 iframe 可调用
    try { if (top && top !== window) top.cxaiTriggerCopyFlow = window.cxaiTriggerCopyFlow; } catch(_) {}
})();

// 全局暂停状态：true 时停止所有刷课和答题（使用 localStorage 跨 iframe 共享）
function cxai_isPaused() {
    return localStorage.getItem('cxaiSetting._cxaiPaused') === 'true';
}
function cxai_setPaused(val) {
    localStorage.setItem('cxaiSetting._cxaiPaused', val ? 'true' : 'false');
    // 同步当前窗口 / top 窗口的暂停 UI（面板可能挂载在 iframe 中）
    try {
        var _root = document.getElementById('cxai-float-root');
        if (!_root) {
            try { _root = top.document.getElementById('cxai-float-root'); } catch (_) { _root = null; }
        }
        if (!_root) {
            _root = document.querySelector('#cxai-float-root');
        }
        if (_root) {
            var _dot = _root.querySelector('.cxai-status-dot');
            if (_dot) {
                if (val) { _dot.classList.add('paused'); } else { _dot.classList.remove('paused'); }
            }
        }
        var _btn = document.getElementById('cxai-pause-pill-btn');
        if (!_btn) {
            try { _btn = top.document.getElementById('cxai-pause-pill-btn'); } catch (_) { _btn = null; }
        }
        if (!_btn) {
            _btn = document.querySelector('#cxai-pause-pill-btn');
        }
        if (_btn) {
            if (val) {
                _btn.classList.add('paused');
                _btn.innerHTML = '▶';
                _btn.title = '当前已暂停，点击继续所有刷课和答题任务';
            } else {
                _btn.classList.remove('paused');
                _btn.innerHTML = '⏸';
                _btn.title = '暂停/继续所有刷课和答题任务';
            }
        }
    } catch (e) { /* 忽略 */ }
    // 恢复时主动重启任务循环，避免"恢复后不刷"
    if (!val) {
        if (_cxaiResumeTimer) clearTimeout(_cxaiResumeTimer);
        _cxaiResumeTimer = setTimeout(function() {
            _cxaiResumeTimer = null;
            try {
                if (cxai_isPaused()) {
                    cxai_logger('恢复取消：当前仍为暂停状态', 'warn');
                    return;
                }
            cxai_logger('▶ 任务已恢复，继续答题...', 'success');
            _cxaiPauseMsgShown = false;
            // 检测当前是否在作业/考试页面：URL 或 DOM 元素
            var _curHref = window.location.href || '';
            var _isWorkPage = /doHomeWork|examPaper|readPaper|dowork/i.test(_curHref);
            // DOM 检测（兼容 iframe 上下文）
            if (!_isWorkPage) {
                try {
                    var _formEls = document.querySelectorAll('.Wrappadding form, .zquestions, .Py-mian1');
                    if (_formEls.length > 0) _isWorkPage = true;
                } catch (e) {}
            }
            if (_isWorkPage) {
                // 答题循环（cxai_startDoQuizTimu）有自己的暂停重试循环，会自动继续，不需要干预
                cxai_logger('答题页面检测到，答题循环将自动恢复', 'gray');
            } else if (cxai_mlist && cxai_mlist.length > 0) {
                // 题目列表已就绪，直接继续答题
                if (typeof cxai_missonStart === 'function') cxai_missonStart();
            } else if (_l.pathname.includes('/knowledge/cards')) {
                // 题目列表尚未解析（如刚进入页面 / 容器未加载完），重新初始化而非误判"任务处理完毕"跳页
                cxai_logger('任务列表为空，重新解析章节页面...', 'warn');
                cxai_startCardsPage();
            } else {
                // 其他页面类型：如果任务列表为空不调 missonStart（会误判为处理完毕触发跳页），静默恢复
                cxai_logger('非答题页面，恢复完成', 'gray');
            }
            } catch (e) {
                cxai_logger('恢复失败，请重试', 'error');
            }
        }, 800);
    }
}
// 兼容旧代码的变量别名
var _cxaiPaused = false;
var _cxaiPauseMsgShown = false;

// 颜色映射表（提前定义，避免变量提升问题）
var _cxaiLogColorMap = {
    red: '#dc2626', green: '#059669', blue: '#2563eb',
    yellow: '#ca8a04', orange: '#ea580c', purple: '#7c3aed',
    pink: '#db2777', gray: '#64748b', grey: '#64748b'
};

// 自动登录配置
var cxai_autoLogin = {
    enabled: false,
    phone: '',
    password: ''
};

function cxai_autoLoginDo() {
    if (!cxai_autoLogin.enabled) return;
    var $phone = $('#phone');
    var $pwd = $('#pwd');
    if ($phone.length && $pwd.length) {
        $phone.val(cxai_autoLogin.phone);
        $pwd.val(cxai_autoLogin.password);
        $('a.login_btn').click();
        cxai_logger('自动登录已提交', 'green');
    }
}


try { $('.navshow').find('a:contains(体验新版)')[0] ? $('.navshow').find('a:contains(体验新版)')[0].click() : ''; } catch (e) { /* ignore */ }


// ── 提前定义的函数（ScriptCat hoisting 兼容）──

var _cxaiFontTableCache = null;

function cxai_decryptFont() {
    var font = null;
    var $tip = $('style:contains(font-cxsecret)');
    if (!$tip.length) { return; }
    var fontMatch = $tip.text().match(/base64,([\w\W]+?)'/);
    if (!fontMatch || !fontMatch[1]) { console.warn('[AI智脑Pro] cxai_decryptFont: 未找到字体 base64 数据'); return; }
    font = Typr.parse(cxai_base64ToUint8Array(fontMatch[1]));
    if (!font || !font[0]) { console.warn('[AI智脑Pro] cxai_decryptFont: 字体解析失败'); return; }
    font = font[0];
    var tableText = GM_getResourceText('Table');
    if (!tableText && !_cxaiFontTableCache) {
        console.warn('[AI智脑Pro] 字体映射表(@resource)加载失败，尝试直接获取...');
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
    console.log('[AI智脑Pro] 字体解密: 映射表 ' + matchCount + ' 个字符, 待解密元素 ' + $('.font-cxsecret').length + ' 个');
    if (matchCount === 0) { console.warn('[AI智脑Pro] 字体解密: 映射表为空，可能是字体映射表(CDN)加载失败'); return; }
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
    var _fontTableUrls = [
        'https://116611.xyz/table.json?_=' + Date.now(),
        'https://www.forestpolice.org/ttf/2.0/table.json?_=' + Date.now()
    ];
    var _tryIdx = 0;
    function _tryNext() {
        if (_tryIdx >= _fontTableUrls.length) {
            console.warn('[AI智脑Pro] 所有字体映射表源均失败');
            return;
        }
        var url = _fontTableUrls[_tryIdx++];
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*'
            },
            timeout: 10000,
            onload: function (r) {
                if (r.status === 200 && r.responseText && r.responseText.length > 100) {
                    _cxaiFontTableCache = r.responseText;
                    try { cxai_decryptFont(); } catch (e) { console.warn('[AI智脑Pro] 重试解密失败:', e); }
                } else {
                    _tryNext();
                }
            },
            onerror: function () { _tryNext(); },
            ontimeout: function () { _tryNext(); }
        });
    }
    _tryNext();
}

function cxai_base64ToUint8Array(base64) {
    var data = window.atob(base64);
    var buffer = new Uint8Array(data.length);
    for (var i = 0; i < data.length; ++i) {
        buffer[i] = data.charCodeAt(i);
    }
    return buffer;
}


function cxai_waitForJQueryElement(selector, timeout) {
    timeout = timeout || 30000; // 默认30秒超时
    return new Promise(function (resolve, reject) {
        if ($(selector).length > 0) return resolve();
        var elapsed = 0;
        var interval = setInterval(function () {
            elapsed += 500;
            if ($(selector).length > 0) {
                clearInterval(interval);
                resolve();
            } else if (elapsed >= timeout) {
                clearInterval(interval);
                cxai_logger('等待元素超时: ' + selector, 'red');
                reject(new Error('waitForElement timeout: ' + selector));
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
    } else {
        if (!_cxaiPasteBypassEnabled) return;
        _cxaiPasteBypassEnabled = false;
        document.removeEventListener('paste', _cxaiOnPasteBypass, true);
        if (_cxaiPasteBypassStyleEl) { try { _cxaiPasteBypassStyleEl.remove(); } catch (_) {} _cxaiPasteBypassStyleEl = null; }
        cxai_logger('粘贴限制绕过已关闭', 'gray');
    }
}

function cxaiInitPasteBypass() {
    // 跨 iframe 防重复：只在顶层文档执行一次注入
    try {
        if (top !== window) return;
        if (top._cxaiPasteInjected) return;
        top._cxaiPasteInjected = true;
    } catch (_) { /* 跨域降级：当前文档标记 */ }
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
                    if (!UE.instants.hasOwnProperty(key)) continue;
                    var editor = UE.instants[key];
                    if (!editor) continue;
                    try { editor.removeListener('beforepaste', window.editorPaste); } catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }
                    try { editor.addListener('beforepaste', function () { return true; }); } catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }
                    if (editor.iframe) {
                        var doc = null;
                        try { doc = editor.iframe.contentDocument; } catch (_) {}
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
                    if (!codeEditors.hasOwnProperty(eid)) continue;
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





try { cxaiCfg.decrypt ? cxai_decryptFont() : ''; } catch (e) { console.warn('[AI智脑Pro] cxai_decryptFont error:', e); }

try { cxaiInitPasteBypass(); } catch (e) { console.warn('[AI智脑Pro] pasteBypass error:', e); }


// ← 隐藏面板 / → 显示面板（快捷键）
function _cxaiToggleBox(show) {
    var root = document.getElementById('cxai-float-root');
    if (!root) return;
    if (show) {
        root.classList.remove('hidden-by-f9');
        localStorage.setItem('cxaiSetting.boxHidden', 'false');
        var hint = document.getElementById('cxai-restore-hint');
        if (hint) hint.remove();
    } else {
        root.classList.add('hidden-by-f9');
        localStorage.setItem('cxaiSetting.boxHidden', 'true');
        if (!document.getElementById('cxai-restore-hint')) {
            var _hintDoc;
            try { _hintDoc = top.document; } catch(_) { _hintDoc = document; }
            var hintEl = _hintDoc.createElement('div');
            hintEl.id = 'cxai-restore-hint';
            hintEl.textContent = '已隐藏 — 按 → 键恢复';
            hintEl.style.cssText = 'position:fixed;top:10px;right:10px;background:rgba(30,30,46,.92);color:rgba(200,220,255,.9);padding:8px 16px;border-radius:8px;font-size:12px;z-index:99998;border:1px solid rgba(165,180,252,.2);backdrop-filter:blur(10px);';
            _hintDoc.body.appendChild(hintEl);
            setTimeout(function() { if (hintEl.parentNode) hintEl.remove(); }, 3000);
        }
    }
}
$(document).on('keydown.cxaiArrow', function (e) {
    if (e.keyCode === 37) _cxaiToggleBox(false);  // ← 隐藏
    if (e.keyCode === 39) _cxaiToggleBox(true);   // → 显示
});
try {
    if (top !== window) {
        $(top.document).on('keydown.cxaiArrow', function (e) {
            if (e.keyCode === 37) _cxaiToggleBox(false);
            if (e.keyCode === 39) _cxaiToggleBox(true);
        });
    }
} catch (_) { /* empty */ }

// F9 快捷键显示/隐藏面板（）
function cxaiToggleBoxVisibility() {
    var root = document.getElementById('cxai-float-root');
    // 如果当前在 iframe 中，尝试在顶层文档中查找
    if (!root && top && top.document) {
        try { root = top.document.getElementById('cxai-float-root'); } catch (_) { root = null; }
    }
    if (!root) return;
    root.classList.toggle('hidden-by-f9');
    var hidden = root.classList.contains('hidden-by-f9');
    localStorage.setItem('cxaiSetting.boxHidden', hidden ? 'true' : 'false');
}
$(document).on('keydown.cxaiF9', function (e) {
    if (e.keyCode === 120) cxaiToggleBoxVisibility();
});
try {
    if (top !== window) {
        $(top.document).on('keydown.cxaiF9', function (e) {
            if (e.keyCode === 120) cxaiToggleBoxVisibility();
        });
    }
} catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }


// 章节答题页面初始化：解析 $mArg 任务点，等待题目容器加载后启动答题循环
// 同时供「脚本加载时自动启动」与「恢复/启动按钮」复用，配合 _cxaiInitPending 防重复触发
function cxai_startCardsPage() {
    if (_cxaiInitPending) return; // 已有初始化进行中，避免重复等待/重复启动
    _cxaiInitPending = true;
    var params = cxai_getTaskParams();
    var parsedParams = null;
    if (params && params !== '$mArg') {
        try { parsedParams = $.parseJSON(params); } catch (e) { parsedParams = null; }
    }
    if (!parsedParams || !parsedParams['attachments'] || parsedParams['attachments'].length <= 0) {
        _cxaiInitPending = false;
        cxai_logger('无任务点可处理，即将跳转页面', 'red');
        return cxai_toNext();
    }
    cxai_waitForJQueryElement('.wrap .ans-cc .ans-attach-ct').then(function () {
        _cxaiInitPending = false;
        try { top.checkJob ? top.checkJob = () => false : true; } catch (_) { /* 跨域降级 */ }
        _domList = [];
        cxai_mlist = parsedParams['attachments'];
        _defaults = parsedParams['defaults'];
        $.each($('.wrap .ans-cc .ans-attach-ct'), (i, t) => {
            _domList.push($(t).find('iframe'));
        });
        cxai_missonStart();
    }).catch(function (e) {
        _cxaiInitPending = false;
        cxai_logger('等待题目容器超时，未找到 .wrap .ans-cc .ans-attach-ct：' + (e && e.message), 'error');
    });
}

if (_l.pathname.includes('/mycourse/studentstudy')) {
    try { cxai_showBox() } catch(e) { console.warn('[AI智脑Pro] cxai_showBox 异常:', e.message) }
    var _topDoc;
    try { _topDoc = top.document; } catch (_) { _topDoc = document; }
    // 清理占位消息（仅面板 log-panel）
    var el = _topDoc.getElementById('cxai-log-panel');
    if (el) {
        var placeholder = el.querySelector('.cxai-log-msg');
        if (placeholder && placeholder.textContent.indexOf('等待题目加载') !== -1) {
            placeholder.parentElement.remove();
        }
    }
    var logPanel = _topDoc.getElementById('cxai-log-panel');
    if (logPanel) {
        var initLine = _topDoc.createElement('div');
        initLine.className = 'cxai-log-line';
        initLine.innerHTML = '<span class="cxai-log-time">' + new Date().toLocaleTimeString() + '</span><span class="cxai-log-msg info">初始化完毕！</span>';
        logPanel.appendChild(initLine);
    }
    cxai_setupAntiSleep()
    cxai_setupAutoRefresh()

    // 自动开始：尝试点击第一个未完成的章节（如果当前没有打开章节）
    setTimeout(function () {
        var hasIframe = false;
        try {
            for (var i = 0; i < window.frames.length; i++) {
                var f = window.frames[i];
                var doc = null;
                try { doc = f.document || f.contentDocument; } catch (_) {}
                if (doc && doc.querySelector('.ans-attach-ct, .ans-job-ct, .chapter-item')) {
                    hasIframe = true; break;
                }
            }
        } catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }
        if (!hasIframe) {
            var clicked = cxai_clickFirstUnfinishedChapter();
            if (clicked) {
                cxai_logger('已自动打开第一个未完成章节', 'green');
            }
            // 静默跳过：页面可能正在加载，或用户已手动进入章节，无需刷屏警告
        }
    }, 2000);

    // 用计数器 + URL 跟踪做二次确认后自动跳转下一章节（）
    var _cxaiBlankSectionChecks = 0;
    var _cxaiLastBlankSectionUrl = '';
    var _cxaiBlankSkipping = false;
    setInterval(function () {
        if (localStorage.getItem('cxaiSetting._cxaiPaused') === 'true') return;
        var cardsDoc = null;
        try {
            for (var i = 0; i < window.frames.length; i++) {
                var f = window.frames[i];
                var doc = null;
                try { doc = f.document || f.contentDocument; } catch (_) {}
                if (doc && doc.querySelector('.ans-attach-ct, .ans-job-ct, .chapter-item')) {
                    cardsDoc = doc; break;
                }
            }
        } catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }
        if (!cardsDoc) {
            // 没有检测到已打开的章节页面，静默跳过（避免刷屏）
            return;
        }
        var unfinished = cardsDoc.querySelectorAll('.ans-attach-ct:not(.ans-job-finished), .ans-job-ct:not(.ans-job-finished)');
        if (unfinished.length > 0) {
            _cxaiBlankSectionChecks = 0;
            _cxaiLastBlankSectionUrl = '';
            return;
        }
        var currentUrl = '';
        try { currentUrl = window.location.href; } catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }
        if (currentUrl === _cxaiLastBlankSectionUrl && _cxaiBlankSkipping) return;
        _cxaiBlankSectionChecks++;
        _cxaiLastBlankSectionUrl = currentUrl;
        if (_cxaiBlankSectionChecks >= 3) {
            _cxaiBlankSkipping = true;
            cxai_logger('章节任务均已完成，准备跳转下一章节', 'green');
            setTimeout(function () { cxai_toNext(); }, 2000);
            setTimeout(function () { _cxaiBlankSkipping = false; }, 5000);
        }
    }, 5000);

} else if (_l.pathname.includes('/knowledge/cards')) {
    cxai_setupAntiSleep();
    try { cxai_showBox() } catch(e) { console.warn('[AI智脑Pro] cxai_showBox 异常:', e.message) }
    cxai_startCardsPage();
} else if (_l.pathname.includes('/exam/test/reVersionTestStartNew')) {
    try { cxai_showBox() } catch(e) { console.warn('[AI智脑Pro] cxai_showBox 异常:', e.message) }
    cxai_waitForJQueryElement('.mark_table .whiteDiv').then(function () { cxai_missonExam() }).catch(function(e){console.warn("[AI智脑Pro] Promise异常:",e.message)});
} else if (_l.pathname.includes('/mooc2/exam/preview')) {
    try { cxai_showBox() } catch(e) { console.warn('[AI智脑Pro] cxai_showBox 异常:', e.message) }
    cxai_waitForJQueryElement('.mark_table .questionLi').then(function () { cxai_missonExamPreview() }).catch(function(e){console.warn("[AI智脑Pro] Promise异常:",e.message)});
} else if (_l.pathname.includes('/mooc2/work/dowork')) {
    try { cxai_showBox() } catch(e) { console.warn('[AI智脑Pro] cxai_showBox 异常:', e.message) }
    cxai_waitForJQueryElement('.mark_table form').then(function () { cxai_missonHomeWork() }).catch(function(e){console.warn("[AI智脑Pro] Promise异常:",e.message)});
} else if (_l.pathname.includes('/work/phone/doHomeWork')) {
    var _oldal = cxai_w.alert
    cxai_w.alert = function (msg) {
        if (msg === '保存成功') {
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
} else if (_l.pathname === '/mycourse/stu') {
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
            console.log('[AI智脑Pro] 多选点击验证通过，' + indices.length + '个选项全部选中');
        } else {
            console.log('[AI智脑Pro] 多选点击验证：' + missed.length + '个选项未选中，补选中...');
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
            console.log('[AI智脑Pro匹配] 数字索引直接命中: 答案"' + answerStr + '" → 选项[' + numIdx + '] = "' + optionsArr[numIdx] + '"');
            return numIdx;
        }
    }
    // 文本精确匹配
    var _i = optionsArr.findIndex(function (item) { return item === answerStr; });
    if (_i !== -1) return _i;
    // ★ 去标点精确匹配（解决 AI 返回答案缺少末尾标点的问题）
    var _stripPunc = function(s) { return s.replace(/[。，、；：！？…·""''【】（）《》\.\,\;\!\?\:\'\"\(\)\[\]\<\>\n\r\t\s　～~—\-–​‌‍﻿]/g, '').trim(); };
    var _strippedAnswer = _stripPunc(answerStr);
    if (_strippedAnswer.length > 0) {
        var _j = optionsArr.findIndex(function (item) { return _stripPunc(item) === _strippedAnswer; });
        if (_j !== -1) {
            console.log('[AI智脑Pro匹配] 去标点匹配命中: 答案"' + answerStr + '" → 选项[' + _j + '] = "' + optionsArr[_j] + '"');
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
    // ★ 答案以 "C. 选项文本" / "C、选项文本" 形式给出，且剩余文本与该选项匹配
    var _leadMatch = answerStr.match(/^([A-Ga-g])[.、。,，;；:：\)\]）】\s]+(.+)$/);
    if (_leadMatch && optionsArr && optionsArr.length > 0) {
        var _leadIdx = _leadMatch[1].toUpperCase().charCodeAt(0) - 65;
        var _leadRest = _stripPunc(_leadMatch[2]);
        if (_leadIdx >= 0 && _leadIdx < optionsArr.length && _leadRest.length > 0) {
            var _leadOptNorm = _stripPunc(optionsArr[_leadIdx]);
            if (_leadOptNorm && (_leadRest === _leadOptNorm || _leadOptNorm.indexOf(_leadRest) !== -1 || _leadRest.indexOf(_leadOptNorm) !== -1)) {
                cxai_logger('字母+选项文本匹配: ' + answerStr + ' → 选项[' + _leadIdx + ']', 'blue');
                return _leadIdx;
            }
        }
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
            console.log('[AI智脑Pro匹配] 多选数字索引直接命中: "' + answerStr + '"' + (_cleaned !== answerStr ? ' (清洗后: "' + _cleaned + '")' : '') + ' → 选项' + JSON.stringify(nums));
            return nums;
        }
    }

    // ★ 优先：字母索引匹配（处理 "A|B|C"、"A、B、C"、"ABC"、"A B C" 等字母格式）
    // 安全检查：只有当答案在去除分隔符和空格后仅含字母时才使用字母索引（避免误判含中文的文本答案）
    var _letterIdx = cxaiExtractLetterIndices(answerStr, optionsArr.length);
    var _answerLettersOnly = answerStr.replace(/[\|｜\n;；,，、\s]/g, '');
    if (_letterIdx && _letterIdx.length > 1 && /^[A-Za-z]+$/.test(_answerLettersOnly)) {
        // 多个字母且纯字母 → 直接返回多选索引（如 "ABC" → [0,1,2]，"A|C" → [0,2]）
        console.log('[AI智脑Pro匹配] 多选字母索引直接命中: "' + answerStr + '" → 选项' + JSON.stringify(_letterIdx));
        return _letterIdx;
    }

    var _stripPunc = function(s) { return s.replace(/[。，、；：！？…·""''【】（）《》\.\,\;\!\?\:\'\"\(\)\[\]\<\>\n\r\t\s　～~—\-–​‌‍﻿]/g, '').trim(); };

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
                    console.log('[AI智脑Pro匹配] 片段字母索引命中: "' + part + '" → 选项' + _li);
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
                        console.log('[AI智脑Pro匹配] 短答案"' + part + '"匹配' + _hitCount + '个选项，跳过包含匹配，交给模糊匹配处理');
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
                    console.log('[AI智脑Pro匹配] 片段模糊匹配: "' + part + '" → 选项' + bestIdx + ' 相似度=' + (bestScore * 100).toFixed(1) + '%');
                }
            }
        }
        if (matched.length > 0) {
            console.log('[AI智脑Pro匹配] 分隔符拆分匹配命中(多选): "' + answerStr + '" → 拆分' + _parts.length + '段 → 匹配' + matched.length + '个 → 选项' + JSON.stringify(matched));
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
        console.log('[AI智脑Pro匹配] 去标点匹配命中(多选): "' + answerStr + '" → 选项' + JSON.stringify(matched));
        return matched;
    }
    // 单字母答案回退（如 "B" 可能是单选但走到多选逻辑的情况）
    if (_letterIdx && _letterIdx.length > 0) {
        console.log('[AI智脑Pro匹配] 字母索引回退(多选): ' + answerStr + ' → 选项' + JSON.stringify(_letterIdx));
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


// 全角→半角标点统一（仅映射常见标点，避免误伤中文内容）
function cxai_normalizePunct(s) {
    if (!s) return s;
    var map = {'，':',', '。':'.', '；':';', '：':':', '！':'!', '？':'?', '、':',', '\u3000':' '};
    var r = s;
    for (var k in map) { if (!map.hasOwnProperty(k)) continue; r = r.split(k).join(map[k]); }
    return r;
}

// 答案文本归一化：全角→半角 + 常见技术后缀 stripping
function cxai_normalizeAnswer(s) {
    if (!s) return '';
    var r = cxai_normalizePunct(String(s));
    // 去掉末尾常见技术冗余后缀（方式/方法/技术/协议/机制）
    var _sufs = ['方式', '方法', '技术', '协议', '机制'];
    for (var i = 0; i < _sufs.length; i++) {
        var _suf = _sufs[i];
        if (r.length > _suf.length && r.indexOf(_suf, r.length - _suf.length) !== -1) {
            r = r.substring(0, r.length - _suf.length);
            break;
        }
    }
    return r.toLowerCase().replace(/[\s　]+/g, '').trim();
}

function cxai_findBestFuzzyMatch(optionTexts, aiAnswer, threshold, silent) {
    if (!cxai_isFuzzyMatchEnabled()) return -1;
    if (!aiAnswer || !optionTexts || optionTexts.length === 0) return -1;
    threshold = (threshold !== undefined) ? threshold : 0.5;
    var ansNorm = cxai_normalizeAnswer(aiAnswer);
    var bestIndex = -1, bestScore = 0;
    for (var i = 0; i < optionTexts.length; i++) {
        var optNorm = cxai_normalizeAnswer(optionTexts[i].replace(/^[A-Z]\s*/, ''));
        var score = cxai_stringSimilarity(optNorm, ansNorm);
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
        var partNorm = cxai_normalizeAnswer(part);
        var bestIndex = -1, bestScore = 0;
        for (var i = 0; i < optionTexts.length; i++) {
            var optNorm = cxai_normalizeAnswer(optionTexts[i].replace(/^[A-Z]\s*/, ''));
            var score = cxai_stringSimilarity(optNorm, partNorm);
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

// 将当前倍速实时应用到所有正在播放的 video/audio（不等待下一任务）
function cxai_applyRateToCurrentMedia() {
    try {
        var rate = cxai_getRate();
        // 搜索顶层及所有 iframe 中的媒体元素
        var docs = [];
        try { if (top && top.document) docs.push(top.document); } catch (_) { /* top 不可用 */ }
        try {
            var frames = top.frames;
            for (var i = 0; i < frames.length; i++) {
                try { docs.push(frames[i].document); } catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }
            }
        } catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }
        docs.push(document); // 降级：当前文档
        var found = 0;
        docs.forEach(function (doc) {
            if (!doc) return;
            ['video', 'audio'].forEach(function (tag) {
                var media = doc.querySelector(tag);
                if (media && !media.paused) {
                    media.playbackRate = rate;
                    found++;
                }
            });
        });
        if (found > 0) {
            cxai_logger('倍速已实时应用至当前播放媒体（' + rate + '×）', 'green');
        }
    } catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }
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
    // 默认使用当前 document，后续根据面板实际 DOM 位置更新
    var _boxDoc = document;
    // 通用跨 document 查找 fallback：在 _boxDoc / top.document / document 里依次查找，确保控件总能被找到
    function _cxaiFindEl(id) {
        var docs = [_boxDoc];
        try { if (top.document !== _boxDoc) docs.push(top.document); } catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }
        try {
            if (document !== _boxDoc && document !== top.document) docs.push(document);
        } catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }
        for (var i = 0; i < docs.length; i++) {
            var el = docs[i].getElementById(id);
            if (el) return el;
        }
        return null;
    }
    function _cxaiFindAll(selector) {
        var docs = [_boxDoc];
        try { if (top.document !== _boxDoc) docs.push(top.document); } catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }
        try {
            if (document !== _boxDoc && document !== top.document) docs.push(document);
        } catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }
        for (var i = 0; i < docs.length; i++) {
            try {
                var els = docs[i].querySelectorAll(selector);
                if (els && els.length > 0) return els;
            } catch (e) { console.warn("[AI智脑Pro] 异常:", e.message); }
        }
        return []; // 返回空数组而非 null，避免调用方 .forEach 抛出 TypeError 导致后续事件绑定全部丢失
    }
    //公告
    var _noticeInTop;
    try { _noticeInTop = top.document.querySelector('#cxai-notice'); } catch (_) { _noticeInTop = undefined; }
    // #cxai-notice 在面板 box_html 内部，首次注入前 querySelector 返回 null（而非 undefined）。
    // 必须用 == null 同时匹配 null 与 undefined，否则顶层页面下面板永远不渲染。
    if (cxaiCfg.cxai_showBox && _noticeInTop == null) {
        // 注入/更新样式（每次页面加载都刷新，确保 CSS 修改立即生效）
        var _targetDoc = document;
        try { _targetDoc = top.document; } catch (_) { _targetDoc = document; }
        var styleEl = _targetDoc.getElementById('cxai-style');
        if (styleEl) {
            styleEl.remove();  // 先移除旧的，确保浏览器重新解析
        }
        styleEl = _targetDoc.createElement('style');
        styleEl.id = 'cxai-style';
        _targetDoc.head.appendChild(styleEl);
        styleEl.textContent = `
            /* === Dark Glass Side Panel — Raycast/Linear Style === */
            #cxai-float-root{position:fixed;left:0;top:20px;z-index:99999;display:flex;align-items:flex-start;gap:0;user-select:none;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif}
            #cxai-float-root.hidden-by-f9{display:none!important}
            /* Wrapper for trigger + log — vertical stack */
            #cxai-trigger-wrapper{display:flex;flex-direction:column;align-items:flex-end;gap:0;flex-shrink:0}
            /* Trigger Pill */
            #cxai-trigger-pill{width:32px;height:76px;background:rgba(15,15,26,.94);backdrop-filter:blur(24px) saturate(200%);-webkit-backdrop-filter:blur(24px) saturate(200%);border:1px solid rgba(255,255,255,.06);border-left:none;border-radius:0 10px 10px 0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;box-shadow:4px 0 20px rgba(0,0,0,.35);flex-shrink:0;transition:background .2s,box-shadow .2s}
            #cxai-trigger-pill:hover{background:rgba(25,25,42,.96);box-shadow:8px 0 28px rgba(0,0,0,.45)}
            #cxai-trigger-pill.open{background:rgba(99,102,241,.12);border-color:rgba(99,102,241,.25)}
            .cxai-status-dot{width:8px;height:8px;border-radius:50%;background:#10b981;box-shadow:0 0 6px rgba(16,185,129,.5);flex-shrink:0;transition:all .25s ease}
            .cxai-status-dot.paused{background:#ef4444;box-shadow:0 0 6px rgba(239,68,68,.5)}
            .cxai-pause-pill-btn{width:20px;height:20px;border-radius:5px;border:1px solid rgba(251,191,36,.25);background:rgba(251,191,36,.08);color:#fbbf24;font-size:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0;padding:0;margin-top:0}
            .cxai-pause-pill-btn:hover{background:rgba(251,191,36,.18)}
            .cxai-pause-pill-btn.paused{background:rgba(16,185,129,.12);border-color:rgba(16,185,129,.3);color:#10b981}
            .cxai-copy-pill-btn{width:20px;height:20px;border-radius:5px;border:1px solid rgba(129,140,248,.25);background:rgba(129,140,248,.08);color:#818cf8;font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0;padding:0;margin-top:0;line-height:1}
            .cxai-copy-pill-btn:hover{background:rgba(129,140,248,.18)}
            /* Side Panel */
            #cxai-side-panel{position:absolute;left:38px;top:0;width:360px;max-height:720px;background:rgba(15,15,26,.97);backdrop-filter:blur(40px) saturate(200%);-webkit-backdrop-filter:blur(40px) saturate(200%);border:1px solid rgba(255,255,255,.07);border-radius:14px;box-shadow:16px 0 56px rgba(0,0,0,.5),0 12px 40px rgba(0,0,0,.4);display:none;flex-direction:column;overflow:hidden}
            #cxai-side-panel.open{display:flex;animation:cxai-slide-in .22s cubic-bezier(.4,0,.2,1)}
            @keyframes cxai-slide-in{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
            .cxai-side-header{display:flex;align-items:center;justify-content:space-between;padding:12px 14px 10px;border-bottom:1px solid rgba(255,255,255,.05);flex-shrink:0}
            .cxai-side-title{font-size:13px;font-weight:600;color:rgba(226,232,240,.9);letter-spacing:.2px}
            .cxai-side-close{width:26px;height:26px;border-radius:7px;border:none;background:rgba(255,255,255,.03);color:rgba(226,232,240,.4);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0}
            .cxai-side-close:hover{background:rgba(255,255,255,.08);color:rgba(226,232,240,.85)}
            /* Tabs */
            .cxai-side-tabs{display:flex;gap:2px;padding:6px 10px;border-bottom:1px solid rgba(255,255,255,.05);flex-shrink:0}
            .cxai-tab-btn{flex:1;padding:5px 2px;border:none;background:transparent;color:rgba(226,232,240,.32);font-size:10px;font-weight:500;cursor:pointer;border-radius:6px;transition:all .15s;text-align:center}
            .cxai-tab-btn:hover{color:rgba(226,232,240,.6);background:rgba(255,255,255,.02)}
            .cxai-tab-btn.active{color:#818cf8;background:rgba(99,102,241,.1)}
            /* Tab Content */
            .cxai-tab-content{flex:1;overflow-y:auto;padding:12px 14px;display:none}
            .cxai-tab-content.active{display:flex;flex-direction:column}
            .cxai-tab-content::-webkit-scrollbar{width:3px}
            .cxai-tab-content::-webkit-scrollbar-track{background:transparent}
            .cxai-tab-content::-webkit-scrollbar-thumb{background:rgba(255,255,255,.06);border-radius:2px}
            /* Switch */
            .cxai-switch{position:relative;width:38px;height:20px;background:rgba(255,255,255,.08);border-radius:10px;cursor:pointer;transition:background .2s ease;flex-shrink:0}
            .cxai-switch.on{background:#818cf8}
            .cxai-switch::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;background:#fff;border-radius:50%;box-shadow:0 1px 2px rgba(0,0,0,.3);transition:transform .2s cubic-bezier(.4,0,.2,1)}
            .cxai-switch.on::after{transform:translateX(18px)}
            /* Row */
            .cxai-panel-row{display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.03)}
            .cxai-panel-row:last-child{border-bottom:none}
            .cxai-panel-label{font-size:12px;color:rgba(226,232,240,.8);font-weight:500}
            .cxai-panel-desc{font-size:10px;color:rgba(226,232,240,.3);margin-top:1px}
            /* Input */
            .cxai-input{width:100%;padding:7px 9px;border:1px solid rgba(255,255,255,.07);border-radius:7px;background:rgba(255,255,255,.03);font-size:11px;color:rgba(226,232,240,.85);outline:none;margin-top:5px;transition:border-color .15s;box-sizing:border-box}
            .cxai-input:focus{border-color:#818cf8}
            .cxai-input::placeholder{color:rgba(226,232,240,.2)}
            /* Buttons */
            .cxai-btn-primary{padding:4px 8px;border-radius:5px;border:none;font-size:9px;font-weight:500;cursor:pointer;transition:all .15s;background:#818cf8;color:#fff}
            .cxai-btn-primary:hover{background:#6366f1}
            .cxai-btn-secondary{padding:4px 8px;border-radius:5px;border:1px solid rgba(255,255,255,.07);font-size:9px;font-weight:500;cursor:pointer;transition:all .15s;background:rgba(255,255,255,.03);color:rgba(226,232,240,.65)}
            .cxai-btn-secondary:hover{background:rgba(255,255,255,.06);color:rgba(226,232,240,.85)}
            /* Theme Buttons (in settings tab) */
            .cxai-theme-section{margin-bottom:12px}
            .cxai-theme-btns{display:flex;gap:6px;margin-top:4px}
            .cxai-theme-btn{flex:1;padding:5px 0;border-radius:8px;border:1px solid rgba(255,255,255,.07);font-size:11px;font-weight:500;cursor:pointer;transition:all .15s;background:rgba(255,255,255,.03);color:rgba(226,232,240,.65)}
            .cxai-theme-btn:hover{background:rgba(255,255,255,.06);color:rgba(226,232,240,.85);border-color:rgba(255,255,255,.12)}
            .cxai-theme-btn.active{background:#818cf8;color:#fff;border-color:#818cf8}
            /* Header Theme Toggle */
            .cxai-theme-toggle-btn{width:26px;height:26px;border-radius:6px;border:none;background:rgba(255,255,255,.04);color:rgba(226,232,240,.6);font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0}
            .cxai-theme-toggle-btn:hover{background:rgba(255,255,255,.08);color:rgba(226,232,240,.9)}
            /* Header Update Button */
            .cxai-update-btn{width:26px;height:26px;border-radius:6px;border:none;background:rgba(255,255,255,.04);color:rgba(226,232,240,.6);font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0}
            .cxai-update-btn:hover{background:rgba(255,255,255,.08);color:rgba(226,232,240,.9)}
            .cxai-update-btn.spinning .cxai-update-icon{display:inline-block;animation:cxai-spin 1s linear infinite}
            /* Theme Popover */
            .cxai-theme-popover{position:absolute;top:42px;right:42px;background:rgba(20,20,32,.98);backdrop-filter:blur(24px) saturate(200%);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:6px;display:none;flex-direction:column;gap:2px;z-index:100002;box-shadow:0 12px 40px rgba(0,0,0,.5);min-width:90px}
            .cxai-theme-popover.open{display:flex}
            .cxai-theme-popover-btn{display:flex;align-items:center;gap:6px;padding:6px 10px;border:none;border-radius:6px;background:transparent;color:rgba(226,232,240,.75);font-size:11px;cursor:pointer;transition:all .12s;text-align:left;white-space:nowrap}
            .cxai-theme-popover-btn:hover{background:rgba(255,255,255,.06);color:rgba(226,232,240,.95)}
            .cxai-theme-popover-btn.active{color:#818cf8;background:rgba(99,102,241,.1)}
            .cxai-theme-popover-btn .cxai-theme-icon{font-size:13px;width:18px;text-align:center}
            /* Light theme overrides for popover */
            [data-cxai-theme-light] .cxai-theme-popover{background:rgba(255,255,255,.98);border-color:rgba(0,0,0,.08);box-shadow:0 12px 40px rgba(0,0,0,.12)}
            [data-cxai-theme-light] .cxai-theme-toggle-btn{background:rgba(0,0,0,.04);color:rgba(30,30,40,.6)}
            [data-cxai-theme-light] .cxai-theme-toggle-btn:hover{background:rgba(0,0,0,.07);color:rgba(30,30,40,.85)}
            [data-cxai-theme-light] .cxai-update-btn{background:rgba(0,0,0,.04);color:rgba(30,30,40,.6)}
            [data-cxai-theme-light] .cxai-update-btn:hover{background:rgba(0,0,0,.07);color:rgba(30,30,40,.85)}
            [data-cxai-theme-light] .cxai-theme-popover-btn{color:rgba(30,30,40,.75)}
            [data-cxai-theme-light] .cxai-theme-popover-btn:hover{background:rgba(0,0,0,.05);color:rgba(30,30,40,.9)}
            [data-cxai-theme-light] .cxai-theme-popover-btn.active{color:#6366f1;background:rgba(99,102,241,.08)}
            /* Info Card */
            .cxai-info-card{padding:8px 10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);border-radius:8px;font-size:10px;color:rgba(226,232,240,.4);line-height:1.5;margin-bottom:10px}
            .cxai-info-card b{color:rgba(226,232,240,.7)}
            .cxai-uid{font-size:11px;color:rgba(226,232,240,.45);margin-bottom:6px}
            .cxai-uid b{color:rgba(226,232,240,.7)}
            /* Floating Log Bar — removed, logs only in panel tab */
            /* Side Panel */
            #cxai-log-panel{font-family:"SF Mono","Menlo","Consolas",monospace;padding:4px 8px;line-height:1.8}
            #cxai-log-panel::-webkit-scrollbar{width:3px}
            #cxai-log-panel::-webkit-scrollbar-track{background:transparent}
            #cxai-log-panel::-webkit-scrollbar-thumb{background:rgba(255,255,255,.06);border-radius:2px}
            #cxai-log-panel .cxai-log-line{display:flex;gap:3px;align-items:flex-start;padding:2px 0}
            #cxai-log-panel .cxai-log-time{color:rgba(255,255,255,.25);font-size:8px;min-width:40px;flex-shrink:0;white-space:nowrap}
            #cxai-log-panel .cxai-log-msg{color:rgba(255,255,255,.65);word-break:break-all;font-size:10px}
            #cxai-log-panel .cxai-log-msg.success{color:#34d399}
            #cxai-log-panel .cxai-log-msg.warn{color:#fbbf24}
            #cxai-log-panel .cxai-log-msg.error{color:#f87171}
            #cxai-log-panel .cxai-log-msg.info{color:#60a5fa}
            /* Thinking */
            #cxai-thinking{display:flex;align-items:center;gap:8px;padding:6px 0;margin-top:6px}
            .cxai-thinking-spinner{display:inline-block;width:11px;height:11px;border:2px solid rgba(255,255,255,.08);border-top-color:#818cf8;border-radius:50%;animation:cxai-spin .8s linear infinite}
            .cxai-thinking-text{font-size:10px;color:rgba(226,232,240,.4);font-weight:500}
            .cxai-thinking-dots{display:inline-flex;gap:3px;margin-left:2px}
            .cxai-thinking-dots i{width:3px;height:3px;border-radius:50%;background:#818cf8;opacity:.35;animation:cxai-dot 1.2s infinite ease-in-out both}
            .cxai-thinking-dots i:nth-child(2){animation-delay:.16s}
            .cxai-thinking-dots i:nth-child(3){animation-delay:.32s}
            @keyframes cxai-spin{to{transform:rotate(360deg)}}
            @keyframes cxai-dot{0%,80%,100%{transform:scale(.5);opacity:.25}40%{transform:scale(1);opacity:1}}
            /* ======== Theme Variants ======== */
            /* Light Theme */
            [data-cxai-theme-light] #cxai-trigger-pill{background:rgba(255,255,255,.92) !important;border-color:rgba(0,0,0,.08) !important;box-shadow:-4px 0 16px rgba(0,0,0,.08) !important}
            [data-cxai-theme-light] #cxai-trigger-pill:hover{background:#fff !important;box-shadow:-8px 0 24px rgba(0,0,0,.12) !important}
            [data-cxai-theme-light] #cxai-trigger-pill.open{background:rgba(99,102,241,.08) !important;border-color:rgba(99,102,241,.2) !important}
            [data-cxai-theme-light] .cxai-status-dot{background:#10b981 !important;box-shadow:0 0 6px rgba(16,185,129,.4) !important}
            [data-cxai-theme-light] .cxai-status-dot.paused{background:#ef4444 !important;box-shadow:0 0 6px rgba(239,68,68,.5) !important}
            [data-cxai-theme-light] .cxai-pause-pill-btn{border-color:rgba(251,191,36,.3) !important;background:rgba(251,191,36,.1) !important;color:#d97706 !important}
            [data-cxai-theme-light] .cxai-pause-pill-btn:hover{background:rgba(251,191,36,.2) !important}
            [data-cxai-theme-light] .cxai-pause-pill-btn.paused{background:rgba(239,68,68,.1) !important;border-color:rgba(239,68,68,.25) !important;color:#dc2626 !important}
            [data-cxai-theme-light] .cxai-copy-pill-btn{border-color:rgba(99,102,241,.3) !important;background:rgba(99,102,241,.1) !important;color:#4f46e5 !important}
            [data-cxai-theme-light] .cxai-copy-pill-btn:hover{background:rgba(99,102,241,.2) !important}
            [data-cxai-theme-light] #cxai-side-panel{background:rgba(255,255,255,.96) !important;border-color:rgba(0,0,0,.06) !important;box-shadow:-16px 0 40px rgba(0,0,0,.08),0 12px 32px rgba(0,0,0,.06)}
            [data-cxai-theme-light] .cxai-side-title{color:rgba(30,30,40,.9) !important}
            [data-cxai-theme-light] .cxai-side-close{background:rgba(0,0,0,.03) !important;color:rgba(30,30,40,.35) !important}
            [data-cxai-theme-light] .cxai-side-close:hover{background:rgba(0,0,0,.06) !important;color:rgba(30,30,40,.7) !important}
            [data-cxai-theme-light] .cxai-side-tabs{border-bottom-color:rgba(0,0,0,.06) !important}
            [data-cxai-theme-light] .cxai-tab-btn{color:rgba(30,30,40,.35) !important}
            [data-cxai-theme-light] .cxai-tab-btn:hover{color:rgba(30,30,40,.55) !important;background:rgba(0,0,0,.02) !important}
            [data-cxai-theme-light] .cxai-tab-btn.active{color:#6366f1 !important;background:rgba(99,102,241,.08) !important}
            [data-cxai-theme-light] .cxai-tab-content::-webkit-scrollbar-thumb{background:rgba(0,0,0,.08) !important}
            [data-cxai-theme-light] .cxai-switch{background:rgba(0,0,0,.08) !important}
            [data-cxai-theme-light] .cxai-switch.on{background:#6366f1 !important}
            [data-cxai-theme-light] .cxai-panel-row{border-bottom-color:rgba(0,0,0,.05) !important}
            [data-cxai-theme-light] .cxai-panel-label{color:rgba(30,30,40,.8) !important}
            [data-cxai-theme-light] .cxai-panel-desc{color:rgba(30,30,40,.3) !important}
            [data-cxai-theme-light] .cxai-input{background:rgba(0,0,0,.03) !important;border-color:rgba(0,0,0,.08) !important;color:rgba(30,30,40,.85) !important}
            [data-cxai-theme-light] .cxai-input:focus{border-color:#6366f1 !important}
            [data-cxai-theme-light] .cxai-input::placeholder{color:rgba(30,30,40,.25) !important}
            [data-cxai-theme-light] .cxai-btn-primary{background:#6366f1 !important;color:#fff !important}
            [data-cxai-theme-light] .cxai-btn-primary:hover{background:#4f46e5 !important}
            [data-cxai-theme-light] .cxai-btn-secondary{border-color:rgba(0,0,0,.08) !important;background:rgba(0,0,0,.03) !important;color:rgba(30,30,40,.6) !important}
            [data-cxai-theme-light] .cxai-btn-secondary:hover{background:rgba(0,0,0,.05) !important;color:rgba(30,30,40,.8) !important}
            [data-cxai-theme-light] .cxai-theme-btn{border-color:rgba(0,0,0,.08) !important;background:rgba(0,0,0,.03) !important;color:rgba(30,30,40,.6) !important}
            [data-cxai-theme-light] .cxai-theme-btn:hover{background:rgba(0,0,0,.05) !important;color:rgba(30,30,40,.8) !important;border-color:rgba(0,0,0,.12) !important}
            [data-cxai-theme-light] .cxai-theme-btn.active{background:#6366f1 !important;color:#fff !important;border-color:#6366f1 !important}
            [data-cxai-theme-light] .cxai-info-card{background:rgba(0,0,0,.02) !important;border-color:rgba(0,0,0,.05) !important}
            [data-cxai-theme-light] .cxai-info-card b{color:rgba(30,30,40,.7) !important}
            [data-cxai-theme-light] .cxai-uid{color:rgba(30,30,40,.45) !important}
            [data-cxai-theme-light] .cxai-uid b{color:rgba(30,30,40,.7) !important}
            [data-cxai-theme-light] #cxai-log-panel .cxai-log-time{color:rgba(0,0,0,.3) !important}
            [data-cxai-theme-light] #cxai-log-panel .cxai-log-msg{color:rgba(30,30,40,.7) !important}
            [data-cxai-theme-light] .cxai-thinking-text{color:rgba(30,30,40,.4) !important}
            /* 浅色主题：覆盖面板内所有 inline style 的深色颜色 */
            [data-cxai-theme-light] #cxai-side-panel label{color:rgba(30,30,40,.65) !important}
            [data-cxai-theme-light] #cxai-side-panel select{border-color:rgba(0,0,0,.12) !important;background:rgba(245,245,245,.9) !important;color:rgba(30,30,40,.85) !important}
            [data-cxai-theme-light] #cxai-side-panel select:focus{border-color:#6366f1 !important}
            [data-cxai-theme-light] #cxai-model-priority-list{border-color:rgba(0,0,0,.08) !important}
            [data-cxai-theme-light] #cxai-model-priority-list .cxai-priority-item{color:rgba(30,30,40,.75) !important;border-color:rgba(0,0,0,.06) !important}
            [data-cxai-theme-light] #cxai-side-panel .cxai-info-card{background:rgba(0,0,0,.02) !important;border-color:rgba(0,0,0,.05) !important;color:rgba(30,30,40,.8) !important}
            [data-cxai-theme-light] #cxai-side-panel .cxai-info-card b{color:rgba(30,30,40,.7) !important}
            [data-cxai-theme-light] #cxai-side-panel .cxai-uid{color:rgba(30,30,40,.45) !important}
            [data-cxai-theme-light] #cxai-side-panel .cxai-uid b{color:rgba(30,30,40,.7) !important}
            [data-cxai-theme-light] #cxai-dxs-login-area{border-color:rgba(0,0,0,.08) !important;background:rgba(0,0,0,.02) !important}
            [data-cxai-theme-light] #cxai-side-panel .cxai-log-line{border-bottom-color:rgba(0,0,0,.04) !important}
            [data-cxai-theme-light] #cxai-side-panel div[style*="border-bottom"]{border-bottom-color:rgba(0,0,0,.06) !important}
            [data-cxai-theme-light] #cxai-side-panel div[style*="border-top"]{border-top-color:rgba(0,0,0,.06) !important}
            [data-cxai-theme-light] #cxai-side-panel div[style*="background:rgba(255"]{background:rgba(0,0,0,.02) !important}
            [data-cxai-theme-light] #cxai-side-panel span[style*="color:rgba(170"]{color:rgba(30,30,40,.55) !important}
            [data-cxai-theme-light] #cxai-side-panel span[style*="color:rgba(200"]{color:rgba(30,30,40,.6) !important}
            [data-cxai-theme-light] #cxai-side-panel span[style*="color:rgba(160"]{color:rgba(30,30,40,.45) !important}
            [data-cxai-theme-light] #cxai-side-panel div[style*="color:rgba(226"]{color:rgba(30,30,40,.8) !important}
            /* Dark Theme (explicit, same as default) */
            [data-cxai-theme-dark] #cxai-trigger-pill{background:rgba(15,15,26,.94);border-color:rgba(255,255,255,.06);box-shadow:-4px 0 20px rgba(0,0,0,.35)}
            [data-cxai-theme-dark] #cxai-side-panel{background:rgba(15,15,26,.97);border-color:rgba(255,255,255,.07);box-shadow:-16px 0 56px rgba(0,0,0,.5),0 12px 40px rgba(0,0,0,.4)}
            [data-cxai-theme-dark] .cxai-side-title{color:rgba(226,232,240,.9)}
            [data-cxai-theme-dark] .cxai-side-close{background:rgba(255,255,255,.03);color:rgba(226,232,240,.4)}
            [data-cxai-theme-dark] .cxai-side-tabs{border-bottom-color:rgba(255,255,255,.05)}
            [data-cxai-theme-dark] .cxai-tab-btn{color:rgba(226,232,240,.32)}
            [data-cxai-theme-dark] .cxai-tab-btn.active{color:#818cf8;background:rgba(99,102,241,.1)}
            [data-cxai-theme-dark] .cxai-panel-label{color:rgba(226,232,240,.8)}
            [data-cxai-theme-dark] .cxai-panel-desc{color:rgba(226,232,240,.3)}
            [data-cxai-theme-dark] .cxai-input{background:rgba(255,255,255,.03);border-color:rgba(255,255,255,.07);color:rgba(226,232,240,.85)}
            [data-cxai-theme-dark] .cxai-input::placeholder{color:rgba(226,232,240,.2)}
            [data-cxai-theme-dark] #cxai-log-panel .cxai-log-time{color:rgba(255,255,255,.25)}
            [data-cxai-theme-dark] #cxai-log-panel .cxai-log-msg{color:rgba(255,255,255,.65)}
            [data-cxai-theme-dark] .cxai-thinking-text{color:rgba(226,232,240,.4)}
            /* 模型管理弹窗主题 */
            #cxai-model-manager-overlay[data-cxai-theme="dark"]{background:rgba(0,0,0,.55)}
            #cxai-model-panel{background:#1e1e2e;border:1px solid rgba(255,255,255,.08);box-shadow:0 24px 64px rgba(0,0,0,.5)}
            #cxai-model-manager-overlay[data-cxai-theme="dark"] #cxai-model-panel{background:#1e1e2e;color:rgba(226,232,240,.9)}
            #cxai-model-manager-overlay[data-cxai-theme="dark"] #cxai-model-panel *{color:rgba(226,232,240,.8) !important}
            #cxai-model-manager-overlay[data-cxai-theme="light"]{background:rgba(0,0,0,.3)}
            #cxai-model-manager-overlay[data-cxai-theme="light"] #cxai-model-panel{background:#fff !important;color:rgba(30,30,40,.9) !important;border-color:rgba(0,0,0,.08) !important;box-shadow:0 24px 64px rgba(0,0,0,.15) !important}
            #cxai-model-manager-overlay[data-cxai-theme="light"] #cxai-model-panel *{color:rgba(30,30,40,.8) !important}
            #cxai-model-manager-overlay[data-cxai-theme="light"] #cxai-model-panel input[type="text"],#cxai-model-manager-overlay[data-cxai-theme="light"] #cxai-model-panel input[type="password"],#cxai-model-manager-overlay[data-cxai-theme="light"] #cxai-model-panel input[type="number"]{background:rgba(0,0,0,.03) !important;border-color:rgba(0,0,0,.1) !important;color:rgba(30,30,40,.85) !important}
            #cxai-model-manager-overlay[data-cxai-theme="light"] #cxai-model-panel label{color:rgba(30,30,40,.7) !important}
            #cxai-model-manager-overlay[data-cxai-theme="light"] #cxai-model-panel button{background:rgba(0,0,0,.05) !important;border-color:rgba(0,0,0,.1) !important;color:rgba(30,30,40,.6) !important}
            #cxai-model-manager-overlay[data-cxai-theme="light"] #cxai-model-panel button:hover{background:rgba(0,0,0,.08) !important}
            #cxai-model-manager-overlay[data-cxai-theme="light"] #cxai-model-panel div[style*="border-bottom"]{border-bottom-color:rgba(0,0,0,.08) !important}
            #cxai-model-manager-overlay[data-cxai-theme="light"] #cxai-model-panel div[style*="border-top"]{border-top-color:rgba(0,0,0,.08) !important}
            `;
        var box_html = `
            <div id="cxai-float-root">
                <div id="cxai-trigger-wrapper">
                    <div id="cxai-trigger-pill" title="AI 智脑 Pro — 点击展开">
                        <div class="cxai-status-dot"></div>
                        <button id="cxai-pause-pill-btn" class="cxai-pause-pill-btn" title="暂停/继续所有刷课和答题任务">⏸</button>
                        <button id="cxai-copy-pill-btn" class="cxai-copy-pill-btn" title="复制当前页面题目">📋</button>
                    </div>
                </div>
                <div id="cxai-side-panel">
                    <div class="cxai-side-header">
                        <span class="cxai-side-title">AI 智脑 Pro</span>
                        <div style="display:flex;align-items:center;gap:6px;">
                            <button class="cxai-theme-toggle-btn" id="cxai-theme-toggle-btn" title="切换主题">🌓</button>
                            <button class="cxai-update-btn" id="cxai-update-btn" title="检查更新"><span class="cxai-update-icon">🔄</span></button>
                            <button class="cxai-side-close" id="cxai-close-panel">&times;</button>
                        </div>
                    </div>
                    <!-- Theme Popover -->
                    <div class="cxai-theme-popover" id="cxai-theme-popover">
                        <button class="cxai-theme-btn cxai-theme-popover-btn" data-theme="auto"><span class="cxai-theme-icon">🌓</span> 自动</button>
                        <button class="cxai-theme-btn cxai-theme-popover-btn" data-theme="light"><span class="cxai-theme-icon">☀️</span> 浅色</button>
                        <button class="cxai-theme-btn cxai-theme-popover-btn" data-theme="dark"><span class="cxai-theme-icon">🌙</span> 深色</button>
                    </div>
                    <div class="cxai-side-tabs">
                        <button class="cxai-tab-btn active" data-tab="bank" title="题库设置">题库</button>
                        <button class="cxai-tab-btn" data-tab="settings" title="通用设置">设置</button>
                        <button class="cxai-tab-btn" data-tab="models" title="模型选择与切换">模型</button>
                        <button class="cxai-tab-btn" data-tab="logs" title="运行日志">日志</button>
                    </div>
                    <!-- Tab: 题库 -->
                    <div class="cxai-tab-content active" id="tab-bank">
                        <!-- 答题节奏（控制每题作答后的等待间隔） -->
                        <div class="cxai-panel-row" style="margin-top:4px">
                            <div><div class="cxai-panel-label">题库答题间隔(秒)</div><div class="cxai-panel-desc">答完题库答案后每题停顿，与 AI 间隔独立</div></div>
                            <input class="cxai-input" type="number" id="cxaiSetting.time" value="2.5" step="0.5" min="0" max="60" style="width:52px;margin:0;text-align:center">
                        </div>
                        <!-- 题库开关 -->
                        <div class="cxai-panel-row" style="margin-top:8px">
                            <div><div class="cxai-panel-label">BZM 题库</div><div class="cxai-panel-desc">高质量题库，需要 API Key</div></div>
                            <div class="cxai-switch on" data-key="bzmEnabled"></div>
                        </div>
                        <input class="cxai-input" type="password" id="cxaiSetting.bzmApiKey" placeholder="BZM API Key" autocomplete="new-password">
                        <button class="cxai-btn-primary" style="margin-top:7px;width:100%" id="cxai-get-bzm-key-btn" title="打开 BZM 题库官网获取免费 API Key">获取 BZM 题库 Key</button>
                        <div class="cxai-panel-row" style="margin-top:8px">
                            <div><div class="cxai-panel-label">icodef.com 题库</div><div class="cxai-panel-desc">兜底题库，无需 Key，格式简单稳定</div></div>
                            <div class="cxai-switch on" data-key="icodefEnabled"></div>
                        </div>
                        <div class="cxai-panel-row" style="margin-top:8px">
                            <div><div class="cxai-panel-label">大学搜题酱题库</div><div class="cxai-panel-desc">需扫码登录，支持文字/图片搜题</div></div>
                            <div class="cxai-switch on" data-key="dxsEnabled"></div>
                        </div>
                        <!-- 大学搜题酱扫码登录（放在题库开关后面） -->
                        <div id="cxai-dxs-login-area" style="margin-top:8px;padding:8px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:rgba(255,255,255,0.03)">
                            <div class="cxai-panel-label" style="margin-bottom:6px">大学搜题酱登录</div>
                            <button class="cxai-btn-primary" style="width:100%;margin-bottom:6px" id="cxai-dxs-login-btn">扫码登录</button>
                            <div id="cxai-dxs-qr-area" style="display:none;flex-direction:column;align-items:center;text-align:center">
                                <img id="cxai-dxs-qr-img" style="display:block;margin:0 auto;width:180px;height:180px;background:#fff;border-radius:8px;padding:4px" />
                                <div id="cxai-dxs-qr-fallback" style="display:none;margin-top:4px">
                                    <div style="font-size:10px;color:#aaa;margin-bottom:4px">二维码加载失败，请在手机浏览器打开：</div>
                                    <a id="cxai-dxs-qr-link" href="#" target="_blank" style="font-size:10px;color:#818cf8;word-break:break-all">链接</a>
                                </div>
                                <div style="font-size:11px;color:#aaa;margin-top:4px">请使用大学搜题酱 APP 扫码登录</div>
                                <div id="cxai-dxs-login-status" style="font-size:11px;color:#f60;margin-top:4px">等待扫码...</div>
                            </div>
                            <div id="cxai-dxs-login-ok" style="display:none;text-align:center;color:#0f0;font-size:11px">✅ 已登录（双击上方按钮可退出/重新登录）</div>
                        </div>
                    </div>
                    <!-- Tab: 设置 -->
                    <div class="cxai-tab-content" id="tab-settings">
                        <div id="cxai-notice">
                            <div class="cxai-uid">UID：<b id="cxai-uid-text">-</b></div>
                        </div>
                        <div id="cxai-userInfo" class="cxai-info-card"></div>
                        <div class="cxai-panel-row">
                            <div><div class="cxai-panel-label">视频倍速</div></div>
                            <select class="cxai-input" id="cxaiSetting.rate" style="width:auto;padding:5px 22px 5px 8px;margin:0;font-size:11px">
                                <option value="1">1x</option><option value="1.25">1.25x</option><option value="1.5">1.5x</option><option value="2">2x</option>
                            </select>
                        </div>
                        <div class="cxai-panel-row"><div><div class="cxai-panel-label">自动提交</div></div><div class="cxai-switch on" data-key="sub"></div></div>
                        <div class="cxai-panel-row" id="cxai-force-row"><div><div class="cxai-panel-label">强制提交</div></div><div class="cxai-switch" data-key="force"></div></div>
                        <div class="cxai-panel-row"><div><div class="cxai-panel-label">答案插入题目</div></div><div class="cxai-switch on" data-key="alterTitle"></div></div>
                        <div class="cxai-panel-row"><div><div class="cxai-panel-label">重做模式</div></div><div class="cxai-switch" data-key="redo"></div></div>
                        <div class="cxai-panel-row"><div><div class="cxai-panel-label">模糊匹配</div></div><div class="cxai-switch on" data-key="fuzzyMatch"></div></div>
                        <div class="cxai-panel-row"><div><div class="cxai-panel-label">解锁粘贴</div></div><div class="cxai-switch" data-key="unlockPaste"></div></div>
                        <div class="cxai-panel-row"><div><div class="cxai-panel-label">启用搜题</div></div><div class="cxai-switch on" data-key="searchEnabled"></div></div>
                        <div class="cxai-panel-row"><div><div class="cxai-panel-label">字体解密</div></div><div class="cxai-switch on" data-key="decrypt"></div></div>
                        <div id="cxai-thinking" style="display:none">
                            <div class="cxai-thinking-spinner"></div>
                            <span class="cxai-thinking-text">AI 思考中<span class="cxai-thinking-dots"><i></i><i></i><i></i></span></span>
                        </div>
                    </div>
                    <!-- Tab: 模型 -->
                    <div class="cxai-tab-content" id="tab-models">
                        <div id="cxai-userInfo-ai" class="cxai-info-card"></div>
                        <div style="margin-bottom:8px;">
                            <label style="font-size:11px;color:rgba(170,178,200,.65);display:block;margin-bottom:3px;">选择接口</label>
                            <select id="cxai-provider-select" style="width:100%;padding:8px 10px;font-size:12px;border-radius:8px;border:1px solid rgba(255,255,255,.09);background:rgba(0,0,0,.2);color:rgba(220,224,236,.86);margin-bottom:8px;box-sizing:border-box;cursor:pointer;"></select>
                            <label style="font-size:11px;color:rgba(170,178,200,.65);display:block;margin-bottom:3px;">选择模型</label>
                            <select id="cxai-model-select" style="width:100%;padding:8px 10px;font-size:12px;border-radius:8px;border:1px solid rgba(255,255,255,.09);background:rgba(0,0,0,.2);color:rgba(220,224,236,.86);box-sizing:border-box;cursor:pointer;"></select>
                        </div>
                        <div id="cxai-model-priority-list" style="margin-bottom:8px; max-height: 180px; overflow-y: auto; border: 1px solid rgba(255,255,255,.06); border-radius: 8px; padding: 4px;"></div>
                        <div class="cxai-panel-row" style="margin-top:8px">
                            <div><div class="cxai-panel-label">AI 答题间隔(秒)</div><div class="cxai-panel-desc">答完 AI 答案后每题停顿，与题库间隔独立</div></div>
                            <input class="cxai-input" type="number" id="cxaiSetting.aiTime" value="2.5" step="0.5" min="0" max="60" style="width:52px;margin:0;text-align:center">
                        </div>
                        <div class="cxai-panel-row" style="margin-top:8px">
                            <div><div class="cxai-panel-label">AI 请求限流(秒)</div><div class="cxai-panel-desc">两次 AI 请求最小间隔，调大防被限流/封号</div></div>
                            <input class="cxai-input" type="number" id="cxaiSetting.reqIntervalTime" value="3" style="width:52px;margin:0;text-align:center">
                        </div>
                        <button id="cxai-manage-models-btn" class="cxai-btn-primary" style="width:100%" title="添加、编辑、删除自定义模型接口">管理模型</button>
                    </div>
                    <!-- Tab: 日志（面板内独立日志容器） -->
                    <div class="cxai-tab-content" id="tab-logs">
                        <div id="cxai-log-panel" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;padding:4px 8px;font-size:9px;font-family:'SF Mono','Menlo','Consolas',monospace;line-height:1.8">
                            <div class="cxai-log-line"><span class="cxai-log-time">--:--:--</span><span class="cxai-log-msg info">等待题目加载...</span></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $(_targetDoc.body).append(box_html);

        // 面板已注入 DOM，判断实际所在 document（top 或当前 iframe），后续所有控件查找都基于此
        _boxDoc = document;
        try {
            var _rootInTop = top.document.getElementById('cxai-float-root');
            var _rootInCurrent = document.getElementById('cxai-float-root');
            if (_rootInTop && !_rootInCurrent) {
                _boxDoc = top.document;
            } else if (_rootInCurrent && !_rootInTop) {
                _boxDoc = document;
            } else if (_rootInTop && _rootInCurrent) {
                _boxDoc = top.document;
            } else {
                _boxDoc = document;
            }
            console.log('[cxai] _boxDoc=' + (_boxDoc === top.document ? 'top.document' : 'document') + ' rootInTop=' + !!_rootInTop + ' rootInCurrent=' + !!_rootInCurrent);
        } catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }

        // 清理 HTML 模板中的"等待题目加载..."占位消息
        (function () {
            var doc;
            try { doc = top.document; } catch (_) { doc = document; }
            var el = doc.getElementById('cxai-log-panel');
            if (el) {
                var msg = el.querySelector('.cxai-log-msg');
                if (msg && msg.textContent.indexOf('等待题目加载') !== -1) {
                    msg.parentElement.remove();
                }
            }
        })();

        // 恢复 F9 隐藏状态
        (function () {
            var root = _cxaiFindEl('cxai-float-root');
            if (!root) return;
            if (localStorage.getItem('cxaiSetting.boxHidden') === 'true') {
                root.classList.add('hidden-by-f9');
            }
        })();

        // ======== 侧边面板开关 & Tab 切换 ========
        (function () {
            var pill = _cxaiFindEl('cxai-trigger-pill');
            var panel = _cxaiFindEl('cxai-side-panel');
            var closeBtn = _cxaiFindEl('cxai-close-panel');
            var tabBtns = _cxaiFindAll('.cxai-tab-btn');
            var tabContents = _cxaiFindAll('.cxai-tab-content');
            var panelOpen = false;

            function openPanel() {
                if (!panel) return;
                panel.classList.add('open');
                if (pill) pill.classList.add('open');
                panelOpen = true;
            }

            function closePanel() {
                if (!panel) return;
                panel.classList.remove('open');
                if (pill) pill.classList.remove('open');
                panelOpen = false;
            }

            function switchTab(tabName) {
                tabBtns.forEach(function (b) { b.classList.remove('active'); });
                tabContents.forEach(function (c) { c.classList.remove('active'); });
                var activeBtn = _cxaiFindAll('.cxai-tab-btn[data-tab="' + tabName + '"]')[0];
                var activeContent = _cxaiFindEl('tab-' + tabName);
                if (activeBtn) activeBtn.classList.add('active');
                if (activeContent) activeContent.classList.add('active');
                // 切换到设置/模型 tab 时同步刷新当前模型显示，避免两个 tab 信息不一致
                if (tabName === 'settings' || tabName === 'models') {
                    cxai_refreshCurrentModelDisplay();
                }
            }

            // 点击触发按钮 → 切换面板
            if (pill) {
                pill.addEventListener('click', function (e) {
                    e.stopPropagation();
                    if (panelOpen) { closePanel(); } else { openPanel(); }
                });
            }

            // 关闭按钮
            if (closeBtn) {
                closeBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    closePanel();
                });
            }

            // 检查更新按钮（动态查找 cxai_checkUpdate，因定义在主 IIFE 外部、绑定时尚未暴露）
            var updateBtn = _cxaiFindEl('cxai-update-btn');
            if (updateBtn) {
                updateBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    // 点击时动态查找，此时脚本已全部执行完毕
                    var fn = (typeof unsafeWindow !== 'undefined' && unsafeWindow.cxai_checkUpdate)
                          || (typeof window !== 'undefined' && window.cxai_checkUpdate);
                    if (!fn) {
                        if (typeof Swal !== 'undefined') {
                            Swal.fire({ title: '检查更新功能尚未加载', icon: 'warning', confirmButtonText: '好的' });
                        } else {
                            alert('检查更新功能尚未加载');
                        }
                        return;
                    }
                    var curVer = (typeof unsafeWindow !== 'undefined' && unsafeWindow._CXAI_CUR_VER)
                              || (typeof window !== 'undefined' && window._CXAI_CUR_VER)
                              || '未知';
                    updateBtn.classList.add('spinning');
                    var safetyTimer = setTimeout(function() {
                        updateBtn.classList.remove('spinning');
                    }, 20000);
                    fn(true, function(hasUpdate, remoteVer, errMsg) {
                        clearTimeout(safetyTimer);
                        updateBtn.classList.remove('spinning');
                        if (hasUpdate) return; // cxai_showUpdateDialog 已弹出
                        if (typeof Swal !== 'undefined' && Swal.isVisible()) return; // 防重复
                        if (errMsg) {
                            if (typeof Swal !== 'undefined') {
                                Swal.fire({
                                    title: '检查更新失败',
                                    text: errMsg + '（可能是网络问题，GitHub 在国内访问不稳定）',
                                    icon: 'error',
                                    confirmButtonText: '好的',
                                    confirmButtonColor: '#e74c3c'
                                });
                            } else {
                                alert('检查更新失败：' + errMsg);
                            }
                        } else {
                            if (typeof Swal !== 'undefined') {
                                Swal.fire({
                                    title: '已是最新版本',
                                    text: '当前版本 ' + curVer + '（最新 ' + remoteVer + '）',
                                    icon: 'success',
                                    confirmButtonText: '好的',
                                    confirmButtonColor: '#4CAF50'
                                });
                            } else {
                                alert('已是最新版本 v' + curVer);
                            }
                        }
                    });
                });
            }

            // Tab 切换
            tabBtns.forEach(function (btn) {
                btn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    switchTab(btn.getAttribute('data-tab'));
                });
            });

            // 点击外部关闭面板
            _boxDoc.addEventListener('click', function (e) {
                var root = _cxaiFindEl('cxai-float-root');
                if (root && !root.contains(e.target) && panelOpen) {
                    closePanel();
                }
            });
        })();

        // ======== 设置面板监听器 ========
        (function () {
            // UID
            var uidText = _cxaiFindEl('cxai-uid-text');
            if (uidText) {
                var _u = cxai_getCk('_uid') || cxai_getCk('UID');
                uidText.textContent = _u || '-';
            }
            // 通用设置开关
            var switchMap = {
                'sub': 'cxaiSetting.sub',
                'force': 'cxaiSetting.force',
                'alterTitle': 'cxaiSetting.alterTitle',
                'redo': 'cxaiSetting.redo',
                'fuzzyMatch': 'cxaiSetting.fuzzyMatch',
                'unlockPaste': 'cxaiSetting.unlockPaste',
                'searchEnabled': 'cxaiSetting.searchEnabled',
                'decrypt': 'cxaiSetting.decrypt',
                'bzmEnabled': 'cxaiSetting.bzmEnabled',
                'icodefEnabled': 'cxaiSetting.icodefEnabled',
                'dxsEnabled': 'cxaiSetting.dxsEnabled'
            };

            Object.keys(switchMap).forEach(function (key) {
                var sw = _cxaiFindAll('.cxai-switch[data-key="' + key + '"]')[0];
                var inputId = switchMap[key];
                if (!sw || !inputId) return;
                // 恢复状态
                var saved = localStorage.getItem(inputId);
                if (saved === 'true') {
                    sw.classList.add('on');
                } else if (saved === 'false') {
                    sw.classList.remove('on');
                } else {
                    // 默认值：开关 UI 与 localStorage 同步写入，避免"看起来开、实际没开"
                    var def = (inputId === 'cxaiSetting.searchEnabled' || inputId === 'cxaiSetting.fuzzyMatch' || inputId === 'cxaiSetting.alterTitle' || inputId === 'cxaiSetting.decrypt' || inputId === 'cxaiSetting.antiDetect' || inputId === 'cxaiSetting.icodefEnabled' || inputId === 'cxaiSetting.bzmEnabled' || inputId === 'cxaiSetting.dxsEnabled') ? true : false;
                    if (def) {
                        sw.classList.add('on');
                        try { localStorage.setItem(inputId, 'true'); } catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }
                    } else {
                        sw.classList.remove('on');
                        try { localStorage.setItem(inputId, 'false'); } catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }
                    }
                }
                // 初始化时同步强制提交开关的显示/隐藏
                if (inputId === 'cxaiSetting.sub') {
                    var _fr = _cxaiFindEl('cxai-force-row');
                    if (_fr) _fr.style.display = sw.classList.contains('on') ? '' : 'none';
                }
                // 监听切换：自己翻转 class，不再依赖全局 iOS toggle
                sw.addEventListener('click', function () {
                    sw.classList.toggle('on');
                    var checked = sw.classList.contains('on');
                    try { localStorage.setItem(inputId, checked ? 'true' : 'false'); } catch (_) { /* empty */ }
                    // 特殊处理：各开关即时生效
                    if (inputId === 'cxaiSetting.unlockPaste') {
                        cxaiInitPasteBypassToggle(checked);
                    } else if (inputId === 'cxaiSetting.antiDetect') {
                        cxai_logger(checked ? '防检测已开启' : '防检测已关闭', checked ? 'green' : 'gray');
                    } else if (inputId === 'cxaiSetting.decrypt') {
                        cxai_logger(checked ? '字体解密已开启' : '字体解密已关闭', checked ? 'green' : 'gray');
                        if (checked) { try { cxai_decryptFonts(); } catch (_) {} }
                    } else if (inputId === 'cxaiSetting.searchEnabled') {
                        cxai_logger(checked ? 'AI 搜题已启用' : 'AI 搜题已关闭', checked ? 'green' : 'gray');
                    } else if (inputId === 'cxaiSetting.sub') {
                        cxai_logger(checked ? '自动提交已开启' : '自动提交已关闭', checked ? 'green' : 'gray');
                        // 自动提交关闭时隐藏强制提交开关
                        var forceRow = _cxaiFindEl('cxai-force-row');
                        if (forceRow) forceRow.style.display = checked ? '' : 'none';
                    } else if (inputId === 'cxaiSetting.force') {
                        cxai_logger(checked ? '强制提交已开启' : '强制提交已关闭', checked ? 'green' : 'gray');
                    } else if (inputId === 'cxaiSetting.fuzzyMatch') {
                        cxai_logger(checked ? '模糊匹配已开启' : '模糊匹配已关闭', checked ? 'green' : 'gray');
                    } else if (inputId === 'cxaiSetting.alterTitle') {
                        cxai_logger(checked ? '答案插入题目已开启' : '答案插入题目已关闭', checked ? 'green' : 'gray');
                    } else if (inputId === 'cxaiSetting.redo') {
                        cxai_logger(checked ? '重做模式已开启' : '重做模式已关闭', checked ? 'green' : 'gray');
                    } else if (inputId === 'cxaiSetting.examTurn') {
                        cxai_logger(checked ? '考试自动跳转已开启' : '考试自动跳转已关闭', checked ? 'green' : 'gray');
                    } else if (inputId === 'cxaiSetting.bzmEnabled') {
                        cxai_logger(checked ? 'BZM 题库已启用' : 'BZM 题库已关闭', checked ? 'green' : 'gray');
                        // 关闭时隐藏 BZM API Key 输入框和获取按钮
                        var bzmInput = _cxaiFindEl('cxaiSetting.bzmApiKey');
                        var bzmBtn = _cxaiFindEl('cxai-get-bzm-key-btn');
                        if (bzmInput) bzmInput.style.display = checked ? '' : 'none';
                        if (bzmBtn) bzmBtn.style.display = checked ? '' : 'none';
                    } else if (inputId === 'cxaiSetting.icodefEnabled') {
                        cxai_logger(checked ? 'icodef 题库已启用' : 'icodef 题库已关闭', checked ? 'green' : 'gray');
                    } else if (inputId === 'cxaiSetting.dxsEnabled') {
                        cxai_logger(checked ? '大学搜题酱题库已启用' : '大学搜题酱题库已关闭', checked ? 'green' : 'gray');
                        // 关闭时隐藏登录框，开启时显示登录框
                        var dxsLoginArea = _cxaiFindEl('cxai-dxs-login-area');
                        if (dxsLoginArea) {
                            dxsLoginArea.style.display = checked ? '' : 'none';
                        }
                    }
                });
            });
            // 大学搜题酱登录区域初始显示/隐藏（与 dxsEnabled 开关同步）
            var _dxsLoginAreaInit = _cxaiFindEl('cxai-dxs-login-area');
            if (_dxsLoginAreaInit) {
                var _dxsEnabledInit = localStorage.getItem('cxaiSetting.dxsEnabled');
                _dxsLoginAreaInit.style.display = (_dxsEnabledInit === 'false') ? 'none' : '';
            }
            // BZM API Key 输入框和按钮初始显示/隐藏（与 bzmEnabled 开关同步）
            var _bzmInputInit = _cxaiFindEl('cxaiSetting.bzmApiKey');
            var _bzmBtnInit = _cxaiFindEl('cxai-get-bzm-key-btn');
            if (_bzmInputInit) _bzmInputInit.style.display = (localStorage.getItem('cxaiSetting.bzmEnabled') === 'false') ? 'none' : '';
            if (_bzmBtnInit) _bzmBtnInit.style.display = (localStorage.getItem('cxaiSetting.bzmEnabled') === 'false') ? 'none' : '';
            // 输出题库开关初始状态，方便排查"跳过"问题
            var _bankSwitches = ['icodefEnabled', 'bzmEnabled', 'dxsEnabled'];
            var _bankStatus = _bankSwitches.map(function(k) {
                return k + '=' + (localStorage.getItem('cxaiSetting.' + k) === 'true');
            }).join(' | ');
            console.log('[题库开关初始化] ' + _bankStatus);
            // 倍速下拉
            var rateSelect = _cxaiFindEl('cxaiSetting.rate');
            if (rateSelect) {
                rateSelect.value = localStorage.getItem('cxaiSetting.rate') || '1';
                rateSelect.addEventListener('change', function () {
                    localStorage.setItem('cxaiSetting.rate', rateSelect.value);
                    cxai_applyRateToCurrentMedia();
                });
            }
            // 搜题间隔
            var reqIntervalInput = _cxaiFindEl('cxaiSetting.reqIntervalTime');
            if (reqIntervalInput) {
                var savedInterval = localStorage.getItem('cxaiSetting.reqIntervalTime');
                var _initInterval = (savedInterval !== null && isFinite(parseInt(savedInterval, 10))) ? parseInt(savedInterval, 10) : (cxaiCfg.reqIntervalTime || 0);
                cxaiCfg.reqIntervalTime = _initInterval;  // 启动即应用存储值，避免「不碰输入框就不生效」
                reqIntervalInput.value = String(_initInterval);
                reqIntervalInput.addEventListener('input', function () {
                    var v = parseInt(reqIntervalInput.value, 10);
                    if (!isFinite(v) || v < 0) v = 0;
                    if (v > 60) v = 60;
                    localStorage.setItem('cxaiSetting.reqIntervalTime', String(v));
                    // 实时同步到内存配置（仅 AI 节流，不再联动每题间隔）
                    cxaiCfg.reqIntervalTime = v;
                    // 重置 throttle，使新间隔立即生效
                    if (typeof _cxaiNextAiAllowedAt !== 'undefined') {
                        _cxaiNextAiAllowedAt = Date.now();
                    }
                });
                reqIntervalInput.addEventListener('change', function () {
                    var v = parseInt(reqIntervalInput.value, 10);
                    if (!isFinite(v) || v < 0) v = 0;
                    if (v > 60) v = 60;
                    reqIntervalInput.value = String(v);
                    localStorage.setItem('cxaiSetting.reqIntervalTime', String(v));
                    cxaiCfg.reqIntervalTime = v;
                    if (typeof _cxaiNextAiAllowedAt !== 'undefined') {
                        _cxaiNextAiAllowedAt = Date.now();
                    }
                    cxai_logger('AI 请求限流已更新为 ' + v + ' 秒', 'green');
                });
            }
            // 题库答题间隔（题库界面控制，仅影响「题库答案」的每题停顿）
            var answerIntervalInput = _cxaiFindEl('cxaiSetting.time');
            if (answerIntervalInput) {
                var _savedTime = localStorage.getItem('cxaiSetting.time');
                if (_savedTime === null) {
                    var _legacy = localStorage.getItem('cxaiSetting.reqIntervalTime');
                    if (_legacy !== null) _savedTime = _legacy;
                }
                var _initTimeMs = (_savedTime !== null && isFinite(parseFloat(_savedTime)))
                    ? Math.min(60000, Math.round(parseFloat(_savedTime) * 1000)) : 2500;
                cxaiCfg.bankTime = _initTimeMs;  // 启动即应用存储值，避免「不碰输入框就不生效」
                answerIntervalInput.value = (_savedTime !== null && isFinite(parseFloat(_savedTime))) ? _savedTime : '2.5';
                console.log('[题库间隔初始化] localStorage=' + _savedTime + ' bankTime=' + cxaiCfg.bankTime + ' time(ms)=' + cxaiCfg.time);
                answerIntervalInput.addEventListener('input', function () {
                    var v = parseFloat(answerIntervalInput.value);
                    if (!isFinite(v) || v < 0) v = 0;
                    if (v > 60) v = 60;
                    localStorage.setItem('cxaiSetting.time', String(v));
                    cxaiCfg.bankTime = Math.min(60000, Math.round(v * 1000));
                    cxai_logger('题库答题间隔已更新为 ' + v + ' 秒（实际 ' + cxaiCfg.bankTime + ' ms）', 'green');
                });
                answerIntervalInput.addEventListener('change', function () {
                    var v = parseFloat(answerIntervalInput.value);
                    if (!isFinite(v) || v < 0) v = 0;
                    if (v > 60) v = 60;
                    answerIntervalInput.value = String(v);
                    localStorage.setItem('cxaiSetting.time', String(v));
                    cxaiCfg.bankTime = Math.min(60000, Math.round(v * 1000));
                    cxai_logger('题库答题间隔已更新为 ' + v + ' 秒（实际 ' + cxaiCfg.bankTime + ' ms）', 'green');
                });
            } else {
                console.warn('[题库间隔初始化] 未找到输入框 cxaiSetting.time，可能面板在 top 而当前 document 是 iframe');
            }
            // AI 答题间隔（模型界面控制，仅影响「AI 答案」的每题停顿，独立于题库间隔）
            var aiIntervalInput = _cxaiFindEl('cxaiSetting.aiTime');
            if (aiIntervalInput) {
                var _savedAi = localStorage.getItem('cxaiSetting.aiTime');
                var _initAiMs = (_savedAi !== null && isFinite(parseFloat(_savedAi)))
                    ? Math.min(60000, Math.round(parseFloat(_savedAi) * 1000)) : 2500;
                cxaiCfg.aiTime = _initAiMs;
                aiIntervalInput.value = (_savedAi !== null && isFinite(parseFloat(_savedAi))) ? _savedAi : '2.5';
                aiIntervalInput.addEventListener('input', function () {
                    var v = parseFloat(aiIntervalInput.value);
                    if (!isFinite(v) || v < 0) v = 0;
                    if (v > 60) v = 60;
                    localStorage.setItem('cxaiSetting.aiTime', String(v));
                    cxaiCfg.aiTime = Math.min(60000, Math.round(v * 1000));
                    cxai_logger('AI 答题间隔已更新为 ' + v + ' 秒', 'green');
                });
                aiIntervalInput.addEventListener('change', function () {
                    var v = parseFloat(aiIntervalInput.value);
                    if (!isFinite(v) || v < 0) v = 0;
                    if (v > 60) v = 60;
                    aiIntervalInput.value = String(v);
                    localStorage.setItem('cxaiSetting.aiTime', String(v));
                    cxaiCfg.aiTime = Math.min(60000, Math.round(v * 1000));
                    cxai_logger('AI 答题间隔已更新为 ' + v + ' 秒', 'green');
                });
            }
            // BZM API Key
            var bzmApiKeyInput = _cxaiFindEl('cxaiSetting.bzmApiKey');
            if (bzmApiKeyInput) {
                bzmApiKeyInput.value = localStorage.getItem('cxaiSetting.bzmApiKey') || '';
                bzmApiKeyInput.addEventListener('input', function () {
                    localStorage.setItem('cxaiSetting.bzmApiKey', bzmApiKeyInput.value);
                });
            }
            // BZM 获取 Key 按钮
            var getBzmKeyBtn = _cxaiFindEl('cxai-get-bzm-key-btn');
            if (getBzmKeyBtn) {
                getBzmKeyBtn.addEventListener('click', function () {
                    window.open('https://tk.swk.tw/', '_blank');
                });
            }
            // 大学搜题酱登录按钮
            var dxsLoginBtn = _cxaiFindEl('cxai-dxs-login-btn');
            if (dxsLoginBtn) {
                dxsLoginBtn.addEventListener('click', function () {
                    if (cxai_dxsIsLoggedIn()) {
                        cxai_logger('大学搜题酱已登录，双击按钮可退出/重新登录', 'orange');
                        return;
                    }
                    cxai_dxsLogin();
                });
                dxsLoginBtn.addEventListener('dblclick', function () {
                    if (!cxai_dxsIsLoggedIn()) return;
                    cxai_logger('大学搜题酱双击退出，准备重新扫码...', 'gray');
                    cxai_dxsLogout();
                    setTimeout(function () {
                        cxai_dxsLogin();
                    }, 100);
                });
                // 刷新页面后同步登录状态：如果已有 Cookie，显示"已登录"
                if (cxai_dxsIsLoggedIn()) {
                    _dxsSetLoggedInUI();
                }
            }
            // 模型管理按钮
            var manageModelsBtn = _cxaiFindEl('cxai-manage-models-btn');
            if (manageModelsBtn) {
                manageModelsBtn.addEventListener('click', function () {
                    cxai_showModelManager();
                });
            }
            // 悬浮胶囊暂停/继续按钮
            var pausePillBtn = _cxaiFindEl('cxai-pause-pill-btn');
            if (pausePillBtn) {
                pausePillBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    try {
                        var next = !cxai_isPaused();
                        cxai_setPaused(next);
                        cxai_logger(next ? '⏸ 全部任务已暂停' : '▶ 全部任务已恢复', next ? 'warn' : 'success');
                    } catch (err) {
                        cxai_logger('暂停按钮异常: ' + err.message, 'error');
                    }
                });
                // 同步按钮初始状态（刷新页面后 UI 与 localStorage 一致）
                if (cxai_isPaused()) {
                    pausePillBtn.classList.add('paused');
                    pausePillBtn.innerHTML = '▶';
                    pausePillBtn.title = '当前已暂停，点击继续所有刷课和答题任务';
                    // 同步状态点颜色
                    var _initPill = _cxaiFindEl('cxai-trigger-pill');
                    if (_initPill) {
                        var _initDot = _initPill.querySelector('.cxai-status-dot');
                        if (_initDot) _initDot.classList.add('paused');
                    }
                }
            } else {
                cxai_logger('未找到暂停按钮 #cxai-pause-pill-btn', 'warn');
            }
            // 悬浮胶囊复制题目按钮
            var copyPillBtn = _cxaiFindEl('cxai-copy-pill-btn');
            if (copyPillBtn) {
                copyPillBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    try {
                        if (typeof cxaiTriggerCopyFlow === 'function') {
                            cxai_logger('📋 触发复制题目...', 'info');
                            cxaiTriggerCopyFlow();
                        } else {
                            cxai_logger('复制题目功能未就绪 (cxaiTriggerCopyFlow 未定义)', 'warn');
                        }
                    } catch (err) {
                        cxai_logger('复制按钮异常: ' + err.message, 'error');
                    }
                });
            } else {
                cxai_logger('未找到复制按钮 #cxai-copy-pill-btn', 'warn');
            }
            // ======== 主题切换 ========
            (function () {
                var themeRoot = _cxaiFindEl('cxai-float-root');
                var themeBtns = _cxaiFindAll('.cxai-theme-popover-btn');
                if (!themeRoot || !themeBtns || themeBtns.length === 0) return;

                function getSavedTheme() {
                    try {
                        return localStorage.getItem('cxaiSetting.theme') || 'auto';
                    } catch (e) { return 'auto'; }
                }

                function applyTheme(theme) {
                    // 移除旧主题类
                    themeRoot.removeAttribute('data-cxai-theme-light');
                    themeRoot.removeAttribute('data-cxai-theme-dark');
                    themeRoot.removeAttribute('data-cxai-theme-auto');

                    var resolvedTheme = theme;
                    if (theme === 'light') {
                        themeRoot.setAttribute('data-cxai-theme-light', '');
                    } else if (theme === 'dark') {
                        themeRoot.setAttribute('data-cxai-theme-dark', '');
                    } else {
                        // auto: 跟随系统
                        themeRoot.setAttribute('data-cxai-theme-auto', '');
                        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                            themeRoot.setAttribute('data-cxai-theme-dark', '');
                        } else {
                            themeRoot.setAttribute('data-cxai-theme-light', '');
                        }
                    }

                    // 同步弹窗主题
                    var _overlay = document.getElementById('cxai-model-manager-overlay');
                    if (_overlay) {
                        var _resolved = theme;
                        if (theme === 'auto') {
                            _resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                        }
                        _overlay.setAttribute('data-cxai-theme', _resolved);
                    }
                    // 同步复制题目弹窗主题（弹窗挂在 top.document，需跨 iframe 查找）
                    try {
                        var _copyDoc;
                        try { _copyDoc = top.document; } catch(_) { _copyDoc = document; }
                        var _copyOverlay = _copyDoc.getElementById('cxai-copy-modal-overlay');
                        if (_copyOverlay) {
                            var _copyContent = _copyOverlay.querySelector('#cxai-copy-modal-content');
                            if (resolvedTheme === 'light') {
                                _copyOverlay.style.background = 'rgba(255,255,255,.85)';
                                if (_copyContent) {
                                    _copyContent.style.background = '#fff';
                                    _copyContent.style.border = '1px solid rgba(0,0,0,.08)';
                                    _copyContent.style.boxShadow = '0 12px 40px rgba(0,0,0,.12)';
                                    _copyContent.style.color = 'rgba(30,30,40,.9)';
                                }
                                var _view = _copyDoc.getElementById('cxai-copy-modal-view');
                                if (_view) {
                                    _view.style.background = '#fafafa';
                                    _view.style.border = '1px solid rgba(0,0,0,.06)';
                                    _view.style.color = 'rgba(30,30,40,.85)';
                                }
                                var _footer = _copyDoc.getElementById('cxai-copy-modal-footer');
                                if (_footer) {
                                    _footer.style.borderTop = '1px solid rgba(0,0,0,.06)';
                                }
                            } else {
                                _copyOverlay.style.background = 'rgba(0,0,0,.6)';
                                if (_copyContent) {
                                    _copyContent.style.background = '#1e1e2e';
                                    _copyContent.style.border = '1px solid rgba(255,255,255,.1)';
                                    _copyContent.style.boxShadow = '0 8px 32px rgba(0,0,0,.4)';
                                    _copyContent.style.color = 'rgba(210,216,234,.95)';
                                }
                                var _view2 = _copyDoc.getElementById('cxai-copy-modal-view');
                                if (_view2) {
                                    _view2.style.background = '#11111b';
                                    _view2.style.border = '1px solid rgba(255,255,255,.1)';
                                    _view2.style.color = 'rgba(210,216,234,.90)';
                                }
                                var _footer2 = _copyDoc.getElementById('cxai-copy-modal-footer');
                                if (_footer2) {
                                    _footer2.style.borderTop = '1px solid rgba(255,255,255,.05)';
                                }
                            }
                        }
                    } catch (e) { console.warn("[AI智脑Pro] 复制弹窗主题同步失败:", e.message); }

                    // 更新按钮状态
                    themeBtns.forEach(function (btn) {
                        btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
                    });

                    try { localStorage.setItem('cxaiSetting.theme', theme); } catch (e) { console.warn("[AI智脑Pro] 异常:", e && e.message || 'error'); }
                    // 广播主题变化给划词搜题模块
                    try { window.dispatchEvent(new CustomEvent('cxai-theme-change', { detail: { theme: theme } })); } catch (e) {}
                }

                // 初始化
                var savedTheme = getSavedTheme();
                applyTheme(savedTheme);

                // 监听按钮点击
                themeBtns.forEach(function (btn) {
                    btn.addEventListener('click', function () {
                        var theme = btn.getAttribute('data-theme');
                        if (theme) applyTheme(theme);
                    });
                });

                // 监听系统主题变化（仅 auto 模式）
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
                    if (getSavedTheme() === 'auto') {
                        applyTheme('auto');
                    }
                });
            })();
            // ======== 主题弹出层（右上角图标） ========
            (function () {
                var toggleBtn = _cxaiFindEl('cxai-theme-toggle-btn');
                var popover = _cxaiFindEl('cxai-theme-popover');
                if (!toggleBtn || !popover) return;

                var popoverBtns = popover.querySelectorAll('.cxai-theme-popover-btn');

                function getSavedTheme() {
                    try { return localStorage.getItem('cxaiSetting.theme') || 'auto'; } catch (e) { return 'auto'; }
                }

                function applyTheme(theme) {
                    var themeRoot = _cxaiFindEl('cxai-float-root');
                    if (!themeRoot) return;
                    themeRoot.removeAttribute('data-cxai-theme-light');
                    themeRoot.removeAttribute('data-cxai-theme-dark');
                    themeRoot.removeAttribute('data-cxai-theme-auto');
                    if (theme === 'light') {
                        themeRoot.setAttribute('data-cxai-theme-light', '');
                    } else if (theme === 'dark') {
                        themeRoot.setAttribute('data-cxai-theme-dark', '');
                    } else {
                        themeRoot.setAttribute('data-cxai-theme-auto', '');
                        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                            themeRoot.setAttribute('data-cxai-theme-dark', '');
                        } else {
                            themeRoot.setAttribute('data-cxai-theme-light', '');
                        }
                    }
                    popoverBtns.forEach(function (btn) {
                        btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
                    });
                    try { localStorage.setItem('cxaiSetting.theme', theme); } catch (e) { console.warn("[AI智脑Pro] 异常:", e && e.message || 'error'); }
                }

                // 初始化弹出层按钮状态
                var savedTheme = getSavedTheme();
                popoverBtns.forEach(function (btn) {
                    btn.classList.toggle('active', btn.getAttribute('data-theme') === savedTheme);
                });

                // 切换弹出层显示
                toggleBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    popover.classList.toggle('open');
                });

                // 点击弹出层内按钮
                popoverBtns.forEach(function (btn) {
                    btn.addEventListener('click', function (e) {
                        e.stopPropagation();
                        var theme = btn.getAttribute('data-theme');
                        if (theme) applyTheme(theme);
                        popover.classList.remove('open');
                    });
                });

                // 点击外部关闭弹出层
                _boxDoc.addEventListener('click', function (e) {
                    if (!popover.contains(e.target) && e.target !== toggleBtn) {
                        popover.classList.remove('open');
                    }
                });

                // 监听系统主题变化
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
                    if (getSavedTheme() === 'auto') applyTheme('auto');
                });
            })();
        })();
    } else {
    }
    let _u = cxai_getCk('_uid') || cxai_getCk('UID')
    // 更新 UID 显示
    var uidText = _cxaiFindEl('cxai-uid-text');
    if (uidText) uidText.textContent = _u || '-';

    // 渲染 Provider/模型 下拉选择器
    cxai_renderModelSelectors();
}


// =============== 模型管理弹窗（类似 WorkBuddy / Claude 风格） ===============

function cxai_showModelManager() {
    // 如果已存在则聚焦
    var existing = document.getElementById('cxai-model-manager-overlay');
    if (existing) { existing.style.display = 'flex'; return; }

    var overlay = document.createElement('div');
    overlay.id = 'cxai-model-manager-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:100001;display:flex;justify-content:center;align-items:center;backdrop-filter:blur(4px);';
    // 根据当前主题设置属性
    try {
        var _theme = localStorage.getItem('cxaiSetting.theme') || 'auto';
        if (_theme === 'auto') {
            _theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        overlay.setAttribute('data-cxai-theme', _theme);
    } catch(e) { overlay.setAttribute('data-cxai-theme', 'dark'); }

    var providers = cxai_getCustomProviders();
    var aiAnswerEnabled = localStorage.getItem('cxaiSetting.aiAnswerEnabled') !== 'false';
    var enabledModels = cxai_getEnabledModels();
    var modelPriority = cxai_getModelPriority();

    // 自动补全：启用但不在优先级列表中的模型，追加到末尾
    if (enabledModels.length > 0) {
        var changed = false;
        for (var ep = 0; ep < enabledModels.length; ep++) {
            if (modelPriority.indexOf(enabledModels[ep]) === -1) {
                modelPriority.push(enabledModels[ep]);
                changed = true;
            }
        }
        if (changed) cxai_setModelPriority(modelPriority);
    }

    // 自动清理：移除已删除 provider 的残留条目（幽灵模型）
    var validKeys = [];
    providers.forEach(function (p) {
        (p.models || []).forEach(function (m) {
            validKeys.push(p.id + ':' + m);
        });
    });
    if (validKeys.length > 0) {
        var needSave = false;
        if (modelPriority.some(function(k) { return validKeys.indexOf(k) === -1; })) {
            modelPriority = modelPriority.filter(function(k) { return validKeys.indexOf(k) !== -1; });
            cxai_setModelPriority(modelPriority);
            needSave = true;
        }
        if (enabledModels.some(function(k) { return validKeys.indexOf(k) === -1; })) {
            enabledModels = enabledModels.filter(function(k) { return validKeys.indexOf(k) !== -1; });
            cxai_setEnabledModels(enabledModels);
            needSave = true;
        }
        if (needSave) {
            cxai_logger('已自动清理 ' + (modelPriority.length + enabledModels.length) + ' 个残留模型条目', 'info');
        }
    }

    // 按 modelPriority 对 providers 排序：有更高优先级模型的 provider 排在前面
    providers.sort(function (a, b) {
        var aMin = Infinity, bMin = Infinity;
        var aModels = (a.models || []).map(function (m) { return a.id + ':' + m; });
        var bModels = (b.models || []).map(function (m) { return b.id + ':' + m; });
        for (var k = 0; k < modelPriority.length; k++) {
            if (aModels.indexOf(modelPriority[k]) !== -1 && k < aMin) aMin = k;
            if (bModels.indexOf(modelPriority[k]) !== -1 && k < bMin) bMin = k;
        }
        if (aMin === Infinity && bMin === Infinity) return 0;
        if (aMin === Infinity) return 1;
        if (bMin === Infinity) return -1;
        return aMin - bMin;
    });

    var listHtml = '';
    if (providers.length === 0) {
        listHtml = '<div style="color:rgba(160,166,186,.5);font-size:12px;text-align:center;padding:20px 0;">暂无模型，请添加</div>';
    } else {
        for (var i = 0; i < providers.length; i++) {
            var p = providers[i];
            listHtml += '<div style="margin-bottom:10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:10px;overflow:hidden;">';
            // Provider 头部：左侧文本，右侧按钮组固定宽度保证严格对齐
            listHtml += '<div style="display:flex;align-items:center;justify-content:flex-end;gap:4px;padding:10px 12px;background:rgba(255,255,255,.03);">';
            listHtml += '<div style="flex:1;min-width:0;overflow:hidden;margin-right:8px;">';
            listHtml += '<div style="font-size:13px;color:rgba(220,224,236,.9);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + cxai_escapeHtml(p.name) + '</div>';
            listHtml += '<div style="font-size:11px;color:rgba(160,166,186,.55);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + cxai_escapeHtml(p.endpoint) + '</div>';
            listHtml += '</div>';
            // 按钮组：只保留编辑+删除两个固定宽度按钮，天然同线对齐
            listHtml += '<button class="cxai-btn cxai-btn-secondary cxai-edit-provider" data-id="' + p.id + '" title="修改此模型的接口地址、Key 和模型列表" style="padding:5px 10px;font-size:10px;min-width:auto;border-radius:6px;flex-shrink:0;">编辑</button>';
            listHtml += '<button class="cxai-btn cxai-btn-secondary cxai-delete-provider" data-id="' + p.id + '" title="删除此模型配置（不可恢复）" style="padding:5px 10px;font-size:10px;min-width:auto;border-radius:6px;color:#f87171;border-color:rgba(248,113,113,.2);flex-shrink:0;">删除</button>';
            listHtml += '</div>';
            // 模型勾选列表
            if (p.models && p.models.length > 0) {
                // 按 modelPriority 排序：优先级列表中靠前的排前面，其余保持原顺序
                var inPriority = [];
                var notInPriority = [];
                for (var mp = 0; mp < p.models.length; mp++) {
                    var key = p.id + ':' + p.models[mp];
                    if (modelPriority.indexOf(key) !== -1) {
                        inPriority.push(p.models[mp]);
                    } else {
                        notInPriority.push(p.models[mp]);
                    }
                }
                inPriority.sort(function (a, b) {
                    var ia = modelPriority.indexOf(p.id + ':' + a);
                    var ib = modelPriority.indexOf(p.id + ':' + b);
                    return ia - ib;
                });
                var sortedModels = inPriority.concat(notInPriority);
                listHtml += '<div style="padding:6px 12px 10px 12px;border-top:1px solid rgba(255,255,255,.04);">';
                for (var m = 0; m < sortedModels.length; m++) {
                    var modelName = sortedModels[m];
                    var checked = enabledModels.indexOf(p.id + ':' + modelName) !== -1;
                    var rawKey = p.id + ':' + modelName;
                    listHtml += '<label style="display:flex;align-items:center;gap:6px;padding:3px 0;cursor:pointer;font-size:11px;color:rgba(200,204,218,.75);">';
                    listHtml += '<input type="checkbox" class="cxai-model-enabled-cb" data-provider="' + p.id + '" data-model="' + cxai_escapeHtml(modelName) + '"' + (checked ? ' checked' : '') + ' style="accent-color:#818cf8;width:13px;height:13px;cursor:pointer;">';
                    listHtml += '<span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;">' + cxai_escapeHtml(modelName) + '</span>';
                    listHtml += '<span style="display:flex;gap:1px;flex-shrink:0;">';
                    listHtml += '<button type="button" class="cxai-priority-up" data-raw-key="' + rawKey + '" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:rgba(200,204,218,.5);border-radius:3px;padding:1px 4px;font-size:9px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;">▲</button>';
                    listHtml += '<button type="button" class="cxai-priority-down" data-raw-key="' + rawKey + '" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:rgba(200,204,218,.5);border-radius:3px;padding:1px 4px;font-size:9px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;">▼</button>';
                    listHtml += '</span>';
                    listHtml += '</label>';
                }
                listHtml += '</div>';
            }
            listHtml += '</div>';
        }
    }

    overlay.innerHTML = '<div id="cxai-model-panel" style="width:520px;max-width:92vw;max-height:85vh;border-radius:14px;display:flex;flex-direction:column;overflow:hidden;">' +
        '<div style="padding:18px 20px 14px;border-bottom:1px solid rgba(255,255,255,.06);">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
        '<div><div style="font-size:16px;font-weight:600;color:rgba(235,237,245,.95);">添加模型</div>' +
        '<div style="font-size:11px;color:rgba(160,166,186,.5);margin-top:2px;">仅支持 OpenAI 兼容协议 API</div></div>' +
        '<button id="cxai-close-model-manager" style="background:none;border:none;color:rgba(200,204,218,.55);font-size:20px;cursor:pointer;padding:0;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:all .2s;">×</button></div>' +
        '<div style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:rgba(255,255,255,.03);border-radius:8px;border:1px solid rgba(255,255,255,.06);">' +
        '<input type="checkbox" id="cxai-ai-answer-toggle"' + (aiAnswerEnabled ? ' checked' : '') + ' style="accent-color:#818cf8;width:14px;height:14px;cursor:pointer;">' +
        '<label for="cxai-ai-answer-toggle" style="font-size:12px;color:rgba(220,224,236,.85);cursor:pointer;flex:1;">启用 AI 答题</label>' +
        '<span style="font-size:10px;color:rgba(160,166,186,.45);">关闭后仅使用题库</span>' +
        '</div></div>' +
        '<div style="padding:16px 20px;overflow-y:auto;flex:1;">' +
        '<div style="font-size:12px;color:rgba(175,181,202,.65);margin-bottom:8px;font-weight:500;">模型列表（勾选启用答题，▲▼ 调整重试优先级）</div>' +
        '<div id="cxai-model-list">' + listHtml + '</div>' +

        // 全局模型优先级列表（扁平化，跨 provider）
        '<div style="margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,.06);">' +
        '<div style="font-size:12px;color:rgba(175,181,202,.65);margin-bottom:8px;font-weight:500;">全局模型优先级（调整答题重试顺序）</div>' +
        '<div id="cxai-global-priority-list">' +
        function () {
            var gpHtml = '';
            // 过滤：只保留 provider 仍存在且模型仍启用的项
            var validEnabled = enabledModels.filter(function (k) {
                var parts = k.split(':');
                if (parts.length !== 2) return false;
                var pid = parts[0], mname = parts[1];
                var prov = providers.find(function (p) { return p.id === pid; });
                if (!prov) return false;
                if (!prov.models || prov.models.indexOf(mname) === -1) return false;
                return true;
            });
            var allEnabled = validEnabled.slice().sort(function (a, b) {
                var ia = modelPriority.indexOf(a);
                var ib = modelPriority.indexOf(b);
                if (ia === -1 && ib === -1) return 0;
                if (ia === -1) return 1;
                if (ib === -1) return -1;
                return ia - ib;
            });
            for (var g = 0; g < allEnabled.length; g++) {
                var gKey = allEnabled[g];
                var gParts = gKey.split(':');
                var gProviderId = gParts[0];
                var gModelName = gParts[1];
                var gProvider = providers.find(function (p) { return p.id === gProviderId; });
                if (!gProvider) continue; // provider 已删除，跳过
                var gProviderName = gProvider.name;
                var gIdx = modelPriority.indexOf(gKey);
                var gNum = gIdx === -1 ? (g + 1) : (gIdx + 1);
                gpHtml += '<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:8px;margin-bottom:4px;">';
                gpHtml += '<span style="font-size:11px;color:rgba(160,166,186,.5);width:20px;text-align:center;flex-shrink:0;">' + gNum + '.</span>';
                gpHtml += '<span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;font-size:11px;color:rgba(200,204,218,.8);">' + cxai_escapeHtml(gProviderName) + ' / ' + cxai_escapeHtml(gModelName) + '</span>';
                gpHtml += '<span style="display:flex;gap:2px;flex-shrink:0;">';
                gpHtml += '<button type="button" class="cxai-priority-up" data-raw-key="' + gKey + '" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:rgba(200,204,218,.5);border-radius:3px;padding:1px 5px;font-size:9px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;">▲</button>';
                gpHtml += '<button type="button" class="cxai-priority-down" data-raw-key="' + gKey + '" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:rgba(200,204,218,.5);border-radius:3px;padding:1px 5px;font-size:9px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;">▼</button>';
                gpHtml += '</span>';
                gpHtml += '</div>';
            }
            return gpHtml;
        }() +
        '</div>' +

        '<div style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,.06);">' +
        '<div style="font-size:12px;color:rgba(175,181,202,.65);margin-bottom:8px;font-weight:500;">' + (document.getElementById('cxai-edit-provider-id') ? '编辑模型' : '新增模型') + '</div>' +
        '<input type="hidden" id="cxai-edit-provider-id" value="">' +
        '<label style="font-size:11px;color:rgba(170,178,200,.65);display:block;margin-bottom:3px;">显示名称</label>' +
        '<input type="text" id="cxai-model-name" placeholder="例如: 阶跃星辰 / DeepSeek" style="width:100%;padding:8px 10px;font-size:12px;border-radius:8px;border:1px solid rgba(255,255,255,.09);background:rgba(0,0,0,.2);color:rgba(220,224,236,.86);margin-bottom:8px;box-sizing:border-box;">' +
        '<label style="font-size:11px;color:rgba(170,178,200,.65);display:block;margin-bottom:3px;">接口地址</label>' +
        '<input type="text" id="cxai-model-endpoint" placeholder="https://api.example.com/v1/chat/completions" style="width:100%;padding:8px 10px;font-size:12px;border-radius:8px;border:1px solid rgba(255,255,255,.09);background:rgba(0,0,0,.2);color:rgba(220,224,236,.86);margin-bottom:8px;box-sizing:border-box;">' +
        '<label style="font-size:11px;color:rgba(170,178,200,.65);display:block;margin-bottom:3px;">API Key</label>' +
        '<input type="password" id="cxai-model-apikey" placeholder="输入你的 API Key" autocomplete="new-password" style="width:100%;padding:8px 10px;font-size:12px;border-radius:8px;border:1px solid rgba(255,255,255,.09);background:rgba(0,0,0,.2);color:rgba(220,224,236,.86);margin-bottom:8px;box-sizing:border-box;">' +
        '<label style="font-size:11px;color:rgba(170,178,200,.65);display:block;margin-bottom:3px;">模型名称（逗号分隔）</label>' +
        '<input type="text" id="cxai-model-names" placeholder="例如: gpt-4o, openai/gpt-4o" style="width:100%;padding:8px 10px;font-size:12px;border-radius:8px;border:1px solid rgba(255,255,255,.09);background:rgba(0,0,0,.2);color:rgba(220,224,236,.86);margin-bottom:10px;box-sizing:border-box;">' +
        '<div style="display:flex;gap:8px;">' +
        '<button id="cxai-save-model-btn" class="cxai-btn cxai-btn-primary" title="保存当前配置到本地" style="flex:1;padding:5px 10px;font-size:10px;border-radius:6px;">保存</button>' +
        '<button id="cxai-test-model-btn" class="cxai-btn cxai-btn-secondary" title="发送测试请求，验证接口是否可用" style="flex:1;padding:5px 10px;font-size:10px;border-radius:6px;">检测</button>' +
        '<button id="cxai-cancel-edit-model-btn" class="cxai-btn cxai-btn-secondary" title="放弃编辑，清空表单" style="flex:1;padding:5px 10px;font-size:10px;border-radius:6px;">取消编辑</button>' +
        '</div>' +
        '<div id="cxai-test-result" style="margin-top:10px;font-size:11px;display:none;padding:8px 10px;border-radius:8px;"></div>' +
        '</div></div></div></div>';

    document.body.appendChild(overlay);

    // 关闭按钮
    document.getElementById('cxai-close-model-manager').addEventListener('click', function () {
        overlay.remove();
        // 关闭弹窗后同步刷新外面模型 tab
        cxai_renderModelSelectors();
    });
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            overlay.remove();
            // 关闭弹窗后同步刷新外面模型 tab
            cxai_renderModelSelectors();
        }
    });

    // AI 答题总开关
    var aiToggle = document.getElementById('cxai-ai-answer-toggle');
    if (aiToggle) {
        aiToggle.addEventListener('change', function () {
            localStorage.setItem('cxaiSetting.aiAnswerEnabled', this.checked ? 'true' : 'false');
            cxai_logger(this.checked ? 'AI 答题已启用' : 'AI 答题已关闭，仅使用题库', this.checked ? 'green' : 'gray');
        });
    }

    // 模型启用 checkbox + 优先级调整
    overlay.querySelectorAll('.cxai-model-enabled-cb').forEach(function (cb) {
        cb.addEventListener('change', function () {
            var pid = this.getAttribute('data-provider');
            var mname = this.getAttribute('data-model');
            cxai_setModelEnabled(pid, mname, this.checked);
            cxai_logger((this.checked ? '启用' : '禁用') + '模型: ' + cxai_formatModelKey(pid + ':' + mname), this.checked ? 'green' : 'gray');
            // 取消勾选时从优先级列表移除
            if (!this.checked) {
                var _pKey = pid + ':' + mname;
                var _pList = cxai_getModelPriority();
                var _pIdx = _pList.indexOf(_pKey);
                if (_pIdx !== -1) {
                    _pList.splice(_pIdx, 1);
                    cxai_setModelPriority(_pList);
                }
            }
            // 刷新模型下拉框和优先级列表
            cxai_renderModelSelectors();
            cxai_refreshCurrentModelDisplay();
            cxai_refreshModelManager();
        });
    });

    // 优先级上移
    overlay.querySelectorAll('.cxai-priority-up').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var key = this.getAttribute('data-raw-key');
            var priority = cxai_getModelPriority();
            var idx = priority.indexOf(key);
            if (idx === -1) {
                priority.push(key);
                cxai_setModelPriority(priority);
                cxai_refreshModelManager();
                cxai_logger('[优先级] 已添加: ' + cxai_formatModelKey(key), 'info');
                return;
            }
            if (idx > 0) {
                var tmp = priority[idx - 1];
                priority[idx - 1] = priority[idx];
                priority[idx] = tmp;
                cxai_setModelPriority(priority);
                cxai_syncCurrentModelToPriority();
                cxai_refreshCurrentModelDisplay();
                cxai_refreshModelManager();
                cxai_logger('[优先级] 上移: ' + cxai_formatModelKey(key) + ' ↑', 'info');
            } else {
                cxai_logger('[优先级] ' + cxai_formatModelKey(key) + ' 已在最顶端', 'info');
            }
        });
    });

    // 优先级下移
    overlay.querySelectorAll('.cxai-priority-down').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var key = this.getAttribute('data-raw-key');
            var priority = cxai_getModelPriority();
            var idx = priority.indexOf(key);
            if (idx === -1) {
                priority.push(key);
                cxai_setModelPriority(priority);
                cxai_refreshModelManager();
                cxai_logger('[优先级] 已添加: ' + cxai_formatModelKey(key), 'info');
                return;
            }
            if (idx >= 0 && idx < priority.length - 1) {
                var tmp = priority[idx + 1];
                priority[idx + 1] = priority[idx];
                priority[idx] = tmp;
                cxai_setModelPriority(priority);
                cxai_syncCurrentModelToPriority();
                cxai_refreshCurrentModelDisplay();
                cxai_refreshModelManager();
                cxai_logger('[优先级] 下移: ' + cxai_formatModelKey(key) + ' ↓', 'info');
            } else {
                cxai_logger('[优先级] ' + cxai_formatModelKey(key) + ' 已在最底端', 'info');
            }
        });
    });

    // 编辑按钮
    overlay.querySelectorAll('.cxai-edit-provider').forEach(function (btn) {
        btn.addEventListener('click', function () {
            cxai_editProviderInModal(this.getAttribute('data-id'));
        });
    });

    // 删除按钮
    overlay.querySelectorAll('.cxai-delete-provider').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var pid = this.getAttribute('data-id');
            if (!confirm('确定删除此模型配置吗？')) return;
            var customs = cxai_getCustomProviders();
            customs = customs.filter(function (p) { return p.id !== pid; });
            cxai_saveCustomProviders(customs);
            // 清理 enabledModels 中该 provider 的所有残留项
            var _enabled = cxai_getEnabledModels();
            _enabled = _enabled.filter(function (k) { return k.split(':')[0] !== pid; });
            cxai_setEnabledModels(_enabled);
            // 清理 modelPriority 中该 provider 的所有残留项
            var _prio = cxai_getModelPriority();
            _prio = _prio.filter(function (k) { return k.split(':')[0] !== pid; });
            cxai_setModelPriority(_prio);
            cxai_syncCurrentModelToPriority();
            cxai_refreshModelManager();
            // 刷新下拉 + 实时刷新主界面优先级列表
            cxai_refreshCurrentModelDisplay();
            cxai_renderPriorityList(localStorage.getItem('cxaiSetting.provider') || '', localStorage.getItem('cxaiSetting.model') || '');
        });
    });

    // 保存按钮
    document.getElementById('cxai-save-model-btn').addEventListener('click', function () {
        cxai_saveProviderFromModal();
    });

    // === 检测连接按钮 ===
    document.getElementById('cxai-test-model-btn').addEventListener('click', function () {
        cxai_testModelConnection();
    });

    // 取消编辑按钮
    document.getElementById('cxai-cancel-edit-model-btn').addEventListener('click', function () {
        document.getElementById('cxai-edit-provider-id').value = '';
        document.getElementById('cxai-model-name').value = '';
        document.getElementById('cxai-model-endpoint').value = '';
        document.getElementById('cxai-model-apikey').value = '';
        document.getElementById('cxai-model-names').value = '';
        var titleDiv = overlay.querySelector('.cxai-model-manager-title');
        // 简单刷新整个弹窗
        cxai_refreshModelManager();
    });
}

function cxai_refreshModelManager() {
    var overlay = document.getElementById('cxai-model-manager-overlay');
    if (!overlay) return;
    overlay.remove();
    cxai_showModelManager();
    // 同步刷新外面模型 tab 的优先级列表
    cxai_renderModelSelectors();
}

function cxai_editProviderInModal(pid) {
    var customs = cxai_getCustomProviders();
    var cp = null;
    for (var i = 0; i < customs.length; i++) {
        if (customs[i].id === pid) { cp = customs[i]; break; }
    }
    if (!cp) return;
    document.getElementById('cxai-edit-provider-id').value = cp.id;
    document.getElementById('cxai-model-name').value = cp.name || '';
    document.getElementById('cxai-model-endpoint').value = cp.endpoint || '';
    document.getElementById('cxai-model-apikey').value = cp.apiKey || '';
    document.getElementById('cxai-model-names').value = (cp.models || []).join(', ');
    // 滚动到表单
    var formDiv = document.getElementById('cxai-model-names');
    if (formDiv) formDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function cxai_saveProviderFromModal() {
    var editId = document.getElementById('cxai-edit-provider-id').value;
    var name = document.getElementById('cxai-model-name').value.trim();
    var endpoint = document.getElementById('cxai-model-endpoint').value.trim();
    var apiKey = document.getElementById('cxai-model-apikey').value.trim();
    var modelsStr = document.getElementById('cxai-model-names').value;

    if (!name) {
        alert('请填写显示名称');
        return;
    }
    if (!endpoint) {
        alert('请填写接口地址');
        return;
    }
    var models = modelsStr.split(/[,，;；、\n\r]+/).map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; });
    if (models.length === 0) {
        alert('请至少填写一个模型名称');
        return;
    }

    var customs = cxai_getCustomProviders();

    if (editId) {
        for (var i = 0; i < customs.length; i++) {
            if (customs[i].id === editId) {
                customs[i].endpoint = endpoint;
                customs[i].apiKey = apiKey;
                customs[i].models = models;
                if (name) customs[i].name = name;
                break;
            }
        }
    } else {
        customs.push({
            id: cxai_generateId(),
            name: name,
            endpoint: endpoint,
            apiKey: apiKey,
            models: models,
            authType: 'bearer',
            format: 'openai'
        });
    }
    cxai_saveCustomProviders(customs);

    // 如果是新增，自动选中
    if (!editId && customs.length > 0) {
        localStorage.setItem('cxaiSetting.provider', customs[customs.length - 1].id);
    }

    cxai_refreshModelManager();
    cxai_refreshCurrentModelDisplay();
}

function cxai_refreshCurrentModelDisplay() {
    var _cfg = cxaiGetProviderConfig();
    if (_cfg.provider && _cfg.apiKey) {
        $('#cxai-userInfo').html('当前模型: <b>' + cxai_escapeHtml(_cfg.model) + '</b> / ' + cxai_escapeHtml(_cfg.provider.name));
    } else {
        $('#cxai-userInfo').html('请点击「管理模型」添加你的第一个模型');
    }
    // 同步刷新模型 Tab 下拉框和信息
    cxai_renderModelSelectors();
}

// =============== 模型 Tab 下拉选择器 ===============

function cxai_renderModelSelectors() {
    var providerSel = document.getElementById('cxai-provider-select');
    var modelSel = document.getElementById('cxai-model-select');
    var infoCard = document.getElementById('cxai-userInfo-ai');
    if (!providerSel || !modelSel) return;

    var customs = cxai_getCustomProviders();
    var currentProviderKey = localStorage.getItem('cxaiSetting.provider') || '';
    var currentModel = localStorage.getItem('cxaiSetting.model') || '';
    var enabledModels = cxai_getEnabledModels();
    var hasEnabledModels = enabledModels.length > 0;

    // 自动清理：移除已删除 provider 的残留条目（幽灵模型）
    var validKeys = [];
    customs.forEach(function (p) {
        (p.models || []).forEach(function (m) {
            validKeys.push(p.id + ':' + m);
        });
    });
    // 也加上内置 PROVIDERS
    for (var pk in PROVIDERS) {
        if (PROVIDERS.hasOwnProperty(pk) && PROVIDERS[pk].models) {
            PROVIDERS[pk].models.forEach(function (m) {
                validKeys.push(pk + ':' + m);
            });
        }
    }
    if (validKeys.length > 0) {
        var needSave = false;
        if (enabledModels.some(function(k) { return validKeys.indexOf(k) === -1; })) {
            enabledModels = enabledModels.filter(function(k) { return validKeys.indexOf(k) !== -1; });
            cxai_setEnabledModels(enabledModels);
            needSave = true;
        }
        // 同时清理 modelPriority 中已删除 provider 的残留项
        var _prioNow = cxai_getModelPriority();
        if (_prioNow.some(function(k) { return validKeys.indexOf(k) === -1; })) {
            _prioNow = _prioNow.filter(function(k) { return validKeys.indexOf(k) !== -1; });
            cxai_setModelPriority(_prioNow);
            needSave = true;
        }
        if (needSave) {
            cxai_logger('已自动清理残留模型条目', 'info');
        }
    }

    // 辅助：检查 provider 是否有启用模型
    function providerHasEnabled(cp) {
        if (!hasEnabledModels || !cp.models) return true;
        for (var m = 0; m < cp.models.length; m++) {
            if (enabledModels.indexOf(cp.id + ':' + cp.models[m]) !== -1) return true;
        }
        return false;
    }
    // 辅助：获取 provider 的启用模型列表（按 modelPriority 排序）
    function getEnabledModelsOf(cp) {
        if (!hasEnabledModels || !cp.models) return cp.models || [];
        var result = [];
        for (var m = 0; m < cp.models.length; m++) {
            if (enabledModels.indexOf(cp.id + ':' + cp.models[m]) !== -1) {
                result.push(cp.models[m]);
            }
        }
        // 按 modelPriority 排序
        var priority = cxai_getModelPriority();
        if (priority.length > 0) {
            result.sort(function (a, b) {
                var ia = priority.indexOf(cp.id + ':' + a);
                var ib = priority.indexOf(cp.id + ':' + b);
                if (ia === -1 && ib === -1) return 0;
                if (ia === -1) return 1;
                if (ib === -1) return -1;
                return ia - ib;
            });
        }
        return result;
    }

    // 构建 Provider 下拉（只显示有启用模型的 provider）
    var providerHtml = '';
    var filteredCustoms = customs.filter(providerHasEnabled);
    if (filteredCustoms.length === 0) {
        providerHtml = '<option value="">-- 暂无可用模型 --</option>';
    }
    for (var i = 0; i < filteredCustoms.length; i++) {
        var cp = filteredCustoms[i];
        var sel = (cp.id === currentProviderKey) ? ' selected' : '';
        providerHtml += '<option value="' + cxai_escapeHtml(cp.id) + '"' + sel + '>' + cxai_escapeHtml(cp.name) + '</option>';
    }
    providerSel.innerHTML = providerHtml;

    // 查找当前选中的 provider（优先从过滤后的列表找）
    var selectedProvider = null;
    for (var j = 0; j < filteredCustoms.length; j++) {
        if (filteredCustoms[j].id === currentProviderKey) { selectedProvider = filteredCustoms[j]; break; }
    }
    // 如果当前选中 provider 不在过滤列表中，选第一个
    if (!selectedProvider && filteredCustoms.length > 0) {
        selectedProvider = filteredCustoms[0];
        localStorage.setItem('cxaiSetting.provider', selectedProvider.id);
        currentProviderKey = selectedProvider.id;
    }

    // 构建模型下拉（只显示启用的模型）
    var modelHtml = '';
    var enabledList = selectedProvider ? getEnabledModelsOf(selectedProvider) : [];
    if (!selectedProvider || enabledList.length === 0) {
        modelHtml = '<option value="">-- 请选择接口 --</option>';
    } else {
        for (var k = 0; k < enabledList.length; k++) {
            var m = enabledList[k];
            var mSel = (m === currentModel) ? ' selected' : '';
            modelHtml += '<option value="' + cxai_escapeHtml(m) + '"' + mSel + '>' + cxai_escapeHtml(m) + '</option>';
        }
        // 如果当前 model 不在启用列表里，选中第一个启用模型
        if (currentModel && enabledList.indexOf(currentModel) === -1) {
            modelSel.value = enabledList[0];
            localStorage.setItem('cxaiSetting.model', enabledList[0]);
        }
    }
    modelSel.innerHTML = modelHtml;

    // 更新信息卡片（模型 tab）
    var _cfg = cxaiGetProviderConfig();
    if (infoCard) {
        if (_cfg.provider && _cfg.apiKey) {
            infoCard.innerHTML = '当前模型: <b>' + cxai_escapeHtml(_cfg.model) + '</b> / ' + cxai_escapeHtml(_cfg.provider.name);
        } else {
            infoCard.innerHTML = '请点击「管理模型」添加模型，或配置题库';
        }
    }
    // 同步更新设置 tab 的信息卡片，避免设置 tab 模型信息滞后
    var settingsInfoCard = document.getElementById('cxai-userInfo');
    if (settingsInfoCard) {
        if (_cfg.provider && _cfg.apiKey) {
            settingsInfoCard.innerHTML = '当前模型: <b>' + cxai_escapeHtml(_cfg.model) + '</b> / ' + cxai_escapeHtml(_cfg.provider.name);
        } else {
            settingsInfoCard.innerHTML = '请点击「管理模型」添加你的第一个模型';
        }
    }

    // === 事件：切换 Provider ===
    providerSel.onchange = function () {
        var newKey = providerSel.value;
        if (!newKey) return;
        localStorage.setItem('cxaiSetting.provider', newKey);

        // 查找新 provider 的启用模型列表，自动选中第一个
        var newProvider = null;
        for (var n = 0; n < filteredCustoms.length; n++) {
            if (filteredCustoms[n].id === newKey) { newProvider = filteredCustoms[n]; break; }
        }
        if (newProvider) {
            var newEnabled = getEnabledModelsOf(newProvider);
            if (newEnabled.length > 0) {
                localStorage.setItem('cxaiSetting.model', newEnabled[0]);
            }
        }
        cxai_renderModelSelectors();
    };

    // === 事件：切换模型 ===
    modelSel.onchange = function () {
        var newModel = modelSel.value;
        if (!newModel) return;
        localStorage.setItem('cxaiSetting.model', newModel);
        cxai_renderModelSelectors();
    };

    // === 渲染模型重试优先级列表 ===
    cxai_renderPriorityList(currentProviderKey, currentModel);
}

// 独立渲染主界面模型优先级列表（#1/#2），自动跳过已删除 provider 的残留项
function cxai_renderPriorityList(currentProviderKey, currentModel) {
    var priorityListEl = document.getElementById('cxai-model-priority-list');
    if (!priorityListEl) return;
    var priority = cxai_getModelPriority();
    var allCustoms = cxai_getCustomProviders();
    var providerMap = {};
    for (var pi = 0; pi < allCustoms.length; pi++) {
        providerMap[allCustoms[pi].id] = allCustoms[pi];
    }

    var priorityHtml = '';
    if (priority.length === 0) {
        priorityHtml = '<div style="font-size:10px;color:rgba(160,166,186,.4);padding:6px 8px;text-align:center;">未设置优先级，AI 答题失败后不会自动切换模型</div>';
    } else {
        var shown = 0;
        for (var pj = 0; pj < priority.length; pj++) {
            var prioKey = priority[pj];
            var parts = prioKey.split(':');
            if (parts.length !== 2) continue;
            var pId = parts[0], mName = parts[1];
            // 跳过已删除 provider 的残留项（providerMap 中不存在）
            if (!providerMap[pId]) continue;
            var pName = providerMap[pId].name;
            var isCurrent = (pId === currentProviderKey && mName === currentModel);
            shown++;
            priorityHtml += '<div style="display:flex;align-items:center;gap:6px;padding:4px 8px;margin-bottom:3px;background:' + (isCurrent ? 'rgba(129,140,248,.1)' : 'rgba(255,255,255,.02)') + ';border-radius:6px;border:1px solid ' + (isCurrent ? 'rgba(129,140,248,.2)' : 'rgba(255,255,255,.04)') + ';">';
            priorityHtml += '<span style="font-size:10px;color:rgba(160,166,186,.4);min-width:16px;">#' + shown + '</span>';
            priorityHtml += '<span style="flex:1;font-size:11px;color:rgba(220,224,236,.8);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="' + cxai_escapeHtml(pName) + ' / ' + cxai_escapeHtml(mName) + '">' + cxai_escapeHtml(pName) + ' / ' + cxai_escapeHtml(mName) + '</span>';
            if (isCurrent) {
                priorityHtml += '<span style="font-size:9px;color:#818cf8;padding:1px 4px;background:rgba(129,140,248,.15);border-radius:3px;">当前</span>';
            }
            priorityHtml += '</div>';
        }
        if (shown === 0) {
            priorityHtml = '<div style="font-size:10px;color:rgba(160,166,186,.4);padding:6px 8px;text-align:center;">未设置优先级，AI 答题失败后不会自动切换模型</div>';
        }
    }
    priorityListEl.innerHTML = priorityHtml;
}

// =============== 模型连接检测 ===============

function cxai_testModelConnection() {
    var resultDiv = document.getElementById('cxai-test-result');
    var testBtn = document.getElementById('cxai-test-model-btn');

    // 读取表单数据
    var endpoint = document.getElementById('cxai-model-endpoint').value.trim();
    var apiKey = document.getElementById('cxai-model-apikey').value.trim();
    var modelsStr = document.getElementById('cxai-model-names').value;
    // 支持英文逗号、中文逗号、顿号、分号、换行等多种分隔符
    var models = modelsStr.split(/[,，;；、\n\r]+/).map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; });

    // 校验
    if (!endpoint) {
        resultDiv.style.display = 'block';
        resultDiv.style.background = 'rgba(248,113,113,.12)';
        resultDiv.style.border = '1px solid rgba(248,113,113,.25)';
        resultDiv.style.color = '#f87171';
        resultDiv.textContent = '请填写接口地址';
        return;
    }
    if (!apiKey) {
        resultDiv.style.display = 'block';
        resultDiv.style.background = 'rgba(248,113,113,.12)';
        resultDiv.style.border = '1px solid rgba(248,113,113,.25)';
        resultDiv.style.color = '#f87171';
        resultDiv.textContent = '请填写 API Key';
        return;
    }
    if (models.length === 0) {
        resultDiv.style.display = 'block';
        resultDiv.style.background = 'rgba(248,113,113,.12)';
        resultDiv.style.border = '1px solid rgba(248,113,113,.25)';
        resultDiv.style.color = '#f87171';
        resultDiv.textContent = '请至少填写一个模型名称';
        return;
    }

    var testUrl = cxaiNormalizeEndpoint(endpoint);

    // 初始化结果容器
    resultDiv.style.display = 'block';
    resultDiv.style.background = 'rgba(59,130,246,.08)';
    resultDiv.style.border = '1px solid rgba(59,130,246,.2)';
    resultDiv.style.color = '#93c5fd';
    resultDiv.style.padding = '8px 10px';
    resultDiv.style.borderRadius = '6px';
    resultDiv.style.fontSize = '12px';
    resultDiv.style.lineHeight = '1.6';
    resultDiv.innerHTML = '<div style="margin-bottom:6px;font-weight:500;">正在检测 ' + models.length + ' 个模型…</div>' +
        models.map(function (m) {
            return '<div style="display:flex;align-items:center;gap:6px;" data-test-model="' + cxai_escapeHtml(m) + '">' +
                '<span style="display:inline-block;width:12px;height:12px;border:2px solid rgba(96,165,250,.3);border-top-color:#60a5fa;border-radius:50%;animation:cxai-spin .6s linear infinite;"></span>' +
                '<span>' + cxai_escapeHtml(m) + '</span>' +
                '</div>';
        }).join('');
    testBtn.disabled = true;
    testBtn.style.opacity = '0.5';

    var completed = 0;
    var passCount = 0;
    var failCount = 0;

    function updateResult() {
        if (completed < models.length) return;
        testBtn.disabled = false;
        testBtn.style.opacity = '';
        if (passCount === models.length) {
            resultDiv.style.background = 'rgba(16,185,129,.12)';
            resultDiv.style.border = '1px solid rgba(16,185,129,.25)';
            resultDiv.style.color = '#34d399';
        } else if (passCount > 0) {
            resultDiv.style.background = 'rgba(251,191,36,.12)';
            resultDiv.style.border = '1px solid rgba(251,191,36,.25)';
            resultDiv.style.color = '#fbbf24';
        } else {
            resultDiv.style.background = 'rgba(248,113,113,.12)';
            resultDiv.style.border = '1px solid rgba(248,113,113,.25)';
            resultDiv.style.color = '#f87171';
        }
        var summary = '<div style="font-weight:500;margin-bottom:6px;">' +
            '✓ ' + passCount + ' 个可用' + (failCount > 0 ? '，✗ ' + failCount + ' 个不可用' : '') +
            '</div>';
        // 保留各模型结果，但把 summary 加到顶部
        var rows = Array.prototype.slice.call(resultDiv.querySelectorAll('div[data-test-model]'));
        resultDiv.innerHTML = summary + rows.map(function (row) { return row.outerHTML; }).join('');
    }

    function setModelResult(modelName, status, text) {
        var row = resultDiv.querySelector('div[data-test-model="' + cxai_escapeHtml(modelName) + '"]');
        if (!row) return;
        var icon = '';
        if (status === 'ok') icon = '<span style="color:#34d399;font-weight:700;">✓</span>';
        else if (status === 'warn') icon = '<span style="color:#fbbf24;font-weight:700;">⚠</span>';
        else icon = '<span style="color:#f87171;font-weight:700;">✗</span>';
        row.innerHTML = icon + '<span>' + cxai_escapeHtml(modelName) + '</span>' +
            '<span style="margin-left:auto;font-size:11px;opacity:.85;">' + cxai_escapeHtml(text) + '</span>';
        if (status === 'ok') passCount++;
        else if (status === 'warn') passCount++; // 限流仍算接口可通
        else failCount++;
        completed++;
        updateResult();
    }

    models.forEach(function (testModel) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: testUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            data: JSON.stringify({
                model: testModel,
                messages: [{ role: 'user', content: 'hi' }],
                max_tokens: 5,
                temperature: 0
            }),
            timeout: 15000,
            onload: function (xhr) {
                if (xhr.status === 200) {
                    try {
                        var raw = JSON.parse(xhr.responseText);
                        if (raw.choices && raw.choices[0] && raw.choices[0].message) {
                            setModelResult(testModel, 'ok', '连接成功');
                        } else if (raw.error) {
                            var errMsg = (raw.error.message || raw.error.msg || JSON.stringify(raw.error)).slice(0, 80);
                            setModelResult(testModel, 'err', errMsg);
                        } else {
                            setModelResult(testModel, 'err', '响应格式不符');
                        }
                    } catch (e) {
                        setModelResult(testModel, 'err', '解析失败');
                    }
                } else if (xhr.status === 401) {
                    setModelResult(testModel, 'err', 'API Key 无效');
                } else if (xhr.status === 403) {
                    setModelResult(testModel, 'err', '访问被拒绝');
                } else if (xhr.status === 429) {
                    setModelResult(testModel, 'warn', '请求过于频繁');
                } else {
                    try {
                        var errObj = JSON.parse(xhr.responseText);
                        var errText = ((errObj.error && (errObj.error.message || errObj.error.msg)) || ('HTTP ' + xhr.status)).slice(0, 80);
                        setModelResult(testModel, 'err', errText);
                    } catch (e) {
                        setModelResult(testModel, 'err', 'HTTP ' + xhr.status);
                    }
                }
            },
            onerror: function () {
                setModelResult(testModel, 'err', '网络连接失败');
            },
            ontimeout: function () {
                setModelResult(testModel, 'err', '连接超时');
            }
        });
    });
}

function cxai_logger(str, color) {
    var _time = new Date().toLocaleTimeString()
    var c = _cxaiLogColorMap[color] || color || '#334155'
    var timeStr = _time;
    var colorClass = '';
    if (color === 'success' || c === '#34c759') colorClass = 'success';
    else if (color === 'warn' || c === '#ff9500') colorClass = 'warn';
    else if (color === 'error' || c === '#ff3b30') colorClass = 'error';
    else if (color === 'info' || c === '#5ac8fa') colorClass = 'info';
    var lineHtml = '<span class="cxai-log-time">' + timeStr + '</span><span class="cxai-log-msg ' + colorClass + '">' + str + '</span>';
    // 始终写入 top.document，确保 iframe 内的日志也能显示在主面板
    var _doc;
    try { _doc = top.document; } catch (_) { _doc = document; }
    // 返回原生 DOM 元素（而非 jQuery 对象），避免跨 document 的 jQuery 上下文错配
    var lineEl = null;
    try {
        var logPanel = _doc.getElementById('cxai-log-panel');
        if (logPanel) {
            lineEl = _doc.createElement('div');
            lineEl.className = 'cxai-log-line';
            lineEl.innerHTML = lineHtml;
            logPanel.appendChild(lineEl);
            while (logPanel.children.length > 50) { logPanel.removeChild(logPanel.firstChild); }
            logPanel.scrollTop = logPanel.scrollHeight;
        }
    } catch (_) { /* empty */ }
    return lineEl;
}


function cxai_updateLogEntry($p, str, color) {
    if (!$p) return
    var c = _cxaiLogColorMap[color] || color || '#334155'
    // 支持 DOM 元素或 jQuery 对象
    var el = typeof $p === 'object' && $p.nodeType === 1 ? $p : ($p && $p[0]);
    if (!el) return
    // ★ 用原生 DOM querySelector，避免 jQuery 跨 document 上下文错配
    var msgEl = el.querySelector ? el.querySelector('.cxai-log-msg') : null;
    if (!msgEl) {
        try { msgEl = top.$(el).find('.cxai-log-msg')[0]; } catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }
    }
    if (msgEl) {
        msgEl.style.color = c;
        msgEl.innerHTML = '<span class="cxai-log-msg">' + cxai_escapeHtml(str) + '</span>';
    }
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


// 在课程主页自动点击第一个未完成的章节，帮用户开始任务
function cxai_clickFirstUnfinishedChapter() {
    try {
        // 学习通新版章节列表常见选择器
        var selectors = [
            // 章节列表中的 li / div 行，未完成状态常见 class
            '#coursetree .ncells .not-finished',
            '#coursetree .ncells .orange',
            '#coursetree .ncells .unfinished',
            '#coursetree .cells .not-finished',
            '.timelineMod .not-finished',
            '.chapter-item:not(.finished)',
            '.chapterList .not-finished',
            // 兜底：任意带未完成图标的元素
            '[class*="unfinish"]',
            '[class*="not-finish"]'
        ];
        for (var s = 0; s < selectors.length; s++) {
            var els = document.querySelectorAll(selectors[s]);
            for (var i = 0; i < els.length; i++) {
                var el = els[i];
                // 向上查找可点击的章节容器
                var clickable = el.closest ? el.closest('li, .ncells, .cells, .chapter-item, .chapterList > div, a') : el;
                if (clickable) {
                    clickable.click();
                    return true;
                }
            }
        }
    } catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }
    return false;
}


function cxai_toNext() {
    cxai_refreshCourseList().then((res) => {
        if (!res) {
            cxai_logger('课程列表为空，5秒后重试', 'red')
            setTimeout(cxai_toNext, 5000)
            return
        }

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
            try { var nextBtn = top.document.querySelector('#mainid > .prev_next.next') } catch (_) { return false }
            if (nextBtn) { nextBtn.click(); return true }
            return false
        }

        // 点击 "下一章节" 按钮：优先尝试章节内的"下一页/下一节"统一按钮，
        // 找不到时再退回 #prevNextFocusNext（仅用于章节级跳转）
        function clickNextChapterBtn() {
            try { var nextBtn = top.document.querySelector('#mainid > .prev_next.next') } catch (_) { nextBtn = null }
            if (nextBtn) { nextBtn.click(); return true }
            try { var focusBtn = top.document.querySelector('#prevNextFocusNext') } catch (_) { focusBtn = null }
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

        let _curChaterId = (function () {
            try { return $('#coursetree', window.parent.document).find('.posCatalog_active').attr('id'); }
            catch (_) { return null; }
        })();
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
        cxai_logger('获取课程列表失败: ' + (err && err.message || err || '未知错误') + '，5秒后重试', 'red')
        setTimeout(cxai_toNext, 5000)
    })
}


function cxai_missonStart() {
    cxai_showBox()
    if (!cxai_mlist || cxai_mlist.length <= 0) {
        cxai_logger('此页面任务处理完毕，准备跳转页面', 'green')
        return cxai_toNext()
    }
    let _type = cxai_mlist[0]['type'],
        _dom = _domList[0],
        _task = cxai_mlist[0];
    if (_type === undefined) {
        _type = cxai_mlist[0]['property']["module"]
    }
    switch (_type) {
        case "video":
            if (cxai_mlist[0]['property']['module'] === 'insertvideo') {
                cxai_logger('开始处理视频', 'purple')
                cxai_missonVideo(_dom, _task)
                break
            } else if (cxai_mlist[0]['property']['module'] === 'insertaudio') {
                cxai_logger('开始处理音频', 'purple')
                cxai_missonVideo(_dom, _task)
                break
            } else if (_type === 'knowledgeGraph' || _type === 'knowledge_graph') {
                cxai_logger('开始处理知识图谱', 'purple')
                cxai_missonKnowledgeGraph(_dom, _task)
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

    if (cxai_isPaused()) {
        if (!_cxaiPauseMsgShown) { cxai_logger('⏸ 刷课任务已暂停，5 秒后重试...', 'warn'); _cxaiPauseMsgShown = true; }
        setTimeout(() => { cxai_missonVideo(dom, obj) }, 5000);
        return;
    }

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
    const doc = (function () {
        try { return target.contentDocument || (target.contentWindow && target.contentWindow.document); }
        catch (_) { return null; }
    })();

    if (!doc) {
        cxai_logger(`未找到${taskLabel} iframe 内容，3 秒后重试……`, 'orange');
        return setTimeout(() => cxai_missonVideo(dom, obj), 3000);
    }

    const intervalId = setInterval(() => {
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

            // 检查视频弹题（定时器在 ended 时清理）
            var videoQuizTimer = setInterval(function () {
                if (cxai_handleVideoQuiz(doc)) {
                    cxai_logger('视频弹题已处理', 'blue');
                }
            }, 5000);

            media.addEventListener('ended', () => {
                cxai_logger(`${name} - ${mediaType} 已播放完成`);
                media.removeEventListener('pause', resume);
                clearInterval(intervalId);
                clearInterval(videoQuizTimer);
                setTimeout(cxai_switchMission, 1000);
            });
        }
    }, 2500);
}



    // 视频弹题处理（）
    function cxai_handleVideoQuiz(doc) {
        var container = doc.querySelector('.ans-videoquiz');
        if (!container) return false;
        var submitBtn = doc.querySelector('#videoquiz-submit');
        if (!submitBtn) return false;
        
        // 清除已失败记录
        if (!window._cxaiFailedVideoQuizzes) window._cxaiFailedVideoQuizzes = {};
        
        var quizText = container.innerText || '';
        if (window._cxaiFailedVideoQuizzes[quizText] && window._cxaiFailedVideoQuizzes[quizText] >= 2) {
            cxai_logger('视频弹题已重试2次，跳过', 'orange');
            var closeBtn = container.querySelector('.ans-videoquiz-close, a[title=关闭]');
            if (closeBtn) closeBtn.click();
            return true;
        }
        
        var optionNodes = Array.prototype.slice.call(container.querySelectorAll('.ans-videoquiz-opt label'));
        if (optionNodes.length === 0) return false;
        
        var optionTexts = optionNodes.map(function (label) {
            return (label.innerText || label.textContent || '').trim();
        });
        
        var inputTypes = optionNodes.map(function (label) {
            var input = label.querySelector('input');
            return input ? input.type : '';
        });
        var isMultiple = inputTypes.indexOf('checkbox') !== -1;
        var isJudge = !isMultiple && optionTexts.length === 2 && optionTexts.some(function (t) {
            return /正确|错误|对|错|是|否|true|false/i.test(t);
        });
        
        var question = quizText || '视频弹题';
        var typeName = isMultiple ? '多选题' : (isJudge ? '判断题' : '单选题');
        
        var prompt = cxai_buildPrompt({ type: typeName, question: question, options: optionTexts });
        cxai_getAnswer(isMultiple ? 1 : 0, prompt).then(function (agrs) {
            var matchedIndexes = [];
            if (isMultiple) {
                var parts = String(agrs).split('|');
                parts.forEach(function (part) {
                    var idx = optionTexts.findIndex(function (t) { return t === part.trim(); });
                    if (idx >= 0) matchedIndexes.push(idx);
                });
            } else {
                var idx = optionTexts.findIndex(function (t) { return t === String(agrs).trim(); });
                if (idx >= 0) matchedIndexes.push(idx);
            }
            
            if (matchedIndexes.length === 0) {
                cxai_logger('视频弹题未匹配到答案，跳过', 'orange');
                if (!window._cxaiFailedVideoQuizzes[quizText]) window._cxaiFailedVideoQuizzes[quizText] = 0;
                window._cxaiFailedVideoQuizzes[quizText]++;
                var closeBtn = container.querySelector('.ans-videoquiz-close, a[title=关闭]');
                if (closeBtn) closeBtn.click();
                return;
            }
            
            matchedIndexes.forEach(function (idx) {
                optionNodes[idx].click();
            });
            cxai_logger('视频弹题已选择答案', 'green');
            if (submitBtn) submitBtn.click();
            var closeBtn = container.querySelector('.ans-videoquiz-close, a[title=关闭]');
            if (closeBtn) closeBtn.click();
        });
        return true;
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
        if (obj['jobid'] === undefined) {
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
    if (obj['job'] === undefined) {
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
        if (obj['jobid'] === undefined) {
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
    if (obj['job'] === undefined) {
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
        if (obj['jobid'] === undefined) {
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
    if (obj['job'] === undefined) {
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


// 知识图谱任务处理（）
function cxai_missonKnowledgeGraph(dom, obj) {
    var name = (obj['property'] && obj['property']['name']) || '知识图谱';
    cxai_logger('知识图谱：' + name + '，检测是否已完成', 'blue');
    
    // 知识图谱通常通过 iframe 加载，尝试查找并展开
    var target = dom.length > 0 ? dom[0] : null;
    if (!target) {
        cxai_logger('知识图谱：' + name + '，未找到容器，跳过', 'orange');
        cxai_switchMission();
        return;
    }
    
    var doc = null;
    try { doc = target.contentDocument || (target.contentWindow && target.contentWindow.document); } catch (_) {}
    if (!doc) {
        cxai_logger('知识图谱：' + name + '，无法访问 iframe 内容，跳过', 'orange');
        cxai_switchMission();
        return;
    }
    
    // 查找展开按钮
    var expandBtn = doc.querySelector('.knowledge-graph-expand, .expand-btn, [title="展开"], a[title="展开"]');
    if (!expandBtn) {
        // 尝试查找可能已展开的状态
        var graphContent = doc.querySelector('.knowledge-graph-content, .graph-content');
        if (graphContent) {
            cxai_logger('知识图谱：' + name + '，已是展开状态', 'green');
        } else {
            cxai_logger('知识图谱：' + name + '，未找到展开按钮，可能已完成或不在当前页面，跳过', 'orange');
        }
        cxai_switchMission();
        return;
    }
    
    try {
        expandBtn.click();
        cxai_logger('知识图谱：' + name + '，已点击展开按钮', 'green');
    } catch (e) {
        cxai_logger('知识图谱：' + name + '，点击展开按钮失败：' + e.message, 'red');
    }
    
    // 等待展开后处理
    setTimeout(function () {
        cxai_logger('知识图谱：' + name + '，处理完成', 'green');
        cxai_switchMission();
    }, 2000);
}


// ═══════════════════════════════════════════════════════════════════════════════
//  § 8. 测验/作业答题
//  作业/测验自动处理流程
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
        if (obj['jobid'] === undefined ? false : true) {
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
            var quizWeb = _l.protocol + '//' + _l.host + '/work/phone/work?workId=' + obj['jobid'].replace('work-', '') + '&courseId=' + _defaults['courseid'] + '&clazzId=' + _defaults['clazzId'] + '&knowledgeId=' + _defaults['knowledgeid'] + '&jobId=' + obj['jobid'] + '&enc=' + obj['enc']
            // setTimeout(() => { cxai_startDoCyWork(0, dom) }, 3000)
            setTimeout(() => { cxai_startDoQuizCyWork(0, dom, quizWeb) }, 3000)
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


var _cxaiQuizWorkRunning = false;
var _cxaiQuizSkipped = 0;
function cxai_doQuizWork($dom) {
    if (_cxaiQuizWorkRunning) return;
    _cxaiQuizWorkRunning = true;
    _cxaiQuizSkipped = 0;
    setTimeout(function() { _cxaiQuizWorkRunning = false; }, 60000);
    let $cy = $dom.find('.Wrappadding form')
    $subBtn = $cy.find('.zquestions .zsubmit .btn-ok-bottom')
    $okBtn = $dom.find('#okBtn')
    $saveBtn = $cy.find('.zquestions .zsubmit .btn-save')
    let TimuList = $cy.find('.zquestions .Py-mian1')
    cxai_startDoQuizTimu(0, TimuList)
}


function cxai_startDoQuizTimu(index, TimuList) {
    if (cxai_isPaused()) {
        if (!_cxaiPauseMsgShown) { cxai_logger('⏸ 任务已暂停，5 秒后继续下一题...', 'warn'); _cxaiPauseMsgShown = true; }
        setTimeout(() => { cxai_startDoQuizTimu(index, TimuList) }, 5000);
        return;
    }
    if (index === TimuList.length) {
        _cxaiQuizWorkRunning = false;
        if (localStorage.getItem('cxaiSetting.sub') === 'true' && _cxaiQuizSkipped === 0) {
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
        } else if (localStorage.getItem('cxaiSetting.sub') === 'true' && localStorage.getItem('cxaiSetting.force') === 'true') {
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
            cxai_logger(_cxaiQuizSkipped > 0 ? '存在 ' + _cxaiQuizSkipped + ' 道未答题目，自动保存！' : '测验处理完成，自动保存！', 'green')
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

// ── 提前定义的工具函数 ──
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
                        setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, 30)
                    } else {
                        if (!_redoLogged) { cxai_logger(index + 1 + '此题已作答，重做模式下重新作答', 'blue'); _redoLogged = true; }
                        // 重做模式：先取消已选选项

                        $(_answerTmpArr[i]).click()
                                        }
                    break
                }
            }
            if (check_answer_flag === 0) {
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
                    if (_i === -1) {
                        _cxaiQuizSkipped++;
                        cxai_logger('AI未能完美匹配正确答案，请尝试更换更高级模型或手动选择，跳过此题', 'red')
                        // cxaiCfg.sub = 0
                        setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                    } else {
                        $(_answerTmpArr[_i]).click()
                                            cxai_logger('自动答题成功，准备切换下一题', 'green')
                        setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                    }
            }).catch((_e) => {
                _cxaiQuizSkipped++;
                cxai_logger('搜题失败(' + (_e && _e.c !== undefined ? '放弃' : '异常') + ')，跳过此题', 'orange')
                setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, cxaiCfg.time)
            });
        }
            break
        }
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
                        setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, 30)
                        break
                    } else {
                        if (!_redoLogged) { cxai_logger(index + 1 + '此题已作答，重做模式下重新作答', 'blue'); _redoLogged = true; }
                        // 重做模式：先取消已选选项

                        $(_answerTmpArr[i]).click()
                                            // 不break，继续取消其他已选选项
                    }
                }
            }
            if (check_answer_flag === 0) {
                cxai_getAnswer(_type, _question).then((agrs) => {
                    agrs = String(agrs);
                    if (agrs === '暂无答案') {
                        _cxaiQuizSkipped++;
                        cxai_logger('AI未能完美匹配正确答案，请尝试更换更高级模型或手动选择，跳过此题', 'red')
                        // cxaiCfg.sub = 0
                        setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
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
                        cxaiClickOptions(_answerTmpArr, _matchedIndices,
                            function(idx) { $(_answerTmpArr[idx]).click(); },
                            function(idx) { return ($(_answerTmpArr[idx]).attr('class') || '').indexOf('cur') !== -1; }
                        );
                                            // 最终检查（等待点击+补选全部完成）
                        var _totalWait = 300 + _answerTmpArr.length * 600 + _matchedIndices.length * 600 + 500 + (_matchedIndices.length) * 500 + 600;
                        setTimeout(() => {
                            if (_matchedIndices.length === 0) {
                                _cxaiQuizSkipped++;
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
                            setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                        }, _totalWait)
                    }
                }).catch((_e) => {
                    _cxaiQuizSkipped++;
                    cxai_logger('搜题失败，跳过此题', 'orange')
                    setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, cxaiCfg.time)
                })
            }
        }
            break
        case 2: {
            // 填空题处理 - 使用全局editors数组 (ExtJS)
            let tkList = $(TimuList[index]).find('.blankList2 input')
            // 使用属性选择器匹配包含editorIndex的元素
            let tkEditorBlocks = $(TimuList[index]).find('[data-editorindex]')

            // 检查是否使用UEditor编辑器
            if (tkEditorBlocks && tkEditorBlocks.length > 0) {
                let firstTextarea = $(TimuList[index]).find('textarea[name^="answer"]')
                if (firstTextarea.length > 0 && $(firstTextarea[0]).val() && $(firstTextarea[0]).val().trim() !== '' && !cxai_isRedoMode()) {
                    cxai_logger("此题已作答,跳过", "green");
                    setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, 30);
                    break
                }

                _question = cxai_buildPrompt({ type: '填空题', question: _question, answer_format: "多个填空用'|'分隔" })
                cxai_getAnswer(_type, _question).then((agrs) => {
                    agrs = String(agrs);
                    if (agrs === '暂无答案') {
                        _cxaiQuizSkipped++;
                        cxai_logger('AI未能完美匹配正确答案，请尝试更换更高级模型或手动选择，跳过此题', 'red')
                        setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
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

                    setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, cxaiCfg.time + 300 * editorBlocks.length)
                }).catch((_e) => {
                    _cxaiQuizSkipped++;
                    cxai_logger('搜题失败，跳过此题', 'orange')
                    setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, cxaiCfg.time)
                })
            } else if (tkList && tkList.length > 0) {
                // 普通input模式（旧版页面）
                if ($(tkList[0]).val() && $(tkList[0]).val().trim() !== '' && !cxai_isRedoMode()) {
                    cxai_logger("此题已作答,跳过", "green");
                    setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, 30);
                    break
                }
                cxai_getAnswer(_type, _question).then((agrs) => {
                    agrs = String(agrs);
                    if (agrs === '暂无答案') {
                        _cxaiQuizSkipped++;
                        cxai_logger('AI未能完美匹配正确答案，请尝试更换更高级模型或手动选择，跳过此题', 'red')
                        setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
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
                    setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                }).catch((_e) => {
                    _cxaiQuizSkipped++;
                    cxai_logger('搜题失败，跳过此题', 'orange')
                    setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, cxaiCfg.time)
                });
            } else {
                cxai_logger('未找到填空题输入区域，跳过此题', 'red')
                setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, cxaiCfg.time)
            }
            break
        }
        case 3: {
            _answerTmpArr = $(TimuList[index]).find('.answerList.panduan li')
            $.each(_answerTmpArr, (i, t) => {
                _a.push($(t).text().trim())
            });
            //判断题目是否已作答
            var _redoLogged = false;
            for (let i = 0; i < _answerTmpArr.length; i++) {
                if ($(_answerTmpArr[i]).attr('aria-label')) {
                    if (!cxai_isRedoMode()) {
                        cxai_logger(index + 1 + '此题已作答，准备切换下一题', 'green')
                        check_answer_flag = 1;
                        setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, 30)
                    } else {
                        if (!_redoLogged) { cxai_logger(index + 1 + '此题已作答，重做模式下重新作答', 'blue'); _redoLogged = true; }
                        // 重做模式：先取消已选选项

                        $(_answerTmpArr[i]).click()
                                        }
                    break
                }
            }
            if (check_answer_flag === 0) {
                _question = cxai_buildPrompt({ type: '判断题', question: _question, answer_format: "只回答正确或错误" })
                cxai_getAnswer(_type, _question).then((agrs) => {
                    agrs = String(agrs);
                    let judgeResult = cxai_parseJudgeAnswer(agrs)
                    if (judgeResult === null) {
                        _cxaiQuizSkipped++;
                        cxai_logger('答案匹配出错，准备切换下一题', 'red')
                        setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                        return
                    }
                    let _i = cxai_findJudgeOptionIndex(_a, judgeResult === 'true')
                    if (_i === -1) {
                        _cxaiQuizSkipped++;
                        cxai_logger('未匹配到正确选项，跳过', 'red')
                        setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                        return
                    }
                    setTimeout(() => {
                        $(_answerTmpArr[_i]).click()
                                            cxai_logger('自动答题成功，准备切换下一题', 'green')
                        setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                    }, 300)
                }).catch((_e) => {
                    _cxaiQuizSkipped++;
                    cxai_logger('搜题失败，跳过此题', 'orange')
                    setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, cxaiCfg.time)
                });
            }
            break
        }
        case 4: { // 简答题或材料题
            _question = cxai_buildPrompt({ type: '简答题或材料题', question: _question }).catch(function(e){console.warn("[AI智脑Pro] Promise异常:",e.message)})

            // 查找可能的编辑器区域（通过data-editorindex）
            let jdEditorBlocks = $(TimuList[index]).find('[data-editorindex]')
            let jdTextareas = $(TimuList[index]).find('textarea[name^="answer"]')

            // 检查是否已作答
            let jdIsAnswered = false

            // 优先处理UEditor编辑器
            if (jdEditorBlocks && jdEditorBlocks.length > 0) {
                if (jdTextareas.length > 0 && $(jdTextareas[0]).val() && $(jdTextareas[0]).val().trim() !== '' && !cxai_isRedoMode()) {
                    cxai_logger(index + 1 + '简答题已作答，准备切换下一题', 'green')
                    setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, 30)
                    break
                }

                cxai_getAnswer(_type, _question).then((agrs) => {
                    agrs = String(agrs);
                    if (agrs === '暂无答案') {
                        _cxaiQuizSkipped++;
                        cxai_logger('AI无法匹配答案，请手动完成', 'red')
                        setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
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

                    setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                }).catch((_e) => {
                    _cxaiQuizSkipped++;
                    cxai_logger('搜题失败，跳过此题', 'orange')
                    setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, cxaiCfg.time)
                })
            }
            // 如果没有编辑器，但有textarea，直接使用textarea
            else if (jdTextareas && jdTextareas.length > 0) {
                // 检查是否已作答
                if ($(jdTextareas[0]).val() && $(jdTextareas[0]).val().trim() !== '' && !cxai_isRedoMode()) {
                    cxai_logger(index + 1 + '简答题已作答，准备切换下一题', 'green')
                    jdIsAnswered = true
                    setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, 30)
                } else {
                    cxai_getAnswer(_type, _question).then((agrs) => {
                        agrs = String(agrs);
                        if (agrs === '暂无答案') {
                            _cxaiQuizSkipped++;
                            cxai_logger('AI无法匹配答案，请手动完成', 'red')
                        } else {
                            $(jdTextareas[0]).val(agrs)
                            $(jdTextareas[0]).trigger('input').trigger('change')
                            cxai_logger('简答题自动答题成功，准备切换下一题', 'green')
                        }
                        setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                    }).catch((_e) => {
                        _cxaiQuizSkipped++;
                        cxai_logger('搜题失败，跳过此题', 'orange')
                        setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, cxaiCfg.time)
                    });
                }
            }
            // 如果以上方法都失败
            else {
                cxai_logger('无法找到简答题输入区域，请手动完成', 'red')
                setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, cxaiCfg.time)
            }
            break
        }
        case 5: {
            _cxaiQuizSkipped++;
            cxai_getAnswer(_type, _question).then((agrs) => {
                // cxaiCfg.sub = 0
                cxai_logger('此类型题目无法区分单/多选，请手动选择答案', 'red')
                setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, cxaiCfg.time)
            }).catch((_e) => {
                _cxaiQuizSkipped++;
                cxai_logger('搜题失败，跳过此题', 'orange')
                setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, cxaiCfg.time)
            });
            break
        }
        default:
            _cxaiQuizSkipped++;
            cxai_logger('暂不支持处理此类型题目：' + questionFull.match(/.*?\[(.*?)]|$/)[1] + '，跳过！请手动作答。', 'red')
            // cxaiCfg.sub = 0
            setTimeout(() => { cxai_startDoQuizTimu(index + 1, TimuList) }, cxaiCfg.time)
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
    // 不在无用户手势时尝试创建 AudioContext（Chrome 会拦截并报警告），
    // 统一等待用户首次交互后再启动
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


function cxai_startDoQuizCyWork(index, doms, quizWeb) {
    if (cxai_isPaused()) {
        if (!_cxaiPauseMsgShown) { cxai_logger('⏸ 任务已暂停，5 秒后重试...', 'warn'); _cxaiPauseMsgShown = true; }
        setTimeout(() => { cxai_startDoQuizCyWork(index, doms, quizWeb) }, 5000);
        return;
    }
    if (index === doms.length) {
        cxai_logger('此页面全部测验已处理完毕！准备进行下一项任务')
        setTimeout(cxai_missonStart, 5000)
        return
    }
    cxai_logger('等待测验框架加载...', 'purple')
    cxai_pollForElement(doms[index], 'iframe').then(element => {
        let workIframe = element
        if (!workIframe) {
            setTimeout(() => { cxai_startDoQuizCyWork(index, doms, quizWeb) }, 5000)
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
            $(workIframe).attr('src', quizWeb)
            cxai_getElement($(doms[index]).contents()[0], 'iframe[src="' + quizWeb + '"]').then((element) => {
                setTimeout(() => { cxai_doQuizWork($(element).contents()) }, 3000)
            });
        } else if (workStatus.indexOf("待做") != -1 || workStatus.indexOf("待完成") != -1 || workStatus.indexOf("重做") != -1 || workStatus.indexOf("未达到") != -1) {
            var isRedoStatus = workStatus.indexOf("重做") != -1 || workStatus.indexOf("未达到") != -1
            cxai_logger('测验：' + (index + 1) + (isRedoStatus ? ',未达到及格线,准备重做...' : ',准备处理此测验...'), 'purple')
            $(workIframe).attr('src', quizWeb)
            cxai_getElement($(doms[index]).contents()[0], 'iframe[src="' + quizWeb + '"]').then((element) => {
                setTimeout(() => { cxai_doQuizWork($(element).contents()) }, 3000)
            });
        } else if (workStatus.indexOf('待批阅') != -1) {
            cxai_mlist.splice(0, 1)
            _domList.splice(0, 1)
            cxai_logger('测验：' + (index + 1) + ',测验待批阅,跳过', 'red')
            setTimeout(() => { cxai_startDoQuizCyWork(index + 1, doms, quizWeb) }, 5000)
        } else {
            cxai_mlist.splice(0, 1)
            _domList.splice(0, 1)
            cxai_logger('测验：' + (index + 1) + ',未知状态[' + workStatus + '],跳过', 'red')
            setTimeout(() => { cxai_startDoQuizCyWork(index + 1, doms, quizWeb) }, 5000)
        }
    });
}


function cxai_startDoCyWork(index, doms) {
    if (cxai_isPaused()) {
        if (!_cxaiPauseMsgShown) { cxai_logger('⏸ 任务已暂停，5 秒后重试...', 'warn'); _cxaiPauseMsgShown = true; }
        setTimeout(() => { cxai_startDoCyWork(index, doms) }, 5000);
        return;
    }
    if (index === doms.length) {
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
    });
}


function cxai_getElement(parent, selector, timeout = 0) {
    
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
    if (cxai_isPaused()) {
        if (!_cxaiPauseMsgShown) { cxai_logger('⏸ 任务已暂停，5 秒后重试...', 'warn'); _cxaiPauseMsgShown = true; }
        setTimeout(cxai_missonHomeWork, 5000);
        return;
    }
    cxai_logger('开始处理作业', 'green')
    let $_homeworktable = $('.mark_table').find('form')
    let TimuList = $_homeworktable.find('.questionLi')
    cxai_doHomeWork(0, TimuList)
}


function cxai_doHomeWork(index, TiMuList) {
    if (cxai_isPaused()) {
        if (!_cxaiPauseMsgShown) { cxai_logger('⏸ 任务已暂停，5 秒后继续下一题...', 'warn'); _cxaiPauseMsgShown = true; }
        setTimeout(() => { cxai_doHomeWork(index, TiMuList) }, 5000);
        return;
    }
    if (index === TiMuList.length) {
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
    });
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
                        // 重做模式：先取消已选选项

                        $(_answerTmpArr[i]).click()
                                        }
                    break
                }
            }
            if (check_answer_flag === 0) {
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
                    if (_i === -1) {
                        cxai_logger('AI未能完美匹配正确答案，请尝试更换更高级模型或手动选择，跳过此题', 'red')
                        setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                    } else {
                        setTimeout(() => {
                            let check = $(_answerTmpArr[_i]).parent().find('span').attr('class') || ''
                            if (check.indexOf('check_answer') == -1) {
                                $(_answerTmpArr[_i]).parent().click()
                                                        }
                            cxai_logger('自动答题成功，准备切换下一题', 'green')
                            setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                        }, 300)
                    }
                    setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time)
                }).catch((_e) => {
                    cxai_logger('搜题失败，跳过此题', 'orange')
                    setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time)
                });
            }
            break
        }

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

                        $(_answerTmpArr[i]).parent().click()
                                            // 不break，继续取消其他已选选项
                    }
                }
            }
            if (check_answer_flag === 0) {
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
                    cxaiClickOptions(_answerTmpArr, _matchedIndices,
                        function(idx) { $(_answerTmpArr[idx]).parent().click(); },
                        function(idx) { return ($(_answerTmpArr[idx]).parent().find('span').attr('class') || '').indexOf('check_answer_dx') !== -1; }
                    );
                                    if (_matchedIndices.length === 0) {
                        cxai_logger('AI未能匹配任何选项，请手动选择', 'red')
                    } else {
                        cxai_logger('自动答题成功，准备切换下一题', 'green')
                    }
                    setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time + _answerTmpArr.length * 600 + _matchedIndices.length * 600)
                    setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time)
                }).catch((_e) => {
                    cxai_logger('搜题失败，跳过此题', 'orange')
                    setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time)
                });
            }
            break
        }
        case 2: {
            _question = cxai_buildPrompt({ type: '填空题', question: _question, answer_format: "用'|'分割多个答案" }).catch(function(e){console.warn("[AI智脑Pro] Promise异常:",e.message)});
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
                    setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time);
                }).catch((_e) => {
                    cxai_logger('搜题失败，跳过此题', 'orange')
                    setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time)
                });
            }
            break
        }
        case 3: {
            _answerTmpArr = $(TiMuList[index]).find('.stem_answer').find('.answer_p')
            $.each(_answerTmpArr, (i, t) => {
                _a.push($(t).text().trim())
            });
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

                        $(_answerTmpArr[i]).parent().click()
                                        }
                    break
                }
            }
            if (check_answer_flag === 0) {
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
                            $(_answerTmpArr[_i]).parent().click()
                                                }
                        cxai_logger('自动答题成功，准备切换下一题', 'green')
                        setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, (agrs && agrs._instant ? 30 : cxaiCfg.time))
                    }, 300)
                    setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time)
                }).catch((_e) => {
                    cxai_logger('搜题失败，跳过此题', 'orange')
                    setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time)
                });
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
                setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time)
            }).catch((_e) => {
                cxai_logger('搜题失败，跳过此题', 'orange')
                setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time)
            });
            break
        }
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
            });
            if (_isAnswered5 && !cxai_isRedoMode()) {
                cxai_logger((index + 1) + ' 此题已作答，准备切换下一题', 'green')
                setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, 30)
                break
            }
            let jdt5 = cxai_buildPrompt({ type: typeName || '写作题', question: _question, answer_format: "用英文根据题目进行写作" }).catch(function(e){console.warn("[AI智脑Pro] Promise异常:",e.message)})
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
                setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time)
            });
            break
        }
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
            });
            if (_isAnswered6 && !cxai_isRedoMode()) {
                cxai_logger((index + 1) + ' 此题已作答，准备切换下一题', 'green')
                setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, 30)
                break
            }
            let jdt6 = cxai_buildPrompt({ type: typeName || '翻译题', question: _question, answer_format: "中文英文互译" }).catch(function(e){console.warn("[AI智脑Pro] Promise异常:",e.message)})
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
                setTimeout(() => { cxai_doHomeWork(index + 1, TiMuList) }, cxaiCfg.time)
            });
            break
        }
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
        if ($curLi.length) _examCurIdx = parseInt($curLi.text().trim(), 10) - 1
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
            cxai_toNextExam()
        });
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

                $(_answerTmpArr[_answeredIdxE0]).parent().click()
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
                if (_i === -1) {
                    cxai_logger('AI未能完美匹配正确答案，请尝试更换更高级模型或手动选择，跳过此题', 'red')
                    setTimeout(cxai_toNextExam, 5000)
                } else {
                    setTimeout(() => {
                        if (($(_answerTmpArr[_i]).parent().find('span').attr('class') || '').indexOf('check_answer') == -1) {
                            //好学生模式,ABCD加粗
                            setTimeout(() => { $(_answerTmpArr[_i]).parent().click() }, 300)
                                                    cxai_logger('自动答题成功，准备切换下一题', 'green')
                            cxai_toNextExam()
                        } else {
                            cxai_logger('此题已作答，准备切换下一题', 'green')
                            cxai_toNextExam()
                        }
                    }, 300)
                }
                cxai_toNextExam()
            });
            break
        }
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

                $.each(_answerTmpArr, function (_i2, _t2) {
                    var _cls2 = $(_t2).parent().find('span').attr('class') || ''
                    if (_cls2.indexOf('check_answer') !== -1) {
                        $(_t2).parent().click()
                    }
                })
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
                    cxaiClickOptions(_answerTmpArr, _matchedIndices,
                        function(idx) { $(_answerTmpArr[idx]).parent().click(); },
                        function(idx) { return ($(_answerTmpArr[idx]).parent().find('span').attr('class') || '').indexOf('check_answer_dx') !== -1; }
                    );
                                    if (_matchedIndices.length === 0) {
                        cxai_logger('AI未能匹配任何选项，请手动选择', 'red')
                    } else {
                        cxai_logger('自动答题成功，准备切换下一题', 'green')
                    }
                    cxai_toNextExam()
                }
                cxai_toNextExam()
            });
            break
        }
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
                cxai_toNextExam()
            });
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

                $(_answerTmpArr[_answeredIdxE3]).parent().click()
                        }
            _question = cxai_buildPrompt({ type: '判断题', question: _question, answer_format: "只回答正确或错误" }).catch(function(e){console.warn("[AI智脑Pro] Promise异常:",e.message)});
            $.each(_answerTmpArr, (i, t) => {
                _a.push($(t).text().trim())
            });
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
                    $(_answerTmpArr[_i]).parent().click()
                                    cxai_logger('自动答题成功，准备切换下一题', 'green')
                    cxai_toNextExam()
                } else {
                    cxai_logger('此题已作答，准备切换下一题', 'green')
                    cxai_toNextExam()
                }
                cxai_toNextExam()
            });
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
            });
            break
        }
        case 5: {
            let _answerEle = cxai_findAnswerTextareas($_ansdom)
            if (!_answerEle || _answerEle.length === 0) { cxai_toNextExam(); break }
            // 已作答检测
            let _isAnsweredE5 = false
            $.each(_answerEle, function (i, t) {
                let _eid = $(t).attr('id') || $(t).attr('name')
                try { if (_eid && UE.getEditor(_eid) && UE.getEditor(_eid).getContent && UE.getEditor(_eid).getContent() !== '') _isAnsweredE5 = true } catch (e) { /* ignore */ }
            });
            if (_isAnsweredE5 && !cxai_isRedoMode()) {
                cxai_logger('此题已作答，准备切换下一题', 'green')
                cxai_toNextExam()
                break
            }
            let jdt = cxai_buildPrompt({ type: typeName || '写作题', question: _question, answer_format: "用英文根据题目进行写作" }).catch(function(e){console.warn("[AI智脑Pro] Promise异常:",e.message)})
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
            });
            break
        }
        case 6: {
            let _answerEle = cxai_findAnswerTextareas($_ansdom)
            if (!_answerEle || _answerEle.length === 0) { cxai_toNextExam(); break }
            // 已作答检测
            let _isAnsweredE6 = false
            $.each(_answerEle, function (i, t) {
                let _eid = $(t).attr('id') || $(t).attr('name')
                try { if (_eid && UE.getEditor(_eid) && UE.getEditor(_eid).getContent && UE.getEditor(_eid).getContent() !== '') _isAnsweredE6 = true } catch (e) { /* ignore */ }
            });
            if (_isAnsweredE6 && !cxai_isRedoMode()) {
                cxai_logger('此题已作答，准备切换下一题', 'green')
                cxai_toNextExam()
                break
            }
            let jdt = cxai_buildPrompt({ type: typeName || '翻译题', question: _question, answer_format: "中文英文互译" }).catch(function(e){console.warn("[AI智脑Pro] Promise异常:",e.message)})
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
            });
            break
        }
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
        let delay = 2000;
        if (localStorage.getItem('cxaiSetting.examTurnTime') === 'true') {
            delay = 3000 + Math.floor(Math.random() * 4000); // 3-7秒随机
        }
        setTimeout(() => {
            $nextbtn.click()
        }, delay)
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
            let n = parseInt(typeVal, 10)
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
    if (cxai_isPaused()) {
        if (!_cxaiPauseMsgShown) { cxai_logger('⏸ 任务已暂停，5 秒后继续...', 'warn'); _cxaiPauseMsgShown = true; }
        setTimeout(function () { cxai_doExamPreview(index, TiMuList) }, 5000);
        return;
    }
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

                        $(_answerTmpArr[i]).parent().click()
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
                        $(_answerTmpArr[_i]).parent().click()
                                        }
                    cxai_logger(prefix + '自动答题成功', 'green')
                    nextSoon()
                }, 300)
                if (err && err._paused) {
                    setTimeout(function () { cxai_doExamPreview(index, TiMuList) }, 5000);
                    return;
                }
                nextSoon()
            });
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

                        $(_answerTmpArr[i]).parent().click()
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
                cxaiClickOptions(_answerTmpArr, _matchedIndices,
                    function(idx) { $(_answerTmpArr[idx]).parent().click(); },
                    function(idx) { return ($(_answerTmpArr[idx]).parent().find('span').attr('class') || '').indexOf('check_answer_dx') !== -1; }
                );
                            if (_matchedIndices.length === 0) {
                    cxai_logger(prefix + 'AI未能匹配任何选项，请手动选择', 'red')
                } else {
                    cxai_logger(prefix + '自动答题成功', 'green')
                }
                nextSoon()
                if (err && err._paused) {
                    setTimeout(function () { cxai_doExamPreview(index, TiMuList) }, 5000);
                    return;
                }
                nextSoon()
            });
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
                if (err && err._paused) {
                    setTimeout(function () { cxai_doExamPreview(index, TiMuList) }, 5000);
                    return;
                }
                nextSoon()
            });
            return
        }
        case 3: {
            _answerTmpArr = $timu.find('.answerBg .answer_p')
            if (!_answerTmpArr || _answerTmpArr.length === 0) {
                cxai_logger(prefix + '未找到判断选项，跳过', 'red')
                return nextSoon()
            }
            $.each(_answerTmpArr, function (i, t) { _a.push($(t).text().trim()) }).catch(function(e){console.warn("[AI智脑Pro] Promise异常:",e.message)})
            for (let i = 0; i < _answerTmpArr.length; i++) {
                let cls = $(_answerTmpArr[i]).parent().find('span').attr('class') || ''
                if (cls.indexOf('check_answer') !== -1) {
                    if (!cxai_isRedoMode()) {
                        cxai_logger(prefix + '已作答，跳过', 'green')
                        alreadyAnswered = 1
                    } else {
                        cxai_logger(prefix + '已作答，重做模式下重新作答', 'blue')

                        $(_answerTmpArr[i]).parent().click()
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
                        $(_answerTmpArr[_i]).parent().click()
                                        }
                    cxai_logger(prefix + '自动答题成功', 'green')
                    nextSoon()
                }, 300)
                if (err && err._paused) {
                    setTimeout(function () { cxai_doExamPreview(index, TiMuList) }, 5000);
                    return;
                }
                nextSoon()
            });
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
                if (err && err._paused) {
                    setTimeout(function () { cxai_doExamPreview(index, TiMuList) }, 5000);
                    return;
                }
                nextSoon()
            });
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
            });
            if (isAnswered5 && !cxai_isRedoMode()) {
                cxai_logger(prefix + '已作答，跳过', 'green')
                return nextFast()
            }
            let prompt = cxai_buildPrompt({ type: typeName || '写作题', question: _question, answer_format: "用英文根据题目进行写作" }).catch(function(e){console.warn("[AI智脑Pro] Promise异常:",e.message)})
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
                if (err && err._paused) {
                    setTimeout(function () { cxai_doExamPreview(index, TiMuList) }, 5000);
                    return;
                }
                nextSoon()
            });
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
            let prompt = cxai_buildPrompt({ type: typeName || '翻译题', question: _question, answer_format: "中文英文互译" }).catch(function(e){console.warn("[AI智脑Pro] Promise异常:",e.message)})
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
                if (err && err._paused) {
                    setTimeout(function () { cxai_doExamPreview(index, TiMuList) }, 5000);
                    return;
                }
                nextSoon()
            return;
            });
            return
        }
        default: {
            cxai_logger(prefix + '无法处理此题型: ' + typeName + '，跳过', 'red')
            nextSoon()
        }
    }
}


// ==================================
//  大学搜题酱 QR 登录模块（严格按原扩展 requestByContext 格式）
// ==================================

// 签名生成：参数按 key 排序拼接值 + 密钥，MD5 得到 fkey
function cxai_dxsGenSignature(params) {
    params.appId = 'collegepcpi';
    params.vcname = '1.16.6';
    params.os = navigator.platform || 'win';
    params.ftime = Math.floor(Date.now() / 1000);
    var sortedKeys = Object.keys(params).sort(function(a, b) {
        return new Intl.Collator().compare(a, b);
    });
    var signStr = sortedKeys.map(function(k) { return String(params[k]); }).join('') + 'MI#!01LVXHG2de!A';
    params.fkey = md5(signStr);
    return params;
}

// 构建表单编码请求体（与 qs.stringify 行为一致）
function cxai_dxsBuildFormBody(params) {
    var parts = [];
    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(String(params[key])));
        }
    }
    return parts.join('&');
}

function cxai_dxsLogin() {
    var btn = document.getElementById('cxai-dxs-login-btn');
    var qrArea = document.getElementById('cxai-dxs-qr-area');
    var qrImg = document.getElementById('cxai-dxs-qr-img');
    var status = document.getElementById('cxai-dxs-login-status');
    var okArea = document.getElementById('cxai-dxs-login-ok');
    
    if (!btn) return;
    
    btn.disabled = true;
    btn.textContent = '正在生成二维码...';
    
    // 1. 生成 UUID
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://passport.daxuesoutijiang.com/session/pc/qrlogingenid',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: cxai_dxsBuildFormBody(cxai_dxsGenSignature({})),
        timeout: 10000,
        onload: function(r) {
            try {
                var res = JSON.parse(r.responseText);
                if (res.errNo !== 0 || !res.data || !res.data.uuid) {
                    throw new Error(res.errstr || '获取二维码失败');
                }
                var uuid = res.data.uuid;
                
                // 2. 显示二维码（用第三方 API 生成）
                qrArea.style.display = 'flex';
                okArea.style.display = 'none';
                // 二维码内容：大学搜题酱扫码登录 URL
                var qrData = 'https://www.daxuesoutijiang.com/session/pc/qrlogin?uuid=' + uuid;
                var qrApiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(qrData);
                qrImg.src = qrApiUrl;
                // 如果二维码图片加载失败，显示文本链接
                var _doc = (typeof top !== 'undefined' && top.document) ? top.document : document;
                var fallback = _doc.getElementById('cxai-dxs-qr-fallback');
                var qrLink = _doc.getElementById('cxai-dxs-qr-link');
                if (fallback && qrLink) {
                    qrLink.href = qrData;
                    qrLink.textContent = qrData;
                }
                qrImg.onerror = function() {
                    qrImg.style.display = 'none';
                    if (fallback) fallback.style.display = 'block';
                };
                qrImg.onload = function() {
                    qrImg.style.display = 'block';
                    if (fallback) fallback.style.display = 'none';
                };
                status.textContent = '等待扫码...';
                status.style.color = '#f60';
                btn.textContent = '登录中...';
                
                // 3. 轮询登录状态
                cxai_dxsPollLogin(uuid);
            } catch(e) {
                btn.disabled = false;
                btn.textContent = '扫码登录';
                cxai_logger('⚠️ 大学搜题酱登录失败: ' + e.message, 'red');
            }
        },
        onerror: function() {
            btn.disabled = false;
            btn.textContent = '扫码登录';
            cxai_logger('⚠️ 大学搜题酱登录网络错误', 'red');
        }
    });
}

function cxai_dxsPollLogin(uuid) {
    var btn = document.getElementById('cxai-dxs-login-btn');
    var status = document.getElementById('cxai-dxs-login-status');
    var okArea = document.getElementById('cxai-dxs-login-ok');
    var qrArea = document.getElementById('cxai-dxs-qr-area');
    
    var pollCount = 0;
    var maxPoll = 60; // 最多轮询 60 次，每次 2 秒，共 2 分钟
    
    function poll() {
        if (pollCount >= maxPoll) {
            _dxsResetLoginUI();
            if (status) {
                status.textContent = '登录超时，请重试';
                status.style.color = '#f60';
            }
            return;
        }
        
        pollCount++;
        var pollBody = cxai_dxsBuildFormBody(cxai_dxsGenSignature({ uuid: uuid }));
        
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://passport.daxuesoutijiang.com/session/pc/qrlogin',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: pollBody,
            timeout: 10000,
            onload: function(r) {
                try {
                    var res = JSON.parse(r.responseText);
                    if (res.errNo === 0) {
                        // 登录成功
                        _dxsSetLoggedInUI();
                        
                        // 提取并保存 Cookie
                        cxai_dxsSaveCookie(r);
                        cxai_logger('✅ 大学搜题酱登录成功', 'green');
                        return;
                    } else if (res.errNo === 860019) {
                        // 等待扫码
                        if (status) status.textContent = '等待扫码... (' + pollCount + ')';
                    } else {
                        if (status) status.textContent = '登录失败: ' + (res.errstr || '未知错误');
                        if (status) status.style.color = '#f60';
                        if (btn) {
                            btn.disabled = false;
                            btn.textContent = '扫码登录';
                        }
                        cxai_logger('⚠️ 大学搜题酱登录失败: ' + (res.errstr || 'errNo=' + res.errNo), 'red');
                        return;
                    }
                } catch(e) {
                    status.textContent = '状态检查失败，重试中...';
                }
                
                // 继续轮询
                setTimeout(poll, 2000);
            },
            onerror: function() {
                setTimeout(poll, 2000);
            }
        });
    }
    
    poll();
}

function cxai_dxsSaveCookie(xhr) {
    // 从响应头中提取 Set-Cookie
    var headers = xhr.responseHeaders || '';
    var cookieLines = [];
    var lines = headers.split('\n');
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].toLowerCase().indexOf('set-cookie') === 0) {
            cookieLines.push(lines[i]);
        }
    }
    
    if (cookieLines.length > 0) {
        // 解析 Cookie 名称和值
        var cookies = [];
        for (var j = 0; j < cookieLines.length; j++) {
            var parts = cookieLines[j].split(':')[1].trim().split(';')[0].trim();
            if (parts) {
                cookies.push(parts);
            }
        }
        
        if (cookies.length > 0) {
            var cookieStr = cookies.join('; ');
            var cookieDomains = JSON.stringify(['.daxuesoutijiang.com', 'www.daxuesoutijiang.com', 'passport.daxuesoutijiang.com']);
            // 优先写入 top.localStorage，确保 iframe 内也能读到同一份 Cookie
            try {
                if (top && top.localStorage) {
                    top.localStorage.setItem('cxaiSetting.dxsCookie', cookieStr);
                    top.localStorage.setItem('cxaiSetting.dxsCookieDomains', cookieDomains);
                }
            } catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }
            // 兜底：当前窗口 localStorage
            try {
                localStorage.setItem('cxaiSetting.dxsCookie', cookieStr);
                localStorage.setItem('cxaiSetting.dxsCookieDomains', cookieDomains);
            } catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }
            cxai_logger('大学搜题酱 Cookie 已保存（' + cookies.length + ' 个）', 'gray');
        }
    }
}

function cxai_dxsGetCookie() {
    // 优先读取 top.localStorage，确保 iframe 内也能读到同一份 Cookie
    try {
        if (top && top.localStorage && top.localStorage.getItem('cxaiSetting.dxsCookie')) {
            return top.localStorage.getItem('cxaiSetting.dxsCookie') || '';
        }
    } catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }
    return localStorage.getItem('cxaiSetting.dxsCookie') || '';
}

function cxai_dxsIsLoggedIn() {
    // 优先检查 top.localStorage，确保 iframe 内也能读到同一份 Cookie
    try {
        if (top && top.localStorage && top.localStorage.getItem('cxaiSetting.dxsCookie')) {
            return true;
        }
    } catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }
    return !!localStorage.getItem('cxaiSetting.dxsCookie');
}

function cxai_dxsLogout() {
    // 清除大学搜题酱登录态（top.localStorage + 当前 localStorage）
    try {
        if (top && top.localStorage) {
            top.localStorage.removeItem('cxaiSetting.dxsCookie');
            top.localStorage.removeItem('cxaiSetting.dxsCookieDomains');
        }
    } catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }
    try {
        localStorage.removeItem('cxaiSetting.dxsCookie');
        localStorage.removeItem('cxaiSetting.dxsCookieDomains');
    } catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }
    _dxsResetLoginUI();
    cxai_logger('大学搜题酱已退出登录', 'gray');
}

function _dxsResetLoginUI() {
    try {
        var btn = (top && top.document) ? top.document.getElementById('cxai-dxs-login-btn') : document.getElementById('cxai-dxs-login-btn');
        var status = (top && top.document) ? top.document.getElementById('cxai-dxs-login-status') : document.getElementById('cxai-dxs-login-status');
        var qrArea = (top && top.document) ? top.document.getElementById('cxai-dxs-qr-area') : document.getElementById('cxai-dxs-qr-area');
        var okArea = (top && top.document) ? top.document.getElementById('cxai-dxs-login-ok') : document.getElementById('cxai-dxs-login-ok');
        if (btn) {
            btn.disabled = false;
            btn.textContent = '扫码登录';
            btn.title = '';
        }
        if (status) {
            status.textContent = '等待扫码...';
            status.style.color = '#f60';
        }
        if (qrArea) qrArea.style.display = 'none';
        if (okArea) okArea.style.display = 'none';
    } catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }
}

function _dxsSetLoggedInUI() {
    try {
        var btn = (top && top.document) ? top.document.getElementById('cxai-dxs-login-btn') : document.getElementById('cxai-dxs-login-btn');
        var status = (top && top.document) ? top.document.getElementById('cxai-dxs-login-status') : document.getElementById('cxai-dxs-login-status');
        var qrArea = (top && top.document) ? top.document.getElementById('cxai-dxs-qr-area') : document.getElementById('cxai-dxs-qr-area');
        var okArea = (top && top.document) ? top.document.getElementById('cxai-dxs-login-ok') : document.getElementById('cxai-dxs-login-ok');
        if (btn) {
            btn.textContent = '已登录';
            // 保持可交互以便双击退出/重新登录，单击会提示
            btn.disabled = false;
            btn.title = '双击退出登录/重新扫码';
        }
        if (status) {
            status.textContent = '登录成功！';
            status.style.color = '#0f0';
        }
        if (qrArea) qrArea.style.display = 'none';
        if (okArea) okArea.style.display = 'block';
    } catch (_) { console.warn("[AI智脑Pro] 异常:", _.message); }
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
    console.log('[AI智脑Pro] cxaiQueryThirdPartyApi 被调用，题目:', questionText.slice(0, 50));
    return new Promise(function (resolve) {
        // 题库各自独立开关，实时读取 localStorage
        var icodefOn = localStorage.getItem('cxaiSetting.icodefEnabled') === 'true';
        var bzmOn = localStorage.getItem('cxaiSetting.bzmEnabled') === 'true';
        var dxsOn = localStorage.getItem('cxaiSetting.dxsEnabled') === 'true';
        console.log('[题库开关] icodef=' + icodefOn + ' BZM=' + bzmOn + ' 大学搜题酱=' + dxsOn);
        if (!icodefOn && !bzmOn && !dxsOn) {
            // 题库全部关闭时立即跳过，确保下一题立即生效
            console.log('[AI智脑Pro] 题库全部关闭，返回 null');
            return resolve(null);
        }

        var postData = JSON.stringify({ question: questionText, options: options, type: type, location: location.href });

        // icodef.com 兜底题库（格式化类型码）
        var _icodefTypeMap = { 0: '0', 1: '1', 2: '2', 3: '3' };

        // ★ 全局超时保护：所有题库请求总超时时间（ms），防止卡死
        var BANK_TOTAL_TIMEOUT = 45000; // 45 秒
        var _bankTimer = setTimeout(function () {
            console.warn('[AI智脑Pro] 题库全局超时(' + BANK_TOTAL_TIMEOUT / 1000 + 's)，所有接口均未返回，跳过题库');
            resolve(null);
        }, BANK_TOTAL_TIMEOUT);

        function _clearBankTimer() {
            if (_bankTimer) { clearTimeout(_bankTimer); _bankTimer = null; }
        }

        function _requestIcodefDirect(callback) {
            if (!icodefOn) {
                return callback(null);
            }
            var icodefType = _icodefTypeMap[type] || '';
            if (!icodefType) {
                return callback(null);
            }
            var icodefParam = 'question=' + encodeURIComponent(questionText) + '&type=' + icodefType;
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://cx.icodef.com/wyn-nb?v=4',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: icodefParam,
                timeout: 8000,
                onload: function (r) {
                    try {
                        var res = JSON.parse(r.responseText);
                        var answers = null;
                        if (res.data && typeof res.data === 'string' && res.data.trim()) {
                            answers = [res.data.trim()];
                        } else if (res.answer && typeof res.answer === 'string' && res.answer.trim()) {
                            answers = [res.answer.trim()];
                        } else if (res.result && Array.isArray(res.result) && res.result.length > 0) {
                            answers = res.result;
                        } else if (Array.isArray(res) && res.length > 0) {
                            answers = res;
                        }
                        if (answers && answers.length > 0) {
                            console.log('[题库命中] icodef.com 命中答案:', JSON.stringify(answers).slice(0, 200));
                            _clearBankTimer();
                            answers.__source = 'icodef';
                            return callback(answers);
                        }
                    } catch (e) { /* 解析失败静默 */ }
                    _clearBankTimer();
                    callback(null);
                },
                onerror: function () { _clearBankTimer(); callback(null); },
                ontimeout: function () { _clearBankTimer(); callback(null); }
            });
        }

        // 串行执行题库：icodef → BZM → 大学搜题酱，避免并发混乱
        // 1. icodef（免费兜底）
        function _tryIcodef() {
            if (!icodefOn) { console.log('[AI智脑Pro] icodef 关闭，跳过'); _tryBZM(); return; }
            console.log('[AI智脑Pro] 开始请求 icodef 题库');
            _requestIcodefDirect(function(icodefAnswers) {
                if (icodefAnswers) {
                    console.log('[AI智脑Pro] icodef 返回答案:', JSON.stringify(icodefAnswers).slice(0, 200));
                    // 验证答案能否匹配到选项，匹配不上则继续尝试下一个题库
                    var _bankProcessed = cxaiProcessBankAnswer(icodefAnswers, options, type, questionText);
                    if (_bankProcessed !== null && _bankProcessed !== undefined) {
                        console.log('[AI智脑Pro] icodef 答案匹配成功，processed:', _bankProcessed);
                        return resolve(icodefAnswers);
                    }
                    console.log('[AI智脑Pro题库降级] icodef 命中但匹配失败，降级到 BZM');
                } else {
                    console.log('[AI智脑Pro] icodef 无答案，降级到 BZM');
                }
                _tryBZM();
            });
        }

        // 2. BZM（需要 API Key，高质量）
        function _tryBZM() {
            if (!bzmOn) { console.log('[AI智脑Pro] BZM 关闭，跳过'); _tryDxs(); return; }
            console.log('[AI智脑Pro] 开始请求 BZM 题库');
            setTimeout(function() {
                cxaiQueryBZMTiku(questionText, options, type).then(function(bzmAnswers) {
                    console.log('[AI智脑Pro] BZM 返回:', JSON.stringify(bzmAnswers).slice(0, 200));
                    if (bzmAnswers && bzmAnswers.length > 0) {
                        console.log('[AI智脑Pro题库] BZM 命中答案:', JSON.stringify(bzmAnswers).slice(0, 200));
                        var bzmProcessed = cxaiProcessBZMAnswer(bzmAnswers, options, type);
                        if (bzmProcessed !== null && bzmProcessed !== undefined) {
                            console.log('[AI智脑Pro题库] BZM 已匹配，processed=' + JSON.stringify(bzmProcessed) + '，准备 resolve');
                            resolve({ __bzmProcessed: true, result: bzmProcessed });
                        } else {
                            console.log('[AI智脑Pro题库降级] BZM 命中但匹配失败，降级到大学搜题酱');
                            _tryDxs();
                        }
                    } else {
                        console.log('[AI智脑Pro题库未命中] BZM 无答案，降级到大学搜题酱');
                        _tryDxs();
                    }
                }).catch(function(e) {
                    console.log('[AI智脑Pro题库异常] BZM 请求异常:', e.message);
                    _tryDxs();
                });
            }, 500);
        }

        // 4. 大学搜题酱（完整搬运官方接口：图片搜题/文字搜题/题目解答/书本答案）
        // 严格按照原扩展 requestByContext 格式：FILE=FormData, POST=x-www-form-urlencoded, 无需签名
        function _tryDxs() {
            if (!dxsOn) { _clearBankTimer(); resolve(null); return; }

            // 检查登录态
            var dxsCookie = cxai_dxsGetCookie();
            var dxsLoggedIn = cxai_dxsIsLoggedIn();

            if (!dxsLoggedIn) {
                console.log('[题库跳过] 大学搜题酱 未登录，请点击侧边栏"扫码登录"');
                cxai_logger('⚠️ 大学搜题酱未登录，请点击侧边栏"扫码登录"', 'orange');
                _clearBankTimer();
                return resolve(null);
            }
            
            console.log('[题库请求] 使用大学搜题酱题库（已登录）');
            
            // 基础参数（所有请求必带）
            var dxsBase = {
                appId: 'collegepcpi',
                vcname: '1.16.6',
                os: navigator.platform || 'win',
                t: Date.now()
            };
            
            // vc = 版本号去掉小数点转数字，如 "1.16.6" → 1166
            var dxsVc = Number('1.16.6'.split('.').join('')) || 1166;
            
            // 题型映射：单选题=1, 多选题=2, 判断题=3, 填空题=4, 简答题=5
            var _dxsTypeMap = { 0: '1', 1: '2', 3: '3', 2: '4', 4: '5' };
            var dxsType = _dxsTypeMap[type] || '1';
            
            // 准备请求头，手动携带 Cookie
            var dxsHeaders = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Origin': 'https://www.daxuesoutijiang.com',
                'Referer': 'https://www.daxuesoutijiang.com/',
                'X-Requested-With': 'XMLHttpRequest'
            };
            if (dxsCookie) {
                dxsHeaders['Cookie'] = dxsCookie;
            }
            
            // 构建题目解答请求（FILE method → FormData）
            // 原扩展: method:"FILE", body = FormData{...base, ...params, ...body, vc}
            function buildSolveFormData() {
                var form = new FormData();
                var body = {
                    questionText: questionText,
                    options: options ? JSON.stringify(options) : '[]',
                    questionType: dxsType,
                    questionFrom: 'chaoxing',
                    historyResult: '',
                    question: questionText
                };
                // 按原扩展逻辑：合并 base + body + vc
                var merged = Object.assign({}, dxsBase, body, { vc: dxsVc });
                Object.keys(merged).forEach(function(k) {
                    form.append(k, String(merged[k]));
                });
                return form;
            }
            
            // 构建图片搜题请求（FILE method → FormData）
            // 原扩展: PicSearch = "/dxtools/pc/picsearch", method:"FILE"
            function buildPicSearchFormData(imageBase64) {
                var form = new FormData();
                // 提取 base64 dataURL 的 mime 和 data
                var mimeMatch = imageBase64.match(/^data:([^;]+);base64,/);
                var mime = mimeMatch ? mimeMatch[1] : 'image/png';
                var base64Data = imageBase64.replace(/^data:[^;]+;base64,/, '');
                
                // 构建二进制 Blob
                var binary = atob(base64Data);
                var bytes = new Uint8Array(binary.length);
                for (var i = 0; i < binary.length; i++) {
                    bytes[i] = binary.charCodeAt(i);
                }
                var blob = new Blob([bytes], { type: mime });
                
                // 合并参数
                var merged = Object.assign({}, dxsBase, {
                    questionImage: blob,
                    picMD5: md5(base64Data),
                    questionFrom: 'chaoxing'
                }, { vc: dxsVc });
                
                form.append('questionImage', blob, 'question.png');
                form.append('picMD5', String(merged.picMD5));
                form.append('questionFrom', String(merged.questionFrom));
                form.append('appId', String(merged.appId));
                form.append('vcname', String(merged.vcname));
                form.append('os', String(merged.os));
                form.append('vc', String(merged.vc));
                
                return form;
            }
            
            // 构建文字搜题请求（FILE method → FormData）
            function buildWholeSearchFormData() {
                var form = new FormData();
                var body = {
                    questionText: questionText,
                    questionFrom: 'chaoxing'
                };
                var merged = Object.assign({}, dxsBase, body, { vc: dxsVc });
                Object.keys(merged).forEach(function(k) {
                    form.append(k, String(merged[k]));
                });
                return form;
            }
            
            // 构建书本答案请求（POST method → URL 编码字符串）
            function buildBookAnswerBody(bookId, question) {
                var body = {
                    bookId: bookId,
                    question: question || questionText
                };
                var merged = Object.assign({}, dxsBase, body, { vc: dxsVc });
                var parts = [];
                Object.keys(merged).forEach(function(k) {
                    parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(String(merged[k])));
                });
                return parts.join('&');
            }
            
            // 发送请求（统一封装）
            function dxsRequest(url, method, data, isFile) {
                return new Promise(function(resolve, reject) {
                    var headers = Object.assign({}, dxsHeaders);
                    
                    // FormData 请求：让浏览器自动设置 Content-Type（含 boundary），避免服务端解析失败触发反作弊
                    if (!isFile) {
                        headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
                    }
                    
                    GM_xmlhttpRequest({
                        method: method,
                        url: url,
                        headers: headers,
                        data: data,
                        timeout: 15000,
                        withCredentials: true,
                        onload: function(r) {
                            try {
                                var res = JSON.parse(r.responseText);

                                // 登录态校验
                                if (res.errNo === 3 || res.errstr === '登录过期，请重新登录') {
                                    console.log('[题库跳过] 大学搜题酱 Cookie 过期');
                                    cxai_logger('⚠️ 大学搜题酱登录过期，请重新扫码登录', 'orange');
                                    // 注意：不自动清除 Cookie，避免用户每次都被迫重新登录
                                    // 更新 UI 提示用户
                                    _dxsResetLoginUI();
                                    _clearBankTimer();
                                    return resolve(null);
                                }

                                // 反作弊拦截
                                if (res.errNo === 410004 || res.errstr === '命中反作弊') {
                                    console.log('[题库跳过] 大学搜题酱 反作弊拦截');
                                    cxai_logger('⚠️ 大学搜题酱触发反作弊，请稍后再试', 'orange');
                                    _clearBankTimer();
                                    return resolve(null);
                                }

                                if (res.errNo === 0 && res.data) {
                                    _clearBankTimer();
                                    return resolve(res.data);
                                } else {
                                    console.log('[题库未命中] 大学搜题酱:', JSON.stringify(res).slice(0, 200));
                                    _clearBankTimer();
                                    return resolve(null);
                                }
                            } catch(e) {
                                console.log('[题库失败] 大学搜题酱 解析响应失败:', e.message);
                                _clearBankTimer();
                                return resolve(null);
                            }
                        },
                        onerror: function() {
                            console.log('[题库失败] 大学搜题酱 网络错误');
                            _clearBankTimer();
                            return resolve(null);
                        },
                        ontimeout: function() {
                            console.log('[题库失败] 大学搜题酱 超时');
                            _clearBankTimer();
                            return resolve(null);
                        }
                    });
                });
            }
            
            // 优先尝试题目解答接口（最精准）
            console.log('[AI智脑Pro] 开始请求大学搜题酱题目解答接口');
            dxsRequest(
                'https://www.daxuesoutijiang.com/dxai/submit/exercise/solve',
                'POST',
                buildSolveFormData(),
                true
            ).then(function(data) {
                console.log('[AI智脑Pro] 大学搜题酱题目解答返回:', data ? JSON.stringify(data).slice(0, 200) : 'null');
                if (data) {
                    var answers = null;
                    // 解析题目解答响应
                    if (data.option && typeof data.option === 'string' && data.option.trim()) {
                        answers = [data.option.trim()];
                    } else if (data.historyResult && typeof data.historyResult === 'string') {
                        try {
                            var histArr = JSON.parse(data.historyResult);
                            if (Array.isArray(histArr) && histArr.length > 0 && histArr[0].fullAnswer) {
                                answers = [String(histArr[0].fullAnswer).trim()];
                            }
                        } catch (e) { console.warn("[AI智脑Pro] 异常:", e.message); }
                    } else if (data.answer && typeof data.answer === 'string' && data.answer.trim()) {
                        answers = [data.answer.trim()];
                    }
                    
                    if (answers && answers.length > 0) {
                        console.log('[题库命中] 大学搜题酱 题目解答:', JSON.stringify(answers).slice(0, 200));
                        answers.__source = '大学搜题酱';
                        // 命中后立即 resolve 外层 Promise，终止降级链路
                        return resolve(answers);
                    }
                }
                
                // 题目解答无结果，降级到文字搜题
                console.log('[题库降级] 大学搜题酱 题目解答无结果，尝试文字搜题');
                return dxsRequest(
                    'https://www.daxuesoutijiang.com/dxtools/pc/wholesearch',
                    'POST',
                    buildWholeSearchFormData(),
                    true
                ).then(function(data) {
                    if (data) {
                        var answers = null;
                        if (data.answer) answers = [String(data.answer).trim()];
                        else if (data.option) answers = [String(data.option).trim()];
                        else if (data.historyResult) {
                            try {
                                var h = JSON.parse(data.historyResult);
                                if (h.length > 0) answers = [String(h[0].fullAnswer || h[0].answer).trim()];
                            } catch(e) { console.warn("[AI智脑Pro] 异常:", e.message); }
                        }
                        
                        if (answers && answers.length > 0) {
                            console.log('[题库命中] 大学搜题酱 文字搜题:', JSON.stringify(answers).slice(0, 200));
                            answers.__source = '大学搜题酱';
                            return resolve(answers);
                        }
                    }
                    
                    console.log('[题库未命中] 大学搜题酱 文字搜题无结果');
                    return resolve(null);
            });
            }).catch(function(e) { console.warn('[AI智脑Pro] 大学搜题酱请求异常:', e.message); _clearBankTimer(); resolve(null); });
        }

        // 启动题库查询链：icodef → BZM → 大学搜题酱
        _tryIcodef();
    })
}

function cxaiIsGarbageAnswer(s, isFromBank) {
    if (s == null) return true;
    var str = String(s).trim();
    if (str === '') return true;
    // 纯前缀无内容（如 "暂无答案"、"见解析"）— 前缀已在 _handleResponse 中剥离，这里兜底
    if (/^(有正确答案|正确答案|暂无答案|暂无|见解析|见答案|见详解|答案略|参考答案|详见解析|请查看解析)$/i.test(str)) return true;
    // 精确匹配（必须完全等于这些才算垃圾，避免误杀含"略"、"无"的正常答案）
    if (/^(略|无|不确定|不知道|不清楚|未填写|待补充|略略略?|错误的?|正确的?|不对|不正确|以上都[是对]|以上都[不没错]|都不是|都是)$/i.test(str)) return true;
    // ★ 章节编号格式（如 "5.3 寻址方式"、"3.2.1 概述"、"2.5 总线"）— 题库返回了章节标题而非答案
    if (/^\d+\.\d+(\.[\d]+)?\s+[\u4e00-\u9fa5]/.test(str)) return true;
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
    if (!isFromBank && cxai_currentQuestionMeta && cxai_currentQuestionMeta.questionText) {
        var _qCheck = cxai_currentQuestionMeta.questionText.trim();
        // 短答案(<=4字符)不参与子串判定，避免误杀 "I"/"II"/"III" 等选项
        if (str.length > 4 && str.length <= 30 && _qCheck.indexOf(str) !== -1) {
            // 排除：答案恰好是某个选项文本的情况
            var _opts2 = cxai_currentQuestionMeta.options || [];
            var _isOpt = _opts2.some(function(o) {
                var _c = o.replace(/^[A-Z]\s*/, '').replace(/[\n\r\t]/g, '').trim();
                return _c === str || _c.indexOf(str) !== -1 || str.indexOf(_c) !== -1;
            });
            if (!_isOpt) {
                console.log('[AI智脑Pro] 检测到答案是题目片段: "' + str + '"');
                return true;
            }
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
    // ★ 题目回显检测：AI返回了题目文本的片段而非答案（短答案/题库答案跳过）
    if (!isFromBank && str.indexOf('#') === -1 && str.length > 20 && cxai_currentQuestionMeta && cxai_currentQuestionMeta.questionText) {
        // 如果答案与某个选项匹配，说明是正确答案而非回显
        var _opts = cxai_currentQuestionMeta.options || [];
        var _matched = _opts.some(function(opt) {
            var _clean = opt.replace(/^[A-Z]\s*/, '').replace(/[\n\r\t]/g, '').trim();
            return _clean === str || str.indexOf(_clean) !== -1 || _clean.indexOf(str) !== -1;
        });
        if (!_matched) {
            var _qText = cxai_currentQuestionMeta.questionText.trim();
            // 检查答案是否与题目有大量重叠（包含题目中连续15字以上的片段）
            if (_qText.length > 15 && str.length > 10) {
                for (var qi = 0; qi <= _qText.length - 15; qi++) {
                    var _frag = _qText.substring(qi, qi + 15);
                    if (str.indexOf(_frag) !== -1) {
                        console.log('[AI智脑Pro] 检测到答案回显题目片段: "' + _frag + '"');
                        return true;
                    }
                }
            }
        }
    }
    // ★ 推理过程检测：AI返回了推理/分析文本而非答案（含常见推理关键词且长度较长）
    if (str.length > 15 && /^(我们需要|首先|根据题目|由题意|设|令|假设|由于|因为|所以|通过计算|经过|分析|让我们|我们来|下面|接下来)/i.test(str)) return true;
    return false;
}


function cxaiProcessBankAnswer(answerList, optionsArr, type, questionText) {
    if (!answerList || answerList.length === 0) { console.log('[AI智脑Pro题库] 答案列表为空'); return null; }
    console.log('[AI智脑Pro题库] 处理答案 - 题型:', type, '| 答案:', JSON.stringify(answerList), '| 选项:', JSON.stringify(optionsArr));
    if (questionText) console.log('[AI智脑Pro题库] 题干:', String(questionText).slice(0, 80));
    // 在侧边栏日志中显示题库返回的原始答案，方便排查匹配问题
    var _answerPreview = answerList.map(function(a) { return String(a); }).join(' | ');
    console.log('[AI智脑Pro题库] 原始答案预览:', _answerPreview);
    // ★ 将选项文本存入 meta，供回显检测识别正确答案
    if (cxai_currentQuestionMeta && optionsArr && optionsArr.length > 0) {
        cxai_currentQuestionMeta.options = optionsArr;
    }

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
        if (cxaiIsGarbageAnswer(a, true)) {
            console.log('[AI智脑Pro题库] 过滤垃圾答案: "' + String(a) + '"');
            return false; // 移除垃圾答案
        }
        // ★ 多选题答案不是合法的字母格式（应为 "A,B,C" 或 "ABC" 等）
        var _aStr = String(a);
        if (cxai_currentQuestionMeta && (cxai_currentQuestionMeta.typeName === '多选题' || cxai_currentQuestionMeta.typeName === '多项选择题') && _aStr.length > 2) {
            // 合法格式: 纯字母如 "AB"、"A,B,C"、"A、B、D"、数字索引如 "0|2|3"
            // ★ icodef.com 格式: 选项文本用 # 分隔（也合法）
            var _isLegalMulti = /^[A-Ga-g\s,，、|;；]+$/.test(_aStr) || /^\d[\d\s|,;，、和]+$/.test(_aStr) || /^\d+$/.test(_aStr) || _aStr.indexOf('#') !== -1;
            if (!_isLegalMulti) {
                console.log('[AI智脑Pro] 多选题答案格式不合法，判为垃圾: "' + _aStr.slice(0, 40) + '"');
                return false; // 移除不合法格式
            }
        }
        return true; // 保留有效答案
    });
    console.log('[AI智脑Pro题库] 过滤后答案:', JSON.stringify(answerList));
    if (answerList.length === 0) { console.log('[AI智脑Pro题库] 过滤后答案列表为空'); return null; }

    var targetIndices = [];
    var matchLog = [];
    for (var k = 0; k < answerList.length; k++) {
        var ans = answerList[k];
        var matchedIdx = -1;

        // ★ 题库返回数字索引时直接命中
        if (typeof ans === 'number' && Number.isInteger(ans)) {
            if (ans >= 0 && ans < (optionsArr ? optionsArr.length : 10)) {
                targetIndices.push(ans);
                console.log('[AI智脑Pro题库] 数字索引直接命中: 选项' + (ans + 1));
                matchLog.push('答案"' + String(ans) + '"→数字索引→选项' + (ans + 1));
                continue;
            }
        }

        ans = String(ans);

        // 字母索引匹配（如 "B" → 1, "d" → 3）
        if (ans.length === 1 && /^[A-Ga-g]$/.test(ans)) {
            targetIndices.push(ans.toUpperCase().charCodeAt(0) - 65);
            matchLog.push('答案"' + ans + '"→字母索引→选项' + (ans.toUpperCase().charCodeAt(0) - 64));
            continue;
        }
        // ★ 多选分隔符格式：选项文本用 # ; ； | ｜ 、 ， , 分隔（如 "选项A文本#选项B文本" 或 "A,B,C"）
        // 单选题跳过：单选答案可能是 "4、8" 这种顿号分隔的文本，不应拆分
        if (type !== 0 && optionsArr && optionsArr.length > 0 && /[#;；|｜、，,]/.test(ans)) {
            var parts = ans.split(/[#;；|｜、，,]+/).map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
            for (var pi = 0; pi < parts.length; pi++) {
                var partText = parts[pi];
                if (!partText) continue;
                var partNorm = cxai_normalizeAnswer(partText);
                for (var pj = 0; pj < optionsArr.length; pj++) {
                    var optNorm = cxai_normalizeAnswer(optionsArr[pj].replace(/^[A-Z]\s*/, ''));
                    if (optNorm === partNorm || optNorm.indexOf(partNorm) !== -1 || partNorm.indexOf(optNorm) !== -1) {
                        if (targetIndices.indexOf(pj) === -1) targetIndices.push(pj);
                        break;
                    }
                }
            }
            if (targetIndices.length > 0) {
                matchLog.push('答案"' + ans.slice(0, 30) + '"→多选分隔符匹配→选项' + targetIndices.map(function(i) { return i + 1; }).join(','));
                continue;
            }
        }
        // 数字字符串（如 "2"）也当索引
        if (/^\d+$/.test(ans)) {
            var numIdx = parseInt(ans, 10);
            if (numIdx >= 0 && numIdx < (optionsArr ? optionsArr.length : 10)) {
                targetIndices.push(numIdx);
                matchLog.push('答案"' + ans + '"→数字索引→选项' + (numIdx + 1));
                continue;
            }
        }
        // 文本精确匹配（优先精确相等，其次选最短匹配项，避免命中"拼正确答案"干扰项）
        var found = false;
        if (optionsArr) {
            var _ansNorm = cxai_normalizeAnswer(ans);
            var _bestIdx = -1, _bestLen = Infinity;
            for (var j = 0; j < optionsArr.length; j++) {
                var _optNorm = cxai_normalizeAnswer(optionsArr[j].replace(/^[A-Z]\s*/, ''));
                if (_optNorm === _ansNorm || _optNorm.indexOf(_ansNorm) !== -1 || _ansNorm.indexOf(_optNorm) !== -1) {
                    // 精确相等优先，否则选最短的选项（最直接的答案）
                    if (_optNorm === _ansNorm) {
                        _bestIdx = j;
                        _bestLen = 0;
                        break;
                    }
                    if (_optNorm.length < _bestLen) {
                        _bestLen = _optNorm.length;
                        _bestIdx = j;
                    }
                }
            }
            if (_bestIdx !== -1) {
                targetIndices.push(_bestIdx);
                found = true;
                matchLog.push('答案"' + ans.slice(0, 20) + '"→文本匹配→选项' + (_bestIdx + 1));
            }
        }
        // 模糊匹配 fallback
        if (!found && ans.length >= 2 && optionsArr) {
            var bestIdx = cxai_findBestFuzzyMatch(optionsArr, ans);
            if (bestIdx !== -1) {
                targetIndices.push(bestIdx);
                matchLog.push('答案"' + ans.slice(0, 20) + '"→模糊匹配→选项' + (bestIdx + 1));
            } else {
                matchLog.push('答案"' + ans.slice(0, 20) + '"→未匹配');
            }
        }
    }

    if (targetIndices.length === 0) {
        console.log('[AI智脑Pro题库] 无法匹配任何选项 | 匹配日志:', matchLog.join('; '));
        return null;
    }

    console.log('[AI智脑Pro题库] 匹配日志:', matchLog.join('; '));
    console.log('[AI智脑Pro题库] 最终匹配索引:', targetIndices);

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


function cxai_getAnswer(_t, _q, retryCount = 0, rawMode = false, skipModelIdx = 0) {
    // 每次调用时自动暴露到 window/top，确保划词搜题模块能找到
    try {
        if (typeof window !== 'undefined' && !window.cxai_getAnswer) {
            window.cxai_getAnswer = cxai_getAnswer;
            console.log('[AI智脑Pro] 自动暴露 cxai_getAnswer 到 window');
        }
        if (typeof top !== 'undefined' && top !== window && !top.cxai_getAnswer) {
            top.cxai_getAnswer = cxai_getAnswer;
            console.log('[AI智脑Pro] 自动暴露 cxai_getAnswer 到 top');
        }
    } catch (e) {
        console.warn('[AI智脑Pro] 自动暴露失败:', e.message);
    }
    if (!rawMode && cxai_isPaused()) {
        console.log('[AI智脑Pro] cxai_getAnswer: 已暂停');
        return Promise.reject({ 'c': 0, _instant: true, _paused: true });
    }
    // 搜题总开关：关闭时静默跳过，但 rawMode（划词搜题）不受限制
    if (!rawMode && localStorage.getItem('cxaiSetting.searchEnabled') === 'false') {
        console.log('[AI智脑Pro] cxai_getAnswer: 搜题总开关关闭');
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
    cxaiCfg._lastAnswerIsAi = false;  // 默认按题库节奏；若本次由 AI 命中，_handleResponse 会置为 true
    // 答题节奏提示（仅当用户自定义了题库/AI 间隔且与默认值不同时显示，避免刷屏）
    var _bankSec = (parseFloat(localStorage.getItem('cxaiSetting.time')) || 2.5)
    var _aiSec = (parseFloat(localStorage.getItem('cxaiSetting.aiTime')) || 2.5)
    if (_bankSec !== 2.5 || _aiSec !== 2.5) {
        cxai_logger(_qPrefix + '答题节奏：题库' + _bankSec + '秒 | AI' + _aiSec + '秒', 'gray')
    }
    // 在日志中插入一条 "AI 思考中..." 占位行, 拿到响应后原地替换为答案/错误, 避免独立提示框反复出现/消失
    let _thinkingHtml = 'AI 思考中...' + (retryCount > 0 ? '（第' + (retryCount + 1) + '次）' : '')
    let $thinkingLog = cxai_logger(_thinkingHtml, 'gray')
    return new Promise((resolve, reject) => {
        let _u = cxai_getCk('_uid') || cxai_getCk('UID')
        let requestCompleted = false;  // 标记请求是否已完成
        let longWaitTimer = null;  // 长时间等待定时器

        // 按用户设置的搜题间隔节流：计算本次需要等待的 ms，并预订下一次可发起时间
        // rawMode（划词搜题）不参与节流，不受自动答题间隔限制
        let _intervalSec = rawMode ? 0 : parseInt(localStorage.getItem('cxaiSetting.reqIntervalTime'), 10)
        if (!isFinite(_intervalSec) || _intervalSec < 0) _intervalSec = rawMode ? 0 : ((cxaiCfg && cxaiCfg.reqIntervalTime) || 0)
        let _intervalMs = Math.min(60000, _intervalSec * 1000)
        let _nowTs = Date.now()
        let _waitMs = Math.max(0, _cxaiNextAiAllowedAt - _nowTs)
        // 预订下一次最早可发起时刻：当前/解锁时间 + 间隔（rawMode 不预订，不影响后续节流）
        if (!rawMode) _cxaiNextAiAllowedAt = Math.max(_nowTs, _cxaiNextAiAllowedAt) + _intervalMs
        if (_waitMs > 0 && !rawMode) {
            cxai_updateLogEntry($thinkingLog, '搜题间隔限制，等待 ' + Math.round(_waitMs / 1000) + 's 后发起请求...', 'gray')
        }

        // 设置监控定时器（必须大于所有请求总超时时间，避免抢先触发导致无效重试）
        // 题库总超时：3个×15秒 = 45秒；AI请求超时：120秒；总计约165秒
        longWaitTimer = setTimeout(() => {
            if (!requestCompleted) {
                requestCompleted = true;  // 标记为已完成，避免处理旧响应
                // 简答题/主观题只重试1次（AI响应慢时避免等待过久）
                var maxRetry = (_t === 4 || _t === 5 || _t === 6) ? 1 : 2;
                if (retryCount >= maxRetry) {
                    // 超过最大重试次数，跳过此题
                    cxai_updateLogEntry($thinkingLog, '请求超时已重试' + (retryCount + 1) + '次仍失败，跳过此题', 'red')
                    reject({ 'c': 0 })
                } else {
                    // 原地把 "AI 思考中" 行替换为重试提示, 不再追加新日志
                    cxai_updateLogEntry($thinkingLog, '请求超时未响应，正在重试...（第' + (retryCount + 1) + '次重试）', 'orange')
                    // 重新发起请求(递归调用会创建新的 "思考中" 行)
                    cxai_getAnswer(_t, _q, retryCount + 1).then(resolve).catch(reject)
                }
            }
        }, 200000 + _waitMs);  // 200秒 = 200000毫秒（大于题库45秒+AI120秒=165秒）

        setTimeout(function () {
        if (requestCompleted) return; // 若已因 5 分钟超时进入重试，则不再发送本次请求

        // 请求实际发起前，若节流等待行还在显示，更新为"思考中"
        if (_waitMs > 0) {
            let _resumeHtml = 'AI 思考中...' + (retryCount > 0 ? '（第' + (retryCount + 1) + '次）' : '')
            cxai_updateLogEntry($thinkingLog, _resumeHtml, 'gray')
        }

        // 读取 Provider 配置
        var _cfg = cxaiGetProviderConfig();
        var _useProvider = !!_cfg.apiKey;  // 有 API Key 走直连，否则走代理

        // 检查是否有任何答案来源（题库 或 AI Provider/代理）
        var _hasQuestionBank = localStorage.getItem('cxaiSetting.icodefEnabled') === 'true'
            || localStorage.getItem('cxaiSetting.bzmEnabled') === 'true'
            || localStorage.getItem('cxaiSetting.dxsEnabled') === 'true';
        var _hasAI = !!(_useProvider);
        if (!_hasQuestionBank && !_hasAI) {
            cxai_updateLogEntry($thinkingLog, '请先在「模型」Tab 添加模型，或开启题库', 'red')
            reject({ 'c': 0 })
            return
        }

        // 自适应参数
        var _adapt = cxaiGetModelParams(_t);
        var _reqOpts = { model: _cfg.model, temperature: _adapt.temperature, maxTokens: _adapt.maxTokens, topP: _adapt.topP };

        // 统一响应处理（内层异常直接 catch 并走 _handleError，不阻断主流程）
        // isFromBank: 题库答案不做首字母清洗（避免 "B" 被清为空）
        // rawMode: 返回原始 AI 内容，不做任何后处理（用于划词搜题等需要完整解析的场景）
        function _handleResponse(answer, isFromBank) {
            console.log('[AI智脑Pro] _handleResponse, answer=' + (typeof answer === 'string' ? answer.slice(0, 50) : JSON.stringify(answer)) + ', isFromBank=' + isFromBank);
            if (requestCompleted) {
                console.log('[AI智脑Pro] _handleResponse 因 requestCompleted=true 直接返回');
                return;
            }
            if (rawMode) {
                requestCompleted = true;
                clearTimeout(longWaitTimer);
                resolve(answer);
                return;
            }
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
                        console.log('[AI智脑Pro] 检测到答案回显题目(重叠' + _overlapCount + '段): "' + _ans.slice(0, 40) + '..."');
                        _ans = '';
                    }
                }
            }

            // ★ 剥离 AI 常见答案前缀（"正确答案："、"答案："、"参考答案：" 等），防止长答案被误判垃圾
            if (!isFromBank && _ans.length > 0) {
                var _stripped = _ans.replace(/^(有正确答案|正确答案|参考答案|答案|该题答案)\s*[：:，,。\s]*/i, '').trim();
                if (_stripped.length > 0 && _stripped.length < _ans.length) {
                    console.log('[AI智脑Pro] 剥离答案前缀: "' + _ans.slice(0, 30) + '..." → "' + _stripped.slice(0, 30) + '..."');
                    _ans = _stripped;
                }
            }

            // ★ 检测AI推理/无法回答的情况（如 "图片无法直接查看"、"需要基于...来推理"）
            if (!isFromBank && _ans.length > 15) {
                if (/图片.*无法|无法.*查看|无法.*识别|需要.*推理|基于.*推理|但我.*无法|我无法.*确定/.test(_ans)) {
                    console.log('[AI智脑Pro] 检测到AI无法回答(图片/推理): "' + _ans.slice(0, 50) + '..."');
                    _ans = ''; // 清空，触发垃圾检测
                }
            }

            // ★ 增强：从长解释文本中提取答案字母
            if (!isFromBank && _ans.length > 3) {
                var _directM = _ans.match(/答案[是为：:\s]*([A-Ga-g])\b/) ||
                               _ans.match(/选[择了取]?[：:\s]*([A-Ga-g])\b/) ||
                               _ans.match(/正确[答选][案项]?[是为：:\s]*([A-Ga-g])\b/);
                if (_directM && _directM[1]) {
                    console.log('[AI智脑Pro] 从解释中提取答案(字母): "' + _ans.slice(0, 40) + '..." \u2192 ' + _directM[1].toUpperCase());
                    _ans = _directM[1].toUpperCase();
                }
                if (_ans.length > 3) {
                    var _quotedM = _ans.match(/[\u201c\u201d"']([A-Ga-g])[\u201c\u201d"']/);
                    if (_quotedM && _quotedM[1]) {
                        console.log('[AI智脑Pro] 从解释中提取答案(引号字母): "' + _ans.slice(0, 40) + '..." \u2192 ' + _quotedM[1].toUpperCase());
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
                    console.log('[AI智脑Pro] 从解释中提取答案(引号): "' + _ans.slice(0, 40) + '..." → "' + _m[1] + '"');
                    _ans = _m[1];
                } else {
                    // 模式2: "对应X" 或 "答案为X"（如 "对应IP"）
                    _m = _ans.match(/(?:对应|答案为|选[择为])\s*[：:为]?\s*[""「]?([^""」,，。.\s]{1,20})/i);
                    if (_m && _m[1]) {
                        console.log('[AI智脑Pro] 从解释中提取答案(对应): "' + _ans.slice(0, 40) + '..." → "' + _m[1] + '"');
                        _ans = _m[1];
                    } else {
                        // 模式3: "正确选项/答案是X" 或 "应选X"
                        _m = _ans.match(/(?:正确选项|正确答案|应该?[是选]择?)\s*[为是：:]\s*[""「]?([^""」,，。.\s]{1,20})/i);
                        if (_m && _m[1]) {
                            console.log('[AI智脑Pro] 从解释中提取答案(正确选项): "' + _ans.slice(0, 40) + '..." → "' + _m[1] + '"');
                            _ans = _m[1];
                        } else {
                            // 模式4: 末尾是"是/为/选X"（如 "...所以正确答案是IP"）
                            _m = _ans.match(/[是为选]\s*[""「]?([A-Za-z\u4e00-\u9fa5]{1,20})\s*$/);
                            if (_m && _m[1]) {
                                console.log('[AI智脑Pro] 从解释中提取答案(尾部): "' + _ans.slice(0, 40) + '..." → "' + _m[1] + '"');
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
                        console.log('[AI智脑Pro] 解析"选项N"格式: "' + _ans + '" → "' + _optIndices.join('|') + '"');
                        _ans = _optIndices.join('|');
                    }
                }
            }

            // ★ 解析判断题格式的回答（如 "- A: 正确, B: 错误, C: 正确" → 提取正确选项字母）
            // 要求字母前有分隔符（^开头/空格/逗号/换行），避免 "以I是对的？" 误匹配
            if (/正确|对|是|√|T\b|true/i.test(_ans) && /(?:^|[\s,，、;；\n])([A-Za-z])\s*[.:：]?\s*(正确|错误|对|错|是|否|√|×)/i.test(_ans)) {
                var _correctLetters = [];
                var _judgeMatches = _ans.match(/(?:^|[\s,，、;；\n])([A-Za-z])\s*[.:：]?\s*(正确|对|是|√|T\b|true)/gi);
                if (_judgeMatches) {
                    for (var ji = 0; ji < _judgeMatches.length; ji++) {
                        var _letterMatch = _judgeMatches[ji].match(/(?:^|[\s,，、;；\n])([A-Za-z])/);
                        if (_letterMatch) _correctLetters.push(_letterMatch[1].toUpperCase());
                    }
                }
                if (_correctLetters.length > 0) {
                    var _extracted = _correctLetters.join('|');
                    _ans = _extracted;
                }
            }

            // ★ AI 答案以 "C. 选项文本" / "C、选项文本" 形式给出，且剩余文本与对应选项匹配时，简化为字母
            if (!isFromBank && _qOptions && _qOptions.length > 0 && _ans.length > 2) {
                var _leadOptMatch = _ans.match(/^([A-Ga-g])[.、。,，;；:：\)\]）】\s]+(.+)$/);
                if (_leadOptMatch) {
                    var _leadOptIdx = _leadOptMatch[1].toUpperCase().charCodeAt(0) - 65;
                    var _leadOptRest = String(_leadOptMatch[2]).trim();
                    if (_leadOptIdx >= 0 && _leadOptIdx < _qOptions.length && _leadOptRest.length > 0) {
                        var _leadRestNorm = cxai_normalizeAnswer(_leadOptRest);
                        var _leadOptNorm = cxai_normalizeAnswer(_qOptions[_leadOptIdx]);
                        if (_leadRestNorm && _leadOptNorm && (_leadRestNorm === _leadOptNorm || _leadOptNorm.indexOf(_leadRestNorm) !== -1 || _leadRestNorm.indexOf(_leadOptNorm) !== -1)) {
                            console.log('[AI智脑Pro] AI 答案以选项字母+文本给出且匹配选项' + (_leadOptIdx + 1) + '，简化为: ' + _leadOptMatch[1].toUpperCase());
                            _ans = _leadOptMatch[1].toUpperCase();
                        }
                    }
                }
            }

            // ★ 垃圾答案拦截：题库/AI 返回无意义文本时直接跳过
            if (cxaiIsGarbageAnswer(_ans, isFromBank)) {
                console.log('[AI智脑Pro] 拦截垃圾答案(' + (isFromBank ? '题库' : 'AI') + '): "' + _ans + '"');
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
            } else if (!isFromBank && displayAns) {
                // 清理 AI 返回的冗余格式：如 "A 1,15"、"B 2,15" 等（字母后带选项文本）
                // 只保留答案字母部分，避免显示混淆
                var _cleanM = displayAns.match(/^([A-Ga-g])\s+.+$/);
                if (_cleanM && _cleanM[1]) {
                    displayAns = _cleanM[1].toUpperCase();
                }
            }
            // ★ 题库答案标准化：纯数字索引→字母，纯字母直接使用，选项文本保持原样交给后续匹配
            var _finalAns = _ans;
            if (isFromBank) {
                if (/^\d+$/.test(_ans) && _qOptions) {
                    var _bankNumIdx = parseInt(_ans, 10);
                    if (_bankNumIdx >= 0 && _bankNumIdx < _qOptions.length) {
                        _finalAns = String.fromCharCode(65 + _bankNumIdx);
                    }
                } else if (_ans.length === 1 && /^[A-Ga-g]$/.test(_ans)) {
                    _finalAns = _ans.toUpperCase();
                }
                // 选项文本（含中文/多字母）保持原样，不提取首字母，避免 I/O、括号前缀等干扰
            }
            cxai_updateLogEntry($thinkingLog, '答案:' + displayAns, 'purple')
            cxaiCfg._lastAnswerIsAi = !isFromBank;  // 标记答案来源，决定下一题使用 aiTime 还是 bankTime
            resolve(_finalAns)
        }
    function _handleError(msg, code) {
        if (requestCompleted) return;
        requestCompleted = true;
        clearTimeout(longWaitTimer);
        cxai_updateLogEntry($thinkingLog, msg, 'red')
        reject({ 'c': code || 0 })
    }

        function _doAILogic(providerKey, modelName, skipModelIdx) {
    // 支持重试序列：按优先级尝试多个模型
    var retrySeq = cxai_buildRetrySequence(providerKey || _cfg.key, modelName || _cfg.model);
    // 从 skipModelIdx 开始（换模型时跳过已尝试的）
    if (skipModelIdx > 0 && skipModelIdx < retrySeq.length) {
        retrySeq = retrySeq.slice(skipModelIdx);
    }
    var currentIdx = 0;
    
    function _tryNextModel() {
        if (currentIdx >= retrySeq.length) {
            _handleError('所有模型均尝试失败（共 ' + retrySeq.length + ' 个）', 0);
            return;
        }
        
        var seqItem = retrySeq[currentIdx];
        currentIdx++;
        
        // 查找 provider
        var seqProvider = cxai_findProviderByKey(seqItem.key);
        if (!seqProvider) {
            console.log('[模型重试] Provider 未找到:', seqItem.key, '跳过');
            _tryNextModel();
            return;
        }
        
        // 查找 API Key
        var seqApiKey = '';
        try {
            var _seqKeys = JSON.parse(localStorage.getItem('cxaiSetting.apiKeys') || '{}');
            seqApiKey = _seqKeys[seqItem.key] || '';
        } catch (e) { seqApiKey = localStorage.getItem('cxaiSetting.apiKey') || ''; }
        if (!seqApiKey && seqProvider.isCustom && seqProvider.apiKey) seqApiKey = seqProvider.apiKey;
        
        if (!seqApiKey) {
            console.log('[模型重试] Provider', seqItem.key, '无 API Key，跳过');
            _tryNextModel();
            return;
        }
        
        // 更新当前使用的模型信息
        var seqModel = seqItem.model;
        var seqUrl = cxaiNormalizeEndpoint(seqProvider.endpoint);
        var seqHeaders = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + seqApiKey
        };
        var seqBody = cxaiBuildRequest('openai', _payload, { model: seqModel, temperature: _adapt.temperature, maxTokens: _adapt.maxTokens, topP: _adapt.topP, rawMode: rawMode });
        
        var modelLabel = seqProvider.name + ' / ' + seqModel;
        GM_xmlhttpRequest({
            method: 'POST', url: seqUrl, headers: seqHeaders, data: seqBody, timeout: 120000,
            onload: function (xhr) {
                if (requestCompleted) return;
                if (xhr.status === 200) {
                    try {
                        var raw = $.parseJSON(xhr.responseText) || {};
                        var result = cxaiParseResponse('openai', raw);
                        if (retrySeq.length > 1) {
                            cxai_updateLogEntry($thinkingLog, '模型 ' + modelLabel + ' 返回答案', 'green');
                        }
                        _handleResponse(result);
                    } catch (e) {
                        console.log('[模型重试] 响应解析失败，尝试下一个模型');
                        _tryNextModel();
                    }
                } else if (xhr.status === 401 || xhr.status == 403) {
                    console.log('[模型重试] API Key 无效，尝试下一个模型');
                    _tryNextModel();
                } else if (xhr.status === 429) {
                    console.log('[模型重试] 请求过于频繁，尝试下一个模型');
                    _tryNextModel();
                } else if (xhr.status === 500) {
                    console.log('[模型重试] 服务器错误，尝试下一个模型');
                    _tryNextModel();
                } else {
                    console.log('[模型重试] HTTP', xhr.status, '尝试下一个模型');
                    _tryNextModel();
                }
            },
            ontimeout: function () {
                if (requestCompleted) return;
                console.log('[AI智脑Pro] GM_xmlhttpRequest ontimeout，model:', modelLabel);
                console.log('[模型重试] 请求超时，尝试下一个模型');
                _tryNextModel();
            },
            onerror: function (err) {
                if (requestCompleted) return;
                console.log('[AI智脑Pro] GM_xmlhttpRequest onerror，model:', modelLabel, 'error:', err);
                console.log('[模型重试] 请求网络错误:', err && err.message ? err.message : String(err));
                _tryNextModel();
            }
        });
    }
    
    _tryNextModel();
} // end _doAILogic

function _doRequest(url, headers, body, format) {
            GM_xmlhttpRequest({
                method: 'POST', url: url, headers: headers, data: body, timeout: 120000,
                onload: function (xhr) {
                    if (requestCompleted) return;
                    if (xhr.status === 200) {
                        try {
                            var raw = $.parseJSON(xhr.responseText) || {};
                            // 直连 Provider：统一解析
                            var result = cxaiParseResponse(format, raw);
                            _handleResponse(result);
                        } catch (e) {
                            _handleError(e.message || '响应解析失败', 0)
                        }
                    } else if (xhr.status === 401 || xhr.status == 403) {
                        _handleError('API Key无效或请求被拒绝', xhr.status)
                    } else if (xhr.status === 429) {
                        _handleError('请求过于频繁，请稍后再试', 403)
                    } else if (xhr.status === 500) {
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

        // 阶段1：先查题库（rawMode 跳过题库，直接走 AI）
        if (rawMode) {
            if (!_hasAI) {
                cxai_updateLogEntry($thinkingLog, '请先在「模型」Tab 添加模型', 'red');
                reject({ 'c': 0, _noAI: true });
                return;
            }
            _doAILogic(_cfg.key, _cfg.model, skipModelIdx);
            return;
        }

        console.log('[AI智脑Pro] 开始查询题库...');
        cxaiQueryThirdPartyApi(_qText, _qOptions, _t).then(function (tpAnswers) {

            console.log('[AI智脑Pro] 题库查询完成，tpAnswers:', tpAnswers, 'requestCompleted:', requestCompleted);
            if (requestCompleted) {
                console.log('[AI智脑Pro题库] requestCompleted 已为 true，跳过处理');
                return;
            }

            var allAnswers = [];
            var bzmProcessed = null;

            // ★ 兼容 BZM 已处理结果（{ __bzmProcessed: true, result: ... }）
            if (tpAnswers && tpAnswers.__bzmProcessed) {
                bzmProcessed = tpAnswers.result;
                cxai_logger('📚 BZM 题库命中', 'purple');
            } else if (tpAnswers && Array.isArray(tpAnswers)) {
                allAnswers.push.apply(allAnswers, tpAnswers);
                var _bankSource = tpAnswers.__source || '题库';
                cxai_logger('📚 ' + _bankSource + ' 命中', 'blue');
                // 在侧边栏日志中显示题库返回的原始答案，方便排查匹配问题
                var _rawAnswers = allAnswers.map(function(a) { return String(a); }).join(' | ');
                cxai_logger('   原始答案: ' + _rawAnswers.slice(0, 100), 'gray');
            }

            if (allAnswers.length === 0 && !bzmProcessed) {

                // AI 答题总开关：关闭时不再 fallback AI，直接跳过
                if (localStorage.getItem('cxaiSetting.aiAnswerEnabled') === 'false') {
                    cxai_updateLogEntry($thinkingLog, '题库未命中，AI 答题已关闭，跳过此题', 'orange');
                    reject({ 'c': 0, _aiDisabled: true });
                } else {
                    _doAILogic(_cfg.key, _cfg.model);
                }

                return;

            }

            var processed = null;

            if (bzmProcessed !== null && bzmProcessed !== undefined) {

                processed = bzmProcessed;

            } else {

                processed = cxaiProcessBankAnswer(allAnswers, _qOptions, _t, _display);

            }

            if (processed !== null && processed !== undefined) {

                var displayAnswer = '';

                if (_t === 0 && typeof processed === 'number') {
                    // 单选题：题库返回数字索引时，直接转字母传给下游，避免下游再用 cxaiMatchByLetter 解析选项文本时误提取末尾字母
                    if (processed >= 0 && processed < (_qOptions ? _qOptions.length : 26)) {
                        displayAnswer = String.fromCharCode(65 + processed);
                    } else {
                        displayAnswer = String(processed);
                    }

                } else if (_t === 1 && Array.isArray(processed) && _qOptions) {

                    displayAnswer = processed.map(function (idx) {

                        return (idx < _qOptions.length) ? _qOptions[idx] : idx;

                    }).join(' | ');

                } else {

                    displayAnswer = String(processed);

                }

                // 在侧边栏显示最终选中的答案文本
                cxai_logger('✅ 题库选中: ' + displayAnswer.slice(0, 50), 'green');
                cxai_logger('题库命中: ' + _qText.slice(0, 30), 'green');

                _handleResponse(displayAnswer, true);

            } else {

                console.log('[AI智脑Pro题库] 答案处理后为空，转向AI');

                // AI 答题总开关：关闭时不再 fallback AI，直接跳过
                if (localStorage.getItem('cxaiSetting.aiAnswerEnabled') === 'false') {
                    cxai_updateLogEntry($thinkingLog, '题库命中但答案匹配失败，AI 答题已关闭，跳过此题', 'orange');
                    reject({ 'c': 0, _aiDisabled: true });
                } else {
                    _doAILogic(_cfg.key, _cfg.model);
                }

            }


            console.warn('[AI智脑Pro题库] 查询异常完成，requestCompleted=' + requestCompleted);

            if (!requestCompleted) {
                // AI 答题总开关：关闭时不再 fallback AI，直接跳过
                if (localStorage.getItem('cxaiSetting.aiAnswerEnabled') === 'false') {
                    cxai_updateLogEntry($thinkingLog, '题库查询异常，AI 答题已关闭，跳过此题', 'orange');
                    reject({ 'c': 0, _aiDisabled: true });
                } else {
                    _doAILogic(_cfg.key, _cfg.model);
                }
            }

        });


        }, _waitMs);
    })
}


// ═══════════════════════════════════════════════════════════════════════════════
//  § 12. 工具函数
//  任务切换、字符串清洗、字体解密、粘贴绕过
// ═══════════════════════════════════════════════════════════════════════════════

var _cxaiDesktopSkipped = 0;
function cxai_doWork(index, doms, dom) {
    $frame_c = $(dom).contents();
    let $CyHtml = $frame_c.find('.CeYan')
    let TiMuList = $CyHtml.find('.TiMu')
    $subBtn = $frame_c.find(".ZY_sub").find(".btnSubmit");
    $saveBtn = $frame_c.find(".ZY_sub").find(".btnSave");
    _cxaiDesktopSkipped = 0;
    cxai_startDoWork(index, doms, 0, TiMuList)
}


function cxai_startDoWork(index, doms, c, TiMuList) {
    if (cxai_isPaused()) {
        if (!_cxaiPauseMsgShown) { cxai_logger('⏸ 任务已暂停，5 秒后继续下一题...', 'warn'); _cxaiPauseMsgShown = true; }
        setTimeout(() => { cxai_startDoWork(index, doms, c, TiMuList) }, 5000);
        return;
    }
    if (c === TiMuList.length) {
        if (localStorage.getItem('cxaiSetting.sub') === 'true' && _cxaiDesktopSkipped === 0) {
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
        } else if (localStorage.getItem('cxaiSetting.sub') === 'true' && localStorage.getItem('cxaiSetting.force') === 'true') {
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
            cxai_logger(_cxaiDesktopSkipped > 0 ? '存在 ' + _cxaiDesktopSkipped + ' 道未答题目，自动保存！' : '测验处理完成，自动保存！', 'green')
            setTimeout(() => {
                $saveBtn.click()
                setTimeout(() => {
                    cxai_logger('保存成功，准备切换下一个任务。', 'green')
                    cxai_mlist.splice(0, 1)
                    _domList.splice(0, 1)
                    setTimeout(() => { cxai_startDoCyWork(index + 1, doms) }, 3000)
                }, 3000)
            }, 5000)
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
                if (_i === -1) {
                    _cxaiDesktopSkipped++;
                    cxai_logger('AI无法完美匹配正确答案,请手动选择，跳过', 'red')
                } else {
                    $(_answerTmpArr[_i]).parent().click();
                                }
                setTimeout(() => { cxai_startDoWork(index, doms, c + 1, TiMuList) }, cxaiCfg.time)
            });
            break;
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
            _question = cxai_buildPrompt({ type: '多选题', question: _question, options: mergedAnswers.split('|'), answer_format: "用'|'分割多个答案" }).catch(function(e){console.warn("[AI智脑Pro] Promise异常:",e.message)})
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
                cxaiClickOptions(_answerTmpArr, _matchedIndices,
                    function(idx) { $(_answerTmpArr[idx]).parent().click(); },
                    function(idx) { return ($(_answerTmpArr[idx]).parent().find('span').attr('class') || '').indexOf('check_answer_dx') !== -1; }
                );
                            let _onclickAttr = $(TiMuList[c]).find('.Zy_ulTop li:nth-child(1)').attr('onclick') || '';
                let id = _onclickAttr ? cxai_getStr(_onclickAttr, 'addcheck(', ');').replace('(', '').replace(')', '') : '';
                if (_matchedIndices.length === 0) {
                    _cxaiDesktopSkipped++;
                    cxai_logger('AI未能匹配任何选项，请手动选择', 'red')
                } else if (_a.length <= 0) {
                    _cxaiDesktopSkipped++;
                    cxai_logger('AI无法完美匹配正确答案,请手动选择，跳过', 'red')
                    // cxaiCfg.sub = 0
                } else {
                    $(TiMuList[c]).find('.Zy_ulTop').parent().find('#answer' + id).val(_a.join(""))
                }
                setTimeout(() => { cxai_startDoWork(index, doms, c + 1, TiMuList) }, cxaiCfg.time)
            });
            break;
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
            });
            break;
        }
        case 3: {
            _answerTmpArr = $(TiMuList[c]).find(".Zy_ulTop li").find("a");
            let _true = "正确|是|对|√|T|ri";
            $.each(_answerTmpArr, (i, t) => {
                _a.push(cxai_tidyStr($(t).html()));
            });
            cxai_getAnswer(_TimuType, _question).then((agrs) => {
                agrs = String(agrs)
                if (localStorage.getItem('cxaiSetting.alterTitle') === 'true') {
                    let timuele = $(TiMuList[c]).find('.Zy_TItle.clearfix > div')
                    timuele.html(timuele.html() + '<p style="color:green;">📖 ' + cxaiGetDisplayAnswer(agrs, _a) + '</p>')
                }
                let judgeResult = cxai_parseJudgeAnswer(agrs)
                if (judgeResult === null) {
                    _cxaiDesktopSkipped++;
                    cxai_logger("答案匹配出错，跳过", "red");
                    setTimeout(() => { cxai_startDoWork(index, doms, c + 1, TiMuList) }, cxaiCfg.time)
                    return
                }
                let _i = cxai_findJudgeOptionIndex(_a, judgeResult === 'true');
                if (_i === -1) {
                    _cxaiDesktopSkipped++;
                    cxai_logger("未匹配到正确答案，跳过", "red");
                } else {
                    $(_answerTmpArr[_i]).parent().click();
                                }
                setTimeout(() => {
                    cxai_startDoWork(index, doms, c + 1, TiMuList);
                }, cxaiCfg.time);
            });
        }
        case 4: {
            let _textareaLista = $(TiMuList[c]).find('.Zy_ulTk .XztiHover1')
            cxai_getAnswer(_TimuType, _question).then((agrs) => {
                if (agrs === '暂无答案') {
                    _cxaiDesktopSkipped++;
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
            });
            break;
    }
}


// 将核心函数暴露到 unsafeWindow / window / top，供划词搜题等独立模块调用
console.log('[AI智脑Pro] 准备暴露 cxai_getAnswer, typeof cxai_getAnswer:', typeof cxai_getAnswer);
try {
    if (typeof unsafeWindow !== 'undefined') {
        unsafeWindow.cxai_getAnswer = cxai_getAnswer;
        console.log('[AI智脑Pro] 已暴露到 unsafeWindow, typeof unsafeWindow.cxai_getAnswer:', typeof unsafeWindow.cxai_getAnswer);
    }
    if (typeof window !== 'undefined') {
        window.cxai_getAnswer = cxai_getAnswer;
        console.log('[AI智脑Pro] 已暴露到 window, typeof window.cxai_getAnswer:', typeof window.cxai_getAnswer);
    }
    if (typeof top !== 'undefined' && top !== window) {
        try { top.cxai_getAnswer = cxai_getAnswer; } catch(e) { console.log('[AI智脑Pro] 暴露到 top 失败:', e.message); }
        console.log('[AI智脑Pro] 已暴露到 top, typeof top.cxai_getAnswer:', typeof top.cxai_getAnswer);
    }
    // 额外暴露到 document.defaultView
    if (typeof document !== 'undefined' && document.defaultView && document.defaultView !== window) {
        try { document.defaultView.cxai_getAnswer = cxai_getAnswer; } catch(e) { console.log('[AI智脑Pro] 暴露到 document.defaultView 失败:', e.message); }
    }
} catch(e) {
    console.error('[AI智脑Pro] 暴露 cxai_getAnswer 失败:', e.message);
}


// 通用文字规范化（全角→半角、引号统一、句号替换、去末尾标点、合并空白）
// 与常见题库 formatString 对齐，提升题库匹配率

}
})();
} catch(e) { console.warn('[AI智脑Pro] 主脚本异常已捕获:', e.message); }

// ===== 自动更新检查（脚本顶层，独立于主 IIFE，不受崩溃影响） =====
var _CXAI_UPDATE_URL = 'https://raw.githubusercontent.com/Z-Fovik-RT/chaoxing-ai/main/chaoxing-ai.user.js';
var _CXAI_CUR_VER = (typeof GM_info !== 'undefined' && GM_info.script) ? GM_info.script.version : '1.2.7';
var _CXAI_CHECK_INTERVAL = 24 * 3600 * 1000; // 24小时

function _cxaiSemverCompare(a, b) {
    var pa = a.split('.'), pb = b.split('.');
    for (var i = 0; i < Math.max(pa.length, pb.length); i++) {
        var na = parseInt(pa[i] || '0', 10), nb = parseInt(pb[i] || '0', 10);
        if (na > nb) return 1;
        if (na < nb) return -1;
    }
    return 0;
}

function cxai_checkUpdate(force, onComplete) {
    // 用 localStorage 做跨 iframe/标签页共享锁（15秒，覆盖请求超时）
    var lockKey = 'cxaiSetting._updateLock';
    var now = Date.now();
    var lockTime = parseInt(localStorage.getItem(lockKey) || '0', 10);
    if (now - lockTime < 15000) {
        // 锁拦截：2秒内静默（说明上一个请求正在进行，等待即可）
        // 超过2秒才提示（可能上一个请求卡住了）
        if (now - lockTime > 2000) {
            if (typeof onComplete === 'function') onComplete(false, null, '正在检查中，请稍候');
        }
        return;
    }
    localStorage.setItem(lockKey, String(now));

    var last = parseInt(localStorage.getItem('cxaiSetting.lastUpdateCheck') || '0', 10);
    if (!force && (now - last) < _CXAI_CHECK_INTERVAL) {
        localStorage.removeItem(lockKey);
        return;
    }
    localStorage.setItem('cxaiSetting.lastUpdateCheck', String(now));

    function _releaseLock() { try { localStorage.removeItem(lockKey); } catch(e) {} }

    GM_xmlhttpRequest({
        method: 'GET',
        url: _CXAI_UPDATE_URL,
        timeout: 15000,
        onload: function(r) {
            try {
                if (r.status < 200 || r.status >= 300) {
                    if (typeof onComplete === 'function') onComplete(false, null, 'HTTP ' + r.status);
                    return;
                }
                var m = r.responseText.match(/\/\/ @version\s+(\S+)/);
                if (!m) {
                    if (typeof onComplete === 'function') onComplete(false, null, '无法解析版本');
                    return;
                }
                var remote = m[1];
                if (_cxaiSemverCompare(remote, _CXAI_CUR_VER) > 0) {
                    cxai_showUpdateDialog(remote);
                    if (typeof onComplete === 'function') onComplete(true, remote);
                } else {
                    if (typeof onComplete === 'function') onComplete(false, remote);
                }
            } finally {
                _releaseLock();
            }
        },
        onerror: function(err) {
            try {
                if (typeof onComplete === 'function') onComplete(false, null, '网络错误');
            } finally {
                _releaseLock();
            }
        },
        ontimeout: function() {
            try {
                if (typeof onComplete === 'function') onComplete(false, null, '请求超时');
            } finally {
                _releaseLock();
            }
        }
    });
}

function cxai_showUpdateDialog(remoteVer) {
    // 防重复弹窗：已有 Swal 在显示则跳过
    if (typeof Swal !== 'undefined' && Swal.isVisible()) return;
    if (typeof Swal === 'undefined') {
        // Swal 不可用时 fallback 到简单弹窗
        if (confirm('[AI智脑Pro] 发现新版本 ' + remoteVer + '（当前 ' + _CXAI_CUR_VER + '），是否前往更新？')) {
            GM_openInTab(_CXAI_UPDATE_URL, { active: true });
        }
        return;
    }
    Swal.fire({
        title: '发现新版本',
        html: '<div style="text-align:left;padding:0 8px;">' +
              '<p style="margin:4px 0;">当前版本：<b>' + _CXAI_CUR_VER + '</b></p>' +
              '<p style="margin:4px 0;">最新版本：<b style="color:#4CAF50;">' + remoteVer + '</b></p>' +
              '<p style="font-size:12px;color:#888;margin-top:8px;">建议更新以获取最新功能与修复</p>' +
              '</div>',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: '立即更新',
        cancelButtonText: '稍后提醒',
        confirmButtonColor: '#4CAF50',
        cancelButtonColor: '#aaa',
    }).then(function(res) {
        if (res.isConfirmed) {
            GM_openInTab(_CXAI_UPDATE_URL, { active: true });
        }
    });
}

// 暴露到 unsafeWindow / window，确保面板按钮 handler 能调用
try {
    if (typeof unsafeWindow !== 'undefined') {
        unsafeWindow.cxai_checkUpdate = cxai_checkUpdate;
        unsafeWindow._CXAI_CUR_VER = _CXAI_CUR_VER;
    }
    if (typeof window !== 'undefined') {
        window.cxai_checkUpdate = cxai_checkUpdate;
        window._CXAI_CUR_VER = _CXAI_CUR_VER;
    }
} catch(e) {}

// 仅在顶层窗口自动检查更新
try {
    var _isTopForUpdate = (typeof top === 'undefined') || (top === window);
    if (_isTopForUpdate) cxai_checkUpdate(false);
} catch(e) {}

GM_registerMenuCommand("检查更新", function() {
    var _curVer = (typeof unsafeWindow !== 'undefined' && unsafeWindow._CXAI_CUR_VER)
                || (typeof window !== 'undefined' && window._CXAI_CUR_VER)
                || '未知';
    cxai_checkUpdate(true, function(hasUpdate, remoteVer, errMsg) {
        if (hasUpdate) return; // cxai_showUpdateDialog 已弹出
        if (typeof Swal !== 'undefined' && Swal.isVisible()) return; // 防重复
        if (errMsg) {
            if (typeof Swal !== 'undefined') {
                Swal.fire({ title: '检查更新失败', text: errMsg + '（GitHub 在国内访问不稳定）', icon: 'error', confirmButtonText: '好的', confirmButtonColor: '#e74c3c' });
            } else {
                alert('检查更新失败：' + errMsg);
            }
        } else {
            if (typeof Swal !== 'undefined') {
                Swal.fire({ title: '已是最新版本', text: '当前版本 ' + _curVer + '（最新 ' + remoteVer + '）', icon: 'success', confirmButtonText: '好的', confirmButtonColor: '#4CAF50' });
            } else {
                alert('已是最新版本 v' + _curVer);
            }
        }
    });
});


// AI 智脑 Pro x 划词搜题 + 截图搜题（独立模块）
// =============================================
try { (function() {
    "use strict";
    var _isTop2 = (typeof top === 'undefined') || (top === window);
    // 划词搜题模块：持续尝试从主脚本获取并暴露 cxai_getAnswer
    try {
        var _exposeTimer = setInterval(function() {
            try {
                var _src = (typeof unsafeWindow !== 'undefined' && unsafeWindow.cxai_getAnswer)
                        || (typeof window !== 'undefined' && window.cxai_getAnswer)
                        || (typeof top !== 'undefined' && top.cxai_getAnswer);
                if (_src) {
                    clearInterval(_exposeTimer);
                    if (_isTop2 && !window._cxaiHuaciLogDone) {
                        window._cxaiHuaciLogDone = true;
                        console.log('[AI智脑Pro] 划词搜题模块：已获取到 cxai_getAnswer，type:', typeof _src);
                    }
                }
            } catch (e) {
                // 跨域时可能抛错，忽略后重试
            }
        }, 500);
        // 10秒后停止重试，避免无效定时器
        setTimeout(function() { clearInterval(_exposeTimer); }, 10000);
    } catch (e) {
        console.warn('[AI智脑Pro] 划词搜题模块：启动 cxai_getAnswer 获取定时器失败:', e.message);
    }
    const KEY = "hc3_config";
    const TH_VERSION = "3.0.3";
    const DEFAULTS = {
        auto_search: false,
        cut_search: true,
        remove_limit: true,
        fixed_modal: true,
        out_iframe: true,
        auto_close: true
    };
    function load() {
        let saved = {};
        try {
            saved = JSON.parse(GM_getValue(KEY) || "{}");
        } catch (e) { console.warn("[AI智脑Pro] 异常:", e && e.message || 'error'); }
        const old = GM_getValue("defaultConfig");
        if (old !== undefined) {
            try {
                saved = Object.assign({}, JSON.parse(old), saved);
            } catch (e) { console.warn("[AI智脑Pro] 异常:", e && e.message || 'error'); }
            GM_deleteValue("defaultConfig");
        }
        const cfg = {};
        for (const k in DEFAULTS) { if (!DEFAULTS.hasOwnProperty(k)) continue; cfg[k] = typeof saved[k] === "boolean" ? saved[k] : DEFAULTS[k]; }
        return cfg;
    }
    const config = load();
    GM_setValue(KEY, JSON.stringify(config));
    function setConfig(key, value, persist) {
        config[key] = value;
        if (persist !== false) GM_setValue(KEY, JSON.stringify(config));
    }
    const POS_KEY = "hc3_lock_pos";
    const lockPos = {
        get() {
            try {
                return JSON.parse(GM_getValue(POS_KEY) || "null");
            } catch (e) {
                return null;
            }
        },
        set(p) {
            GM_setValue(POS_KEY, JSON.stringify(p));
        },
        clear() {
            GM_deleteValue(POS_KEY);
        }
    };
    const auth = {
        token() {
            return typeof GM_getValue("token") === "string" ? GM_getValue("token") : "";
        },
        name() {
            return GM_getValue("id") || "";
        },
        uid() {
            return GM_getValue("uid") || "";
        },
        save(token, name, uid) {
            GM_setValue("token", token);
            GM_setValue("id", name || "");
            if (uid !== undefined) GM_setValue("uid", uid || "");
        },
        clear() {
            GM_setValue("token", "");
            GM_setValue("id", "");
            GM_setValue("uid", "");
        }
    };
    const BASE = "https://platform.itihey.com";
    function NeedLoginError() {
        this.name = "NeedLoginError";
        this.message = "请先登录";
    }
    NeedLoginError.prototype = Object.create(Error.prototype);
    function request(opt) {
        return new Promise(function(resolve, reject) {
            const headers = {
                "Content-Type": "application/json;charset=utf-8",
                Version: TH_VERSION
            };
            const token = auth.token();
            if (token) headers["Authorization"] = "Bearer " + token;
            GM_xmlhttpRequest({
                method: opt.method || "GET",
                url: opt.url,
                headers: headers,
                data: opt.body === undefined ? undefined : JSON.stringify(opt.body),
                timeout: 15e3,
                onload(r) {
                    if (r.status === 401) return reject(new NeedLoginError());
                    let data = null;
                    try {
                        data = JSON.parse(r.responseText);
                    } catch (e) { console.warn("[AI智脑Pro] 异常:", e && e.message || 'error'); }
                    if (r.status >= 400 || data === null) return reject(new Error("请求失败(" + r.status + ")，请稍后重试"));
                    resolve(data);
                },
                onerror() {
                    reject(new Error("网络错误，请稍后重试"));
                },
                ontimeout() {
                    reject(new Error("请求超时，请稍后重试"));
                }
            });
        });
    }
    const api = {
        queryAnswer(word) {
            return request({
                method: "POST",
                url: BASE + "/consumer/ws/huaci",
                body: {
                    word: word
                }
            });
        },
        getPayUrl(checkIndex) {
            return request({
                url: BASE + "/consumer/ws/pay?checkIndex=" + checkIndex + "&source=script"
            });
        },
        unlockLimit() {
            return request({
                method: "POST",
                url: BASE + "/consumer/ws/unlock"
            });
        },
        loginQR() {
            return request({
                url: BASE + "/consumer/wechat/qrcode"
            });
        },
        loginCheck(id) {
            return request({
                url: BASE + "/consumer/wechat/check?id=" + encodeURIComponent(id)
            });
        },
        profile() {
            return request({
                url: BASE + "/consumer/profile"
            });
        },
        payStatus(orderNo) {
            return request({
                url: BASE + "/consumer/pay/status?order_no=" + encodeURIComponent(orderNo)
            });
        }
    };
    function ocrBase64(base64) {
        return new Promise(function(resolve, reject) {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://appwk.baidu.com/naapi/api/totxt",
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                },
                responseType: "json",
                data: "image=" + encodeURIComponent(base64),
                onload(r) {
                    try {
                        resolve(r.response.words_result.map(function(i) {
                            return i.words;
                        }).join(""));
                    } catch (e) {
                        resolve("");
                    }
                },
                onerror() {
                    reject(new Error("OCR 请求失败"));
                },
                ontimeout() {
                    reject(new Error("OCR 请求超时"));
                }
            });
        });
    }
    const PANEL_CSS = `
:host { all: initial; }
* { box-sizing: border-box; margin: 0; padding: 0;
    font-family: -apple-system,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif; }
.panel { width: 400px; background: #fff; border: 1px solid #e3e6f0; border-radius: 12px;
    box-shadow: 0 16px 100px rgba(0,0,0,.2), 0 4px 16px rgba(0,0,0,.08); overflow: hidden;
    font-size: 14px; color: #333;
    transform: scale(.92); opacity: 0;
    transition: transform .12s ease-out, opacity .12s ease-out; }
.panel.in { transform: scale(1); opacity: 1; }
.hd { display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: #f6f8fa;
    border-bottom: 1px solid #eef0f4; cursor: move; user-select: none; font-size: 13px; color: #586069; }
.hd .logo { width: 18px; height: 18px; border-radius: 50%; flex: none; }
.hd .title { font-weight: 600; color: #527aef; cursor: pointer; }
.hd .sp { flex: 1; }
.hd button { all: unset; cursor: pointer; padding: 2px 8px; border-radius: 4px; font-size: 13px; color: #586069; }
.hd button:hover { background: rgba(27,31,35,.08); }
.hd .lock { padding: 3px 6px; opacity: .35; }
.hd .lock:hover { opacity: .7; }
.hd .lock svg { width: 14px; height: 14px; display: block; fill: currentColor; }
.hd .lock .i-on { display: none; }
.hd .lock.on { opacity: 1; color: #527aef; }
.hd .lock.on .i-on { display: block; }
.hd .lock.on .i-off { display: none; }
.hd .close { font-size: 16px; line-height: 1; }
.bd { max-height: 480px; overflow-y: auto; padding: 14px 15px; background: #fff; }
.bd::-webkit-scrollbar { width: 6px; }
.bd::-webkit-scrollbar-thumb { background: #d8dce6; border-radius: 3px; }
.bd::-webkit-scrollbar-thumb:hover { background: #c2c8d6; }

/* 搜索区：v2 原版布局——灰底圆角输入框 + 整宽蓝色按钮 */
.searchbar { margin-bottom: 12px; }
.searchbar textarea { display: block; width: 100%; resize: vertical; min-height: 76px; max-height: 160px;
    padding: 8px 10px; border: 1px solid transparent; border-radius: 10px; outline: none;
    font-size: 14px; line-height: 1.6; color: #333; background: #f5f6fa;
    transition: border-color .15s, box-shadow .15s; }
.searchbar textarea:focus { border-color: #527aef; box-shadow: 0 0 0 2px rgba(82,122,239,.15); background: #fff; }
.searchbar .btn { margin-top: 8px; width: 100%; }
.btn { all: unset; display: block; cursor: pointer; padding: 8px 0; border-radius: 8px;
    font-size: 15px; background: #527aef; color: #f0f8ff; text-align: center;
    transition: background .12s; }
.btn:hover { background: #4169e0; }
.btn:active { background: rgba(56,97,214,.9); }
.btn.ghost { background: #fff; color: #527aef; border: 1px solid #527aef; }
.btn.ghost:hover { background: #f0f4fe; }
.btn.block { margin: 8px auto 0; width: auto; min-width: 160px; padding: 8px 18px; }

/* 结果卡片：v2 原版「题目一」标题 + 蓝色渐变下划线条 */
.item { background: #fff; border: 1px solid #f0f1f5; border-radius: 10px;
    padding: 12px 14px 4px; margin-bottom: 12px;
    transition: box-shadow .15s, border-color .15s; }
.item:hover { border-color: #dfe6fa; box-shadow: 0 4px 14px rgba(82,122,239,.08); }
.item .ttl-row { display: flex; align-items: baseline; gap: 8px; }
.item .ttl { color: #222; font-size: 16px; font-weight: 600; line-height: 22px; white-space: nowrap; }
.item .ttl .bar { display: block; margin-top: -7px; width: 24px; height: 6px; border-radius: 3px;
    background: linear-gradient(90deg, rgba(82,122,239,0) 0%, #527aef 100%); }
.item .badge { font-size: 11px; color: #527aef; background: #eef2fe;
    border-radius: 3px; padding: 1px 6px; white-space: nowrap; }
.item .q { margin: 10px 1px 0; font-size: 14px; line-height: 1.6; color: #666;
    white-space: pre-wrap; word-wrap: break-word; }
.item .opt { margin: 4px 1px 0; font-size: 14px; line-height: 1.6; color: #666; }
.item .opt.hit { color: #527aef; font-weight: 600; }
.item .ans-hd { display: flex; align-items: center; gap: 5px; margin-top: 10px;
    padding: 10px 1px 8px; color: #222; font-size: 14px; font-weight: 500;
    border-top: 1px solid #f5f5f5; }
.item .ans-hd svg { width: 14px; height: 14px; flex: none; }
.item .ans { margin: 0 1px 12px; padding: 10px 14px; font-size: 14px; line-height: 1.6;
    color: #666; background: #f5f6fa; border-radius: 6px;
    white-space: pre-wrap; word-wrap: break-word; }
.item .ans b { color: #527aef; font-weight: 600; }
.empty { text-align: center; color: #9ca3af; padding: 34px 0 30px; font-size: 13px; line-height: 2; }

/* 居中提示/二维码/加载 */
.center { text-align: center; padding: 14px 6px; }
.center .tip { font-size: 13px; color: #586069; line-height: 1.8; margin-bottom: 8px; }
.center .qr { width: 190px; height: 190px; border: 1px solid #eef0f4; border-radius: 8px; }
.center .sub { font-size: 12px; color: #9ca3af; margin-top: 6px; }
.center .amount { font-size: 20px; font-weight: 700; color: #527aef; margin: 4px 0; }
.spin { display: inline-block; width: 18px; height: 18px; border-radius: 50%; margin: 24px auto;
    border: 2px solid #527aef; border-color: #527aef transparent #527aef transparent;
    animation: hcspin 1.2s linear infinite; }
@keyframes hcspin { to { transform: rotate(360deg); } }

/* 套餐 */
.plans { display: flex; gap: 8px; margin-top: 10px; }
.plan { flex: 1; border: 1px solid #e3e6f0; border-radius: 8px; padding: 10px 4px; cursor: pointer;
    text-align: center; transition: border-color .12s, background .12s, box-shadow .12s; }
.plan:hover { border-color: #527aef; background: #f0f4fe; box-shadow: 0 2px 8px rgba(82,122,239,.12); }
.plan .nm { font-size: 12px; color: #586069; }
.plan .pr { font-size: 17px; font-weight: 700; color: #527aef; margin-top: 2px; }

/* 设置 */
.setting-row { display: flex; align-items: flex-start; gap: 8px; padding: 9px 2px; border-bottom: 1px solid #f3f4f8; cursor: pointer; }
.setting-row:last-child { border-bottom: none; }
.setting-row input { margin-top: 3px; accent-color: #527aef; }
.setting-row .nm { font-size: 13px; color: #24292e; }
.setting-row .desc { font-size: 12px; color: #9ca3af; line-height: 1.5; margin-top: 2px; }
.setting-row .desc em { color: #d73a49; font-style: normal; }
.account-row { display: flex; align-items: center; justify-content: space-between;
    margin-top: 8px; padding: 12px 2px 4px; border-top: 1px solid #f3f4f8;
    font-size: 13px; color: #24292e; }
.account-row .uid { color: #9ca3af; font-size: 12px; margin-left: 8px; user-select: text; }
.link-btn { all: unset; cursor: pointer; font-size: 13px; color: #527aef; padding: 2px 6px; border-radius: 4px; }
.link-btn:hover { background: #f0f4fe; }

/* ===== 暗色主题 ===== */
:host([data-theme="dark"]) .panel, .panel.dark { background: #1a1b2e; border-color: #2a2d42; color: #e2e8f0; }
:host([data-theme="dark"]) .hd, .panel.dark .hd { background: #151628; border-bottom-color: #2a2d42; color: #94a3b8; }
:host([data-theme="dark"]) .hd .title, .panel.dark .hd .title { color: #818cf8; }
:host([data-theme="dark"]) .hd button, .panel.dark .hd button { color: #94a3b8; }
:host([data-theme="dark"]) .hd button:hover, .panel.dark .hd button:hover { background: rgba(255,255,255,.06); }
:host([data-theme="dark"]) .bd, .panel.dark .bd { background: #1a1b2e; color: #e2e8f0; }
:host([data-theme="dark"]) .bd::-webkit-scrollbar-thumb, .panel.dark .bd::-webkit-scrollbar-thumb { background: #3a3d52; }
:host([data-theme="dark"]) .searchbar textarea, .panel.dark .searchbar textarea { background: #232540; color: #e2e8f0; border-color: #2a2d42; }
:host([data-theme="dark"]) .searchbar textarea:focus, .panel.dark .searchbar textarea:focus { border-color: #818cf8; background: #1f2138; }
:host([data-theme="dark"]) .item, .panel.dark .item { background: #1f2138; border-color: #2a2d42; }
:host([data-theme="dark"]) .item:hover, .panel.dark .item:hover { border-color: #3a3d52; box-shadow: 0 4px 14px rgba(129,140,248,.08); }
:host([data-theme="dark"]) .item .ttl, .panel.dark .item .ttl { color: #e2e8f0; }
:host([data-theme="dark"]) .item .q, .panel.dark .item .q, :host([data-theme="dark"]) .item .opt, .panel.dark .item .opt { color: #94a3b8; }
:host([data-theme="dark"]) .item .opt.hit, .panel.dark .item .opt.hit { color: #818cf8; }
:host([data-theme="dark"]) .item .ans-hd, .panel.dark .item .ans-hd { color: #e2e8f0; border-top-color: #2a2d42; }
:host([data-theme="dark"]) .item .ans, .panel.dark .item .ans { background: #232540; color: #94a3b8; }
:host([data-theme="dark"]) .item .ans b, .panel.dark .item .ans b { color: #818cf8; }
:host([data-theme="dark"]) .item .badge, .panel.dark .item .badge { color: #818cf8; background: rgba(129,140,248,.12); }
:host([data-theme="dark"]) .empty, .panel.dark .empty { color: #64748b; }
:host([data-theme="dark"]) .center .tip, .panel.dark .center .tip { color: #94a3b8; }
:host([data-theme="dark"]) .center .qr, .panel.dark .center .qr { border-color: #2a2d42; }
:host([data-theme="dark"]) .center .amount, .panel.dark .center .amount { color: #818cf8; }
:host([data-theme="dark"]) .spin, .panel.dark .spin { border-color: #818cf8 transparent #818cf8 transparent; }
:host([data-theme="dark"]) .setting-row, .panel.dark .setting-row { border-bottom-color: #2a2d42; }
:host([data-theme="dark"]) .setting-row .nm, .panel.dark .setting-row .nm { color: #e2e8f0; }
:host([data-theme="dark"]) .setting-row .desc, .panel.dark .setting-row .desc { color: #64748b; }
:host([data-theme="dark"]) .account-row, .panel.dark .account-row { border-top-color: #2a2d42; color: #e2e8f0; }
:host([data-theme="dark"]) .account-row .uid, .panel.dark .account-row .uid { color: #64748b; }
:host([data-theme="dark"]) .link-btn, .panel.dark .link-btn { color: #818cf8; }
:host([data-theme="dark"]) .link-btn:hover, .panel.dark .link-btn:hover { background: rgba(129,140,248,.1); }
`;
    const LOGO = "data:image/webp;base64,UklGRp4+AABXRUJQVlA4WAoAAAAQAAAA/wMA/wMAQUxQSFIWAAABHMVt2zjS/nOnXnlHxATwkeqM6RaLYJHGOXJM0TzHHo7hesavMjtni1NWsVqr0qsCyGd6w////Nv+/+6vpIhZZrWypranzGYxo+Zc29a22u3xrjLXdpvaDKugXONXXq/72bc6XO8nnhExAdRua1vmNPcYMXSI4+4WVnH3JDjUi7u7u7tbvUXq7u7eFHcnwYnLJITMzP0T7uvqp4iYAHH87/jf8b/jf8f/jv8d/zv+d/zv+N/xv+N/x/+O/x3/O/53/O/43/G/43/H/47/Hf87/nf87/jf8b/jf8f/jv8dAZeOafNGx76jJkyftXD56l82bN8bf/J8wrWM+7mqufczriWcPxm/d9uGX1YvXzBr+oRhfT97vU3NUuYrqu6T73QdOHXp+gMJ9/R/9O6V/euWTBnQ5a0napc1VMWqP9t57MqD6fr/1ntz/4rRHWOrFDFMFZ/4ZPiyPdf0/37qrsVDP2xTzhTVfKPfvK0J+tC9tGn2169UNz7BzT8e9/MFtz7U886sHfV+Y3+DE/jEN2tS9E/k5RV9WhQ3M0Ubd1t0xqN/Qt3HZn9Wx8e61Hh/xsE8/VObtWvi2xWMSslXRm66o3+S034d9EyILan+6eIE/bPtPTOrQxkT4qjXc/VN/dOeuPiz6raj4fTP8vRPf+bqzlE2o+Izr91UM16c+WqQsei19Ziac++wllYictSH+WrUjMVvBZqHpkv+Dqhp8zf3Km8Yeuy+rSY+M6qxRXD1fDFdDZ04vrEtcPd5JUPNnTyxmRlIfjlXjX5jcgv+uZNez1bTp05uTj530uvZCsDUyc2g1+3lXIXhjQnRuItccFnBuO9jf9A5Ez8sUUDe/6EO5CqtSFVYHukShDfXgC8CCs2s+U3RVmXNbQXoie7BUHMN/iqgIM1e2Bxo8WsfKFTP9fBnWYd3SxSu9yaXx1ipEUcVs56fn0RY9Or7CtxTHYvTq94hRe+tERHk6vhZUAGcPb0Ctfr/rih2L40BlnvEGUWy99fmtJqSpnDe9TSoPBPTFNK7n4SUZ0KqwnpPK0B5xt9QaG9vTadRaQrvjY3J1P+MQnxNVSq1+l1R7p5Vmkh1P1KkZ40IplHMS34Fe0avoiQqs65QAZ/QFkPuaQ8U9IdbMmjoZQX+LzX40ypFsV84uyR7ar6n+M8e5Med8I3FSsGkN6jz3G2l4c5o4jT8W5nonhJMG+/zASVj+icu1IzLUkIerMOZ+n8pJ93j/RkTsqZYaZn8DGG6XFVq/qsUXSIPKjvvdnSh5ZlMJejuSlyJ/EQ5mt3LBZWnMpSmeysSJfITZWpWd548ka5k3VGOJd73lK/ZXUjS54FSdkNpipR5XVl7pwNDOt9W4sZF8CNsb1Cpm/4yPVpfVfouCyaHc5lfCZzUkBuxvymHC752QSMpS2m8vRQxQvYqkzOf4UXdM8pl74SisBihfI5/hBSlXlRG347lRJVjymnPYBckuucorbeEEMKxMqDETqnNh7LfKbfzOtChcarSe04xNDz9UAl+pAwX3PuV4xmtqRDzj7Lc3ZsJjz1Qoq/0A8IU5frpSjh4Udme0YgFIZ8p33OfJ0H5/5Txnq4cqHFVST+WAglZSvvVRRCQXKTE3xkCgDkBpf7F8uzzmavsz0zgXuB25X/RIOZFnVUCBhfwrmGaQvCgk3Qv5SoGf4yg3CdeBeFJL+G6KgsvxdFtqNIwtQrZpioPb9em2gIlYkYTnrmWKxNzE2j2k1LR14ljRX5XLhZ2ZlixzUrGhz345bdD2fgoiV2B+5SOJQO5FRyvfPQ/yayw40rI4JO8CjmpjAw8warAI0pJ/wBO+R9QTpYkMqr4LiVlcXc+Fd2irCzqyCbfdUpLX2syrVZe5iVQaaUSM7shkeYqM+/XoNEopWZaHIl6KDcveinUUcl5ojSB2nrRoX+E0OdlpefX7GmSiw99mztV7ipA1zInIkUROpw3AceUof5E1vhsU4oWtiDNMuVoelXKDFGSXq5AmLbK0j9L0aVNAUz0fbZUva84XceVyGQF6kim+B1Vovo7EWWdMjW3Pk3GKVVveEnyhnL1FwdForPBohsYEnhF0ZpEkN+Vrfk16fGt0vV8GDnaePCiH3Cj7G0F7AxmFDmqhPW3JsYcZez9KFp0UMr+5SRFgzzM6G5OhF9X0A5ihGuXktbXmBDjlLWpZenwstL2MzZE3cWNTueCK155W9yICiOVuBfDidDSixw9yIOINIXu0zTYrtQtqE6Cr5S7xzlQOx88uoEBRS8oeQMJBBiv7L0SAr9mXvjoAfQFpCp+O4NvrvL3ThnoPaMEfgt5oTcRpIOAt1gZnFEWdk8phV9Hnd81DGlH0E1VDl8PhVw9L4h0O+J8zyqJg80BN0RZfMYFt5pK4yVwO4Sjh3XB1lN5/CfWoh4AScdDbasSOT8GaO2VyR/gLOQ2lLQ/zBYrle9GgOxx5fJukJ0Hk78BxLopmX9GWOhdNOlAgM1QNt9wwyu6EE66EF57lc6+SHC9pnx+DVyJgNIEaH2phP4DWWH3EaUDgDVVGX3RCasKBZDSKbBaq5TOLAOqZsrpDaA6BqqieEi1U1IfRpRPEqq0MaB6KKu/xFNAOqy0PZwGKa1T0BSehSvtD6bJyusLDihFFQBLR0BpkRL7phtIVT3I0slAWqLMvuOCUXkPtHQ8jBYqtW+4QFTejS0dA6L5yu0bLgiVd4NLR0BojpL7kgNAjyi7nwHQNHidxk9oDrw0GT7Dld6/ocfvLr60JXi+VH5/hh3fGwAL1oHOZ0rww9C5hLCSOOC8pgzfDpztEMsNg82jSvGpsJmPsSuoCc/DmCaCZoBy/GvM+KaBLFgTMu2V5Psgsx9lvjKAqaksnw6YeTC7jJfgPJhpZ7j0Vpq/DZcrOCvxguUJ5fkisKwCWipWwt1A0ySoDFCifwqVZKQFIoHylDJ9EVBWQO0aTkLyoKadYNJDqX4QJqewVhQOkobK9fEg+R5s/4DkDti0PkReV7KvgchqtKUhJDAXbdoaIB8p23cBZBPc7uGjZCHctAc8eindX4XHQbzlucFRUfk+ABxfAO4gOPYALtcJjXAv4LQ7NLoo4fdBYyPi7iAjqBBx2hoY7yvjNwIjDnLXgZENOW0Ii1eU8gthMQ9zf8LiFuaCFUHRVDk/EhSjQPchKE6BzueBRBklfR9I9ELdfkhsRt0tRBTLQ53WB8SzyvppgJgEu88AcQp2BS44lFDad4TDB7hbDYdluPsLDhm4C4aDoY7yfhAYegNvFxjWAO84GG4DL1AaCtFK/CQodELeBigsQ97vULiJvJIQIFRU5ncGwgfQWwaEWdD7CggnoZeDAz8P9LQeDJ5Q6g+HQV/s7YPBT9g7CoNM7AXcIKig3G8Pgrbgmw2CSeB7GwQ7wXcFBDng0zAIVFXyd4TA2+ibDoHR6HsNAuvRdwIC6egLuAFQVtnfAgAvwm80APrDbxcAVsDvBwCchN89+7ny4ade80Ur/Tua7y38dTXfEPzNNN9q/G0331n8pZtP+e81Xg0D0NZ4LxqAYcbrZQBWGm+6AThsvHUG4C/jXTAAD4xXaAA01HSV1AI2N12sCRhqus4mYL7pRpuAvaZbagI+Md1OE3DMdAkmIN10bhOgLsOVURtY13BNjUB3w71lBEYa7gsjsMxwE43AAcMtMwIfGm6zEfjdcCeMwCXD3TACOYbzGgH1mC1SrWBls9U0Awlme8IM9DFbWzMw3Gw9zMBssw0yA2vMNtkM7DXbQjNwxGw/mYEvzLbDDPxhthNm4KzZUszAHbP9YQYKzaZ20GG0MEMQabQoQ1DFaNUMQT2j1TUEzY3W3BC0M9pThqCH0V42BP2M1tYQPGm0jw3BSKN1NwSTjdbDECww2meGYJPR3jMELxrtLUPwntFeMgTfGy3WEBw1WitDcN1ojQxBjtFqGQJ12KyqJfDarLwlqGKzKEsQZ7PSliDaZpGWwGuzMEtQ1mbBliDCZgGWIMRmxS2B22a+lkCMbgj8ViuwA4VWu2cHMqx20w6kWS3BDlyw2mk7cMxq8Xbgd6vttAPfWm2DHfjYanF24E2rLbMDL1ttlh3YbrWxdmC51fragelW62IHhlmtnR3oZ7Xn7EAHqzWzA42tFm0HKluttB2IsJrLDATF7A+swF27JViBE3bbbwW+sdvPVuCQ3eZYgS12G2EF5tqtpxUYZrd3rEAvuz1uBZrZLdoKxNjN3wiUiOHv2YDrljtlA36x3DobcMRys23AessNtAGTLPehDUi23JM2oKnlqtmA8pYTE1Agpr9qAY7bbqcFeM92CyzARtv1twBjbdfWAnSxXSMLUNl2oQbgoRj/Fv/OWu8Q/z6x3jL+bbbeAP6Ntt7r/GtjvWj+hVvPp5B+N8X8p+n3jf1W0W+7/YbSb6z93qFfO/vVpl+4/VwF7EsTAB5l3ycIWMC+FQjoyb7+CGjFvioI8EdfjkDwIvm+xcBK8m3CQF/yPYWBZ8hXBwMh4MsVEF7g3lcoWMK9lSjozr0+KGjEvTIocBVQ76LAcB/1DuFgMvUm46At9RJwUBZ6+Q4cyBXmfSVAXMC8hUj4kHltkFAWeUUuJEgS8b4RKC4m3iIsfEK8dlioArwiFxYklXdfCxjn824uGtrxrikaQr20eyBwPEq7w3gYS7theHiKdpF4KJbHulMCyI2s24qIL1nXCxHRqPN5ECFXSPeRQHI66cZi4lnSVcREsSzO/Seg/Ilzq1DRkXOPoaIE5tIFlkcp9wouBlGuLy5qQC7Pgws5y7gjAszhjBuIjLqIK/QgQ5II97ZAcyzhhmKjEeAKQ7EhSXx7V8A5lm9D0FEXb/ludMgZur0m8BxAtx74KAe3+wLQ/WzbiZBebGuFkFKFZLsqEN1AthUYeY9sVTFSPItrvwpI53FtFEpaYe1hOEokkWoHBaYDqdYFJ2W9TLshQN3CtBVI6cC0akgpdp9oXwtUJxFtAFbKe3l2z4EV2cyzpQLWN3BWEo0W102avStwHUazrngp7WHZFQFsHMumIeYJlPnCECNnSbZLIPsZyII1MFPsNsc+FdCO4Vh31JTyUOycwHYlxcbhpiXEMkvhRg4xbK0A9w2EFVdEjlwk2F6B7icAK4nFju91fh0W8H6Br2Bt9PjdodenAt/h9GqBn/Bsdv0kAJ7Erh4Iiswh118C4Wnk6o2hMvncOiYg/o5biSgqk0+tYwLjWdTqi6MKbmYdEyDPYlYykkrlEuuoQHkcsdpiKeQerz4VMPfDVaAOmoqn0eqgwLkLrB7F48knkVU7BdDvoKowElFylFQLBdItQHW7FKYkjlPPCqgrFlLqmMB6GqVa4yr8PqM+FmB/jSh/LWRJCqF2C7RfB1R2OWzJVj6NEXBXLqBTisB7LJyCjfHlf4NNzwvA26IpuxzCZC+ZxgvEo8H0r4B8HJaCjVDml0qlXQLz56F0NwJnspZJQwTopf8g0tcC9T5AKqyENZ9TPJovYG+Mo5MC94kwCjTFW9HLLFongG/iJdE5D+JkCogCTQXyfpc5tF5A38RLoXMe1Ml0CAWaCuz9rzBonQC/oYdAp1zIk7EAKq4r0Pc9yZ95Av7ofPocEPj3hU9WOfzJPvZ0FAKWzyLPN0LBT8GTGc0BWYudYBchYVAidTYIDeu7mfOviwfyDXLy4oWJW4jTX6gYmcmb/ULGWNycCWWDDIeNr5bQ0bWdNUOEkBFppNkrlGzp4cxJNyekP2ayqworN1Cmp9Ay9BpjNgkxGyHmR6Hmx4BJq8ANmY6XwkZCTp9ddBkg9AxPYcs6IWjtbLJ8KRR9AywXIjgiY7CSV0dY+gtU/J2Epn5nmTJViFougyivClUbF/DkZydX5D2cXC8jbB0Pk9zawtdfWdJDCOt3lCTPCmUjkzmyXEhbNZMih4W2DXIY8pWTN/KChyDHQoS5nQCS6hXujsFHem1h7yJ45DcR+rrWosPXWgjs+xs4ijsKhYvuwIY/UUjsHw+N4BNC49AzzBgrRC51iRizhcplUnmxQshc6QYttgidq2WwYo8Q+tHbpHhRKF3nHicOCakbPqDE2w5WSYssRrwtxG58nxBvOZkl9e7w4aCQOyaTDi8KvWuksWGPELxyGhm2CMUrXeXCSiF5mfNUmCg0Dz2EBP9QIbrfJiAUdReq+/4LBzkthe0zYXCzrvC9PwouxAjj3/VwIKWscP75XAp8GSKsb3SbAa84hPdVkgmwVKhf4gz9Cp8R8gf9TL7sWOH/69TLaCj/B1wY5N3pssLARB/r1vkLBRvd5tx4l3Aw6hjh3O8KCkM+ptutFkLDNWQ7U0l4OLSIaesChYjNb/NsrEuYGHWMZLlvCxZD3qXY9fpCxoVBfh0rKWxMymbXLD+hY+xf1HrwjgDStS7IqxMVhZFd0lk1s6hQMvo3St17UUi5jFAHygsrW98hk2e0r9Cy/OdUutFKiDmxiEe/hwkzG14gUV5vwWbo8xS6ECPkHJTNnx/8hJ2xv5Enu6/g07nwEXN+iRGCJlyhTcG3LmFo+KukSagtHB2cxZjZAULSyLfpktBaaNrzJlXc44oLTyN2B3hyvLYwteU5kmR96SNYXUqRzRWErLV/pUdae6HriAxqeOeGCl8jDxHjXDNhbJerpMgdWFQwu44S26oKaWt8T4fkd4S2yVeokDPcT3jrWVTAg7hywty4N0lw/jHhbqezBLj/haDXOT4dfIWzIoS+5XaUIG9vjBC49vewS3pLKJx8CXJZA4sLiKc9wNv3ZYXFYXMeQM09v4LwOHxhJswKl1QWJpddngMxz4pqwuXyqwvwtSpa2Oxdlw8t75oY4bN3Qz6svHExwujITQWQ8v5YRzgdtdWHp7i6wuryy9OhVLC4mvA6bFoqjB5MiRJmu4edgVDG4FABd7/f4JPURejd5FAxcra95hKAR664B5qcedFCcc+wFMCk9gsTlLd/Ayx7OgjPY1ffh0nOghhheqlhKRBJ7hsmYG/9xiN0bH/TR+Aeu/gSMDIm1RTEJ+y8D4nsFc/5CObdye8UgcGz7eNAgX2ZCb8B4dKAKEF+lcXnIXBzSkMBf8ud942Xtew5H6F/4js+u23s4C8m0NNrT6rBbi19O1AsYdOl/wYtdX5CGx+xh1ETPiu00c6vK4tZDEl+/pZx7qxoHyLWscXylKBVzk98zFdsZMyot9LN8cevvauKqXQ0n/dtkRnce4e18hWT2XPzUQOc++6VILGcFdvNS/4Tl7bi4yixoNW6xt35E5a1/ss6YkmbfrHi8p+o1LXfthGLGvrs4N/S//Tc2TTylUgxrZVeG/FL8p+U6xtGd4gRIxvcpue8+Jw/EfnHF38ZGybm1ufRdqN/v/rQu7txwnt1fMXyhj7ZZ+HBjIfS7filX8WGixUOqPVyryk/nbj/UHhw+tfpn79WN0hscmjN2A/6zli7Pzn//05B6oG4mf0/eiYmTKx0yXovfDZ41i+Hrxf+TxVeP/Lr7CEdX6xfyiWGOzgquvGTr77X5ethU+atXLfr2OW07H9TdtrlY7vXrZw3Zdg3Xd979cnG0VHB4vjf8b/jf8f/jv8d/zv+d/zv+N/xv+N/x/+O/x3/O/53/O/43/G/43/H/47/Hf87/nf87/jf8b/jf8f/jv8d/zv/BVZQOCAmKAAA0GUBnQEqAAQABD6RSKFMJaQjIiIyaDiwEglnbvx+nB5AeccbV0d/APaUXeCT/hf65/iP/J5Pk9+1/2H9pf7T5CeIvn39Y/Uf9k5DPLvKP8S/Vf/N/b/8t73P8R/xfYN+nP+d/VP3////2Afwj+dfrv/pewP/c/QB+z/7e+7r/p/2j9x/90/Kz4Av7h/tP///5+0O9AL9pv/x7Of/X9i7+wf9z93v/t8jv7Zf///4e4B/+/UA/5X///+3av9cP7t+Hn4Ofdzxn0WWIV29o92GypUAHe1TKfwOjbyQJjPpKd6r9p3vQTxdtR7uOVrokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJiguu0dS2PdOKc52qYTLtqPdxytdEmNuiTG3RJjbokxt0SY1i8oGUZeey6C01FcrtWT2OWwMkyPAjgTNh8j/CklHhSSjwpJR4Uko8KSUd8/7tTLTAepmbjla6JMccSRs9cXnzPedq3bUe7jla6JMbdEmNuiTG3RJYVWkIy88CNFxijla6JMbdGdaQQzlab3YZ4xuiTG3RJjbokxt0SY26JMTDS1YkY1W2vWuiTG3RJjbrWAMoeje769hAZs4+R/hSSjwpJR4Uko75/3aG4bEP8KSUeFJKPCklHjqWu6Ya4qKOUP8KSUeFJKPCklHhSShiJynhOBOPkf4Uko8KSUeFJiLpbzif7btqPdxytdEmNuiTG2a63eNuR/hSSjwpJR4Uko8KSRF0t5xOqSJMbdEmNuiTG3RJiffdrpkf4Uko8KSUeFJKPCklHfNpB1d54yZdtR7uOVrokxtzJE5QgvdxytdEmNuiTG3RJjbokxPMIJOJ/tu2o93HK10SY26FyFdz5H+FJKPCklHhSSjwpJR46+zSZOAzZx8j/CklHhSNCIYDSJJMj/CklHhSSjwpJR4Uko8KSYYj2Ra0gAM2cfI/wpJR4R1VuZgRx8j/CklCpLd6TSZ+UQgwk2kacjRHn5D5xySP8KSUeFJInen53Fso3RJjbokxt0R1zE18Nt3HK10R3wHnZslp3/8t8wKqYfqMjjADBzFXUDmzj5H+FJKFephHT0ko8KSUeFI2ZOVG3pjbokxM5zB8/5ZkJ4yFJMNx+K/+G8Ix9aRx8j/CklDOhtrcXCvUeFJKPCklHHMLonT9tR7uMEtBwlDbAuabdEmNuYcUUy1AmOiFe9dEmNuiSuwDzdcz2vWuiTG3QwOYo8KSUKjx4zbwrmNFCWgP6Y6Srrf5geSSdSgW/T6uKUBcaMKc5lVVewIdwpJR4Ukid8zCZdtR7uOVmRQElH7aj3ccSI2F2+1MQECrdspaF3cvJcabSOn1YEXBsfHaBGj9VU44TsAo5WuiTGs0iTj5H+FJKFdtAbmNuiTGsj5zX0P4tEiA3DGBAJXu5DMsiSAv2w9y408T2zop3HK10SYm5MPONM9r1rokxtmT1kf4Ukh300hmDXg0hbhbycfI/x1KVKBVPUdr3N8RbtqPdxys1t7zYfI/wpJQxE5UatR7uOUsaBUx4dVbzaWhH+FJIb4XZmLI7VC8pKupWuiTG3RMDmEy7aj3ccU16Bkxt0SYoCwRQ/NjeOmP21Hu44mi8conRUHIC97E/wpJR4UjU+AcvxJR4Uko75jgXPkf4R2S5rOvmH6CP8KSUd8cNKH29Osk/Ykxt0SY2zLKSP8KSUd8xwLnyP8I7Jqhp14RvEs6XRJjbmJne3DjrK7MdDla6JMbcxxBRytdEmNZ3jdEmNuZJyLPl7D51d/D2RVydtR7uMIGglWzD1kccOCN0SY26JLATo26JMbdDBH5MbdEmJqRWf7qz959SirfK10SV3iYHKSaAZkOpn9c53HK10SYmgXbhGf4Uko8KKKGyFKJH+FJId8JP4cF3U6skEyRyKjlZsh7olQ+CJgyZciFwJjbokxt0MEfkxt0SY2zc46IwRJjbojqg+m/tauxhUOgh/wkZaoY90xAHwL7dsDE+7Eupxx+h93HK10SYoWbD5H+FJKFa8uRD5H+FI0D2fNuKrv4adb2lQopUwr6AyvSm4cVV/22nyx5T55121lDW7sPz5H+FJKOQj8mNuiTG2cvUTo26JMbZuEy6NKB1eF527f8ghYp4vFVKXUlbDGYzC4fIiKC3RAnq14bR7uOVrojpj/jVxD5H+FJKF4go5WuiTNymBjN1ljTAiBEmNxIxlzQ2HwoBYgddEmNuiSwlMiG3RJjbokrv53FtNGlHu45Ws5eZgAyiFoMveXz5HsOcmLsZ63Rv8gZ3FL+aliDDHu45WuYUIGJmw+R/hSSjkKUElHhSSjwvqa8EfDXGYEnie6umaZ3ZVNaWQ/kQE//kqLNVg9cdMD/UoK/MBNqsR5l10nc+R/hRVrjMbdEmNuhjvUTo26JMbdEmdzo9mS8jz2jFzg0efsJczFN2GONWEAJ3EUARIqUQ9tR7t1tmqKNXEPkf4Uko74rDA+QykOVrokxt0SY26JMT+kf3zNdmVVCXgj0Z/AaVFIcrXQuzDmInF+2o93HK1lumtdY/Jjbokxt0SY26JMa0+sQ9MH+pQV+tMdH+u58j+OYXQttqPdxytdEmJrKu6RrJfPkf4Uko8KSUeFI2fWIemD/UoK0bX8UBjLZRx8iLfi+CG3RJjbokxtzD108v0j7uOVrokxt0SY26I8i8512FBGauZ4FwW3cVr1rN9t4fuAZ4Uko8KSUeFFBDROv+9Ikxt0SY26JMbdEmNuiTG3RHQX3XqJ+7jla6JMbdEeRd8avlHhSSjwpJR4Uko8KSUeFI0qXRCcfI/wpJR4Uko75B6cMDvMpI/wpJR4Uko8KSUeFJKPCPEIBp01+klHhSSjwpJR4UU+BW9dXZSR/hSSjwpJR4Uko8KSUcl29GsBQs4+R/hSSjwpJR4UU+BW9dXZSR/hSSjwpJR4Uko8KSRNuy826JMbdEmNuiTG3RHYPZoHl+nSN0SY26JMbdEmNuiSwgHohnWD/hSSjwpJR4Uko8KSULLMdmo08zl8+R/hSSjwpJR4UjRZXUko8KSUeFJKPCklHhSSKHmWJYET7Fr2vWuiTG3RJjboYuwa+eOJx8j/CklHhSSjwpJR4UkoZ0MdmJ9YCZWekte1610SY26JMaxUv2FA2eFPz5H+FJKPCklHhSSjwpJR4R7JbTuv/dzu/82RZ93HK10SWIg8eiRl5v1+n8KSUeFJKPCklHhSSjwpJR4UWa/+Y3zz4c6MEYpSXJJR4R5P3ap1K8B9Eyw3kxt0SY26JMbdEmNuiTG3RJjbojyL/5zJbz1qrnuK+MdyzP9S19TLEVhM6Hl21Hu45WuiTG3RJjbokxt0SY26JMbdEmNuiny7aj3ccrXRJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SVwAAP7w+cAAAAAAAAAAAAAAAAAAAAAAAIjm+y//90nLzazTMrk86bzeaWfkqWNiP7Ebj8LcyngbkfhtXgZdwdNYQpg6LOTypuR2lzIHiqIpCs3dHxpO4Boy1YQW9FoJQiB0xygQ5WtjUfECi78AqbzeXGECYLGFGgYGYlXZIyzAAE5/UJm+hbDQF5OngB3G0ig4yLg397cuPXhB4A62FBZiGcJmKlE/LkGkssrWw9ahW5JGP8m1fUnpb+zfvSix8tMf0MX7gl3NyLS0jTxmrsBqAxUhawy/njRJkdtClSIqtvyz6k9S3nWIi3XAAD8l6ibiZ0oWntVIHpVEh0bGvCd8OVx0yrlCqStZsD99IaXNCtps5sh4cHUUwahcWEzTxqY6pUuncyx5QEQv9pYoBcoLVVCwQpxklLqxiBIcAAPbHh0rfQ1RiJzjig4x6rVvDb0TMVKJ+ZCp/jaFrK+QWlT+IGRD3bYV5S1faapcRUmHoAYzetr7mQRTMdveDAyIf9eixYAGOgjqxWHpb05/sBk819xT1ME7RBzB00FNPF9/5Iw5qzP2/zNvPyBbM6tr02Qi6HAfxvjNa9+ZXgbAHLzdfcVDyNhoC9c/dOe7uX58YZvoWw0BeyOKNkla2Sh8/bp/JNZj4vBXhpojvi/GGbaiXGni43ead2wAAFV6wDVgOq8Py/xcHIbU4u1TYxNQ3EFIQwmOGIJVkmCg044MRek1gjzbvQLFJ81VPQDLrXpeBKXipdTdB5zJ8X42gl1ksy3D1b0kNg/xRNKPK1A6wbqbPII7Y1s01yuYg4dFcABjGDB75Ht8bvaPOZf6pRrn9RngD+UW7wm5D+5JzataGYwvZP3I23gX3IRPsh617cJKeK2/vfmV4GwEA5fF7lCLFhjGgLjmGzH41w/Zohx7rlZK1/yuorgCyJi1vrj1jE8sVuHnWiPn/F3g/l0bteKQA1MgAuPyQccBIEHacF5u+N3tHnMwP8xOykTp6aslu7rdj5g2Kxcru//NVHFJ50EPZdJJbvh9kGAgFsN0c2ZGLAVzjGB2NF0dlo0b9YY2r6YqugSLxquo3FHfZmmneHTFIoojKYYAXvSEzM8SIZqdOZle7UphMZmRYPg9fBIofGMBX6tfM8Qpy9XQ5LTGEOlNEm8om//keYUVvujMljBv9GJIGRR/urpn/GewJ351+MyVLQAAjOy5mEfLZHnM1ALuq+vgkUPjGAr9WvmeIgFsN0c2ZGLAVzjGB2NF0dlo+16Tx5N8drcsdl8LYQakutrwPUHddY3wA9+OaSGWbHPe0gJunwqJBWrhHkE/6tfM8Rfh+I9yhEQZllAXHIoH3ZtGE/3vDnNc85lVSKatohPt68wap6+k7w6YSAAFqKjB8+XnsjzbvQPdCj3LPp9JsttISn5eu2XLDLlLvJpgTgXXIr2kAEFAYMcYuacrJWvzjv9qi+Cq0JgcEaMsVuHkQVNkYTGrgYuYSvl0oAADWAxQrz/WqhegJ04sTsEJ0fy8GYi/ndMA/F47/UbuOmp5xPSl4qXTGWeawx/Qp9zdXDzLcPMKNFJ1adKfCp8OAAZmrnHSIqrQo9P8WhioyGkXNUWkMx5Pvj3U0LcFDA9Md4NJCYAx5iRgfT+FriP0/kICXn8Sh+bwb7OAXMGuOQEz6Q2kSFldSQEJ4mP8fe7P+v0G/lnBZ3RSlT97RO2wKRsMYOi/WRLem11OZ62+ZqoEDdtmyTDIf0dCXkaBjfNgFu1zHIUoR78chCZmcG8rd/JmCBKz76kPWGaU/IaexyO4k8MPx+QH5uENvYTFVOGN5AWW8LSvo+P0c5812hoEAY5t0z56iQ051ULdomuoerx8HbAsRhBkDG0uLXQHGmgJ04sd47BZ3qoCLkO0IUIE2tKSDk4Bvw7Ngy1vO+evFitbUgNMTMyDiWI9/Q/D9y8b44eEAiiSAG0KzI8cwFFSLCChB6Dl5B5M47q4pG8qKtIjBv6MFdmQrxDAeqkuk6xgCIdb8JnRz7y8OdKNQuG1HLYk7w7M/l5NFoerC+ZTpbOkmzDPP5NqO8s95PGjeJajEDMr0YsNpsMQAR64YqUEwb0CNIOT0QjTQ+4p5WEYix0zEXLfWahqCdD04Zhkps6EI8T+ZjJ0XDI+0GqBQzhv3XASYAkwP0DHJn9nzLuDMEl+TiCECUIMvTOV6+zYBl2/+OEw9DN4rQzb8I9THTK60H8iAhFsN0c3nEtX5vUGVD+qIn06JDENHhAy8hJ2qtZNZIaR3kum6TodAn+Wdc0HBxvz7E4+5OtO2jsdu2n1ax17U0cFdW9Z/NYHCyrxzIzUYVXRZ4jvPy1zmHRPxXwTZaKZTW+uBsKq2w4uDri2jJTMfAAGKzs2rrozZQnFExQHYxiKocbvw/Dmp2qIFvmG27tru1di+Lnp0HBCqc/+jx4dkIYoHgD4lTAzEdO2XQSNPpFXSgq++VN7TPQHhs7UWkMxIWerYmb9+YeGTfZSDvmhnClKYSadj9AZxFn5k+RcBRaeH/6ohb+qKu85SUKk5mMC2NQB5n4B74EbGWTDYt6O7d002pmD2xoyYTkXTmMP82OLZgCEJ+TgXwtR2qDAhEOxFLP5mO96Ge1pcmMzERBCOZxh3H0pDyhOGofsda3clIBsRlkWZJc/wzAZ3YqTjSR0OS0uM3a+hOBkiqlYkDzInABERZoKyzZXGAIstrfUK+xQCTBdWsT6mh4h383LxH5Hgr/HnpaKv1cP7ndRO353RNigsxy/2sKW+PPWjsZ2V8gR1g9y5mKDbbzffHmdZNbkVgSJ7fx//USgHcFEpET+9rY+WW/PjPtY4mQntkIXARLzw0uBsLuUpY+YDQKqEt1STv0fXenp8zX+ZHTamzBxmL/V1zpvP2+8bAjGbUneH9GT2YtbMItudQ+q/+BRPv0hjbqL0FOOEN7N9HfLV0mjDVMZttPZo4f7j+Fjt270wDo5egcnzZzTcGV1jzovnEYWtpPC4ZJYQbvt+1AStsgDH0qjqMxd3ciP8SHUGgfrGQstoutcVx0js6CRnW88JryLzUXdMigF0c0U6OgtpHiTS2Blm0wGNiuZda6dCt1W0bS5ht21Uvrlc57+u+XpwztDAh9/fohnx1Wbfc9mtcbA9lSlENJQ9QgZiBslYqBhKwYZgnjqRZhEM5vqoT2C1BGmJ0Clw5ntknFTJr+bcoei8RmizPF6ERG+hIvIacPTxazrEZx0AgFJwMDqr0lNf8ZEzzX6I8/6RoPWzG0X7aoQz1TY2Ng+jg3fp7x+Ti6a5xEA5y27GStwJMmKf07OjueAXoTCoKuk8CZ3B98VukNx9d+8hPK36WtL2hbEQM8R60H9SF205Em4yTOa3A/1aVlyDMhvzcsR02hTCx6fuXwaZy50ym95qzdcbVBKrUYNye4LiefxSFO//9nyKTuOkKWPwX261r+wNbut0CHqWyPoVjhh2yXHBpZT0EQXCfkcfzS3htqGZIbzMQpjkyzR3I6F3qfU1/4lsF0ofQowSa8hHi4e78iGI0Ll8DoPE5oB3aB99hNGX+pM4uwDXgFHjxlTTipItxG0xadVIOWYH3FDxxW+RruAwJHHCMBggcsr+7w4DnkNBXBCZZFXzdrgWs5ag5APscnlxmB//zcS/dqzf2QCvqgfLJMkTIeKnFjmwCunj0Rg0X8KzEZSseCXeAQ0Sytk2dUNX+q0aM3tSoZxOTf34JkEFDPeYFjkTFLEgutRK/YM5jkigR4iAyrSMjCxp1Yz0hWl2qxkktpDxw1wJaCTMPjo2LFSxWtikJ3jO7xXN/B0Z3tIfx6YKC4ioUkyMDp3RN1l6a02nca0AxdJfwmUfO4eAHjqRUpRQUznsr2HjAdzCkI/vkug4RwTZXsI49JK+HQWCCNYS7AZeFyu6Q9vJlyfUflB6Y8R+Y+W7dkVkOJ2cHqZl+z8uhgQCnXa+eVWOUwaqUh7o3EDm1pQhMjwZJ2gMVOn1VcojT7wmXhevyeLapHiAVlhwvm0I+rywACgAHyNR+/ZXDXby96bArWzt5RIiOMaEYMXEFZN2X+s95v2y+ZluHkEFTInhBPGag/5pssPBQzVXCYcBrl/IuYgxM0MsOojnCQ2878hRlCW0ETig/Bd95uew1yB/0cDrJpA6xCyRAhFGQRsCUchSrHKJuQs44zdn8iZlEIyEy+jaHjg5qRbpexJqlFjHqCC6B/BgmjZvnEgLuCcrhohkFMJcUa8WM2vn+/Jb1lJ+KrujPA6iO4D1tQSlpyuuPERnSdfQkn+vqnZqvRU7+AL/kuDoMyUZxCWnAF16y2XHfGzqPTuMdPxmYSaRpaL2hQjl8mLYY7fPbEw/SZIk9Gh9Eq3HBtN9FCOLT/nCkHJgXRW6LD5YGxzeJhWPwjq6/62SWt6qvWed9R5DJ4dwYKZK1RQsXmdRW9Vo4K6mwaBD2Oc3AwYcS635oTF60oXUHBgF8HlvzSpRprjGGdc/+wA9taNEAvhufcj26L2O6fI/KZoEjD0DtCFCBOKldKDre62/gUTMGRmhEUQv2V+1FMGyRubHwXwQLIK2XmGlqy8lYCKFlkyANOyr/budkRvO9APa8DuQQtTY/wVVj0JkV27hQO/aziEqSIZNUyzty9/j3cojTovYx7RSsyQ7f1OtQmZdBdvmTxRAoktDoXXzQ0CKZihHPyuZ+z6BZOVRj6+ieUP0CKFjhyPX1gMAmQ/rRLfoDeER/9gCITL48SBHKLHY8UJ5Xl146qdHVjXF5eRFxIfN2TAH60IfRCX9qAoADshGlE5/874Ny5hYi8CrK7XWxVqwL++AxbB/ndHpDIiG1iuoY+imT/GfskvbJTRshIUi1IPr3ZlJAZ2ceWEQzNqciuXCHjRV2ytKiscAQKrobckohl6MBdshzJEBXVgNm1AAsJSKgmrZMCFhT+tYABB5g/cz7oY/4fErWLqg4ssHu01ORLGw1g17R61Kr9jhbj1V0iRArM7Iah/7O4Bd4h4IcwYHU2cGA0DRrDZfzkT0sI0OJ9xkUFpSY7JZdiJT9WegCxbplW0qc5ametFQX05e4PI6dLNqsGX3MER/LJ9hKZKyd7zZDNn9/Y9lan5izxC8Kk0PYV96ZheaXkgf8sn1KqvRRcYUbSNTks/Aa0I8ZxPtjBoEIQqNnFhplR6XoAyyp+h3JJMZhU73zdcYUCIL1GZo+Kfa8dVc3eyMKrPmtAax3+Azsco8IpWFfDe8VoEcObymv7y9ikf6d4FlfdVRJIzfBHsjhpDj8CnF5Y/eqcxz53XeBvrO8KUJO5FJmksMGiOuLbfKDvGa0ZDItoxMd7vQGZiI/mFUotA/1leNDNX7BwrROBO4pFNxW4hk1/8AUcoJS0661gXBFIB9qhKVP9xeP/LFnrO0DRugnbKL1h4QvMZnGjza5D741JV51HMbTtH9QY49Ld45QC1/hdxoK2faFQFJa/uB/9Znzp9YSUo8RwcBlnPJSqwJZIUICZGtYPu86Vy/ORQOVRFO5vHH/vKg8OPUKHCIA/isqgHTtDE2DI51+oLGZIfvIKoCtDASg4CpIdiJ18W4r5EkGtnQKhPL86DV+2+GVBVZcYDXAZVjXa6tENTTqBhTyPczUv2aZ3MTURIqHYpckOIj5B/rS+CyPhrbFefe4KmXw8Lwq9MYAgsw1MqRudb/6HtMdRE7QAHa8RBE/mwGPRO6N0Ye2ScVMmv0kyAYwM81aUpaDefT1uqu5yT/spnFnHZruLIGtutpbrAzYCP5jCW+DqpQbfGP7AOlnQv9cceVBRwXycrKO7AB+nmZ02f2eFy/ARPoqBqfGeZNAKcPvZIRwjKWMZHAv5ZlORsSYTjBdlF0grMjIQWYjO90m1qQVuvk4e+ayog0bmNmLuCcnee3DIdVKD8EK7jZtUi8J7mtcRFRfNYiVt6uReQmKCDH8QsSx2z2uIbI9oYgvotDA09nYOXbYXv9ulg0Hqpf20hOFLq8U9AARodOYe4XkuK2/qjLvqa40TNXUDRRRu/i/hoDIuBRdI3MtdqUxEHO42CjSOIPjPUHTYpe2/sOv45bp2QOhCIgvOetwLpEH1QDZ4L5jtOPL7owvvgUnaaKcfjz1Z6hRkCAEE3EGy/OzK5WZqhk7/bxtQ2DapABAtERDO5m24oIgQSToLG051JPdIAmK7qwe6t5SlWMV8KWn46qm6vOCNewtgSKY4M5cN+Rgu+JdB41ehNgOlCSBnw/Hdn1CiLkcMV3e//Zc55x+sP9a4UjVinUbM47amRgGDn2Yp16unSP9VwGCBpgbZdNpwBxNY5K3zTuRXqSDxIljPo+cGieI+hWafvBu0Xh00GZx6068SXAbgDfu35knSydXh3xXKZX8GWeJPh2uZS1YLLeAlVV86dKcOvQbsyZA/0/Ul6BCluwxhVCF7urln+oVRLoaBLfh+Ji8RHr8xhzAK+IePFGSxPVCuIK8RKxrDKlIsDztgqxrfB2pNgXzUfA1ED0Urprub/d1pwyRfiLLNhlL+dtAeVOi9BBrE8N2i8OmgwDUCH8Kg7W2AuDE+2HXG40phIWqm0XzGPV0mh5cHaFkXMGJNB77Tfw+2HUBdfwfmtG12p8gn/iJ5ojxJOKTIIgJ016HHJSyh7Aa/Lht9jiAuaM/nKXkHoAaxoj/p9FtjkQCqEAS9tVxJ+BjSynm/KZuNIjWHZo2ZbIhLTuQV3Mwa7fdVJYNk/0GlBUWD5+sKgz7XbjJyJAL3VdZ7+Uz65m+eo/xy6eWr0hQKMS8lACYa8Tu4V87tM5X2b2dcMyFsd9yrFprfPYvrckBkALZBSaPbU1Rcbq7FX9rbAXBi5uuIhkZBXLAqhg0phxj1dJoeXB2hZHs92uuUYPYMn4QCbIuG3Df+aHNg9Xm1pwugGE4kCf3hxoK1K1M3pZrLECEDrBlvwEuyRuyiZ8hMuNXZ8CnTPQ3iLbDTxjvWM52ORiZtAj8N0u6YnAmcv4vu6qcum3suAyHKwcV3CBD54sfIuOFhVRQcuJbryrHneh4bGp/m8dOiy0dphgL5mtraA8zLBtPpaKoqUyo2u8ibXG2sxmaWdr+Pm0h5Ugy0eWYuUCcD6b/r/y1j6okG1XRyNjDZK6LXvdt5P8KzX+IEYbyjZLkpGP+MqCE7MtqYmk62y4J7b1VZHAL/LoW9JjOVaAFWatfB3zz7HDIFIaICXaebnmyeDYAfj9oLjGj4omrb1Ys5OlUgSTkfrz1CdyiYPQpr02wFleInrj1XKW6n4bnqcTPtYQCkIIj9qUlVgpg72IBGZWbHXxf7fJls4kR0NKXRW7fhxSe2o8m8lAxeFAd/M9yzARENwY9U4LcEy0XcPvcHaFlbhXaSFFRScMdaMGMnHnmROXWBObw56uKpMUkERLQGD/feHXCzLMigO7oEUottFAIBX0z/WE3WQwAALSCNERgnxeAVaye0DmpFJE0/0rb+oaeNll8sDbBJKUJdklTK/7C1U2i+Lydd8lAxeE7Tme5Zfz1r6UIj2VE2QY9XSaHlwdoWXwgE2RcNtoD0jHNbmtGsnDZmea9SZwvPLosqSB4HmirTAVlwoB+34Gtid3kVPTTyWOYAHkD5ecmOE1OxWyiaABaQRoiME+LwCrWT2gc1IpImn+lbf1DRJWPCnL6tPpjqoh/H+PquvxYhg4dk3AGF3NL9uBUwLMWT7rhPtEvFiMrcDEzmMzK8qMfkiwkiwKMHaVLCYzu8yIgsvGXpDnnU1VUc+9ajhPQhtMuqsq889iTXNeMdS7iYyD695VSAD5huepxM+1hAKQgiP2pSVV5qhfvgN4LBY8Kcvq0+mOCrZSpXqGmjNcxt4W0KAMa3T0cUH0kKhfT3tmfyWNgT8/mM7YVG69ZOULj2nWe4HUFRopgLPi1WcVQ4QmAAipaHgYKhSgEkYm7J8KS/jiR86ZOk40+QAB2w3PU4mfawgFIQRH7UpKrBTipOZ+3SQ7HhTl9Wn0yCXA3MQxAxB4e9lrZbAzArxb8r55qTYQLEkqSyavR6as6ETAmnRdJkrmNJeNeZz/avVV7qLrWDCe7X03+ArBY/sh6Zg7u2+zzqatq9EYXUByq+2IlDR5SMRIUWqyQJ/eG8M3VGd5wChyBVQBHcFoC3eYeSjU7isdbQexRiS59Q1VZzYKsQ+HlfyxrbevuAPeuUv54Gtl/eTbyejyfpMTgATMvDUkT87ROMaHHk+HuvSDMSVHYauO48Su+oIs2mWqvqaTF0IiTDJNUQ2j49PB8Demr2YeTJn9WBDylLFv4kqsn0Szlh9tdCROFagOn5loM4yPtRAJGgAN+gX1rkzCs6VRsHL2EhLnBL9o8pIZia3NX1E+CFmK/cKTUAD3o1goaxelre9vR/3Hv9Io0OhXmANoyaGMWLx7rljw2sM1gFdbLf8EWbTLVMYzXoV2FpieyiK4XtHdDngTCnJohBNNRN/mbYEAKDvQRX0WRQvIcfShMOi3B4w+5cddCQ5jw0Ifwb+M4LfgrMzV38XFKp+IBsxU9sk4l96py7zVSBMis5x1iRL5NpmVy+M58QTAAQ1g04z4HrRH2FMNcjAqyu1iqWOrc61JbjErabm8JXt93UTHKh4MbyzLZfQMB0T3tlExyobgiV8YXTIWZry562F1AEr09G4ThRZT02LCa1rT6ymHxNXMLEoWAY9ihicrTrk2lpBLZY3zkD8d//+4h//YNv/9vo6j/YLPP93XyVePf0iaJ+U8no80JzsoVolYG+GA4YpZbN0yYTfYUw1c3KwiDaORvMIz8uLJzRYwSpt1gYAOL9tf4UDGG47BxzNXfxdBBnRmITjF7ZJxOX2tW9y7wBEjP/4U5PcxknmPgYZ1KYzLWWeKYBsERwwf/BdRQAwmAOMDpOgKJqtGs04QfjhB62b+JDD+lcGC0O1R6CtFOKm5Rdb1IJDLAsgPZqjGa9Cuwx3xqVEcx6EinrqoYMTCnJojcpWvrjJzmHUmJ0Xts//62//60J//tgg7NLR8eng9eJxe4Lxo6LCdC+HWGAI2EmEwLRBrDjmgTGeY1C5NQF/hpk5OJ1+h0z3Wl5rNM2eiOlgPby+Stzm7Dh8x6GmioGeYC75oznlTr6iiCN6jlGdYhj3LfT0H8J0MFoZEpBr7WuBdMD8AkjVX/faAAAHai7PMqNz/XaKgKTBDT1NchUq86YinAfDX9RXiXeMNyEeWcWTjyKAlQIzUW3Y/SRA7KWwgeIcNSpLHntiZ986kgdLfVGwTqD66+O6otfK+w+2/ft0x1K5cJITM/9Cp9REQeqgsMlEQBA6CnUm+ZawAALEhhKXu8IRL0c/Nd5kg6IJXSTOsONHB8C2c82XPZAO7TBcsJACV9PrLmA7Xd9d2A9luHopHDaQHRMqNpxMOplBAmV+p47HcPBmt+8D4HpKpZyA91KAJ/ApihonVDTqHON24N/C5nkGMkp8ayYT32P2t+J+fhuR3HFRu0r4nKTYktAAAAnGnXO3i9tagoLuCXO7tUm30JTM3HDMSF0cFdJiXJNShblU7jFLjEbrbh3Lym06dN2V1hu7MXV8Aa6TvSXu69vBv92V9e0heTAHL1spzUD1JvAh7LpJGs9Y/6VT7FU7bhf4a1iBkLZR6EZumJovDdVJpOmLKsqhihywgfgoDomVG0+uWaZbc2O3z2imPIVQtg3cp73+MIIH+IBX+SvlizCxcHxvHOEY8dCyvKqx9LQXWV0p9YEZlq2p4AAAfF/cRxG/9jQX8aymC6LZ8RSOErMzVBXId1ULmOik5bagJaERMtl7/wCegLiZ/kJElnfIGHKqbDRzO6DfXSDW/gJSzsAqZAhg3gaQsPpjnsbNRfthL/wCZ9vJaOYVey8X8hYdGhmllg3askKOMIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    const HOST_ID = "hc-search-host";
    function findTopWindow() {
        const _self = unsafeWindow;
        let t = _self;
        if (!config.out_iframe) return t;
        try {
            while (t !== _self.top) {
                t = t.parent.document ? t.parent : _self.top;
                if (t.location.pathname === "/mycourse/studentstudy") break;
            }
        } catch (e) {
            t = _self;
        }
        return t;
    }
    const panel = {
        win: null,
        host: null,
        body: null,
        onAction: null,
        init(onAction) {
            this.win = findTopWindow();
            this.onAction = onAction;
            const self = this;
            this.win.document.addEventListener("mousedown", function(e) {
                if (config.auto_close && self.host && !self.host.contains(e.target)) self.close();
            });
            // 兜底：document 级 click 委托，绕过 Shadow DOM 事件拦截
            this.win.document.addEventListener("click", function(e) {
                if (!self.host || !self.onAction) return;
                if (e._cxaiHandled) return;  // Shadow DOM 已处理
                var path = e.composedPath ? e.composedPath() : [];
                for (var i = 0; i < path.length; i++) {
                    var n = path[i];
                    if (n && n.getAttribute && n.getAttribute("data-action")) {
                        self.onAction(n.getAttribute("data-action"), n);
                        return;
                    }
                    if (n === self.host) return;
                }
            });
        },
        show(html, reposition, mouse) {
            const doc = this.win.document;
            let host = doc.getElementById(HOST_ID);
            if (!host) {
                host = doc.createElement("div");
                host.id = HOST_ID;
                host.style.cssText = "position:fixed;top:0;left:0;z-index:2147483647;";
                doc.body.appendChild(host);
                const shadow = host.attachShadow({
                    mode: "open"
                });
                const style = doc.createElement("style");
                style.textContent = PANEL_CSS;
                shadow.appendChild(style);
                const wrap = doc.createElement("div");
                wrap.className = "panel";
                wrap.innerHTML = '<div class="hd" data-ref="drag">' + '<button class="lock" data-action="lock" title="锁定后点击窗口外不会关闭">' + '<svg class="i-off" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd">' + '<path d="M11 10v-4c0-2.76-2.24-5-5-5s-5 2.24-5 5v2h-1v-2c0-3.312 2.689-6 6-6s6 2.689 6 6v4h10v14h-18v-14h7zm10 1h-16v12h16v-12z"/></svg>' + '<svg class="i-on" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd">' + '<path d="M6 6c0-3.311 2.689-6 6-6s6 2.688 6 6v4h3v14h-18v-14h3v-4zm14 5h-16v12h16v-12zm-13-5v4h10v-4c0-2.76-2.24-5-5-5s-5 2.24-5 5z"/></svg>' + "</button>" + '<img class="logo" src="' + LOGO + '" alt="" />' + '<span class="title">AI 智脑 Pro × 划词搜题</span>' + '<span class="sp"></span>' + '<button data-action="settings" data-ref="settings-btn">设置</button>' + '<button class="close" data-action="close">×</button>' + '</div><div class="bd" data-ref="body"></div>';
                shadow.appendChild(wrap);
                this.bindShell(shadow, wrap);
                host._shadow = shadow;
                // 面板创建后立即应用主题
                this._applyTheme(host, shadow);
            }
            this.host = host;
            const shadow = host._shadow || host.shadowRoot;
            this.body = shadow.querySelector("[data-ref=body]");
            this.body.innerHTML = html;
            this.syncHeader(shadow);
            // 每次 show 也同步主题
            this._applyTheme(host, shadow);
            const locked = config.auto_close === false;
            if (!host.style.left && locked && lockPos.get()) {
                this.applyLockPos(host);
            } else if (reposition && !locked || !host.style.left) {
                this.position(host, mouse);
            }
            const wasHidden = host.style.display !== "block";
            host.style.display = "block";
            const wrap2 = shadow.querySelector(".panel");
            if (wasHidden) {
                wrap2.classList.remove("in");
                void wrap2.offsetWidth;
            }
            wrap2.classList.add("in");
        },
        bindShell(shadow, wrap) {
            const self = this;
            // 显式绑定 wrap 内所有 [data-action] 按钮的 click（包括标题栏的设置/关闭按钮）
            const bindButtons = function(root) {
                const btns = root.querySelectorAll('[data-action]');
                for (let i = 0; i < btns.length; i++) {
                    (function(btn) {
                        if (btn._cxaiBound) return;
                        btn._cxaiBound = true;
                        btn.addEventListener('click', function(e) {
                            e.stopPropagation();
                            if (self.onAction) self.onAction(btn.getAttribute('data-action'), btn);
                        }, true);
                    })(btns[i]);
                }
            };
            bindButtons(wrap);
            shadow._bindButtons = bindButtons;  // 供 setBody 后调用
            shadow.addEventListener("change", function(e) {
                const key = e.target.getAttribute && e.target.getAttribute("data-config");
                if (key) setConfig(key, e.target.checked);
            });
            const drag = wrap.querySelector("[data-ref=drag]");
            const doc = this.win.document;
            drag.addEventListener("mousedown", function(e) {
                if (e.target.closest("[data-action]")) return;
                e.preventDefault();
                e.stopPropagation();
                const host = self.host;
                const sx = e.clientX, sy = e.clientY;
                const ox = host.offsetLeft, oy = host.offsetTop;
                let dragging = true;
                function move(ev) {
                    if (!dragging) return;
                    ev.preventDefault();
                    ev.stopPropagation();
                    host.style.left = (ox + ev.clientX - sx) + "px";
                    host.style.top = (oy + ev.clientY - sy) + "px";
                }
                function up(ev) {
                    if (!dragging) return;
                    dragging = false;
                    ev.preventDefault();
                    ev.stopPropagation();
                    doc.removeEventListener("mousemove", move, true);
                    doc.removeEventListener("mouseup", up, true);
                    if (config.auto_close === false) self.saveLockPos();
                }
                // capture phase 确保在主脚本之前接收 mousemove/mouseup
                doc.addEventListener("mousemove", move, true);
                doc.addEventListener("mouseup", up, true);
            }, true);
        },
        syncHeader(shadow) {
            shadow.querySelector(".lock").classList.toggle("on", config.auto_close === false);
        },
        saveLockPos() {
            if (!this.host) return;
            lockPos.set({
                left: this.host.offsetLeft,
                top: this.host.offsetTop,
                fixed: !!config.fixed_modal
            });
        },
        applyLockPos(host) {
            const p = lockPos.get();
            const win = this.win;
            host.style.position = config.fixed_modal ? "fixed" : "absolute";
            const x = Math.min(Math.max(0, p.left), Math.max(0, win.innerWidth - 60));
            let y = Math.max(0, p.top);
            if (config.fixed_modal) y = Math.min(y, Math.max(0, win.innerHeight - 40));
            host.style.left = x + "px";
            host.style.top = y + "px";
        },
        _applyTheme(host, shadow) {
            try {
                var t = (localStorage.getItem('cxaiSetting.theme') || 'auto');
                var resolved = t;
                if (t === 'auto') resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                var wrap = shadow.querySelector('.panel');
                if (wrap) wrap.classList.toggle('dark', resolved === 'dark');
            } catch (e) {}
        },
        toPanelCoords(mouse) {
            let x = mouse.x, y = mouse.y;
            try {
                let w = unsafeWindow;
                while (w !== this.win && w.frameElement) {
                    const r = w.frameElement.getBoundingClientRect();
                    x += r.left;
                    y += r.top;
                    w = w.parent;
                }
            } catch (e) { console.warn("[AI智脑Pro] 异常:", e && e.message || 'error'); }
            return {
                x: x,
                y: y
            };
        },
        position(host, mouse) {
            const win = this.win;
            const m = mouse ? this.toPanelCoords(mouse) : {
                x: win.innerWidth / 2 - 200,
                y: 80
            };
            const w = 400, h = 320, gap = 20;
            let x = m.x + gap;
            if (x + w > win.innerWidth) x = Math.max(8, m.x - w - gap);
            let y = m.y - h - gap;
            if (y < 0) y = m.y + gap;
            if (y + h > win.innerHeight) y = Math.max(8, win.innerHeight - h - gap);
            host.style.position = config.fixed_modal ? "fixed" : "absolute";
            if (!config.fixed_modal) {
                x += win.pageXOffset;
                y += win.pageYOffset;
            }
            host.style.left = x + "px";
            host.style.top = y + "px";
        },
        setBody(html) {
            if (this.body) {
                this.body.innerHTML = html;
                // 调用 bindShell 注册的 bindButtons 函数，重新绑定新按钮
                const shadow = this.host && (this.host._shadow || this.host.shadowRoot);
                if (shadow && shadow._bindButtons) shadow._bindButtons(this.body);
            }
        },
        bodyHtml() {
            return this.body ? this.body.innerHTML : "";
        },
        isVisible() {
            return !!(this.host && this.host.style.display === "block");
        },
        setSettingsLabel(text) {
            const shadow = this.host && (this.host._shadow || this.host.shadowRoot);
            const btn = shadow && shadow.querySelector("[data-ref=settings-btn]");
            if (btn) btn.textContent = text;
        },
        query(sel) {
            return this.body ? this.body.querySelector(sel) : null;
        },
        close() {
            if (this.host) this.host.style.display = "none";
            if (this.onAction) this.onAction("_closed");
        },
        toggleLock() {
            setConfig("auto_close", !config.auto_close);
            if (config.auto_close === false) this.saveLockPos(); else lockPos.clear();
            const shadow = this.host && (this.host._shadow || this.host.shadowRoot);
            if (shadow) this.syncHeader(shadow);
        }
    };
    function esc(s) {
        return String(s === undefined || s === null ? "" : s).replace(/[&<>"']/g, function(c) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[c];
        });
    }
    const TYPE_NAMES = {
        0: "单选题",
        1: "多选题",
        2: "填空题",
        3: "判断题",
        4: "简答题",
        5: "名词解释",
        6: "论述题",
        7: "计算题",
        8: "其它",
        9: "分录题",
        10: "资料题",
        11: "连线题",
        13: "排序题",
        14: "完形填空",
        15: "阅读理解",
        18: "口语题",
        19: "听力题"
    };
    function toCN(num) {
        const d = [ "零", "一", "二", "三", "四", "五", "六", "七", "八", "九" ];
        if (num < 10) return d[num];
        if (num < 20) return num === 10 ? "十" : "十" + d[num % 10];
        return d[Math.floor(num / 10)] + "十" + (num % 10 ? d[num % 10] : "");
    }
    const ANS_ICON = '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#527aef"/>' + '<path d="M7.5 12.5l3 3 6-6.5" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    function searchBar(word) {
        return '<div class="searchbar">' + '<textarea data-ref="word" placeholder="请输入待搜索题目">' + esc(word) + "</textarea>" + '<button class="btn" data-action="search">搜索</button>' + '<button class="btn ghost" data-action="ai-search" style="margin-top:8px;">AI 搜题</button>' + "</div>";
    }
    function loading() {
        return '<div class="center"><span class="spin"></span><div class="tip">正在搜索中…</div></div>';
    }
    function results(data) {
        let html = searchBar(data.question || "");
        const list = data.list || [];
        if (!list.length) {
            html += '<div class="empty">暂时没有搜索到这道题哦<br>可修改题干后重试</div>';
            return html;
        }
        for (let i = 0; i < list.length; i++) {
            const it = list[i];
            const answers = it.answer || [];
            let opts = "";
            for (let j = 0; j < (it.options || []).length; j++) {
                const o = it.options[j];
                const letter = String.fromCharCode(65 + j);
                const hit = answers.indexOf(o) !== -1 || answers.indexOf(letter) !== -1;
                opts += '<div class="opt' + (hit ? " hit" : "") + '">' + letter + ". " + esc(o) + "</div>";
            }
            html += '<div class="item">' + '<div class="ttl-row">' + '<span class="ttl">题目' + toCN(i + 1) + '<span class="bar"></span></span>' + '<span class="badge">' + (TYPE_NAMES[it.type] || "其它") + "</span>" + "</div>" + '<div class="q">' + esc(it.question) + "</div>" + opts + (answers.length ? '<div class="ans-hd">' + ANS_ICON + "答案</div>" + '<div class="ans"><b>' + esc(answers.join("；")) + "</b></div>" : "") + "</div>";
        }
        return html;
    }
    function manual() {
        return searchBar("") + '<div class="empty">输入题目后点击搜索</div>';
    }
    function login(qrImage) {
        return '<div class="center">' + '<div class="tip">微信扫码关注公众号即可登录</div>' + '<img class="qr" src="' + esc(qrImage) + '" alt="登录二维码" />' + '<div class="sub">扫码后自动登录并继续搜题</div>' + "</div>";
    }
    function pay(resp, showAiSearch) {
        let html = '<div class="center"><div class="tip">' + esc(resp.tip || "搜题次数已用完") + "</div></div>";
        if (resp.needMember) {
            html += '<div class="plans">' + '<div class="plan" data-action="buy" data-index="1"><div class="nm">体验 1 天</div><div class="pr">¥1</div></div>' + '<div class="plan" data-action="buy" data-index="2"><div class="nm">会员 30 天</div><div class="pr">¥9.9</div></div>' + '<div class="plan" data-action="buy" data-index="3"><div class="nm">年卡会员</div><div class="pr">¥29.9</div></div>' + "</div>";
        } else {
            html += '<button class="btn block" data-action="unlock">¥1 解除当天限制</button>';
        }
        if (showAiSearch) {
            html += '<button class="btn ghost block" data-action="ai-search-fallback" style="margin-top:8px;">使用 AI 搜题</button>';
        }
        return html;
    }
    function payQR(order) {
        return '<div class="center">' + '<div class="tip">微信扫码支付</div>' + '<div class="amount">¥' + esc(order.amount) + "</div>" + '<img class="qr" src="' + esc(order.codeUrl) + '" alt="支付二维码" />' + '<div class="sub">支付成功后自动继续搜题</div>' + "</div>";
    }
    function upgrade(resp) {
        return '<div class="center">' + '<div class="tip">' + esc(resp.tip || "当前脚本版本过低，请升级") + "</div>" + '<button class="btn block" data-action="open-url" data-url="' + esc(resp.updateUrl || "") + '">前往升级</button>' + "</div>";
    }
    function message(text) {
        return '<div class="center"><div class="tip">' + esc(text) + "</div>" + '<button class="btn ghost block" data-action="search">重试</button></div>';
    }
    const SETTING_ITEMS = [ {
        key: "auto_search",
        name: "划词后自动搜题",
        desc: "打开后划词直接搜题；关闭则先显示搜题图标，点击图标再搜"
    }, {
        key: "cut_search",
        name: "截图搜题",
        desc: "同时按下 T+H，框选题目区域 OCR 识别后搜题，解决无法复制的页面"
    }, {
        key: "remove_limit",
        name: "解除网站的禁止复制限制",
        desc: "解除部分网站禁止划词/复制的限制，如有冲突可关闭<em>（刷新页面后生效）</em>"
    }, {
        key: "fixed_modal",
        name: "基于浏览器窗口定位",
        desc: "搜索窗口固定于浏览器窗口，不随页面滚动"
    }, {
        key: "out_iframe",
        name: "寻找最外层 iframe",
        desc: "搜题窗口悬浮到最外层，可��窗口拖动；个别网站不显示窗口时请关闭<em>（刷新页面后生效）</em>"
    } ];
    function settings(config, user) {
        let html = "";
        for (let i = 0; i < SETTING_ITEMS.length; i++) {
            const it = SETTING_ITEMS[i];
            html += '<label class="setting-row">' + '<input type="checkbox" data-config="' + it.key + '"' + (config[it.key] ? " checked" : "") + " />" + '<span><span class="nm">' + it.name + '</span><div class="desc">' + it.desc + "</div></span>" + "</label>";
        }
        if (user && (user.name || user.uid)) {
            html += '<div class="account-row">' + '<span class="acct">' + esc(user.name || "已登录") + (user.uid ? '<span class="uid">ID ' + esc(user.uid) + "</span>" : "") + "</span>" + '<button class="link-btn" data-action="logout">退出登录</button>' + "</div>";
        } else {
            html += '<div class="account-row"><span class="uid">未登录</span></div>';
        }
        return html;
    }
    let lastWord = "";
    let lastMouse = null;
    let _aiRetryIdx = 0;
    let pollTimer = null;
    let inSettings = false;
    let prevHtml = "";
    function stopPoll() {
        if (pollTimer) {
            clearInterval(pollTimer);
            pollTimer = null;
        }
    }
    function exitSettings() {
        if (!inSettings) return;
        inSettings = false;
        panel.setSettingsLabel("设置");
    }
    function initApp() {
        panel.init(function(action, el) {
            console.log('[AI智脑Pro] action 收到:', action);
            if (action === "_closed") return stopPoll();
            if (action === "close") return panel.close();
            if (action === "lock") return panel.toggleLock();
            if (action === "open-home") return window.open("https://www.itihey.com");
            if (action === "open-url") return window.open(el.getAttribute("data-url") || "https://www.itihey.com");
            if (action === "settings") return openSettings();
            if (action === "logout") {
                auth.clear();
                return showLogin();
            }
            if (action === "search") {
                console.log('[AI智脑Pro] 触发 search');
                const ta = panel.query("[data-ref=word]");
                const word = ta ? ta.value.trim() : lastWord;
                console.log('[AI智脑Pro] search word:', word);
                if (word) search(word);
                return;
            }
            if (action === "ai-search") {
                console.log('[AI智脑Pro] 触发 ai-search');
                const ta = panel.query("[data-ref=word]");
                const word = ta ? ta.value.trim() : lastWord;
                console.log('[AI智脑Pro] aiSearch word:', word);
                if (word) aiSearch(word);
                return;
            }
            if (action === "ai-search-fallback") {
                console.log('[AI智脑Pro] 触发 ai-search-fallback');
                if (lastWord) aiSearch(lastWord);
                else panel.setBody(message('请先输入题目'));
                return;
            }
            if (action === "ai-retry") {
                console.log('[AI智脑Pro] 触发 ai-retry，递增模型索引');
                _aiRetryIdx++;
                if (lastWord) aiSearch(lastWord);
                else panel.setBody(message('请先输入题目'));
                return;
            }
            if (action === "buy") return createOrder(api.getPayUrl(el.getAttribute("data-index")));
            if (action === "unlock") return createOrder(api.unlockLimit());
        });
    }
    function search(word, mouse) {
        if (!word) return;
        lastWord = word;
        if (mouse) lastMouse = mouse;
        _aiRetryIdx = 0;  // 新搜索重置模型切换索引
        stopPoll();
        exitSettings();
        panel.show(loading(), !!mouse, lastMouse);
        api.queryAnswer(word).then(function(res) {
            if (res.needUpgrade) return panel.setBody(upgrade(res));
            if (res.needPay) {
                console.log('[AI智脑Pro] 题库额度用完，显示付费弹窗 + AI 搜题选项');
                panel.setBody(pay(res, true));
                return;
            }
            panel.setBody(results(res));
        }).catch(function(err) {
            if (err instanceof NeedLoginError) return showLogin();
            panel.setBody(message(err && err.message || '搜索失败'));
        });
    }
    function aiSearch(word) {
        console.log('[AI智脑Pro] aiSearch 被调用');
        if (!word) return;
        lastWord = word;
        stopPoll();
        exitSettings();
        panel.show(loading(), false);
        
        // 优先直接读取，再逐层向上查找
        var _getAns = null;
        try { _getAns = window.cxai_getAnswer; } catch(e) {}
        if (!_getAns) {
            try { _getAns = unsafeWindow.cxai_getAnswer; } catch(e) {}
        }
        if (!_getAns) {
            try { _getAns = top.cxai_getAnswer; } catch(e) {}
        }
        if (!_getAns) {
            // 逐层向上遍历
            var _w = window;
            var _maxSteps = 10;
            var _step = 0;
            console.log('[AI智脑Pro] aiSearch 开始逐层查找 cxai_getAnswer');
            while (_w && _step < _maxSteps) {
                _step++;
                try {
                    if (_w.cxai_getAnswer) {
                        _getAns = _w.cxai_getAnswer;
                        console.log('[AI智脑Pro] aiSearch 在', _w === window ? '当前 window' : (_w === top ? 'top' : '中间层'), '找到 cxai_getAnswer, step:', _step);
                        break;
                    }
                } catch (e) {
                    console.log('[AI智脑Pro] aiSearch step', _step, '读取 cxai_getAnswer 出错:', e.message);
                }
                try {
                    if (_w.top && _w.top !== _w) {
                        _w = _w.top;
                    } else {
                        break;
                    }
                } catch (e) {
                    console.log('[AI智脑Pro] aiSearch step', _step, '无法访问上层 window:', e.message);
                    break;
                }
            }
        }
        
        if (!_getAns) {
            console.error('[AI智脑Pro] cxai_getAnswer 未找到，已遍历所有可访问 window');
            // 最终兜底：从页面 script 标签提取函数
            try {
                var _scripts = document.querySelectorAll('script');
                console.log('[AI智脑Pro] aiSearch 开始兜底提取，script 标签数量:', _scripts.length);
                var _foundSrc = false;
                for (var _i = 0; _i < _scripts.length; _i++) {
                    var _src = _scripts[_i].textContent || _scripts[_i].innerText || '';
                    if (_src.indexOf('function cxai_getAnswer') !== -1) {
                        _foundSrc = true;
                        console.log('[AI智脑Pro] aiSearch 发现包含 cxai_getAnswer 的 script 标签，index:', _i, 'text length:', _src.length);
                        var _match = _src.match(/function cxai_getAnswer\([^)]*\)\s*\{[\s\S]*?\n(?=\n\s*\S|\n\s*\/\/|\n\s*\}|\n\s*function|\n\s*\/\*|\n\s*\/\/|\n\s*\}$)/);
                        if (_match) {
                            var _fnStr = _match[0];
                            _fnStr = _fnStr.replace(/^function\s+cxai_getAnswer/, 'function cxai_getAnswer');
                            console.log('[AI智脑Pro] aiSearch 提取到的函数字符串长度:', _fnStr.length, '前100字符:', _fnStr.substring(0, 100));
                            try {
                                var _fn = new Function('return ' + _fnStr)();
                                if (typeof _fn === 'function') {
                                    _getAns = _fn;
                                    console.log('[AI智脑Pro] aiSearch 兜底成功：从 script 标签提取到 cxai_getAnswer');
                                    break;
                                } else {
                                    console.warn('[AI智脑Pro] aiSearch new Function 返回的不是函数，type:', typeof _fn);
                                }
                            } catch (e) {
                                console.warn('[AI智脑Pro] aiSearch new Function 构造失败:', e.message);
                            }
                        } else {
                            console.warn('[AI智脑Pro] aiSearch 正则匹配失败，function 字符串前200字符:', _src.substring(_src.indexOf('function cxai_getAnswer'), _src.indexOf('function cxai_getAnswer') + 200));
                        }
                    }
                }
                if (!_foundSrc) {
                    console.warn('[AI智脑Pro] aiSearch 未发现任何包含 cxai_getAnswer 的 script 标签');
                }
            } catch (e) {
                console.warn('[AI智脑Pro] 兜底提取失败:', e.message);
            }
            if (!_getAns) {
                return panel.setBody(message('AI 搜题函数未就绪，请刷新页面'));
            }
        }

        _getAns(0, word, 0, true, _aiRetryIdx).then(function(ans) {
            // 回答成功后重置重试索引
            _aiRetryIdx = 0;
            var html = searchBar(word);
            var answerText = (ans && typeof ans === 'object') ? (ans._answer || ans._thinking || '') : String(ans || '');
            if (answerText) {
                html += '<div class="item"><div class="ttl-row"><span class="ttl">AI 详细解析<span class="bar"></span></span></div>' +
                    '<div class="ans"><b>' + esc(answerText) + '</b></div></div>';
                html += '<button class="btn ghost block" data-action="ai-retry" style="margin-top:6px">换个模型重试</button>';
            } else {
                html += '<div class="empty">AI 未返回有效答案</div>';
            }
            panel.setBody(html);
        }).catch(function(err) {
            console.log('[AI智脑Pro] cxai_getAnswer rejected:', err);
            panel.setBody(message(err && err.message || 'AI 搜题失败'));
        });
    }
    function openManual() {
        stopPoll();
        exitSettings();
        panel.show(manual(), true, lastMouse);
    }
    function openSettings() {
        stopPoll();
        if (inSettings && panel.isVisible()) return closeSettings();
        if (!inSettings) prevHtml = panel.bodyHtml();
        inSettings = true;
        panel.show(settings(config, {
            name: auth.name(),
            uid: auth.uid()
        }), false);
        panel.setSettingsLabel("返回");
        if (auth.token()) {
            api.profile().then(function(p) {
                auth.save(auth.token(), p.name || "", p.id || "");
                if (inSettings) panel.setBody(settings(config, {
                    name: auth.name(),
                    uid: auth.uid()
                }));
            });
        }
    }
    function closeSettings() {
        inSettings = false;
        panel.show(prevHtml || manual(), false);
        panel.setSettingsLabel("设置");
    }
    function showLogin() {
        stopPoll();
        exitSettings();
        panel.show(loading(), false);
        api.loginQR().then(function(qr) {
            panel.setBody(login(qr.image));
            pollTimer = setInterval(function() {
                api.loginCheck(qr.id).then(function(r) {
                    // 兼容多种响应格式: {status:"success",token} / {status:1,token} / {code:0,data:{token}} 等
                    var token = r.token || (r.data && r.data.token);
                    if (!token) return;
                    var ok = (r.status === "success" || r.status === 1 || r.status === true || r.code === 0 || r.code === 200);
                    if (!ok) return;
                    stopPoll();
                    auth.save(token, "");
                    api.profile().then(function(p) {
                        auth.save(token, p.name || "已登录", p.id || "");
                        if (lastWord) search(lastWord); else openManual();
                    });
                }).catch(function(err) {
                    // 单次轮询失败不中断，只有 NeedLoginError 才中断
                    if (err && err.name === "NeedLoginError") { stopPoll(); showLogin(); }
                });
            }, 1500);
        }).catch(function(err) {
            panel.setBody(message(err.message));
        });
    }
    function createOrder(orderPromise) {
        stopPoll();
        panel.setBody(loading());
        orderPromise.then(function(order) {
            if (!order.order_no) throw new Error(order.tip || "下单失败，请稍后再试");
            panel.setBody(payQR(order));
            pollTimer = setInterval(function() {
                api.payStatus(order.order_no).then(function(r) {
                    // 兼容多种响应格式: status=1 / status="success" / code=0 等
                    if (r.status === 1 || r.status === "success" || r.status === true || r.code === 0 || r.code === 200) {
                        stopPoll();
                        if (lastWord) search(lastWord); else openManual();
                    }
                }).catch(function(err) {
                    if (err && err.name === "NeedLoginError") { stopPoll(); showLogin(); }
                });
            }, 3000);
        }).catch(function(err) {
            if (err instanceof NeedLoginError) return showLogin();
            panel.setBody(message(err.message));
        });
    }
    const ICON_ID = "hc-search-icon";
    function initSelection(onSearch) {
        const icon = document.createElement("img");
        icon.id = ICON_ID;
        icon.src = LOGO;
        icon.setAttribute("style", "all:initial;position:absolute;z-index:2147483647;display:none;width:50px;height:50px;" + "cursor:pointer;user-select:none;border-radius:50%;" + "filter:drop-shadow(0 4px 10px rgba(82,122,239,.4));" + "transition:transform .15s ease-out;");
        icon.addEventListener("mouseenter", function() {
            icon.style.transform = "scale(1.1)";
        });
        icon.addEventListener("mouseleave", function() {
            icon.style.transform = "";
        });
        document.body.appendChild(icon);
        function hideIcon() {
            icon.style.display = "none";
        }
        icon.addEventListener("mousedown", function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
        icon.addEventListener("click", function(e) {
            e.stopPropagation();
            const text = window.getSelection().toString().trim();
            hideIcon();
            if (text) onSearch(text, {
                x: e.clientX,
                y: e.clientY
            });
        });
        let selecting = false;
        document.addEventListener("selectionchange", function() {
            selecting = true;
        });
        document.addEventListener("mousedown", function(e) {
            selecting = false;
            if (e.target !== icon && !icon.contains(e.target)) hideIcon();
        });
        document.addEventListener("mouseup", function(e) {
            setTimeout(function() {
                if (!selecting) return;
                if (e.target === icon || icon.contains(e.target)) return;
                if (e.target.id === HOST_ID) return;
                const tag = e.target.tagName;
                if (tag === "INPUT" || tag === "TEXTAREA") return;
                const text = window.getSelection().toString().trim();
                if (!text) return;
                selecting = false;
                if (config.auto_search) {
                    onSearch(text, {
                        x: e.clientX,
                        y: e.clientY
                    });
                } else {
                    icon.style.display = "block";
                    icon.style.left = e.pageX + "px";
                    icon.style.top = e.pageY + 12 + "px";
                }
            }, 1);
        });
    }
    const OVERLAY_HTML = '<div class="hc-jietu" style="position:fixed;top:0;left:0;z-index:2147483646;width:100%;height:100%;">' + '<div class="hc-jietu-box" style="width:0;height:0;outline:1px solid #159ae1;position:relative;' + 'box-shadow:0 0 0 65535px rgba(0,0,0,.5);pointer-events:none;"></div>' + '<div class="hc-jietu-tip" style="min-width:333px;font-size:20px;line-height:56px;top:64px;color:#fff;' + "white-space:nowrap;text-align:center;background:#000000a3;border-radius:8px;position:fixed;left:50%;" + 'transform:translate(-50%,-50%);">请框选想要搜索的题目，Esc 取消</div></div>';
    function initCutSearch(onText) {
        const keys = {};
        let overlay = null, box = null, dragging = false, sx = 0, sy = 0;
        function cleanup() {
            dragging = false;
            document.removeEventListener("mousedown", down);
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mouseup", up);
            document.removeEventListener("mouseleave", cleanup);
            if (overlay) {
                overlay.remove();
                overlay = null;
                box = null;
            }
        }
        function down(e) {
            if (!box) return;
            dragging = true;
            sx = e.clientX;
            sy = e.clientY;
            box.style.left = sx + "px";
            box.style.top = sy + "px";
            box.style.width = "0px";
            box.style.height = "0px";
        }
        function move(e) {
            if (!dragging || !box) return;
            const tip = overlay.querySelector(".hc-jietu-tip");
            if (tip) tip.style.display = "none";
            box.style.left = Math.min(e.clientX, sx) + "px";
            box.style.top = Math.min(e.clientY, sy) + "px";
            box.style.width = Math.abs(e.clientX - sx) + "px";
            box.style.height = Math.abs(e.clientY - sy) + "px";
        }
        function toast(msg) {
            const t = document.createElement("div");
            t.textContent = msg;
            t.setAttribute("style", "all:initial;position:fixed;left:50%;top:64px;transform:translateX(-50%);" + "z-index:2147483647;background:#000000a3;color:#fff;font-size:14px;" + "padding:10px 16px;border-radius:8px;");
            document.body.appendChild(t);
            setTimeout(function() {
                t.remove();
            }, 2500);
        }
        const TAINT_TAGS = {
            VIDEO: 1,
            CANVAS: 1,
            EMBED: 1,
            OBJECT: 1
        };
        const MEDIA_TAGS = {
            VIDEO: 1,
            CANVAS: 1,
            EMBED: 1,
            OBJECT: 1,
            AUDIO: 1,
            IMG: 1,
            PICTURE: 1,
            SVG: 1,
            IMAGE: 1,
            IFRAME: 1,
            FRAME: 1
        };
        function render(left, top, width, height, stripMedia) {
            return html2canvas(document.body, {
                x: left + window.pageXOffset,
                y: top + window.pageYOffset,
                width: width,
                height: height,
                useCORS: true,
                logging: false,
                ignoreElements: function(el) {
                    const t = (el.tagName || "").toUpperCase();
                    return stripMedia ? !!MEDIA_TAGS[t] : !!TAINT_TAGS[t];
                }
            }).then(function(canvas) {
                return canvas.toDataURL("image/jpeg", .8).replace("data:image/jpeg;base64,", "");
            });
        }
        function capture(left, top, width, height, mouse) {
            render(left, top, width, height, false).catch(function() {
                return render(left, top, width, height, true);
            }).then(function(b64) {
                return ocrBase64(b64).then(function(txt) {
                    if (txt) onText(txt, mouse); else toast("未识别到文字，请重新框选");
                });
            }).catch(function(err) {
                toast("OCR 服务请求失败，请稍后重试");
                console.warn("[AI智脑Pro] Promise异常:", err.message);
                toast("页面截图失败：" + (err && err.message || "未知原因"));
            });
        }
        const MSG = "hc-cut-shot", ACK = "hc-cut-ack";
        let ackTimer = null;
        window.addEventListener("message", function(ev) {
            const d = ev.data;
            if (!d || typeof d !== "object") return;
            if (d.type === MSG && typeof d.left === "number" && typeof d.top === "number" && typeof d.width === "number" && typeof d.height === "number") {
                try {
                    ev.source.postMessage({
                        type: ACK
                    }, "*");
                } catch (err) { console.warn("[AI智脑Pro] 异常:", e && e.message || 'error'); }
                capture(d.left, d.top, d.width, d.height, {
                    x: d.left + d.width / 2,
                    y: d.top + d.height / 2
                });
            } else if (d.type === ACK && ackTimer) {
                clearTimeout(ackTimer);
                ackTimer = null;
            }
        });
        function up(e) {
            if (!box || box.offsetWidth <= 0 || box.offsetHeight <= 0) {
                cleanup();
                return;
            }
            const rect = box.getBoundingClientRect();
            cleanup();
            let left = rect.left, top = rect.top, frameWin = null;
            try {
                let el = document.elementFromPoint(left + rect.width / 2, top + rect.height / 2);
                while (el && el.tagName === "IFRAME" && el.contentDocument) {
                    const fr = el.getBoundingClientRect();
                    left -= fr.left + el.clientLeft;
                    top -= fr.top + el.clientTop;
                    frameWin = el.contentWindow;
                    el = el.contentDocument.elementFromPoint(left + rect.width / 2, top + rect.height / 2);
                }
            } catch (err) {
                frameWin = null;
            }
            if (frameWin && frameWin !== window) {
                frameWin.postMessage({
                    type: MSG,
                    left: left,
                    top: top,
                    width: rect.width,
                    height: rect.height
                }, "*");
                ackTimer = setTimeout(function() {
                    ackTimer = null;
                    capture(rect.left, rect.top, rect.width, rect.height, {
                        x: e.clientX,
                        y: e.clientY
                    });
                }, 600);
            } else {
                capture(rect.left, rect.top, rect.width, rect.height, {
                    x: e.clientX,
                    y: e.clientY
                });
            }
        }
        function keyName(e) {
            const m = /^Key([A-Z])$/.exec(e.code || "");
            return m ? m[1] : (e.key || "").toUpperCase();
        }
        document.addEventListener("keyup", function(e) {
            delete keys[keyName(e)];
        }, true);
        window.addEventListener("blur", function() {
            for (const k in keys) { if (keys.hasOwnProperty(k)) delete keys[k]; }
        });
        document.addEventListener("keydown", function(e) {
            keys[keyName(e)] = true;
            if (config.cut_search && keys.T && keys.H && !overlay) {
                overlay = document.createElement("div");
                overlay.innerHTML = OVERLAY_HTML;
                document.body.appendChild(overlay);
                box = overlay.querySelector(".hc-jietu-box");
                document.addEventListener("mousedown", down);
                document.addEventListener("mousemove", move);
                document.addEventListener("mouseup", up);
                document.addEventListener("mouseleave", cleanup);
            } else if ((e.key === "Escape" || e.code === "Escape") && overlay) {
                cleanup();
            }
        }, true);
    }
    function removeLimit() {
        if (location.host.indexOf("chaoxing") !== -1) {
            setTimeout(function() {
                try {
                    if (unsafeWindow.UEDITOR_CONFIG) {
                        unsafeWindow.UEDITOR_CONFIG.scaleEnabled = false;
                    }
                } catch (e) { console.warn("[AI智脑Pro] 异常:", e && e.message || 'error'); }
            }, 2e3);
        }
        if (location.href.indexOf("newMooc=true") !== -1 && location.host.indexOf("chaoxing") !== -1 || location.pathname.indexOf("exam/test/reVersionPaperMarkContentNew") !== -1) {
            setTimeout(function() {
                if (document.body) document.body.removeAttribute("onselectstart");
                document.documentElement.style.userSelect = "unset";
                try {
                    if (unsafeWindow.UE && unsafeWindow.UE.EventBase && unsafeWindow.UE.EventBase.prototype) {
                        unsafeWindow.UE.EventBase.prototype.fireEvent = function() {
                            return null;
                        };
                    }
                } catch (e) { console.warn("[AI智脑Pro] 异常:", e && e.message || 'error'); }
            }, 2e3);
        }
    }
    function parseFont(buf) {
        const rU = o => buf[o] << 8 | buf[o + 1];
        const rS = o => {
            const v = rU(o);
            return v & 32768 ? v - 65536 : v;
        };
        const rUint = o => (buf[o] << 24 | buf[o + 1] << 16 | buf[o + 2] << 8 | buf[o + 3]) >>> 0;
        const num = rU(4);
        let p = 12;
        const T = {};
        for (let i = 0; i < num; i++) {
            const tag = String.fromCharCode(buf[p], buf[p + 1], buf[p + 2], buf[p + 3]);
            T[tag] = {
                off: rUint(p + 8),
                len: rUint(p + 12)
            };
            p += 16;
        }
        if (!T.glyf || !T.loca || !T.maxp || !T.head || !T.cmap) return null;
        const numGlyphs = rU(T.maxp.off + 4);
        const longLoca = rS(T.head.off + 50) !== 0;
        const loca = [];
        const lo = T.loca.off;
        for (let i = 0; i <= numGlyphs; i++) loca.push(longLoca ? rUint(lo + i * 4) : rU(lo + i * 2) * 2);
        const cm = T.cmap.off, nt = rU(cm + 2);
        let f4 = -1;
        for (let i = 0; i < nt; i++) {
            const off = rUint(cm + 4 + i * 8 + 4);
            if (rU(cm + off) === 4) {
                f4 = cm + off;
                break;
            }
        }
        const map = {};
        if (f4 >= 0) {
            const segX2 = rU(f4 + 6), segC = segX2 / 2;
            const endO = f4 + 14, startO = endO + segX2 + 2, deltaO = startO + segX2, rangeO = deltaO + segX2;
            for (let s = 0; s < segC; s++) {
                const end = rU(endO + s * 2), start = rU(startO + s * 2), delta = rU(deltaO + s * 2), ro = rU(rangeO + s * 2);
                if (start === 65535) continue;
                for (let ch = start; ch <= end; ch++) {
                    let g;
                    if (ro === 0) g = ch + delta & 65535; else {
                        const gi = rU(rangeO + s * 2 + ro + (ch - start) * 2);
                        g = gi === 0 ? 0 : gi + delta & 65535;
                    }
                    if (g) map[ch] = g;
                }
            }
        }
        return {
            buf: buf,
            rU: rU,
            rS: rS,
            T: T,
            loca: loca,
            numGlyphs: numGlyphs,
            map: map
        };
    }
    function parseGlyf(F, g) {
        const {
            buf,
            rU,
            rS,
            T,
            loca
        } = F;
        if (loca[g] === loca[g + 1]) return null;
        let o = T.glyf.off + loca[g];
        const gl = {};
        gl.noc = rS(o);
        o += 2;
        gl.xMin = rS(o);
        o += 2;
        gl.yMin = rS(o);
        o += 2;
        gl.xMax = rS(o);
        o += 2;
        gl.yMax = rS(o);
        o += 2;
        if (gl.xMin >= gl.xMax || gl.yMin >= gl.yMax) return null;
        if (gl.noc > 0) {
            gl.endPts = [];
            for (let i = 0; i < gl.noc; i++) {
                gl.endPts.push(rU(o));
                o += 2;
            }
            const il = rU(o);
            o += 2;
            if (buf.length - o < il) return null;
            o += il;
            const cn = gl.endPts[gl.noc - 1] + 1;
            gl.flags = [];
            for (let i = 0; i < cn; i++) {
                const f = buf[o++];
                gl.flags.push(f);
                if (f & 8) {
                    let r = buf[o++];
                    for (let j = 0; j < r; j++) {
                        gl.flags.push(f);
                        i++;
                    }
                }
            }
            gl.xs = [];
            for (let i = 0; i < cn; i++) {
                const i8 = (gl.flags[i] & 2) !== 0, sm = (gl.flags[i] & 16) !== 0;
                if (i8) {
                    gl.xs.push(sm ? buf[o] : -buf[o]);
                    o++;
                } else {
                    if (sm) gl.xs.push(0); else {
                        gl.xs.push(rS(o));
                        o += 2;
                    }
                }
            }
            gl.ys = [];
            for (let i = 0; i < cn; i++) {
                const i8 = (gl.flags[i] & 4) !== 0, sm = (gl.flags[i] & 32) !== 0;
                if (i8) {
                    gl.ys.push(sm ? buf[o] : -buf[o]);
                    o++;
                } else {
                    if (sm) gl.ys.push(0); else {
                        gl.ys.push(rS(o));
                        o += 2;
                    }
                }
            }
            let x = 0, y = 0;
            for (let i = 0; i < cn; i++) {
                x += gl.xs[i];
                y += gl.ys[i];
                gl.xs[i] = x;
                gl.ys[i] = y;
            }
        } else {
            gl.parts = [];
            let flags;
            do {
                flags = rU(o);
                o += 2;
                const part = {
                    m: {
                        a: 1,
                        b: 0,
                        c: 0,
                        d: 1,
                        tx: 0,
                        ty: 0
                    },
                    p1: -1,
                    p2: -1
                };
                gl.parts.push(part);
                part.glyphIndex = rU(o);
                o += 2;
                let a1, a2;
                if (flags & 1) {
                    a1 = rS(o);
                    o += 2;
                    a2 = rS(o);
                    o += 2;
                } else {
                    a1 = buf[o] << 24 >> 24;
                    o++;
                    a2 = buf[o] << 24 >> 24;
                    o++;
                }
                if (flags & 2) {
                    part.m.tx = a1;
                    part.m.ty = a2;
                } else {
                    part.p1 = a1;
                    part.p2 = a2;
                }
                const f2 = oo => rS(oo) / 16384;
                if (flags & 8) {
                    part.m.a = part.m.d = f2(o);
                    o += 2;
                } else if (flags & 64) {
                    part.m.a = f2(o);
                    o += 2;
                    part.m.d = f2(o);
                    o += 2;
                } else if (flags & 128) {
                    part.m.a = f2(o);
                    o += 2;
                    part.m.b = f2(o);
                    o += 2;
                    part.m.c = f2(o);
                    o += 2;
                    part.m.d = f2(o);
                    o += 2;
                }
            } while (flags & 32);
        }
        return gl;
    }
    const P = {
        M: (p, x, y) => {
            p.cmds.push("M");
            p.crds.push(x, y);
        },
        L: (p, x, y) => {
            p.cmds.push("L");
            p.crds.push(x, y);
        },
        Q: (p, a, b, c, d) => {
            p.cmds.push("Q");
            p.crds.push(a, b, c, d);
        },
        Z: p => {
            p.cmds.push("Z");
        }
    };
    function drawGlyf(F, g, path) {
        const gl = parseGlyf(F, g);
        if (!gl) return;
        if (gl.noc > -1) simple(gl, path); else compo(F, gl, path);
    }
    function simple(gl, p) {
        for (let c = 0; c < gl.noc; c++) {
            const i0 = c === 0 ? 0 : gl.endPts[c - 1] + 1, il = gl.endPts[c];
            for (let i = i0; i <= il; i++) {
                const pr = i === i0 ? il : i - 1, nx = i === il ? i0 : i + 1;
                const on = gl.flags[i] & 1, prOn = gl.flags[pr] & 1, nxOn = gl.flags[nx] & 1;
                const x = gl.xs[i], y = gl.ys[i];
                if (i === i0) {
                    if (on) {
                        if (prOn) P.M(p, gl.xs[pr], gl.ys[pr]); else {
                            P.M(p, x, y);
                            continue;
                        }
                    } else {
                        if (prOn) P.M(p, gl.xs[pr], gl.ys[pr]); else P.M(p, Math.floor((gl.xs[pr] + x) * .5), Math.floor((gl.ys[pr] + y) * .5));
                    }
                }
                if (on) {
                    if (prOn) P.L(p, x, y);
                } else {
                    if (nxOn) P.Q(p, x, y, gl.xs[nx], gl.ys[nx]); else P.Q(p, x, y, Math.floor((x + gl.xs[nx]) * .5), Math.floor((y + gl.ys[nx]) * .5));
                }
            }
            P.Z(p);
        }
    }
    function compo(F, gl, p) {
        for (let j = 0; j < gl.parts.length; j++) {
            const path = {
                cmds: [],
                crds: []
            };
            const prt = gl.parts[j];
            drawGlyf(F, prt.glyphIndex, path);
            const m = prt.m;
            for (let i = 0; i < path.crds.length; i += 2) {
                const x = path.crds[i], y = path.crds[i + 1];
                p.crds.push(x * m.a + y * m.b + m.tx);
                p.crds.push(x * m.c + y * m.d + m.ty);
            }
            for (let i = 0; i < path.cmds.length; i++) p.cmds.push(path.cmds[i]);
        }
    }
    function glyphToPath(F, g) {
        const path = {
            cmds: [],
            crds: []
        };
        drawGlyf(F, g, path);
        return {
            cmds: path.cmds,
            crds: path.crds
        };
    }
    function md5(s) {
        function rl(n, c) {
            return n << c | n >>> 32 - c;
        }
        function ad(a, b) {
            const l = (a & 65535) + (b & 65535);
            const m = (a >> 16) + (b >> 16) + (l >> 16);
            return m << 16 | l & 65535;
        }
        function cmn(q, a, b, x, s, t) {
            return ad(rl(ad(ad(a, q), ad(x, t)), s), b);
        }
        function ff(a, b, c, d, x, s, t) {
            return cmn(b & c | ~b & d, a, b, x, s, t);
        }
        function gg(a, b, c, d, x, s, t) {
            return cmn(b & d | c & ~d, a, b, x, s, t);
        }
        function hh(a, b, c, d, x, s, t) {
            return cmn(b ^ c ^ d, a, b, x, s, t);
        }
        function ii(a, b, c, d, x, s, t) {
            return cmn(c ^ (b | ~d), a, b, x, s, t);
        }
        const utf8 = unescape(encodeURIComponent(s));
        const n = utf8.length, blks = [];
        for (let i = 0; i < n * 8; i += 8) blks[i >> 5] |= (utf8.charCodeAt(i / 8) & 255) << i % 32;
        blks[n * 8 >> 5] |= 128 << n * 8 % 32;
        blks[(n * 8 + 64 >>> 9 << 4) + 14] = n * 8;
        let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
        for (let i = 0; i < blks.length; i += 16) {
            const oa = a, ob = b, oc = c, od = d;
            a = ff(a, b, c, d, blks[i + 0] | 0, 7, -680876936);
            d = ff(d, a, b, c, blks[i + 1] | 0, 12, -389564586);
            c = ff(c, d, a, b, blks[i + 2] | 0, 17, 606105819);
            b = ff(b, c, d, a, blks[i + 3] | 0, 22, -1044525330);
            a = ff(a, b, c, d, blks[i + 4] | 0, 7, -176418897);
            d = ff(d, a, b, c, blks[i + 5] | 0, 12, 1200080426);
            c = ff(c, d, a, b, blks[i + 6] | 0, 17, -1473231341);
            b = ff(b, c, d, a, blks[i + 7] | 0, 22, -45705983);
            a = ff(a, b, c, d, blks[i + 8] | 0, 7, 1770035416);
            d = ff(d, a, b, c, blks[i + 9] | 0, 12, -1958414417);
            c = ff(c, d, a, b, blks[i + 10] | 0, 17, -42063);
            b = ff(b, c, d, a, blks[i + 11] | 0, 22, -1990404162);
            a = ff(a, b, c, d, blks[i + 12] | 0, 7, 1804603682);
            d = ff(d, a, b, c, blks[i + 13] | 0, 12, -40341101);
            c = ff(c, d, a, b, blks[i + 14] | 0, 17, -1502002290);
            b = ff(b, c, d, a, blks[i + 15] | 0, 22, 1236535329);
            a = gg(a, b, c, d, blks[i + 1] | 0, 5, -165796510);
            d = gg(d, a, b, c, blks[i + 6] | 0, 9, -1069501632);
            c = gg(c, d, a, b, blks[i + 11] | 0, 14, 643717713);
            b = gg(b, c, d, a, blks[i + 0] | 0, 20, -373897302);
            a = gg(a, b, c, d, blks[i + 5] | 0, 5, -701558691);
            d = gg(d, a, b, c, blks[i + 10] | 0, 9, 38016083);
            c = gg(c, d, a, b, blks[i + 15] | 0, 14, -660478335);
            b = gg(b, c, d, a, blks[i + 4] | 0, 20, -405537848);
            a = gg(a, b, c, d, blks[i + 9] | 0, 5, 568446438);
            d = gg(d, a, b, c, blks[i + 14] | 0, 9, -1019803690);
            c = gg(c, d, a, b, blks[i + 3] | 0, 14, -187363961);
            b = gg(b, c, d, a, blks[i + 8] | 0, 20, 1163531501);
            a = gg(a, b, c, d, blks[i + 13] | 0, 5, -1444681467);
            d = gg(d, a, b, c, blks[i + 2] | 0, 9, -51403784);
            c = gg(c, d, a, b, blks[i + 7] | 0, 14, 1735328473);
            b = gg(b, c, d, a, blks[i + 12] | 0, 20, -1926607734);
            a = hh(a, b, c, d, blks[i + 5] | 0, 4, -378558);
            d = hh(d, a, b, c, blks[i + 8] | 0, 11, -2022574463);
            c = hh(c, d, a, b, blks[i + 11] | 0, 16, 1839030562);
            b = hh(b, c, d, a, blks[i + 14] | 0, 23, -35309556);
            a = hh(a, b, c, d, blks[i + 1] | 0, 4, -1530992060);
            d = hh(d, a, b, c, blks[i + 4] | 0, 11, 1272893353);
            c = hh(c, d, a, b, blks[i + 7] | 0, 16, -155497632);
            b = hh(b, c, d, a, blks[i + 10] | 0, 23, -1094730640);
            a = hh(a, b, c, d, blks[i + 13] | 0, 4, 681279174);
            d = hh(d, a, b, c, blks[i + 0] | 0, 11, -358537222);
            c = hh(c, d, a, b, blks[i + 3] | 0, 16, -722521979);
            b = hh(b, c, d, a, blks[i + 6] | 0, 23, 76029189);
            a = hh(a, b, c, d, blks[i + 9] | 0, 4, -640364487);
            d = hh(d, a, b, c, blks[i + 12] | 0, 11, -421815835);
            c = hh(c, d, a, b, blks[i + 15] | 0, 16, 530742520);
            b = hh(b, c, d, a, blks[i + 2] | 0, 23, -995338651);
            a = ii(a, b, c, d, blks[i + 0] | 0, 6, -198630844);
            d = ii(d, a, b, c, blks[i + 7] | 0, 10, 1126891415);
            c = ii(c, d, a, b, blks[i + 14] | 0, 15, -1416354905);
            b = ii(b, c, d, a, blks[i + 5] | 0, 21, -57434055);
            a = ii(a, b, c, d, blks[i + 12] | 0, 6, 1700485571);
            d = ii(d, a, b, c, blks[i + 3] | 0, 10, -1894986606);
            c = ii(c, d, a, b, blks[i + 10] | 0, 15, -1051523);
            b = ii(b, c, d, a, blks[i + 1] | 0, 21, -2054922799);
            a = ii(a, b, c, d, blks[i + 8] | 0, 6, 1873313359);
            d = ii(d, a, b, c, blks[i + 15] | 0, 10, -30611744);
            c = ii(c, d, a, b, blks[i + 6] | 0, 15, -1560198380);
            b = ii(b, c, d, a, blks[i + 13] | 0, 21, 1309151649);
            a = ii(a, b, c, d, blks[i + 4] | 0, 6, -145523070);
            d = ii(d, a, b, c, blks[i + 11] | 0, 10, -1120210379);
            c = ii(c, d, a, b, blks[i + 2] | 0, 15, 718787259);
            b = ii(b, c, d, a, blks[i + 9] | 0, 21, -343485551);
            a = ad(a, oa);
            b = ad(b, ob);
            c = ad(c, oc);
            d = ad(d, od);
        }
        const x = [ a, b, c, d ];
        let hex = "";
        for (let i = 0; i < 16; i++) hex += (x[i >> 2] >> i % 4 * 8 & 255).toString(16).padStart(2, "0");
        return hex;
    }
    function base64ToUint8Array(base64) {
        const data = window.atob(base64);
        const buffer = new Uint8Array(data.length);
        for (let i = 0; i < data.length; ++i) buffer[i] = data.charCodeAt(i);
        return buffer;
    }
    let TABLE = null;
    function getTable() {
        if (TABLE) return TABLE;
        try {
            TABLE = JSON.parse(GM_getResourceText("TableTH"));
        } catch (e) {
            TABLE = {};
        }
        return TABLE;
    }
    function buildMap(base64) {
        const F = parseFont(base64ToUint8Array(base64));
        if (!F) return null;
        const table = getTable();
        const map = {};
        for (const codeStr in F.map) {
            if (!F.map.hasOwnProperty(codeStr)) continue;
            const code = +codeStr;
            const hash = md5(JSON.stringify(glyphToPath(F, F.map[code]))).slice(24);
            const real = table[hash];
            if (real) map[code] = String.fromCharCode(real);
        }
        return map;
    }
    function replaceText(root, map) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        const nodes = [];
        let n;
        while (n = walker.nextNode()) nodes.push(n);
        for (let i = 0; i < nodes.length; i++) {
            const t = nodes[i];
            let out = "", changed = false;
            const s = t.nodeValue;
            for (let j = 0; j < s.length; j++) {
                const code = s.charCodeAt(j);
                if (map[code] !== undefined) {
                    out += map[code];
                    changed = true;
                } else out += s[j];
            }
            if (changed) t.nodeValue = out;
        }
    }
    function decryptAll(map) {
        const els = document.querySelectorAll(".font-cxsecret");
        for (let i = 0; i < els.length; i++) {
            replaceText(els[i], map);
            els[i].classList.remove("font-cxsecret");
        }
    }
    function fixChaoxingFont() {
        const styles = document.querySelectorAll("style");
        let map = null;
        for (let i = 0; i < styles.length; i++) {
            if (styles[i].textContent.indexOf("font-cxsecret") === -1) continue;
            const m = styles[i].textContent.match(/base64,([\w\W]+?)'/);
            if (!m) continue;
            const sub = buildMap(m[1]);
            if (sub) map = Object.assign(map || {}, sub);
        }
        if (!map || !Object.keys(map).length) return;
        decryptAll(map);
        const obs = new MutationObserver(function() {
            decryptAll(map);
        });
        obs.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    function fixYuketang() {
        const intv = setInterval(function() {
            try {
                const examEl = top.document.querySelector(".exam");
                if (!examEl || !examEl.__vue__) { return; }
                examEl.__vue__.handleHangUpTip = function() {};
                const querySelector = top.document.querySelector;
                top.document.querySelector = function() {
                    if (arguments[0] === "#hc-search-host") return null;
                    return querySelector.apply(this, arguments);
                };
                clearInterval(intv);
            } catch (e) { /* 不存在就不管 */ }
        }, 100);
    }
    function startFontFix() {
        try {
            fixYuketang();
        } catch (e) { console.warn("[AI智脑Pro] 异常:", e && e.message || '未知'); }
        setTimeout(function() {
            try {
                fixChaoxingFont();
            } catch (e) { console.warn("[AI智脑Pro] 异常:", e && e.message || '未知'); }
        }, 1e3);
    }
    initApp();
    initSelection(search);
    initCutSearch(search);
    // ===== 主题同步：读取主脚本的主题设置并监听变化 =====
    (function syncTheme() {
        function applyDarkMode(isDark) {
            try {
                var host = document.getElementById(HOST_ID);
                if (!host) {
                    try { host = top.document.getElementById(HOST_ID); } catch(_) { host = null; }
                }
                if (!host) return;
                var shadow = host._shadow || host.shadowRoot;
                if (!shadow) return;
                var wrap = shadow.querySelector('.panel');
                if (wrap) wrap.classList.toggle('dark', isDark);
            } catch (e) {}
        }
        function getResolvedTheme() {
            try {
                var t = localStorage.getItem('cxaiSetting.theme') || 'auto';
                if (t === 'auto') return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                return t;
            } catch (e) { return 'light'; }
        }
        // 监听主脚本主题变化事件（当前窗口 + top 窗口）
        function onThemeChange(e) {
            var theme = (e.detail && e.detail.theme) || 'auto';
            var resolved = theme;
            if (theme === 'auto') resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            applyDarkMode(resolved === 'dark');
        }
        window.addEventListener('cxai-theme-change', onThemeChange);
        try { top.window.addEventListener('cxai-theme-change', onThemeChange); } catch (e) {}
        // 监听系统主题变化（auto模式）
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
            if ((localStorage.getItem('cxaiSetting.theme') || 'auto') === 'auto') {
                applyDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
            }
        });
    })();
    if (config.remove_limit) {
        removeLimit();
        startFontFix();
    }
    GM_registerMenuCommand("AI 智脑·搜题", openManual);
    GM_registerMenuCommand("AI 智脑·设置", openSettings);
})(); } catch(e) { console.warn('[AI智脑Pro] 搜题模块异常已捕获:', e.message); }
