module.exports = async (req, res) => {

    const { password } = req.method === 'GET' ? req.query : req.body;

    const expectedPassword = process.env.PASSWORD;

    if (password !== expectedPassword) {
        return res.status(401).json({
            error: 'Authentication failed. Please provide valid credentials or contact administrator for access. Refer to API documentation for deployment details.'
        });
    }

    // 根据请求方法从 query 或 body 中获取参数
    const params = req.method === 'GET' ? req.query : req.body;
    const { refresh_token, client_id, email } = params;

    // 检查是否缺少必要的参数
    if (!refresh_token || !client_id || !email) {
        return res.status(400).json({ error: 'Missing required parameters: refresh_token, client_id, or email' });
    }

    async function get_access_token() {
        const response = await fetch('https://login.microsoftonline.com/consumers/oauth2/v2.0/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'client_id': client_id,
                'grant_type': 'refresh_token',
                'refresh_token': refresh_token
            }).toString()
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
        }

        const responseText = await response.text();

        try {
            const data = JSON.parse(responseText);
            return data.access_token;
        } catch (parseError) {
            throw new Error(`Failed to parse JSON: ${parseError.message}, response: ${responseText}`);
        }
    }

    try {
        const access_token = await get_access_token();

        // 使用 Microsoft Graph API 获取垃圾邮件文件夹中的所有邮件
        async function getAllMessages() {
            let allMessages = [];
            let nextLink = `https://graph.microsoft.com/v1.0/me/mailFolders/junkemail/messages?$select=id&$top=1000`;

            while (nextLink) {
                console.log(`Fetching messages from: ${nextLink}`);
                const response = await fetch(nextLink, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to get messages: ${response.status}, ${errorText}`);
                }

                const data = await response.json();
                if (data.value && data.value.length > 0) {
                    allMessages = allMessages.concat(data.value);
                }

                // 检查是否有下一页
                nextLink = data['@odata.nextLink'] || null;
            }

            return allMessages;
        }

        // 删除单个邮件
        async function deleteMessage(messageId) {
            console.log(`Deleting message: ${messageId}`);
            const response = await fetch(`https://graph.microsoft.com/v1.0/me/messages/${messageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete message ${messageId}: ${response.status}, ${errorText}`);
            }

            return true;
        }

        // 获取并删除所有垃圾邮件
        const messages = await getAllMessages();

        if (messages.length === 0) {
            console.log('No junk emails found.');
            return res.json({ message: 'No junk emails found.' });
        }

        console.log(`Found ${messages.length} junk messages to delete`);

        // 删除所有垃圾邮件
        let deletedCount = 0;
        let failedCount = 0;

        for (const message of messages) {
            try {
                await deleteMessage(message.id);
                deletedCount++;
            } catch (error) {
                console.error(`Error deleting message ${message.id}:`, error);
                failedCount++;
            }
        }

        console.log(`Deleted ${deletedCount} junk messages, failed to delete ${failedCount} messages`);
        return res.json({
            message: 'Junk emails processed successfully.',
            stats: {
                total: messages.length,
                deleted: deletedCount,
                failed: failedCount
            }
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Error', details: error.message });
    }
};
