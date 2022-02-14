const fs = require("fs");
const path = require("path");

function check(name, datafile, typefile, output) {
    let result = fs.readFileSync(datafile, { encoding: "utf-8" }).toLowerCase().split(/\r\n/);
    let items = [];

    for (let idx in result) {
        items.push({
            name: result[idx].split(",")[0],
            count: isNaN(Number.parseInt(result[idx].split(",")[1])) ? 0 : Number.parseInt(result[idx].split(",")[1])
        })
    }

    let Types = fs.readFileSync(typefile, { encoding: "utf-8" }).toLowerCase().replace(/,[0-9]+/g, "").split(/\r\n/);
    Types.pop();

    let total = 0;
    let cpuTypeList = [];
    let X = [];
    for (let idx in items) {
        let r = -1
        if (isNaN(items[idx].count)) {
            console.log(items[idx])
        }
        total += isNaN(items[idx].count) ? 0 : items[idx].count;
        for (let idx2 in Types) {
            if (items[idx].name.length < Types[idx2])
                continue;
            r = items[idx].name.search(Types[idx2].replace(/"/g, "").replace(/\(/g, "\\(").replace(/\)/g, "\\)"));

            if (r > -1) {
                cpuTypeList.push({
                    name: items[idx].name,
                    type: Types[idx2]
                })
                break;
            }
        }
        if (r <= -1) {
            X.push(items[idx]);
        }
    }

    let Xtotal = 0;
    fs.writeFileSync(output, (() => {
        let a = "";
        X.map((_) => {
            a += (_.name + "," + _.count.toString() + '\r\n');
            Xtotal += isNaN(_.count) ? 0 : _.count;
        });
        return a
    })(), { encoding: "utf-8" })


    console.log(name + "Type    " + "Pass Type rate: " + cpuTypeList.length / items.length, "Pass rate :" + (1 - (Xtotal / total)))
}


check(
    "CPU",
    path.resolve(__dirname, "gpulog.csv"),
    path.resolve(__dirname, "GPUPassMark.csv"),
    path.resolve(__dirname, "VGAoutput.csv")
);

check(
    "VGA",
    path.resolve(__dirname, "cpulog.csv"),
    path.resolve(__dirname, "CPUPassMark.csv"),
    path.resolve(__dirname, "CPUoutput.csv")
);