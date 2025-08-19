// MS OAuth2API 管理面板 JavaScript

// 全局配置
const CONFIG_KEY = 'msOauth2Config';
const API_BASE = window.location.origin;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadConfig();
    console.log('MS OAuth2API 管理面板已加载');
});

// 标签页切换
function switchTab(tabName) {
    // 隐藏所有标签页内容
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // 移除所有标签页按钮的激活状态
    const tabButtons = document.querySelectorAll('.nav-tab');
    tabButtons.forEach(button => button.classList.remove('active'));
    
    // 显示选中的标签页内容
    document.getElementById(tabName).classList.add('active');
    
    // 激活对应的标签页按钮
    event.target.classList.add('active');
}

// 保存配置到本地存储
function saveConfig() {
    const config = {
        refreshToken: document.getElementById('refreshToken').value.trim(),
        clientId: document.getElementById('clientId').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value.trim()
    };
    
    if (!config.refreshToken || !config.clientId || !config.email) {
        showAlert('config', 'error', '请填写所有必填字段！');
        return;
    }
    
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    
    const savedDiv = document.getElementById('configSaved');
    savedDiv.style.display = 'block';
    setTimeout(() => {
        savedDiv.style.display = 'none';
    }, 3000);
    
    console.log('配置已保存');
}

// 从本地存储加载配置
function loadConfig() {
    const configStr = localStorage.getItem(CONFIG_KEY);
    if (configStr) {
        try {
            const config = JSON.parse(configStr);
            document.getElementById('refreshToken').value = config.refreshToken || '';
            document.getElementById('clientId').value = config.clientId || '';
            document.getElementById('email').value = config.email || '';
            document.getElementById('password').value = config.password || '';
        } catch (e) {
            console.error('加载配置失败:', e);
        }
    }
}

// 清除配置
function clearConfig() {
    if (confirm('确定要清除所有配置吗？')) {
        localStorage.removeItem(CONFIG_KEY);
        document.getElementById('refreshToken').value = '';
        document.getElementById('clientId').value = '';
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        showAlert('config', 'info', '配置已清除');
    }
}

