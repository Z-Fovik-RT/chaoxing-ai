// 回归 harness：验证本轮修复的行为（不依赖浏览器，仅纯函数逻辑）
// 运行：node test-fixes.js
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/chaoxing-ai.user.js', 'utf8');

// ---- 从源码中提取待测纯函数 ----
function extractFn(name) {
  const start = src.indexOf('function ' + name + '(');
  if (start === -1) throw new Error('fn not found: ' + name);
  let i = src.indexOf('{', start), depth = 0, end = -1;
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
  }
  return src.slice(start, end);
}

const cxai_stringSimilarity = new Function(extractFn('cxai_stringSimilarity') + '; return cxai_stringSimilarity;')();
const _normBundle = new Function(extractFn('cxai_normalizePunct') + extractFn('cxai_normalizeAnswer') + extractFn('cxai_normalizeAnswerLoose').replace(/\bcxai_normalizeAnswer\(/g, 'cxai_normalizeAnswerBase(').replace('function cxai_normalizeAnswerLoose(s) {', 'var cxai_normalizeAnswerBase = cxai_normalizeAnswer;\nfunction cxai_normalizeAnswerLoose(s) {') + '; return { strict: cxai_normalizeAnswer, loose: cxai_normalizeAnswerLoose };')();
const cxai_normalizeAnswer = _normBundle.strict;
const cxai_normalizeAnswerLoose = _normBundle.loose;
const cxaiMatchByLetter = new Function(extractFn('cxaiMatchByLetter') + '; return cxaiMatchByLetter;')();
const cxaiMatchMultipleByLetter = new Function(extractFn('cxaiMatchMultipleByLetter') + '; return cxaiMatchMultipleByLetter;')();
const cxai_parseJudgeAnswer = new Function(extractFn('cxai_parseJudgeAnswer') + '; return cxai_parseJudgeAnswer;')();

let pass = 0, fail = 0;
function T(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) pass++; else fail++;
  console.log((ok ? 'PASS' : 'FAIL') + '  ' + name + (ok ? '' : '  → got ' + JSON.stringify(actual) + ', want ' + JSON.stringify(expected)));
}

// ---- 1. 修复前：buildPrompt 返回值上的非法 .catch 已全部移除 ----
const badCatch = src.match(/cxai_buildPrompt\([\s\S]{0,260}?\)\.catch/g);
T('源码中不再存在 cxai_buildPrompt(...).catch', badCatch === null ? 0 : badCatch.length, 0);
T('源码中不再存在 $.each(...).catch', /each\([^)]*\)\s*\.catch/.test(src), false);

// ---- 2. cxaiMatchByLetter：含中文的文本答案不再误提字母 ----
T('MatchByLetter "B" → 1', cxaiMatchByLetter('B', 4), 1);
T('MatchByLetter "正确答案是B" → -1（旧代码返回 1，答错题）', cxaiMatchByLetter('正确答案是B', 4), -1);
T('MatchByLetter "GB2312编码" → -1（旧代码把尾部 2/B 当选项）', cxaiMatchByLetter('GB2312编码', 4), -1);
T('MatchByLetter 纯字母 "D." → 3', cxaiMatchByLetter('D.', 4), 3);

// ---- 3. cxaiMatchMultipleByLetter：含中文不再误选 ----
T('MatchMultiple "ABC" → [0,1,2]', cxaiMatchMultipleByLetter('ABC', 4), [0, 1, 2]);
T('MatchMultiple "A|C" → [0,2]', cxaiMatchMultipleByLetter('A|C', 4), [0, 2]);
T('MatchMultiple "ABC编码属于字符集" → []（旧代码误选 A,B,C）', cxaiMatchMultipleByLetter('ABC编码属于字符集', 4), []);

// ---- 4. cxai_parseJudgeAnswer：含中文/英文术语不再误判 ----
T('Judge "正确" → true', cxai_parseJudgeAnswer('正确'), 'true');
T('Judge "错误" → false', cxai_parseJudgeAnswer('错误'), 'false');
T('Judge "对" → true', cxai_parseJudgeAnswer('对'), 'true');
T('Judge "IBM PC兼容机简称PC" → null（旧代码因 "ibm pc" 含 b/f 误判 false）', cxai_parseJudgeAnswer('IBM PC兼容机简称PC'), null);
T('Judge "T" → true', cxai_parseJudgeAnswer('T'), 'true');
T('Judge "F" → false', cxai_parseJudgeAnswer('F'), 'false');
T('Judge "这个说法是正确的" → true（按中文词判断）', cxai_parseJudgeAnswer('这个说法是正确的'), 'true');
T('Judge "不正确" → false', cxai_parseJudgeAnswer('不正确'), 'false');

// ---- 5. 归一化拆分：精确匹配不再剥后缀，模糊匹配仍放宽 ----
T('严格归一化不再让 "存储技术"=="存储方式"', cxai_normalizeAnswer('存储技术') === cxai_normalizeAnswer('存储方式'), false);
T('宽松归一化仍让 "存储技术"=="存储方式"（供模糊匹配用）', cxai_normalizeAnswerLoose('存储技术') === cxai_normalizeAnswerLoose('存储方式'), true);
T('严格归一化保留后缀 "分组交换技术"', cxai_normalizeAnswer('分组交换技术'), '分组交换技术');

