# Probe fuer tools/qualitaet_ratsche.py --selbsttest: bekannte Antwort ruff_s = genau S324 + S602
# (S607 "echo" ist in ruff_s ausgenommen). Die Standardregeln duerfen hier nichts finden (ruff bleibt genau F401).
import hashlib
import subprocess

subprocess.run("echo probe", shell=True, check=False)
print(hashlib.md5(b"probe").hexdigest())
