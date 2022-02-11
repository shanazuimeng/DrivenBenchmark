const Request = require('request');
const cheerio = require('cheerio');
const fs = require("fs");
const path = require("path");

const CPUTarget = [
    { url: 'https://www.cpubenchmark.net/high_end_cpus.html' },
    { url: 'https://www.cpubenchmark.net/mid_range_cpus.html' },
    { url: 'https://www.cpubenchmark.net/midlow_range_cpus.html' },
    { url: 'https://www.cpubenchmark.net/low_end_cpus.html' },
];

const GPUTarget = [
    { url: 'https://www.videocardbenchmark.net/high_end_gpus.html' },
    { url: 'https://www.videocardbenchmark.net/mid_range_gpus.html' },
    { url: 'https://www.videocardbenchmark.net/midlow_range_gpus.html' },
    { url: 'https://www.videocardbenchmark.net/low_end_gpus.html' },
]


const REMOVE = [
    /HAMMERHEAD.*/,
    /AMD /,
    /Intel /,
    /Intel/,
    /CPU /,
    /@.*/,
    /Dual-Core/,
    /Triple-Core/,
    /Quad-Core/,
    /Core /,
    /APU/,
    /\(R\) /,

    /Athlon/,
    /Phenom /,

    // /GeForce /,
    /Radeon /,
    /NVDIA /,
    /ATI /,
    // /GTX /,
    // /RTX /,
    // /Quadro /,

    // /Celeron/,
    // /^[0-9]\.[0-9]+GHz/
]

const REPLACE = [
    { s: "FX", n: "FX(tm)" },
    { s: "Xeon", n: "Xeon(R) CPU" },
    { s: "Pentium", n: "Pentium(R) CPU" },
    { s: "Celeron", n: "Celeron(R) CPU" }
]


function DownloadBenchmark(url, cache, option) {
    return new Promise((resolve, reject) => {
        Request({
            proxy: 'http://127.0.0.1:10809',
            method: "GET",
            url: url
        }, function optionalCallback(err, httpResponse, body) {
            if (err) {
                return console.error('upload failed:', err);
            }
            $ = cheerio.load(body);
            let cpuName = $('.prdname');
            let cpuCount = $('.count');
            let mark = $('.mark-neww');
            let index = 0;
            if (mark[0].parent.children[0].name == 'span') {
                index = 0;
            } else {
                index = 1;
            }

            for (let i = 0; i < mark.length; i++) {
                let origin = mark[i].parent.children[index].children[0].data;

                for (let idx in REMOVE) {
                    origin = origin.replace(REMOVE[idx], "");
                }
                for (let idx in REPLACE) {
                    origin = origin.replace(REPLACE[idx].s, REPLACE[idx].n);
                }


                cache.push({
                        name: origin,
                        count: (mark[i].children[0].data).replace(',', '')
                    })
                    // return
            }

            // console.log(cache);

            return resolve(true);
        });
    })
}


async function total(Targets, FileName, cache) {
    if (cache == undefined) {
        cache = [];
    }
    for (let i in Targets) {
        await DownloadBenchmark(Targets[i].url, cache);
    }
    let context = "";
    for (let i = 0; i < cache.length; i++) {
        context += '\"' + cache[i].name + '\",' + cache[i].count + '\r\n'
    }

    fs.writeFile(path.resolve(__dirname, FileName + ".csv"), context, "utf-8", () => {});
}

// total(CPUTarget, 'CPUPassMark');
total(CPUTarget, 'CPUPassMark');
total(GPUTarget, 'GPUPassMark');