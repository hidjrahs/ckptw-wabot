const axios = require("axios");
const {
    monospace
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");
const {
    format
} = require("util");

module.exports = {
    name: "fetch",
    aliases: ["get"],
    category: "tools",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const url = ctx._args[0];

        if (!url) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`
        );

        const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)\b/i;
        if (!urlRegex.test(url)) return ctx.reply(global.msg.urlInvalid);

        try {
            const response = await axios.get(url, {
                responseType: "arraybuffer"
            });

            if (!/utf-8|json|html|plain/.test(response?.headers?.['content-type'])) {
                let fileName = /filename/i.test(response?.headers?.['content-disposition']) ? response?.headers?.['content-disposition']?.match(/filename=(.*)/)?.[1]?.replace(/["';]/g, '') : '';
                return ctx.reply({
                    document: response?.data,
                    fileName,
                    mimetype: mime.lookup(fileName)
                });
            }

            let text = response?.data?.toString() || response?.data;
            text = format(text);
            try {
                ctx.reply(text.slice(0, 65536) + '');
            } catch (e) {
                ctx.reply(format(e));
            }
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};