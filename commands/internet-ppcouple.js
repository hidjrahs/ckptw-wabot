const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "ppcouple",
    aliases: ["ppcp"],
    category: "internet",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        try {
            const apiUrl = createAPIUrl("sandipbaruwal", "/dp", {});
            const response = await axios.get(apiUrl);

            const data = await response.data;

            await ctx.reply({
                image: {
                    url: data.male
                },
                mimetype: mime.contentType("png"),
                caption: null
            });
            return await ctx.reply({
                image: {
                    url: data.female
                },
                mimetype: mime.contentType("png"),
                caption: null
            });
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};