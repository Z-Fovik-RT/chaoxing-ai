// ==UserScript==
// @name         学习通AI助手 | Chaoxing AI Assistant
// @namespace    https://github.com/chaoxing-ai-assistant
// @version      1.0.0
// @description  学习通自动播放视频、AI答题（支持DeepSeek/通义千问/智谱/Kimi/OpenAI/Claude/文心一言/豆包/Mimo/硅基流动），字体解密，答案缓存
// @author       ChaoxingAI
// @icon         data:image/png;base64,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
// @match        *://*.chaoxing.com/*
// @match        *://*.neauce.com/*
// @match        *://*.edu.cn/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @connect      api.deepseek.com
// @connect      dashscope.aliyuncs.com
// @connect      open.bigmodel.cn
// @connect      api.moonshot.cn
// @connect      api.openai.com
// @connect      api.anthropic.com
// @connect      aip.baidubce.com
// @connect      qianfan.baidubce.com
// @connect      ark.cn-beijing.volces.com
// @connect      token-plan-cn.xiaomimimo.com
// @connect      api.siliconflow.cn
// @connect      lyck6.cn
// @connect      *
// @resource     fontTable https://116611.xyz/table.json
// @require      https://scriptcat.org/lib/668/1.0/TyprMd5.js
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    /* ===== SECTION 1: CONSTANTS & CONFIG ===== */

    // Logger类 - 支持日志级别和时间戳
    class Logger {
        constructor(prefix = 'ChaoxingAI') {
            this.prefix = prefix;
            this.levels = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
            this.currentLevel = this.levels.INFO;
        }

        setLevel(level) {
            if (this.levels[level] !== undefined) {
                this.currentLevel = this.levels[level];
            }
        }

        log(level, ...args) {
            if (this.levels[level] >= this.currentLevel) {
                const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false });
                const prefix = `[${this.prefix}][${level}][${timestamp}]`;
                switch (level) {
                    case 'ERROR':
                        console.error(prefix, ...args);
                        break;
                    case 'WARN':
                        console.warn(prefix, ...args);
                        break;
                    case 'DEBUG':
                        console.debug(prefix, ...args);
                        break;
                    default:
                        console.log(prefix, ...args);
                }
            }
        }

        debug(...args) { this.log('DEBUG', ...args); }
        info(...args) { this.log('INFO', ...args); }
        warn(...args) { this.log('WARN', ...args); }
        error(...args) { this.log('ERROR', ...args); }
    }

    const logger = new Logger('ChaoxingAI');

    // PerformanceMonitor类 - 性能监控
    class PerformanceMonitor {
        constructor() {
            this.metrics = new Map();
            this.startTimes = new Map();
        }

        start(name) {
            this.startTimes.set(name, performance.now());
        }

        end(name) {
            const startTime = this.startTimes.get(name);
            if (startTime) {
                const duration = performance.now() - startTime;
                this.metrics.set(name, duration);
                this.startTimes.delete(name);
                logger.debug(`Performance [${name}]: ${duration.toFixed(2)}ms`);
                return duration;
            }
            return 0;
        }

        getMetric(name) {
            return this.metrics.get(name) || 0;
        }

        getAllMetrics() {
            return Object.fromEntries(this.metrics);
        }
    }

    const perfMonitor = new PerformanceMonitor();

    const PROVIDERS = {
        deepseek: {
            name: 'DeepSeek',
            endpoint: 'https://api.deepseek.com/v1/chat/completions',
            models: ['deepseek-v4-pro', 'deepseek-v4-flash', 'deepseek-chat', 'deepseek-reasoner'],
            authType: 'bearer',
            format: 'openai',
        },
        qwen: {
            name: '通义千问 (Qwen)',
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            models: ['qwen3.6-plus', 'qwen3.6', 'qwen3.5-omni', 'qwen-turbo', 'qwen-plus', 'qwen-max'],
            authType: 'bearer',
            format: 'openai',
        },
        zhipu: {
            name: '智谱 (GLM)',
            endpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
            models: ['glm-4.7', 'glm-4.7-flash', 'glm-4.6', 'glm-4-plus', 'glm-4'],
            authType: 'bearer',
            format: 'openai',
        },
        kimi: {
            name: 'Kimi (Moonshot)',
            endpoint: 'https://api.moonshot.cn/v1/chat/completions',
            models: ['kimi-k2.6', 'kimi-k2-turbo-preview', 'moonshot-v1-128k', 'moonshot-v1-32k', 'moonshot-v1-8k'],
            authType: 'bearer',
            format: 'openai',
        },
        openai: {
            name: 'OpenAI',
            endpoint: 'https://api.openai.com/v1/chat/completions',
            models: ['gpt-5.4', 'gpt-5', 'gpt-4.1', 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
            authType: 'bearer',
            format: 'openai',
        },
        claude: {
            name: 'Claude (Anthropic)',
            endpoint: 'https://api.anthropic.com/v1/messages',
            models: ['claude-opus-4.6', 'claude-sonnet-4.6', 'claude-haiku-4.5'],
            authType: 'x-api-key',
            format: 'anthropic',
        },
        ernie: {
            name: '文心一言 (ERNIE)',
            endpoint: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/',
            models: ['ernie-5.1', 'ernie-4.5', 'ernie-4.0-8k', 'ernie-3.5-8k', 'ernie-speed-128k'],
            authType: 'oauth',
            format: 'ernie',
        },
        doubao: {
            name: '豆包 (Doubao)',
            endpoint: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
            models: ['doubao-seed-2.0-pro-256k', 'doubao-seed-2.0-lite-256k', 'doubao-seed-2.0-code', 'doubao-seed-2.0-mini'],
            authType: 'bearer',
            format: 'openai',
        },
        mimo: {
            name: 'Mimo (小米)',
            endpoint: 'https://token-plan-cn.xiaomimimo.com/v1/chat/completions',
            models: ['mimo-v2.5-pro', 'mimo-v2.5', 'mimo-v2.5-omni'],
            authType: 'bearer',
            format: 'openai',
        },
        siliconflow: {
            name: '硅基流动 (SiliconFlow)',
            endpoint: 'https://api.siliconflow.cn/v1/chat/completions',
            models: ['DeepSeek-V4-Pro', 'Qwen/Qwen3.6-35B-A3B', 'THUDM/glm-4.7', 'meta-llama/Meta-Llama-3.1-70B-Instruct', 'Kimi/K2.6'],
            authType: 'bearer',
            format: 'openai',
        },
    };

    const DEFAULT_SETTINGS = {
        // AI配置
        provider: 'deepseek',
        apiKey: '',
        ernieSecretKey: '',
        model: 'deepseek-v4-pro',
        temperature: 0.1,
        maxTokens: 1024,
        reqIntervalTime: 2,
        // 视频配置
        autoPlayVideo: true,
        videoRate: 1,
        autoMute: true,              // 真实播放时自动静音
        smartSpeed: false,            // 智能变速 ±0.2x
        behaviorSim: false,           // 行为模拟：随机鼠标/点击
        detectionEvasion: false,      // 反检测：速度微扰 ±5%
        videoQuestions: true,         // 自动处理视频内题目
        // 答题配置
        autoAnswerQuiz: true,
        autoAnswerExam: false,
        fillDelay: 1500,
        goodStudentMode: false,       // 只显示答案不自动选择
        randomAnswer: false,          // 无匹配时随机答题
        accuracyThreshold: 80,        // 准确率阈值%
        redo: false,                  // 重做模式：已答题时重新AI作答覆盖旧答案
        autoSubmit: true,             // 自动提交（所有题都有答案时）
        forceSubmit: false,           // 强制提交（即使有题目无答案）
        alterTitle: false,            // 将AI答案插入题干显示
        // 章节导航
        jumpMode: 1,                  // 0=智能 1=遍历 2=不跳转
        autoChapterStudy: false,      // 自动刷章节
        reviewMode: false,            // 复习模式：重新处理已完成任务
        autoSave: true,               // 自动保存：不提交时保存答案
        bgHangMode: false,            // 后台挂机：防休眠+标题切换
        // 缓存与通用
        cacheEnabled: true,
        showPanel: true,
        fontDecrypt: true,
        fuzzyMatch: true,
        unlockPaste: true,
        // 题库适配器
        questionBankUrl: '',          // 自定义题库URL
        // 第三方题库API (lyck6.cn)
        thirdPartyApiEnabled: false,  // 启用第三方题库
        thirdPartyApiToken: '',       // 付费token（10位，留空则走免费接口）
        thirdPartyGpt: -1,            // GPT模式: -1=关闭 0=开启
        // 反检测
        monitorBypass: false,         // 多设备监控绕过
        antiSleep: false,             // 防休眠
        autoRefresh: false,           // 自动刷新
        refreshInterval: 30,          // 自动刷新间隔(分钟)
        // 自动登录
        autoLogin: false,
        loginPhone: '',
        loginPass: '',
    };

    const Settings = {
        get(key) {
            return GM_getValue(key, DEFAULT_SETTINGS[key] !== undefined ? DEFAULT_SETTINGS[key] : undefined);
        },
        set(key, value) {
            GM_setValue(key, value);
        },
        getAll() {
            const result = {};
            for (const key of Object.keys(DEFAULT_SETTINGS)) {
                result[key] = this.get(key);
            }
            return result;
        },
        reset() {
            for (const key of Object.keys(DEFAULT_SETTINGS)) {
                GM_setValue(key, DEFAULT_SETTINGS[key]);
            }
        },
    };

    /* ===== SECTION 2: AI PROVIDER ABSTRACTION ===== */

    const SYSTEM_PROMPT = `你是一个精确的答题助手。请严格按照要求的格式回答，不要添加多余解释。`;

    // 根据题型自适应AI参数
    function getModelParams(questionType) {
        const preciseTypes = ['single', 'multiple', 'blank', 'cloze', 'judge', 'term', 'fill'];
        if (preciseTypes.includes(questionType)) {
            return { temperature: 0.1, max_tokens: 1024, top_p: 0.1 };
        }
        return { temperature: 0.5, max_tokens: 1024, top_p: 0.8 };
    }

    function buildOpenAIRequest(systemPrompt, userMsg, opts) {
        return {
            model: opts.model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMsg },
            ],
            temperature: opts.temperature,
            max_tokens: opts.maxTokens,
            top_p: opts.topP ?? 1,
        };
    }

    function buildClaudeRequest(systemPrompt, userMsg, opts) {
        return {
            model: opts.model,
            max_tokens: opts.maxTokens,
            system: systemPrompt,
            messages: [{ role: 'user', content: userMsg }],
            temperature: opts.temperature,
        };
    }

    function buildERNIERequest(systemPrompt, userMsg, opts) {
        return {
            messages: [{ role: 'user', content: systemPrompt + '\n\n' + userMsg }],
            temperature: opts.temperature,
            max_output_tokens: opts.maxTokens,
        };
    }

    function parseResponse(format, raw) {
        // 检查API错误响应
        if (raw.error) {
            const msg = raw.error.message || raw.error.msg || JSON.stringify(raw.error);
            throw new Error('API错误: ' + msg);
        }

        let result;
        switch (format) {
            case 'openai':
                if (!raw.choices || !raw.choices[0] || !raw.choices[0].message) {
                    throw new Error('OpenAI响应格式异常: ' + JSON.stringify(raw).slice(0, 200));
                }
                result = raw.choices[0].message.content || '';
                // 兼容推理模型：content为空时尝试从reasoning_content提取答案
                if (!result.trim() && raw.choices[0].message.reasoning_content) {
                    const reasoning = raw.choices[0].message.reasoning_content.trim();
                    // 尝试匹配常见答案模式: "答案是X", "选X", "答案：X", "正确答案是X"
                    const patterns = [
                        /答案[是为：:]\s*(.+)/,
                        /选\s*([A-Da-d]+)/,
                        /正确[的]?[选答][项案]?[是为：:]\s*(.+)/,
                        /[因此所以][，,]?\s*(.+)$/m,
                    ];
                    for (const p of patterns) {
                        const m = reasoning.match(p);
                        if (m && m[1].trim().length > 0) { result = m[1].trim(); break; }
                    }
                    // 仍未匹配，取最后非空行
                    if (!result.trim()) {
                        const lines = reasoning.split('\n').filter(l => l.trim());
                        if (lines.length > 0) result = lines[lines.length - 1].trim();
                    }
                }
                break;
            case 'anthropic':
                if (!raw.content || !raw.content[0]) {
                    throw new Error('Claude响应格式异常: ' + JSON.stringify(raw).slice(0, 200));
                }
                result = raw.content[0].text;
                break;
            case 'ernie':
                result = raw.result;
                break;
            default:
                throw new Error('Unknown format: ' + format);
        }

        if (!result || (typeof result === 'string' && result.trim().length === 0)) {
            throw new Error('API返回空答案，原始响应: ' + JSON.stringify(raw).slice(0, 300));
        }
        return result;
    }

    async function getERNIEToken() {
        const cached = GM_getValue('ernie_token', null);
        if (cached && cached.expiresAt > Date.now()) return cached.accessToken;

        const apiKey = Settings.get('apiKey');
        const secretKey = Settings.get('ernieSecretKey');
        if (!apiKey || !secretKey) throw new Error('ERNIE需要API Key和Secret Key');

        const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`;
        const resp = await gmRequest('POST', url, { 'Content-Type': 'application/json' }, '');
        const data = JSON.parse(resp.responseText);
        GM_setValue('ernie_token', {
            accessToken: data.access_token,
            expiresAt: Date.now() + (data.expires_in - 86400) * 1000,
        });
        return data.access_token;
    }

    function gmRequest(method, url, headers, data) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method,
                url,
                headers,
                data,
                timeout: 60000,
                onload: (resp) => {
                    if (resp.status >= 200 && resp.status < 300) {
                        resolve(resp);
                    } else {
                        reject(new Error(`HTTP ${resp.status}: ${resp.responseText.slice(0, 200)}`));
                    }
                },
                onerror: (err) => reject(new Error('Network error')),
                ontimeout: () => reject(new Error('Request timeout (60s)')),
            });
        });
    }

    class RequestQueue {
        constructor(maxConcurrent = 2, delayMs = 1500) {
            this.queue = [];
            this.running = 0;
            this.maxConcurrent = maxConcurrent;
            this.delayMs = delayMs;
        }
        enqueue(fn) {
            return new Promise((resolve, reject) => {
                this.queue.push({ fn, resolve, reject });
                this._process();
            });
        }
        _process() {
            if (this.running >= this.maxConcurrent || this.queue.length === 0) return;
            this.running++;
            const { fn, resolve, reject } = this.queue.shift();
            fn()
                .then(resolve)
                .catch(reject)
                .finally(() => {
                    this.running--;
                    setTimeout(() => this._process(), this.delayMs);
                });
        }
    }

    const aiQueue = new RequestQueue(2, (Settings.get('reqIntervalTime') || 2) * 1000);

    // 搜题节流：记录下次允许发起AI请求的时间戳
    let _nextAiAllowedAt = 0;

    async function callAI(userMsg, opts = {}) {
        const providerKey = Settings.get('provider');
        const provider = PROVIDERS[providerKey];
        if (!provider) throw new Error('未知的Provider: ' + providerKey);

        const apiKey = Settings.get('apiKey');
        if (!apiKey) throw new Error('请先配置API Key');

        // 自适应参数：如果指定了questionType，自动调整temperature/maxTokens
        const adaptive = opts.questionType ? getModelParams(opts.questionType) : {};
        const settings = {
            model: opts.model || Settings.get('model'),
            temperature: opts.temperature ?? adaptive.temperature ?? Settings.get('temperature'),
            maxTokens: opts.maxTokens || adaptive.max_tokens || Settings.get('maxTokens'),
            topP: opts.topP ?? adaptive.top_p ?? 1,
        };

        return aiQueue.enqueue(async () => {
            let url = provider.endpoint;
            const headers = { 'Content-Type': 'application/json' };
            let body;

            if (provider.format === 'openai') {
                headers['Authorization'] = `Bearer ${apiKey}`;
                body = JSON.stringify(buildOpenAIRequest(SYSTEM_PROMPT, userMsg, settings));
            } else if (provider.format === 'anthropic') {
                headers['x-api-key'] = apiKey;
                headers['anthropic-version'] = '2023-06-01';
                body = JSON.stringify(buildClaudeRequest(SYSTEM_PROMPT, userMsg, settings));
            } else if (provider.format === 'ernie') {
                const token = await getERNIEToken();
                url = `${url}${settings.model}?access_token=${token}`;
                body = JSON.stringify(buildERNIERequest(SYSTEM_PROMPT, userMsg, settings));
            }

            const maxRetries = 3;
            for (let attempt = 0; attempt < maxRetries; attempt++) {
                try {
                    const resp = await gmRequest('POST', url, headers, body);
                    const raw = JSON.parse(resp.responseText);
                    return parseResponse(provider.format, raw);
                } catch (err) {
                    if (err.message.includes('401') || err.message.includes('403')) {
                        throw new Error('API Key无效，请检查设置');
                    }
                    if (err.message.includes('429') || /HTTP 5\d{2}/.test(err.message) || err.message.includes('timeout')) {
                        if (attempt < maxRetries - 1) {
                            await sleep(Math.pow(2, attempt) * 1000 + Math.random() * 1000);
                            continue;
                        }
                    }
                    throw err;
                }
            }
        });
    }

    /* ===== SECTION 3: ANSWER CACHE ===== */

    function hashQuestion(text) {
        const normalized = text.trim().replace(/\s+/g, ' ').toLowerCase();
        let hash = 0;
        for (let i = 0; i < normalized.length; i++) {
            hash = ((hash << 5) - hash) + normalized.charCodeAt(i);
            hash |= 0;
        }
        return 'q_' + Math.abs(hash).toString(36);
    }

    // 字符串标准化函数 - 从参考3改进
    function formatString(src) {
        if (!src) return '';
        src = String(src);
        // HTML解码
        src = src.includes("img") || src.includes("iframe") ? src : HTMLDecode(src);
        // 全角转半角
        src = src.replace(/[\uff01-\uff5e]/g, function(str) {
            return String.fromCharCode(str.charCodeAt(0) - 65248);
        });
        // 特殊字符标准化
        return src.replace(/\s+/g, " ")
            .replace(/[""]/g, '"')
            .replace(/['']/g, "'")
            .replace(/。/g, ".")
            .replace(/[,.?:!;]$/, "")
            .trim();
    }

    // HTML解码辅助函数
    function HTMLDecode(str) {
        const div = document.createElement('div');
        div.innerHTML = str;
        return div.textContent || div.innerText || str;
    }

    const Cache = {
        _data: null,
        _load() {
            if (!this._data) {
                try {
                    this._data = JSON.parse(GM_getValue('answer_cache', '{}'));
                } catch {
                    this._data = {};
                }
            }
            return this._data;
        },
        _save() {
            GM_setValue('answer_cache', JSON.stringify(this._data));
        },
        get(questionText) {
            const key = hashQuestion(questionText);
            const data = this._load();
            const item = data[key];
            if (!item) return null;

            // 检查TTL过期（默认7天）
            const ttl = 7 * 24 * 3600 * 1000;
            if (item.timestamp && (Date.now() - item.timestamp > ttl)) {
                delete data[key];
                this._save();
                logger.debug('Cache item expired:', key);
                return null;
            }

            return item;
        },
        set(questionText, answer, questionType, provider) {
            const key = hashQuestion(questionText);
            const data = this._load();
            data[key] = { answer, questionType, provider, timestamp: Date.now() };
            this._pruneIfNeeded();
            this._save();
            logger.debug('Cache set:', key);
        },
        clear() {
            this._data = {};
            GM_setValue('answer_cache', '{}');
            logger.info('Cache cleared');
        },
        stats() {
            const data = this._load();
            const keys = Object.keys(data);
            return { total: keys.length, sizeEstimate: JSON.stringify(data).length };
        },
        _pruneIfNeeded() {
            const serialized = JSON.stringify(this._data);
            if (serialized.length > 500 * 1024) {
                const entries = Object.entries(this._data).sort((a, b) => a[1].timestamp - b[1].timestamp);
                const removeCount = Math.ceil(entries.length * 0.2);
                for (let i = 0; i < removeCount; i++) {
                    delete this._data[entries[i][0]];
                }
                logger.info(`Cache pruned: removed ${removeCount} old entries`);
            }
        },
        prune(maxAge = 30 * 24 * 3600 * 1000) {
            const data = this._load();
            const now = Date.now();
            let prunedCount = 0;
            for (const [key, val] of Object.entries(data)) {
                if (now - val.timestamp > maxAge) {
                    delete data[key];
                    prunedCount++;
                }
            }
            this._save();
            if (prunedCount > 0) {
                logger.info(`Cache pruned: removed ${prunedCount} expired entries`);
            }
        },
    };

    /* ===== SECTION 4: IFRAME HELPER ===== */

    function detectFrame() {
        const href = window.location.href;
        if (href.includes('/multimedia/') || href.includes('/video/')) return 'video';
        if (href.includes('/exam-ans/') || href.includes('/exam/test/') || href.includes('/mooc2/exam/')) return 'exam';
        if (href.includes('/work/') || href.includes('/selectWork') || href.includes('/workAnswer')) return 'quiz';
        if (href.includes('/knowledge/cards')) return 'section';
        if (href.includes('/mycourse/') || href.includes('/course/')) return 'course';
        return 'top';
    }

    // 判断当前页面是否为课程相关页面（面板只在这些页面显示）
    function isCoursePage() {
        const href = window.location.href;
        const path = window.location.pathname;
        // 课程主页、章节页、视频页、作业页、考试页、阅读页
        return href.includes('/mycourse/')
            || href.includes('/course/')
            || href.includes('/knowledge/')
            || href.includes('/multimedia/')
            || href.includes('/video/')
            || href.includes('/work/')
            || href.includes('/selectWork')
            || href.includes('/workAnswer')
            || href.includes('/exam-ans/')
            || href.includes('/exam/')
            || href.includes('/ztnodedetailcontroller/')
            || href.includes('/read/')
            || path.includes('/mooc1/')
            || path.includes('/mooc2/')
            || path.includes('/mooc-ans/');
    }

    function sendFrameMessage(type, data) {
        try {
            window.top.postMessage({ type: 'CX_AI_' + type, data }, '*');
        } catch (e) { /* ignore */ }
    }

    function onFrameMessage(callback) {
        window.addEventListener('message', (e) => {
            if (e.data && typeof e.data.type === 'string' && e.data.type.startsWith('CX_AI_')) {
                callback(e.data.type.replace('CX_AI_', ''), e.data.data);
            }
        });
    }

    // 跨帧递归遍历：访问所有同源iframe（参考2）
    function forEachSameOriginFrame(callback) {
        const visit = (win) => {
            for (let i = 0; i < win.frames.length; i++) {
                const f = win.frames[i];
                try {
                    const doc = f.document || f.contentDocument;
                    if (doc && doc.location && doc.location.href.includes('.chaoxing.com')) {
                        callback(doc);
                        visit(f);
                    }
                } catch { /* cross-origin */ }
            }
        };
        try { callback(document); } catch {}
        try { visit(window); } catch {}
    }

    // 递归遍历所有同源文档（从top开始，去重）
    function forEachAllSameOriginDocs(callback) {
        const seen = new Set();
        const visit = (win) => {
            if (!win || seen.has(win)) return;
            seen.add(win);
            try {
                const doc = win.document || win.contentDocument;
                if (doc) callback(doc);
            } catch {}
            try {
                const len = win.frames ? win.frames.length : 0;
                for (let i = 0; i < len; i++) {
                    try { visit(win.frames[i]); } catch {}
                }
            } catch {}
        };
        try { visit(window.top); } catch { visit(window); }
    }

    /* ===== SECTION 5: FONT DECRYPTION ===== */
    // 基于 Typr.js 的字体解密（wyn665817 方案）

    function base64ToUint8Array(base64) {
        const data = atob(base64);
        const buffer = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
            buffer[i] = data.charCodeAt(i);
        }
        return buffer;
    }

    // 从指定文档提取字体base64数据
    function extractFontBase64(doc) {
        try {
            const styles = doc.querySelectorAll('style');
            for (const style of styles) {
                const text = style.textContent || '';
                if (!text.includes('font-cxsecret')) continue;
                const match = text.match(/base64,([\w\W]+?)'/);
                if (match) return match[1];
            }
        } catch {}
        return null;
    }

    // 构建字体映射表 - 支持按文档缓存和重试
    const _fontMappingCache = new Map(); // key: fontBase64前20字符, value: mapping
    let _lastFailedBase64 = null; // 上次失败的字体，避免重复尝试

    function buildFontMapping(targetDoc) {
        if (!Settings.get('fontDecrypt')) return null;
        try {
            // 优先从目标文档提取字体，再尝试主文档和其他iframe
            let fontBase64 = null;
            if (targetDoc) {
                fontBase64 = extractFontBase64(targetDoc);
            }
            if (!fontBase64) {
                fontBase64 = extractFontBase64(document);
            }
            if (!fontBase64) {
                forEachSameOriginFrame((doc) => {
                    if (fontBase64) return;
                    fontBase64 = extractFontBase64(doc);
                });
            }
            if (!fontBase64) {
                Log.add('debug', '未找到字体CSS（可能页面无加密字体）');
                return null;
            }

            // 检查是否与上次失败的相同
            const cacheKey = fontBase64.slice(0, 20);
            if (_lastFailedBase64 === cacheKey) return null;

            // 检查缓存
            if (_fontMappingCache.has(cacheKey)) {
                Log.add('debug', '使用缓存的字体映射');
                return _fontMappingCache.get(cacheKey);
            }

            const fontTableRaw = GM_getResourceText('fontTable');
            if (!fontTableRaw) {
                Log.add('warn', '字体表资源加载失败，跳过字体解密');
                return null;
            }
            const fontTable = JSON.parse(fontTableRaw);
            const font = Typr.parse(base64ToUint8Array(fontBase64))[0];
            const mapping = {};

            let matched = 0, unmatched = 0;
            for (let i = 19968; i < 40870; i++) {
                const glyph = Typr.U.codeToGlyph(font, i);
                if (!glyph) continue;
                const path = Typr.U.glyphToPath(font, glyph);
                const hash = md5(JSON.stringify(path)).slice(24);
                if (fontTable[hash]) {
                    mapping[String.fromCharCode(i)] = String.fromCharCode(fontTable[hash]);
                    matched++;
                } else { unmatched++; }
            }

            const mapSize = Object.keys(mapping).length;
            if (mapSize > 0) {
                Log.add('info', `字体映射构建完成: ${mapSize}个映射 (匹配${matched}/未匹配${unmatched})`);
                _fontMappingCache.set(cacheKey, mapping);
                return mapping;
            }
            Log.add('warn', `字体映射为空 (匹配${matched}/未匹配${unmatched})，字体表可能不匹配`);
            _lastFailedBase64 = cacheKey;
            return null;
        } catch (e) {
            Log.add('warn', '字体映射构建失败: ' + e.message);
            if (fontBase64) _lastFailedBase64 = fontBase64.slice(0, 20);
            return null;
        }
    }

    // 在指定文档中解密字体
    function decryptFontInDoc(doc) {
        if (!doc || !Settings.get('fontDecrypt')) return;
        const mapping = buildFontMapping(doc);
        if (!mapping) return;
        try {
            const secretElements = doc.querySelectorAll('.font-cxsecret');
            if (secretElements.length === 0) {
                Log.add('debug', '未发现需要解密的元素(.font-cxsecret)');
                return;
            }
            let decrypted = 0, unchanged = 0;
            for (const el of secretElements) {
                let html = el.innerHTML;
                const orig = html;
                for (const [from, to] of Object.entries(mapping)) {
                    html = html.replace(new RegExp(from, 'g'), to);
                }
                if (html !== orig) {
                    el.innerHTML = html;
                    el.classList.remove('font-cxsecret');
                    decrypted++;
                } else { unchanged++; }
            }
            Log.add('info', `字体解密: 成功${decrypted}/${secretElements.length}个元素 (无变化${unchanged}个)`);
            if (unchanged > 0 && decrypted === 0) {
                Log.add('warn', '字体映射可能不匹配当前页面字体');
            }
        } catch (e) {
            Log.add('warn', '字体解密失败: ' + e.message);
        }
    }

    function decryptFont() {
        decryptFontInDoc(document);
    }



    /* ===== SECTION 6: VIDEO MODULE ===== */

    // 智能速度控制状态（参考3）
    const smartSpeedState = {
        currentSpeed: 1,
        lastChangeTime: 0,
        changeInterval: 30000,
        speedVariation: 0.2,
    };

    // 行为模拟状态（参考3）
    const behaviorState = {
        lastMouseMove: 0,
        lastClick: 0,
    };

    // 防休眠状态（参考1）
    let _antiSleepStarted = false;
    let _audioContext = null;

    function getSmartSpeed(baseRate) {
        if (!Settings.get('smartSpeed')) return baseRate;
        const now = Date.now();
        if (now - smartSpeedState.lastChangeTime > smartSpeedState.changeInterval) {
            const variation = (Math.random() - 0.5) * smartSpeedState.speedVariation;
            smartSpeedState.currentSpeed = Math.max(0.8, Math.min(3.0, baseRate + variation));
            smartSpeedState.lastChangeTime = now;
            if (smartSpeedState.currentSpeed > 2) {
                Log.add('warn', `智能倍速: ${smartSpeedState.currentSpeed.toFixed(2)}x (高速有风险)`);
            }
        }
        return smartSpeedState.currentSpeed;
    }

    function getDetectionEvasionRate(baseRate) {
        if (!Settings.get('detectionEvasion')) return baseRate;
        // 微扰 ±5%
        const perturbation = (Math.random() - 0.5) * 0.1 * baseRate;
        return Math.max(0.8, Math.min(3.0, baseRate + perturbation));
    }

    function simulateUserBehavior() {
        if (!Settings.get('behaviorSim')) return;
        const now = Date.now();
        // 随机鼠标移动 10-30秒
        if (now - behaviorState.lastMouseMove > 10000 + Math.random() * 20000) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            document.dispatchEvent(new MouseEvent('mousemove', { clientX: x, clientY: y, bubbles: true }));
            behaviorState.lastMouseMove = now;
        }
        // 随机点击 30-90秒
        if (now - behaviorState.lastClick > 30000 + Math.random() * 60000) {
            document.body.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            behaviorState.lastClick = now;
        }
    }

    // 防休眠：Web Audio API 静音振荡器（参考1）
    function setupAntiSleep() {
        if (_antiSleepStarted) return;
        if (!Settings.get('antiSleep') && !Settings.get('bgHangMode')) return;
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        function tryStart() {
            if (_antiSleepStarted) return;
            try {
                _audioContext = new AC();
                const osc = _audioContext.createOscillator();
                const gain = _audioContext.createGain();
                gain.gain.value = 0;
                osc.connect(gain);
                gain.connect(_audioContext.destination);
                osc.start();
                _antiSleepStarted = true;
                const origTitle = document.title;
                document.addEventListener('visibilitychange', () => {
                    try { if (_audioContext.state === 'suspended') _audioContext.resume(); } catch {}
                    // 挂机模式下切换标签时显示/恢复标题
                    if (Settings.get('bgHangMode')) {
                        if (document.hidden) {
                            document.title = '💤 挂机中 - ' + origTitle;
                        } else {
                            document.title = origTitle;
                        }
                    }
                });
                Log.add('info', '防休眠已启用');
            } catch {}
        }
        tryStart();
        if (!_antiSleepStarted) {
            const onGesture = () => {
                tryStart();
                if (_antiSleepStarted) {
                    document.removeEventListener('click', onGesture, true);
                    document.removeEventListener('keydown', onGesture, true);
                }
            };
            document.addEventListener('click', onGesture, true);
            document.addEventListener('keydown', onGesture, true);
        }
    }

    function initVideoModule() {
        Log.add('info', '视频模块启动');
        setupAntiSleep();
        const checkVideo = () => {
            const video = document.querySelector('video');
            if (!video) {
                setTimeout(checkVideo, 2000);
                return;
            }
            setupVideo(video);
        };
        checkVideo();
    }

    function setupVideo(video, name = '视频') {
        if (video._cxaiSetup) return;
        video._cxaiSetup = true;
        
        // 通知父窗口发现视频，更新总数
        sendFrameMessage('VIDEO_FOUND', {});
        
        Log.add('info', `🎬 开始刷视频：${name}，倍速：${Settings.get('videoRate') || 1}倍`);
        ProgressTracker.update({ taskName: `[视频] ${name}`, type: '视频', percent: 0, detail: '准备开始' });

        const rate = Settings.get('videoRate') || 1;
        video.muted = true;
        video.playbackRate = rate;

        // Lock playback rate to prevent Chaoxing from resetting（参考1）
        try {
            Object.defineProperty(video, 'playbackRate', {
                get() { return rate; },
                set() { /* ignore reset attempts */ },
                configurable: true,
            });
        } catch (e) { /* property already defined */ }

        // 临近结尾自动恢复1x（参考1）
        let rateRestored = rate <= 1;
        if (!rateRestored) {
            video.addEventListener('timeupdate', () => {
                if (!rateRestored && isFinite(video.duration) && video.duration - video.currentTime < 10) {
                    rateRestored = true;
                    try { delete video.playbackRate; } catch {}
                    video.playbackRate = 1;
                    Log.add('info', '视频临近结尾，已恢复1x速度');
                }
            });
        }

        const playPromise = video.play();
        if (playPromise) {
            playPromise.catch(() => {
                document.addEventListener('click', () => video.play(), { once: true });
            });
        }

        Log.add('info', `视频播放中 (速度: ${rate}x)`);

        // 视频进度日志（参考3，每30秒输出一次）
        const progressTimer = setInterval(() => {
            if (video.ended || !isFinite(video.duration)) {
                clearInterval(progressTimer);
                return;
            }
            // 视频暂停时尝试恢复播放
            if (video.paused) {
                video.play().catch(() => {});
                return;
            }
            const currentTime = Math.floor(video.currentTime);
            const duration = Math.floor(video.duration);
            if (duration <= 0) return;
            const percent = Math.round((currentTime / duration) * 100);
            const remainingMin = Math.ceil((duration - currentTime) / 60);
            Log.add('info', `进度 ${formatTime(currentTime)} / ${formatTime(duration)} (剩余约${remainingMin}分钟, 完成${percent}%)`);
            ProgressTracker.update({ percent, detail: `真实播放中 ${formatTime(currentTime)} / ${formatTime(duration)}` });
        }, 30000);

        video.addEventListener('ended', () => {
            clearInterval(progressTimer);
            Log.add('info', '视频播放完成');
            ProgressTracker.update({ percent: 100, detail: '视频任务已完成' });
            sendFrameMessage('VIDEO_DONE', {});
            try { GM_notification({ text: '视频播放完成', title: '学习通AI助手', timeout: 3000 }); } catch {}
        });

        // Watch for popup questions
        observePopupQuestions();
    }

    function formatTime(seconds) {
        const s = Math.round(seconds);
        if (s < 3600) {
            const m = Math.floor(s / 60);
            const sec = s % 60;
            return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
        }
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }



    function observePopupQuestions() {
        const observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    const tip = node.matches?.('.ans-job-tip') ? node : node.querySelector?.('.ans-job-tip');
                    if (tip) handlePopupQuestion(tip);
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    async function handlePopupQuestion(container) {
        Log.add('info', '检测到视频弹窗题目');
        try {
            const question = parseQuestionFromContainer(container);
            if (!question || !question.text) return;

            let answer = Cache.get(question.text);
            if (answer) {
                Log.add('info', '缓存命中: ' + question.text.slice(0, 30));
            } else {
                // 先查第三方题库
                if (Settings.get('thirdPartyApiEnabled')) {
                    const tpResult = await queryThirdPartyApi(question);
                    if (tpResult) {
                        answer = { answer: tpResult, questionType: question.type };
                    }
                }
                // 再查自定义题库适配器
                if (!answer && Settings.get('questionBankUrl')) {
                    const bankResult = await queryQuestionBank(question);
                    if (bankResult) {
                        answer = { answer: bankResult, questionType: question.type };
                    }
                }
                if (!answer) {
                    Log.add('info', 'AI请求: ' + question.text.slice(0, 30));
                    const prompt = buildQuestionPrompt(question);
                    const result = await callAI(prompt, { questionType: question.type });
                    answer = { answer: result, questionType: question.type };
                    if (Settings.get('cacheEnabled')) {
                        Cache.set(question.text, result, question.type, Settings.get('provider'));
                    }
                }
            }

            if (Settings.get('goodStudentMode')) {
                injectAnswerToDOM(question, answer.answer);
            } else {
                fillQuestionAnswer(question, answer.answer);
                await sleep(500);
                const btn = container.querySelector('.popbtn_ok, .btn_ok, button');
                if (btn) btn.click();
            }
            const video = document.querySelector('video');
            if (video && !Settings.get('goodStudentMode')) video.play();
        } catch (e) {
            Log.add('error', '弹窗答题失败: ' + e.message);
        }
    }

    // 立即对所有已加载的视频应用新倍速（UI按钮即时生效）
    function applyVideoRateToAllVideos(newRate) {
        forEachSameOriginFrame((doc) => {
            doc.querySelectorAll('video').forEach(v => {
                try { delete v.playbackRate; } catch {}
                v.playbackRate = newRate;
                if (newRate > 1) {
                    try {
                        Object.defineProperty(v, 'playbackRate', {
                            get() { return newRate; },
                            set() {},
                            configurable: true,
                        });
                    } catch {}
                }
            });
        });
    }

    // 启动/停止视频增强定时器（智能速度、行为模拟、反检测）
    let _videoEnhancerTimer = null;
    function startVideoEnhancer() {
        if (_videoEnhancerTimer) return;
        _videoEnhancerTimer = setInterval(() => {
            forEachSameOriginFrame((doc) => {
                doc.querySelectorAll('video').forEach(video => {
                    if (video.paused || video.ended) return;
                    const baseRate = Settings.get('videoRate') || 1;
                    let effectiveRate = getDetectionEvasionRate(baseRate);
                    effectiveRate = getSmartSpeed(effectiveRate);
                    try { video.playbackRate = effectiveRate; } catch {}
                });
            });
            simulateUserBehavior();
        }, 5000);
    }
    function stopVideoEnhancer() {
        if (_videoEnhancerTimer) { clearInterval(_videoEnhancerTimer); _videoEnhancerTimer = null; }
    }
    // 初始化：如果设置了智能速度/行为模拟/反检测，启动增强定时器
    if (Settings.get('smartSpeed') || Settings.get('behaviorSim') || Settings.get('detectionEvasion')) {
        startVideoEnhancer();
    }

    /* ===== SECTION 7: QUIZ MODULE ===== */

    // 检测当前页面是哪种类型的答题页面
    function detectPageType(doc) {
        doc = doc || document;
        const loc = doc.defaultView ? doc.defaultView.location : location;
        const path = loc.pathname;
        const href = loc.href;

        // 章节测验/随堂测验 (参考2)
        if (path.includes('/page/quiz/stu/answerQuestion')) return 'quiz';
        // 新版作业
        if (path === '/mooc2/work/dowork' || path === '/mooc-ans/mooc2/work/dowork') return 'newWork';
        // 旧版作业
        if (path === '/work/doHomeWorkNew' || path === '/mooc-ans/work/doHomeWorkNew') return 'oldWork';
        // 新版考试
        if ((path.includes('/exam/test/reVersionTestStartNew') || path.includes('/exam-ans/exam/test/reVersionTestStartNew')) && href.includes('newMooc=true')) return 'newExam';
        if (path.includes('/mooc2/exam/preview') || path.includes('/exam-ans/mooc2/exam/preview')) return 'newExam';
        // 旧版考试
        if (path.includes('/exam/test/reVersionTestStartNew') || path.includes('/exam-ans/exam/test/reVersionTestStartNew')) return 'oldExam';

        // Fallback: 检测DOM特征
        if (doc.querySelector('input[id^="answertype"]')) return 'quiz';
        if (doc.querySelector('.questionLi')) return 'newWork';
        if (doc.querySelector('.TiMu')) return 'oldWork';
        return 'unknown';
    }

    function parseAllQuestions(doc = document) {
        const pageType = detectPageType(doc);
        Log.add('info', `页面类型: ${pageType}`);

        switch (pageType) {
            case 'quiz':
                return parseQuizQuestions(doc);
            case 'newWork':
            case 'newExam':
                return parseNewVersionQuestions(doc);
            case 'oldWork':
            case 'oldExam':
                return parseOldVersionQuestions(doc);
            default:
                return parseGenericQuestions(doc);
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // 章节测验/随堂测验解析
    // 参考来源：
    //   参考3（404小站）：WorkerJSPlus "超星随堂测验" 选择器配置
    //     root: ".question-item"  elements.question: ".topic-txt"
    //     elements.type: "input[class^=que-type]"
    //   参考2（AI研习助手）：getQuestionInfo() 多选择器容错机制
    //     题干：possibleQuestionSelectors 列表
    //     选项：stem_answer > div / answer_p 等
    //   旧版 .TiMu 结构（参考1 startDoPhoneTimu）：
    //     root: ".TiMu"  题干: ".Zy_TItle .clearfix"
    //     选项: "ul.Zy_ulTop li[onclick]"  题型: "input[id^=answertype]"
    // ─────────────────────────────────────────────────────────────────
    function parseQuizQuestions(doc) {
        const questions = [];

        // ── 策略A：新版随堂测验 .question-item（参考3 "超星随堂测验" 配置）
        const qItems = doc.querySelectorAll('.question-item');
        if (qItems.length > 0) {
            qItems.forEach((container, idx) => {
                try {
                    // 题干：.topic-txt（参考3）
                    let qtext = '';
                    const topicTxt = container.querySelector('.topic-txt');
                    if (topicTxt) qtext = tidyQuestion(topicTxt.textContent);
                    if (!qtext) qtext = tidyQuestion(container.textContent);

                    // 题型：input[class^="que-type"]（参考3），type 16 → judge（参考3 wrap处理）
                    let type = 'unknown';
                    const queTypeInput = container.querySelector('input[class^="que-type"]');
                    if (queTypeInput) {
                        let tv = parseInt(queTypeInput.value);
                        if (tv === 16) tv = 3; // 参考3 wrap: type16 → 3(judge)
                        type = TYPE_CODE_MAP[tv] || 'unknown';
                    }
                    if (type === 'unknown') type = detectQuestionType(container, doc);

                    // 选项：.topic-option-list input（参考3），选项文本从 label/span 取
                    const opts = [];
                    const optInputs = container.querySelectorAll('.topic-option-list input');
                    if (optInputs.length > 0) {
                        optInputs.forEach((inp, i) => {
                            const label = inp.closest('label') || inp.parentElement;
                            const txt = tidyStr(label ? label.textContent : '');
                            opts.push({ index: i, label: String.fromCharCode(65 + i), text: txt, element: inp });
                        });
                    } else {
                        // 回退：.topic-option-list 下直接文本节点
                        const optList = container.querySelectorAll('.topic-option-list > *');
                        optList.forEach((el, i) => {
                            opts.push({ index: i, label: String.fromCharCode(65 + i), text: tidyStr(el.textContent), element: el });
                        });
                    }

                    if (qtext) questions.push({ qid: String(idx), type, text: qtext, options: opts, element: container, doc, pageType: 'quiz' });
                } catch (e) { Log.add('warn', '解析新版随堂测验题目失败: ' + e.message); }
            });
            if (questions.length > 0) return questions;
        }

        // ── 策略B：旧版 .TiMu 结构（参考1 startDoPhoneTimu / 参考3 "超星旧版作业" 配置）
        //    题干: ".Zy_TItle .clearfix"  选项: "ul.Zy_ulTop li[onclick]"
        //    题型: input[name^=answertype]（参考3）或 input[id^="answertype"]（参考1）
        const timuItems = doc.querySelectorAll('.TiMu');
        if (timuItems.length > 0) {
            timuItems.forEach((container, idx) => {
                try {
                    // 题干：.Zy_TItle .clearfix（参考3旧版作业），再 fallback .Zy_TItle .fontLabel（参考1）
                    let qtext = '';
                    const zyTitleClearfix = container.querySelector('.Zy_TItle .clearfix');
                    const zyTitleFontLabel = container.querySelector('.Zy_TItle .fontLabel');
                    const zyTitle = container.querySelector('.Zy_TItle');
                    const titleEl = zyTitleClearfix || zyTitleFontLabel || zyTitle;
                    if (titleEl) qtext = tidyQuestion(titleEl.textContent);

                    // 题型：input[name^=answertype]（参考3旧版配置）
                    let type = 'unknown';
                    const atInput = container.querySelector('input[name^="answertype"]') || container.querySelector('input[id^="answertype"]');
                    if (atInput) {
                        const tv = parseInt(atInput.value);
                        type = TYPE_CODE_MAP[tv] !== undefined ? TYPE_CODE_MAP[tv] : 'unknown';
                    }
                    if (type === 'unknown') type = detectQuestionType(container, doc);

                    // 选项：ul.Zy_ulTop li[onclick] > a.after（参考1）
                    const opts = [];
                    const optLis = container.querySelectorAll('ul.Zy_ulTop li[onclick]');
                    if (optLis.length > 0) {
                        optLis.forEach((li, i) => {
                            // letter label：span.num_option 的 data 属性（参考1）
                            const span = li.querySelector('.num_option, .num_option_dx');
                            const letter = (span && span.getAttribute('data')) || String.fromCharCode(65 + i);
                            // 选项文本：a.after（参考1旧版），fallback li 整体文本
                            const afterEl = li.querySelector('a.after');
                            const txt = tidyStr(afterEl ? afterEl.textContent : li.textContent);
                            opts.push({ index: i, label: letter, text: txt, element: li });
                        });
                    } else {
                        // fallback：ul li .after（参考3旧版考试 .Cy_ulTop .clearfix 结构）
                        const afterEls = container.querySelectorAll('ul:first-of-type li .after, .Cy_ulTop .clearfix');
                        afterEls.forEach((el, i) => {
                            opts.push({ index: i, label: String.fromCharCode(65 + i), text: tidyStr(el.textContent), element: el.closest('li') || el });
                        });
                    }

                    if (qtext) questions.push({ qid: String(idx), type, text: qtext, options: opts, element: container, doc, pageType: 'quiz' });
                } catch (e) { Log.add('warn', '解析旧版随堂测验题目失败: ' + e.message); }
            });
            if (questions.length > 0) return questions;
        }

        // ── 策略C：通用容错（参考2 getQuestionInfo 思路）
        //    用 input[id^="answertype"] 定位题目块，从多个候选选择器提取题干/选项
        const typeInputs = doc.querySelectorAll('input[id^="answertype"]');
        typeInputs.forEach((inp) => {
            try {
                const qid = inp.id.replace('answertype', '').trim();
                const block = doc.querySelector(`.singleQuesId[data="${qid}"]`) || inp.closest('.TiMu') || inp.closest('.question') || doc.body;

                // 题型（参考1的 answertype value 映射）
                const tv = parseInt((inp.value || '').trim());
                let type = TYPE_CODE_MAP[tv] !== undefined ? TYPE_CODE_MAP[tv] : 'unknown';
                if (type === 'unknown') {
                    const hasText = block.querySelector('input[type="text"], textarea, [contenteditable="true"], [id^="answerEditor"], iframe[id^="ueditor_"]');
                    type = hasText ? 'essay' : 'unknown';
                }

                // 题干：参考2 possibleQuestionSelectors
                let qtext = '';
                const stemSelectors = ['.Zy_TItle .clearfix', '.Zy_TItle .fontLabel', '.Zy_TItle', '.subject_describe', '.questionContent', '.mark_name', '.stem_txt', 'h3'];
                for (const sel of stemSelectors) {
                    const el = block.querySelector(sel);
                    if (el && el.textContent.trim().length > 2) { qtext = tidyQuestion(el.textContent); break; }
                }

                // 选项：ul.Zy_ulTop li[onclick]（参考1），再用 qid 属性筛选
                const opts = [];
                const lis = block.querySelectorAll(`ul.Zy_ulTop li[onclick][qid="${qid}"]`);
                const fallbackLis = lis.length > 0 ? lis : block.querySelectorAll('ul.Zy_ulTop li[onclick]');
                fallbackLis.forEach((li, i) => {
                    const span = li.querySelector('.num_option, .num_option_dx');
                    const letter = (span && span.getAttribute('data')) || String.fromCharCode(65 + i);
                    const afterEl = li.querySelector('a.after');
                    const txt = tidyStr(afterEl ? afterEl.textContent : li.textContent);
                    opts.push({ index: i, label: letter, text: txt, element: li });
                });
                // 选项 fallback：stem_answer（参考2）
                if (opts.length === 0) {
                    const answerDivs = block.querySelectorAll('.stem_answer > div, .stem_answer .answer_p');
                    answerDivs.forEach((el, i) => {
                        opts.push({ index: i, label: String.fromCharCode(65 + i), text: tidyStr(el.textContent), element: el });
                    });
                }

                if (qtext) questions.push({ qid, type, text: qtext, options: opts, element: block, doc, pageType: 'quiz' });
            } catch (e) { Log.add('warn', '解析测验题目失败(策略C): ' + e.message); }
        });
        return questions;
    }

    // ─────────────────────────────────────────────────────────────────
    // 新版作业/考试解析
    // 参考来源：
    //   参考3（404小站）WorkerJSPlus "学习通新版作业" 配置：
    //     root: ".questionLi"  题干: "h3"（去掉 .colorShallow 分值）
    //     选项: ".stem_answer .answerBg .answer_p, .textDIV, .eidtDiv"
    //     题型: "input[type^=hidden]:eq(0)"
    //   参考3 "超星新版考试" 配置：
    //     root: ".questionLi"  题干: "h3 div"
    //     选项: ".answerBg .answer_p, .textDIV, .eidtDiv"
    //     题型: "input[name^=type]:eq(i)"  type6 → 4(essay)
    //   参考1（doHomeWork）：新版作业：
    //     题干: ".mark_name"（remove 括号分值前缀）
    //     选项: ".stem_answer .answer_p"（remove A/B/C/D 字母前缀）
    //     已作答检测: parent span.check_answer
    //   参考2（getQuestionInfo）：
    //     兜底选项选择器: stem_answer > div / answer_p
    // ─────────────────────────────────────────────────────────────────
    function parseNewVersionQuestions(doc) {
        const questions = [];
        const containers = doc.querySelectorAll('.questionLi');
        containers.forEach((container, idx) => {
            try {
                // 题干：优先 h3（参考3新版作业/考试），再 h3 div（参考3新版考试），再 .mark_name（参考1）
                let qtext = '';
                const h3 = container.querySelector('h3');
                if (h3) {
                    // 去掉 .colorShallow 分值提示文本（参考3 wrap 处理）
                    const colorShallow = h3.querySelector('.colorShallow');
                    let text = h3.cloneNode(true);
                    if (colorShallow) {
                        const cs = text.querySelector('.colorShallow');
                        if (cs) cs.remove();
                    }
                    qtext = tidyQuestion(text.textContent);
                    // 参考3新版考试：题干在 h3 > div 内，再取一次
                    if (!qtext) {
                        const h3div = container.querySelector('h3 div');
                        if (h3div) qtext = tidyQuestion(h3div.textContent);
                    }
                }
                // 参考1 doHomeWork：题干在 .mark_name，去掉 (n分) 前缀
                if (!qtext) {
                    const markName = container.querySelector('.mark_name');
                    if (markName) qtext = tidyQuestion(markName.textContent).replace(/^[(（].*?[)）]\s*/, '').trim();
                }

                // 题型：input[type="hidden"]:first（参考3新版作业），input[name^="type"]（参考3新版考试）
                let type = 'unknown';
                const hiddenInput = container.querySelector('input[type="hidden"]');
                if (hiddenInput && hiddenInput.value !== '') {
                    let tv = parseInt(hiddenInput.value);
                    if (tv === 6) tv = 4; // 参考3新版考试 wrap: type6 → 4(essay)
                    type = TYPE_CODE_MAP[tv] !== undefined ? TYPE_CODE_MAP[tv] : 'unknown';
                }
                if (type === 'unknown') {
                    const typeNameInput = container.querySelector('input[name^="type"]');
                    if (typeNameInput && typeNameInput.value !== '') {
                        let tv = parseInt(typeNameInput.value);
                        if (tv === 6) tv = 4;
                        type = TYPE_CODE_MAP[tv] !== undefined ? TYPE_CODE_MAP[tv] : 'unknown';
                    }
                }
                if (type === 'unknown') type = detectQuestionType(container, doc);

                // 选项：.stem_answer .answerBg .answer_p（参考3新版作业配置）
                //       .answerBg .answer_p（参考3新版考试配置）
                //       .stem_answer .answer_p（参考1 doHomeWork）
                //       .textDIV, .eidtDiv（参考3，填空/主观文本框）
                const opts = [];
                let answerEls = container.querySelectorAll('.stem_answer .answerBg .answer_p');
                if (answerEls.length === 0) answerEls = container.querySelectorAll('.answerBg .answer_p');
                if (answerEls.length === 0) answerEls = container.querySelectorAll('.stem_answer .answer_p');
                answerEls.forEach((el, i) => {
                    // 参考3/参考1：去掉开头的 "A." "B、" 之类字母标签
                    const txt = tidyStr(el.textContent).replace(/^[A-Ga-g][.、]\s*/, '');
                    const letter = String.fromCharCode(65 + i);
                    opts.push({ index: i, label: letter, text: txt, element: el });
                });
                // 参考2 fallback：stem_answer > div
                if (opts.length === 0) {
                    const divEls = container.querySelectorAll('.stem_answer > div');
                    divEls.forEach((el, i) => {
                        opts.push({ index: i, label: String.fromCharCode(65 + i), text: tidyStr(el.textContent), element: el });
                    });
                }

                if (qtext) questions.push({ qid: String(idx), type, text: qtext, options: opts, element: container, doc, pageType: 'new' });
            } catch (e) { Log.add('warn', '解析新版题目失败: ' + e.message); }
        });
        return questions;
    }

    // ─────────────────────────────────────────────────────────────────
    // 旧版作业/考试解析
    // 参考来源：
    //   参考3（404小站）WorkerJSPlus：
    //     "超星旧版考试"：root ".TiMu"，题干 ".Cy_TItle .clearfix"，
    //       选项 ".Cy_ulTop .clearfix"，题型 "[name^=type]:not([id])"
    //     "超星旧版作业"：root ".clearfix .TiMu"，题干 ".Zy_TItle .clearfix"，
    //       选项 "ul:eq(0) li .after"，题型 "input[name^=answertype]"
    //   参考1（doHomeWork）：
    //     root ".questionLi"，题干 ".mark_name" HTML tidyQuestion，
    //     选项 ".stem_answer .answer_p"（作业新版）
    //     typename 属性读取题型
    // ─────────────────────────────────────────────────────────────────
    function parseOldVersionQuestions(doc) {
        const questions = [];
        const containers = doc.querySelectorAll('.TiMu');
        containers.forEach((container, idx) => {
            try {
                // 题干：旧版作业 ".Zy_TItle .clearfix"（参考3），旧版考试 ".Cy_TItle .clearfix"（参考3）
                let qtext = '';
                const zyTitle = container.querySelector('.Zy_TItle .clearfix') || container.querySelector('.Zy_TItle .fontLabel') || container.querySelector('.Zy_TItle');
                const cyTitle = container.querySelector('.Cy_TItle .clearfix') || container.querySelector('.Cy_TItle');
                const titleEl = zyTitle || cyTitle || container.querySelector('h3');
                if (titleEl) qtext = tidyQuestion(titleEl.textContent);

                // 题型：旧版作业 input[name^="answertype"]（参考3），旧版考试 [name^=type]:not([id])（参考3）
                let type = 'unknown';
                const atInput = container.querySelector('input[name^="answertype"]') ||
                                container.querySelector('input[name^="type"]:not([id])') ||
                                container.querySelector('input[name^="type"]');
                if (atInput && atInput.value !== '') {
                    const tv = parseInt(atInput.value);
                    type = TYPE_CODE_MAP[tv] !== undefined ? TYPE_CODE_MAP[tv] : 'unknown';
                }
                // 参考1：typename 属性
                if (type === 'unknown') {
                    const tn = container.getAttribute('typename');
                    if (tn) type = getTypeFromName(tn) || 'unknown';
                }
                if (type === 'unknown') type = detectQuestionType(container, doc);

                // 选项：旧版作业 "ul:first li .after"（参考3），旧版考试 ".Cy_ulTop .clearfix"（参考3）
                const opts = [];
                let afterEls = container.querySelectorAll('ul:first-of-type li .after');
                if (afterEls.length === 0) afterEls = container.querySelectorAll('.Cy_ulTop .clearfix');
                if (afterEls.length === 0) afterEls = container.querySelectorAll('ul li .after');
                afterEls.forEach((el, i) => {
                    opts.push({ index: i, label: String.fromCharCode(65 + i), text: tidyStr(el.textContent), element: el.closest('li') || el });
                });

                if (qtext) questions.push({ qid: String(idx), type, text: qtext, options: opts, element: container, doc, pageType: 'old' });
            } catch (e) { Log.add('warn', '解析旧版题目失败: ' + e.message); }
        });
        return questions;
    }

    // ─────────────────────────────────────────────────────────────────
    // 通用/fallback 解析
    // 参考来源：
    //   参考2（AI研习助手）：getQuestionContainers() + getQuestionInfo()
    //     容器选择器: QUESTION_CONTAINER_SELECTOR 多个 class 合并
    //     用 isLikelyQuestionContainer 过滤有效容器
    //     题干: possibleQuestionSelectors 多候选列表
    //     选项: stem_answer > div / answer_p / subject_node 等
    //   参考3（404小站）：init$1() 通用字段提取
    //     question: formatString(filterImg(...))  选项去 "A." 前缀
    // ─────────────────────────────────────────────────────────────────
    function parseGenericQuestions(doc) {
        const questions = [];
        // 参考2 QUESTION_CONTAINER_SELECTOR：多种页面容器 class 合并
        const GENERIC_CONTAINER_SEL = '.questionLi, .TiMu, .singleQuesId, .question, .subject_item, .examPaper_subject, .questionContainer, .q-item, .subject_node, .ti-item, .exam-item, .question-item';
        let containers = Array.from(doc.querySelectorAll(GENERIC_CONTAINER_SEL));

        // 参考2 isLikelyQuestionContainer：排除嵌套容器（父子关系的只取最内层）
        containers = containers.filter(el => {
            // 排除工具栏/翻译框（参考2 isUtilityElement）
            if (el.closest && el.closest('.translationBox, .func-pop, .colorPop, .nullpage, #markDiv')) return false;
            // 排除包含子容器的外层元素（参考2 isLikelyQuestionContainer 逻辑）
            if (el.querySelector('.singleQuesId, .questionLi, .question-item') &&
                !el.classList.contains('singleQuesId') && !el.classList.contains('questionLi') && !el.classList.contains('question-item')) return false;
            // 必须含有答题元素（参考2）
            return !!(el.querySelector('.stem_answer, .subject_describe, .questionContent, .subject_stem, .type_title, .stem_type, [id^="answertype"], .Zy_TItle, ul.Zy_ulTop, input[type="radio"], input[type="checkbox"], textarea, .topic-txt, .topic-option-list'));
        });

        containers.forEach((container, idx) => {
            try {
                const q = { qid: String(idx), element: container, doc, pageType: 'generic' };
                q.type = detectQuestionType(container, doc);

                // 题干：参考2 possibleQuestionSelectors 列表（按优先级）
                const stemSelectors = [
                    '.topic-txt',            // 参考3 随堂测验
                    '.Zy_TItle .clearfix',   // 参考3 旧版作业
                    '.Cy_TItle .clearfix',   // 参考3 旧版考试
                    '.Zy_TItle .fontLabel',  // 参考1
                    'h3 div',               // 参考3 新版考试
                    'h3',                   // 参考3 新版作业/考试
                    '.mark_name',            // 参考1 作业
                    '.subject_describe',     // 参考2
                    '.questionContent',      // 参考2
                    '.subject_stem',         // 参考2
                    '.stem_txt',             // 参考2
                    '.stem-content',         // 参考2
                    '.title',               // 参考2
                ];
                for (const sel of stemSelectors) {
                    const el = container.querySelector(sel);
                    if (el && el.textContent.trim().length > 2) {
                        q.text = tidyQuestion(el.textContent);
                        break;
                    }
                }

                // 选项：参考2 optionSelectors 列表（按优先级）
                q.options = [];
                const optSelectors = [
                    '.topic-option-list input',           // 参考3 随堂测验
                    'ul.Zy_ulTop li[onclick] a.after',   // 参考1
                    '.stem_answer .answerBg .answer_p',   // 参考3 新版作业
                    '.answerBg .answer_p',                // 参考3 新版考试
                    '.stem_answer .answer_p',             // 参考1
                    '.stem_answer > div',                 // 参考2
                    'ul:first-of-type li .after',        // 参考3 旧版作业
                    '.Cy_ulTop .clearfix',               // 参考3 旧版考试
                    '.answer_p',                          // 参考2
                ];
                for (const sel of optSelectors) {
                    const els = container.querySelectorAll(sel);
                    if (els.length >= 2) {
                        // 参考3 init$1：选项文本去掉 "A." "B、" 字母前缀
                        els.forEach((el, i) => {
                            const rawTxt = tidyStr(el.textContent).replace(/^[A-Ga-g][.、]\s*/, '');
                            q.options.push({ index: i, label: String.fromCharCode(65 + i), text: rawTxt, element: el });
                        });
                        break;
                    }
                }

                if (q.text) questions.push(q);
            } catch (e) { Log.add('warn', '解析通用题目失败: ' + e.message); }
        });
        return questions;
    }

    // === TYPE map (from 参考3) ===
    // 中文题型名 → 数字代码 → 内部类型字符串
    const TYPE_CODE_MAP = {
        0: 'single',   // 单选
        1: 'multiple', // 多选
        2: 'fill',     // 填空
        3: 'judge',    // 判断
        4: 'essay',    // 主观/简答
        5: 'essay',    // 名词解释
        6: 'essay',    // 论述题
        7: 'essay',    // 计算题
        8: 'essay',    // 其它
        9: 'essay',    // 分录题
        10: 'essay',   // 资料题
        11: 'essay',   // 连线题
        13: 'essay',   // 排序题
        14: 'fill',    // 完形填空
        15: 'fill',    // 阅读理解
        16: 'judge',   // 随堂测验判断
        18: 'essay',   // 口语题
        19: 'essay',   // 听力题
        66: 'fill',    // 阅读理解（选择）/完型填空
        98: 'translation', // 翻译题
        99: 'writing',     // 写作题
    };
    const TYPE_NAME_MAP = {
        '写作题': 99, '写作': 99,
        '翻译题': 98, '翻译': 98,
        '单项选择题': 0, '单项选择': 0, '单选题': 0, '单选': 0,
        'multichoice': 1, 'singlechoice': 0, 'SingleChoice': 0,
        '多选': 1, '多选题': 1, '案例分析': 1, '多项选择题': 1, '多项选择': 1, '客观题': 1,
        'A1A2题': 1, '视频题': 1,
        '填空题': 2, '填空': 2,
        'bijudgement': 3, 'Judgement': 3, '对错题': 3, '判断题': 3, '判断正误': 3, '判断': 3,
        '主观题': 4, '问答题': 4, '简答题': 4, '文件作答': 4,
        '名词解释': 5,
        '论述题': 6,
        '计算题': 7,
        '其它': 8,
        '分录题': 9,
        '资料题': 10,
        '连线题': 11,
        '排序题': 13,
        '完形填空': 14, '完型填空': 14,
        '阅读理解': 15,
        '阅读理解（选择）/完型填空': 66, '听力训练': 66,
        '口语题': 18,
        '听力题': 19,
    };

    // 从中文类型名获取内部类型 (参考3的getQuestionType)
    function getTypeFromName(name) {
        if (!name) return null;
        const trimmed = name.trim().replace(/\s+/g, '');
        if (TYPE_NAME_MAP[trimmed] !== undefined) {
            return TYPE_CODE_MAP[TYPE_NAME_MAP[trimmed]] || null;
        }
        // 正则子串匹配
        const regex = Object.keys(TYPE_NAME_MAP).join('|');
        const match = trimmed.match(new RegExp(regex));
        if (match) {
            return TYPE_CODE_MAP[TYPE_NAME_MAP[match[0]]] || null;
        }
        return null;
    }

    function detectQuestionType(container, doc) {
        doc = doc || document;

        // Method 0: input[id^="answertype"] (章节测验/随堂测验 - 参考2)
        const answertypeInput = container.querySelector('input[id^="answertype"]');
        if (answertypeInput) {
            const val = (answertypeInput.value || '').trim();
            if (val === '0') return 'single';
            if (val === '1') return 'multiple';
            if (val === '3') return 'judge';
            if (val === '2') return 'fill';
            if (val === '4') return 'essay';
        }

        // Method 1: input[name^="type"] (作业/考试 - 参考3)
        const typeInput = container.querySelector('input[name^="type"]:not([id])') ||
                          container.querySelector('input[name^="type"]');
        if (typeInput) {
            const typeVal = parseInt(typeInput.value);
            if (TYPE_CODE_MAP[typeVal] !== undefined) return TYPE_CODE_MAP[typeVal];
        }

        // Method 2: CSS class-based (旧版DOM)
        if (container.querySelector('.ZySingle, .Cy_Single')) return 'single';
        if (container.querySelector('.ZyMultiple, .Cy_Multiple')) return 'multiple';
        if (container.querySelector('.ZyJudge, .Cy_Judge')) return 'judge';
        if (container.querySelector('.ZyFill, .Cy_Fill')) return 'fill';
        if (container.querySelector('.ZyAnswer, .ZyShort')) return 'essay';

        // Method 3: typename属性
        const typeEl = container.querySelector('[typename]');
        if (typeEl) {
            const result = getTypeFromName(typeEl.getAttribute('typename'));
            if (result) return result;
        }

        // Method 4: 【xxx】前缀 in text (from 参考1)
        const fullText = container.textContent || '';
        const bracketMatch = fullText.match(/【([^】]+)】/);
        if (bracketMatch) {
            const result = getTypeFromName(bracketMatch[1]);
            if (result) return result;
        }

        // Method 5: 中文类型关键词 in type-label elements
        const typeLabelSelectors = ['.mark_name', '.question_type', '.type_text', '.q-type', '[class*="type"]'];
        for (const sel of typeLabelSelectors) {
            const el = container.querySelector(sel);
            if (el) {
                const result = getTypeFromName(el.textContent.trim());
                if (result) return result;
            }
        }

        // Method 6: Element counting (参考3's defaultWorkTypeResolver)
        const radios = container.querySelectorAll('input[type="radio"]');
        const checks = container.querySelectorAll('input[type="checkbox"]');
        const textareas = container.querySelectorAll('textarea');

        if (radios.length === 2) return 'judge';
        if (radios.length > 2) return 'single';
        if (checks.length > 0) return 'multiple';
        if (textareas.length > 0) return 'essay';

        // Method 7: 对/错选项文本 (judge fallback)
        const optionTexts = [];
        container.querySelectorAll('li, label, .option, .answer_p').forEach(el => {
            const t = el.textContent.trim();
            if (t.length < 10) optionTexts.push(t);
        });
        if (optionTexts.length === 2) {
            const normalized = optionTexts.map(t => t.replace(/^[A-Da-d][.、\s]*/, ''));
            if (normalized.some(t => /^(对|正确|true|√|是)$/i.test(t)) &&
                normalized.some(t => /^(错|错误|false|×|否)$/i.test(t))) {
                return 'judge';
            }
        }

        return 'unknown';
    }

    // === 文本清理工具 (from 参考1) ===
    // 清理选项文本：去HTML标签、去类型前缀、去分值后缀、去&nbsp;
    function tidyStr(s) {
        if (!s) return '';
        return s
            .replace(/<(?!img).*?>/g, '')
            .replace(/^【[^】]*】\s*/, '')
            .replace(/\s*（\d+\.?\d*分）$/, '')
            .replace(/&nbsp;/g, '')
            .trim();
    }

    // 清理题干文本：额外去题号前缀、去javascript:void(0)
    function tidyQuestion(s) {
        if (!s) return '';
        return s
            .replace(/<(?!img).*?>/g, '')
            .replace(/^【[^】]*】\s*/, '')
            .replace(/\s*（\d+\.?\d*分）$/, '')
            .replace(/^\d+[.、]\s*/, '')
            .replace(/javascript:void\(0\);/g, '')
            .replace(/&nbsp;/g, '')
            .trim();
    }

    // === 判断题答案解析 (from 参考1) ===
    // 将AI回答归一为 'true' / 'false' / null
    function parseJudgeAnswer(str) {
        if (!str) return null;
        var s = str.replace(/[。，.,!！\s]/g, '').toLowerCase();
        var trueWords = ['正确', '是', '对', '√', 't', 'true', 'ri', 'right', 'yes'];
        var falseWords = ['错误', '否', '错', '×', 'f', 'false', 'wr', 'wrong', 'no'];
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

    // 在选项列表中查找"正确/对"或"错误/错"对应的索引
    function findJudgeOptionIndex(optionTexts, isTrue) {
        var trueWords = ['正确', '是', '对', '√', 'T'];
        var falseWords = ['错误', '否', '错', '×', 'F'];
        var words = isTrue ? trueWords : falseWords;
        for (var i = 0; i < optionTexts.length; i++) {
            var t = optionTexts[i].replace(/^[A-Da-d][.、\s]*/, '').trim();
            for (var j = 0; j < words.length; j++) {
                if (t.indexOf(words[j]) !== -1) return i;
            }
        }
        return isTrue ? 0 : 1; // fallback: 第一个=对, 第二个=错
    }

    // === 结构化提示词 (from 参考1) ===
    // 发送JSON格式的题目信息，让AI更精确理解并回答
    function buildQuestionPrompt(question) {
        const typeMap = {
            'single': '单选题', 'multiple': '多选题', 'judge': '判断题',
            'fill': '填空题', 'essay': '简答题', 'blank': '填空题',
            'short': '简答题', 'text': '简答题',
            'writing': '写作题', 'translation': '翻译题',
        };
        const typeName = typeMap[question.type] || '题目';
        const answerFormats = {
            'single': '只回答一个选项字母，如 A',
            'multiple': '回答所有正确选项的字母，用"|"分隔，如 A|B|D',
            'judge': '只回答"正确"或"错误"',
            'fill': '按顺序给出每个空的答案，用"|"分隔多个答案',
            'blank': '按顺序给出每个空的答案，用"|"分隔多个答案',
            'essay': '给出简洁准确的答案',
            'short': '给出简洁准确的答案',
            'text': '给出简洁准确的答案',
            'writing': '用英文根据题目进行写作',
            'translation': '中文英文互译',
        };

        const payloadObj = { type: typeName, question: question.text };
        if (question.options && question.options.length > 0) {
            payloadObj.options = question.options.map(o => `${o.label}. ${o.text}`);
        }
        payloadObj.answer_format = answerFormats[question.type] || '直接给出答案';

        return JSON.stringify(payloadObj, null, 2);
    }

    // 安全点击 (from 参考2)
    function safeClick(el) {
        if (!el) return;
        try {
            el.click();
        } catch (e) {
            try {
                const evt = new MouseEvent('click', { bubbles: true, cancelable: true });
                el.dispatchEvent(evt);
            } catch {}
        }
    }

    // 点击选项：优先点击内部的input/label，再点击元素本身
    function clickOption(el) {
        if (!el) return;
        const input = el.querySelector('input[type="radio"], input[type="checkbox"]');
        if (input) { input.click(); return; }
        const label = el.querySelector('label');
        if (label) { label.click(); return; }
        safeClick(el);
    }

    // 分发字段事件 (from 参考2)
    function dispatchFieldEvents(el) {
        try { el.dispatchEvent(new Event('input', { bubbles: true })); } catch {}
        try { el.dispatchEvent(new Event('change', { bubbles: true })); } catch {}
        try { el.dispatchEvent(new Event('blur', { bubbles: true })); } catch {}
    }

    // 统一答案填写入口 - 根据页面类型分发
    function fillQuestionAnswer(question, answerStr) {
        if (!answerStr) return;
        const pageType = question.pageType || 'generic';

        try {
            if (pageType === 'quiz') {
                fillQuizPageAnswer(question, answerStr);
            } else {
                fillWorkExamAnswer(question, answerStr);
            }
        } catch (e) {
            Log.add('error', '填写答案失败: ' + e.message);
        }
    }

    // 章节测验/随堂测验填写 (from 参考2 fillQuizAnswer)
    function fillQuizPageAnswer(question, answerStr) {
        const { qid, type, doc, element: block } = question;
        const targetDoc = doc || document;

        if (type === 'single' || type === 'multiple' || type === 'judge') {
            let letters = [];
            if (type === 'multiple') {
                letters = (answerStr || '').toUpperCase().split(/[,，、\s]+/).filter(Boolean);
            } else if (type === 'judge') {
                const parsed = parseJudgeAnswer(answerStr);
                if (parsed === 'true') letters = ['A'];
                else if (parsed === 'false') letters = ['B'];
                else letters = [(answerStr.match(/[ABab]/i) || ['A'])[0].toUpperCase()];
            } else {
                const m = String(answerStr || '').toUpperCase().match(/[A-Z]/g);
                letters = m ? m : [];
            }

            const ul = block.querySelector('ul.Zy_ulTop');
            if (!ul) {
                Log.add('warn', '未找到选项列表 ul.Zy_ulTop');
                return;
            }

            letters.forEach((L) => {
                let target = null;
                if (type === 'judge') {
                    const dataVal = (L === 'A') ? 'true' : 'false';
                    target = ul.querySelector(`li .num_option[data='${dataVal}'], li .num_option_dx[data='${dataVal}']`)
                          || ul.querySelector(`li .num_option[data='${L}'], li .num_option_dx[data='${L}']`);
                } else {
                    target = ul.querySelector(`li .num_option[data='${L}'], li .num_option_dx[data='${L}']`);
                }
                if (target) {
                    const li = target.closest('li');
                    safeClick(li);
                    Log.add('info', `点击选项 ${L}`);
                } else {
                    Log.add('warn', `未找到选项 ${L}`);
                }
            });

            // 设置隐藏答案字段
            const hidden = targetDoc.getElementById(`answer${qid}`);
            if (hidden) {
                const want = (type === 'judge')
                    ? (letters[0] === 'A' ? 'true' : 'false')
                    : letters.join('');
                hidden.value = want;
            }

            // 更新视觉选中状态
            const spans = ul.querySelectorAll(`.choice${qid}`);
            spans.forEach(s => s.classList.remove('check_answer', 'check_answer_dx'));
            letters.forEach((L) => {
                let sel = null;
                if (type === 'judge') {
                    const dv = (L === 'A') ? 'true' : 'false';
                    sel = ul.querySelector(`.choice${qid}[data='${dv}']`) || ul.querySelector(`.choice${qid}[data='${L}']`);
                } else {
                    sel = ul.querySelector(`.choice${qid}[data='${L}']`);
                }
                if (sel) {
                    const isMulti = !!ul.querySelector('.num_option_dx');
                    sel.classList.add(isMulti ? 'check_answer_dx' : 'check_answer');
                    const li = sel.closest('li');
                    if (li) {
                        li.setAttribute('aria-checked', 'true');
                        li.setAttribute('aria-pressed', 'true');
                    }
                }
            });
        }
        else if (type === 'fill' || type === 'blank') {
            const answers = String(answerStr || '').split(/[,，;；、]\s*/).map(s => s.trim()).filter(Boolean);

            // UEditor编辑器
            const ueAreas = Array.from(block.querySelectorAll('[id^="answerEditor"]'));
            ueAreas.forEach((ta, i) => {
                const val = answers[i] || '';
                if (!val) return;
                fillUEditor(targetDoc, ta, val);
            });

            // UEditor iframe
            const ifrs = block.querySelectorAll('iframe[id^="ueditor_"]');
            ifrs.forEach((ifr, i) => {
                const val = answers[i] || '';
                if (!val) return;
                try {
                    const d = ifr.contentDocument || ifr.contentWindow?.document;
                    if (d && d.body) {
                        d.body.innerHTML = val;
                        dispatchFieldEvents(d.body);
                    }
                } catch {}
            });

            // 普通input/textarea
            const inputs = [
                ...block.querySelectorAll('input[type="text"]'),
                ...block.querySelectorAll('textarea:not([id^="answerEditor"])')
            ];
            inputs.forEach((el, i) => {
                const val = answers[i] || '';
                if (!val) return;
                el.value = val;
                dispatchFieldEvents(el);
            });

            // 隐藏答案字段
            const hidden = targetDoc.getElementById(`answer${qid}`);
            if (hidden) hidden.value = answers.join(' ');
        }
        else if (type === 'essay' || type === 'short' || type === 'text' || type === 'writing' || type === 'translation') {
            const val = String(answerStr || '').trim();
            if (!val) return;

            // UEditor编辑器
            const ueAreas = Array.from(block.querySelectorAll('[id^="answerEditor"]'));
            ueAreas.forEach((ta) => {
                fillUEditor(targetDoc, ta, val);
            });

            // UEditor iframe
            const ifrs = block.querySelectorAll('iframe[id^="ueditor_"]');
            ifrs.forEach((ifr) => {
                try {
                    const d = ifr.contentDocument || ifr.contentWindow?.document;
                    if (d && d.body) {
                        d.body.innerHTML = val;
                        dispatchFieldEvents(d.body);
                    }
                } catch {}
            });

            // 普通textarea/input
            const inputs = [
                ...block.querySelectorAll('textarea:not([id^="answerEditor"])'),
                ...block.querySelectorAll('input[type="text"]')
            ];
            inputs.forEach((el) => {
                el.value = val;
                dispatchFieldEvents(el);
            });

            // 隐藏答案字段
            const hidden = targetDoc.getElementById(`answer${qid}`);
            if (hidden) hidden.value = val;
        }
    }

    // 作业/考试页面填写 (from 参考3 WorkerJSPlus fill)
    function fillWorkExamAnswer(question, answerStr) {
        const { type, options, element: container } = question;

        if (type === 'single') {
            const letter = extractLetter(answerStr);
            let idx;
            if (letter) {
                idx = letter.charCodeAt(0) - 65;
            } else if (Settings.get('fuzzyMatch')) {
                // 尝试模糊匹配
                idx = findBestFuzzyMatchIndex(options.map(o => o.text), answerStr);
                if (idx < 0) idx = 0;
            } else {
                idx = 0;
            }
            if (idx >= 0 && idx < options.length && options[idx]?.element) {
                clickOption(options[idx].element);
                Log.add('info', `点击选项 ${String.fromCharCode(65 + idx)}`);
            }
        }
        else if (type === 'multiple') {
            // 先尝试提取字母
            const letters = extractLetters(answerStr);
            if (letters.length > 0) {
                for (const L of letters) {
                    const idx = L.charCodeAt(0) - 65;
                    if (idx >= 0 && idx < options.length && options[idx]?.element) {
                        clickOption(options[idx].element);
                    }
                }
            } else if (Settings.get('fuzzyMatch')) {
                // 模糊匹配每个答案片段
                const parts = answerStr.split(/[,，|;；、]/).map(s => s.trim()).filter(Boolean);
                const clicked = new Set();
                for (const part of parts) {
                    const idx = findBestFuzzyMatchIndex(options.map(o => o.text), part);
                    if (idx >= 0 && !clicked.has(idx)) {
                        clicked.add(idx);
                        if (options[idx]?.element) clickOption(options[idx].element);
                    }
                }
            }
        }
        else if (type === 'judge') {
            const parsed = parseJudgeAnswer(answerStr);
            let idx;
            if (parsed === 'true') {
                idx = findJudgeOptionIndex(options.map(o => o.text), true);
            } else if (parsed === 'false') {
                idx = findJudgeOptionIndex(options.map(o => o.text), false);
            } else {
                idx = /A/i.test(answerStr) ? 0 : 1;
            }
            if (idx >= 0 && idx < options.length && options[idx]?.element) {
                clickOption(options[idx].element);
            }
        }
        else if (type === 'fill' || type === 'blank') {
            const answers = String(answerStr || '').split(/[,，;；、]\s*/).map(s => s.trim()).filter(Boolean);
            // UEditor
            const editors = container.querySelectorAll('textarea[name]');
            editors.forEach((ta, i) => {
                const val = answers[i] || '';
                if (!val) return;
                fillUEditor(container.ownerDocument || document, ta, val);
            });
            // 普通input
            const inputs = container.querySelectorAll('input[type="text"]');
            inputs.forEach((el, i) => {
                const val = answers[i] || '';
                if (!val) return;
                el.value = val;
                dispatchFieldEvents(el);
            });
        }
        else if (type === 'essay' || type === 'short' || type === 'text' || type === 'writing' || type === 'translation') {
            const val = String(answerStr || '').trim();
            if (!val) return;
            // UEditor
            const editors = container.querySelectorAll('textarea[name]');
            if (editors.length > 0) {
                fillUEditor(container.ownerDocument || document, editors[0], val);
            }
            // 普通textarea
            const textarea = container.querySelector('textarea');
            if (textarea) {
                textarea.value = val;
                dispatchFieldEvents(textarea);
            }
        }
    }

    // UEditor填写 (from 参考2 setQuizEditorValue)
    function fillUEditor(doc, textareaEl, value) {
        const val = String(value || '').trim();
        if (!textareaEl || !val) return;
        try {
            const win = (doc && doc.defaultView) || window;
            const UERef = win && win.UE;
            if (UERef && typeof UERef.getEditor === 'function') {
                const editorId = textareaEl.id || textareaEl.name;
                if (editorId) {
                    const editor = UERef.getEditor(editorId);
                    if (editor && editor.isReady) {
                        editor.setContent(val);
                        return;
                    }
                }
            }
        } catch (e) {
            Log.add('warn', 'UEditor写入失败，回退到普通填写: ' + e.message);
        }
        // Fallback: textarea value
        textareaEl.value = val;
        dispatchFieldEvents(textareaEl);
        // Fallback: iframe body
        try {
            const ifr = textareaEl.parentElement?.querySelector('iframe[id^="ueditor_"]');
            const iframeDoc = ifr && (ifr.contentDocument || ifr.contentWindow?.document);
            if (iframeDoc && iframeDoc.body) {
                iframeDoc.body.innerHTML = val;
                dispatchFieldEvents(iframeDoc.body);
            }
        } catch {}
    }

    // 提取单个字母
    function extractLetter(str) {
        const match = str.match(/^[A-D]/i);
        return match ? match[0].toUpperCase() : null;
    }

    // 提取多个字母
    function extractLetters(str) {
        const matches = str.match(/[A-D]/gi);
        return matches ? [...new Set(matches.map(m => m.toUpperCase()))] : [];
    }

    // 模糊匹配最佳选项索引 (from 参考1 findBestFuzzyMatch)
    function findBestFuzzyMatchIndex(optionTexts, aiAnswer, threshold) {
        if (!aiAnswer || !optionTexts || optionTexts.length === 0) return -1;
        threshold = threshold || 0.5;
        let bestIndex = -1, bestScore = 0;
        for (let i = 0; i < optionTexts.length; i++) {
            const score = similarity(optionTexts[i], aiAnswer);
            if (score > bestScore) {
                bestScore = score;
                bestIndex = i;
            }
        }
        if (bestScore >= threshold) {
            Log.add('info', `相似度匹配: 选项[${bestIndex}] 相似度=${(bestScore * 100).toFixed(1)}%`);
            return bestIndex;
        }
        Log.add('warn', `相似度匹配: 最高=${(bestScore * 100).toFixed(1)}%，低于阈值${threshold * 100}%`);
        return -1;
    }

    // Levenshtein距离模糊匹配 (from 参考1)
    function similarity(s1, s2) {
        if (!s1 && !s2) return 1;
        if (!s1 || !s2) return 0;
        s1 = s1.toLowerCase().trim();
        s2 = s2.toLowerCase().trim();
        if (s1 === s2) return 1;
        if (s1.includes(s2) || s2.includes(s1)) return 0.8;
        const len1 = s1.length, len2 = s2.length;
        if (len1 === 0 || len2 === 0) return 0;
        let prev = [], curr = [];
        for (let j = 0; j <= len2; j++) prev[j] = j;
        for (let i = 1; i <= len1; i++) {
            curr[0] = i;
            for (let j = 1; j <= len2; j++) {
                curr[j] = s1[i - 1] === s2[j - 1]
                    ? prev[j - 1]
                    : 1 + Math.min(prev[j], curr[j - 1], prev[j - 1]);
            }
            [prev, curr] = [curr, prev];
        }
        return 1 - prev[len2] / Math.max(len1, len2);
    }

    // 多选题专用模糊匹配：AI返回的答案用'|'分割后，对每个答案片段在选项中找最佳匹配
    // 返回匹配到的选项索引数组
    function findFuzzyMatchMultiple(optionTexts, aiAnswer, threshold) {
        if (!Settings.get('fuzzyMatch')) return [];
        if (!aiAnswer || !optionTexts || optionTexts.length === 0) return [];
        threshold = threshold !== undefined ? threshold : 0.5;
        const parts = aiAnswer.split('|');
        const matched = [];
        for (const part of parts) {
            const trimmed = part.trim();
            if (!trimmed) continue;
            let bestIndex = -1, bestScore = 0;
            for (let i = 0; i < optionTexts.length; i++) {
                const score = similarity(optionTexts[i], trimmed);
                if (score > bestScore) {
                    bestScore = score;
                    bestIndex = i;
                }
            }
            if (bestScore >= threshold && matched.indexOf(bestIndex) === -1) {
                matched.push(bestIndex);
                Log.add('info', `模糊匹配(多选): "${trimmed}" → 选项[${bestIndex}] 相似度=${(bestScore * 100).toFixed(1)}%`);
            }
        }
        return matched;
    }

    // 等待题目容器出现（MutationObserver + 轮询兜底）
    function waitForQuestions(doc = document, timeout = 15000) {
        return new Promise((resolve) => {
            let resolved = false;
            const done = (questions) => {
                if (resolved) return;
                resolved = true;
                resolve(questions);
            };

            // 立即检查一次
            const immediate = parseAllQuestions(doc);
            if (immediate.length > 0) return done(immediate);

            // MutationObserver 监听DOM变化
            const observer = new MutationObserver(() => {
                const questions = parseAllQuestions(doc);
                if (questions.length > 0) {
                    observer.disconnect();
                    done(questions);
                }
            });
            observer.observe(doc.body || doc.documentElement, { childList: true, subtree: true });

            // 轮询兜底
            const poll = setInterval(() => {
                const questions = parseAllQuestions(doc);
                if (questions.length > 0) {
                    clearInterval(poll);
                    observer.disconnect();
                    done(questions);
                }
            }, 1000);

            // 超时
            setTimeout(() => {
                clearInterval(poll);
                observer.disconnect();
                done([]);
            }, timeout);
        });
    }

    async function initQuizModule() {
        Log.add('info', '作业/测验模块启动');

        // 字体解密
        await sleep(1000);
        decryptFont();

        // 等待题目出现
        Log.add('info', '等待题目加载...');
        const questions = await waitForQuestions(document, 15000);

        if (questions.length === 0) {
            // 也检查iframe中的题目
            let iframeQuestions = [];
            let iframeDoc = null;
            forEachSameOriginFrame((doc) => {
                if (iframeQuestions.length > 0) return;
                const found = parseAllQuestions(doc);
                if (found.length > 0) {
                    iframeQuestions = found;
                    iframeDoc = doc;
                }
            });
            if (iframeQuestions.length > 0) {
                Log.add('info', `在iframe中找到 ${iframeQuestions.length} 道题目`);
                decryptFontInDoc(iframeDoc);
                return processQuestions(iframeQuestions);
            }
            Log.add('warn', '未找到题目');
            return;
        }
        return processQuestions(questions);
    }

    // 检测题目是否已作答（增强版：参考2多指标检测）
    function isQuestionAnswered(question) {
        const container = question.element;
        if (!container) return false;

        // 1. 检查答案展示区域（已批改/已提交状态）
        if (container.querySelector('.newAnswerBx .myAnswer, .answerCon, .myAllAnswerBx, .answerScore, .CorrectOrNot')) {
            return true;
        }

        // 2. 检查选项 span 上是否有 check_answer 或 check_answer_dx 类名
        const checkedSpans = container.querySelectorAll('span.check_answer, span.check_answer_dx, .check_answer, .check_answer_dx');
        if (checkedSpans.length > 0) return true;

        // 3. 检查 input 的 checked 属性
        const choiceInputs = container.querySelectorAll('input[type="radio"], input[type="checkbox"]');
        if (choiceInputs.length > 0 && Array.from(choiceInputs).some(i => i.checked)) return true;

        // 4. 检查文本输入框
        const textInputs = container.querySelectorAll('input[type="text"], textarea');
        if (textInputs.length > 0 && Array.from(textInputs).some(t => (t.value || '').trim().length > 0)) return true;

        // 5. 检查 contenteditable 元素
        const editableDivs = container.querySelectorAll('[contenteditable="true"]');
        if (editableDivs.length > 0 && Array.from(editableDivs).some(d => (d.innerText || d.textContent || '').trim().length > 0)) return true;

        // 6. 检查UEditor编辑器
        const ueTextareas = container.querySelectorAll('[id^="answerEditor"]');
        for (const ta of ueTextareas) {
            const id = ta.id;
            try {
                if (typeof UE !== 'undefined' && UE.getEditor) {
                    const ed = UE.getEditor(id);
                    if (ed && ed.getContentTxt && ed.getContentTxt().trim().length > 0) return true;
                }
            } catch {}
            if ((ta.value || '').trim().length > 0) return true;
        }

        // 7. 检查UEditor iframe
        const ifr = container.querySelector('iframe[id^="ueditor_"]');
        if (ifr) {
            try {
                const doc = ifr.contentDocument || ifr.contentWindow.document;
                const txt = (doc && doc.body && (doc.body.innerText || doc.body.textContent)) || '';
                if (txt.trim().length > 0) return true;
            } catch {}
        }

        return false;
    }

    // 取消已选选项（redo模式下先清除旧答案）
    function clearQuestionAnswer(question) {
        const container = question.element;
        if (!container) return;
        // 点击已选中的选项来取消
        const checkedSpans = container.querySelectorAll('span.check_answer, span.check_answer_dx');
        checkedSpans.forEach(span => {
            const parent = span.closest('.answer_p, li, label') || span.parentElement;
            if (parent) clickOption(parent);
        });
        // 也处理 input checked
        const checkedInputs = container.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked');
        checkedInputs.forEach(input => { input.click(); });
    }

    async function processQuestions(questions, opts = {}) {
        Log.add('info', `发现 ${questions.length} 道题目`);
        sendFrameMessage('QUIZ_START', { total: questions.length });
        ProgressTracker.update({ taskName: '[测验] 答题中', type: '测验', percent: 0, detail: `共 ${questions.length} 题` });

        const hasBank = !!Settings.get('questionBankUrl');
        const useRandom = hasBank && Settings.get('randomAnswer');
        const threshold = Settings.get('accuracyThreshold') || 0;
        const redoMode = Settings.get('redo');
        const alterTitle = Settings.get('alterTitle');

        let completed = 0;
        let hasUnanswered = false; // 追踪是否有未答题目
        for (let qi = 0; qi < questions.length; qi++) {
            const question = questions[qi];
            if (question.type === 'unknown') {
                Log.add('warn', `跳过无法识别的题目: ${question.text.slice(0, 30)}`);
                hasUnanswered = true;
                continue;
            }

            // 已作答检测（参考1）
            if (isQuestionAnswered(question)) {
                if (!redoMode) {
                    Log.add('info', `Q${qi + 1}: 已作答，跳过`);
                    completed++;
                    continue;
                } else {
                    Log.add('info', `Q${qi + 1}: 已作答，重做模式下重新作答`);
                    clearQuestionAnswer(question);
                    await sleep(300);
                }
            }

            try {
                let answer = null;
                let source = '';

                // 1. 检查缓存（始终优先）
                if (Settings.get('cacheEnabled')) {
                    const cached = Cache.get(question.text);
                    if (cached) {
                        answer = cached.answer;
                        source = '缓存';
                        Log.add('info', `[缓存] Q${qi + 1}: ${question.text.slice(0, 30)}...`);
                    }
                }

                // 2. 第三方题库API（lyck6.cn）
                if (!answer && Settings.get('thirdPartyApiEnabled')) {
                    const tpResult = await queryThirdPartyApi(question);
                    if (tpResult) {
                        answer = tpResult;
                        source = '第三方';
                        Log.add('info', `[第三方] Q${qi + 1}: ${question.text.slice(0, 30)}...`);
                    }
                }

                // 3. 自定义题库适配器
                if (!answer && hasBank) {
                    const bankResult = await queryQuestionBank(question);
                    if (bankResult) {
                        answer = bankResult;
                        source = '题库';
                        Log.add('info', `[题库] Q${qi + 1}: ${question.text.slice(0, 30)}...`);
                    } else if (useRandom) {
                        const randomAns = getRandomAnswer(question.type);
                        if (randomAns) {
                            answer = randomAns;
                            source = '随机';
                            Log.add('info', `[随机] Q${qi + 1}: ${answer}`);
                        }
                    }
                }

                // 4. 未配置题库：走AI（不走随机）
                if (!answer && !hasBank) {
                    source = 'AI';

                    // 搜题节流：按 reqIntervalTime 控制请求间隔
                    const intervalMs = Math.min(60000, (Settings.get('reqIntervalTime') || 2) * 1000);
                    const now = Date.now();
                    const waitMs = Math.max(0, _nextAiAllowedAt - now);
                    _nextAiAllowedAt = Math.max(now, _nextAiAllowedAt) + intervalMs;

                    if (waitMs > 0) {
                        Log.add('info', `搜题间隔限制，等待 ${Math.round(waitMs / 1000)}s...`);
                        await sleep(waitMs);
                    }

                    // 插入"AI思考中"占位日志行
                    const thinkingIdx = Log.addPlaceholder(`[AI] Q${qi + 1} (${question.type}): ${question.text.slice(0, 40)}... 思考中...`);

                    // 5分钟超时自动重试（参考1）
                    const MAX_RETRIES = 2;
                    let retryCount = 0;

                    const getAnswerWithRetry = () => new Promise((resolve, reject) => {
                        let requestCompleted = false;
                        let longWaitTimer = null;

                        // 5分钟超时监控
                        longWaitTimer = setTimeout(() => {
                            if (!requestCompleted) {
                                requestCompleted = true;
                                if (retryCount < MAX_RETRIES) {
                                    retryCount++;
                                    Log.updateEntry(thinkingIdx, `请求超时，正在重试（第${retryCount + 1}次）...`, 'warn');
                                    getAnswerWithRetry().then(resolve).catch(reject);
                                } else {
                                    Log.updateEntry(thinkingIdx, `请求超过重试次数限制`, 'error');
                                    reject(new Error('AI请求超时'));
                                }
                            }
                        }, 300000); // 5分钟

                        const prompt = buildQuestionPrompt(question);
                        callAI(prompt, { questionType: question.type }).then(result => {
                            if (requestCompleted) return;
                            requestCompleted = true;
                            clearTimeout(longWaitTimer);
                            resolve(result);
                        }).catch(err => {
                            if (requestCompleted) return;
                            requestCompleted = true;
                            clearTimeout(longWaitTimer);
                            reject(err);
                        });
                    });

                    try {
                        answer = await getAnswerWithRetry();
                        if (Settings.get('cacheEnabled')) {
                            Cache.set(question.text, answer, question.type, Settings.get('provider'));
                        }
                        // 原地替换"思考中"为答案
                        Log.updateEntry(thinkingIdx, `[答案] ${answer.slice(0, 80)}`, 'answer');
                    } catch (aiErr) {
                        Log.updateEntry(thinkingIdx, `[AI失败] Q${qi + 1}: ${aiErr.message}`, 'error');
                        answer = null;
                        hasUnanswered = true;
                    }
                }

                if (!answer || answer.trim().length === 0) {
                    Log.add('warn', `Q${qi + 1}: 无可用答案，跳过`);
                    hasUnanswered = true;
                    continue;
                }

                // 准确率阈值检查（仅对单选/多选/判断生效）
                if (threshold > 0 && ['single', 'multiple', 'judge'].includes(question.type)) {
                    const confidence = estimateConfidence(answer, question);
                    if (confidence < threshold) {
                        Log.add('warn', `Q${qi + 1}: 置信度 ${confidence}% < 阈值 ${threshold}%，跳过`);
                        hasUnanswered = true;
                        continue;
                    }
                    Log.add('info', `Q${qi + 1}: 置信度 ${confidence}% ≥ ${threshold}%`);
                }

                // alterTitle：将答案插入题干DOM（参考1）
                if (alterTitle) {
                    const stemEl = question.element?.querySelector('.mark_name, .Zy_TItle, .Cy_TItle');
                    if (stemEl) {
                        const answerTag = document.createElement('p');
                        answerTag.style.cssText = 'color:#4a9eff;font-weight:bold;margin:5px 0;font-size:13px;';
                        answerTag.textContent = '🤖 ' + answer;
                        stemEl.appendChild(answerTag);
                    }
                }

                // 好学生模式 vs 自动填写
                if (Settings.get('goodStudentMode')) {
                    injectAnswerToDOM(question, answer);
                } else {
                    fillQuestionAnswer(question, answer);
                }

                completed++;
                sendFrameMessage('QUIZ_PROGRESS', { completed, total: questions.length });
                ProgressTracker.update({ percent: Math.round((completed / questions.length) * 100), detail: `已完成 ${completed}/${questions.length} 题` });

                // Delay between questions
                await sleep(Settings.get('fillDelay') || 1500);
            } catch (e) {
                Log.add('error', `Q${qi + 1} 失败: ${e.message}`);
                hasUnanswered = true;
            }
        }

        Log.add('info', `答题完成: ${completed}/${questions.length}`);
        sendFrameMessage('QUIZ_DONE', { completed, total: questions.length });
        ProgressTracker.update({ percent: 100, detail: `答题完成 ${completed}/${questions.length}` });

        // 返回是否有未答题目（供 autoSubmit/forceSubmit 决策）
        return { completed, total: questions.length, hasUnanswered };
    }

    // 估算答案置信度（基于来源和答案特征）
    function estimateConfidence(answer, question) {
        // 缓存和题库的默认置信度较高
        // AI答案根据格式判断
        const clean = answer.trim().toUpperCase();

        // 单选题：答案是单个字母且与选项匹配
        if (question.type === 'single') {
            if (/^[A-D]$/.test(clean)) return 90;
            if (/^[A-D][,，、\s]/.test(clean)) return 85;
            // 完整文本匹配选项
            for (const opt of question.options) {
                if (opt.text && (answer.includes(opt.text) || opt.text.includes(answer))) return 85;
            }
            return 70;
        }

        // 多选题：答案包含多个字母
        if (question.type === 'multiple') {
            const letters = clean.match(/[A-D]/g);
            if (letters && letters.length >= 2) return 85;
            return 60;
        }

        // 判断题
        if (question.type === 'judge') {
            if (/^(对|错|正确|错误|是|否|√|×|true|false|T|F)$/i.test(clean)) return 90;
            return 70;
        }

        return 80; // 默认
    }

    // 题库适配器查询（参考3）
    async function queryQuestionBank(question) {
        const url = Settings.get('questionBankUrl');
        if (!url) return null;
        try {
            const resp = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: url + (url.includes('?') ? '&' : '?') + 'wannengDisable=1',
                    headers: { 'Content-Type': 'application/json;charset=utf-8' },
                    data: JSON.stringify({
                        question: question.text,
                        options: question.options.map(o => o.text),
                        type: question.type,
                    }),
                    onload: (r) => resolve(r),
                    onerror: (e) => reject(e),
                    timeout: 15000,
                });
            });
            const res = JSON.parse(resp.responseText);
            if (res.answer && res.answer.allAnswer && res.answer.allAnswer.length > 0) {
                Log.add('info', '题库命中: ' + question.text.slice(0, 30));
                return res.answer.allAnswer.join('\n');
            }
        } catch (e) {
            Log.add('warn', '题库查询失败: ' + e.message);
        }
        return null;
    }

    // 第三方题库API查询（参考3404小站 lyck6.cn）
    const TYPE_TO_NUM = { single: 0, multiple: 1, blank: 2, fill: 2, judge: 3, subjective: 4, answer: 4, essay: 4, term: 4, discussion: 4 };

    async function queryThirdPartyApi(question) {
        if (!Settings.get('thirdPartyApiEnabled')) return null;
        try {
            const token = Settings.get('thirdPartyApiToken') || '';
            const gpt = Settings.get('thirdPartyGpt') ?? -1;
            const baseService = 'https://lyck6.cn/scriptService/api';
            const uri = token.length === 10 ? `/autoAnswer/${token}?gpt=${gpt}` : '/autoFreeAnswer';

            const data = {
                question: question.text,
                options: question.options.map(o => o.text),
                type: TYPE_TO_NUM[question.type] ?? 4,
                location: location.href,
            };

            const resp = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: baseService + uri,
                    headers: { 'Content-Type': 'application/json;charset=utf-8' },
                    data: JSON.stringify(data),
                    timeout: 15000,
                    onload: (r) => resolve(r),
                    onerror: (e) => reject(e),
                    ontimeout: () => reject(new Error('第三方题库超时')),
                });
            });

            const res = JSON.parse(resp.responseText);
            if (res.code !== 0) {
                Log.add('warn', `第三方题库: ${res.message || res.msg || '查询失败'}`);
                return null;
            }
            if (res.result && res.result.answers && res.result.answers.length > 0) {
                const answers = res.result.answers;
                // 对于单选/多选/判断，返回原始答案文本供后续匹配
                if (['single', 'multiple', 'judge'].includes(question.type)) {
                    return answers.join(' | ');
                }
                // 填空/主观题：按换行拼接
                return answers.join('\n');
            }
            Log.add('info', '第三方题库: 未找到答案');
        } catch (e) {
            Log.add('warn', '第三方题库查询失败: ' + e.message);
        }
        return null;
    }

    // 好学生模式：将答案注入题干DOM（参考1）
    function injectAnswerToDOM(question, answerStr) {
        if (!answerStr) return;
        const container = question.element;
        if (!container) return;
        const stemSelectors = [
            '.Zy_TItle .fontLabel', '.Zy_TItle .clearfix', '.Cy_TItle .clearfix',
            '.mark_name + div', 'h3', '.stem', '.question_stem', '.subject_describe',
            '.Zy_TItle', '.mark_name',
        ];
        let stemEl = null;
        for (const sel of stemSelectors) {
            stemEl = container.querySelector(sel);
            if (stemEl && stemEl.textContent.trim().length > 5) break;
        }
        if (!stemEl) stemEl = container.querySelector('h3') || container.firstElementChild;
        if (stemEl) {
            const answerTag = document.createElement('div');
            answerTag.style.cssText = 'color:#4a9eff;font-weight:bold;margin:5px 0;padding:5px 8px;background:rgba(74,158,255,0.1);border-radius:4px;font-size:13px;';
            answerTag.textContent = '🤖 AI答案: ' + answerStr;
            stemEl.appendChild(answerTag);
        }
        // 好学生模式下加粗选项（参考1）
        if (question.type === 'single' || question.type === 'multiple') {
            const letterMatch = answerStr.match(/[A-D]/gi);
            if (letterMatch) {
                for (const letter of letterMatch) {
                    const idx = letter.toUpperCase().charCodeAt(0) - 65;
                    if (question.options[idx] && question.options[idx].element) {
                        const span = question.options[idx].element.querySelector('span') || question.options[idx].element;
                        span.style.fontWeight = 'bold';
                        span.style.color = '#4a9eff';
                    }
                }
            }
        }
        Log.add('info', '好学生模式: 答案已显示，请手动选择');
    }

    // 随机答题（参考3）
    function getRandomAnswer(questionType) {
        if (!Settings.get('randomAnswer')) return null;
        switch (questionType) {
            case 'single': return 'C';
            case 'multiple': return 'A,B,C,D';
            case 'judge': return '错';
            default: return null;
        }
    }

    /* ===== SECTION 8: READING MODULE ===== */

    function initReadingModule() {
        Log.add('info', '阅读模块启动');
        const speed = Settings.get('readingSpeed') || 1.0;
        let scrollInterval = null;

        const startReading = () => {
            // 查找阅读容器
            const containers = document.querySelectorAll('.readSection, .reader-box, .read-body, #app .reader, .iebook-content');
            let readContainer = null;
            for (const c of containers) {
                if (c.scrollHeight > c.clientHeight) { readContainer = c; break; }
            }
            if (!readContainer) {
                readContainer = document.querySelector('.ans-attach-ct') || document.documentElement;
            }

            Log.add('info', `开始自动阅读 (速度: ${speed}x)`);

            const scrollPx = Math.max(1, Math.round(2 * speed));
            scrollInterval = setInterval(() => {
                if (readContainer.scrollTop + readContainer.clientHeight < readContainer.scrollHeight) {
                    readContainer.scrollTop += scrollPx;
                } else {
                    clearInterval(scrollInterval);
                    Log.add('info', '阅读滚动完成');
                    sendFrameMessage('READING_DONE', {});
                }
            }, 100);
        };

        // 等待阅读页面加载
        setTimeout(startReading, 2000);
    }

    /* ===== SECTION 9: PPT/PDF MODULE ===== */

    function initPPTModule() {
        Log.add('info', 'PPT/PDF自动翻页启动');
        const nextSelectors = [
            '.next', '.vc-next', '.reader-next',
            'a[title="下一页"]', '.btn-next', '#next',
            '.slide-next', '.ppt-next',
        ];

        const turnPage = () => {
            for (const sel of nextSelectors) {
                const btn = document.querySelector(sel);
                if (btn && !btn.className.includes('disabled') && !btn.getAttribute('disabled')) {
                    btn.click();
                    Log.add('info', '自动翻到下一页');
                    return true;
                }
            }
            return false;
        };

        // 也检查iframe中的PPT
        const turnPageInFrames = () => {
            let found = false;
            forEachSameOriginFrame((doc) => {
                if (found) return;
                for (const sel of nextSelectors) {
                    const btn = doc.querySelector(sel);
                    if (btn && !btn.className.includes('disabled') && !btn.getAttribute('disabled')) {
                        btn.click();
                        found = true;
                        Log.add('info', '自动翻到下一页(iframe)');
                        return;
                    }
                }
            });
            return found;
        };

        // 每5秒尝试翻页
        const interval = trackedSetInterval(() => {
            if (!turnPage() && !turnPageInFrames()) {
                // 可能已经完成
            }
        }, 5000);
    }

    /* ===== SECTION 10: CHAPTER AUTO-NAVIGATION ===== */

    // 章节任务队列系统（参考2）
    const ChapterNav = {
        isActive: false,
        queue: [],
        currentMission: null,
        busy: false,
        completedCount: 0,
        pendingCount: 0,
        intervalId: null,
        persistKey: 'cxai_chapter_study',
        lastJumpTime: 0,
        jumpCooldown: 5000, // 5 seconds cooldown after jumping
        emptySectionCount: 0, // 连续空章节数（防死循环）
        _mediaTaskActive: false, // 正在处理视频/音频任务（防止跳转过早）

        start() {
            if (this.isActive) { Log.add('info', '刷章节已在运行'); return; }
            this.isActive = true;
            this.emptySectionCount = 0;
            this._buildQueueFailCount = 0;
            this._noCardsCount = 0;
            localStorage.setItem(this.persistKey, '1');
            Log.add('info', '开始自动刷章节...');
            try { const btn = document.getElementById('cx-chapter-toggle'); if (btn) btn.textContent = '停止刷课'; } catch {}

            // 监听iframe变化：点击侧边栏后iframe内容会变化
            this._setupIframeWatcher();

            this.intervalId = setInterval(() => {
                if (!this.isActive) return;
                this.processQueue().catch(e => {
                    this.clearCurrent();
                    Log.add('error', '任务轮询失败: ' + e.message);
                });
            }, 3000);

            this.processQueue().catch(e => {
                Log.add('error', '任务初始化失败: ' + e.message);
            });
        },

        // 监听iframe变化，检测新章节加载
        _setupIframeWatcher() {
            // 方案1: 监听所有iframe的load事件
            const watchIframe = (iframe) => {
                if (iframe._cxaiWatched) return;
                iframe._cxaiWatched = true;
                iframe.addEventListener('load', () => {
                    if (!this.isActive) return;
                    try {
                        const doc = iframe.contentDocument;
                        if (doc && doc.location && doc.location.href.includes('/knowledge/cards')) {
                            Log.add('info', '🔄 检测到新章节页面加载');
                            this.queue = [];
                            this._buildQueueFailCount = 0;
                            this.busy = false;
                            this._mediaTaskActive = false;
                            this.lastJumpTime = 0; // 清除冷却期，允许立即处理
                            // 延迟一下等页面渲染完成
                            setTimeout(() => {
                                if (this.isActive) this.processQueue().catch(() => {});
                            }, 2000);
                        }
                    } catch {}
                });
            };

            // 监听已有iframe
            document.querySelectorAll('iframe').forEach(watchIframe);

            // 监听新增iframe（MutationObserver）
            if (!this._iframeObserver) {
                this._iframeObserver = new MutationObserver((mutations) => {
                    for (const m of mutations) {
                        for (const node of m.addedNodes) {
                            if (node.tagName === 'IFRAME') watchIframe(node);
                            if (node.querySelectorAll) {
                                node.querySelectorAll('iframe').forEach(watchIframe);
                            }
                        }
                        // 也监听src属性变化
                        if (m.type === 'attributes' && m.target.tagName === 'IFRAME') {
                            watchIframe(m.target);
                        }
                    }
                });
                this._iframeObserver.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['src']
                });
            }

            // 方案2: 监听URL变化（popstate/hashchange）
            if (!this._urlWatcher) {
                this._urlWatcher = () => {
                    if (!this.isActive) return;
                    Log.add('info', '🔄 检测到URL变化，重新加载任务队列');
                    this.queue = [];
                    this._buildQueueFailCount = 0;
                    this.busy = false;
                    this._mediaTaskActive = false;
                };
                window.addEventListener('popstate', this._urlWatcher);
                window.addEventListener('hashchange', this._urlWatcher);
            }

            // 方案3: hook getTeacherAjax（参考3方案，学习通切换章节时调用此函数）
            try {
                const gtaWin = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
                if (typeof gtaWin.getTeacherAjax === 'function' && !gtaWin._cxaiGtaHooked2) {
                    gtaWin._cxaiGtaHooked2 = true;
                    const _orig = gtaWin.getTeacherAjax;
                    gtaWin.getTeacherAjax = function() {
                        const result = _orig.apply(this, arguments);
                        // 章节切换后重置队列
                        if (ChapterNav.isActive) {
                            Log.add('info', '🔄 检测到章节切换(getTeacherAjax)');
                            ChapterNav.queue = [];
                            ChapterNav._buildQueueFailCount = 0;
                            ChapterNav.busy = false;
                            ChapterNav._mediaTaskActive = false;
                            ChapterNav.lastJumpTime = 0; // 清除冷却期
                        }
                        return result;
                    };
                }
            } catch {}
        },

        stop() {
            this.isActive = false;
            if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; }
            if (this._iframeObserver) { this._iframeObserver.disconnect(); this._iframeObserver = null; }
            if (this._urlWatcher) {
                window.removeEventListener('popstate', this._urlWatcher);
                window.removeEventListener('hashchange', this._urlWatcher);
                this._urlWatcher = null;
            }
            localStorage.removeItem(this.persistKey);
            Log.add('info', '已停止自动刷章节');
            try { const btn = document.getElementById('cx-chapter-toggle'); if (btn) btn.textContent = '开始刷课'; } catch {}
        },

        findCardsDoc() {
            // 查找知识卡片文档（当前页面或iframe中）
            if (window.location.href.includes('/knowledge/cards')) return document;
            let found = null;
            try {
                forEachSameOriginFrame((doc) => {
                    if (found) return;
                    if (doc.location && doc.location.href.includes('/knowledge/cards')) {
                        found = doc;
                    }
                });
            } catch {}
            return found;
        },

        async processQueue() {
            if (!this.isActive || this.busy) return;

            // 跳转冷却期：等待新页面加载
            const elapsed = Date.now() - this.lastJumpTime;
            if (elapsed < this.jumpCooldown) return;

            // 非章节/课程页面不处理（防止在作业/考试页刷屏）
            const frameType = detectFrame();
            if (frameType !== 'section' && frameType !== 'course') {
                this._wrongPageCount = (this._wrongPageCount || 0) + 1;
                if (this._wrongPageCount >= 2) {
                    Log.add('warn', '当前非章节页面，自动停止刷课');
                    this.stop();
                }
                return;
            }
            this._wrongPageCount = 0;

            // 查找知识卡片文档
            const cardsDoc = this.findCardsDoc();
            if (!cardsDoc) {
                this._noCardsCount = (this._noCardsCount || 0) + 1;
                if (this._noCardsCount >= 3) {
                    Log.add('warn', '连续未找到知识卡片页面，自动停止刷课（可能已离开章节页）');
                    this.stop();
                }
                return;
            }
            this._noCardsCount = 0;

            // 解析任务列表
            if (this.queue.length === 0) {
                if (!this.buildQueue(cardsDoc)) {
                    // buildQueue返回false：可能是页面还没加载完或全部已完成
                    // 增加重试计数，避免页面未加载完就跳转
                    this._buildQueueFailCount = (this._buildQueueFailCount || 0) + 1;
                    if (this._buildQueueFailCount < 3) {
                        Log.add('info', `⏳ 未找到任务列表，等待重试(${this._buildQueueFailCount}/3)...`);
                        return;
                    }
                    // 重试3次后仍无任务，检查是否有媒体正在播放
                    if (this._mediaTaskActive || this.hasPlayingMedia()) {
                        Log.add('info', '⏳ 任务队列为空，但有视频/音频正在处理中，等待完成...');
                        return;
                    }
                    Log.add('info', '✅ 本章节任务全部完成，跳转下一章');
                    this._buildQueueFailCount = 0;
                    this.gotoNextSection();
                    return;
                }
                // buildQueue成功，重置失败计数
                this._buildQueueFailCount = 0;
            }

            if (this.queue.length === 0) {
                if (this._mediaTaskActive || this.hasPlayingMedia()) {
                    Log.add('info', '⏳ 任务队列为空，但有视频/音频正在处理中，等待完成...');
                    return;
                }
                Log.add('info', '✅ 本章节任务全部完成，跳转下一章');
                this.gotoNextSection();
                return;
            }

            const mission = this.queue[0];
            this.currentMission = mission;
            this.busy = true;

            try {
                await this.processMission(mission, cardsDoc);
            } catch (e) {
                Log.add('error', `任务处理失败: ${e.message}`);
                this._mediaTaskActive = false;
                this.finishMission('处理失败，已跳过', 'warn');
            }
        },

        buildQueue(cardsDoc) {
            try {
                let attachments = null;

                // 方法1: 从unsafeWindow获取pageData（参考3的方式）
                try {
                    const win = cardsDoc.defaultView || unsafeWindow;
                    if (win.pageData && win.pageData.attachments) {
                        attachments = win.pageData.attachments;
                    }
                } catch {}

                // 方法2: 从页面script中解析mArg（用大括号计数处理嵌套）
                if (!attachments) {
                    const scripts = cardsDoc.querySelectorAll('script');
                    for (const script of scripts) {
                        const text = script.textContent || '';
                        // 匹配 mArg = {...}; 用大括号计数处理嵌套JSON
                        const mArgStart = text.indexOf('mArg');
                        if (mArgStart >= 0) {
                            const eqIdx = text.indexOf('{', mArgStart);
                            if (eqIdx >= 0) {
                                let depth = 0, end = -1;
                                for (let i = eqIdx; i < text.length; i++) {
                                    if (text[i] === '{') depth++;
                                    else if (text[i] === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
                                }
                                if (end > 0) {
                                    try {
                                        const mArg = JSON.parse(text.substring(eqIdx, end));
                                        if (mArg.attachments) attachments = mArg.attachments;
                                    } catch {}
                                }
                            }
                            if (attachments) break;
                        }
                        const attMatch = text.match(/attachments\s*=\s*(\[[\s\S]*?\]);/);
                        if (attMatch) {
                            try { attachments = JSON.parse(attMatch[1]); } catch {}
                            break;
                        }
                    }
                }

                // 方法3: 搜索iframe中的pageData
                if (!attachments) {
                    forEachSameOriginFrame((doc) => {
                        if (attachments) return;
                        try {
                            const win = doc.defaultView || unsafeWindow;
                            if (win.pageData && win.pageData.attachments) {
                                attachments = win.pageData.attachments;
                            }
                        } catch {}
                        if (!attachments) {
                            const scripts2 = doc.querySelectorAll('script');
                            for (const s of scripts2) {
                                const t = s.textContent || '';
                                const m = t.match(/mArg\s*=\s*(\{[\s\S]*?\});/);
                                if (m) {
                                    try {
                                        const mArg = JSON.parse(m[1]);
                                        if (mArg.attachments) attachments = mArg.attachments;
                                    } catch {}
                                    break;
                                }
                            }
                        }
                    });
                }

                if (!attachments || attachments.length === 0) {
                    Log.add('warn', '未找到任务列表（请确认当前页面有课程内容）');
                    return false;
                }

                const allItems = attachments.map((task, index) => ({
                    task,
                    index,
                    type: this.normalizeType(task),
                    name: this.getMissionName(task, index),
                }));
                const completedItems = allItems.filter(item => this.isTaskCompleted(item.task));
                this.queue = allItems.filter(item => !this.isTaskCompleted(item.task));

                // 调试日志：显示每个任务的状态
                allItems.forEach(item => {
                    const done = this.isTaskCompleted(item.task);
                    Log.add('debug', `[${item.type}] ${item.name} | job=${item.task.job} isPassed=${item.task.isPassed} jobid=${item.task.jobid || '无'} → ${done ? '已完成' : '待处理'}`);
                });

                this.pendingCount = this.queue.length;
                this.completedCount = 0;
                if (completedItems.length > 0) {
                    Log.add('info', `任务点已加载: 共${attachments.length}个, 已完成${completedItems.length}个, 待处理${this.pendingCount}个`);
                } else {
                    Log.add('info', `任务点已加载: ${this.pendingCount} 个任务`);
                }
                if (this.pendingCount === 0) {
                    this.emptySectionCount++;
                    if (this.emptySectionCount >= 3) {
                        Log.add('info', '连续3个章节无待处理任务，自动停止');
                        this.stop();
                        return false;
                    }
                    return false;
                }
                this.emptySectionCount = 0; // 有待处理任务，重置计数
                return true;
            } catch (e) {
                Log.add('error', '解析任务列表失败: ' + e.message);
                return false;
            }
        },

        normalizeType(task) {
            if (task.type) return task.type;
            if (task.property && task.property.module) {
                const mod = task.property.module;
                if (mod.includes('video')) return 'video';
                if (mod.includes('audio')) return 'audio';
                if (mod.includes('book')) return 'insertbook';
                if (mod.includes('read')) return 'read';
                if (mod.includes('document')) return 'document';
                if (mod.includes('image')) return 'insertimage';
            }
            return task.type || 'unknown';
        },

        getMissionName(task, index) {
            const type = this.normalizeType(task);
            const typeNames = {
                video: '视频', audio: '音频', workid: '测验',
                ppt: 'PPT', pdf: 'PDF', reader: '阅读器',
                document: '文档', read: '阅读', insertbook: '图书',
                insertimage: '图片',
            };
            return `任务${index + 1}(${typeNames[type] || type})`;
        },

        isTaskCompleted(task) {
            const type = this.normalizeType(task);

            // 复习模式：强制重新处理所有任务（除真正的非任务点）
            if (Settings.get('reviewMode') && task.job === true) {
                return false;
            }

            // 明确的非任务点：job 为 false 且没有 jobid
            if (task.job === false && !task.jobid) return true;

            // 垃圾类型：不需要处理的附件类型
            const garbageTypes = ['insertimage', 'insertanswerquestion', 'insertshare', 'insertquestion', 'insertdiscuss', 'insertsubject'];
            if (garbageTypes.includes(type)) return true;

            // 本地缓存：我们曾经处理过才算完成（最可靠的判断）
            if (task.jobid) {
                try {
                    const jobData = localStorage.getItem('cxai_job_' + task.jobid);
                    if (jobData && JSON.parse(jobData).completed === true) return true;
                } catch {}
            }

            // isPassed + job 双重确认：两个都为 true 才算完成
            if (task.isPassed === true && task.job === true) return true;

            // 其他情况：保守地认为未完成，需要处理
            return false;
        },

        async processMission(mission, cardsDoc) {
            const { task, type } = mission;
            const garbageTypes = ['insertimage', 'insertanswerquestion', 'insertshare', 'insertquestion', 'insertdiscuss', 'insertsubject'];

            if (garbageTypes.includes(type)) {
                this.finishMission('无需处理，已跳过', 'info');
                return;
            }

            // 更新进度追踪
            const typeNames = { video: '视频', audio: '音频', workid: '测验', document: '文档', ppt: 'PPT', pdf: 'PDF', reader: '阅读器', read: '阅读', insertbook: '图书' };
            const progress = this.pendingCount > 0 ? Math.round((this.completedCount / this.pendingCount) * 100) : 0;
            ProgressTracker.update({
                taskName: mission.name,
                type: typeNames[type] || type,
                percent: progress,
                detail: `任务 ${this.completedCount + 1}/${this.pendingCount}`
            });

            switch (type) {
                case 'video':
                case 'audio':
                    if (!Settings.get('autoPlayVideo')) {
                        this.finishMission('自动播放已关闭，跳过', 'info');
                        return;
                    }
                    Log.add('info', `开始处理: ${mission.name}`);
                    this._mediaTaskActive = true;
                    this.findAndPlayMedia(cardsDoc, type, mission.name);
                    await this.waitForMediaComplete(task);
                    this._mediaTaskActive = false;
                    this.finishMission('播放完成', 'success');
                    break;

                case 'workid': {
                    Log.add('info', `开始处理: ${mission.name}`);
                    const quizOk = await this.processWorkMission(task, cardsDoc);
                    this.finishMission(quizOk ? '测验完成' : '测验跳过(无题目)', quizOk ? 'success' : 'warn');
                    break;
                }

                // 参考3: PDF/PPT/文档统一用API处理，不翻页
                case 'document':
                case 'ppt':
                case 'pdf':
                case 'reader':
                    Log.add('info', `开始处理: ${mission.name}`);
                    const docOk = await this.processApiMission(task, '/ananas/job/document');
                    this.finishMission(docOk ? '文档完成' : '文档API失败', docOk ? 'success' : 'error');
                    break;

                case 'read':
                    Log.add('info', `开始处理: ${mission.name}`);
                    const readOk = await this.processApiMission(task, '/ananas/job/readv2');
                    this.finishMission(readOk ? '阅读完成' : '阅读API失败', readOk ? 'success' : 'error');
                    break;

                case 'insertbook':
                    Log.add('info', `开始处理: ${mission.name}`);
                    const bookOk = await this.processApiMission(task, '/ananas/job');
                    this.finishMission(bookOk ? '图书完成' : '图书API失败', bookOk ? 'success' : 'error');
                    break;

                default:
                    this.finishMission(`暂不支持 ${type}，已跳过`, 'warn');
                    break;
            }
        },

        // 查找章节测验标签页（参考2）
        findChapterQuizTab(doc) {
            try {
                // 方式1: 通过title属性
                const byTitle = doc.querySelector('li[title*="章节测验"], li[title*="测验"], a[title*="章节测验"], a[title*="测验"]');
                if (byTitle) return byTitle;

                // 方式2: 通过onclick中的changeDisplayContent
                const byOnClick = Array.from(doc.querySelectorAll('li[onclick], a[onclick], button[onclick]')).find(el => {
                    const oc = (el.getAttribute('onclick') || '').toString();
                    return oc.includes('changeDisplayContent') && (oc.includes('(2,2') || oc.includes(',2)'));
                });
                if (byOnClick) return byOnClick;

                // 方式3: 通过文本内容
                const candidates = Array.from(doc.querySelectorAll('li, a, button, [role="tab"], [role="option"]'));
                const textEl = candidates.find(el => /章节测验|测验/.test(((el.textContent || el.getAttribute('title') || '') + '').trim()));
                if (textEl) return textEl;
            } catch {}
            return null;
        },

        findAndPlayMedia(doc, type, name = '视频') {
            // 在iframe中查找并播放视频/音频
            forEachSameOriginFrame((frameDoc) => {
                const media = frameDoc.querySelector(type === 'audio' ? 'audio' : 'video');
                if (media && !media._cxaiSetup) {
                    setupVideo(media, name);
                }
            });
        },

        async waitForMediaComplete(task) {
            // 等待媒体播放完成（最多等待视频时长+5分钟）
            const duration = (task.property && task.property._jobid) ? 600 : 300;
            const maxWait = duration * 2; // 最大等待时间
            Log.add('info', `等待视频完成，最大等待时间：${Math.floor(maxWait / 60)}分钟`);
            
            return new Promise((resolve) => {
                let elapsed = 0;
                let resolved = false;
                
                const check = setInterval(() => {
                    elapsed += 5;
                    // 每30秒输出一次等待日志
                    if (elapsed % 30 === 0) {
                        Log.add('info', `已等待 ${elapsed} 秒，继续等待视频完成...`);
                    }
                    
                    // 检查是否超时
                    if (elapsed > maxWait) {
                        clearInterval(check);
                        if (!resolved) {
                            resolved = true;
                            Log.add('warn', `等待视频完成超时（${Math.floor(maxWait / 60)}分钟），继续下一任务`);
                            resolve();
                        }
                    }
                }, 5000);
                
                // 监听完成消息
                window.addEventListener('message', function onMsg(e) {
                    if (e.data && e.data.type === 'CX_AI_VIDEO_DONE') {
                        window.removeEventListener('message', onMsg);
                        clearInterval(check);
                        if (!resolved) {
                            resolved = true;
                            Log.add('info', '收到视频完成消息');
                            resolve();
                        }
                    }
                });
            });
        },

        async processWorkMission(task, cardsDoc) {
            const QUIZ_SEL = '.TiMu, .questionLi, .singleQuesId';

            // 步骤1: 检查是否已有题目可见（当前文档或iframe）
            let quizDoc = null;
            const findQuizDoc = () => {
                quizDoc = null;
                if (document.querySelector(QUIZ_SEL)) { quizDoc = document; return; }
                forEachSameOriginFrame((doc) => {
                    if (quizDoc) return;
                    try {
                        if (doc.querySelector(QUIZ_SEL)) quizDoc = doc;
                    } catch {}
                });
            };
            findQuizDoc();

            // 步骤2: 如果没找到题目，尝试点击章节测验标签
            if (!quizDoc) {
                let tabEl = null;
                // 在当前文档和iframe中查找测验标签
                tabEl = this.findChapterQuizTab(document);
                if (!tabEl) {
                    forEachSameOriginFrame((doc) => {
                        if (tabEl) return;
                        try { tabEl = this.findChapterQuizTab(doc); } catch {}
                    });
                }

                if (tabEl) {
                    Log.add('info', '点击章节测验标签...');
                    tabEl.click();

                    // 也尝试调用onclick中的changeDisplayContent
                    const oc = (tabEl.getAttribute('onclick') || '').toString();
                    const m = oc.match(/changeDisplayContent\(([^)]*)\)/);
                    if (m && m[1]) {
                        try {
                            const fn = window.changeDisplayContent || (unsafeWindow && unsafeWindow.changeDisplayContent);
                            if (typeof fn === 'function') {
                                const args = eval('[' + m[1] + ']');
                                fn.apply(window, args);
                            }
                        } catch {}
                    }

                    // 等待题目加载（最多10秒）
                    for (let i = 0; i < 20; i++) {
                        await sleep(500);
                        findQuizDoc();
                        if (quizDoc) break;
                    }
                }
            }

            // 步骤3: 如果还是没找到，等久一点（可能是慢加载）
            if (!quizDoc) {
                for (let i = 0; i < 10; i++) {
                    await sleep(1000);
                    findQuizDoc();
                    if (quizDoc) break;
                }
            }

            if (!quizDoc) {
                Log.add('warn', '章节测验: 未找到题目，跳过');
                return false;
            }

            // 步骤4: 字体解密
            decryptFontInDoc(quizDoc);

            // 步骤5: 解析题目
            const questions = parseAllQuestions(quizDoc);
            if (questions.length === 0) {
                Log.add('warn', '章节测验: 解析题目为空');
                return false;
            }

            Log.add('info', `章节测验: 发现 ${questions.length} 道题目，开始答题`);
            const result = await processQuestions(questions);

            // 步骤6: 自动提交（参考1的 sub/force 逻辑）
            await sleep(2000);
            const autoSubmit = Settings.get('autoSubmit');
            const forceSubmit = Settings.get('forceSubmit');

            if (autoSubmit && !result.hasUnanswered) {
                Log.add('info', '所有题目已答完，自动提交...');
                findAndClickQuizSubmitButton(quizDoc);
            } else if (forceSubmit) {
                Log.add('warn', '存在未答题目，强制提交模式下仍然提交');
                findAndClickQuizSubmitButton(quizDoc);
            } else if (autoSubmit && result.hasUnanswered) {
                Log.add('warn', '存在未答题目，不自动提交（可开启强制提交）');
                if (Settings.get('autoSave')) {
                    Log.add('info', '自动保存答案（未提交）...');
                    findAndClickSaveButton(quizDoc);
                }
            } else {
                if (Settings.get('autoSave')) {
                    Log.add('info', '自动保存答案（未提交）...');
                    findAndClickSaveButton(quizDoc);
                } else {
                    Log.add('info', '答题完成，未设置自动提交/保存');
                }
            }
            return true;
        },

        async processApiMission(task, apiPath) {
            // 通过API完成文档/阅读任务（参考3格式）
            try {
                // 从URL参数或页面提取courseId/classId/chapterId
                const urlParams = new URLSearchParams(window.location.search);
                const classId = task.property?.classid || task.property?.classId || urlParams.get('clazzid') || urlParams.get('classid') || '';
                const courseId = task.property?.courseid || task.property?.courseId || urlParams.get('courseid') || '';
                const chapterId = urlParams.get('chapterId') || urlParams.get('knowledgeid') || '';

                // jobid 可能在task根级或property中
                const jobId = task.jobid || task.property?.jobid || '';
                // jtoken 在task根级
                const jtoken = task.jtoken || task.property?.jtoken || '';
                // objectId 在property中
                const objectId = task.property?.objectId || task.property?.objectid || '';

                if (!jobId) {
                    Log.add('warn', '缺少jobid参数，跳过API任务');
                    return false;
                }

                Log.add('debug', `API参数: jobId=${jobId}, classId=${classId}, courseId=${courseId}, chapterId=${chapterId}, jtoken=${jtoken ? '有' : '无'}, objectId=${objectId || '无'}`);

                // 参考3的请求格式: /ananas/job/document?jobid=xx&knowledgeid=xx&courseid=xx&clazzid=xx&jtoken=xx
                let url = `https://mooc1.chaoxing.com${apiPath}`;
                const params = [];
                params.push(`jobid=${jobId}`);
                if (chapterId) params.push(`knowledgeid=${chapterId}`);
                if (courseId) params.push(`courseid=${courseId}`);
                if (classId) params.push(`clazzid=${classId}`);
                if (jtoken) params.push(`jtoken=${jtoken}`);
                if (objectId) params.push(`objectid=${objectId}`);
                params.push(`isphone=true`, `time=${Date.now()}`);
                url += '?' + params.join('&');

                Log.add('info', `API请求: ${apiPath}?jobid=${jobId}`);

                // 随机延迟9-11秒后发送请求（反检测）
                const delay = 9000 + Math.random() * 2000;
                await sleep(delay);

                const resp = await gmRequest('GET', url, {}, '');
                try {
                    const result = JSON.parse(resp.responseText);
                    if (result.status) {
                        Log.add('info', 'API任务已完成: ' + apiPath);
                        return true;
                    } else {
                        Log.add('warn', 'API任务未完成: ' + (result.msg || result.message || JSON.stringify(result).slice(0, 100)));
                        return false;
                    }
                } catch {
                    // 非JSON响应，可能是成功（某些API返回纯文本）
                    Log.add('info', 'API任务已请求(非JSON响应): ' + resp.responseText.slice(0, 100));
                    return true;
                }
            } catch (e) {
                Log.add('error', 'API任务失败: ' + e.message);
                return false;
            }
        },

        finishMission(message, type) {
            if (!this.currentMission) return;
            const idx = this.queue.findIndex(item => item === this.currentMission);
            if (idx >= 0) this.queue.splice(idx, 1);
            this.completedCount++;
            Log.add(type, `${this.currentMission.name}: ${message} (${this.completedCount}/${this.pendingCount})`);

            // 标记完成
            if (this.currentMission.task.jobid) {
                try {
                    localStorage.setItem('cxai_job_' + this.currentMission.task.jobid, JSON.stringify({ completed: true, time: Date.now() }));
                } catch {}
            }

            this.clearCurrent();

            if (this.queue.length === 0) {
                // 检查是否有媒体还在播放或处理中（防止视频未播完就跳转）
                if (this._mediaTaskActive || this.hasPlayingMedia()) {
                    Log.add('info', '⏳ 队列已清空，但有视频/音频仍在处理中，等待完成后再跳转');
                    return;
                }
                Log.add('info', '✅ 本章节任务全部完成');
                setTimeout(() => this.gotoNextSection(), 3000);
            }
        },

        clearCurrent() {
            this.currentMission = null;
            this.busy = false;
        },

        // 检查是否有视频/音频正在播放（防止在媒体播放过程中误跳转）
        hasPlayingMedia() {
            let playing = false;
            try {
                forEachSameOriginFrame((doc) => {
                    if (playing) return;
                    const video = doc.querySelector('video');
                    const audio = doc.querySelector('audio');
                    // 真实播放中
                    if (video && !video.ended && video.currentTime > 0 && !video.paused) playing = true;
                    if (audio && !audio.ended && audio.currentTime > 0 && !audio.paused) playing = true;
                });
            } catch {}
            return playing;
        },

        gotoNextSection() {
            const jumpMode = Settings.get('jumpMode');

            // 不跳转模式：任务完成后停止，等用户手动切换
            if (jumpMode === 2) {
                Log.add('info', '✅ 本章节任务全部完成（不跳转模式，请手动切换下一章）');
                ProgressTracker.reset('本章完成，等待手动切换');
                this.stop();
                return;
            }

            Log.add('info', '正在跳转下一章...');
            ProgressTracker.reset('正在跳转下一章...');

            // 先处理可能存在的"未完成任务"确认弹窗（参考3方案）
            if (this._handleUnfinishedTaskPopup()) return;

            // 策略1: 在侧边栏找到当前active项，点击下一个兄弟（参考3的smart模式）
            const sidebarSelectors = [
                { list: '.prev_ul', active: '.active', item: 'li' },
                { list: '.submenuUl', active: '.submenuUl_li.active', item: '.submenuUl_li' },
                { list: '.posCatalog_select', active: '.posCatalog_active', item: 'li' },
                { list: '.chapter-list', active: '.active', item: 'li' },
                { list: '.catalog_s', active: '.active', item: 'li' },
            ];
            for (const { list, active, item } of sidebarSelectors) {
                const container = document.querySelector(list);
                if (!container) continue;
                const items = Array.from(container.querySelectorAll(item));
                const activeIdx = items.findIndex(el => el.classList.contains('active') || el.classList.contains('posCatalog_active'));
                if (activeIdx >= 0 && activeIdx < items.length - 1) {
                    const nextItem = items[activeIdx + 1];
                    const link = nextItem.querySelector('a') || nextItem;
                    const name = (nextItem.textContent || '').trim().substring(0, 30);
                    Log.add('info', `跳转到: ${name}`);
                    link.click();
                    this._delayedCheckPopup();
                    this.resetForNewSection();
                    return;
                }
            }

            // 策略2: CSS相邻兄弟选择器
            const strongSelectors = [
                '.prev_ul li.active + li a',
                '.submenuUl .submenuUl_li.active + .submenuUl_li a',
                '.posCatalog_select .posCatalog_active + li a',
                '.chapter-list .active + li a',
            ];
            for (const sel of strongSelectors) {
                const next = document.querySelector(sel);
                if (next) {
                    Log.add('info', `跳转到: ${(next.textContent || '').trim().substring(0, 30)}`);
                    next.click();
                    this._delayedCheckPopup();
                    this.resetForNewSection();
                    return;
                }
            }

            // 策略3: 下一节按钮（参考3的traverse模式）
            const nextBtnSelectors = [
                '.jb_btn.jb_btn_92.fs14.prev_next.next',
                '.orientationright',
                '#prev_next_next',
                '.next_btn',
                '.nextBtn',
            ];
            for (const sel of nextBtnSelectors) {
                const btn = document.querySelector(sel);
                if (btn) {
                    btn.click();
                    Log.add('info', '已点击下一节按钮');
                    this._delayedCheckPopup();
                    this.resetForNewSection();
                    return;
                }
            }

            // 策略4: 文本匹配（在主页面和iframe中查找）
            const clickByText = (doc) => {
                const els = doc.querySelectorAll('a, button, span[onclick], div[onclick]');
                for (const el of els) {
                    const text = (el.textContent || '').trim();
                    if (/^下一[节章步]$/.test(text) || text === 'Next') {
                        el.click();
                        return true;
                    }
                }
                return false;
            };
            if (clickByText(document)) {
                Log.add('info', '已跳转下一节(文本匹配)');
                this._delayedCheckPopup();
                this.resetForNewSection();
                return;
            }
            forEachSameOriginFrame((doc) => {
                if (clickByText(doc)) {
                    Log.add('info', '已跳转下一节(iframe文本匹配)');
                }
            });

            Log.add('warn', '未找到下一节跳转按钮，请手动切换');
        },

        // 处理"当前章节还有任务点未完成"的确认弹窗（参考3方案）
        _handleUnfinishedTaskPopup() {
            // 新版学习通弹窗
            const warn = document.querySelector('.popDiv.wid440.popMove .jobLimitTip');
            if (warn && /当前章节还有任务点未完成/.test(warn.innerText)) {
                const nextBtn = document.querySelector('.popDiv.wid440.popMove .nextChapter');
                if (nextBtn) {
                    Log.add('info', '检测到未完成任务提示，自动点击"下一节"');
                    nextBtn.click();
                    this.resetForNewSection();
                    return true;
                }
            }
            // 旧版学习通弹窗
            const tip = document.getElementById('jobFinishTip');
            if (tip && tip.style.display !== 'none') {
                const nextBtn = tip.querySelector('.nextChapter');
                if (nextBtn) {
                    Log.add('info', '检测到完成提示，自动点击"下一节"');
                    nextBtn.click();
                    this.resetForNewSection();
                    return true;
                }
            }
            return false;
        },

        // 点击后延迟检查弹窗是否出现（参考3方案）
        _delayedCheckPopup() {
            setTimeout(() => this._handleUnfinishedTaskPopup(), 500);
            setTimeout(() => this._handleUnfinishedTaskPopup(), 1500);
        },

        resetForNewSection() {
            this.queue = [];
            this.currentMission = null;
            this.busy = false;
            this._mediaTaskActive = false;
            this._buildQueueFailCount = 0;
            this.completedCount = 0;
            this.pendingCount = 0;
            this.lastJumpTime = Date.now();
            Log.add('info', '等待新页面加载...');
        },

        resetCounters() {
            this.emptySectionCount = 0;
        },
    };

    // 发现并点击测验提交按钮（参考2）
    function findAndClickQuizSubmitButton(doc) {
        try {
            const targetWindow = doc.defaultView || window;

            // 策略1: 调用已知提交函数
            const submitMethods = [
                () => { if (typeof targetWindow.btnBlueSubmit === 'function') { targetWindow.btnBlueSubmit(); return true; } return false; },
                () => { if (typeof targetWindow.submitCheckTimes === 'function') { targetWindow.submitCheckTimes(); return true; } return false; },
                () => { if (typeof targetWindow.submitWork === 'function') { targetWindow.submitWork(); return true; } return false; },
            ];
            for (const method of submitMethods) {
                try { if (method()) return true; } catch {}
            }

            // 策略2: CSS选择器
            const submitSelectors = [
                'input[type="submit"][value*="提交"]', 'button[type="submit"]',
                'input[value="提交答案"]', 'input[value="提交"]',
                'button[onclick*="submit"]', 'button[onclick*="btnBlueSubmit"]',
                '.submit-btn', '.btn-submit', '#submit', '.submit',
                'input[id*="submit"]', 'button[id*="submit"]',
                'input[onclick*="tijiao"]', 'button[onclick*="tijiao"]',
            ];
            for (const sel of submitSelectors) {
                const btn = doc.querySelector(sel);
                if (btn && !btn.disabled) {
                    try {
                        const onclick = btn.getAttribute('onclick');
                        if (onclick) {
                            try { new targetWindow.Function(onclick).call(btn); return true; } catch {}
                        }
                        btn.click();
                        return true;
                    } catch {}
                }
            }

            // 策略3: 文本匹配
            for (const el of doc.querySelectorAll('input, button, a, span, div')) {
                const text = (el.textContent || el.value || '').trim();
                if (/^(提交|提交答案|完成|确认提交)$/.test(text)) {
                    try {
                        const onclick = el.getAttribute('onclick');
                        if (onclick) {
                            try { new targetWindow.Function(onclick).call(el); return true; } catch {}
                        }
                        el.click();
                        return true;
                    } catch {}
                }
            }

            Log.add('warn', '未找到提交按钮');
            return false;
        } catch (e) {
            Log.add('error', '查找提交按钮失败: ' + e.message);
            return false;
        }
    }

    // 发现并点击保存按钮（不提交，仅保存答案）
    function findAndClickSaveButton(doc) {
        try {
            const targetWindow = doc.defaultView || window;

            // 策略1: 调用已知保存函数
            const saveMethods = [
                () => { if (typeof targetWindow.noSubmit === 'function') { targetWindow.noSubmit(); return true; } return false; },
                () => { if (typeof targetWindow.saveWork === 'function') { targetWindow.saveWork(); return true; } return false; },
            ];
            for (const method of saveMethods) {
                try { if (method()) { Log.add('info', '已保存答案'); return true; } } catch {}
            }

            // 策略2: CSS选择器
            const saveSelectors = [
                'input[value*="保存"]', 'button[onclick*="save"]', 'button[onclick*="noSubmit"]',
                '.save-btn', '.btn-save', '#save',
                'input[onclick*="baocun"]', 'button[onclick*="baocun"]',
            ];
            for (const sel of saveSelectors) {
                const btn = doc.querySelector(sel);
                if (btn && !btn.disabled) {
                    try {
                        const onclick = btn.getAttribute('onclick');
                        if (onclick) {
                            try { new targetWindow.Function(onclick).call(btn); return true; } catch {}
                        }
                        btn.click();
                        Log.add('info', '已点击保存按钮');
                        return true;
                    } catch {}
                }
            }

            // 策略3: 文本匹配
            for (const el of doc.querySelectorAll('input, button, a, span, div')) {
                const text = (el.textContent || el.value || '').trim();
                if (/^(保存|保存答案|暂存)$/.test(text)) {
                    try {
                        el.click();
                        Log.add('info', '已点击保存按钮(文本匹配)');
                        return true;
                    } catch {}
                }
            }

            Log.add('warn', '未找到保存按钮');
            return false;
        } catch (e) {
            Log.add('error', '查找保存按钮失败: ' + e.message);
            return false;
        }
    }

    /* ===== SECTION 11: EXAM MODULE ===== */

    function parseExamQuestions(doc = document) {
        // 复用通用解析，考试页面会被detectPageType识别为newExam/oldExam
        return parseAllQuestions(doc);
    }

    async function initExamModule() {
        Log.add('info', '考试模块启动');
        if (!Settings.get('autoAnswerExam')) {
            Log.add('warn', '考试自动答题已关闭，请在设置中开启');
            return;
        }

        await sleep(2000);
        decryptFont();

        const questions = parseExamQuestions();
        if (questions.length === 0) {
            Log.add('warn', '未找到考试题目');
            return;
        }

        Log.add('info', `发现 ${questions.length} 道考试题目`);
        sendFrameMessage('EXAM_START', { total: questions.length });

        let completed = 0;
        for (const question of questions) {
            if (question.type === 'unknown') continue;

            try {
                let answer = null;
                if (Settings.get('cacheEnabled')) {
                    const cached = Cache.get(question.text);
                    if (cached) answer = cached.answer;
                }

                if (!answer) {
                    Log.add('info', `[考试AI] Q${completed + 1}: ${question.text.slice(0, 30)}...`);
                    const prompt = buildQuestionPrompt(question);
                    answer = await callAI(prompt);
                    if (Settings.get('cacheEnabled')) {
                        Cache.set(question.text, answer, question.type, Settings.get('provider'));
                    }
                }

                fillQuestionAnswer(question, answer);
                completed++;
                sendFrameMessage('EXAM_PROGRESS', { completed, total: questions.length });

                // Longer random delay for exam (2-5 seconds)
                const delay = 2000 + Math.random() * 3000;
                await sleep(delay);
            } catch (e) {
                Log.add('error', `考试Q${completed + 1} 失败: ${e.message}`);
            }
        }

        Log.add('info', `考试答题完成: ${completed}/${questions.length}`);
        sendFrameMessage('EXAM_DONE', { completed, total: questions.length });
    }

    /* ===== SECTION 12: PASTE BYPASS ===== */
    // 综合参考4粘贴.js (by Muyue) + UEditor专属解锁方案
    // 通过注入<script>到页面上下文解决document-idle时序问题

    function initPasteBypass() {
        if (!Settings.get('unlockPaste')) return;

        // CSS覆盖由 initPasteBypassToggle() 统一管理

        // 核心：注入脚本到页面上下文
        // @run-at document-idle 意味着页面JS已执行完毕，粘贴拦截已注册
        // 通过创建<script>注入页面上下文，让捕获阶段监听器抢先执行
        try {
            const script = document.createElement('script');
            script.textContent = '(' + function() {
                'use strict';
                var TAG = '[Unified-Paste]';
                var log = function() { console.log.apply(console, [TAG].concat(Array.prototype.slice.call(arguments))); };

                function showNotice(msg) {
                    if (window.$ && $.toast) { $.toast({ type: 'notice', content: msg }); }
                    else { console.log(TAG, msg); }
                }

                // ── 策略1: 覆写页面全局拦截函数（UEditor专属） ──
                // 学习通用 window.editorPaste 做粘贴拦截，覆写它使其放行
                window.editorPaste = function() { return true; };

                // ── 策略2: 讨论区粘贴绕过（参考4） ──
                function initDiscussionLogic() {
                    var checkObj = setInterval(function() {
                        if (window.obj) {
                            if (window.obj.circle) { window.obj.circle.prohibitReplyPasting = 0; log('Discussion config bypassed'); }
                            window.obj.isManager = 1;
                            clearInterval(checkObj);
                        }
                    }, 500);
                    setTimeout(function() { clearInterval(checkObj); }, 10000);
                    window.addEventListener('paste', function(e) {
                        var target = e.target;
                        if (target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
                            e.stopImmediatePropagation();
                        }
                    }, true);
                }

                // ── 策略3: UEditor粘贴绕过（参考4 + 专属方案） ──
                function initUEditorLogic() {
                    var timer = setInterval(function() {
                        if (!window.UE || !UE.instants) return;
                        clearInterval(timer);

                        // 遍历所有编辑器实例
                        for (var key in UE.instants) {
                            var editor = UE.instants[key];
                            if (!editor) continue;

                            // 专属方案：移除编辑器自带的粘贴拦截，替换为放行
                            try { editor.removeListener('beforepaste', window.editorPaste); } catch {}
                            try { editor.addListener('beforepaste', function() { return true; }); } catch {}

                            // 参考4：拦截iframe内的粘贴事件，强制插入纯文本
                            if (editor.iframe) {
                                var doc = editor.iframe.contentDocument;
                                if (doc && doc.body) {
                                    doc.addEventListener('paste', function(e) {
                                        var cd = e.clipboardData || window.clipboardData;
                                        if (!cd) return;
                                        var hasFile = false;
                                        var hasHtml = !!cd.getData('text/html');
                                        if (cd.items) { for (var i = 0; i < cd.items.length; i++) { if (cd.items[i].kind === 'file') { hasFile = true; break; } } }
                                        if (hasFile || hasHtml) {
                                            e.preventDefault();
                                            e.stopImmediatePropagation();
                                            var text = cd.getData('text/plain');
                                            if (text) {
                                                editor.execCommand('insertHtml', text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>'), true);
                                                showNotice('已绕过粘贴限制 By.Muyue -imuyue.com');
                                            }
                                        }
                                    }, true);
                                }
                            }
                        }
                        log('UEditor paste bypass applied');
                    }, 500);
                }

                // ── 策略4: CodeMirror粘贴绕过（参考4） ──
                function initCodeEditorLogic() {
                    var checkCodeEditor = setInterval(function() {
                        var codeEditors = window.codeEditors || {};
                        if (Object.keys(codeEditors).length === 0) return;
                        clearInterval(checkCodeEditor);
                        log('CodeMirror detected, unlocking paste...');
                        for (var editorId in codeEditors) {
                            var editor = codeEditors[editorId];
                            if (editor && !editor._isUnlocked) {
                                editor.on('beforeChange', function(cm, change) {
                                    if (change.origin === 'paste') {
                                        change.cancel();
                                        var pastedText = change.text ? change.text.join('\n') : '';
                                        var cursor = cm.getCursor();
                                        cm.operation(function() { cm.replaceRange(pastedText, cursor); });
                                        showNotice('已绕过代码粘贴限制 By.Muyue -imuyue.com');
                                    }
                                });
                                editor._isUnlocked = true;
                            }
                        }
                    }, 1000);
                }

                // 启动
                initDiscussionLogic();
                initUEditorLogic();
                initCodeEditorLogic();
            } + ')();';
            document.documentElement.appendChild(script);
            script.remove();
            Log.add('info', '粘贴限制绕过已启用');
        } catch (e) {
            Log.add('error', '粘贴绕过注入失败: ' + e.message);
        }
    }

    // 即时启用/禁用粘贴绕过（不刷新页面）
    // 注入页面上下文的脚本无法移除，但 document 捕获阶段监听器可以即时生效
    let _pasteBypassEnabled = false;
    let _pasteBypassStyleEl = null;
    function initPasteBypassToggle(enable) {
        if (enable) {
            if (_pasteBypassEnabled) return;
            _pasteBypassEnabled = true;
            // CSS 覆盖 user-select 限制
            _pasteBypassStyleEl = GM_addStyle(`
                input, textarea, [contenteditable="true"],
                .edit_text, .edui-body-container, .ueditor_wrap,
                .answercontent, .mark_answer, .answerTextContent {
                    -webkit-user-select: text !important;
                    -moz-user-select: text !important;
                    -ms-user-select: text !important;
                    user-select: text !important;
                    -webkit-touch-callout: default !important;
                }
            `);
            // 捕获阶段拦截 paste 事件，阻止页面脚本拦截
            document.addEventListener('paste', _onPasteBypass, true);
            Log.add('info', '粘贴限制绕过已启用（即时生效）');
        } else {
            if (!_pasteBypassEnabled) return;
            _pasteBypassEnabled = false;
            document.removeEventListener('paste', _onPasteBypass, true);
            if (_pasteBypassStyleEl) { try { _pasteBypassStyleEl.remove(); } catch {} _pasteBypassStyleEl = null; }
            Log.add('info', '粘贴限制绕过已关闭');
        }
    }
    function _onPasteBypass(e) {
        const t = e.target;
        if (t && (t.tagName === 'TEXTAREA' || t.tagName === 'INPUT' || t.contentEditable === 'true')) {
            e.stopImmediatePropagation();
        }
    }

    /* ===== SECTION 13: UI MODULE ===== */

    const Log = {
        entries: [],
        _container: null,
        add(level, message) {
            const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
            this.entries.push({ time, level, message });
            if (this.entries.length > 100) this.entries.shift();
            this._render();
        },
        // 插入一条占位日志行，返回索引（用于后续 updateEntry 原地替换）
        addPlaceholder(message) {
            const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
            const idx = this.entries.length;
            this.entries.push({ time, level: 'thinking', message });
            if (this.entries.length > 100) { this.entries.shift(); return idx - 1; }
            this._render();
            return idx;
        },
        // 原地替换日志行内容和级别
        updateEntry(idx, message, level) {
            if (idx >= 0 && idx < this.entries.length) {
                this.entries[idx].message = message;
                this.entries[idx].level = level || this.entries[idx].level;
                this._render();
            }
        },
        setContainer(el) {
            this._container = el;
        },
        _render() {
            if (!this._container) return;
            const html = this.entries.slice(-30).map(e => {
                const colorMap = { error: '#f38ba8', warn: '#f9e2af', info: '#a6e3a1', thinking: '#6c7086', answer: '#89b4fa' };
                const color = colorMap[e.level] || '#a6e3a1';
                const icon = e.level === 'thinking' ? '<span style="display:inline-block;width:10px;height:10px;border:2px solid #6c7086;border-top-color:transparent;border-radius:50%;animation:cx-spin 1s linear infinite;margin-right:4px;vertical-align:middle;"></span>' : '';
                return `<div style="color:${color};font-size:11px;line-height:1.4;margin:1px 0;">${icon}[${e.time}] ${e.message}</div>`;
            }).join('');
            this._container.innerHTML = html;
            this._container.scrollTop = this._container.scrollHeight;
        },
    };

    // 进度追踪器（参考3的progressTracker）
    const ProgressTracker = {
        state: { taskName: '暂无任务', percent: 0, type: '-', detail: '等待任务开始' },
        _els: null,
        _rafScheduled: false,

        _clamp(v) { return Math.max(0, Math.min(100, Math.round(v))); },

        init() {
            if (this._els) return true;
            this._els = {
                name: document.getElementById('cx-progress-task-name'),
                percent: document.getElementById('cx-progress-percent'),
                bar: document.getElementById('cx-progress-bar-fill'),
                detail: document.getElementById('cx-progress-detail'),
                type: document.getElementById('cx-progress-type'),
                panel: document.getElementById('cx-progress-panel'),
            };
            return !!this._els.name;
        },

        render() {
            if (!this.init()) return;
            if (this._rafScheduled) return;
            this._rafScheduled = true;
            requestAnimationFrame(() => {
                this._rafScheduled = false;
                const s = this.state;
                const e = this._els;
                if (e.name) e.name.textContent = s.taskName;
                if (e.percent) e.percent.textContent = s.percent + '%';
                if (e.bar) e.bar.style.width = s.percent + '%';
                if (e.detail) e.detail.textContent = s.detail;
                if (e.type) e.type.textContent = '类型：' + s.type;
                if (e.panel) e.panel.style.display = s.taskName === '暂无任务' ? 'none' : '';
                // 同步最小化状态
                const minEl = document.getElementById('cx-min-status');
                if (minEl) {
                    minEl.textContent = s.taskName !== '暂无任务'
                        ? `${s.taskName} ${s.percent}%`
                        : '';
                }
            });
        },

        update(patch) {
            Object.assign(this.state, patch);
            this.state.percent = this._clamp(this.state.percent);
            this.render();
        },

        reset(msg) {
            this.update({ taskName: '暂无任务', percent: 0, type: '-', detail: msg || '等待任务开始' });
        },
    };

    // 格式化秒数为 MM:SS 或 HH:MM:SS
    function formatDuration(sec) {
        if (!sec || sec < 0) return '00:00';
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = Math.floor(sec % 60);
        const pad = n => String(n).padStart(2, '0');
        return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
    }

    function createFloatingPanel() {
        GM_addStyle(`
            #cx-ai-panel {
                position: fixed; top: 0; left: 0;
                width: 720px; height: 560px;
                background: #1e1e2e;
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.05);
                z-index: 2147483647 !important;
                display: flex; flex-direction: column;
                overflow: visible !important;
                min-width: 240px; min-height: 160px;
                transform: translate(370px, 75px);
                will-change: transform;
                max-width: 720px !important;
                max-height: 560px !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
                font-size: 14px;
                color: #cdd6f4;
                box-sizing: content-box !important;
                padding: 0 !important; margin: 0 !important;
                pointer-events: auto !important;
                visibility: visible !important; opacity: 1 !important;
                backdrop-filter: blur(20px);
            }
            #cx-ai-panel * { box-sizing: border-box; }
            @keyframes cx-spin { to { transform: rotate(360deg); } }
            @keyframes cx-shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
            #cx-ai-panel input, #cx-ai-panel select, #cx-ai-panel button, #cx-ai-panel textarea {
                display: inline-block !important; visibility: visible !important; opacity: 1 !important;
                position: static !important; pointer-events: auto !important;
                clip: auto !important; clip-path: none !important;
                overflow: visible !important; width: auto !important; height: auto !important;
            }
            #cx-ai-panel input[type="checkbox"] {
                display: none !important;
            }
            #cx-ai-panel.cx-minimized {
                height: auto !important; max-height: none !important;
                min-width: auto !important; min-height: auto !important;
                max-width: 280px !important;
            }
            #cx-ai-panel.cx-minimized .cx-panel-body { display: none; }
            #cx-ai-panel.cx-minimized .cx-panel-header { padding: 8px 12px; }
            #cx-ai-panel.cx-minimized .cx-panel-header h3 { font-size: 12px; }
            #cx-ai-panel.cx-minimized .cx-min-status { display: inline; }
            #cx-ai-panel .cx-min-status { display: none; margin-left: 8px; font-size: 11px; opacity: 0.7; }

            .cx-panel-header {
                background: linear-gradient(135deg, #181825 0%, #1e1e2e 100%);
                color: #cdd6f4;
                padding: 10px 14px; cursor: move;
                display: flex; align-items: center;
                justify-content: space-between;
                flex-shrink: 0; user-select: none;
                border-radius: 11px 11px 0 0;
                border-bottom: 1px solid rgba(255,255,255,0.06);
            }
            .cx-panel-header h3 { margin: 0; font-size: 14px; color: #cdd6f4; font-weight: 600; letter-spacing: 0.3px; }
            .cx-panel-header .cx-btns button {
                background: rgba(255,255,255,0.05); color: #a6adc8; border: none;
                margin-left: 6px; cursor: pointer; font-size: 13px;
                padding: 4px 10px; border-radius: 6px;
                transition: all 0.2s;
            }
            .cx-panel-header .cx-btns button:hover { background: rgba(255,255,255,0.12); color: #cdd6f4; }

            /* Status Bar */
            .cx-status-bar { display: flex; align-items: center; gap: 16px; padding: 8px 14px; background: #181825; border-bottom: 1px solid rgba(255,255,255,0.06); flex-shrink: 0; }
            .cx-status-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #a6adc8; }
            .cx-status-dot { width: 8px; height: 8px; border-radius: 50%; background: #a6e3a1; animation: cx-pulse 2s infinite; }
            .cx-status-dot.warning { background: #f9e2af; }
            .cx-status-dot.error { background: #f38ba8; }
            .cx-status-dot.idle { background: #6c7086; animation: none; }

            .cx-progress-panel {
                padding: 10px 14px; background: rgba(255,255,255,0.02);
                border-bottom: 1px solid rgba(255,255,255,0.06); flex-shrink: 0;
                display: none;
            }
            .cx-progress-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
            .cx-progress-task-name { font-size: 13px; font-weight: 600; color: #cdd6f4; max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .cx-progress-percent { font-size: 16px; font-weight: 700; color: #89b4fa; font-variant-numeric: tabular-nums; }
            .cx-progress-meta { font-size: 11px; color: #6c7086; margin-bottom: 6px; }
            .cx-progress-detail { font-size: 12px; color: #a6adc8; margin-top: 4px; }
            .cx-progress-track { height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; }
            .cx-progress-track-fill { height: 100%; background: linear-gradient(90deg, #89b4fa, #a6e3a1); border-radius: 3px; transition: width 0.4s ease; width: 0%; }
            @keyframes cx-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

            .cx-panel-body {
                flex: 1; overflow: auto; padding: 16px;
                display: flex; flex-direction: column;
                background: #1e1e2e;
                border-radius: 0 0 11px 11px;
            }
            .cx-panel-body label { display: block; font-size: 12px; color: #a6adc8; margin: 10px 0 5px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
            .cx-panel-body select,
            .cx-panel-body input[type="text"],
            .cx-panel-body input[type="password"] {
                display: inline-block; padding: 8px 12px;
                font-size: 13px; line-height: 1.43;
                color: #cdd6f4; background-color: #181825;
                border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;
                transition: border-color .2s, box-shadow .2s;
                font-family: inherit; width: 100%;
            }
            .cx-panel-body select:focus,
            .cx-panel-body input:focus {
                border-color: #89b4fa; outline: 0;
                box-shadow: 0 0 0 3px rgba(137,180,250,0.15);
            }
            .cx-panel-body select { cursor: pointer; }
            .cx-panel-body select option { background: #181825; color: #cdd6f4; }

            .cx-row { display: flex; gap: 10px; align-items: center; justify-content: space-between; margin: 0; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
            .cx-row:last-child { border-bottom: none; }
            .cx-row:hover { background: rgba(255,255,255,0.02); }
            .cx-row label { margin: 0; font-size: 13px; color: #bac2de; cursor: pointer; flex: 1; line-height: 1.4; font-weight: normal; }
            .cx-toggle { width: 40px; height: 22px; background: #45475a; border-radius: 11px; position: relative; cursor: pointer; transition: background 0.3s; flex-shrink: 0; }
            .cx-toggle.active { background: #89b4fa; }
            .cx-toggle::after { content: ''; position: absolute; width: 18px; height: 18px; background: #cdd6f4; border-radius: 50%; top: 2px; left: 2px; transition: transform 0.3s; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
            .cx-toggle.active::after { transform: translateX(18px); }

            .cx-btn {
                display: inline-block; padding: 7px 14px;
                font-size: 13px; font-weight: 500; line-height: 1.43;
                text-align: center; white-space: nowrap; vertical-align: middle;
                cursor: pointer; border: none;
                border-radius: 8px; text-decoration: none;
                transition: all 0.2s; font-family: inherit;
                letter-spacing: 0.2px;
            }
            .cx-btn:active { transform: scale(0.97); }
            .cx-btn-primary { color: #1e1e2e; background: linear-gradient(135deg, #89b4fa, #74c7ec); }
            .cx-btn-primary:hover { box-shadow: 0 4px 16px rgba(137,180,250,0.3); filter: brightness(1.1); }
            .cx-btn-default { color: #cdd6f4; background-color: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); }
            .cx-btn-default:hover { background-color: rgba(255,255,255,0.1); }
            .cx-btn-danger { color: #1e1e2e; background: linear-gradient(135deg, #f38ba8, #eba0ac); }
            .cx-btn-danger:hover { box-shadow: 0 4px 16px rgba(243,139,168,0.3); filter: brightness(1.1); }
            .cx-btn-success { color: #1e1e2e; background: linear-gradient(135deg, #a6e3a1, #94e2d5); }
            .cx-btn-success:hover { box-shadow: 0 4px 16px rgba(166,227,161,0.3); filter: brightness(1.1); }
            .cx-btn-sm { padding: 5px 12px; font-size: 12px; }
            .cx-btn-group { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }

            .cx-log {
                margin-top: 10px; max-height: 200px; overflow-y: auto;
                background: #11111b; border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;
                padding: 10px; line-height: 1.6;
                font-family: 'Cascadia Code', 'JetBrains Mono', 'Consolas', 'SF Mono', monospace; font-size: 12px;
            }
            .cx-log::-webkit-scrollbar { width: 6px; }
            .cx-log::-webkit-scrollbar-track { background: transparent; }
            .cx-log::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
            .cx-log::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            .cx-divider { border-top: 1px solid rgba(255,255,255,0.06); margin: 10px 0; }
            .cx-status { font-size: 13px; color: #a6e3a1; margin: 6px 0; padding: 4px 0; }

            .cx-tabs {
                display: flex; gap: 4px; margin-bottom: 14px;
                background: rgba(255,255,255,0.03);
                padding: 4px; border-radius: 10px;
                flex-shrink: 0; flex-wrap: wrap;
            }
            .cx-tab {
                background: transparent; border: none;
                padding: 8px 16px;
                cursor: pointer; border-radius: 7px;
                font-size: 13px; transition: all 0.2s; white-space: nowrap;
                color: #6c7086; font-weight: 500;
                display: flex; align-items: center; gap: 6px;
            }
            .cx-tab:hover { color: #bac2de; background: rgba(255,255,255,0.04); }
            .cx-tab.active { background: rgba(137,180,250,0.12); color: #89b4fa; font-weight: 600; }
            .cx-tab-panel { display: none; flex: 1; overflow-y: auto; }
            .cx-tab-panel.active { display: block; }
            .cx-tab-panel::-webkit-scrollbar { width: 6px; }
            .cx-tab-panel::-webkit-scrollbar-track { background: transparent; }
            .cx-tab-panel::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }

            .cx-panel { margin-bottom: 14px; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; background: rgba(255,255,255,0.02); overflow: hidden; }
            .cx-panel-heading { background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.05); padding: 10px 14px; font-weight: 600; font-size: 13px; color: #89b4fa; letter-spacing: 0.3px; display: flex; align-items: center; justify-content: space-between; }
            .cx-badge { font-size: 10px; padding: 2px 8px; border-radius: 10px; background: rgba(137,180,250,0.12); color: #89b4fa; font-weight: 500; }
            .cx-panel-content { padding: 14px; }

            .cx-progress { height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; margin: 8px 0; }
            .cx-progress-bar { height: 100%; background: linear-gradient(90deg, #89b4fa, #a6e3a1); border-radius: 3px; transition: width 0.4s ease; width: 0%; }
        `);

        const panel = document.createElement('div');
        panel.id = 'cx-ai-panel';
        panel.innerHTML = `
            <div class="cx-panel-header">
                <h3>学习通AI助手 v2.0 <span class="cx-min-status" id="cx-min-status"></span></h3>
                <div class="cx-btns">
                    <button id="cx-minimize" title="最小化">─</button>
                    <button id="cx-close" title="关闭面板">✕</button>
                </div>
            </div>
            <div class="cx-status-bar" id="cx-status-bar">
                <div class="cx-status-item"><div class="cx-status-dot" id="cx-status-dot"></div><span id="cx-status-text">就绪</span></div>
                <div class="cx-status-item">📹 视频 <span id="cx-video-count">0/0</span></div>
                <div class="cx-status-item">📝 答题 <span id="cx-quiz-count">0</span></div>
            </div>
            <div class="cx-progress-panel" id="cx-progress-panel">
                <div class="cx-progress-header">
                    <div class="cx-progress-task-name" id="cx-progress-task-name">暂无任务</div>
                    <div class="cx-progress-percent" id="cx-progress-percent">0%</div>
                </div>
                <div class="cx-progress-meta" id="cx-progress-type">类型：-</div>
                <div class="cx-progress-track"><div class="cx-progress-track-fill" id="cx-progress-bar-fill"></div></div>
                <div class="cx-progress-detail" id="cx-progress-detail">等待任务开始</div>
            </div>
            <div class="cx-panel-body" id="cx-panel-body">
                <div class="cx-tabs">
                    <button class="cx-tab active" data-tab="cx-tab-main">📊 主页日志</button>
                    <button class="cx-tab" data-tab="cx-tab-task">⚙️ 任务配置</button>
                    <button class="cx-tab" data-tab="cx-tab-ai">🤖 AI配置</button>
                    <button class="cx-tab" data-tab="cx-tab-advanced">🔧 高级配置</button>
                    <button class="cx-tab" data-tab="cx-tab-login">🔑 自动登录</button>
                </div>

                <!-- 主页日志 -->
                <div class="cx-tab-panel active" id="cx-tab-main">
                    <div class="cx-panel">
                        <div class="cx-panel-heading">运行状态</div>
                        <div class="cx-panel-content">
                            <div class="cx-status" id="cx-status">就绪</div>
                            <div class="cx-progress"><div class="cx-progress-bar" id="cx-progress"></div></div>
                            <div class="cx-btn-group">
                                <button class="cx-btn cx-btn-primary cx-btn-sm" id="cx-test">测试连接</button>
                                <button class="cx-btn cx-btn-success cx-btn-sm" id="cx-chapter-toggle">开始刷课</button>
                                <button class="cx-btn cx-btn-danger cx-btn-sm" id="cx-clear-cache">清空缓存</button>
                            </div>
                        </div>
                    </div>
                    <div class="cx-panel">
                        <div class="cx-panel-heading">运行日志</div>
                        <div class="cx-panel-content">
                            <div class="cx-log" id="cx-log"></div>
                        </div>
                    </div>
                </div>

                <!-- 任务配置 -->
                <div class="cx-tab-panel" id="cx-tab-task">
                    <div class="cx-panel">
                        <div class="cx-panel-heading">基本功能</div>
                        <div class="cx-panel-content">
                            <div class="cx-row"><input type="checkbox" id="cx-autovideo"><label for="cx-autovideo">自动播放视频</label><div class="cx-toggle" data-target="cx-autovideo"></div></div>
                            <div class="cx-row"><input type="checkbox" id="cx-autoquiz"><label for="cx-autoquiz">自动作答作业/测验</label><div class="cx-toggle" data-target="cx-autoquiz"></div></div>
                            <div class="cx-row"><input type="checkbox" id="cx-autoexam"><label for="cx-autoexam">自动作答考试</label><div class="cx-toggle" data-target="cx-autoexam"></div></div>
                            <div class="cx-row"><input type="checkbox" id="cx-autochapter"><label for="cx-autochapter">自动刷章节</label><div class="cx-toggle" data-target="cx-autochapter"></div></div>
                            <div class="cx-row"><input type="checkbox" id="cx-unlockpaste"><label for="cx-unlockpaste">解锁粘贴限制</label><div class="cx-toggle" data-target="cx-unlockpaste"></div></div>
                        </div>
                    </div>
                    <div class="cx-panel">
                        <div class="cx-panel-heading">答题配置</div>
                        <div class="cx-panel-content">
                            <div class="cx-row"><input type="checkbox" id="cx-fontdecrypt"><label for="cx-fontdecrypt">字体解密（处理学习通加密字体）</label><div class="cx-toggle" data-target="cx-fontdecrypt"></div></div>
                            <div class="cx-row"><input type="checkbox" id="cx-fuzzymatch"><label for="cx-fuzzymatch">模糊匹配（Levenshtein编辑距离）</label><div class="cx-toggle" data-target="cx-fuzzymatch"></div></div>
                            <div class="cx-row"><input type="checkbox" id="cx-goodstudent"><label for="cx-goodstudent">好学生模式（仅标记答案，不自动选择）</label><div class="cx-toggle" data-target="cx-goodstudent"></div></div>
                            <div class="cx-row"><input type="checkbox" id="cx-redo"><label for="cx-redo">重做模式（覆盖已答题目）</label><div class="cx-toggle" data-target="cx-redo"></div></div>
                            <div class="cx-row"><input type="checkbox" id="cx-autosubmit"><label for="cx-autosubmit">自动提交（所有题目答完后）</label><div class="cx-toggle" data-target="cx-autosubmit"></div></div>
                            <div class="cx-row"><input type="checkbox" id="cx-forcesubmit"><label for="cx-forcesubmit">强制提交（存在未答题目也提交）</label><div class="cx-toggle" data-target="cx-forcesubmit"></div></div>
                            <div class="cx-row"><input type="checkbox" id="cx-altertitle"><label for="cx-altertitle">答案插入题干显示</label><div class="cx-toggle" data-target="cx-altertitle"></div></div>
                            <div class="cx-row"><input type="checkbox" id="cx-randomanswer"><label for="cx-randomanswer">随机答题（无匹配时随机选择）</label><div class="cx-toggle" data-target="cx-randomanswer"></div></div>
                            <div class="cx-row" style="align-items:center;gap:6px;">
                                <label for="cx-accuracy" style="white-space:nowrap;">置信度阈值</label>
                                <input type="number" id="cx-accuracy" min="0" max="100" step="5" style="width:60px;" placeholder="80">
                                <span style="font-size:12px;color:#6c7086;">% (低于此值跳过，0=不检查)</span>
                            </div>
                            <label>答题间隔(毫秒)</label>
                            <input type="text" id="cx-filldelay" placeholder="1500">
                        </div>
                    </div>
                    <div class="cx-panel">
                        <div class="cx-panel-heading">视频配置</div>
                        <div class="cx-panel-content">
                            <div class="cx-row">
                                <input type="checkbox" id="cx-automute">
                                <label for="cx-automute">自动静音</label>
                                <div class="cx-toggle" data-target="cx-automute"></div>
                            </div>
                            <label>视频倍速</label>
                            <div style="display:flex;align-items:center;gap:8px;margin:8px 0;">
                                <input type="number" id="cx-videorate" min="1" max="3" step="0.1" value="1" style="width:80px;">
                                <span style="font-size:12px;color:#6c7086;">x</span>
                                <button class="cx-btn cx-btn-default cx-btn-sm" id="cx-rate-up">+</button>
                                <button class="cx-btn cx-btn-default cx-btn-sm" id="cx-rate-down">-</button>
                            </div>
                            <div class="cx-row"><input type="checkbox" id="cx-reviewmode"><label for="cx-reviewmode">复习模式（重新处理已完成任务）</label><div class="cx-toggle" data-target="cx-reviewmode"></div></div>
                            <div class="cx-row"><input type="checkbox" id="cx-bghangmode"><label for="cx-bghangmode">后台挂机（防休眠保活）</label><div class="cx-toggle" data-target="cx-bghangmode"></div></div>
                        </div>
                    </div>
                </div>

                <!-- AI配置 -->
                <div class="cx-tab-panel" id="cx-tab-ai">
                    <div class="cx-panel">
                        <div class="cx-panel-heading">AI Provider 设置</div>
                        <div class="cx-panel-content">
                            <label>AI Provider</label>
                            <select id="cx-provider">${Object.entries(PROVIDERS).map(([k, v]) =>
                                `<option value="${k}">${v.name}</option>`
                            ).join('')}</select>
                            <label>Model</label>
                            <select id="cx-model"></select>
                            <label>API Key</label>
                            <div class="cx-row">
                                <input type="password" id="cx-apikey" placeholder="输入API Key" style="flex:1">
                                <button class="cx-btn cx-btn-default cx-btn-sm" id="cx-toggle-key">显示</button>
                            </div>
                            <div id="cx-ernie-secret" style="display:none">
                                <label>ERNIE Secret Key</label>
                                <input type="password" id="cx-secretkey" placeholder="输入Secret Key">
                            </div>
                            <div class="cx-divider"></div>
                            <div class="cx-btn-group">
                                <button class="cx-btn cx-btn-primary cx-btn-sm" id="cx-test2">测试连接</button>
                                <button class="cx-btn cx-btn-default cx-btn-sm" id="cx-export-cache">导出缓存</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 高级配置 -->
                <div class="cx-tab-panel" id="cx-tab-advanced">
                    <div class="cx-panel">
                        <div class="cx-panel-heading">视频反检测</div>
                        <div class="cx-panel-content">
                            <div class="cx-row"><input type="checkbox" id="cx-smartspeed"><label for="cx-smartspeed">智能变速（每30秒随机±0.2x）</label><div class="cx-toggle" data-target="cx-smartspeed"></div></div>
                            <div class="cx-row"><input type="checkbox" id="cx-behaviorsim"><label for="cx-behaviorsim">行为模拟（随机鼠标移动/点击）</label><div class="cx-toggle" data-target="cx-behaviorsim"></div></div>
                            <div class="cx-row"><input type="checkbox" id="cx-detectionevasion"><label for="cx-detectionevasion">速度微扰（±5%随机偏移）</label><div class="cx-toggle" data-target="cx-detectionevasion"></div></div>
                            <div style="background:rgba(249,226,175,0.08);padding:8px 12px;border-radius:6px;margin:10px 0;font-size:12px;color:#f9e2af;">
                                高倍速存在被检测风险，建议适度使用。以上功能可降低风险但不能完全避免。
                            </div>
                        </div>
                    </div>
                    <div class="cx-panel">
                        <div class="cx-panel-heading">系统设置</div>
                        <div class="cx-panel-content">
                            <div class="cx-row"><input type="checkbox" id="cx-monitorbypass"><label for="cx-monitorbypass">多设备监控绕过（阻止detect.chaoxing.com注入）</label><div class="cx-toggle" data-target="cx-monitorbypass"></div></div>
                            <div class="cx-row"><input type="checkbox" id="cx-antisleep"><label for="cx-antisleep">防休眠（Web Audio API保活）</label><div class="cx-toggle" data-target="cx-antisleep"></div></div>
                            <div class="cx-row"><input type="checkbox" id="cx-autorefresh"><label for="cx-autorefresh">定时自动刷新页面</label><div class="cx-toggle" data-target="cx-autorefresh"></div></div>
                            <label>刷新间隔(分钟，最小5)</label>
                            <input type="text" id="cx-refreshinterval" placeholder="30">
                            <div class="cx-divider"></div>
                            <div class="cx-btn-group">
                                <button class="cx-btn cx-btn-danger cx-btn-sm" id="cx-reset">重置所有设置</button>
                            </div>
                        </div>
                    </div>
                    <div class="cx-panel">
                        <div class="cx-panel-heading">题库配置</div>
                        <div class="cx-panel-content">
                            <label>自定义题库API URL</label>
                            <input type="text" id="cx-questionbank" placeholder="https://xxx.com/api/xxx">
                            <div style="font-size:12px;color:#6c7086;margin:4px 0;">请求格式: POST {question, options, type}，响应: {answer: {allAnswer: [...]}}</div>
                            <div class="cx-divider"></div>
                            <div class="cx-row"><input type="checkbox" id="cx-thirdparty"><label for="cx-thirdparty">启用第三方题库（lyck6.cn）</label><div class="cx-toggle" data-target="cx-thirdparty"></div></div>
                            <label>第三方题库Token <span style="color:#6c7086;font-size:11px;">（10位付费token，留空走免费接口）</span></label>
                            <input type="text" id="cx-tp-token" placeholder="留空=免费接口" maxlength="10">
                        </div>
                    </div>
                </div>

                <!-- 自动登录 -->
                <div class="cx-tab-panel" id="cx-tab-login">
                    <div class="cx-panel">
                        <div class="cx-panel-heading">自动登录配置</div>
                        <div class="cx-panel-content">
                            <div style="margin-bottom:12px;padding:10px;background:rgba(249,226,175,0.08);border:1px solid rgba(249,226,175,0.15);border-radius:8px;font-size:13px;color:#f9e2af;">
                                <strong>风险提示：</strong>超星官方禁止自动登录脚本，使用时可能触发账号风控。
                            </div>
                            <div class="cx-row"><input type="checkbox" id="cx-autologin"><label for="cx-autologin">启用自动登录</label><div class="cx-toggle" data-target="cx-autologin"></div></div>
                            <label>手机号/超星号</label>
                            <input type="text" id="cx-loginphone" placeholder="输入手机号">
                            <label>密码</label>
                            <input type="password" id="cx-loginpass" placeholder="输入密码">
                            <div class="cx-divider"></div>
                            <div style="font-size:12px;color:#6c7086;">提示: 登录信息本地存储，不会上传到任何服务器</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        Log.setContainer(document.getElementById('cx-log'));

        // Load settings into UI
        loadSettingsToUI();
        updatePanelBadges();

        // Event bindings
        setupPanelEvents(panel);
        makeDraggable(panel);
    }

    function loadSettingsToUI() {
        const $ = (id) => document.getElementById(id);
        // AI
        $('cx-provider').value = Settings.get('provider');
        updateModelDropdown();
        $('cx-model').value = Settings.get('model');
        $('cx-apikey').value = Settings.get('apiKey') || '';
        $('cx-secretkey').value = Settings.get('ernieSecretKey') || '';
        $('cx-ernie-secret').style.display = Settings.get('provider') === 'ernie' ? 'block' : 'none';
        // 任务
        $('cx-autovideo').checked = Settings.get('autoPlayVideo');
        $('cx-autoquiz').checked = Settings.get('autoAnswerQuiz');
        $('cx-autoexam').checked = Settings.get('autoAnswerExam');
        $('cx-fontdecrypt').checked = Settings.get('fontDecrypt');
        $('cx-fuzzymatch').checked = Settings.get('fuzzyMatch');
        $('cx-unlockpaste').checked = Settings.get('unlockPaste');
        $('cx-goodstudent').checked = Settings.get('goodStudentMode');
        $('cx-randomanswer').checked = Settings.get('randomAnswer');
        $('cx-accuracy').value = String(Settings.get('accuracyThreshold') || 0);
        $('cx-autochapter').checked = Settings.get('autoChapterStudy');
        $('cx-redo').checked = Settings.get('redo');
        $('cx-autosubmit').checked = Settings.get('autoSubmit');
        $('cx-forcesubmit').checked = Settings.get('forceSubmit');
        $('cx-altertitle').checked = Settings.get('alterTitle');
        $('cx-videorate').value = String(Settings.get('videoRate') || 1);
        $('cx-automute').checked = Settings.get('autoMute');
        $('cx-reviewmode').checked = Settings.get('reviewMode');
        $('cx-bghangmode').checked = Settings.get('bgHangMode');
        // 高级
        $('cx-smartspeed').checked = Settings.get('smartSpeed');
        $('cx-behaviorsim').checked = Settings.get('behaviorSim');
        $('cx-detectionevasion').checked = Settings.get('detectionEvasion');
        $('cx-monitorbypass').checked = Settings.get('monitorBypass');
        $('cx-antisleep').checked = Settings.get('antiSleep');
        $('cx-autorefresh').checked = Settings.get('autoRefresh');
        $('cx-questionbank').value = Settings.get('questionBankUrl') || '';
        $('cx-thirdparty').checked = Settings.get('thirdPartyApiEnabled');
        $('cx-tp-token').value = Settings.get('thirdPartyApiToken') || '';
        $('cx-refreshinterval').value = String(Settings.get('refreshInterval') || 30);
        $('cx-filldelay').value = String(Settings.get('fillDelay') || 1500);
        // 登录
        $('cx-autologin').checked = Settings.get('autoLogin');
        $('cx-loginphone').value = Settings.get('loginPhone') || '';
        $('cx-loginpass').value = Settings.get('loginPass') || '';

        // Initialize toggle switches
        document.querySelectorAll('.cx-toggle').forEach(toggle => {
            const targetId = toggle.dataset.target;
            const checkbox = document.getElementById(targetId);
            if (checkbox) {
                toggle.classList.toggle('active', checkbox.checked);
            }
        });
    }

    function updateModelDropdown() {
        const provider = document.getElementById('cx-provider').value;
        const modelSelect = document.getElementById('cx-model');
        const models = PROVIDERS[provider]?.models || [];
        modelSelect.innerHTML = models.map(m => `<option value="${m}">${m}</option>`).join('');
    }

    function setupPanelEvents(panel) {
        const $ = (id) => document.getElementById(id);

        // Tab switching
        panel.querySelectorAll('.cx-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                panel.querySelectorAll('.cx-tab').forEach(t => t.classList.remove('active'));
                panel.querySelectorAll('.cx-tab-panel').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                const target = document.getElementById(tab.dataset.tab);
                if (target) target.classList.add('active');
            });
        });

        // Toggle switches
        panel.querySelectorAll('.cx-toggle').forEach(toggle => {
            const targetId = toggle.dataset.target;
            const checkbox = document.getElementById(targetId);
            if (checkbox) {
                // Initialize toggle state
                if (checkbox.checked) toggle.classList.add('active');
                // Click handler
                toggle.addEventListener('click', () => {
                    checkbox.checked = !checkbox.checked;
                    toggle.classList.toggle('active');
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                });
                // Sync checkbox changes to toggle
                checkbox.addEventListener('change', () => {
                    toggle.classList.toggle('active', checkbox.checked);
                });
            }
        });

        // AI
        $('cx-provider').addEventListener('change', (e) => {
            Settings.set('provider', e.target.value);
            updateModelDropdown();
            const firstModel = PROVIDERS[e.target.value]?.models[0];
            if (firstModel) { $('cx-model').value = firstModel; Settings.set('model', firstModel); }
            $('cx-ernie-secret').style.display = e.target.value === 'ernie' ? 'block' : 'none';
        });
        $('cx-model').addEventListener('change', (e) => Settings.set('model', e.target.value));
        $('cx-apikey').addEventListener('change', (e) => Settings.set('apiKey', e.target.value));
        $('cx-secretkey').addEventListener('change', (e) => Settings.set('ernieSecretKey', e.target.value));
        $('cx-toggle-key').addEventListener('click', () => {
            const input = $('cx-apikey');
            input.type = input.type === 'password' ? 'text' : 'password';
            $('cx-toggle-key').textContent = input.type === 'password' ? '显示' : '隐藏';
        });

        // 任务
        $('cx-autovideo').addEventListener('change', (e) => { Settings.set('autoPlayVideo', e.target.checked); updatePanelBadges(); });
        $('cx-autoquiz').addEventListener('change', (e) => { Settings.set('autoAnswerQuiz', e.target.checked); updatePanelBadges(); });
        $('cx-autoexam').addEventListener('change', (e) => { Settings.set('autoAnswerExam', e.target.checked); updatePanelBadges(); });
        $('cx-fontdecrypt').addEventListener('change', (e) => { Settings.set('fontDecrypt', e.target.checked); updatePanelBadges(); });
        $('cx-fuzzymatch').addEventListener('change', (e) => { Settings.set('fuzzyMatch', e.target.checked); updatePanelBadges(); });
        $('cx-unlockpaste').addEventListener('change', (e) => { Settings.set('unlockPaste', e.target.checked); updatePanelBadges(); initPasteBypassToggle(e.target.checked); });
        $('cx-goodstudent').addEventListener('change', (e) => { Settings.set('goodStudentMode', e.target.checked); updatePanelBadges(); });
        $('cx-randomanswer').addEventListener('change', (e) => { Settings.set('randomAnswer', e.target.checked); updatePanelBadges(); });
        $('cx-accuracy').addEventListener('change', (e) => Settings.set('accuracyThreshold', parseInt(e.target.value) || 0));
        $('cx-autochapter').addEventListener('change', (e) => {
            Settings.set('autoChapterStudy', e.target.checked);
            updatePanelBadges();
            if (e.target.checked && !ChapterNav.isActive) {
                const ft = detectFrame();
                if (ft === 'section' || ft === 'course') {
                    ChapterNav.start();
                } else {
                    Log.add('warn', '自动刷章节仅在章节/课程页面生效');
                }
            } else if (!e.target.checked && ChapterNav.isActive) {
                ChapterNav.stop();
            }
        });
        $('cx-redo').addEventListener('change', (e) => { Settings.set('redo', e.target.checked); updatePanelBadges(); });
        $('cx-autosubmit').addEventListener('change', (e) => { Settings.set('autoSubmit', e.target.checked); updatePanelBadges(); });
        $('cx-forcesubmit').addEventListener('change', (e) => { Settings.set('forceSubmit', e.target.checked); updatePanelBadges(); });
        $('cx-altertitle').addEventListener('change', (e) => { Settings.set('alterTitle', e.target.checked); updatePanelBadges(); });
        $('cx-videorate').addEventListener('change', (e) => { const rate = parseFloat(e.target.value) || 1; Settings.set('videoRate', rate); applyVideoRateToAllVideos(rate); });
        $('cx-automute').addEventListener('change', (e) => {
            Settings.set('autoMute', e.target.checked);
            forEachSameOriginFrame((doc) => {
                doc.querySelectorAll('video').forEach(v => { v.muted = e.target.checked; });
            });
        });
        // 复习模式/后台挂机
        $('cx-reviewmode').addEventListener('change', (e) => { Settings.set('reviewMode', e.target.checked); updatePanelBadges(); });
        $('cx-bghangmode').addEventListener('change', (e) => {
            Settings.set('bgHangMode', e.target.checked);
            updatePanelBadges();
            if (e.target.checked) { setupAntiSleep(); Log.add('info', '后台挂机已启用'); }
            else { if (_audioContext) { try { _audioContext.close(); } catch {} _audioContext = null; } _antiSleepStarted = false; Log.add('info', '后台挂机已关闭'); }
        });

        // 高级
        $('cx-smartspeed').addEventListener('change', (e) => { Settings.set('smartSpeed', e.target.checked); updatePanelBadges(); if (e.target.checked || Settings.get('behaviorSim') || Settings.get('detectionEvasion')) startVideoEnhancer(); else stopVideoEnhancer(); });
        $('cx-behaviorsim').addEventListener('change', (e) => { Settings.set('behaviorSim', e.target.checked); updatePanelBadges(); if (e.target.checked || Settings.get('smartSpeed') || Settings.get('detectionEvasion')) startVideoEnhancer(); else stopVideoEnhancer(); });
        $('cx-detectionevasion').addEventListener('change', (e) => { Settings.set('detectionEvasion', e.target.checked); updatePanelBadges(); if (e.target.checked || Settings.get('smartSpeed') || Settings.get('behaviorSim')) startVideoEnhancer(); else stopVideoEnhancer(); });
        $('cx-monitorbypass').addEventListener('change', (e) => { Settings.set('monitorBypass', e.target.checked); updatePanelBadges(); });
        $('cx-antisleep').addEventListener('change', (e) => {
            Settings.set('antiSleep', e.target.checked);
            updatePanelBadges();
            if (e.target.checked) { setupAntiSleep(); Log.add('info', '防休眠已启用（Web Audio）'); }
            else { if (_audioContext) { try { _audioContext.close(); } catch {} _audioContext = null; } _antiSleepStarted = false; Log.add('info', '防休眠已关闭'); }
        });

        // 自动刷新定时器句柄
        let _autoRefreshTimer = null;
        function startAutoRefresh() {
            if (_autoRefreshTimer) return;
            const minutes = Settings.get('refreshInterval') || 30;
            if (minutes < 5) return;
            _autoRefreshTimer = setTimeout(() => {
                _autoRefreshTimer = null;
                Log.add('info', `已达到自动刷新时间(${minutes}分钟)，3秒后刷新...`);
                setTimeout(() => { try { window.location.reload(); } catch {} }, 3000);
            }, minutes * 60 * 1000);
        }
        function stopAutoRefresh() {
            if (_autoRefreshTimer) { clearTimeout(_autoRefreshTimer); _autoRefreshTimer = null; }
        }
        // 首次启动
        if (Settings.get('autoRefresh')) startAutoRefresh();

        $('cx-autorefresh').addEventListener('change', (e) => {
            Settings.set('autoRefresh', e.target.checked);
            updatePanelBadges();
            if (e.target.checked) { startAutoRefresh(); Log.add('info', '自动刷新已启用'); }
            else { stopAutoRefresh(); Log.add('info', '自动刷新已关闭'); }
        });
        $('cx-questionbank').addEventListener('change', (e) => Settings.set('questionBankUrl', e.target.value));
        $('cx-thirdparty').addEventListener('change', (e) => { Settings.set('thirdPartyApiEnabled', e.target.checked); updatePanelBadges(); });
        $('cx-tp-token').addEventListener('change', (e) => Settings.set('thirdPartyApiToken', e.target.value.trim()));
        $('cx-refreshinterval').addEventListener('change', (e) => Settings.set('refreshInterval', parseInt(e.target.value) || 30));
        $('cx-filldelay').addEventListener('change', (e) => Settings.set('fillDelay', parseInt(e.target.value) || 1500));

        // 登录
        $('cx-autologin').addEventListener('change', (e) => Settings.set('autoLogin', e.target.checked));
        $('cx-loginphone').addEventListener('change', (e) => Settings.set('loginPhone', e.target.value));
        $('cx-loginpass').addEventListener('change', (e) => Settings.set('loginPass', e.target.value));

        // 操作按钮
        $('cx-test').addEventListener('click', testConnection);
        $('cx-test2').addEventListener('click', testConnection);
        $('cx-clear-cache').addEventListener('click', () => { Cache.clear(); Log.add('info', '缓存已清空'); });
        $('cx-reset').addEventListener('click', () => { Settings.reset(); loadSettingsToUI(); Log.add('info', '设置已重置'); });
        
        // 视频倍速控制
        $('cx-rate-up').addEventListener('click', () => {
            const input = $('cx-videorate');
            const current = parseFloat(input.value) || 1;
            const newVal = Math.min(3, current + 0.1);
            input.value = newVal.toFixed(1);
            Settings.set('videoRate', newVal);
            applyVideoRateToAllVideos(newVal);
            Log.add('info', `视频倍速已设置为 ${newVal.toFixed(1)}x（已立即生效）`);
        });
        $('cx-rate-down').addEventListener('click', () => {
            const input = $('cx-videorate');
            const current = parseFloat(input.value) || 1;
            const newVal = Math.max(1, current - 0.1);
            input.value = newVal.toFixed(1);
            Settings.set('videoRate', newVal);
            applyVideoRateToAllVideos(newVal);
            Log.add('info', `视频倍速已设置为 ${newVal.toFixed(1)}x（已立即生效）`);
        });
        $('cx-export-cache').addEventListener('click', () => {
            try {
                const data = GM_getValue('answer_cache', '{}');
                GM_setClipboard(data, 'text');
                Log.add('info', '缓存已导出到剪贴板');
            } catch { Log.add('error', '导出失败'); }
        });
        $('cx-chapter-toggle').addEventListener('click', () => {
            if (ChapterNav.isActive) {
                ChapterNav.stop();
            } else {
                ChapterNav.start();
            }
        });

        // 面板控制
        $('cx-minimize').addEventListener('click', () => {
            const isMin = panel.classList.toggle('cx-minimized');
            $('cx-minimize').textContent = isMin ? '+' : '─';
            $('cx-minimize').title = isMin ? '恢复' : '最小化';
            // 更新最小化状态显示
            if (isMin) {
                const status = $('cx-status')?.textContent || '就绪';
                const progress = $('cx-progress')?.style.width || '0%';
                $('cx-min-status').textContent = `[${status} ${progress}]`;
            }
        });
        $('cx-close').addEventListener('click', () => { panel.style.display = 'none'; });
    }

    // 统一状态更新函数（同步更新主面板、状态栏和最小化状态）
    function updateStatus(text, color) {
        const statusEl = document.getElementById('cx-status');
        if (statusEl) {
            statusEl.textContent = text;
            if (color) statusEl.style.color = color;
        }
        // 更新状态栏
        const statusText = document.getElementById('cx-status-text');
        const statusDot = document.getElementById('cx-status-dot');
        if (statusText) statusText.textContent = text;
        if (statusDot) {
            statusDot.className = 'cx-status-dot';
            if (color === '#f38ba8' || color === '#eba0ac') statusDot.classList.add('error');
            else if (color === '#f9e2af') statusDot.classList.add('warning');
            else if (color === '#6c7086') statusDot.classList.add('idle');
        }
        // 同步更新最小化状态
        const minStatus = document.getElementById('cx-min-status');
        if (minStatus) {
            const progress = document.getElementById('cx-progress')?.style.width || '';
            minStatus.textContent = progress ? `[${text} ${progress}]` : `[${text}]`;
        }
    }

    async function testConnection() {
        updateStatus('测试中...', '#f9e2af');
        try {
            const result = await callAI('请回答：1+1等于几？请直接回答数字。', { maxTokens: 256 });
            updateStatus('连接成功! ' + result.slice(0, 30), '#a6e3a1');
            Log.add('info', 'AI连接测试成功');
        } catch (e) {
            updateStatus('连接失败: ' + e.message, '#f38ba8');
            Log.add('error', 'AI连接测试失败: ' + e.message);
        }
    }

    function makeDraggable(panel) {
        const header = panel.querySelector('.cx-panel-header');
        let isDragging = false, startX, startY, curX = 370, curY = 75;

        // Restore saved position
        try {
            const saved = GM_getValue('cx_panel_pos', null);
            if (saved) { curX = saved.x; curY = saved.y; panel.style.transform = `translate(${curX}px, ${curY}px)`; }
        } catch {}

        header.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
            isDragging = true;
            startX = e.clientX - curX;
            startY = e.clientY - curY;
            e.preventDefault();
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            curX = e.clientX - startX;
            curY = e.clientY - startY;
            panel.style.transform = `translate(${curX}px, ${curY}px)`;
        });
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                try { GM_setValue('cx_panel_pos', { x: curX, y: curY }); } catch {}
            }
        });
    }

    /* ===== SECTION 14: ANTI-DETECTION ===== */

    // 多设备监控绕过：阻止 detect.chaoxing.com 注入（参考3）
    function initMonitorBypass() {
        if (!Settings.get('monitorBypass')) return;
        try {
            const origAppendChild = Element.prototype.appendChild;
            Element.prototype.appendChild = function () {
                try {
                    if (arguments[0] && arguments[0].src && arguments[0].src.indexOf('detect.chaoxing.com') > 0) {
                        return arguments[0];
                    }
                } catch {}
                return origAppendChild.apply(this, arguments);
            };
            Log.add('info', '多设备监控绕过已启用');
        } catch {}
    }

    // 自动登录（参考3）
    function initAutoLogin() {
        if (!Settings.get('autoLogin')) return;
        const href = window.location.href;
        if (!href.includes('passport2.') || !href.includes('login')) return;

        const phone = Settings.get('loginPhone');
        const pass = Settings.get('loginPass');
        if (!phone || !pass) {
            Log.add('warn', '自动登录: 未配置手机号或密码');
            return;
        }
        if (!/^1[3-9]\d{9}$/.test(phone)) {
            Log.add('error', '自动登录: 手机号格式错误');
            return;
        }

        Log.add('info', '尝试自动登录...');
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://passport2-api.chaoxing.com/v11/loginregister?cx_xxt_passport=json&uname=' +
                phone + '&code=' + encodeURIComponent(pass),
            onload: function (res) {
                try {
                    const data = JSON.parse(res.responseText);
                    if (data.status) {
                        Log.add('info', '自动登录成功');
                        const refer = new URLSearchParams(window.location.search).get('refer');
                        if (refer) window.location.href = decodeURIComponent(refer);
                    } else {
                        Log.add('error', '自动登录失败: ' + (data.mes || '未知错误'));
                    }
                } catch {
                    Log.add('error', '自动登录响应解析失败');
                }
            },
            onerror: function () {
                Log.add('error', '自动登录网络错误');
            },
        });
    }

    /* ===== SECTION 15: MAIN ENTRY / ROUTER ===== */

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function setupMenuCommands() {
        GM_registerMenuCommand('打开/关闭面板', () => {
            const panel = document.getElementById('cx-ai-panel');
            if (panel) {
                panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
            }
        });
        GM_registerMenuCommand('手动触发答题', () => {
            const frameType = detectFrame();
            if (frameType === 'quiz') initQuizModule();
            else if (frameType === 'exam') initExamModule();
            else Log.add('warn', '当前页面不是作业/考试页面');
        });
        GM_registerMenuCommand('清空缓存', () => {
            Cache.clear();
            Log.add('info', '缓存已清空');
        });
        GM_registerMenuCommand('测试AI连接', testConnection);
        GM_registerMenuCommand('开始/停止刷章节', () => {
            if (ChapterNav.isActive) ChapterNav.stop();
            else ChapterNav.start();
        });
    }

    function handleFrameMessage(type, data) {
        switch (type) {
            case 'QUIZ_PROGRESS':
                updateStatus(`作业进度: ${data.completed}/${data.total}`);
                updateStatusBar('quiz', data.completed, data.total);
                break;
            case 'QUIZ_DONE':
                updateStatus(`作业完成: ${data.completed}/${data.total}`, '#a6e3a1');
                updateStatusBar('quiz', data.completed, data.total);
                try { GM_notification({ text: '作业答题完成', title: '学习通AI助手', timeout: 5000 }); } catch {}
                break;
            case 'EXAM_PROGRESS':
                updateStatus(`考试进度: ${data.completed}/${data.total}`);
                updateStatusBar('quiz', data.completed, data.total);
                break;
            case 'EXAM_DONE':
                updateStatus(`考试完成: ${data.completed}/${data.total}`, '#a6e3a1');
                updateStatusBar('quiz', data.completed, data.total);
                try { GM_notification({ text: '考试答题完成', title: '学习通AI助手', timeout: 5000 }); } catch {}
                break;
            case 'VIDEO_FOUND':
                // 发现新视频，更新总数
                _videoTotal++;
                const videoCountEl = document.getElementById('cx-video-count');
                if (videoCountEl) videoCountEl.textContent = `${_videoCompleted}/${_videoTotal}`;
                break;
            case 'VIDEO_DONE':
                updateStatus('视频播放完成', '#a6e3a1');
                updateStatusBar('video', -1, -1); // Increment completed count
                break;
            case 'READING_DONE':
                updateStatus('阅读完成', '#a6e3a1');
                break;
        }
    }

    // Status bar counters
    let _videoTotal = 0, _videoCompleted = 0, _quizCompleted = 0;
    function updateStatusBar(type, completed, total) {
        if (type === 'video') {
            if (completed === -1) _videoCompleted++;
            else { _videoCompleted = completed; _videoTotal = total; }
            const el = document.getElementById('cx-video-count');
            if (el) el.textContent = `${_videoCompleted}/${_videoTotal}`;
        } else if (type === 'quiz') {
            _quizCompleted = completed || 0;
            const el = document.getElementById('cx-quiz-count');
            if (el) el.textContent = String(_quizCompleted);
        }
    }

    // Update panel badges to show enabled feature counts
    function updatePanelBadges() {
        const taskFeatures = ['autoPlayVideo', 'autoAnswerQuiz', 'autoAnswerExam', 'autoChapterStudy', 'unlockPaste'];
        const quizFeatures = ['fontDecrypt', 'fuzzyMatch', 'goodStudentMode', 'randomAnswer', 'redo', 'autoSubmit', 'forceSubmit', 'alterTitle'];
        const advancedFeatures = ['smartSpeed', 'behaviorSim', 'detectionEvasion', 'monitorBypass', 'antiSleep', 'autoRefresh', 'thirdPartyApiEnabled'];

        const countEnabled = (keys) => keys.filter(k => Settings.get(k)).length;

        const taskCount = countEnabled(taskFeatures);
        const quizCount = countEnabled(quizFeatures);
        const advancedCount = countEnabled(advancedFeatures);

        // Update badges in panel headings
        document.querySelectorAll('.cx-panel-heading').forEach(heading => {
            const text = heading.textContent.trim();
            let count = 0;
            if (text === '基本功能') count = taskCount;
            else if (text === '答题配置') count = quizCount;
            else if (text === '系统设置') count = advancedCount;

            // Remove existing badge if any
            const existingBadge = heading.querySelector('.cx-badge');
            if (existingBadge) existingBadge.remove();

            // Add new badge if count > 0
            if (count > 0) {
                const badge = document.createElement('span');
                badge.className = 'cx-badge';
                badge.textContent = `${count} 已启用`;
                heading.appendChild(badge);
            }
        });
    }

    // 资源清理（跟踪所有定时器）
    const _timers = { intervals: [], timeouts: [] };
    function trackedSetInterval(fn, ms) {
        const id = setInterval(fn, ms);
        _timers.intervals.push(id);
        return id;
    }
    function trackedSetTimeout(fn, ms) {
        const id = setTimeout(fn, ms);
        _timers.timeouts.push(id);
        return id;
    }
    function cleanupAll() {
        _timers.intervals.forEach(id => clearInterval(id));
        _timers.timeouts.forEach(id => clearTimeout(id));
        _timers.intervals = [];
        _timers.timeouts = [];
    }

    // 键盘快捷键
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+X: 显示/隐藏面板
            if (e.ctrlKey && e.shiftKey && e.key === 'X') {
                e.preventDefault();
                const panel = document.getElementById('cx-ai-panel');
                if (panel) {
                    panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
                }
            }
            // Ctrl+Shift+Q: 手动触发答题
            if (e.ctrlKey && e.shiftKey && e.key === 'Q') {
                e.preventDefault();
                const frameType = detectFrame();
                if (frameType === 'quiz') initQuizModule();
                else if (frameType === 'exam') initExamModule();
            }
        });
    }

    // 监听章节/课程切换（参考304小站方案）
    // 学习通切换课程使用 getTeacherAjax() 做AJAX局部刷新，不触发页面重载
    // 通过轮询URL中的 chapterId 参数变化来检测切换
    // 注：与 getTeacherAjax hook 共用 _cxaiChapterSwitchDone 标志防重复
    function watchChapterChange() {
        let lastChapterId = new URLSearchParams(window.location.search).get('chapterId') || '';

        trackedSetInterval(() => {
            const currentChapterId = new URLSearchParams(window.location.search).get('chapterId') || '';
            if (!currentChapterId || currentChapterId === lastChapterId) return;

            // 如果 hook 已经处理过，跳过
            if (window._cxaiChapterSwitchDone) {
                window._cxaiChapterSwitchDone = false;
                lastChapterId = currentChapterId;
                return;
            }

            // chapterId 变化了，说明切换了课程
            lastChapterId = currentChapterId;
            Log.add('info', '🔄 检测到课程切换(URL轮询)，重新初始化...');

            // 重置 ChapterNav 状态
            if (ChapterNav.isActive) {
                ChapterNav.queue = [];
                ChapterNav.currentMission = null;
                ChapterNav.busy = false;
                ChapterNav._mediaTaskActive = false;
                ChapterNav.completedCount = 0;
                ChapterNav.pendingCount = 0;
                ChapterNav.emptySectionCount = 0;
            }

            // 重新检测并初始化模块
            setTimeout(() => {
                const frameType = detectFrame();
                if (frameType === 'section' || frameType === 'course' || frameType === 'video') {
                    // 检测视频
                    if (Settings.get('autoPlayVideo')) {
                        forEachSameOriginFrame((doc) => {
                            const media = doc.querySelector('video');
                            if (media && !media._cxaiSetup) {
                                setupVideo(media);
                            }
                        });
                    }
                    // 检测阅读/PPT
                    forEachSameOriginFrame((doc) => {
                        const readerEl = doc.querySelector('.readSection, .reader-box, .iebook-content');
                        if (readerEl && !readerEl._cxaiRead) {
                            readerEl._cxaiRead = true;
                            initReadingModule();
                        }
                    });
                    // 重新启动章节刷课
                    if (Settings.get('autoChapterStudy') && ChapterNav.isActive) {
                        setTimeout(() => ChapterNav.processQueue().catch(() => {}), 3000);
                    }
                }
                Log.add('info', '课程切换处理完成');
            }, 2000); // 等待新内容加载
        }, 2000);
    }

    // Main initialization
    (function main() {
        // Prevent double initialization
        if (window._cxaiInitialized) return;
        window._cxaiInitialized = true;

        // Prune old cache on startup
        Cache.prune();

        // Anti-detection
        initMonitorBypass();
        initAutoLogin();

        // Initialize paste bypass
        initPasteBypass();
        if (Settings.get('unlockPaste')) initPasteBypassToggle(true);

        const frameType = detectFrame();

        // Create panel in actual top window (only on course-related pages)
        const isTopWindow = (window === window.top);
        if (isTopWindow && Settings.get('showPanel') && isCoursePage()) {
            const existing = document.getElementById('cx-ai-panel');
            if (existing) existing.remove();

            createFloatingPanel();
            setupMenuCommands();
            setupKeyboardShortcuts();
            onFrameMessage(handleFrameMessage);

            // 恢复章节刷课状态（仅在章节/课程页恢复，避免作业/考试页刷屏警告）
            if ((frameType === 'section' || frameType === 'course') && localStorage.getItem(ChapterNav.persistKey) === '1') {
                trackedSetTimeout(() => ChapterNav.start(), 3000);
            }

            // Hook getTeacherAjax 检测课程切换（参考304小站方案）
            // 学习通在右侧目录点击章节时调用此函数做AJAX加载
            try {
                const gtaWin = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
                if (typeof gtaWin.getTeacherAjax === 'function' && !gtaWin._cxaiGtaHooked) {
                    gtaWin._cxaiGtaHooked = true;
                    const _origGTA = gtaWin.getTeacherAjax;
                    gtaWin.getTeacherAjax = function(courseid, classid, cid) {
                        const currentCid = new URLSearchParams(window.location.search).get('chapterId');
                        if (cid && cid !== currentCid) {
                            // 标记已处理，防止 URL 轮询重复触发
                            window._cxaiChapterSwitchDone = true;
                            Log.add('info', '🔄 检测到课程切换(目录点击)，重新初始化...');
                            // 重置 ChapterNav 状态
                            if (ChapterNav.isActive) {
                                ChapterNav.queue = [];
                                ChapterNav.currentMission = null;
                                ChapterNav.busy = false;
                                ChapterNav._mediaTaskActive = false;
                                ChapterNav._buildQueueFailCount = 0;
                                ChapterNav.lastJumpTime = 0;
                                ChapterNav.completedCount = 0;
                                ChapterNav.pendingCount = 0;
                                ChapterNav.emptySectionCount = 0;
                            }
                            // 等待新内容加载后重新初始化模块
                            setTimeout(() => {
                                const ft = detectFrame();
                                if (ft === 'section' || ft === 'course' || ft === 'video') {
                                    if (Settings.get('autoPlayVideo')) {
                                        forEachSameOriginFrame((doc) => {
                                            const media = doc.querySelector('video');
                                            if (media && !media._cxaiSetup) {
                                                setupVideo(media);
                                            }
                                        });
                                    }
                                    // 检测阅读/PPT
                                    forEachSameOriginFrame((doc) => {
                                        const readerEl = doc.querySelector('.readSection, .reader-box, .iebook-content');
                                        if (readerEl && !readerEl._cxaiRead) {
                                            readerEl._cxaiRead = true;
                                            initReadingModule();
                                        }
                                    });
                                    if (Settings.get('autoChapterStudy') && ChapterNav.isActive) {
                                        setTimeout(() => ChapterNav.processQueue().catch(() => {}), 3000);
                                    }
                                }
                                Log.add('info', '课程切换处理完成');
                            }, 3000);
                        }
                        return _origGTA.apply(this, arguments);
                    };
                }
            } catch (e) {
                // hook 失败不影响主流程，URL轮询会兜底
            }

            if (!Settings.get('apiKey')) {
                Log.add('warn', '请先配置API Key');
            }
        }

        // Initialize module based on frame type
        switch (frameType) {
            case 'video':
                if (Settings.get('autoPlayVideo')) {
                    initVideoModule();
                }
                break;
            case 'quiz':
                if (Settings.get('autoAnswerQuiz')) initQuizModule();
                break;
            case 'exam':
                if (Settings.get('autoAnswerExam')) initExamModule();
                break;
            case 'section':
            case 'course':
                if (Settings.get('autoPlayVideo')) {
                    const observer = new MutationObserver(() => {
                        const video = document.querySelector('video');
                        if (video && !video._cxaiSetup) {
                            setupVideo(video);
                        }
                        // 也检查阅读和PPT
                        const readerEl = document.querySelector('.readSection, .reader-box, .iebook-content');
                        if (readerEl && !readerEl._cxaiRead) {
                            readerEl._cxaiRead = true;
                            initReadingModule();
                        }
                    });
                    observer.observe(document.body, { childList: true, subtree: true });
                }
                // 自动检测当前页面中的作业/测验并答题（只处理当前界面）
                if (Settings.get('autoAnswerQuiz')) {
                    const QUIZ_SELECTORS = ['.TiMu', '.questionLi', '.singleQuesId'];
                    const quizCheck = setInterval(() => {
                        const hasQuiz = QUIZ_SELECTORS.some(sel => document.querySelector(sel));
                        if (hasQuiz && !document._cxaiQuizDone) {
                            document._cxaiQuizDone = true;
                            Log.add('info', '检测到题目，开始答题...');
                            decryptFontInDoc(document);
                            const questions = parseAllQuestions(document);
                            if (questions.length > 0) {
                                processQuestions(questions);
                            }
                        }
                    }, 5000);
                    // 5分钟后停止检测
                    setTimeout(() => clearInterval(quizCheck), 300000);
                }
                // 自动刷章节
                if (Settings.get('autoChapterStudy')) {
                    trackedSetTimeout(() => ChapterNav.start(), 5000);
                }
                break;
            case 'top':
                // 顶层页面也检测阅读/PPT
                forEachSameOriginFrame((doc) => {
                    if (doc.querySelector('.readSection, .reader-box, .iebook-content')) {
                        initReadingModule();
                    }
                });
                break;
        }

        // 监听章节切换，自动重新初始化
        // 与 getTeacherAjax hook 配合：hook 优先处理，URL轮询做兜底
        watchChapterChange();

        // 页面卸载时清理资源
        window.addEventListener('beforeunload', cleanupAll);
    })();

})();
