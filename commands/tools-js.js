const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const {
    spawn
} = require("child_process");

module.exports = {
    name: "js",
    aliases: ["javascript"],
    category: "tools",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ");
        const script = input;

        if (!script) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} console.log("Hello World");`)}`
        );

        try {
            const restricted = ["require", "eval", "Function", "global"];
            for (const w of restricted) {
                if (script.includes(w)) {
                    ctx.reply(`Penggunaan ${w} tidak diperbolehkan dalam kode.`);
                }
            }

            const output = await new Promise((resolve) => {
                const childProcess = spawn("node", ["-e", script]);

                let result = "";

                childProcess.stdout.on("data", (data) => {
                    result += data.toString();
                });

                childProcess.stderr.on("data", (data) => {
                    return ctx.reply(data.toString());
                });

                childProcess.on("close", (code) => {
                    if (code !== 0) {
                        return ctx.reply(`${bold("[ ! ]")} Keluar dari proses dengan kode: ${code}`);
                    } else {
                        resolve(result);
                    }
                });

                setTimeout(() => {
                    childProcess.kill();
                    return ctx.reply(`${bold("[ ! ]")} Kode mencapai batas waktu proses.`);
                }, 10000);
            });

            ctx.reply(output.trim());
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};