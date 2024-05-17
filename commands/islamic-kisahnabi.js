const {
    createAPIUrl
} = require('../tools/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const axios = require('axios');

module.exports = {
    name: 'kisahnabi',
    category: 'islamic',
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 1
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} muhammad`)}`
        );

        try {
            const apiUrl = createAPIUrl('https://raw.githubusercontent.com', `/ZeroChanBot/Api-Freee/master/data/kisahNabi/${input.toLowerCase()}.json`, {});
            const response = await axios.get(apiUrl);

            if (response.status !== 200) throw new Error(global.msg.notFound);

            const data = await response.data;

            return ctx.reply(
                `❖ ${bold('Kisah Nabi')}\n` +
                '\n' +
                `➤ Nama: ${data.name}\n` +
                `➤ Tahun kelahiran: ${data.thn_kelahiran}\n` +
                `➤ Tempat kelahiran: ${data.tmp}\n` +
                `➤ Usia: ${data.usia}\n` +
                '-----\n' +
                `${data.description.trim()}\n` +
                '\n' +
                global.msg.footer
            );
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};