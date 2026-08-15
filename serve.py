#!/usr/bin/env python3
"""Dev server for the montebay prototypes.

Python's http.server sends no Cache-Control, only Last-Modified, so browsers
apply heuristic caching and happily serve a stale stylesheet while you are
iterating. This sends no-store on everything so what you see is always what is
on disk.
"""
import http.server, socketserver, sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8899

class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()
    def log_message(self, *args):
        pass

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", PORT), NoCache) as httpd:
    httpd.serve_forever()
