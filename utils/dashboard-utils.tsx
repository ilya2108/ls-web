export const validateInput = (inputValue: string) => {
    const predicates = inputValue.toLowerCase().trim().split('and');

    const res = ["","","","","",""]

    predicates.map((predicate) => {
        const pred = predicate.trim().split(' ');
        if (pred.length !== 3) {
            res[0] = 'x';
            return
        }

        if (pred[0] === 'score' && (pred[1] === '<' || pred[1] === '>') && !isNaN(Number(pred[2]))){
            res[pred[1] === '>' ? 0 : 1] = pred[2];
        }
        else if (pred[0] === 'percentile' && (pred[1] === '<' || pred[1] === '>') && !isNaN(Number(pred[2]))) {
            res[pred[1] === '>' ? 2 : 3] = pred[2];
        }
        else if (pred[0] === 'week' && (pred[1] === '<' || pred[1] === '>') && !isNaN(Number(pred[2]))) {
            res[pred[1] === '>' ? 4 : 5] = pred[2];
        }
        else {
            res[0] = 'x';
            return;
        }
    })

    return res.includes('x') || res.every((e => e === "")) ? "" : res.join("|");
}

type Settings = {
    "parallel": string,
    "assignment": string,
    "customCommand": any
}

export const createParametersToQuery = (filterSettings: Settings) => {
    const [sgt, slt, pgt, plt, wgt, wlt] = filterSettings.customCommand

    if (filterSettings.assignment !== "")
        return "(assName: " + filterSettings.assignment + ")"
    if (filterSettings.parallel !== "")
        return "(parName: " + filterSettings.parallel + ")"

    const x =
        (sgt === "" ? "" : ("sgt: " + sgt + ", ")) +
        (slt === "" ? "" : ("slt: " + slt + ", ")) +
        (pgt === "" ? "" : ("pgt: " + pgt + ", ")) +
        (plt === "" ? "" : ("plt: " + plt + ", ")) +
        (wgt === "" ? "" : ("wgt: " + wgt + ", ")) +
        (wlt === "" ? "" : ("wlt: " + wlt + ", "))

    return x === "" ? "" : "(" + x.substr(0, x.length - 2) + ")"
}
