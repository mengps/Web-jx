class HistoryDB {
    open = false;
    indexedDB;
    count = 0;
    insertQueue = [];

    constructor() {
        let request = window.indexedDB.open('HistoryDB', 1);
        request.onerror = (event) => {
            console.log('error:', event);
        }
        request.onsuccess= (event) => {
            this.indexedDB = event.target.result;
            this.open = true;
            this.execInsert();
            console.log('success:', this.indexedDB.objectStoreNames);
        }
        request.onupgradeneeded = (event) => {
            this.indexedDB = event.target.result;
            this.createDB();
            this.execInsert();
            console.log('upgradeneeded:', event);
        }
    }

    createDB() {
        if (!this.indexedDB.objectStoreNames.contains('search_history_list')) {
            this.indexedDB.createObjectStore('search_history_list', { keyPath: 'index' });
            this.open = true;
        }
    }

    insertHistory(data) {
        this.count++;
        this.insertQueue.push(data);
        if (this.open) {
            execInsert();
        }
    }

    execInsert() {
        let cur = 0;
        let count = this.insertQueue.length;
        let execNext = () => {
            let data = this.insertQueue[cur];
            console.log(`insert: [${this.count}], data: [${data}]`);
            let request = this.indexedDB.transaction(['search_history_list'], 'readwrite')
                .objectStore('search_history_list')
                .add({ index: this.count, history: data });
            request.onsuccess = () => {
                cur++;
                if (cur !== count) {
                    execNext();
                }
            }
            request.onerror = () => cur++;
        }
        execNext();
    }
};

export { HistoryDB };