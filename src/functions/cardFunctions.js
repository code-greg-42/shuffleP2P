export function getSuit(hashInput) {
    let hash = hashInput.toLowerCase();
    if (['0', '1', '2', '3'].includes(hash[0])) {
        return 0;
    } else if (['4', '5', '6', '7'].includes(hash[0])) {
        return 1;
    } else if (['8', '9', 'a', 'b'].includes(hash[0])) {
        return 2;
    } else {
        return 3;
    }
}

export function getCard(hashInput) {
    let hash = hashInput.slice(1).toLowerCase();
    let hexValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c'];
    for (const char of hash) {
        const index = hexValues.indexOf(char);
        if (index !== -1) {
            return index;
        };
    }

}