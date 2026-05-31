import sys
import json
from http.server import HTTPServer, SimpleHTTPRequestHandler

class LEONServer(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS for frontend flexibility
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_GET(self):
        # Custom routing if we want to serve data as API later
        if self.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            response = {"status": "LEON Backend is running optimally."}
            self.wfile.write(json.dumps(response).encode())
            return
            
        if self.path == '/api/distros':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            try:
                with open('backend/distros.json', 'r', encoding='utf-8') as f:
                    data = f.read()
                self.wfile.write(data.encode('utf-8'))
            except Exception as e:
                self.wfile.write(json.dumps({"error": str(e)}).encode())
            return
            
        return super().do_GET()

def run(port=8080):
    server_address = ('', port)
    httpd = HTTPServer(server_address, LEONServer)
    print(f"🚀 LEON Documentation Backend Server running on port {port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down backend...")
        sys.exit(0)

if __name__ == '__main__':
    run()
