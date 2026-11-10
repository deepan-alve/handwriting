"""Static server with a save endpoint. POST /save/<name> writes the body to out/<name>."""
import http.server, os, pathlib

OUT = pathlib.Path(__file__).parent / "out"

class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_POST(self):
        if not self.path.startswith("/save/"):
            self.send_error(404); return
        name = os.path.basename(self.path[6:])
        OUT.mkdir(exist_ok=True)
        data = self.rfile.read(int(self.headers["Content-Length"]))
        (OUT / name).write_bytes(data)
        self.send_response(200); self.end_headers(); self.wfile.write(b"ok")

if __name__ == "__main__":
    http.server.ThreadingHTTPServer(("127.0.0.1", 8765), H).serve_forever()
