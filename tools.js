class Tool {
    static randomColor(min = 0, max = 255) {
        min = Math.max(0, min);
        max = Math.min(255, max);
        let random = () => parseInt(Math.random() * (max - min) + min);
        return 'rgb(' + random() + ',' + random() + ',' + random() + ')';
    }

    static getOffsetLeft(element, end = { endKey : 'tagName', endName : 'BODY' }) {
        let endKey = end.endKey, endName = end.endName;
        let recursion = (element) => {
            if (element !== null && element[endKey] !== endName) {
                return element.offsetLeft + recursion(element.parentNode);
            } else return 0;
        }

        return recursion(element);
    }
};

export { Tool };