console.log("Starting test script...");
try {
    console.log("Importing vite...");
    import('vite').then(() => {
        console.log("Vite imported successfully!");
    }).catch((e) => {
        console.error("Failed to import vite:", e);
    });
} catch (e) {
    console.error("Synchronous error:", e);
}
console.log("Test script finished synchronous execution.");
