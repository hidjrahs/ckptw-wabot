const {
    chord
} = require('@bochilteam/scraper');
const {
    bold
} = require('@mengkodingan/ckptw');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
    name: 'chord',
    category: 'internet',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(`${bold('[ ! ]')} Masukkan teks!`);

        try {
            const c = await chord(input);
            return ctx.reply(
                `• Judul: ${c.title.replace('Chords', '').trim()} (${c.url})\n` +
                `• Artis: ${c.artist.replace('‣', '').trim()} (${c.artistUrl})\n` +
                `• Akord:\n` +
                `${c.chord}`
            );
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};