export const validateInput = (inputValue: string) => {
    const predicates = inputValue.toLowerCase().trim().split('and');

    const res = ["","","","","",""]

    predicates.map((predicate) => {
        const pred = predicate.trim().split(' ');
        if (pred.length !== 3) return;

        if (pred[0] === 'score' && (pred[1] === '<' || pred[1] === '>') && parseInt(pred[2])){
            res[pred[1] === '>' ? 0 : 1] = pred[2];
        }
        else if (pred[0] === 'percentile' && (pred[1] === '<' || pred[1] === '>') && parseInt(pred[2])) {
            res[pred[1] === '>' ? 2 : 3] = pred[2];
        }
        else if (pred[0] === 'week' && (pred[1] === '<' || pred[1] === '>') && parseInt(pred[2])) {
            res[pred[1] === '>' ? 4 : 5] = pred[2];
        }
        else return;
    })

    return res.every((e => e === "")) ? "" : res.join("|");
}