// 测试连接
async function testConnection() {
    const config = getConfig();
    if (!config) return;
    
    showLoading('config', true);
    
    try {
        const params = new URLSearchParams({
            refresh_token: config.refreshToken,
            client_id: config.clientId,
            email: config.email,
            mailbox: 'INBOX'
        });
        
        if (config.password) {
            params.append('password', config.password);
        }
        
        const response = await fetch(`${API_BASE}/api/mail-new?${params}`);
        
        if (response.ok) {
            showAlert('config', 'success', '✅ 连接测试成功！API 可以正常访问。');
        } else {
            const errorText = await response.text();
            showAlert('config', 'error', `❌ 连接测试失败: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        showAlert('config', 'error', `❌ 连接测试失败: ${error.message}`);
    } finally {
        showLoading('config', false);
    }
}

// 获取最新邮件
async function getLatestEmail() {
    const config = getConfig();
    if (!config) return;
    
    showLoading('emailLoading', true);
    clearAlert('emailAlert');
    
    try {
        const mailbox = document.getElementById('mailbox').value;
        const params = new URLSearchParams({
            refresh_token: config.refreshToken,
            client_id: config.clientId,
            email: config.email,
            mailbox: mailbox,
            response_type: 'json'
        });
        
        if (config.password) {
            params.append('password', config.password);
        }
        
        const response = await fetch(`${API_BASE}/api/mail-new?${params}`);
        
        if (response.ok) {
            const emails = await response.json();
            displayEmails(Array.isArray(emails) ? emails : [emails], '最新邮件');
        } else {
            const errorText = await response.text();
            showAlert('emailAlert', 'error', `获取邮件失败: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        showAlert('emailAlert', 'error', `获取邮件失败: ${error.message}`);
    } finally {
        showLoading('emailLoading', false);
    }
}

// 获取全部邮件
async function getAllEmails() {
    const config = getConfig();
    if (!config) return;
    
    showLoading('emailLoading', true);
    clearAlert('emailAlert');
    
    try {
        const mailbox = document.getElementById('mailbox').value;
        const params = new URLSearchParams({
            refresh_token: config.refreshToken,
            client_id: config.clientId,
            email: config.email,
            mailbox: mailbox
        });
        
        if (config.password) {
            params.append('password', config.password);
        }
        
        const response = await fetch(`${API_BASE}/api/mail-all?${params}`);
        
        if (response.ok) {
            const emails = await response.json();
            displayEmails(emails, '全部邮件');
        } else {
            const errorText = await response.text();
            showAlert('emailAlert', 'error', `获取邮件失败: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        showAlert('emailAlert', 'error', `获取邮件失败: ${error.message}`);
    } finally {
        showLoading('emailLoading', false);
    }
}

// 发送邮件
async function sendEmail() {
    const config = getConfig();
    if (!config) return;
    
    const to = document.getElementById('sendTo').value.trim();
    const subject = document.getElementById('sendSubject').value.trim();
    const content = document.getElementById('sendContent').value.trim();
    const isHtml = document.getElementById('sendHtml').checked;
    
    if (!to || !subject || !content) {
        showAlert('sendAlert', 'error', '请填写所有必填字段！');
        return;
    }
    
    showLoading('sendLoading', true);
    clearAlert('sendAlert');
    
    try {
        const params = new URLSearchParams({
            refresh_token: config.refreshToken,
            client_id: config.clientId,
            email: config.email,
            to: to,
            subject: subject
        });
        
        if (config.password) {
            params.append('send_password', config.password);
        }
        
        if (isHtml) {
            params.append('html', content);
        } else {
            params.append('text', content);
        }
        
        const response = await fetch(`${API_BASE}/api/send-mail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params
        });
        
        if (response.ok) {
            const result = await response.json();
            showAlert('sendAlert', 'success', `✅ 邮件发送成功！消息ID: ${result.messageId}`);
            clearSendForm();
        } else {
            const errorText = await response.text();
            showAlert('sendAlert', 'error', `❌ 邮件发送失败: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        showAlert('sendAlert', 'error', `❌ 邮件发送失败: ${error.message}`);
    } finally {
        showLoading('sendLoading', false);
    }
}

// 清空发送表单
function clearSendForm() {
    document.getElementById('sendTo').value = '';
    document.getElementById('sendSubject').value = '';
    document.getElementById('sendContent').value = '';
    document.getElementById('sendHtml').checked = false;
}

// 清空收件箱
async function cleanInbox() {
    if (!confirm('确定要清空收件箱吗？此操作不可撤销！')) {
        return;
    }
    
    const config = getConfig();
    if (!config) return;
    
    showLoading('cleanLoading', true);
    clearAlert('cleanAlert');
    
    try {
        const params = new URLSearchParams({
            refresh_token: config.refreshToken,
            client_id: config.clientId,
            email: config.email
        });
        
        if (config.password) {
            params.append('password', config.password);
        }
        
        const response = await fetch(`${API_BASE}/api/process-inbox?${params}`);
        
        if (response.ok) {
            showAlert('cleanAlert', 'success', '✅ 收件箱清理完成！');
        } else {
            const errorText = await response.text();
            showAlert('cleanAlert', 'error', `❌ 清理失败: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        showAlert('cleanAlert', 'error', `❌ 清理失败: ${error.message}`);
    } finally {
        showLoading('cleanLoading', false);
    }
}

// 清空垃圾箱
async function cleanJunk() {
    if (!confirm('确定要清空垃圾箱吗？此操作不可撤销！')) {
        return;
    }
    
    const config = getConfig();
    if (!config) return;
    
    showLoading('cleanLoading', true);
    clearAlert('cleanAlert');
    
    try {
        const params = new URLSearchParams({
            refresh_token: config.refreshToken,
            client_id: config.clientId,
            email: config.email
        });
        
        if (config.password) {
            params.append('password', config.password);
        }
        
        const response = await fetch(`${API_BASE}/api/process-junk?${params}`);
        
        if (response.ok) {
            showAlert('cleanAlert', 'success', '✅ 垃圾箱清理完成！');
        } else {
            const errorText = await response.text();
            showAlert('cleanAlert', 'error', `❌ 清理失败: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        showAlert('cleanAlert', 'error', `❌ 清理失败: ${error.message}`);
    } finally {
        showLoading('cleanLoading', false);
    }
}

// 工具函数

// 获取配置
function getConfig() {
    const configStr = localStorage.getItem(CONFIG_KEY);
    if (!configStr) {
        showAlert('config', 'error', '请先配置 OAuth2 信息！');
        switchTab('config');
        return null;
    }

    try {
        const config = JSON.parse(configStr);
        if (!config.refreshToken || !config.clientId || !config.email) {
            showAlert('config', 'error', '配置信息不完整，请重新配置！');
            switchTab('config');
            return null;
        }
        return config;
    } catch (e) {
        showAlert('config', 'error', '配置信息格式错误，请重新配置！');
        switchTab('config');
        return null;
    }
}

// 显示提示信息
function showAlert(containerId, type, message) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;

    // 3秒后自动隐藏成功提示
    if (type === 'success') {
        setTimeout(() => {
            container.innerHTML = '';
        }, 3000);
    }
}

// 清除提示信息
function clearAlert(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '';
    }
}

// 显示/隐藏加载状态
function showLoading(loadingId, show) {
    const loading = document.getElementById(loadingId);
    if (loading) {
        if (show) {
            loading.classList.add('show');
        } else {
            loading.classList.remove('show');
        }
    }
}

// 显示邮件列表
function displayEmails(emails, title) {
    const resultsDiv = document.getElementById('emailResults');

    if (!emails || emails.length === 0) {
        resultsDiv.innerHTML = `
            <div class="alert alert-info">
                <strong>${title}</strong><br>
                没有找到邮件。
            </div>
        `;
        return;
    }

    let html = `<h3>${title} (${emails.length} 封)</h3>`;

    emails.forEach((email, index) => {
        // 提取验证码（6位数字）
        const codeMatch = email.text ? email.text.match(/\b\d{6}\b/) : null;
        const verificationCode = codeMatch ? codeMatch[0] : null;

        // 格式化日期
        const date = email.date ? new Date(email.date).toLocaleString('zh-CN') : '未知时间';

        // 截取邮件内容预览
        const preview = email.text ?
            (email.text.length > 200 ? email.text.substring(0, 200) + '...' : email.text) :
            '无内容';

        html += `
            <div class="email-item">
                <h4>📧 ${email.subject || '无主题'}</h4>
                <div class="meta">
                    <strong>发件人:</strong> ${email.send || '未知'} |
                    <strong>时间:</strong> ${date}
                    ${verificationCode ? `| <strong style="color: #e74c3c;">验证码: ${verificationCode}</strong>` : ''}
                </div>
                <div class="content">
                    <strong>内容预览:</strong><br>
                    ${preview.replace(/\n/g, '<br>')}
                </div>
                ${email.html ? `
                    <div style="margin-top: 10px;">
                        <button class="btn btn-secondary" onclick="showEmailHtml(${index})">查看完整邮件</button>
                    </div>
                ` : ''}
            </div>
        `;
    });

    resultsDiv.innerHTML = html;

    // 保存邮件数据供查看完整邮件使用
    window.currentEmails = emails;
}

// 显示完整邮件内容
function showEmailHtml(index) {
    const email = window.currentEmails[index];
    if (!email || !email.html) return;

    const newWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
    newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${email.subject || '邮件内容'}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                .header { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
                .content { border: 1px solid #ddd; padding: 20px; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>${email.subject || '无主题'}</h2>
                <p><strong>发件人:</strong> ${email.send || '未知'}</p>
                <p><strong>时间:</strong> ${email.date ? new Date(email.date).toLocaleString('zh-CN') : '未知时间'}</p>
            </div>
            <div class="content">
                ${email.html}
            </div>
        </body>
        </html>
    `);
    newWindow.document.close();
}
