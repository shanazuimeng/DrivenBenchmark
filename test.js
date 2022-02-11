const fs = require("fs");
const path = require("path");

let result = fs.readFileSync(path.resolve(__dirname, "CPUList.txt"), { encoding: "utf-8" }).toLowerCase();
let items = result.split(/\r\n/);
// console.log(items);
let CPUTypes = fs.readFileSync(path.resolve(__dirname, "CPUPassMark.csv"), { encoding: "utf-8" }).toLowerCase().replace(/,[0-9]+/g, "").split(/\r\n/);
// console.log(CPUTypes)
CPUTypes.pop();

let cpuTypeList = [];
let X = [];
for (let idx in items) {
    let r = -1
    for (let idx2 in CPUTypes) {
        if (items[idx].length < CPUTypes[idx2])
            continue;
        r = items[idx].search(CPUTypes[idx2].replace(/"/g, "").replace(/\(/g, "\\(").replace(/\)/g, "\\)"));

        if (r > -1) {
            cpuTypeList.push({
                name: items[idx],
                type: CPUTypes[idx2]
            })
            break;
        }
    }
    if (r <= -1) {
        X.push(items[idx]);
    }
}
fs.writeFileSync(path.resolve(__dirname, "output.csv"), (() => {
    let a = "";
    X.map((_) => { a += _ + '\r\n' });
    return a
})(), { encoding: "utf-8" })

// CPUTypes.map((_) => {
//     let a = _.search("8700");
//     if (a > -1) {
//         console.log(_);
//     }
// })