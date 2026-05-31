#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <chrono>

/**
 * LEON High-Performance Search Engine Core
 * Intended to be compiled to WebAssembly (WASM) for lightning-fast client-side fuzzy searching,
 * or run as a standalone binary for massive backend documentation parsing.
 */

struct DistroDoc {
    std::string id;
    std::string name;
    std::string tags;
    std::string content;
};

class LeonSearchEngine {
private:
    std::vector<DistroDoc> database;

public:
    void addDocument(const std::string& id, const std::string& name, const std::string& tags, const std::string& content) {
        database.push_back({id, name, tags, content});
    }

    std::vector<std::string> search(const std::string& query) {
        std::vector<std::string> results;
        std::string q = query;
        std::transform(q.begin(), q.end(), q.begin(), ::tolower);

        for (const auto& doc : database) {
            std::string n = doc.name;
            std::string t = doc.tags;
            std::transform(n.begin(), n.end(), n.begin(), ::tolower);
            std::transform(t.begin(), t.end(), t.begin(), ::tolower);

            if (n.find(q) != std::string::npos || t.find(q) != std::string::npos) {
                results.push_back(doc.id);
            }
        }
        return results;
    }
};

int main() {
    LeonSearchEngine engine;
    
    // Simulate loading data
    engine.addDocument("arch", "Arch Linux", "rolling diy minimalist", "Kendin yap felsefesi...");
    engine.addDocument("ubuntu", "Ubuntu", "beginner cloud lts", "Dünyanın en popüler dağıtımı...");
    engine.addDocument("kali", "Kali Linux", "pentest security", "Siber güvenlik platformu...");

    std::cout << "[LEON C++ CORE] Engine initialized. Awaiting WebAssembly bindings..." << std::endl;
    
    // Quick test
    auto start = std::chrono::high_resolution_clock::now();
    std::vector<std::string> res = engine.search("security");
    auto end = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double, std::milli> ms = end - start;

    std::cout << "[LEON C++ CORE] Search completed in " << ms.count() << " ms." << std::endl;
    return 0;
}
