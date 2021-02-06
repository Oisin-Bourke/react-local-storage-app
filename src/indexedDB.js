let db;

export function conn() {
    //window.addEventListener('load', () => {
        let request = window.indexedDB.open('notes_db', 1);
    
        request.onerror = () => {
            console.log('IndexedDB failed to open');
        };
    
        request.onsuccess = () => {
            console.log('IndexedDb opened successfully');
            db = request.result;
        };
    
        // Setup the database tables if this has not already been done
        request.onupgradeneeded = e => {
            // Get a reference to opened database
            let db = e.target.result;
            // Create an objectStore to store our notes - structure/table with auto-increment key
            let objectStore = db.createObjectStore('notes_os', { keyPath: 'id', autoIncrement: true })
            // Create the 'indexes' (fields)
            objectStore.createIndex('title', 'title', { unique: false });
            objectStore.createIndex('body', 'body', { unique: false });
            objectStore.createIndex('date', 'date', { unique: false });
    
            console.log('IndexedDB set-up complete');
        };
    
    //});
    return db;
};