// ---- 6. 题库链：icodef/dxs 命中后走 __bankProcessed 信封（不再二次匹配） ----
T('题库链 icodef 命中改用 __bankProcessed 信封', /return resolve\(\{ __bankProcessed: true, result: _bankProcessed, source: 'icodef' \}\)/.test(src), true);
T('外层识别 __bankProcessed 并跳过二次匹配', src.indexOf('tpAnswers.__bankProcessed') !== -1 && src.indexOf('内层题库链已验证过匹配') !== -1, true);
T('大学搜题酱命中前先验证匹配（solve 与 wholesearch 两处）', (src.match(/cxaiProcessBankAnswer\(answers, options, type, questionText\)/g) || []).length, 2);

// ---- 7. 题库垃圾答案真转 AI ----
T('题库垃圾答案分支调用 _doAILogic 真正转 AI', /不可用，转 AI 作答[\s\S]{0,800}_doAILogic\(_cfg\.key, _cfg\.model\)/.test(src), true);

// ---- 8. 重试透传 rawMode / skipModelIdx ----
T('超时重试透传 rawMode/skipModelIdx', src.includes('cxai_getAnswer(_t, _q, retryCount + 1, rawMode, skipModelIdx)'), true);
T('垃圾答案重试透传 rawMode/skipModelIdx', src.includes('cxai_getAnswer(_t, _q, retryCount + 1, rawMode, skipModelIdx).then(resolve).catch(reject)'), true);

// ---- 9. 视频弹题 in-flight 防护 ----
T('视频弹题 in-flight 防护存在', src.includes('_cxaiVideoQuizInFlight') && src.includes('_releaseQuiz'), true);

// ---- 10. 考试主路径 catch 覆盖 ----
const missonExam = src.slice(src.indexOf('function cxai_missonExam()'), src.indexOf('function cxai_toNextExam()'));
T('考试主路径 cxai_getAnswer(...).then 均带 .catch', (missonExam.match(/cxai_getAnswer\(/g) || []).length <= (missonExam.match(/\.catch\(/g) || []).length, true);
T('cxai_missonExam 入口有暂停检查', /function cxai_missonExam\(\) \{\s*if \(cxai_isPaused\(\)\)/.test(src), true);

// ---- 11. 作业流 catch 覆盖 ----
const doHomeWork = src.slice(src.indexOf('function cxai_doHomeWork('), src.indexOf('var _cxaiAntiSleepStarted'));
T('作业流 cxai_getAnswer(...).then 均带 .catch', (doHomeWork.match(/cxai_getAnswer\(/g) || []).length <= (doHomeWork.match(/\.catch\(/g) || []).length, true);

// ---- 12. v1.3.7 日志整洁性 ----
T('updateLogEntry 刷新时间戳并把行移到底部（阅读顺序=时间顺序）', src.includes("timeEl.textContent = new Date().toLocaleTimeString()") && src.includes('_panel.appendChild(el)'), true);
T('相似度匹配失败日志降级到 console', /if \(!silent\) console\.log\('\[AI智脑Pro\] 相似度匹配: 所有选项相似度均低于阈值/.test(src), true);
T('答题节奏提示每会话只打一次', src.includes('!window._cxaiPaceLogged'), true);
T('删除重复的 题库命中<题目原文> 日志行', src.includes("cxai_logger('题库命中: ' + _qText"), false);

// ---- 13. 填空题多空答案拆分 ----
const cxaiSplitFillAnswers = new Function(extractFn('cxaiSplitFillAnswers') + '; return cxaiSplitFillAnswers;')();
T('填空 # 串三空拆分: "共享资源#相互合作#间断性"', cxaiSplitFillAnswers('共享资源#相互合作#间断性', 3), ['共享资源', '相互合作', '间断性']);
T('填空 换行串拆分: "封闭性\\n可再现性"', cxaiSplitFillAnswers('封闭性\n可再现性', 2), ['封闭性', '可再现性']);
T('填空 | 串拆分: "a|b|c"', cxaiSplitFillAnswers('a|b|c', 3), ['a', 'b', 'c']);
T('填空去序号前缀: "(1) 封闭性#(2) 可再现性"', cxaiSplitFillAnswers('(1) 封闭性#(2) 可再现性', 2), ['封闭性', '可再现性']);
T('单空不拆: "C#语言" 保持原样', cxaiSplitFillAnswers('C#语言', 1), ['C#语言']);
T('单空不拆: 无空数信息时整串返回', cxaiSplitFillAnswers('共享资源#相互合作', undefined), ['共享资源#相互合作']);
T('空答案返回空数组', cxaiSplitFillAnswers('', 3), []);
T('填空流程已全部接入统一拆分函数', (src.match(/cxaiSplitFillAnswers\(/g) || []).length, 10); // 1 定义 + 9 调用

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
